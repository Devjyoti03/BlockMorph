pragma solidity ^0.8.0;

contract VotingSystem {
    struct Proposal {
        string description;
        uint256 voteCount;
        bool isActive;
    }

    mapping(uint256 => Proposal) public proposals;
    uint256 public proposalCount;

    address[] public voters;

    mapping(address => bool) public hasVoted;

    constructor() {}

    function createProposal(string memory _description) public {
        require(msg.sender == address(this), "Only the contract can create proposals");
        proposals[proposalCount] = Proposal(_description, 0, true);
        proposalCount++;
    }

    function vote(uint256 _proposalId) public {
        require(hasVoted[msg.sender] == false, "You have already voted");
        require(proposals[_proposalId].isActive == true, "Proposal is inactive");
        proposals[_proposalId].voteCount++;
        hasVoted[msg.sender] = true;
        voters.push(msg.sender);
    }

    function endProposal(uint256 _proposalId) public {
        require(msg.sender == address(this), "Only the contract can end proposals");
        proposals[_proposalId].isActive = false;
    }

    function getProposal(uint256 _proposalId) public view returns (Proposal memory) {
        return proposals[_proposalId];
    }
}
