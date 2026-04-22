import React, { useState } from "react";
import { uploadToIPFS, getIPFSUrl } from "../utils/ipfs";

/**
 * A refined React component for IPFS file uploading.
 */
const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [cid, setCid] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError("");
    setCid("");
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const ipfsHash = await uploadToIPFS(file);
      setCid(ipfsHash);
    } catch (err) {
      setError("Upload failed. Verify your Pinata API keys in .env");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-card">
      <h3>IPFS File Upload</h3>
      
      <div className="file-input-wrapper">
        <input 
          type="file" 
          onChange={handleFileChange} 
        />
      </div>

      <button 
        onClick={handleUpload} 
        disabled={loading}
      >
        {loading ? "Uploading to IPFS..." : "Upload Securely"}
      </button>

      {error && <div className="error-msg">{error}</div>}

      {cid && (
        <div className="result-box">
          <p><strong>Success!</strong> File pinned on IPFS.</p>
          <code className="cid-code">{cid}</code>
          <a 
            href={getIPFSUrl(cid)} 
            target="_blank" 
            rel="noopener noreferrer"
            className="view-link"
          >
            Open in Gateway ↗
          </a>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
