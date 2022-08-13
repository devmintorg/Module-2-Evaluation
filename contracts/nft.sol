// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract SpecialSchnab is ERC721, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    IERC20 token;

    constructor(IERC20 _token) ERC721("SpecialSchnab", "SSCH") {
        token = _token;
    }

    function safeMint(address to) public onlyOwner {
        require(token.balanceOf(to) >= 1, "Receiver doesn't own SCH");
        _safeMint(to, _tokenIdCounter.current());
        _tokenIdCounter.increment();
    }

    function transferFrom(address from, address to, uint256 tokenId) public override(ERC721) {
        require(token.balanceOf(to) >= 1, "Receiver doesn't own SCH");
        ERC721.transferFrom(from, to, tokenId);
    }
}
