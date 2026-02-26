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
            <feFuncA type="linear" slope="0.05" />
          </feComponentTransfer>
        </filter>
        <filter id="stampNoise">
          <feTurbulence type="fractalNoise" baseFrequency="2" numOctaves="2" seed="99" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncR type="discrete" tableValues="0 1" />
            <feFuncG type="discrete" tableValues="0 1" />
            <feFuncB type="discrete" tableValues="0 1" />
            <feFuncA type="linear" slope="0.15" />
          </feComponentTransfer>
          <feComposite in="SourceGraphic" operator="atop" />
        </filter>
      </defs>
    </svg>
  );
}
