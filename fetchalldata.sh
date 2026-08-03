#!/usr/bin/env bash
#
# fetchalldata.sh — Fetch ALL Pokémon data, sprites, species, evolutions,
# moves, and types from PokeAPI, then build the unified roster and sprite
# metadata.  One command to grab everything.
#
# Usage:
#   ./fetchalldata.sh           # Full fetch + sync + sprite info
#   ./fetchalldata.sh --quick   # Skip downloading sprite images (faster)
#   ./fetchalldata.sh --graphql # Fast alternative using GraphQL endpoint (highly recommended)
#   ./fetchalldata.sh --ignore-rate-limit # Disable API rate limiting
#   ./fetchalldata.sh --help    # Show help
#
# Requirements:
#   - Python 3.10+
#   - `requests` package (pip install requests)
#   - Internet access to https://pokeapi.co
#
# This script runs the following in order:
#   1. fetch_types.py        — Type effectiveness chart (per-gen)  → public/data/types/gen{N}/
#   2. fetch_pokemon.py --all — All 1025 Pokémon (data + sprites) → public/data/pokemon/
#   3. fetch_evolutions.py --all — Evolution chains                → public/data/evolutions/
#   4. fetch_moves.py --all   — Move data                         → public/data/moves/
#   6. build_index.py         — Compile index files                → public/data/indices/
#   7. cleanup_roster.py      — Remove invalid cross-gen blocks
#   8. fetch_version_sprites.py — Build fullRoster.json with version-specific sprites
#   9. add_sprite_info.py     — Add per-version sprite metadata to fullRoster.json
#
set -euo pipefail

cd "$(dirname "$0")"

# ---------------------------------------------------------------------------
# Colours / formatting
# ---------------------------------------------------------------------------
RED='\033[1;31m'
GREEN='\033[1;32m'
YELLOW='\033[1;33m'
BLUE='\033[1;34m'
BOLD='\033[1m'
NC='\033[0m' # No Color

info()  { echo -e "${BLUE}[INFO]${NC}  $*"; }
ok()    { echo -e "${GREEN}[OK]${NC}    $*"; }
warn()  { echo -e "${YELLOW}[WARN]${NC}  $*"; }
fail()  { echo -e "${RED}[FAIL]${NC}  $*"; exit 1; }

# ---------------------------------------------------------------------------
# Parse args
# ---------------------------------------------------------------------------
QUICK=false
SKIP_IMAGES=false
GRAPHQL_MODE=false
SPRITES_FLAG="--sprites all"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --quick)
      QUICK=true
      SKIP_IMAGES=true
      shift
      ;;
    --graphql)
      GRAPHQL_MODE=true
      shift
      ;;
    --ignore-rate-limit)
      export IGNORE_RATE_LIMIT=1
      shift
      ;;
    --help|-h)
      sed -n '2,30p' "$0"
      exit 0
      ;;
    *)
      fail "Unknown argument: $1 (try --help)"
      ;;
  esac
done

if $SKIP_IMAGES; then
  SPRITES_FLAG="--no-images"
fi

# ---------------------------------------------------------------------------
# Preflight checks
# ---------------------------------------------------------------------------
info "Preflight checks..."

command -v python3 >/dev/null 2>&1 || fail "python3 is required but not found."
python3 -c "import requests" 2>/dev/null || fail "The 'requests' package is required.\n  Install with: pip install requests"

ok "Preflight checks passed."
echo ""

# ---------------------------------------------------------------------------
# Banner
# ---------------------------------------------------------------------------
echo -e "${BOLD}╔══════════════════════════════════════════════════════════════╗
║          Pokémon Ultimate Team Builder — Full Data Fetch      ║
╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

if $QUICK; then
  warn "Quick mode: skipping sprite image downloads (data only)."
  echo ""
fi

if $GRAPHQL_MODE; then
  echo -e "${BOLD}── Running Fast GraphQL Fetch Pipeline ──────────────────────────${NC}"
  python3 scripts/fetch_graphql.py
  
  echo -e "${GREEN}${BOLD}╔══════════════════════════════════════════════════════════════╗
║                    ✅  GraphQL data fetched successfully!      ║
╚══════════════════════════════════════════════════════════════╝${NC}"
  echo ""
  echo "Outputs:"
  echo "  public/data/indices/pokedex_index.json — Lightweight index"
  echo "  public/data/pokemon/                   — Per-Pokemon JSON data"
  exit 0
fi

# ---------------------------------------------------------------------------
# Step 1: Type effectiveness & Natures data
# ---------------------------------------------------------------------------
echo -e "${BOLD}── Step 1/9: Type Effectiveness & Natures Data ───────────────────${NC}"
python3 scripts/fetch_types.py --all
python3 scripts/fetch_natures.py
ok "Type and Nature data fetched."
echo ""

# ---------------------------------------------------------------------------
# Step 2: All Pokémon data + sprites (the big one)
# ---------------------------------------------------------------------------
echo -e "${BOLD}── Step 2/9: Pokémon Data & Sprite Images (1–1025) ──────────────${NC}"
if $SKIP_IMAGES; then
  python3 scripts/fetch_pokemon.py --all --no-images
else
  python3 scripts/fetch_pokemon.py --all
fi
ok "Pokémon data + sprites fetched."
echo ""


# ---------------------------------------------------------------------------
# Step 4: Evolution chains
# ---------------------------------------------------------------------------
echo -e "${BOLD}── Step 4/9: Evolution Chains ────────────────────────────────────${NC}"
python3 scripts/fetch_evolutions.py --all
ok "Evolution data fetched."
echo ""

# ---------------------------------------------------------------------------
# Step 5: Move data
# ---------------------------------------------------------------------------
echo -e "${BOLD}── Step 5/9: Move Data ───────────────────────────────────────────${NC}"
python3 scripts/fetch_moves.py --all
ok "Move data fetched."
echo ""

# ---------------------------------------------------------------------------
# Step 6: Build unified index files
# ---------------------------------------------------------------------------
echo -e "${BOLD}── Step 6/9: Build Index Files ──────────────────────────────────${NC}"
python3 scripts/build_index.py
ok "Index files built."
echo ""

# ---------------------------------------------------------------------------
# Step 7: Clean up roster (remove invalid cross-gen blocks)
# ---------------------------------------------------------------------------
echo -e "${BOLD}── Step 7/9: Cleanup Roster ──────────────────────────────────────${NC}"
python3 scripts/cleanup_roster.py
ok "Roster cleaned up."
echo ""

# ---------------------------------------------------------------------------
# Step 8: Build fullRoster.json with version-specific sprites
# ---------------------------------------------------------------------------
echo -e "${BOLD}── Step 8/9: Version-Specific Sprites (fullRoster.json) ──────────${NC}"
python3 scripts/fetch_version_sprites.py
ok "fullRoster.json built with version sprites."
echo ""

# ---------------------------------------------------------------------------
# Step 9: Add per-version sprite metadata
# ---------------------------------------------------------------------------
echo -e "${BOLD}── Step 9/9: Sprite Info Metadata ────────────────────────────────${NC}"
python3 scripts/add_sprite_info.py
ok "Sprite info metadata added."
echo ""

# ---------------------------------------------------------------------------
# Step 10: Sync sprite metadata to individual data files
# ---------------------------------------------------------------------------
echo -e "${BOLD}── Step 10/10: Sync Sprite Metadata ──────────────────────────────${NC}"
python3 scripts/sync_sprites_to_data.py
ok "Sprite metadata synced to individual pokemon files."
echo ""

# ---------------------------------------------------------------------------
# Done
# ---------------------------------------------------------------------------
echo -e "${GREEN}${BOLD}╔══════════════════════════════════════════════════════════════╗
║                    ✅  All data fetched successfully!          ║
╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo "Outputs:"
echo "  src/data/fullRoster.json       — Unified roster with version sprites + metadata"
echo "  public/data/types/types.json   — Combined type effectiveness chart for all gens"
echo "  public/data/species/           — Per-generation species data"
echo "  public/data/evolutions/        — Per-generation evolution chains"
echo "  public/data/moves/             — Per-generation move data"
echo "  public/data/pokemon/           — Per-Pokemon data folders with sprite images"
echo "  public/data/indices/           — Compiled index files (pokemon, moves, evolutions)"
echo ""
if $QUICK; then
  warn "Quick mode was used — sprite images were not downloaded."
  echo "  Run without --quick to download all sprite images."
fi
