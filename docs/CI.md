# Continuous Integration & Automation

Lumen uses GitHub Actions to automate testing, linting, and build verification for all packages across the monorepo.

## Workflows

### CI (`.github/workflows/ci.yml`)

The CI workflow triggers on:
- Pushes to the `main` branch
- Pull requests targeting `main`

### Pipeline Stages

1. **Checkout Repository**: Clones repository code with submodules if any.
2. **Setup Node.js 20**: Sets up the Node.js runtime environment.
3. **Install pnpm 9**: Installs the configured pnpm package manager.
4. **Cache Dependencies**: Uses GitHub cache action to cache pnpm store directory based on lockfile hash.
5. **Install Dependencies**: Executes `pnpm install --frozen-lockfile` to ensure exact dependency resolution.
6. **Linter**: Executes `pnpm lint` via ESLint across all workspace packages.
7. **Build Packages**: Compiles TypeScript across all workspace packages via Turborepo (`pnpm build`).
8. **Unit Tests**: Runs Vitest test suites across all packages (`pnpm test`).
