// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const { expect } = require("chai");

async function main() {
  const [deployer, addr1, addr2, addr3, addr4, addr5, ...addrs] = await ethers.getSigners();

  // The token and faucet contracts deploying to the network
  // Pre-approving the faucet to distribute tokens from the deployer's wallet
  // Adding two admins to the contract
  // Adding two users to the contract
  // Having users pull from the contract, then waiting 24 hours and pulling from the contract again
  // Having a user attempt to pull before 24 hours has passed and fail
  // Having a user attempt to add themselves as an administrator and fail
  // Having an unapproved user attempt to pull from the contract and fail
  const Token = await hre.ethers.getContractFactory("PoopToken");
  const token = await Token.deploy();

  console.log(`Token deployed to ${token.address}`);

  const NFT = await hre.ethers.getContractFactory("TurdNFT");
  const nft = await NFT.deploy(token.address);
  console.log(`NFT deployed to ${nft.address}`);

  const someTokens = hre.ethers.utils.parseEther("10");
  await token.connect(deployer).transfer(addr1.address, someTokens);

  await nft.connect(deployer).safeMint(addr1.address);
  console.log("Addr1 now has TurdToken#0!")
  await expect(nft.connect(deployer).safeMint(addr2.address))
    .to.be.revertedWith("Recipient must hold tokens");
  console.log("Addr2 cannot receive an NFT since they're not a token holder");

  await token.connect(deployer).transfer(addr2.address, someTokens);
  console.log("Addr2 has been given some tokens");
  await nft.connect(deployer).safeMint(addr2.address);
  console.log("Addr2 now has TurdToken#1!");

  await expect(nft.connect(addr2).transfer(1, addr3.address))
    .to.be.revertedWith("Recipient must hold tokens");
  console.log("Addr3 cannot receive an NFT since they're not a token holder");

  await nft.connect(addr2).transfer(1, addr1.address);
  console.log("However, Addr1 CAN receive an NFT since they're a token holder");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
