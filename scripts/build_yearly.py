"""Generate GitHub contribution SVGs (light + dark) using the GraphQL
`contributionsCollection` API.

Includes both public and private commit contributions provided that:
  1. The token (env GH_USER_TOKEN) has `read:user` scope.
  2. The account has "Include private contributions on my profile" enabled.

Outputs:
  dist/activity-dark.svg
  dist/activity-light.svg
  dist/yearly-dark.svg
  dist/yearly-light.svg
"""

from __future__ import annotations

import json
import os
import urllib.request
from datetime import date, datetime, timedelta, timezone

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
    current_year = datetime.now(timezone.utc).year

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


def fetch_recent_contributions(user: str, days: int = 31) -> list[tuple[date, int]]:
    if days < 2:
        raise ValueError("days must be at least 2")

    now = datetime.now(timezone.utc)
    first_day = now.date() - timedelta(days=days - 1)
    query = f"""
    {{
      user(login: "{user}") {{
        contributionsCollection(
          from: "{first_day.isoformat()}T00:00:00Z",
          to: "{now.isoformat()}"
        ) {{
          contributionCalendar {{
            weeks {{
              contributionDays {{
                contributionCount
                date
              }}
            }}
          }}
        }}
      }}
    }}
    """
    data = graphql(query)
    if data["user"] is None:
        raise RuntimeError(f"GitHub user not found: {user}")

    calendar = data["user"]["contributionsCollection"]["contributionCalendar"]
    counts_by_date = {
        date.fromisoformat(day["date"]): int(day["contributionCount"])
        for week in calendar["weeks"]
        for day in week["contributionDays"]
    }

    return [
        (day, counts_by_date.get(day, 0))
        for offset in range(days)
        if (day := first_day + timedelta(days=offset)) <= now.date()
    ]


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
    updated = datetime.now(timezone.utc).strftime("%Y-%m-%d")

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


def build_activity_svg(
    activity: list[tuple[date, int]],
    *,
    fg: str,
    sub_fg: str,
    width: int = 760,
    height: int = 230,
) -> str:
    if not activity:
        raise ValueError("activity must not be empty")

    counts = [count for _, count in activity]
    max_count = max(max(counts), 1)
    total_count = sum(counts)

    pad_x = 44
    pad_top = 62
    pad_bot = 42
    chart_w = width - 2 * pad_x
    chart_h = height - pad_top - pad_bot

    def x(index: int) -> float:
        if len(activity) == 1:
            return width / 2
        return pad_x + (index / (len(activity) - 1)) * chart_w

    def y(count: int) -> float:
        return pad_top + chart_h - (count / max_count) * chart_h

    points = [(x(index), y(count)) for index, count in enumerate(counts)]
    line_d = " ".join(
        f"{'M' if index == 0 else 'L'}{px:.1f},{py:.1f}"
        for index, (px, py) in enumerate(points)
    )
    area_d = (
        f"M{points[0][0]:.1f},{height - pad_bot:.1f} "
        + " ".join(f"L{px:.1f},{py:.1f}" for px, py in points)
        + f" L{points[-1][0]:.1f},{height - pad_bot:.1f} Z"
    )

    grid = "\n".join(
        f'  <line x1="{pad_x}" y1="{pad_top + chart_h * ratio:.1f}" '
        f'x2="{width - pad_x}" y2="{pad_top + chart_h * ratio:.1f}" '
        f'stroke="{sub_fg}" stroke-opacity="0.16" stroke-width="1" />'
        for ratio in (0.0, 0.5, 1.0)
    )

    circles = "\n".join(
        f'  <circle cx="{px:.1f}" cy="{py:.1f}" r="2.8" fill="{fg}">'
        f"<title>{day.isoformat()}: {count} contributions</title></circle>"
        for (day, count), (px, py) in zip(activity, points)
    )

    tick_indexes = sorted(
        {
            0,
            round((len(activity) - 1) / 3),
            round(2 * (len(activity) - 1) / 3),
            len(activity) - 1,
        }
    )
    date_labels = "\n".join(
        f'  <text x="{x(index):.1f}" y="{height - 15}" text-anchor="middle" '
        f'fill="{sub_fg}" font-size="10" letter-spacing="1">'
        f'{activity[index][0].strftime("%b %d").upper()}</text>'
        for index in tick_indexes
    )

    updated = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    title = "CONTRIBUTIONS · LAST 31 DAYS"

    return f"""<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="title desc" width="{width}" height="{height}" viewBox="0 0 {width} {height}">
  <title id="title">{title}</title>
  <desc id="desc">{total_count} contributions over the last {len(activity)} days; maximum {max_count} in one day.</desc>
  <style>
    text {{ font-family: -apple-system, BlinkMacSystemFont, system-ui, sans-serif; }}
  </style>
  <text x="{width / 2}" y="24" text-anchor="middle" fill="{sub_fg}" font-size="11" letter-spacing="4" font-weight="500" opacity="0.7">{title}</text>
  <text x="{width / 2}" y="40" text-anchor="middle" fill="{sub_fg}" font-size="9" letter-spacing="2" opacity="0.4">updated {updated}</text>
  <text x="{pad_x}" y="54" fill="{sub_fg}" font-size="9" letter-spacing="1.5" opacity="0.65">MAX {max_count}</text>
  <text x="{width - pad_x}" y="54" text-anchor="end" fill="{sub_fg}" font-size="9" letter-spacing="1.5" opacity="0.65">TOTAL {total_count}</text>
{grid}
  <path d="{area_d}" fill="{fg}" fill-opacity="0.10" />
  <path d="{line_d}" fill="none" stroke="{fg}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" />
{circles}
{date_labels}
</svg>
"""


def main() -> None:
    print(f"Fetching contribution stats for {USER}…")
    yearly = fetch_yearly_commits(USER)
    activity = fetch_recent_contributions(USER)

    print("\nYearly breakdown:")
    for year in sorted(yearly.keys()):
        print(f"  {year}: {yearly[year]}")
    print(f"\nLast {len(activity)} days: {sum(count for _, count in activity)} contributions")

    os.makedirs(OUT_DIR, exist_ok=True)
    outputs = {
        "activity-dark.svg": build_activity_svg(
            activity, fg="#ffffff", sub_fg="#999999"
        ),
        "activity-light.svg": build_activity_svg(
            activity, fg="#000000", sub_fg="#666666"
        ),
        "yearly-dark.svg": build_svg(yearly, fg="#ffffff", sub_fg="#999999"),
        "yearly-light.svg": build_svg(yearly, fg="#000000", sub_fg="#666666"),
    }

    for filename, svg in outputs.items():
        with open(f"{OUT_DIR}/{filename}", "w", encoding="utf-8") as output:
            output.write(svg)
        print(f"Wrote {OUT_DIR}/{filename} ({len(svg)} bytes)")


if __name__ == "__main__":
    main()
