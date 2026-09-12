import { Transaction, Operation } from "@stellar/stellar-sdk";
import type {
  Policy,
  PolicyRule,
  SpendLimit,
  VelocityRule,
  AllowlistRule,
  SessionKeyPolicyRule,
} from "@lumen/types";

export interface EvaluateOpts {
  walletAddress: string;
  transaction: Transaction;
}

export interface EvaluateResult {
  approved: boolean;
  reason?: string;
}

export class PolicyEngine {
  private policies: Map<string, Policy> = new Map();

  // In-memory tracking for spend limit and velocity
  private readonly spendTracking: Map<string, Map<string, { dailyTotal: number; txCount: number }>> =
    new Map();
  private readonly velocityTracking: Map<string, number[]> = new Map();
  private readonly sessionSpendTracking: Map<string, number> = new Map();

  addPolicy(policy: Policy): void {
    this.policies.set(policy.walletId, policy);
  }

  removePolicy(walletId: string): void {
    this.policies.delete(walletId);
    this.spendTracking.delete(walletId);
    this.velocityTracking.delete(walletId);
  }

  getPolicy(walletId: string): Policy | undefined {
    return this.policies.get(walletId);
  }

  evaluate(opts: EvaluateOpts): EvaluateResult {
    const policy = this.policies.get(opts.walletAddress);

    if (!policy) {
      return { approved: true };
    }

    for (const rule of policy.rules) {
      const result = this.evaluateRule(rule, opts);
      if (!result.approved) {
        return result;
      }
    }

    return { approved: true };
  }

  private evaluateRule(rule: PolicyRule, opts: EvaluateOpts): EvaluateResult {
    switch (rule.type) {
      case "spend_limit":
        return this.evaluateSpendLimit(rule as SpendLimit, opts);
      case "velocity":
        return this.evaluateVelocity(rule as VelocityRule, opts);
      case "allowlist":
        return this.evaluateAllowlist(rule as AllowlistRule, opts);
      case "session_key":
        return this.evaluateSessionKey(rule as SessionKeyPolicyRule, opts);
      default:
        return { approved: true };
    }
  }

  private evaluateSpendLimit(rule: SpendLimit, opts: EvaluateOpts): EvaluateResult {
    const { walletAddress } = opts;

    // Get the first payment operation from the transaction
    const paymentOp = opts.transaction.operations.find(
      (op): op is Operation.Payment => "amount" in op && "destination" in op
    ) as Operation.Payment | undefined;

    if (!paymentOp) {
      return { approved: true }; // No payment operation, skip spend limit check
    }

    const txAmount = parseFloat(paymentOp.amount);

    // Initialize tracking for this wallet if needed
    if (!this.spendTracking.has(walletAddress)) {
      this.spendTracking.set(walletAddress, new Map());
    }
    const walletTrack = this.spendTracking.get(walletAddress)!;
    const today = new Date().toISOString().split("T")[0];

    if (!walletTrack.has(today)) {
      walletTrack.set(today, { dailyTotal: 0, txCount: 0 });
    }
    const track = walletTrack.get(today)!;

    // Check per-transaction limit
    if (txAmount > parseFloat(rule.maxPerTx)) {
      return { approved: false, reason: `Transaction amount ${txAmount} exceeds per-tx limit ${rule.maxPerTx}` };
    }

    // Check daily limit
    track.dailyTotal += txAmount;
    track.txCount++;

    if (track.dailyTotal > parseFloat(rule.maxDaily)) {
      return { approved: false, reason: `Daily spending ${track.dailyTotal} exceeds limit ${rule.maxDaily}` };
    }

    return { approved: true };
  }

  private evaluateVelocity(rule: VelocityRule, opts: EvaluateOpts): EvaluateResult {
    const { walletAddress } = opts;

    // Initialize tracking for this wallet if needed
    if (!this.velocityTracking.has(walletAddress)) {
      this.velocityTracking.set(walletAddress, []);
    }
    const txTimes = this.velocityTracking.get(walletAddress)!;

    // Remove timestamps outside the window
    const windowMs = rule.windowMinutes * 60 * 1000;
    const cutoff = Date.now() - windowMs;
    const recentTxs = txTimes.filter((t) => t > cutoff);

    // Add current transaction timestamp
    recentTxs.push(Date.now());

    // Update tracking
    this.velocityTracking.set(walletAddress, recentTxs);

    // Check if exceeding limit
    if (recentTxs.length > rule.maxTransactions) {
      return {
        approved: false,
        reason: `Too many transactions (${recentTxs.length}) in ${rule.windowMinutes}-minute window (max: ${rule.maxTransactions})`,
      };
    }

    return { approved: true };
  }

  private evaluateAllowlist(rule: AllowlistRule, opts: EvaluateOpts): EvaluateResult {
    // Get the first payment operation's destination from the transaction
    const paymentOp = opts.transaction.operations.find(
      (op): op is Operation.Payment => "amount" in op && "destination" in op
    ) as Operation.Payment | undefined;

    if (!paymentOp) {
      return { approved: true }; // No payment operation, skip allowlist check
    }

    const destination = paymentOp.destination.toString();
    const allowed = rule.destinations.includes(destination);

    if (!allowed) {
      return { approved: false, reason: `Destination ${destination} is not on the allowlist` };
    }

    return { approved: true };
  }

  private evaluateSessionKey(rule: SessionKeyPolicyRule, opts: EvaluateOpts): EvaluateResult {
    const now = Date.now();
    const expiryMs = rule.expiresAt < 1e11 ? rule.expiresAt * 1000 : rule.expiresAt;

    if (now > expiryMs) {
      return { approved: false, reason: `Session key ${rule.sessionPublicKey} has expired` };
    }

    const paymentOp = opts.transaction.operations.find(
      (op): op is Operation.Payment => "amount" in op && "destination" in op
    ) as Operation.Payment | undefined;

    const txAmount = paymentOp ? parseFloat(paymentOp.amount) : 0;
    const currentSpend = this.sessionSpendTracking.get(rule.sessionPublicKey) ?? 0;
    const maxSpend = parseFloat(rule.maxSpend);

    if (currentSpend + txAmount > maxSpend) {
      return {
        approved: false,
        reason: `Session key spend cap exceeded (${currentSpend + txAmount} > ${maxSpend})`,
      };
    }

    this.sessionSpendTracking.set(rule.sessionPublicKey, currentSpend + txAmount);
    return { approved: true };
  }
}
