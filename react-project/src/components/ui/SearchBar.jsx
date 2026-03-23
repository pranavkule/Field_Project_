import C from "../../constants/colors";

const SearchBar = ({ value, onChange, placeholder }) => (
  <div style={{ position: "relative", width: 260 }}>
    <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 15 }}>🔍</span>
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder || "Search..."}
      style={{ width: "100%", padding: "9px 14px 9px 38px", border: `1.5px solid ${C.border}`, borderRadius: 10, fontSize: 14, color: C.text, outline: "none", background: C.white, fontFamily: "inherit", boxSizing: "border-box" }}
      onFocus={(e) => (e.target.style.borderColor = C.primary)}
      onBlur={(e) => (e.target.style.borderColor = C.border)}
    />
  </div>
);

export default SearchBar;
