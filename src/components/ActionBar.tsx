import React from 'react';
import { GameState, GameAction, Unit, ActionMode } from '../types';

interface Props {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  selectedUnit: Unit | null;
  onSave: () => void;
}

interface ActionButton {
  label: string;
  icon: string;
  mode?: ActionMode;
  action?: () => void;
  disabled: boolean;
  active: boolean;
  cost?: string;
}

export function ActionBar({ state, dispatch, selectedUnit, onSave }: Props) {
  const { activeFaction, actionMode, turnPhase, cp } = state;
  const isActionPhase = turnPhase === 'action';
  const hasCP = cp[activeFaction] >= 1;
  const hasArt = state.artilleryPoints[activeFaction] >= 1;

  if (turnPhase === 'upkeep' || turnPhase === 'event') {
    return (
      <div className="action-bar">
        <button
          className="btn btn-action btn-primary"
          onClick={() => dispatch({ type: 'ADVANCE_PHASE' })}
        >
          {turnPhase === 'upkeep' ? 'Begin Turn' : 'Continue'}
        </button>
      </div>
    );
  }

  if (turnPhase === 'end') {
    return (
      <div className="action-bar">
        <button
          className="btn btn-action btn-primary"
          onClick={() => dispatch({ type: 'END_TURN' })}
        >
          End Turn
        </button>
      </div>
    );
  }

  const buttons: ActionButton[] = [
    {
      label: 'Move',
      icon: '\u2192',
      mode: 'move',
      disabled: !selectedUnit || !isActionPhase || !hasCP || selectedUnit.faction !== activeFaction,
      active: actionMode === 'move',
      cost: '1 CP',
    },
    {
      label: 'Attack',
      icon: '\u2694',
      mode: 'attack',
      disabled: !selectedUnit || !isActionPhase || !hasCP || selectedUnit.faction !== activeFaction,
      active: actionMode === 'attack',
      cost: '1 CP',
    },
    {
      label: 'Recon',
      icon: '\u2609',
      mode: 'recon',
      disabled: !selectedUnit || !isActionPhase || !hasCP || !selectedUnit.isRecon || selectedUnit.faction !== activeFaction,
      active: actionMode === 'recon',
      cost: '1 CP',
    },
    {
      label: 'Artillery',
      icon: '\u2738',
      mode: 'artillery',
      disabled: !isActionPhase || !hasCP || !hasArt,
      active: actionMode === 'artillery',
      cost: '1 CP + 1 Art',
    },
    {
      label: 'Rest',
      icon: '\u2665',
      mode: 'rest',
      disabled: !selectedUnit || !isActionPhase || !hasCP || selectedUnit.faction !== activeFaction,
      active: actionMode === 'rest',
      cost: '1 CP',
    },
  ];

  return (
    <div className="action-bar">
      <div className="action-buttons-scroll">
        {buttons.map((btn) => (
          <button
            key={btn.label}
            className={`btn btn-action ${btn.active ? 'active' : ''} ${btn.disabled ? 'disabled' : ''}`}
            disabled={btn.disabled}
            onClick={() => {
              if (btn.mode === 'rest' && selectedUnit) {
                dispatch({ type: 'EXECUTE_REST' });
              } else if (btn.mode === 'recon' && selectedUnit) {
                dispatch({ type: 'EXECUTE_RECON' });
              } else if (btn.mode) {
                dispatch({ type: 'SET_ACTION_MODE', mode: actionMode === btn.mode ? 'select' : btn.mode });
              }
            }}
          >
            <span className="action-icon">{btn.icon}</span>
            <span className="action-label">{btn.label}</span>
            {btn.cost && <span className="action-cost">{btn.cost}</span>}
          </button>
        ))}
        <button
          className="btn btn-action btn-end"
          onClick={() => dispatch({ type: 'ADVANCE_PHASE' })}
          disabled={!isActionPhase}
        >
          <span className="action-icon">&#9632;</span>
          <span className="action-label">End Phase</span>
        </button>
        <button
          className="btn btn-action btn-save"
          onClick={onSave}
        >
          <span className="action-icon">&#9998;</span>
          <span className="action-label">Save</span>
        </button>
        {selectedUnit && (
          <button
            className="btn btn-action"
            onClick={() => dispatch({ type: 'DESELECT' })}
          >
            <span className="action-icon">&#10005;</span>
            <span className="action-label">Deselect</span>
          </button>
        )}
      </div>
    </div>
  );
}
