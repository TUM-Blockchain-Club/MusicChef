// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/governance/Governor.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorSettings.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorCountingSimple.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotes.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotesQuorumFraction.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";




contract DAO is Governor, GovernorSettings, GovernorCountingSimple, GovernorVotes, GovernorVotesQuorumFraction {
    mapping(address => uint256) private _lockedBalances;
    mapping(address => uint256) private _lastLocked;
    address public token_;
    
    constructor(IVotes _token)
        Governor("DAO")
        GovernorSettings(0 /* 0 day */, 50400 /* 1 week */, 0)
        GovernorVotes(_token)
        GovernorVotesQuorumFraction(0)
    {
        token_ = address(_token);
    }

    // There needs to be minimum 100 upvotes for a proposal to be accepted --> Music NFT gets created

    function quorum(uint256 blockNumber) public pure override(Governor, GovernorVotesQuorumFraction) returns (uint256) {
        return 100e18;
    }

    // Deposit tokens for voting
    function depositTokensForVoting(uint256 amount) public {
        require(IERC20(token_).transferFrom(msg.sender, address(this), amount), "Token transfer failed");
        _lockedBalances[msg.sender] += amount;
    }

    // Withdraw tokens after voting
    function withdrawTokensAfterVoting() public {
        require(_lockedBalances[msg.sender] > 0, "No tokens to withdraw");
        uint256 amount = _lockedBalances[msg.sender];
        _lockedBalances[msg.sender] = 0;

        require(IERC20(token_).transfer(msg.sender, amount), "Token transfer failed");
    }

    function castVote(uint256 proposalId, uint8 support) public override returns (uint256) {
        require(IERC20(token_).transferFrom(msg.sender, address(this), 5e18), "Token transfer failed");
        _lockedBalances[msg.sender] += 5e18;
        _lastLocked[msg.sender] = block.number;

        // Call the original castVote function
        return super.castVote(proposalId, support);
    }

    function withdraw() public {
        uint256 lockedAmount = _lockedBalances[msg.sender];
        require(lockedAmount > 0, "No tokens to withdraw");

        // Check if at least a week has passed
        uint256 lockDuration = block.number - _lastLocked[msg.sender];
        // Approximate number of blocks in a week
        require(lockDuration >= 50400, "Tokens are still locked");

        // Transfer the locked tokens back to the user
        require(IERC20(token_).transfer(msg.sender, lockedAmount), "Token transfer failed");
        // Reset locked balance and last locked block
        _lockedBalances[msg.sender] = 0;
        _lastLocked[msg.sender] = 0;
    }


    // The following functions are overrides required by Solidity.

    function votingDelay()
        public
        view
        override(Governor, GovernorSettings)
        returns (uint256)
    {
        return super.votingDelay();
    }

    function votingPeriod()
        public
        view
        override(Governor, GovernorSettings)
        returns (uint256)
    {
        return super.votingPeriod();
    }

    function state(uint256 proposalId)
        public
        view
        override(Governor)
        returns (ProposalState)
    {
        return super.state(proposalId);
    }

    function proposalNeedsQueuing(uint256 proposalId)
        public
        view
        override(Governor)
        returns (bool)
    {
        return super.proposalNeedsQueuing(proposalId);
    }

    function proposalThreshold()
        public
        view
        override(Governor, GovernorSettings)
        returns (uint256)
    {
        return super.proposalThreshold();
    }

    function _queueOperations(uint256 proposalId, address[] memory targets, uint256[] memory values, bytes[] memory calldatas, bytes32 descriptionHash)
        internal
        override(Governor)
        returns (uint48)
    {
        return super._queueOperations(proposalId, targets, values, calldatas, descriptionHash);
    }

    function _executeOperations(uint256 proposalId, address[] memory targets, uint256[] memory values, bytes[] memory calldatas, bytes32 descriptionHash)
        internal
        override(Governor)
    {
        super._executeOperations(proposalId, targets, values, calldatas, descriptionHash);
    }

    function _cancel(address[] memory targets, uint256[] memory values, bytes[] memory calldatas, bytes32 descriptionHash)
        internal
        override(Governor)
        returns (uint256)
    {
        return super._cancel(targets, values, calldatas, descriptionHash);
    }

    function _executor()
        internal
        view
        override(Governor)
        returns (address)
    {
        return super._executor();
    }
}
