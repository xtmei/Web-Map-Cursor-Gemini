import React from 'react';
import { Faction } from '../types';

interface Props {
  faction: Faction;
  factionName: string;
  turn: number;
  onReady: () => void;
}

export function PassDevice({ faction, factionName, turn, onReady }: Props) {
  return (
    <div className="screen-center">
      <div className="title-card">
        <div className={`pass-icon ${faction}`}>
          {faction === 'axis' ? '\u2694' : '\u2733'}
        </div>
        <h2 className="pass-heading">Pass Device</h2>
        <div className="title-divider" />
        <p className="pass-text">
          Turn {turn} &mdash; <strong>{factionName}</strong>
        </p>
        <p className="pass-instruction">
          Hand the device to the {factionName} commander.
          <br />
          Press Ready when in position.
        </p>
        <button className="btn btn-primary" onClick={onReady} style={{ marginTop: 24 }}>
          Ready
        </button>
      </div>
    </div>
  );
}
