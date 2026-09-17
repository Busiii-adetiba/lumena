import type { Transaction } from "@stellar/stellar-sdk";

export interface TimeBoundsValidationOpts {
  maxWindowSeconds?: number;
  allowUnbounded?: boolean;
  now?: number;
}

export interface TimeBoundsValidationResult {
  valid: boolean;
  reason?: string;
  minTime?: number;
  maxTime?: number;
}

/**
 * Builds a timebounds range object with numeric timestamps in seconds.
 *
 * @param durationSeconds Validity window in seconds
 * @param minTimeOffset Optional offset from current time for minTime (defaults to 0)
 */
export function buildTimeBounds(
  durationSeconds: number,
  minTimeOffset: number = 0
): { minTime: string; maxTime: string } {
  const now = Math.floor(Date.now() / 1000);
  const minTime = Math.max(0, now + minTimeOffset);
  const maxTime = minTime + durationSeconds;

  return {
    minTime: minTime.toString(),
    maxTime: maxTime.toString(),
  };
}

/**
 * Validates the timebounds on a Stellar transaction.
 *
 * Ensures:
 * 1. Timebounds are present (unless allowUnbounded is explicitly true)
 * 2. The transaction has not expired (maxTime > current time)
 * 3. The transaction is already valid (minTime <= current time + buffer)
 * 4. The validity window (maxTime - minTime) does not exceed maxWindowSeconds
 */
export function validateTimeBounds(
  tx: Transaction,
  opts: TimeBoundsValidationOpts = {}
): TimeBoundsValidationResult {
  const { maxWindowSeconds, allowUnbounded = false, now = Math.floor(Date.now() / 1000) } = opts;

  const timeBounds = tx.timeBounds;

  if (!timeBounds) {
    if (allowUnbounded) {
      return { valid: true };
    }
    return {
      valid: false,
      reason: "Transaction has no TimeBounds set; unbounded transactions are not permitted",
    };
  }

  const minTime = parseInt(timeBounds.minTime, 10);
  const maxTime = parseInt(timeBounds.maxTime, 10);

  // maxTime == 0 indicates no upper bound in Stellar protocol
  if (maxTime === 0) {
    if (!allowUnbounded) {
      return {
        valid: false,
        reason: "Transaction maxTime is 0 (unbounded); transactions must specify an expiration",
      };
    }
    return { valid: true, minTime, maxTime };
  }

  // Check if already expired
  if (maxTime <= now) {
    return {
      valid: false,
      reason: `Transaction has expired: maxTime (${maxTime}) <= current time (${now})`,
      minTime,
      maxTime,
    };
  }

  // Check if minTime is in the distant future
  if (minTime > now + 300) {
    return {
      valid: false,
      reason: `Transaction minTime (${minTime}) is more than 5 minutes in the future`,
      minTime,
      maxTime,
    };
  }

  // Check max validity window
  if (maxWindowSeconds !== undefined && maxWindowSeconds > 0) {
    const window = maxTime - (minTime > 0 ? minTime : now);
    if (window > maxWindowSeconds) {
      return {
        valid: false,
        reason: `Transaction validity window of ${window}s exceeds maximum allowed window of ${maxWindowSeconds}s`,
        minTime,
        maxTime,
      };
    }
  }

  return { valid: true, minTime, maxTime };
}
