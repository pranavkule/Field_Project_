import { useState, useEffect } from 'react';

import C from './constants/colors';
import { SAMPLE_CHILDREN, SAMPLE_STAFF, SAMPLE_HEALTH, SAMPLE_INVENTORY, SAMPLE_NEEDS, SAMPLE_EXPENSES } from './constants/data';

import Sidebar from './components/layout/Sidebar';
import Topbar from './components/layout/Topbar';

import Dashboard from './components/pages/Dashboard';
import ChildDirectory from './components/pages/ChildDirectory';
import ChildProfile from './components/pages/ChildProfile';
import StaffDirectory from './components/pages/StaffDirectory';
import HealthDesk from './components/pages/HealthDesk';
import AttendancePage from './components/pages/AttendancePage';
import InventoryPage from './components/pages/InventoryPage';
import ExpensesPage from './components/pages/ExpensesPage';
import LandingPage from './components/pages/LandingPage';
import AuthPage from './components/pages/AuthPage';
import childAPI from './api/childService';
import healthAPI from './api/healthService';
import expenseAPI from './api/expenseService';
import inventoryAPI from './api/inventoryService';
import staffAPI from './api/staffService';
import apiClient from './api/apiClient';

export default function App() {
  // Initialize user from localStorage if token exists
  const [screen, setScreen] = useState(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      return 'app';
    }
    return 'landing';
  });

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [page, setPage] = useState('dashboard');
  const [selectedChild, setSelectedChild] = useState(null);
  const [children, setChildren] = useState(SAMPLE_CHILDREN);
  const [staff, setStaff] = useState(SAMPLE_STAFF);
  const [expenses, setExpenses] = useState(SAMPLE_EXPENSES);
  const [inventory, setInventory] = useState(SAMPLE_INVENTORY);
  const [needs, setNeeds] = useState(SAMPLE_NEEDS);
  const [loading, setLoading] = useState(false);

  // Fetch data from backend when user is logged in
  useEffect(() => {
    const fetchData = async () => {
      if (!user || !localStorage.getItem('token')) return;
      
      setLoading(true);
      try {
        // Fetch all data from backend in parallel
        const [childrenRes, staffRes, healthRes, expensesRes, inventoryRes] = await Promise.all([
          childAPI.getAll(),
          staffAPI.getAll(),
          healthAPI.getAll(),
          expenseAPI.getAll(),
          inventoryAPI.getAll(),
        ]);

        // Update state with fetched data
        if (childrenRes.data.data && childrenRes.data.data.items) {
          setChildren(childrenRes.data.data.items.map((item) => ({
            id: item.child_id,
            first_name: item.first_name,
            last_name: item.last_name,
            name: `${item.first_name || ""} ${item.last_name || ""}`.trim(),
            gender: item.gender,
            date_of_birth: item.date_of_birth,
            admission_date: item.admission_date,
            status: item.status,
            guardian_name: item.guardian_name,
            guardian_contact: item.guardian_contact,
            address: item.address,
            blood_group: item.blood_group,
            medical_condition: item.medical_condition,
            education_level: item.education_level,
            photo: item.photo_url || (item.first_name || "").slice(0,1).toUpperCase() + (item.last_name || "").slice(0,1).toUpperCase(),
          })));
        }
        
        if (staffRes.data.data && Array.isArray(staffRes.data.data)) {
          setStaff(staffRes.data.data.map((item) => ({
            id: item.staff_id,
            name: `${item.first_name || ""} ${item.last_name || ""}`.trim(),
            role: item.role || "",
            dept: item.department || "",
            phone: item.contact_number || "",
            email: item.email || "",
            joinDate: item.joining_date ? new Date(item.joining_date).toISOString().split('T')[0] : "",
            shift: item.shift || "Morning",
            status: item.status || "Active",
            photo: (item.first_name || "").slice(0, 1).toUpperCase() + (item.last_name || "").slice(0, 1).toUpperCase(),
          })));
        }

        if (healthRes.data.data && Array.isArray(healthRes.data.data)) {
          setNeeds(healthRes.data.data.map((item) => ({
            id: item.health_id,
            childId: item.child_id,
            childName: item.child_name || "",
            date: item.record_date ? new Date(item.record_date).toISOString().split('T')[0] : "",
            type: item.blood_pressure || "Routine Checkup",
            doctor: item.doctor || "",
            notes: item.medical_notes || "",
            status: item.status || "Pending",
            followUp: item.follow_up || "",
          })));
        }
        
        if (expensesRes.data.data && Array.isArray(expensesRes.data.data)) {
          setExpenses(expensesRes.data.data.map((item) => ({
            id: item.expense_id,
            date: item.expense_date ? new Date(item.expense_date).toISOString().split('T')[0] : "",
            description: item.description,
            category: item.expense_category,
            amount: item.amount,
            paymentMode: item.payment_mode,
            receipt: item.receipt || "",
          })));
        }
        
        if (inventoryRes.data.data && Array.isArray(inventoryRes.data.data)) {
          setInventory(inventoryRes.data.data.map((item) => ({
            id: item.item_id,
            item: item.item_name,
            category: item.category,
            quantity: item.quantity_available,
            unit: "", // unit is UI-only
            minStock: 0, // minStock is UI-only
            status: "Adequate",
            lastUpdated: item.last_updated ? new Date(item.last_updated).toISOString().split('T')[0] : "",
          })));
        }
      } catch (err) {
        console.error('Failed to fetch data:', err);
        // Keep using sample data if fetch fails
      } finally {
        setLoading(false);
      }
    };

    if (screen === 'app') {
      fetchData();
    }
  }, [user, screen]);

  const handleAuth = (u) => {
    setUser(u);
    setScreen('app');
    setPage('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setScreen('landing');
  };

  if (screen === 'landing') {
    return (
      <div style={{ fontFamily: "'DM Sans','Segoe UI',system-ui,sans-serif" }}>
        <LandingPage onLogin={() => setScreen('login')} onSignup={() => setScreen('signup')} />
      </div>
    );
  }

  if (screen === 'login' || screen === 'signup') {
    return (
      <div style={{ fontFamily: "'DM Sans','Segoe UI',system-ui,sans-serif" }}>
        <AuthPage mode={screen} onAuth={handleAuth} switchMode={() => setScreen(screen === 'login' ? 'signup' : 'login')} />
      </div>
    );
  }

  const renderPage = () => {
    if (page === 'childProfile' && selectedChild) {
      return <ChildProfile child={selectedChild} goBack={() => setPage('children')} />;
    }

    switch (page) {
      case 'dashboard':
        return <Dashboard setPage={setPage} children={children} staff={staff} expenses={expenses} inventory={inventory} />;
      case 'children':
        return <ChildDirectory children={children} setChildren={setChildren} setPage={setPage} setSelectedChild={setSelectedChild} />;
      case 'staff':
        return <StaffDirectory staff={staff} setStaff={setStaff} />;
      case 'health':
        return <HealthDesk children={children} needs={needs} setNeeds={setNeeds} />;
      case 'attendance':
        return <AttendancePage staff={staff} />;
      case 'inventory':
        return <InventoryPage inventory={inventory} setInventory={setInventory} needs={needs} setNeeds={setNeeds} />;
      case 'expenses':
        return <ExpensesPage expenses={expenses} setExpenses={setExpenses} />;
      default:
        return <Dashboard setPage={setPage} children={children} staff={staff} expenses={expenses} inventory={inventory} />;
    }
  };

  return (
    <div style={{ fontFamily: "'Inter', 'DM Sans','Segoe UI',system-ui,sans-serif", display: 'flex', minHeight: '100vh', background: C.bg, boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.02)' }}>
      <Sidebar active={page} setPage={(p) => { setPage(p); setSelectedChild(null); }} onLogout={handleLogout} />
      <main style={{ flex: 1, overflowY: 'auto', minHeight: '100vh', background: 'linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)' }}>
        <Topbar user={user} />
        {renderPage()}
      </main>
    </div>
  );
}
