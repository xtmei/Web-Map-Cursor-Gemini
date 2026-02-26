import React from 'react';

interface Props {
  onStart: () => void;
  onLoad?: () => void;
}

/** Decorative mini map outline SVG — purely atmospheric */
function MapPreview() {
  return (
    <svg viewBox="0 0 100 65" width="110" height="72" style={{ opacity: 0.55 }} aria-hidden="true">
      {/* River (right side) */}
      <path d="M82 0 Q84 10 82 20 Q80 30 82 40 Q84 50 82 65" fill="none" stroke="#3a5888" strokeWidth="5" />
      {/* Bridge markers */}
      <circle cx="80" cy="12" r="3" fill="#6888a8" />
      <circle cx="80" cy="35" r="3" fill="#6888a8" />
      <circle cx="80" cy="55" r="3" fill="#6888a8" />
      {/* Industrial (top right) */}
      <rect x="54" y="2" width="20" height="12" fill="#6e5c50" rx="1" />
      {/* Hill (center-ish) */}
      <ellipse cx="44" cy="22" rx="10" ry="7" fill="#7ca858" />
      {/* City mass */}
      <rect x="28" y="15" width="42" height="32" fill="#9a7e70" rx="1" opacity="0.85" />
      {/* Open ground left */}
      <rect x="0" y="0" width="28" height="65" fill="#c8b870" rx="1" opacity="0.6" />
      {/* Road */}
      <path d="M8 5 L8 60" stroke="#b8a050" strokeWidth="2" strokeDasharray="4 3" />
      {/* VP stars */}
      <text x="56" y="11" fontSize="7" fill="#c8a020" fontWeight="bold">★</text>
      <text x="43" y="22" fontSize="7" fill="#c8a020" fontWeight="bold">★</text>
      {/* Simple hex grid lines */}
      <line x1="0" y1="20" x2="100" y2="20" stroke="rgba(90,70,30,0.15)" strokeWidth="0.4" />
      <line x1="0" y1="40" x2="100" y2="40" stroke="rgba(90,70,30,0.15)" strokeWidth="0.4" />
    </svg>
  );
}

export function TitleScreen({ onStart, onLoad }: Props) {
  return (
    <div className="screen-center">
      <div className="title-card title-card-military">
        <div className="title-corner title-corner-tl" />
        <div className="title-corner title-corner-tr" />
        <div className="title-corner title-corner-bl" />
        <div className="title-corner title-corner-br" />

        <div className="title-top-rule" />
        <div className="title-stars">★ ★ ★</div>
        <div className="title-top-rule" />

        <h1 className="title-heading">STALINGRAD</h1>
        <div className="title-subtitle">AUTUMN STORM</div>
        <div className="title-date-stamp">SEP 13 &bull; 1942</div>

        <div className="title-divider" />

        <div className="title-map-preview">
          <MapPreview />
        </div>

        <p className="title-desc">
          September 1942 &mdash; The fate of a city hangs in the balance.
          Command your forces through the ruins, factories, and riverbanks
          of history&apos;s most brutal urban battle.
        </p>

        <div className="title-buttons">
          <button className="btn btn-primary btn-campaign" onClick={onStart}>
            NEW CAMPAIGN
          </button>
          {onLoad && (
            <button className="btn btn-secondary" onClick={onLoad}>
              CONTINUE
            </button>
          )}
        </div>
        <div className="title-version">MVP+ &bull; OPERATION CONTROL &bull; 8 TURNS</div>
      </div>
    </div>
  );
}
