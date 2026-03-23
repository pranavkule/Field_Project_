import C from "../../constants/colors";

const Avatar = ({ initials, size = 36, color = C.primary }) => (
  <div style={{ width: size, height: size, borderRadius: "50%", background: color + "22", color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.35, fontWeight: 700, flexShrink: 0 }}>{initials}</div>
);

export default Avatar;
