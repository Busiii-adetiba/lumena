import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, afterEach } from "vitest";

import type { LumenClient } from "@lumen/web-sdk";
import { LumenProvider } from "./context.js";
import { useBalance } from "./use-balance.js";

describe("useBalance", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("loads the wallet balance", async () => {
    const getBalance = vi.fn().mockResolvedValue("125.50");

    const client = {
      getBalance,
    } as unknown as LumenClient;

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <LumenProvider client={client}>{children}</LumenProvider>
    );

    const { result } = renderHook(
      () => useBalance("wallet-1", "XLM", 0),
      { wrapper }
    );

    await waitFor(() => {
      expect(result.current.balance).toBe("125.50");
    });

    expect(getBalance).toHaveBeenCalledWith("wallet-1", "XLM");
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("handles balance errors", async () => {
    const getBalance = vi
      .fn()
      .mockRejectedValue(new Error("Wallet not found"));

    const client = {
      getBalance,
    } as unknown as LumenClient;

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <LumenProvider client={client}>{children}</LumenProvider>
    );

    const { result } = renderHook(
      () => useBalance("wallet-1", "XLM", 0),
      { wrapper }
    );

    await waitFor(() => {
      expect(result.current.error?.message).toBe("Wallet not found");
    });

    expect(result.current.loading).toBe(false);
  });

  it("refreshes the balance automatically", async () => {
    vi.useFakeTimers();

    const getBalance = vi
      .fn()
      .mockResolvedValueOnce("100")
      .mockResolvedValueOnce("125");

    const client = {
      getBalance,
    } as unknown as LumenClient;

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <LumenProvider client={client}>{children}</LumenProvider>
    );

    const { result } = renderHook(
      () => useBalance("wallet-1", "XLM", 5_000),
      { wrapper }
    );

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.balance).toBe("100");

    await act(async () => {
      vi.advanceTimersByTime(5_000);
      await Promise.resolve();
    });

    expect(result.current.balance).toBe("125");
    expect(getBalance).toHaveBeenCalledTimes(2);
  });
});