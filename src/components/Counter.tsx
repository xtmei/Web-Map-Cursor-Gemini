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
          <line x1={cx - 6} y1={cy + 5} x2={cx + 6} y2={cy - 2} stroke={color} strokeWidth={1.2} />
          <line x1={cx + 6} y1={cy + 5} x2={cx - 6} y2={cy - 2} stroke={color} strokeWidth={1.2} />
        </g>
      );
    case 'armor':
      return <ellipse cx={cx} cy={cy + 2} rx={7} ry={4} fill="none" stroke={color} strokeWidth={1.2} />;
    case 'recon':
      return <line x1={cx - 6} y1={cy + 5} x2={cx + 6} y2={cy - 2} stroke={color} strokeWidth={1.2} />;
    case 'hq':
      return (
        <g>
          <line x1={cx - 5} y1={cy + 4} x2={cx + 5} y2={cy - 2} stroke={color} strokeWidth={1} />
          <line x1={cx + 5} y1={cy + 4} x2={cx - 5} y2={cy - 2} stroke={color} strokeWidth={1} />
          <circle cx={cx} cy={cy + 1} r={2.5} fill="none" stroke={color} strokeWidth={0.8} />
        </g>
      );
    case 'artillery':
      return <circle cx={cx} cy={cy + 2} r={3.5} fill={color} opacity={0.7} />;
    default:
      return (
        <g>
          <line x1={cx - 6} y1={cy + 5} x2={cx + 6} y2={cy - 2} stroke={color} strokeWidth={1.2} />
          <line x1={cx + 6} y1={cy + 5} x2={cx - 6} y2={cy - 2} stroke={color} strokeWidth={1.2} />
        </g>
      );
  }
}

export function Counter({ unit, x, y, isSelected, isEnemy, isRevealed, retroEffects }: Props) {
  const SIZE = 20;
  const half = SIZE / 2;
  const bgColor = unit.faction === 'axis' ? '#5a6878' : '#a83030';
  const textColor = '#f0e8d8';

  if (isEnemy && !isRevealed) {
    return (
      <g style={{ pointerEvents: 'none' }}>
        <rect
          x={x - half}
          y={y - half}
          width={SIZE}
          height={SIZE}
          rx={2}
          fill={bgColor}
          opacity={0.75}
          stroke={isSelected ? '#e8c840' : '#1a1a1a'}
          strokeWidth={isSelected ? 2 : 0.8}
        />
        <text
          x={x}
          y={y + 4}
          textAnchor="middle"
          fontSize={13}
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

  return (
    <g style={{ pointerEvents: 'none' }}>
      <rect
        x={x - half}
        y={y - half}
        width={SIZE}
        height={SIZE}
        rx={2}
        fill={bgColor}
        stroke={isSelected ? '#e8c840' : '#1a1a1a'}
        strokeWidth={isSelected ? 2.5 : 0.8}
        filter={retroEffects ? 'url(#counterNoise)' : undefined}
      />

      <NatoSymbol type={unit.type} cx={x} cy={y - 5} color={textColor} />

      <text
        x={x - 6}
        y={y + half - 2.5}
        fontSize={6.5}
        fill={textColor}
        fontFamily="'Courier New', monospace"
        fontWeight="bold"
      >
        {unit.attack}
      </text>
      <line
        x1={x - 0.5} y1={y + half - 8}
        x2={x - 0.5} y2={y + half - 2}
        stroke={textColor} strokeWidth={0.5} opacity={0.4}
      />
      <text
        x={x + 2}
        y={y + half - 2.5}
        fontSize={6.5}
        fill={textColor}
        fontFamily="'Courier New', monospace"
        fontWeight="bold"
      >
        {unit.defense}
      </text>

      <rect
        x={x - half + 1}
        y={y + half - 3.5}
        width={(SIZE - 2) * strengthRatio}
        height={2}
        fill={strengthRatio > 0.5 ? '#60a060' : strengthRatio > 0.25 ? '#c0a030' : '#c04040'}
        rx={1}
      />
      <rect
        x={x - half + 1}
        y={y + half - 3.5}
        width={SIZE - 2}
        height={2}
        fill="none"
        stroke={textColor}
        strokeWidth={0.3}
        rx={1}
        opacity={0.3}
      />

      {unit.disrupted && (
        <g>
          <circle cx={x + half - 2} cy={y - half + 2} r={3.5} fill="#c04040" stroke="#f0e8d8" strokeWidth={0.5} />
          <text x={x + half - 2} y={y - half + 4} textAnchor="middle" fontSize={5} fill="#f0e8d8" fontWeight="bold">!</text>
        </g>
      )}

      {!unit.supplied && (
        <g>
          <circle cx={x - half + 2} cy={y - half + 2} r={3.5} fill="#c08020" stroke="#f0e8d8" strokeWidth={0.5} />
          <text x={x - half + 2} y={y - half + 4} textAnchor="middle" fontSize={4} fill="#f0e8d8" fontWeight="bold">S</text>
        </g>
      )}

      <text
        x={x}
        y={y + half + 7}
        textAnchor="middle"
        fontSize={4}
        fill="#3a2a1a"
        fontFamily="Georgia, serif"
        opacity={0.7}
        style={{ pointerEvents: 'none' }}
      >
        {unit.name.length > 12 ? unit.name.substring(0, 11) + '.' : unit.name}
      </text>
    </g>
  );
}
