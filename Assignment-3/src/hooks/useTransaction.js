import { useState } from "react";
import { ethers } from "ethers";
import { useWallet } from "../context/WalletContext";

export function useTransaction() {
  const { signer, account, addTx } = useWallet();
  const [status, setStatus]   = useState("idle"); // idle | signing | pending | success | error
  const [txHash, setTxHash]   = useState(null);
  const [signature, setSignature] = useState(null);
  const [gasEstimate, setGasEstimate] = useState(null);

  const signMessage = async (formData) => {
    if (!signer) throw new Error("Wallet not connected");
    const message = JSON.stringify({ ...formData, timestamp: Date.now() });
    setStatus("signing");
    const sig = await signer.signMessage(message); // uses personal_sign under the hood
    setSignature(sig);
    setStatus("idle");
    return { message, sig };
  };

  const sendTransaction = async (formData) => {
    if (!signer) throw new Error("Wallet not connected");

    // Encode product data as hex
    const data = ethers.hexlify(ethers.toUtf8Bytes(JSON.stringify({
      productId:   formData.productId,
      productName: formData.productName,
      quantity:    formData.quantity,
    })));

    const txParams = {
      from:  account,
      to:    formData.receiverAddress,
      value: ethers.parseEther(formData.total.toString()),
      data,
    };

    // Estimate gas first
    const provider = signer.provider;
    const gas = await provider.estimateGas(txParams);
    setGasEstimate(ethers.formatUnits(gas, "gwei"));

    setStatus("pending");
    const tx = await signer.sendTransaction(txParams); // MetaMask popup fires here

    const newTx = {
      hash:        tx.hash,
      productId:   formData.productId,
      productName: formData.productName,
      quantity:    formData.quantity,
      price:       formData.price,
      total:       formData.total,
      receiver:    formData.receiverAddress,
      status:      "Pending",
      timestamp:   new Date().toISOString(),
    };
    addTx(newTx);
    setTxHash(tx.hash);

    // Wait for confirmation in background
    tx.wait().then(receipt => {
      addTx({ ...newTx, status: receipt.status === 1 ? "Success" : "Failed" });
      setStatus("success");
    }).catch(() => {
      addTx({ ...newTx, status: "Failed" });
      setStatus("error");
    });

    return tx.hash;
  };

  return { status, txHash, signature, gasEstimate, signMessage, sendTransaction };
}
