import { useEffect, useMemo, useState } from "react";
import C from "../../constants/colors";
import { statusColor } from "../../utils/statusColor";
import Avatar from "../ui/Avatar";
import Badge from "../ui/Badge";
import Card from "../ui/Card";
import PageHeader from "../ui/PageHeader";

const statusOptions = ["Present", "Absent", "On Leave"];

const periodPresets = [
  { label: "This month", monthsBack: 0 },
  { label: "Last month", monthsBack: 1 },
];

const toDateInputValue = (value) => {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatPeriodLabel = (startDate, endDate) => {
  if (!startDate && !endDate) return "Today";
  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (!Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime()) && start.toDateString() === end.toDateString()) {
      return start.toLocaleDateString("en-US", { month: "short", year: "numeric", day: "numeric" });
    }
  }

  if (startDate && endDate) {
    const start = new Date(startDate).toLocaleDateString("en-US", { month: "short", year: "numeric" });
    const end = new Date(endDate).toLocaleDateString("en-US", { month: "short", year: "numeric" });
    return `${start} to ${end}`;
  }

  if (startDate) {
    return `From ${new Date(startDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })}`;
  }

  return `Until ${new Date(endDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })}`;
};

const buildMonthBuckets = (records, today, startDate, endDate) => {
  if (startDate || endDate) {
    const effectiveStart = startDate ? new Date(startDate) : new Date(new Date(endDate).getFullYear(), new Date(endDate).getMonth(), 1);
    const effectiveEnd = endDate ? new Date(endDate) : new Date(today.getFullYear(), today.getMonth(), 1);

    if (Number.isNaN(effectiveStart.getTime()) || Number.isNaN(effectiveEnd.getTime())) {
      return [];
    }

    const normalizedStart = new Date(effectiveStart.getFullYear(), effectiveStart.getMonth(), 1);
    const normalizedEnd = new Date(effectiveEnd.getFullYear(), effectiveEnd.getMonth(), 1);
    const buckets = [];
    const cursor = new Date(normalizedStart);

    while (cursor <= normalizedEnd) {
      buckets.push({
        key: `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}`,
        label: cursor.toLocaleDateString("en-US", { month: "short", year: "numeric" }),
      });
      cursor.setMonth(cursor.getMonth() + 1);
    }

    return buckets;
  }

  return Array.from({ length: 6 }).map((_, idx) => {
    const month = new Date(today.getFullYear(), today.getMonth() - (5 - idx), 1);
    return {
      key: `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, "0")}`,
      label: month.toLocaleDateString("en-US", { month: "short" }),
    };
  });
};

const AttendancePage = ({ staff, user }) => {
  const isAdmin = (user?.role || "").toLowerCase() === "admin";
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];
  const staffList = staff || [];
  const initialId = staffList[0]?.id || "";

  const [markOpen, setMarkOpen] = useState(false);
  const [markStaffId, setMarkStaffId] = useState(initialId);
  const [markStatus, setMarkStatus] = useState("Present");
  const [markDate, setMarkDate] = useState(todayStr);
  const [markDropdownOpen, setMarkDropdownOpen] = useState(false);

  const [historyStaffId, setHistoryStaffId] = useState(initialId);
  const [historyDropdownOpen, setHistoryDropdownOpen] = useState(false);
  const [historyStartDate, setHistoryStartDate] = useState("");
  const [historyEndDate, setHistoryEndDate] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(String(today.getMonth() + 1).padStart(2, "0"));
  const [selectedYear, setSelectedYear] = useState(String(today.getFullYear()));
  const [periodPreset, setPeriodPreset] = useState("custom");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!staffList.length) return;

    setHistoryStaffId((current) => {
      if (current && staffList.some((person) => person.id === current)) return current;
      return staffList[0].id;
    });

    setMarkStaffId((current) => {
      if (current && staffList.some((person) => person.id === current)) return current;
      return staffList[0].id;
    });
  }, [staffList]);

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

  const selectedHistoryRecords = useMemo(() => {
    return attendanceRecords
      .filter((record) => record.staffId === historyStaffId)
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [attendanceRecords, historyStaffId]);

  const historyRecords = useMemo(() => {
    const start = historyStartDate ? new Date(`${historyStartDate}T00:00:00`) : null;
    const end = historyEndDate ? new Date(`${historyEndDate}T23:59:59.999`) : null;

    return selectedHistoryRecords.filter((record) => {
      const recordDate = new Date(`${record.date}T00:00:00`);
      if (start && recordDate < start) return false;
      if (end && recordDate > end) return false;
      return true;
    });
  }, [historyEndDate, historyStartDate, selectedHistoryRecords]);

  const employeeAttendanceRate = useMemo(() => {
    const grouped = {};
    historyRecords.forEach((record) => {
      const date = new Date(`${record.date}T00:00:00`);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      if (!grouped[monthKey]) grouped[monthKey] = { present: 0, total: 0 };
      grouped[monthKey].total += 1;
      if (record.status === "Present") grouped[monthKey].present += 1;
    });

    const labels = buildMonthBuckets(historyRecords, today, historyStartDate, historyEndDate);

    return labels.map((bucket) => {
      const data = grouped[bucket.key] || { present: 0, total: 0 };
      const percentage = data.total ? Math.round((data.present / data.total) * 100) : 0;
      return { label: bucket.label, percentage };
    });
  }, [historyEndDate, historyRecords, historyStartDate, today]);

  const periodLabel = useMemo(() => formatPeriodLabel(historyStartDate, historyEndDate), [historyEndDate, historyStartDate]);

  const applyPeriodPreset = (preset) => {
    const current = new Date();

    if (preset.label === "This month") {
      const start = new Date(current.getFullYear(), current.getMonth(), 1);
      const end = new Date(current.getFullYear(), current.getMonth() + 1, 0);
      setHistoryStartDate(toDateInputValue(start));
      setHistoryEndDate(toDateInputValue(end));
      setPeriodPreset("this-month");
      return;
    }

    if (preset.label === "Last month") {
      const start = new Date(current.getFullYear(), current.getMonth() - 1, 1);
      const end = new Date(current.getFullYear(), current.getMonth(), 0);
      setHistoryStartDate(toDateInputValue(start));
      setHistoryEndDate(toDateInputValue(end));
      setPeriodPreset("last-month");
      return;
    }

    setHistoryStartDate(preset.start);
    setHistoryEndDate(preset.end);
    setPeriodPreset(preset.label.toLowerCase().replace(/\s+/g, "-"));
  };

  const handlePeriodFieldChange = (setter) => (value) => {
    setter(value);
    setPeriodPreset("custom");
  };

  const clearPeriodFilter = () => {
    setHistoryStartDate("");
    setHistoryEndDate("");
    setPeriodPreset("all");
  };

  const applyMonthYearFilter = () => {
    const year = Number(selectedYear);
    const month = Number(selectedMonth);

    if (!year || !month) return;

    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0);

    setHistoryStartDate(toDateInputValue(start));
    setHistoryEndDate(toDateInputValue(end));
    setPeriodPreset("month-year");
  };

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
        <PageHeader title="Staff Attendance" subtitle={`Period — ${periodLabel}`} />
        {isAdmin && (
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
        )}
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
                  readOnly
                  value={selectedHistoryStaff.name || ""}
                  onClick={() => setHistoryDropdownOpen((open) => !open)}
                  onFocus={() => setHistoryDropdownOpen(true)}
                  placeholder="Select employee..."
                  style={{ flex: 1, padding: "12px 16px", borderRadius: 14, border: `1.5px solid ${C.border}`, outline: "none", fontSize: 14, color: C.text, background: C.white, cursor: "pointer" }}
                />
                <button
                  type="button"
                  onClick={() => {
                    setHistoryDropdownOpen((open) => !open);
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
                {historyDropdownOpen && (
                  <div style={{ position: "absolute", top: 52, left: 0, right: 0, background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, maxHeight: 220, overflowY: "auto", zIndex: 5, boxShadow: "0 24px 40px rgba(15, 23, 42, 0.08)" }}>
                    {staffList.length ? (
                      staffList.map((staffMember) => (
                        <button
                          key={staffMember.id}
                          type="button"
                          onClick={() => {
                            setHistoryStaffId(staffMember.id);
                            setHistoryDropdownOpen(false);
                          }}
                          style={{
                            width: "100%",
                            textAlign: "left",
                            padding: "12px 16px",
                            border: "none",
                            background: staffMember.id === historyStaffId ? "#F8FAFC" : "transparent",
                            cursor: "pointer",
                            color: C.text,
                          }}
                        >
                          {staffMember.name}
                          <div style={{ fontSize: 12, color: C.textMid, marginTop: 4 }}>{staffMember.role} · {staffMember.dept}</div>
                        </button>
                      ))
                    ) : (
                      <div style={{ padding: "14px 16px", color: C.textMid }}>No employees found</div>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div style={{ minWidth: 0, flex: "1 1 320px", maxWidth: "100%" }}>
              <label style={{ display: "block", marginBottom: 10, fontSize: 13, fontWeight: 700, color: C.text }}>Period</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
                {periodPresets.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => applyPeriodPreset(preset)}
                    style={{
                      padding: "8px 12px",
                      borderRadius: 999,
                      border: `1px solid ${periodPreset === preset.label.toLowerCase().replace(/\s+/g, "-") ? C.primary : C.border}`,
                      background: periodPreset === preset.label.toLowerCase().replace(/\s+/g, "-") ? C.primary : C.white,
                      color: periodPreset === preset.label.toLowerCase().replace(/\s+/g, "-") ? C.white : C.text,
                      cursor: "pointer",
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  >
                    {preset.label}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={clearPeriodFilter}
                  style={{
                    padding: "8px 12px",
                    borderRadius: 999,
                    border: `1px solid ${C.border}`,
                    background: C.white,
                    color: C.textMid,
                    cursor: "pointer",
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  Clear
                </button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr) 104px", gap: 10, marginBottom: 10, width: "100%" }}>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  style={{ width: "100%", minWidth: 0, boxSizing: "border-box", padding: "12px 16px", borderRadius: 14, border: `1.5px solid ${C.border}`, outline: "none", fontSize: 14, color: C.text, background: C.white, cursor: "pointer" }}
                >
                  {[
                    ["01", "January"],
                    ["02", "February"],
                    ["03", "March"],
                    ["04", "April"],
                    ["05", "May"],
                    ["06", "June"],
                    ["07", "July"],
                    ["08", "August"],
                    ["09", "September"],
                    ["10", "October"],
                    ["11", "November"],
                    ["12", "December"],
                  ].map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  style={{ width: "100%", minWidth: 0, boxSizing: "border-box", padding: "12px 16px", borderRadius: 14, border: `1.5px solid ${C.border}`, outline: "none", fontSize: 14, color: C.text, background: C.white, cursor: "pointer" }}
                >
                  {Array.from({ length: 10 }).map((_, idx) => {
                    const year = today.getFullYear() - 4 + idx;
                    return <option key={year} value={String(year)}>{year}</option>;
                  })}
                </select>
                <button
                  type="button"
                  onClick={applyMonthYearFilter}
                  style={{ width: "100%", minWidth: 0, boxSizing: "border-box", padding: "12px 16px", borderRadius: 14, border: `1px solid ${C.primary}`, background: C.primary, color: C.white, fontSize: 13, fontWeight: 700, cursor: "pointer" }}
                >
                  Apply
                </button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: 10, width: "100%" }}>
                <input
                  type="date"
                  value={historyStartDate}
                  onChange={(e) => handlePeriodFieldChange(setHistoryStartDate)(e.target.value)}
                  style={{ width: "100%", minWidth: 0, boxSizing: "border-box", padding: "12px 16px", borderRadius: 14, border: `1.5px solid ${C.border}`, outline: "none", fontSize: 14, color: C.text, background: C.white }}
                />
                <input
                  type="date"
                  value={historyEndDate}
                  onChange={(e) => handlePeriodFieldChange(setHistoryEndDate)(e.target.value)}
                  style={{ width: "100%", minWidth: 0, boxSizing: "border-box", padding: "12px 16px", borderRadius: 14, border: `1.5px solid ${C.border}`, outline: "none", fontSize: 14, color: C.text, background: C.white }}
                />
              </div>
              <div style={{ marginTop: 8, fontSize: 12, color: C.textMid }}>Leave both blank to view the full history. Use the quick preset for a whole month.</div>
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
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.max(employeeAttendanceRate.length, 1)}, minmax(0, 1fr))`, gap: 12, alignItems: "end", minHeight: 180, padding: 16, borderRadius: 20, background: "#F8FAFC" }}>
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

          {isAdmin && (
            <button
              onClick={() => setMarkOpen(true)}
              style={{ width: "100%", padding: "14px 18px", borderRadius: 14, background: C.primary, color: C.white, border: "none", cursor: "pointer", fontWeight: 700 }}
            >
              Mark attendance
            </button>
          )}

          {isAdmin && markOpen && (
            <div style={{ marginTop: 24, display: "grid", gap: 18, paddingTop: 18, borderTop: `1px solid ${C.border}` }}>
              <div>
                <label style={{ display: "block", marginBottom: 8, fontSize: 13, fontWeight: 700, color: C.text }}>Employee</label>
                <div style={{ position: "relative" }}>
                  <input
                    readOnly
                    value={selectedMarkStaff.name || ""}
                    onClick={() => setMarkDropdownOpen((open) => !open)}
                    onFocus={() => setMarkDropdownOpen(true)}
                    placeholder="Select employee..."
                    style={{ width: "100%", padding: "12px 16px", borderRadius: 14, border: `1.5px solid ${C.border}`, outline: "none", fontSize: 14, color: C.text, background: C.white, cursor: "pointer" }}
                  />
                  <button
                    type="button"
                    onClick={() => setMarkDropdownOpen((open) => !open)}
                    style={{ position: "absolute", right: 12, top: 12, width: 20, height: 20, border: "none", background: "transparent", cursor: "pointer", color: C.textMid, fontSize: 14, display: "inline-flex", alignItems: "center", justifyContent: "center" }}
                    aria-label="Toggle employee dropdown"
                  >
                    ▼
                  </button>
                  {markDropdownOpen && (
                    <div style={{ marginTop: 8, border: `1px solid ${C.border}`, borderRadius: 14, background: C.white, maxHeight: 200, overflowY: "auto", boxShadow: "0 20px 35px rgba(15,23,42,0.08)" }}>
                      {staffList.length ? staffList.map((staffMember) => (
                        <button
                          key={staffMember.id}
                          type="button"
                          onClick={() => {
                            setMarkStaffId(staffMember.id);
                            setMarkDropdownOpen(false);
                          }}
                          style={{ width: "100%", textAlign: "left", padding: "12px 16px", border: "none", background: staffMember.id === markStaffId ? "#F8FAFC" : "transparent", cursor: "pointer", color: C.text }}
                        >
                          {staffMember.name}
                          <div style={{ fontSize: 12, color: C.textMid, marginTop: 4 }}>{staffMember.role}</div>
                        </button>
                      )) : (
                        <div style={{ padding: "12px 16px", color: C.textMid }}>No employees found</div>
                      )}
                    </div>
                  )}
                </div>
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
