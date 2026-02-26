# Stalingrad: Autumn Storm

A browser-based hex wargame set during the Battle of Stalingrad (September 1942). Features procedurally generated retro/paper-map UI, fog of war, supply lines, artillery support, and event cards — all playable on mobile.

## Quick Start

```bash
npm install
npm run dev
# Open http://localhost:5173 in your browser
```

### Build for Production

```bash
npm run build
npm run preview
```

## Features

- **Hex-based tactical wargame** with turn-based gameplay
- **Command Points (CP)** system forcing meaningful decisions each turn
- **Fog of War** — enemy units hidden until scouted or engaged
- **Supply Lines** — units cut off from supply suffer penalties
- **Artillery Support** — bombardment system with dice resolution
- **Event Deck** — 14 unique events add narrative and unpredictability
- **Procedural Retro UI** — paper texture, ink noise, fold lines, vignette (all CSS/SVG, no external assets)
- **Retro Effects Toggle** — ON/OFF switch with strength slider
- **Mobile-First** — plays on iPhone portrait with 44px+ touch targets, bottom sheet, pan/zoom
- **Save/Load** — automatic save to localStorage, manual save button
- **Hot-Seat Multiplayer** — pass device between players with interstitial screen

## Game Overview

Command either the German 6th Army (Axis) or the Soviet 62nd Army in 8 turns of brutal urban combat. Seize factories, hold the heights, and fight for every hex of Stalingrad.

### Turn Flow

1. **Upkeep** — Receive CP, check supply, recover units
2. **Event** — Draw a random event card
3. **Action** — Spend CP to Move, Attack, Recon, Bombard, or Rest units
4. **End** — Score VP, pass to opponent

### Victory

- **Axis:** Control 10+ VP worth of key hexes
- **Soviet:** Hold 5+ VP of hexes through turn 8

## Campaign Pack Structure

Scenario data is loaded from `data/scenarios/stalingrad_mvp_plus/`:

```
data/scenarios/stalingrad_mvp_plus/
├── scenario.json      # Turn count, CP/turn, VP hexes, supply sources, victory conditions
├── terrain.json       # Terrain types with costs/bonuses + hex grid layout
├── units_axis.json    # Axis OOB with stats, positions, special abilities
├── units_soviet.json  # Soviet OOB
└── events.json        # Event card definitions with effects
```

### Adding New Scenarios

1. Create a new folder under `data/scenarios/`
2. Follow the same JSON schema as `stalingrad_mvp_plus`
3. Update the import in `src/App.tsx` to load your scenario

### Adding New Events

Add entries to `events.json` with the schema:

```json
{
  "id": "evt_unique_id",
  "title": "Event Name",
  "flavor": "Narrative text",
  "ruleText": "Mechanical effect description",
  "effect": {
    "type": "cpMod|artilleryMod|visionMod|terrainCostMod|combatMod|disruptUnit|recoverUnit|reinforce|ignoreZOC|mustAttack",
    "target": "active|enemy|both",
    "delta": 1
  }
}
```

### Adding New Units

Add entries to `units_axis.json` or `units_soviet.json`:

```json
{
  "id": "unique_id",
  "name": "Unit Name",
  "faction": "axis|soviet",
  "type": "infantry|armor|recon|hq|artillery",
  "attack": 5,
  "defense": 5,
  "movement": 4,
  "strength": 6,
  "maxStrength": 6,
  "visionRange": 2,
  "isRecon": false,
  "isHQ": false,
  "startCol": 0,
  "startRow": 0
}
```

## Tech Stack

- **Vite** + **React 18** + **TypeScript**
- No external runtime dependencies beyond React
- No external textures, fonts, or CDN resources
- System font stack (Georgia, serif / Courier New, monospace)
- SVG-based hex map with programmatic NATO-style counters
- Procedural textures via CSS gradients + SVG filters

## Documentation

- [Rules (MVP+)](docs/RULES_MVP_PLUS.md) — Complete rules reference
- [Changelog](CHANGELOG.md) — Implementation history
- [TODO](docs/TODO.md) — Planned features and known limitations

## Controls

### Desktop
- **Click** hex to select/interact
- **Scroll wheel** to zoom map
- **Drag** to pan map

### Mobile
- **Tap** hex to select
- **Drag** to pan
- **Pinch** to zoom
- **Bottom sheet** — tap handle to expand unit details
- **Action bar** — horizontal scroll for all actions

## License

MIT
