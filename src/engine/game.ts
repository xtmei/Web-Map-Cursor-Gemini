import {
  GameState, GameAction, Unit, Faction, HexData, TerrainId, TerrainType,
  Scenario, EventCard, LogEntry, TurnPhase, EventEffect, HexCoord,
} from '../types';
import { hexKey, hexNeighbors, hexDistance, findReachable, computeSupply, getVisibleHexes } from './hex';
import { resolveCombat, resolveArtillery } from './combat';

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function addLog(state: GameState, message: string): LogEntry {
  return {
    turn: state.turn,
    faction: state.activeFaction,
    phase: state.turnPhase,
    message,
    timestamp: Date.now(),
  };
}

function opponent(f: Faction): Faction {
  return f === 'axis' ? 'soviet' : 'axis';
}

function getEnemyZOC(units: Unit[], faction: Faction, maxCol: number, maxRow: number): Set<string> {
  const zoc = new Set<string>();
  for (const u of units) {
    if (u.faction === faction) continue;
    if (u.strength <= 0) continue;
    const neighbors = hexNeighbors(u.col, u.row, maxCol, maxRow);
    for (const nb of neighbors) {
      zoc.add(hexKey(nb.col, nb.row));
    }
  }
  return zoc;
}

function getBlockedHexes(units: Unit[], faction: Faction): Set<string> {
  const blocked = new Set<string>();
  for (const u of units) {
    if (u.faction !== faction && u.strength > 0) {
      blocked.add(hexKey(u.col, u.row));
    }
  }
  return blocked;
}

function computeVP(state: GameState): Record<Faction, number> {
  const vp: Record<Faction, number> = { axis: 0, soviet: 0 };
  for (const vpHex of state.scenario.vpHexes) {
    const key = hexKey(vpHex.col, vpHex.row);
    const ctrl = state.hexControl[key];
    if (ctrl) {
      vp[ctrl] += vpHex.vp;
    }
  }
  return vp;
}

function updateHexControl(state: GameState): Record<string, Faction> {
  const ctrl = { ...state.hexControl };
  for (const u of state.units) {
    if (u.strength > 0) {
      ctrl[hexKey(u.col, u.row)] = u.faction;
    }
  }
  return ctrl;
}

function computeAllSupply(state: GameState): Map<string, boolean> {
  const result = new Map<string, boolean>();
  for (const faction of ['axis', 'soviet'] as Faction[]) {
    const sources = state.scenario.supplySources[faction];
    const suppliedHexes = computeSupply(
      faction, sources, state.hexes, state.terrainTypes,
      state.hexControl, state.scenario.mapCols, state.scenario.mapRows
    );
    for (const u of state.units) {
      if (u.faction === faction && u.strength > 0) {
        result.set(u.id, suppliedHexes.has(hexKey(u.col, u.row)));
      }
    }
  }
  return result;
}

function getAllVisibleHexes(units: Unit[], faction: Faction, maxCol: number, maxRow: number, visionMod: number): Set<string> {
  const visible = new Set<string>();
  for (const u of units) {
    if (u.faction !== faction || u.strength <= 0) continue;
    const range = Math.max(1, u.visionRange + visionMod);
    const hexes = getVisibleHexes(u.col, u.row, range, maxCol, maxRow);
    hexes.forEach((h) => visible.add(h));
  }
  return visible;
}

function applyUpkeep(state: GameState): GameState {
  const s = { ...state };
  const faction = s.activeFaction;

  s.cp = { ...s.cp };
  let baseCp = s.scenario.cpPerTurn[faction];
  const hqs = s.units.filter((u) => u.faction === faction && u.isHQ && u.strength > 0);
  for (const hq of hqs) {
    baseCp += (hq.cpBonus || 0);
  }
  s.cp[faction] = baseCp;

  s.artilleryPoints = { ...s.artilleryPoints };
  s.artilleryPoints[faction] = s.scenario.artilleryPerTurn[faction];

  const supplyMap = computeAllSupply(s);
  s.units = s.units.map((u) => {
    if (u.faction !== faction) return u;
    const supplied = supplyMap.get(u.id) ?? false;
    let mp = u.movement;
    if (!supplied) mp = Math.max(1, mp - 1);

    let disrupted = u.disrupted;
    if (supplied && disrupted) {
      if (Math.random() < 0.33) disrupted = false;
    }

    return { ...u, mpRemaining: mp, activated: false, supplied, disrupted };
  });

  s.attacksMadeThisTurn = 0;
  s.hexControl = updateHexControl(s);
  s.vp = computeVP(s);

  s.log = [...s.log, addLog(s, `--- Turn ${s.turn}, ${s.scenario.factionNames[faction]} ---`)];
  s.log = [...s.log, addLog(s, `CP: ${s.cp[faction]} | Artillery: ${s.artilleryPoints[faction]}`)];
  return s;
}

function applyEventDraw(state: GameState): GameState {
  let s = { ...state };
  if (s.eventDeck.length === 0) {
    s.eventDeck = shuffleArray(s.eventDiscard);
    s.eventDiscard = [];
  }
  if (s.eventDeck.length > 0) {
    const [drawn, ...rest] = s.eventDeck;
    s.eventDeck = rest;
    s.currentEvent = drawn;

    s.log = [...s.log, addLog(s, `Event: ${drawn.title} — ${drawn.ruleText}`)];
    s = applyEventEffect(s, drawn.effect);
  }
  return s;
}

function applyEventEffect(state: GameState, effect: EventEffect): GameState {
  const s = { ...state };
  const active = s.activeFaction;
  const enemy = opponent(active);

  switch (effect.type) {
    case 'cpMod': {
      s.cp = { ...s.cp };
      const target = effect.target === 'active' ? active : enemy;
      s.cp[target] = Math.max(0, s.cp[target] + (effect.delta || 0));
      break;
    }
    case 'artilleryMod': {
      s.artilleryPoints = { ...s.artilleryPoints };
      const target = effect.target === 'active' ? active : enemy;
      s.artilleryPoints[target] = Math.max(0, s.artilleryPoints[target] + (effect.delta || 0));
      break;
    }
    case 'visionMod':
    case 'terrainCostMod':
    case 'combatMod':
    case 'ignoreZOC':
    case 'mustAttack':
      s.activeEffects = [...s.activeEffects, effect];
      break;
    case 'reinforce': {
      const faction = effect.target === 'active' ? active : enemy;
      let weakest: Unit | null = null;
      for (const u of s.units) {
        if (u.faction === faction && u.strength > 0 && u.strength < u.maxStrength) {
          if (!weakest || u.strength < weakest.strength) weakest = u;
        }
      }
      if (weakest) {
        s.units = s.units.map((u) =>
          u.id === weakest!.id
            ? { ...u, strength: Math.min(u.maxStrength, u.strength + (effect.strengthDelta || 2)) }
            : u
        );
        s.log = [...s.log, addLog(s, `${weakest.name} reinforced (+${effect.strengthDelta || 2} str).`)];
      }
      break;
    }
    case 'recoverUnit': {
      const faction = effect.target === 'active' ? active : enemy;
      const disrupted = s.units.filter((u) => u.faction === faction && u.disrupted && u.strength > 0);
      if (disrupted.length > 0) {
        const target = disrupted[Math.floor(Math.random() * disrupted.length)];
        s.units = s.units.map((u) => (u.id === target.id ? { ...u, disrupted: false } : u));
        s.log = [...s.log, addLog(s, `${target.name} recovers from disruption.`)];
      }
      break;
    }
    case 'disruptUnit': {
      const targetFaction = effect.target === 'enemy' ? enemy : active;
      const visible = getAllVisibleHexes(s.units, active, s.scenario.mapCols, s.scenario.mapRows, 0);
      const targets = s.units.filter(
        (u) => u.faction === targetFaction && u.strength > 0 && !u.disrupted && visible.has(hexKey(u.col, u.row))
      );
      if (targets.length > 0) {
        const t = targets[Math.floor(Math.random() * targets.length)];
        s.units = s.units.map((u) => (u.id === t.id ? { ...u, disrupted: true } : u));
        s.log = [...s.log, addLog(s, `Sniper! ${t.name} disrupted.`)];
      }
      break;
    }
  }

  return s;
}

function getMoveCostMods(state: GameState): Record<TerrainId, number> | undefined {
  const mods: Record<string, number> = {};
  let hasMods = false;
  for (const eff of state.activeEffects) {
    if (eff.type === 'terrainCostMod' && eff.terrain && eff.mpDelta !== undefined) {
      if (!eff.target || eff.target === 'active' || eff.target === 'both') {
        mods[eff.terrain] = (mods[eff.terrain] || 0) + eff.mpDelta;
        hasMods = true;
      }
    }
  }
  return hasMods ? (mods as Record<TerrainId, number>) : undefined;
}

function getCombatBonus(state: GameState): number {
  let bonus = 0;
  for (const eff of state.activeEffects) {
    if (eff.type === 'combatMod' && eff.target === 'active' && eff.attackBonus) {
      if (!eff.uses || eff.uses > 0) {
        bonus += eff.attackBonus;
      }
    }
  }
  return bonus;
}

function consumeCombatBonus(state: GameState): GameState {
  const s = { ...state };
  s.activeEffects = s.activeEffects.map((eff) => {
    if (eff.type === 'combatMod' && eff.uses && eff.uses > 0) {
      return { ...eff, uses: eff.uses - 1 };
    }
    return eff;
  });
  return s;
}

function hasIgnoreZOC(state: GameState): boolean {
  return state.activeEffects.some((e) => e.type === 'ignoreZOC' && e.target === 'active');
}

function getVisionMod(state: GameState): number {
  let mod = 0;
  for (const eff of state.activeEffects) {
    if (eff.type === 'visionMod') {
      mod += eff.delta || 0;
    }
  }
  return mod;
}

function findRetreatHex(
  unit: Unit, hexes: HexData[], terrainTypes: Record<TerrainId, TerrainType>,
  units: Unit[], maxCol: number, maxRow: number
): HexCoord | null {
  const neighbors = hexNeighbors(unit.col, unit.row, maxCol, maxRow);
  const enemyPositions = new Set(
    units.filter((u) => u.faction !== unit.faction && u.strength > 0).map((u) => hexKey(u.col, u.row))
  );
  const friendlyPositions = new Set(
    units.filter((u) => u.faction === unit.faction && u.strength > 0 && u.id !== unit.id).map((u) => hexKey(u.col, u.row))
  );
  const hexMap = new Map(hexes.map((h) => [hexKey(h.col, h.row), h]));

  for (const nb of neighbors) {
    const key = hexKey(nb.col, nb.row);
    if (enemyPositions.has(key)) continue;
    if (friendlyPositions.has(key)) continue;
    const hex = hexMap.get(key);
    if (!hex || terrainTypes[hex.terrain].impassable) continue;
    return nb;
  }
  return null;
}

export function createInitialState(
  scenario: Scenario,
  terrainTypes: Record<TerrainId, TerrainType>,
  hexes: HexData[],
  axisUnits: Unit[],
  sovietUnits: Unit[],
  events: EventCard[],
  playerFaction: Faction
): GameState {
  const allUnits = [...axisUnits, ...sovietUnits];
  const hexControl: Record<string, Faction> = {};
  for (const u of allUnits) {
    hexControl[hexKey(u.col, u.row)] = u.faction;
  }

  return {
    phase: 'playing',
    scenario,
    terrainTypes,
    hexes,
    units: allUnits,
    turn: 1,
    activeFaction: scenario.firstFaction,
    turnPhase: 'upkeep',
    playerFaction,
    cp: { axis: 0, soviet: 0 },
    vp: { axis: 0, soviet: 0 },
    artilleryPoints: { axis: 0, soviet: 0 },
    eventDeck: shuffleArray(events),
    eventDiscard: [],
    currentEvent: null,
    activeEffects: [],
    selectedUnitId: null,
    selectedHex: null,
    actionMode: 'select',
    revealedUnitIds: [],
    hexControl,
    log: [],
    attacksMadeThisTurn: 0,
    settings: {
      retroEffects: true,
      effectsStrength: 75,
      showSupplyOverlay: false,
    },
    winner: null,
  };
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'ADVANCE_PHASE': {
      let s = { ...state };
      if (s.turnPhase === 'upkeep') {
        s = applyUpkeep(s);
        s.turnPhase = 'event';
      } else if (s.turnPhase === 'event') {
        s = applyEventDraw(s);
        s.turnPhase = 'action';
      } else if (s.turnPhase === 'action') {
        const mustAttack = s.activeEffects.find((e) => e.type === 'mustAttack' && e.target === 'active');
        if (mustAttack && s.attacksMadeThisTurn === 0) {
          s.vp = { ...s.vp };
          s.vp[s.activeFaction] = Math.max(0, s.vp[s.activeFaction] - (mustAttack.vpPenalty || 1));
          s.log = [...s.log, addLog(s, `Political Pressure: no attack made, -${mustAttack.vpPenalty || 1} VP!`)];
        }
        s.turnPhase = 'end';
      }
      return s;
    }

    case 'END_TURN': {
      let s = { ...state };
      if (s.currentEvent) {
        s.eventDiscard = [...s.eventDiscard, s.currentEvent];
        s.currentEvent = null;
      }
      s.activeEffects = [];
      s.selectedUnitId = null;
      s.selectedHex = null;
      s.actionMode = 'select';

      const nextFaction = opponent(s.activeFaction);
      if (nextFaction === s.scenario.firstFaction) {
        s.turn += 1;
      }

      s.hexControl = updateHexControl(s);
      s.vp = computeVP(s);

      if (s.turn > s.scenario.maxTurn) {
        s.phase = 'victory';
        const axisThreshold = s.scenario.victoryConditions.axis.vpThreshold || 10;
        if (s.vp.axis >= axisThreshold) {
          s.winner = 'axis';
        } else if (s.vp.soviet >= 5) {
          s.winner = 'soviet';
        } else {
          s.winner = s.vp.axis > s.vp.soviet ? 'axis' : s.vp.soviet > s.vp.axis ? 'soviet' : 'draw';
        }
        s.log = [...s.log, addLog(s, `Game over! Winner: ${s.winner}`)];
        return s;
      }

      const axisThreshold = s.scenario.victoryConditions.axis.vpThreshold || 10;
      if (s.vp.axis >= axisThreshold) {
        s.phase = 'victory';
        s.winner = 'axis';
        s.log = [...s.log, addLog(s, `Axis achieves decisive victory with ${s.vp.axis} VP!`)];
        return s;
      }

      s.activeFaction = nextFaction;
      s.turnPhase = 'upkeep';
      s.phase = 'passDevice';
      return s;
    }

    case 'ACKNOWLEDGE_PASS': {
      let s = { ...state, phase: 'playing' as const };
      return s;
    }

    case 'SELECT_HEX': {
      const s = { ...state };
      const key = hexKey(action.col, action.row);
      s.selectedHex = { col: action.col, row: action.row };

      if (s.actionMode === 'move' && s.selectedUnitId) {
        return gameReducer(s, { type: 'EXECUTE_MOVE', targetCol: action.col, targetRow: action.row });
      }
      if (s.actionMode === 'artillery') {
        return gameReducer(s, { type: 'EXECUTE_ARTILLERY', targetCol: action.col, targetRow: action.row });
      }

      const unitOnHex = s.units.find(
        (u) => u.col === action.col && u.row === action.row && u.strength > 0
      );

      if (s.actionMode === 'attack' && s.selectedUnitId && unitOnHex && unitOnHex.faction !== s.activeFaction) {
        return gameReducer(s, { type: 'EXECUTE_ATTACK', targetUnitId: unitOnHex.id });
      }

      if (unitOnHex && unitOnHex.faction === s.activeFaction) {
        s.selectedUnitId = unitOnHex.id;
      } else if (!unitOnHex || unitOnHex.faction !== s.activeFaction) {
        if (s.actionMode === 'select') {
          s.selectedUnitId = null;
        }
      }

      return s;
    }

    case 'DESELECT': {
      return { ...state, selectedUnitId: null, selectedHex: null, actionMode: 'select' };
    }

    case 'SET_ACTION_MODE': {
      return { ...state, actionMode: action.mode };
    }

    case 'EXECUTE_MOVE': {
      const s = { ...state };
      const unit = s.units.find((u) => u.id === s.selectedUnitId);
      if (!unit || unit.faction !== s.activeFaction || unit.strength <= 0) return s;
      if (s.cp[s.activeFaction] < 1) {
        s.log = [...s.log, addLog(s, 'Not enough CP to move.')];
        return s;
      }

      const blocked = getBlockedHexes(s.units, s.activeFaction);
      const zoc = getEnemyZOC(s.units, s.activeFaction, s.scenario.mapCols, s.scenario.mapRows);
      const reachable = findReachable(
        { col: unit.col, row: unit.row },
        unit.mpRemaining,
        s.hexes,
        s.terrainTypes,
        blocked,
        zoc,
        hasIgnoreZOC(s),
        s.scenario.mapCols,
        s.scenario.mapRows,
        getMoveCostMods(s)
      );

      const targetKey = hexKey(action.targetCol, action.targetRow);
      const pathNode = reachable.get(targetKey);
      if (!pathNode) {
        s.log = [...s.log, addLog(s, 'Cannot reach that hex.')];
        return s;
      }

      s.cp = { ...s.cp };
      s.cp[s.activeFaction] -= 1;
      s.units = s.units.map((u) =>
        u.id === unit.id
          ? { ...u, col: action.targetCol, row: action.targetRow, mpRemaining: Math.max(0, u.mpRemaining - pathNode.cost), activated: true }
          : u
      );
      s.hexControl = updateHexControl(s);

      const visibleHexes = getAllVisibleHexes(s.units, s.activeFaction, s.scenario.mapCols, s.scenario.mapRows, getVisionMod(s));
      const newRevealed = new Set(s.revealedUnitIds);
      for (const u of s.units) {
        if (u.faction !== s.activeFaction && u.strength > 0 && visibleHexes.has(hexKey(u.col, u.row))) {
          newRevealed.add(u.id);
        }
      }
      s.revealedUnitIds = Array.from(newRevealed);

      s.log = [...s.log, addLog(s, `${unit.name} moves to (${action.targetCol},${action.targetRow}). CP: ${s.cp[s.activeFaction]}`)];
      s.actionMode = 'select';
      return s;
    }

    case 'EXECUTE_ATTACK': {
      let s = { ...state };
      const attacker = s.units.find((u) => u.id === s.selectedUnitId);
      const defender = s.units.find((u) => u.id === action.targetUnitId);
      if (!attacker || !defender) return s;
      if (attacker.faction !== s.activeFaction) return s;
      if (defender.faction === s.activeFaction) return s;
      if (s.cp[s.activeFaction] < 1) {
        s.log = [...s.log, addLog(s, 'Not enough CP to attack.')];
        return s;
      }

      const dist = hexDistance({ col: attacker.col, row: attacker.row }, { col: defender.col, row: defender.row });
      if (dist > 1) {
        s.log = [...s.log, addLog(s, 'Target not adjacent.')];
        return s;
      }

      const defHex = s.hexes.find((h) => h.col === defender.col && h.row === defender.row);
      const defTerrain = defHex ? s.terrainTypes[defHex.terrain] : s.terrainTypes['open'];

      const bonus = getCombatBonus(s);
      const result = resolveCombat(attacker, defender, defTerrain, attacker.supplied, defender.supplied, bonus);
      s = consumeCombatBonus(s);

      s.cp = { ...s.cp };
      s.cp[s.activeFaction] -= 1;
      s.attacksMadeThisTurn += 1;

      s.units = s.units.map((u) => {
        if (u.id === attacker.id) {
          const newStr = Math.max(0, u.strength - result.attackerLoss);
          let newCol = u.col, newRow = u.row;
          if (result.attackerRetreats && newStr > 0) {
            const retreat = findRetreatHex(u, s.hexes, s.terrainTypes, s.units, s.scenario.mapCols, s.scenario.mapRows);
            if (retreat) { newCol = retreat.col; newRow = retreat.row; }
          }
          return { ...u, strength: newStr, col: newCol, row: newRow, activated: true };
        }
        if (u.id === defender.id) {
          const newStr = Math.max(0, u.strength - result.defenderLoss);
          let newCol = u.col, newRow = u.row;
          if (result.defenderRetreats && newStr > 0) {
            const retreat = findRetreatHex(u, s.hexes, s.terrainTypes, s.units, s.scenario.mapCols, s.scenario.mapRows);
            if (retreat) { newCol = retreat.col; newRow = retreat.row; }
          }
          return { ...u, strength: newStr, col: newCol, row: newRow };
        }
        return u;
      });

      if (!s.revealedUnitIds.includes(defender.id)) {
        s.revealedUnitIds = [...s.revealedUnitIds, defender.id];
      }

      s.hexControl = updateHexControl(s);
      s.log = [...s.log, addLog(s, `COMBAT: ${attacker.name} attacks ${defender.name}! ${result.description}`)];
      s.actionMode = 'select';
      s.selectedUnitId = null;
      return s;
    }

    case 'EXECUTE_RECON': {
      const s = { ...state };
      const unit = s.units.find((u) => u.id === s.selectedUnitId);
      if (!unit || !unit.isRecon || unit.faction !== s.activeFaction) return s;
      if (s.cp[s.activeFaction] < 1) {
        s.log = [...s.log, addLog(s, 'Not enough CP for recon.')];
        return s;
      }

      s.cp = { ...s.cp };
      s.cp[s.activeFaction] -= 1;

      const reconRange = unit.visionRange + 2 + getVisionMod(s);
      const visible = getVisibleHexes(unit.col, unit.row, reconRange, s.scenario.mapCols, s.scenario.mapRows);
      const newRevealed = new Set(s.revealedUnitIds);
      let count = 0;
      for (const u of s.units) {
        if (u.faction !== s.activeFaction && u.strength > 0 && visible.has(hexKey(u.col, u.row))) {
          if (!newRevealed.has(u.id)) count++;
          newRevealed.add(u.id);
        }
      }
      s.revealedUnitIds = Array.from(newRevealed);
      s.units = s.units.map((u) => u.id === unit.id ? { ...u, activated: true } : u);
      s.log = [...s.log, addLog(s, `${unit.name} conducts recon: ${count} enemy units revealed.`)];
      s.actionMode = 'select';
      return s;
    }

    case 'EXECUTE_ARTILLERY': {
      const s = { ...state };
      if (s.artilleryPoints[s.activeFaction] < 1) {
        s.log = [...s.log, addLog(s, 'No artillery points remaining.')];
        return s;
      }
      if (s.cp[s.activeFaction] < 1) {
        s.log = [...s.log, addLog(s, 'Not enough CP for artillery.')];
        return s;
      }

      const targetHex = s.hexes.find((h) => h.col === action.targetCol && h.row === action.targetRow);
      if (!targetHex) return s;
      const targetTerrain = s.terrainTypes[targetHex.terrain];
      if (targetTerrain.impassable) return s;

      const target = s.units.find(
        (u) => u.col === action.targetCol && u.row === action.targetRow && u.faction !== s.activeFaction && u.strength > 0
      );
      if (!target) {
        s.log = [...s.log, addLog(s, 'No enemy unit at target hex.')];
        return s;
      }

      s.cp = { ...s.cp };
      s.cp[s.activeFaction] -= 1;
      s.artilleryPoints = { ...s.artilleryPoints };
      s.artilleryPoints[s.activeFaction] -= 1;

      const isIndustrial = targetHex.terrain === 'industrial';
      const result = resolveArtillery(target.defense, targetTerrain.defenseBonus, isIndustrial);

      s.units = s.units.map((u) => {
        if (u.id === target.id) {
          return {
            ...u,
            strength: Math.max(0, u.strength - result.loss),
            disrupted: u.disrupted || result.disrupted,
          };
        }
        return u;
      });

      if (!s.revealedUnitIds.includes(target.id)) {
        s.revealedUnitIds = [...s.revealedUnitIds, target.id];
      }

      s.log = [...s.log, addLog(s, `ARTILLERY on (${action.targetCol},${action.targetRow}) targeting ${target.name}: ${result.description}`)];
      s.actionMode = 'select';
      return s;
    }

    case 'EXECUTE_REST': {
      const s = { ...state };
      const unit = s.units.find((u) => u.id === s.selectedUnitId);
      if (!unit || unit.faction !== s.activeFaction) return s;
      if (s.cp[s.activeFaction] < 1) {
        s.log = [...s.log, addLog(s, 'Not enough CP to rest.')];
        return s;
      }
      if (!unit.disrupted && unit.strength >= unit.maxStrength) {
        s.log = [...s.log, addLog(s, `${unit.name} doesn't need rest.`)];
        return s;
      }

      s.cp = { ...s.cp };
      s.cp[s.activeFaction] -= 1;
      s.units = s.units.map((u) => {
        if (u.id === unit.id) {
          return {
            ...u,
            disrupted: false,
            strength: unit.supplied ? Math.min(u.maxStrength, u.strength + 1) : u.strength,
            activated: true,
          };
        }
        return u;
      });

      s.log = [...s.log, addLog(s, `${unit.name} rests. ${unit.disrupted ? 'Recovered from disruption.' : ''} ${unit.supplied ? '+1 str.' : 'Unsupplied, no recovery.'}`)];
      s.actionMode = 'select';
      return s;
    }

    case 'TOGGLE_RETRO': {
      return {
        ...state,
        settings: { ...state.settings, retroEffects: !state.settings.retroEffects },
      };
    }

    case 'SET_EFFECTS_STRENGTH': {
      return {
        ...state,
        settings: { ...state.settings, effectsStrength: action.value },
      };
    }

    case 'TOGGLE_SUPPLY_OVERLAY': {
      return {
        ...state,
        settings: { ...state.settings, showSupplyOverlay: !state.settings.showSupplyOverlay },
      };
    }

    case 'LOAD_STATE': {
      return action.state;
    }

    default:
      return state;
  }
}

export { computeAllSupply, getAllVisibleHexes, getEnemyZOC, getBlockedHexes, getMoveCostMods, hasIgnoreZOC, getVisionMod, opponent };
