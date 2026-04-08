import C from "../../constants/colors";
import { LayoutDashboard, Users, UserCheck, Heart, ClipboardList, Package, DollarSign, ShieldCheck, LogOut } from "lucide-react";

const NAV = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "children", label: "Child Directory", icon: Users },
  { id: "staff", label: "Staff Directory", icon: UserCheck },
  { id: "health", label: "Health Desk", icon: Heart },
  { id: "attendance", label: "Staff Attendance", icon: ClipboardList },
  { id: "inventory", label: "Inventory & Needs", icon: Package },
  { id: "expenses", label: "Expense Tracker", icon: DollarSign },
];

const Sidebar = ({ active, setPage, onLogout, isSuperAdmin = false }) => {
  const navItems = isSuperAdmin
    ? [
        NAV[0],
        { id: "approvalCenter", label: "Approval Center", icon: ShieldCheck },
        ...NAV.slice(1),
      ]
    : NAV;

  return (
  <aside style={{ width: 240, background: C.white, borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", height: "100vh", position: "sticky", top: 0, flexShrink: 0, boxShadow: "2px 0 8px rgba(0,0,0,0.05)" }}>
    <div style={{ padding: "24px 24px 20px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 34,
          height: 34,
          borderRadius: 10,
          background: C.primary,
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 16,
          fontWeight: 800,
          fontFamily: "'Inter', 'DM Sans', 'Segoe UI', system-ui, sans-serif",
          boxShadow: "0 4px 12px rgba(36, 107, 253, 0.3)",
          textTransform: "uppercase"
        }}>
          CS
        </div>
        <div>
          <div style={{ fontSize: 17, fontWeight: 800, color: C.text, letterSpacing: -0.5 }}>Care<span style={{ color: C.primary }}>Sync</span></div>
          <div style={{ fontSize: 10, color: C.textLight }}>Record Management</div>
        </div>
      </div>
    </div>
    <nav style={{ flex: 1, padding: "8px 14px", overflowY: "auto" }}>
      {navItems.map((n) => (
        <button
          key={n.id}
          onClick={() => setPage(n.id)}
          style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", borderRadius: 12, border: "none", cursor: "pointer", marginBottom: 2, textAlign: "left", fontSize: 14, fontWeight: active === n.id ? 700 : 500, background: active === n.id ? C.primaryLight : "transparent", color: active === n.id ? C.primary : C.textMid, fontFamily: "inherit", transition: "all 0.2s ease" }}
        >
          <n.icon size={17} />
          {n.label}
        </button>
      ))}
    </nav>
    <div style={{ padding: 14, borderTop: `1px solid ${C.border}` }}>
      <button
        onClick={onLogout}
        style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", borderRadius: 12, border: "none", cursor: "pointer", fontSize: 14, fontWeight: 500, color: C.danger, background: "#FEF2F2", fontFamily: "inherit", transition: "all 0.2s ease" }}
      >
        <LogOut size={17} />
        Logout
      </button>
    </div>
  </aside>
  );
};

export default Sidebar;
