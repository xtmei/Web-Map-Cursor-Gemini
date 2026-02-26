import React from 'react';

export function SVGFilters() {
  return (
    <svg style={{ position: 'absolute', width: 0, height: 0 }} aria-hidden="true">
      <defs>
        <filter id="paperNoise">
          <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="4" seed="8" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.12" />
          </feComponentTransfer>
        </filter>

        <filter id="counterNoise">
          <feTurbulence type="fractalNoise" baseFrequency="1.2" numOctaves="2" seed="42" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.10" />
          </feComponentTransfer>
          <feComposite in="SourceGraphic" operator="over" />
        </filter>

        {/* Open ground — subtle grid map feel */}
        <pattern id="openPattern" width="8" height="8" patternUnits="userSpaceOnUse">
          <rect width="8" height="8" fill="transparent" />
          <line x1="0" y1="0" x2="8" y2="0" stroke="rgba(90,70,30,0.06)" strokeWidth="0.4" />
          <line x1="0" y1="0" x2="0" y2="8" stroke="rgba(90,70,30,0.06)" strokeWidth="0.4" />
        </pattern>

        {/* City ruins — irregular block shapes, more pronounced */}
        <pattern id="cityPattern" width="6" height="6" patternUnits="userSpaceOnUse">
          <rect width="6" height="6" fill="transparent" />
          <rect x="0.5" y="0.5" width="2.5" height="2.5" fill="none" stroke="rgba(60,40,30,0.32)" strokeWidth="0.5" />
          <rect x="3.5" y="3.5" width="2" height="2" fill="rgba(60,40,30,0.22)" />
          <rect x="3.5" y="0.5" width="1.5" height="1.5" fill="none" stroke="rgba(60,40,30,0.20)" strokeWidth="0.4" />
        </pattern>

        {/* Industrial — dense hatching with box outlines */}
        <pattern id="industrialPattern" width="8" height="8" patternUnits="userSpaceOnUse">
          <rect width="8" height="8" fill="transparent" />
          <line x1="0" y1="0" x2="8" y2="8" stroke="rgba(40,30,20,0.28)" strokeWidth="0.6" />
          <line x1="4" y1="0" x2="8" y2="4" stroke="rgba(40,30,20,0.22)" strokeWidth="0.5" />
          <line x1="0" y1="4" x2="4" y2="8" stroke="rgba(40,30,20,0.22)" strokeWidth="0.5" />
          <rect x="1.5" y="1.5" width="4" height="4" fill="none" stroke="rgba(40,30,20,0.28)" strokeWidth="0.5" />
        </pattern>

        {/* Hill — double arc contour lines */}
        <pattern id="hillPattern" width="12" height="10" patternUnits="userSpaceOnUse">
          <rect width="12" height="10" fill="transparent" />
          <path d="M1 9 Q6 2 11 9" fill="none" stroke="rgba(30,60,20,0.40)" strokeWidth="0.8" />
          <path d="M3 9 Q6 4.5 9 9" fill="none" stroke="rgba(30,60,20,0.28)" strokeWidth="0.5" />
        </pattern>

        {/* River — three wave lines */}
        <pattern id="riverPattern" width="10" height="8" patternUnits="userSpaceOnUse">
          <rect width="10" height="8" fill="transparent" />
          <path d="M0 2 Q2.5 0 5 2 Q7.5 4 10 2" fill="none" stroke="rgba(20,40,90,0.38)" strokeWidth="0.6" />
          <path d="M0 4.5 Q2.5 2.5 5 4.5 Q7.5 6.5 10 4.5" fill="none" stroke="rgba(20,40,90,0.28)" strokeWidth="0.5" />
          <path d="M0 7 Q2.5 5 5 7 Q7.5 9 10 7" fill="none" stroke="rgba(20,40,90,0.20)" strokeWidth="0.4" />
        </pattern>

        {/* Road — bold center dashes */}
        <pattern id="roadPattern" width="12" height="4" patternUnits="userSpaceOnUse">
          <rect width="12" height="4" fill="transparent" />
          <line x1="0" y1="2" x2="12" y2="2" stroke="rgba(80,55,15,0.40)" strokeWidth="1.2" strokeDasharray="4 2" />
        </pattern>
      </defs>
    </svg>
  );
}
