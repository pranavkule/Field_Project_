import C from "../../constants/colors";

const Badge = ({ label, color = C.primary }) => (
  <span style={{ display: "inline-flex", alignItems: "center", padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600, background: color + "18", color }}>{label}</span>
);

export default Badge;
