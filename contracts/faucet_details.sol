// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./faucet.sol";

abstract contract FaucetExtension {
    mapping(address => uint256) numTimesFaucetUsed;
    mapping(address => uint256) numTokensPulled;

    function incrementUsage() public {
        numTimesFaucetUsed[tx.origin] += 1;
    }

    function incrementTokenAmount(uint256 _amount) public {
        numTokensPulled[tx.origin] += _amount;
    }

    function getNumTimesFaucetUsed(address _user)
        public
        view
        returns (uint256)
    {
        return numTimesFaucetUsed[_user];
    }

    function getNumTokensPulled(address _user) public view returns (uint256) {
        return numTokensPulled[_user];
    }
}
