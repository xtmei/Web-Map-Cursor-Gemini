# TODO — Future Enhancements

## High Priority

- [ ] **AI Opponent** — Simple AI that activates units, moves toward objectives, and attacks when advantageous. Allow single-player mode.
- [ ] **Undo System** — Track action history and allow undoing the last N actions within a turn.
- [ ] **Line of Sight (LOS)** — Block vision through hills, buildings, or factory complexes for more tactical depth.
- [ ] **Multi-Unit Attacks** — Allow multiple adjacent units to attack the same defender with combined strength.
- [ ] **Artillery Range** — Limit artillery to a fixed range from HQ or designated battery hexes.

## Medium Priority

- [ ] **Unit Facing** — 60° facing for hexes; flanking attacks get combat bonus.
- [ ] **Stacking Limits** — Max 2 units per hex; enforce during movement.
- [ ] **Engineering** — Pioneer/engineer units that can build fortifications or clear obstacles.
- [ ] **Weather System** — Turns have weather (clear, rain, snow) affecting movement and vision.
- [ ] **Night Turns** — Reduced vision, movement bonuses for infantry, no air support.
- [ ] **Reinforcement Schedule** — New units arriving on specific turns per scenario data.
- [ ] **Retreat Mechanics** — Smarter retreat pathfinding (away from enemy, toward supply).
- [ ] **Overrun** — High-strength armor can overrun weak units without stopping.

## Low Priority

- [ ] **More Scenarios** — Operation Uranus, Korsun Pocket, Berlin 1945.
- [ ] **Scenario Editor** — In-browser editor for creating custom maps and OOBs.
- [ ] **Multiplayer (Network)** — WebSocket or WebRTC for remote play.
- [ ] **Sound Effects** — Procedural audio for dice rolls, combat, artillery (Web Audio API).
- [ ] **Animation** — Movement paths, combat flash, artillery impact.
- [ ] **Tutorial** — Interactive walkthrough of game mechanics.
- [ ] **Accessibility** — Screen reader support, color-blind mode for unit identification.
- [ ] **Performance** — Canvas-based rendering for larger maps (100+ hexes).
- [ ] **Campaign Mode** — Linked scenarios where outcomes carry over.
- [ ] **Morale System** — Unit morale tracked separately from strength; rout cascades.

## Code Quality

- [ ] Unit tests for engine (hex math, combat, supply, fog).
- [ ] E2E tests for full game flow.
- [ ] Extract game state context into dedicated provider.
- [ ] Separate touch handling into custom hook.
- [ ] Responsive breakpoints for tablet landscape mode.
