# @twentyfourg-developer-sdk/is-common-password

[![Version](https://flat.badgen.net/npm/v/@twentyfourg-developer-sdk/is-common-password)](https://github.com/twentyfourg/developer-sdk/releases) [![Installs](https://flat.badgen.net/npm/dt/@twentyfourg-developer-sdk/is-common-password)](https://www.npmjs.com/package/@twentyfourg-developer-sdk/is-common-password)

A tiny utility that checks whether a given password appears in the **top 1,000 most common passwords** list.

## Installation

```bash
npm install @twentyfourg-developer-sdk/is-common-password
```

## Usage

```js
const isCommonPassword = require('@twentyfourg-developer-sdk/is-common-password');

isCommonPassword('password');  // true
isCommonPassword('password123'); // true
isCommonPassword('h7$Kp!2mQz'); // false
```

### Signature

```ts
isCommonPassword(password: string): boolean
```

| Parameter | Type | Description |
|---|---|---|
| `password` | `string` | The plain-text password to check. |

**Returns** `true` if the password is in the common-password list, `false` otherwise.

## How It Works

The package bundles a text file (`src/10-million-password-list-top-1000.txt`) containing 1,000 of the most commonly used passwords, one per line. On each call the file is read synchronously and the provided password is checked for membership.

> **Note:** Because the file is read on every invocation the function is best suited for low-frequency checks (e.g. at account creation/password change time). For high-throughput scenarios consider caching the password list in memory.

## Changelog

See [CHANGELOG.md](./CHANGELOG.md).
