import type { StellarClient } from "@lumen/core";

export interface SponsorMonitorOpts {
  client: StellarClient;
  sponsorPublicKey: string;
  minBalanceXlm?: number;
  pollIntervalMs?: number;
  onLowBalance?: (balance: number, threshold: number) => void | Promise<void>;
  webhookUrl?: string;
}

export interface CheckBalanceResult {
  balance: number;
  isLow: boolean;
  threshold: number;
}

export class SponsorMonitorService {
  private client: StellarClient;
  private sponsorPublicKey: string;
  private minBalanceXlm: number;
  private pollIntervalMs: number;
  private onLowBalance?: (balance: number, threshold: number) => void | Promise<void>;
  private webhookUrl?: string;
  private intervalId: NodeJS.Timeout | null = null;

  constructor(opts: SponsorMonitorOpts) {
    this.client = opts.client;
    this.sponsorPublicKey = opts.sponsorPublicKey;

    const envMinBalance = process.env.SPONSOR_MIN_BALANCE
      ? parseFloat(process.env.SPONSOR_MIN_BALANCE)
      : undefined;
    this.minBalanceXlm = opts.minBalanceXlm ?? envMinBalance ?? 50;

    const envPollInterval = process.env.SPONSOR_POLL_INTERVAL_MS
      ? parseInt(process.env.SPONSOR_POLL_INTERVAL_MS, 10)
      : undefined;
    this.pollIntervalMs = opts.pollIntervalMs ?? envPollInterval ?? 60000;

    this.onLowBalance = opts.onLowBalance;
    this.webhookUrl = opts.webhookUrl ?? process.env.SPONSOR_ALERT_WEBHOOK_URL;
  }

  get isRunning(): boolean {
    return this.intervalId !== null;
  }

  async checkBalance(): Promise<CheckBalanceResult> {
    try {
      const account = await this.client.horizon.loadAccount(this.sponsorPublicKey);
      const nativeBalanceLine = account.balances.find(
        (b) => b.asset_type === "native"
      );

      const balance = nativeBalanceLine ? parseFloat(nativeBalanceLine.balance) : 0;
      const isLow = balance < this.minBalanceXlm;

      if (isLow) {
        console.warn(
          `[SponsorMonitorService] WARNING: Sponsor account ${this.sponsorPublicKey} balance (${balance} XLM) is below minimum threshold (${this.minBalanceXlm} XLM)`
        );

        if (this.onLowBalance) {
          try {
            await this.onLowBalance(balance, this.minBalanceXlm);
          } catch (err) {
            console.error("[SponsorMonitorService] Error executing onLowBalance alert callback:", err);
          }
        }

        if (this.webhookUrl) {
          try {
            await fetch(this.webhookUrl, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                event: "sponsor_low_balance",
                sponsorPublicKey: this.sponsorPublicKey,
                balance,
                threshold: this.minBalanceXlm,
                timestamp: new Date().toISOString(),
              }),
            });
          } catch (err) {
            console.error("[SponsorMonitorService] Failed to send webhook alert:", err);
          }
        }
      }

      return { balance, isLow, threshold: this.minBalanceXlm };
    } catch (error) {
      console.error(`[SponsorMonitorService] Error loading sponsor account ${this.sponsorPublicKey}:`, error);
      throw error;
    }
  }

  start(): void {
    if (this.intervalId) return;

    // Trigger initial check asynchronously
    this.checkBalance().catch(() => {});

    this.intervalId = setInterval(() => {
      this.checkBalance().catch(() => {});
    }, this.pollIntervalMs);
  }

  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}
