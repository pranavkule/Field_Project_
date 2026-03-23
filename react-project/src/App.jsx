import { useState } from 'react';

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

export default function App() {
  const [screen, setScreen] = useState('landing');
  const [page, setPage] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [selectedChild, setSelectedChild] = useState(null);
  const [children, setChildren] = useState(SAMPLE_CHILDREN);
  const [staff, setStaff] = useState(SAMPLE_STAFF);
  const [expenses, setExpenses] = useState(SAMPLE_EXPENSES);
  const [inventory, setInventory] = useState(SAMPLE_INVENTORY);
  const [needs, setNeeds] = useState(SAMPLE_NEEDS);

  const handleAuth = (u) => {
    setUser(u);
    setScreen('app');
    setPage('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
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
        return <HealthDesk children={children} />;
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
    <div style={{ fontFamily: "'DM Sans','Segoe UI',system-ui,sans-serif", display: 'flex', minHeight: '100vh', background: C.bg }}>
      <Sidebar active={page} setPage={(p) => { setPage(p); setSelectedChild(null); }} onLogout={handleLogout} />
      <main style={{ flex: 1, overflowY: 'auto', minHeight: '100vh' }}>
        <Topbar user={user} />
        {renderPage()}
      </main>
    </div>
  );
}
