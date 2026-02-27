import { useState } from "react";
import { getColorName } from "../../utils/colorNames.js";
import { pillButton } from "../../constants/styles.js";
import LandscapeScene from "./LandscapeScene.jsx";
import FloralScene from "./FloralScene.jsx";
import SeascapeScene from "./SeascapeScene.jsx";
import AbstractScene from "./AbstractScene.jsx";

const SCENES = [
  { id: "landscape", name: "Landscape", icon: "🏔", component: LandscapeScene },
  { id: "floral", name: "Floral Still Life", icon: "🌸", component: FloralScene },
  { id: "seascape", name: "Seascape", icon: "🌊", component: SeascapeScene },
  { id: "abstract", name: "Abstract Wash", icon: "💫", component: AbstractScene },
];

export default function ScenePreview({ themeColor, palettes, isMobile }) {
  const [activeScene, setActiveScene] = useState("landscape");
  const [activePalette, setActivePalette] = useState(0);

  const palette = palettes[activePalette];
  const allColors = [themeColor, ...palette.colors.filter(c => c !== themeColor)];

  const bg = allColors[0] || themeColor;
  const mid = allColors[1] || allColors[0];
  const fg = allColors[2] || allColors[1] || allColors[0];
  const accent = allColors[allColors.length - 1] || themeColor;

  const scene = SCENES.find(s => s.id === activeScene);
  const SceneComponent = scene.component;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Palette selector */}
      <div>
        <p style={{ fontSize: 12, color: "#9a9189", margin: "0 0 8px 0", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.8 }}>
          Choose a palette
        </p>
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, auto)",
          gap: 8,
          justifyContent: isMobile ? "stretch" : "flex-start",
        }}>
          {palettes.map((p, i) => (
            <button
              key={p.name}
              onClick={() => setActivePalette(i)}
              style={{
                ...pillButton(activePalette === i, themeColor),
                padding: isMobile ? "10px 10px" : "6px 14px",
                borderRadius: isMobile ? 12 : 20,
                justifyContent: "center",
              }}
            >
              <span style={{ display: "flex", gap: 2 }}>
                {p.colors.map((c) => (
                  <span key={c} style={{ width: 8, height: 8, borderRadius: "50%", background: c, display: "inline-block", border: "1px solid #f0ece6" }} />
                ))}
              </span>
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Active palette color legend */}
      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, auto)",
        gap: isMobile ? 10 : 12,
        justifyContent: isMobile ? "stretch" : "center",
        background: "#faf8f5", borderRadius: 10, padding: "10px 16px",
      }}>
        {[
          { color: bg, role: "Background" },
          { color: mid, role: "Midground" },
          { color: fg, role: "Foreground" },
          { color: accent, role: "Accent" },
        ].map(({ color, role }) => (
          <div key={role} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{
              width: 18, height: 18, borderRadius: "50%",
              background: `radial-gradient(circle at 35% 35%, ${color}, ${color}cc)`,
              border: "1.5px solid #f0ece6",
              filter: "url(#watercolorSoft)",
              flexShrink: 0,
            }} />
            <div>
              <div style={{ fontSize: 10, color: "#9a9189", lineHeight: 1 }}>{role}</div>
              <div style={{ fontSize: 11, color: "#5a534b", fontWeight: 600 }}>{getColorName(color).friendly}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Scene selector */}
      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, auto)",
        gap: 6,
        justifyContent: isMobile ? "stretch" : "center",
      }}>
        {SCENES.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveScene(s.id)}
            style={{
              ...pillButton(activeScene === s.id, themeColor),
              padding: isMobile ? "10px 10px" : "8px 14px",
              borderRadius: 10,
              justifyContent: "center",
              gap: 5,
            }}
          >
            <span>{s.icon}</span>
            {s.name}
          </button>
        ))}
      </div>

      {/* Scene canvas */}
      <div style={{
        borderRadius: 14,
        overflow: "hidden",
        border: "1px solid #ebe5dd",
        background: "#faf7f2",
        boxShadow: "0 4px 20px #d4cec420",
        position: "relative",
      }}>
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
          opacity: 0.04, pointerEvents: "none", zIndex: 1,
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='80' height='80' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='80' height='80' filter='url(%23n)' opacity='.4'/%3E%3C/svg%3E\")",
        }} />
        <SceneComponent bg={bg} mid={mid} fg={fg} accent={accent} />
      </div>

      {/* Vibe check */}
      <div style={{
        background: "#faf8f5",
        borderRadius: 10,
        padding: "10px 14px",
        fontSize: 13,
        color: "#8a8279",
        lineHeight: 1.6,
        fontStyle: "italic",
        textAlign: "center",
      }}>
        💡 Try switching between scenes to see how the same palette feels in different contexts. A palette that works for landscapes might feel different in a floral composition.
      </div>
    </div>
  );
}
