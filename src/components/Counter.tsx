import React from 'react';
import { Unit } from '../types';

interface Props {
  unit: Unit;
  x: number;
  y: number;
  isSelected: boolean;
  isEnemy: boolean;
  isRevealed: boolean;
  retroEffects: boolean;
}

const TYPE_SYMBOLS: Record<string, (cx: number, cy: number) => React.ReactNode> = {
  infantry: (cx, cy) => (
    <g>
      <line x1={cx - 6} y1={cy - 2} x2={cx + 6} y2={cy + 5} stroke="currentColor" strokeWidth={1.2} />
      <line x1={cx + 6} y1={cy - 2} x2={cx - 6} y2={cy + 5} stroke="currentColor" strokeWidth={1.2} />
    </g>
  ),
  armor: (cx, cy) => (
    <ellipse cx={cx} cy={cy + 2} rx={7} ry={4} fill="none" stroke="currentColor" strokeWidth={1.2} />
  ),
  recon: (cx, cy) => (
    <line x1={cx - 6} y1={cy + 5} x2={cx + 6} y2={cy - 2} stroke="currentColor" strokeWidth={1.2} />
  ),
  hq: (cx, cy) => (
    <g>
      <line x1={cx - 6} y1={cy - 2} x2={cx + 6} y2={cy + 5} stroke="currentColor" strokeWidth={1.2} />
      <line x1={cx + 6} y1={cy - 2} x2={cx - 6} y2={cy + 5} stroke="currentColor" strokeWidth={1.2} />
      <circle cx={cx} cy={cy + 2} r={3} fill="none" stroke="currentColor" strokeWidth={0.8} />
    </g>
  ),
  artillery: (cx, cy) => (
    <circle cx={cx} cy={cy + 2} r={4} fill="currentColor" opacity={0.7} />
  ),
};

export function Counter({ unit, x, y, isSelected, isEnemy, isRevealed, retroEffects }: Props) {
  const SIZE = 18;
  const half = SIZE / 2;
  const bgColor = unit.faction === 'axis' ? '#5a6878' : '#a83030';
  const textColor = '#f0e8d8';
  const cx = x;
  const cy = y;

  if (isEnemy && !isRevealed) {
    return (
      <g style={{ pointerEvents: 'none' }}>
        <rect
          x={cx - half}
          y={cy - half}
          width={SIZE}
          height={SIZE}
          rx={2}
          fill={bgColor}
          opacity={0.7}
          stroke={isSelected ? '#e8c840' : '#2a2a2a'}
          strokeWidth={isSelected ? 2 : 0.8}
        />
        <text
          x={cx}
          y={cy + 4}
          textAnchor="middle"
          fontSize={12}
          fill={textColor}
          fontWeight="bold"
          fontFamily="Georgia, serif"
        >
          ?
        </text>
      </g>
    );
  }

  const symbol = TYPE_SYMBOLS[unit.type] || TYPE_SYMBOLS.infantry;
  const strengthRatio = unit.strength / unit.maxStrength;

  return (
    <g style={{ pointerEvents: 'none' }}>
      <rect
        x={cx - half}
        y={cy - half}
        width={SIZE}
        height={SIZE}
        rx={2}
        fill={bgColor}
        stroke={isSelected ? '#e8c840' : '#2a2a2a'}
        strokeWidth={isSelected ? 2.5 : 0.8}
        filter={retroEffects ? 'url(#counterNoise)' : undefined}
      />

      {retroEffects && (
        <rect
          x={cx - half}
          y={cy - half}
          width={SIZE}
          height={SIZE}
          rx={2}
          fill="url(#counterNoise)"
          opacity={0.3}
        />
      )}

      <g color={textColor}>{symbol(cx, cy - 5)}</g>

      <text
        x={cx - 5}
        y={cy + half - 2}
        fontSize={6}
        fill={textColor}
        fontFamily="monospace"
        fontWeight="bold"
      >
        {unit.attack}
      </text>
      <text
        x={cx + 2}
        y={cy + half - 2}
        fontSize={6}
        fill={textColor}
        fontFamily="monospace"
        fontWeight="bold"
      >
        {unit.defense}
      </text>
      <text
        x={cx + half - 5}
        y={cy + half - 2}
        fontSize={5}
        fill={textColor}
        fontFamily="monospace"
        opacity={0.8}
      >
        {unit.movement}
      </text>

      <rect
        x={cx - half + 1}
        y={cy + half - 4}
        width={(SIZE - 2) * strengthRatio}
        height={2}
        fill={strengthRatio > 0.5 ? '#60a060' : strengthRatio > 0.25 ? '#c0a030' : '#c04040'}
        rx={1}
      />

      {unit.disrupted && (
        <g>
          <circle cx={cx + half - 3} cy={cy - half + 3} r={3} fill="#c04040" stroke="#f0e8d8" strokeWidth={0.5} />
          <text x={cx + half - 3} y={cy - half + 5} textAnchor="middle" fontSize={4} fill="#f0e8d8" fontWeight="bold">!</text>
        </g>
      )}

      {!unit.supplied && (
        <g>
          <circle cx={cx - half + 3} cy={cy - half + 3} r={3} fill="#c08020" stroke="#f0e8d8" strokeWidth={0.5} />
          <text x={cx - half + 3} y={cy - half + 5} textAnchor="middle" fontSize={4} fill="#f0e8d8" fontWeight="bold">S</text>
        </g>
      )}
    </g>
  );
}
