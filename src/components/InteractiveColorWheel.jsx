import { useState, useMemo } from "react";
import { hexToHsl, hslToHex } from "../utils/colorMath.js";
import { getColorName } from "../utils/colorNames.js";
import { WATERCOLOR_PIGMENTS } from "../constants/pigments.js";
import { pillButton } from "../constants/styles.js";
import { COLOR_THEORIES } from "../constants/colorTheories.js";
import ExplainCard from "./ExplainCard.jsx";

// Check if a hex is an exact known pigment
function isExactPigment(hex) {
  return WATERCOLOR_PIGMENTS.some(p => p.hex.toLowerCase() === hex.toLowerCase());
}

export default function InteractiveColorWheel({ themeColor, onColorChange, isMobile }) {
  const [activeTheory, setActiveTheory] = useState("complementary");
  const { h: anchorHue, s: anchorSat, l: anchorLit } = hexToHsl(themeColor);
  const theory = COLOR_THEORIES.find(t => t.id === activeTheory);

  const CX = 200, CY = 200, R = 150, INNER_R = 85;
  const WHEEL_STEPS = 120;

  const theoryColors = useMemo(() => {
    if (activeTheory === "warmcool") return [];
    return theory.offsets.map(offset => {
      const isAnchor = offset === 0;
      const hue = (anchorHue + offset + 360) % 360;
      // Use the exact themeColor for the anchor (offset 0) to avoid shade drift from HSL round-trip
      const hex = isAnchor ? themeColor : hslToHex(hue, Math.max(anchorSat, 50), Math.max(Math.min(anchorLit, 60), 40));
      return { hue: isAnchor ? anchorHue : hue, hex, isAnchor };
    });
  }, [activeTheory, anchorHue, anchorSat, anchorLit, theory, themeColor]);

  const hueToXY = (hue, radius = R) => {
    const angle = (hue - 90) * Math.PI / 180;
    return { x: CX + Math.cos(angle) * radius, y: CY + Math.sin(angle) * radius };
  };

  const handleWheelInteraction = (e) => {
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const x = (clientX - rect.left) / rect.width * 400 - CX;
    const y = (clientY - rect.top) / rect.height * 410 - CY;
    const dist = Math.sqrt(x * x + y * y);
    if (dist < INNER_R - 10 || dist > R + 10) return;
    if (e.touches) e.preventDefault();
    let hue = Math.atan2(y, x) * 180 / Math.PI + 90;
    if (hue < 0) hue += 360;
    onColorChange(hslToHex(hue, Math.max(anchorSat, 50), Math.max(Math.min(anchorLit, 60), 40)));
  };

  const renderHueMarker = (hue, size = 12, strokeW = 3, shadow = true, color) => {
    const midR = (R + INNER_R) / 2;
    const pos = hueToXY(hue, midR);
    const fill = color || hslToHex(hue, 70, 50);
    return (
      <g>
        {shadow && <circle cx={pos.x} cy={pos.y} r={size + 2} fill="none" stroke="#00000020" strokeWidth={1} />}
        <circle cx={pos.x} cy={pos.y} r={size} fill={fill} stroke="#fff" strokeWidth={strokeW} />
      </g>
    );
  };

  const renderHueConnection = (hue1, hue2) => {
    const midR = (R + INNER_R) / 2;
    const p1 = hueToXY(hue1, midR);
    const p2 = hueToXY(hue2, midR);
    return (
      <line
        x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
        stroke="#fff" strokeWidth="2" opacity="0.8"
      />
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Theory selector buttons */}
      <div className="wcl-scroll" style={{
        display: "flex", gap: 6, justifyContent: isMobile ? "flex-start" : "center",
        overflowX: isMobile ? "auto" : "visible",
        WebkitOverflowScrolling: "touch",
        scrollbarWidth: "none",
        paddingBottom: isMobile ? 4 : 0,
      }}>
        {COLOR_THEORIES.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTheory(t.id)}
            role="tab"
            aria-selected={activeTheory === t.id}
            style={{
              ...pillButton(activeTheory === t.id, themeColor),
              padding: isMobile ? "9px 14px" : "7px 14px",
              flex: isMobile ? "0 0 auto" : undefined,
              background: activeTheory === t.id ? `${themeColor}15` : "#fefcfa",
              gap: 5,
            }}
          >
            <span style={{ fontSize: 13 }}>{t.icon}</span>
            {t.name}
          </button>
        ))}
      </div>

      <ExplainCard key={activeTheory} explain={theory.explain} accentColor={themeColor} />

      {/* SVG Color Wheel */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <svg
          viewBox="0 0 400 410"
          width="100%"
          style={{ maxWidth: isMobile ? "100%" : 340, cursor: "crosshair", touchAction: "none" }}
          onClick={handleWheelInteraction}
          onTouchStart={handleWheelInteraction}
        >
          {/* Wheel ring */}
          {Array.from({ length: WHEEL_STEPS }, (_, i) => {
            const deg = (i / WHEEL_STEPS) * 360;
            const step = 360 / WHEEL_STEPS;
            const a1 = (deg - 90) * Math.PI / 180;
            const a2 = (deg + step - 90) * Math.PI / 180;
            return (
              <path
                key={i}
                d={`M ${CX + Math.cos(a1) * INNER_R} ${CY + Math.sin(a1) * INNER_R}
                    L ${CX + Math.cos(a1) * R} ${CY + Math.sin(a1) * R}
                    A ${R} ${R} 0 0 1 ${CX + Math.cos(a2) * R} ${CY + Math.sin(a2) * R}
                    L ${CX + Math.cos(a2) * INNER_R} ${CY + Math.sin(a2) * INNER_R}
                    A ${INNER_R} ${INNER_R} 0 0 0 ${CX + Math.cos(a1) * INNER_R} ${CY + Math.sin(a1) * INNER_R}
                    Z`}
                fill={hslToHex(deg, 75, 55)}
              />
            );
          })}

          {/* Inner circle (paper color) */}
          <circle cx={CX} cy={CY} r={INNER_R - 1} fill="#f8f4ef" />

          {/* Warm/Cool overlay */}
          {activeTheory === "warmcool" && (() => {
            const warmStart = (330 - 90) * Math.PI / 180;
            const warmEnd = (150 - 90) * Math.PI / 180;
            const coolStart = warmEnd;
            const coolEnd = warmStart;
            return (
              <>
                <path
                  d={`M ${CX} ${CY}
                      L ${CX + R * Math.cos(warmStart)} ${CY + R * Math.sin(warmStart)}
                      A ${R} ${R} 0 1 1 ${CX + R * Math.cos(warmEnd)} ${CY + R * Math.sin(warmEnd)}
                      Z`}
                  fill="#ff880012" stroke="#e8943070" strokeWidth="2" strokeDasharray="8 4"
                />
                <path
                  d={`M ${CX} ${CY}
                      L ${CX + R * Math.cos(coolStart)} ${CY + R * Math.sin(coolStart)}
                      A ${R} ${R} 0 1 1 ${CX + R * Math.cos(coolEnd)} ${CY + R * Math.sin(coolEnd)}
                      Z`}
                  fill="#4488ff10" stroke="#4488ff30" strokeWidth="2" strokeDasharray="8 4"
                />
                <line
                  x1={CX + (R + 8) * Math.cos(warmStart)} y1={CY + (R + 8) * Math.sin(warmStart)}
                  x2={CX + (R + 8) * Math.cos(warmEnd)} y2={CY + (R + 8) * Math.sin(warmEnd)}
                  stroke="#d4cec4" strokeWidth="1" strokeDasharray="4 3" opacity="0.6"
                />
                <text x={CX} y={CY - 52} textAnchor="middle" fontSize="13" fill="#c47a20" fontWeight="600" fontFamily="'EB Garamond', Georgia, serif">☀️ Warm</text>
                <text x={CX} y={CY - 38} textAnchor="middle" fontSize="10" fill="#c47a2099" fontFamily="'EB Garamond', Georgia, serif">advances, energetic</text>
                <text x={CX} y={CY + 58} textAnchor="middle" fontSize="13" fill="#4a7fb5" fontWeight="600" fontFamily="'EB Garamond', Georgia, serif">❄️ Cool</text>
                <text x={CX} y={CY + 72} textAnchor="middle" fontSize="10" fill="#4a7fb599" fontFamily="'EB Garamond', Georgia, serif">recedes, calming</text>
              </>
            );
          })()}

          {/* Theory connections */}
          {activeTheory !== "warmcool" && theoryColors.length > 1 && (
            <>
              {theoryColors.map((c, i) => {
                const next = theoryColors[(i + 1) % theoryColors.length];
                return <g key={i}>{renderHueConnection(c.hue, next.hue)}</g>;
              })}
              {theoryColors.length >= 3 && (
                <polygon
                  points={theoryColors.map(c => {
                    const midR2 = (R + INNER_R) / 2;
                    const p = hueToXY(c.hue, midR2);
                    return `${p.x},${p.y}`;
                  }).join(" ")}
                  fill="#ffffff20"
                  stroke="#fff"
                  strokeWidth="1.5"
                  opacity="0.5"
                />
              )}
            </>
          )}

          {/* Theory color markers */}
          {theoryColors.map((c, i) => (
            <g key={i}>{renderHueMarker(c.hue, c.isAnchor ? 14 : 11, c.isAnchor ? 3.5 : 2.5, true, c.hex)}</g>
          ))}

          {/* Anchor indicator in center */}
          <circle cx={CX} cy={CY} r={28} fill={themeColor} opacity="0.9" filter="url(#watercolorSoft)" />
          <circle cx={CX} cy={CY} r={28} fill="none" stroke="#fff" strokeWidth="2" opacity="0.6" />
          <text x={CX} y={CY - 4} textAnchor="middle" fontSize="8" fill="#fff" opacity="0.9" fontFamily="monospace" fontWeight="600">
            ANCHOR
          </text>
          <text x={CX} y={CY + 8} textAnchor="middle" fontSize="9" fill="#fff" opacity="0.8" fontFamily="'EB Garamond', Georgia, serif">
            {getColorName(themeColor).friendly}
          </text>

          {/* Tap hint */}
          <text x={CX} y={395} textAnchor="middle" fontSize="11" fill="#c4bcb2" fontStyle="italic" fontFamily="'EB Garamond', Georgia, serif">
            Tap anywhere on the wheel to move your anchor color
          </text>
        </svg>
      </div>

      {/* Result swatches */}
      {activeTheory !== "warmcool" && (
        <div style={{
          background: "#fefcfa",
          border: "1px solid #ebe5dd",
          borderRadius: 14,
          padding: "16px 20px",
        }}>
          <p style={{ margin: "0 0 12px 0", fontSize: 12, color: "#9a9189", textAlign: "center", fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>
            {theory.name} palette
          </p>
          <div style={{ display: "flex", gap: isMobile ? 12 : 16, justifyContent: "center", flexWrap: "wrap" }}>
            {theoryColors.map((c, i) => (
              <div key={c.hex} style={{ textAlign: "center", minWidth: isMobile ? 60 : "auto" }}>
                <div style={{
                  width: isMobile ? 44 : 52, height: isMobile ? 44 : 52, borderRadius: "50%",
                  background: `radial-gradient(circle at 35% 35%, ${c.hex}, ${c.hex}cc)`,
                  filter: "url(#watercolorSoft)",
                  border: c.isAnchor ? `3px solid ${c.hex}80` : "2px solid #f0ece6",
                  boxShadow: `0 3px 12px ${c.hex}30`,
                  margin: "0 auto 6px",
                }} />
                <div style={{ fontSize: 12, color: "#5a534b", fontWeight: 600 }}>
                  {!isExactPigment(c.hex) && <span style={{ fontSize: 10, color: "#b0a89e", fontWeight: 400 }}>Near </span>}
                  {getColorName(c.hex).pigment}
                </div>
                <div style={{ fontSize: 11, color: "#b0a89e", fontStyle: "italic" }}>
                  "{getColorName(c.hex).friendly}"
                </div>
                {c.isAnchor && (
                  <div style={{ fontSize: 9, color: themeColor, fontWeight: 600, marginTop: 2, textTransform: "uppercase", letterSpacing: 0.5 }}>
                    anchor
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
