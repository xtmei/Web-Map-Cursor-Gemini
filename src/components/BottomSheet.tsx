import React, { useState } from 'react';
import { Unit, GameState } from '../types';

interface Props {
  selectedUnit: Unit | null;
  state: GameState;
}

export function BottomSheet({ selectedUnit, state }: Props) {
  const [expanded, setExpanded] = useState(false);

  if (!selectedUnit) {
    return (
      <div className="bottom-sheet collapsed">
        <div className="sheet-handle" />
        <div className="sheet-hint">Select a unit on the map</div>
      </div>
    );
  }

  const hex = state.hexes.find((h) => h.col === selectedUnit.col && h.row === selectedUnit.row);
  const terrainLabel = hex ? state.terrainTypes[hex.terrain].label : '';

  return (
    <div className={`bottom-sheet ${expanded ? 'expanded' : ''}`}>
      <div className="sheet-handle" onClick={() => setExpanded(!expanded)} />

      <div className="sheet-summary" onClick={() => setExpanded(!expanded)}>
        <div className={`sheet-faction-dot ${selectedUnit.faction}`} />
        <div className="sheet-unit-name">{selectedUnit.name}</div>
        <div className="sheet-stats-inline">
          <span className="stat">{selectedUnit.attack}/{selectedUnit.defense}/{selectedUnit.movement}</span>
          <span className="stat str">Str: {selectedUnit.strength}/{selectedUnit.maxStrength}</span>
          <span className="stat mp">MP: {selectedUnit.mpRemaining}</span>
        </div>
        <div className="sheet-expand-arrow">{expanded ? '\u25BC' : '\u25B2'}</div>
      </div>

      {expanded && (
        <div className="sheet-details">
          <div className="detail-row">
            <span className="detail-label">Type:</span>
            <span className="detail-value">{selectedUnit.type}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Position:</span>
            <span className="detail-value">({selectedUnit.col}, {selectedUnit.row}) — {terrainLabel}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Supply:</span>
            <span className={`detail-value ${selectedUnit.supplied ? 'supplied' : 'unsupplied'}`}>
              {selectedUnit.supplied ? 'Supplied' : 'UNSUPPLIED'}
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Status:</span>
            <span className={`detail-value ${selectedUnit.disrupted ? 'disrupted' : ''}`}>
              {selectedUnit.disrupted ? 'DISRUPTED' : 'Ready'}
              {selectedUnit.activated ? ' (Activated)' : ''}
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Vision:</span>
            <span className="detail-value">{selectedUnit.visionRange} hexes</span>
          </div>
          {selectedUnit.isHQ && (
            <div className="detail-row">
              <span className="detail-label">HQ Bonus:</span>
              <span className="detail-value">+{selectedUnit.cpBonus} CP, range {selectedUnit.hqRange}</span>
            </div>
          )}
          {hex?.name && (
            <div className="detail-row">
              <span className="detail-label">Location:</span>
              <span className="detail-value">{hex.name}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
