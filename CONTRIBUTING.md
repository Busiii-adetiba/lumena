# Contributing to Lumen

Thank you for your interest in contributing to **Lumen**! We welcome contributions from the community.

## Development Setup

### Prerequisites

- Node.js >= 20
- pnpm >= 9
- Docker & Docker Compose (for running local Stellar quickstart network)

### Clone and Install

```bash
git clone https://github.com/utilityjnr1/lumena.git
cd lumena
pnpm install
```

### Building the Project

```bash
pnpm build
```

### Running Tests

```bash
# Run all package unit tests
pnpm test

# Run tests in a specific package
pnpm --filter @lumen/server test
pnpm --filter @lumen/core test
```

### Running Local Stellar Network

```bash
docker compose -f docker/docker-compose.yml up -d stellar
```

## Workflow

1. Fork the repository and create your branch from `main`:
   ```bash
   git checkout -b feature/my-feature
   ```
2. Make your code changes, ensuring all existing tests pass and adding new unit tests for your changes.
3. Verify the build and formatting:
   ```bash
   pnpm build
   pnpm test
   ```
4. Commit your changes using conventional commit format:
   ```
   feat: add new feature
   fix: resolve bug in transaction parsing
   test: add unit tests
   docs: update documentation
   ```
5. Push to your fork and submit a Pull Request!
