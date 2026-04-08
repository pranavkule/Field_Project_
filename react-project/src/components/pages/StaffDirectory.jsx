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
import staffAPI from "../../api/staffService";

const StaffDirectory = ({ staff, setStaff, user }) => {
  const isAdmin = (user?.role || "").toLowerCase() === "admin";
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [form, setForm] = useState({ name: "", role: "", dept: "", phone: "", email: "", joinDate: "", shift: "Morning" });
  const filtered = staff.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()) || s.role.toLowerCase().includes(search.toLowerCase()));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const closeModal = () => {
    setShowAdd(false);
    setEditingStaff(null);
    setError("");
    setForm({ name: "", role: "", dept: "", phone: "", email: "", joinDate: "", shift: "Morning" });
  };

  const openModal = (staffMember = null) => {
    if (staffMember) {
      setEditingStaff(staffMember);
      setForm({
        name: staffMember.name || "",
        role: staffMember.role || "",
        dept: staffMember.dept || "",
        phone: staffMember.phone || "",
        email: staffMember.email || "",
        joinDate: staffMember.joinDate || "",
        shift: staffMember.shift || "Morning",
      });
    } else {
      setEditingStaff(null);
      setForm({ name: "", role: "", dept: "", phone: "", email: "", joinDate: "", shift: "Morning" });
    }

    setError("");
    setShowAdd(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.role) return;
    setLoading(true);
    setError("");

    try {
      const payload = {
        first_name: form.name.split(" ")[0] || form.name,
        last_name: form.name.split(" ").slice(1).join(" ") || "",
        role: form.role,
        contact_number: form.phone,
        email: form.email,
        joining_date: form.joinDate ? new Date(form.joinDate) : null,
        salary: 0,
        status: "Active",
      };

      if (editingStaff) {
        const response = await staffAPI.update(editingStaff.id, payload);
        const updatedStaff = response.data.data;

        setStaff((current) => current.map((item) => item.id === editingStaff.id ? {
          ...item,
          name: `${updatedStaff.first_name || ""} ${updatedStaff.last_name || ""}`.trim(),
          role: updatedStaff.role,
          dept: form.dept,
          phone: updatedStaff.contact_number,
          email: updatedStaff.email,
          joinDate: updatedStaff.joining_date ? new Date(updatedStaff.joining_date).toISOString().split('T')[0] : "",
          shift: form.shift,
          status: updatedStaff.status || item.status,
          photo: `${updatedStaff.first_name || ""} ${updatedStaff.last_name || ""}`.trim().split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2),
        } : item));
      } else {
        const response = await staffAPI.create(payload);
        const newStaff = response.data.data;
        setStaff((p) => [
          ...p,
          {
            id: newStaff.staff_id,
            name: `${newStaff.first_name || ""} ${newStaff.last_name || ""}`.trim(),
            role: newStaff.role,
            dept: form.dept,
            phone: newStaff.contact_number,
            email: newStaff.email,
            joinDate: newStaff.joining_date ? new Date(newStaff.joining_date).toISOString().split('T')[0] : "",
            shift: form.shift,
            status: newStaff.status || "Active",
            photo: form.name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2),
          },
        ]);
      }

      closeModal();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save staff. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this staff member permanently?");
    if (!confirmDelete) return;

    setLoading(true);
    setError("");

    try {
      await staffAPI.delete(id);
      setStaff((p) => p.filter((item) => item.id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete staff. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 32 }}>
      <PageHeader title="Staff Directory" subtitle={`${staff.length} staff members`} action={isAdmin ? <Btn label="Add Staff" icon="+" onClick={() => openModal()} /> : null} />
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
              <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Badge label={s.status} color={statusColor(s.status)} />
                {isAdmin && <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => openModal(s)}
                    style={{
                      border: `1px solid ${C.primary}`,
                      background: C.primary + '10',
                      color: C.primary,
                      fontSize: 12,
                      fontWeight: 700,
                      borderRadius: 8,
                      padding: '5px 10px',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(s.id)}
                    style={{
                      border: `1px solid ${C.danger}`,
                      background: C.danger + '10',
                      color: C.danger,
                      fontSize: 12,
                      fontWeight: 700,
                      borderRadius: 8,
                      padding: '5px 10px',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                    }}
                  >
                    Delete
                  </button>
                </div>}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {showAdd && (
        <Modal title={editingStaff ? "Edit Staff Member" : "Add Staff Member"} onClose={closeModal}>
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
            <Btn label="Cancel" variant="ghost" onClick={closeModal} />
            <Btn label={loading ? "Saving..." : (editingStaff ? "Save Changes" : "Add Staff")} onClick={handleSave} disabled={loading} />
          </div>
          {error && <div style={{ marginTop: 14, color: C.danger, fontSize: 13 }}>{error}</div>}
        </Modal>
      )}
    </div>
  );
};

export default StaffDirectory;
