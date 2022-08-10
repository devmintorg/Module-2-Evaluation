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
  const FaucetIncludingDetails = await hre.ethers.getContractFactory("FaucetIncludingDetails");
  const token = await Token.deploy();

  console.log(`Token deployed to ${token.address}`);

  const adminAddresses = [addr1.address, addr2.address];
  const faucet = await FaucetIncludingDetails.deploy(token.address, adminAddresses);

  console.log(`FaucetIncludingDetails deployed to ${faucet.address}`);

  await token.connect(deployer).transfer(faucet.address, hre.ethers.utils.parseEther("10000000"));

  const isAdmin1 = await faucet.connect(deployer).isAdmin(addr1.address);
  console.log("addr1 is admin: " + isAdmin1);
  const isAdmin2 = await faucet.connect(deployer).isAdmin(addr2.address);
  console.log("addr2 is admin: " + isAdmin2);
  const isAdmin3 = await faucet.connect(deployer).isAdmin(addr3.address);
  console.log("addr3 is admin: " + isAdmin3);

  await faucet.connect(deployer).addToWhitelist(addr3.address);
  await faucet.connect(deployer).addToWhitelist(addr4.address);
  const isWhitelisted3 = await faucet.connect(deployer).checkWhitelistStatus(addr3.address);
  console.log("addr3 is whitelisted: " + isWhitelisted3);
  const isWhitelisted4 = await faucet.connect(deployer).checkWhitelistStatus(addr4.address);
  console.log("addr4 is whitelisted: " + isWhitelisted4);

  await expect(faucet.connect(addr1).requestTokens())
    .to.be.revertedWith("address is not in whitelist");
  console.log("while addr1 is an admin, they're technically not whitelisted lol");
  await faucet.connect(addr3).requestTokens();
  await faucet.connect(addr4).requestTokens();
  console.log("addr3 and addr4 should have each received 10 tokens");
  let numberOfTimesAddr3HasRequestedTokens = await faucet.connect(addr3).getNumberOfTimesAddressHasUsedFaucet(addr3.address);
  let numberOfTokensAddr3HasPulled = await faucet.connect(addr3).getNumberOfTokensPulledForAddress(addr3.address);
  console.log(`addr3 has received ${numberOfTokensAddr3HasPulled} tokens`);
  console.log(`addr3 has attempted to get from the faucet ${numberOfTimesAddr3HasRequestedTokens} times`);
  
  // addr3 shouldn't be able to do admin functions or withdraw before the lock time has expired
  await expect(faucet.connect(addr3).addToWhitelist(addr5.address))
    .to.be.revertedWith("msg.sender is not an admin");
  await expect(faucet.connect(addr3).requestTokens())
    .to.be.revertedWith("lock time has not expired");
  console.log("addr3 cannot request again yet since 24 hours have not passed, and they cannot add someone to the whitelist");
  
  numberOfTimesAddr3HasRequestedTokens = await faucet.connect(addr3).getNumberOfTimesAddressHasUsedFaucet(addr3.address);
  console.log(`addr3 has attempted to get from the faucet ${numberOfTimesAddr3HasRequestedTokens} times`);

  numberOfTokensAddr3 = await faucet.connect(addr3).getNumberOfTokensPulledForAddress(addr3.address);
  console.log(`addr3 has ${numberOfTokensAddr3} tokens`);

  // have a user try to add themselves as admin
  await expect(faucet.connect(addr3).addAdmin(addr3.address))
    .to.be.revertedWith("Ownable: caller is not the owner");
  console.log("addr3 cannot add themselves as admin, only the owner can");

  // adding and removing an admin
  await faucet.connect(deployer).addAdmin(addr3.address);
  console.log("deployer has added addr3 to admin list")
  let isAddr3AdminNow = await faucet.connect(deployer).isAdmin(addr3.address);
  console.log("addr3 is admin: " + isAddr3AdminNow);

  await faucet.connect(deployer).removeAdmin(addr3.address);
  console.log("deployer has removed addr3 from admin list")
  isAddr3AdminNow = await faucet.connect(deployer).isAdmin(addr3.address);
  console.log("addr3 is admin: " + isAddr3AdminNow);

  await expect(faucet.connect(addr5).requestTokens())
    .to.be.revertedWith("address is not in whitelist");
  console.log("addr5 is not allowed to withdraw from faucet");

  /// Forward time 24 hours
  await hre.network.provider.send("evm_increaseTime", [60*60*24]);
  await hre.network.provider.send("evm_mine");
  console.log("24 more hours have passed...")

  await faucet.connect(addr3).requestTokens();
  console.log("addr3 can request again yet since 24 hours have passed");

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
