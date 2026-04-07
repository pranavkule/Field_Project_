import C from "../../constants/colors";

const Card = ({ children, style = {}, onClick }) => (
  <div onClick={onClick} style={{ background: C.white, borderRadius: 16, border: `1px solid ${C.border}`, padding: 24, cursor: onClick ? "pointer" : "default", boxShadow: "0 4px 12px rgba(0,0,0,0.06)", transition: "all 0.2s ease", ...style }}>
    {children}
  </div>
);

export default Card;
