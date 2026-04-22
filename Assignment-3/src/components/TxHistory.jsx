import { useWallet } from "../context/WalletContext";

const STATUS_COLOR = {
  Pending: "text-yellow-400 bg-yellow-900/30 border-yellow-800",
  Success: "text-green-400 bg-green-900/30 border-green-800",
  Failed:  "text-red-400 bg-red-900/30 border-red-800",
};

export default function TxHistory() {
  const { txHistory } = useWallet();
  const base = import.meta.env.VITE_ETHERSCAN_BASE;

  if (txHistory.length === 0)
    return <p className="text-sm text-gray-500 text-center p-4">No transactions yet.</p>;

  return (
    <div className="flex flex-col gap-3">
      {txHistory.map((tx, i) => (
        <div key={i} className="p-3 bg-gray-900 rounded-xl border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <a href={`${base}/tx/${tx.hash}`} target="_blank" rel="noreferrer"
              className="text-xs font-mono text-blue-400 hover:underline">
              {tx.hash.slice(0,10)}...{tx.hash.slice(-8)}
            </a>
            <span className={`text-xs px-2 py-0.5 rounded-full border ${STATUS_COLOR[tx.status] || STATUS_COLOR.Pending}`}>
              {tx.status}
            </span>
          </div>
          <p className="text-sm text-white">{tx.productName} <span className="text-gray-400">× {tx.quantity}</span></p>
          <p className="text-xs text-gray-500 mt-1">
            {new Date(tx.timestamp).toLocaleString()} · {tx.total} ETH
          </p>
        </div>
      ))}
    </div>
  );
}
