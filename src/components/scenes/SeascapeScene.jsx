import React from "react";

const SeascapeScene = React.memo(function SeascapeScene({ bg, mid, fg, accent }) {
  return (
    <svg viewBox="0 0 500 350" width="100%">
      {/* Sky gradient */}
      <rect width="500" height="170" fill={bg} opacity="0.25" />
      <rect width="500" height="100" fill={accent} opacity="0.08" />
      {/* Clouds */}
      {[[80, 50, 60], [250, 35, 50], [400, 55, 45]].map(([x, y, r], i) => (
        <g key={i}>
          <ellipse cx={x} cy={y} rx={r} ry={r * 0.4} fill="#fff" opacity="0.5" filter="url(#watercolorSoft)" />
          <ellipse cx={x + r * 0.4} cy={y - r * 0.15} rx={r * 0.6} ry={r * 0.3} fill="#fff" opacity="0.35" filter="url(#watercolorSoft)" />
        </g>
      ))}
      {/* Sun glow */}
      <circle cx="420" cy="80" r="50" fill={accent} opacity="0.15" filter="url(#watercolorSoft)" />
      <circle cx="420" cy="80" r="25" fill={accent} opacity="0.35" filter="url(#watercolorSoft)" />
      {/* Horizon line */}
      <line x1="0" y1="170" x2="500" y2="170" stroke={mid} strokeWidth="0.5" opacity="0.3" />
      {/* Ocean body */}
      <rect x="0" y="170" width="500" height="180" fill={mid} opacity="0.35" />
      <rect x="0" y="200" width="500" height="150" fill={mid} opacity="0.15" />
      {/* Waves */}
      {[185, 210, 235, 258, 278, 298, 315].map((y, i) => (
        <path key={i}
          d={`M0 ${y} Q${60 + i * 10} ${y - 4 - i} ${125 + i * 5} ${y + 2} Q${200 + i * 8} ${y - 3} ${280 - i * 3} ${y + 1} Q${360 + i * 5} ${y - 5 + i} ${430} ${y + 2} Q${470} ${y - 2} 500 ${y + 1}`}
          fill="none" stroke={i < 3 ? bg : fg} strokeWidth={0.8 + i * 0.1} opacity={0.15 + i * 0.03} strokeLinecap="round"
        />
      ))}
      {/* Distant sailboat */}
      <polygon points="320,140 320,162 335,155" fill="#fff" opacity="0.6" />
      <line x1="320" y1="138" x2="320" y2="168" stroke={fg} strokeWidth="1" opacity="0.4" />
      <ellipse cx="322" cy="168" rx="12" ry="3" fill={fg} opacity="0.3" />
      {/* Rocks in foreground */}
      <ellipse cx="60" cy="340" rx="55" ry="30" fill={fg} opacity="0.5" filter="url(#watercolorSoft)" />
      <ellipse cx="40" cy="335" rx="30" ry="22" fill={fg} opacity="0.35" filter="url(#watercolorSoft)" />
      <ellipse cx="475" cy="345" rx="40" ry="25" fill={fg} opacity="0.4" filter="url(#watercolorSoft)" />
      {/* Foam on rocks */}
      <path d="M20 320 Q40 315 60 318 Q80 312 100 320" fill="none" stroke="#fff" strokeWidth="1.5" opacity="0.4" strokeLinecap="round" />
      {/* Sun reflection on water */}
      {[195, 220, 248].map((y, i) => (
        <line key={i} x1={400 - i * 15} y1={y} x2={440 + i * 10} y2={y} stroke={accent} strokeWidth={2 - i * 0.5} opacity={0.25 - i * 0.06} strokeDasharray="8 6" />
      ))}
    </svg>
  );
});

export default SeascapeScene;
