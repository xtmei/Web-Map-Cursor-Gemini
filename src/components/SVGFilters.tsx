import React from 'react';

export function SVGFilters() {
  return (
    <svg style={{ position: 'absolute', width: 0, height: 0 }} aria-hidden="true">
      <defs>
        <filter id="paperNoise">
          <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="4" seed="8" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.08" />
          </feComponentTransfer>
        </filter>

        <filter id="counterNoise">
          <feTurbulence type="fractalNoise" baseFrequency="1.2" numOctaves="2" seed="42" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.06" />
          </feComponentTransfer>
          <feComposite in="SourceGraphic" operator="over" />
        </filter>

        <pattern id="cityPattern" width="6" height="6" patternUnits="userSpaceOnUse">
          <rect width="6" height="6" fill="transparent" />
          <rect x="1" y="1" width="2" height="2" fill="rgba(60,50,40,0.12)" />
          <rect x="4" y="4" width="1.5" height="1.5" fill="rgba(60,50,40,0.08)" />
        </pattern>

        <pattern id="industrialPattern" width="8" height="8" patternUnits="userSpaceOnUse">
          <rect width="8" height="8" fill="transparent" />
          <line x1="0" y1="0" x2="8" y2="8" stroke="rgba(50,40,30,0.1)" strokeWidth="0.5" />
          <line x1="4" y1="0" x2="8" y2="4" stroke="rgba(50,40,30,0.08)" strokeWidth="0.5" />
          <line x1="0" y1="4" x2="4" y2="8" stroke="rgba(50,40,30,0.08)" strokeWidth="0.5" />
          <rect x="2" y="2" width="3" height="3" fill="none" stroke="rgba(50,40,30,0.1)" strokeWidth="0.4" />
        </pattern>

        <pattern id="hillPattern" width="10" height="10" patternUnits="userSpaceOnUse">
          <rect width="10" height="10" fill="transparent" />
          <path d="M2 8 Q5 3 8 8" fill="none" stroke="rgba(40,60,30,0.15)" strokeWidth="0.6" />
        </pattern>

        <pattern id="riverPattern" width="8" height="8" patternUnits="userSpaceOnUse">
          <rect width="8" height="8" fill="transparent" />
          <path d="M0 4 Q2 2 4 4 Q6 6 8 4" fill="none" stroke="rgba(30,50,80,0.12)" strokeWidth="0.5" />
        </pattern>

        <pattern id="roadPattern" width="12" height="4" patternUnits="userSpaceOnUse">
          <rect width="12" height="4" fill="transparent" />
          <line x1="0" y1="2" x2="12" y2="2" stroke="rgba(80,60,30,0.15)" strokeWidth="1" strokeDasharray="3 2" />
        </pattern>
      </defs>
    </svg>
  );
}
