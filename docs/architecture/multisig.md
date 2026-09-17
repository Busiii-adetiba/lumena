# 2-of-2 Multisig Architecture

Every Lumen user wallet is an on-chain 2-of-2 multisig account:

- **Signer 1 (User)**: Hardware-backed passkey or client device key (weight 1).
- **Signer 2 (Server)**: Co-signer key held securely in KMS or HSM (weight 1).
- **Thresholds**: Low: 1, Med: 2, High: 2.

Neither party can unilaterally drain funds.
