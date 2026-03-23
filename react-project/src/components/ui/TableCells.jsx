import C from "../../constants/colors";

export const TH = ({ children }) => (
  <th style={{ padding: "10px 14px", textAlign: "left", fontSize: 12, fontWeight: 700, color: C.textMid, textTransform: "uppercase", letterSpacing: 0.5, borderBottom: `1px solid ${C.border}`, background: C.bg }}>{children}</th>
);

export const TD = ({ children, style = {} }) => (
  <td style={{ padding: "12px 14px", fontSize: 14, color: C.text, ...style }}>{children}</td>
);
