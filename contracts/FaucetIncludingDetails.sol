// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "./FaucetDetails.sol";

contract FaucetIncludingDetails is Ownable, FaucetDetails {
    mapping(address => uint) public whitelistedAddressesAndLockTime;
    address[] adminList;
    IERC20 token;
    
    event AdminAdded(address newAdmin);
    event AdminRemoved(address removedAdmin);
    event AddressWhitelisted(address whitelistedAddress);
    event AddressRemovedFromWhitelist(address removedAddress);
    event TokensDistributed(address recipient, uint256 numberOfTokens);

    modifier onlyAdmin(address _addr) {
        bool addressIsAdmin = false;
        for(uint i = 0; i < adminList.length; i++) {
            if(adminList[i] == _addr) addressIsAdmin = true;
        }
        require(addressIsAdmin, "msg.sender is not an admin");
        _;
    }

    modifier onlyWhitelisted(address _addr) {
        require(whitelistedAddressesAndLockTime[_addr] > 0, "address is not in whitelist");
        _;
    }

    constructor(IERC20 _token, address[] memory admins) {
        token = _token;
        adminList.push(msg.sender);
        for(uint i = 0; i < admins.length; i++) {
            adminList.push(admins[i]);
        }
    }

    function addAdmin(address addy) public onlyOwner {
        adminList.push(addy);
        emit AdminAdded(addy);
    }

    function removeAdmin(address addy) public onlyOwner {
        for(uint i = 0; i < adminList.length; i++) {
            if(adminList[i] == addy) delete adminList[i];
        }
        emit AdminRemoved(addy);
    }

    function requestTokens() public onlyWhitelisted(msg.sender) {
        numberOfTimesAddressHasUsedFaucet[msg.sender] += 1;
        require(block.timestamp >= whitelistedAddressesAndLockTime[msg.sender], "lock time has not expired");
        token.transfer(msg.sender, 10);
        whitelistedAddressesAndLockTime[msg.sender] = block.timestamp + 24 hours;
        totalNumberOfTokensUserHasPulled[msg.sender] += 10;
        emit TokensDistributed(msg.sender, 10);
    }

    function addToWhitelist(address addy) public onlyAdmin(msg.sender) {
        whitelistedAddressesAndLockTime[addy] = block.timestamp;
        emit AddressWhitelisted(addy);
    }

    function removeFromWhitelist(address addy) public onlyAdmin(msg.sender) {
        whitelistedAddressesAndLockTime[addy] = 0;
        emit AddressRemovedFromWhitelist(addy);
    }

    function checkWhitelistStatus(address addy) public view returns(bool) {
        return whitelistedAddressesAndLockTime[addy] != 0;
    }

    function checkLockTime() public view returns(uint256, uint256) {
        return (block.timestamp, whitelistedAddressesAndLockTime[msg.sender]);
    }

    function isAdmin(address addy) public view returns(bool) {
        for(uint i = 0; i < adminList.length; i++) {
            if (adminList[i] == addy) return true;
        }
        return false;
    }

    function checkNextFaucetTime(address addy) public view returns(uint256) {
        return whitelistedAddressesAndLockTime[addy];
    }
}