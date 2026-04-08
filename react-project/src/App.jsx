import { useState, useEffect } from 'react';

import C from './constants/colors';

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
import donationAPI from './api/donationService';
import expenseAPI from './api/expenseService';
import inventoryAPI from './api/inventoryService';
import staffAPI from './api/staffService';
import authAPI from './api/authService';

const SUPER_ADMIN_EMAIL = 'suryodaybalgruh@gmail.com';

const normalizeRole = (role) => {
  const value = typeof role === 'string' ? role.trim().toLowerCase() : '';
  if (value === 'administrator' || value === 'superadmin') return 'admin';
  if (value === 'admin' || value === 'viewer') return value;
  return value;
};

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
        const parsedUser = JSON.parse(savedUser);
        return parsedUser
          ? {
              ...parsedUser,
              email: (parsedUser.email || '').trim().toLowerCase(),
              role: normalizeRole(parsedUser.role),
            }
          : null;
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [page, setPage] = useState('dashboard');
  const [selectedChild, setSelectedChild] = useState(null);
  const [children, setChildren] = useState([]);
  const [staff, setStaff] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [needs, setNeeds] = useState([]);
  const [healthRecords, setHealthRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pendingRegistrations, setPendingRegistrations] = useState([]);
  const [pendingRegistrationsLoading, setPendingRegistrationsLoading] = useState(false);

  const normalizedUserEmail = (user?.email || '').trim().toLowerCase();
  const isSuperAdmin = normalizedUserEmail === SUPER_ADMIN_EMAIL || user?.user_id === 'superadmin-local';

  const loadPendingRegistrations = async () => {
    if (!isSuperAdmin || !localStorage.getItem('token')) return;

    setPendingRegistrationsLoading(true);
    try {
      const response = await authAPI.getPendingRequests();
      setPendingRegistrations(response.data?.data?.items || []);
    } catch (error) {
      console.error('Failed to fetch pending registrations:', error);
    } finally {
      setPendingRegistrationsLoading(false);
    }
  };

  const handleApproveRegistration = async (requestId) => {
    try {
      await authAPI.approveRequest(requestId);
      await loadPendingRegistrations();
    } catch (error) {
      console.error('Failed to approve registration:', error);
    }
  };

  const handleDeclineRegistration = async (requestId) => {
    try {
      await authAPI.declineRequest(requestId);
      await loadPendingRegistrations();
    } catch (error) {
      console.error('Failed to decline registration:', error);
    }
  };

  // Fetch data from backend when user is logged in
  useEffect(() => {
    const fetchData = async () => {
      if (!user || !localStorage.getItem('token')) return;
      
      setLoading(true);
      try {
        // Fetch all data in parallel, but keep partial successes if one endpoint fails.
        const [childrenRes, staffRes, healthRes, donationsRes, expensesRes, inventoryRes] = await Promise.allSettled([
          childAPI.getAll(),
          staffAPI.getAll(),
          healthAPI.getAll(),
          donationAPI.getAll(),
          expenseAPI.getAll(),
          inventoryAPI.getAll(),
        ]);

        if (childrenRes.status === 'fulfilled' && childrenRes.value.data.data && childrenRes.value.data.data.items) {
          const childItems = childrenRes.value.data.data.items;
          setChildren(childItems.map((item) => ({
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
        } else if (childrenRes.status === 'rejected') {
          console.error('Failed to fetch children:', childrenRes.reason);
        }

        if (staffRes.status === 'fulfilled') {
          const staffPayload = staffRes.value?.data?.data;
          const staffItems = Array.isArray(staffPayload)
            ? staffPayload
            : Array.isArray(staffPayload?.items)
              ? staffPayload.items
              : [];

          setStaff(staffItems.map((item) => ({
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
        } else {
          console.error('Failed to fetch staff:', staffRes.reason);
        }

        if (healthRes.status === 'fulfilled' && healthRes.value.data.data && Array.isArray(healthRes.value.data.data)) {
          const childItems = childrenRes.status === 'fulfilled' ? (childrenRes.value.data.data?.items || []) : [];
          setHealthRecords(healthRes.value.data.data.map((item) => ({
            id: item.health_id,
            childId: item.child_id,
            childName: childItems.find((child) => child.child_id === item.child_id)
              ? `${childItems.find((child) => child.child_id === item.child_id).first_name || ""} ${childItems.find((child) => child.child_id === item.child_id).last_name || ""}`.trim()
              : "",
            date: item.record_date ? new Date(item.record_date).toISOString().split('T')[0] : "",
            type: item.blood_pressure || "Routine Checkup",
            doctor: item.doctor || "",
            notes: item.medical_notes || "",
            status: item.status || "Pending",
            followUp: item.follow_up || "",
          })));
        } else if (healthRes.status === 'rejected') {
          console.error('Failed to fetch health records:', healthRes.reason);
        }

        if (donationsRes.status === 'fulfilled' && donationsRes.value.data.data && Array.isArray(donationsRes.value.data.data)) {
          setNeeds(donationsRes.value.data.data.map((item) => ({
            id: item.donation_id,
            item: item.item_name,
            category: item.category,
            quantity: item.quantity_required,
            priority: item.priority || "Medium",
            requestedBy: item.donor_name || "",
            dateRequested: item.date_received ? new Date(item.date_received).toISOString().split('T')[0] : "",
            status: item.quantity_received >= item.quantity_required ? "Completed" : "Pending",
          })));
        } else if (donationsRes.status === 'rejected') {
          console.error('Failed to fetch donations:', donationsRes.reason);
        }

        if (expensesRes.status === 'fulfilled' && expensesRes.value.data.data && Array.isArray(expensesRes.value.data.data)) {
          setExpenses(expensesRes.value.data.data.map((item) => ({
            id: item.expense_id,
            date: item.expense_date ? new Date(item.expense_date).toISOString().split('T')[0] : "",
            description: item.description,
            category: item.expense_category,
            amount: item.amount,
            paymentMode: item.payment_mode,
            receipt: item.receipt || "",
          })));
        } else if (expensesRes.status === 'rejected') {
          console.error('Failed to fetch expenses:', expensesRes.reason);
        }

        if (inventoryRes.status === 'fulfilled' && inventoryRes.value.data.data && Array.isArray(inventoryRes.value.data.data)) {
          setInventory(inventoryRes.value.data.data.map((item) => ({
            id: item.item_id,
            item: item.item_name,
            category: item.category,
            quantity: item.quantity_available,
            unit: "", // unit is UI-only
            minStock: 0, // minStock is UI-only
            status: "Adequate",
            lastUpdated: item.last_updated ? new Date(item.last_updated).toISOString().split('T')[0] : "",
          })));
        } else if (inventoryRes.status === 'rejected') {
          console.error('Failed to fetch inventory:', inventoryRes.reason);
        }
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (screen === 'app') {
      fetchData();
    }
  }, [user, screen]);

  useEffect(() => {
    if (!isSuperAdmin || screen !== 'app') return;

    loadPendingRegistrations();
    const timer = setInterval(loadPendingRegistrations, 15000);
    return () => clearInterval(timer);
  }, [isSuperAdmin, screen]);

  const handleAuth = (u) => {
    const nextUser = u
      ? {
          ...u,
          email: (u.email || '').trim().toLowerCase(),
          role: normalizeRole(u.role),
        }
      : u;

    setUser(nextUser);
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

  const renderApprovalCenter = () => (
    <div style={{ padding: 32 }}>
      <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20, boxShadow: '0 8px 24px rgba(0,0,0,0.05)' }}>
        <h2 style={{ margin: 0, color: C.text, fontSize: 22, fontWeight: 800 }}>Registration Approval Center</h2>
        <p style={{ margin: '8px 0 0', color: C.textMid, fontSize: 14 }}>
          New signup requests appear here. Accept or decline each request to complete onboarding.
        </p>
      </div>

      <div style={{ marginTop: 18, background: C.white, border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F8FAFC' }}>
              <th style={{ textAlign: 'left', padding: 12, fontSize: 13, color: C.textMid }}>Name</th>
              <th style={{ textAlign: 'left', padding: 12, fontSize: 13, color: C.textMid }}>Email</th>
              <th style={{ textAlign: 'left', padding: 12, fontSize: 13, color: C.textMid }}>Role</th>
              <th style={{ textAlign: 'left', padding: 12, fontSize: 13, color: C.textMid }}>Institution</th>
              <th style={{ textAlign: 'left', padding: 12, fontSize: 13, color: C.textMid }}>Requested At</th>
              <th style={{ textAlign: 'right', padding: 12, fontSize: 13, color: C.textMid }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {pendingRegistrations.map((request) => (
              <tr key={request.request_id} style={{ borderTop: `1px solid ${C.border}` }}>
                <td style={{ padding: 12, color: C.text, fontSize: 14, fontWeight: 700 }}>{request.name}</td>
                <td style={{ padding: 12, color: C.textMid, fontSize: 13 }}>{request.email}</td>
                <td style={{ padding: 12, color: C.textMid, fontSize: 13, textTransform: 'capitalize' }}>{request.role}</td>
                <td style={{ padding: 12, color: C.textMid, fontSize: 13 }}>{request.organization || 'CareSync Institution'}</td>
                <td style={{ padding: 12, color: C.textMid, fontSize: 13 }}>{request.created_at ? new Date(request.created_at).toLocaleString() : '-'}</td>
                <td style={{ padding: 12, textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', gap: 8 }}>
                    <button
                      type="button"
                      onClick={() => handleApproveRegistration(request.request_id)}
                      style={{ border: `1px solid ${C.success}`, background: '#ECFDF3', color: C.success, fontSize: 12, fontWeight: 700, borderRadius: 8, padding: '5px 10px', cursor: 'pointer', fontFamily: 'inherit' }}
                    >
                      Accept
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeclineRegistration(request.request_id)}
                      style={{ border: `1px solid ${C.danger}`, background: '#FEF2F2', color: C.danger, fontSize: 12, fontWeight: 700, borderRadius: 8, padding: '5px 10px', cursor: 'pointer', fontFamily: 'inherit' }}
                    >
                      Decline
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {pendingRegistrations.length === 0 && (
          <div style={{ padding: 20, textAlign: 'center', color: C.textMid, fontSize: 14 }}>
            {pendingRegistrationsLoading ? 'Checking new requests...' : 'No pending registration requests'}
          </div>
        )}
      </div>
    </div>
  );

  const renderPage = () => {
    if (page === 'childProfile' && selectedChild) {
      return <ChildProfile child={selectedChild} user={user} setChildren={setChildren} setSelectedChild={setSelectedChild} goBack={() => setPage('children')} />;
    }

    switch (page) {
      case 'approvalCenter':
        return isSuperAdmin ? renderApprovalCenter() : <Dashboard setPage={setPage} children={children} staff={staff} expenses={expenses} inventory={inventory} />;
      case 'dashboard':
        return <Dashboard setPage={setPage} children={children} staff={staff} expenses={expenses} inventory={inventory} />;
      case 'children':
        return <ChildDirectory children={children} setChildren={setChildren} setPage={setPage} setSelectedChild={setSelectedChild} user={user} />;
      case 'staff':
        return <StaffDirectory staff={staff} setStaff={setStaff} user={user} />;
      case 'health':
        return <HealthDesk children={children} healthRecords={healthRecords} setHealthRecords={setHealthRecords} user={user} />;
      case 'attendance':
        return <AttendancePage staff={staff} user={user} />;
      case 'inventory':
        return <InventoryPage inventory={inventory} setInventory={setInventory} needs={needs} setNeeds={setNeeds} user={user} />;
      case 'expenses':
        return <ExpensesPage expenses={expenses} setExpenses={setExpenses} user={user} />;
      default:
        return <Dashboard setPage={setPage} children={children} staff={staff} expenses={expenses} inventory={inventory} />;
    }
  };

  return (
    <div style={{ fontFamily: "'Inter', 'DM Sans','Segoe UI',system-ui,sans-serif", display: 'flex', minHeight: '100vh', background: C.bg, boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.02)' }}>
      <Sidebar active={page} setPage={(p) => { setPage(p); setSelectedChild(null); }} onLogout={handleLogout} isSuperAdmin={isSuperAdmin} />
      <main style={{ flex: 1, overflowY: 'auto', minHeight: '100vh', background: 'linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)' }}>
        <Topbar
          user={user}
          isSuperAdmin={isSuperAdmin}
          pendingRegistrations={pendingRegistrations}
          pendingRegistrationsLoading={pendingRegistrationsLoading}
          onRefreshRegistrations={loadPendingRegistrations}
          onApproveRegistration={handleApproveRegistration}
          onDeclineRegistration={handleDeclineRegistration}
        />
        {renderPage()}
      </main>
    </div>
  );
}
