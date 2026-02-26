import React from 'react';
import { Faction, LogEntry } from '../types';

interface Props {
  winner: Faction | 'draw' | null;
  vp: Record<Faction, number>;
  factionNames: Record<Faction, string>;
  log: LogEntry[];
  onRestart: () => void;
}

function AxisBadge() {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" aria-hidden="true">
      {/* Iron cross simplified */}
      <rect x="20" y="4" width="16" height="48" rx="2" fill="#5a6878" />
      <rect x="4" y="20" width="48" height="16" rx="2" fill="#5a6878" />
      <rect x="16" y="16" width="24" height="24" rx="2" fill="#4a5868" />
      <circle cx="28" cy="28" r="6" fill="#3a4858" />
    </svg>
  );
}

function SovietBadge() {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" aria-hidden="true">
      {/* Five-pointed star */}
      <polygon
        points="28,4 34,20 52,20 38,31 43,48 28,37 13,48 18,31 4,20 22,20"
        fill="#962828"
        stroke="#c04040"
        strokeWidth="1"
      />
    </svg>
  );
}

function DrawBadge() {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" aria-hidden="true">
      <circle cx="28" cy="28" r="24" fill="none" stroke="#8b7d6b" strokeWidth="3" strokeDasharray="6 4" />
      <line x1="14" y1="28" x2="42" y2="28" stroke="#8b7d6b" strokeWidth="3" />
    </svg>
  );
}

export function VictoryScreen({ winner, vp, factionNames, log, onRestart }: Props) {
  const winnerName = winner === 'draw' ? 'Draw' : winner ? factionNames[winner] : 'Unknown';
  const totalVP = vp.axis + vp.soviet;
  const axisBarWidth = totalVP > 0 ? Math.round((vp.axis / Math.max(totalVP, 1)) * 100) : 50;

  const cardClass = winner === 'axis'
    ? 'title-card victory-card victory-axis'
    : winner === 'soviet'
    ? 'title-card victory-card victory-soviet'
    : 'title-card victory-card victory-draw';

  return (
    <div className="screen-center">
      <div className={cardClass}>
        <div className="title-corner title-corner-tl" />
        <div className="title-corner title-corner-tr" />
        <div className="title-corner title-corner-bl" />
        <div className="title-corner title-corner-br" />

        <div className="victory-badge">
          {winner === 'axis' && <AxisBadge />}
          {winner === 'soviet' && <SovietBadge />}
          {(winner === 'draw' || winner === null) && <DrawBadge />}
        </div>

        <h1 className="victory-heading">
          {winner === 'draw' ? 'STALEMATE' : 'VICTORY'}
        </h1>

        <div className="title-divider" />

        {winner !== 'draw' && (
          <p className={`victory-winner ${winner || ''}`}>{winnerName} prevails!</p>
        )}

        {/* VP comparison bar */}
        <div className="victory-vp-bar-wrap">
          <span className="vp-bar-label vp-bar-axis">{vp.axis} VP</span>
          <div className="vp-bar-track">
            <div className="vp-bar-axis-fill" style={{ width: `${axisBarWidth}%` }} />
            <div className="vp-bar-soviet-fill" style={{ width: `${100 - axisBarWidth}%` }} />
          </div>
          <span className="vp-bar-label vp-bar-soviet">{vp.soviet} VP</span>
        </div>

        <div className="victory-vp">
          <div className="vp-row">
            <span className="vp-faction-axis">{factionNames.axis}</span>
            <span className="vp-value vp-axis">{vp.axis} VP</span>
          </div>
          <div className="vp-row">
            <span className="vp-faction-soviet">{factionNames.soviet}</span>
            <span className="vp-value vp-soviet">{vp.soviet} VP</span>
          </div>
        </div>

        <div className="victory-log">
          <h3>Battle Log &mdash; Final Actions</h3>
          <div className="log-scroll">
            {log.slice(-20).map((entry, i) => (
              <div key={i} className={`log-entry ${entry.faction}`}>
                <span className="log-meta">T{entry.turn}</span>
                <span className="log-text">{entry.message}</span>
              </div>
            ))}
          </div>
        </div>

        <button className="btn btn-primary btn-campaign" onClick={onRestart} style={{ marginTop: 20 }}>
          NEW GAME
        </button>
      </div>
    </div>
  );
}
