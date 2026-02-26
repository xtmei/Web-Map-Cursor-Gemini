import React from 'react';

interface Props {
  onStart: () => void;
  onLoad?: () => void;
}

export function TitleScreen({ onStart, onLoad }: Props) {
  return (
    <div className="screen-center">
      <div className="title-card">
        <div className="title-emblem">&#9733;</div>
        <h1 className="title-heading">STALINGRAD</h1>
        <div className="title-subtitle">AUTUMN STORM</div>
        <div className="title-divider" />
        <p className="title-desc">
          September 1942 &mdash; The fate of a city hangs in the balance.
          Command your forces through the ruins, factories, and riverbanks
          of history's most brutal urban battle.
        </p>
        <div className="title-buttons">
          <button className="btn btn-primary" onClick={onStart}>
            New Campaign
          </button>
          {onLoad && (
            <button className="btn btn-secondary" onClick={onLoad}>
              Continue
            </button>
          )}
        </div>
        <div className="title-version">MVP+ &bull; CP / Fog / Supply / Artillery / Events</div>
      </div>
    </div>
  );
}
