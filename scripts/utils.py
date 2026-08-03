#!/usr/bin/env python3
"""
Shared Utility Functions for Pokémon Ultimate Team Builder Data Scripts
"""

import sys
import urllib.request
import json
from typing import Optional, Any

def get_generation_by_id(pid: int) -> int:
    """Return the native generation for a Pokémon national dex ID (1-1025)."""
    if pid <= 151:
        return 1
    if pid <= 251:
        return 2
    if pid <= 386:
        return 3
    if pid <= 493:
        return 4
    if pid <= 649:
        return 5
    if pid <= 721:
        return 6
    if pid <= 809:
        return 7
    if pid <= 905:
        return 8
    return 9


def clean_name(name: str) -> str:
    """Sanitize Pokémon name for file/directory paths."""
    return name.lower().replace(" ", "-").replace(".", "").replace("'", "").replace(":", "")


def build_dir_name(pid: int, name: str) -> str:
    """Return directory name format (e.g., '001-bulbasaur' or '1001-wo-chien')."""
    cleaned = clean_name(name)
    return f"{pid:03d}-{cleaned}" if pid < 1000 else f"{pid}-{cleaned}"


def print_progress_bar(
    iteration: int,
    total: int,
    prefix: str = "",
    suffix: str = "",
    decimals: int = 1,
    length: int = 40,
    fill: str = "█",
    print_end: str = "\r",
) -> None:
    """Terminal progress bar output."""
    percent = f"{100 * (iteration / float(total)):.{decimals}f}"
    filled_length = int(length * iteration // total)
    bar = fill * filled_length + "-" * (length - filled_length)
    sys.stdout.write(f"\r{prefix} |{bar}| {percent}% {suffix}")
    sys.stdout.flush()
    if iteration >= total:
        sys.stdout.write("\n")


def http_get_json(url: str, rate_limiter=None) -> Optional[Any]:
    """Fetch JSON from a URL with optional rate limiting."""
    if rate_limiter:
        rate_limiter.wait()
    req = urllib.request.Request(
        url,
        headers={"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)"},
    )
    try:
        with urllib.request.urlopen(req, timeout=10) as response:
            return json.loads(response.read().decode("utf-8"))
    except Exception as e:
        print(f"\n  HTTP Error fetching {url}: {e}")
        return None
