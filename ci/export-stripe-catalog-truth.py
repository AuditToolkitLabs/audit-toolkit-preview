#!/usr/bin/env python3
"""Export canonical catalog data directly from Stripe payment links.

This script treats Stripe as the single source of truth. It reads payment links
from Stripe, expands line items, resolves product and price details, and emits
an authoritative JSON catalog snapshot.
"""

from __future__ import annotations

import argparse
import json
import subprocess
import sys
from pathlib import Path
from typing import Any
from urllib.parse import urlparse


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description=(
            "Export canonical product/payment-link catalog from Stripe."
        ),
    )
    parser.add_argument(
        "--mode",
        choices=["live", "test"],
        default="live",
        help="Stripe mode to query (default: live).",
    )
    parser.add_argument(
        "--url-host",
        default="checkout.audittoolkitlabs.com",
        help=(
            "Filter payment links to this URL host "
            "(default: checkout.audittoolkitlabs.com)."
        ),
    )
    parser.add_argument(
        "--name-filter",
        action="append",
        default=[],
        help=(
            "Optional case-insensitive substring filter on product name "
            "(repeatable)."
        ),
    )
    parser.add_argument(
        "--json-out",
        required=True,
        help="Output path for canonical JSON catalog snapshot.",
    )
    return parser.parse_args()


def run_stripe(args: list[str], mode: str) -> dict[str, Any]:
    cmd = ["stripe", *args, f"--{mode}"]
    proc = subprocess.run(cmd, capture_output=True, text=True)
    if proc.returncode != 0:
        msg = proc.stderr.strip() or proc.stdout.strip() or "unknown error"
        raise RuntimeError(f"{' '.join(cmd)} failed: {msg}")
    return json.loads(proc.stdout)


def list_payment_links(mode: str) -> list[dict[str, Any]]:
    links: list[dict[str, Any]] = []
    starting_after: str | None = None

    while True:
        args = ["payment_links", "list", "--limit", "100"]
        if starting_after:
            args.extend(["--starting-after", starting_after])
        page = run_stripe(args, mode=mode)
        data = page.get("data", [])
        links.extend(data)
        if not page.get("has_more") or not data:
            break
        starting_after = data[-1].get("id")

    return links


def interval_label(recurring: dict[str, Any]) -> str:
    interval = recurring.get("interval")
    interval_count = recurring.get("interval_count")
    if interval and interval_count:
        if interval_count == 1:
            return str(interval)
        return f"{interval_count} {interval}"
    return ""


def to_major_amount(unit_amount: int | None) -> float | None:
    if unit_amount is None:
        return None
    return round(unit_amount / 100.0, 2)


def main() -> int:
    args = parse_args()
    host_filter = args.url_host.strip().lower()
    name_filters = [v.strip().lower() for v in args.name_filter if v.strip()]

    try:
        payment_links = list_payment_links(mode=args.mode)
    except Exception as exc:
        print(f"ERROR: failed listing payment links: {exc}", file=sys.stderr)
        return 2

    products_cache: dict[str, dict[str, Any]] = {}
    prices_cache: dict[str, dict[str, Any]] = {}

    rows: list[dict[str, Any]] = []
    skipped_wrong_host = 0
    skipped_name_filter = 0
    errors: list[str] = []

    for link in payment_links:
        url = str(link.get("url") or "")
        if not url:
            continue
        host = urlparse(url).netloc.lower()
        if host_filter and host != host_filter:
            skipped_wrong_host += 1
            continue

        link_id = str(link.get("id") or "")
        try:
            full_link = run_stripe(
                [
                    "payment_links",
                    "retrieve",
                    link_id,
                    "--expand",
                    "line_items",
                ],
                mode=args.mode,
            )
        except Exception as exc:
            errors.append(f"payment_link_retrieve_failed id={link_id}: {exc}")
            continue

        line_items = ((full_link.get("line_items") or {}).get("data") or [])
        if not line_items:
            errors.append(f"payment_link_has_no_line_items id={link_id}")
            continue

        for item in line_items:
            price_obj = item.get("price") or {}
            price_id = str(price_obj.get("id") or "")
            product_id = str(price_obj.get("product") or "")

            if not price_id or not product_id:
                errors.append(
                    f"missing_price_or_product_on_line_item link={link_id}",
                )
                continue

            try:
                if price_id not in prices_cache:
                    prices_cache[price_id] = run_stripe(
                        ["prices", "retrieve", price_id],
                        mode=args.mode,
                    )
                if product_id not in products_cache:
                    products_cache[product_id] = run_stripe(
                        ["products", "retrieve", product_id],
                        mode=args.mode,
                    )
            except Exception as exc:
                errors.append(
                    f"price_or_product_retrieve_failed link={link_id}: {exc}",
                )
                continue

            price = prices_cache[price_id]
            product = products_cache[product_id]
            product_name = str(product.get("name") or "")

            if name_filters:
                lowered = product_name.lower()
                if not any(f in lowered for f in name_filters):
                    skipped_name_filter += 1
                    continue

            recurring = price.get("recurring") or {}
            unit_amount = price.get("unit_amount")
            trial_days = (full_link.get("subscription_data") or {}).get(
                "trial_period_days",
            )

            rows.append(
                {
                    "payment_link_id": link_id,
                    "payment_link_url": url,
                    "payment_link_active": bool(
                        full_link.get("active", False),
                    ),
                    "payment_link_name": full_link.get("name"),
                    "product_id": product_id,
                    "product_name": product_name,
                    "product_active": bool(product.get("active", False)),
                    "price_id": price_id,
                    "currency": price.get("currency"),
                    "unit_amount_minor": unit_amount,
                    "unit_amount_major": to_major_amount(unit_amount),
                    "price_type": price.get("type"),
                    "billing_interval": interval_label(recurring),
                    "billing_interval_raw": {
                        "interval": recurring.get("interval"),
                        "interval_count": recurring.get("interval_count"),
                    },
                    "trial_period_days": trial_days,
                    "quantity": item.get("quantity"),
                },
            )

    rows.sort(
        key=lambda r: (str(r["product_name"]), str(r["payment_link_id"])),
    )

    report = {
        "mode": args.mode,
        "url_host": host_filter,
        "name_filters": name_filters,
        "payment_links_total": len(payment_links),
        "payment_links_skipped_wrong_host": skipped_wrong_host,
        "line_items_skipped_name_filter": skipped_name_filter,
        "catalog_rows": len(rows),
        "errors": errors,
        "rows": rows,
    }

    out_path = Path(args.json_out)
    out_path.write_text(json.dumps(report, indent=2), encoding="utf-8")

    print(f"payment_links_total={report['payment_links_total']}")
    print(f"catalog_rows={report['catalog_rows']}")
    print(f"errors={len(errors)}")
    print(f"json_report={out_path}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
