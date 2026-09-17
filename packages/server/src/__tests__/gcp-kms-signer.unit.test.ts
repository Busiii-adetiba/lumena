import { describe, it, expect, vi, beforeEach } from "vitest";
import { GcpKmsSigner } from "../signers/GcpKmsSigner.js";
import { Keypair } from "@stellar/stellar-sdk";

describe("GcpKmsSigner Unit Tests", () => {
  const kp = Keypair.random();
  const rawPubkey = kp.rawPublicKey();
  const base64Pubkey = Buffer.from(rawPubkey).toString("base64");

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("throws on invalid configuration without resource identifier", () => {
    expect(() => new GcpKmsSigner({})).toThrow("invalid configuration");
  });

  it("fetches and caches public key from raw base64 response", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ rawPublicKey: base64Pubkey }),
    } as any);

    const signer = new GcpKmsSigner({
      keyResourceName: "projects/test-p/locations/global/keyRings/ring/cryptoKeys/key/cryptoKeyVersions/1",
    });

    const pubkey = await signer.fetchPublicKey();
    expect(pubkey).toBe(kp.publicKey());
    expect(signer.publicKey()).toBe(kp.publicKey());
  });

  it("fetches and caches public key from PEM response", async () => {
    const pem = `-----BEGIN PUBLIC KEY-----\n${base64Pubkey}\n-----END PUBLIC KEY-----`;
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ pem }),
    } as any);

    const signer = new GcpKmsSigner({
      projectId: "test-p",
      locationId: "global",
      keyRingId: "ring",
      keyId: "key",
      keyVersion: "1",
    });

    const pubkey = await signer.fetchPublicKey();
    expect(pubkey).toBe(kp.publicKey());
  });

  it("signs payload via asymmetricSign API", async () => {
    const dummySignature = Buffer.alloc(64, 7);
    const base64Sig = dummySignature.toString("base64");

    const fetchMock = vi.fn().mockImplementation(async (url: string) => {
      if (url.includes(":asymmetricSign")) {
        return {
          ok: true,
          json: async () => ({ signature: base64Sig }),
        };
      }
      return {
        ok: true,
        json: async () => ({ rawPublicKey: base64Pubkey }),
      };
    });
    globalThis.fetch = fetchMock;

    const signer = new GcpKmsSigner(
      {
        keyResourceName: "projects/test-p/locations/global/keyRings/ring/cryptoKeys/key/cryptoKeyVersions/1",
      },
      "oauth-token-123"
    );

    const payload = new Uint8Array([1, 2, 3, 4]);
    const sigResult = await signer.sign(payload);

    expect(sigResult).toEqual(new Uint8Array(dummySignature));
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining(":asymmetricSign"),
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          Authorization: "Bearer oauth-token-123",
        }),
      })
    );
  });

  it("handles KMS error responses appropriately", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 403,
      text: async () => "Permission denied",
    } as any);

    const signer = new GcpKmsSigner({
      keyResourceName: "projects/test-p/locations/global/keyRings/ring/cryptoKeys/key/cryptoKeyVersions/1",
    });

    await expect(signer.fetchPublicKey()).rejects.toThrow("Permission denied");
  });
});
