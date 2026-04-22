// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title SimpleStorage
 * @dev A simple smart contract to store and retrieve a number.
 */
contract SimpleStorage {
    // Variable to store the number
    uint256 private storedNumber;

    // Event emitted when the number is updated
    event NumberUpdated(uint256 newValue);

    /**
     * @dev Function to store a number in the contract.
     * @param _number The number to be stored.
     */
    function set(uint256 _number) public {
        storedNumber = _number;
        emit NumberUpdated(_number);
    }

    /**
     * @dev Function to retrieve the stored number.
     * @return The currently stored number.
     */
    function get() public view returns (uint256) {
        return storedNumber;
    }
}
