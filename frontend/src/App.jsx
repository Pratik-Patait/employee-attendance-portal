import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';

// Layout wrapper for authenticated views
const DashboardLayout = () => {
  return (
    <>
      <Navbar />
      <div className="page-container">
        {/* Child route pages will render here */}
        <div style={{ background: '#fff', padding: '2rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <OutletPlaceholder />
        </div>
      </div>
    </>
  );
};

// Placeholder component until we create pages in Module 7
const OutletPlaceholder = () => {
  const { user } = useAuth();
  return (
    <div>
      <h2>Welcome, {user.full_name}</h2>
      <p style={{ marginTop: '0.5rem', color: '#4b5563' }}>
        You are authenticated with role: <strong>{user.role}</strong>.
      </p>
      <p style={{ marginTop: '0.5rem', color: '#6b7280' }}>
        Module 6 Authentication, Axios Interceptors, and Role Routing verified. Proceeding to Module 7 for feature pages.
      </p>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={['EMPLOYEE', 'MANAGER', 'HR']} />}>
            <Route path="/" element={<DashboardLayout />} />
            <Route path="/timesheet" element={<DashboardLayout />} />
          </Route>

          {/* Employee & Manager Routes */}
          <Route element={<ProtectedRoute allowedRoles={['EMPLOYEE', 'MANAGER']} />}>
            <Route path="/attendance" element={<DashboardLayout />} />
            <Route path="/leave/apply" element={<DashboardLayout />} />
          </Route>

          {/* Manager Only Routes */}
          <Route element={<ProtectedRoute allowedRoles={['MANAGER']} />}>
            <Route path="/manager/approvals" element={<DashboardLayout />} />
          </Route>

          {/* HR Only Routes */}
          <Route element={<ProtectedRoute allowedRoles={['HR']} />}>
            <Route path="/hr/users" element={<DashboardLayout />} />
            <Route path="/hr/leave-types" element={<DashboardLayout />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;