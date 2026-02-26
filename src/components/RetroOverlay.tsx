import React from 'react';

interface Props {
  enabled: boolean;
  strength: number;
}

export function RetroOverlay({ enabled, strength }: Props) {
  if (!enabled) return null;

  const s = strength / 100;

  return (
    <>
      {/* Paper grain texture */}
      <div
        className="retro-paper"
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 9998,
          background: `
            radial-gradient(ellipse at 20% 50%, rgba(139,109,71,${0.05 * s}) 0%, transparent 70%),
            radial-gradient(ellipse at 80% 30%, rgba(160,130,80,${0.04 * s}) 0%, transparent 60%),
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 3px,
              rgba(120,100,60,${0.022 * s}) 3px,
              rgba(120,100,60,${0.022 * s}) 4px
            ),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 5px,
              rgba(100,80,50,${0.014 * s}) 5px,
              rgba(100,80,50,${0.014 * s}) 6px
            )
          `,
        }}
      />
      {/* Noise overlay */}
      <div
        className="retro-noise"
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 9998,
          filter: 'url(#paperNoise)',
          opacity: 0.65 * s,
        }}
      />
      {/* Paper folds / crease lines */}
      <div
        className="retro-folds"
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 9998,
          background: `
            linear-gradient(135deg, transparent 48%, rgba(80,60,30,${0.07 * s}) 49%, rgba(80,60,30,${0.07 * s}) 51%, transparent 52%),
            linear-gradient(45deg, transparent 45%, rgba(80,60,30,${0.045 * s}) 46%, rgba(80,60,30,${0.045 * s}) 54%, transparent 55%)
          `,
        }}
      />
      {/* Vignette (deepened) */}
      <div
        className="retro-vignette"
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 9998,
          background: `radial-gradient(ellipse at center, transparent 55%, rgba(30,22,10,${0.13 * s}) 100%)`,
        }}
      />
      {/* Inset print border feel */}
      <div
        className="retro-border"
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 9998,
          boxShadow: `inset 0 0 18px rgba(30,20,8,${0.10 * s})`,
        }}
      />
    </>
  );
}
