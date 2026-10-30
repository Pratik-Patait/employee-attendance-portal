import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import AttendancePage from './pages/AttendancePage';
import TimesheetPage from './pages/TimesheetPage';
import ApplyLeavePage from './pages/ApplyLeavePage';
import LeaveApprovalPage from './pages/LeaveApprovalPage';
import UserManagementPage from './pages/UserManagementPage';
import LeaveConfigPage from './pages/LeaveConfigPage';

const DashboardLayout = () => {
  return (
    <>
      <Navbar />
      <div className="page-container">
        <div style={{ background: '#fff', padding: '2rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <Outlet />
        </div>
      </div>
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<LoginPage />} />

          {/* All Authenticated Roles: Timesheet */}
          <Route element={<ProtectedRoute allowedRoles={['EMPLOYEE', 'MANAGER', 'HR']} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/timesheet" element={<TimesheetPage />} />
            </Route>
          </Route>

          {/* Employee & Manager Routes: Attendance and Leave Application */}
          <Route element={<ProtectedRoute allowedRoles={['EMPLOYEE', 'MANAGER']} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/attendance" element={<AttendancePage />} />
              <Route path="/leave/apply" element={<ApplyLeavePage />} />
            </Route>
          </Route>

          {/* Manager Only: Leave Approvals */}
          <Route element={<ProtectedRoute allowedRoles={['MANAGER']} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/manager/approvals" element={<LeaveApprovalPage />} />
            </Route>
          </Route>

          {/* HR Only: User & Leave Management */}
          <Route element={<ProtectedRoute allowedRoles={['HR']} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/hr/users" element={<UserManagementPage />} />
              <Route path="/hr/leave-types" element={<LeaveConfigPage />} />
            </Route>
          </Route>

          {/* Root redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;