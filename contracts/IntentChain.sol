// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./NexusToken.sol";
import "./ReputationScore.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract IntentChain is Ownable {
    using SafeERC20 for NexusToken;

    NexusToken public nexusToken;
    ReputationScore public reputationScore;

    struct Bet {
        uint256 amount;
        bool supportYes; // true = bet user will complete, false = bet user will fail
        bool claimed;
    }

    struct Intent {
        address creator;
        string description;
        string category;
        uint256 deadline;
        uint256 stakeAmount;
        uint256 sageScore;
        bool resolved;
        bool completed;
        uint256 totalYesStakes;
        uint256 totalNoStakes;
        string proofLink;
        bool hasProof;
    }

    uint256 public intentCount;
    mapping(uint256 => Intent) public intents;
    mapping(uint256 => mapping(address => Bet)) public bets;
    mapping(uint256 => address[]) public voters;

    event IntentPublished(uint256 indexed intentId, address indexed creator, string description, uint256 stakeAmount);
    event StakePlaced(uint256 indexed intentId, address indexed voter, bool supportYes, uint256 amount);
    event ProofSubmitted(uint256 indexed intentId, string proofLink);
    event IntentResolved(uint256 indexed intentId, bool completed, uint256 creatorPayout);

    constructor(address _tokenAddress, address _sbtAddress) Ownable(msg.sender) {
        nexusToken = NexusToken(_tokenAddress);
        reputationScore = ReputationScore(_sbtAddress);
    }

    function publishIntent(
        string calldata description,
        string calldata category,
        uint256 deadline,
        uint256 stakeAmount,
        uint256 sageScore
    ) external returns (uint256) {
        require(deadline > block.timestamp, "Deadline must be in the future");
        require(stakeAmount > 0, "Stake amount must be greater than 0");

        nexusToken.safeTransferFrom(msg.sender, address(this), stakeAmount);

        intentCount++;
        intents[intentCount] = Intent({
            creator: msg.sender,
            description: description,
            category: category,
            deadline: deadline,
            stakeAmount: stakeAmount,
            sageScore: sageScore,
            resolved: false,
            completed: false,
            totalYesStakes: 0,
            totalNoStakes: 0,
            proofLink: "",
            hasProof: false
        });

        emit IntentPublished(intentCount, msg.sender, description, stakeAmount);
        return intentCount;
    }

    function submitProof(uint256 intentId, string calldata proofLink) external {
        Intent storage intent = intents[intentId];
        require(msg.sender == intent.creator, "Only creator can submit proof");
        require(!intent.resolved, "Intent already resolved");
        
        intent.proofLink = proofLink;
        intent.hasProof = true;
        
        emit ProofSubmitted(intentId, proofLink);
    }

    function stakeOnIntent(uint256 intentId, bool supportYes, uint256 amount) external {
        Intent storage intent = intents[intentId];
        require(!intent.resolved, "Intent is already resolved");
        require(block.timestamp < intent.deadline, "Deadline has passed");
        require(amount > 0, "Stake amount must be greater than 0");

        nexusToken.safeTransferFrom(msg.sender, address(this), amount);

        Bet storage userBet = bets[intentId][msg.sender];
        if (userBet.amount == 0) {
            voters[intentId].push(msg.sender);
            userBet.supportYes = supportYes;
        } else {
            require(userBet.supportYes == supportYes, "Cannot stake on both sides");
        }

        userBet.amount += amount;

        if (supportYes) {
            intent.totalYesStakes += amount;
        } else {
            intent.totalNoStakes += amount;
        }

        emit StakePlaced(intentId, msg.sender, supportYes, amount);
    }

    function resolveIntent(uint256 intentId) external {
        Intent storage intent = intents[intentId];
        require(!intent.resolved, "Intent is already resolved");
        require(block.timestamp >= intent.deadline, "Deadline has not passed yet");

        intent.resolved = true;
        
        // Majority vote decides completion. If tie or no votes, default to whether they submitted proof.
        bool completed = false;
        if (intent.totalYesStakes > intent.totalNoStakes) {
            completed = true;
        } else if (intent.totalYesStakes == intent.totalNoStakes && intent.hasProof) {
            completed = true;
        }
        
        intent.completed = completed;
        uint256 totalVoterPool = intent.totalYesStakes + intent.totalNoStakes;
        uint256 creatorTotalPayout = 0;

        if (completed) {
            // Creator gets their stake back + 10% of the total voter pool
            uint256 creatorBonus = (totalVoterPool * 10) / 100;
            creatorTotalPayout = intent.stakeAmount + creatorBonus;
            
            nexusToken.safeTransfer(intent.creator, creatorTotalPayout);

            // Update SBT score
            uint256 currentScore = reputationScore.getScore(intent.creator);
            uint256 newScore = currentScore + 20 > 1000 ? 1000 : currentScore + 20;
            reputationScore.updateScore(intent.creator, newScore);

            // Yes-voters split the remaining 90% of the voter pool proportional to their stakes
            uint256 remainingVoterPool = totalVoterPool - creatorBonus;
            address[] memory intentVoters = voters[intentId];
            
            for (uint256 i = 0; i < intentVoters.length; i++) {
                address voter = intentVoters[i];
                Bet storage userBet = bets[intentId][voter];
                
                if (userBet.supportYes && !userBet.claimed) {
                    userBet.claimed = true;
                    uint256 voterPayout = (userBet.amount * remainingVoterPool) / intent.totalYesStakes;
                    nexusToken.safeTransfer(voter, voterPayout);
                }
            }
        } else {
            // FAILED LOGIC (NEW 50% PENALTY)
            
            // 1. Creator gets exactly 50% of their stake back.
            uint256 creatorReturn = intent.stakeAmount / 2;
            uint256 slashedAmount = intent.stakeAmount - creatorReturn;
            
            nexusToken.safeTransfer(intent.creator, creatorReturn);
            creatorTotalPayout = creatorReturn;

            // Deduct creator's SBT score
            uint256 currentScore = reputationScore.getScore(intent.creator);
            uint256 newScore = currentScore >= 30 ? currentScore - 30 : 0;
            reputationScore.updateScore(intent.creator, newScore);

            // 2. Voters get original stakes back. No-voters also split the slashedAmount.
            address[] memory intentVoters = voters[intentId];
            for (uint256 i = 0; i < intentVoters.length; i++) {
                address voter = intentVoters[i];
                Bet storage userBet = bets[intentId][voter];
                
                if (!userBet.claimed) {
                    userBet.claimed = true;
                    uint256 payout = userBet.amount; // Return original bet
                    
                    // If they correctly bet No, they get a proportional share of the creator's slashed 50%
                    if (!userBet.supportYes && intent.totalNoStakes > 0) {
                        uint256 voterBonus = (userBet.amount * slashedAmount) / intent.totalNoStakes;
                        payout += voterBonus;
                    }
                    
                    nexusToken.safeTransfer(voter, payout);
                }
            }
        }

        emit IntentResolved(intentId, completed, creatorTotalPayout);
    }
}
