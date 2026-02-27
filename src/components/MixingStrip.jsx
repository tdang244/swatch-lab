import { watercolorMix, isMuddy } from "../utils/watercolorMix.js";
import { getColorName } from "../utils/colorNames.js";

export default function MixingStrip({ color1, color2 }) {
  const steps = 7;
  const mixed = Array.from({ length: steps }, (_, i) => watercolorMix(color1, color2, i / (steps - 1)));
  const muddy = isMuddy(color1, color2);
  const centerMix = watercolorMix(color1, color2, 0.5);

  const W = 380, H = 160;
  const left = { x: 65, y: 70 };
  const right = { x: W - 65, y: 70 };
  const center = { x: W / 2, y: 70 };

  const renderArrow = (x1, y1, x2, y2, col) => {
    const dx = x2 - x1, dy = y2 - y1;
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len === 0) return null;
    const ux = dx / len, uy = dy / len;
    const sx = x1 + ux * 28, sy = y1 + uy * 28;
    const ex = x2 - ux * 24, ey = y2 - uy * 24;
    const sz = 7;
    return (
      <g>
        <line x1={sx} y1={sy} x2={ex} y2={ey} stroke={col || "#d4cec4"} strokeWidth="1.5" strokeDasharray="4 3" opacity="0.7" />
        <polygon points={`${ex},${ey} ${ex - ux * sz - uy * sz * 0.5},${ey - uy * sz + ux * sz * 0.5} ${ex - ux * sz + uy * sz * 0.5},${ey - uy * sz - ux * sz * 0.5}`} fill={col || "#d4cec4"} opacity="0.7" />
      </g>
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ margin: "0 auto", display: "block", maxWidth: 420 }}>
        {renderArrow(left.x, left.y, center.x, center.y, color1 + "88")}
        {renderArrow(right.x, right.y, center.x, center.y, color2 + "88")}

        {/* Source color 1 */}
        <circle cx={left.x} cy={left.y} r={24} fill={color1} opacity="0.85" filter="url(#watercolorSoft)" />
        <circle cx={left.x} cy={left.y} r={24} fill="none" stroke="#f0ece6" strokeWidth="2" />
        <text x={left.x} y={left.y + 38} textAnchor="middle" fontSize="12" fontWeight="600" fill="#5a534b" fontFamily="'EB Garamond', Georgia, serif">{getColorName(color1).pigment}</text>
        <text x={left.x} y={left.y + 52} textAnchor="middle" fontSize="11" fill="#b0a89e" fontStyle="italic" fontFamily="'EB Garamond', Georgia, serif">&quot;{getColorName(color1).friendly}&quot;</text>

        {/* Source color 2 */}
        <circle cx={right.x} cy={right.y} r={24} fill={color2} opacity="0.85" filter="url(#watercolorSoft)" />
        <circle cx={right.x} cy={right.y} r={24} fill="none" stroke="#f0ece6" strokeWidth="2" />
        <text x={right.x} y={right.y + 38} textAnchor="middle" fontSize="12" fontWeight="600" fill="#5a534b" fontFamily="'EB Garamond', Georgia, serif">{getColorName(color2).pigment}</text>
        <text x={right.x} y={right.y + 52} textAnchor="middle" fontSize="11" fill="#b0a89e" fontStyle="italic" fontFamily="'EB Garamond', Georgia, serif">&quot;{getColorName(color2).friendly}&quot;</text>

        {/* Center mixed result */}
        <circle cx={center.x} cy={center.y} r={26} fill={centerMix} opacity="0.9" filter="url(#watercolorSoft)" />
        <circle cx={center.x} cy={center.y} r={26} fill="none" stroke="#f0ece6" strokeWidth="2.5" />
        <text x={center.x} y={center.y + 40} textAnchor="middle" fontSize="13" fontWeight="600" fill="#7a7067" fontFamily="'EB Garamond', Georgia, serif">Mixed</text>
      </svg>

      {/* Gradient strip */}
      <div style={{ display: "flex", gap: 3, alignItems: "center", justifyContent: "center" }}>
        {mixed.map((c, i) => (
          <div key={i} style={{
            width: i === 0 || i === steps - 1 ? 40 : 32,
            height: i === 0 || i === steps - 1 ? 40 : 32,
            borderRadius: "50%",
            background: `radial-gradient(circle at 35% 35%, ${c}, ${c}cc)`,
            filter: "url(#watercolorSoft)",
            border: i === 0 || i === steps - 1 ? "2px solid #e8e2db" : "none",
            transition: "all 0.4s ease",
          }} />
        ))}
      </div>

      {muddy && (
        <div style={{
          background: "linear-gradient(135deg, #fff3e0, #fff8f0)",
          border: "1px solid #f0c68a",
          borderRadius: 10,
          padding: "10px 14px",
          fontSize: 13,
          color: "#8b6914",
          lineHeight: 1.5,
          display: "flex",
          gap: 8,
          alignItems: "flex-start",
        }}>
          <span style={{ fontSize: 18, flexShrink: 0, marginTop: -1 }}>⚠️</span>
          <div>
            <strong>Muddy mix warning:</strong> These two colors may turn dull or grey-brown when blended directly on paper. Try placing them next to each other instead of mixing, or add more water to keep the mix transparent.
          </div>
        </div>
      )}
    </div>
  );
}
