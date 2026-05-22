# 24G Developer SDK

A Lerna-managed monorepo of developer tooling packages published under the `@twentyfourg-developer-sdk` npm scope.

## Packages

| Package | Version | Description |
|---|---|---|
| [`@twentyfourg-developer-sdk/core`](./packages/core/README.md) | 1.0.0 | Unified entry point that auto-loads all other SDK packages |
| [`@twentyfourg-developer-sdk/is-common-password`](./packages/is-common-password/README.md) | 1.0.1 | Checks a password against the top 1,000 most common passwords |
| [`@twentyfourg-developer-sdk/lxp-package-helper`](./packages/lxp-package-helper/README.md) | 1.1.0 | Interactive CLI to update the `lxp-base` package in LXP API repositories |
| [`@twentyfourg-developer-sdk/model-data-generator`](./packages/model-data-generator/README.md) | 1.0.8 | Interactive CLI that generates and inserts dummy data from Sequelize model files |

## Repository Structure

```
developer-sdk/
├── packages/
│   ├── core/                   # @twentyfourg-developer-sdk/core
│   ├── is-common-password/     # @twentyfourg-developer-sdk/is-common-password
│   ├── lxp-package-helper/     # @twentyfourg-developer-sdk/lxp-package-helper
│   └── model-data-generator/   # @twentyfourg-developer-sdk/model-data-generator
├── lerna.json
└── package.json
```

## Prerequisites

- **Node.js** v18+
- **npm** (v7+ recommended for workspaces)

## Getting Started

### Install root dependencies

```bash
npm install
```

### Create a new package

A scaffolding script is provided to bootstrap a new package:

```bash
npm run create-package
```

## Development

### Linting

This repo uses [ESLint](https://eslint.org/) (Airbnb base config) and [Prettier](https://prettier.io/).

```bash
# Auto-fix ESLint issues
npm run lint:eslint -- <file>

# Auto-format with Prettier
npm run lint:prettier -- <file>
```

Linting is also enforced automatically on staged files via `lint-staged` at commit time.

### Commit Conventions

All commits must follow the [Conventional Commits](https://www.conventionalcommits.org/) specification. A `commit-msg` git hook enforces this via `commitlint`. Recognized types are:

| Type | Changelog section |
|---|---|
| `feat` | Features |
| `fix` | Bug Fixes |
| `build` | Build |

## Releases & Publishing

Releases are fully automated via the GitHub Actions workflow defined in [`.github/workflows/release.yml`](.github/workflows/release.yml).

On every push to `master`:
1. Lerna determines which packages changed and bumps their versions using conventional commits.
2. GitHub releases are created for each changed package.
3. Packages are published to the public npm registry under the `@twentyfourg-developer-sdk` scope.

> **Required secrets:** `NPM_TOKEN` (npm publish token) and `GITHUB_TOKEN` (automatically provided).

## License

UNLICENSED – proprietary to 24G.
