import React, { useReducer, useEffect, useState, useCallback } from 'react';
import {
  GameState, GameAction, Faction, Unit, UnitData, HexData, TerrainId, TerrainType,
  Scenario, EventCard, GamePhase,
} from './types';
import { createInitialState, gameReducer } from './engine/game';
import { HexMap } from './components/HexMap';
import { TopBar } from './components/TopBar';
import { BottomSheet } from './components/BottomSheet';
import { ActionBar } from './components/ActionBar';
import { RetroOverlay } from './components/RetroOverlay';
import { TitleScreen } from './components/TitleScreen';
import { FactionSelect } from './components/FactionSelect';
import { PassDevice } from './components/PassDevice';
import { VictoryScreen } from './components/VictoryScreen';
import { SettingsPanel } from './components/SettingsPanel';
import { EventBanner } from './components/EventBanner';
import { LogPanel } from './components/LogPanel';
import { SVGFilters } from './components/SVGFilters';
import './styles.css';

import scenarioData from '../data/scenarios/stalingrad_mvp_plus/scenario.json';
import terrainData from '../data/scenarios/stalingrad_mvp_plus/terrain.json';
import axisUnitsData from '../data/scenarios/stalingrad_mvp_plus/units_axis.json';
import sovietUnitsData from '../data/scenarios/stalingrad_mvp_plus/units_soviet.json';
import eventsData from '../data/scenarios/stalingrad_mvp_plus/events.json';

function prepareUnits(data: UnitData[]): Unit[] {
  return data.map((u) => ({
    ...u,
    col: u.startCol,
    row: u.startRow,
    mpRemaining: u.movement,
    disrupted: false,
    activated: false,
    supplied: true,
  }));
}

const SAVE_KEY = 'stalingrad_save';

function saveGame(state: GameState) {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  } catch {}
}

function loadGame(): GameState | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) return JSON.parse(raw) as GameState;
  } catch {}
  return null;
}

function clearSave() {
  localStorage.removeItem(SAVE_KEY);
}

export function App() {
  const [gamePhase, setGamePhase] = useState<'title' | 'setup' | 'game'>('title');
  const [gameState, dispatch] = useReducer(gameReducer, null as unknown as GameState);
  const [showSettings, setShowSettings] = useState(false);
  const [showLog, setShowLog] = useState(false);
  const [hasSave, setHasSave] = useState(false);

  useEffect(() => {
    setHasSave(!!localStorage.getItem(SAVE_KEY));
  }, []);

  const startNewGame = useCallback((faction: Faction) => {
    const scenario = scenarioData as Scenario;
    const terrainTypes = terrainData.terrainTypes as Record<TerrainId, TerrainType>;
    const hexes = terrainData.hexes as HexData[];
    const axisUnits = prepareUnits(axisUnitsData as UnitData[]);
    const sovietUnits = prepareUnits(sovietUnitsData as UnitData[]);
    const events = eventsData as EventCard[];

    const initial = createInitialState(scenario, terrainTypes, hexes, axisUnits, sovietUnits, events, faction);
    dispatch({ type: 'LOAD_STATE', state: initial });
    setGamePhase('game');

    setTimeout(() => dispatch({ type: 'ADVANCE_PHASE' }), 100);
  }, []);

  const handleLoadGame = useCallback(() => {
    const saved = loadGame();
    if (saved) {
      dispatch({ type: 'LOAD_STATE', state: saved });
      setGamePhase('game');
    }
  }, []);

  const handleSave = useCallback(() => {
    if (gameState) {
      saveGame(gameState);
      setHasSave(true);
    }
  }, [gameState]);

  useEffect(() => {
    if (gameState && gameState.phase === 'playing') {
      saveGame(gameState);
    }
  }, [gameState]);

  if (gamePhase === 'title') {
    return (
      <>
        <SVGFilters />
        <RetroOverlay enabled={true} strength={75} />
        <TitleScreen
          onStart={() => setGamePhase('setup')}
          onLoad={hasSave ? handleLoadGame : undefined}
        />
      </>
    );
  }

  if (gamePhase === 'setup') {
    return (
      <>
        <SVGFilters />
        <RetroOverlay enabled={true} strength={75} />
        <FactionSelect onSelect={startNewGame} />
      </>
    );
  }

  if (!gameState) return null;

  if (gameState.phase === 'passDevice') {
    return (
      <>
        <SVGFilters />
        <RetroOverlay
          enabled={gameState.settings.retroEffects}
          strength={gameState.settings.effectsStrength}
        />
        <PassDevice
          faction={gameState.activeFaction}
          factionName={gameState.scenario.factionNames[gameState.activeFaction]}
          turn={gameState.turn}
          onReady={() => {
            dispatch({ type: 'ACKNOWLEDGE_PASS' });
            dispatch({ type: 'ADVANCE_PHASE' });
          }}
        />
      </>
    );
  }

  if (gameState.phase === 'victory') {
    return (
      <>
        <SVGFilters />
        <RetroOverlay
          enabled={gameState.settings.retroEffects}
          strength={gameState.settings.effectsStrength}
        />
        <VictoryScreen
          winner={gameState.winner}
          vp={gameState.vp}
          factionNames={gameState.scenario.factionNames}
          log={gameState.log}
          onRestart={() => {
            clearSave();
            setGamePhase('title');
          }}
        />
      </>
    );
  }

  const selectedUnit = gameState.selectedUnitId
    ? gameState.units.find((u) => u.id === gameState.selectedUnitId) || null
    : null;

  return (
    <div className="game-container">
      <SVGFilters />
      <RetroOverlay
        enabled={gameState.settings.retroEffects}
        strength={gameState.settings.effectsStrength}
      />

      <TopBar
        turn={gameState.turn}
        maxTurn={gameState.scenario.maxTurn}
        faction={gameState.activeFaction}
        factionName={gameState.scenario.factionNames[gameState.activeFaction]}
        phase={gameState.turnPhase}
        cp={gameState.cp[gameState.activeFaction]}
        vp={gameState.vp}
        artilleryPoints={gameState.artilleryPoints[gameState.activeFaction]}
        onSettings={() => setShowSettings(true)}
        onLog={() => setShowLog(true)}
      />

      {gameState.currentEvent && gameState.turnPhase !== 'upkeep' && (
        <EventBanner event={gameState.currentEvent} />
      )}

      <HexMap
        state={gameState}
        dispatch={dispatch}
      />

      <ActionBar
        state={gameState}
        dispatch={dispatch}
        selectedUnit={selectedUnit}
        onSave={handleSave}
      />

      <BottomSheet
        selectedUnit={selectedUnit}
        state={gameState}
      />

      {showSettings && (
        <SettingsPanel
          settings={gameState.settings}
          dispatch={dispatch}
          onClose={() => setShowSettings(false)}
        />
      )}

      {showLog && (
        <LogPanel
          log={gameState.log}
          onClose={() => setShowLog(false)}
        />
      )}
    </div>
  );
}
