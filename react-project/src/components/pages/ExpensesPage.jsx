import { useState } from "react";
import C from "../../constants/colors";
import Badge from "../ui/Badge";
import Btn from "../ui/Btn";
import Card from "../ui/Card";
import Input from "../ui/Input";
import Modal from "../ui/Modal";
import PageHeader from "../ui/PageHeader";
import SearchBar from "../ui/SearchBar";
import SelectField from "../ui/SelectField";
import { TH, TD } from "../ui/TableCells";
import expenseAPI from "../../api/expenseService";
import { Utensils, Zap, BookOpen, Pill, CreditCard, Wrench, AlertTriangle, Plus } from "lucide-react";

const ExpensesPage = ({ expenses, setExpenses, user }) => {
  const isAdmin = (user?.role || "").toLowerCase() === "admin";
  const [showAdd, setShowAdd] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ date: "", description: "", category: "", amount: "", paymentMode: "Cash", receipt: "" });
  const filtered = expenses.filter((e) => e.description.toLowerCase().includes(search.toLowerCase()) || e.category.toLowerCase().includes(search.toLowerCase()));
  const total = expenses.reduce((s, e) => s + Number(e.amount), 0);
  const catTotals = expenses.reduce((acc, e) => { acc[e.category] = (acc[e.category] || 0) + Number(e.amount); return acc; }, {});

  const resetForm = () => {
    setShowAdd(false);
    setEditingExpense(null);
    setForm({ date: "", description: "", category: "", amount: "", paymentMode: "Cash", receipt: "" });
    setError("");
  };

  const openExpenseForm = (expense = null) => {
    if (expense) {
      setEditingExpense(expense);
      setForm({
        date: expense.date || "",
        description: expense.description || "",
        category: expense.category || "",
        amount: expense.amount?.toString?.() || String(expense.amount || ""),
        paymentMode: expense.paymentMode || "Cash",
        receipt: expense.receipt || "",
      });
    } else {
      setEditingExpense(null);
      setForm({ date: "", description: "", category: "", amount: "", paymentMode: "Cash", receipt: "" });
    }
    setError("");
    setShowAdd(true);
  };
  
  const handleAdd = async () => {
    if (!form.description || !form.amount) return;
    
    setLoading(true);
    setError("");
    
    try {
      const payload = {
        expense_category: form.category || "Miscellaneous",
        description: form.description,
        amount: Number(form.amount),
        expense_date: form.date ? new Date(form.date).toISOString() : new Date().toISOString(),
        payment_mode: form.paymentMode,
      };

      if (editingExpense) {
        const response = await expenseAPI.update(editingExpense.id, payload);
        const updatedExpense = response.data.data;
        setExpenses((current) => current.map((item) => item.id === editingExpense.id ? {
          ...item,
          date: updatedExpense.expense_date ? new Date(updatedExpense.expense_date).toISOString().split('T')[0] : form.date,
          description: updatedExpense.description,
          category: updatedExpense.expense_category,
          amount: updatedExpense.amount,
          paymentMode: updatedExpense.payment_mode,
          receipt: form.receipt || item.receipt,
        } : item));
      } else {
        const response = await expenseAPI.create(payload);
        const newExpense = response.data.data;
        setExpenses((p) => [
          {
            id: newExpense.expense_id,
            date: newExpense.expense_date ? new Date(newExpense.expense_date).toISOString().split('T')[0] : "",
            description: newExpense.description,
            category: newExpense.expense_category,
            amount: newExpense.amount,
            paymentMode: newExpense.payment_mode,
            receipt: form.receipt || "",
          },
          ...p,
        ]);
      }

      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save expense. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const catIcons = { 
    Food: Utensils, 
    Utilities: Zap, 
    Education: BookOpen, 
    Medical: Pill, 
    Salaries: CreditCard, 
    Maintenance: Wrench 
  };

  return (
    <div style={{ padding: 32 }}>
      <PageHeader title="Expense Tracker" subtitle="Financial records and budget management" action={isAdmin ? <Btn label="Add Expense" icon={<Plus size={16} />} onClick={() => openExpenseForm()} /> : null} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 20, marginBottom: 24 }}>
        <Card>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 13, color: C.textMid, fontWeight: 600, marginBottom: 8 }}>TOTAL THIS MONTH</div>
            <div style={{ fontSize: 38, fontWeight: 800, color: C.primary }}>₹{total.toLocaleString()}</div>
            <div style={{ fontSize: 13, color: C.textLight, marginTop: 4 }}>{expenses.length} transactions</div>
          </div>
        </Card>
        <Card>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 14 }}>Breakdown by Category</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {Object.entries(catTotals).map(([cat, amt]) => {
              const Icon = catIcons[cat] || AlertTriangle;
              return (
                <div key={cat} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: C.primaryLight, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon size={16} color={C.primary} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{cat}</span>
                      <span style={{ fontSize: 13, color: C.textMid }}>₹{amt.toLocaleString()}</span>
                    </div>
                    <div style={{ height: 6, background: C.bg, borderRadius: 4 }}>
                      <div style={{ height: "100%", width: `${(amt / total) * 100}%`, background: C.primary, borderRadius: 4 }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
      <Card>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search expenses..." />
          <div style={{ fontSize: 13, color: C.textMid }}>{filtered.length} records</div>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr>{["Date", "Description", "Category", "Amount", "Payment Mode", "Receipt", ...(isAdmin ? [""] : [])].map((h) => <TH key={h || 'actions'}>{h}</TH>)}</tr></thead>
          <tbody>
            {filtered.map((e, i) => (
              <tr key={e.id} style={{ borderBottom: `1px solid ${C.border}`, background: i % 2 === 0 ? C.white : "#FAFBFC" }}>
                <TD style={{ color: C.textMid, fontSize: 13 }}>{e.date}</TD>
                <TD style={{ fontWeight: 600 }}>{e.description}</TD>
                <TD style={{ color: C.textMid, fontSize: 13 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    {(() => {
                      const Icon = catIcons[e.category] || AlertTriangle;
                      return <Icon size={14} color={C.textMid} />;
                    })()}
                    {e.category}
                  </div>
                </TD>
                <TD style={{ fontWeight: 700, fontSize: 15 }}>₹{Number(e.amount).toLocaleString()}</TD>
                <TD style={{ color: C.textMid, fontSize: 13 }}>{e.paymentMode}</TD>
                <TD><span style={{ padding: "3px 10px", background: C.bg, borderRadius: 6, fontSize: 12, fontWeight: 600, color: C.textMid }}>{e.receipt}</span></TD>
                {isAdmin && <TD style={{ textAlign: "right" }}><button onClick={() => openExpenseForm(e)} style={{ border: `1px solid ${C.primary}`, background: C.primary + '10', color: C.primary, fontSize: 12, fontWeight: 700, borderRadius: 8, padding: '5px 10px', cursor: 'pointer', fontFamily: 'inherit' }}>Edit</button></TD>}
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      {showAdd && isAdmin && (
        <Modal title={editingExpense ? "Edit Expense" : "Add Expense"} onClose={resetForm}>
          {error && <div style={{ background: "#FEF2F2", color: C.danger, padding: "10px 14px", borderRadius: 10, fontSize: 13, marginBottom: 16 }}>{error}</div>}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Input label="Date" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
            <SelectField label="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} options={["Food", "Utilities", "Education", "Medical", "Salaries", "Maintenance", "Events", "Transport", "Other"]} required />
            <div style={{ gridColumn: "span 2" }}>
              <Input label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="What was this expense for?" required />
            </div>
            <Input label="Amount (₹)" type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="0" required />
            <SelectField label="Payment Mode" value={form.paymentMode} onChange={(e) => setForm({ ...form, paymentMode: e.target.value })} options={["Cash", "Bank Transfer", "Online", "Cheque", "UPI"]} />
            <Input label="Receipt No. (optional)" value={form.receipt} onChange={(e) => setForm({ ...form, receipt: e.target.value })} placeholder="e.g. RCP-007" />
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 24 }}>
            <Btn label="Cancel" variant="ghost" onClick={resetForm} />
            <Btn label={loading ? (editingExpense ? "Saving..." : "Adding...") : (editingExpense ? "Save Changes" : "Add Expense")} onClick={handleAdd} disabled={loading} />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ExpensesPage;
