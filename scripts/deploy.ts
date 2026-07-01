import pkg from "hardhat";
const { ethers } = pkg;
import * as fs from 'fs';
import * as path from 'path';

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // 1. Deploy NexusToken
  const NexusToken = await ethers.getContractFactory("NexusToken");
  const token = await NexusToken.deploy();
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  console.log("NexusToken deployed to:", tokenAddress);

  // 2. Deploy ReputationScore SBT
  const ReputationScore = await ethers.getContractFactory("ReputationScore");
  const sbt = await ReputationScore.deploy();
  await sbt.waitForDeployment();
  const sbtAddress = await sbt.getAddress();
  console.log("ReputationScore SBT deployed to:", sbtAddress);

  // 3. Deploy IntentChain
  const IntentChain = await ethers.getContractFactory("IntentChain");
  const intentChain = await IntentChain.deploy(tokenAddress, sbtAddress);
  await intentChain.waitForDeployment();
  const intentChainAddress = await intentChain.getAddress();
  console.log("IntentChain deployed to:", intentChainAddress);

  // 4. Transfer ownership of Token & SBT to IntentChain for minting/burning
  await token.transferOwnership(intentChainAddress);
  console.log("Transferred NexusToken ownership to IntentChain");
  
  await sbt.transferOwnership(intentChainAddress);
  console.log("Transferred ReputationScore ownership to IntentChain");

  const contractsFilePath = path.join(process.cwd(), "src", "lib", "contracts.ts");
  const contractsContent = `import IntentChainArtifact from "../../artifacts/contracts/IntentChain.sol/IntentChain.json";
import NexusTokenArtifact from "../../artifacts/contracts/NexusToken.sol/NexusToken.json";
import ReputationScoreArtifact from "../../artifacts/contracts/ReputationScore.sol/ReputationScore.json";

export const CONTRACT_ADDRESSES = {
  intentChain: "${intentChainAddress}",
  nexusToken: "${tokenAddress}",
  reputationScore: "${sbtAddress}",
};

export const CONTRACT_ABIS = {
  intentChain: IntentChainArtifact.abi,
  nexusToken: NexusTokenArtifact.abi,
  reputationScore: ReputationScoreArtifact.abi,
};
`;
  fs.writeFileSync(contractsFilePath, contractsContent);
  console.log("Updated src/lib/contracts.ts with new addresses");

  console.log("Deployment complete!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
