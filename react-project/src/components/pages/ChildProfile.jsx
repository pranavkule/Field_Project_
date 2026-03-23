import C from "../../constants/colors";
import { statusColor } from "../../utils/statusColor";
import Avatar from "../ui/Avatar";
import Badge from "../ui/Badge";
import Card from "../ui/Card";

const ChildProfile = ({ child, goBack }) => {
  if (!child) return null;

  return (
    <div style={{ padding: 32 }}>
      <button onClick={goBack} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: C.primary, fontWeight: 600, fontSize: 14, cursor: "pointer", marginBottom: 20, fontFamily: "inherit" }}>
        ← Back to Child Directory
      </button>
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
          <Card>
            <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 700, color: C.text }}>Academic Progress</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
              {[["Mathematics", "85%"], ["Science", "78%"], ["English", "92%"], ["Social Studies", "80%"], ["Art", "95%"],].map(([s, g]) => (
                <div key={s} style={{ padding: "12px 14px", background: C.bg, borderRadius: 10 }}>
                  <div style={{ fontSize: 12, color: C.textMid, fontWeight: 600 }}>{s}</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: C.primary, marginTop: 4 }}>{g}</div>
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 700, color: C.text }}>Attendance Overview</h3>
            <div style={{ display: "flex", gap: 16 }}>
              {[["Days Present", "142", C.success], ["Days Absent", "8", C.danger], ["Attendance Rate", "94.7%", C.primary]].map(([l, v, c]) => (
                <div key={l} style={{ flex: 1, padding: 16, background: c + "12", borderRadius: 12, textAlign: "center" }}>
                  <div style={{ fontSize: 26, fontWeight: 800, color: c }}>{v}</div>
                  <div style={{ fontSize: 12, color: C.textMid, marginTop: 4 }}>{l}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ChildProfile;
