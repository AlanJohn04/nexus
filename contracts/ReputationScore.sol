// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ReputationScore is ERC721, Ownable {
    mapping(address => uint256) private _scores;
    mapping(address => bool) private _hasToken;
    uint256 private _tokenIdCounter;

    event ScoreUpdated(address indexed user, uint256 newScore);

    constructor() ERC721("Nexus Reputation SBT", "NXS-SBT") Ownable(msg.sender) {}

    // Mint SBT to user (only once per address)
    function mint(address to) external onlyOwner returns (uint256) {
        require(!_hasToken[to], "Address already has a Reputation SBT");
        _tokenIdCounter++;
        uint256 newTokenId = _tokenIdCounter;
        _safeMint(to, newTokenId);
        _hasToken[to] = true;
        _scores[to] = 500; // Starting score
        emit ScoreUpdated(to, 500);
        return newTokenId;
    }

    function getScore(address user) external view returns (uint256) {
        return _scores[user];
    }

    function updateScore(address user, uint256 newScore) external onlyOwner {
        require(newScore <= 1000, "Score cannot exceed 1000");
        _scores[user] = newScore;
        emit ScoreUpdated(user, newScore);
    }

    // Soulbound logic: Disable transfers
    function transferFrom(address from, address to, uint256 tokenId) public override {
        revert("Reputation SBTs are non-transferable (Soulbound)");
    }

    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory data) public override {
        revert("Reputation SBTs are non-transferable (Soulbound)");
    }
}
