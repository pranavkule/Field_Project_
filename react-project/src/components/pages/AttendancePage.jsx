import { useMemo, useState } from "react";
import C from "../../constants/colors";
import { statusColor } from "../../utils/statusColor";
import Avatar from "../ui/Avatar";
import Badge from "../ui/Badge";
import Card from "../ui/Card";
import PageHeader from "../ui/PageHeader";

const statusOptions = ["Present", "Absent", "On Leave"];

const AttendancePage = ({ staff }) => {
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];
  const staffList = staff || [];
  const initialId = staffList[0]?.id || "";

  const [markOpen, setMarkOpen] = useState(false);
  const [markQuery, setMarkQuery] = useState("");
  const [markStaffId, setMarkStaffId] = useState(initialId);
  const [markStatus, setMarkStatus] = useState("Present");
  const [markDate, setMarkDate] = useState(todayStr);

  const [historyQuery, setHistoryQuery] = useState("");
  const [historyStaffId, setHistoryStaffId] = useState(initialId);
  const [historyDropdownOpen, setHistoryDropdownOpen] = useState(false);
  const [message, setMessage] = useState("");

  const [attendanceRecords, setAttendanceRecords] = useState(() => {
    return staffList.flatMap((person, staffIndex) => {
      return Array.from({ length: 12 }).map((_, idx) => {
        const date = new Date(today);
        date.setDate(today.getDate() - idx * 3 - staffIndex);
        const isoDate = date.toISOString().split("T")[0];
        const status = idx % 6 === 0 ? "Absent" : idx % 5 === 0 ? "On Leave" : "Present";
        return {
          recordId: `${person.id}-${isoDate}`,
          staffId: person.id,
          name: person.name,
          role: person.role,
          dept: person.dept,
          date: isoDate,
          status,
        };
      });
    });
  });

  const selectedHistoryStaff = staffList.find((s) => s.id === historyStaffId) || staffList[0] || {};
  const selectedMarkStaff = staffList.find((s) => s.id === markStaffId) || staffList[0] || {};

  const markSuggestions = staffList.filter((s) => s.name.toLowerCase().includes(markQuery.toLowerCase())).slice(0, 6);
  const historySuggestions = historyDropdownOpen
    ? staffList.filter((s) => s.name.toLowerCase().includes(historyQuery.toLowerCase()))
    : staffList.filter((s) => s.name.toLowerCase().includes(historyQuery.toLowerCase())).slice(0, 6);

  const historyRecords = useMemo(() => {
    return attendanceRecords
      .filter((record) => record.staffId === historyStaffId)
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [attendanceRecords, historyStaffId]);

  const employeeAttendanceRate = useMemo(() => {
    const grouped = {};
    historyRecords.forEach((record) => {
      const monthKey = new Date(record.date).toLocaleDateString("en-US", { month: "short", year: "2-digit" });
      if (!grouped[monthKey]) grouped[monthKey] = { present: 0, total: 0 };
      grouped[monthKey].total += 1;
      if (record.status === "Present") grouped[monthKey].present += 1;
    });

    const labels = Array.from({ length: 6 }).map((_, idx) => {
      const month = new Date(today.getFullYear(), today.getMonth() - (5 - idx), 1);
      return month.toLocaleDateString("en-US", { month: "short" });
    });

    return labels.map((label) => {
      const key = Object.keys(grouped).find((k) => k.startsWith(label));
      const data = grouped[key] || { present: 0, total: 0 };
      const percentage = data.total ? Math.round((data.present / data.total) * 100) : 0;
      return { label, percentage };
    });
  }, [historyRecords, today]);

  const teamTodayStatus = useMemo(() => {
    return staffList.map((person) => {
      const todayRecord = attendanceRecords.find((record) => record.staffId === person.id && record.date === todayStr);
      return { ...person, status: todayRecord?.status || "Not marked" };
    });
  }, [attendanceRecords, staffList, todayStr]);

  const presentCount = teamTodayStatus.filter((item) => item.status === "Present").length;
  const absentCount = teamTodayStatus.filter((item) => item.status === "Absent").length;
  const notMarkedCount = teamTodayStatus.filter((item) => item.status === "Not marked").length;
  const attendanceRate = staffList.length ? Math.round((presentCount / staffList.length) * 100) : 0;

  const handleMarkAttendance = () => {
    if (!markStaffId) {
      setMessage("Select an employee before marking attendance.");
      return;
    }

    setAttendanceRecords((prev) => {
      const existingIndex = prev.findIndex((record) => record.staffId === markStaffId && record.date === markDate);
      const updated = [...prev];
      if (existingIndex >= 0) {
        updated[existingIndex] = { ...updated[existingIndex], status: markStatus };
      } else {
        updated.unshift({
          recordId: `${markStaffId}-${markDate}`,
          staffId: markStaffId,
          name: selectedMarkStaff.name,
          role: selectedMarkStaff.role,
          dept: selectedMarkStaff.dept,
          date: markDate,
          status: markStatus,
        });
      }
      return updated;
    });

    setMessage(`Attendance marked for ${selectedMarkStaff.name} on ${markDate}.`);
    setMarkOpen(false);
  };

  return (
    <div style={{ padding: "20px 32px", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
        <PageHeader title="Staff Attendance" subtitle={`Today — ${todayStr}`} />
        <button
          onClick={() => setMarkOpen((open) => !open)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "12px 20px",
            background: C.primary,
            color: C.white,
            border: "none",
            borderRadius: 12,
            fontWeight: 700,
            fontSize: "14px",
            cursor: "pointer",
            boxShadow: "0 16px 40px rgba(36, 107, 253, 0.18)",
            flexShrink: 0,
          }}
        >
          Mark Attendance
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "65% 35%", gap: 20, marginTop: 20 }}>
        <Card style={{ minHeight: 520, padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 24 }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: C.text }}>Employee history</div>
              <div style={{ color: C.textMid, fontSize: 13, marginTop: 6 }}>Search a staff member and review their attendance history.</div>
            </div>
            <div style={{ minWidth: 240, flex: 1, maxWidth: 360 }}>
              <label style={{ display: "block", marginBottom: 10, fontSize: 13, fontWeight: 700, color: C.text }}>Select employee</label>
              <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 10 }}>
                <input
                  value={historyQuery || selectedHistoryStaff.name || ""}
                  onChange={(e) => {
                    setHistoryQuery(e.target.value);
                    setHistoryStaffId("");
                    setHistoryDropdownOpen(false);
                  }}
                  placeholder="Search employee..."
                  style={{
                    flex: 1,
                    padding: "12px 16px",
                    borderRadius: 14,
                    border: `1.5px solid ${C.border}`,
                    outline: "none",
                    fontSize: 14,
                    color: C.text,
                    background: C.white,
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    setHistoryDropdownOpen((open) => !open);
                    setHistoryQuery("");
                    setHistoryStaffId("");
                  }}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 44,
                    height: 44,
                    borderRadius: 14,
                    border: `1.5px solid ${C.border}`,
                    background: C.white,
                    cursor: "pointer",
                    fontSize: 16,
                    color: C.text,
                  }}
                >
                  ▼
                </button>
                {(historyQuery || historyDropdownOpen || historySuggestions.length > 0) && (
                  <div style={{ position: "absolute", top: 52, left: 0, right: 0, background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, maxHeight: 220, overflowY: "auto", zIndex: 5, boxShadow: "0 24px 40px rgba(15, 23, 42, 0.08)" }}>
                    {historySuggestions.length ? (
                      historySuggestions.map((staffMember) => (
                        <button
                          key={staffMember.id}
                          type="button"
                          onClick={() => {
                            setHistoryStaffId(staffMember.id);
                            setHistoryQuery(staffMember.name);
                            setHistoryDropdownOpen(false);
                          }}
                          style={{
                            width: "100%",
                            textAlign: "left",
                            padding: "12px 16px",
                            border: "none",
                            background: "transparent",
                            cursor: "pointer",
                            color: C.text,
                          }}
                        >
                          {staffMember.name}
                          <div style={{ fontSize: 12, color: C.textMid, marginTop: 4 }}>{staffMember.role} · {staffMember.dept}</div>
                        </button>
                      ))
                    ) : (
                      <div style={{ padding: "14px 16px", color: C.textMid }}>No matching employee</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, marginBottom: 24 }}>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: C.text }}>{selectedHistoryStaff.name || "Choose an employee"}</div>
              <div style={{ color: C.textMid, fontSize: 13, marginTop: 4 }}>{selectedHistoryStaff.role || "No employee selected"}</div>
            </div>
            {selectedHistoryStaff.name && <Avatar initials={selectedHistoryStaff.name.split(" ").map((w) => w[0]).join("").slice(0, 2)} size={44} color="#4F46E5" />}
          </div>

          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 12 }}>Monthly attendance</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(6, minmax(0, 1fr))", gap: 12, alignItems: "end", minHeight: 180, padding: 16, borderRadius: 20, background: "#F8FAFC" }}>
              {employeeAttendanceRate.map((item) => (
                <div key={item.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                  <div style={{ width: "100%", height: 120, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
                    <div style={{ width: "100%", maxWidth: 28, height: `${Math.max(item.percentage, 6)}%`, borderRadius: 12, background: item.percentage > 80 ? C.success : item.percentage > 50 ? C.primary : C.warning }} />
                  </div>
                  <div style={{ fontSize: 12, color: C.textMid }}>{item.label}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: C.text }}>{item.percentage}%</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: C.text }}>Attendance history</div>
              <div style={{ fontSize: 12, color: C.textMid }}>{historyRecords.length} records</div>
            </div>
            <div style={{ borderRadius: 20, background: "#F8FAFC", padding: 0 }}>
              {historyRecords.slice(0, 10).map((record) => (
                <div key={record.recordId} style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 0.9fr", gap: 12, alignItems: "center", padding: "14px 18px", borderBottom: `1px solid ${C.border}` }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{new Date(record.date).toLocaleDateString()}</div>
                    <div style={{ fontSize: 12, color: C.textMid, marginTop: 4 }}>{record.dept} · {record.role}</div>
                  </div>
                  <div style={{ fontSize: 14, color: C.textMid }}>{record.date}</div>
                  <div style={{ justifySelf: "end" }}><Badge label={record.status} color={statusColor(record.status)} /></div>
                </div>
              ))}
              {!historyRecords.length && <div style={{ padding: 24, color: C.textMid }}>No attendance history found for this employee.</div>}
            </div>
          </div>
        </Card>

        <Card style={{ minHeight: 520, padding: 24, borderRadius: 24, position: "sticky", top: 32 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: C.text }}>Team snapshot</div>
              <div style={{ fontSize: 13, color: C.textMid, marginTop: 5 }}>Today’s attendance across staff.</div>
            </div>
          </div>

          <div style={{ display: "grid", gap: 14, marginBottom: 18 }}>
            {[
              { label: "Present", value: presentCount, color: C.success },
              { label: "Absent", value: absentCount, color: C.danger },
              { label: "Not marked", value: notMarkedCount, color: C.warning },
              { label: "Rate", value: `${attendanceRate}%`, color: C.primary },
            ].map((item) => (
              <div key={item.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#F8FAFC", borderRadius: 16, padding: "14px 16px" }}>
                <div style={{ fontSize: 13, color: C.textMid }}>{item.label}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: item.color }}>{item.value}</div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setMarkOpen(true)}
            style={{ width: "100%", padding: "14px 18px", borderRadius: 14, background: C.primary, color: C.white, border: "none", cursor: "pointer", fontWeight: 700 }}
          >
            Mark attendance
          </button>

          {markOpen && (
            <div style={{ marginTop: 24, display: "grid", gap: 18, paddingTop: 18, borderTop: `1px solid ${C.border}` }}>
              <div>
                <label style={{ display: "block", marginBottom: 8, fontSize: 13, fontWeight: 700, color: C.text }}>Employee</label>
                <input
                  value={markQuery || selectedMarkStaff.name || ""}
                  onChange={(e) => {
                    setMarkQuery(e.target.value);
                    setMarkStaffId("");
                  }}
                  placeholder="Search employee..."
                  style={{ width: "100%", padding: "12px 16px", borderRadius: 14, border: `1.5px solid ${C.border}`, outline: "none", fontSize: 14, color: C.text, background: C.white }}
                />
                {(markQuery || markSuggestions.length > 0) && (
                  <div style={{ marginTop: 8, border: `1px solid ${C.border}`, borderRadius: 14, background: C.white, maxHeight: 200, overflowY: "auto", boxShadow: "0 20px 35px rgba(15,23,42,0.08)" }}>
                    {markSuggestions.length ? markSuggestions.map((staffMember) => (
                      <button
                        key={staffMember.id}
                        type="button"
                        onClick={() => {
                          setMarkStaffId(staffMember.id);
                          setMarkQuery(staffMember.name);
                        }}
                        style={{ width: "100%", textAlign: "left", padding: "12px 16px", border: "none", background: "transparent", cursor: "pointer", color: C.text }}
                      >
                        {staffMember.name}
                        <div style={{ fontSize: 12, color: C.textMid, marginTop: 4 }}>{staffMember.role}</div>
                      </button>
                    )) : (
                      <div style={{ padding: "12px 16px", color: C.textMid }}>No matching employee</div>
                    )}
                  </div>
                )}
              </div>

              <div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  {statusOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setMarkStatus(option)}
                      style={{
                        padding: "12px 14px",
                        borderRadius: 14,
                        border: `1px solid ${markStatus === option ? C.primary : C.border}`,
                        background: markStatus === option ? C.primary : C.white,
                        color: markStatus === option ? C.white : C.text,
                        cursor: "pointer",
                        fontWeight: 700,
                      }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: "block", marginBottom: 8, fontSize: 13, fontWeight: 700, color: C.text }}>Date</label>
                <input
                  type="date"
                  value={markDate}
                  onChange={(e) => setMarkDate(e.target.value)}
                  style={{ width: "100%", padding: "12px 16px", borderRadius: 14, border: `1px solid ${C.border}`, outline: "none", fontSize: 14, color: C.text, background: C.white }}
                />
              </div>

              <button
                onClick={handleMarkAttendance}
                style={{ width: "100%", padding: "14px 18px", borderRadius: 14, background: C.primary, color: C.white, border: "none", cursor: "pointer", fontWeight: 700 }}
              >
                Save attendance
              </button>
              {message && <div style={{ color: C.primary, fontSize: 13, padding: "0 4px" }}>{message}</div>}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AttendancePage;
