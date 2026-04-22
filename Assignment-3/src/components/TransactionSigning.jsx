import { useState } from "react";
import { useTransaction } from "../hooks/useTransaction";
import { useWallet } from "../context/WalletContext";

export default function TransactionSigning({ formData, onBack }) {
  const { status, txHash, signature, gasEstimate, signMessage, sendTransaction } = useTransaction();
  const { account } = useWallet();
  const [step, setStep] = useState("preview"); // preview | signed | sent

  const handleSign = async () => {
    try {
      const { sig } = await signMessage(formData);
      setStep("signed");
    } catch (err) {
      if (err.code === 4001) alert("User rejected the signature.");
      else alert(err.message);
    }
  };

  const handleSend = async () => {
    try {
      await sendTransaction(formData);
      setStep("sent");
    } catch (err) {
      if (err.code === 4001) alert("User rejected the transaction.");
      else alert(err.message);
    }
  };

  return (
    <div className="p-4 bg-gray-900 rounded-xl border border-gray-700 flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="text-gray-400 hover:text-white text-sm">← Back</button>
        <h2 className="text-white font-medium">Transaction Preview</h2>
      </div>

      {/* Message preview */}
      <pre className="bg-gray-800 rounded-lg p-3 text-xs text-green-400 overflow-auto max-h-40">
        {JSON.stringify(formData, null, 2)}
      </pre>

      {gasEstimate && (
        <p className="text-xs text-gray-400">Estimated gas: <span className="text-white">{gasEstimate} gwei</span></p>
      )}

      {signature && (
        <div>
          <p className="text-xs text-gray-400 mb-1">Signature hash:</p>
          <p className="text-xs font-mono text-purple-400 break-all bg-gray-800 p-2 rounded-lg">{signature}</p>
        </div>
      )}

      {txHash && (
        <a href={`${import.meta.env.VITE_ETHERSCAN_BASE}/tx/${txHash}`} target="_blank" rel="noreferrer"
          className="text-xs text-blue-400 underline break-all">
          View on Etherscan: {txHash}
        </a>
      )}

      <div className="flex gap-3">
        {step === "preview" && (
          <button onClick={handleSign} disabled={status === "signing"}
            className="flex-1 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-xl disabled:opacity-50">
            {status === "signing" ? "Waiting for MetaMask..." : "Sign Message"}
          </button>
        )}
        {step === "signed" && (
          <button onClick={handleSign} disabled={status === "pending"}
            className="flex-1 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm rounded-xl disabled:opacity-50">
            {status === "pending" ? "Sending..." : "Send Transaction"}
          </button>
        )}
        {step === "sent" && (
          <div className="w-full py-2 text-center text-green-400 text-sm">✓ Transaction submitted!</div>
        )}
      </div>
    </div>
  );
}
