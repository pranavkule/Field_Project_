import C from "../../constants/colors";

export const TH = ({ children }) => (
  <th style={{ padding: "14px 16px", textAlign: "left", fontSize: 12, fontWeight: 700, color: C.textMid, textTransform: "uppercase", letterSpacing: 0.8, borderBottom: `2px solid ${C.border}`, background: C.bg, fontFamily: "'Inter', 'DM Sans', 'Segoe UI', system-ui, sans-serif" }}>{children}</th>
);

export const TD = ({ children, style = {} }) => (
  <td style={{ padding: "16px", fontSize: 14, color: C.text, borderBottom: `1px solid ${C.border}`, ...style }}>{children}</td>
);
