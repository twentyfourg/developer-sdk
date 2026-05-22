# @twentyfourg-developer-sdk/lxp-package-helper

[![Version](https://flat.badgen.net/npm/v/@twentyfourg-developer-sdk/lxp-package-helper)](https://github.com/twentyfourg/developer-sdk/releases) [![Installs](https://flat.badgen.net/npm/dt/@twentyfourg-developer-sdk/lxp-package-helper)](https://www.npmjs.com/package/@twentyfourg-developer-sdk/lxp-package-helper)

An interactive CLI tool that automates updating the `lxp-base` package inside LXP API repositories. It clones the target repository, downloads the selected release asset, patches `package.json`, runs `npm install`, removes old `.tgz` files, and pushes the result — all from a single prompt-driven session.

## Requirements

- Node.js v18+
- The following environment variables must be set:

| Variable | Description |
|---|---|
| `LXP_PACKAGE_HELPER_GITHUB_TOKEN` | A GitHub personal access token with `repo` scope (used to fetch releases and download assets). |
| `LXP_PACKAGE_HELPER_URL` | Base URL of the GitHub API releases endpoint for the `lxp-base` package (e.g. `https://api.github.com/repos/twentyfourg/<repo>`). |

## Usage

```bash
npx @twentyfourg-developer-sdk/lxp-package-helper
```

Or, if installed globally:

```bash
lxp-package-helper
```

## Interactive Workflow

When run, the CLI walks through the following steps:

1. **Select repository** – Choose one of the supported LXP API repositories:
   - `2873-13-vw-cup-lxp-api`
   - `2693-7-porsche-lxp-api`
   - `2970-1-ev-academy-lxp-api`
   - `3004-1-gm-ev-academy-lxp-api`

2. **Enter branch** – Specify the branch to clone and update.

3. **Clone repository** – The selected repo is cloned locally to `./.developer-sdk-cloned-repo`. Any existing clone at that path is deleted first.

4. **Detect current version** – The current `lxp-base` version is read from the cloned repo's `package.json` and displayed.

5. **Search for version** – Enter a version string to search available GitHub releases.

6. **Select version** – Pick from the most recent matching releases (up to 15 shown), with relative timestamps.

7. **Download package** – The `.tgz` asset for the selected release is downloaded into the cloned repo's working directory.

8. **Apply changes** – The following actions are performed automatically:
   - `package.json` dependency updated to the new `file:<package>.tgz` reference.
   - `npm install` is run to update `package-lock.json`.
   - Old `lxp-base-*.tgz` files are deleted.
   - Changed files are staged and committed with message `build: update lxp-base to <version>`.
   - The commit is pushed to origin.

9. **Cleanup** – The local clone is removed.

## Error Handling

Errors are printed to the console in red and the process exits cleanly. Required environment variables are validated at startup.

## Dependencies

- [`@twentyfourg/cloud-sdk`](https://github.com/twentyfourg/cloud-sdk)
- `axios` – HTTP downloads
- `chalk` – Terminal color output
- `date-fns` – Human-readable timestamps
- `enquirer` – Interactive prompts

## Changelog

See [CHANGELOG.md](./CHANGELOG.md).
