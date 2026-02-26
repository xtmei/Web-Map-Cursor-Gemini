import React from 'react';
import { GameState, GameAction, Unit, ActionMode } from '../types';

interface Props {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  selectedUnit: Unit | null;
  onSave: () => void;
}

export function ActionBar({ state, dispatch, selectedUnit, onSave }: Props) {
  const { activeFaction, actionMode, turnPhase, cp } = state;
  const isActionPhase = turnPhase === 'action';
  const hasCP = cp[activeFaction] >= 1;
  const hasArt = state.artilleryPoints[activeFaction] >= 1;

  if (turnPhase === 'upkeep') {
    return (
      <div className="action-bar">
        <button
          className="btn btn-action btn-primary"
          onClick={() => dispatch({ type: 'ADVANCE_PHASE' })}
          style={{ width: '100%' }}
        >
          Begin Turn &mdash; {state.scenario.factionNames[activeFaction]}
        </button>
      </div>
    );
  }

  if (turnPhase === 'event') {
    return (
      <div className="action-bar">
        <button
          className="btn btn-action btn-primary"
          onClick={() => dispatch({ type: 'ADVANCE_PHASE' })}
          style={{ width: '100%' }}
        >
          Continue to Action Phase
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
          style={{ width: '100%' }}
        >
          End Turn
        </button>
      </div>
    );
  }

  const canMove = !!selectedUnit && isActionPhase && hasCP && selectedUnit.faction === activeFaction && selectedUnit.mpRemaining > 0;
  const canAttack = !!selectedUnit && isActionPhase && hasCP && selectedUnit.faction === activeFaction && selectedUnit.attack > 0;
  const canRecon = !!selectedUnit && isActionPhase && hasCP && selectedUnit.isRecon && selectedUnit.faction === activeFaction;
  const canRest = !!selectedUnit && isActionPhase && hasCP && selectedUnit.faction === activeFaction &&
    (selectedUnit.disrupted || selectedUnit.strength < selectedUnit.maxStrength);

  return (
    <div className="action-bar">
      <div className="action-buttons-scroll">
        <button
          className={`btn btn-action ${actionMode === 'move' ? 'active' : ''} ${!canMove ? 'disabled' : ''}`}
          disabled={!canMove}
          onClick={() => dispatch({ type: 'SET_ACTION_MODE', mode: actionMode === 'move' ? 'select' : 'move' })}
        >
          <span className="action-icon">{'\u2192'}</span>
          <span className="action-label">Move</span>
          <span className="action-cost">1 CP</span>
        </button>

        <button
          className={`btn btn-action ${actionMode === 'attack' ? 'active' : ''} ${!canAttack ? 'disabled' : ''}`}
          disabled={!canAttack}
          onClick={() => dispatch({ type: 'SET_ACTION_MODE', mode: actionMode === 'attack' ? 'select' : 'attack' })}
        >
          <span className="action-icon">{'\u2694'}</span>
          <span className="action-label">Attack</span>
          <span className="action-cost">1 CP</span>
        </button>

        <button
          className={`btn btn-action ${!canRecon ? 'disabled' : ''}`}
          disabled={!canRecon}
          onClick={() => {
            if (canRecon) dispatch({ type: 'EXECUTE_RECON' });
          }}
        >
          <span className="action-icon">{'\u2609'}</span>
          <span className="action-label">Recon</span>
          <span className="action-cost">1 CP</span>
        </button>

        <button
          className={`btn btn-action ${actionMode === 'artillery' ? 'active' : ''} ${!(isActionPhase && hasCP && hasArt) ? 'disabled' : ''}`}
          disabled={!(isActionPhase && hasCP && hasArt)}
          onClick={() => dispatch({ type: 'SET_ACTION_MODE', mode: actionMode === 'artillery' ? 'select' : 'artillery' })}
        >
          <span className="action-icon">{'\u2738'}</span>
          <span className="action-label">Artillery</span>
          <span className="action-cost">1CP+1Art</span>
        </button>

        <button
          className={`btn btn-action ${!canRest ? 'disabled' : ''}`}
          disabled={!canRest}
          onClick={() => {
            if (canRest) dispatch({ type: 'EXECUTE_REST' });
          }}
        >
          <span className="action-icon">{'\u2665'}</span>
          <span className="action-label">Rest</span>
          <span className="action-cost">1 CP</span>
        </button>

        <button
          className="btn btn-action btn-end"
          onClick={() => dispatch({ type: 'ADVANCE_PHASE' })}
          disabled={!isActionPhase}
        >
          <span className="action-icon">{'\u25A0'}</span>
          <span className="action-label">End</span>
        </button>

        <button className="btn btn-action btn-save" onClick={onSave}>
          <span className="action-icon">{'\u2193'}</span>
          <span className="action-label">Save</span>
        </button>

        {(selectedUnit || actionMode !== 'select') && (
          <button
            className="btn btn-action"
            onClick={() => dispatch({ type: 'DESELECT' })}
          >
            <span className="action-icon">{'\u2715'}</span>
            <span className="action-label">Cancel</span>
          </button>
        )}
      </div>
      {!hasCP && isActionPhase && (
        <div className="action-no-cp">No CP remaining — End Phase to continue</div>
      )}
    </div>
  );
}
