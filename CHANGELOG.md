# Changelog

## [1.0.0] - 2026-02-26

### Added

#### Core Systems
- **Hex Map Engine** — 10×8 flat-top hex grid with offset coordinates, axial distance calculation, neighbor finding, and Dijkstra-based pathfinding
- **Turn System** — 4-phase turn structure (Upkeep → Event → Action → End) with faction switching and hot-seat multiplayer
- **Command Points (CP)** — Resource-based activation: 6 CP/turn Axis, 5 CP/turn Soviet, +1 per HQ; all actions cost 1 CP
- **Combat Resolution** — Odds-based CRT (7 columns from 1:3 to 4:1+), terrain modifiers, supply modifiers, disruption effects
- **Fog of War** — Vision range per unit (default 2, recon 4); hidden/unknown/revealed enemy states; visibility recomputed each action
- **Recon System** — Recon units can spend 1 CP to reveal enemies in extended range (vision + 2)
- **Supply Lines** — BFS from supply source hexes through friendly-controlled terrain; unsupplied units suffer -1 attack, -1 defense, -1 MP
- **Artillery Support** — 2 points/turn Axis, 1/turn Soviet; bombardment with d6 resolution, terrain protection, disruption/loss results
- **Event Deck** — 14 unique event cards shuffled at start; 1 drawn per faction per turn; effects include CP/artillery mods, vision changes, terrain cost changes, combat bonuses, disruption, recovery, ZOC ignore, forced attack
- **Victory Conditions** — Axis: 10+ VP from key hexes; Soviet: hold 5+ VP through turn 8

#### Scenario Data
- **Stalingrad MVP+** campaign pack with:
  - 80-hex map (10×8) representing key Stalingrad sectors
  - 7 terrain types (open, road, city, industrial, hill, river, bridge)
  - 9 VP hexes totaling 14 VP (factories, Mamayev Kurgan, ferry crossings)
  - 9 Axis units (6th Army) including 2 panzer, 5 infantry, 1 recon, 1 HQ
  - 10 Soviet units (62nd Army) including 1 tank brigade, 6 rifle/guards, 1 militia, 1 recon, 1 HQ

#### UI / UX
- **Procedural Retro UI** — Paper texture (multi-layer CSS gradients), SVG fractal noise filter, fold lines, vignette — all generated in code, zero external assets
- **Retro Effects Toggle** — ON/OFF switch + strength slider (0–100%) in Settings panel
- **SVG Hex Map** — Pan (drag), zoom (scroll/pinch), flat-top hexes with terrain coloring, VP markers, hex control indicators, named locations
- **SVG Unit Counters** — NATO-style symbols (infantry X, armor oval, recon slash, HQ X+circle), attack/defense/movement values, strength bar, disruption and supply status badges
- **Top Bar** — Turn counter, faction indicator, phase display, CP count, artillery points, VP scoreboard
- **Action Bar** — Horizontal scrolling buttons (Move, Attack, Recon, Artillery, Rest, End Phase, Save, Deselect) with cost labels
- **Bottom Sheet** — Collapsible unit detail panel with summary view and expanded details (type, position, terrain, supply, status, vision, HQ bonus)
- **Event Banner** — Collapsible card showing current turn's event with flavor text and rule text
- **Battle Log** — Full scrollable log panel with turn/faction metadata
- **Settings Panel** — Modal with retro effects toggle, effects strength slider, supply overlay toggle
- **Mobile-First Design** — 44px minimum touch targets, safe area insets, touch-action manipulation, horizontal scroll action bar

#### Save / Load
- Auto-save to localStorage after every state change during play
- Manual save button in action bar
- Continue game from title screen if save exists

### Known Limitations
- No AI opponent (hot-seat only)
- No line-of-sight blocking by terrain
- No unit facing or stacking limits
- No multi-unit attack coordination
- Artillery has no range limit (any visible hex)
- No undo system beyond deselect
- Map zoom limits not fully enforced on all devices
- Event effects that require player choice (e.g., "Sniper Team" target selection) are resolved randomly
