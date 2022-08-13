// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./faucet_details.sol";

contract Faucet2 is FaucetExtension, Ownable {
    IERC20 private token;

    uint256 constant LOCK_TIME_HOURS = 24 hours;
    uint256 constant TOKENS_PER_PULL = 10;

    uint256 currentSupply;

    struct User {
        bool approved;
        bool admin;
        uint256 nextPullTime;
    }

    mapping(address => User) users;

    event AdminAdded(address admin);
    event AdminRemoved(address admin);
    event UserAdded(address admin);
    event UserRemoved(address admin);
    event TokensDistributed(address user);

    modifier enoughTokens() {
        require(
            token.balanceOf(owner()) >= TOKENS_PER_PULL,
            "Not enough tokens left"
        );
        _;
    }

    modifier onlyAdmin() {
        require(users[msg.sender].admin, "Sender not admin");
        _;
    }

    modifier onlyApproved() {
        require(users[msg.sender].approved, "Sender not approved");
        _;
    }

    modifier timeForPull() {
        require(
            block.timestamp >= users[msg.sender].nextPullTime,
            "Not time yet"
        );
        _;
    }

    constructor(IERC20 _token) {
        token = _token;
    }

    function pullTokens() public enoughTokens onlyApproved timeForPull {
        users[msg.sender].nextPullTime = block.timestamp + LOCK_TIME_HOURS;
        token.transferFrom(owner(), payable(msg.sender), 10 * (10**18));
        incrementTokenAmount(10);
        incrementUsage();
    }

    function addApprovedUser(address _user) public onlyAdmin {
        users[_user].approved = true;
        users[_user].nextPullTime = block.timestamp;

        emit UserAdded(_user);
    }

    function removeUser(address _user) public onlyAdmin {
        users[_user].approved = false;

        emit UserRemoved(_user);
    }

    function addAdmin(address _admin) public onlyOwner {
        users[_admin].admin = true;

        emit AdminAdded(_admin);
    }

    function removeAdmin(address _admin) public onlyOwner {
        users[_admin].admin = false;

        emit AdminRemoved(_admin);
    }

    function getUserStatus(address _user) public view returns (bool) {
        return users[_user].approved;
    }

    function getNextPullTime(address _user) public view returns (uint256) {
        return users[_user].nextPullTime;
    }

    function getAdminStatus(address _admin) public view returns (bool) {
        return users[_admin].admin;
    }
}
