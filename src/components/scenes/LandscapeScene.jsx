import React from "react";

const LandscapeScene = React.memo(function LandscapeScene({ bg, mid, fg, accent }) {
  return (
    <svg viewBox="0 0 500 350" width="100%">
      {/* Sky */}
      <rect width="500" height="350" fill={bg} opacity="0.3" />
      <rect width="500" height="200" fill={bg} opacity="0.15" />
      {/* Sun/moon */}
      <circle cx="390" cy="70" r="30" fill={accent} opacity="0.5" filter="url(#watercolorSoft)" />
      <circle cx="390" cy="70" r="22" fill={accent} opacity="0.3" />
      {/* Distant mountains */}
      <path d="M0 200 Q60 120 130 170 Q180 130 250 160 Q320 110 380 155 Q430 125 500 170 L500 220 L0 220Z" fill={mid} opacity="0.3" filter="url(#watercolorSoft)" />
      {/* Closer mountains */}
      <path d="M0 220 Q80 150 160 195 Q220 160 300 190 Q370 145 440 180 Q475 165 500 185 L500 250 L0 250Z" fill={mid} opacity="0.5" filter="url(#watercolorSoft)" />
      {/* Hills/tree line */}
      <path d="M0 250 Q40 225 80 240 Q130 215 180 235 Q240 210 300 232 Q350 218 400 230 Q450 215 500 235 L500 270 L0 270Z" fill={fg} opacity="0.5" filter="url(#watercolorSoft)" />
      {/* Trees as organic blobs */}
      {[60, 130, 210, 280, 370, 440].map((x, i) => (
        <ellipse key={i} cx={x} cy={245 - (i % 3) * 8} rx={18 + (i % 2) * 8} ry={22 + (i % 3) * 5} fill={fg} opacity={0.5 + (i % 2) * 0.15} filter="url(#watercolorSoft)" />
      ))}
      {/* Water/field */}
      <rect x="0" y="268" width="500" height="82" fill={mid} opacity="0.2" />
      <path d="M0 280 Q60 275 120 282 Q200 270 280 278 Q360 272 440 280 Q475 275 500 278 L500 350 L0 350Z" fill={bg} opacity="0.2" filter="url(#watercolorSoft)" />
      {/* Water reflections */}
      <line x1="40" y1="295" x2="100" y2="295" stroke={accent} strokeWidth="1.5" opacity="0.3" strokeDasharray="8 6" />
      <line x1="200" y1="310" x2="280" y2="310" stroke={mid} strokeWidth="1" opacity="0.25" strokeDasharray="12 8" />
      <line x1="340" y1="300" x2="420" y2="300" stroke={accent} strokeWidth="1" opacity="0.2" strokeDasharray="6 8" />
      {/* Foreground grasses */}
      {[20, 50, 90, 140, 180, 250, 310, 380, 420, 465].map((x, i) => (
        <line key={i} x1={x} y1="350" x2={x + (i % 2 ? 5 : -5)} y2={328 - (i % 3) * 6} stroke={fg} strokeWidth="1.5" opacity="0.4" strokeLinecap="round" />
      ))}
    </svg>
  );
});

export default LandscapeScene;
