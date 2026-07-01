import IntentChainArtifact from "../../artifacts/contracts/IntentChain.sol/IntentChain.json";
import NexusTokenArtifact from "../../artifacts/contracts/NexusToken.sol/NexusToken.json";
import ReputationScoreArtifact from "../../artifacts/contracts/ReputationScore.sol/ReputationScore.json";

export const CONTRACT_ADDRESSES = {
  intentChain: "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707",
  nexusToken: "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",
  reputationScore: "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9",
};

export const CONTRACT_ABIS = {
  intentChain: IntentChainArtifact.abi,
  nexusToken: NexusTokenArtifact.abi,
  reputationScore: ReputationScoreArtifact.abi,
};
