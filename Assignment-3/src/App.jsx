import { useState } from "react";
import { WalletProvider, useWallet } from "./context/WalletContext";
import { useTransaction } from "./hooks/useTransaction";
import { ethers } from "ethers";

// ── Wallet Connect Button ──────────────────────────────────────────
function WalletConnect() {
  const { account, balance, network, connectWallet, disconnectWallet, loading } = useWallet();
  const short = (a) => `${a.slice(0, 6)}...${a.slice(-4)}`;

  return (
    <div style={styles.walletBox}>
      {account ? (
        <div style={styles.walletInfo}>
          <div style={styles.dot} />
          <div>
            <div style={styles.address}>{short(account)}</div>
            <div style={styles.balance}>{parseFloat(balance).toFixed(4)} ETH · {network?.name}</div>
          </div>
          <button onClick={disconnectWallet} style={styles.disconnectBtn}>Disconnect</button>
        </div>
      ) : (
        <button onClick={connectWallet} disabled={loading} style={styles.connectBtn}>
          {loading ? "Connecting..." : "Connect MetaMask"}
        </button>
      )}
    </div>
  );
}

// ── Product Form ───────────────────────────────────────────────────
function ProductForm({ onSubmit }) {
  const [form, setForm] = useState({
    productId: "", productName: "", quantity: "", price: "", receiverAddress: ""
  });
  const [errors, setErrors] = useState({});

  const total = (() => {
    const q = parseFloat(form.quantity), p = parseFloat(form.price);
    return (!isNaN(q) && !isNaN(p) && q > 0 && p > 0) ? (q * p).toFixed(6) : "0.000000";
  })();

  const validate = () => {
    const e = {};
    if (!form.productId.trim()) e.productId = "Required";
    if (!form.productName.trim()) e.productName = "Required";
    if (!form.quantity || +form.quantity <= 0) e.quantity = "Must be > 0";
    if (!form.price || +form.price <= 0) e.price = "Must be > 0";
    if (!ethers.isAddress(form.receiverAddress)) e.receiverAddress = "Invalid address";
    return e;
  };

  const handle = (e) => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors(p => ({ ...p, [e.target.name]: "" }));
  };

  const submit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSubmit({ ...form, total });
  };

  const field = (label, name, type = "text", placeholder = "") => (
    <div style={styles.field}>
      <label style={styles.label}>{label}</label>
      <input name={name} type={type} value={form[name]} onChange={handle}
        placeholder={placeholder} style={{
          ...styles.input, borderColor: errors[name] ? "#e74c3c" : "#444"
        }} />
      {errors[name] && <span style={styles.errText}>{errors[name]}</span>}
    </div>
  );

  return (
    <form onSubmit={submit} style={styles.card}>
      <h2 style={styles.cardTitle}>Product Transaction</h2>
      {field("Product ID", "productId", "text", "PROD-001")}
      {field("Product Name", "productName", "text", "Laptop")}
      {field("Quantity", "quantity", "number", "1")}
      {field("Price per unit (ETH)", "price", "number", "0.001")}
      {field("Receiver Address", "receiverAddress", "text", "0x...")}
      <div style={styles.totalBox}>
        <span style={{ color: "#aaa" }}>Total</span>
        <span style={{ color: "#fff", fontFamily: "monospace" }}>{total} ETH</span>
      </div>
      <button type="submit" style={styles.primaryBtn}>Preview & Sign →</button>
    </form>
  );
}

// ── Transaction Preview + Sign + Send ─────────────────────────────
function TxPreview({ formData, onBack }) {
  const { signMessage, sendTransaction, status, txHash, signature, error } = useTransaction();
  const [step, setStep] = useState("preview");
  const base = import.meta.env.VITE_ETHERSCAN_BASE;

  const handleSign = async () => {
    try { await signMessage(formData); setStep("signed"); }
    catch { }
  };

  const handleSend = async () => {
    try { await sendTransaction(formData); setStep("sent"); }
    catch { }
  };

  return (
    <div style={styles.card}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <button onClick={onBack} style={styles.backBtn}>← Back</button>
        <h2 style={styles.cardTitle}>Transaction Preview</h2>
      </div>

      <pre style={styles.preBox}>{JSON.stringify(formData, null, 2)}</pre>

      {error && <div style={styles.errorBox}>{error}</div>}

      {signature && (
        <div style={{ marginBottom: 12 }}>
          <div style={styles.label}>Signature</div>
          <div style={styles.hashBox}>{signature}</div>
        </div>
      )}

      {txHash && (
        <div style={{ marginBottom: 12 }}>
          <div style={styles.label}>Transaction Hash</div>
          <a href={`${base}/tx/${txHash}`} target="_blank" rel="noreferrer"
            style={styles.link}>{txHash}</a>
        </div>
      )}

      <div style={{ display: "flex", gap: 10 }}>
        {step === "preview" && (
          <button onClick={handleSign} disabled={status === "signing"} style={styles.primaryBtn}>
            {status === "signing" ? "Waiting for MetaMask..." : "Sign Message"}
          </button>
        )}
        {step === "signed" && (
          <button onClick={handleSend} disabled={status === "pending"} style={styles.primaryBtn}>
            {status === "pending" ? "Sending..." : "Send Transaction"}
          </button>
        )}
        {step === "sent" && (
          <div style={{ color: "#2ecc71", padding: "10px 0" }}>Transaction submitted!</div>
        )}
      </div>
    </div>
  );
}

// ── Transaction History ────────────────────────────────────────────
function TxHistory() {
  const { txHistory } = useWallet();
  const base = import.meta.env.VITE_ETHERSCAN_BASE;

  const statusColor = { Pending: "#f39c12", Success: "#2ecc71", Failed: "#e74c3c" };

  if (!txHistory.length)
    return <div style={{ ...styles.card, color: "#666", textAlign: "center" }}>No transactions yet.</div>;

  return (
    <div style={styles.card}>
      <h2 style={styles.cardTitle}>Transaction History</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {txHistory.map((tx, i) => (
          <div key={i} style={styles.txRow}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <a href={`${base}/tx/${tx.hash}`} target="_blank" rel="noreferrer" style={styles.link}>
                {tx.hash.slice(0, 10)}...{tx.hash.slice(-6)}
              </a>
              <span style={{ color: statusColor[tx.status] || "#f39c12", fontSize: 12 }}>
                {tx.status}
              </span>
            </div>
            <div style={{ color: "#fff", fontSize: 14 }}>{tx.productName} × {tx.quantity}</div>
            <div style={{ color: "#888", fontSize: 12 }}>{tx.total} ETH · {new Date(tx.timestamp).toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main Dashboard ─────────────────────────────────────────────────
function Dashboard() {
  const { account } = useWallet();
  const [formData, setFormData] = useState(null);

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Product DApp</h1>
          <WalletConnect />
        </div>

        {!account ? (
          <div style={styles.hero}>Connect your MetaMask wallet to get started.</div>
        ) : (
          <div style={styles.grid}>
            <div>
              {formData
                ? <TxPreview formData={formData} onBack={() => setFormData(null)} />
                : <ProductForm onSubmit={setFormData} />
              }
            </div>
            <div><TxHistory /></div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Styles ─────────────────────────────────────────────────────────
const styles = {
  page: { minHeight: "100vh", background: "#0f0f0f", padding: "16px" },
  container: { maxWidth: 960, margin: "0 auto" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 },
  title: { color: "#fff", fontSize: 22, fontWeight: 500, margin: 0 },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 },
  hero: { color: "#666", textAlign: "center", padding: "60px 0", fontSize: 16 },
  card: { background: "#1a1a1a", border: "1px solid #333", borderRadius: 12, padding: 20, marginBottom: 0 },
  cardTitle: { color: "#fff", fontSize: 16, fontWeight: 500, margin: "0 0 16px" },
  field: { display: "flex", flexDirection: "column", gap: 4, marginBottom: 12 },
  label: { color: "#888", fontSize: 11, textTransform: "uppercase", letterSpacing: 1 },
  input: { background: "#111", border: "1px solid #444", borderRadius: 8, padding: "8px 12px", color: "#fff", fontSize: 14, outline: "none" },
  errText: { color: "#e74c3c", fontSize: 11 },
  totalBox: { display: "flex", justifyContent: "space-between", background: "#111", borderRadius: 8, padding: "10px 14px", marginBottom: 12 },
  primaryBtn: { width: "100%", padding: "10px 0", background: "#e67e22", border: "none", borderRadius: 10, color: "#fff", fontSize: 14, fontWeight: 500, cursor: "pointer" },
  backBtn: { background: "none", border: "none", color: "#888", cursor: "pointer", fontSize: 14 },
  preBox: { background: "#111", borderRadius: 8, padding: 12, fontSize: 12, color: "#2ecc71", overflow: "auto", maxHeight: 160, marginBottom: 12 },
  errorBox: { background: "#2d1515", border: "1px solid #e74c3c", borderRadius: 8, padding: 10, color: "#e74c3c", fontSize: 13, marginBottom: 12 },
  hashBox: { background: "#111", borderRadius: 8, padding: 10, fontSize: 11, color: "#9b59b6", wordBreak: "break-all", fontFamily: "monospace" },
  link: { color: "#3498db", fontSize: 12, textDecoration: "none", fontFamily: "monospace", wordBreak: "break-all" },
  txRow: { background: "#111", borderRadius: 8, padding: 12 },
  walletBox: {},
  walletInfo: { display: "flex", alignItems: "center", gap: 10, background: "#1a1a1a", border: "1px solid #333", borderRadius: 10, padding: "8px 12px" },
  dot: { width: 8, height: 8, borderRadius: "50%", background: "#2ecc71" },
  address: { color: "#fff", fontSize: 13, fontFamily: "monospace" },
  balance: { color: "#888", fontSize: 11 },
  connectBtn: { padding: "8px 18px", background: "#e67e22", border: "none", borderRadius: 10, color: "#fff", fontWeight: 500, cursor: "pointer" },
  disconnectBtn: { marginLeft: "auto", padding: "4px 10px", background: "none", border: "1px solid #e74c3c", borderRadius: 8, color: "#e74c3c", cursor: "pointer", fontSize: 12 },
};

// ── Root ───────────────────────────────────────────────────────────
export default function App() {
  return (
    <WalletProvider>
      <Dashboard />
    </WalletProvider>
  );
}