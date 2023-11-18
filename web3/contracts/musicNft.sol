// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract MusicNFT is ERC721URIStorage {
    uint256 private _tokenIdCounter;
    uint256 public constant TOTAL_SUPPLY = 1_000_000;

    constructor() ERC721("MusicNFT", "MNFT") {}

    function mintNFTs(address recipient, string memory tokenURI)
        public
    {
        require(_tokenIdCounter < TOTAL_SUPPLY, "Max supply reached");

        for (uint i = 0; i < TOTAL_SUPPLY; i++) {
            _tokenIdCounter += 1;
            uint256 tokenId = _tokenIdCounter;
            _mint(recipient, tokenId);
            _setTokenURI(tokenId, tokenURI);
        }
    }
}
