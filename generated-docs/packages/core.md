# Package: `@twentyfourg-developer-sdk/core`

[![Version](https://flat.badgen.net/npm/v/@twentyfourg-developer-sdk/core)](https://github.com/twentyfourg/developer-sdk/releases)
[![Installs](https://flat.badgen.net/npm/dt/@twentyfourg-developer-sdk/core)](https://www.npmjs.com/package/@twentyfourg-developer-sdk/core)

> **Location:** `packages/core/`  
> **Version:** `1.0.0`  
> **Entry point:** `./src/index.js`

---

## Purpose

`core` is a **unified entry-point** for the entire `@twentyfourg-developer-sdk` ecosystem. Instead of requiring individual packages, consumers can install `core` and access every SDK package through a single `require` / `import`.

At start-up, `core` reads its own `package.json` `dependencies`, identifies every `@twentyfourg-developer-sdk/*` sibling package, and dynamically loads them. Each package is exposed as a camelCase-named property on the exported object.

---

## Installation

```bash
npm install @twentyfourg-developer-sdk/core
```

---

## Usage

```js
const sdk = require('@twentyfourg-developer-sdk/core');

// Access the is-common-password package
const isCommonPassword = sdk.isCommonPassword;
console.log(isCommonPassword('password123')); // true
```

### Environment Variables

| Variable | Required | Description |
|---|---|---|
| `SDK_CORE_LOCATION` | No | Set to `'local'` to resolve packages from the monorepo source tree (e.g. during local development) rather than from `node_modules`. |

---

## How It Works

```js
// packages/core/src/index.js (simplified)
require('dotenv').config();
const { dependencies } = require('../package.json');

const { SDK_CORE_LOCATION } = process.env;
const packages = {};

for (const [dependency] of Object.entries(dependencies)) {
  if (dependency.includes('@twentyfourg-developer-sdk')) {
    // Convert 'is-common-password' → 'isCommonPassword'
    const name = folder
      .replace(/-./g, (x) => x[1].toUpperCase());

    // Resolve from local source tree or node_modules
    const path = SDK_CORE_LOCATION !== 'local' ? dependency : `../../${folder}`;
    packages[name] = require(path);
  }
}

module.exports = packages;
```

1. All `@twentyfourg-developer-sdk/*` entries in `package.json` `dependencies` are iterated.
2. Each package folder name (e.g. `is-common-password`) is converted to camelCase (e.g. `isCommonPassword`).
3. The package is `require()`-d from either its npm path or its local monorepo path, controlled by `SDK_CORE_LOCATION`.
4. The resulting object is exported.

---

## Dependencies

| Dependency | Role |
|---|---|
| `@twentyfourg-developer-sdk/is-common-password` | Bundled SDK package re-exported via core |
| `dotenv` | Loads `.env` files for environment variable configuration |
