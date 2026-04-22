# 🏛️ Assignment 5: Decentralized Autonomous Organization (DAO)

This assignment focuses on building a foundational framework for a Decentralized Autonomous Organization (DAO) using smart contracts.

## 🚀 Overview

A DAO is an organization represented by rules encoded as a computer program that is transparent, controlled by the organization members and not influenced by a central government. This assignment implements the core logic for proposal creation, member voting, and automated execution of community decisions.

## ✨ Features

- **📝 Proposal Creation**: Any member can propose changes or actions with a specific voting duration.
- **🗳️ Transparent Voting**: On-chain voting mechanism supporting "Yes" and "No" votes.
- **🔒 Anti-Double Voting**: Ensures each unique address can only vote once per proposal.
- **⏳ Voting Deadlines**: Time-bound voting periods to ensure timely decision-making.
- **⚙️ Automated Execution**: Approval-based execution logic once the voting period concludes.

## 📄 Smart Contract: SimpleDAO

The `DAO.sol` contract includes the following core components:

### Data Structures
- `Proposal`: Stores ID, description, vote counts, deadline, and execution status.

### Main Functions
1. `createProposal(string description, uint duration)`: Starts a new community vote.
2. `vote(uint proposalId, bool support)`: Allows members to cast their vote.
3. `executeProposal(uint proposalId)`: Finalizes and triggers the action if the proposal passed.
4. `isPassed(uint proposalId)`: A view function to check the current status of a proposal.

## 🛠️ How to Compile & Test
1. Open [Remix IDE](https://remix.ethereum.org/).
2. Load `contracts/DAO.sol`.
3. Compile with Solidity `0.8.x`.
4. Deploy to the **Remix VM**.
5. Test by creating a proposal, voting from multiple accounts, and then executing after the deadline (you can "Fast Forward" time in Remix).

---
*Part of the Blockchain Assignment series.*
