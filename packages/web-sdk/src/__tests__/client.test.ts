import { describe, it, expect } from "vitest";
import { Keypair } from "@stellar/stellar-sdk";
import { LumenClient, createSessionKey } from "../client.js";

describe("web-sdk client", () => {
  const sponsorKeypair = Keypair.random();
  const serverKeypair = Keypair.random();

  it("creates session key with expiration", () => {
    const sessionKey = createSessionKey(1800);
    expect(sessionKey.publicKey).toBeDefined();
    expect(sessionKey.secretKey).toBeDefined();
    expect(sessionKey.expiresAt).toBeGreaterThan(Date.now());
  });

  it("instantiates LumenClient correctly", () => {
    const client = new LumenClient({
      network: "testnet",
      sponsorSecret: sponsorKeypair.secret(),
      serverPublicKey: serverKeypair.publicKey(),
    });

    expect(client).toBeInstanceOf(LumenClient);
    expect(client.getWallet("non-existent")).toBeUndefined();
  });
});
