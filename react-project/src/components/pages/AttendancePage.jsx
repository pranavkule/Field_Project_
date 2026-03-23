import { useState } from "react";
import C from "../../constants/colors";
import { statusColor } from "../../utils/statusColor";
import Avatar from "../ui/Avatar";
import Badge from "../ui/Badge";
import Card from "../ui/Card";
import PageHeader from "../ui/PageHeader";
import { TH, TD } from "../ui/TableCells";

const AttendancePage = ({ staff }) => {
  const today = new Date().toISOString().split("T")[0];
  const [attendance, setAttendance] = useState(() =>
    staff.map((s) => ({ id: s.id, name: s.name, role: s.role, dept: s.dept, shift: s.shift, status: Math.random() > 0.1 ? "Present" : "Absent" }))
  );
  const toggle = (id) => setAttendance((p) => p.map((a) => (a.id === id ? { ...a, status: a.status === "Present" ? "Absent" : "Present" } : a)));
  const present = attendance.filter((a) => a.status === "Present").length;

  return (
    <div style={{ padding: 32 }}>
      <PageHeader title="Staff Attendance" subtitle={`Today — ${today}`} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 24 }}>
        {[["Present Today", present, C.success, "✅"], ["Absent Today", attendance.length - present, C.danger, "❌"], ["Attendance Rate", `${Math.round((present / attendance.length) * 100)}%`, C.primary, "📊"]].map(([l, v, c, icon]) => (
          <Card key={l} style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: c + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{icon}</div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 800, color: C.text }}>{v}</div>
              <div style={{ fontSize: 13, color: C.textMid }}>{l}</div>
            </div>
          </Card>
        ))}
      </div>
      <Card>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr>{["Staff Member", "Department", "Role", "Shift", "Status", "Action"].map((h) => <TH key={h}>{h}</TH>)}</tr></thead>
          <tbody>
            {attendance.map((a, i) => (
              <tr key={a.id} style={{ borderBottom: `1px solid ${C.border}`, background: i % 2 === 0 ? C.white : "#FAFBFC" }}>
                <TD><div style={{ display: "flex", alignItems: "center", gap: 10 }}><Avatar initials={a.name.split(" ").map((w) => w[0]).join("").slice(0, 2)} size={32} color="#8B5CF6" /><span style={{ fontWeight: 600 }}>{a.name}</span></div></TD>
                <TD style={{ color: C.textMid, fontSize: 13 }}>{a.dept}</TD>
                <TD style={{ color: C.textMid, fontSize: 13 }}>{a.role}</TD>
                <TD style={{ color: C.textMid, fontSize: 13 }}>{a.shift}</TD>
                <TD><Badge label={a.status} color={statusColor(a.status)} /></TD>
                <TD>
                  <button onClick={() => toggle(a.id)} style={{ padding: "6px 14px", borderRadius: 8, border: "none", background: a.status === "Present" ? "#FEF2F2" : "#F0FDF4", color: a.status === "Present" ? C.danger : C.success, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                    Mark {a.status === "Present" ? "Absent" : "Present"}
                  </button>
                </TD>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

export default AttendancePage;
