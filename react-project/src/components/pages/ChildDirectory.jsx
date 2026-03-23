import { useState } from "react";
import C from "../../constants/colors";
import { statusColor } from "../../utils/statusColor";
import Avatar from "../ui/Avatar";
import Badge from "../ui/Badge";
import Btn from "../ui/Btn";
import Card from "../ui/Card";
import Input from "../ui/Input";
import Modal from "../ui/Modal";
import PageHeader from "../ui/PageHeader";
import SearchBar from "../ui/SearchBar";
import SelectField from "../ui/SelectField";
import { TH, TD } from "../ui/TableCells";

const ChildDirectory = ({ children, setChildren, setPage, setSelectedChild }) => {
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", age: "", gender: "", dob: "", admissionDate: "", grade: "", guardian: "", healthStatus: "Good" });
  const filtered = children.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));
  const handleAdd = () => {
    if (!form.name || !form.age || !form.gender) return;
    const initials = form.name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
    setChildren((p) => [...p, { ...form, id: p.length + 1, status: "Active", photo: initials }]);
    setShowAdd(false);
    setForm({ name: "", age: "", gender: "", dob: "", admissionDate: "", grade: "", guardian: "", healthStatus: "Good" });
  };

  return (
    <div style={{ padding: 32 }}>
      <PageHeader title="Child Directory" subtitle={`${children.length} residents in care`} action={<Btn label="Add Resident" icon="+" onClick={() => setShowAdd(true)} />} />
      <Card>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search children..." />
          <div style={{ fontSize: 13, color: C.textMid }}>{filtered.length} records</div>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>{["Name", "Age", "Gender", "Grade", "Admission Date", "Health Status", "Guardian", ""].map((h) => <TH key={h}>{h}</TH>)}</tr>
          </thead>
          <tbody>
            {filtered.map((c, i) => (
              <tr key={c.id} style={{ borderBottom: `1px solid ${C.border}`, background: i % 2 === 0 ? C.white : "#FAFBFC" }}>
                <TD><div style={{ display: "flex", alignItems: "center", gap: 10 }}><Avatar initials={c.photo} size={32} /><span style={{ fontWeight: 600 }}>{c.name}</span></div></TD>
                <TD style={{ color: C.textMid }}>{c.age} yrs</TD>
                <TD style={{ color: C.textMid }}>{c.gender}</TD>
                <TD style={{ color: C.textMid }}>{c.grade}</TD>
                <TD style={{ color: C.textMid }}>{c.admissionDate}</TD>
                <TD><Badge label={c.healthStatus} color={statusColor(c.healthStatus)} /></TD>
                <TD style={{ color: C.textMid, fontSize: 13 }}>{c.guardian || "—"}</TD>
                <TD>
                  <button onClick={() => { setSelectedChild(c); setPage("childProfile"); }} style={{ padding: "6px 14px", borderRadius: 8, border: `1px solid ${C.border}`, background: C.white, fontSize: 13, color: C.primary, cursor: "pointer", fontWeight: 600, fontFamily: "inherit" }}>
                    View
                  </button>
                </TD>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {showAdd && (
        <Modal title="Add New Resident" onClose={() => setShowAdd(false)}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Input label="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full name" required />
            <Input label="Age" type="number" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} placeholder="Age" required />
            <SelectField label="Gender" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} options={["Male", "Female", "Other"]} required />
            <Input label="Date of Birth" type="date" value={form.dob} onChange={(e) => setForm({ ...form, dob: e.target.value })} />
            <Input label="Admission Date" type="date" value={form.admissionDate} onChange={(e) => setForm({ ...form, admissionDate: e.target.value })} />
            <SelectField label="Grade" value={form.grade} onChange={(e) => setForm({ ...form, grade: e.target.value })} options={["Pre-K", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th", "11th", "12th"]} />
            <Input label="Guardian Name (if any)" value={form.guardian} onChange={(e) => setForm({ ...form, guardian: e.target.value })} placeholder="Name & relation" />
            <SelectField label="Health Status" value={form.healthStatus} onChange={(e) => setForm({ ...form, healthStatus: e.target.value })} options={["Good", "Under Observation", "Needs Attention"]} />
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 24 }}>
            <Btn label="Cancel" variant="ghost" onClick={() => setShowAdd(false)} />
            <Btn label="Add Resident" onClick={handleAdd} />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ChildDirectory;
