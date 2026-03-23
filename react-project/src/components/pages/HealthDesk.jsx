import { useState } from "react";
import C from "../../constants/colors";
import { statusColor } from "../../utils/statusColor";
import Badge from "../ui/Badge";
import Btn from "../ui/Btn";
import Card from "../ui/Card";
import Input from "../ui/Input";
import Modal from "../ui/Modal";
import PageHeader from "../ui/PageHeader";
import { TH, TD } from "../ui/TableCells";
import SelectField from "../ui/SelectField";
import { SAMPLE_HEALTH } from "../../constants/data";

const HealthDesk = ({ children }) => {
  const [records, setRecords] = useState(SAMPLE_HEALTH);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ childName: "", date: "", type: "", doctor: "", notes: "", status: "Pending", followUp: "" });
  const handleAdd = () => {
    if (!form.childName || !form.type) return;
    setRecords((p) => [...p, { ...form, id: p.length + 1 }]);
    setShowAdd(false);
    setForm({ childName: "", date: "", type: "", doctor: "", notes: "", status: "Pending", followUp: "" });
  };

  return (
    <div style={{ padding: 32 }}>
      <PageHeader title="Health Desk" subtitle="Medical records and health tracking" action={<Btn label="Add Record" icon="+" onClick={() => setShowAdd(true)} />} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 24 }}>
        {[["Total Records", records.length, C.primary, "🏥"], ["Pending Follow-ups", records.filter((r) => r.status === "Pending Treatment").length, C.warning, "⏳"], ["Resolved Cases", records.filter((r) => r.status === "Resolved" || r.status === "Completed").length, C.success, "✅"]].map(([l, v, c, icon]) => (
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
          <thead>
            <tr>{["Child", "Date", "Type", "Doctor", "Notes", "Status", "Follow-up"].map((h) => <TH key={h}>{h}</TH>)}</tr>
          </thead>
          <tbody>
            {records.map((r, i) => (
              <tr key={r.id} style={{ borderBottom: `1px solid ${C.border}`, background: i % 2 === 0 ? C.white : "#FAFBFC" }}>
                <TD style={{ fontWeight: 600 }}>{r.childName}</TD>
                <TD style={{ color: C.textMid, fontSize: 13 }}>{r.date}</TD>
                <TD style={{ color: C.textMid, fontSize: 13 }}>{r.type}</TD>
                <TD style={{ color: C.textMid, fontSize: 13 }}>{r.doctor}</TD>
                <TD style={{ color: C.textMid, fontSize: 13, maxWidth: 200 }}>{r.notes}</TD>
                <TD><Badge label={r.status} color={statusColor(r.status)} /></TD>
                <TD style={{ color: C.textMid, fontSize: 13 }}>{r.followUp || "None"}</TD>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      {showAdd && (
        <Modal title="Add Health Record" onClose={() => setShowAdd(false)}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <SelectField label="Child Name" value={form.childName} onChange={(e) => setForm({ ...form, childName: e.target.value })} options={children.map((c) => c.name)} required />
            <Input label="Date" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            <SelectField label="Type" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} options={["Routine Checkup", "Vaccination", "Dental", "Eye Test", "Emergency", "Mental Health"]} required />
            <Input label="Doctor / Nurse" value={form.doctor} onChange={(e) => setForm({ ...form, doctor: e.target.value })} placeholder="Name" />
            <div style={{ gridColumn: "span 2" }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Notes</label>
              <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Medical notes..." style={{ width: "100%", padding: "10px 14px", border: `1.5px solid ${C.border}`, borderRadius: 10, fontSize: 14, fontFamily: "inherit", resize: "vertical", minHeight: 80, boxSizing: "border-box" }} />
            </div>
            <SelectField label="Status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} options={["Pending", "Pending Treatment", "Completed", "Resolved"]} />
            <Input label="Follow-up Date" type="date" value={form.followUp} onChange={(e) => setForm({ ...form, followUp: e.target.value })} />
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 24 }}>
            <Btn label="Cancel" variant="ghost" onClick={() => setShowAdd(false)} />
            <Btn label="Save Record" onClick={handleAdd} />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default HealthDesk;
