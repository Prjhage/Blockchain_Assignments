# 📦 Product Ledger DApp

A premium, decentralized application for managing and logging product transactions on the blockchain. Built with React and Ethers.js, this DApp provides a secure and transparent way to record product shipments and payments.

## ✨ Features

- **🔐 Secure Wallet Integration**: Seamlessly connect with MetaMask to manage accounts and sign transactions.
- **📜 Immutable Ledger**: Log product details (ID, Name, Quantity, Price) directly onto the Ethereum blockchain.
- **✍️ Message Signing**: Off-chain message signing to verify transaction authenticity before submission.
- **🕒 Real-time History**: Track your transaction history with direct links to the Sepolia Etherscan explorer.
- **💎 Premium UI**: Modern, dark-themed interface built for a smooth user experience.

## 🛠️ Tech Stack

- **Frontend**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Blockchain**: [Ethers.js v6](https://docs.ethers.org/v6/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & Modern CSS-in-JS
- **Network**: Ethereum (Sepolia Testnet)

## 🚀 Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [MetaMask](https://metamask.io/) browser extension

### 2. Installation
```bash
# Clone the repository
git clone <your-repo-url>

# Navigate to the project directory
cd Assignment-3

# Install dependencies
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory and add the following:
```env
VITE_CONTRACT_ADDRESS=0x33B7063BDB921e06C33AAd60F1E41d8778510C64
VITE_ETHERSCAN_BASE=https://sepolia.etherscan.io
VITE_CHAIN_ID=11155111
```

### 4. Run Locally
```bash
npm run dev
```

## 🏗️ Project Structure

- `src/App.jsx`: Main application dashboard and logic.
- `src/context/`: Wallet state management using React Context.
- `src/hooks/`: Custom hooks for transaction handling.
- `src/utils/abi.js`: Smart contract ABI definitions.
- `src/utils/contract.js`: Contract interaction utilities.

## 📄 Smart Contract

The DApp interacts with the `ProductLedger` smart contract. Key functions include:
- `addProductTransaction`: Records product details and transfers ETH.
- `getUserTransactions`: Retrieves transaction history for a specific address.
- `getTotalTransactions`: Returns the total number of logged transactions.

---
*Created as part of the Blockchain Assignment series.*

