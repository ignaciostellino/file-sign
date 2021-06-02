const { ethers, upgrades } = require("hardhat");

async function main() {
  const Signer = await ethers.getContractFactory("Signer");
  const signer = await Signer.deploy("Owner");
  console.log("signer deployed to:", signer.address);  
}

main();