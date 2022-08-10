// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

abstract contract FaucetDetails {
    mapping (address => uint256) numberOfTimesAddressHasUsedFaucet;
    mapping(address => uint256) totalNumberOfTokensUserHasPulled;

    function getNumberOfTokensPulledForAddress(address addy) public view returns (uint256) {
        return totalNumberOfTokensUserHasPulled[addy];
    }

    function getNumberOfTimesAddressHasUsedFaucet(address addy) public view returns (uint256) {
        return numberOfTimesAddressHasUsedFaucet[addy];
    }

    function getNumberOfTokensIHavePulled() public view returns (uint256) {
        return totalNumberOfTokensUserHasPulled[msg.sender];
    }

    function getNumberOfTimesIHaveUsedFaucet() public view returns (uint256) {
        return numberOfTimesAddressHasUsedFaucet[msg.sender];
    }
}