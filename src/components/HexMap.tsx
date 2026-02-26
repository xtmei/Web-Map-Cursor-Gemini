import React, { useRef, useState, useCallback, useMemo, useEffect } from 'react';
import { GameState, GameAction, Faction, Unit, HexCoord, TerrainId } from '../types';
import {
  hexToPixel, hexCorners, HEX_SIZE, hexKey, findReachable, hexDistance,
  getVisibleHexes, computeSupply,
} from '../engine/hex';
import {
  getAllVisibleHexes, getEnemyZOC, getBlockedHexes, getMoveCostMods, hasIgnoreZOC, getVisionMod,
} from '../engine/game';
import { Counter } from './Counter';

interface Props {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

export function HexMap({ state, dispatch }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [viewBox, setViewBox] = useState({ x: -40, y: -40, w: 500, h: 500 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [pinchDist, setPinchDist] = useState(0);

  const { scenario, hexes, units, terrainTypes, activeFaction, selectedUnitId, actionMode } = state;

  const mapWidth = (scenario.mapCols - 1) * 1.5 * HEX_SIZE + 2 * HEX_SIZE + 80;
  const mapHeight = scenario.mapRows * Math.sqrt(3) * HEX_SIZE + Math.sqrt(3) * HEX_SIZE + 80;

  useEffect(() => {
    setViewBox({ x: -40, y: -40, w: mapWidth, h: mapHeight });
  }, [mapWidth, mapHeight]);

  const visibleHexes = useMemo(() => {
    return getAllVisibleHexes(units, activeFaction, scenario.mapCols, scenario.mapRows, getVisionMod(state));
  }, [units, activeFaction, scenario, state]);

  const reachableHexes = useMemo(() => {
    if (actionMode !== 'move' || !selectedUnitId) return null;
    const unit = units.find((u) => u.id === selectedUnitId);
    if (!unit || unit.faction !== activeFaction) return null;
    const blocked = getBlockedHexes(units, activeFaction);
    const zoc = getEnemyZOC(units, activeFaction, scenario.mapCols, scenario.mapRows);
    return findReachable(
      { col: unit.col, row: unit.row },
      unit.mpRemaining,
      hexes,
      terrainTypes,
      blocked,
      zoc,
      hasIgnoreZOC(state),
      scenario.mapCols,
      scenario.mapRows,
      getMoveCostMods(state)
    );
  }, [actionMode, selectedUnitId, units, activeFaction, hexes, terrainTypes, scenario, state]);

  const attackableHexes = useMemo(() => {
    if (actionMode !== 'attack' || !selectedUnitId) return new Set<string>();
    const unit = units.find((u) => u.id === selectedUnitId);
    if (!unit) return new Set<string>();
    const targets = new Set<string>();
    for (const u of units) {
      if (u.faction !== activeFaction && u.strength > 0) {
        if (hexDistance({ col: unit.col, row: unit.row }, { col: u.col, row: u.row }) <= 1) {
          targets.add(hexKey(u.col, u.row));
        }
      }
    }
    return targets;
  }, [actionMode, selectedUnitId, units, activeFaction]);

  const supplyOverlay = useMemo(() => {
    if (!state.settings.showSupplyOverlay) return null;
    const sources = scenario.supplySources[activeFaction];
    return computeSupply(
      activeFaction, sources, hexes, terrainTypes,
      state.hexControl, scenario.mapCols, scenario.mapRows
    );
  }, [state.settings.showSupplyOverlay, activeFaction, hexes, terrainTypes, state.hexControl, scenario]);

  const handleHexClick = useCallback((col: number, row: number) => {
    dispatch({ type: 'SELECT_HEX', col, row });
  }, [dispatch]);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (e.pointerType === 'touch' || e.button === 0) {
      setDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging) return;
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    if (Math.abs(dx) < 3 && Math.abs(dy) < 3) return;
    const scale = viewBox.w / (svgRef.current?.clientWidth || 500);
    setViewBox((v) => ({ ...v, x: v.x - dx * scale, y: v.y - dy * scale }));
    setDragStart({ x: e.clientX, y: e.clientY });
  }, [dragging, dragStart, viewBox.w]);

  const handlePointerUp = useCallback(() => {
    setDragging(false);
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const factor = e.deltaY > 0 ? 1.1 : 0.9;
    setViewBox((v) => {
      const nw = v.w * factor;
      const nh = v.h * factor;
      return {
        x: v.x + (v.w - nw) / 2,
        y: v.y + (v.h - nh) / 2,
        w: nw,
        h: nh,
      };
    });
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      setPinchDist(Math.sqrt(dx * dx + dy * dy));
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2 && pinchDist > 0) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const newDist = Math.sqrt(dx * dx + dy * dy);
      const factor = pinchDist / newDist;
      setPinchDist(newDist);
      setViewBox((v) => {
        const nw = v.w * factor;
        const nh = v.h * factor;
        return {
          x: v.x + (v.w - nw) / 2,
          y: v.y + (v.h - nh) / 2,
          w: Math.max(200, Math.min(2000, nw)),
          h: Math.max(200, Math.min(2000, nh)),
        };
      });
    }
  }, [pinchDist]);

  const unitsByHex = useMemo(() => {
    const map = new Map<string, Unit[]>();
    for (const u of units) {
      if (u.strength <= 0) continue;
      const key = hexKey(u.col, u.row);
      const arr = map.get(key) || [];
      arr.push(u);
      map.set(key, arr);
    }
    return map;
  }, [units]);

  const vpHexSet = useMemo(() => {
    const s = new Map<string, number>();
    for (const v of scenario.vpHexes) {
      s.set(hexKey(v.col, v.row), v.vp);
    }
    return s;
  }, [scenario.vpHexes]);

  return (
    <div className="hex-map-container">
      <svg
        ref={svgRef}
        className="hex-map-svg"
        viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        style={{ touchAction: 'none' }}
      >
        {hexes.map((hex) => {
          const { x, y } = hexToPixel(hex.col, hex.row);
          const corners = hexCorners(x, y);
          const tt = terrainTypes[hex.terrain];
          const key = hexKey(hex.col, hex.row);
          const isSelected = state.selectedHex?.col === hex.col && state.selectedHex?.row === hex.row;
          const isReachable = reachableHexes?.has(key);
          const isAttackable = attackableHexes.has(key);
          const isVP = vpHexSet.has(key);
          const vpVal = vpHexSet.get(key);
          const isSupplied = supplyOverlay?.has(key);
          const control = state.hexControl[key];

          let fill = tt.color;
          if (state.settings.showSupplyOverlay && supplyOverlay && !tt.impassable) {
            fill = isSupplied ? tt.color : `${tt.color}88`;
          }

          return (
            <g key={key} onClick={() => handleHexClick(hex.col, hex.row)} style={{ cursor: 'pointer' }}>
              <polygon
                points={corners}
                fill={fill}
                stroke={isSelected ? '#e8c840' : isReachable ? '#4a90d9' : isAttackable ? '#d94040' : '#8b7d6b'}
                strokeWidth={isSelected ? 2.5 : isReachable || isAttackable ? 2 : 0.8}
                opacity={tt.impassable ? 0.7 : 1}
              />
              {isReachable && (
                <polygon
                  points={corners}
                  fill="#4a90d9"
                  opacity={0.2}
                  style={{ pointerEvents: 'none' }}
                />
              )}
              {isAttackable && (
                <polygon
                  points={corners}
                  fill="#d94040"
                  opacity={0.25}
                  style={{ pointerEvents: 'none' }}
                />
              )}
              {isVP && (
                <text
                  x={x}
                  y={y - HEX_SIZE * 0.65}
                  textAnchor="middle"
                  fontSize={7}
                  fill="#c8a020"
                  fontWeight="bold"
                  style={{ pointerEvents: 'none' }}
                >
                  &#9733;{vpVal}
                </text>
              )}
              {control && (
                <circle
                  cx={x + HEX_SIZE * 0.6}
                  cy={y - HEX_SIZE * 0.55}
                  r={3}
                  fill={control === 'axis' ? '#5a6a7a' : '#b83030'}
                  opacity={0.6}
                  style={{ pointerEvents: 'none' }}
                />
              )}
              {hex.name && (
                <text
                  x={x}
                  y={y + HEX_SIZE * 0.85}
                  textAnchor="middle"
                  fontSize={5.5}
                  fill="#4a3a2a"
                  fontFamily="Georgia, serif"
                  style={{ pointerEvents: 'none' }}
                >
                  {hex.name}
                </text>
              )}
            </g>
          );
        })}

        {Array.from(unitsByHex.entries()).map(([key, unitsOnHex]) => {
          const { col, row } = unitsOnHex[0];
          const { x, y } = hexToPixel(col, row);
          return unitsOnHex.map((unit, idx) => {
            const isEnemy = unit.faction !== activeFaction;
            const isRevealed = state.revealedUnitIds.includes(unit.id);
            const isVisible = visibleHexes.has(hexKey(unit.col, unit.row));

            if (isEnemy && !isVisible) return null;

            const offsetX = unitsOnHex.length > 1 ? (idx - (unitsOnHex.length - 1) / 2) * 8 : 0;
            const offsetY = unitsOnHex.length > 1 ? (idx % 2) * 4 : 0;

            return (
              <Counter
                key={unit.id}
                unit={unit}
                x={x + offsetX}
                y={y + offsetY}
                isSelected={unit.id === selectedUnitId}
                isEnemy={isEnemy}
                isRevealed={isRevealed}
                retroEffects={state.settings.retroEffects}
              />
            );
          });
        })}
      </svg>
    </div>
  );
}
