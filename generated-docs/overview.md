# 24G Developer SDK — Overview

> **Repository:** [twentyfourg/developer-sdk](https://github.com/twentyfourg/developer-sdk)  
> **License:** UNLICENSED  
> **Package registry:** [npmjs.org](https://www.npmjs.com/) under the `@twentyfourg-developer-sdk` scope

---

## What Is This?

The **24G Developer SDK** is a [Lerna](https://lerna.js.org/) monorepo that houses a collection of internal developer tooling packages published to npm under the `@twentyfourg-developer-sdk` scope. Each package is independently versioned and solves a specific, focused problem for developers working inside the 24G organisation.

---

## Packages

| Package | npm name | Current version | Purpose |
|---|---|---|---|
| [`core`](./packages/core.md) | `@twentyfourg-developer-sdk/core` | `1.0.0` | Unified entry-point that dynamically re-exports every other SDK package |
| [`is-common-password`](./packages/is-common-password.md) | `@twentyfourg-developer-sdk/is-common-password` | `1.0.1` | Checks whether a string is one of the top-1,000 most common passwords |
| [`lxp-package-helper`](./packages/lxp-package-helper.md) | `@twentyfourg-developer-sdk/lxp-package-helper` | `1.1.0` | Interactive CLI to update `lxp-base` package releases across LXP API repos |
| [`model-data-generator`](./packages/model-data-generator.md) | `@twentyfourg-developer-sdk/model-data-generator` | `1.0.8` | Interactive CLI to generate and seed fake data into a MySQL database from Sequelize model files |

---

## Repository Architecture

```
developer-sdk/
├── .develop/
│   └── scripts/
│       └── create-package        # scaffold script to bootstrap a new package
├── .github/
│   └── workflows/
│       └── release.yml           # CI/CD: automated Lerna versioning & npm publish
├── packages/
│   ├── core/                     # @twentyfourg-developer-sdk/core
│   ├── is-common-password/       # @twentyfourg-developer-sdk/is-common-password
│   ├── lxp-package-helper/       # @twentyfourg-developer-sdk/lxp-package-helper
│   └── model-data-generator/     # @twentyfourg-developer-sdk/model-data-generator
├── lerna.json                    # Lerna monorepo configuration
└── package.json                  # root workspace configuration
```

### Monorepo tooling

| Tool | Role |
|---|---|
| **Lerna v8** | Manages independent versioning and publishing across packages |
| **ESLint** (airbnb-base + prettier) | Enforces code style |
| **Prettier** | Code formatter |
| **Commitlint** (conventional-commits) | Enforces commit message format |
| **lint-staged + yorkie** | Runs linting on staged files before every commit |

---

## Getting Started

### Prerequisites

- **Node.js 18+**
- **npm**

### Install dependencies

```bash
npm install
```

### Create a new package

A scaffold script is included to quickly bootstrap a new package inside the monorepo:

```bash
npm run create-package
```

### Linting

```bash
# Auto-fix ESLint issues
npm run lint:eslint -- <file-or-glob>

# Auto-format with Prettier
npm run lint:prettier -- <file-or-glob>
```

---

## CI / CD — Release Workflow

The release pipeline is defined in [`.github/workflows/release.yml`](../.github/workflows/release.yml) and triggers automatically on every push to `master`.

**Steps:**
1. Checkout the full git history (`fetch-depth: 0`) so Lerna can read the commit log.
2. Set up Node.js 18.
3. Authenticate with npm using the `NPM_TOKEN` secret.
4. Run `lerna version` with `--conventional-commits` to bump package versions and generate changelogs, then create a GitHub Release.
5. Run `lerna publish from-git` to push the new versions to the npm registry.

Version bump types follow [Conventional Commits](https://www.conventionalcommits.org/):

| Commit prefix | Changelog section |
|---|---|
| `feat:` | Features |
| `fix:` | Bug Fixes |
| `build:` | Build |

---

## Commit Message Convention

All commits **must** follow the [Conventional Commits](https://www.conventionalcommits.org/) spec. The `commitlint` git hook will reject commits that do not conform.

```
<type>(<optional scope>): <description>

Examples:
  feat(model-data-generator): add support for ENUM columns
  fix(is-common-password): resolve txt file path
  build(deps): bump sequelize from 6.18.0 to 6.19.0
```
