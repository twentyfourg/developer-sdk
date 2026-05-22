# Package: `@twentyfourg-developer-sdk/lxp-package-helper`

[![Version](https://flat.badgen.net/npm/v/@twentyfourg-developer-sdk/lxp-package-helper)](https://github.com/twentyfourg/developer-sdk/releases)
[![Installs](https://flat.badgen.net/npm/dt/@twentyfourg-developer-sdk/lxp-package-helper)](https://www.npmjs.com/package/@twentyfourg-developer-sdk/lxp-package-helper)

> **Location:** `packages/lxp-package-helper/`  
> **Version:** `1.1.0`  
> **Module type:** ES Module (`"type": "module"`)  
> **Entry / binary:** `./src/index.js`

---

## Purpose

`lxp-package-helper` is an **interactive command-line tool** that automates the process of updating the `lxp-base` private npm package across a set of LXP API repositories. It:

1. Lets you select a target LXP API repository.
2. Prompts for the branch to clone.
3. Clones the repository locally.
4. Fetches all GitHub Releases that contain a `.tgz` package asset and lets you search for and select the desired version.
5. Downloads the `.tgz` package asset.
6. Updates `package.json`, runs `npm install`, removes old `.tgz` files, stages files, commits, and pushes — all without manual intervention.

---

## Prerequisites

| Requirement | Details |
|---|---|
| Node.js | v18+ recommended |
| Git | Must be available in `PATH` |
| npm | Must be available in `PATH` |
| `LXP_PACKAGE_HELPER_GITHUB_TOKEN` | GitHub Personal Access Token with `repo` scope (to read releases & download assets) |
| `LXP_PACKAGE_HELPER_URL` | Base GitHub API URL for the private package releases endpoint (e.g. `https://api.github.com/repos/twentyfourg/<package-repo>`) |

---

## Installation

```bash
npm install -g @twentyfourg-developer-sdk/lxp-package-helper
```

Or run it directly with `npx`:

```bash
LXP_PACKAGE_HELPER_GITHUB_TOKEN=<token> \
LXP_PACKAGE_HELPER_URL=<api-url> \
npx @twentyfourg-developer-sdk/lxp-package-helper
```

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `LXP_PACKAGE_HELPER_GITHUB_TOKEN` | **Yes** | GitHub Personal Access Token used to authenticate against the GitHub API when fetching release assets. |
| `LXP_PACKAGE_HELPER_URL` | **Yes** | GitHub API base URL for the private package repository releases (e.g. `https://api.github.com/repos/twentyfourg/my-private-package-repo`). |

---

## Interactive Workflow

Once launched, the tool guides you through the following prompts:

```
? Select a repository    → choose from preconfigured LXP API repos
? Branch to clone and update → type a branch name (e.g. main, develop)
✔ Cloning repository...
✔ Current version: v1.2.3
? Search for package version → type a version string to filter releases
? Select a version       → pick from the 15 most recent matching releases
↓ Downloading: https://...
✔ Download complete
✔ Updated lxp-base to lxp-base-1.3.0.tgz
✔ Running npm install
✔ Deleted lxp-base-1.2.3.tgz
✔ Staged and committed files
✔ Pushed commit to origin
✔ Deleting clone
```

---

## Supported Repositories

The following repositories are pre-configured as targets (defined in `Prompt.js`):

- `2873-13-vw-cup-lxp-api`
- `2693-7-porsche-lxp-api`
- `2970-1-ev-academy-lxp-api`
- `3004-1-gm-ev-academy-lxp-api`

---

## Architecture

```
packages/lxp-package-helper/src/
├── index.js              # CLI entry point — instantiates and starts Prompt
├── Prompt.js             # Main orchestration class (all interactive logic)
└── util/
    └── format.time.util.js  # Date formatting helpers (relative time + timestamp)
```

### `Prompt` class — key methods

| Method | Description |
|---|---|
| `start()` | Main entry point; validates env vars and orchestrates the full workflow |
| `selectRepo()` | Interactive prompt to select the target repository |
| `selectBranch()` | Interactive prompt to enter the branch name |
| `cloneRepo()` | Clones the selected repo/branch to a temp directory |
| `fetchAllReleases(url, acc)` | Recursively paginates the GitHub Releases API and returns releases containing `.tgz` assets |
| `promptVersion()` | Prompts for a version search string |
| `selectVersion()` | Presents the top 15 filtered releases (sorted by version desc) for selection |
| `downloadPackage()` | Downloads the selected release `.tgz` asset via `axios` |
| `updatePackageJsonDependency()` | Updates the `package.json` `dependencies` entry to point to the local `.tgz` file |
| `npmInstall()` | Runs `npm install <packageName>` inside the cloned repo |
| `deleteOldPackages()` | Removes all stale `.tgz` files from a previous version |
| `commitFiles()` | Stages and commits relevant files with a `build:` commit message |
| `pushFiles()` *(static)* | Pushes the commit to `origin HEAD` |

---

## Dependencies

| Package | Role |
|---|---|
| `@twentyfourg/cloud-sdk` | Internal Cloud SDK |
| `axios` | HTTP client used to stream `.tgz` download |
| `chalk` | Terminal colour output |
| `date-fns` | ISO date parsing and relative time formatting |
| `enquirer` | Interactive terminal prompts |

---

## Changelog

### v1.1.0 (2024-06-04)
- **Feature:** Repositories are now cloned automatically and updated in one step.

### v1.0.1 (2024-02-26)
- Version bump.

### v1.0.0 (2024-02-26)
- Initial release of `lxp-package-helper`.
