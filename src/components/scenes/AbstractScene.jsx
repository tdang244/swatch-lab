import React from "react";

const AbstractScene = React.memo(function AbstractScene({ bg, mid, fg, accent }) {
  return (
    <svg viewBox="0 0 500 350" width="100%">
      {/* Paper base */}
      <rect width="500" height="350" fill="#faf7f2" />
      {/* Large background washes */}
      <ellipse cx="150" cy="120" rx="180" ry="130" fill={bg} opacity="0.2" filter="url(#watercolorSoft)" />
      <ellipse cx="380" cy="230" rx="160" ry="140" fill={mid} opacity="0.2" filter="url(#watercolorSoft)" />
      {/* Mid-layer organic shapes */}
      <ellipse cx="200" cy="180" rx="100" ry="80" fill={mid} opacity="0.3" filter="url(#watercolorSoft)" />
      <ellipse cx="320" cy="140" rx="90" ry="70" fill={bg} opacity="0.25" filter="url(#watercolorSoft)" />
      <ellipse cx="280" cy="250" rx="110" ry="60" fill={fg} opacity="0.2" filter="url(#watercolorSoft)" />
      {/* Overlapping washes for depth */}
      <ellipse cx="240" cy="160" rx="70" ry="55" fill={accent} opacity="0.25" filter="url(#watercolorSoft)" />
      <ellipse cx="170" cy="240" rx="80" ry="50" fill={fg} opacity="0.3" filter="url(#watercolorSoft)" />
      <ellipse cx="360" cy="170" rx="60" ry="80" fill={accent} opacity="0.2" filter="url(#watercolorSoft)" />
      {/* Concentrated spots */}
      <circle cx="220" cy="150" r="25" fill={accent} opacity="0.4" filter="url(#watercolorSoft)" />
      <circle cx="310" cy="200" r="20" fill={fg} opacity="0.45" filter="url(#watercolorSoft)" />
      <circle cx="180" cy="210" r="15" fill={mid} opacity="0.5" filter="url(#watercolorSoft)" />
      <circle cx="350" cy="260" r="18" fill={bg} opacity="0.4" filter="url(#watercolorSoft)" />
      {/* Splatters / drips */}
      {[[120, 100, 4], [290, 90, 3], [400, 130, 5], [100, 280, 3], [420, 290, 4], [260, 300, 3], [340, 310, 2], [180, 310, 3]].map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill={[accent, fg, mid, bg][i % 4]} opacity={0.35 + (i % 3) * 0.1} />
      ))}
      {/* Flowing lines */}
      <path d="M80 140 Q150 110 220 140 Q290 170 360 140 Q400 125 440 145" fill="none" stroke={fg} strokeWidth="1.5" opacity="0.25" strokeLinecap="round" />
      <path d="M60 250 Q140 220 230 255 Q310 280 400 250 Q440 240 480 260" fill="none" stroke={accent} strokeWidth="1" opacity="0.2" strokeLinecap="round" />
      {/* Edge bloom effects */}
      <ellipse cx="30" cy="80" rx="50" ry="40" fill={bg} opacity="0.15" filter="url(#watercolorSoft)" />
      <ellipse cx="470" cy="60" rx="45" ry="35" fill={accent} opacity="0.12" filter="url(#watercolorSoft)" />
      <ellipse cx="60" cy="320" rx="60" ry="30" fill={mid} opacity="0.15" filter="url(#watercolorSoft)" />
    </svg>
  );
});

export default AbstractScene;
