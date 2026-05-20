#!/usr/bin/env python3
"""Generate spreadsheet correction patches using Stripe as source of truth.

Inputs:
- reconcile report produced by `ci/reconcile-stripe-catalog.py`
- Stripe truth snapshot produced by `ci/export-stripe-catalog-truth.py`

Output:
- CSV patch list for spreadsheet updates
- Markdown summary for humans
"""

from __future__ import annotations

import argparse
import csv
import json
from pathlib import Path
from typing import Any


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description=(
            "Create spreadsheet correction patch list from Stripe truth."
        ),
    )
    parser.add_argument(
        "--reconcile-json",
        default="stripe-reconcile-report.json",
        help="Path to reconcile report JSON.",
    )
    parser.add_argument(
        "--truth-json",
        default="stripe-catalog-truth.json",
        help="Path to Stripe truth export JSON.",
    )
    parser.add_argument(
        "--csv-out",
        default="stripe-spreadsheet-corrections.csv",
        help="Path to output CSV patch list.",
    )
    parser.add_argument(
        "--md-out",
        default="stripe-spreadsheet-corrections.md",
        help="Path to output Markdown summary.",
    )
    parser.add_argument(
        "--cell-csv-out",
        default="stripe-spreadsheet-cell-updates.csv",
        help="Path to output cell-level CSV update map.",
    )
    parser.add_argument(
        "--cell-md-out",
        default="stripe-spreadsheet-cell-updates.md",
        help="Path to output cell-level Markdown update map.",
    )
    return parser.parse_args()


def load_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def canonical_duration_label(row: dict[str, Any]) -> str:
    interval = str(row.get("billing_interval") or "").strip().lower()
    trial_days = row.get("trial_period_days")
    price_type = str(row.get("price_type") or "").strip().lower()

    if trial_days:
        return f"{int(trial_days)} days"
    if interval == "year":
        return "Yearly"
    if interval == "month":
        return "Monthly"
    if interval == "week":
        return "Weekly"
    if interval == "day":
        return "Daily"
    if interval:
        return interval.title()
    if price_type == "one_time":
        return "One-time"
    return "No recurring duration"


def normalize_text(value: Any) -> str:
    if value is None:
        return ""
    return " ".join(str(value).strip().lower().split())


def format_major_amount(value: Any) -> str:
    if value is None:
        return ""
    as_float = float(value)
    if as_float.is_integer():
        return str(int(as_float))
    return f"{as_float:.2f}"


def build_truth_index(
    truth_rows: list[dict[str, Any]],
) -> dict[tuple[str, str], dict[str, Any]]:
    idx: dict[tuple[str, str], dict[str, Any]] = {}
    for row in truth_rows:
        key = (
            str(row.get("product_id") or "").strip(),
            str(row.get("payment_link_url") or "").strip(),
        )
        idx[key] = row
    return idx


def main() -> int:
    args = parse_args()
    reconcile_path = Path(args.reconcile_json)
    truth_path = Path(args.truth_json)

    reconcile = load_json(reconcile_path)
    truth = load_json(truth_path)

    reconcile_rows = reconcile.get("results", [])
    truth_rows = truth.get("rows", [])
    truth_index = build_truth_index(truth_rows)

    csv_rows: list[dict[str, Any]] = []
    cell_rows: list[dict[str, Any]] = []

    for row in reconcile_rows:
        if not row.get("issues"):
            continue

        product_id = str(row.get("product_id") or "").strip()
        link_url = str(row.get("payment_link_url") or "").strip()
        truth_row = truth_index.get((product_id, link_url))

        if not truth_row:
            continue

        sheet_duration = str(row.get("duration") or "").strip()
        stripe_duration = canonical_duration_label(truth_row)
        sheet_price = str(row.get("price") or "").strip()
        stripe_price = format_major_amount(truth_row.get("unit_amount_major"))

        changed_columns: list[str] = []
        if normalize_text(sheet_duration) != normalize_text(stripe_duration):
            changed_columns.append("Duration")
            cell_rows.append(
                {
                    "line": row.get("line"),
                    "family": row.get("family"),
                    "product_id": product_id,
                    "payment_link_url": link_url,
                    "spreadsheet_column": "Duration",
                    "current_value": sheet_duration,
                    "new_value": stripe_duration,
                    "issues": " | ".join(row.get("issues", [])),
                },
            )
        if normalize_text(sheet_price) != normalize_text(stripe_price):
            changed_columns.append("Price")
            cell_rows.append(
                {
                    "line": row.get("line"),
                    "family": row.get("family"),
                    "product_id": product_id,
                    "payment_link_url": link_url,
                    "spreadsheet_column": "Price",
                    "current_value": sheet_price,
                    "new_value": stripe_price,
                    "issues": " | ".join(row.get("issues", [])),
                },
            )

        csv_rows.append(
            {
                "line": row.get("line"),
                "family": row.get("family"),
                "product_id": product_id,
                "payment_link_url": link_url,
                "sheet_product_name": row.get("product_name"),
                "stripe_product_name": truth_row.get("product_name"),
                "sheet_payment_link_name": row.get("payment_link_name"),
                "stripe_payment_link_name": truth_row.get("payment_link_name"),
                "sheet_price": sheet_price,
                "stripe_price": stripe_price,
                "sheet_duration": sheet_duration,
                "stripe_duration": stripe_duration,
                "changed_columns": ", ".join(changed_columns),
                "issues": " | ".join(row.get("issues", [])),
            },
        )

    csv_out = Path(args.csv_out)
    md_out = Path(args.md_out)
    cell_csv_out = Path(args.cell_csv_out)
    cell_md_out = Path(args.cell_md_out)

    fieldnames = [
        "line",
        "family",
        "product_id",
        "payment_link_url",
        "sheet_product_name",
        "stripe_product_name",
        "sheet_payment_link_name",
        "stripe_payment_link_name",
        "sheet_price",
        "stripe_price",
        "sheet_duration",
        "stripe_duration",
        "changed_columns",
        "issues",
    ]

    with csv_out.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(csv_rows)

    cell_fieldnames = [
        "line",
        "family",
        "product_id",
        "payment_link_url",
        "spreadsheet_column",
        "current_value",
        "new_value",
        "issues",
    ]

    with cell_csv_out.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=cell_fieldnames)
        writer.writeheader()
        writer.writerows(cell_rows)

    lines: list[str] = []
    lines.append("# Spreadsheet Corrections from Stripe Truth")
    lines.append("")
    lines.append(f"- Reconcile input: {reconcile_path}")
    lines.append(f"- Stripe truth input: {truth_path}")
    lines.append(f"- Rows requiring correction: {len(csv_rows)}")
    lines.append("")
    lines.append(
        "| Line | Product ID | Sheet Duration | Stripe Duration | "
        "Sheet Price | Stripe Price | Changed |",
    )
    lines.append("|---|---|---|---|---|---|---|")
    for item in csv_rows:
        lines.append(
            "| {line} | {product_id} | {sheet_duration} | {stripe_duration} | "
            "{sheet_price} | {stripe_price} | {changed_columns} |".format(
                **item,
            ),
        )

    md_out.write_text("\n".join(lines) + "\n", encoding="utf-8")

    cell_lines: list[str] = []
    cell_lines.append("# Spreadsheet Cell Updates from Stripe Truth")
    cell_lines.append("")
    cell_lines.append(
        "- Use this file as the direct patch list for spreadsheet editing "
        "or import.",
    )
    cell_lines.append(f"- Reconcile input: {reconcile_path}")
    cell_lines.append(f"- Stripe truth input: {truth_path}")
    cell_lines.append(f"- Cells requiring update: {len(cell_rows)}")
    cell_lines.append("")
    cell_lines.append(
        "| Line | Column | Current Value | New Value | Product ID |",
    )
    cell_lines.append("|---|---|---|---|---|")
    for item in cell_rows:
        cell_lines.append(
            "| {line} | {spreadsheet_column} | {current_value} | "
            "{new_value} | {product_id} |".format(
                **item,
            ),
        )

    cell_md_out.write_text(
        "\n".join(cell_lines) + "\n",
        encoding="utf-8",
    )

    print(f"correction_rows={len(csv_rows)}")
    print(f"csv_out={csv_out}")
    print(f"md_out={md_out}")
    print(f"cell_update_rows={len(cell_rows)}")
    print(f"cell_csv_out={cell_csv_out}")
    print(f"cell_md_out={cell_md_out}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
