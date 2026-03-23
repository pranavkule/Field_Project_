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

const StaffDirectory = ({ staff, setStaff }) => {
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", role: "", dept: "", phone: "", email: "", joinDate: "", shift: "Morning" });
  const filtered = staff.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()) || s.role.toLowerCase().includes(search.toLowerCase()));
  const handleAdd = () => {
    if (!form.name || !form.role) return;
    const initials = form.name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
    setStaff((p) => [...p, { ...form, id: p.length + 1, status: "Active", photo: initials }]);
    setShowAdd(false);
    setForm({ name: "", role: "", dept: "", phone: "", email: "", joinDate: "", shift: "Morning" });
  };

  return (
    <div style={{ padding: 32 }}>
      <PageHeader title="Staff Directory" subtitle={`${staff.length} staff members`} action={<Btn label="Add Staff" icon="+" onClick={() => setShowAdd(true)} />} />
      <Card>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search staff..." />
          <div style={{ fontSize: 13, color: C.textMid }}>{filtered.length} members</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))", gap: 16 }}>
          {filtered.map((s) => (
            <div key={s.id} style={{ border: `1px solid ${C.border}`, borderRadius: 14, padding: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                <Avatar initials={s.photo} size={44} color="#8B5CF6" />
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: C.text }}>{s.name}</div>
                  <div style={{ fontSize: 13, color: C.primary, fontWeight: 600 }}>{s.role}</div>
                </div>
              </div>
              {[["📁", s.dept], ["📞", s.phone], ["📧", s.email], ["🕐", `${s.shift} shift`], ["📅", `Joined ${s.joinDate}`]].map(([icon, val]) => (
                <div key={val} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: C.textMid, marginBottom: 5 }}>
                  <span>{icon}</span>
                  <span>{val}</span>
                </div>
              ))}
              <div style={{ marginTop: 12 }}><Badge label={s.status} color={statusColor(s.status)} /></div>
            </div>
          ))}
        </div>
      </Card>

      {showAdd && (
        <Modal title="Add Staff Member" onClose={() => setShowAdd(false)}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Input label="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full name" required />
            <Input label="Role / Designation" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="e.g. Teacher" required />
            <SelectField label="Department" value={form.dept} onChange={(e) => setForm({ ...form, dept: e.target.value })} options={["Child Care", "Education", "Health", "Kitchen", "Welfare", "Admin", "Security"]} />
            <Input label="Phone Number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 XXXXX XXXXX" />
            <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="email@caresync.org" />
            <Input label="Join Date" type="date" value={form.joinDate} onChange={(e) => setForm({ ...form, joinDate: e.target.value })} />
            <SelectField label="Shift" value={form.shift} onChange={(e) => setForm({ ...form, shift: e.target.value })} options={["Morning", "Evening", "Night", "Flexible"]} />
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 24 }}>
            <Btn label="Cancel" variant="ghost" onClick={() => setShowAdd(false)} />
            <Btn label="Add Staff" onClick={handleAdd} />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default StaffDirectory;
