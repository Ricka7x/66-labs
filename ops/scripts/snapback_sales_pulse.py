#!/usr/bin/env python3
"""
Snapback sales-pulse digest.

Read-only report against the Lemon Squeezy API: revenue, recent orders,
refunds, and active-subscription/license signal. Never writes, refunds,
cancels, or modifies anything. Pure reporting.

Auth: the API key is read from the macOS Keychain (service
'lemonsqueezy-api', account 'snapback-support'), set up via:
  security add-generic-password -a snapback-support -s lemonsqueezy-api -w "$(pbpaste)"
Never hardcode the key here or pass it on the command line.

Usage:
  python3 sales_pulse.py                 # last 7 days digest to stdout
  python3 sales_pulse.py --days 30       # custom window
"""
import argparse
import json
import subprocess
import sys
import urllib.parse
import urllib.request
from datetime import datetime, timedelta, timezone

KEYCHAIN_ACCOUNT = "snapback-support"
KEYCHAIN_SERVICE = "lemonsqueezy-api"
API_BASE = "https://api.lemonsqueezy.com/v1"


def get_api_key() -> str:
    result = subprocess.run(
        [
            "security", "find-generic-password",
            "-a", KEYCHAIN_ACCOUNT,
            "-s", KEYCHAIN_SERVICE,
            "-w",
        ],
        capture_output=True, text=True, check=True,
    )
    key = result.stdout.strip()
    if not key:
        raise RuntimeError("Lemon Squeezy API key is empty in Keychain")
    return key


def api_get(path: str, key: str, params: "dict | None" = None) -> dict:
    url = f"{API_BASE}{path}"
    if params:
        query = urllib.parse.urlencode(params)
        url = f"{url}?{query}"
    req = urllib.request.Request(
        url,
        headers={
            "Accept": "application/vnd.api+json",
            "Authorization": f"Bearer {key}",
        },
    )
    with urllib.request.urlopen(req, timeout=20) as resp:
        return json.loads(resp.read().decode())


def cents_to_usd(cents: int) -> str:
    return f"${cents / 100:,.2f}"


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--days", type=int, default=7)
    args = parser.parse_args()

    key = get_api_key()
    since = datetime.now(timezone.utc) - timedelta(days=args.days)

    stores = api_get("/stores", key)["data"]
    if not stores:
        print("No stores found on this API key.")
        return
    store = stores[0]  # single-store account (Snapback)
    attrs = store["attributes"]
    store_id = store["id"]

    orders = api_get(
        "/orders", key,
        params={"filter[store_id]": store_id, "page[size]": 100, "sort": "-createdAt"},
    )["data"]

    recent = []
    refunded_recent = []
    for o in orders:
        created = datetime.fromisoformat(o["attributes"]["created_at"].replace("Z", "+00:00"))
        if created >= since:
            recent.append(o)
            if o["attributes"].get("refunded"):
                refunded_recent.append(o)

    total_recent_cents = sum(o["attributes"]["total"] for o in recent)
    refunded_cents = sum(o["attributes"]["total"] for o in refunded_recent)

    lines = []
    lines.append(f"# Snapback sales pulse: last {args.days} days")
    lines.append(f"_generated {datetime.now(timezone.utc).isoformat(timespec='seconds')}Z_\n")

    lines.append("## Store totals (all-time)")
    lines.append(f"- Total sales: {attrs['total_sales']}")
    lines.append(f"- Total revenue: {cents_to_usd(attrs['total_revenue'])}")
    lines.append(f"- Last 30 days: {attrs['thirty_day_sales']} sales, {cents_to_usd(attrs['thirty_day_revenue'])}\n")

    lines.append(f"## Last {args.days} days")
    lines.append(f"- Orders: {len(recent)}")
    lines.append(f"- Gross revenue: {cents_to_usd(total_recent_cents)}")
    lines.append(f"- Refunds: {len(refunded_recent)} ({cents_to_usd(refunded_cents)})")
    if recent:
        lines.append("\n### Orders")
        for o in recent:
            a = o["attributes"]
            flag = " [REFUNDED]" if a.get("refunded") else ""
            lines.append(
                f"- {a['created_at'][:10]}, {a['user_email']}, {cents_to_usd(a['total'])}{flag}"
            )

    digest = "\n".join(lines)
    print(digest)


if __name__ == "__main__":
    try:
        main()
    except subprocess.CalledProcessError:
        print("ERROR: could not read Lemon Squeezy API key from Keychain.", file=sys.stderr)
        sys.exit(1)
    except Exception as e:  # noqa: BLE001
        print(f"ERROR: {e}", file=sys.stderr)
        sys.exit(1)
