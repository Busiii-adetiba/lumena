import { describe, it, expect } from "vitest";
import { Keypair } from "@stellar/stellar-sdk";

describe("core/keypair", () => {
  it("generates valid Ed25519 keypair", () => {
    const kp = Keypair.random();
    expect(kp.publicKey().startsWith("G")).toBe(true);
    expect(kp.secret().startsWith("S")).toBe(true);
  });

  it("signs and verifies payload", () => {
    const kp = Keypair.random();
    const data = Buffer.from("test payload");
    const sig = kp.sign(data);
    expect(kp.verify(data, sig)).toBe(true);
  });
});
