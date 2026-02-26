import { Faction, HexCoord, HexData, TerrainId, TerrainType } from '../types';

export const HEX_SIZE = 30;
const SQRT3 = Math.sqrt(3);

export function hexToPixel(col: number, row: number): { x: number; y: number } {
  const x = col * 1.5 * HEX_SIZE;
  const y = row * SQRT3 * HEX_SIZE + (col % 2 === 1 ? (SQRT3 / 2) * HEX_SIZE : 0);
  return { x, y };
}

export function hexCorners(cx: number, cy: number, size: number = HEX_SIZE): string {
  const pts: string[] = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i;
    pts.push(`${cx + size * Math.cos(angle)},${cy + size * Math.sin(angle)}`);
  }
  return pts.join(' ');
}

export function offsetToAxial(col: number, row: number): { q: number; r: number } {
  const q = col;
  const r = row - (col - (col & 1)) / 2;
  return { q, r };
}

export function axialToCube(q: number, r: number): { x: number; y: number; z: number } {
  return { x: q, y: -q - r, z: r };
}

export function hexDistance(a: HexCoord, b: HexCoord): number {
  const aa = offsetToAxial(a.col, a.row);
  const ab = offsetToAxial(b.col, b.row);
  const ca = axialToCube(aa.q, aa.r);
  const cb = axialToCube(ab.q, ab.r);
  return Math.max(Math.abs(ca.x - cb.x), Math.abs(ca.y - cb.y), Math.abs(ca.z - cb.z));
}

export function hexNeighbors(col: number, row: number, maxCol: number, maxRow: number): HexCoord[] {
  const parity = col & 1;
  const dirs = parity
    ? [
        [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [0, -1],
      ]
    : [
        [1, -1], [1, 0], [0, 1], [-1, 0], [-1, -1], [0, -1],
      ];
  return dirs
    .map(([dc, dr]) => ({ col: col + dc, row: row + dr }))
    .filter((h) => h.col >= 0 && h.col < maxCol && h.row >= 0 && h.row < maxRow);
}

export function hexKey(col: number, row: number): string {
  return `${col},${row}`;
}

export function parseHexKey(key: string): HexCoord {
  const [c, r] = key.split(',').map(Number);
  return { col: c, row: r };
}

export interface PathNode {
  col: number;
  row: number;
  cost: number;
  parent: string | null;
}

export function findReachable(
  start: HexCoord,
  mp: number,
  hexes: HexData[],
  terrainTypes: Record<TerrainId, TerrainType>,
  blockedHexes: Set<string>,
  zocHexes: Set<string>,
  ignoreZOC: boolean,
  maxCol: number,
  maxRow: number,
  moveCostMod?: Record<TerrainId, number>
): Map<string, PathNode> {
  const hexMap = new Map<string, HexData>();
  hexes.forEach((h) => hexMap.set(hexKey(h.col, h.row), h));

  const visited = new Map<string, PathNode>();
  const queue: PathNode[] = [{ col: start.col, row: start.row, cost: 0, parent: null }];
  visited.set(hexKey(start.col, start.row), queue[0]);

  while (queue.length > 0) {
    queue.sort((a, b) => a.cost - b.cost);
    const current = queue.shift()!;
    const neighbors = hexNeighbors(current.col, current.row, maxCol, maxRow);

    for (const nb of neighbors) {
      const key = hexKey(nb.col, nb.row);
      const hex = hexMap.get(key);
      if (!hex) continue;

      const tt = terrainTypes[hex.terrain];
      if (tt.impassable) continue;
      if (blockedHexes.has(key)) continue;

      let moveCost = tt.moveCost;
      if (moveCostMod && moveCostMod[hex.terrain] !== undefined) {
        moveCost = Math.max(1, moveCost + moveCostMod[hex.terrain]);
      }

      if (!ignoreZOC && zocHexes.has(hexKey(current.col, current.row)) &&
          !(current.col === start.col && current.row === start.row)) {
        continue;
      }

      const totalCost = current.cost + moveCost;
      if (totalCost > mp) continue;

      const existing = visited.get(key);
      if (!existing || existing.cost > totalCost) {
        const node: PathNode = {
          col: nb.col,
          row: nb.row,
          cost: totalCost,
          parent: hexKey(current.col, current.row),
        };
        visited.set(key, node);
        queue.push(node);
      }
    }
  }

  visited.delete(hexKey(start.col, start.row));
  return visited;
}

export function findPath(reachable: Map<string, PathNode>, target: HexCoord): HexCoord[] {
  const path: HexCoord[] = [];
  let key = hexKey(target.col, target.row);
  const node = reachable.get(key);
  if (!node) return path;

  let current: PathNode | undefined = node;
  while (current) {
    path.unshift({ col: current.col, row: current.row });
    if (current.parent) {
      current = reachable.get(current.parent);
    } else {
      break;
    }
  }
  return path;
}

export function getVisibleHexes(
  unitCol: number,
  unitRow: number,
  visionRange: number,
  maxCol: number,
  maxRow: number
): Set<string> {
  const visible = new Set<string>();
  for (let c = 0; c < maxCol; c++) {
    for (let r = 0; r < maxRow; r++) {
      if (hexDistance({ col: unitCol, row: unitRow }, { col: c, row: r }) <= visionRange) {
        visible.add(hexKey(c, r));
      }
    }
  }
  return visible;
}

export function computeSupply(
  faction: Faction,
  sources: HexCoord[],
  hexes: HexData[],
  terrainTypes: Record<TerrainId, TerrainType>,
  hexControl: Record<string, Faction>,
  maxCol: number,
  maxRow: number
): Set<string> {
  const supplied = new Set<string>();
  const hexMap = new Map<string, HexData>();
  hexes.forEach((h) => hexMap.set(hexKey(h.col, h.row), h));

  const queue: string[] = [];
  for (const s of sources) {
    const k = hexKey(s.col, s.row);
    supplied.add(k);
    queue.push(k);
  }

  while (queue.length > 0) {
    const current = queue.shift()!;
    const { col, row } = parseHexKey(current);
    const neighbors = hexNeighbors(col, row, maxCol, maxRow);

    for (const nb of neighbors) {
      const key = hexKey(nb.col, nb.row);
      if (supplied.has(key)) continue;
      const hex = hexMap.get(key);
      if (!hex) continue;
      const tt = terrainTypes[hex.terrain];
      if (tt.impassable) continue;
      const ctrl = hexControl[key];
      if (ctrl && ctrl !== faction) continue;
      supplied.add(key);
      queue.push(key);
    }
  }

  return supplied;
}

