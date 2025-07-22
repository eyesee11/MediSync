const hre = require("hardhat");

async function main() {
  console.log("Deploying PatientDataConsent contract...");

  // Get the contract factory
  const PatientDataConsent = await hre.ethers.getContractFactory(
    "PatientDataConsent"
  );

  // Deploy the contract
  const contract = await PatientDataConsent.deploy();

  // Wait for the contract to be deployed
  await contract.waitForDeployment();

  const contractAddress = await contract.getAddress();

  console.log("PatientDataConsent deployed to:", contractAddress);
  console.log("Owner address:", await contract.owner());

  // Save deployment info
  const deploymentInfo = {
    contractAddress: contractAddress,
    network: hre.network.name,
    deployedAt: new Date().toISOString(),
    blockNumber: await hre.ethers.provider.getBlockNumber(),
  };

  console.log("Deployment Info:", deploymentInfo);

  return contractAddress;
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
