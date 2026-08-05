#!/usr/bin/env bash
set -euo pipefail

REPO="slate63/pokemon-ultimate-team-builder"
TAG="data-v1"
ASSET="pokemon-sprites.tar.gz"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
DEST="$PROJECT_DIR/public/data/pokemon"

if [ -d "$DEST/001-bulbasaur/sprites" ]; then
  echo "Sprites already present — skipping download."
  exit 0
fi

if ! command -v gh &> /dev/null; then
  echo "Error: GitHub CLI (gh) is required. Install it with: brew install gh"
  exit 1
fi

echo "Downloading sprite data from GitHub Release ($TAG)..."
TMPFILE="$(mktemp)"
gh release download "$TAG" --repo "$REPO" --pattern "$ASSET" --output "$TMPFILE"

echo "Extracting to $DEST..."
tar -xzf "$TMPFILE" -C "$DEST"
rm -f "$TMPFILE"

SPRITE_COUNT=$(find "$DEST" -name '*.png' -o -name '*.gif' | wc -l | tr -d ' ')
echo "Done — $SPRITE_COUNT sprite files extracted."
