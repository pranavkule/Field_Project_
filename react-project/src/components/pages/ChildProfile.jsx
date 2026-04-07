import { useEffect, useState } from "react";
import C from "../../constants/colors";
import { statusColor } from "../../utils/statusColor";
import Avatar from "../ui/Avatar";
import Badge from "../ui/Badge";
import Btn from "../ui/Btn";
import Card from "../ui/Card";
import Input from "../ui/Input";
import Modal from "../ui/Modal";
import SelectField from "../ui/SelectField";
import childAPI from "../../api/childService";

const ChildProfile = ({ child, goBack, user, setChildren, setSelectedChild }) => {
  const isAdmin = (user?.role || "").toLowerCase() === "admin";
  const [showEdit, setShowEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    gender: "",
    date_of_birth: "",
    admission_date: "",
    status: "",
    guardian_name: "",
    guardian_contact: "",
    address: "",
    blood_group: "",
    medical_condition: "",
    education_level: "",
  });

  useEffect(() => {
    if (!child) return;

    setForm({
      first_name: child.first_name || child.name?.split(" ")[0] || "",
      last_name: child.last_name || child.name?.split(" ").slice(1).join(" ") || "",
      gender: child.gender || "",
      date_of_birth: child.date_of_birth || child.dob || "",
      admission_date: child.admission_date || child.admissionDate || "",
      status: child.status || "Active",
      guardian_name: child.guardian_name || child.guardian || "",
      guardian_contact: child.guardian_contact || "",
      address: child.address || "",
      blood_group: child.blood_group || "",
      medical_condition: child.medical_condition || "",
      education_level: child.education_level || child.grade || "",
    });
  }, [child]);

  if (!child) return null;

  const handleSave = async () => {
    if (!form.first_name || !form.last_name || !form.gender || !form.date_of_birth || !form.status || !form.blood_group || !form.medical_condition) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await childAPI.update(child.id, {
        first_name: form.first_name,
        last_name: form.last_name,
        gender: form.gender,
        date_of_birth: form.date_of_birth,
        admission_date: form.admission_date,
        status: form.status,
        guardian_name: form.guardian_name,
        guardian_contact: form.guardian_contact,
        address: form.address,
        blood_group: form.blood_group,
        medical_condition: form.medical_condition,
        education_level: form.education_level,
      });

      const updatedChild = response.data.data;
      const mappedChild = {
        ...child,
        id: updatedChild.child_id,
        child_id: updatedChild.child_id,
        first_name: updatedChild.first_name,
        last_name: updatedChild.last_name,
        name: `${updatedChild.first_name || ""} ${updatedChild.last_name || ""}`.trim(),
        gender: updatedChild.gender,
        date_of_birth: updatedChild.date_of_birth ? new Date(updatedChild.date_of_birth).toISOString().split("T")[0] : updatedChild.date_of_birth,
        admission_date: updatedChild.admission_date ? new Date(updatedChild.admission_date).toISOString().split("T")[0] : updatedChild.admission_date,
        status: updatedChild.status,
        guardian_name: updatedChild.guardian_name,
        guardian_contact: updatedChild.guardian_contact,
        address: updatedChild.address,
        blood_group: updatedChild.blood_group,
        medical_condition: updatedChild.medical_condition,
        education_level: updatedChild.education_level,
        photo: ((updatedChild.first_name || "").slice(0, 1) + (updatedChild.last_name || "").slice(0, 1)).toUpperCase(),
      };

      setChildren?.((current) => current.map((item) => (item.id === child.id ? mappedChild : item)));
      setSelectedChild?.(mappedChild);
      setShowEdit(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update resident. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!child) return null;

  return (
    <div style={{ padding: 32 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, marginBottom: 20 }}>
        <button onClick={goBack} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: C.primary, fontWeight: 600, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>
          ← Back to Child Directory
        </button>
        {isAdmin && <Btn label="Edit Info" variant="outline" onClick={() => setShowEdit(true)} />}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 20 }}>
        <Card style={{ alignSelf: "start", textAlign: "center" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}><Avatar initials={child.photo} size={80} color={C.primary} /></div>
          <h2 style={{ margin: "0 0 8px", fontSize: 20, fontWeight: 800, color: C.text }}>{child.name}</h2>
          <Badge label={child.status} color={statusColor(child.status)} />
          <div style={{ marginTop: 20, textAlign: "left", display: "flex", flexDirection: "column", gap: 14 }}>
            {[["Age", `${child.age} years`], ["Gender", child.gender], ["Grade", child.grade || "—"], ["Date of Birth", child.dob || "—"], ["Admission Date", child.admissionDate || "—"], ["Guardian", child.guardian || "None"]].map(([l, v]) => (
              <div key={l}>
                <div style={{ fontSize: 11, color: C.textLight, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>{l}</div>
                <div style={{ fontSize: 14, color: C.text, fontWeight: 500, marginTop: 2 }}>{v}</div>
              </div>
            ))}
          </div>
        </Card>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Card>
            <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 700, color: C.text }}>Health Information</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {[["Current Status", <Badge key="health" label={child.healthStatus} color={statusColor(child.healthStatus)} />], ["Blood Group", "B+"], ["Allergies", "None recorded"], ["Medications", "None"], ["Last Checkup", "2024-03-15"], ["Next Checkup", "2024-04-15"]].map(([l, v]) => (
                <div key={l}>
                  <div style={{ fontSize: 11, color: C.textLight, fontWeight: 700, textTransform: "uppercase" }}>{l}</div>
                  <div style={{ fontSize: 14, color: C.text, marginTop: 4 }}>{v}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {showEdit && isAdmin && (
        <Modal title="Edit Resident Info" onClose={() => setShowEdit(false)}>
          {error && <div style={{ background: "#FEF2F2", color: C.danger, padding: "10px 14px", borderRadius: 10, fontSize: 13, marginBottom: 16 }}>{error}</div>}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Input label="First Name *" value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} required />
            <Input label="Last Name *" value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} required />
            <SelectField label="Gender *" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} options={['Male', 'Female', 'Other']} required />
            <Input label="Date of Birth *" type="date" value={form.date_of_birth} onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })} required />
            <Input label="Admission Date" type="date" value={form.admission_date} onChange={(e) => setForm({ ...form, admission_date: e.target.value })} />
            <SelectField label="Status *" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} options={['Active', 'Inactive', 'Graduated']} required />
            <Input label="Blood Group *" value={form.blood_group} onChange={(e) => setForm({ ...form, blood_group: e.target.value })} required />
            <Input label="Medical Condition *" value={form.medical_condition} onChange={(e) => setForm({ ...form, medical_condition: e.target.value })} required />
            <Input label="Guardian Name" value={form.guardian_name} onChange={(e) => setForm({ ...form, guardian_name: e.target.value })} />
            <Input label="Guardian Contact" value={form.guardian_contact} onChange={(e) => setForm({ ...form, guardian_contact: e.target.value })} />
            <Input label="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            <Input label="Education Level" value={form.education_level} onChange={(e) => setForm({ ...form, education_level: e.target.value })} />
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 24 }}>
            <Btn label="Cancel" variant="ghost" onClick={() => setShowEdit(false)} />
            <Btn label={loading ? "Saving..." : "Save Changes"} onClick={handleSave} disabled={loading} />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ChildProfile;
