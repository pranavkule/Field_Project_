import C from "../../constants/colors";

const PageHeader = ({ title, subtitle, action }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32, paddingBottom: 16, borderBottom: `1px solid ${C.border}` }}>
    <div>
      <h2 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: C.text, letterSpacing: -0.5, fontFamily: "'Inter', 'DM Sans', 'Segoe UI', system-ui, sans-serif" }}>{title}</h2>
      {subtitle && <p style={{ margin: "6px 0 0", fontSize: 15, color: C.textMid, fontWeight: 400 }}>{subtitle}</p>}
    </div>
    {action}
  </div>
);

export default PageHeader;
