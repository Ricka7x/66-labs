# Infrastructure: how 66 labs is actually built, shipped and run

Reference for the full setup behind Peggo, Boomark and Snapback: hosting,
Cloudflare, releases, signing, payments, email and analytics. Written so a
new app can be onboarded the same way without re-deriving any of it.

## 1. The shape of it

- **66-studio** (this repo): a static Next.js catalog site at `66labs.dev`,
  listing every app. Hosted on GitHub Pages.
- **snapback-web**: Snapback's own separate marketing site and domain,
  `snapbackapp.com`. Kept deliberately, on top of the catalog listing, for
  its existing SEO and backlinks.
- **R2** (`dl.66labs.dev`): the one place every app's DMGs and Sparkle
  appcasts actually live, regardless of which website links to them.
- Two shared submodules carry the actual logic: `macos-release-tools`
  (build, sign, notarize, package, publish) and `studio-ops`
  (analytics/sales reporting). Each app only supplies a config file; the
  tooling itself is generic and shared.

## 2. Domains and hosting

| Domain | What it is | Hosted on | Source repo |
|---|---|---|---|
| `66labs.dev` | App catalog | GitHub Pages | `66-studio` |
| `dl.66labs.dev` | Release downloads + appcasts | Cloudflare R2 (custom domain) | n/a (R2 bucket `app-releases`) |
| `snapbackapp.com` | Snapback's own marketing site | GitHub Pages | `snapback-web` |
| `store.66labs.dev` | Checkout pages | Lemon Squeezy (hosted) | n/a |

Both `66-studio` and `snapback-web/web` are static Next.js exports
(`output: "export"` in `next.config.ts`), deployed by near-identical GitHub
Actions workflows (`.github/workflows/deploy-gh-pages.yml` in each repo):
checkout, `npm ci`, `npm run build`, copy the repo's `CNAME` file into the
export, publish `out/` (or `web/out/`) to the `gh-pages` branch via
`peaceiris/actions-gh-pages`, triggered on every push to `main`.

`snapback-web`'s workflow has one extra step `66-studio`'s doesn't need: it
reads `releases/Snapback-*.dmg` to detect the latest version and patches
`LATEST_VERSION` into `web/src/lib/constants.ts` before building, so the
site's version display always matches whatever DMG is actually sitting in
its `releases/` folder.

Email has no dedicated backend. Support contact is just
`mailto:hello@66labs.dev` links scattered through the site (see
`src/lib/help.ts` and every `apps/[slug]` page); replies come from whoever's
actual inbox that address forwards to. The only automated email is
Snapback's Pro waitlist, which posts straight to a Loops (loops.so) form
endpoint from `snapback-web/web/src/app/pro/ProContent.tsx`, no server in
the middle. There's no SMTP, SendGrid or Resend anywhere in either repo.
Wherever `hello@66labs.dev` actually forwards to (Cloudflare Email Routing,
Google Workspace, etc.) isn't checked into either repo; it lives in the
Cloudflare dashboard for the domain, not in code.

## 3. Cloudflare

Two independent zones:

- **`66labs.dev`**, zone id `e85170acb9523dca14edfd3cb4105833`. Owns the R2
  bucket `app-releases`, exposed at the custom domain `dl.66labs.dev`. Every
  app's `config.sh` sets `R2_PREFIX="<AppName>"` and
  `DOWNLOAD_URL_PREFIX="https://dl.66labs.dev/<AppName>"`, so each app gets
  its own folder in the same bucket (`dl.66labs.dev/Peggo/...`,
  `/Boomark/...`, `/Snapback/...`).
- **`snapbackapp.com`**, zone id `0c490f73f4e81b653addab091de212e9`.
  Snapback-only, because it's the only app with its own domain.

After every R2 upload the release pipeline purges the relevant zone's
Cloudflare cache for just the files it touched
(`POST https://api.cloudflare.com/client/v4/zones/<id>/purge_cache`), to
stop Cloudflare serving stale bytes under a reused filename (this bit the
pipeline for real on Peggo's build 4). `CLOUDFLARE_API_TOKEN` is always an
exported shell variable, never written into any `config.sh`. Snapback alone
also purges `CF_EXTERNAL_ZONE_ID` (the `snapbackapp.com` zone) for the files
mirrored into `snapback-web`.

## 4. The release pipeline

Shared submodule `macos-release-tools`
(`https://github.com/Ricka7x/macos-release-tools.git`), checked out three
times inside `66-studio` (`releases/{peggo,boomark,snapback}/scripts/`) and
once standalone inside `snapback-web/scripts/` (the older, now-superseded
copy, see `docs/snapback-port.md`). Each app directory has its own
`config.sh`; the scripts themselves stay generic.

Running `build-and-release.sh` for an app does, in order:

1. Validates the config (Xcode project path exists, `xcodebuild` present).
2. Runs `TEST_COMMAND` (differs per app: Peggo/Boomark run `swift test`
   against their SPM package; Snapback runs `xcodebuild test`, having no
   SPM package to test instead).
3. Archives and exports the app via `xcodebuild archive` /
   `-exportArchive`.
4. Notarizes via `xcrun notarytool`, using a shared keychain profile, then
   staples the ticket.
5. Builds the DMG.
6. Writes `SUFeedURL` (`$DOWNLOAD_URL_PREFIX/appcast.xml`) and
   `SUPublicEDKey` into the exported app's `Info.plist`.
7. Signs the DMG with Sparkle's `sign_update` and generates `appcast.xml`
   via Sparkle's own `generate_appcast`, both keyed off a per-app keychain
   account.
8. Uploads the DMG and appcast to R2 under `R2_PREFIX`, then purges
   `CF_ZONE_ID`.
9. If `EXTERNAL_SITE_REPO` is set (Snapback only), copies the new release
   files and `appcast.xml` into that repo's `releases/` folder, commits and
   pushes, then purges `CF_EXTERNAL_ZONE_ID` too.
10. If `CATALOG_FILE`/`CATALOG_APP_SLUG` are set, runs
    `update-catalog-link.py` to rewrite that app's `download:` link in
    `src/lib/apps.ts`, scoped so it can only ever touch that one app's block.
11. Commits and pushes the release repo and the app's own Xcode-project
    repo, tagging the app repo `v<version>`.

## 5. Code signing and notarization

One Developer ID identity for everything:
`Developer ID Application: Ricardo Ramirez (6WA4QS23C4)`. One shared
notarization keychain profile, `snapback-notary`, reused by all three apps
(set up once via `xcrun notarytool store-credentials`) rather than one
profile per app.

Boomark is the exception on provisioning: it has CloudKit/iCloud
entitlements, so unlike Peggo and Snapback it needs an explicit
`BUNDLE_IDENTIFIER` (`com.66labs.Boomark`) and
`PROVISIONING_PROFILE_UUID` in its `config.sh`; automatic signing alone
isn't enough for it.

## 6. Sparkle auto-updates

Each app has its own EdDSA key pair (`generate_keys` from Sparkle), stored
as a macOS Keychain item under a per-app account name so keys never
collide:

| App | Keychain account |
|---|---|
| Peggo | `peggo` |
| Boomark | `boomark` |
| Snapback | `snapback` |

The public half of each key is committed in plain sight in that app's
`config.sh` (`SPARKLE_ED_PUBLIC_KEY`) and baked into `Info.plist` at build
time; only the private key stays in the keychain. `SUFeedURL` for every new
build points at that app's own `appcast.xml` on R2
(`dl.66labs.dev/<AppName>/appcast.xml`). Snapback is the only app with a
second, legacy feed URL (`snapbackapp.com/releases/appcast.xml`) still live
for installs that predate the R2 migration; see `docs/snapback-port.md` for
why that's intentional and how those installs self-migrate.

## 7. Payments

Lemon Squeezy, one store (id `223535`) shared across apps, checkout links
of the form `https://store.66labs.dev/checkout/buy/<uuid>`. The API key
lives in the macOS Keychain under the service name `lemonsqueezy-api`,
referenced (never duplicated) from `ops/config/*.json`:

```json
{
  "lemonsqueezy_store_id": "223535",
  "lemonsqueezy_key_keychain": "lemonsqueezy-api"
}
```

66labs.dev has no store of its own yet; its own `ops/config/66labs.json`
points at the same Snapback store as a placeholder (flagged in that file's
own `_note` field) until one exists.

## 8. Analytics and ops tooling

Shared submodule `studio-ops`
(`https://github.com/Ricka7x/studio-ops.git`), checked out at `ops/` in both
`66-studio` and `snapback-web`. Config-driven, one JSON file per project
under `ops/config/`:

```json
{
  "site_url": "sc-domain:snapbackapp.com",
  "ga4_property": "properties/539004498",
  "ga4_key_path": "ops-secrets/ga4-reader-snapback.json",
  "lemonsqueezy_store_id": "223535",
  "lemonsqueezy_key_keychain": "lemonsqueezy-api"
}
```

Scripts in `ops/scripts/`:

- `ga4_pulse.py`: traffic report from the GA4 Data API for that project's
  property.
- `gsc_snapshot.py`: Search Console query snapshot (impressions, CTR,
  position) for that project's site.
- `sales_pulse.py`: Lemon Squeezy sales digest, API key pulled from the
  keychain via `lemonsqueezy_key_keychain`.

Each invoked with `--project <slug>`, reading `ops/config/<slug>.json`.
`ops/docs/philosophy.md` has the house rules this tooling follows (no
secrets in repos, config-driven over hardcoded, one shared toolset across
projects); `ops/docs/support-knowledge-base.md` is Snapback's support FAQ,
kept here rather than in `snapback-web` since analytics and support
knowledge are meant to live in one place regardless of which app they're
about.

## 9. Secrets, end to end

Nothing secret is ever committed. The pattern is always: commit a
*reference* to where the secret lives, not the secret.

| Secret | Lives in | Referenced as |
|---|---|---|
| Cloudflare API token | Exported shell env var | `CLOUDFLARE_API_TOKEN` (never in any `config.sh`) |
| Sparkle private key | macOS Keychain | per-app account name (`SPARKLE_ACCOUNT`) |
| Notarization credentials | macOS Keychain | `NOTARY_PROFILE="snapback-notary"` |
| Lemon Squeezy API key | macOS Keychain | service name `lemonsqueezy-api` |
| GA4 service account | Gitignored JSON file | `ops-secrets/ga4-reader-<project>.json` |

Machine-specific overrides (custom `SPARKLE_BIN` paths, a different
`BUILD_DIR`, etc.) go in a gitignored `.env.local` next to each `config.sh`,
copied from a committed `.env.local.example` template and sourced
automatically at the end of `config.sh` if present.

## 10. Submodule map

```
66-studio/.gitmodules
  ops                        -> studio-ops.git
  releases/peggo/scripts     -> macos-release-tools.git
  releases/boomark/scripts   -> macos-release-tools.git
  releases/snapback/scripts  -> macos-release-tools.git

snapback-web/.gitmodules
  scripts                    -> macos-release-tools.git  (legacy, see docs/snapback-port.md)
  ops                        -> studio-ops.git
```

`macos-release-tools` and `studio-ops` are each a single upstream repo
checked out multiple times; a fix or improvement made in one checkout and
pushed upstream is available to every app the next time its submodule
pointer is bumped. Nothing app-specific ever belongs in either submodule;
app-specific values live only in each app's own `config.sh` or
`ops/config/<slug>.json`.

## 11. Replicating this for a new app

1. Build the macOS app as its own Xcode project, same Developer ID
   (`6WA4QS23C4`). Add CloudKit/iCloud entitlements only if the app
   actually needs them, that's what forces a `BUNDLE_IDENTIFIER` and
   `PROVISIONING_PROFILE_UUID` (see Boomark).
2. Generate a fresh Sparkle EdDSA key pair; store the private key in the
   Keychain under a new account named after the app; put the public key in
   the new `config.sh`.
3. Under `66-studio/releases/<app>/`, add `scripts` as another checkout of
   the same `macos-release-tools` submodule, and write a `config.sh` from
   `config.example.sh`: `R2_PREFIX`/`DOWNLOAD_URL_PREFIX` under the shared
   `app-releases` bucket, `WEBSITE_URL="https://66labs.dev/apps/<app>"`
   (no dedicated domain unless there's a real reason for one, see
   Snapback), `NOTARY_PROFILE="snapback-notary"` (reuse, don't create a new
   one), `CATALOG_FILE`/`CATALOG_APP_SLUG` pointing at `src/lib/apps.ts`.
4. Add the app's entry to `src/lib/apps.ts` (copy an existing app's shape).
5. Add `ops/config/<app>.json` with a GA4 property and Search Console site
   for the app (new GA4 property, new verified GSC site); reuse the shared
   Lemon Squeezy store and keychain item unless the app needs its own
   store.
6. Run `build-and-release.sh` once by hand to confirm the whole chain
   (build, notarize, DMG, appcast, R2 upload, cache purge, catalog update,
   git tag/push) before relying on it.

Give the new app its own domain only if there's a concrete reason (existing
SEO, a brand that needs to stand alone, etc.), the way Snapback has one.
Otherwise the catalog entry on `66labs.dev` is the whole website: that's
the Peggo/Boomark default, and it's the simpler one to maintain.
