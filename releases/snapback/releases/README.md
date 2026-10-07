# Releases directory for Sparkle appcast

This directory holds your macOS app releases for distribution via Sparkle.

## File Structure

Place your app archive and optional release notes here:

```
Snapback-1.0.0.zip      # Required: Application archive
Snapback-1.0.0.html     # Optional: HTML release notes
appcast.xml             # Generated automatically
old_updates/            # Old releases (auto-managed)
```

## Adding a Release

```bash
# From project root:
export NOTARY_PROFILE="snapback-notary" ./scripts/release.sh ./path/to/Snapback-1.0.0.zip
```

This will:

1. Copy the archive to this directory
2. Generate/update appcast.xml
3. Handle version management

## Appcast Generation

To manually regenerate appcast.xml:

```bash
./scripts/generate-appcast.sh
```

See [SPARKLE_SETUP.md](../SPARKLE_SETUP.md) for full documentation.
