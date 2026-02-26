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

const MAX_CP_ICONS = 8;
const MAX_ART_ICONS = 4;

function DotIcons({ count, max, activeClass }: { count: number; max: number; activeClass: string }) {
  const shown = Math.min(max, Math.max(0, count));
  return (
    <span className="dot-icons">
      {Array.from({ length: Math.min(max, shown) }).map((_, i) => (
        <span key={i} className={`dot-icon ${activeClass}`}>●</span>
      ))}
      {Array.from({ length: Math.max(0, Math.min(max, max) - shown) }).map((_, i) => (
        <span key={i} className="dot-icon dot-empty">○</span>
      ))}
      {count > max && <span className="dot-overflow">+{count - max}</span>}
    </span>
  );
}

function VPBar({ axis, soviet }: { axis: number; soviet: number }) {
  const total = axis + soviet;
  const axisW = total > 0 ? Math.round((axis / total) * 100) : 50;
  return (
    <div className="vp-bar-mini">
      <span className="vp-bar-num vp-axis">{axis}</span>
      <div className="vp-bar-track-mini">
        <div className="vp-bar-axis-fill" style={{ width: `${axisW}%` }} />
        <div className="vp-bar-soviet-fill" style={{ width: `${100 - axisW}%` }} />
      </div>
      <span className="vp-bar-num vp-soviet">{soviet}</span>
    </div>
  );
}

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
          <span className={`top-value phase-badge phase-${phase}`}>{phaseLabel[phase]}</span>
        </div>
        <div className="top-buttons">
          <button className="icon-btn" onClick={onLog} title="Battle Log">&#9776;</button>
          <button className="icon-btn" onClick={onSettings} title="Settings">&#9881;</button>
        </div>
      </div>
      <div className="top-bar-row top-bar-row-resources">
        <div className="top-resource">
          <span className="top-label">CP</span>
          <DotIcons count={cp} max={MAX_CP_ICONS} activeClass="dot-cp" />
        </div>
        <div className="top-resource">
          <span className="top-label">Art</span>
          <DotIcons count={artilleryPoints} max={MAX_ART_ICONS} activeClass="dot-art" />
        </div>
        <div className="top-resource top-vp">
          <span className="top-label">VP</span>
          <VPBar axis={vp.axis} soviet={vp.soviet} />
        </div>
      </div>
    </div>
  );
}
