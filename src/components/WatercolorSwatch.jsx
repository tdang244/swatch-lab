import React from "react";

function swatchGradient(color, opacity) {
  const alpha = Math.round(opacity * 255).toString(16).padStart(2, "0");
  return `radial-gradient(circle at 35% 35%, ${color}${alpha}, ${color}dd, ${color}88)`;
}

const WatercolorSwatch = React.memo(function WatercolorSwatch({ color, size = 64, label, opacity = 1 }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <div style={{
        width: size, height: size, borderRadius: "50%",
        background: swatchGradient(color, opacity),
        filter: "url(#watercolorSoft)",
        boxShadow: `0 4px 20px ${color}40`,
        border: `2px solid ${color}22`,
        transition: "transform 0.3s ease",
      }} />
      {label && <span style={{ fontSize: 11, color: "#7a7067", letterSpacing: 0.5 }}>{label}</span>}
    </div>
  );
});

export default WatercolorSwatch;
