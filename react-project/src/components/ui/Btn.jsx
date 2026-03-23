import C from "../../constants/colors";

const Btn = ({ label, onClick, variant = "primary", icon, small }) => {
  const styles = {
    primary: { background: C.primary, color: C.white, border: "none" },
    outline: { background: C.white, color: C.primary, border: `1.5px solid ${C.primary}` },
    ghost: { background: "transparent", color: C.textMid, border: `1.5px solid ${C.border}` },
    danger: { background: C.danger, color: C.white, border: "none" },
  };
  return (
    <button onClick={onClick} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: small ? "7px 14px" : "10px 20px", borderRadius: 10, fontSize: small ? 13 : 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", ...styles[variant] }}>
      {icon && <span>{icon}</span>}{label}
    </button>
  );
};

export default Btn;
