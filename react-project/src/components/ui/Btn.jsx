import C from "../../constants/colors";

const Btn = ({ label, onClick, variant = "primary", icon, small }) => {
  const styles = {
    primary: { background: C.primary, color: C.white, border: "none", boxShadow: "0 4px 12px rgba(36, 107, 253, 0.3)" },
    outline: { background: C.white, color: C.primary, border: `1.5px solid ${C.primary}`, boxShadow: "0 2px 4px rgba(0,0,0,0.05)" },
    ghost: { background: "transparent", color: C.textMid, border: `1.5px solid ${C.border}`, boxShadow: "none" },
    danger: { background: C.danger, color: C.white, border: "none", boxShadow: "0 4px 12px rgba(239, 68, 68, 0.3)" },
  };
  return (
    <button onClick={onClick} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: small ? "7px 14px" : "10px 20px", borderRadius: 10, fontSize: small ? 13 : 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s ease", ...styles[variant] }}>
      {icon && <span>{icon}</span>}{label}
    </button>
  );
};

export default Btn;
