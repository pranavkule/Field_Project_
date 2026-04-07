import C from "../../constants/colors";

const Input = ({ label, type = "text", value, onChange, placeholder, required }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
    <label style={{ fontSize: 14, fontWeight: 600, color: C.text, fontFamily: "'Inter', 'DM Sans', 'Segoe UI', system-ui, sans-serif" }}>{label}{required && <span style={{ color: C.danger }}> *</span>}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{ padding: "12px 16px", border: `1.5px solid ${C.border}`, borderRadius: 12, fontSize: 14, color: C.text, outline: "none", background: C.white, fontFamily: "inherit", transition: "all 0.2s ease", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}
      onFocus={(e) => { e.target.style.borderColor = C.primary; e.target.style.boxShadow = `0 0 0 3px ${C.primary}20`; }}
      onBlur={(e) => { e.target.style.borderColor = C.border; e.target.style.boxShadow = "0 1px 3px rgba(0,0,0,0.05)"; }}
    />
  </div>
);

export default Input;
