#!/usr/bin/env python3
import os
import json

script_dir = os.path.dirname(os.path.abspath(__file__))
dist_dir = os.path.abspath(os.path.join(script_dir, '..', 'dist'))
assets_dir = os.path.join(dist_dir, 'assets')
data_dir = os.path.join(dist_dir, 'data')
html_path = os.path.join(dist_dir, 'index.html')

if not os.path.exists(assets_dir):
    print(f"Warning: {assets_dir} does not exist.")
    exit(0)

css_files = [f for f in os.listdir(assets_dir) if f.endswith('.css')]
js_files = [f for f in os.listdir(assets_dir) if f.endswith('.js')]

css_content = ""
for f in sorted(css_files):
    with open(os.path.join(assets_dir, f), 'r', encoding='utf-8') as cf:
        css_content += cf.read() + "\n"

js_content = ""
for f in sorted(js_files):
    with open(os.path.join(assets_dir, f), 'r', encoding='utf-8') as jf:
        js_content += jf.read() + "\n"

# Escape <script and </script in inline JS so HTML parser does not get tricked by string literals
js_content = js_content.replace('<script', '\\x3cscript').replace('</script', '\\x3c/script')

# Gather offline datasets
types_data = []
types_dir = os.path.join(data_dir, 'types')
if os.path.exists(types_dir):
    for f in sorted(os.listdir(types_dir)):
        if f.endswith('.json'):
            with open(os.path.join(types_dir, f), 'r', encoding='utf-8') as tf:
                types_data.append(json.load(tf))

pokemon_data = []
full_roster_path = os.path.abspath(os.path.join(script_dir, '..', 'src', 'data', 'fullRoster.json'))
if os.path.exists(full_roster_path):
    with open(full_roster_path, 'r', encoding='utf-8') as pf:
        pokemon_data = json.load(pf)
    for p in pokemon_data:
        p.pop('sprite_info', None)
        p.pop('game_sprites', None)
        for g, gd in p.get('generations', {}).items():
            gd.pop('moves', None)
            gd.pop('description', None)
else:
    pokemon_dir = os.path.join(data_dir, 'pokemon')
    if os.path.exists(pokemon_dir):
        # sort by id based on folder name (e.g., 001-bulbasaur)
        for d in sorted(os.listdir(pokemon_dir)):
            p_path = os.path.join(pokemon_dir, d)
            if os.path.isdir(p_path):
                data_file = os.path.join(p_path, 'data.json')
                if os.path.exists(data_file):
                    with open(data_file, 'r', encoding='utf-8') as pf:
                        pokemon_data.append(json.load(pf))

# Convert to JSON strings
types_json_str = json.dumps(types_data, separators=(',', ':')) if types_data else "[]"
pokemon_json_str = json.dumps(pokemon_data, separators=(',', ':')) if pokemon_data else "[]"

# Start with a clean HTML structure
html_template = f"""<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" id="favicon" href="./pokeball.svg" />
    <script>
      (function() {{
        var balls = ['pokeball', 'great-ball', 'ultra-ball', 'master-ball'];
        var ball = balls[Math.floor(Math.random() * balls.length)];
        document.getElementById('favicon').setAttribute('href', './' + ball + '.svg');
      }})();
      
      // Inject offline datasets
      window.__TYPES_DATA__ = {types_json_str};
      window.__POKEMON_DATA__ = {pokemon_json_str};
    </script>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Ultimate Pokémon Team Planner - Plan, analyze, and optimize your 6-Pokémon team with complete type coverage, stat analysis, and game roster filters." />
    <title>Pokémon Ultimate Team Planner</title>
    
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@500;600;700;800&display=swap" rel="stylesheet">
    
    <style>
{css_content}
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script type="module">
{js_content}
    </script>
  </body>
</html>"""

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(html_template)

print(f"Inlined dist/index.html with script and {len(pokemon_data)} Pokemon datasets offline!")
