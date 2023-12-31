// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  
  const MyToken = await hre.ethers.deployContract("MyToken", [unlockTime], {
    value: lockedAmount,
  });

  const MyToken = await hre.ethers.getContractFactory("MyToken");
  const token = await MyToken.deploy(10000000, 20);
  await token.deployed();
  console.log(`Token deployed to: ${MyToken.address}`);

  // Deploy DAO contract
  const Dao = await hre.ethers.getContractFactory("Dao");
  const dao = await Dao.deploy(/* constructor arguments if any */);
  await dao.deployed();
  console.log(`DAO deployed to: ${dao.address}`);
}

// Handle errors and execute the script
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
