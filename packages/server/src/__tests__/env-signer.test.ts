import { describe, it, expect } from "vitest";
import { Keypair } from "@stellar/stellar-sdk";
import { EnvSigner } from "../signers/EnvSigner.js";

describe("EnvSigner", () => {
  it("initializes and returns public key correctly", () => {
    const kp = Keypair.random();
    const signer = new EnvSigner(kp.secret());
    expect(signer.publicKey()).toBe(kp.publicKey());
  });

  it("signs payloads correctly", async () => {
    const kp = Keypair.random();
    const signer = new EnvSigner(kp.secret());
    const payload = new Uint8Array([1, 2, 3, 4]);
    const sig = await signer.sign(payload);
    expect(sig.length).toBe(64);
  });
});
