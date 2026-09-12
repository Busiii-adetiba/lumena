import { useCallback, useState } from "react";
import type { Wallet } from "@lumen/core";
import { useLumen } from "./context.js";

export interface UseWalletResult {
  wallet: Wallet | undefined;
  error: Error | null;
  refetch: () => void;
}

export function useWallet(walletId: string): UseWalletResult {
  const { client } = useLumen();

  const [wallet, setWallet] = useState<Wallet | undefined>(() =>
    client.getWallet(walletId)
  );
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(() => {
    try {
      setError(null);
      setWallet(client.getWallet(walletId));
    } catch (error) {
      setError(
        error instanceof Error ? error : new Error(String(error))
      );
    }
  }, [client, walletId]);

  return {
    wallet,
    error,
    refetch,
  };
}