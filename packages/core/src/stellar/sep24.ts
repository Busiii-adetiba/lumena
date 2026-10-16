/**
 * SEP-0024: Hosted Deposit and Withdrawal Interactive Flow Integration
 *
 * Implements the client-side of the SEP-0024 protocol, enabling gasless wallets
 * to perform fiat on/off-ramping through regulated Stellar anchor partners.
 *
 * Covers:
 *  - GET /info          — Discover supported assets and anchor capabilities
 *  - POST /transactions/deposit/interactive   — Initiate an interactive deposit
 *  - POST /transactions/withdraw/interactive  — Initiate an interactive withdrawal
 *  - GET /transaction   — Poll a single transaction for status updates
 *  - GET /transactions  — List multiple transactions for an account
 *
 * Reference: https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0024.md
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Asset entry returned by the anchor's GET /info endpoint. */
export interface Sep24AssetInfo {
  /** Whether the anchor supports deposits for this asset. */
  depositEnabled: boolean;
  /** Whether the anchor supports withdrawals for this asset. */
  withdrawEnabled: boolean;
  /** Minimum deposit amount (asset units). */
  depositMinAmount?: number;
  /** Maximum deposit amount (asset units). */
  depositMaxAmount?: number;
  /** Minimum withdrawal amount (asset units). */
  withdrawMinAmount?: number;
  /** Maximum withdrawal amount (asset units). */
  withdrawMaxAmount?: number;
  /** Fixed fee per deposit (asset units). */
  depositFeeFixed?: number;
  /** Percentage fee per deposit. */
  depositFeePercent?: number;
  /** Fixed fee per withdrawal (asset units). */
  withdrawFeeFixed?: number;
  /** Percentage fee per withdrawal. */
  withdrawFeePercent?: number;
}

/** Full response from the anchor's GET /info endpoint. */
export interface Sep24Info {
  /** Map of asset code to asset info. */
  assets: Record<string, Sep24AssetInfo>;
  /**
   * Whether the anchor requires authentication (SEP-10 JWT) for interactive
   * flows. Most production anchors set this to true.
   */
  authenticationRequired: boolean;
}

/** Kind of SEP-24 interactive flow. */
export type Sep24FlowKind = 'deposit' | 'withdraw';

/** Options for initiating an interactive deposit or withdrawal session. */
export interface Sep24InteractiveOpts {
  /** Stellar asset code (e.g. "USDC"). */
  assetCode: string;
  /** Stellar account that will send/receive the funds. */
  account: string;
  /** Optional SEP-10 JWT for authenticated anchors. */
  jwt?: string;
  /** Additional anchor-specific key/value fields. */
  extraFields?: Record<string, string>;
}

/** Response returned after initiating an interactive flow. */
export interface Sep24InteractiveResult {
  /** Unique transaction ID assigned by the anchor. */
  id: string;
  /** The hosted interactive URL to open in a browser / WebView. */
  url: string;
  /** The type of interactive response — always "interactive_customer_info_needed". */
  type: string;
}

/** All possible SEP-24 transaction status values. */
export type Sep24TransactionStatus =
  | 'incomplete'
  | 'pending_user_transfer_start'
  | 'pending_user_transfer_complete'
  | 'pending_external'
  | 'pending_anchor'
  | 'pending_stellar'
  | 'pending_trust'
  | 'pending_user'
  | 'completed'
  | 'no_market'
  | 'too_small'
  | 'too_large'
  | 'error';

/** A single SEP-24 transaction record. */
export interface Sep24Transaction {
  /** Unique transaction identifier. */
  id: string;
  /** Kind of transaction. */
  kind: Sep24FlowKind;
  /** Current status. */
  status: Sep24TransactionStatus;
  /** Estimated seconds until the next status transition. */
  statusEta?: number;
  /** Amount the user is depositing or withdrawing. */
  amountIn?: string;
  /** Amount the user will receive after fees. */
  amountOut?: string;
  /** Fee charged by the anchor. */
  amountFee?: string;
  /** Stellar asset code. */
  assetCode?: string;
  /** ISO-8601 timestamp when the transaction was initiated. */
  startedAt?: string;
  /** ISO-8601 timestamp when the transaction reached a terminal state. */
  completedAt?: string;
  /** Stellar transaction hash after funds are moved on-chain. */
  stellarTransactionId?: string;
  /** External (off-chain) transaction ID. */
  externalTransactionId?: string;
  /** Human-readable message from the anchor. */
  message?: string;
  /** URL with more information about the transaction. */
  moreInfoUrl?: string;
}

/** Options for polling a transaction. */
export interface Sep24PollOpts {
  /** How often to check (milliseconds). Defaults to 3000. */
  intervalMs?: number;
  /** Maximum number of poll attempts before giving up. Defaults to 60. */
  maxAttempts?: number;
  /** Callback invoked on every status update. */
  onStatusUpdate?: (tx: Sep24Transaction) => void;
}

// ---------------------------------------------------------------------------
// Sep24Client
// ---------------------------------------------------------------------------

/**
 * Client for interacting with a SEP-0024-compliant Stellar anchor.
 *
 * @example
 * ```ts
 * const anchor = new Sep24Client('https://anchor.example.com');
 * const info   = await anchor.fetchInfo();
 * const result = await anchor.initiateDeposit({
 *   assetCode: 'USDC',
 *   account:   'G...',
 *   jwt:       '<sep10-jwt>',
 * });
 * window.open(result.url);
 * const tx = await anchor.pollTransaction(result.id);
 * ```
 */
export class Sep24Client {
  /** Base URL of the anchor transfer server (no trailing slash). */
  readonly anchorUrl: string;

  constructor(anchorUrl: string) {
    this.anchorUrl = anchorUrl.replace(/\/$/, '');
  }

  // -------------------------------------------------------------------------
  // GET /info
  // -------------------------------------------------------------------------

  /**
   * Fetches the anchor's capability info, including supported assets and
   * whether SEP-10 authentication is required.
   */
  async fetchInfo(): Promise<Sep24Info> {
    const response = await fetch(`${this.anchorUrl}/info`);
    if (!response.ok) {
      throw new Error(
        `SEP-24 GET /info failed: ${response.status} ${response.statusText}`,
      );
    }

    const raw = (await response.json()) as any;
    const assets: Record<string, Sep24AssetInfo> = {};

    for (const [code, entry] of Object.entries<any>(raw.assets ?? {})) {
      const dep = entry.deposit ?? {};
      const wit = entry.withdraw ?? {};
      assets[code] = {
        depositEnabled:     dep.enabled    ?? false,
        withdrawEnabled:    wit.enabled    ?? false,
        depositMinAmount:   dep.min_amount,
        depositMaxAmount:   dep.max_amount,
        withdrawMinAmount:  wit.min_amount,
        withdrawMaxAmount:  wit.max_amount,
        depositFeeFixed:    dep.fee_fixed,
        depositFeePercent:  dep.fee_percent,
        withdrawFeeFixed:   wit.fee_fixed,
        withdrawFeePercent: wit.fee_percent,
      };
    }

    return {
      assets,
      authenticationRequired: raw.authentication_required ?? false,
    };
  }

  // -------------------------------------------------------------------------
  // Interactive session initiation
  // -------------------------------------------------------------------------

  /**
   * Initiates an interactive deposit session and returns the anchor-hosted URL
   * that the user must visit to complete the fiat payment.
   */
  async initiateDeposit(opts: Sep24InteractiveOpts): Promise<Sep24InteractiveResult> {
    return this.initiateInteractive('deposit', opts);
  }

  /**
   * Initiates an interactive withdrawal session and returns the anchor-hosted
   * URL that the user must visit to authorise the off-ramp.
   */
  async initiateWithdrawal(opts: Sep24InteractiveOpts): Promise<Sep24InteractiveResult> {
    return this.initiateInteractive('withdraw', opts);
  }

  /**
   * Internal helper that POSTs to the correct interactive endpoint.
   */
  private async initiateInteractive(
    kind: Sep24FlowKind,
    opts: Sep24InteractiveOpts,
  ): Promise<Sep24InteractiveResult> {
    const endpoint =
      kind === 'deposit'
        ? '/transactions/deposit/interactive'
        : '/transactions/withdraw/interactive';

    const body = new FormData();
    body.append('asset_code', opts.assetCode);
    body.append('account', opts.account);

    for (const [key, value] of Object.entries(opts.extraFields ?? {})) {
      body.append(key, value);
    }

    const headers: Record<string, string> = {};
    if (opts.jwt) {
      headers['Authorization'] = `Bearer ${opts.jwt}`;
    }

    const response = await fetch(`${this.anchorUrl}${endpoint}`, {
      method: 'POST',
      headers,
      body,
    });

    if (!response.ok) {
      const text = await response.text().catch(() => response.statusText);
      throw new Error(`SEP-24 ${endpoint} failed: ${response.status} — ${text}`);
    }

    const raw = (await response.json()) as any;
    return {
      id:   raw.id,
      url:  raw.url,
      type: raw.type ?? 'interactive_customer_info_needed',
    };
  }

  // -------------------------------------------------------------------------
  // Transaction fetching
  // -------------------------------------------------------------------------

  /**
   * Fetches a single transaction by its anchor-assigned ID.
   *
   * @param id  The transaction ID returned by initiateDeposit or initiateWithdrawal.
   * @param jwt Optional SEP-10 JWT for authenticated anchors.
   */
  async fetchTransaction(id: string, jwt?: string): Promise<Sep24Transaction> {
    const url = `${this.anchorUrl}/transaction?id=${encodeURIComponent(id)}`;
    const headers: Record<string, string> = {};
    if (jwt) headers['Authorization'] = `Bearer ${jwt}`;

    const response = await fetch(url, { headers });
    if (!response.ok) {
      throw new Error(
        `SEP-24 GET /transaction failed: ${response.status} ${response.statusText}`,
      );
    }

    const raw = (await response.json()) as any;
    return mapRawTransaction(raw.transaction ?? raw);
  }

  /**
   * Lists transactions for an account, optionally filtered by asset and status.
   *
   * @param account Stellar account public key.
   * @param jwt     Optional SEP-10 JWT.
   * @param params  Additional query parameters (e.g. asset_code, no_older_than).
   */
  async fetchTransactions(
    account: string,
    jwt?: string,
    params: Record<string, string> = {},
  ): Promise<Sep24Transaction[]> {
    const qs = new URLSearchParams({ account, ...params }).toString();
    const url = `${this.anchorUrl}/transactions?${qs}`;
    const headers: Record<string, string> = {};
    if (jwt) headers['Authorization'] = `Bearer ${jwt}`;

    const response = await fetch(url, { headers });
    if (!response.ok) {
      throw new Error(
        `SEP-24 GET /transactions failed: ${response.status} ${response.statusText}`,
      );
    }

    const raw = (await response.json()) as any;
    return (raw.transactions ?? []).map(mapRawTransaction);
  }

  // -------------------------------------------------------------------------
  // Polling
  // -------------------------------------------------------------------------

  /**
   * Polls a transaction until it reaches a terminal state (completed or an
   * error-like status) and returns the final record.
   *
   * @param id   Transaction ID to track.
   * @param jwt  Optional SEP-10 JWT.
   * @param opts Polling configuration.
   */
  async pollTransaction(
    id: string,
    jwt?: string,
    opts: Sep24PollOpts = {},
  ): Promise<Sep24Transaction> {
    const intervalMs  = opts.intervalMs  ?? 3_000;
    const maxAttempts = opts.maxAttempts ?? 60;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const tx = await this.fetchTransaction(id, jwt);
      opts.onStatusUpdate?.(tx);

      if (isTerminalStatus(tx.status)) {
        return tx;
      }

      await sleep(intervalMs);
    }

    throw new Error(
      `SEP-24 pollTransaction timed out after ${maxAttempts} attempts for transaction ${id}`,
    );
  }
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

const TERMINAL_STATUSES: ReadonlySet<Sep24TransactionStatus> = new Set([
  'completed',
  'no_market',
  'too_small',
  'too_large',
  'error',
]);

function isTerminalStatus(status: Sep24TransactionStatus): boolean {
  return TERMINAL_STATUSES.has(status);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Maps a raw anchor JSON transaction object to the typed Sep24Transaction
 * interface, normalising snake_case field names.
 */
function mapRawTransaction(raw: any): Sep24Transaction {
  return {
    id:                    raw.id,
    kind:                  raw.kind as Sep24FlowKind,
    status:                raw.status as Sep24TransactionStatus,
    statusEta:             raw.status_eta,
    amountIn:              raw.amount_in,
    amountOut:             raw.amount_out,
    amountFee:             raw.amount_fee,
    assetCode:             raw.asset_code,
    startedAt:             raw.started_at,
    completedAt:           raw.completed_at,
    stellarTransactionId:  raw.stellar_transaction_id,
    externalTransactionId: raw.external_transaction_id,
    message:               raw.message,
    moreInfoUrl:           raw.more_info_url,
  };
}
