import { describe, it, expect } from "vitest";
import { Keypair } from "@stellar/stellar-sdk";
import { PolicyEngine } from "../policy/engine.js";
import type { SessionKeyPolicyRule } from "@lumen/types";

describe("SessionKey Integration & Policy Tests", () => {
  it("enforces session key expiration policy", () => {
    const policyEngine = new PolicyEngine();
    const walletAddress = Keypair.random().publicKey();
    const sessionKeypair = Keypair.random();

    const expiredRule: SessionKeyPolicyRule = {
      type: "session_key",
      sessionPublicKey: sessionKeypair.publicKey(),
      maxSpend: "100",
      expiresAt: Date.now() - 10000, // 10 seconds in the past
    };

    policyEngine.addPolicy({
      id: "policy-session-expired",
      walletId: walletAddress,
      rules: [expiredRule],
      createdAt: new Date(),
    });

    const mockTx = {
      operations: [
        {
          type: "payment",
          amount: "10",
          destination: Keypair.random().publicKey(),
        },
      ],
    } as any;

    const result = policyEngine.evaluate({
      walletAddress,
      transaction: mockTx,
    });

    expect(result.approved).toBe(false);
    expect(result.reason).toContain("expired");
  });

  it("enforces session key maximum spend cap", () => {
    const policyEngine = new PolicyEngine();
    const walletAddress = Keypair.random().publicKey();
    const sessionKeypair = Keypair.random();

    const sessionRule: SessionKeyPolicyRule = {
      type: "session_key",
      sessionPublicKey: sessionKeypair.publicKey(),
      maxSpend: "20",
      expiresAt: Date.now() + 3600000, // 1 hour in future
    };

    policyEngine.addPolicy({
      id: "policy-session-cap",
      walletId: walletAddress,
      rules: [sessionRule],
      createdAt: new Date(),
    });

    const makeTx = (amount: string) =>
      ({
        operations: [
          {
            type: "payment",
            amount,
            destination: Keypair.random().publicKey(),
          },
        ],
      }) as any;

    // First transaction within spend cap (15 <= 20)
    const tx1 = policyEngine.evaluate({
      walletAddress,
      transaction: makeTx("15"),
    });
    expect(tx1.approved).toBe(true);

    // Second transaction exceeds total spend cap (15 + 10 = 25 > 20)
    const tx2 = policyEngine.evaluate({
      walletAddress,
      transaction: makeTx("10"),
    });
    expect(tx2.approved).toBe(false);
    expect(tx2.reason).toContain("spend cap exceeded");
  });
});
