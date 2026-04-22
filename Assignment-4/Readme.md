# 🌐 Assignment 4: Decentralized Storage with IPFS

This assignment focuses on implementing decentralized file storage using the InterPlanetary File System (IPFS).

## 🚀 Overview

The goal of this assignment is to integrate IPFS into a blockchain application to store large files (like images, documents, or metadata) off-chain while maintaining a cryptographic link (CID) on the blockchain. We use **Pinata** as an IPFS pinning service to ensure data persistence.

## ✨ Features

- **📂 File Upload**: Upload any file from the frontend directly to IPFS.
- **🛡️ Data Persistence**: Uses Pinata Pinning API to ensure files remain available.
- **🔗 Content Addressing**: Uses CIDs (Content Identifiers) for unique and immutable file referencing.
- **🌐 Public Gateway Access**: Retrieve files via high-speed IPFS gateways.

## 🛠️ Implementation Details

### IPFS Logic (`src/utils/ipfs.js`)
The core logic uses the Pinata API to pin files. It handles:
- **FormData** construction for file and metadata.
- **JWT Authorization** for secure API communication.
- **Error Handling** for API failures.

### Setup Instructions

1. **Pinata Credentials**:
   - Sign up at [Pinata.cloud](https://www.pinata.cloud/).
   - Go to **API Keys** and generate a new key.
   - Add your credentials to the `.env` file:
     ```env
     VITE_PINATA_API_KEY=your_api_key
     VITE_PINATA_SECRET_KEY=your_secret_key
     ```

2. **How to Use**:
   ```javascript
   import { uploadToIPFS, getIPFSUrl } from './utils/ipfs';

   const handleUpload = async (file) => {
     const cid = await uploadToIPFS(file);
     const url = getIPFSUrl(cid);
     console.log("File available at:", url);
   };
   ```

---
*Part of the Blockchain Assignment series.*
