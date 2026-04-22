// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleStorage {
    uint256 private storedNumber;

    event NumberUpdated(uint256 newValue);

    function set(uint256 _number) public {
        storedNumber = _number;
        emit NumberUpdated(_number);
    }

    function get() public view returns (uint256) {
        return storedNumber;
    }
}
