export const CARD_STYLE = {
  background: "#fff",
  border: "1px solid #ebe5dd",
  borderRadius: 18,
  boxShadow: "0 2px 12px #d4cec420",
};

export const pillButton = (active, accentColor) => ({
  padding: "6px 14px",
  border: active ? `1.5px solid ${accentColor}` : "1px solid #e0dbd4",
  borderRadius: 20,
  background: active ? `${accentColor}12` : "#fefcfa",
  cursor: "pointer",
  fontSize: 12,
  fontWeight: active ? 600 : 400,
  color: active ? "#3d3630" : "#9a9189",
  transition: "all 0.25s ease",
  display: "flex",
  alignItems: "center",
  gap: 6,
  WebkitTapHighlightColor: "transparent",
});

export const presetButton = {
  padding: "6px 12px",
  border: "1px solid #e8e2db",
  borderRadius: 20,
  background: "#faf8f5",
  cursor: "pointer",
  fontSize: 12,
  color: "#7a7067",
  transition: "all 0.2s",
  display: "flex",
  alignItems: "center",
  gap: 6,
  WebkitTapHighlightColor: "transparent",
};

export const tabButton = (active, accentColor, mobile) => ({
  flex: mobile ? "0 0 auto" : 1,
  padding: mobile ? "10px 14px" : "10px 4px",
  border: active ? `1px solid ${accentColor}50` : "1px solid #e8e2db",
  borderRadius: 12,
  background: active ? `${accentColor}10` : "#fff",
  cursor: "pointer",
  fontSize: 12,
  fontWeight: active ? 600 : 400,
  color: active ? "#3d3630" : "#9a9189",
  transition: "all 0.3s ease",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 5,
  whiteSpace: "nowrap",
  WebkitTapHighlightColor: "transparent",
});
