import { TransactionBuilder, Transaction, Keypair, xdr } from "@stellar/stellar-sdk";
import type { Signer } from "@lumen/types";
import { type StellarClient, validateTimeBounds } from "@lumen/core";
import { PolicyEngine } from "../policy/engine.js";

export interface CosignerOpts {
  client: StellarClient;
  /** Production: use an AwsKmsSigner. Dev/testnet: use an EnvSigner. */
  signer: Signer;
  policyEngine: PolicyEngine;
  enforceTimeBounds?: boolean;
  maxValidityWindowSeconds?: number;
}

export interface CosignRequest {
  xdr: string;
  walletAddress: string;
}

export interface CosignResult {
  signedXdr: string;
  approved: boolean;
  reason?: string;
}

export class CosignerService {
  private client: StellarClient;
  private signer: Signer;
  private policyEngine: PolicyEngine;
  private enforceTimeBounds: boolean;
  private maxValidityWindowSeconds?: number;

  constructor(opts: CosignerOpts) {
    this.client = opts.client;
    this.signer = opts.signer;
    this.policyEngine = opts.policyEngine;
    this.enforceTimeBounds = opts.enforceTimeBounds ?? false;
    this.maxValidityWindowSeconds = opts.maxValidityWindowSeconds;
  }

  get publicKey(): string {
    return this.signer.publicKey();
  }

  async cosign(request: CosignRequest): Promise<CosignResult> {
    const parsed = TransactionBuilder.fromXDR(
      request.xdr,
      this.client.networkPassphrase
    );
    const tx = parsed instanceof Transaction ? parsed : null;

    if (!tx) {
      return {
        signedXdr: "",
        approved: false,
        reason: "Expected a regular transaction, got fee-bump",
      };
    }

    if (this.enforceTimeBounds) {
      const tbCheck = validateTimeBounds(tx, {
        maxWindowSeconds: this.maxValidityWindowSeconds,
        allowUnbounded: false,
      });
      if (!tbCheck.valid) {
        return {
          signedXdr: "",
          approved: false,
          reason: tbCheck.reason ?? "Timebounds validation failed",
        };
      }
    }

    const policyResult = await this.policyEngine.evaluate({
      walletAddress: request.walletAddress,
      transaction: tx,
    });

    if (!policyResult.approved) {
      return {
        signedXdr: "",
        approved: false,
        reason: policyResult.reason,
      };
    }

    // Sign using the abstracted Signer (KMS or env-keypair).
    const txHash = tx.hash();
    const signature = await this.signer.sign(txHash);

    // Attach the signature to the transaction envelope using the decorated hint
    // format that Stellar expects: last 4 bytes of the raw public key.
    const rawPublicKey = Keypair.fromPublicKey(
      this.signer.publicKey()
    ).rawPublicKey();
    const hint = rawPublicKey.slice(-4);

    tx.signatures.push(
      new xdr.DecoratedSignature({
        hint,
        signature: Buffer.from(signature),
      })
    );

    return {
      signedXdr: tx.toXDR(),
      approved: true,
    };
  }
}
