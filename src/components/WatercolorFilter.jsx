import React from "react";

const WatercolorFilter = React.memo(function WatercolorFilter() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }}>
      <defs>
        <filter id="watercolorSoft">
          <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="3" seed="5" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
    </svg>
  );
});

export default WatercolorFilter;
