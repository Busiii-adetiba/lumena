import { describe, it, expect, vi, beforeEach } from "vitest";
import { VaultSigner } from "../signers/VaultSigner.js";
import { Keypair } from "@stellar/stellar-sdk";

describe("VaultSigner Unit Tests", () => {
  const kp = Keypair.random();
  const rawPubkey = kp.rawPublicKey();
  const base64Pubkey = Buffer.from(rawPubkey).toString("base64");

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("throws on missing required configuration", () => {
    expect(() => new VaultSigner({ vaultUrl: "", token: "", keyName: "" })).toThrow(
      "invalid configuration"
    );
  });

  it("fetches and caches public key from Vault transit response", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        data: {
          latest_version: 2,
          type: "ed25519",
          keys: {
            "2": {
              public_key: base64Pubkey,
            },
          },
        },
      }),
    } as any);

    const signer = new VaultSigner({
      vaultUrl: "https://vault.example.com:8200",
      token: "s.vault-token-xyz",
      keyName: "stellar-cosigner",
      namespace: "finance/lumen",
    });

    const pubkey = await signer.fetchPublicKey();
    expect(pubkey).toBe(kp.publicKey());
    expect(signer.publicKey()).toBe(kp.publicKey());

    expect(globalThis.fetch).toHaveBeenCalledWith(
      "https://vault.example.com:8200/v1/transit/keys/stellar-cosigner",
      expect.objectContaining({
        headers: expect.objectContaining({
          "X-Vault-Token": "s.vault-token-xyz",
          "X-Vault-Namespace": "finance/lumen",
        }),
      })
    );
  });

  it("signs payload via Vault transit sign endpoint", async () => {
    const rawSig = Buffer.alloc(64, 9);
    const vaultSigString = `vault:v2:${rawSig.toString("base64")}`;

    const fetchMock = vi.fn().mockImplementation(async (url: string) => {
      if (url.includes("/sign/")) {
        return {
          ok: true,
          json: async () => ({
            data: {
              signature: vaultSigString,
            },
          }),
        };
      }
      return {
        ok: true,
        json: async () => ({
          data: {
            latest_version: 1,
            keys: { "1": { public_key: base64Pubkey } },
          },
        }),
      };
    });
    globalThis.fetch = fetchMock;

    const signer = new VaultSigner({
      vaultUrl: "http://localhost:8200",
      token: "root",
      keyName: "test-key",
    });

    const payload = new Uint8Array([10, 20, 30]);
    const sig = await signer.sign(payload);

    expect(sig).toEqual(new Uint8Array(rawSig));
    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:8200/v1/transit/sign/test-key",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          input: Buffer.from(payload).toString("base64"),
        }),
      })
    );
  });

  it("throws on API error from Vault", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      text: async () => "key not found",
    } as any);

    const signer = new VaultSigner({
      vaultUrl: "http://localhost:8200",
      token: "root",
      keyName: "missing-key",
    });

    await expect(signer.fetchPublicKey()).rejects.toThrow("failed to fetch key");
  });
});
