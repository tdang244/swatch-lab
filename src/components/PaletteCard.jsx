import { watercolorMix } from "../utils/watercolorMix.js";
import { getColorName } from "../utils/colorNames.js";
import { WATERCOLOR_PIGMENTS } from "../constants/pigments.js";
import { CARD_STYLE } from "../constants/styles.js";
import WatercolorSwatch from "./WatercolorSwatch.jsx";
import ExplainCard from "./ExplainCard.jsx";

function isExactPigment(hex) {
  return WATERCOLOR_PIGMENTS.some(p => p.hex.toLowerCase() === hex.toLowerCase());
}

export default function PaletteCard({ palette, themeColor, onSelectMixColor, isMobile }) {
  const swatchSize = isMobile ? 44 : 56;
  return (
    <div className="wcl-card" style={{
      ...CARD_STYLE,
      borderRadius: 16,
      padding: isMobile ? 16 : 20,
      display: "flex",
      flexDirection: "column",
      gap: 14,
      transition: "box-shadow 0.3s ease",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <h3 style={{
          margin: 0,
          fontSize: isMobile ? 15 : 17,
          fontWeight: 600,
          color: "#3d3630",
        }}>{palette.name}</h3>
        <span style={{
          fontSize: 11,
          color: "#b0a89e",
          background: "#f5f1eb",
          padding: "3px 10px",
          borderRadius: 20,
          fontFamily: "monospace",
          letterSpacing: 0.5,
        }}>{palette.theory}</span>
      </div>

      <div style={{ display: "flex", gap: isMobile ? 8 : 10, alignItems: "center", justifyContent: "center", padding: "6px 0", flexWrap: "wrap" }}>
        {palette.colors.map((c) => (
          <div key={c} onClick={() => onSelectMixColor(c)} role="button" tabIndex={0} aria-label={`Select ${getColorName(c).friendly} for mixing`} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onSelectMixColor(c); } }} style={{ cursor: "pointer", textAlign: "center", WebkitTapHighlightColor: "transparent" }}>
            <WatercolorSwatch color={c} size={swatchSize} />
            <div style={{ fontSize: isMobile ? 11 : 12, color: "#5a534b", fontWeight: 600, marginTop: 6 }}>
              {!isExactPigment(c) && <span style={{ fontSize: 10, color: "#b0a89e", fontWeight: 400 }}>Near </span>}
              {getColorName(c).pigment}
            </div>
            <div style={{ fontSize: 11, color: "#b0a89e", fontStyle: "italic" }}>
              "{getColorName(c).friendly}"
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 4, justifyContent: "center" }}>
        {palette.colors.length >= 2 && Array.from({ length: 5 }, (_, i) => {
          const c = watercolorMix(palette.colors[0], palette.colors[palette.colors.length - 1], i / 4);
          return <div key={i} style={{
            width: 20, height: 8, borderRadius: 4,
            background: c,
            opacity: 0.7,
          }} />;
        })}
      </div>

      <ExplainCard explain={palette.explain} accentColor={themeColor} />
    </div>
  );
}
