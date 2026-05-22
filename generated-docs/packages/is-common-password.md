# Package: `@twentyfourg-developer-sdk/is-common-password`

[![Version](https://flat.badgen.net/npm/v/@twentyfourg-developer-sdk/is-common-password)](https://github.com/twentyfourg/developer-sdk/releases)
[![Installs](https://flat.badgen.net/npm/dt/@twentyfourg-developer-sdk/is-common-password)](https://www.npmjs.com/package/@twentyfourg-developer-sdk/is-common-password)

> **Location:** `packages/is-common-password/`  
> **Version:** `1.0.1`  
> **Entry point:** `./src/index.js`

---

## Purpose

A tiny utility that checks whether a given string matches one of the **top 1,000 most common passwords** (sourced from the well-known `10-million-password-list-top-1000.txt` wordlist). Use it to reject weak passwords during user registration or password-reset flows.

---

## Installation

```bash
npm install @twentyfourg-developer-sdk/is-common-password
```

---

## API

### `isCommonPassword(password: string): boolean`

Returns `true` if the supplied `password` appears in the top-1,000 common password list, `false` otherwise.

#### Parameters

| Name | Type | Description |
|---|---|---|
| `password` | `string` | The plaintext password to check. |

#### Returns

`boolean` — `true` if the password is common, `false` if it is not.

---

## Usage

```js
const isCommonPassword = require('@twentyfourg-developer-sdk/is-common-password');

if (isCommonPassword('password')) {
  // Reject — too common
  throw new Error('Please choose a less common password.');
}

if (!isCommonPassword('xK#9!mQ2$vL')) {
  // Accept — not on the common list
  console.log('Password is acceptable.');
}
```

---

## How It Works

The module reads the bundled `10-million-password-list-top-1000.txt` file (one password per line) synchronously at call time and checks whether the provided string is included in the resulting array.

```js
const fs = require('fs');
const path = require('path');

module.exports = (password) => {
  const passwords = fs
    .readFileSync(path.resolve(__dirname, './10-million-password-list-top-1000.txt'), 'utf8')
    .split('\n');
  return passwords.includes(password);
};
```

> **Note:** The file is read on every invocation. For high-throughput scenarios, consider caching the list in memory at application start-up.

---

## Changelog

### v1.0.1 (2022-02-02)
- **Bug Fix:** Resolved the bundled `.txt` file path relative to the package location.

### v1.0.0 (2022-02-02)
- Initial release.
