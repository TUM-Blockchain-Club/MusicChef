// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;


import "@openzeppelin/contracts/governance/Governor.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorSettings.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorCountingSimple.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotes.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotesQuorumFraction.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./musicNFTs.sol";


contract DAO is Governor, GovernorSettings, GovernorCountingSimple, GovernorVotes, GovernorVotesQuorumFraction {
    mapping(address => uint256) private voteLockedBalances;
    mapping(address => uint256) private voteLastLocked;

    mapping(address => uint256) private proposalLockedBalances;
    mapping(address => uint256) private proposalLastLocked;

    mapping(uint256 => address[]) private votersPerProposal;

    MusicToken private _musicTokenContract;

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

    function propose(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        string memory description
    ) public override returns (uint256) {
        require(IERC20(token_).transferFrom(msg.sender, address(this), 5e18), "Token transfer failed");

        // Store the locked amount for the proposer
        proposalLockedBalances[msg.sender] += 5e18;
        proposalLastLocked[msg.sender] = block.number;


        return super.propose(targets, values, calldatas, description);
    }


    function castVote(uint256 proposalId, uint8 support) public override returns (uint256) {
        require(IERC20(token_).transferFrom(msg.sender, address(this), 5e18), "Token transfer failed");
        
        voteLockedBalances[msg.sender] += 5e18;
        voteLastLocked[msg.sender] = block.number;

        // Record the voter's address
        votersPerProposal[proposalId].push(msg.sender);

        // Call the original castVote function
        return super.castVote(proposalId, support);
    }

    function withdrawVoteLocked() public {
        uint256 lockedAmount = voteLockedBalances[msg.sender];
        require(lockedAmount > 0, "No tokens to withdraw");

        // Check if at least a week has passed
        uint256 lockDuration = block.number - voteLastLocked[msg.sender];
        // Approximate number of blocks in a week
        require(lockDuration >= 50400, "Tokens are still locked");

        // Transfer the locked tokens back to the user
        require(IERC20(token_).transfer(msg.sender, lockedAmount), "Token transfer failed");
        // Reset locked balance and last locked block
        voteLockedBalances[msg.sender] = 0;
        voteLastLocked[msg.sender] = 0;
    }

    function withdrawProposalLocked() public {
        uint256 lockedAmount = proposalLockedBalances[msg.sender];
        require(lockedAmount > 0, "No tokens to withdraw");

        // Check if at least a week has passed
        uint256 lockDuration = block.number - proposalLastLocked[msg.sender];
        // Approximate number of blocks in a week
        require(lockDuration >= 50400, "Tokens are still locked");

        // Transfer the locked tokens back to the user
        require(IERC20(token_).transfer(msg.sender, lockedAmount), "Token transfer failed");
        // Reset locked balance and last locked block
        proposalLockedBalances[msg.sender] = 0;
        proposalLastLocked[msg.sender] = 0;
    }

    function createMusicToken(uint256 proposalId, string memory tokenURI) public {
        require(state(proposalId) == ProposalState.Succeeded, "Proposal not successful");

        // Mint a new music token
        uint256 tokenId = _musicTokenContract.createToken(tokenURI);

        // Define ownership percentages
        uint256 totalSupply = 1000000e18; // Represents 100%
        uint256 creatorShare = (totalSupply * 75) / 100;
        uint256 voterShare = (totalSupply * 20) / 100;
        uint256 daoShare = totalSupply - creatorShare - voterShare;

        // Distribute the shares
        address proposalCreator = proposalProposer(proposalId);/* Retrieve the proposal creator address */
        _musicTokenContract.mint(proposalCreator, tokenId, creatorShare, "");
        _musicTokenContract.mint(address(this), tokenId, daoShare, "");

        // Distribute to voters (simplified; needs to be adjusted based on actual logic)
        address[] memory voters = getVotersForProposal(proposalId);
        for (uint i = 0; i < voters.length; i++) {
            _musicTokenContract.mint(voters[i], tokenId, voterShare / voters.length, "");
        }
    }


    function getVotersForProposal(uint256 proposalId) public view returns (address[] memory) {
        return votersPerProposal[proposalId];
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
