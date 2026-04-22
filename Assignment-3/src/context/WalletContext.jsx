import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";

const WalletContext = createContext(null);

export function WalletProvider({ children }) {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [network, setNetwork] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [txHistory, setTxHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("txHistory")) || [];
    } catch {
      return [];
    }
  });

  const connectWallet = useCallback(async () => {
    if (!window.ethereum) {
      setError("MetaMask not installed. Please install it first.");
      return;
    }
    try {
      setLoading(true);
      const _provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await _provider.send("eth_requestAccounts", []);
      const _signer = await _provider.getSigner();
      const _network = await _provider.getNetwork();
      const _balance = await _provider.getBalance(accounts[0]);
      setProvider(_provider);
      setSigner(_signer);
      setAccount(accounts[0]);
      setNetwork(_network);
      setBalance(ethers.formatEther(_balance));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    setAccount(null);
    setBalance(null);
    setNetwork(null);
    setProvider(null);
    setSigner(null);
  }, []);

  // ── addTx: updates existing entry if hash matches, else adds new ──
  const addTx = useCallback((tx) => {
    setTxHistory(prev => {
      const index = prev.findIndex(t => t.hash === tx.hash);
      if (index >= 0) {
        // Update existing entry (Pending → Success or Failed)
        const updated = [...prev];
        updated[index] = { ...updated[index], ...tx };
        return updated;
      }
      // New transaction — add to top
      return [tx, ...prev];
    });
  }, []);

  // Listen for account / network changes
  useEffect(() => {
    if (!window.ethereum) return;

    const onAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else {
        setAccount(accounts[0]);
      }
    };

    const onChainChanged = () => window.location.reload();

    window.ethereum.on("accountsChanged", onAccountsChanged);
    window.ethereum.on("chainChanged", onChainChanged);

    return () => {
      window.ethereum.removeListener("accountsChanged", onAccountsChanged);
      window.ethereum.removeListener("chainChanged", onChainChanged);
    };
  }, [disconnectWallet]);

  // Persist tx history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("txHistory", JSON.stringify(txHistory));
  }, [txHistory]);

  return (
    <WalletContext.Provider value={{
      account, balance, network, provider, signer,
      txHistory, error, loading,
      connectWallet, disconnectWallet, addTx, setError
    }}>
      {children}
    </WalletContext.Provider>
  );
}

export const useWallet = () => useContext(WalletContext);