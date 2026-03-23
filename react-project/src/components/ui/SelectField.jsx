import C from "../../constants/colors";

const SelectField = ({ label, value, onChange, options, required }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    <label style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{label}{required && <span style={{ color: C.danger }}> *</span>}</label>
    <select
      value={value}
      onChange={onChange}
      style={{ padding: "10px 14px", border: `1.5px solid ${C.border}`, borderRadius: 10, fontSize: 14, color: C.text, outline: "none", background: C.white, fontFamily: "inherit", cursor: "pointer" }}
      onFocus={(e) => (e.target.style.borderColor = C.primary)}
      onBlur={(e) => (e.target.style.borderColor = C.border)}
    >
      <option value="">Select...</option>
      {options.map((o) => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
  </div>
);

export default SelectField;
