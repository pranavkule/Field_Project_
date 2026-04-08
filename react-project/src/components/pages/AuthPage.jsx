import { useEffect, useState } from "react";
import C from "../../constants/colors";
import Btn from "../ui/Btn";
import Input from "../ui/Input";
import authAPI from "../../api/authService";

const PENDING_KEY = "pending_registration_request";

const AuthPage = ({ mode, onAuth, switchMode }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [org, setOrg] = useState("");
  const [role, setRole] = useState("admin");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [pendingRequest, setPendingRequest] = useState(null);
  const [pendingStatus, setPendingStatus] = useState("pending");

  const clearPendingRequest = () => {
    localStorage.removeItem(PENDING_KEY);
    setPendingRequest(null);
    setPendingStatus("pending");
  };

  const checkPendingStatus = async (requestId) => {
    try {
      const response = await authAPI.getRequestStatus(requestId);
      const status = response.data?.data?.status || "pending";
      setPendingStatus(status);

      if (status !== "pending") {
        localStorage.removeItem(PENDING_KEY);
      }
    } catch (err) {
      console.error("Failed to fetch registration status", err);
    }
  };

  useEffect(() => {
    if (mode !== "signup") return;

    const raw = localStorage.getItem(PENDING_KEY);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw);
      if (parsed?.request_id) {
        setPendingRequest(parsed);
        checkPendingStatus(parsed.request_id);
      }
    } catch (err) {
      localStorage.removeItem(PENDING_KEY);
    }
  }, [mode]);

  useEffect(() => {
    if (!pendingRequest?.request_id || pendingStatus !== "pending") return;

    const timer = setInterval(() => {
      checkPendingStatus(pendingRequest.request_id);
    }, 15000);

    return () => clearInterval(timer);
  }, [pendingRequest, pendingStatus]);

  const handle = async () => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !password) { setError("Please fill in all required fields."); return; }
    if (mode === "signup" && (!name.trim() || !org.trim())) { setError("Please fill in all required fields."); return; }

    setLoading(true);
    setError("");
    
    try {
      if (mode === "signup") {
        const registerRes = await authAPI.register({
          email: normalizedEmail,
          password,
          name,
          organization: org || "CareSync Institution",
          role,
        });

        const requestData = registerRes.data?.data;
        if (!requestData?.request_id) {
          throw new Error("Registration request response invalid");
        }

        const nextPending = {
          request_id: requestData.request_id,
          name,
          email: normalizedEmail,
          role,
          organization: org || "CareSync Institution",
        };
        localStorage.setItem(PENDING_KEY, JSON.stringify(nextPending));
        setPendingRequest(nextPending);
        setPendingStatus("pending");
      } else {
        const loginRes = await authAPI.login({ email: normalizedEmail, password });
        
        const { token, user } = loginRes.data.data;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        
        onAuth({
          name: user.name || "Admin",
          email: user.email,
          org: user.organization || "CareSync Institution",
          initials: user.name?.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "AD",
          role: user.role,
        });
      }
    } catch (err) {
      console.error('Auth request failed', err);
      setError(
        err.response?.data?.message ||
        err.message ||
        "Authentication failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (mode === "signup" && pendingRequest) {
    const statusConfig = pendingStatus === "approved"
      ? {
          title: "Registration approved",
          message: "Your request has been approved by NGO. You can now sign in.",
          color: C.success,
        }
      : pendingStatus === "declined"
        ? {
            title: "Registration declined",
            message: "Your request was declined by NGO. You can submit a new registration request.",
            color: C.danger,
          }
        : {
            title: "Waiting for confirmation from NGO",
            message: "Your registration request has been sent to super admin and is awaiting approval.",
            color: C.warning,
          };

    return (
      <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <div style={{ width: "100%", maxWidth: 560, background: C.white, borderRadius: 22, boxShadow: "0 24px 80px rgba(0,0,0,0.1)", padding: 36 }}>
          <h2 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: C.text }}>{statusConfig.title}</h2>
          <p style={{ margin: "10px 0 18px", color: C.textMid, fontSize: 14, lineHeight: 1.7 }}>{statusConfig.message}</p>
          <div style={{ border: `1px solid ${C.border}`, borderRadius: 14, padding: 14, background: "#FAFBFC", marginBottom: 18 }}>
            <div style={{ fontSize: 13, color: C.textMid, marginBottom: 6 }}><strong style={{ color: C.text }}>Name:</strong> {pendingRequest.name}</div>
            <div style={{ fontSize: 13, color: C.textMid, marginBottom: 6 }}><strong style={{ color: C.text }}>Email:</strong> {pendingRequest.email}</div>
            <div style={{ fontSize: 13, color: C.textMid, marginBottom: 6 }}><strong style={{ color: C.text }}>Role:</strong> {pendingRequest.role}</div>
            <div style={{ fontSize: 13, color: C.textMid }}><strong style={{ color: C.text }}>Institution:</strong> {pendingRequest.organization}</div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: statusConfig.color, textTransform: "capitalize" }}>Status: {pendingStatus}</span>
            <div style={{ display: "flex", gap: 8 }}>
              {pendingStatus === "pending" && <Btn label="Refresh Status" variant="outline" onClick={() => checkPendingStatus(pendingRequest.request_id)} />}
              {pendingStatus === "approved" && <Btn label="Go To Sign In" onClick={switchMode} />}
              {pendingStatus === "declined" && <Btn label="Submit New Request" onClick={clearPendingRequest} />}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", background: C.white, borderRadius: 24, overflow: "hidden", boxShadow: "0 24px 80px rgba(0,0,0,0.1)", width: "100%", maxWidth: 900, minHeight: 520 }}>
        <div style={{ background: `linear-gradient(135deg,${C.primary} 0%,${C.primaryDark} 100%)`, padding: 48, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 40 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 800, color: C.white }}>CS</div>
            <span style={{ fontSize: 20, fontWeight: 800, color: C.white }}>CareSync</span>
          </div>
          <h2 style={{ color: C.white, fontSize: 28, fontWeight: 800, margin: "0 0 16px", lineHeight: 1.2 }}>Manage care.<br />Stay organized.</h2>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 15, lineHeight: 1.7, margin: "0 0 40px" }}>The complete record management system for child care institutions.</p>
          { ["Track residents & staff", "Monitor health & attendance", "Manage inventory & expenses"].map((t) => (
            <div key={t} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <span style={{ color: C.white, fontWeight: 700 }}>✓</span>
              <span style={{ color: "rgba(255,255,255,0.85)", fontSize: 14 }}>{t}</span>
            </div>
          )) }
        </div>
        <div style={{ padding: 48, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <h2 style={{ margin: "0 0 8px", fontSize: 26, fontWeight: 800, color: C.text }}>{mode === "login" ? "Welcome back" : "Create your account"}</h2>
          <p style={{ margin: "0 0 32px", fontSize: 14, color: C.textMid }}>{mode === "login" ? "Sign in to your institution's dashboard" : "Set up your institution on CareSync today"}</p>
          {error && <div style={{ background: "#FEF2F2", color: C.danger, padding: "10px 14px", borderRadius: 10, fontSize: 13, marginBottom: 16 }}>{error}</div>}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {mode === "signup" && (<><Input label="Your Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" required /><Input label="Institution Name" value={org} onChange={(e) => setOrg(e.target.value)} placeholder="Orphanage / NGO name" required /><div style={{ display: "flex", flexDirection: "column", gap: 8 }}><label style={{ fontSize: 14, fontWeight: 600, color: C.text, fontFamily: "'Inter', 'DM Sans', 'Segoe UI', system-ui, sans-serif" }}>Role<span style={{ color: C.danger }}> *</span></label><select value={role} onChange={(e) => setRole(e.target.value)} style={{ padding: "12px 16px", border: `1.5px solid ${C.border}`, borderRadius: 12, fontSize: 14, color: C.text, outline: "none", background: C.white, fontFamily: "inherit", cursor: "pointer", transition: "all 0.2s ease", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}><option value="admin">Admin</option><option value="viewer">Viewer</option></select></div></>)}
            <Input label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@institution.org" required />
            <div style={{ position: "relative" }}>
              <Input label="Password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                style={{
                  position: "absolute",
                  right: 12,
                  top: 40,
                  padding: "4px 8px",
                  border: "none",
                  background: "transparent",
                  color: C.primary,
                  fontWeight: 700,
                  cursor: "pointer",
                  fontSize: 12,
                }}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          <button onClick={handle} disabled={loading} style={{ marginTop: 24, width: "100%", padding: "13px", background: loading ? "#CCC" : C.primary, color: C.white, border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit" }}>
            {loading ? "Please wait..." : (mode === "login" ? "Sign In →" : "Create Account →")}
          </button>
          {mode === "login" && <p style={{ margin: "14px 0 0", fontSize: 13, color: C.textMid, lineHeight: 1.6 }}>Accounts are assigned as Admin or Viewer. Admins can add and edit records; viewers can only read data.</p>}
          <p style={{ textAlign: "center", marginTop: 20, fontSize: 14, color: C.textMid }}>
            {mode === "login" ? "Don't have an account?" : "Already have an account?"} {' '}
            <button onClick={switchMode} style={{ background: "none", border: "none", color: C.primary, fontWeight: 700, cursor: "pointer", fontSize: 14, fontFamily: "inherit" }}>
              {mode === "login" ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
