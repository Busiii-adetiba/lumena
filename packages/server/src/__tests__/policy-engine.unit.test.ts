import { describe, it, expect } from "vitest";
import { PolicyEngine } from "../policy/engine.js";
import { createSpendLimitPolicy, createAllowlistPolicy } from "../policy/rules.js";
import type { Transaction } from "@stellar/stellar-sdk";

describe("PolicyEngine Multi-Op & Asset Spend Limits", () => {
  const walletId = "GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF";

  it("evaluates multiple payment operations in a single transaction against allowlist", async () => {
    const engine = new PolicyEngine();
    const policy = createAllowlistPolicy(walletId, ["GALLISTED1", "GALLISTED2"]);
    await engine.addPolicy(policy);

    const validTx = {
      operations: [
        { type: "payment", destination: "GALLISTED1", amount: "10", asset: "native" },
        { type: "payment", destination: "GALLISTED2", amount: "20", asset: "native" },
      ],
    } as unknown as Transaction;

    const res1 = await engine.evaluate({ walletAddress: walletId, transaction: validTx });
    expect(res1.approved).toBe(true);

    const invalidTx = {
      operations: [
        { type: "payment", destination: "GALLISTED1", amount: "10", asset: "native" },
        { type: "payment", destination: "GBADDESTINATION", amount: "20", asset: "native" },
      ],
    } as unknown as Transaction;

    const res2 = await engine.evaluate({ walletAddress: walletId, transaction: invalidTx });
    expect(res2.approved).toBe(false);
    expect(res2.reason).toContain("GBADDESTINATION is not on the allowlist");
  });

  it("evaluates pathPaymentStrictSend and pathPaymentStrictReceive operations", async () => {
    const engine = new PolicyEngine();
    const policy = createAllowlistPolicy(walletId, ["GALLOWEDPATH"]);
    await engine.addPolicy(policy);

    const pathTx = {
      operations: [
        {
          type: "pathPaymentStrictSend",
          destination: "GALLOWEDPATH",
          sendAmount: "50",
          sendAsset: "native",
        },
      ],
    } as unknown as Transaction;

    const res = await engine.evaluate({ walletAddress: walletId, transaction: pathTx });
    expect(res.approved).toBe(true);

    const invalidPathTx = {
      operations: [
        {
          type: "pathPaymentStrictReceive",
          destination: "GUNAUTHORIZED",
          sendMax: "100",
          sendAsset: "native",
        },
      ],
    } as unknown as Transaction;

    const resInvalid = await engine.evaluate({ walletAddress: walletId, transaction: invalidPathTx });
    expect(resInvalid.approved).toBe(false);
  });

  it("isolates spend limits by asset (XLM vs USDC)", async () => {
    const engine = new PolicyEngine();
    const xlmPolicy = createSpendLimitPolicy(walletId, "native", "100", "500");
    await engine.addPolicy(xlmPolicy);

    const xlmTx = {
      operations: [
        { type: "payment", destination: "GDEST", amount: "50", asset: "native" },
      ],
    } as unknown as Transaction;

    const resXlm = await engine.evaluate({ walletAddress: walletId, transaction: xlmTx });
    expect(resXlm.approved).toBe(true);

    // Payments in USDC should pass XLM spend limit rule
    const usdcTx = {
      operations: [
        { type: "payment", destination: "GDEST", amount: "1000", asset: "USDC:G123" },
      ],
    } as unknown as Transaction;

    const resUsdc = await engine.evaluate({ walletAddress: walletId, transaction: usdcTx });
    expect(resUsdc.approved).toBe(true);
  });

  it("enforces per-tx and daily spend limits across multi-op payments of same asset", async () => {
    const engine = new PolicyEngine();
    const policy = createSpendLimitPolicy(walletId, "native", "60", "100");
    await engine.addPolicy(policy);

    // Multi-op total = 70 exceeds maxPerTx (60)
    const exceedPerTx = {
      operations: [
        { type: "payment", destination: "GDEST", amount: "70", asset: "native" },
      ],
    } as unknown as Transaction;

    const res1 = await engine.evaluate({ walletAddress: walletId, transaction: exceedPerTx });
    expect(res1.approved).toBe(false);
    expect(res1.reason).toContain("exceeds per-tx limit");

    // First valid tx of 50
    const validTx1 = {
      operations: [
        { type: "payment", destination: "GDEST", amount: "50", asset: "native" },
      ],
    } as unknown as Transaction;
    const resValid = await engine.evaluate({ walletAddress: walletId, transaction: validTx1 });
    expect(resValid.approved).toBe(true);

    // Second valid tx of 55 will push daily total to 105 (exceeding daily limit 100)
    const validTx2 = {
      operations: [
        { type: "payment", destination: "GDEST", amount: "55", asset: "native" },
      ],
    } as unknown as Transaction;
    const resDaily = await engine.evaluate({ walletAddress: walletId, transaction: validTx2 });
    expect(resDaily.approved).toBe(false);
    expect(resDaily.reason).toContain("exceeds limit 100");
  });
});

describe("PolicyEngine TimeBounds & Expiration Enforcement", () => {
  const walletId = "GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF";

  it("rejects transactions without TimeBounds when unbounded is not permitted", async () => {
    const engine = new PolicyEngine();
    engine.addPolicy(createTimeBoundsPolicy(walletId, 300, false));

    const txNoBounds = {
      operations: [],
      timeBounds: undefined,
    } as unknown as Transaction;

    const result = engine.evaluate({ walletAddress: walletId, transaction: txNoBounds });
    expect(result.approved).toBe(false);
    expect(result.reason).toContain("does not have required TimeBounds");
  });

  it("approves transactions without TimeBounds when allowUnbounded is true", async () => {
    const engine = new PolicyEngine();
    engine.addPolicy(createTimeBoundsPolicy(walletId, 300, true));

    const txNoBounds = {
      operations: [],
      timeBounds: undefined,
    } as unknown as Transaction;

    const result = engine.evaluate({ walletAddress: walletId, transaction: txNoBounds });
    expect(result.approved).toBe(true);
  });

  it("rejects expired transactions", async () => {
    const engine = new PolicyEngine();
    engine.addPolicy(createTimeBoundsPolicy(walletId, 300));

    const now = Math.floor(Date.now() / 1000);
    const expiredTx = {
      operations: [],
      timeBounds: {
        minTime: (now - 600).toString(),
        maxTime: (now - 10).toString(),
      },
    } as unknown as Transaction;

    const result = engine.evaluate({ walletAddress: walletId, transaction: expiredTx });
    expect(result.approved).toBe(false);
    expect(result.reason).toContain("has expired");
  });

  it("rejects transactions exceeding the maximum validity window", async () => {
    const engine = new PolicyEngine();
    engine.addPolicy(createTimeBoundsPolicy(walletId, 120)); // max 120s window

    const now = Math.floor(Date.now() / 1000);
    const wideWindowTx = {
      operations: [],
      timeBounds: {
        minTime: now.toString(),
        maxTime: (now + 600).toString(), // 600s > 120s
      },
    } as unknown as Transaction;

    const result = engine.evaluate({ walletAddress: walletId, transaction: wideWindowTx });
    expect(result.approved).toBe(false);
    expect(result.reason).toContain("exceeds policy limit of 120s");
  });

  it("approves valid transactions within timebounds", async () => {
    const engine = new PolicyEngine();
    engine.addPolicy(createTimeBoundsPolicy(walletId, 300));

    const now = Math.floor(Date.now() / 1000);
    const validTx = {
      operations: [],
      timeBounds: {
        minTime: (now - 10).toString(),
        maxTime: (now + 120).toString(),
      },
    } as unknown as Transaction;

    const result = engine.evaluate({ walletAddress: walletId, transaction: validTx });
    expect(result.approved).toBe(true);
  });
});
