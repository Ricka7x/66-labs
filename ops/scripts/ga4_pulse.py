#!/usr/bin/env python3
"""Snapback GA4 traffic pulse: real page views and users, read-only.

Uses the ga4-reader service account (Downloads -> ops/secrets, see
.gitignore: this key is never committed). Read-only scope
(analytics.readonly): never writes, modifies goals, or changes anything.

Usage:
    python3 ga4_pulse.py [--days 90] [--limit 20]
"""

import argparse
import sys
from pathlib import Path

KEY_PATH = Path(__file__).resolve().parent.parent / "secrets" / "ga4-reader-snapback.json"
PROPERTY = "properties/539004498"  # Snapback GA4 property


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--days", type=int, default=90)
    parser.add_argument("--limit", type=int, default=20)
    args = parser.parse_args()

    if not KEY_PATH.exists():
        print(f"Missing service account key at {KEY_PATH}", file=sys.stderr)
        sys.exit(1)

    from google.analytics.data_v1beta import BetaAnalyticsDataClient
    from google.analytics.data_v1beta.types import (
        DateRange,
        Dimension,
        Metric,
        RunReportRequest,
    )
    from google.oauth2 import service_account

    creds = service_account.Credentials.from_service_account_file(str(KEY_PATH))
    client = BetaAnalyticsDataClient(credentials=creds)

    req = RunReportRequest(
        property=PROPERTY,
        dimensions=[Dimension(name="pagePath")],
        metrics=[Metric(name="screenPageViews"), Metric(name="activeUsers")],
        date_ranges=[DateRange(start_date=f"{args.days}daysAgo", end_date="today")],
        order_bys=[{"metric": {"metric_name": "screenPageViews"}, "desc": True}],
        limit=args.limit,
    )
    resp = client.run_report(req)

    print(f"# GA4 pulse: last {args.days} days, top {args.limit} pages\n")
    for row in resp.rows:
        page = row.dimension_values[0].value
        views = row.metric_values[0].value
        users = row.metric_values[1].value
        print(f"- {page}: {views} views, {users} users")


if __name__ == "__main__":
    main()
