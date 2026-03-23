import C from "../../constants/colors";

const PageHeader = ({ title, subtitle, action }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
    <div>
      <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: C.text }}>{title}</h2>
      {subtitle && <p style={{ margin: "4px 0 0", fontSize: 14, color: C.textMid }}>{subtitle}</p>}
    </div>
    {action}
  </div>
);

export default PageHeader;
