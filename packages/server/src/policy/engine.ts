import { Transaction, Asset } from "@stellar/stellar-sdk";
import type {
  Policy,
  PolicyRule,
  SpendLimit,
  VelocityRule,
  AllowlistRule,
  PolicyStore,
} from "@lumen/types";
import { InMemoryPolicyStore } from "./store.js";

export interface EvaluateOpts {
  walletAddress: string;
  transaction: Transaction;
}

export interface EvaluateResult {
  approved: boolean;
  reason?: string;
}

export interface PolicyEngineOpts {
  store?: PolicyStore;
}

interface ExtractedOperation {
  destination: string;
  amount: number;
  asset: string;
}

export function normalizeAssetKey(asset: Asset | string | undefined | null): string {
  if (!asset) return "native";
  if (typeof asset === "string") {
    const upper = asset.toUpperCase();
    if (upper === "NATIVE" || upper === "XLM") {
      return "native";
    }
    return asset;
  }
  if (typeof asset.isNative === "function" && asset.isNative()) {
    return "native";
  }
  if (typeof asset.getCode === "function" && typeof asset.getIssuer === "function") {
    return `${asset.getCode()}:${asset.getIssuer()}`;
  }
  return "native";
}

export function extractPaymentOps(transaction: Transaction): ExtractedOperation[] {
  const extracted: ExtractedOperation[] = [];
  if (!transaction || !Array.isArray(transaction.operations)) {
    return extracted;
  }

  for (const op of transaction.operations) {
    const opAny = op as any;
    const type = opAny.type;

    if (type === "payment" || ("amount" in opAny && "destination" in opAny && !type)) {
      extracted.push({
        destination: opAny.destination,
        amount: parseFloat(opAny.amount || "0"),
        asset: normalizeAssetKey(opAny.asset),
      });
    } else if (type === "pathPaymentStrictSend") {
      extracted.push({
        destination: opAny.destination,
        amount: parseFloat(opAny.sendAmount || "0"),
        asset: normalizeAssetKey(opAny.sendAsset),
      });
    } else if (type === "pathPaymentStrictReceive") {
      extracted.push({
        destination: opAny.destination,
        amount: parseFloat(opAny.sendMax || "0"),
        asset: normalizeAssetKey(opAny.sendAsset),
      });
    }
  }

  return extracted;
}

export class PolicyEngine {
  private store: PolicyStore;

  constructor(opts?: PolicyEngineOpts) {
    this.store = opts?.store ?? new InMemoryPolicyStore();
  }

  async addPolicy(policy: Policy): Promise<void> {
    await this.store.savePolicy(policy);
  }

  async removePolicy(walletId: string): Promise<void> {
    await this.store.deletePolicy(walletId);
  }

  async getPolicy(walletId: string): Promise<Policy | null> {
    return await this.store.getPolicy(walletId);
  }

  async evaluate(opts: EvaluateOpts): Promise<EvaluateResult> {
    const policy = await this.store.getPolicy(opts.walletAddress);

    if (!policy) {
      return { approved: true };
    }

    for (const rule of policy.rules) {
      const result = await this.evaluateRule(rule, opts);
      if (!result.approved) {
        return result;
      }
    }

    return { approved: true };
  }

  private async evaluateRule(
    rule: PolicyRule,
    opts: EvaluateOpts
  ): Promise<EvaluateResult> {
    switch (rule.type) {
      case "spend_limit":
        return await this.evaluateSpendLimit(rule as SpendLimit, opts);
      case "velocity":
        return await this.evaluateVelocity(rule as VelocityRule, opts);
      case "allowlist":
        return await this.evaluateAllowlist(rule as AllowlistRule, opts);
      default:
        return { approved: true };
    }
  }

  private async evaluateSpendLimit(
    rule: SpendLimit,
    opts: EvaluateOpts
  ): Promise<EvaluateResult> {
    const { walletAddress } = opts;
    const ops = extractPaymentOps(opts.transaction);

    const ruleAssetKey = normalizeAssetKey(rule.asset);

    const matchingOps = ops.filter((op) => op.asset === ruleAssetKey);

    if (matchingOps.length === 0) {
      return { approved: true };
    }

    let totalTxAmount = 0;
    const maxPerTx = parseFloat(rule.maxPerTx);

    for (const op of matchingOps) {
      if (op.amount > maxPerTx) {
        return {
          approved: false,
          reason: `Transaction amount ${op.amount} exceeds per-tx limit ${rule.maxPerTx}`,
        };
      }
      totalTxAmount += op.amount;
    }

    const today = new Date().toISOString().split("T")[0];
    const track = await this.store.recordSpend(
      walletAddress,
      today,
      totalTxAmount,
      ruleAssetKey
    );

    if (track.dailyTotal > parseFloat(rule.maxDaily)) {
      return {
        approved: false,
        reason: `Daily spending ${track.dailyTotal} exceeds limit ${rule.maxDaily}`,
      };
    }

    return { approved: true };
  }

  private async evaluateVelocity(
    rule: VelocityRule,
    opts: EvaluateOpts
  ): Promise<EvaluateResult> {
    const { walletAddress } = opts;
    const windowMs = rule.windowMinutes * 60 * 1000;

    const count = await this.store.recordVelocity(
      walletAddress,
      Date.now(),
      windowMs
    );

    if (count > rule.maxTransactions) {
      return {
        approved: false,
        reason: `Too many transactions (${count}) in ${rule.windowMinutes}-minute window (max: ${rule.maxTransactions})`,
      };
    }

    return { approved: true };
  }

  private async evaluateAllowlist(
    rule: AllowlistRule,
    opts: EvaluateOpts
  ): Promise<EvaluateResult> {
    const ops = extractPaymentOps(opts.transaction);

    if (ops.length === 0) {
      return { approved: true };
    }

    for (const op of ops) {
      const allowed = rule.destinations.includes(op.destination);
      if (!allowed) {
        return {
          approved: false,
          reason: `Destination ${op.destination} is not on the allowlist`,
        };
      }
    }

    return { approved: true };
  }
}