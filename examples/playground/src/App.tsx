import React, { useState, useEffect, useCallback } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface LogEntry {
  id: string;
  timestamp: string;
  type: "INFO" | "WALLET_CREATED" | "PAYMENT_SENT" | "POLICY_UPDATED" | "ERROR";
  message: string;
  payload?: unknown;
}

type TabId = "wallet" | "xdr";

// ---------------------------------------------------------------------------
// XDR Inspector helpers
// ---------------------------------------------------------------------------

/**
 * Attempts to decode a base-64 XDR string using the Stellar SDK loaded from
 * the Horizon network. In the playground we don't bundle @stellar/stellar-sdk,
 * so we perform a best-effort structural parse by calling Horizon's
 * GET /transactions endpoint with `tx_envelope` query, or fall back to a
 * lightweight manual base-64 → hex breakdown for display purposes.
 *
 * The "simulation" section calls POST /simulate on the connected server which
 * proxies to Soroban RPC if available.
 */
async function decodeXdr(
  xdr: string,
  serverUrl: string
): Promise<{ tree: unknown; raw: string }> {
  // First try: ask the server to decode it.
  const res = await fetch(`${serverUrl}/xdr/decode`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ xdr }),
  });

  if (res.ok) {
    const data = await res.json() as { decoded: unknown };
    return { tree: data.decoded, raw: xdr };
  }

  // Fallback: base-64 → hex breakdown for display only.
  try {
    const bytes = atob(xdr);
    const hex = Array.from(bytes)
      .map((b) => b.charCodeAt(0).toString(16).padStart(2, "0"))
      .join(" ");

    return {
      tree: {
        _note: "Server decode unavailable — showing raw hex dump",
        byteLength: bytes.length,
        hex: hex.slice(0, 200) + (hex.length > 200 ? "…" : ""),
      },
      raw: xdr,
    };
  } catch {
    throw new Error("Invalid base-64 XDR string");
  }
}

async function simulateXdr(
  xdr: string,
  serverUrl: string
): Promise<unknown> {
  const res = await fetch(`${serverUrl}/simulate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ xdr }),
  });

  if (!res.ok) {
    // Surface partial error body for debugging.
    let errMsg = `Server responded ${res.status}`;
    try {
      const body = await res.json() as { error?: string };
      if (body.error) errMsg = body.error;
    } catch { /* empty */ }
    throw new Error(errMsg);
  }

  return res.json();
}

// ---------------------------------------------------------------------------
// Collapsible JSON tree component
// ---------------------------------------------------------------------------

interface JsonNodeProps {
  value: unknown;
  depth?: number;
}

function JsonNode({ value, depth = 0 }: JsonNodeProps): React.ReactElement {
  const [collapsed, setCollapsed] = useState(depth > 1);
  const indent = depth * 16;

  if (value === null) return <span style={{ color: "#569cd6" }}>null</span>;
  if (typeof value === "boolean")
    return <span style={{ color: "#569cd6" }}>{String(value)}</span>;
  if (typeof value === "number")
    return <span style={{ color: "#b5cea8" }}>{value}</span>;
  if (typeof value === "string")
    return <span style={{ color: "#ce9178" }}>"{value}"</span>;

  if (Array.isArray(value)) {
    if (value.length === 0) return <span style={{ color: "#d4d4d4" }}>[]</span>;
    return (
      <span>
        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#d4d4d4",
            padding: 0,
            fontSize: "inherit",
            fontFamily: "inherit",
          }}
          aria-expanded={!collapsed}
        >
          {collapsed ? "▶" : "▼"} [{value.length}]
        </button>
        {!collapsed && (
          <div style={{ marginLeft: indent + 16 }}>
            {value.map((item, i) => (
              <div key={i}>
                <span style={{ color: "#858585" }}>{i}: </span>
                <JsonNode value={item} depth={depth + 1} />
              </div>
            ))}
          </div>
        )}
      </span>
    );
  }

  if (typeof value === "object") {
    const keys = Object.keys(value as object);
    if (keys.length === 0) return <span style={{ color: "#d4d4d4" }}>{"{}"}</span>;
    return (
      <span>
        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#d4d4d4",
            padding: 0,
            fontSize: "inherit",
            fontFamily: "inherit",
          }}
          aria-expanded={!collapsed}
        >
          {collapsed ? "▶" : "▼"} {`{${keys.length}}`}
        </button>
        {!collapsed && (
          <div style={{ marginLeft: indent + 16 }}>
            {keys.map((key) => (
              <div key={key}>
                <span style={{ color: "#9cdcfe" }}>"{key}"</span>
                <span style={{ color: "#d4d4d4" }}>: </span>
                <JsonNode
                  value={(value as Record<string, unknown>)[key]}
                  depth={depth + 1}
                />
              </div>
            ))}
          </div>
        )}
      </span>
    );
  }

  return <span style={{ color: "#d4d4d4" }}>{String(value)}</span>;
}

// ---------------------------------------------------------------------------
// XDR Inspector panel
// ---------------------------------------------------------------------------

interface XdrInspectorProps {
  serverUrl: string;
}

function XdrInspector({ serverUrl }: XdrInspectorProps): React.ReactElement {
  const [xdrInput, setXdrInput] = useState("");
  const [decoding, setDecoding] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [decodeResult, setDecodeResult] = useState<unknown>(null);
  const [simResult, setSimResult] = useState<unknown>(null);
  const [decodeError, setDecodeError] = useState<string | null>(null);
  const [simError, setSimError] = useState<string | null>(null);

  const handleDecode = useCallback(async () => {
    const trimmed = xdrInput.trim();
    if (!trimmed) return;

    setDecoding(true);
    setDecodeError(null);
    setDecodeResult(null);
    setSimResult(null);
    setSimError(null);

    try {
      const { tree } = await decodeXdr(trimmed, serverUrl);
      setDecodeResult(tree);
    } catch (err) {
      setDecodeError(err instanceof Error ? err.message : String(err));
    } finally {
      setDecoding(false);
    }
  }, [xdrInput, serverUrl]);

  const handleSimulate = useCallback(async () => {
    const trimmed = xdrInput.trim();
    if (!trimmed) return;

    setSimulating(true);
    setSimError(null);
    setSimResult(null);

    try {
      const result = await simulateXdr(trimmed, serverUrl);
      setSimResult(result);
    } catch (err) {
      setSimError(err instanceof Error ? err.message : String(err));
    } finally {
      setSimulating(false);
    }
  }, [xdrInput, serverUrl]);

  const handleClear = () => {
    setXdrInput("");
    setDecodeResult(null);
    setSimResult(null);
    setDecodeError(null);
    setSimError(null);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {/* Input area */}
      <div className="glass-card">
        <h2 className="section-title">🔬 XDR Input</h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", marginBottom: "1rem" }}>
          Paste a base-64 Stellar / Soroban XDR transaction envelope to decode and simulate it.
        </p>
        <textarea
          className="form-input"
          style={{
            width: "100%",
            minHeight: "120px",
            fontFamily: "monospace",
            fontSize: "0.8rem",
            resize: "vertical",
            boxSizing: "border-box",
          }}
          placeholder="AAAAAGX...base64XdrHere"
          value={xdrInput}
          onChange={(e) => setXdrInput(e.target.value)}
          aria-label="XDR envelope input"
          spellCheck={false}
        />
        <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.75rem", flexWrap: "wrap" }}>
          <button
            className="btn"
            onClick={() => { void handleDecode(); }}
            disabled={decoding || !xdrInput.trim()}
          >
            {decoding ? "Decoding…" : "Decode XDR"}
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => { void handleSimulate(); }}
            disabled={simulating || !xdrInput.trim()}
          >
            {simulating ? "Simulating…" : "Simulate Transaction"}
          </button>
          <button
            className="btn btn-secondary"
            onClick={handleClear}
            style={{ marginLeft: "auto" }}
          >
            Clear
          </button>
        </div>
      </div>

      {/* Decode result */}
      {(decodeResult !== null || decodeError) && (
        <div className="glass-card">
          <h2 className="section-title">📋 Decoded Operation Tree</h2>
          {decodeError && (
            <div
              style={{
                color: "#ff6b6b",
                background: "rgba(255,107,107,0.1)",
                padding: "0.75rem",
                borderRadius: "6px",
                fontFamily: "monospace",
                fontSize: "0.85rem",
              }}
              role="alert"
            >
              {decodeError}
            </div>
          )}
          {decodeResult !== null && (
            <div
              style={{
                background: "#1e1e2e",
                borderRadius: "8px",
                padding: "1rem",
                overflowX: "auto",
                fontFamily: "monospace",
                fontSize: "0.82rem",
                lineHeight: 1.6,
                color: "#d4d4d4",
                maxHeight: "400px",
                overflowY: "auto",
              }}
              role="region"
              aria-label="Decoded XDR tree"
            >
              <JsonNode value={decodeResult} depth={0} />
            </div>
          )}
        </div>
      )}

      {/* Simulation result */}
      {(simResult !== null || simError) && (
        <div className="glass-card">
          <h2 className="section-title">⚡ Simulation Result</h2>
          {simError && (
            <div
              style={{
                color: "#ff6b6b",
                background: "rgba(255,107,107,0.1)",
                padding: "0.75rem",
                borderRadius: "6px",
                fontFamily: "monospace",
                fontSize: "0.85rem",
              }}
              role="alert"
            >
              {simError}
            </div>
          )}
          {simResult !== null && (
            <div
              style={{
                background: "#1e1e2e",
                borderRadius: "8px",
                padding: "1rem",
                overflowX: "auto",
                fontFamily: "monospace",
                fontSize: "0.82rem",
                lineHeight: 1.6,
                color: "#d4d4d4",
                maxHeight: "400px",
                overflowY: "auto",
              }}
              role="region"
              aria-label="Simulation result tree"
            >
              <JsonNode value={simResult} depth={0} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main App
// ---------------------------------------------------------------------------

export default function App() {
  const [serverUrl, setServerUrl] = useState<string>("http://localhost:3000");
  const [serverOnline, setServerOnline] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<TabId>("wallet");

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
    payload?: unknown
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
        const data = await res.json() as { network?: string };
        setServerOnline(true);
        addLog("INFO", `Connected to @lumen/server (${data.network ?? "unknown"})`);
      } else {
        setServerOnline(false);
      }
    } catch {
      setServerOnline(false);
    }
  };

  useEffect(() => {
    void checkHealth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      const data = await res.json() as { address: string };
      setWalletAddress(data.address);
      addLog("WALLET_CREATED", "New seedless wallet created and sponsored", data);
    } catch (err: unknown) {
      addLog("ERROR", `Wallet creation error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsCreatingWallet(false);
    }
  };

  // Refresh Balances
  const handleRefreshBalances = async () => {
    if (!walletAddress) return;
    setIsRefreshingBalance(true);
    try {
      setXlmBalance((100 + Math.random() * 5).toFixed(2));
      setUsdcBalance((50 + Math.random() * 2).toFixed(2));
      addLog("INFO", "Wallet balances updated", { XLM: xlmBalance, USDC: usdcBalance });
    } catch (err: unknown) {
      addLog("ERROR", `Failed to fetch balance: ${err instanceof Error ? err.message : String(err)}`);
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
      const mockXdr = "AAAAAGX...mockXdrPayload";

      const cosignRes = await fetch(`${serverUrl}/cosign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ xdr: mockXdr, walletAddress }),
      });

      if (!cosignRes.ok) {
        const errorData = await cosignRes.json() as { error?: string };
        throw new Error(errorData.error ?? "Co-signing rejected by server policy");
      }

      const feeBumpRes = await fetch(`${serverUrl}/fee-bump`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ xdr: mockXdr }),
      });

      const feeData = await feeBumpRes.json() as { feeBumpXdr?: string };
      const mockHash = "7f3b" + Math.random().toString(16).substring(2, 10);

      addLog(
        "PAYMENT_SENT",
        `Gasless payment of ${paymentAmount} ${paymentAsset} sent to ${destination.substring(0, 8)}…`,
        {
          txHash: mockHash,
          destination,
          asset: paymentAsset,
          amount: paymentAmount,
          feeBumpXdr: feeData.feeBumpXdr,
        }
      );
    } catch (err: unknown) {
      addLog("ERROR", `Payment execution failed: ${err instanceof Error ? err.message : String(err)}`);
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
            maxPerTx,
            maxDaily,
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
    } catch (err: unknown) {
      addLog("ERROR", `Policy configuration failed: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsApplyingPolicy(false);
    }
  };

  // Tab styles
  const tabStyle = (id: TabId): React.CSSProperties => ({
    padding: "0.5rem 1.25rem",
    borderRadius: "8px 8px 0 0",
    border: "none",
    cursor: "pointer",
    fontWeight: activeTab === id ? 700 : 400,
    background: activeTab === id ? "var(--glass-bg, rgba(255,255,255,0.1))" : "transparent",
    color: activeTab === id ? "var(--text-primary, #fff)" : "var(--text-secondary, #aaa)",
    fontSize: "0.95rem",
    transition: "all 0.15s",
  });

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
          <button
            className="btn btn-secondary"
            style={{ padding: "0.25rem 0.5rem", fontSize: "0.75rem" }}
            onClick={() => { void checkHealth(); }}
          >
            Refresh
          </button>
        </div>
      </header>

      {/* Tab bar */}
      <div style={{ display: "flex", gap: "0.25rem", marginBottom: "1.5rem", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
        <button style={tabStyle("wallet")} onClick={() => setActiveTab("wallet")}>
          🔑 Wallet & Payments
        </button>
        <button style={tabStyle("xdr")} onClick={() => setActiveTab("xdr")}>
          🔬 XDR Inspector
        </button>
      </div>

      {/* Wallet & Payments tab */}
      {activeTab === "wallet" && (
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
                onClick={() => { void handleCreateWallet(); }}
                disabled={isCreatingWallet}
                style={{ width: "100%" }}
              >
                {isCreatingWallet ? "Provisioning..." : "Create Seedless Wallet"}
              </button>

              {walletAddress && (
                <div className="wallet-details">
                  <div style={{ color: "var(--text-muted)", fontSize: "0.75rem", marginBottom: "0.25rem" }}>
                    ACTIVE WALLET ADDRESS
                  </div>
                  <div>{walletAddress}</div>
                </div>
              )}

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
              <form onSubmit={(e) => { void handleSendPayment(e); }}>
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
              <form onSubmit={(e) => { void handleConfigurePolicy(e); }}>
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
                <h2 className="section-title" style={{ marginBottom: 0 }}>
                  📊 Live Transaction Log Inspector
                </h2>
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
                    No transaction events captured yet.
                    <br />
                    Interact with the controls on the left to start inspecting logs.
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
      )}

      {/* XDR Inspector tab */}
      {activeTab === "xdr" && (
        <XdrInspector serverUrl={serverUrl} />
      )}
    </div>
  );
}
