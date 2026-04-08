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
import donationAPI from "../../api/donationService";
import { Package, ClipboardList, Plus } from "lucide-react";

const InventoryPage = ({ inventory, setInventory, needs, setNeeds, user }) => {
  const isAdmin = (user?.role || "").toLowerCase() === "admin";
  const [tab, setTab] = useState("inventory");
  const [showAddInv, setShowAddInv] = useState(false);
  const [showAddNeed, setShowAddNeed] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editingNeed, setEditingNeed] = useState(null);
  const [invError, setInvError] = useState("");
  const [needError, setNeedError] = useState("");
  const [invLoading, setInvLoading] = useState(false);
  const [needLoading, setNeedLoading] = useState(false);
  const [invForm, setInvForm] = useState({ item: "", category: "", quantity: "", unit: "", minStock: "", status: "Adequate" });
  const [needForm, setNeedForm] = useState({ item: "", category: "", quantity: "", priority: "Medium", requestedBy: "", dateRequested: "", status: "Pending" });

  const closeNeedModal = () => {
    setShowAddNeed(false);
    setEditingNeed(null);
    setNeedError("");
    setNeedForm({ item: "", category: "", quantity: "", priority: "Medium", requestedBy: "", dateRequested: "", status: "Pending" });
  };

  const openNeedModal = (need = null) => {
    if (need) {
      setEditingNeed(need);
      setNeedForm({
        item: need.item || "",
        category: need.category || "",
        quantity: need.quantity?.toString?.() || String(need.quantity || ""),
        priority: need.priority || "Medium",
        requestedBy: need.requestedBy || "",
        dateRequested: need.dateRequested || "",
        status: need.status || "Pending",
      });
    } else {
      setEditingNeed(null);
      setNeedForm({ item: "", category: "", quantity: "", priority: "Medium", requestedBy: "", dateRequested: "", status: "Pending" });
    }

    setNeedError("");
    setShowAddNeed(true);
  };

  const closeInvModal = () => {
    setShowAddInv(false);
    setEditingItem(null);
    setInvError("");
    setInvForm({ item: "", category: "", quantity: "", unit: "", minStock: "", status: "Adequate" });
  };

  const openInvModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setInvForm({
        item: item.item || "",
        category: item.category || "",
        quantity: item.quantity?.toString?.() || String(item.quantity || ""),
        unit: item.unit || "",
        minStock: item.minStock?.toString?.() || String(item.minStock || ""),
        status: item.status || "Adequate",
      });
    } else {
      setEditingItem(null);
      setInvForm({ item: "", category: "", quantity: "", unit: "", minStock: "", status: "Adequate" });
    }
    setInvError("");
    setShowAddInv(true);
  };
  
  const addInventory = async () => {
    if (!invForm.item || !invForm.category || !invForm.quantity) {
      setInvError('Item, category and quantity are required.');
      return;
    }

    setInvLoading(true);
    setInvError("");

    try {
      const payload = {
        item_name: invForm.item,
        category: invForm.category,
        quantity_available: Number(invForm.quantity),
      };

      if (editingItem) {
        const response = await inventoryAPI.update(editingItem.id, payload);
        const updatedItem = response.data.data;
        setInventory((current) => current.map((item) => item.id === editingItem.id ? {
          ...item,
          item: updatedItem.item_name,
          category: updatedItem.category,
          quantity: updatedItem.quantity_available,
          unit: invForm.unit,
          minStock: Number(invForm.minStock),
          status: invForm.status,
          lastUpdated: updatedItem.last_updated ? new Date(updatedItem.last_updated).toISOString().split('T')[0] : item.lastUpdated,
        } : item));
      } else {
        const response = await inventoryAPI.create(payload);
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
      }

      closeInvModal();
    } catch (err) {
      console.error("Inventory add failed", err);
      const message = err.response?.data?.message || "Failed to save inventory item. Please try again.";
      setInvError(message);
    } finally {
      setInvLoading(false);
    }
  };
  
  const saveNeed = async () => {
    if (!needForm.item || !needForm.quantity) {
      setNeedError("Item and quantity are required.");
      return;
    }

    setNeedLoading(true);
    setNeedError("");

    try {
      const quantityRequired = Number(needForm.quantity);
      const isCompleted = needForm.status === "Completed";
      const payload = {
        item_name: needForm.item,
        category: needForm.category || "Other",
        quantity_required: quantityRequired,
        quantity_received: isCompleted ? quantityRequired : 0,
        priority: needForm.priority,
        donor_name: needForm.requestedBy || "",
        date_received: needForm.dateRequested ? new Date(needForm.dateRequested).toISOString() : new Date().toISOString(),
        is_active: true,
      };

      if (editingNeed) {
        const response = await donationAPI.update(editingNeed.id, payload);
        const updatedNeed = response.data.data;
        setNeeds((current) => current.map((need) => need.id === editingNeed.id ? {
          ...need,
          item: updatedNeed.item_name,
          category: updatedNeed.category,
          quantity: updatedNeed.quantity_required,
          priority: updatedNeed.priority || "Medium",
          requestedBy: updatedNeed.donor_name || "",
          dateRequested: updatedNeed.date_received ? new Date(updatedNeed.date_received).toISOString().split('T')[0] : "",
          status: updatedNeed.quantity_received >= updatedNeed.quantity_required ? "Completed" : "Pending",
        } : need));
      } else {
        const response = await donationAPI.create(payload);
        const createdNeed = response.data.data;
        setNeeds((p) => [{
          id: createdNeed.donation_id,
          item: createdNeed.item_name,
          category: createdNeed.category,
          quantity: createdNeed.quantity_required,
          priority: createdNeed.priority || "Medium",
          requestedBy: createdNeed.donor_name || "",
          dateRequested: createdNeed.date_received ? new Date(createdNeed.date_received).toISOString().split('T')[0] : "",
          status: createdNeed.quantity_received >= createdNeed.quantity_required ? "Completed" : "Pending",
        }, ...p]);
      }

      closeNeedModal();
    } catch (err) {
      setNeedError(err.response?.data?.message || "Failed to save request. Please try again.");
    } finally {
      setNeedLoading(false);
    }
  };

  return (
    <div style={{ padding: 32 }}>
      <PageHeader
        title="Inventory & Needs"
        action={isAdmin ? <div style={{ display: "flex", gap: 10 }}><Btn label="Add Item" icon={<Plus size={16} />} onClick={() => openInvModal()} variant="outline" /><Btn label="Add Need" icon={<ClipboardList size={16} />} onClick={() => openNeedModal()} /></div> : null}
      />
      <div style={{ display: "flex", gap: 4, marginBottom: 20, background: C.bg, borderRadius: 12, padding: 4, width: "fit-content", boxShadow: "inset 0 1px 2px rgba(0,0,0,0.04)" }}>
        {[ ["inventory", <><Package size={16} /> Inventory</>], ["needs", <><ClipboardList size={16} /> Needs & Requests</>]].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} style={{ padding: "9px 20px", borderRadius: 10, border: "none", cursor: "pointer", fontSize: 14, fontWeight: 600, fontFamily: "inherit", background: tab === id ? C.white : "transparent", color: tab === id ? C.primary : C.textMid, boxShadow: tab === id ? "0 1px 4px rgba(0,0,0,0.08)" : "none", transition: "all 0.2s ease", display: "flex", alignItems: "center", gap: "8px" }}>{label}</button>
        ))}
      </div>
      {tab === "inventory" && (
        <Card>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr>{["Item", "Category", "Quantity", "Min. Stock", "Status", "Last Updated", ...(isAdmin ? [""] : [])].map((h) => <TH key={h || 'actions'}>{h}</TH>)}</tr></thead>
            <tbody>
              {inventory.map((item, i) => (
                <tr key={item.id} style={{ borderBottom: `1px solid ${C.border}`, background: i % 2 === 0 ? C.white : "#FAFBFC" }}>
                  <TD style={{ fontWeight: 600 }}>{item.item}</TD>
                  <TD style={{ color: C.textMid, fontSize: 13 }}>{item.category}</TD>
                  <TD>{item.quantity} {item.unit}</TD>
                  <TD style={{ color: C.textMid, fontSize: 13 }}>{item.minStock} {item.unit}</TD>
                  <TD><Badge label={item.status} color={statusColor(item.status)} /></TD>
                  <TD style={{ color: C.textMid, fontSize: 13 }}>{item.lastUpdated}</TD>
                  {isAdmin && <TD style={{ textAlign: "right" }}><button onClick={() => openInvModal(item)} style={{ border: `1px solid ${C.primary}`, background: C.primary + '10', color: C.primary, fontSize: 12, fontWeight: 700, borderRadius: 8, padding: '5px 10px', cursor: 'pointer', fontFamily: 'inherit' }}>Edit</button></TD>}
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
      {tab === "needs" && (
        <Card>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr>{["Item", "Category", "Qty", "Priority", "Requested By", "Date", "Status", ...(isAdmin ? [""] : [])].map((h) => <TH key={h || 'actions'}>{h}</TH>)}</tr></thead>
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
                  {isAdmin && <TD style={{ textAlign: "right" }}><button onClick={() => openNeedModal(need)} style={{ border: `1px solid ${C.primary}`, background: C.primary + '10', color: C.primary, fontSize: 12, fontWeight: 700, borderRadius: 8, padding: '5px 10px', cursor: 'pointer', fontFamily: 'inherit' }}>Edit</button></TD>}
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {showAddInv && isAdmin && (
        <Modal title={editingItem ? "Edit Inventory Item" : "Add Inventory Item"} onClose={closeInvModal}>
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
            <Btn label="Cancel" variant="ghost" onClick={closeInvModal} />
            <Btn label={invLoading ? (editingItem ? "Saving..." : "Adding...") : (editingItem ? "Save Changes" : "Add Item")} onClick={addInventory} disabled={invLoading} />
          </div>
        </Modal>
      )}

      {showAddNeed && isAdmin && (
        <Modal title={editingNeed ? "Edit Need / Request" : "Add Need / Request"} onClose={closeNeedModal}>
          {needError && <div style={{ background: "#FEF2F2", color: C.danger, padding: "10px 14px", borderRadius: 10, fontSize: 13, marginBottom: 16 }}>{needError}</div>}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Input label="Item / Need" value={needForm.item} onChange={(e) => setNeedForm({ ...needForm, item: e.target.value })} placeholder="What is needed?" required />
            <SelectField label="Category" value={needForm.category} onChange={(e) => setNeedForm({ ...needForm, category: e.target.value })} options={["Clothing", "Education", "Medical", "Food", "Hygiene", "Furniture", "Electronics", "Other"]} />
            <Input label="Quantity" type="number" value={needForm.quantity} onChange={(e) => setNeedForm({ ...needForm, quantity: e.target.value })} placeholder="0" />
            <SelectField label="Priority" value={needForm.priority} onChange={(e) => setNeedForm({ ...needForm, priority: e.target.value })} options={["High", "Medium", "Low"]} />
            <Input label="Requested By" value={needForm.requestedBy} onChange={(e) => setNeedForm({ ...needForm, requestedBy: e.target.value })} placeholder="Staff name" />
            <Input label="Date Requested" type="date" value={needForm.dateRequested} onChange={(e) => setNeedForm({ ...needForm, dateRequested: e.target.value })} />
            <SelectField label="Status" value={needForm.status} onChange={(e) => setNeedForm({ ...needForm, status: e.target.value })} options={["Pending", "Completed"]} />
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 24 }}>
            <Btn label="Cancel" variant="ghost" onClick={closeNeedModal} />
            <Btn label={needLoading ? (editingNeed ? "Saving..." : "Submitting...") : (editingNeed ? "Save Changes" : "Submit Request")} onClick={saveNeed} disabled={needLoading} />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default InventoryPage;
