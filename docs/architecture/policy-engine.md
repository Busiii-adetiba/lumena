# PolicyEngine Architecture

Lumen's \`PolicyEngine\` evaluates every transaction before co-signing to protect user funds:

- **Spend Limits**: Per-transaction and daily ceilings evaluated per asset (e.g. XLM vs USDC).
- **Multi-Op Checking**: Sums amounts across all payment operations in the transaction.
- **Allowlists**: Verifies all payment and path payment destinations against approved addresses.
- **Velocity Limits**: Caps the number of transactions permitted within sliding time windows.
- **Session Keys**: Enforces expiration timestamps and cumulative spend allowances for delegated keys.
