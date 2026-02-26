import React from 'react';
import { GameAction, GameState } from '../types';

interface Props {
  settings: GameState['settings'];
  dispatch: React.Dispatch<GameAction>;
  onClose: () => void;
}

export function SettingsPanel({ settings, dispatch, onClose }: Props) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Settings</h2>
          <button className="icon-btn modal-close" onClick={onClose}>&times;</button>
        </div>

        <div className="settings-group">
          <h3>Visual Effects</h3>

          <div className="setting-row">
            <label className="setting-label">Retro Effects</label>
            <button
              className={`toggle-btn ${settings.retroEffects ? 'on' : 'off'}`}
              onClick={() => dispatch({ type: 'TOGGLE_RETRO' })}
            >
              {settings.retroEffects ? 'ON' : 'OFF'}
            </button>
          </div>

          {settings.retroEffects && (
            <div className="setting-row">
              <label className="setting-label">Effects Strength</label>
              <input
                type="range"
                min="0"
                max="100"
                value={settings.effectsStrength}
                onChange={(e) =>
                  dispatch({ type: 'SET_EFFECTS_STRENGTH', value: Number(e.target.value) })
                }
                className="slider"
              />
              <span className="slider-value">{settings.effectsStrength}%</span>
            </div>
          )}
        </div>

        <div className="settings-group">
          <h3>Map Overlays</h3>

          <div className="setting-row">
            <label className="setting-label">Supply Lines</label>
            <button
              className={`toggle-btn ${settings.showSupplyOverlay ? 'on' : 'off'}`}
              onClick={() => dispatch({ type: 'TOGGLE_SUPPLY_OVERLAY' })}
            >
              {settings.showSupplyOverlay ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
