export default function TransparencyDemo({ color }) {
  const layers = [0.15, 0.3, 0.5, 0.75, 1.0];
  return (
    <div style={{
      background: "#fefcfa",
      border: "1px solid #ebe5dd",
      borderRadius: 14,
      padding: 20,
    }}>
      <h3 style={{
        margin: "0 0 6px 0",
        fontSize: 14,
        fontWeight: 600,
        color: "#5a534b",
      }}>
        🖌 Watercolor Transparency Layers
      </h3>
      <p style={{
        margin: "0 0 16px 0",
        fontSize: 13,
        color: "#9a9189",
        lineHeight: 1.5,
      }}>
        Watercolor is transparent — more water = lighter color. This shows how your color looks from very diluted (left) to full strength (right).
      </p>
      <div style={{ display: "flex", gap: 8, alignItems: "flex-end", justifyContent: "center" }}>
        {layers.map((op, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <div style={{
              width: 44 + i * 4,
              height: 44 + i * 4,
              borderRadius: "50%",
              background: `radial-gradient(circle at 35% 35%,
                ${color}${Math.round(op * 255).toString(16).padStart(2, "0")},
                ${color}${Math.round(op * 200).toString(16).padStart(2, "0")})`,
              filter: "url(#watercolorSoft)",
              border: "1px solid #f0ece6",
            }} />
            <span style={{ fontSize: 10, color: "#b0a89e", fontFamily: "monospace" }}>
              {Math.round(op * 100)}%
            </span>
          </div>
        ))}
      </div>
      <div style={{
        marginTop: 14,
        background: "#f9f6f2",
        borderRadius: 8,
        padding: "8px 12px",
        fontSize: 12,
        color: "#8a8279",
        lineHeight: 1.5,
        textAlign: "center",
      }}>
        💧 More water → more transparent → more paper shows through
      </div>
    </div>
  );
}
