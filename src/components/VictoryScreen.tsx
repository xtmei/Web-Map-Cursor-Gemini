import React from 'react';
import { Faction, LogEntry } from '../types';

interface Props {
  winner: Faction | 'draw' | null;
  vp: Record<Faction, number>;
  factionNames: Record<Faction, string>;
  log: LogEntry[];
  onRestart: () => void;
}

export function VictoryScreen({ winner, vp, factionNames, log, onRestart }: Props) {
  const winnerName = winner === 'draw' ? 'Draw' : winner ? factionNames[winner] : 'Unknown';

  return (
    <div className="screen-center">
      <div className="title-card">
        <div className="victory-star">&#9733;</div>
        <h1 className="victory-heading">
          {winner === 'draw' ? 'STALEMATE' : 'VICTORY'}
        </h1>
        <div className="title-divider" />
        {winner !== 'draw' && (
          <p className="victory-winner">{winnerName} prevails!</p>
        )}
        <div className="victory-vp">
          <div className="vp-row">
            <span>{factionNames.axis}</span>
            <span className="vp-value">{vp.axis} VP</span>
          </div>
          <div className="vp-row">
            <span>{factionNames.soviet}</span>
            <span className="vp-value">{vp.soviet} VP</span>
          </div>
        </div>
        <div className="victory-log">
          <h3>Battle Log (last 20)</h3>
          <div className="log-scroll">
            {log.slice(-20).map((entry, i) => (
              <div key={i} className="log-entry">
                <span className="log-meta">T{entry.turn}</span>
                {entry.message}
              </div>
            ))}
          </div>
        </div>
        <button className="btn btn-primary" onClick={onRestart} style={{ marginTop: 20 }}>
          New Game
        </button>
      </div>
    </div>
  );
}
