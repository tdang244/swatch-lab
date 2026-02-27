import { useState, useMemo } from "react";
import { useIsMobile } from "../hooks/useIsMobile.js";
import { hexToHsl } from "../utils/colorMath.js";
import { getColorName, getTemperature, getTemperatureLabel, generatePalettes } from "../utils/colorNames.js";
import { WATERCOLOR_PIGMENTS, COLOR_GROUPS } from "../constants/pigments.js";
import { findBestMix } from "../utils/watercolorMix.js";
import { CARD_STYLE, pillButton, presetButton, tabButton } from "../constants/styles.js";
import WatercolorFilter from "./WatercolorFilter.jsx";
import InteractiveColorWheel from "./InteractiveColorWheel.jsx";
import PaletteCard from "./PaletteCard.jsx";
import ScenePreview from "./scenes/ScenePreview.jsx";
import MixingStrip from "./MixingStrip.jsx";
import ThreeColorMix from "./ThreeColorMix.jsx";
import TransparencyDemo from "./TransparencyDemo.jsx";
import ExplainCard from "./ExplainCard.jsx";

export default function WatercolorColorLab() {
  const [themeColor, setThemeColor] = useState("#4A7C91");
  const [mixColor, setMixColor] = useState("#C9713D");
  const [mixColor2, setMixColor2] = useState("#E8C84A");
  const [mixMode, setMixMode] = useState(2);
  const [activeTab, setActiveTab] = useState("wheel");
  const isMobile = useIsMobile();

  const palettes = useMemo(() => generatePalettes(themeColor), [themeColor]);
  const temp = getTemperature(themeColor);

  // Find the nearest pigment swatch to highlight, even for wheel-picked colors
  const nearestPigmentHex = useMemo(() => {
    // Exact match first
    const exact = WATERCOLOR_PIGMENTS.find(c => c.hex.toLowerCase() === themeColor.toLowerCase());
    if (exact) return exact.hex;
    // Fuzzy match by HSL distance
    const { h, s, l } = hexToHsl(themeColor);
    let best = null, bestDist = Infinity;
    for (const p of WATERCOLOR_PIGMENTS) {
      const ph = hexToHsl(p.hex);
      const dh = Math.min(Math.abs(h - ph.h), 360 - Math.abs(h - ph.h));
      const dist = dh * 1.5 + Math.abs(s - ph.s) + Math.abs(l - ph.l);
      if (dist < bestDist) { bestDist = dist; best = p; }
    }
    return bestDist < 35 ? best.hex : null;
  }, [themeColor]);

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(175deg, #f8f4ef 0%, #f0ece6 40%, #ebe5db 100%)",
      fontFamily: "'EB Garamond', Georgia, serif",
      position: "relative",
      overflow: "hidden",
    }}>
      <WatercolorFilter />
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        button, select, input { font: inherit; }
        .wcl-scroll::-webkit-scrollbar { display: none; }
        @media (hover: hover) {
          .wcl-pigment:hover { transform: scale(1.15); }
          .wcl-btn:hover { background: #f0ece6 !important; }
          .wcl-card:hover { box-shadow: 0 6px 24px #d4cec440 !important; }
        }
      `}</style>

      {/* Paper texture overlay */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
        opacity: 0.03,
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='.8' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23n)' opacity='.5'/%3E%3C/svg%3E\")",
        pointerEvents: "none",
        zIndex: 0,
      }} />

      <div style={{
        maxWidth: 700,
        margin: "0 auto",
        padding: isMobile ? "24px 12px 40px" : "40px 20px 60px",
        position: "relative",
        zIndex: 1,
      }}>
        {/* Header */}
        <header style={{ textAlign: "center", marginBottom: isMobile ? 24 : 36 }}>
          <h1 style={{
            fontSize: isMobile ? 24 : 32,
            fontWeight: 400,
            color: "#3d3630",
            margin: "0 0 8px 0",
            letterSpacing: -0.5,
          }}>
            <span style={{ fontWeight: 300, opacity: 0.6, fontSize: 24 }}>🎨</span>
            {" "}Swatch Lab
          </h1>
          <p style={{
            fontSize: 15,
            color: "#9a9189",
            margin: 0,
            fontStyle: "italic",
            lineHeight: 1.5,
          }}>
            Pick a color. Explore what goes with it. Learn why.
          </p>
        </header>

        {/* Theme Color Selection */}
        <section style={{
          background: "#fff",
          borderRadius: 18,
          padding: isMobile ? 16 : 24,
          marginBottom: 20,
          border: "1px solid #ebe5dd",
          boxShadow: "0 2px 16px #d4cec418",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 8 : 12, marginBottom: isMobile ? 14 : 18, flexWrap: "wrap" }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: "#3d3630", margin: 0 }}>
              Your Theme Color
            </h2>
            <span style={{
              fontSize: 13,
              color: "#5a534b",
              background: `${themeColor}15`,
              border: `1px solid ${themeColor}30`,
              padding: "3px 12px",
              borderRadius: 20,
              fontWeight: 600,
            }}>
              {getColorName(themeColor).pigment}
              <span style={{ fontWeight: 400, fontStyle: "italic", color: "#9a9189", marginLeft: 6 }}>
                "{getColorName(themeColor).friendly}"
              </span>
            </span>
            <span style={{
              fontSize: 12,
              background: temp.includes("warm") ? "#fff3e0" : "#e3f2fd",
              color: temp.includes("warm") ? "#bf7b2a" : "#4a7fb5",
              padding: "3px 10px",
              borderRadius: 20,
            }}>
              {getTemperatureLabel(temp)}
            </span>
          </div>

          <div style={{ display: "flex", gap: 16, alignItems: "flex-start", flexWrap: "wrap", flexDirection: isMobile ? "column" : "row" }}>
            <div style={{ position: "relative", flexShrink: 0, marginBottom: 14, display: "flex", alignItems: isMobile ? "center" : "flex-start", gap: isMobile ? 12 : 0, width: isMobile ? "100%" : "auto" }}>
              <input
                type="color"
                value={themeColor}
                onChange={(e) => setThemeColor(e.target.value)}
                style={{
                  width: 64, height: 64,
                  border: "none",
                  borderRadius: "50%",
                  cursor: "pointer",
                  background: "none",
                  padding: 0,
                }}
              />
              <div style={isMobile ? {
                fontSize: 10, color: "#b0a89e", fontFamily: "monospace",
              } : {
                position: "absolute", bottom: -18, left: "50%", transform: "translateX(-50%)",
                fontSize: 10, color: "#b0a89e", fontFamily: "monospace",
                whiteSpace: "nowrap",
              }}>
                {themeColor.toUpperCase()}
              </div>
            </div>

            {!isMobile && <div style={{
              height: 40, width: 1, background: "#e8e2db", flexShrink: 0, alignSelf: "center",
            }} />}

            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8, width: "100%" }}>
              {COLOR_GROUPS.map((group) => (
                <div key={group} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{
                    fontSize: 10, color: "#b0a89e", width: isMobile ? 60 : 72, flexShrink: 0,
                    textTransform: "uppercase", letterSpacing: 0.8, fontFamily: "monospace",
                  }}>{group}</span>
                  <div style={{ display: "flex", gap: isMobile ? 8 : 5, flexWrap: "wrap" }}>
                    {WATERCOLOR_PIGMENTS.filter(c => c.group === group).map((c) => (
                      <div
                        key={c.hex}
                        className="wcl-pigment"
                        onClick={() => setThemeColor(c.hex)}
                        title={`${c.name} — "${c.friendly}"`}
                        role="button"
                        aria-label={`${c.name}, ${c.friendly}`}
                        tabIndex={0}
                        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setThemeColor(c.hex); } }}
                        style={{
                          width: isMobile ? 36 : 28, height: isMobile ? 36 : 28,
                          borderRadius: "50%",
                          background: `radial-gradient(circle at 35% 35%, ${c.hex}, ${c.hex}cc)`,
                          cursor: "pointer",
                          border: nearestPigmentHex === c.hex ? "2.5px solid #3d3630" : "2px solid transparent",
                          transition: "all 0.2s ease",
                          filter: "url(#watercolorSoft)",
                          outline: nearestPigmentHex === c.hex ? `2px solid ${c.hex}40` : "none",
                          outlineOffset: 1,
                          WebkitTapHighlightColor: "transparent",
                        }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Inline explain card for temperature */}
          <div style={{
            marginTop: 18,
            background: "#faf8f5",
            borderRadius: 10,
            padding: "10px 14px",
            fontSize: 13,
            color: "#8a8279",
            lineHeight: 1.6,
            display: "flex",
            gap: 8,
          }}>
            <span style={{ fontSize: 14, flexShrink: 0 }}>💡</span>
            <span>
              {temp.includes("warm")
                ? "Warm colors feel close and energetic. They advance toward the viewer — great for focal points and foreground elements."
                : "Cool colors feel distant and calm. They recede from the viewer — great for backgrounds, shadows, and creating depth."
              }
            </span>
          </div>
        </section>

        {/* Tab Navigation */}
        <div className="wcl-scroll" style={{
          display: "flex", gap: 4, marginBottom: 20,
          overflowX: isMobile ? "auto" : "visible",
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          paddingBottom: isMobile ? 4 : 0,
        }}>
          {[
            { id: "wheel", label: "Color Wheel", shortLabel: "Wheel", icon: "🔵" },
            { id: "palettes", label: "Palettes", shortLabel: "Palettes", icon: "🎨" },
            { id: "preview", label: "Preview", shortLabel: "Preview", icon: "🖼" },
            { id: "mixing", label: "Mixing Lab", shortLabel: "Mix", icon: "🧪" },
            { id: "layers", label: "Transparency", shortLabel: "Layers", icon: "💧" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              aria-selected={activeTab === tab.id}
              role="tab"
              style={tabButton(activeTab === tab.id, themeColor, isMobile)}
            >
              <span>{tab.icon}</span>
              {isMobile ? tab.shortLabel : tab.label}
            </button>
          ))}
        </div>

        {/* Color Wheel Tab */}
        {activeTab === "wheel" && (
          <div style={{ ...CARD_STYLE, padding: isMobile ? 16 : 24 }}>
            <div style={{ marginBottom: 16 }}>
              <h2 style={{ fontSize: isMobile ? 16 : 18, fontWeight: 600, color: "#3d3630", margin: "0 0 4px 0" }}>
                🔵 Interactive Color Wheel
              </h2>
              <p style={{ fontSize: 13, color: "#9a9189", margin: 0, lineHeight: 1.5 }}>
                Explore how colors relate to each other. Select a theory, then tap the wheel to move your anchor color.
              </p>
            </div>
            <InteractiveColorWheel themeColor={themeColor} onColorChange={setThemeColor} isMobile={isMobile} />
          </div>
        )}

        {/* Palettes Tab */}
        {activeTab === "palettes" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{
              padding: "10px 14px",
              background: "#faf8f5",
              borderRadius: 10,
              fontSize: 13,
              color: "#8a8279",
              lineHeight: 1.6,
              fontStyle: "italic",
              textAlign: "center",
            }}>
              Tap any color swatch to send it to the Mixing Lab
            </div>
            {palettes.map((p) => (
              <PaletteCard
                key={p.theory}
                palette={p}
                themeColor={themeColor}
                isMobile={isMobile}
                onSelectMixColor={(c) => { setThemeColor(c); setMixColor(findBestMix(c, WATERCOLOR_PIGMENTS)); setMixMode(2); setActiveTab("mixing"); }}
              />
            ))}
          </div>
        )}

        {/* Preview Tab */}
        {activeTab === "preview" && (
          <div style={{ ...CARD_STYLE, padding: isMobile ? 16 : 24 }}>
            <div style={{ marginBottom: 16 }}>
              <h2 style={{ fontSize: isMobile ? 16 : 18, fontWeight: 600, color: "#3d3630", margin: "0 0 4px 0" }}>
                🖼 Palette Preview
              </h2>
              <p style={{ fontSize: 13, color: "#9a9189", margin: 0, lineHeight: 1.5 }}>
                See how your palette looks on an actual painting. Pick a palette and scene to vibe-check your colors.
              </p>
            </div>
            <ScenePreview themeColor={themeColor} palettes={palettes} isMobile={isMobile} />
          </div>
        )}

        {/* Mixing Lab Tab */}
        {activeTab === "mixing" && (
          <div style={{
            ...CARD_STYLE,
            padding: isMobile ? 16 : 24,
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}>
            <div>
              <h2 style={{ fontSize: isMobile ? 16 : 18, fontWeight: 600, color: "#3d3630", margin: "0 0 4px 0" }}>
                🧪 Pigment Mixing Simulator
              </h2>
              <p style={{ fontSize: 13, color: "#9a9189", margin: 0, lineHeight: 1.5 }}>
                See how watercolor pigments blend together on paper
              </p>
            </div>

            <ExplainCard
              accentColor={themeColor}
              explain={{
                title: "How watercolor mixing really works",
                body: "Unlike mixing light (screens, digital), watercolor is subtractive — combining pigments absorbs more light and makes things darker, not brighter. This is why mixing too many colors together creates muddy brown. In practice, every color you add to a mix makes it darker and less saturated. The fewer colors in your mix, the cleaner and more vibrant the result.",
                tip: "Limit yourself to mixing 2-3 pigments max. If you need a specific color, it's often better to buy that tube paint than try to mix it from many others."
              }}
            />

            {/* 2/3 color toggle */}
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div style={{
                display: "inline-flex",
                background: "#f5f1eb",
                borderRadius: 10,
                padding: 3,
                gap: 2,
              }}>
                {[2, 3].map((n) => (
                  <button
                    key={n}
                    onClick={() => setMixMode(n)}
                    style={{
                      padding: isMobile ? "9px 20px" : "7px 18px",
                      border: "none",
                      borderRadius: 8,
                      background: mixMode === n ? "#fff" : "transparent",
                      boxShadow: mixMode === n ? "0 1px 4px #d4cec430" : "none",
                      cursor: "pointer",
                      fontSize: 13,
                      fontWeight: mixMode === n ? 600 : 400,
                      color: mixMode === n ? "#3d3630" : "#9a9189",
                      transition: "all 0.25s ease",
                      WebkitTapHighlightColor: "transparent",
                    }}
                  >
                    {n} Colors
                  </button>
                ))}
              </div>
            </div>

            {/* Color dropdowns */}
            <div style={{
              display: "flex", gap: isMobile ? 10 : 16,
              alignItems: isMobile ? "stretch" : "flex-start",
              justifyContent: "center",
              flexDirection: isMobile ? "column" : "row",
            }}>
              {[
                { value: themeColor, setter: setThemeColor, label: "1" },
                { value: mixColor, setter: setMixColor, label: "2" },
                ...(mixMode === 3 ? [{ value: mixColor2, setter: setMixColor2, label: "3" }] : []),
              ].map((slot) => (
                <div key={slot.label} style={{
                  display: "flex",
                  flexDirection: isMobile ? "row" : "column",
                  alignItems: "center",
                  gap: isMobile ? 12 : 8,
                  flex: isMobile ? undefined : "1 1 0",
                  maxWidth: isMobile ? "100%" : 180,
                  minWidth: isMobile ? 0 : 120,
                }}>
                  <div style={{
                    width: isMobile ? 44 : 52,
                    height: isMobile ? 44 : 52,
                    borderRadius: "50%",
                    flexShrink: 0,
                    background: `radial-gradient(circle at 35% 35%, ${slot.value}, ${slot.value}cc)`,
                    filter: "url(#watercolorSoft)",
                    boxShadow: `0 4px 16px ${slot.value}30`,
                    border: "2px solid #f0ece6",
                    transition: "all 0.3s ease",
                  }} />
                  <select
                    value={slot.value}
                    onChange={(e) => slot.setter(e.target.value)}
                    aria-label={`Color ${slot.label}`}
                    style={{
                      width: isMobile ? undefined : "100%",
                      flex: isMobile ? 1 : undefined,
                      padding: isMobile ? "10px 10px" : "8px 10px",
                      border: "1px solid #e0dbd4",
                      borderRadius: 10,
                      background: "#fefcfa",
                      fontSize: isMobile ? 14 : 13,
                      color: "#3d3630",
                      cursor: "pointer",
                      appearance: "none",
                      WebkitAppearance: "none",
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239a9189' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 10px center",
                      paddingRight: 28,
                    }}
                  >
                    {COLOR_GROUPS.map((group) => (
                      <optgroup key={group} label={group}>
                        {WATERCOLOR_PIGMENTS.filter(c => c.group === group).map((c) => (
                          <option key={c.hex} value={c.hex}>
                            {c.name} — "{c.friendly}"
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                  {!WATERCOLOR_PIGMENTS.find(c => c.hex === slot.value) && (
                    <div style={{ fontSize: 11, color: "#9a9189", marginTop: 4, fontStyle: "italic" }}>
                      Custom: {getColorName(slot.value).pigment}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Mixing result */}
            {mixMode === 2 ? (
              <MixingStrip color1={themeColor} color2={mixColor} />
            ) : (
              <ThreeColorMix color1={themeColor} color2={mixColor} color3={mixColor2} />
            )}

            {/* Quick-try presets */}
            <div>
              <p style={{ fontSize: 12, color: "#9a9189", margin: "0 0 10px 0", fontWeight: 600 }}>
                Try classic watercolor mixes:
              </p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {mixMode === 2 ? (
                  [
                    { a: "#3F69AA", b: "#C9713D", label: "Ultramarine + Burnt Sienna" },
                    { a: "#C44536", b: "#D4A843", label: "Cadmium Red + Yellow Ochre" },
                    { a: "#4A7C91", b: "#C44536", label: "Cerulean + Cadmium Red" },
                    { a: "#5B8C3E", b: "#9E5B8A", label: "Sap Green + Magenta" },
                    { a: "#3D5A80", b: "#C9713D", label: "Indigo + Burnt Sienna" },
                    { a: "#E8C84A", b: "#5C3D6E", label: "Cadmium Yellow + Violet" },
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      onClick={() => { setThemeColor(preset.a); setMixColor(preset.b); }}
                      style={presetButton}
                    >
                      <span style={{
                        width: 10, height: 10, borderRadius: "50%",
                        background: `linear-gradient(135deg, ${preset.a}, ${preset.b})`,
                        display: "inline-block",
                      }} />
                      {preset.label}
                    </button>
                  ))
                ) : (
                  [
                    { a: "#C44536", b: "#E8C84A", c: "#3F69AA", label: "Primary Triad" },
                    { a: "#D4903A", b: "#5B8C3E", c: "#7A5DAA", label: "Secondary Triad" },
                    { a: "#3F69AA", b: "#C9713D", c: "#D4A843", label: "Landscape Essentials" },
                    { a: "#C94D6E", b: "#4BA8B5", c: "#E8C84A", label: "Vibrant Portrait" },
                    { a: "#2E8B7A", b: "#C9713D", c: "#3D5A80", label: "Earthy & Deep" },
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      onClick={() => { setThemeColor(preset.a); setMixColor(preset.b); setMixColor2(preset.c); }}
                      style={presetButton}
                    >
                      <span style={{
                        width: 14, height: 10, borderRadius: 3,
                        background: `linear-gradient(135deg, ${preset.a}, ${preset.b}, ${preset.c})`,
                        display: "inline-block",
                      }} />
                      {preset.label}
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Transparency Tab */}
        {activeTab === "layers" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <TransparencyDemo color={themeColor} />

            {/* Layering demo */}
            <div style={{
              background: "#fff",
              border: "1px solid #ebe5dd",
              borderRadius: 14,
              padding: isMobile ? 16 : 20,
            }}>
              <h3 style={{
                margin: "0 0 6px 0",
                fontSize: 14,
                fontWeight: 600,
                color: "#5a534b",
              }}>
                📐 Layering Preview
              </h3>
              <p style={{
                margin: "0 0 16px 0",
                fontSize: 13,
                color: "#9a9189",
                lineHeight: 1.5,
              }}>
                In watercolor, you build depth by layering transparent washes. Here's what happens when your theme color overlaps itself and another color.
              </p>

              <div style={{ display: "flex", justifyContent: "center", gap: isMobile ? 24 : 40, flexWrap: "wrap" }}>
                {/* Self-layering */}
                <div style={{ textAlign: "center" }}>
                  <div style={{ position: "relative", width: 100, height: 100 }}>
                    <div style={{
                      position: "absolute", left: 0, top: 10,
                      width: 70, height: 70, borderRadius: "50%",
                      background: `${themeColor}50`,
                      filter: "url(#watercolorSoft)",
                    }} />
                    <div style={{
                      position: "absolute", left: 25, top: 20,
                      width: 70, height: 70, borderRadius: "50%",
                      background: `${themeColor}70`,
                      filter: "url(#watercolorSoft)",
                    }} />
                  </div>
                  <span style={{ fontSize: 11, color: "#9a9189" }}>Self-layered</span>
                </div>

                {/* Cross-layering */}
                <div style={{ textAlign: "center" }}>
                  <div style={{ position: "relative", width: 100, height: 100 }}>
                    <div style={{
                      position: "absolute", left: 0, top: 10,
                      width: 70, height: 70, borderRadius: "50%",
                      background: `${themeColor}60`,
                      filter: "url(#watercolorSoft)",
                    }} />
                    <div style={{
                      position: "absolute", left: 25, top: 20,
                      width: 70, height: 70, borderRadius: "50%",
                      background: `${mixColor}50`,
                      filter: "url(#watercolorSoft)",
                    }} />
                  </div>
                  <span style={{ fontSize: 11, color: "#9a9189" }}>Cross-layered</span>
                </div>
              </div>
            </div>

            <ExplainCard
              accentColor={themeColor}
              explain={{
                title: "Why transparency matters in watercolor",
                body: "Unlike acrylic or oil paint, watercolor is transparent — the white paper shines through every layer. This is what gives watercolor its luminous, glowing quality. But it also means you can't paint light over dark. You have to plan from lightest to darkest, saving your whites from the beginning. Every layer darkens what's underneath.",
                tip: "Always start with your lightest wash and build darker. Leave the paper unpainted where you want the brightest whites — there's no white watercolor paint that looks as clean as untouched paper."
              }}
            />
          </div>
        )}

        {/* Footer */}
        <footer style={{
          textAlign: "center",
          marginTop: 40,
          padding: "20px 0",
          borderTop: "1px solid #ebe5dd",
          fontSize: 12,
          color: "#c4bcb2",
          fontStyle: "italic",
        }}>
          Color mixing uses a pigment-approximating model. Real watercolor results vary by paper, pigment brand, and water ratio.
        </footer>
      </div>
    </div>
  );
}
