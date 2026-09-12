import React, { useState, useEffect } from "react";

interface LogEntry {
  id: string;
  timestamp: string;
  type: "INFO" | "WALLET_CREATED" | "PAYMENT_SENT" | "POLICY_UPDATED" | "ERROR";
  message: string;
  payload?: any;
}

export default function App() {
  const [serverUrl, setServerUrl] = useState<string>("http://localhost:3000");
  const [serverOnline, setServerOnline] = useState<boolean>(false);

  // Wallet state
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [isCreatingWallet, setIsCreatingWallet] = useState<boolean>(false);
  const [xlmBalance, setXlmBalance] = useState<string>("100.0");
  const [usdcBalance, setUsdcBalance] = useState<string>("50.0");
  const [isRefreshingBalance, setIsRefreshingBalance] = useState<boolean>(false);

  // Payment form state
  const [destination, setDestination] = useState<string>("");
  const [paymentAsset, setPaymentAsset] = useState<string>("USDC");
  const [paymentAmount, setPaymentAmount] = useState<string>("10.00");
  const [isSendingPayment, setIsSendingPayment] = useState<boolean>(false);

  // Policy form state
  const [spendAsset, setSpendAsset] = useState<string>("USDC");
  const [maxPerTx, setMaxPerTx] = useState<string>("25.0");
  const [maxDaily, setMaxDaily] = useState<string>("100.0");
  const [isApplyingPolicy, setIsApplyingPolicy] = useState<boolean>(false);

  // Logs state
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const addLog = (
    type: LogEntry["type"],
    message: string,
    payload?: any
  ) => {
    const entry: LogEntry = {
      id: crypto.randomUUID(),
      timestamp: new Date().toLocaleTimeString(),
      type,
      message,
      payload,
    };
    setLogs((prev) => [entry, ...prev]);
  };

  // Check server health
  const checkHealth = async () => {
    try {
      const res = await fetch(`${serverUrl}/health`);
      if (res.ok) {
        const data = await res.json();
        setServerOnline(true);
        addLog("INFO", `Connected to @lumen/server (${data.network})`);
      } else {
        setServerOnline(false);
      }
    } catch (err) {
      setServerOnline(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, [serverUrl]);

  // Create Seedless Wallet
  const handleCreateWallet = async () => {
    setIsCreatingWallet(true);
    try {
      const res = await fetch(`${serverUrl}/wallet/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("Failed to create seedless wallet");
      const data = await res.json();
      setWalletAddress(data.address);
      addLog("WALLET_CREATED", "New seedless wallet created and sponsored", data);
    } catch (err: any) {
      addLog("ERROR", `Wallet creation error: ${err.message}`);
    } finally {
      setIsCreatingWallet(false);
    }
  };

  // Refresh Balances
  const handleRefreshBalances = async () => {
    if (!walletAddress) return;
    setIsRefreshingBalance(true);
    try {
      // Simulate fetch balance or query horizon/server
      setXlmBalance((100 + Math.random() * 5).toFixed(2));
      setUsdcBalance((50 + Math.random() * 2).toFixed(2));
      addLog("INFO", "Wallet balances updated", { XLM: xlmBalance, USDC: usdcBalance });
    } catch (err: any) {
      addLog("ERROR", `Failed to fetch balance: ${err.message}`);
    } finally {
      setIsRefreshingBalance(false);
    }
  };

  // Send Gasless Payment
  const handleSendPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletAddress) {
      addLog("ERROR", "Please create a seedless wallet first");
      return;
    }
    if (!destination) {
      addLog("ERROR", "Please specify a destination address");
      return;
    }

    setIsSendingPayment(true);
    try {
      // Create payment transaction simulation payload
      const mockXdr = "AAAAAGX...mockXdrPayload";
      
      // Step 1: Co-sign transaction with server policy check
      const cosignRes = await fetch(`${serverUrl}/cosign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ xdr: mockXdr, walletAddress }),
      });

      if (!cosignRes.ok) {
        const errorData = await cosignRes.json();
        throw new Error(errorData.error || "Co-signing rejected by server policy");
      }

      // Step 2: Fee-bump transaction
      const feeBumpRes = await fetch(`${serverUrl}/fee-bump`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ xdr: mockXdr }),
      });

      const feeData = await feeBumpRes.json();
      const mockHash = "7f3b" + Math.random().toString(16).substring(2, 10);

      addLog("PAYMENT_SENT", `Gasless payment of ${paymentAmount} ${paymentAsset} sent to ${destination.substring(0, 8)}...`, {
        txHash: mockHash,
        destination,
        asset: paymentAsset,
        amount: paymentAmount,
        feeBumpXdr: feeData.feeBumpXdr,
      });
    } catch (err: any) {
      addLog("ERROR", `Payment execution failed: ${err.message}`);
    } finally {
      setIsSendingPayment(false);
    }
  };

  // Configure Spend Limit Policy
  const handleConfigurePolicy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletAddress) {
      addLog("ERROR", "Please create a seedless wallet first");
      return;
    }

    setIsApplyingPolicy(true);
    try {
      const policyPayload = {
        walletId: walletAddress,
        rules: [
          {
            type: "spend_limit",
            asset: spendAsset,
            maxPerTx: maxPerTx,
            maxDaily: maxDaily,
          },
        ],
      };

      const res = await fetch(`${serverUrl}/policy`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(policyPayload),
      });

      if (!res.ok) throw new Error("Failed to configure policy");
      const data = await res.json();
      addLog("POLICY_UPDATED", `Spend limit policy applied for ${spendAsset}`, data);
    } catch (err: any) {
      addLog("ERROR", `Policy configuration failed: ${err.message}`);
    } finally {
      setIsApplyingPolicy(false);
    }
  };

  return (
    <div className="playground-container">
      {/* Header */}
      <header className="app-header">
        <div className="brand">
          <div className="brand-icon">✨</div>
          <div>
            <h1 className="brand-title">Lumen Playground</h1>
            <p className="brand-tagline">Interactive Seedless Wallet & Policy Explorer</p>
          </div>
        </div>

        <div className="server-status">
          <span className={`status-dot ${serverOnline ? "" : "offline"}`} />
          <span>Server: {serverUrl}</span>
          <button className="btn btn-secondary" style={{ padding: "0.25rem 0.5rem", fontSize: "0.75rem" }} onClick={checkHealth}>
            Refresh
          </button>
        </div>
      </header>

      {/* Main Grid Layout */}
      <div className="playground-grid">
        {/* Left Column: Wallet & Controls */}
        <div className="grid-column">
          {/* Card 1: Create Seedless Wallet */}
          <div className="glass-card">
            <h2 className="section-title">🔑 Seedless Wallet Onboarding</h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "1rem" }}>
              Provision a new keyless Stellar wallet co-managed by @lumen/server.
            </p>

            <button
              className="btn"
              onClick={handleCreateWallet}
              disabled={isCreatingWallet}
              style={{ width: "100%" }}
            >
              {isCreatingWallet ? "Provisioning..." : "Create Seedless Wallet"}
            </button>

            {walletAddress && (
              <div className="wallet-details">
                <div style={{ color: "var(--text-muted)", fontSize: "0.75rem", marginBottom: "0.25rem" }}>ACTIVE WALLET ADDRESS</div>
                <div>{walletAddress}</div>
              </div>
            )}

            {/* Balance Cards */}
            {walletAddress && (
              <div className="balance-grid">
                <div className="balance-item">
                  <div className="balance-label">Stellar XLM</div>
                  <div className="balance-value">{xlmBalance} XLM</div>
                </div>
                <div className="balance-item">
                  <div className="balance-label">USDC Token</div>
                  <div className="balance-value">{usdcBalance} USDC</div>
                </div>
              </div>
            )}
          </div>

          {/* Card 2: Send Gasless Payment */}
          <div className="glass-card">
            <h2 className="section-title">⚡ Send Gasless Payment</h2>
            <form onSubmit={handleSendPayment}>
              <div className="form-group">
                <label className="form-label">Destination Address</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="G... Stellar Public Key"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div className="form-group">
                  <label className="form-label">Asset Code</label>
                  <select
                    className="form-select"
                    value={paymentAsset}
                    onChange={(e) => setPaymentAsset(e.target.value)}
                  >
                    <option value="USDC">USDC</option>
                    <option value="XLM">XLM</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Amount</label>
                  <input
                    type="text"
                    className="form-input"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn"
                disabled={isSendingPayment}
                style={{ width: "100%", marginTop: "0.5rem" }}
              >
                {isSendingPayment ? "Signing & Submitting..." : "Send Gasless Payment"}
              </button>
            </form>
          </div>

          {/* Card 3: Configure Spend Limit Policy */}
          <div className="glass-card">
            <h2 className="section-title">🛡️ Configure Spend Limit Policy</h2>
            <form onSubmit={handleConfigurePolicy}>
              <div className="form-group">
                <label className="form-label">Asset Code</label>
                <input
                  type="text"
                  className="form-input"
                  value={spendAsset}
                  onChange={(e) => setSpendAsset(e.target.value)}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div className="form-group">
                  <label className="form-label">Max Per Tx</label>
                  <input
                    type="text"
                    className="form-input"
                    value={maxPerTx}
                    onChange={(e) => setMaxPerTx(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Max Daily</label>
                  <input
                    type="text"
                    className="form-input"
                    value={maxDaily}
                    onChange={(e) => setMaxDaily(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-secondary"
                disabled={isApplyingPolicy}
                style={{ width: "100%", marginTop: "0.5rem" }}
              >
                {isApplyingPolicy ? "Saving Policy..." : "Apply Policy to Server"}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Live Transaction Log Inspector */}
        <div className="grid-column">
          <div className="glass-card" style={{ height: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h2 className="section-title" style={{ marginBottom: 0 }}>📊 Live Transaction Log Inspector</h2>
              <button
                className="btn btn-secondary"
                style={{ padding: "0.3rem 0.6rem", fontSize: "0.75rem" }}
                onClick={() => setLogs([])}
              >
                Clear
              </button>
            </div>

            <div className="log-inspector">
              {logs.length === 0 ? (
                <div style={{ color: "var(--text-muted)", textAlign: "center", paddingTop: "5rem" }}>
                  No transaction events captured yet.<br/>Interact with the controls on the left to start inspecting logs.
                </div>
              ) : (
                logs.map((log) => (
                  <div key={log.id} className={`log-entry ${log.type}`}>
                    <div className="log-header">
                      <span className="log-type">{log.type}</span>
                      <span>{log.timestamp}</span>
                    </div>
                    <div style={{ fontWeight: 500, color: "var(--text-primary)", marginBottom: "0.25rem" }}>
                      {log.message}
                    </div>
                    {log.payload && (
                      <div className="log-data">
                        {JSON.stringify(log.payload, null, 2)}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
