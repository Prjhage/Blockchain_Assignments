import { useWallet } from "../context/WalletContext";

const NETWORKS = {
  "1":        { name: "Ethereum Mainnet", color: "text-blue-400" },
  "11155111": { name: "Sepolia Testnet",  color: "text-purple-400" },
  "5":        { name: "Goerli Testnet",   color: "text-yellow-400" },
};

export default function NetworkBadge() {
  const { network, account } = useWallet();
  if (!account || !network) return null;

  const chainId = network.chainId.toString();
  const info = NETWORKS[chainId] || { name: "Unknown Network", color: "text-red-400" };
  const isWrong = chainId !== import.meta.env.VITE_CHAIN_ID;

  const switchNetwork = async () => {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0xaa36a7" }], // Sepolia hex
    });
  };

  return (
    <div className="flex items-center gap-2">
      <span className={`text-xs font-medium px-2 py-1 rounded-full border border-gray-700 ${info.color}`}>
        ● {info.name}
      </span>
      {isWrong && (
        <button onClick={switchNetwork}
          className="text-xs px-2 py-1 bg-red-900/40 text-red-400 rounded-full border border-red-800">
          Switch to Sepolia
        </button>
      )}
    </div>
  );
}
