// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./Token.sol";

contract TurdNFT is ERC721, ERC721Enumerable, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    IERC20 token;

    modifier onlyTokenHolder(address to) {
        require (token.balanceOf(to) > 0, "Recipient must hold tokens");
        _;
    }

    constructor(IERC20 _token) ERC721("TurdToken", "TURD") {
        token = _token;
    }

    function _baseURI() internal pure override returns (string memory) {
        return "https://google.com";
    }

    function safeMint(address to) external onlyOwner onlyTokenHolder(to) {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
    }

    function transfer(uint256 _tokenId, address to) external onlyTokenHolder(to) {
        require(ERC721(this).ownerOf(_tokenId) == msg.sender, "only owner can transfer NFT!");
        transferFrom(msg.sender, to, _tokenId);
    }
    
    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}