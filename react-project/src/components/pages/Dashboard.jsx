import C from "../../constants/colors";
import { statusColor } from "../../utils/statusColor";
import Card from "../ui/Card";
import Avatar from "../ui/Avatar";
import Badge from "../ui/Badge";

const Dashboard = ({ setPage, children, staff, expenses, inventory }) => {
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const lowStock = inventory.filter(i => i.status === "Low Stock" || i.status === "Critical").length;
  const stats = [
    { label: "Children in Care", value: children.length, icon: "👦", color: C.primary, sub: "Active residents", page: "children" },
    { label: "Total Staff", value: staff.length, icon: "👥", color: "#8B5CF6", sub: "All departments", page: "staff" },
    { label: "Monthly Expenses", value: `₹${totalExpenses.toLocaleString()}`, icon: "💰", color: C.success, sub: "Total expenditure", page: "expenses" },
    { label: "Low Stock Items", value: lowStock, icon: "📦", color: C.warning, sub: "Need restocking", page: "inventory" },
  ];
  const catIcons = { Food: "🍽️", Utilities: "💡", Education: "📚", Medical: "💊", Salaries: "💳", Maintenance: "🔧" };
  return (
    <div style={{ padding: 32 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
        {stats.map((s) => (
          <Card key={s.label} onClick={() => setPage(s.page)} style={{ transition: "box-shadow 0.15s" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: 28, fontWeight: 800, color: C.text, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.textMid, marginTop: 6 }}>{s.label}</div>
                <div style={{ fontSize: 12, color: C.textLight, marginTop: 3 }}>{s.sub}</div>
              </div>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: s.color + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{s.icon}</div>
            </div>
          </Card>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <Card>
          <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 700, color: C.text }}>Quick Actions</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[
              { label: "Add Resident", icon: "👦", page: "children" },
              { label: "Add Staff", icon: "👥", page: "staff" },
              { label: "Log Expense", icon: "💰", page: "expenses" },
              { label: "Update Inventory", icon: "📦", page: "inventory" },
            ].map((a) => (
              <button key={a.label} onClick={() => setPage(a.page)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", background: C.primaryLight, border: "none", borderRadius: 12, cursor: "pointer", fontSize: 13, fontWeight: 600, color: C.primary, fontFamily: "inherit" }}>
                <span style={{ fontSize: 20 }}>{a.icon}</span>{a.label}
              </button>
            ))}
          </div>
        </Card>
        <Card>
          <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 700, color: C.text }}>Alerts & Reminders</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {inventory.filter((i) => i.status === "Critical").map((i) => (
              <div key={i.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: "#FEF2F2", borderRadius: 10, borderLeft: `3px solid ${C.danger}` }}>
                <span>🔴</span>
                <div style={{ fontSize: 13, color: C.text }}><b>{i.item}</b> — Critical ({i.quantity} {i.unit})</div>
              </div>
            ))}
            {inventory.filter((i) => i.status === "Low Stock").map((i) => (
              <div key={i.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: "#FFFBEB", borderRadius: 10, borderLeft: `3px solid ${C.warning}` }}>
                <span>🟡</span>
                <div style={{ fontSize: 13, color: C.text }}><b>{i.item}</b> — Low stock ({i.quantity} {i.unit})</div>
              </div>
            ))}
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: "#F0FDF4", borderRadius: 10, borderLeft: `3px solid ${C.success}` }}>
              <span>🟢</span>
              <div style={{ fontSize: 13, color: C.text }}>{children.length} children currently in care</div>
            </div>
          </div>
        </Card>
        <Card>
          <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 700, color: C.text }}>Recent Admissions</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {children.slice(-4).reverse().map((c) => (
              <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Avatar initials={c.photo} size={36} color={C.primary} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{c.name}</div>
                  <div style={{ fontSize: 12, color: C.textLight }}>Age {c.age} · {c.grade} Grade · {c.admissionDate}</div>
                </div>
                <Badge label={c.healthStatus} color={statusColor(c.healthStatus)} />
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 700, color: C.text }}>Recent Expenses</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {expenses.slice(0, 4).map((e) => (
              <div key={e.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: C.primaryLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>{catIcons[e.category] || "📌"}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{e.description}</div>
                    <div style={{ fontSize: 12, color: C.textLight }}>{e.date}</div>
                  </div>
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>₹{e.amount.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
