import C from "../../constants/colors";
import Avatar from "../ui/Avatar";
import { Sun, Moon, Sunrise } from "lucide-react";

const Topbar = ({ user }) => {
  const now = new Date();
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const dateStr = `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
  const hour = now.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const Icon = hour < 12 ? Sunrise : hour < 17 ? Sun : Moon;
  return (
    <div style={{ padding: "24px 32px 0", display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "24px" }}>
      <div>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: C.text, display: "flex", alignItems: "center", gap: "8px" }}>
          {greeting} <Icon size={24} color={C.primary} />
        </h1>
        <p style={{ margin: "4px 0 0", fontSize: 14, color: C.textMid }}>{dateStr}</p>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{user?.name || "Admin"}</div>
          <div style={{ fontSize: 12, color: C.textMid }}>{user?.role || "Administrator"}</div>
        </div>
        <Avatar initials={user?.initials || "AD"} size={40} color={C.primary} />
      </div>
    </div>
  );
};

export default Topbar;
