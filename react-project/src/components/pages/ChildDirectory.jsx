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
import childAPI from "../../api/childService";

const ChildDirectory = ({ children, setChildren, setPage, setSelectedChild }) => {
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    gender: "",
    date_of_birth: "",
    admission_date: "",
    status: "Active",
    guardian_name: "",
    guardian_contact: "",
    address: "",
    blood_group: "",
    medical_condition: "",
    education_level: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const filtered = children.filter((c) => 
    (c.first_name?.toLowerCase().includes(search.toLowerCase())) || 
    (c.last_name?.toLowerCase().includes(search.toLowerCase()))
  );
  
  const handleAdd = async () => {
    if (!form.first_name || !form.last_name || !form.gender || !form.date_of_birth || !form.status || !form.blood_group || !form.medical_condition) {
      setError("Please fill in all required fields");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      // Send exact field names the backend expects (snake_case)
      const childData = {
        first_name: form.first_name,
        last_name: form.last_name,
        gender: form.gender,
        date_of_birth: form.date_of_birth,
        admission_date: form.admission_date,
        status: form.status,
        guardian_name: form.guardian_name || "", // Optional for unknown parents
        guardian_contact: form.guardian_contact || "", // Optional for unknown parents
        address: form.address || "", // Optional
        blood_group: form.blood_group,
        medical_condition: form.medical_condition,
        education_level: form.education_level || "",
      };
      
      // Call backend API
      const response = await childAPI.create(childData);
      
      // Add returned child to local state
      const newChild = response.data.data;
      const initials = (newChild.first_name + " " + newChild.last_name).split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
      setChildren((p) => [...p, {
        id: newChild.child_id,
        child_id: newChild.child_id,
        ...newChild,
        photo: initials
      }]);
      
      // Reset form and close modal
      setShowAdd(false);
      setForm({
        first_name: "",
        last_name: "",
        gender: "",
        date_of_birth: "",
        admission_date: "",
        status: "Active",
        guardian_name: "",
        guardian_contact: "",
        address: "",
        blood_group: "",
        medical_condition: "",
        education_level: "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add resident. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this resident permanently? This action cannot be undone.");
    if (!confirmDelete) return;

    setLoading(true);
    setError("");

    try {
      await childAPI.delete(id);
      setChildren((p) => p.filter((c) => c.id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete resident. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 32 }}>
      <PageHeader title="Child Directory" subtitle={`${children.length} residents in care`} action={<Btn label="Add Resident" icon="+" onClick={() => setShowAdd(true)} />} />
      <Card>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search children..." />
          <div style={{ fontSize: 13, color: C.textMid }}>{filtered.length} records</div>
        </div>
        {error && <div style={{ marginBottom: 14, color: C.danger, fontWeight: 700 }}>{error}</div>}
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>{["Name", "Gender", "DOB", "Admission Date", "Status", "Guardian", "Contact", ""].map((h) => <TH key={h}>{h}</TH>)}</tr>
          </thead>
          <tbody>
            {filtered.map((c, i) => (
              <tr key={c.id} style={{ borderBottom: `1px solid ${C.border}`, background: i % 2 === 0 ? C.white : "#FAFBFC" }}>
                <TD><div style={{ display: "flex", alignItems: "center", gap: 10 }}><Avatar initials={c.photo} size={32} /><span style={{ fontWeight: 600 }}>{c.first_name} {c.last_name}</span></div></TD>
                <TD style={{ color: C.textMid }}>{c.gender}</TD>
                <TD style={{ color: C.textMid }}>{new Date(c.date_of_birth).toLocaleDateString()}</TD>
                <TD style={{ color: C.textMid }}>{new Date(c.admission_date).toLocaleDateString()}</TD>
                <TD><Badge label={c.status} color={statusColor(c.status)} /></TD>
                <TD style={{ color: C.textMid, fontSize: 13 }}>{c.guardian_name || "—"}</TD>
                <TD style={{ color: C.textMid, fontSize: 13 }}>{c.guardian_contact || "—"}</TD>
                <TD style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button onClick={() => { setSelectedChild(c); setPage("childProfile"); }} style={{ padding: "6px 14px", borderRadius: 8, border: `1px solid ${C.border}`, background: C.white, fontSize: 13, color: C.primary, cursor: "pointer", fontWeight: 600, fontFamily: "inherit" }}>
                    View
                  </button>
                  <button onClick={() => handleDelete(c.id)} style={{ padding: "6px 14px", borderRadius: 8, border: `1px solid ${C.danger}`, background: C.danger + '10', color: C.danger, fontSize: 13, cursor: "pointer", fontWeight: 600, fontFamily: "inherit" }}>
                    Delete
                  </button>
                </TD>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {showAdd && (
        <Modal title="Add New Resident" onClose={() => setShowAdd(false)}>
          {error && <div style={{ background: "#FEF2F2", color: C.danger, padding: "10px 14px", borderRadius: 10, fontSize: 13, marginBottom: 16 }}>{error}</div>}
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "1fr 1fr", 
            gap: 16, 
            maxHeight: "70vh", 
            overflowY: "auto", 
            paddingRight: 8,
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
          className="hide-scrollbar">
            <Input label="First Name *" value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} placeholder="First name" required />
            <Input label="Last Name *" value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} placeholder="Last name" required />
            <SelectField label="Gender *" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} options={["Male", "Female", "Other"]} required />
            <Input label="Date of Birth *" type="date" value={form.date_of_birth} onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })} required />
            <Input label="Admission Date" type="date" value={form.admission_date} onChange={(e) => setForm({ ...form, admission_date: e.target.value })} />
            <SelectField label="Status *" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} options={["Active", "Inactive", "Graduated"]} required />
            <Input label="Blood Group *" value={form.blood_group} onChange={(e) => setForm({ ...form, blood_group: e.target.value })} placeholder="e.g., O+, A-" required />
            <Input label="Medical Condition *" value={form.medical_condition} onChange={(e) => setForm({ ...form, medical_condition: e.target.value })} placeholder="e.g., None, Asthma" required />
            <Input label="Guardian Name (Optional)" value={form.guardian_name} onChange={(e) => setForm({ ...form, guardian_name: e.target.value })} placeholder="Unknown if parents deceased" />
            <Input label="Guardian Contact (Optional)" value={form.guardian_contact} onChange={(e) => setForm({ ...form, guardian_contact: e.target.value })} placeholder="Phone number" />
            <Input label="Address (Optional)" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Street address" />
            <SelectField label="Education Level" value={form.education_level} onChange={(e) => setForm({ ...form, education_level: e.target.value })} options={["Pre-K", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th", "11th", "12th"]} />
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 24 }}>
            <Btn label="Cancel" variant="ghost" onClick={() => setShowAdd(false)} />
            <Btn label={loading ? "Adding..." : "Add Resident"} onClick={handleAdd} disabled={loading} />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ChildDirectory;
