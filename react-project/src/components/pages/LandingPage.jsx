import C from "../../constants/colors";
import Btn from "../ui/Btn";
import Card from "../ui/Card";
import { Users, UserCheck, DollarSign, Package, Heart, ClipboardList, Briefcase, Sparkles } from "lucide-react";

const LandingPage = ({ onLogin, onSignup }) => (
  <div style={{ minHeight: "100vh", background: C.white, fontFamily: "inherit" }}>
    <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 60px", height: 64, borderBottom: `1px solid ${C.border}`, position: "sticky", top: 0, background: "rgba(255,255,255,0.96)", backdropFilter: "blur(8px)", zIndex: 100 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 30, height: 30, borderRadius: 8, background: C.primary, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 800, color: C.white }}>CS</div>
        <span style={{ fontSize: 18, fontWeight: 800, color: C.text }}>Care<span style={{ color: C.primary }}>Sync</span></span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Btn label="Register" variant="ghost" onClick={onSignup} />
        <Btn label="Institution Login →" onClick={onLogin} />
      </div>
    </nav>
    <div style={{ padding: "80px 60px 60px", display: "grid", gridTemplateColumns: "1fr", gap: 60, alignItems: "center", maxWidth: 900, margin: "0 auto" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", background: C.primaryLight, borderRadius: 20, marginBottom: 24 }}>
          <Sparkles size={14} color={C.primary} />
          <span style={{ fontSize: 13, color: C.primary, fontWeight: 600 }}>Built for Child Care Institutions</span>
        </div>
        <h1 style={{ fontSize: 52, fontWeight: 900, color: C.text, margin: "0 0 16px", lineHeight: 1.1, letterSpacing: -1.5 }}>Manage care.<br /><span style={{ color: C.primary }}>Stay organized.</span></h1>
        <p style={{ fontSize: 17, color: C.textMid, lineHeight: 1.7, margin: "0 auto 36px", maxWidth: 620 }}>CareSync is the all-in-one record management system for orphanages — track residents, staff, health, attendance, inventory and finances in one place.</p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <Btn label="Institution Login →" onClick={onLogin} />
          <Btn label="Sign Up Free" variant="outline" onClick={onSignup} />
        </div>
      </div>
    </div>
    <div style={{ padding: "60px", background: C.bg }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 style={{ fontSize: 36, fontWeight: 800, color: C.text, margin: "0 0 12px" }}>Everything in one place</h2>
          <p style={{ fontSize: 16, color: C.textMid }}>All the tools you need to run a child care institution efficiently</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
          {[ [Users, "Child Directory", "Complete profiles for every resident with health plans, academic progress, and attendance."], [Heart, "Health Desk", "Log medical visits, vaccinations, maintain health history and follow-up schedules."], [ClipboardList, "Attendance Tracker", "Daily attendance with calendar view and reports. Know who's present at all times."], [UserCheck, "Staff Directory", "Track your team — roles, departments, contact info — in a single organized directory."], [Package, "Inventory & Needs", "Track stock levels and submit needs requests. Never run out of essentials."], [DollarSign, "Expense Tracker", "Full expense tracking with categories. Maintain complete financial transparency."]].map(([Icon, title, desc]) => (
            <Card key={title} style={{ padding: "24px", boxShadow: "0 4px 12px rgba(0,0,0,0.06)", borderRadius: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: C.primaryLight, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                <Icon size={24} color={C.primary} />
              </div>
              <h3 style={{ margin: "0 0 8px", fontSize: 16, fontWeight: 700, color: C.text }}>{title}</h3>
              <p style={{ margin: 0, fontSize: 14, color: C.textMid, lineHeight: 1.6 }}>{desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
    <div style={{ padding: "60px", maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <h2 style={{ fontSize: 36, fontWeight: 800, color: C.text, margin: 0 }}>Who is CareSync for?</h2>
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        {[{ icon: "🏠", title: "Child Care Institutions", desc: "Orphanages and child care homes that want to digitize managing their residents, track health records, attendance, and finances.", points: ["Manage resident records", "Track health & attendance", "Monitor inventory & expenses"] }].map((f) => (
          <Card key={f.title} style={{ padding: 32, width: "100%", maxWidth: 820 }}>
            <div style={{ fontSize: 36, marginBottom: 16 }}>{f.icon}</div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: C.text, margin: "0 0 10px" }}>{f.title}</h3>
            <p style={{ color: C.textMid, fontSize: 15, lineHeight: 1.7, margin: "0 0 16px" }}>{f.desc}</p>
            <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
              {f.points.map((p) => (
                <li key={p} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: C.text }}><span style={{ color: C.success, fontWeight: 700 }}>✓</span> {p}</li>
              ))}
            </ul>
            <Btn label="Institution Login →" onClick={onLogin} />
          </Card>
        ))}
      </div>
    </div>
    <footer style={{ borderTop: `1px solid ${C.border}`, padding: "24px 60px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 24, height: 24, borderRadius: 6, background: C.primary, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: C.white }}>CS</div>
        <span style={{ fontSize: 14, fontWeight: 700, color: C.text }}>CareSync</span>
        <span style={{ fontSize: 13, color: C.textLight }}>— A record management system built for child care institutions.</span>
      </div>
      <div style={{ fontSize: 13, color: C.textLight }}>© 2025 CareSync · Student project</div>
    </footer>
  </div>
);

export default LandingPage;
