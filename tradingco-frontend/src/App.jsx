import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './store/useAuthStore';
import ProtectedRoute from './routes/ProtectedRoute';
import AppLayout from './components/layout/AppLayout/AppLayout';
import LoginPage from './pages/LoginPage/LoginPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import DashboardPage from './pages/DashboardPage/DashboardPage';

// Placeholder pages for routes
function PlaceholderPage({ title, icon }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      height: '60vh', gap: '16px', animation: 'fadeIn 300ms ease-out'
    }}>
      <span style={{ fontSize: '3rem' }}>{icon}</span>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>{title}</h1>
      <p style={{ color: 'var(--text-secondary)' }}>Coming soon in Phase 2</p>
    </div>
  );
}

export default function App() {
  const loadUser = useAuthStore((s) => s.loadUser);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />} />
      <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" /> : <RegisterPage />} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/markets" element={<PlaceholderPage title="Markets" icon="📈" />} />
        <Route path="/asset/:symbol" element={<PlaceholderPage title="Asset Detail" icon="📊" />} />
        <Route path="/portfolio" element={<PlaceholderPage title="Portfolio" icon="💼" />} />
        <Route path="/orders" element={<PlaceholderPage title="Orders" icon="📋" />} />
        <Route path="/analytics" element={<PlaceholderPage title="Analytics" icon="📉" />} />
        <Route path="/watchlists" element={<PlaceholderPage title="Watchlists" icon="👁️" />} />
        <Route path="/screener" element={<PlaceholderPage title="Screener" icon="🔍" />} />
        <Route path="/news" element={<PlaceholderPage title="News" icon="📰" />} />
        <Route path="/journal" element={<PlaceholderPage title="Journal" icon="📓" />} />
        <Route path="/calendar" element={<PlaceholderPage title="Calendar" icon="📅" />} />
        <Route path="/alerts" element={<PlaceholderPage title="Alerts" icon="🔔" />} />
        <Route path="/settings" element={<PlaceholderPage title="Settings" icon="⚙️" />} />
      </Route>

      {/* Default redirect */}
      <Route path="*" element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} />} />
    </Routes>
  );
}
