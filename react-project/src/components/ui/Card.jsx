import C from "../../constants/colors";

const Card = ({ children, style = {}, onClick }) => (
  <div onClick={onClick} style={{ background: C.white, borderRadius: 16, border: `1px solid ${C.border}`, padding: 24, cursor: onClick ? "pointer" : "default", ...style }}>{children}</div>
);

export default Card;
