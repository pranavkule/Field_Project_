import { useState } from "react";
import C from "../../constants/colors";
import { statusColor } from "../../utils/statusColor";
import Badge from "../ui/Badge";
import Btn from "../ui/Btn";
import Card from "../ui/Card";
import Input from "../ui/Input";
import Modal from "../ui/Modal";
import PageHeader from "../ui/PageHeader";
import SelectField from "../ui/SelectField";
import { TH, TD } from "../ui/TableCells";

const InventoryPage = ({ inventory, setInventory, needs, setNeeds }) => {
  const [tab, setTab] = useState("inventory");
  const [showAddInv, setShowAddInv] = useState(false);
  const [showAddNeed, setShowAddNeed] = useState(false);
  const [invForm, setInvForm] = useState({ item: "", category: "", quantity: "", unit: "", minStock: "", status: "Adequate" });
  const [needForm, setNeedForm] = useState({ item: "", category: "", quantity: "", priority: "Medium", requestedBy: "", dateRequested: "", status: "Pending" });
  const addInventory = () => { if (!invForm.item) return; setInventory((p) => [...p, { ...invForm, id: p.length + 1, lastUpdated: new Date().toISOString().split("T")[0] }]); setShowAddInv(false); setInvForm({ item: "", category: "", quantity: "", unit: "", minStock: "", status: "Adequate" }); };
  const addNeed = () => { if (!needForm.item) return; setNeeds((p) => [...p, { ...needForm, id: p.length + 1 }]); setShowAddNeed(false); setNeedForm({ item: "", category: "", quantity: "", priority: "Medium", requestedBy: "", dateRequested: "", status: "Pending" }); };

  return (
    <div style={{ padding: 32 }}>
      <PageHeader
        title="Inventory & Needs"
        action={<div style={{ display: "flex", gap: 10 }}><Btn label="Add Item" icon="+" onClick={() => setShowAddInv(true)} variant="outline" /><Btn label="Add Need" icon="📋" onClick={() => setShowAddNeed(true)} /></div>}
      />
      <div style={{ display: "flex", gap: 4, marginBottom: 20, background: C.bg, borderRadius: 12, padding: 4, width: "fit-content" }}>
        {[ ["inventory", "📦 Inventory"], ["needs", "📋 Needs & Requests"]].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} style={{ padding: "9px 20px", borderRadius: 10, border: "none", cursor: "pointer", fontSize: 14, fontWeight: 600, fontFamily: "inherit", background: tab === id ? C.white : "transparent", color: tab === id ? C.primary : C.textMid, boxShadow: tab === id ? "0 1px 4px rgba(0,0,0,0.08)" : "none" }}>{label}</button>
        ))}
      </div>
      {tab === "inventory" && (
        <Card>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr>{["Item", "Category", "Quantity", "Min. Stock", "Status", "Last Updated"].map((h) => <TH key={h}>{h}</TH>)}</tr></thead>
            <tbody>
              {inventory.map((item, i) => (
                <tr key={item.id} style={{ borderBottom: `1px solid ${C.border}`, background: i % 2 === 0 ? C.white : "#FAFBFC" }}>
                  <TD style={{ fontWeight: 600 }}>{item.item}</TD>
                  <TD style={{ color: C.textMid, fontSize: 13 }}>{item.category}</TD>
                  <TD>{item.quantity} {item.unit}</TD>
                  <TD style={{ color: C.textMid, fontSize: 13 }}>{item.minStock} {item.unit}</TD>
                  <TD><Badge label={item.status} color={statusColor(item.status)} /></TD>
                  <TD style={{ color: C.textMid, fontSize: 13 }}>{item.lastUpdated}</TD>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
      {tab === "needs" && (
        <Card>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr>{["Item", "Category", "Qty", "Priority", "Requested By", "Date", "Status"].map((h) => <TH key={h}>{h}</TH>)}</tr></thead>
            <tbody>
              {needs.map((need, i) => (
                <tr key={need.id} style={{ borderBottom: `1px solid ${C.border}`, background: i % 2 === 0 ? C.white : "#FAFBFC" }}>
                  <TD style={{ fontWeight: 600 }}>{need.item}</TD>
                  <TD style={{ color: C.textMid, fontSize: 13 }}>{need.category}</TD>
                  <TD style={{ color: C.textMid }}>{need.quantity}</TD>
                  <TD><Badge label={need.priority} color={need.priority === "High" ? C.danger : need.priority === "Medium" ? C.warning : C.success} /></TD>
                  <TD style={{ color: C.textMid, fontSize: 13 }}>{need.requestedBy}</TD>
                  <TD style={{ color: C.textMid, fontSize: 13 }}>{need.dateRequested}</TD>
                  <TD><Badge label={need.status} color={statusColor(need.status)} /></TD>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {showAddInv && (
        <Modal title="Add Inventory Item" onClose={() => setShowAddInv(false)}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Input label="Item Name" value={invForm.item} onChange={(e) => setInvForm({ ...invForm, item: e.target.value })} placeholder="Item name" required />
            <SelectField label="Category" value={invForm.category} onChange={(e) => setInvForm({ ...invForm, category: e.target.value })} options={["Clothing", "Bedding", "Stationery", "Food", "Hygiene", "Medical", "Furniture", "Electronics", "Other"]} required />
            <Input label="Quantity" type="number" value={invForm.quantity} onChange={(e) => setInvForm({ ...invForm, quantity: e.target.value })} placeholder="0" required />
            <Input label="Unit" value={invForm.unit} onChange={(e) => setInvForm({ ...invForm, unit: e.target.value })} placeholder="e.g. Pieces, Kg" />
            <Input label="Min. Stock Level" type="number" value={invForm.minStock} onChange={(e) => setInvForm({ ...invForm, minStock: e.target.value })} placeholder="0" />
            <SelectField label="Status" value={invForm.status} onChange={(e) => setInvForm({ ...invForm, status: e.target.value })} options={["Adequate", "Low Stock", "Critical"]} />
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 24 }}>
            <Btn label="Cancel" variant="ghost" onClick={() => setShowAddInv(false)} />
            <Btn label="Add Item" onClick={addInventory} />
          </div>
        </Modal>
      )}

      {showAddNeed && (
        <Modal title="Add Need / Request" onClose={() => setShowAddNeed(false)}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Input label="Item / Need" value={needForm.item} onChange={(e) => setNeedForm({ ...needForm, item: e.target.value })} placeholder="What is needed?" required />
            <SelectField label="Category" value={needForm.category} onChange={(e) => setNeedForm({ ...needForm, category: e.target.value })} options={["Clothing", "Education", "Medical", "Food", "Hygiene", "Furniture", "Electronics", "Other"]} />
            <Input label="Quantity" type="number" value={needForm.quantity} onChange={(e) => setNeedForm({ ...needForm, quantity: e.target.value })} placeholder="0" />
            <SelectField label="Priority" value={needForm.priority} onChange={(e) => setNeedForm({ ...needForm, priority: e.target.value })} options={["High", "Medium", "Low"]} />
            <Input label="Requested By" value={needForm.requestedBy} onChange={(e) => setNeedForm({ ...needForm, requestedBy: e.target.value })} placeholder="Staff name" />
            <Input label="Date Requested" type="date" value={needForm.dateRequested} onChange={(e) => setNeedForm({ ...needForm, dateRequested: e.target.value })} />
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 24 }}>
            <Btn label="Cancel" variant="ghost" onClick={() => setShowAddNeed(false)} />
            <Btn label="Submit Request" onClick={addNeed} />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default InventoryPage;
