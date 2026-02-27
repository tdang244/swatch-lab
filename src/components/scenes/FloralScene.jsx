import React from "react";

const FloralScene = React.memo(function FloralScene({ bg, mid, fg, accent }) {
  const renderPetal = (cx, cy, r, angle, color, op = 0.6) => {
    const rad = angle * Math.PI / 180;
    const px = cx + Math.cos(rad) * r * 0.9;
    const py = cy + Math.sin(rad) * r * 0.9;
    return <ellipse cx={px} cy={py} rx={r * 0.55} ry={r * 0.35} fill={color} opacity={op} transform={`rotate(${angle} ${px} ${py})`} filter="url(#watercolorSoft)" />;
  };

  const renderFlower = (cx, cy, size, color, centerColor) => (
    <g>
      {[0, 60, 120, 180, 240, 300].map((a, i) => (
        <g key={i}>{renderPetal(cx, cy, size, a + 15, color, 0.45 + (i % 2) * 0.15)}</g>
      ))}
      <circle cx={cx} cy={cy} r={size * 0.22} fill={centerColor} opacity="0.7" filter="url(#watercolorSoft)" />
    </g>
  );

  return (
    <svg viewBox="0 0 500 350" width="100%">
      {/* Background wash */}
      <rect width="500" height="350" fill={bg} opacity="0.15" />
      <ellipse cx="250" cy="175" rx="280" ry="200" fill={bg} opacity="0.1" filter="url(#watercolorSoft)" />
      {/* Table/surface */}
      <path d="M50 260 Q250 245 450 260 L480 350 L20 350Z" fill={mid} opacity="0.15" />
      {/* Vase */}
      <path d="M210 260 Q200 210 215 180 Q225 165 250 160 Q275 165 285 180 Q300 210 290 260Z" fill={mid} opacity="0.4" filter="url(#watercolorSoft)" />
      <path d="M215 260 Q205 215 218 185 Q228 172 250 168 Q272 172 282 185 Q295 215 285 260Z" fill={mid} opacity="0.2" />
      {/* Stems */}
      <line x1="240" y1="165" x2="200" y2="80" stroke={fg} strokeWidth="2" opacity="0.4" strokeLinecap="round" />
      <line x1="250" y1="162" x2="260" y2="60" stroke={fg} strokeWidth="2" opacity="0.35" strokeLinecap="round" />
      <line x1="258" y1="165" x2="310" y2="90" stroke={fg} strokeWidth="2" opacity="0.4" strokeLinecap="round" />
      <line x1="245" y1="163" x2="170" y2="110" stroke={fg} strokeWidth="1.5" opacity="0.3" strokeLinecap="round" />
      <line x1="255" y1="163" x2="330" y2="120" stroke={fg} strokeWidth="1.5" opacity="0.3" strokeLinecap="round" />
      {/* Flowers */}
      {renderFlower(200, 80, 32, accent, fg)}
      {renderFlower(260, 58, 36, fg, accent)}
      {renderFlower(310, 88, 30, accent, mid)}
      {renderFlower(170, 110, 26, mid, accent)}
      {renderFlower(330, 118, 24, fg, accent)}
      {/* Leaves */}
      {[[215, 130, -30], [280, 125, 25], [185, 100, -50], [300, 105, 40], [240, 115, 10]].map(([x, y, a], i) => (
        <ellipse key={i} cx={x} cy={y} rx="18" ry="8" fill={fg} opacity={0.35 + (i % 2) * 0.1} transform={`rotate(${a} ${x} ${y})`} filter="url(#watercolorSoft)" />
      ))}
      {/* Scattered petals on table */}
      <ellipse cx="150" cy="290" rx="8" ry="5" fill={accent} opacity="0.3" transform="rotate(-20 150 290)" filter="url(#watercolorSoft)" />
      <ellipse cx="350" cy="280" rx="6" ry="4" fill={fg} opacity="0.25" transform="rotate(15 350 280)" filter="url(#watercolorSoft)" />
    </svg>
  );
});

export default FloralScene;
