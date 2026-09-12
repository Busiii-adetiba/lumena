# @lumen/react

React context provider and hooks for integrating Lumen into React applications.

## Installation

```bash
pnpm add @lumen/react @lumen/web-sdk
```

## Quick Start

```tsx
import { LumenClient } from "@lumen/web-sdk";
import {
  LumenProvider,
  useWallet,
  useBalance,
  useSendPayment,
} from "@lumen/react";

const lumenClient = new LumenClient({
  network: "testnet",
  sponsorSecret: process.env.FEE_PAYER_SECRET!,
  serverPublicKey: process.env.COSIGNER_PUBLIC_KEY!,
});

function WalletBalance({ walletId }: { walletId: string }) {
  const { balance, loading, error } = useBalance(walletId, "USDC");

  if (loading) return <p>Loading balance...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return <p>Balance: {balance}</p>;
}

function WalletDetails({ walletId }: { walletId: string }) {
  const { wallet, error } = useWallet(walletId);

  if (error) return <p>Error: {error.message}</p>;

  return <p>Address: {wallet?.address}</p>;
}

function SendPaymentButton() {
  const { sendPayment, loading, error } = useSendPayment();

  async function handleSend() {
    await sendPayment({
      walletId: "wallet-id",
      destination: "destination-address",
      assetCode: "USDC",
      amount: "10",
    });
  }

  return (
    <>
      <button onClick={handleSend} disabled={loading}>
        {loading ? "Sending..." : "Send payment"}
      </button>
      {error && <p>Error: {error.message}</p>}
    </>
  );
}

export function App() {
  return (
    <LumenProvider client={lumenClient}>
      <WalletBalance walletId="wallet-id" />
      <WalletDetails walletId="wallet-id" />
      <SendPaymentButton />
    </LumenProvider>
  );
}
```

> **Security:** Keep `sponsorSecret` server-side. Do not expose it in browser bundles or commit it to source control.

## API

### `LumenProvider`

Provides a `LumenClient` instance to descendant components.

```tsx
<LumenProvider client={lumenClient}>
  {children}
</LumenProvider>
```

### `useLumen()`

Returns the Lumen client from the nearest `LumenProvider`.

```tsx
const { client } = useLumen();
```

Throws an error when used outside a `LumenProvider`.

### `useWallet(walletId)`

Returns the wallet associated with the supplied wallet ID.

```tsx
const { wallet, error, refetch } = useWallet(walletId);
```

### `useBalance(walletId, assetCode?)`

Fetches a wallet balance and automatically refreshes it every 10 seconds by default.

```tsx
const { balance, loading, error, refetch } = useBalance(walletId, "USDC");
```

Pass a third argument to customize the refresh interval in milliseconds. Use `0` or a negative value to disable automatic refresh.

### `useSendPayment()`

Provides a function for sending a payment and exposes loading, error, and result state.

```tsx
const { sendPayment, loading, error, data, reset } = useSendPayment();

await sendPayment({
  walletId,
  destination,
  assetCode,
  amount,
});
```

## Development

From the repository root:

```bash
pnpm --filter @lumen/react lint
pnpm --filter @lumen/react typecheck
pnpm --filter @lumen/react test
pnpm --filter @lumen/react build
```

## License

MIT
