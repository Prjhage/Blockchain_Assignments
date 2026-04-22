# 📝 Assignment 2: Advanced Smart Contract interactions

This assignment builds upon basic Solidity concepts to explore contract state and deployment.

## 🚀 Overview

The goal of this assignment is to deepen the understanding of how smart contracts maintain state on the blockchain and how users can interact with them using various tools.

## 📄 Smart Contract: SimpleStorage

The `SimpleStorage.sol` contract (same as Assignment 1) is used here to practice:
1. **Deployment**: Deploying to different test networks.
2. **Interaction**: Using scripts or web interfaces to read and write state.
3. **State Persistence**: Verifying that data remains on-chain across different sessions.

### Features
- **State Management**: Uses a private variable to maintain state.
- **Events**: Emits a `NumberUpdated` event whenever the value is changed.
- **Gas Efficiency**: Minimal logic to ensure low transaction costs.

## 🚀 Deployment Details

The contract has been successfully deployed to the Ethereum network.

- **Network**: Sepolia Testnet
- **Contract Address**: `0x...` *(Add your deployed address here)*
- **Explorer**: [View on Etherscan](https://sepolia.etherscan.io/address/0x...)

## 🛠️ How to Compile
You can use [Remix IDE](https://remix.ethereum.org/) to compile and deploy this contract:
1. Copy the code from `contracts/SimpleStorage.sol`.
2. Create a new file in Remix named `SimpleStorage.sol`.
3. Select compiler version `0.8.0` or higher.
4. Deploy to a "Remix VM" or an injected provider (like MetaMask).

---
*Part of the Blockchain Assignment series.*
