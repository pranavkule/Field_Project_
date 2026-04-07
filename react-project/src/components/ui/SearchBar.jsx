import C from "../../constants/colors";
import { Search } from "lucide-react";

const SearchBar = ({ value, onChange, placeholder }) => (
  <div style={{ position: "relative", width: 280 }}>
    <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }}>
      <Search size={16} color={C.textLight} />
    </div>
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder || "Search..."}
      style={{ width: "100%", padding: "12px 16px 12px 44px", border: `1.5px solid ${C.border}`, borderRadius: 12, fontSize: 14, color: C.text, outline: "none", background: C.white, fontFamily: "inherit", boxSizing: "border-box", transition: "all 0.2s ease", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}
      onFocus={(e) => { e.target.style.borderColor = C.primary; e.target.style.boxShadow = `0 0 0 3px ${C.primary}20`; }}
      onBlur={(e) => { e.target.style.borderColor = C.border; e.target.style.boxShadow = "0 1px 3px rgba(0,0,0,0.05)"; }}
    />
  </div>
);

export default SearchBar;
