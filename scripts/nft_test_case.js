// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const { expect } = require("chai");

async function main() {
  const [deployer, addr1, addr2, addr3, addr4, addr5, addr6] =
    await hre.ethers.getSigners();

  const Token = await hre.ethers.getContractFactory("Token");
  const token = await Token.deploy();

  await token.deployed();

  console.log("Token deployed to:", token.address);

  const Faucet = await hre.ethers.getContractFactory("Faucet");
  const faucet = await Faucet.deploy(token.address);

  await faucet.deployed();

  console.log("Faucet deployed to:", faucet.address);

  const SpecialSchnab = await hre.ethers.getContractFactory("SpecialSchnab");
  const specialSchnab = await SpecialSchnab.deploy(token.address);

  await specialSchnab.deployed();

  console.log("SpecialSchnab deployed to:", specialSchnab.address);

  await token.approve(faucet.address, hre.ethers.utils.parseEther("10000000"));

  console.log("Faucet approved");

  await faucet.addAdmin(addr1.address);
  await faucet.addAdmin(addr2.address);

  await faucet.connect(addr1).addApprovedUser(addr3.address);
  await faucet.connect(addr2).addApprovedUser(addr4.address);
  await faucet.connect(addr2).addApprovedUser(addr5.address);

  console.log("Admins and users added");

  await faucet.connect(addr3).pullTokens();
  await faucet.connect(addr4).pullTokens();
  await faucet.connect(addr5).pullTokens();

  console.log("Tokens pulled");

  await specialSchnab.safeMint(addr3.address);
  await specialSchnab.safeMint(addr4.address);
  await specialSchnab.safeMint(addr5.address);

  console.log("Tokens minted to appropriate receivers")

  await expect(specialSchnab.safeMint(addr6.address)).to.be.revertedWith("Receiver doesn't own SCH");

  await expect(specialSchnab.connect(addr3).transferFrom(addr3.address, addr6.address, 0)).to.be.revertedWith("Receiver doesn't own SCH");
  
  console.log("Tokens gated from inappropriate receivers")

  await specialSchnab.connect(addr4).transferFrom(addr4.address, addr5.address, 1)

  console.log("Successful Transfer")

  const b5 = await specialSchnab.balanceOf(addr5.address);

  console.log(b5);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
