# ⚡ Pokémon Ultimate Team Builder

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.1-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)

An interactive, high-performance web application for planning, building, and analyzing Pokémon teams across all Generations (Gen 1 – Gen 9) and game versions. Built with **React 19**, **TypeScript**, and **Vite**.

---

## 🌟 Key Features

- **🎮 Game & Generation Availability Filtering**: Select specific games (from *Red/Blue* to *Scarlet/Violet*) to view only Pokémon obtainable within those games.
- **📊 Team Defense & Coverage Matrix**: Analyze team-wide defensive weaknesses, resistances, immunities, and offensive coverage in real time.
- **📈 Base Stats & Interactive Radar Charts**: Inspect comprehensive base stats with interactive radar chart visualizers for individual Pokémon and overall team stat averages.
- **🔍 Advanced Search & Multi-Filter**: Filter Pokémon by generation, typing, stat ranges, evolution stages, abilities, and search by name or Pokédex number.
- **✨ Complete Sprite & Form Visualizer**: View game-accurate sprite art, shiny forms, gender differences, and historical sprite variations across generations.
- **🏆 Hall of Fame**: Browse ranked teams across completed game playthroughs, displayed with game-accurate sprites matching each version's art style.
- **🚀 Zero-Latency Offline Dataset**: Powered by pre-processed, indexed Pokémon data compiled from PokeAPI GraphQL for instant search and zero API lag.

---

## 🛠️ Technology Stack

- **Frontend Framework**: [React 19](https://react.dev/)
- **Language**: [TypeScript 5.7](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 6.1](https://vitejs.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Styling**: Modern Vanilla CSS with dark mode aesthetics and dynamic UI components
- **Data Pipeline**: Python 3 data scripts for GraphQL data fetching, availability mapping, and asset optimization from PokeAPI

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm** (or **yarn** / **pnpm**)
- **Python 3.x** *(optional, only required for re-running data extraction scripts)*

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/slate63/pokemon-ultimate-team-builder.git
   cd pokemon-ultimate-team-builder
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`.

---

## 📜 Available Scripts

In the project root, you can run:

| Command | Description |
|---|---|
| `npm run dev` | Launches the Vite development server with Hot Module Replacement (HMR) |
| `npm run build` | Compiles TypeScript and builds the application for production using Vite |
| `npm run preview` | Bootstraps a local server to preview the production build output |

---

## 📁 Project Structure

```text
pokemon-ultimate-team-builder/
├── public/                 # Static assets and game sprites
├── scripts/                # Python data extraction and indexing pipeline
├── src/
│   ├── components/         # Modular React components
│   │   ├── CoverageMatrix.tsx       # Defensive weakness & coverage analysis matrix
│   │   ├── FilterToolbar.tsx        # Search, type/stat filters, & game selector
│   │   ├── Header.tsx               # Top navigation bar
│   │   ├── HallOfFame.tsx            # Hall of Fame ranked team browser
│   │   ├── PokemonDetailModal.tsx   # Detailed modal (stats, movesets, evolutions, sprites)
│   │   ├── PokemonGrid.tsx          # Responsive roster grid display
│   │   ├── StatRadarChart.tsx       # Canvas radar chart visualizer for stats
│   │   └── TeamBar.tsx              # Active 6-Pokémon team manager
│   ├── data/               # Pre-compiled Pokémon dataset & game definitions
│   ├── hooks/              # Custom React hooks
│   ├── types/              # TypeScript interfaces & definitions
│   ├── utils/              # Helper utilities (calculations, stat formatting)
│   ├── App.tsx             # Main application layout and state logic
│   └── index.css           # Global stylesheet & design system
├── index.html              # Main HTML entry file
├── package.json            # Node dependencies and build scripts
└── vite.config.ts          # Vite build configuration
```


---

## 🔌 Public Data REST API & OpenAPI Reference

This application includes a public, unauthenticated static REST API hosted via GitHub Pages (`/api/v1/`), providing lightweight access to Pokémon, Moves, Types, Natures, and Generation data without image/sprite payload overhead.

### 🌐 Endpoints

- **Interactive Swagger UI**: [`/api/v1/`](https://slate63.github.io/pokemon-ultimate-team-builder/api/v1/)
- **OpenAPI 3.0 Spec**: [`/api/v1/openapi.yaml`](https://slate63.github.io/pokemon-ultimate-team-builder/api/v1/openapi.yaml)
- **Pokémon Index**: `/api/v1/pokemon/index.json`
- **Individual Pokémon**: `/api/v1/pokemon/{id_or_name}.json` *(e.g. `25.json` or `pikachu.json`)*
- **Moves Index**: `/api/v1/moves/index.json`
- **Individual Move**: `/api/v1/moves/{id_or_name}.json` *(e.g. `85.json` or `thunderbolt.json`)*
- **Types Index**: `/api/v1/types/index.json`
- **Individual Type**: `/api/v1/types/{name}.json` *(e.g. `fire.json`)*
- **Natures**: `/api/v1/natures/index.json` & `/api/v1/natures/{name}.json`
- **Generations**: `/api/v1/generations.json`

### 💻 Sample `curl` Request

```bash
# Fetch Pikachu data without sprites
curl -X GET "https://slate63.github.io/pokemon-ultimate-team-builder/api/v1/pokemon/pikachu.json"
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

