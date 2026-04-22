// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleDAO {
    struct Proposal {
        uint256 id;
        string description;
        uint256 voteCount;
        uint256 deadline;
        bool executed;
        uint256 yesVotes;
        uint256 noVotes;
    }

    address public owner;
    uint256 public proposalCount;
    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => mapping(address => bool)) public hasVoted;
    
    uint256 public constant MIN_VOTING_PERIOD = 1 days;

    event ProposalCreated(uint256 id, string description, uint256 deadline);
    event Voted(uint256 proposalId, address voter, bool support, uint256 currentTotal);
    event ProposalExecuted(uint256 id);

    constructor() {
        owner = msg.sender;
    }

    function createProposal(string memory _description, uint256 _durationInSeconds) public {
        require(_durationInSeconds >= MIN_VOTING_PERIOD, "Duration too short");
        
        proposalCount++;
        proposals[proposalCount] = Proposal({
            id: proposalCount,
            description: _description,
            voteCount: 0,
            deadline: block.timestamp + _durationInSeconds,
            executed: false,
            yesVotes: 0,
            noVotes: 0
        });

        emit ProposalCreated(proposalCount, _description, block.timestamp + _durationInSeconds);
    }

    function vote(uint256 _proposalId, bool _support) public {
        Proposal storage p = proposals[_proposalId];
        
        require(block.timestamp < p.deadline, "Voting has ended");
        require(!hasVoted[_proposalId][msg.sender], "Already voted");

        if (_support) {
            p.yesVotes++;
        } else {
            p.noVotes++;
        }
        
        p.voteCount++;
        hasVoted[_proposalId][msg.sender] = true;

        emit Voted(_proposalId, msg.sender, _support, p.voteCount);
    }

    function executeProposal(uint256 _proposalId) public {
        Proposal storage p = proposals[_proposalId];
        
        require(block.timestamp >= p.deadline, "Voting still active");
        require(!p.executed, "Already executed");
        require(p.yesVotes > p.noVotes, "Proposal did not pass");

        p.executed = true;
        
        emit ProposalExecuted(_proposalId);
    }

    function isPassed(uint256 _proposalId) public view returns (bool) {
        Proposal storage p = proposals[_proposalId];
        return p.yesVotes > p.noVotes;
    }
}
