# Devmint Module 2 Evaluation

## **Scenario 1** - Build A Faucet to Distribute ERC20 Tokens
In this evaluation, it will be up to you to create a new ERC20 token and distribute it to people who wish to be part of your community. This is inspired by the FWEB3 project, as we will be building many of the mechanisms that exist for that project.

### User Stories
An ERC20 token should be created for your new online community. It should have the following properties:
* 18 Decimal Places
* 10,000,000 Tokens
* Full ERC20 functionality
* Ownable
* Mintable
* Has a name and symbol
* The token should be distributed from a faucet that has the following properties:
    * Addresses must be pre-approved to receive tokens from the faucet (whitelisted)
    * Users can pull 10 tokens from the faucet every 24 hours
    * Faucet should not own any of the tokens it sends, instead pulling from Faucet owner's account (Note: Faucet Deployer needs to own enough tokens to supply the faucet)
    * A set of admins should be defined, and only the admins can add/remove people to the whitelist
    * Is ownable, and only the owner are able to add and remove admins
    * If the faucet does not have enough tokens, the transaction should fail
    * Have getters for the following data:
        * See if a user is whitelisted
        * The time a user can pull from the faucet again
        * Being able to see if a user is an admin
    * An event should be emitted when:
        * An admin is added
        * An admin is removed
        * An address is whitelisted
        * An address is removed from the whitelist
    * Tokens are distributed

The faucet should be named faucet.sol and the token should be named token.sol

### Test Cases
As a hardhat script called faucet_test_case.js, please have a test case the shows the following scenarios:

* The token and faucet contracts deploying to the network
* Pre-approving the faucet to distribute tokens from the deployer's wallet
* Adding two admins to the contract
* Adding two users to the contract
* Having users pull from the contract, then waiting 24 hours and pulling from the contract again
* Having a user attempt to pull before 24 hours has passed and fail
* Having a user attempt to add themselves as an administrator and fail
* Having an unapproved user attempt to pull from the contract and fail

### Suggestion
In order to be successful here, you're going to have to plan out in advanced how your contract is going to run and operate. You're going to have to understand how the ERC20 standard operates and use much of your knowledge of creating solidity contracts to date. I would recommend you plan out your readme first and think through what elements you're going to have to interact with in order to make this work. Use your incentive based architecture skills to think through the design of this contract. Plan as follows:

* Start with the README and think through the functions
* Then plan the contract skeleton and think through the functions and state variables
* Write out your test script and see what needs to happen at each step to prove the requirements
* Then start coding the solution
* For the above exercise, just show the happy pathway (users behaving themselves) and don't be overly concerned with testing the unhappy pathways.

## **Scenario 2:** Faucet Details
We want to create an extension to the faucet that allows our token to collect some additional details about our faucet, including:

* How many times a user has used the faucet
* How many tokens that user has pulled in total

Create an optional extension that has the following properties:
* Cannot be run on it's own (needs to be imported to be used)
* Stores additional address data for the user
* Has a function that can tell us how many times the faucet has been used by an address
* Has a function that can tell us how many ERC20 tokens the faucet has distributed to a user

Then, integrate this extension with your faucet and show that it's working as expected.

Name the new faucet details contract faucet_details.sol and the faucet utilizing this extension faucet_including_details.sol.

### Test Cases
As a hardhat script called faucet_with_details_test_case.js, please test cases that show the following scenarios:

* Have all of the previous cases from Scenario 1 pass
* Have a user show their total faucet pulls after pulling from the faucet twice
* Have a user correctly show the total amount they pulled from the contract after pulling from the faucet twice

## **Scenario 3:** Add an ERC721 Token for Token Holders for ERC20 holders (More Challenging)
You now want to create an NFT collection for your token holders. This token should have the following properties:

* Is Ownable and Mintable
* Uses the Counter library for counting
* Only the owner should be able to mint new NFTs
* In order to be transferred these ERC721 tokens, you must hold at least 1 of the ERC20 token (true for mints/transfers)
* Ownable

Name the new NFT contract nft.sol.

### Test Cases
As a hardhat script called nft_test_case.js, please have a test case the shows the following scenarios:

* The deployer can mint tokens to three users who each have ERC20 tokens
* The deployer cannot mint tokens to a user who does not own the ERC20 token
* A user who can successfully transfer the NFT to another user
* A user who fails to send an NFT to a user who does not own the ERC20 token
