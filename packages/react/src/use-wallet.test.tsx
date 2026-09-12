import { renderHook, act } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import type { LumenClient } from "@lumen/web-sdk";

import { LumenProvider } from "./context.js";
import { useWallet } from "./use-wallet.js";

describe("useWallet", () => {
  it("returns the wallet from the Lumen client", () => {
    const wallet = {} as ReturnType<LumenClient["getWallet"]>;
    const getWallet = vi.fn().mockReturnValue(wallet);

    const client = {
      getWallet,
    } as unknown as LumenClient;

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <LumenProvider client={client}>{children}</LumenProvider>
    );

    const { result } = renderHook(() => useWallet("wallet-1"), {
      wrapper,
    });

    expect(result.current.wallet).toBe(wallet);
    expect(getWallet).toHaveBeenCalledWith("wallet-1");
  });

  it("returns undefined when the wallet does not exist", () => {
    const client = {
      getWallet: vi.fn().mockReturnValue(undefined),
    } as unknown as LumenClient;

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <LumenProvider client={client}>{children}</LumenProvider>
    );

    const { result } = renderHook(() => useWallet("missing"), {
      wrapper,
    });

    expect(result.current.wallet).toBeUndefined();
  });

  it("refetches the wallet", () => {
    const firstWallet = {} as ReturnType<LumenClient["getWallet"]>;
    const secondWallet = {} as ReturnType<LumenClient["getWallet"]>;

    const getWallet = vi
      .fn()
      .mockReturnValueOnce(firstWallet)
      .mockReturnValueOnce(secondWallet);

    const client = { getWallet } as unknown as LumenClient;

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <LumenProvider client={client}>{children}</LumenProvider>
    );

    const { result } = renderHook(() => useWallet("wallet-1"), {
      wrapper,
    });

    expect(result.current.wallet).toBe(firstWallet);

    act(() => {
      result.current.refetch();
    });

    expect(result.current.wallet).toBe(secondWallet);
    expect(getWallet).toHaveBeenCalledTimes(2);
  });
});