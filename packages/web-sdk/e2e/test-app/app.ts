import { Buffer } from "buffer";
// Polyfill Buffer in browser if missing
if (typeof window !== "undefined" && !(window as any).Buffer) {
  (window as any).Buffer = Buffer;
}

import { LumenClient } from "../../src/index.js";

interface E2EConfig {
  network: "local";
  horizonUrl: string;
  rpcUrl: string;
  serverUrl: string;
  sponsorSecret: string;
  sponsorPublicKey: string;
  serverPublicKey: string;
  destinationPublicKey: string;
}

let client: LumenClient | null = null;
let config: E2EConfig | null = null;
let currentWalletId: string | null = null;

// UI Elements
const clientStatus = document.getElementById("client-status")!;
const btnCreateWallet = document.getElementById("btn-create-wallet") as HTMLButtonElement;
const walletAddress = document.getElementById("wallet-address")!;
const walletId = document.getElementById("wallet-id")!;
const walletStatus = document.getElementById("wallet-status")!;
const walletError = document.getElementById("wallet-error")!;

const btnGetBalance = document.getElementById("btn-get-balance") as HTMLButtonElement;
const balanceValue = document.getElementById("balance-value")!;
const balanceStatus = document.getElementById("balance-status")!;
const balanceError = document.getElementById("balance-error")!;

const inputDestination = document.getElementById("payment-destination") as HTMLInputElement;
const inputAmount = document.getElementById("payment-amount") as HTMLInputElement;
const btnSendPayment = document.getElementById("btn-send-payment") as HTMLButtonElement;
const paymentHash = document.getElementById("payment-hash")!;
const paymentStatus = document.getElementById("payment-status")!;
const paymentError = document.getElementById("payment-error")!;

const inputPolicyLimit = document.getElementById("policy-limit") as HTMLInputElement;
const btnApplyPolicy = document.getElementById("btn-apply-policy") as HTMLButtonElement;
const policyStatus = document.getElementById("policy-status")!;
const btnTestPolicyRejection = document.getElementById("btn-test-policy-rejection") as HTMLButtonElement;
const policyResult = document.getElementById("policy-result")!;
const policyError = document.getElementById("policy-error")!;

async function init() {
  try {
    const res = await fetch("/e2e-config.json");
    if (!res.ok) {
      throw new Error(`Failed to load config: ${res.statusText}`);
    }
    config = await res.json();

    client = new LumenClient({
      network: "local",
      horizonUrl: config!.horizonUrl,
      rpcUrl: config!.rpcUrl,
      serverUrl: config!.serverUrl,
      sponsorSecret: config!.sponsorSecret,
      serverPublicKey: config!.serverPublicKey,
    });

    inputDestination.value = config!.destinationPublicKey;

    clientStatus.textContent = "Ready";
    clientStatus.className = "badge badge-ready";

    (window as any).lumenApp = {
      client,
      config,
      get currentWalletId() {
        return currentWalletId;
      },
    };
  } catch (err: any) {
    clientStatus.textContent = `Error: ${err.message}`;
    clientStatus.className = "badge error";
    console.error("Init error:", err);
  }
}

// 1. Wallet Creation
btnCreateWallet.addEventListener("click", async () => {
  if (!client) return;
  walletStatus.textContent = "creating...";
  walletError.textContent = "";
  btnCreateWallet.disabled = true;

  try {
    const res = await client.createWallet();
    currentWalletId = res.id;
    walletAddress.textContent = res.address;
    walletId.textContent = res.id;
    walletStatus.textContent = "created";
  } catch (err: any) {
    walletStatus.textContent = "error";
    walletError.textContent = err.message;
    console.error("Wallet creation error:", err);
  } finally {
    btnCreateWallet.disabled = false;
  }
});

// 2. Balance Query
btnGetBalance.addEventListener("click", async () => {
  if (!client || !currentWalletId) {
    balanceError.textContent = "Please create a wallet first";
    return;
  }
  balanceStatus.textContent = "loading...";
  balanceError.textContent = "";
  btnGetBalance.disabled = true;

  try {
    const bal = await client.getBalance(currentWalletId);
    balanceValue.textContent = bal;
    balanceStatus.textContent = "loaded";
  } catch (err: any) {
    balanceStatus.textContent = "error";
    balanceError.textContent = err.message;
    console.error("Balance query error:", err);
  } finally {
    btnGetBalance.disabled = false;
  }
});

// 3. Gasless Payment Submission
btnSendPayment.addEventListener("click", async () => {
  if (!client || !currentWalletId) {
    paymentError.textContent = "Please create a wallet first";
    return;
  }

  const destination = inputDestination.value.trim();
  const amount = inputAmount.value.trim();

  paymentStatus.textContent = "submitting...";
  paymentError.textContent = "";
  paymentHash.textContent = "-";
  btnSendPayment.disabled = true;

  try {
    const result = await client.sendPayment(currentWalletId, destination, "XLM", amount);
    paymentHash.textContent = result.hash;
    paymentStatus.textContent = "success";
  } catch (err: any) {
    paymentStatus.textContent = "failed";
    paymentError.textContent = err.message;
    console.error("Payment submission error:", err);
  } finally {
    btnSendPayment.disabled = false;
  }
});

// 4. Policy Rejection
btnApplyPolicy.addEventListener("click", async () => {
  if (!config || !currentWalletId) {
    policyError.textContent = "Please create a wallet first";
    return;
  }

  const limit = inputPolicyLimit.value.trim();
  policyStatus.textContent = "applying...";
  policyError.textContent = "";

  try {
    const res = await fetch(`${config.serverUrl}/policy`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        walletId: currentWalletId,
        rules: [
          {
            type: "spend_limit",
            asset: "native",
            maxPerTx: limit,
            maxDaily: "100",
          },
        ],
      }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error ?? "Failed to configure policy");
    }

    policyStatus.textContent = "applied";
  } catch (err: any) {
    policyStatus.textContent = "error";
    policyError.textContent = err.message;
  }
});

btnTestPolicyRejection.addEventListener("click", async () => {
  if (!client || !config || !currentWalletId) {
    policyError.textContent = "Please create a wallet first";
    return;
  }

  policyResult.textContent = "submitting...";
  policyError.textContent = "";

  try {
    // Attempting to send 10 XLM which exceeds the 5 XLM policy limit
    await client.sendPayment(currentWalletId, config.destinationPublicKey, "XLM", "10.0");
    policyResult.textContent = "unexpected_success";
  } catch (err: any) {
    policyResult.textContent = "rejected";
    policyError.textContent = err.message;
  }
});

init();
