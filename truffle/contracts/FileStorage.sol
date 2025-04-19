// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FileStorage {
    struct File {
        string ipfsHash;
        string description;
        uint256 timestamp;
        address uploader;
        uint256 size;
    }

    File[] public files;

    event FileUploaded(
        uint256 indexed fileId,
        string ipfsHash,
        string description,
        uint256 timestamp,
        address indexed uploader,
        uint256 size
    );

    function uploadFile(string memory _ipfsHash, string memory _description, uint256 _size) public {
        File memory newFile = File(_ipfsHash, _description, block.timestamp, msg.sender, _size);
        files.push(newFile);
        emit FileUploaded(files.length - 1, _ipfsHash, _description, block.timestamp, msg.sender, _size);
    }

    function getFile(uint256 fileId) public view returns (File memory) {
        require(fileId < files.length, "Invalid file ID");
        return files[fileId];
    }

    function getAllFiles() public view returns (File[] memory) {
        return files;
    }
}
