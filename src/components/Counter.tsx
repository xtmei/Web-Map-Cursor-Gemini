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

function NatoSymbol({ type, cx, cy, color }: { type: string; cx: number; cy: number; color: string }) {
  switch (type) {
    case 'infantry':
      return (
        <g>
          <line x1={cx - 8} y1={cy + 6} x2={cx + 8} y2={cy - 3} stroke={color} strokeWidth={1.5} />
          <line x1={cx + 8} y1={cy + 6} x2={cx - 8} y2={cy - 3} stroke={color} strokeWidth={1.5} />
        </g>
      );
    case 'armor':
      return <ellipse cx={cx} cy={cy + 2} rx={9} ry={5} fill="none" stroke={color} strokeWidth={1.5} />;
    case 'recon':
      return (
        <g>
          <line x1={cx - 8} y1={cy + 6} x2={cx + 8} y2={cy - 3} stroke={color} strokeWidth={1.5} />
          <circle cx={cx + 5} cy={cy - 1} r={2.5} fill="none" stroke={color} strokeWidth={1} />
        </g>
      );
    case 'hq':
      return (
        <g>
          <line x1={cx - 7} y1={cy + 5} x2={cx + 7} y2={cy - 3} stroke={color} strokeWidth={1.2} />
          <line x1={cx + 7} y1={cy + 5} x2={cx - 7} y2={cy - 3} stroke={color} strokeWidth={1.2} />
          <circle cx={cx} cy={cy + 1} r={3.5} fill="none" stroke={color} strokeWidth={1} />
        </g>
      );
    case 'artillery':
      return (
        <g>
          <circle cx={cx} cy={cy + 2} r={4.5} fill={color} opacity={0.8} />
          <line x1={cx + 3} y1={cy - 1} x2={cx + 8} y2={cy - 5} stroke={color} strokeWidth={1.5} />
        </g>
      );
    default:
      return (
        <g>
          <line x1={cx - 8} y1={cy + 6} x2={cx + 8} y2={cy - 3} stroke={color} strokeWidth={1.5} />
          <line x1={cx + 8} y1={cy + 6} x2={cx - 8} y2={cy - 3} stroke={color} strokeWidth={1.5} />
        </g>
      );
  }
}

export function Counter({ unit, x, y, isSelected, isEnemy, isRevealed, retroEffects }: Props) {
  const SIZE = 28;
  const half = SIZE / 2;
  const bgColor = unit.faction === 'axis' ? '#4a5a6a' : '#962828';
  const borderColor = unit.faction === 'axis' ? '#3a4a5a' : '#781818';
  const textColor = '#f0e8d8';

  if (isEnemy && !isRevealed) {
    return (
      <g style={{ pointerEvents: 'none' }}>
        {/* Hatched unknown enemy counter */}
        <defs>
          <pattern id={`hatch-${unit.id}`} width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="4" stroke={borderColor} strokeWidth="1.5" opacity="0.5" />
          </pattern>
        </defs>
        <rect
          x={x - half}
          y={y - half}
          width={SIZE}
          height={SIZE}
          rx={2}
          fill={bgColor}
          opacity={0.80}
          stroke={isSelected ? '#e8c840' : borderColor}
          strokeWidth={isSelected ? 2.5 : 1}
        />
        <rect
          x={x - half}
          y={y - half}
          width={SIZE}
          height={SIZE}
          rx={2}
          fill={`url(#hatch-${unit.id})`}
          opacity={0.35}
        />
        <text
          x={x}
          y={y + 5}
          textAnchor="middle"
          fontSize={16}
          fill={textColor}
          fontWeight="bold"
          fontFamily="Georgia, serif"
        >
          ?
        </text>
      </g>
    );
  }

  const strengthRatio = unit.strength / unit.maxStrength;
  const isActivated = unit.activated;

  return (
    <g style={{ pointerEvents: 'none' }} opacity={isActivated ? 0.55 : 1}>
      {/* Main counter body */}
      <rect
        x={x - half}
        y={y - half}
        width={SIZE}
        height={SIZE}
        rx={2}
        fill={bgColor}
        stroke={isSelected ? '#e8c840' : borderColor}
        strokeWidth={isSelected ? 3 : 1}
        filter={retroEffects ? 'url(#counterNoise)' : undefined}
      />

      {/* Inner border frame (NATO wargame style) */}
      <rect
        x={x - half + 2}
        y={y - half + 2}
        width={SIZE - 4}
        height={SIZE - 4}
        rx={1}
        fill="none"
        stroke={textColor}
        strokeWidth={0.5}
        opacity={0.25}
      />

      {/* NATO unit symbol */}
      <NatoSymbol type={unit.type} cx={x} cy={y - 5} color={textColor} />

      {/* Attack | Defense numbers */}
      <text
        x={x - 7}
        y={y + half - 5}
        fontSize={9}
        fill={textColor}
        fontFamily="'Courier New', monospace"
        fontWeight="bold"
        textAnchor="middle"
      >
        {unit.attack}
      </text>
      <line
        x1={x - 0.5} y1={y + half - 13}
        x2={x - 0.5} y2={y + half - 4}
        stroke={textColor} strokeWidth={0.6} opacity={0.5}
      />
      <text
        x={x + 7}
        y={y + half - 5}
        fontSize={9}
        fill={textColor}
        fontFamily="'Courier New', monospace"
        fontWeight="bold"
        textAnchor="middle"
      >
        {unit.defense}
      </text>

      {/* Strength bar */}
      <rect
        x={x - half + 2}
        y={y + half - 4}
        width={(SIZE - 4) * strengthRatio}
        height={3}
        fill={strengthRatio > 0.5 ? '#50a850' : strengthRatio > 0.25 ? '#c0a030' : '#d03030'}
        rx={1}
      />
      <rect
        x={x - half + 2}
        y={y + half - 4}
        width={SIZE - 4}
        height={3}
        fill="none"
        stroke={textColor}
        strokeWidth={0.4}
        rx={1}
        opacity={0.4}
      />

      {/* Disrupted indicator */}
      {unit.disrupted && (
        <g>
          <circle cx={x + half - 3} cy={y - half + 3} r={4} fill="#c03030" stroke="#f0e8d8" strokeWidth={0.6} />
          <text x={x + half - 3} y={y - half + 5.5} textAnchor="middle" fontSize={6} fill="#f0e8d8" fontWeight="bold">!</text>
        </g>
      )}

      {/* Unsupplied indicator */}
      {!unit.supplied && (
        <g>
          <circle cx={x - half + 3} cy={y - half + 3} r={4} fill="#c08020" stroke="#f0e8d8" strokeWidth={0.6} />
          <text x={x - half + 3} y={y - half + 5.5} textAnchor="middle" fontSize={5} fill="#f0e8d8" fontWeight="bold">S</text>
        </g>
      )}

      {/* Unit name below counter */}
      <text
        x={x}
        y={y + half + 9}
        textAnchor="middle"
        fontSize={5.5}
        fill="#2a1a0a"
        fontFamily="Georgia, serif"
        fontWeight="bold"
        opacity={0.85}
        style={{ pointerEvents: 'none' }}
      >
        {unit.name.length > 10 ? unit.name.substring(0, 9) + '.' : unit.name}
      </text>
    </g>
  );
}
