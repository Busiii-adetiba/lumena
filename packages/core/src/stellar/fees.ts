/**
 * Issue #293 — Dynamic Fee-Bump Estimator with Horizon Ledger Surge Pricing Analysis
 *
 * Under network congestion, fixed fee-bumps cause transactions to get stuck in
 * Horizon mempools. This module fetches real-time fee statistics from Horizon's
 * GET /fee_stats endpoint and calculates an optimal fee-bump amount based on
 * current network percentile fees.
 *
 * Features:
 *  - Fetch and parse Horizon /fee_stats
 *  - Recommend a surge-aware base fee using a configurable percentile target
 *  - Enforce a configurable max fee cap so wallets never over-spend
 *  - Build a signed FeeBumpTransaction with the recommended fee
 *
 * Reference: https://developers.stellar.org/api/horizon/resources/fee-stats
 */

import {
  Horizon,
  TransactionBuilder,
  Transaction,
  FeeBumpTransaction,
  Keypair,
} from '@stellar/stellar-sdk';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/**
 * Raw fee percentile data parsed from Horizon's /fee_stats response for a
 * single operation-type bucket (e.g. "fee_charged" or "max_fee").
 */
export interface FeePercentiles {
  /** Minimum fee observed in the last ledger(s). */
  min: number;
  /** 10th-percentile fee. */
  p10: number;
  /** 20th-percentile fee. */
  p20: number;
  /** 30th-percentile fee. */
  p30: number;
  /** 40th-percentile fee. */
  p40: number;
  /** 50th-percentile (median) fee. */
  p50: number;
  /** 60th-percentile fee. */
  p60: number;
  /** 70th-percentile fee. */
  p70: number;
  /** 80th-percentile fee. */
  p80: number;
  /** 90th-percentile fee. */
  p90: number;
  /** 95th-percentile fee. */
  p95: number;
  /** 99th-percentile fee. */
  p99: number;
  /** Maximum fee observed. */
  max: number;
}

/**
 * Parsed representation of the Horizon /fee_stats response.
 */
export interface HorizonFeeStats {
  /** Last ledger sequence number included in the stats. */
  lastLedger: number;
  /** Base fee of the last ledger (stroops). */
  lastLedgerBaseFee: number;
  /** Ledger capacity utilisation in the last 5 ledgers (0–1). */
  ledgerCapacityUsage: number;
  /** Stats for fees actually charged by successful transactions. */
  feeCharged: FeePercentiles;
  /** Stats for the maximum fees offered by transactions in the pool. */
  maxFee: FeePercentiles;
}

/**
 * Configuration for the fee estimator.
 */
export interface FeeEstimatorOptions {
  /**
   * Horizon server instance or URL string.
   * Defaults to the Stellar testnet when not provided.
   */
  horizon?: Horizon.Server | string;
  /**
   * The percentile of the fee_charged distribution to target.
   * Higher values increase the chance of inclusion during congestion.
   * Must be one of: 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90 | 95 | 99.
   * Defaults to 75 (resolved to p90 during surge, p50 otherwise).
   */
  targetPercentile?: keyof FeePercentiles;
  /**
   * Hard cap on the base fee per operation in stroops.
   * The estimator will never recommend a fee above this value.
   * Defaults to 1_000_000 stroops (0.1 XLM).
   */
  maxFeeStroops?: number;
  /**
   * Ledger capacity utilisation fraction above which surge pricing is
   * considered active. Defaults to 0.5 (50 %).
   */
  surgeThreshold?: number;
}

/**
 * The result of a fee estimation call.
 */
export interface FeeEstimate {
  /** Recommended base fee per operation in stroops. */
  recommendedFeeStroops: number;
  /** Whether the estimator detected surge pricing conditions. */
  isSurge: boolean;
  /** The raw fee stats snapshot used for this estimate. */
  stats: HorizonFeeStats;
  /** The cap that was applied (if any) to produce the recommendation. */
  appliedCapStroops: number;
}

/**
 * Options for building a fee-bump transaction with the dynamically estimated fee.
 */
export interface DynamicFeeBumpOpts {
  /** The keypair of the fee-paying sponsor account. */
  feePayerKeypair: Keypair;
  /** The inner transaction to wrap. */
  innerTransaction: Transaction;
  /** Network passphrase (e.g. Networks.TESTNET). */
  networkPassphrase: string;
  /** Estimator configuration. */
  estimatorOptions?: FeeEstimatorOptions;
  /**
   * Number of operations in the inner transaction (used to scale the total fee).
   * Defaults to 1 when not provided; provide the correct count for accurate scaling.
   */
  innerOperationCount?: number;
}

// ---------------------------------------------------------------------------
// FeeEstimator
// ---------------------------------------------------------------------------

/**
 * Fetches real-time Horizon fee statistics and recommends an optimal fee-bump
 * amount that accounts for current network congestion.
 *
 * @example
 * ```ts
 * const estimator = new FeeEstimator({ maxFeeStroops: 500_000 });
 * const estimate  = await estimator.estimate();
 *
 * console.log(estimate.recommendedFeeStroops); // e.g. 12 000
 * console.log(estimate.isSurge);               // true when network is busy
 * ```
 */
export class FeeEstimator {
  private readonly horizon: Horizon.Server;
  private readonly targetPercentile: keyof FeePercentiles;
  private readonly maxFeeStroops: number;
  private readonly surgeThreshold: number;

  constructor(opts: FeeEstimatorOptions = {}) {
    if (opts.horizon instanceof Horizon.Server) {
      this.horizon = opts.horizon;
    } else {
      this.horizon = new Horizon.Server(
        opts.horizon ?? 'https://horizon-testnet.stellar.org',
      );
    }

    this.targetPercentile = opts.targetPercentile ?? 'p90';
    this.maxFeeStroops    = opts.maxFeeStroops    ?? 1_000_000;
    this.surgeThreshold   = opts.surgeThreshold   ?? 0.5;
  }

  // -------------------------------------------------------------------------
  // Public API
  // -------------------------------------------------------------------------

  /**
   * Fetches the latest /fee_stats from Horizon and returns an optimal base-fee
   * recommendation with surge detection.
   */
  async estimate(): Promise<FeeEstimate> {
    const stats = await this.fetchFeeStats();
    return this.computeEstimate(stats);
  }

  /**
   * Fetches and parses Horizon's /fee_stats endpoint into the typed
   * HorizonFeeStats structure.
   */
  async fetchFeeStats(): Promise<HorizonFeeStats> {
    // The Horizon SDK exposes feeStats() on the server instance.
    const raw = (await (this.horizon as any).feeStats()) as any;

    return {
      lastLedger:          Number(raw.last_ledger),
      lastLedgerBaseFee:   Number(raw.last_ledger_base_fee),
      ledgerCapacityUsage: parseFloat(raw.ledger_capacity_usage ?? '0'),
      feeCharged:          parsePercentileBlock(raw.fee_charged),
      maxFee:              parsePercentileBlock(raw.max_fee),
    };
  }

  /**
   * Computes a fee estimate from a pre-fetched HorizonFeeStats snapshot.
   * Useful for testing or when stats are fetched externally.
   */
  computeEstimate(stats: HorizonFeeStats): FeeEstimate {
    const isSurge = stats.ledgerCapacityUsage >= this.surgeThreshold;

    // During surge, use the user's configured target percentile; during
    // normal operation use the lower of p50 or the configured target.
    const percentileKey: keyof FeePercentiles = isSurge
      ? this.targetPercentile
      : lowerPercentile(this.targetPercentile, 'p50');

    const rawFee = stats.feeCharged[percentileKey];

    // Always respect the minimum base fee reported by the last ledger.
    const minFee = Math.max(rawFee, stats.lastLedgerBaseFee);

    // Apply the hard cap.
    const recommendedFeeStroops = Math.min(minFee, this.maxFeeStroops);

    return {
      recommendedFeeStroops,
      isSurge,
      stats,
      appliedCapStroops: this.maxFeeStroops,
    };
  }
}

// ---------------------------------------------------------------------------
// Convenience: buildDynamicFeeBump
// ---------------------------------------------------------------------------

/**
 * Convenience function that estimates the optimal fee and wraps an inner
 * transaction in a signed FeeBumpTransaction in a single call.
 *
 * @example
 * ```ts
 * const feeBump = await buildDynamicFeeBump({
 *   feePayerKeypair:       sponsorKeypair,
 *   innerTransaction:      signedInnerTx,
 *   networkPassphrase:     Networks.TESTNET,
 *   estimatorOptions:      { maxFeeStroops: 500_000 },
 *   innerOperationCount:   2,
 * });
 * await horizon.submitTransaction(feeBump);
 * ```
 */
export async function buildDynamicFeeBump(
  opts: DynamicFeeBumpOpts,
): Promise<FeeBumpTransaction> {
  const estimator = new FeeEstimator(opts.estimatorOptions);
  const estimate  = await estimator.estimate();

  // The fee-bump base fee is per-operation of the INNER transaction plus one
  // operation for the fee-bump envelope itself.
  const opCount    = (opts.innerOperationCount ?? 1) + 1;
  const totalFee   = (estimate.recommendedFeeStroops * opCount).toString();

  const feeBump = TransactionBuilder.buildFeeBumpTransaction(
    opts.feePayerKeypair,
    totalFee,
    opts.innerTransaction,
    opts.networkPassphrase,
  );

  feeBump.sign(opts.feePayerKeypair);

  return feeBump;
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/**
 * Parses a Horizon fee_charged / max_fee block into the typed FeePercentiles
 * shape, converting all string fields to numbers.
 */
function parsePercentileBlock(raw: any): FeePercentiles {
  const n = (key: string): number => Number(raw?.[key] ?? 0);
  return {
    min: n('min'),
    p10: n('p10'),
    p20: n('p20'),
    p30: n('p30'),
    p40: n('p40'),
    p50: n('p50'),
    p60: n('p60'),
    p70: n('p70'),
    p80: n('p80'),
    p90: n('p90'),
    p95: n('p95'),
    p99: n('p99'),
    max: n('max'),
  };
}

/**
 * Ordered list of percentile keys from lowest to highest. Used by
 * lowerPercentile() to clamp to the smaller of two keys.
 */
const PERCENTILE_ORDER: ReadonlyArray<keyof FeePercentiles> = [
  'min', 'p10', 'p20', 'p30', 'p40', 'p50',
  'p60', 'p70', 'p80', 'p90', 'p95', 'p99', 'max',
];

/**
 * Returns whichever of two percentile keys is numerically lower.
 */
function lowerPercentile(
  a: keyof FeePercentiles,
  b: keyof FeePercentiles,
): keyof FeePercentiles {
  return PERCENTILE_ORDER.indexOf(a) <= PERCENTILE_ORDER.indexOf(b) ? a : b;
}
