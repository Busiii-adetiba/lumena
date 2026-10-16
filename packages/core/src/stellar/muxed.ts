/**
 * Issue #292 — Native Support for Stellar Muxed Accounts (MED25519 / M... addresses)
 *
 * Exchanges and payment processors require muxed addresses (M-addresses) to
 * route payments without separate memos. This module implements:
 *
 *  - Encoding a (G-address + 64-bit memo ID) pair into an M-address
 *  - Decoding an M-address back into its base public key and memo ID
 *  - A build helper that transparently resolves M-addresses when constructing
 *    payment operations so callers never need to handle the split manually
 *  - Policy-check helpers that normalise M-addresses to their underlying
 *    G-address before validating allow/deny lists
 *
 * Reference: https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0023.md
 *            (SEP-23 defines the MED25519 / M-address encoding used by SEP-0024 and beyond)
 */

import {
  MuxedAccount,
  StrKey,
  Operation,
  Asset,
  Memo,
  xdr,
} from '@stellar/stellar-sdk';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/**
 * The decoded components of a muxed (M...) Stellar address.
 */
export interface DecodedMuxedAddress {
  /** The underlying G... ed25519 public key. */
  basePublicKey: string;
  /** The 64-bit memo-ID that disambiguates sub-accounts. */
  memoId: bigint;
}

/**
 * Options for building a payment operation that targets either a plain
 * G-address or a muxed M-address destination.
 */
export interface MuxedPaymentOpts {
  /** Source account (G-address). Used to set the operation source when provided. */
  sourceAccount?: string;
  /** Destination — may be a G-address or an M-address. */
  destination: string;
  /** Stellar asset to transfer. */
  asset: Asset;
  /** String amount (e.g. "10.5000000"). */
  amount: string;
}

/**
 * Result of a muxed payment operation build.
 */
export interface MuxedPaymentResult {
  /** The XDR operation ready to be added to a TransactionBuilder. */
  operation: xdr.Operation;
  /**
   * The resolved G-address (base public key) of the destination.
   * Useful for policy checks and event logging.
   */
  resolvedBaseKey: string;
  /**
   * The memo ID embedded in the M-address, or undefined when the destination
   * was a plain G-address.
   */
  memoId?: bigint;
}

// ---------------------------------------------------------------------------
// Address helpers
// ---------------------------------------------------------------------------

/**
 * Returns true when the given string looks like a muxed (M...) Stellar address.
 */
export function isMuxedAddress(address: string): boolean {
  return address.startsWith('M') && address.length > 56;
}

/**
 * Encodes a base G-address and a 64-bit memo ID into a MED25519 M-address.
 *
 * @param basePublicKey G-address (ed25519 public key).
 * @param memoId        64-bit integer identifying the sub-account.
 * @returns             The corresponding M-address string.
 *
 * @example
 * ```ts
 * const mAddress = encodeMuxedAddress('GABC...', 42n);
 * // "MA7QYNF7SOWQ3GLR2BGMZEHXR77V3Y..."
 * ```
 */
export function encodeMuxedAddress(basePublicKey: string, memoId: bigint): string {
  if (!StrKey.isValidEd25519PublicKey(basePublicKey)) {
    throw new Error(`encodeMuxedAddress: invalid G-address "${basePublicKey}"`);
  }

  const muxed = new MuxedAccount(
    { id: memoId.toString(), accountId: basePublicKey } as any,
    memoId.toString(),
  );

  return muxed.accountId();
}

/**
 * Decodes a muxed M-address into its base public key and 64-bit memo ID.
 *
 * @param muxedAddress The M-address to decode.
 * @returns            Object containing basePublicKey and memoId.
 * @throws             When the address is not a valid M-address.
 *
 * @example
 * ```ts
 * const { basePublicKey, memoId } = decodeMuxedAddress('MA7QYNF7...');
 * ```
 */
export function decodeMuxedAddress(muxedAddress: string): DecodedMuxedAddress {
  if (!isMuxedAddress(muxedAddress)) {
    throw new Error(
      `decodeMuxedAddress: "${muxedAddress}" is not a muxed M-address`,
    );
  }

  // The Stellar SDK parses M-addresses via StrKey.decodeMed25519PublicKey which
  // returns the raw bytes: 8 bytes of uint64 ID followed by 32 bytes of ed25519 key.
  let decoded: Buffer;
  try {
    decoded = Buffer.from(StrKey.decodeMed25519PublicKey(muxedAddress));
  } catch (e) {
    throw new Error(
      `decodeMuxedAddress: failed to decode "${muxedAddress}": ${(e as Error).message}`,
    );
  }

  // First 8 bytes = big-endian uint64 memo ID
  const memoId =
    (BigInt(decoded[0]) << 56n) |
    (BigInt(decoded[1]) << 48n) |
    (BigInt(decoded[2]) << 40n) |
    (BigInt(decoded[3]) << 32n) |
    (BigInt(decoded[4]) << 24n) |
    (BigInt(decoded[5]) << 16n) |
    (BigInt(decoded[6]) << 8n)  |
    BigInt(decoded[7]);

  // Remaining 32 bytes = ed25519 public key
  const keyBytes = decoded.slice(8);
  const basePublicKey = StrKey.encodeEd25519PublicKey(keyBytes);

  return { basePublicKey, memoId };
}

/**
 * Resolves any address (G- or M-) to the underlying base G-address.
 *
 * - For plain G-addresses the input is returned unchanged.
 * - For M-addresses the encoded G-address is extracted and returned.
 */
export function resolveBasePublicKey(address: string): string {
  if (isMuxedAddress(address)) {
    return decodeMuxedAddress(address).basePublicKey;
  }

  if (!StrKey.isValidEd25519PublicKey(address)) {
    throw new Error(`resolveBasePublicKey: "${address}" is not a valid G- or M-address`);
  }

  return address;
}

// ---------------------------------------------------------------------------
// Payment operation builder
// ---------------------------------------------------------------------------

/**
 * Builds a Stellar payment operation that transparently handles both plain
 * G-addresses and muxed M-addresses as the destination.
 *
 * When the destination is an M-address the operation is built with the full
 * muxed account XDR so that the embedded memo ID is preserved on-chain without
 * requiring a separate text/id memo field.
 *
 * @param opts Payment options including destination, asset, and amount.
 * @returns    The XDR operation, the resolved base key, and the optional memo ID.
 *
 * @example
 * ```ts
 * const { operation, resolvedBaseKey, memoId } = buildMuxedPayment({
 *   destination: 'MA7QYNF7SOWQ3GLR2BGMZEHXR77V3YXVITDF...',
 *   asset:       Asset.native(),
 *   amount:      '100',
 * });
 * builder.addOperation(operation);
 * ```
 */
export function buildMuxedPayment(opts: MuxedPaymentOpts): MuxedPaymentResult {
  const { destination, asset, amount, sourceAccount } = opts;

  if (isMuxedAddress(destination)) {
    const { basePublicKey, memoId } = decodeMuxedAddress(destination);

    // Build as a muxed account payment using the full XDR muxed account type
    const operation = Operation.payment({
      destination,
      asset,
      amount,
      ...(sourceAccount ? { source: sourceAccount } : {}),
    });

    return { operation, resolvedBaseKey: basePublicKey, memoId };
  }

  // Plain G-address path
  if (!StrKey.isValidEd25519PublicKey(destination)) {
    throw new Error(`buildMuxedPayment: invalid destination address "${destination}"`);
  }

  const operation = Operation.payment({
    destination,
    asset,
    amount,
    ...(sourceAccount ? { source: sourceAccount } : {}),
  });

  return { operation, resolvedBaseKey: destination };
}

// ---------------------------------------------------------------------------
// Policy engine helpers
// ---------------------------------------------------------------------------

/**
 * Checks whether a destination address (G- or M-) is present in an allow-list
 * of G-addresses. The comparison is always performed against the base public key
 * so that different sub-accounts sharing the same G-address are all matched.
 *
 * @param address   Destination to validate (G- or M-address).
 * @param allowList Set / array of permitted G-addresses.
 * @returns         true when the underlying account is in the allow-list.
 */
export function isPolicyAllowed(
  address: string,
  allowList: string[] | Set<string>,
): boolean {
  const baseKey = resolveBasePublicKey(address);
  const set = allowList instanceof Set ? allowList : new Set(allowList);
  return set.has(baseKey);
}

/**
 * Checks whether a destination address (G- or M-) appears in a deny-list of
 * G-addresses. Returns true (blocked) when the underlying account is listed.
 *
 * @param address  Destination to validate (G- or M-address).
 * @param denyList Set / array of blocked G-addresses.
 * @returns        true when the underlying account is blocked.
 */
export function isPolicyDenied(
  address: string,
  denyList: string[] | Set<string>,
): boolean {
  const baseKey = resolveBasePublicKey(address);
  const set = denyList instanceof Set ? denyList : new Set(denyList);
  return set.has(baseKey);
}
