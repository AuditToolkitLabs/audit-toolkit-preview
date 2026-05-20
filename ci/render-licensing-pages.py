#!/usr/bin/env python3
"""Render licensing/pricing HTML snippets from automation config."""

from __future__ import annotations

import argparse
import json
import pathlib
import re
import sys


REPO_ROOT = pathlib.Path(__file__).resolve().parents[1]
CONFIG_PATH = (
    REPO_ROOT / "automation" / "licensing" / "linux-security-lite.json"
)
LINUX_PRICING_PAGE = REPO_ROOT / "linux-expansion-pricing.html"
LICENSING_PAGE = REPO_ROOT / "licensing.html"

MARKERS = {
    "linux_meta": (
        "<!-- AUTO-LICENSING:LINUX_META_DESCRIPTION_START -->",
        "<!-- AUTO-LICENSING:LINUX_META_DESCRIPTION_END -->",
    ),
    "linux_hero": (
        "<!-- AUTO-LICENSING:LINUX_HERO_SUMMARY_START -->",
        "<!-- AUTO-LICENSING:LINUX_HERO_SUMMARY_END -->",
    ),
    "linux_callout": (
        "<!-- AUTO-LICENSING:LINUX_CALLOUT_START -->",
        "<!-- AUTO-LICENSING:LINUX_CALLOUT_END -->",
    ),
    "linux_grid": (
        "<!-- AUTO-LICENSING:LINUX_PRICING_GRID_START -->",
        "<!-- AUTO-LICENSING:LINUX_PRICING_GRID_END -->",
    ),
    "licensing_linux_card": (
        "<!-- AUTO-LICENSING:LICENSING_LINUX_CARD_START -->",
        "<!-- AUTO-LICENSING:LICENSING_LINUX_CARD_END -->",
    ),
}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Render licensing pages from JSON config.",
    )
    parser.add_argument(
        "--check",
        action="store_true",
        help="Fail if files are not up to date.",
    )
    parser.add_argument(
        "--write",
        action="store_true",
        help="Write updates to files.",
    )
    return parser.parse_args()


def load_config() -> dict:
    return json.loads(CONFIG_PATH.read_text(encoding="utf-8"))


def replace_marked_block(
    text: str,
    start_marker: str,
    end_marker: str,
    rendered_block: str,
) -> str:
    pattern = re.compile(
        r"(?P<indent>[ \t]*)"
        + re.escape(start_marker)
        + r"\n.*?\n"
        + r"(?P=indent)"
        + re.escape(end_marker),
        flags=re.DOTALL,
    )
    match = pattern.search(text)
    if not match:
        raise ValueError(
            f"Missing marker block: {start_marker} .. {end_marker}",
        )
    indent = match.group("indent")
    replacement = (
        f"{indent}{start_marker}\n"
        f"{rendered_block.rstrip()}\n"
        f"{indent}{end_marker}"
    )
    return pattern.sub(replacement, text, count=1)


def format_money(value: int) -> str:
    return f"£{value:,}"


def render_linux_meta(config: dict) -> str:
    tiers = config["tiers"]
    starter = next(t for t in tiers if t["name"] == "Starter")
    professional = next(t for t in tiers if t["name"] == "Professional")
    business = next(t for t in tiers if t["name"] == "Business")
    return (
        "  <meta name=\"description\" content=\""
        f"Licensing tiers and pricing for {config['product_name']}. "
        "Community (free), "
        f"Starter ({format_money(starter['price_gbp'])}/yr), "
        f"Professional ({format_money(professional['price_gbp'])}/yr), "
        f"and Business ({format_money(business['price_gbp'])}/yr), "
        f"plus optional add-ons. {config['license_model']}."
        "\" />"
    )


def render_linux_hero(config: dict) -> str:
    tiers = {t["name"]: t for t in config["tiers"]}
    addons = {a["name"]: a for a in config["add_ons"]}
    aop_price = addons["Advanced Operations Pack Add-on"]["price_gbp"]
    eip_price = addons["Enterprise Integrations Pack Add-on"]["price_gbp"]
    return (
        "    <p>"
        "Core tier model: Community (free), "
        f"Starter ({format_money(tiers['Starter']['price_gbp'])}/year), "
        "Professional "
        f"({format_money(tiers['Professional']['price_gbp'])}/year), "
        f"and Business ({format_money(tiers['Business']['price_gbp'])}/year). "
        "Optional add-ons include "
        "Advanced Operations Pack "
        "("
        f"{format_money(aop_price)}"
        "/year) "
        "and Enterprise Integrations Pack "
        "("
        f"{format_money(eip_price)}"
        "/year). "
        "Paid tiers are available via live Stripe checkout, with Keygen "
        "licence keys issued automatically after payment confirmation."
        "</p>"
    )


def render_linux_callout(config: dict) -> str:
    manual_email = config["manual_contact"]["email"]
    return (
        "      <strong>Paid tiers use live Stripe checkout.</strong> "
        "Community remains free and requires no registration. "
        "Starter, Professional, and Business are annual subscriptions, "
        "and optional add-ons can be purchased alongside paid tiers. "
        "For invoice or purchase-order handling, email "
        f"<a href=\"mailto:{manual_email}\">{manual_email}</a> "
        "with your company/legal entity name, billing contact, "
        "required tier, add-ons, VAT number, and PO reference if needed. "
        "We will issue your Keygen key directly after payment confirmation. "
        f"Licensed under the <strong>{config['license_model']}</strong> "
        "— converts to MIT on "
        f"<strong>{config['mit_conversion_date']}</strong>."
    )


def resolve_tier_cta(config: dict, tier: dict) -> tuple[str, str, str, str]:
    frontdoor = config["frontdoor"]
    cta = tier["cta"]
    auto_enabled = frontdoor["auto_checkout_enabled"] and bool(
        cta.get("checkout_url"),
    )

    if auto_enabled:
        return (
            cta["checkout_url"],
            cta["checkout_label"],
            cta["checkout_note"],
            cta.get("button_class", "btn-secondary"),
        )

    return (
        cta["fallback_url"],
        cta["fallback_label"],
        cta["fallback_note"],
        cta.get("button_class", "btn-secondary"),
    )


def render_tier_card(config: dict, tier: dict) -> str:
    classes = ["pricing-card"]
    if tier.get("featured"):
        classes.append("pricing-featured")

    card = [f"      <div class=\"{' '.join(classes)}\">"]
    if tier.get("featured_badge"):
        badge = tier["featured_badge"]
        card.append(
            f"        <span class=\"pricing-featured-badge\">{badge}</span>",
        )

    card.append(f"        <p class=\"pricing-tier\">{tier['name']}</p>")
    card.append(f"        <h3>{tier['name']}</h3>")
    card.append(f"        <p class=\"pricing-desc\">{tier['description']}</p>")
    card.append("        <ul class=\"pricing-features\">")

    for feature in tier["features"]:
        if feature["included"]:
            card.append(f"          <li>{feature['text']}</li>")
        else:
            card.append(
                f"          <li class=\"feat-x\">{feature['text']}</li>",
            )

    card.append("        </ul>")
    href, label, note, button_class = resolve_tier_cta(config, tier)
    suffix = "community tier" if tier["price_gbp"] == 0 else "/ year"

    card.append("        <div class=\"pricing-cta-area\">")
    card.append(
        "          <p class=\"pricing-quote\" "
        "style=\"font-size:1.4rem;font-weight:700;color:var(--text);"
        "font-style:normal;margin-bottom:4px;\">"
        f"{format_money(tier['price_gbp'])} "
        "<span style=\"font-size:.85rem;font-weight:400;"
        f"color:var(--text-muted);\">{suffix}</span></p>"
    )

    if tier["price_gbp"] > 0:
        card.append(
            "          <p class=\"pricing-quote\">"
            "excl. VAT &mdash; annual subscription</p>",
        )

    card.append(
        f"          <a href=\"{href}\" "
        f"class=\"btn {button_class}\" "
        "style=\"width:100%;text-align:center;display:block;\">"
        f"{label}</a>"
    )
    card.append(f"          <p class=\"stripe-note\">{note}</p>")
    card.append("        </div>")
    card.append("      </div>")
    return "\n".join(card)


def render_addons(config: dict) -> str:
    lines = [
        "    <div style=\"margin-top:32px;\">",
        "      <h2 style=\"font-size:1.3rem;margin:0 0 10px;\">"
        "Optional Add-ons</h2>",
        "      <p style=\"font-size:.9rem;color:var(--text-muted);"
        "margin:0;\">"
        "Add-ons are available for paid tiers and can be enabled via "
        "Stripe checkout or invoice/PO workflow."
        "</p>",
        "      <div class=\"addon-grid\">",
    ]
    for addon in config["add_ons"]:
        lines.append("        <div class=\"addon-card\">")
        lines.append(f"          <h3>{addon['name']}</h3>")
        lines.append(
            "          <p style=\"margin-bottom:10px;\">"
            f"{format_money(addon['price_gbp'])} / year (excl. VAT)</p>",
        )
        lines.append(f"          <p>{addon['description']}</p>")
        lines.append("        </div>")
    lines.append("      </div>")
    lines.append("    </div>")
    return "\n".join(lines)


def render_linux_grid(config: dict) -> str:
    lines = ["    <div class=\"pricing-grid\">", ""]
    for tier in config["tiers"]:
        lines.append(render_tier_card(config, tier))
        lines.append("")
    lines.append("    </div>")
    lines.append("")
    lines.append(render_addons(config))
    return "\n".join(lines)


def render_licensing_linux_card(config: dict) -> str:
    min_paid = min(
        t["price_gbp"] for t in config["tiers"] if t["price_gbp"] > 0
    )
    return "\n".join(
        [
            "        <p class=\"product-card-desc\">"
            "Core tiers: Community (free), Starter, Professional, and "
            "Business, plus optional Advanced Operations Pack and "
            "Enterprise Integrations Pack add-ons. Paid licences are "
            "available via live Stripe checkout with Keygen delivery "
            "after payment confirmation. BSL 1.1.</p>",
            "        <div class=\"product-card-meta\">",
            "          <span class=\"badge badge-muted\">Stripe "
            "Checkout</span>",
            "          <span class=\"badge badge-muted\">BSL 1.1</span>",
            "          <span class=\"badge badge-muted\">4 Core "
            "Tiers</span>",
            "          <span class=\"badge badge-muted\">2 Add-ons</span>",
            "          <span class=\"badge badge-muted\">Converts to "
            "MIT Feb 2031</span>",
            "        </div>",
            "        <p class=\"product-price-hint\">Community free "
            f"&middot; From {format_money(min_paid)}/year &middot; "
            "Stripe checkout live</p>",
        ]
    )


def render_linux_pricing_page(config: dict, source_text: str) -> str:
    rendered = source_text
    rendered = replace_marked_block(
        rendered,
        *MARKERS["linux_meta"],
        render_linux_meta(config),
    )
    rendered = replace_marked_block(
        rendered,
        *MARKERS["linux_hero"],
        render_linux_hero(config),
    )
    rendered = replace_marked_block(
        rendered,
        *MARKERS["linux_callout"],
        render_linux_callout(config),
    )
    rendered = replace_marked_block(
        rendered,
        *MARKERS["linux_grid"],
        render_linux_grid(config),
    )
    return rendered


def render_licensing_page(config: dict, source_text: str) -> str:
    return replace_marked_block(
        source_text,
        *MARKERS["licensing_linux_card"],
        render_licensing_linux_card(config),
    )


def main() -> int:
    args = parse_args()
    if not args.check and not args.write:
        print("Specify --check or --write.", file=sys.stderr)
        return 2

    config = load_config()
    linux_source = LINUX_PRICING_PAGE.read_text(encoding="utf-8")
    licensing_source = LICENSING_PAGE.read_text(encoding="utf-8")

    linux_rendered = render_linux_pricing_page(config, linux_source)
    licensing_rendered = render_licensing_page(config, licensing_source)
    changed = (
        linux_rendered != linux_source
        or licensing_rendered != licensing_source
    )

    if args.check:
        if changed:
            print(
                "Licensing pages are out of date. "
                "Run: python ci/render-licensing-pages.py --write",
            )
            return 1
        print("Licensing pages are up to date.")
        return 0

    if args.write:
        LINUX_PRICING_PAGE.write_text(linux_rendered, encoding="utf-8")
        LICENSING_PAGE.write_text(licensing_rendered, encoding="utf-8")
        print(
            "Rendered licensing pages from "
            "automation/licensing/linux-security-lite.json",
        )
        return 0

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
