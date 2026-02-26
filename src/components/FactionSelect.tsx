import React from 'react';
import { Faction } from '../types';

interface Props {
  onSelect: (faction: Faction) => void;
}

export function FactionSelect({ onSelect }: Props) {
  return (
    <div className="screen-center">
      <div className="title-card">
        <h2 className="faction-heading">Choose Your Side</h2>
        <div className="title-divider" />
        <div className="faction-grid">
          <button className="faction-btn faction-axis" onClick={() => onSelect('axis')}>
            <div className="faction-icon">&#9876;</div>
            <div className="faction-name">6th Army</div>
            <div className="faction-side">Axis</div>
            <div className="faction-desc">
              Attack into the city. Seize the factories and heights.
              Superior firepower but stretched supply lines.
            </div>
          </button>
          <button className="faction-btn faction-soviet" onClick={() => onSelect('soviet')}>
            <div className="faction-icon">&#9733;</div>
            <div className="faction-name">62nd Army</div>
            <div className="faction-side">Soviet</div>
            <div className="faction-desc">
              Defend the Volga bank. Hold the factories at all costs.
              Fight from the ruins with tenacity and cunning.
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
