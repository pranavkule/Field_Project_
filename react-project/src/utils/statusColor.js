import C from "../constants/colors";

export const statusColor = (s) => {
  const m = {
    Active: C.success,
    Present: C.success,
    Adequate: C.success,
    Completed: C.success,
    Resolved: C.success,
    Absent: C.danger,
    Critical: C.danger,
    "Low Stock": C.warning,
    Pending: C.warning,
    "Pending Treatment": C.warning,
    "Under Observation": C.warning,
    Approved: C.primary,
  };
  return m[s] || C.textMid;
};
