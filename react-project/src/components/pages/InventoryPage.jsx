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
import inventoryAPI from "../../api/inventoryService";

const InventoryPage = ({ inventory, setInventory, needs, setNeeds }) => {
  const [tab, setTab] = useState("inventory");
  const [showAddInv, setShowAddInv] = useState(false);
  const [showAddNeed, setShowAddNeed] = useState(false);
  const [invError, setInvError] = useState("");
  const [needError, setNeedError] = useState("");
  const [invLoading, setInvLoading] = useState(false);
  const [needLoading, setNeedLoading] = useState(false);
  const [invForm, setInvForm] = useState({ item: "", category: "", quantity: "", unit: "", minStock: "", status: "Adequate" });
  const [needForm, setNeedForm] = useState({ item: "", category: "", quantity: "", priority: "Medium", requestedBy: "", dateRequested: "", status: "Pending" });
  
  const addInventory = async () => {
    if (!invForm.item || !invForm.category || !invForm.quantity) {
      setInvError('Item, category and quantity are required.');
      return;
    }

    setInvLoading(true);
    setInvError("");

    try {
      // Call backend API using backend field names
      const response = await inventoryAPI.create({
        item_name: invForm.item,
        category: invForm.category,
        quantity_available: Number(invForm.quantity),
      });
      
      // Add to local state with UI model mapping
      const newItem = response.data.data;
      setInventory((p) => [
        {
          id: newItem.item_id,
          item: newItem.item_name,
          category: newItem.category,
          quantity: newItem.quantity_available,
          unit: invForm.unit,
          minStock: Number(invForm.minStock),
          status: invForm.status,
          lastUpdated: newItem.last_updated ? new Date(newItem.last_updated).toISOString().split('T')[0] : "",
        },
        ...p,
      ]);
      
      // Clear form and close modal
      setShowAddInv(false);
      setInvForm({ item: "", category: "", quantity: "", unit: "", minStock: "", status: "Adequate" });
    } catch (err) {
      console.error("Inventory add failed", err);
      const message = err.response?.data?.message || "Failed to add inventory item. Please try again.";
      setInvError(message);
    } finally {
      setInvLoading(false);
    }
  };
  
  const addNeed = () => {
    if (!needForm.item) return;
    setNeeds((p) => [...p, { ...needForm, id: p.length + 1 }]);
    setShowAddNeed(false);
    setNeedForm({ item: "", category: "", quantity: "", priority: "Medium", requestedBy: "", dateRequested: "", status: "Pending" });
  };

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
          {invError && <div style={{ background: "#FEF2F2", color: C.danger, padding: "10px 14px", borderRadius: 10, fontSize: 13, marginBottom: 16 }}>{invError}</div>}
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
            <Btn label={invLoading ? "Adding..." : "Add Item"} onClick={addInventory} disabled={invLoading} />
          </div>
        </Modal>
      )}

      {showAddNeed && (
        <Modal title="Add Need / Request" onClose={() => setShowAddNeed(false)}>
          {needError && <div style={{ background: "#FEF2F2", color: C.danger, padding: "10px 14px", borderRadius: 10, fontSize: 13, marginBottom: 16 }}>{needError}</div>}
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
            <Btn label={needLoading ? "Submitting..." : "Submit Request"} onClick={addNeed} disabled={needLoading} />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default InventoryPage;
