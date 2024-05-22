// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ERC721Token is ERC721URIStorage, Ownable(msg.sender) {
    uint256 public nextTokenId;

    constructor() ERC721("NFTToken", "NFT") {}

    function mint(address to, string memory tokenURI) external onlyOwner {
        _mint(to, nextTokenId);
        _setTokenURI(nextTokenId, tokenURI);
        nextTokenId++;
    }
}
