import { useState } from "react";
import C from "../../constants/colors";
import Btn from "../ui/Btn";
import Input from "../ui/Input";
import apiClient from "../../api/apiClient";

const AuthPage = ({ mode, onAuth, switchMode }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [org, setOrg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = async () => {
    if (!email || !password) { setError("Please fill in all required fields."); return; }
    if (mode === "signup" && (!name || !org)) { setError("Please fill in all required fields."); return; }
    
    setLoading(true);
    setError("");
    
    try {
      if (mode === "signup") {
        // Register new user
        const registerRes = await apiClient.post("/auth/register", {
          email,
          password,
          name,
          organization: org || "CareSync Institution",
          role: "Administrator",
        });

        const { token, user } = registerRes.data.data;
        if (!token || !user) {
          throw new Error("Registration response invalid");
        }

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        
        onAuth({
          name: user.name || "Admin",
          email: user.email,
          org: user.organization || "CareSync Institution",
          initials: user.name?.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "AD",
          role: user.role,
        });
      } else {
        // Login existing user
        const loginRes = await apiClient.post("/auth/login", { email, password });
        
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
      setError(err.response?.data?.message || "Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
            {mode === "signup" && (<><Input label="Your Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" required /><Input label="Institution Name" value={org} onChange={(e) => setOrg(e.target.value)} placeholder="Orphanage / NGO name" required /></>)}
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
