import { useWallet } from "../context/WalletContext";

export default function WalletConnect() {
  const { account, balance, connectWallet, disconnectWallet, loading } = useWallet();

  const shortAddr = (addr) => `${addr.slice(0,6)}...${addr.slice(-4)}`;

  return (
    <div className="flex items-center gap-3 p-4 bg-gray-900 rounded-xl border border-gray-700">
      {account ? (
        <>
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"/>
          <div>
            <p className="text-sm font-mono text-white">{shortAddr(account)}</p>
            <p className="text-xs text-gray-400">{parseFloat(balance).toFixed(4)} ETH</p>
          </div>
          <button onClick={disconnectWallet}
            className="ml-auto px-3 py-1 text-xs text-red-400 border border-red-800 rounded-lg hover:bg-red-900/30">
            Disconnect
          </button>
        </>
      ) : (
        <button onClick={connectWallet} disabled={loading}
          className="w-full py-2 px-4 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-xl disabled:opacity-50">
          {loading ? "Connecting..." : "🦊 Connect MetaMask"}
        </button>
      )}
    </div>
  );
}
