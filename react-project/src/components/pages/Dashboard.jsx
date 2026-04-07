import C from "../../constants/colors";
import { statusColor } from "../../utils/statusColor";
import Card from "../ui/Card";
import Avatar from "../ui/Avatar";
import Badge from "../ui/Badge";
import { Users, UserCheck, DollarSign, Package, UserPlus, Briefcase, AlertTriangle, CheckCircle, Heart, Utensils, Zap, BookOpen, Pill, CreditCard, Wrench } from "lucide-react";

const Dashboard = ({ setPage, children, staff, expenses, inventory }) => {
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const lowStock = inventory.filter(i => i.status === "Low Stock" || i.status === "Critical").length;
  const stats = [
    { label: "Children in Care", value: children.length, icon: Users, color: C.primary, sub: "Active residents", page: "children" },
    { label: "Total Staff", value: staff.length, icon: UserCheck, color: "#8B5CF6", sub: "All departments", page: "staff" },
    { label: "Monthly Expenses", value: `₹${totalExpenses.toLocaleString()}`, icon: DollarSign, color: C.success, sub: "Total expenditure", page: "expenses" },
    { label: "Low Stock Items", value: lowStock, icon: Package, color: C.warning, sub: "Need restocking", page: "inventory" },
  ];
  const catIcons = { 
    Food: Utensils, 
    Utilities: Zap, 
    Education: BookOpen, 
    Medical: Pill, 
    Salaries: CreditCard, 
    Maintenance: Wrench 
  };
  return (
    <div style={{ padding: "24px 32px", maxWidth: "100%", overflowX: "hidden" }}>
      {/* Stats Grid - Responsive */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", 
        gap: "16px", 
        marginBottom: "28px",
        width: "100%"
      }}>
        {stats.map((s) => (
          <Card key={s.label} onClick={() => setPage(s.page)} style={{ transition: "box-shadow 0.15s", cursor: "pointer" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: "24px", fontWeight: 800, color: C.text, lineHeight: 1, wordBreak: "break-word" }}>{s.value}</div>
                <div style={{ fontSize: "13px", fontWeight: 600, color: C.textMid, marginTop: "8px", lineHeight: 1.2 }}>{s.label}</div>
                <div style={{ fontSize: "12px", color: C.textLight, marginTop: "4px", lineHeight: 1.2 }}>{s.sub}</div>
              </div>
              <div style={{ width: "44px", height: "44px", minWidth: "44px", borderRadius: "12px", background: s.color + "18", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <s.icon size={22} color={s.color} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Content Grid - Responsive */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", 
        gap: "20px",
        width: "100%"
      }}>
        {/* Quick Actions Card */}
        <Card>
          <h3 style={{ margin: "0 0 16px 0", fontSize: "16px", fontWeight: 700, color: C.text }}>Quick Actions</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px" }}>
            {[
              { label: "Add Resident", icon: UserPlus, page: "children" },
              { label: "Add Staff", icon: Briefcase, page: "staff" },
              { label: "Log Expense", icon: DollarSign, page: "expenses" },
              { label: "Update Inventory", icon: Package, page: "inventory" },
            ].map((a) => (
              <button key={a.label} onClick={() => setPage(a.page)} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", padding: "12px 14px", background: C.primaryLight, border: "none", borderRadius: "12px", cursor: "pointer", fontSize: "12px", fontWeight: 600, color: C.primary, fontFamily: "inherit", transition: "all 0.2s ease", boxShadow: "0 2px 4px rgba(0,0,0,0.05)", textAlign: "center", minHeight: "40px" }}>
                <a.icon size={16} style={{ flexShrink: 0 }} />
                <span>{a.label}</span>
              </button>
            ))}
          </div>
        </Card>

        {/* Alerts & Reminders Card */}
        <Card>
          <h3 style={{ margin: "0 0 16px 0", fontSize: "16px", fontWeight: 700, color: C.text }}>Alerts & Reminders</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "220px", overflowY: "auto" }}>
            {inventory.filter((i) => i.status === "Critical").map((i) => (
              <div key={i.id} style={{ display: "flex", alignItems: "flex-start", gap: "12px", padding: "12px 14px", background: "#FEF2F2", borderRadius: "12px", borderLeft: `3px solid ${C.danger}`, boxShadow: "inset 0 0 0 1px rgba(239, 68, 68, 0.12)", flexShrink: 0 }}>
                <AlertTriangle size={18} color={C.danger} style={{ marginTop: "2px", flexShrink: 0 }} />
                <div style={{ fontSize: "12px", color: C.text, lineHeight: 1.4 }}><b>{i.item}</b> — Critical ({i.quantity} {i.unit})</div>
              </div>
            ))}
            {inventory.filter((i) => i.status === "Low Stock").map((i) => (
              <div key={i.id} style={{ display: "flex", alignItems: "flex-start", gap: "12px", padding: "12px 14px", background: "#FFFBEB", borderRadius: "12px", borderLeft: `3px solid ${C.warning}`, boxShadow: "inset 0 0 0 1px rgba(245, 158, 11, 0.12)", flexShrink: 0 }}>
                <AlertTriangle size={18} color={C.warning} style={{ marginTop: "2px", flexShrink: 0 }} />
                <div style={{ fontSize: "12px", color: C.text, lineHeight: 1.4 }}><b>{i.item}</b> — Low stock ({i.quantity} {i.unit})</div>
              </div>
            ))}
            <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", padding: "12px 14px", background: "#F0FDF4", borderRadius: "12px", borderLeft: `3px solid ${C.success}`, boxShadow: "inset 0 0 0 1px rgba(16, 185, 129, 0.12)" }}>
              <CheckCircle size={18} color={C.success} style={{ marginTop: "2px", flexShrink: 0 }} />
              <div style={{ fontSize: "12px", color: C.text, lineHeight: 1.4 }}>{children.length} children currently in care</div>
            </div>
          </div>
        </Card>

        {/* Recent Admissions Card */}
        <Card>
          <h3 style={{ margin: "0 0 16px 0", fontSize: "16px", fontWeight: 700, color: C.text }}>Recent Admissions</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxHeight: "220px", overflowY: "auto" }}>
            {children.slice(-4).reverse().map((c) => (
              <div key={c.id} style={{ display: "flex", alignItems: "center", gap: "12px", paddingBottom: "12px", borderBottom: `1px solid ${C.border}` }}>
                <Avatar initials={c.photo} size={36} color={C.primary} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.name}</div>
                  <div style={{ fontSize: "11px", color: C.textLight, marginTop: "3px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Age {c.age} · {c.grade} Grade · {c.admissionDate}</div>
                </div>
                <Badge label={c.healthStatus} color={statusColor(c.healthStatus)} />
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Expenses Card */}
        <Card>
          <h3 style={{ margin: "0 0 16px 0", fontSize: "16px", fontWeight: 700, color: C.text }}>Recent Expenses</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "0", maxHeight: "220px", overflowY: "auto" }}>
            {expenses.slice(0, 4).map((e, idx) => {
              const Icon = catIcons[e.category] || AlertTriangle;
              return (
                <div key={e.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", padding: "12px 0", borderBottom: idx < 3 ? `1px solid ${C.border}` : "none" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1, minWidth: 0 }}>
                    <div style={{ width: "40px", height: "40px", minWidth: "40px", borderRadius: "12px", background: C.primaryLight, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Icon size={16} color={C.primary} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: "12px", fontWeight: 600, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.description}</div>
                      <div style={{ fontSize: "11px", color: C.textLight, marginTop: "2px" }}>{e.date}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: C.text, flexShrink: 0 }}>₹{e.amount.toLocaleString()}</div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
