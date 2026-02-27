import { watercolorMix, isMuddy } from "../utils/watercolorMix.js";
import { hexToHsl } from "../utils/colorMath.js";
import { getColorName } from "../utils/colorNames.js";

export default function ThreeColorMix({ color1, color2, color3 }) {
  const mix12 = watercolorMix(color1, color2, 0.5);
  const mix23 = watercolorMix(color2, color3, 0.5);
  const mix13 = watercolorMix(color1, color3, 0.5);
  const centerMix = watercolorMix(mix12, color3, 0.33);
  const centerHsl = hexToHsl(centerMix);

  const pairs = [
    { a: color1, b: color2, mix: mix12, labelA: getColorName(color1).friendly, labelB: getColorName(color2).friendly },
    { a: color2, b: color3, mix: mix23, labelA: getColorName(color2).friendly, labelB: getColorName(color3).friendly },
    { a: color1, b: color3, mix: mix13, labelA: getColorName(color1).friendly, labelB: getColorName(color3).friendly },
  ];

  const anyMuddy = pairs.some(p => isMuddy(p.a, p.b));
  const overallMuddy = centerHsl.s < 18;

  const W = 440, H = 340;
  const top = { x: W / 2, y: 40 };
  const bl = { x: 60, y: H - 40 };
  const br = { x: W - 60, y: H - 40 };
  const midTL = { x: (top.x + bl.x) / 2, y: (top.y + bl.y) / 2 };
  const midTR = { x: (top.x + br.x) / 2, y: (top.y + br.y) / 2 };
  const midB = { x: (bl.x + br.x) / 2, y: (bl.y + br.y) / 2 };
  const center = { x: W / 2, y: (top.y + bl.y) / 2 + 20 };

  const renderArrow = (x1, y1, x2, y2, col, endOffset = 14) => {
    const dx = x2 - x1, dy = y2 - y1;
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len === 0) return null;
    const ux = dx / len, uy = dy / len;
    const sx = x1 + ux * 20, sy = y1 + uy * 20;
    const ex = x2 - ux * endOffset, ey = y2 - uy * endOffset;
    const sz = 7;
    return (
      <g>
        <line x1={sx} y1={sy} x2={ex} y2={ey} stroke={col || "#d4cec4"} strokeWidth="1.5" strokeDasharray="4 3" opacity="0.7" />
        <polygon points={`${ex},${ey} ${ex - ux * sz - uy * sz * 0.5},${ey - uy * sz + ux * sz * 0.5} ${ex - ux * sz + uy * sz * 0.5},${ey - uy * sz - ux * sz * 0.5}`} fill={col || "#d4cec4"} opacity="0.7" />
      </g>
    );
  };

  const renderSwatch = (cx, cy, r, col, label, sublabel) => (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={col} opacity="0.85" filter="url(#watercolorSoft)" />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f0ece6" strokeWidth="2" />
      {label && <text x={cx} y={cy + r + 18} textAnchor="middle" fontSize="14" fontWeight="600" fill="#5a534b" fontFamily="'EB Garamond', Georgia, serif">{label}</text>}
      {sublabel && <text x={cx} y={cy + r + 33} textAnchor="middle" fontSize="12" fill="#b0a89e" fontStyle="italic" fontFamily="'EB Garamond', Georgia, serif">{sublabel}</text>}
    </g>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <svg viewBox={`0 0 ${W} ${H + 40}`} width="100%" style={{ margin: "0 auto", display: "block" }}>
        {renderArrow(top.x, top.y, midTL.x, midTL.y, color1 + "88")}
        {renderArrow(bl.x, bl.y, midTL.x, midTL.y, color2 + "88")}
        {renderArrow(top.x, top.y, midTR.x, midTR.y, color1 + "88")}
        {renderArrow(br.x, br.y, midTR.x, midTR.y, color3 + "88")}
        {renderArrow(bl.x, bl.y, midB.x, midB.y, color2 + "88")}
        {renderArrow(br.x, br.y, midB.x, midB.y, color3 + "88")}
        {renderArrow(midTL.x, midTL.y, center.x, center.y, "#b0a89e", 20)}
        {renderArrow(midTR.x, midTR.y, center.x, center.y, "#b0a89e", 20)}
        {renderArrow(midB.x, midB.y, center.x, center.y, "#b0a89e", 20)}

        {renderSwatch(midTL.x, midTL.y, 11, mix12)}
        {renderSwatch(midTR.x, midTR.y, 11, mix13)}
        {renderSwatch(midB.x, midB.y, 11, mix23)}

        <circle cx={center.x} cy={center.y} r={18} fill={centerMix} opacity="0.9" filter="url(#watercolorSoft)" />
        <circle cx={center.x} cy={center.y} r={18} fill="none" stroke="#f0ece6" strokeWidth="2.5" />
        <text x={center.x} y={center.y + 34} textAnchor="middle" fontSize="13" fontWeight="600" fill="#7a7067" fontFamily="'EB Garamond', Georgia, serif">All three mixed</text>

        {renderSwatch(top.x, top.y, 16, color1, getColorName(color1).pigment, `"${getColorName(color1).friendly}"`)}
        {renderSwatch(bl.x, bl.y, 16, color2, getColorName(color2).pigment, `"${getColorName(color2).friendly}"`)}
        {renderSwatch(br.x, br.y, 16, color3, getColorName(color3).pigment, `"${getColorName(color3).friendly}"`)}
      </svg>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {pairs.map((pair, i) => (
          <div key={i}>
            <p style={{ fontSize: 11, color: "#b0a89e", margin: "0 0 6px 0", textAlign: "center" }}>
              {pair.labelA} + {pair.labelB}
            </p>
            <div style={{ display: "flex", gap: 2, justifyContent: "center", alignItems: "center" }}>
              {Array.from({ length: 5 }, (_, j) => watercolorMix(pair.a, pair.b, j / 4)).map((c, j) => (
                <div key={j} style={{
                  width: j === 0 || j === 4 ? 28 : 22,
                  height: j === 0 || j === 4 ? 28 : 22,
                  borderRadius: "50%",
                  background: `radial-gradient(circle at 35% 35%, ${c}, ${c}cc)`,
                  filter: "url(#watercolorSoft)",
                  border: j === 0 || j === 4 ? "1.5px solid #e8e2db" : "none",
                }} />
              ))}
              {isMuddy(pair.a, pair.b) && <span style={{ fontSize: 14, marginLeft: 6 }}>⚠️</span>}
            </div>
          </div>
        ))}
      </div>

      {(anyMuddy || overallMuddy) && (
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
            <strong>Muddy mix warning:</strong> {overallMuddy
              ? "Mixing all three creates a very dull result. Three-color mixes easily turn muddy — try using two of these and keeping the third separate as an accent."
              : "Some of these pairwise mixes may turn dull. Keep the muddy pairs in separate areas of your painting, or use more water to keep them transparent."
            }
          </div>
        </div>
      )}
    </div>
  );
}
