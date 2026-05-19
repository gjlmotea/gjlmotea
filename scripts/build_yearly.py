"""Generate per-year commit chart SVGs (light + dark) using the GitHub GraphQL
`contributionsCollection` API.

Includes both public and private commit contributions provided that:
  1. The token (env GH_USER_TOKEN) has `read:user` scope.
  2. The account has "Include private contributions on my profile" enabled.

Outputs:
  dist/yearly-dark.svg
  dist/yearly-light.svg
"""

from __future__ import annotations

import json
import os
import urllib.request
from datetime import datetime

USER = "gjlmotea"
TOKEN = os.environ["GH_USER_TOKEN"]
OUT_DIR = "dist"


def graphql(query: str) -> dict:
    req = urllib.request.Request(
        "https://api.github.com/graphql",
        data=json.dumps({"query": query}).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {TOKEN}",
            "Content-Type": "application/json",
            "User-Agent": "gjlmotea-yearly-stats",
        },
    )
    resp = urllib.request.urlopen(req, timeout=30).read()
    data = json.loads(resp)
    if "errors" in data:
        raise RuntimeError(f"GraphQL errors: {data['errors']}")
    return data["data"]


def fetch_yearly_commits(user: str) -> dict[int, int]:
    # Account creation year
    created = graphql(f'{{ user(login: "{user}") {{ createdAt }} }}')
    created_year = int(created["user"]["createdAt"][:4])
    current_year = datetime.utcnow().year

    # Build aliased query: one alias per year
    aliases = []
    for year in range(created_year, current_year + 1):
        aliases.append(
            f'y{year}: contributionsCollection('
            f'from: "{year}-01-01T00:00:00Z", '
            f'to: "{year}-12-31T23:59:59Z"'
            f') {{ totalCommitContributions }}'
        )
    query = f'{{ user(login: "{user}") {{ {" ".join(aliases)} }} }}'
    data = graphql(query)
    user_data = data["user"]

    yearly = {}
    for year in range(created_year, current_year + 1):
        yearly[year] = user_data[f"y{year}"]["totalCommitContributions"]
    return yearly


def build_svg(
    yearly: dict[int, int],
    *,
    fg: str,
    sub_fg: str,
    width: int = 760,
    height: int = 230,
) -> str:
    years = sorted(yearly.keys())
    counts = [yearly[y] for y in years]
    max_count = max(max(counts), 1)

    pad_x = 60
    pad_top = 56
    pad_bot = 40
    chart_w = width - 2 * pad_x
    chart_h = height - pad_top - pad_bot

    if len(years) == 1:
        def x(_i: int) -> float:
            return width / 2
    else:
        def x(i: int) -> float:
            return pad_x + (i / (len(years) - 1)) * chart_w

    def y(c: int) -> float:
        return pad_top + chart_h - (c / max_count) * chart_h

    points = [(x(i), y(c)) for i, c in enumerate(counts)]

    if len(points) > 1:
        line_pts = " ".join(f"{px:.1f},{py:.1f}" for px, py in points)
        area_d = (
            f"M{points[0][0]:.1f},{height - pad_bot} "
            + "L"
            + " L".join(f"{px:.1f},{py:.1f}" for px, py in points)
            + f" L{points[-1][0]:.1f},{height - pad_bot} Z"
        )
    else:
        line_pts = f"{points[0][0]:.1f},{points[0][1]:.1f}"
        area_d = ""

    year_labels = "\n".join(
        f'  <text x="{x(i):.1f}" y="{height - 14}" text-anchor="middle" '
        f'fill="{sub_fg}" font-size="11" letter-spacing="1.5">{years[i]}</text>'
        for i in range(len(years))
    )

    count_labels = "\n".join(
        f'  <text x="{px:.1f}" y="{py - 12:.1f}" text-anchor="middle" '
        f'fill="{fg}" font-size="11" font-weight="600">{counts[i]}</text>'
        for i, (px, py) in enumerate(points)
    )

    circles = "\n".join(
        f'  <circle cx="{px:.1f}" cy="{py:.1f}" r="3.5" fill="{fg}" />'
        for px, py in points
    )

    title = "COMMITS PER YEAR"
    updated = datetime.utcnow().strftime("%Y-%m-%d")

    return f"""<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}">
  <style>
    text {{ font-family: -apple-system, BlinkMacSystemFont, system-ui, sans-serif; }}
  </style>
  <text x="{width / 2}" y="24" text-anchor="middle" fill="{sub_fg}" font-size="11" letter-spacing="4" font-weight="500" opacity="0.7">{title}</text>
  <text x="{width / 2}" y="40" text-anchor="middle" fill="{sub_fg}" font-size="9" letter-spacing="2" opacity="0.4">updated {updated}</text>
  <path d="{area_d}" fill="{fg}" fill-opacity="0.12" />
  <polyline points="{line_pts}" fill="none" stroke="{fg}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" />
{circles}
{count_labels}
{year_labels}
</svg>
"""


def main() -> None:
    print(f"Fetching yearly commits for {USER}…")
    yearly = fetch_yearly_commits(USER)
    print("\nYearly breakdown:")
    for year in sorted(yearly.keys()):
        print(f"  {year}: {yearly[year]}")

    os.makedirs(OUT_DIR, exist_ok=True)
    dark = build_svg(yearly, fg="#ffffff", sub_fg="#999999")
    light = build_svg(yearly, fg="#000000", sub_fg="#666666")

    with open(f"{OUT_DIR}/yearly-dark.svg", "w") as f:
        f.write(dark)
    with open(f"{OUT_DIR}/yearly-light.svg", "w") as f:
        f.write(light)

    print(f"\nWrote {OUT_DIR}/yearly-dark.svg ({len(dark)} bytes)")
    print(f"Wrote {OUT_DIR}/yearly-light.svg ({len(light)} bytes)")


if __name__ == "__main__":
    main()
