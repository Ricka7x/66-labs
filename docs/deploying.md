# How to deploy an app

Quick runbook for "ship a new release of Boomark/Peggo/Snapback." For how the pipeline
is actually built (Cloudflare, Sparkle, signing, secrets), see
[`infrastructure.md`](infrastructure.md) instead; this file is just the steps.

## Before running anything

**Every commit in the app repo since the last tag needs a conventional-commit prefix**
(`feat:`, `fix:`, `docs:`, `chore:`, etc.), or the version bump below gets it wrong.
The release pipeline determines the next version with git-cliff
(`releases/<app>/scripts/cliff.toml`): `filter_unconventional = true` drops any commit
with no recognized prefix entirely, and only `feat`/`fix` count toward a bump
(`features_always_bump_minor = true`). A commit like `"Add dark mode"` with no prefix
doesn't just get mis-classified, it's invisible to the bump logic: it can leave the
pipeline concluding there's *nothing* to release even though real commits landed.

Check what it would actually detect before running for real:

```bash
git-cliff --repository /Users/ricka7x/Projects/<App> \
  --config /Users/ricka7x/Projects/66-studio/releases/<app>/scripts/cliff.toml \
  --bumped-version --unreleased
```

If that doesn't look right (wrong bump size, or "nothing to bump" when there
obviously is something to ship), fix the commit messages before deploying rather than
fighting it with `--version` after the fact:

- **Not pushed yet:** reword in place. `git commit --amend` for the tip commit; for an
  older one, replay the chain with `git commit-tree` (never `rebase -i`, it's
  disallowed in this environment: no interactive input). Preserve each commit's
  original tree hash, author, and dates, change only the message:
  ```bash
  T=$(git rev-parse <commit>^{tree})
  git commit-tree "$T" -p <new-parent> -m "feat: ..."
  ```
  then `git diff <old-head> <new-head>` to confirm it's empty before moving the branch
  pointer (`git update-ref refs/heads/main <new-head>`).
- **Already pushed:** don't rewrite history. Pass `--version X.Y.Z` to
  `build-and-release.sh` instead (see below).

## Running a release

```bash
cd /Users/ricka7x/Projects/66-studio/releases/<boomark|peggo|snapback>/scripts
./build-and-release.sh                  # auto-detects the version via git-cliff
./build-and-release.sh --version 1.2.3  # or override it explicitly
./build-and-release.sh --dry-run        # see what it would do without doing it
```

This runs tests, archives, notarizes, builds the DMG, generates the Sparkle appcast,
uploads to R2, purges Cloudflare's cache, and pushes both the app repo (tagged
`v<version>`) and this release repo. It takes several minutes (notarization alone is
a polling wait loop) and is **not easily reversible** once it pushes and distributes:
treat it like a real production deploy, because it is one.

Assumes the one-time setup already exists for this app: Developer ID signing identity
in the keychain, a `snapback-notary` notarization keychain profile, a per-app Sparkle
EdDSA key in the keychain, and `CLOUDFLARE_API_TOKEN` exported in the shell. See
`infrastructure.md` §5/§6/§9 if any of that is missing for a given app.

## After

- Confirm the new DMG and `appcast.xml` landed under `releases/<app>/releases/` here
  and that the app repo got tagged.
- The 66-studio catalog site's download link auto-updates if `CATALOG_FILE`/
  `CATALOG_APP_SLUG` are set in that app's `config.sh` (`update-catalog-link.py` runs
  as part of the pipeline); otherwise update `src/lib/apps.ts` by hand.
