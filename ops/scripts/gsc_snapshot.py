#!/usr/bin/env python3
"""Snapback Search Console snapshot: real query and page performance data.

Requires the google_search_console connection active in Composio (this repo
does not call Google APIs directly here; this script is a reference for
re-running the same query manually via the Composio MCP tools in Hermes, or
via a direct OAuth flow if wired up later).

For now, treat this as a documented, repeatable query spec, not a live
script: run the equivalent GOOGLE_SEARCH_CONSOLE_SEARCH_ANALYTICS_QUERY call
through Hermes/Composio and paste the output into a dated file under
ops/docs/seo/ for the record.

site_url: sc-domain:snapbackapp.com
"""

QUERY_SPEC = {
    "queries": {
        "site_url": "sc-domain:snapbackapp.com",
        "dimensions": ["query"],
        "row_limit": 50,
    },
    "pages": {
        "site_url": "sc-domain:snapbackapp.com",
        "dimensions": ["page"],
        "row_limit": 30,
    },
}

# Snapshot from 2026-06-26 to 2026-09-23 (90 days), pulled via Composio
# google_search_console connection, siteOwner permission confirmed.
#
# Headline finding: mac-window-snapping-shortcuts-guide had 6818 impressions
# (more than every other page combined) at position ~9.85 but only a 0.41%
# CTR (28 clicks). Title/description sharpened in the same commit that added
# this file: see content/blog/mac-window-snapping-shortcuts-guide.mdx.
#
# Other real gaps found in this pull:
# - "best mac window manager" (78 impressions, position ~31.7, 0 clicks):
#   best-mac-window-managers.mdx ranks too low to get clicks despite decent
#   volume. AeroSpace section already added; recheck position after reindex.
# - Several "amethyst ..." queries appearing (low volume, page ~7 to ~49):
#   Amethyst section already exists in best-mac-window-managers.mdx.
# - "appleback" (24 impressions, position 32, 0 clicks): likely a brand
#   confusion/typo query, not obviously actionable, worth a periodic check.
