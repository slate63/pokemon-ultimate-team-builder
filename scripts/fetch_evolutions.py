#!/usr/bin/env python3
"""
Fetch evolution chain data from PokeAPI and save as a single JSON file per generation.

Usage:
    python fetch_evolutions.py --generation 1
    python fetch_evolutions.py --all
"""

import argparse
import json
import requests
from pathlib import Path
from typing import Dict, List, Optional, Set

# Import rate limiter
from rate_limiter import RateLimiter


def print_progress_bar(current: int, total: int, prefix: str = "", suffix: str = "", length: int = 50) -> None:
    """Print a progress bar to the console."""
    percent = current / total
    filled_length = int(length * percent)
    bar = '█' * filled_length + '░' * (length - filled_length)
    print(f'\r{prefix} |{bar}| {percent:.1%} {suffix}', end='')
    if current == total:
        print()


def parse_chain_node(node: Dict) -> Dict:
    """Recursively parse an evolution chain node to simplify it for the frontend."""
    url = node["species"]["url"]
    # URL is like https://pokeapi.co/api/v2/pokemon-species/1/
    species_id = int(url.split("/")[-2])
    
    return {
        "species_name": node["species"]["name"],
        "species_id": species_id,
        "evolves_to": [parse_chain_node(child) for child in node.get("evolves_to", [])]
    }


def fetch_evolution_chain(chain_url: str, rate_limiter: RateLimiter) -> Optional[Dict]:
    """Fetch and parse evolution chain data from a PokeAPI evolution chain URL."""
    try:
        rate_limiter.acquire()
        response = requests.get(chain_url)
        response.raise_for_status()
        data = response.json()
        
        chain_id = data["id"]
        parsed_chain = parse_chain_node(data["chain"])
        
        return {
            "id": chain_id,
            "chain": parsed_chain
        }
        
    except requests.exceptions.RequestException as e:
        print(f"✗ Error fetching evolution chain {chain_url}: {e}")
        return None
    except (KeyError, IndexError, ValueError) as e:
        print(f"✗ Error parsing evolution chain {chain_url}: {e}")
        return None


def fetch_generation_evolutions(generation: int, base_dir: Path, rate_limiter: RateLimiter) -> int:
    """Fetch evolution chains for a specific generation's species."""
    species_file = base_dir / "species" / f"gen{generation}" / "species.json"
    output_file = base_dir / "evolutions" / f"gen{generation}" / "evolutions.json"
    
    if not species_file.exists():
        print(f"Species file for Gen {generation} not found at {species_file}. Please ensure species data exists!")
        return 0
        
    print(f"\n{'='*60}")
    print(f"Fetching Generation {generation} Evolutions")
    print(f"{'='*60}\n")
    
    with open(species_file, 'r') as f:
        species_list = json.load(f)
        
    # Collect unique evolution chain URLs
    chain_urls: Set[str] = set()
    for species in species_list:
        url = species.get("evolution_chain_url")
        if url:
            chain_urls.add(url)
            
    sorted_urls = sorted(list(chain_urls))
    total_chains = len(sorted_urls)
    evolutions_list = []
    success_count = 0
    
    for url in sorted_urls:
        chain = fetch_evolution_chain(url, rate_limiter)
        if chain:
            evolutions_list.append(chain)
            success_count += 1
            print_progress_bar(success_count, total_chains, f"Progress: {success_count}/{total_chains} Evolution Chains")
            print(f"✓ Evolution Chain #{chain['id']} fetched")
            
    output_file.parent.mkdir(parents=True, exist_ok=True)
    with open(output_file, 'w') as f:
        json.dump(evolutions_list, f, indent=2)
        
    return success_count


def fetch_all_evolutions(base_dir: Path, rate_limiter: RateLimiter) -> Dict[int, int]:
    """Fetch evolutions for all generations."""
    print("\n" + "="*60)
    print("Fetching evolution data for all generations")
    print("="*60 + "\n")
    
    results = {}
    for generation in range(1, 10):
        success_count = fetch_generation_evolutions(generation, base_dir, rate_limiter)
        results[generation] = success_count
        
    return results


def main():
    parser = argparse.ArgumentParser(description="Fetch Pokemon evolution chain data from PokeAPI")
    parser.add_argument("--generation", type=int, choices=range(1, 10), help="Fetch specific generation (1-9)")
    parser.add_argument("--all", action="store_true", help="Fetch all generations")
    args = parser.parse_args()
    
    rate_limiter = RateLimiter(max_requests=5, time_window=2.0)
    base_output_dir = Path("public/data")
    
    if args.all:
        results = fetch_all_evolutions(base_output_dir, rate_limiter)
        print("\nSummary:")
        for gen, count in results.items():
            print(f"Generation {gen}: {count} evolution chains fetched")
    elif args.generation:
        success_count = fetch_generation_evolutions(args.generation, base_output_dir, rate_limiter)
        print(f"\nDone! {success_count} evolution chains saved to public/data/evolutions/gen{args.generation}/evolutions.json")
    else:
        parser.print_help()
        print("\nError: Please specify --generation or --all")
        return 1
        
    return 0


if __name__ == "__main__":
    exit(main())
