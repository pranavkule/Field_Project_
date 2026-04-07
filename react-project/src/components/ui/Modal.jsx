import C from "../../constants/colors";
import { X } from "lucide-react";

const Modal = ({ title, children, onClose }) => (
  <div
    style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
    onClick={(e) => e.target === e.currentTarget && onClose()}
  >
    <div style={{ background: C.white, borderRadius: 20, width: "100%", maxWidth: 560, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 32px 96px rgba(0,0,0,0.2)", border: `1px solid ${C.border}` }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "24px 28px", borderBottom: `1px solid ${C.border}` }}>
        <h3 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: C.text, fontFamily: "'Inter', 'DM Sans', 'Segoe UI', system-ui, sans-serif" }}>{title}</h3>
        <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: C.textLight, padding: 4, borderRadius: 8, transition: "all 0.2s ease" }}>
          <X size={20} />
        </button>
      </div>
      <div style={{ padding: 28 }}>{children}</div>
    </div>
  </div>
);

export default Modal;
