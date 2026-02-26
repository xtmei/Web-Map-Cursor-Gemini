import React from 'react';
import { Faction, TurnPhase } from '../types';

interface Props {
  turn: number;
  maxTurn: number;
  faction: Faction;
  factionName: string;
  phase: TurnPhase;
  cp: number;
  vp: Record<Faction, number>;
  artilleryPoints: number;
  onSettings: () => void;
  onLog: () => void;
}

const phaseLabel: Record<TurnPhase, string> = {
  upkeep: 'Upkeep',
  event: 'Event',
  action: 'Action',
  end: 'End',
};

export function TopBar({ turn, maxTurn, faction, factionName, phase, cp, vp, artilleryPoints, onSettings, onLog }: Props) {
  return (
    <div className={`top-bar ${faction}`}>
      <div className="top-bar-row">
        <div className="top-item">
          <span className="top-label">Turn</span>
          <span className="top-value">{turn}/{maxTurn}</span>
        </div>
        <div className="top-item faction-indicator">
          <span className={`faction-dot ${faction}`} />
          <span className="top-value top-faction-name">{factionName}</span>
        </div>
        <div className="top-item">
          <span className="top-label">Phase</span>
          <span className="top-value">{phaseLabel[phase]}</span>
        </div>
      </div>
      <div className="top-bar-row">
        <div className="top-item">
          <span className="top-label">CP</span>
          <span className="top-value cp-value">{cp}</span>
        </div>
        <div className="top-item">
          <span className="top-label">Art</span>
          <span className="top-value">{artilleryPoints}</span>
        </div>
        <div className="top-item">
          <span className="top-label">VP</span>
          <span className="top-value vp-axis">{vp.axis}</span>
          <span className="top-sep">/</span>
          <span className="top-value vp-soviet">{vp.soviet}</span>
        </div>
        <div className="top-buttons">
          <button className="icon-btn" onClick={onLog} title="Battle Log">&#9776;</button>
          <button className="icon-btn" onClick={onSettings} title="Settings">&#9881;</button>
        </div>
      </div>
    </div>
  );
}
