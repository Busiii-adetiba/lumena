import type { Policy, SpendLimit, VelocityRule, AllowlistRule, TimeBoundsRule } from "@lumen/types";

export function createSpendLimitPolicy(
  walletId: string,
  asset: string,
  maxPerTx: string,
  maxDaily: string
): Policy {
  const rule: SpendLimit = { type: "spend_limit", asset, maxPerTx, maxDaily };
  return { id: crypto.randomUUID(), walletId, rules: [rule], createdAt: new Date() };
}

export function createVelocityPolicy(
  walletId: string,
  maxTransactions: number,
  windowMinutes: number
): Policy {
  const rule: VelocityRule = { type: "velocity", maxTransactions, windowMinutes };
  return { id: crypto.randomUUID(), walletId, rules: [rule], createdAt: new Date() };
}

export function createAllowlistPolicy(
  walletId: string,
  destinations: string[]
): Policy {
  const rule: AllowlistRule = { type: "allowlist", destinations };
  return { id: crypto.randomUUID(), walletId, rules: [rule], createdAt: new Date() };
}

export function createTimeBoundsPolicy(
  walletId: string,
  maxWindowSeconds?: number,
  allowUnbounded?: boolean
): Policy {
  const rule: TimeBoundsRule = { type: "timebounds", maxWindowSeconds, allowUnbounded };
  return { id: crypto.randomUUID(), walletId, rules: [rule], createdAt: new Date() };
}
