import { useState } from "react";
import C from "../../constants/colors";
import Avatar from "../ui/Avatar";
import { Sun, Moon, Sunrise, Bell } from "lucide-react";

const Topbar = ({ user, isSuperAdmin = false, pendingRegistrations = [], onApproveRegistration, onDeclineRegistration, onRefreshRegistrations, pendingRegistrationsLoading = false }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const now = new Date();
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const dateStr = `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
  const hour = now.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const Icon = hour < 12 ? Sunrise : hour < 17 ? Sun : Moon;
  const roleLabel = isSuperAdmin ? "Super Admin" : user?.role === "admin" ? "Admin" : user?.role === "viewer" ? "Viewer" : "Administrator";
  return (
    <div style={{ padding: "24px 32px 0", display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "24px" }}>
      <div>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: C.text, display: "flex", alignItems: "center", gap: "8px", fontFamily: "'Inter', 'DM Sans', 'Segoe UI', system-ui, sans-serif" }}>
          {greeting} <Icon size={24} color={C.primary} />
        </h1>
        <p style={{ margin: "4px 0 0", fontSize: 14, color: C.textMid }}>{dateStr}</p>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {isSuperAdmin && (
          <div style={{ position: "relative" }}>
            <button
              type="button"
              onClick={() => {
                setShowNotifications((current) => !current);
                onRefreshRegistrations?.();
              }}
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                border: `1px solid ${C.border}`,
                background: C.white,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}
              title="Refresh registration requests"
            >
              <Bell size={18} color={C.primary} />
              {pendingRegistrations.length > 0 && (
                <span style={{
                  position: "absolute",
                  top: -6,
                  right: -6,
                  minWidth: 18,
                  height: 18,
                  borderRadius: 9,
                  fontSize: 11,
                  background: C.danger,
                  color: C.white,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0 5px",
                  fontWeight: 700,
                }}>
                  {pendingRegistrations.length}
                </span>
              )}
            </button>
            {showNotifications && <div style={{
              position: "absolute",
              right: 0,
              top: 48,
              width: 420,
              maxHeight: 340,
              overflowY: "auto",
              background: C.white,
              border: `1px solid ${C.border}`,
              borderRadius: 12,
              boxShadow: "0 12px 28px rgba(0,0,0,0.12)",
              padding: 12,
              zIndex: 10,
            }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 10 }}>
                Registration Requests {pendingRegistrationsLoading ? "(loading...)" : `(${pendingRegistrations.length})`}
              </div>
              {pendingRegistrations.length === 0 ? (
                <div style={{ fontSize: 12, color: C.textMid }}>No pending requests.</div>
              ) : (
                pendingRegistrations.map((request) => (
                  <div key={request.request_id} style={{ border: `1px solid ${C.border}`, borderRadius: 10, padding: 10, marginBottom: 10 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{request.name}</div>
                    <div style={{ fontSize: 12, color: C.textMid, marginTop: 4 }}>{request.email}</div>
                    <div style={{ fontSize: 12, color: C.textMid, marginTop: 4 }}>Role: {request.role}</div>
                    <div style={{ fontSize: 12, color: C.textMid, marginTop: 4 }}>Institution: {request.organization || "CareSync Institution"}</div>
                    <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                      <button
                        type="button"
                        onClick={() => onApproveRegistration?.(request.request_id)}
                        style={{ border: `1px solid ${C.success}`, background: "#ECFDF3", color: C.success, fontSize: 12, fontWeight: 700, borderRadius: 8, padding: "5px 10px", cursor: "pointer", fontFamily: "inherit" }}
                      >
                        Accept
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeclineRegistration?.(request.request_id)}
                        style={{ border: `1px solid ${C.danger}`, background: "#FEF2F2", color: C.danger, fontSize: 12, fontWeight: 700, borderRadius: 8, padding: "5px 10px", cursor: "pointer", fontFamily: "inherit" }}
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>}
          </div>
        )}
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{user?.name || "Admin"}</div>
          <div style={{ fontSize: 12, color: C.textMid }}>{roleLabel}</div>
        </div>
        <Avatar initials={user?.initials || "AD"} size={40} color={C.primary} />
      </div>
    </div>
  );
};

export default Topbar;
