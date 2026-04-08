import { useState, useEffect } from "react";
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
import healthAPI from "../../api/healthService";
import { Heart, Clock, CheckCircle, Plus } from "lucide-react";

const HealthDesk = ({ children, healthRecords, setHealthRecords, user }) => {
  const isAdmin = (user?.role || "").toLowerCase() === "admin";
  const [records, setRecords] = useState(healthRecords || []);
  const [showAdd, setShowAdd] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ childId: "", date: "", type: "", doctor: "", notes: "", status: "Pending", followUp: "" });

  useEffect(() => {
    setRecords(healthRecords || []);
  }, [healthRecords]);

  const resetForm = () => {
    setShowAdd(false);
    setEditingRecord(null);
    setError("");
    setForm({ childId: "", date: "", type: "", doctor: "", notes: "", status: "Pending", followUp: "" });
  };

  const openRecordForm = (record = null) => {
    if (record) {
      setEditingRecord(record);
      setForm({
        childId: record.childId || "",
        date: record.date || "",
        type: record.type || "",
        doctor: record.doctor || "",
        notes: record.notes || "",
        status: record.status || "Pending",
        followUp: record.followUp || "",
      });
    } else {
      setEditingRecord(null);
      setForm({ childId: "", date: "", type: "", doctor: "", notes: "", status: "Pending", followUp: "" });
    }
    setError("");
    setShowAdd(true);
  };
  
  const handleSave = async () => {
    if (!form.childId || !form.type) {
      setError("Please select a child and type of health record.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const payload = {
        child_id: form.childId,
        record_date: form.date ? new Date(form.date).toISOString() : new Date().toISOString(),
        weight: 0,
        height: 0,
        temperature: 0,
        blood_pressure: `${form.type} (${form.doctor || 'N/A'})`,
        pulse: 0,
        medical_notes: `Notes: ${form.notes || 'N/A'} | Status: ${form.status} | Follow-up: ${form.followUp || 'N/A'}`,
      };

      if (editingRecord) {
        const response = await healthAPI.update(editingRecord.id, payload);
        const updatedRecord = response.data.data;
        const mappedRecord = {
          ...editingRecord,
          id: updatedRecord.health_id,
          childId: updatedRecord.child_id,
          childName: children.find((c) => c.id === updatedRecord.child_id)?.name || editingRecord.childName || "Unknown",
          date: updatedRecord.record_date ? new Date(updatedRecord.record_date).toISOString().split('T')[0] : form.date,
          type: form.type,
          doctor: form.doctor,
          notes: form.notes,
          status: form.status,
          followUp: form.followUp,
        };

        setHealthRecords((current) => current.map((item) => item.id === editingRecord.id ? mappedRecord : item));
        setRecords((current) => current.map((item) => item.id === editingRecord.id ? mappedRecord : item));
      } else {
        const response = await healthAPI.logVitals(payload);
        const newRecord = {
          id: response.data.data.health_id,
          childId: response.data.data.child_id,
          childName: children.find((c) => c.id === response.data.data.child_id)?.name || "Unknown",
          date: new Date(response.data.data.record_date).toISOString().split('T')[0],
          type: form.type,
          doctor: form.doctor,
          notes: form.notes,
          status: form.status,
          followUp: form.followUp,
        };

        setHealthRecords((p) => [newRecord, ...p]);
        setRecords((p) => [newRecord, ...p]);
      }

      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save health record. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const displayRecords = records.map((record) => ({
    ...record,
    childName: record.childName || children.find((c) => c.id === record.childId)?.name || `Child ${record.childId?.slice?.(0, 8) || "Unknown"}`,
  }));

  const filteredRecords = displayRecords.filter((record) => record.childName.trim().toLowerCase() !== "unknown");

  return (
    <div style={{ padding: 32 }}>
      <PageHeader title="Health Desk" subtitle="Medical records and health tracking" action={isAdmin ? <Btn label="Add Record" icon={<Plus size={16} />} onClick={() => openRecordForm()} /> : null} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 24 }}>
        {[[Heart, "Total Records", filteredRecords.length, C.primary], [Clock, "Pending Follow-ups", filteredRecords.filter((r) => r.status === "Pending Treatment").length, C.warning], [CheckCircle, "Resolved Cases", filteredRecords.filter((r) => r.status === "Resolved" || r.status === "Completed").length, C.success]].map(([Icon, l, v, c]) => (
          <Card key={l} style={{ display: "flex", alignItems: "center", gap: 14, padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", borderRadius: 16 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: c + "18", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon size={22} color={c} />
            </div>
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
            <tr>{["Child", "Date", "Type", "Doctor", "Notes", "Status", "Follow-up", ...(isAdmin ? [""] : [])].map((h) => <TH key={h || 'actions'}>{h}</TH>)}</tr>
          </thead>
          <tbody>
            {filteredRecords.map((r, i) => (
              <tr key={r.id} style={{ borderBottom: `1px solid ${C.border}`, background: i % 2 === 0 ? C.white : "#FAFBFC" }}>
                <TD style={{ fontWeight: 600 }}>{r.childName || children.find((c) => c.id === r.childId)?.name}</TD>
                <TD style={{ color: C.textMid, fontSize: 13 }}>{r.date}</TD>
                <TD style={{ color: C.textMid, fontSize: 13 }}>{r.type}</TD>
                <TD style={{ color: C.textMid, fontSize: 13 }}>{r.doctor}</TD>
                <TD style={{ color: C.textMid, fontSize: 13, maxWidth: 200 }}>{r.notes}</TD>
                <TD><Badge label={r.status} color={statusColor(r.status)} /></TD>
                <TD style={{ color: C.textMid, fontSize: 13 }}>{r.followUp || "None"}</TD>
                {isAdmin && <TD style={{ textAlign: "right" }}><button onClick={() => openRecordForm(r)} style={{ border: `1px solid ${C.primary}`, background: C.primary + '10', color: C.primary, fontSize: 12, fontWeight: 700, borderRadius: 8, padding: '5px 10px', cursor: 'pointer', fontFamily: 'inherit' }}>Edit</button></TD>}
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      {showAdd && isAdmin && (
        <Modal title={editingRecord ? "Edit Health Record" : "Add Health Record"} onClose={resetForm}>
          {error && <div style={{ background: "#FEF2F2", color: C.danger, padding: "10px 14px", borderRadius: 10, fontSize: 13, marginBottom: 16 }}>{error}</div>}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <SelectField
              label="Child Name"
              value={form.childId}
              onChange={(e) => setForm({ ...form, childId: e.target.value })}
              options={children.map((c) => ({ value: c.id, label: c.name || `${c.first_name || ''} ${c.last_name || ''}`.trim() }))}
              required
            />
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
            <Btn label="Cancel" variant="ghost" onClick={resetForm} />
            <Btn label={loading ? (editingRecord ? "Saving..." : "Saving...") : (editingRecord ? "Save Changes" : "Save Record")} onClick={handleSave} disabled={loading} />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default HealthDesk;
