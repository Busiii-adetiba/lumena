# Open Issues & Development Roadmap

Welcome to the **Lumen** open-source roadmap! We welcome contributions from developers of all skill levels. Whether you are looking for a `good first issue` or a complex architecture challenge, there is an open issue for you.

To start contributing:
1. **Fork the repository** to your personal GitHub account.
2. **Clone your fork**: `git clone https://github.com/<your-username>/lumena.git`
3. **Pick an issue** from the directory below or on [GitHub Issues](https://github.com/utilityjnr1/lumena/issues).
4. **Create a branch**: `git checkout -b feature/issue-<number>`
5. **Submit a Pull Request** referencing the issue number!

---

## Issue Directory

### Completed Core Issues (Batch #1 - #20)

| # | Issue Title | Category | Status | GitHub Link |
|---|---|---|---|---|---|
| 1 | `[Feature] Redis / Database Persistence Driver for PolicyEngine` | Server / Architecture | `Completed` | [#1](https://github.com/utilityjnr1/lumena/issues/1) |
| 2 | `[Security] Multi-Operation & Path Payment Validation in PolicyEngine` | Security / Engine | `Completed` | [#2](https://github.com/utilityjnr1/lumena/issues/2) |
| 3 | `[Feature] Asset-Specific Spend Limits in PolicyEngine` | Policy Engine | `Completed` | [#3](https://github.com/utilityjnr1/lumena/issues/3) |
| 4 | `[Feature] API Authentication & Rate Limiting Middleware for Server` | Security / Server | `Completed` | [#4](https://github.com/utilityjnr1/lumena/issues/4) |
| 5 | `[DX] React Context Provider and Custom Hooks Package (@lumen/react)` | Frontend / React | `Completed` | [#5](https://github.com/utilityjnr1/lumena/issues/5) |
| 6 | `[Feature] Soroban Smart Contract Invocation Support in Core & SDK` | Stellar / Soroban | `Completed` | [#6](https://github.com/utilityjnr1/lumena/issues/6) |
| 7 | `[Feature] Google Cloud KMS & HashiCorp Vault Signer Implementations` | Cloud / KMS | `Completed` | [#7](https://github.com/utilityjnr1/lumena/issues/7) |
| 8 | `[Feature] Webhooks Notification Dispatcher in Server` | Server / Webhooks | `Completed` | [#8](https://github.com/utilityjnr1/lumena/issues/8) |
| 9 | `[Feature] TimeBounds & Expiration Enforcement on Cosigned Transactions` | Security | `Completed` | [#9](https://github.com/utilityjnr1/lumena/issues/9) |
| 10 | `[Feature] Sponsor Account Balance Monitoring & Alerting` | Server / DevOps | `Completed` | [#10](https://github.com/utilityjnr1/lumena/issues/10) |
| 11 | `[Feature] Session Keys & Scoped Temporary Delegation` | Cryptography / Core | `Completed` | [#11](https://github.com/utilityjnr1/lumena/issues/11) |
| 12 | `[Feature] Administrative Command-Line Tool (@lumen/cli)` | Tooling / CLI | `Completed` | [#12](https://github.com/utilityjnr1/lumena/issues/12) |
| 13 | `[Feature] Prometheus Metrics & Health Details Endpoint` | Observability | `Completed` | [#13](https://github.com/utilityjnr1/lumena/issues/13) |
| 14 | `[Feature] WebAuthn / Passkey Signer Integration` | Authentication | `Completed` | [#14](https://github.com/utilityjnr1/lumena/issues/14) |
| 15 | `[DX] Structured Logging Framework with Pino` | Observability | `Completed` | [#15](https://github.com/utilityjnr1/lumena/issues/15) |
| 16 | `[Feature] OpenAPI / Swagger Spec & UI for Server API` | Documentation | `Completed` | [#16](https://github.com/utilityjnr1/lumena/issues/16) |
| 17 | `[DX] Interactive Playground Example App (examples/playground)` | Example App | `Completed` | [#17](https://github.com/utilityjnr1/lumena/issues/17) |
| 18 | `[Feature] SEP-41 Soroban Token Helpers in Web SDK` | Soroban / Web SDK | `Completed` | [#18](https://github.com/utilityjnr1/lumena/issues/18) |
| 19 | `[Testing] End-to-End E2E Browser Test Suite with Playwright` | Testing | `Completed` | [#19](https://github.com/utilityjnr1/lumena/issues/19) |
| 20 | `[CI/CD] GitHub Actions Workflows & Issue Templates` | CI/CD / DevOps | `Completed` | [#20](https://github.com/utilityjnr1/lumena/issues/20) |

### Previous Contributor Issues (Batch #162 - #191)

| # | Issue Title | Category | Status | GitHub Link |
|---|---|---|---|---|---|
| 162 | `[Feature] Add BIP-39 mnemonic phrase wallet generation and recovery to KeyManager` | Core / Keys | `Completed` | [#162](https://github.com/utilityjnr1/lumena/issues/162) |
| 163 | `[Feature] Add revokeSessionKey helper function to @lumen/core` | Core / Stellar | `Completed` | [#163](https://github.com/utilityjnr1/lumena/issues/163) |
| 164 | `[Feature] Support Futurenet network configuration in StellarClient` | Core / Soroban | `Completed` | [#164](https://github.com/utilityjnr1/lumena/issues/164) |
| 165 | `[Feature] Add parseAsset and formatAsset utility helpers to @lumen/core` | Core / Stellar | `Completed` | [#165](https://github.com/utilityjnr1/lumena/issues/165) |
| 166 | `[Bug] Export buildTransaction from @lumen/core and fix sourceAccount parameter typing` | Core / Stellar | `Completed` | [#166](https://github.com/utilityjnr1/lumena/issues/166) |
| 167 | `[Feature] Add createClaimableBalance helper function to @lumen/core` | Core / Stellar | `Completed` | [#167](https://github.com/utilityjnr1/lumena/issues/167) |
| 168 | `[Feature] Add delete method to KeyManager and persist deletions` | Core / Keys | `Completed` | [#168](https://github.com/utilityjnr1/lumena/issues/168) |
| 169 | `[Feature] Add GET /wallets admin endpoint to query registered wallets` | Server / API | `Completed` | [#169](https://github.com/utilityjnr1/lumena/issues/169) |
| 170 | `[Feature] Add GET /policy endpoint to list all configured policies` | Server / Policy | `Completed` | [#170](https://github.com/utilityjnr1/lumena/issues/170) |
| 171 | `[Feature] Add ContractAllowlistRule policy type for Soroban contract calls` | Policy / Security | `Completed` | [#171](https://github.com/utilityjnr1/lumena/issues/171) |
| 172 | `[Feature] Add FeeLimitRule policy type to enforce maximum allowable transaction fee` | Policy / Security | `Completed` | [#172](https://github.com/utilityjnr1/lumena/issues/172) |
| 173 | `[Feature] Dispatch balance.low webhook event via WebhookDispatcher in SponsorMonitorService` | Server / Webhooks | `Completed` | [#173](https://github.com/utilityjnr1/lumena/issues/173) |
| 174 | `[Feature] Add PATCH /webhooks/:id endpoint to toggle enabled state and update events` | Server / Webhooks | `Completed` | [#174](https://github.com/utilityjnr1/lumena/issues/174) |
| 175 | `[Feature] Add POST /webhooks/:id/test endpoint to trigger a test webhook delivery` | Server / Webhooks | `Completed` | [#175](https://github.com/utilityjnr1/lumena/issues/175) |
| 176 | `[Security] Add AzureKeyVaultSigner implementation for Microsoft Azure Key Vault` | Security / Cloud | `Completed` | [#176](https://github.com/utilityjnr1/lumena/issues/176) |
| 177 | `[Bug] Add memo parameter to Wallet.send() and Wallet.buildPaymentTransaction()` | Core / Stellar | `Completed` | [#177](https://github.com/utilityjnr1/lumena/issues/177) |
| 178 | `[Feature] Support custom HTTP headers and apiKey in LumenClientOpts` | Web SDK / Security | `Completed` | [#178](https://github.com/utilityjnr1/lumena/issues/178) |
| 179 | `[Feature] Add importWallet and exportWallet methods to LumenClient` | Web SDK / Keys | `Completed` | [#179](https://github.com/utilityjnr1/lumena/issues/179) |
| 180 | `[Feature] Add getTransactions method to LumenClient` | Web SDK / API | `Completed` | [#180](https://github.com/utilityjnr1/lumena/issues/180) |
| 181 | `[Feature] Add changeTrust helper method to LumenClient` | Web SDK / Stellar | `Completed` | [#181](https://github.com/utilityjnr1/lumena/issues/181) |
| 182 | `[Bug] Export useTransactionHistory from @lumen/react package index` | React / Hooks | `Completed` | [#182](https://github.com/utilityjnr1/lumena/issues/182) |
| 183 | `[Feature] Add useSessionKey React hook to @lumen/react` | React / Auth | `Completed` | [#183](https://github.com/utilityjnr1/lumena/issues/183) |
| 184 | `[Feature] Add useTrustline React hook to @lumen/react` | React / Stellar | `Completed` | [#184](https://github.com/utilityjnr1/lumena/issues/184) |
| 185 | `[Feature] Add LumenBalance and LumenWalletCard pre-built UI components to @lumen/react` | React / UI | `Completed` | [#185](https://github.com/utilityjnr1/lumena/issues/185) |
| 186 | `[Feature] CLI: add --json global flag to all commands for machine-readable output` | Tooling / CLI | `Completed` | [#186](https://github.com/utilityjnr1/lumena/issues/186) |
| 187 | `[Feature] CLI: add lumen wallet list command to display registered wallets` | Tooling / CLI | `Completed` | [#187](https://github.com/utilityjnr1/lumena/issues/187) |
| 188 | `[Feature] CLI: add lumen config command to save default server URL and API key` | Tooling / CLI | `Completed` | [#188](https://github.com/utilityjnr1/lumena/issues/188) |
| 189 | `[CI/CD] Add CodeQL and dependency audit workflow to GitHub Actions` | CI/CD / Security | `Completed` | [#189](https://github.com/utilityjnr1/lumena/issues/189) |
| 190 | `[Feature] Add examples/session-keys interactive demo app` | Examples / React | `Completed` | [#190](https://github.com/utilityjnr1/lumena/issues/190) |
| 191 | `[Docs] Write docs/guides/gasless-transactions.md comprehensive onboarding guide` | Documentation | `Completed` | [#191](https://github.com/utilityjnr1/lumena/issues/191) |

---

## Active Contributor Issues (Batch #213 - #312: High-Impact Ecosystem Roadmap)

This major batch of 100 high-impact open issues covers critical engineering priorities across **Soroban Smart Contracts**, **Backend High-Throughput Scaling & Security**, **Frontend SDK & UI Components**, **Core Cryptography & Stellar Protocols**, and **DevOps & Tooling**. Every issue is detailed with technical context, implementation requirements, and acceptance criteria.

### Index of Active Batch Issues (#213 - #312)

#### Part 1: Soroban Smart Contracts & On-Chain Account Abstraction (#213 - #232)
| # | Issue Title | Category | Complexity | Status | GitHub Link |
|---|---|---|---|---|---|
| 213 | `[Contract] Native Soroban Smart Account Contract with Pluggable Signers and WebAuthn Verification` | Soroban / Contracts | `Advanced` | `Open` | [#213](https://github.com/utilityjnr1/lumena/issues/213) |
| 214 | `[Contract] Gasless Paymaster Contract for Soroban Invocations with Fee Sponsorship Ledger` | Soroban / Contracts | `Advanced` | `Open` | [#214](https://github.com/utilityjnr1/lumena/issues/214) |
| 215 | `[Contract] On-Chain Session Key Delegation Contract with Granular Method and Resource Whitelists` | Soroban / Contracts | `Intermediate` | `Open` | [#215](https://github.com/utilityjnr1/lumena/issues/215) |
| 216 | `[Contract] Social Recovery and Guardian Timelock Smart Contract for Account Ownership Restoral` | Soroban / Contracts | `Advanced` | `Open` | [#216](https://github.com/utilityjnr1/lumena/issues/216) |
| 217 | `[Contract] SEP-41 Fungible Token Smart Contract Implementation with Comprehensive Mock Test Harness` | Soroban / Contracts | `Intermediate` | `Open` | [#217](https://github.com/utilityjnr1/lumena/issues/217) |
| 218 | `[Contract] Daily Rate-Limited Spending and Allowance Soroban Contract` | Soroban / Contracts | `Intermediate` | `Open` | [#218](https://github.com/utilityjnr1/lumena/issues/218) |
| 219 | `[Contract] Soroban State Archival and Automatic TTL Extension Manager` | Soroban / Contracts | `Advanced` | `Open` | [#219](https://github.com/utilityjnr1/lumena/issues/219) |
| 220 | `[Contract] Multi-Token Escrow and Conditional Settlement Soroban Contract` | Soroban / Contracts | `Intermediate` | `Open` | [#220](https://github.com/utilityjnr1/lumena/issues/220) |
| 221 | `[Contract] Reentrancy Guard and Invariant Assertion Module for Soroban Contracts` | Soroban / Contracts | `Intermediate` | `Open` | [#221](https://github.com/utilityjnr1/lumena/issues/221) |
| 222 | `[Contract] Cross-Contract Invocation Policy Validator with Dynamic Call Graph Inspection` | Soroban / Contracts | `Advanced` | `Open` | [#222](https://github.com/utilityjnr1/lumena/issues/222) |
| 223 | `[Contract] Oracle Price-Feed Consumer Contract for Real-Time USD Spend Limit Enforcement` | Soroban / Contracts | `Advanced` | `Open` | [#223](https://github.com/utilityjnr1/lumena/issues/223) |
| 224 | `[Contract] Upgradeable Proxy Pattern and State Migration Harness for Soroban Smart Accounts` | Soroban / Contracts | `Advanced` | `Open` | [#224](https://github.com/utilityjnr1/lumena/issues/224) |
| 225 | `[Contract] Dead-Man's Switch and Inheritance Vault Soroban Contract` | Soroban / Contracts | `Intermediate` | `Open` | [#225](https://github.com/utilityjnr1/lumena/issues/225) |
| 226 | `[Contract] Threshold Multi-Party ECDSA / Ed25519 Quorum Verifier Contract` | Soroban / Cryptography | `Advanced` | `Open` | [#226](https://github.com/utilityjnr1/lumena/issues/226) |
| 227 | `[Contract] Gasless Non-Fungible Soulbound Identity Token (SBT) Contract for KYC / Policy Attestation` | Soroban / Tokens | `Intermediate` | `Open` | [#227](https://github.com/utilityjnr1/lumena/issues/227) |
| 228 | `[Contract] Automated Batch Settlement and Micro-Payment Streaming Contract` | Soroban / DeFi | `Advanced` | `Open` | [#228](https://github.com/utilityjnr1/lumena/issues/228) |
| 229 | `[Contract] Soroban Contract Event Schema Standard and Structured Topic Indexer` | Soroban / Indexing | `Intermediate` | `Open` | [#229](https://github.com/utilityjnr1/lumena/issues/229) |
| 230 | `[Contract] Soroban Gas and Resource Footprint Profiling Test Suite` | Soroban / Performance | `Intermediate` | `Open` | [#230](https://github.com/utilityjnr1/lumena/issues/230) |
| 231 | `[Contract] Fuzz Testing and Invariant Verification Suite for Smart Account Storage` | Soroban / Testing | `Advanced` | `Open` | [#231](https://github.com/utilityjnr1/lumena/issues/231) |
| 232 | `[Contract] WASM Binary Size Optimization and Strip Pipeline in Docker Build` | Soroban / Build | `Intermediate` | `Open` | [#232](https://github.com/utilityjnr1/lumena/issues/232) |

#### Part 2: Backend Architecture, Server Scaling & Security (#233 - #257)
| # | Issue Title | Category | Complexity | Status | GitHub Link |
|---|---|---|---|---|---|
| 233 | `[Backend] Distributed Sequence Number Reservation & Concurrency Queue Using Redis Redlock` | Server / Concurrency | `Advanced` | `Open` | [#233](https://github.com/utilityjnr1/lumena/issues/233) |
| 234 | `[Backend] Multi-Tenant API Key Management with Scoped Permissions and Tiered Rate Quotas` | Server / Auth | `Intermediate` | `Open` | [#234](https://github.com/utilityjnr1/lumena/issues/234) |
| 235 | `[Backend] SEP-10 Web Authentication Protocol Endpoint with JWT Issuance and Challenge Verification` | Server / Auth | `Advanced` | `Open` | [#235](https://github.com/utilityjnr1/lumena/issues/235) |
| 236 | `[Backend] Webhook Dispatcher Retry Pipeline with Exponential Backoff and Dead-Letter Queue (DLQ)` | Server / Webhooks | `Intermediate` | `Open` | [#236](https://github.com/utilityjnr1/lumena/issues/236) |
| 237 | `[Backend] OpenTelemetry Distributed Tracing Integration Across HTTP, Redis, and Stellar RPC` | Server / Observability | `Intermediate` | `Open` | [#237](https://github.com/utilityjnr1/lumena/issues/237) |
| 238 | `[Backend] Dynamic Policy Engine Reload via Redis Pub/Sub Without Server Restarts` | Server / Policy | `Intermediate` | `Open` | [#238](https://github.com/utilityjnr1/lumena/issues/238) |
| 239 | `[Backend] Hardware Security Module (HSM) PKCS#11 Signer Implementation for Enterprise Custody` | Server / Security | `Advanced` | `Open` | [#239](https://github.com/utilityjnr1/lumena/issues/239) |
| 240 | `[Backend] Multi-Region Stellar Horizon & RPC Latency-Aware Failover Router` | Server / Stellar | `Advanced` | `Open` | [#240](https://github.com/utilityjnr1/lumena/issues/240) |
| 241 | `[Backend] Real-Time Anomaly and Fraud Detection Service for Velocity Spikes and Geo-IP Shifts` | Server / Security | `Advanced` | `Open` | [#241](https://github.com/utilityjnr1/lumena/issues/241) |
| 242 | `[Backend] Relational Database Persistence Layer (Prisma/PostgreSQL) for Policies and Audit Trails` | Server / Database | `Advanced` | `Open` | [#242](https://github.com/utilityjnr1/lumena/issues/242) |
| 243 | `[Backend] Batch Cosigning Endpoint (POST /cosign/batch) with Atomic Policy Evaluation` | Server / API | `Intermediate` | `Open` | [#243](https://github.com/utilityjnr1/lumena/issues/243) |
| 244 | `[Backend] Sliding-Window Token Bucket Rate Limiter per Wallet Address and Client IP` | Server / Middleware | `Intermediate` | `Open` | [#244](https://github.com/utilityjnr1/lumena/issues/244) |
| 245 | `[Backend] RFC 7231 Idempotency-Key Support Across All Mutating Server Endpoints` | Server / Reliability | `Intermediate` | `Open` | [#245](https://github.com/utilityjnr1/lumena/issues/245) |
| 246 | `[Backend] Granular Role-Based Access Control (RBAC) and Audit Logging for Admin APIs` | Server / Security | `Intermediate` | `Open` | [#246](https://github.com/utilityjnr1/lumena/issues/246) |
| 247 | `[Backend] Graceful Shutdown Lifecycle Handler with In-Flight Transaction Draining` | Server / DevOps | `Intermediate` | `Open` | [#247](https://github.com/utilityjnr1/lumena/issues/247) |
| 248 | `[Backend] Tamper-Proof Cryptographic Audit Log with Merkle Tree Hash Chaining` | Server / Cryptography | `Advanced` | `Open` | [#248](https://github.com/utilityjnr1/lumena/issues/248) |
| 249 | `[Backend] Prometheus Alerting Rules, SLO Dashboards, and PagerDuty Webhook Integration` | Server / DevOps | `Intermediate` | `Open` | [#249](https://github.com/utilityjnr1/lumena/issues/249) |
| 250 | `[Backend] WebSocket Server for Live Transaction Broadcasts, Confirmations, and Policy Events` | Server / Realtime | `Intermediate` | `Open` | [#250](https://github.com/utilityjnr1/lumena/issues/250) |
| 251 | `[Backend] Hardened Production Docker Image with Multi-Stage Build and Non-Root User` | Server / Docker | `Intermediate` | `Open` | [#251](https://github.com/utilityjnr1/lumena/issues/251) |
| 252 | `[Backend] Automatic Sponsor Hot-Wallet Refill Service via Exchange API and Horizon Listener` | Server / Sponsor | `Advanced` | `Open` | [#252](https://github.com/utilityjnr1/lumena/issues/252) |
| 253 | `[Backend] Transaction Ingestion and Ledger Reconciliation Worker with Horizon Streaming` | Server / Ledger | `Advanced` | `Open` | [#253](https://github.com/utilityjnr1/lumena/issues/253) |
| 254 | `[Backend] Anti-Replay Nonce Validation and Transaction Cache in Memory and Redis` | Server / Security | `Intermediate` | `Open` | [#254](https://github.com/utilityjnr1/lumena/issues/254) |
| 255 | `[Backend] Dynamic CORS Domain Whitelist Provider with Live Database Backing` | Server / Security | `Beginner` | `Open` | [#255](https://github.com/utilityjnr1/lumena/issues/255) |
| 256 | `[Backend] Health Diagnostics Self-Test Suite and Live Dependency Probing (/health/deep)` | Server / Reliability | `Intermediate` | `Open` | [#256](https://github.com/utilityjnr1/lumena/issues/256) |
| 257 | `[Backend] GraphQL API Gateway with Subscriptions alongside Existing Express REST Endpoints` | Server / API | `Advanced` | `Open` | [#257](https://github.com/utilityjnr1/lumena/issues/257) |

#### Part 3: Frontend SDK, React Hooks & UI Design System (#258 - #282)
| # | Issue Title | Category | Complexity | Status | GitHub Link |
|---|---|---|---|---|---|
| 258 | `[Frontend] Multi-Network Context Switcher and Network Status Bar in @lumen/react` | React / UI | `Intermediate` | `Open` | [#258](https://github.com/utilityjnr1/lumena/issues/258) |
| 259 | `[Frontend] Type-Safe useSorobanContract Hook with Auto-Generated Contract ABIs` | React / Soroban | `Advanced` | `Open` | [#259](https://github.com/utilityjnr1/lumena/issues/259) |
| 260 | `[Frontend] useSocialRecovery React Hook for Orchestrating Multi-Guardian Approval Flows` | React / Security | `Advanced` | `Open` | [#260](https://github.com/utilityjnr1/lumena/issues/260) |
| 261 | `[Frontend] LumenConnectModal Pre-Built Responsive Authentication and Onboarding Modal` | React / UI | `Intermediate` | `Open` | [#261](https://github.com/utilityjnr1/lumena/issues/261) |
| 262 | `[Frontend] useGaslessTransaction Hook with Optimistic State Updates and Auto-Rollback` | React / State | `Intermediate` | `Open` | [#262](https://github.com/utilityjnr1/lumena/issues/262) |
| 263 | `[Frontend] LumenTransactionFeed Real-Time Animated Activity History Component` | React / UI | `Intermediate` | `Open` | [#263](https://github.com/utilityjnr1/lumena/issues/263) |
| 264 | `[Frontend] useTokenAllowance and useApproveToken Hooks for SEP-41 Soroban Tokens` | React / Tokens | `Intermediate` | `Open` | [#264](https://github.com/utilityjnr1/lumena/issues/264) |
| 265 | `[Frontend] Interactive Policy Builder and Spend Limit Editor UI Component` | React / UI | `Intermediate` | `Open` | [#265](https://github.com/utilityjnr1/lumena/issues/265) |
| 266 | `[Frontend] LumenQrScanner Component with Camera Access, Flash Toggle, and URI Parsing` | React / Mobile | `Intermediate` | `Open` | [#266](https://github.com/utilityjnr1/lumena/issues/266) |
| 267 | `[Frontend] Next.js App Router (RSC) Compatibility and Server Action Support in @lumen/react` | React / Next.js | `Advanced` | `Open` | [#267](https://github.com/utilityjnr1/lumena/issues/267) |
| 268 | `[Frontend] Comprehensive Design Tokens and Dark/Light Theme Provider for Lumen UI` | React / Styling | `Intermediate` | `Open` | [#268](https://github.com/utilityjnr1/lumena/issues/268) |
| 269 | `[Frontend] useSessionKeyManager Hook with Expiration Timer, Scoped Limits, and Revocation` | React / Auth | `Intermediate` | `Open` | [#269](https://github.com/utilityjnr1/lumena/issues/269) |
| 270 | `[Frontend] WAI-ARIA Accessible Keyboard Navigation and Screen Reader Tags in All Components` | React / A11y | `Intermediate` | `Open` | [#270](https://github.com/utilityjnr1/lumena/issues/270) |
| 271 | `[Frontend] Encrypted Client-Side Wallet State Persistence Driver (IndexedDB / WebCrypto)` | React / Storage | `Advanced` | `Open` | [#271](https://github.com/utilityjnr1/lumena/issues/271) |
| 272 | `[Frontend] LumenSwapWidget Component for In-App Stellar DEX Path Payment Conversions` | React / DEX | `Advanced` | `Open` | [#272](https://github.com/utilityjnr1/lumena/issues/272) |
| 273 | `[Frontend] useNetworkHealth Hook with RPC Latency Ping and Automatic Failover Alerting` | React / Network | `Intermediate` | `Open` | [#273](https://github.com/utilityjnr1/lumena/issues/273) |
| 274 | `[Frontend] Interactive Storybook Design System and Component Showcase for @lumen/react` | React / Tooling | `Intermediate` | `Open` | [#274](https://github.com/utilityjnr1/lumena/issues/274) |
| 275 | `[Frontend] React Native and Expo Mobile Adaptor Layer for Lumen Core and SDK` | React / Mobile | `Advanced` | `Open` | [#275](https://github.com/utilityjnr1/lumena/issues/275) |
| 276 | `[Frontend] LumenErrorBoundary Component with Crash Reporting and Session Diagnostic Export` | React / Reliability | `Intermediate` | `Open` | [#276](https://github.com/utilityjnr1/lumena/issues/276) |
| 277 | `[Frontend] Toast Notification Dispatcher for Transaction Lifecycle and Policy Warnings` | React / UI | `Intermediate` | `Open` | [#277](https://github.com/utilityjnr1/lumena/issues/277) |
| 278 | `[Frontend] SSR-Safe Hydration Guards for Browser Cryptography and WebAuthn Primitives` | React / Architecture | `Intermediate` | `Open` | [#278](https://github.com/utilityjnr1/lumena/issues/278) |
| 279 | `[Frontend] useMultiSigApproval Hook for Orchestrating Multi-Device Co-Signing Sessions` | React / Multisig | `Advanced` | `Completed` | [#279](https://github.com/utilityjnr1/lumena/issues/279) |
| 280 | `[Frontend] Virtualized List Rendering for High-Volume Transaction Histories in LumenWalletCard` | React / Performance | `Intermediate` | `Completed` | [#280](https://github.com/utilityjnr1/lumena/issues/280) |
| 281 | `[Frontend] Internationalization (i18n) Framework Support across All Prebuilt React Components` | React / i18n | `Intermediate` | `Completed` | [#281](https://github.com/utilityjnr1/lumena/issues/281) |
| 282 | `[Frontend] Revamped Interactive Playground with Real-Time Soroban Contract XDR Inspector` | React / Playground | `Intermediate` | `Completed` | [#282](https://github.com/utilityjnr1/lumena/issues/282) |

#### Part 4: Core Cryptography, Stellar Protocols & Key Management (#283 - #297)
| # | Issue Title | Category | Complexity | Status | GitHub Link |
|---|---|---|---|---|---|
| 283 | `[Core] Decouple LumenClient from Requiring Sponsor Secret Key in Browser Environments` | Core / Security | `Advanced` | `Open` | [#283](https://github.com/utilityjnr1/lumena/issues/283) |
| 284 | `[Core] WebAuthn P-256 to Ed25519 Signature Converter and Verification Helper` | Core / Cryptography | `Advanced` | `Open` | [#284](https://github.com/utilityjnr1/lumena/issues/284) |
| 285 | `[Core] BIP-44 Multi-Account Hierarchical Deterministic (HD) Key Derivation Engine` | Core / Keys | `Intermediate` | `Open` | [#285](https://github.com/utilityjnr1/lumena/issues/285) |
| 286 | `[Core] SEP-0030 Web3 Account Recovery Protocol Client Implementation` | Core / SEP | `Advanced` | `Open` | [#286](https://github.com/utilityjnr1/lumena/issues/286) |
| 287 | `[Core] SEP-0024 Hosted Deposit and Withdrawal Interactive Flow Integration` | Core / SEP | `Advanced` | `Open` | [#287](https://github.com/utilityjnr1/lumena/issues/287) |
| 288 | `[Core] SEP-0038 Anchor Platform Cross-Asset Quotes API Client Integration` | Core / SEP | `Intermediate` | `Open` | [#288](https://github.com/utilityjnr1/lumena/issues/288) |
| 289 | `[Core] Zero-Knowledge Proof (zk-SNARK) Verification Engine for Anonymous Policy Compliance` | Core / Privacy | `Advanced` | `Open` | [#289](https://github.com/utilityjnr1/lumena/issues/289) |
| 290 | `[Core] Cross-Platform Encrypted Keystore with WebCrypto API and Argon2id Key Derivation` | Core / Security | `Advanced` | `Open` | [#290](https://github.com/utilityjnr1/lumena/issues/290) |
| 291 | `[Core] Air-Gapped Offline Transaction Drafting and Animated QR-Code Signer Pipeline` | Core / Security | `Advanced` | `Open` | [#291](https://github.com/utilityjnr1/lumena/issues/291) |
| 292 | `[Core] Native Support for Stellar Muxed Accounts (MED25519 / M... addresses)` | Core / Stellar | `Intermediate` | `Open` | [#292](https://github.com/utilityjnr1/lumena/issues/292) |
| 293 | `[Core] Dynamic Fee-Bump Estimator with Horizon Ledger Surge Pricing Analysis` | Core / Fees | `Intermediate` | `Open` | [#293](https://github.com/utilityjnr1/lumena/issues/293) |
| 294 | `[Core] Soroban WASM Metadata Parser and ScVal Type Serializer Generator` | Core / Soroban | `Advanced` | `Open` | [#294](https://github.com/utilityjnr1/lumena/issues/294) |
| 295 | `[Core] WebSocket Event Client for Stellar Horizon Streaming and Soroban RPC Topics` | Core / Networking | `Intermediate` | `Open` | [#295](https://github.com/utilityjnr1/lumena/issues/295) |
| 296 | `[Core] Pluggable SDK Telemetry, Diagnostics Hook, and Structured Logger Interface` | Core / Observability | `Intermediate` | `Open` | [#296](https://github.com/utilityjnr1/lumena/issues/296) |
| 297 | `[Core] Tree-Shakable Package Bundle Optimization Reducing Web SDK Footprint to Under 45KB` | Core / Performance | `Intermediate` | `Open` | [#297](https://github.com/utilityjnr1/lumena/issues/297) |

#### Part 5: Tooling, CLI, DevOps, Observability & Auditing (#298 - #312)
| # | Issue Title | Category | Complexity | Status | GitHub Link |
|---|---|---|---|---|---|
| 298 | `[Tooling] Interactive CLI Onboarding Wizard (lumen init) with Environment & Key Setup` | CLI / Tooling | `Intermediate` | `Open` | [#298](https://github.com/utilityjnr1/lumena/issues/298) |
| 299 | `[Tooling] CLI Soroban Contract Deployment and Invocation Tooling (lumen contract)` | CLI / Soroban | `Advanced` | `Open` | [#299](https://github.com/utilityjnr1/lumena/issues/299) |
| 300 | `[Tooling] CLI Policy Dry-Run and Simulation Engine for Offline Policy Evaluation` | CLI / Policy | `Intermediate` | `Open` | [#300](https://github.com/utilityjnr1/lumena/issues/300) |
| 301 | `[Tooling] Static Security Linter and AST Analyzer for Stellar XDR Injection Vulnerabilities` | Tooling / Security | `Advanced` | `Open` | [#301](https://github.com/utilityjnr1/lumena/issues/301) |
| 302 | `[Tooling] Automated High-Throughput Load and Concurrency Benchmark Suite with k6` | Tooling / QA | `Intermediate` | `Open` | [#302](https://github.com/utilityjnr1/lumena/issues/302) |
| 303 | `[Tooling] GitHub Actions CI Pipeline for Soroban Contract Compilation, Stripping, and ABI Export` | DevOps / CI/CD | `Intermediate` | `Open` | [#303](https://github.com/utilityjnr1/lumena/issues/303) |
| 304 | `[Tooling] Automated Local Stellar Standalone Container E2E Test Suite in CI` | DevOps / CI/CD | `Advanced` | `Open` | [#304](https://github.com/utilityjnr1/lumena/issues/304) |
| 305 | `[Tooling] Interactive Documentation Site with Embedded Code Playground using Starlight` | Docs / Tooling | `Intermediate` | `Open` | [#305](https://github.com/utilityjnr1/lumena/issues/305) |
| 306 | `[Tooling] Secure CLI Keystore Export and Migration Tool with AES-GCM Encryption` | CLI / Security | `Intermediate` | `Open` | [#306](https://github.com/utilityjnr1/lumena/issues/306) |
| 307 | `[Tooling] Automated Changeset Release and Multi-Package NPM Publishing Workflow` | DevOps / CI/CD | `Intermediate` | `Open` | [#307](https://github.com/utilityjnr1/lumena/issues/307) |
| 308 | `[Tooling] Real-Time CLI Audit Stream (lumen audit) for Monitoring Policy Decisions` | CLI / Observability | `Intermediate` | `Open` | [#308](https://github.com/utilityjnr1/lumena/issues/308) |
| 309 | `[Tooling] Mutation and Differential Fuzz Testing Harness for Transaction Building and Policy Checks` | Tooling / Security | `Advanced` | `Open` | [#309](https://github.com/utilityjnr1/lumena/issues/309) |
| 310 | `[Tooling] Multi-Container Docker Compose Stack with Stellar RPC, Redis Cluster, and PostgreSQL` | DevOps / Docker | `Intermediate` | `Open` | [#310](https://github.com/utilityjnr1/lumena/issues/310) |
| 311 | `[Tooling] Synthetic Transaction Monitoring Canary Daemon for Production Health Probing` | DevOps / Reliability | `Advanced` | `Open` | [#311](https://github.com/utilityjnr1/lumena/issues/311) |
| 312 | `[Tooling] Comprehensive Developer Video Onboarding Script and Quickstart Interactive Tutorials` | Docs / Onboarding | `Beginner` | `Open` | [#312](https://github.com/utilityjnr1/lumena/issues/312) |

---

## Detailed Specifications for Active Issues (#213 - #312)

### Part 1: Soroban Smart Contracts & On-Chain Account Abstraction (#213 - #232)

#### #213 [Contract] Native Soroban Smart Account Contract with Pluggable Signers and WebAuthn Verification
- **Target:** `contracts/smart-account/`
- **Context:** Lumen currently relies on native Stellar 2-of-2 multisig accounts. True seedless web3 adoption requires programmable smart accounts on Soroban supporting secp256r1 (P-256) WebAuthn signatures, customizable verification thresholds, and fallback guardians without protocol-level account restrictions.
- **Specification:**
  - Create a Rust Soroban contract `contracts/smart-account/src/lib.rs` implementing `__check_auth`.
  - Support signature verification for both Ed25519 device keys and Secp256r1 passkey signatures via `env.crypto().secp256r1_verify`.
  - Maintain a dynamic list of authorized signers with distinct weights and invocation thresholds stored in contract instance storage.
- **Acceptance Criteria:** Unit tests in Soroban SDK verifying signature verification for both Ed25519 and Secp256r1, rejection of unweighted threshold transactions, and non-replayable nonce tracking.

#### #214 [Contract] Gasless Paymaster Contract for Soroban Invocations with Fee Sponsorship Ledger
- **Target:** `contracts/paymaster/`
- **Context:** While Lumen handles fee bumps via Stellar transaction envelopes, Soroban contract calls consume CPU and memory resource fees that benefit from on-contract fee credit ledgers and sponsored pre-authorizations.
- **Specification:**
  - Implement a Paymaster contract allowing dApps to deposit XLM or stablecoins to sponsor contract user invocations.
  - Implement `sponsor_invocation(user: Address, contract: Address, function_name: Symbol, max_fee: i128)`.
  - Enforce spend limits per user per epoch and emit `PaymasterSponsorship` events.
- **Acceptance Criteria:** Tests verify deposits, sponsorship deductions, fee-limit denials, and balance withdrawal by authorized owner.

#### #215 [Contract] On-Chain Session Key Delegation Contract with Granular Method and Resource Whitelists
- **Target:** `contracts/session-keys/`
- **Context:** Off-chain policy engines can be bypassed if raw account credentials leak. On-chain session key verification enforces permissions directly at the Soroban consensus layer.
- **Specification:**
  - Write a Soroban contract enabling account owners to register temporary public keys with: `valid_until: u64`, `allowed_contracts: Vec<Address>`, `allowed_methods: Vec<Symbol>`, `max_cumulative_amount: i128`.
  - Implement `validate_session_call(session_key: Address, target: Address, method: Symbol, amount: i128) -> bool`.
- **Acceptance Criteria:** Contract rejects expired keys, unlisted targets, and amounts exceeding cumulative quota.

#### #216 [Contract] Social Recovery and Guardian Timelock Smart Contract for Account Ownership Restoral
- **Target:** `contracts/social-recovery/`
- **Context:** If a user loses their passkey or device key, a seedless wallet requires social recovery without server centralization.
- **Specification:**
  - Develop a Guardian contract where the user registers $N$ guardian addresses (emails, friends, secondary devices) with an $M$-of-$N$ threshold and a configurable timelock (e.g., 48 hours).
  - Implement recovery initiation, guardian voting, timelock delay, execution of key rotation, and cancellation by the legitimate owner during the grace period.
- **Acceptance Criteria:** Comprehensive unit tests covering recovery proposal, threshold voting, timelock grace period cancellation, and successful key replacement.

#### #217 [Contract] SEP-41 Fungible Token Smart Contract Implementation with Comprehensive Mock Test Harness
- **Target:** `contracts/token-sep41/`
- **Context:** Lumen packages interact with SEP-41 Soroban tokens, but the repository lacks an in-tree SEP-41 reference contract for local unit tests and integration tests.
- **Specification:**
  - Write a complete SEP-41 compliant token contract implementing `initialize`, `balance`, `spendable_balance`, `authorized`, `transfer`, `transfer_from`, `burn`, `burn_from`, `decimals`, `name`, `symbol`.
  - Provide automated compilation scripts and TypeScript mock bindings in `packages/core/src/soroban/__tests__/mocks/`.
- **Acceptance Criteria:** Full compliance with SEP-41 specification verified through automated test harness.

#### #218 [Contract] Daily Rate-Limited Spending and Allowance Soroban Contract
- **Target:** `contracts/spend-policy/`
- **Context:** Enforce decentralized spending limits directly on-chain so that even compromised co-signers cannot drain more than the daily allowance.
- **Specification:**
  - Contract tracking rolling 24-hour windows per asset.
  - Implement sliding-window budget consumption and reset.
  - Allow master key to override or adjust limits with 24-hour delay.
- **Acceptance Criteria:** Rejection of transactions exceeding remaining allowance in a 24-hour period; allowance restores correctly as time advances.

#### #219 [Contract] Soroban State Archival and Automatic TTL Extension Manager
- **Target:** `contracts/ttl-manager/`
- **Context:** Soroban ledger entries expire if their Time-To-Live (TTL) is not bumped, risking permanent data archival.
- **Specification:**
  - Contract and worker utility that tracks instance and persistent storage TTLs.
  - Expose `extend_ttl_if_needed(threshold_ledgers: u32, extend_by: u32)`.
  - Implement automated rent estimation and reimbursement logic.
- **Acceptance Criteria:** Automated test simulating ledger increments and verifying that TTL is bumped before threshold expiration.

#### #220 [Contract] Multi-Token Escrow and Conditional Settlement Soroban Contract
- **Target:** `contracts/escrow/`
- **Context:** Secure P2P payments with release conditions (timelock, buyer approval, or dispute resolution) for gasless payments.
- **Specification:**
  - Implement multi-asset escrow supporting native XLM and SEP-41 tokens.
  - Functions: `deposit`, `release`, `refund`, `raise_dispute`, `arbitrate`.
- **Acceptance Criteria:** Escrow deposits lock funds; only designated recipient or arbiter can release; expired unfulfilled escrows refund to depositor.

#### #221 [Contract] Reentrancy Guard and Invariant Assertion Module for Soroban Contracts
- **Target:** `contracts/security-utils/`
- **Context:** Cross-contract Soroban invocations are vulnerable to reentrancy attacks if state updates occur after external contract calls.
- **Specification:**
  - Implement a reusable Rust macro/trait `#[reentrancy_guard]` that uses transient contract instance storage.
  - Add invariant assertions before and after external invocation blocks.
- **Acceptance Criteria:** Unit test proving recursive call attempts within the same call frame fail with `ContractError::ReentrancyDetected`.

#### #222 [Contract] Cross-Contract Invocation Policy Validator with Dynamic Call Graph Inspection
- **Target:** `contracts/policy-guard/`
- **Context:** Wallets executing batch Soroban calls need on-chain verification that called sub-contracts have verified source code and belong to trusted protocol registries.
- **Specification:**
  - Contract registry maintaining verified contract hashes.
  - Policy enforcement checking `env.current_contract_address()` and authorized call targets before dispatching execution.
- **Acceptance Criteria:** Unregistered contracts are rejected; registered contracts execute with zero overhead.

#### #223 [Contract] Oracle Price-Feed Consumer Contract for Real-Time USD Spend Limit Enforcement
- **Target:** `contracts/oracle-spend-limit/`
- **Context:** Static XLM limits fluctuate wildly in fiat value. An on-chain oracle consumer converts asset amounts to USD value for accurate spend limit checks.
- **Specification:**
  - Consume price feed data (e.g., Reflector/Band/Pyth or mock Soroban oracle).
  - Calculate USD equivalent of XLM and custom tokens before authorizing payment operations.
- **Acceptance Criteria:** Correctly computes USD value using standard precision math; fails safely if oracle price is stale or missing.

#### #224 [Contract] Upgradeable Proxy Pattern and State Migration Harness for Soroban Smart Accounts
- **Target:** `contracts/proxy/`
- **Context:** Smart contract accounts must support future feature upgrades while preserving account storage, nonces, and addresses.
- **Specification:**
  - Implement a proxy contract utilizing `env.deployer().update_current_contract_wasm()`.
  - Include multi-sig upgrade approval with a mandatory timelock.
- **Acceptance Criteria:** Contract logic updates successfully while preserving existing instance and persistent storage state.

#### #225 [Contract] Dead-Man's Switch and Inheritance Vault Soroban Contract
- **Target:** `contracts/inheritance/`
- **Context:** Inactivity-triggered inheritance for seedless wallets ensuring digital assets are not lost upon user incapacitation.
- **Specification:**
  - Track `last_heartbeat` timestamp updated via any wallet activity.
  - If `current_time - last_heartbeat > dormancy_period`, allow designated beneficiary to claim custody.
- **Acceptance Criteria:** Beneficiary claims fail while heartbeat is active; claims succeed once dormancy period expires.

#### #226 [Contract] Threshold Multi-Party ECDSA / Ed25519 Quorum Verifier Contract
- **Target:** `contracts/mpc-verifier/`
- **Context:** Support enterprise custody by verifying off-chain multi-party computation (MPC) threshold signatures on-chain.
- **Specification:**
  - Implement signature verification for aggregated threshold signatures across $T$-of-$N$ co-signers.
  - Verify bitmap of participating cosigners and prevent signature malleability.
- **Acceptance Criteria:** Verifies valid threshold signature proofs; rejects tampered messages or insufficient signer counts.

#### #227 [Contract] Gasless Non-Fungible Soulbound Identity Token (SBT) Contract for KYC / Policy Attestation
- **Target:** `contracts/sbt-identity/`
- **Context:** Enterprise and regulated apps need on-chain compliance credentials that cannot be transferred between wallets.
- **Specification:**
  - Implement non-transferable Soulbound Token (SBT) adhering to Soroban token interfaces with `transfer` disabled.
  - Minting restricted to authorized compliance issuers.
- **Acceptance Criteria:** Tokens cannot be transferred; issuers can revoke credentials; smart accounts can query badge validity.

#### #228 [Contract] Automated Batch Settlement and Micro-Payment Streaming Contract
- **Target:** `contracts/payment-streaming/`
- **Context:** Gasless streaming payments (salary, subscriptions, API pay-per-call) on Stellar Soroban.
- **Specification:**
  - Implement continuous flow rate calculation: `claimable = (now - start) * rate_per_second`.
  - Allow sender to top up, pause, or cancel stream with immediate unspent refund.
- **Acceptance Criteria:** Recipient can withdraw accrued funds progressively; sender can cancel and reclaim remaining unstreamed deposit.

#### #229 [Contract] Soroban Contract Event Schema Standard and Structured Topic Indexer
- **Target:** `contracts/event-schema/`
- **Context:** Inconsistent contract events make indexing and off-chain policy monitoring fragile.
- **Specification:**
  - Establish standard event topics: `[CONTRACT_SYMBOL, ACTION_SYMBOL, WALLET_ADDRESS]`.
  - Document all payload schemas with strict ScVal types.
- **Acceptance Criteria:** Contract events emit standardized topics verifiable by off-chain event subscribers.

#### #230 [Contract] Soroban Gas and Resource Footprint Profiling Test Suite
- **Target:** `contracts/benchmarks/`
- **Context:** High CPU/memory instructions increase transaction fees and risk hitting ledger execution limits.
- **Specification:**
  - Create automated profiling scripts recording CPU instructions and memory consumption across typical operations.
  - Set CI threshold barriers to prevent performance regression.
- **Acceptance Criteria:** Benchmark suite prints resource table and asserts resource usage does not exceed defined budget.

#### #231 [Contract] Fuzz Testing and Invariant Verification Suite for Smart Account Storage
- **Target:** `contracts/smart-account/__tests__/fuzz/`
- **Context:** Edge cases in multi-signer weighting and integer math can cause account bricking or unauthorized fund drainage.
- **Specification:**
  - Implement property-based fuzz tests using `proptest` in Rust.
  - Verify key invariants: total funds conserved, unauthorized signatures never execute, state never panics.
- **Acceptance Criteria:** 10,000+ random fuzz runs complete with zero invariant violations.

#### #232 [Contract] WASM Binary Size Optimization and Strip Pipeline in Docker Build
- **Target:** `contracts/Makefile`, `docker/Dockerfile.soroban`
- **Context:** Soroban charges deployment fees proportional to contract WASM size; unoptimized binaries degrade user experience.
- **Specification:**
  - Configure `Cargo.toml` with `opt-level = "z"`, `lto = true`, `codegen-units = 1`, `panic = "abort"`.
  - Integrate `wasm-opt -Oz --strip-debug` in automated build pipeline.
- **Acceptance Criteria:** Compiled contract WASM files reduced by at least 35% compared to default release build.

---

### Part 2: Backend Architecture, Server Scaling & Security (#233 - #257)

#### #233 [Backend] Distributed Sequence Number Reservation & Concurrency Queue Using Redis Redlock
- **Target:** `packages/server/src/fee-sponsor/`, `packages/server/src/cosigner/`
- **Context:** When multiple concurrent requests hit the server for the sponsor account, Horizon rejects transactions with sequence number errors (`txBAD_SEQ`).
- **Specification:**
  - Implement a distributed Redis-based sequence number allocator with atomic reservation and timeout rollback.
  - Implement exponential backoff retry when Horizon reports sequence collisions.
- **Acceptance Criteria:** 50 concurrent transactions submit without a single sequence number conflict error.

#### #234 [Backend] Multi-Tenant API Key Management with Scoped Permissions and Tiered Rate Quotas
- **Target:** `packages/server/src/middleware/auth.ts`, `packages/server/src/server.ts`
- **Context:** The current server only supports a single global `API_KEY`. Supporting multiple third-party apps requires tenant isolation, distinct permissions, and tiered usage caps.
- **Specification:**
  - Introduce `TenantStore` with fields: `id`, `name`, `apiKeyHash`, `tier`, `monthlyGasQuotaXlm`, `allowedDomains`.
  - Middleware that authenticates tenant and attaches tenant context to `req.tenant`.
- **Acceptance Criteria:** Invalid API keys receive 401; tenants exceeding monthly quotas receive 429 with descriptive headers.

#### #235 [Backend] SEP-10 Web Authentication Protocol Endpoint with JWT Issuance and Challenge Verification
- **Target:** `packages/server/src/auth/`
- **Context:** Seamless passwordless authentication for client applications proving Stellar wallet ownership.
- **Specification:**
  - `GET /auth/challenge?account=<publicKey>`: Generates SEP-10 challenge transaction envelope signed by server.
  - `POST /auth/token`: Validates client signature on challenge transaction and issues JWT valid for 24 hours.
- **Acceptance Criteria:** Full SEP-10 challenge/response flow passes against `@stellar/stellar-sdk` test vectors.

#### #236 [Backend] Webhook Dispatcher Retry Pipeline with Exponential Backoff and Dead-Letter Queue (DLQ)
- **Target:** `packages/server/src/webhook/dispatcher.ts`
- **Context:** Transient endpoint outages cause permanent webhook delivery failure with no audit trail or recovery.
- **Specification:**
  - Enhance `WebhookDispatcher` with persistent retry queue using Redis BullMQ.
  - Implement retries at 1m, 5m, 15m, 1h, 6h; route permanently failed deliveries to dead-letter queue.
  - Expose `GET /webhooks/:id/deliveries` and `POST /webhooks/deliveries/:id/retry`.
- **Acceptance Criteria:** Simulated 500 responses trigger expected retries; failed events persist in DLQ with error logs.

#### #237 [Backend] OpenTelemetry Distributed Tracing Integration Across HTTP, Redis, and Stellar RPC
- **Target:** `packages/server/src/tracing.ts`, `packages/server/src/main.ts`
- **Context:** Diagnosing transaction delays across HTTP endpoints, Redis policy checks, and Horizon RPC requires end-to-end distributed tracing.
- **Specification:**
  - Instrument Express app with `@opentelemetry/sdk-node` and auto-instrumentations.
  - Trace context propagation from incoming HTTP headers to outgoing Stellar RPC requests.
  - Export traces to OTLP collector (Jaeger/Tempo).
- **Acceptance Criteria:** Trace waterfall displays complete request duration breakdown across server, database, and Horizon calls.

#### #238 [Backend] Dynamic Policy Engine Reload via Redis Pub/Sub Without Server Restarts
- **Target:** `packages/server/src/policy/engine.ts`, `packages/server/src/policy/store.ts`
- **Context:** Adding or updating wallet policies currently requires manual server configuration reload or individual REST calls per replica.
- **Specification:**
  - Policy store subscribes to Redis channel `lumen:policies:updated`.
  - When an admin updates a policy, an update event is published, triggering all cluster replicas to invalidate local in-memory policy cache.
- **Acceptance Criteria:** Multi-instance deployment updates policies across all nodes within 100ms of Redis event emission.

#### #239 [Backend] Hardware Security Module (HSM) PKCS#11 Signer Implementation for Enterprise Custody
- **Target:** `packages/server/src/signers/Pkcs11Signer.ts`
- **Context:** Production compliance often mandates storing the master co-signer key in an on-premises or cloud HSM via the PKCS#11 C API.
- **Specification:**
  - Implement `Signer` interface using `pkcs11js` or native binding.
  - Support slot ID, PIN, key label, and cryptographic signing without exposing private key material.
- **Acceptance Criteria:** Successfully signs test transactions using SoftHSM2 in local integration environment.

#### #240 [Backend] Multi-Region Stellar Horizon & RPC Latency-Aware Failover Router
- **Target:** `packages/server/src/stellar/router.ts`
- **Context:** Public Stellar Horizon nodes experience rate limits, maintenance outages, and regional latency spikes.
- **Specification:**
  - Implement `FailoverStellarClient` maintaining a pool of Horizon and Soroban RPC endpoints.
  - Periodic background health and latency ping; automatically routes traffic to lowest-latency healthy endpoint.
- **Acceptance Criteria:** Outage on primary node triggers automatic, transparent failover to secondary node with zero dropped requests.

#### #241 [Backend] Real-Time Anomaly and Fraud Detection Service for Velocity Spikes and Geo-IP Shifts
- **Target:** `packages/server/src/security/fraud-detector.ts`
- **Context:** Co-signing stolen device credentials can result in wallet drains if velocity anomalies go undetected.
- **Specification:**
  - Real-time scoring evaluating: sudden 10x volume increase, rapid geographical IP changes (<1h between distant countries), and unusual destination patterns.
  - Rejection or flagging of transactions when risk score exceeds configurable threshold.
- **Acceptance Criteria:** High-velocity anomaly triggers rejection with `FRAUD_VELOCITY_TRIGGERED` policy violation.

#### #242 [Backend] Relational Database Persistence Layer (Prisma/PostgreSQL) for Policies and Audit Trails
- **Target:** `packages/server/src/db/`
- **Context:** Redis persistence is ephemeral in certain cloud environments; enterprise setups require ACID-compliant relational storage.
- **Specification:**
  - Create Prisma schema for `Wallet`, `Policy`, `PolicyRule`, `TransactionAudit`, and `WebhookSubscription`.
  - Implement database repository classes satisfying `PolicyStore` and `WalletRegistry` interfaces.
- **Acceptance Criteria:** Passes all policy engine tests with PostgreSQL backend; migrations run cleanly via `pnpm migrate`.

#### #243 [Backend] Batch Cosigning Endpoint (POST /cosign/batch) with Atomic Policy Evaluation
- **Target:** `packages/server/src/server.ts`, `packages/server/src/cosigner/service.ts`
- **Context:** High-throughput applications (gaming, recurring payroll) need to submit multiple transactions for co-signing in a single network round-trip.
- **Specification:**
  - Implement `POST /cosign/batch` accepting `{ transactions: Array<{ xdr: string, walletAddress: string }> }`.
  - Atomically evaluate policies across all items; return signed XDRs or pinpoint individual policy failures.
- **Acceptance Criteria:** Batch of 20 valid transactions is co-signed in one request; invalid transaction in batch returns item-level error details.

#### #244 [Backend] Sliding-Window Token Bucket Rate Limiter per Wallet Address and Client IP
- **Target:** `packages/server/src/middleware/rate-limiter.ts`
- **Context:** Fixed-window rate limiters suffer from burst traffic at window boundaries.
- **Specification:**
  - Implement token bucket algorithm in Redis via Lua script.
  - Support separate burst limits and steady-state refill rates per IP and wallet address.
- **Acceptance Criteria:** Burst requests up to bucket capacity succeed; sustained requests are strictly throttled to refill rate.

#### #245 [Backend] RFC 7231 Idempotency-Key Support Across All Mutating Server Endpoints
- **Target:** `packages/server/src/middleware/idempotency.ts`
- **Context:** Network timeouts cause clients to retry `/fee-bump/submit`, risking duplicate transaction submission or unexpected sponsor spend.
- **Specification:**
  - Middleware reading `Idempotency-Key` header.
  - Cache response in Redis for 24 hours; concurrent identical requests await the ongoing execution rather than re-executing.
- **Acceptance Criteria:** Repeated requests with same idempotency key return identical response without executing duplicate operations.

#### #246 [Backend] Granular Role-Based Access Control (RBAC) and Audit Logging for Admin APIs
- **Target:** `packages/server/src/middleware/rbac.ts`
- **Context:** Admin operations (`POST /policy`, `PATCH /webhooks`, `GET /wallets`) must support roles (`admin`, `operator`, `auditor`) with least-privilege access.
- **Specification:**
  - Implement JWT claim parsing for roles: `auditor` (read-only), `operator` (policy update), `admin` (full access).
  - Enforce permission checks on routes; log actor ID and timestamp.
- **Acceptance Criteria:** `auditor` role accessing `POST /policy` receives 403 Forbidden; audit log records access attempt.

#### #247 [Backend] Graceful Shutdown Lifecycle Handler with In-Flight Transaction Draining
- **Target:** `packages/server/src/lifecycle.ts`, `packages/server/src/main.ts`
- **Context:** Sudden SIGTERM during Kubernetes pod rollouts aborts co-signing or fee-bump submissions mid-flight.
- **Specification:**
  - Intercept SIGINT/SIGTERM.
  - Stop accepting new HTTP requests, drain ongoing co-sign and submit operations within 15-second grace period, close Redis connections.
- **Acceptance Criteria:** Process exits cleanly with code 0 after finishing active transaction processing.

#### #248 [Backend] Tamper-Proof Cryptographic Audit Log with Merkle Tree Hash Chaining
- **Target:** `packages/server/src/audit/`
- **Context:** Compliance requires proof that policy evaluations and co-signing decisions were not modified retroactively.
- **Specification:**
  - Each co-sign decision records: `prevHash`, `timestamp`, `txHash`, `walletAddress`, `decision`, `rulesEvaluated`.
  - Compute SHA-256 hash chain; publish hourly Merkle roots to Stellar account memo or storage.
- **Acceptance Criteria:** Verification function detects any altered log record in the historical chain.

#### #249 [Backend] Prometheus Alerting Rules, SLO Dashboards, and PagerDuty Webhook Integration
- **Target:** `packages/server/src/metrics/`, `docker/prometheus/`
- **Context:** Production operations require alerts on low sponsor balances, high error rates, and policy latency spikes.
- **Specification:**
  - Define Prometheus alert rules: `SponsorBalanceCritical` (< 100 XLM), `CosignErrorRateHigh` (> 5% errors), `RPCLatencySpike` (> 2s).
  - Add PagerDuty alert webhook receiver and Grafana dashboard JSON.
- **Acceptance Criteria:** Metric alerts fire in Prometheus test environment under simulated degradation.

#### #250 [Backend] WebSocket Server for Live Transaction Broadcasts, Confirmations, and Policy Events
- **Target:** `packages/server/src/websocket/`
- **Context:** Frontend clients polling HTTP endpoints for confirmation status cause unnecessary load.
- **Specification:**
  - Implement WebSocket server (`ws://.../ws`) supporting wallet subscription channels: `subscribe:wallet:<address>`.
  - Broadcast real-time events: `cosigned`, `submitted`, `confirmed`, `policy_violated`.
- **Acceptance Criteria:** Client connected via WebSocket receives confirmation event within 250ms of Horizon ledger inclusion.

#### #251 [Backend] Hardened Production Docker Image with Multi-Stage Build and Non-Root User
- **Target:** `packages/server/Dockerfile`
- **Context:** Existing Dockerfile runs as root and carries devDependencies into final container image.
- **Specification:**
  - Multi-stage Docker build: build stage with pnpm, production stage with minimal Alpine or distroless Node runtime.
  - Create non-root user `lumen` (UID 10001); include healthcheck directive.
- **Acceptance Criteria:** Final container size under 180MB; runs without root privileges; passes vulnerability scan with zero high/critical issues.

#### #252 [Backend] Automatic Sponsor Hot-Wallet Refill Service via Exchange API and Horizon Listener
- **Target:** `packages/server/src/fee-sponsor/refill.ts`
- **Context:** If sponsor account balance runs dry, all user transactions fail.
- **Specification:**
  - Automated service monitoring sponsor account balance.
  - When balance drops below `MIN_BALANCE`, trigger sweep from designated treasury cold wallet or trigger exchange withdrawal API.
- **Acceptance Criteria:** Threshold breach triggers simulated treasury transfer; sponsor balance restores above minimum.

#### #253 [Backend] Transaction Ingestion and Ledger Reconciliation Worker with Horizon Streaming
- **Target:** `packages/server/src/ledger/ingest.ts`
- **Context:** Server must reconcile internally co-signed transactions against finalized on-chain Stellar ledgers to catch failed or reverted transactions.
- **Specification:**
  - Horizon Server-Sent Events (SSE) stream listener for transactions affecting registered wallets.
  - Update internal status from `PENDING` to `SUCCESS` or `FAILED`; record actual ledger fee charged.
- **Acceptance Criteria:** Stream listener captures ledger inclusion and updates transaction record status automatically.

#### #254 [Backend] Anti-Replay Nonce Validation and Transaction Cache in Memory and Redis
- **Target:** `packages/server/src/middleware/anti-replay.ts`
- **Context:** Attackers intercepting valid co-signed transactions might attempt re-submission across networks or endpoints.
- **Specification:**
  - Calculate SHA-256 hash of transaction envelope contents and source account sequence number.
  - Reject duplicate submission if transaction hash was processed within the last 10 minutes.
- **Acceptance Criteria:** Resubmitted transaction envelope immediately returns 409 Conflict with `DUPLICATE_TRANSACTION_REPLAY`.

#### #255 [Backend] Dynamic CORS Domain Whitelist Provider with Live Database Backing
- **Target:** `packages/server/src/middleware/cors.ts`
- **Context:** In multi-tenant environments, allowed CORS origins must update dynamically as new dApps onboard without restarting the server.
- **Specification:**
  - Express CORS origin delegate query dynamic domain list from Redis/database with 60-second TTL cache.
  - Support wildcard subdomains (`*.example.com`).
- **Acceptance Criteria:** Newly added origin is allowed within cache TTL; unlisted origin is rejected with CORS error.

#### #256 [Backend] Health Diagnostics Self-Test Suite and Live Dependency Probing (/health/deep)
- **Target:** `packages/server/src/health/`
- **Context:** Standard `/health` only returns `{ status: "ok" }`, failing to identify disconnected Redis instances, expired KMS credentials, or unreachable Horizon endpoints.
- **Specification:**
  - Implement `/health/deep` testing: Redis ping, Horizon network latency, KMS signer signing probe, sponsor account balance.
  - Return HTTP 200 if all pass, 503 with component failure report if any dependency is degraded.
- **Acceptance Criteria:** Disconnecting Redis results in 503 with `{ redis: "unreachable", horizon: "healthy" }`.

#### #257 [Backend] GraphQL API Gateway with Subscriptions alongside Existing Express REST Endpoints
- **Target:** `packages/server/src/graphql/`
- **Context:** Modern frontend apps require flexible queries to fetch wallet balance, recent transactions, and active policies in a single query.
- **Specification:**
  - Add Yoga or Apollo GraphQL middleware with schema for `Wallet`, `Policy`, `Transaction`, `Metrics`.
  - Provide GraphQL subscriptions for real-time transaction updates.
- **Acceptance Criteria:** Single GraphQL query retrieves wallet details and associated policies with proper type validation.

---

### Part 3: Frontend SDK, React Hooks & UI Design System (#258 - #282)

#### #258 [Frontend] Multi-Network Context Switcher and Network Status Bar in @lumen/react
- **Target:** `packages/react/src/context.tsx`, `packages/react/src/components/LumenNetworkBar.tsx`
- **Context:** dApps must allow developers and users to switch between Testnet, Futurenet, and Mainnet seamlessly while reflecting current network health.
- **Specification:**
  - Extend `LumenProvider` with `currentNetwork`, `switchNetwork(network)`, and `supportedNetworks`.
  - Create prebuilt UI component `LumenNetworkBar` displaying active network with latency indicator and network badge.
- **Acceptance Criteria:** Switching network updates all connected hooks (`useBalance`, `useWallet`) and refetches state for the selected network.

#### #259 [Frontend] Type-Safe useSorobanContract Hook with Auto-Generated Contract ABIs
- **Target:** `packages/react/src/use-soroban-contract.ts`
- **Context:** Interacting with Soroban contracts requires tedious manual ScVal conversions without TypeScript type safety for contract arguments and return values.
- **Specification:**
  - Create `useSorobanContract<TContractSpec>(contractId, spec)` hook.
  - Provide automatic type inference for contract functions, parameter encoding, and return value decoding.
  - Support gas estimation and simulated invocations before submission.
- **Acceptance Criteria:** Type-safe method invocation compiles cleanly; runtime errors surface meaningful error messages.

#### #260 [Frontend] useSocialRecovery React Hook for Orchestrating Multi-Guardian Approval Flows
- **Target:** `packages/react/src/use-social-recovery.ts`
- **Context:** Users initiating account recovery require an intuitive hook managing guardian approval requests, status polling, and execution.
- **Specification:**
  - Hook exposing `initiateRecovery(newPublicKey)`, `approveRecovery(recoveryId)`, `cancelRecovery()`, `recoveryStatus`.
  - Polls guardian signature count and remaining timelock duration.
- **Acceptance Criteria:** Correctly reports progression from initiated to guardian-approved to timelocked to executable.

#### #261 [Frontend] LumenConnectModal Pre-Built Responsive Authentication and Onboarding Modal
- **Target:** `packages/react/src/components/LumenConnectModal.tsx`
- **Context:** Developers need a drop-in wallet connection dialog supporting Passkeys/WebAuthn, Google OAuth, and session creation.
- **Specification:**
  - Accessible dialog component with customizable theme properties (colors, typography, border radiuses).
  - Built-in tabs for "Create New Seedless Wallet" and "Connect Existing Device / Passkey".
- **Acceptance Criteria:** Modal renders cleanly across mobile and desktop viewports; emits `onSuccess(wallet)` upon authentication.

#### #262 [Frontend] useGaslessTransaction Hook with Optimistic State Updates and Auto-Rollback
- **Target:** `packages/react/src/use-gasless-transaction.ts`
- **Context:** Waiting 5 seconds for Stellar ledger inclusion makes UI feel sluggish. Optimistic balance updates improve user perceived speed.
- **Specification:**
  - Hook executing payments while immediately applying optimistic updates to local balance caches.
  - If transaction fails or is rejected by policy, state automatically rolls back to pre-transaction snapshot and emits error toast.
- **Acceptance Criteria:** Balance updates immediately in UI; rolls back accurately if transaction is rejected.

#### #263 [Frontend] LumenTransactionFeed Real-Time Animated Activity History Component
- **Target:** `packages/react/src/components/LumenTransactionFeed.tsx`
- **Context:** Users need visual feedback on pending, confirmed, and failed payments with animated transitions.
- **Specification:**
  - Component rendering chronological list of transactions with asset icons, relative timestamps, and explorer links.
  - Micro-animations for status transitions (pulse on pending, checkmark on confirmed).
- **Acceptance Criteria:** Renders empty state when history is blank; updates smoothly as new transactions stream in.

#### #264 [Frontend] useTokenAllowance and useApproveToken Hooks for SEP-41 Soroban Tokens
- **Target:** `packages/react/src/use-token-allowance.ts`
- **Context:** dApps interacting with Soroban tokens need straightforward hooks to check and grant spending allowances.
- **Specification:**
  - Implement `useTokenAllowance(tokenAddress, spenderAddress)` returning current allowance and expiration ledger.
  - Implement `useApproveToken()` providing `approve(tokenAddress, spenderAddress, amount, ttlLedgers)`.
- **Acceptance Criteria:** Allowance queries return accurate bigint values; approvals generate valid Soroban transaction envelopes.

#### #265 [Frontend] Interactive Policy Builder and Spend Limit Editor UI Component
- **Target:** `packages/react/src/components/LumenPolicyEditor.tsx`
- **Context:** Wallet admin dashboards need a visual interface to view and modify velocity and spend policies.
- **Specification:**
  - Component with form controls for daily limits, destination address whitelists, and contract call permissions.
  - Validates Stellar addresses and positive numeric limits before dispatching `PUT /policy/:walletId`.
- **Acceptance Criteria:** Dispatches valid policy payload; displays input errors on malformed public keys or negative amounts.

#### #266 [Frontend] LumenQrScanner Component with Camera Access, Flash Toggle, and URI Parsing
- **Target:** `packages/react/src/components/LumenQrScanner.tsx`
- **Context:** Mobile users want to scan QR codes for destination addresses or SEP-0007 transaction URIs.
- **Specification:**
  - Component utilizing HTML5 video stream with camera switcher and flash toggle.
  - Parses standard Stellar public keys and `web+stellar:pay` links.
- **Acceptance Criteria:** Successfully parses address from webcam stream and triggers `onScan(result)` callback.

#### #267 [Frontend] Next.js App Router (RSC) Compatibility and Server Action Support in @lumen/react
- **Target:** `packages/react/`
- **Context:** Next.js 14+ App Router throws errors if client components lack proper `"use client"` directives or attempt to access browser globals during SSR.
- **Specification:**
  - Add `"use client"` directive to all React entrypoints and interactive components.
  - Implement server-side safe mock providers for React Server Components.
- **Acceptance Criteria:** Next.js App Router project builds cleanly with `@lumen/react` without hydration mismatch warnings.

#### #268 [Frontend] Comprehensive Design Tokens and Dark/Light Theme Provider for Lumen UI
- **Target:** `packages/react/src/theme/`
- **Context:** Prebuilt components must match host application branding without CSS conflicts.
- **Specification:**
  - Design token system based on CSS variables: `--lumen-primary`, `--lumen-bg`, `--lumen-card-bg`, `--lumen-radius`.
  - Provide `LumenThemeProvider` supporting `"dark"`, `"light"`, or `"system"` modes.
- **Acceptance Criteria:** Changing theme dynamically updates colors across all prebuilt Lumen components.

#### #269 [Frontend] useSessionKeyManager Hook with Expiration Timer, Scoped Limits, and Revocation
- **Target:** `packages/react/src/use-session-key-manager.ts`
- **Context:** Managing temporary session keys requires tracking remaining time, spent budget, and providing instant revocation.
- **Specification:**
  - Hook returning active session keys, time-to-live countdown, and remaining spending quota.
  - Method `revoke(sessionKeyAddress)` that removes multisig signer or on-chain delegation.
- **Acceptance Criteria:** Countdown timer updates every second; revoking session key triggers co-signed transaction removal.

#### #270 [Frontend] WAI-ARIA Accessible Keyboard Navigation and Screen Reader Tags in All Components
- **Target:** `packages/react/src/components/`
- **Context:** Prebuilt wallet UI components must comply with WCAG 2.1 AA accessibility standards.
- **Specification:**
  - Add appropriate ARIA roles (`role="dialog"`, `aria-labelledby`, `aria-describedby`, `aria-live`).
  - Full keyboard focus trapping and Escape key handling in modals.
- **Acceptance Criteria:** Automated axe-core accessibility audit reports zero critical or serious accessibility violations.

#### #271 [Frontend] Encrypted Client-Side Wallet State Persistence Driver (IndexedDB / WebCrypto)
- **Target:** `packages/react/src/storage/`
- **Context:** Storing wallet address and session data in unencrypted localStorage exposes users to XSS token theft.
- **Specification:**
  - IndexedDB storage driver encrypting sensitive data with AES-256-GCM using a WebCrypto key derived from device credentials.
  - Automatic expiration and purge of stale session keys.
- **Acceptance Criteria:** Stored database records are encrypted at rest; transparently decrypted upon legitimate user unlock.

#### #272 [Frontend] LumenSwapWidget Component for In-App Stellar DEX Path Payment Conversions
- **Target:** `packages/react/src/components/LumenSwapWidget.tsx`
- **Context:** Users holding USDC who need XLM (or vice versa) should be able to swap assets without leaving the app.
- **Specification:**
  - Interactive swap interface querying Stellar path payment strict send/receive quotes.
  - Displays slippage tolerance, estimated execution price, and minimum received.
- **Acceptance Criteria:** Queries path payment routes in real time; executes gasless co-signed swap upon confirmation.

#### #273 [Frontend] useNetworkHealth Hook with RPC Latency Ping and Automatic Failover Alerting
- **Target:** `packages/react/src/use-network-health.ts`
- **Context:** Inform users when Stellar Horizon or RPC is experiencing degraded performance before they submit payments.
- **Specification:**
  - Periodic lightweight heartbeat querying ledger close time and RPC response latency.
  - Returns `{ status: "healthy" | "degraded" | "offline", latencyMs, ledgerNumber }`.
- **Acceptance Criteria:** Accurately reflects network latency and changes status to `degraded` if latency exceeds 2500ms.

#### #274 [Frontend] Interactive Storybook Design System and Component Showcase for @lumen/react
- **Target:** `packages/react/.storybook/`, `packages/react/stories/`
- **Context:** Developers adopting Lumen UI need an interactive preview environment to test component props, variants, and responsive behaviors.
- **Specification:**
  - Configure Storybook 8 with Tailwind/CSS support.
  - Write stories for `LumenWalletCard`, `LumenBalance`, `LumenConnectModal`, `LumenTransactionFeed`, `LumenSwapWidget`.
- **Acceptance Criteria:** `pnpm storybook` launches successfully; stories allow interactive control manipulation without console errors.

#### #275 [Frontend] React Native and Expo Mobile Adaptor Layer for Lumen Core and SDK
- **Target:** `packages/react-native/`
- **Context:** Expanding Lumen to iOS and Android applications requires native crypto bindings replacing browser-specific `window.crypto`.
- **Specification:**
  - Create adapter bridging `react-native-quick-crypto` and `expo-secure-store` to Lumen `KeyStorage`.
  - Provide mobile-compatible `useWallet` hook.
- **Acceptance Criteria:** Sample Expo app initializes wallet, derives keypair, and submits co-signed transaction.

#### #276 [Frontend] LumenErrorBoundary Component with Crash Reporting and Session Diagnostic Export
- **Target:** `packages/react/src/components/LumenErrorBoundary.tsx`
- **Context:** Unexpected cryptographic errors or network failures must be caught gracefully without crashing the host application.
- **Specification:**
  - React error boundary rendering fallback UI with "Copy Error Diagnostics" button.
  - Strips private keys and secrets before exporting diagnostic JSON.
- **Acceptance Criteria:** Catches child component throws, displays friendly error screen, and outputs sanitized diagnostic payload.

#### #277 [Frontend] Toast Notification Dispatcher for Transaction Lifecycle and Policy Warnings
- **Target:** `packages/react/src/components/LumenToast.tsx`
- **Context:** Feedback during multi-step gasless transactions (signing -> co-signing -> fee-bumping -> confirmed).
- **Specification:**
  - Lightweight toast notification manager with automatic dismissal and status badges.
  - Supports actionable buttons (e.g. "View on Stellar Expert").
- **Acceptance Criteria:** Dispatches notifications on transaction lifecycle events; dismisses automatically after configured duration.

#### #278 [Frontend] SSR-Safe Hydration Guards for Browser Cryptography and WebAuthn Primitives
- **Target:** `packages/react/src/hooks/use-is-mounted.ts`, `packages/react/src/context.tsx`
- **Context:** Accessing `navigator.credentials` or `window.crypto` during Next.js or Remix server-side rendering crashes the server.
- **Specification:**
  - Guard all browser cryptographic calls behind `typeof window !== "undefined"` and `isMounted` state flags.
  - Return sensible loading states during SSR hydration phase.
- **Acceptance Criteria:** Next.js SSR build executes with zero `ReferenceError: window is not defined` exceptions.

#### #279 [Frontend] useMultiSigApproval Hook for Orchestrating Multi-Device Co-Signing Sessions
- **Target:** `packages/react/src/use-multisig-approval.ts`
- **Context:** High-value transactions requiring signatures from multiple user devices need session coordination.
- **Specification:**
  - Hook generating a session QR code / link for secondary device approval.
  - Polls backend approval status and combines signatures into single transaction envelope.
- **Acceptance Criteria:** Secondary device signature detected and merged into final co-signed transaction envelope.

#### #280 [Frontend] Virtualized List Rendering for High-Volume Transaction Histories in LumenWalletCard
- **Target:** `packages/react/src/components/LumenWalletCard.tsx`
- **Context:** Wallets with hundreds of transactions experience DOM lag when rendering history items.
- **Specification:**
  - Integrate virtualized windowing (`@tanstack/react-virtual` or lightweight internal windowing).
  - Only render visible DOM nodes as user scrolls.
- **Acceptance Criteria:** Smooth 60 FPS scrolling performance with 1,000+ transaction items rendered.

#### #281 [Frontend] Internationalization (i18n) Framework Support across All Prebuilt React Components
- **Target:** `packages/react/src/i18n/`
- **Context:** Global Stellar adoption requires multilingual support across all prebuilt UI labels and error messages.
- **Specification:**
  - Lightweight translation dictionary supporting English, Spanish, Portuguese, French, and Japanese.
  - Configurable via `locale` prop on `LumenProvider`.
- **Acceptance Criteria:** Setting `locale="es"` renders Spanish translations for all buttons, labels, and error messages.

#### #282 [Frontend] Revamped Interactive Playground with Real-Time Soroban Contract XDR Inspector
- **Target:** `examples/playground/`
- **Context:** The playground example app needs an interactive inspector to help developers decode, simulate, and debug Soroban transactions.
- **Specification:**
  - Add interactive XDR viewer with collapsible JSON tree for transaction details.
  - Live simulation runner displaying predicted CPU/RAM fees and return values.
- **Acceptance Criteria:** Pasting an XDR string displays formatted operation tree and simulated outcome.

---

### Part 4: Core Cryptography, Stellar Protocols & Key Management (#283 - #297)

#### #283 [Core] Decouple LumenClient from Requiring Sponsor Secret Key in Browser Environments
- **Target:** `packages/web-sdk/src/client.ts`, `packages/core/src/wallet/wallet.ts`
- **Context:** Current `LumenClientOpts` in `@lumen/web-sdk` takes `sponsorSecret`. Storing the server's fee sponsor secret key in client browsers is a severe security vulnerability.
- **Specification:**
  - Refactor `LumenClient` to create accounts and sponsor fees solely by calling backend REST endpoints (`POST /wallet/create`, `POST /fee-bump/submit`).
  - Deprecate client-side `sponsorSecret` parameter; throw warning if provided.
- **Acceptance Criteria:** Browser client successfully creates and funds wallets without possessing sponsor private keys.

#### #284 [Core] WebAuthn P-256 to Ed25519 Signature Converter and Verification Helper
- **Target:** `packages/core/src/keys/passkey.ts`
- **Context:** Stellar native accounts use Ed25519, while WebAuthn hardware authenticators generate Secp256r1 (P-256) signatures.
- **Specification:**
  - Implement cryptographic parser converting DER-encoded WebAuthn signatures into raw $r$ and $s$ scalar components.
  - Support client data JSON SHA-256 hash validation and challenge extraction.
- **Acceptance Criteria:** Verifies genuine WebAuthn assertions against recorded public credentials using test vectors.

#### #285 [Core] BIP-44 Multi-Account Hierarchical Deterministic (HD) Key Derivation Engine
- **Target:** `packages/core/src/keys/hd-wallet.ts`
- **Context:** Users managing multiple sub-wallets or organizational accounts need standardized HD derivation paths (`m/44'/148'/<account>'`).
- **Specification:**
  - Implement BIP-44 path parser and child key derivation from root BIP-39 mnemonic.
  - Functions: `deriveAccount(accountIndex: number)`, `listDerivedAccounts(count: number)`.
- **Acceptance Criteria:** Derivation matches official SEP-0005 test vectors for accounts 0, 1, and 2.

#### #286 [Core] SEP-0030 Web3 Account Recovery Protocol Client Implementation
- **Target:** `packages/core/src/stellar/sep30.ts`
- **Context:** Stellar ecosystem standard for multi-party key recovery using identity verification providers.
- **Specification:**
  - Implement client interface for SEP-0030 recovery servers: register recovery identities, initiate recovery requests, submit guardian authentication signatures.
- **Acceptance Criteria:** Interacts with mock SEP-30 recovery server; executes end-to-end account key recovery.

#### #287 [Core] SEP-0024 Hosted Deposit and Withdrawal Interactive Flow Integration
- **Target:** `packages/core/src/stellar/sep24.ts`
- **Context:** Gasless wallets must support fiat on/off-ramping via regulated Stellar anchor partners.
- **Specification:**
  - Implement SEP-24 client fetching `GET /info`, initiating interactive deposit/withdrawal sessions, and polling transaction status.
- **Acceptance Criteria:** Successfully retrieves interactive URL for deposit and returns transaction progress states.

#### #288 [Core] SEP-0038 Anchor Platform Cross-Asset Quotes API Client Integration
- **Target:** `packages/core/src/stellar/sep38.ts`
- **Context:** Requesting firm quotes from anchors for asset swaps and conversion rates.
- **Specification:**
  - Implement SEP-38 client methods: `getPrices()`, `getQuote()`, `postQuote()`.
  - Type definitions for indicative and firm quote responses.
- **Acceptance Criteria:** Validates quote parameters and computes conversion pricing accurately.

#### #289 [Core] Zero-Knowledge Proof (zk-SNARK) Verification Engine for Anonymous Policy Compliance
- **Target:** `packages/core/src/crypto/zk.ts`
- **Context:** Allow users to prove they satisfy spending policies (e.g. KYC verified, country not sanctioned) without revealing their personal identity.
- **Specification:**
  - Implement lightweight Groth16 proof verifier for SnarkJS / Circom generated proofs.
  - Embed proof data into transaction memos or contract invocation parameters.
- **Acceptance Criteria:** Verifies valid proof against verification key; rejects tampered public inputs.

#### #290 [Core] Cross-Platform Encrypted Keystore with WebCrypto API and Argon2id Key Derivation
- **Target:** `packages/core/src/keys/keystore.ts`
- **Context:** Device keys stored on disk or browser must be encrypted using memory-hard key derivation to withstand brute-force attacks.
- **Specification:**
  - Implement keystore encryption using Argon2id / PBKDF2 with 100,000+ iterations and AES-256-GCM authenticated cipher.
  - Standard JSON export format matching Stellar ecosystem keystore recommendations.
- **Acceptance Criteria:** Successfully encrypts keypair with passphrase; rejects decryption attempts with incorrect passphrases.

#### #291 [Core] Air-Gapped Offline Transaction Drafting and Animated QR-Code Signer Pipeline
- **Target:** `packages/core/src/stellar/airgap.ts`
- **Context:** High-security wallets require signing transactions on air-gapped devices without network interfaces.
- **Specification:**
  - Utility that splits large transaction XDR envelopes into multipart URIs for animated QR code rendering (BC-UR format).
  - Reassembles multipart frames on the air-gapped device for verification and signing.
- **Acceptance Criteria:** Reassembles 2KB transaction XDR across 5 sequential QR frames with checksum verification.

#### #292 [Core] Native Support for Stellar Muxed Accounts (MED25519 / M... addresses)
- **Target:** `packages/core/src/stellar/muxed.ts`
- **Context:** Exchanges and payment processors require muxed addresses (M-addresses) to route payments without separate memos.
- **Specification:**
  - Support encoding and decoding of MuxedAccount addresses (`M...`).
  - Seamlessly handle muxed destinations in `buildPaymentTransaction` and policy engine checks.
- **Acceptance Criteria:** Correctly parses M-address into base public key and 64-bit memo ID; validates policy against underlying account.

#### #293 [Core] Dynamic Fee-Bump Estimator with Horizon Ledger Surge Pricing Analysis
- **Target:** `packages/core/src/stellar/fees.ts`
- **Context:** Under network congestion, fixed fee-bumps cause transactions to get stuck in Horizon mempools.
- **Specification:**
  - Fetch recent fee stats from `GET /fee_stats`.
  - Dynamically calculate optimal fee-bump based on current network percentile fees with configurable max cap.
- **Acceptance Criteria:** Recommends surge fee during simulated congestion; caps fee at predefined maximum.

#### #294 [Core] Soroban WASM Metadata Parser and ScVal Type Serializer Generator
- **Target:** `packages/core/src/soroban/metadata.ts`
- **Context:** Inspecting contract WASM binaries to extract exported functions, argument types, and docstrings.
- **Specification:**
  - Parse `contractenvmetav0` custom sections from compiled WASM bytes.
  - Automatically generate TypeScript type definitions and ScVal converter functions.
- **Acceptance Criteria:** Correctly parses sample contract WASM and outputs complete interface specification.

#### #295 [Core] WebSocket Event Client for Stellar Horizon Streaming and Soroban RPC Topics
- **Target:** `packages/core/src/stellar/stream.ts`
- **Context:** Long-polling Horizon endpoints wastes bandwidth and battery on mobile clients.
- **Specification:**
  - Provide streaming event client supporting automatic reconnection with exponential backoff.
  - Listen for payment operations, account updates, and Soroban contract events.
- **Acceptance Criteria:** Automatically reconnects upon network disconnection; resubscribes to event topics without dropping state.

#### #296 [Core] Pluggable SDK Telemetry, Diagnostics Hook, and Structured Logger Interface
- **Target:** `packages/core/src/telemetry.ts`
- **Context:** SDK users need the ability to connect internal loggers (Winston, Pino, Datadog) to Lumen SDK events.
- **Specification:**
  - Define `LumenLogger` interface with `debug`, `info`, `warn`, `error`.
  - Provide hook emitting structured diagnostic events for transaction lifecycle metrics.
- **Acceptance Criteria:** Custom logger receives structured event payloads; sensitive secrets and keys are redacted.

#### #297 [Core] Tree-Shakable Package Bundle Optimization Reducing Web SDK Footprint to Under 45KB
- **Target:** `packages/web-sdk/package.json`, `packages/core/package.json`
- **Context:** The current bundle includes unused dependencies, slowing initial page load times for web applications.
- **Specification:**
  - Configure `sideEffects: false` in `package.json`.
  - Use ESM module exports and isolate heavy crypto dependencies into optional dynamic imports.
- **Acceptance Criteria:** Webpack / Vite production bundle analysis shows `@lumen/web-sdk` core import footprint below 45KB gzipped.

---

### Part 5: Tooling, CLI, DevOps, Observability & Auditing (#298 - #312)

#### #298 [Tooling] Interactive CLI Onboarding Wizard (lumen init) with Environment & Key Setup
- **Target:** `packages/cli/src/commands/init.ts`
- **Context:** New developers setting up a Lumen server struggle with creating `.env` files and generating sponsor/cosigner keys.
- **Specification:**
  - Command `lumen init` with interactive terminal prompts (inquirer/prompts).
  - Generates Stellar keypairs for sponsor and cosigner, funds them on Testnet via Friendbot, and writes `.env` file.
- **Acceptance Criteria:** Running `lumen init` creates working `.env` configuration file with funded Testnet accounts.

#### #299 [Tooling] CLI Soroban Contract Deployment and Invocation Tooling (lumen contract)
- **Target:** `packages/cli/src/commands/contract.ts`
- **Context:** Developers must jump between `stellar-cli` and `lumen-cli` to deploy and interact with smart contracts.
- **Specification:**
  - `lumen contract deploy <path-to-wasm>`: Deploys WASM and outputs contract ID.
  - `lumen contract invoke <contract-id> <method> --args ...`: Invokes contract method with automatic type conversion.
- **Acceptance Criteria:** Successfully deploys test WASM and invokes read/write methods from terminal.

#### #300 [Tooling] CLI Policy Dry-Run and Simulation Engine for Offline Policy Evaluation
- **Target:** `packages/cli/src/commands/policy-simulate.ts`
- **Context:** Admins need to verify whether a complex transaction envelope will pass configured policy rules before submitting to production.
- **Specification:**
  - Command `lumen policy test --policy <policy.json> --xdr <txXdr>`.
  - Prints rule-by-rule evaluation results, highlighted passes/failures, and remaining velocity allowances.
- **Acceptance Criteria:** Outputs colored terminal table showing exact reason for policy approval or rejection.

#### #301 [Tooling] Static Security Linter and AST Analyzer for Stellar XDR Injection Vulnerabilities
- **Target:** `scripts/linter/`
- **Context:** Developers building custom transaction envelopes risk injection attacks if untrusted inputs are passed without sanitization.
- **Specification:**
  - AST linter rule for ESLint scanning codebases for unsanitized XDR decoding or raw secret key handling.
  - Flags potential security hazards with actionable fix recommendations.
- **Acceptance Criteria:** Linter flags insecure patterns in test files and passes clean implementations.

#### #302 [Tooling] Automated High-Throughput Load and Concurrency Benchmark Suite with k6
- **Target:** `packages/server/__tests__/load/`
- **Context:** Ensure `@lumen/server` can handle 500+ requests per second without Redis lock exhaustion or memory leaks.
- **Specification:**
  - Create k6 load testing scripts testing `/cosign`, `/fee-bump`, and `/health` under sustained high concurrency.
  - Output latency percentiles ($p50$, $p95$, $p99$) and throughput charts.
- **Acceptance Criteria:** Server maintains < 150ms $p95$ response time at 250 requests/second on standard compute hardware.

#### #303 [Tooling] GitHub Actions CI Pipeline for Soroban Contract Compilation, Stripping, and ABI Export
- **Target:** `.github/workflows/contracts.yml`
- **Context:** Continuous integration must verify that Soroban smart contracts compile without errors and do not exceed WASM size limits.
- **Specification:**
  - GitHub Actions workflow running `cargo build --target wasm32-unknown-unknown --release`.
  - Executes `wasm-opt`, verifies binary size < 64KB, and generates TypeScript interface definitions.
- **Acceptance Criteria:** Workflow triggers on contract code changes and fails if WASM binary exceeds size budget.

#### #304 [Tooling] Automated Local Stellar Standalone Container E2E Test Suite in CI
- **Target:** `.github/workflows/e2e.yml`, `docker/docker-compose.yml`
- **Context:** Unit tests against mock APIs miss subtle Horizon transaction validation errors and RPC breaking changes.
- **Specification:**
  - GitHub Action starting `stellar/quickstart:testing` Docker container.
  - Executes full end-to-end test suite: account creation, multisig setup, co-signing, fee-bump, and ledger confirmation.
- **Acceptance Criteria:** E2E suite executes against local Stellar container in CI with 100% pass rate.

#### #305 [Tooling] Interactive Documentation Site with Embedded Code Playground using Starlight
- **Target:** `docs/`
- **Context:** Current markdown documentation is fragmented; developers need a cohesive searchable documentation site with live code examples.
- **Specification:**
  - Build documentation site using Astro Starlight.
  - Include guides, API reference generated from TypeDoc, and embedded interactive code sandbox.
- **Acceptance Criteria:** `pnpm docs:build` generates static site with functional search and navigation.

#### #306 [Tooling] Secure CLI Keystore Export and Migration Tool with AES-GCM Encryption
- **Target:** `packages/cli/src/commands/export.ts`
- **Context:** Migrating wallets between development machines or exporting keys for backup requires secure encrypted serialization.
- **Specification:**
  - Command `lumen wallet export --id <walletId> --out <file.json>`.
  - Prompts for strong password, generates Argon2id salt, and saves AES-256-GCM encrypted keystore file.
- **Acceptance Criteria:** Exported file contains standard encrypted format; imports successfully on secondary machine.

#### #307 [Tooling] Automated Changeset Release and Multi-Package NPM Publishing Workflow
- **Target:** `.github/workflows/release.yml`, `.changeset/`
- **Context:** Managing semver releases across 6 monorepo packages manually risks version mismatch and broken dependencies.
- **Specification:**
  - Configure Changesets GitHub Action for automated pull request release notes and version bumping.
  - Publish packages to NPM with provenance verification upon release PR merge.
- **Acceptance Criteria:** Merging version release PR publishes updated packages to registry with correct version tags.

#### #308 [Tooling] Real-Time CLI Audit Stream (lumen audit) for Monitoring Policy Decisions
- **Target:** `packages/cli/src/commands/audit.ts`
- **Context:** DevOps engineers need an instant terminal view of co-signing activity, policy denials, and fee usage without opening Grafana.
- **Specification:**
  - Command `lumen audit --server <url> --follow`.
  - Streams real-time server policy decisions via WebSocket, highlighting approvals in green and rejections in red.
- **Acceptance Criteria:** Live terminal stream displays formatted transaction events as they occur.

#### #309 [Tooling] Mutation and Differential Fuzz Testing Harness for Transaction Building and Policy Checks
- **Target:** `packages/core/__tests__/fuzz/`
- **Context:** Malformed XDR envelopes or unusual asset codes can cause unhandled exceptions or bypass naive string checks.
- **Specification:**
  - Implement fuzz testing harness using `fast-check` generating arbitrary XDR envelopes, mutated operations, and boundary amounts.
  - Verify that parser never throws unhandled panics and policy engine always fails closed.
- **Acceptance Criteria:** 25,000+ randomized fuzz iterations run with zero unhandled exceptions.

#### #310 [Tooling] Multi-Container Docker Compose Stack with Stellar RPC, Redis Cluster, and PostgreSQL
- **Target:** `docker/docker-compose.yml`, `docker/docker-compose.override.example.yml`
- **Context:** Local developer setup should match production topology with standalone Stellar network, Redis sentinel, and PostgreSQL.
- **Specification:**
  - Compose configuration orchestrating: Stellar Quickstart (Horizon + RPC), Redis Sentinel cluster, PostgreSQL, and `@lumen/server`.
  - Include auto-provisioning script funding local test accounts.
- **Acceptance Criteria:** `docker compose up` spins up full stack; healthchecks report all services healthy within 30 seconds.

#### #311 [Tooling] Synthetic Transaction Monitoring Canary Daemon for Production Health Probing
- **Target:** `packages/server/src/canary/`
- **Context:** Silent failures in Horizon co-signing or network timeouts may not trigger standard HTTP 500 error alerts.
- **Specification:**
  - Background daemon executing a synthetic 0.00001 XLM gasless payment loop every 5 minutes.
  - Records end-to-end confirmation latency; alerts if canary transaction fails twice consecutively.
- **Acceptance Criteria:** Canary runs continuously; records latency metrics; emits alert if transaction confirmation times out.

#### #312 [Tooling] Comprehensive Developer Video Onboarding Script and Quickstart Interactive Tutorials
- **Target:** `docs/tutorials/`
- **Context:** Accelerate developer onboarding by providing step-by-step video scripts, architectural diagrams, and interactive tutorial walkthroughs.
- **Specification:**
  - Create markdown tutorial walkthroughs: "Building a Gasless React dApp in 10 Minutes", "Deploying a Soroban Smart Account", "Writing Custom Policy Rules".
  - Include ASCII diagrams and copy-paste code snippets.
- **Acceptance Criteria:** Complete end-to-end tutorial verified by executing all steps from a fresh clone.

---

## Getting Help

If you have questions about any issue or implementation details:
- Comment on the corresponding [GitHub Issue](https://github.com/utilityjnr1/lumena/issues).
- Check the [Documentation](./docs) directory for design specs and key management architecture.


