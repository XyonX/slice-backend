// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FileStorage {
    struct File {
        string ipfsHash;
        string name; // Added name field
        string description;
        uint256 timestamp;
        address uploader;
        uint256 size;
    }

    File[] public files;

    mapping(address => uint[]) public uploadedFiles;
    mapping(string => uint[]) public filesByTag;

    event FileUploaded(
        uint256 indexed fileId,
        string ipfsHash,
        string name, // Added name to event
        string description,
        uint256 timestamp,
        address indexed uploader,
        uint256 size
    );

    function uploadFile(
        string memory _ipfsHash,
        string memory _name, // Added name parameter
        string memory _description,
        uint256 _size,
        address _uploader,
        string memory _tag
    ) public {
        uint256 fileId = files.length;
        files.push(File(_ipfsHash, _name, _description, block.timestamp, _uploader, _size));

        uploadedFiles[_uploader].push(fileId);
        filesByTag[_tag].push(fileId);

        emit FileUploaded(fileId, _ipfsHash, _name, _description, block.timestamp, _uploader, _size);
    }

    function getFile(uint256 fileId) public view returns (File memory) {
        require(fileId < files.length, "Invalid file ID");
        return files[fileId];
    }

    function getAllFiles() public view returns (File[] memory) {
        return files;
    }

    function getFilesByUploader(address uploader) public view returns (uint[] memory) {
        return uploadedFiles[uploader];
    }

    function getFilesByTag(string memory tag) public view returns (uint[] memory) {
        return filesByTag[tag];
    }
}