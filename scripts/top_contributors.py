#!/usr/bin/env python3
"""Script to generate a markdown table of top contributors from GitHub."""

import argparse
import json
import os
import re
import subprocess
import urllib.error
import urllib.parse
import urllib.request
from collections import defaultdict
from datetime import date, datetime, timedelta, timezone
from typing import Any, Dict, List, Optional, Tuple


def get_repo_from_remote() -> Tuple[Optional[str], Optional[str]]:
    """Get repository owner and name from git remote URL."""
    try:
        url = (
            subprocess.check_output(["git", "remote", "get-url", "origin"])
            .decode("utf-8")
            .strip()
        )
        # Match SSH or HTTPS URLs
        match = re.search(r"(?:[:/])([^/]+)/([^/]+?)(?:\.git)?$", url)
        if match:
            return match.group(1), match.group(2)
    except (subprocess.CalledProcessError, FileNotFoundError):
        print(
            "Error: Could not determine repository from git remote. Please specify --repo OWNER/NAME."
        )
        return None, None
    return None, None


def get_contributors_data(
    owner: str, repo: str, days: int, token: Optional[str] = None
) -> Optional[List[Dict[str, Any]]]:
    """Fetch commit data from GitHub API and process it."""
    since_date = (datetime.now(timezone.utc) - timedelta(days=days)).strftime(
        "%Y-%m-%dT%H:%M:%SZ"
    )

    contributors: Dict[str, Dict[str, Any]] = defaultdict(
        lambda: {"commits": 0, "active_days": set()}
    )

    params = {"since": since_date, "per_page": 100}
    url: str | None = (
        f"https://api.github.com/repos/{owner}/{repo}/commits?{urllib.parse.urlencode(params)}"
    )

    headers = {
        "Accept": "application/vnd.github.v3+json",
    }
    if token:
        headers["Authorization"] = f"token {token}"

    while url:
        try:
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req) as response:
                commits = json.loads(response.read().decode("utf-8"))

                if not commits:
                    break

                for commit in commits:
                    if commit["author"]:
                        author_login = commit["author"]["login"]
                        commit_date: date = datetime.strptime(
                            commit["commit"]["author"]["date"], "%Y-%m-%dT%H:%M:%SZ"
                        ).date()
                        contributors[author_login]["commits"] += 1
                        contributors[author_login]["active_days"].add(commit_date)

                link_header = response.getheader("Link")
                url = None
                if link_header:
                    links = link_header.split(", ")
                    for link in links:
                        parts = link.split("; ")
                        if 'rel="next"' in parts[1]:
                            url = parts[0].strip("<>")
                            break

        except urllib.error.HTTPError as e:
            print(f"Error fetching commits: {e}")
            if e.code == 401:
                print(
                    "Error: Invalid GitHub token. Please check your GITHUB_TOKEN environment variable."
                )
            elif e.code == 404:
                print(
                    f"Error: Repository '{owner}/{repo}' not found. Please check the repository details."
                )
            return None
        except json.JSONDecodeError as e:
            print(f"Error decoding JSON response: {e}")
            return None

    return sorted(
        [
            {
                "login": login,
                "commits": data["commits"],
                "active_days": len(data["active_days"]),
            }
            for login, data in contributors.items()
        ],
        key=lambda x: x["commits"],
        reverse=True,
    )


def generate_markdown_table(contributors: List[Dict[str, Any]], days: int) -> None:
    """Generate a markdown table from contributor data."""
    if not contributors:
        print(f"No contributions found in the last {days} days.")
        return

    print(f"## Top contributors in the last {days} days\n")
    print("| Contributor | Commits | Active Days |")
    print("|---|---|---|")
    for contributor in contributors:
        login = contributor["login"]
        commits = contributor["commits"]
        active_days = contributor["active_days"]
        print(f"| [@{login}](https://github.com/{login}) | {commits} | {active_days} |")


def main() -> None:
    """Run the script."""
    owner, repo = get_repo_from_remote()

    parser = argparse.ArgumentParser(
        description="Generate a markdown table of top contributors from GitHub."
    )
    parser.add_argument(
        "--days",
        type=int,
        default=7,
        help="Number of days to look back for contributions.",
    )
    parser.add_argument(
        "--repo",
        type=str,
        default=f"{owner}/{repo}" if owner and repo else None,
        help="GitHub repository in 'owner/repo' format.",
    )

    args = parser.parse_args()

    if not args.repo:
        parser.print_help()
        return

    owner, repo = args.repo.split("/")

    token = os.getenv("GITHUB_TOKEN")
    contributors = get_contributors_data(owner or "", repo or "", args.days, token)

    if contributors:
        generate_markdown_table(contributors, args.days)


if __name__ == "__main__":
    main()
