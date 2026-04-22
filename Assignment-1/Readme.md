# 📝 Assignment 1: Introduction to Smart Contracts

This assignment involves creating and understanding a basic Solidity smart contract.

## 🚀 Overview

The goal of this assignment is to implement a simple smart contract that can store and retrieve data on the blockchain. This serves as a foundation for understanding state variables, functions, and visibility modifiers in Solidity.

## 📄 Smart Contract: SimpleStorage

The `SimpleStorage.sol` contract allows a user to:
1. **Set** a number (`uint256`) which is stored in the contract's state.
2. **Get** the currently stored number.

### Features
- **State Management**: Uses a private variable to maintain state.
- **Events**: Emits a `NumberUpdated` event whenever the value is changed.
- **Gas Efficiency**: Minimal logic to ensure low transaction costs.

## 🛠️ How to Compile
You can use [Remix IDE](https://remix.ethereum.org/) to compile and deploy this contract:
1. Copy the code from `contracts/SimpleStorage.sol`.
2. Create a new file in Remix named `SimpleStorage.sol`.
3. Select compiler version `0.8.0` or higher.
4. Deploy to a "Remix VM" or an injected provider (like MetaMask).

---
*Part of the Blockchain Assignment series.*
