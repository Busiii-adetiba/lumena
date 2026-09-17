import { describe, it, expect } from "vitest";
import { LumenClient, createSessionKey } from "../client.js";
import { Keypair } from "@stellar/stellar-sdk";

describe("LumenClient (unit)", () => {
  const sponsor = Keypair.random();
  const cosigner = Keypair.random();

  it("initializes LumenClient with options", () => {
    const client = new LumenClient({
      network: "local",
      sponsorSecret: sponsor.secret(),
      serverPublicKey: cosigner.publicKey(),
    });
    expect(client).toBeInstanceOf(LumenClient);
  });

  it("creates a session key", () => {
    const session = createSessionKey(60);
    expect(session.publicKey).toBeDefined();
    expect(session.secretKey).toBeDefined();
    expect(session.expiresAt).toBeGreaterThan(Date.now());
  });
});
