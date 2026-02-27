import { useState } from "react";

export default function ExplainCard({ explain, accentColor }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      onClick={() => setOpen(!open)}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setOpen(!open); } }}
      role="button"
      tabIndex={0}
      aria-expanded={open}
      style={{
        background: open ? `linear-gradient(160deg, #fefcfa, ${accentColor}08)` : "#fefcfa",
        border: `1px solid ${open ? accentColor + "40" : "#ebe5dd"}`,
        borderRadius: 12,
        padding: "12px 16px",
        cursor: "pointer",
        transition: "all 0.35s ease",
        userSelect: "none",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{
          fontSize: 13,
          fontWeight: 600,
          color: "#5a534b",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}>
          <span style={{ fontSize: 16 }}>💡</span>
          {explain.title}
        </span>
        <span style={{
          fontSize: 18,
          color: accentColor || "#bbb",
          transform: open ? "rotate(45deg)" : "rotate(0)",
          transition: "transform 0.3s ease",
          fontWeight: 300,
        }}>+</span>
      </div>
      {open && (
        <div style={{
          marginTop: 12,
          fontSize: 14,
          lineHeight: 1.7,
          color: "#6b635a",
        }}>
          <p style={{ margin: "0 0 12px 0" }}>{explain.body}</p>
          <div style={{
            background: `${accentColor}10`,
            borderLeft: `3px solid ${accentColor}60`,
            padding: "8px 12px",
            borderRadius: "0 8px 8px 0",
            fontSize: 13,
            color: "#7a7067",
            fontStyle: "italic",
          }}>
            🎨 <strong>Watercolor tip:</strong> {explain.tip}
          </div>
        </div>
      )}
    </div>
  );
}
