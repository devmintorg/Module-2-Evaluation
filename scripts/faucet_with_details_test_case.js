// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const { expect } = require("chai");

async function main() {
  const [deployer, addr1, addr2, addr3, addr4] = await hre.ethers.getSigners();

  const Token = await hre.ethers.getContractFactory("Token");
  const token = await Token.deploy();

  await token.deployed();

  console.log("Token deployed to:", token.address);

  const Faucet = await hre.ethers.getContractFactory("Faucet2");
  const faucet = await Faucet.deploy(token.address);

  await faucet.deployed();

  console.log("Faucet deployed to:", faucet.address);

  await token.approve(faucet.address, hre.ethers.utils.parseEther("10000000"));

  console.log("Faucet approved");

  await faucet.addAdmin(addr1.address);
  await faucet.addAdmin(addr2.address);

  await faucet.connect(addr1).addApprovedUser(addr3.address);
  await faucet.connect(addr2).addApprovedUser(addr4.address);

  console.log("Admins and users added");

  await faucet.connect(addr3).pullTokens();
  await faucet.connect(addr4).pullTokens();

  console.log("Tokens pulled");

  await expect(faucet.connect(addr3).pullTokens()).to.be.revertedWith(
    "Not time yet"
  );

  console.log("Repull successfully blocked");

  await hre.network.provider.send("evm_increaseTime", [60 * 60 * 24]);
  await hre.network.provider.send("evm_mine");

  await faucet.connect(addr3).pullTokens();

  console.log("Tokens pulled");

  const tokensPulled = await faucet
    .connect(addr3)
    .getNumTokensPulled(addr3.address);

  const numTimesPulled = await faucet
    .connect(addr3)
    .getNumTimesFaucetUsed(addr3.address);

  expect(tokensPulled).to.equal(20);
  expect(numTimesPulled).to.equal(2);

  console.log("Expected amounts recorded")
  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
