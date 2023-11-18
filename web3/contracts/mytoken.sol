
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Capped} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import {ERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import {ERC20Votes} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import {Nonces} from "@openzeppelin/contracts/utils/Nonces.sol";


contract MyToken is ERC20, ERC20Permit, ERC20Votes, ERC20Capped {
    mapping(address => bool) public hasMintedAirdrop;
    uint256 public airdrop;

    constructor(uint256 cap, uint256 _airdrop) ERC20("MusicChef", "MC") ERC20Capped(cap * (10 ** decimals())) ERC20Permit("MusicChef") {
        airdrop = _airdrop;
        // Mint the airdrop for the contract deployer
        _mint(msg.sender, airdrop * (10 ** decimals()));
    }

    // Mint the airdrop for the caller if they haven't already minted it
    function mintAirdrop() external {
        require(!hasMintedAirdrop[msg.sender], "Airdrop already minted for this address");
        
        _mint(msg.sender, airdrop * (10 ** decimals()));
        hasMintedAirdrop[msg.sender] = true;
    }

    // The functions below are overrides required by Solidity.

    function _update(address from, address to, uint256 amount) internal override(ERC20, ERC20Votes, ERC20Capped) {
        super._update(from, to, amount);
    }

    function nonces(address owner) public view virtual override(ERC20Permit, Nonces) returns (uint256) {
        return super.nonces(owner);
    }
}
