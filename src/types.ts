export type Faction = 'axis' | 'soviet';
export type UnitType = 'infantry' | 'armor' | 'artillery' | 'recon' | 'hq';
export type TerrainId = 'open' | 'road' | 'city' | 'industrial' | 'hill' | 'river' | 'bridge';
export type TurnPhase = 'upkeep' | 'event' | 'action' | 'end';
export type ActionMode = 'select' | 'move' | 'attack' | 'recon' | 'artillery' | 'rest';
export type GamePhase = 'title' | 'setup' | 'playing' | 'passDevice' | 'victory';

export interface HexCoord {
  col: number;
  row: number;
}

export interface TerrainType {
  moveCost: number;
  defenseBonus: number;
  label: string;
  color: string;
  roadBonus?: boolean;
  impassable?: boolean;
}

export interface HexData {
  col: number;
  row: number;
  terrain: TerrainId;
  name?: string;
}

export interface VPHex {
  col: number;
  row: number;
  vp: number;
  name: string;
}

export interface UnitData {
  id: string;
  name: string;
  faction: Faction;
  type: UnitType;
  attack: number;
  defense: number;
  movement: number;
  strength: number;
  maxStrength: number;
  visionRange: number;
  isRecon: boolean;
  isHQ: boolean;
  cpBonus?: number;
  hqRange?: number;
  startCol: number;
  startRow: number;
}

export interface Unit extends UnitData {
  col: number;
  row: number;
  mpRemaining: number;
  disrupted: boolean;
  activated: boolean;
  supplied: boolean;
}

export interface EventCard {
  id: string;
  title: string;
  flavor: string;
  ruleText: string;
  effect: EventEffect;
}

export interface EventEffect {
  type: string;
  target?: 'active' | 'enemy' | 'both';
  delta?: number;
  terrain?: TerrainId;
  mpDelta?: number;
  unitFilter?: string;
  attackBonus?: number;
  uses?: number;
  vpPenalty?: number;
  count?: number;
  strengthDelta?: number;
}

export interface Scenario {
  id: string;
  name: string;
  description: string;
  mapCols: number;
  mapRows: number;
  maxTurn: number;
  turnHours: number;
  startDate: string;
  factions: Faction[];
  factionNames: Record<Faction, string>;
  firstFaction: Faction;
  cpPerTurn: Record<Faction, number>;
  artilleryPerTurn: Record<Faction, number>;
  supplySources: Record<Faction, HexCoord[]>;
  vpHexes: VPHex[];
  victoryConditions: Record<Faction, { vpThreshold?: number; survivalTurns?: number; description: string }>;
}

export interface LogEntry {
  turn: number;
  faction: Faction;
  phase: TurnPhase;
  message: string;
  timestamp: number;
}

export interface CombatResult {
  attackerLoss: number;
  defenderLoss: number;
  attackerRetreats: boolean;
  defenderRetreats: boolean;
  description: string;
}

export interface GameState {
  phase: GamePhase;
  scenario: Scenario;
  terrainTypes: Record<TerrainId, TerrainType>;
  hexes: HexData[];
  units: Unit[];
  turn: number;
  activeFaction: Faction;
  turnPhase: TurnPhase;
  playerFaction: Faction;
  cp: Record<Faction, number>;
  vp: Record<Faction, number>;
  artilleryPoints: Record<Faction, number>;
  eventDeck: EventCard[];
  eventDiscard: EventCard[];
  currentEvent: EventCard | null;
  activeEffects: EventEffect[];
  selectedUnitId: string | null;
  selectedHex: HexCoord | null;
  actionMode: ActionMode;
  revealedUnitIds: string[];
  hexControl: Record<string, Faction>;
  log: LogEntry[];
  attacksMadeThisTurn: number;
  settings: {
    retroEffects: boolean;
    effectsStrength: number;
    showSupplyOverlay: boolean;
  };
  winner: Faction | 'draw' | null;
}

export type GameAction =
  | { type: 'START_GAME'; playerFaction: Faction }
  | { type: 'ACKNOWLEDGE_PASS' }
  | { type: 'SELECT_HEX'; col: number; row: number }
  | { type: 'SET_ACTION_MODE'; mode: ActionMode }
  | { type: 'EXECUTE_MOVE'; targetCol: number; targetRow: number }
  | { type: 'EXECUTE_ATTACK'; targetUnitId: string }
  | { type: 'EXECUTE_RECON' }
  | { type: 'EXECUTE_ARTILLERY'; targetCol: number; targetRow: number }
  | { type: 'EXECUTE_REST' }
  | { type: 'ADVANCE_PHASE' }
  | { type: 'END_TURN' }
  | { type: 'APPLY_EVENT_CHOICE'; unitId?: string }
  | { type: 'TOGGLE_RETRO' }
  | { type: 'SET_EFFECTS_STRENGTH'; value: number }
  | { type: 'TOGGLE_SUPPLY_OVERLAY' }
  | { type: 'LOAD_STATE'; state: GameState }
  | { type: 'DESELECT' }
  | { type: 'UNDO_LAST' };
