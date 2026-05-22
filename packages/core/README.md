# @twentyfourg-developer-sdk/core

[![Version](https://flat.badgen.net/npm/v/@twentyfourg-developer-sdk/core)](https://github.com/twentyfourg/developer-sdk/releases) [![Installs](https://flat.badgen.net/npm/dt/@twentyfourg-developer-sdk/core)](https://www.npmjs.com/package/@twentyfourg-developer-sdk/core)

The `core` package is a convenience entry point that automatically discovers and re-exports every other `@twentyfourg-developer-sdk/*` package listed in its own `dependencies`.

## Installation

```bash
npm install @twentyfourg-developer-sdk/core
```

## Usage

```js
const sdk = require('@twentyfourg-developer-sdk/core');

// Each sibling package is accessible as a camelCase property
console.log(sdk.isCommonPassword('password123')); // true
```

The package names are automatically transformed to camelCase keys:

| Package | Key on `sdk` object |
|---|---|
| `@twentyfourg-developer-sdk/is-common-password` | `sdk.isCommonPassword` |

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `SDK_CORE_LOCATION` | *(unset)* | Set to `local` to resolve sibling packages from the local filesystem (monorepo development). Any other value, or unset, resolves packages from `node_modules`. |

## How It Works

On require, `core/src/index.js`:

1. Reads its own `package.json` `dependencies`.
2. Filters for entries that start with `@twentyfourg-developer-sdk`.
3. Converts the package name suffix to camelCase.
4. Requires each package (locally or from `node_modules` depending on `SDK_CORE_LOCATION`).
5. Returns an object keyed by those camelCase names.

## Dependencies

- [`@twentyfourg-developer-sdk/is-common-password`](../is-common-password/README.md)
- `dotenv`

## Changelog

See [CHANGELOG.md](./CHANGELOG.md).
