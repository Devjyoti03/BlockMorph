// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract GitHubNFT {
    struct NFTMetadata {
        string username;
        string bio;
        uint256 contributions;
        uint256 repositories;
        string[] skills;
        string[] projects;
    }

    mapping(uint256 => NFTMetadata) public nftMetadata;
    mapping(address => uint256[]) public userNFTs;
    mapping(uint256 => address) public nftOwner;

    uint256 public nextTokenId;

    event MintNFT(address indexed minter, uint256 indexed tokenId);

    constructor() {}

    function mintNFT(string memory _username, string memory _bio, uint256 _contributions, uint256 _repositories, string[] memory _skills, string[] memory _projects) public {
        uint256 tokenId = nextTokenId;
        nftMetadata[tokenId] = NFTMetadata(_username, _bio, _contributions, _repositories, _skills, _projects);
        userNFTs[msg.sender].push(tokenId);
        nftOwner[tokenId] = msg.sender;
        nextTokenId++;
        emit MintNFT(msg.sender, tokenId);
    }

    function getNFTMetadata(uint256 _tokenId) public view returns (NFTMetadata memory) {
        return nftMetadata[_tokenId];
    }

    function getUserNFTs(address _user) public view returns (uint256[] memory) {
        return userNFTs[_user];
    }
}
