import { useCallback, useState } from "react";
import { useLumen } from "./context.js";

export interface SendPaymentParams {
  walletId: string;
  destination: string;
  assetCode: string;
  amount: string;
}

export interface SendPaymentResult {
  hash: string;
}

export interface UseSendPaymentResult {
  sendPayment: (params: SendPaymentParams) => Promise<SendPaymentResult>;
  loading: boolean;
  error: Error | null;
  data: SendPaymentResult | undefined;
  reset: () => void;
}

export function useSendPayment(): UseSendPaymentResult {
  const { client } = useLumen();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<SendPaymentResult>();

  const sendPayment = useCallback(
    async ({
      walletId,
      destination,
      assetCode,
      amount,
    }: SendPaymentParams): Promise<SendPaymentResult> => {
      setLoading(true);
      setError(null);

      try {
        const result = await client.sendPayment(
          walletId,
          destination,
          assetCode,
          amount
        );

        setData(result);

        return result;
      } catch (error) {
        const normalizedError =
          error instanceof Error ? error : new Error(String(error));

        setError(normalizedError);
        throw normalizedError;
      } finally {
        setLoading(false);
      }
    },
    [client]
  );

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setData(undefined);
  }, []);

  return {
    sendPayment,
    loading,
    error,
    data,
    reset,
  };
}