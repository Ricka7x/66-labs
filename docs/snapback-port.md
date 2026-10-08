# Snapback's port into the 66-studio catalog

Snapback was the first app, launched with its own domain (`snapbackapp.com`)
and a dedicated marketing site (`snapback-web`). Peggo and Boomark never had
that: they shipped straight into the 66-studio catalog. This note captures
what's shared between all three, what's intentionally still different, and
what's left as a known loose end.

## Identical to Peggo/Boomark

- **Catalog entry**: `src/lib/apps.ts` has a full `snapback` object (features,
  pricing, tech, links) alongside `peggo` and `boomark`. The homepage shelf,
  `/apps` index, and `/apps/[slug]` page are all driven off this array.
- **Blog content**: `content/blog/introducing-snapback.mdx`,
  `snapback-vs-rectangle.mdx`, `snapback-command-palette.mdx`.
- **Assets**: `public/apps/snapback.png`, `public/apps/snapback/...`.
- **Help docs**: entries in `src/lib/help.ts`.
- **Analytics config**: `ops/config/snapback.json` (GA4 property, Search
  Console site, Lemon Squeezy store ID), same shape as the other apps.
- **Release pipeline**: `releases/snapback/` has its own `config.sh` and the
  same `macos-release-tools` scripts submodule Peggo and Boomark use.
- **Distribution**: downloads and Sparkle updates for every new build come
  from R2 (`dl.66labs.dev/Snapback/...`), same as Peggo and Boomark. The
  catalog link in `apps.ts` and the download button on `snapbackapp.com`
  (`snapback-web/web/src/lib/constants.ts`) both point there now too.

## Intentionally still different

Unlike Peggo and Boomark, Snapback keeps its own domain on purpose: it has
existing SEO and backlinks worth keeping, and the 66-studio catalog entry is
treated as additional, duplicate coverage rather than a replacement.

- `releases/snapback/config.sh` still sets `WEBSITE_URL="https://snapbackapp.com"`
  and keeps `EXTERNAL_SITE_REPO` (mirrors every release into `snapback-web`)
  and `CF_EXTERNAL_ZONE_ID` (purges that domain's own Cloudflare zone). This
  is what keeps `snapbackapp.com/releases/appcast.xml` alive for installs
  that still have it baked into their `Info.plist` as `SUFeedURL`.
- Those older installs self-migrate without any manual step: the appcast
  served at `snapbackapp.com` already has its newest enclosure pointing at
  R2, and every new build's `Info.plist` now carries the R2 `SUFeedURL`
  (`dl.66labs.dev/Snapback/appcast.xml`). The first update an old install
  takes flips it over permanently. There is no cutover deadline and nothing
  breaks for stragglers in the meantime.

## Known loose end (left alone for now)

`snapback-web` also still contains its own older, independent release
pipeline (`config.sh` plus `scripts/build-and-release.sh`), separate from the
one in `releases/snapback/` and not wired to R2 at all (self-hosted download
prefix, the default `ed25519` Sparkle keychain account, no notarization
profile set). Nothing triggers it automatically, but if it were ever run by
hand from inside `snapback-web` instead of from `66-studio`, it would publish
a release the old self-hosted way and undo the R2 switch. Decided to leave it
in place rather than remove it; revisit if it ever causes confusion.
