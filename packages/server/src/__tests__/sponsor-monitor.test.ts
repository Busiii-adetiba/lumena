import { describe, it, expect, vi } from "vitest";
import { SponsorMonitorService } from "../fee-sponsor/monitor.js";
import type { StellarClient } from "@lumen/core";

describe("SponsorMonitorService Unit Tests", () => {
  it("detects low balance and triggers alerts", async () => {
    const mockClient = {
      horizon: {
        loadAccount: vi.fn().mockResolvedValue({
          balances: [{ asset_type: "native", balance: "25.0000000" }],
        }),
      },
    } as unknown as StellarClient;

    let onLowBalanceCalled = false;
    let reportedBalance = 0;

    const monitor = new SponsorMonitorService({
      client: mockClient,
      sponsorPublicKey: "GSPONSORPUBLICKEYEXAMPLE1234567890",
      minBalanceXlm: 50,
      pollIntervalMs: 1000,
      onLowBalance: (bal) => {
        onLowBalanceCalled = true;
        reportedBalance = bal;
      },
    });

    const result = await monitor.checkBalance();

    expect(result.isLow).toBe(true);
    expect(result.balance).toBe(25);
    expect(onLowBalanceCalled).toBe(true);
    expect(reportedBalance).toBe(25);
  });

  it("approves balance above threshold", async () => {
    const mockClient = {
      horizon: {
        loadAccount: vi.fn().mockResolvedValue({
          balances: [{ asset_type: "native", balance: "150.0000000" }],
        }),
      },
    } as unknown as StellarClient;

    const monitor = new SponsorMonitorService({
      client: mockClient,
      sponsorPublicKey: "GSPONSORPUBLICKEYEXAMPLE1234567890",
      minBalanceXlm: 50,
    });

    const result = await monitor.checkBalance();

    expect(result.isLow).toBe(false);
    expect(result.balance).toBe(150);
  });

  it("starts and stops polling interval cleanly", () => {
    const mockClient = {
      horizon: {
        loadAccount: vi.fn().mockResolvedValue({
          balances: [{ asset_type: "native", balance: "100.0000000" }],
        }),
      },
    } as unknown as StellarClient;

    const monitor = new SponsorMonitorService({
      client: mockClient,
      sponsorPublicKey: "GSPONSORPUBLICKEYEXAMPLE1234567890",
      pollIntervalMs: 100,
    });

    expect(monitor.isRunning).toBe(false);
    monitor.start();
    expect(monitor.isRunning).toBe(true);
    monitor.stop();
    expect(monitor.isRunning).toBe(false);
  });
});
