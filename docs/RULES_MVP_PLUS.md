# Stalingrad: Autumn Storm — MVP+ Rules

## Glossary

| Term | Definition |
|------|-----------|
| **CP** (Command Points) | Resource spent to activate units each turn. Actions cost 1 CP each. |
| **VP** (Victory Points) | Scored by controlling key hexes. Determines the winner. |
| **ZOC** (Zone of Control) | The 6 hexes adjacent to a unit. Enemy ZOC restricts movement. |
| **Supplied** | A unit that can trace a path through friendly/uncontested hexes to a supply source. |
| **Unsupplied** | A unit cut off from supply. Suffers combat and movement penalties. |
| **Disrupted** | A unit shaken by combat or artillery. Suffers attack penalty, may recover during upkeep or rest. |
| **Revealed** | An enemy unit whose exact values are known (via recon, proximity, or combat). |
| **Fog of War** | Enemy units outside friendly vision range are hidden; those in range but not revealed show as "?" counters. |
| **MP** (Movement Points) | How far a unit can move per activation. Terrain costs vary. |
| **HQ** | Headquarters unit. Provides +CP bonus and reduces costs for nearby units. |
| **CRT** (Combat Results Table) | Odds-based table used to resolve attacks. |

---

## Turn Structure

Each game turn represents ~6 hours. The game lasts 8 turns maximum. Each turn, both factions take a complete turn in order (Axis first).

### Per-Faction Turn Phases

```
1. UPKEEP
   ├── Receive CP (base + HQ bonus)
   ├── Receive artillery points
   ├── Check supply status for all units
   ├── Disrupted units may recover (33% chance if supplied)
   └── Reset movement points

2. EVENT
   └── Draw one event card from the deck
       └── Apply immediate effects (CP mod, vision mod, etc.)

3. ACTION PHASE
   ├── Spend CP to activate units:
   │   ├── MOVE (1 CP) — move unit up to its MP
   │   ├── ATTACK (1 CP) — attack adjacent enemy unit
   │   ├── RECON (1 CP) — reveal enemies in extended range
   │   ├── ARTILLERY (1 CP + 1 Art point) — bombard a hex
   │   └── REST (1 CP) — recover from disruption, +1 strength if supplied
   └── Continue until CP exhausted or player ends phase

4. END PHASE
   ├── Check victory conditions
   ├── Update hex control
   └── Switch to opposing faction
```

---

## Command Points (CP)

- Each faction receives base CP per turn (Axis: 6, Soviet: 5).
- HQ units provide bonus CP (+1 each).
- Every action costs 1 CP.
- Unused CP is lost at end of turn (no banking).
- Events may modify CP (e.g., "Supply Convoy" +2 CP, "Communication Delay" -1 CP).

**Strategic Implication:** You cannot activate every unit every turn. Choose wisely.

---

## Movement

- Each unit has a Movement Point (MP) allowance.
- Terrain costs:

| Terrain | Move Cost | Defense Bonus |
|---------|-----------|---------------|
| Open Ground | 1 | 0 |
| Road | 1 | 0 |
| City Ruins | 2 | +2 |
| Factory Complex | 2 | +3 |
| Hill / Heights | 2 | +2 |
| Ferry / Crossing | 1 | 0 |
| Volga River | Impassable | — |

- **ZOC:** Entering an enemy ZOC hex costs all remaining MP (you stop).
- Moving from one enemy ZOC hex to another is not allowed (unless "Night Assault" event).
- Unsupplied units have -1 MP (minimum 1).

---

## Combat

### Procedure
1. Select attacking unit (must be adjacent to target).
2. Calculate odds ratio: `attacker's attack value / defender's defense value`.
3. Apply modifiers:
   - Terrain defense bonus added to defender.
   - Disrupted attacker: -2 attack.
   - Disrupted defender: -1 defense.
   - Unsupplied: -1 to attack or defense.
   - Event combat bonus (e.g., "Air Support" +2).
4. Look up odds column on CRT.
5. Roll 1d6.
6. Apply result.

### Combat Results Table (CRT)

| Odds | 1 | 2 | 3 | 4 | 5 | 6 |
|------|---|---|---|---|---|---|
| 1:3 | AE | AE | AE | AR | AR | NE |
| 1:2 | AE | AE | AR | AR | NE | NE |
| 1:1 | AE | AR | AR | NE | NE | DR |
| 3:2 | AR | AR | NE | NE | DR | DR |
| 2:1 | AR | NE | NE | DR | DR | DE |
| 3:1 | NE | NE | DR | DR | DE | DE |
| 4:1+ | NE | DR | DR | DE | DE | DE |

**Result codes:**
- **AE** — Attacker Eliminated/Routed: attacker loses 50% strength, retreats.
- **AR** — Attacker Repulsed: attacker loses 1 strength, retreats.
- **NE** — No Effect: both sides hold.
- **DR** — Defender Retreats: defender loses 1 strength, retreats.
- **DE** — Defender Destroyed/Routed: defender loses 50% strength, retreats.

Retreating units move to an adjacent non-enemy, non-occupied, passable hex. If no retreat hex exists, the unit takes additional losses.

---

## Fog of War & Recon

### Visibility
- Each unit has a vision range (default 2 hexes, recon units 4 hexes).
- Enemy units outside ALL friendly units' vision ranges are **invisible** (hidden from the map).
- Enemy units within vision range but not yet **revealed** appear as "?" counters — you see their presence but not their stats.
- A unit becomes **revealed** when:
  - A friendly unit enters its vision range.
  - Combat occurs with/against it.
  - An artillery strike targets its hex.
  - A recon action scans its area.

### Recon Action (1 CP)
- Only recon units can perform this.
- Reveals all enemy units within vision range + 2 hexes.
- Revealed status persists for the rest of the game.

---

## Supply

### Supply Sources
- **Axis:** Western map edge hexes (0,0), (0,3), (0,7).
- **Soviet:** Ferry/crossing hexes (8,1), (7,4), (8,6).

### Supply Tracing
- A unit is **Supplied** if a path exists from its hex to a supply source through:
  - Friendly-controlled or uncontested hexes.
  - Non-impassable terrain.
- Enemy-controlled hexes block supply paths.

### Unsupplied Effects
- Attack/Defense: -1.
- Movement: -1 MP (minimum 1).
- No strength recovery during rest.
- Slower disruption recovery during upkeep.

### Supply Overlay
- Toggle in Settings to visualize which hexes are connected to your supply network.

---

## Artillery Support

- Each faction receives artillery points per turn (Axis: 2, Soviet: 1).
- **Cost:** 1 CP + 1 artillery point per bombardment.
- **Procedure:**
  1. Select target hex containing an enemy unit.
  2. Roll 1d6 against a threshold based on target's defense + terrain.
  3. Results:
     - **High roll:** 1 strength loss + disrupted.
     - **Medium roll:** Disrupted only.
     - **Low roll:** No effect.
  - Factory/industrial hexes provide additional protection.
- Artillery reveals the targeted unit.

---

## Event Deck

- 14 event cards, shuffled at game start.
- Each faction draws 1 card per turn during the Event phase.
- When the deck is exhausted, the discard pile is reshuffled.

### Event List

| Event | Effect |
|-------|--------|
| Factory Fire | Industrial hex movement +1 cost this turn |
| Communication Delay | Active faction -1 CP |
| Commando Raid | Recon units +1 vision range this turn |
| Ammunition Shortage | Active faction -1 artillery point |
| Morning Fog | All vision ranges -1 this turn |
| Air Support | Next attack this turn gets +2 bonus |
| Supply Convoy | Active faction +2 CP |
| Sniper Team | Random visible enemy unit becomes disrupted |
| Political Pressure | Must attack this turn or lose 1 VP |
| Counter-Battery Fire | Opposing faction loses 1 artillery point |
| Morale Boost | One disrupted friendly unit recovers |
| Engineers Forward | City hex movement -1 cost (min 1) for active faction |
| Night Assault | Active faction's units ignore ZOC this turn |
| Reserves Arrive | Weakest friendly unit recovers +2 strength |

---

## Victory Conditions

- **Axis Victory:** Control VP hexes totaling 10+ points at any point.
- **Soviet Victory:** Hold at least 5 VP worth of hexes through turn 8.
- **Draw:** Neither condition met.

### VP Hexes

| Location | VP Value |
|----------|---------|
| Tractor Factory | 2 |
| Tractor Factory East | 1 |
| Barrikady Factory | 2 |
| Mamayev Kurgan | 2 |
| Red October Factory | 2 |
| Lazur Chemical | 2 |
| North Ferry | 1 |
| Central Ferry | 1 |
| South Ferry | 1 |
| **Total** | **14** |

---

## Unit Types

| Symbol | Type | Notes |
|--------|------|-------|
| X (crossed lines) | Infantry | Standard combat unit |
| Oval | Armor | Higher movement, good attack |
| Diagonal line | Recon | Extended vision, recon action |
| X + circle | HQ | CP bonus, low combat value |
| Filled circle | Artillery | (Future) Direct fire support |

---

## Hex Control

- A hex is controlled by the last faction to have a unit on it.
- Control affects supply tracing and VP scoring.
- Unvisited hexes are uncontrolled.
