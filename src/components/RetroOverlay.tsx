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
      <div
        className="retro-paper"
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 9998,
          background: `
            radial-gradient(ellipse at 20% 50%, rgba(139,109,71,${0.04 * s}) 0%, transparent 70%),
            radial-gradient(ellipse at 80% 30%, rgba(160,130,80,${0.03 * s}) 0%, transparent 60%),
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 3px,
              rgba(120,100,60,${0.015 * s}) 3px,
              rgba(120,100,60,${0.015 * s}) 4px
            ),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 5px,
              rgba(100,80,50,${0.01 * s}) 5px,
              rgba(100,80,50,${0.01 * s}) 6px
            )
          `,
        }}
      />
      <div
        className="retro-noise"
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 9998,
          filter: 'url(#paperNoise)',
          opacity: 0.5 * s,
        }}
      />
      <div
        className="retro-folds"
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 9998,
          background: `
            linear-gradient(135deg, transparent 48%, rgba(80,60,30,${0.04 * s}) 49%, rgba(80,60,30,${0.04 * s}) 51%, transparent 52%),
            linear-gradient(45deg, transparent 45%, rgba(80,60,30,${0.025 * s}) 46%, rgba(80,60,30,${0.025 * s}) 54%, transparent 55%)
          `,
        }}
      />
      <div
        className="retro-vignette"
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 9998,
          background: `radial-gradient(ellipse at center, transparent 60%, rgba(40,30,15,${0.08 * s}) 100%)`,
        }}
      />
    </>
  );
}
