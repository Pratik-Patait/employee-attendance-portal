import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Clock, Calendar, CheckSquare, Users, Settings, LogOut } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <nav className="portal-navbar">
      <div className="navbar-brand">
        <Clock size={22} className="brand-icon" />
        <span className="brand-title">Attendance Portal</span>
      </div>

      <div className="navbar-links">
        {/* Check-in / Out: Employee & Manager Only */}
        {['EMPLOYEE', 'MANAGER'].includes(user.role) && (
          <NavLink to="/attendance" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
            <Clock size={18} />
            <span>Check In/Out</span>
          </NavLink>
        )}

        {/* Timesheet: Accessible to all roles */}
        <NavLink to="/timesheet" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
          <Calendar size={18} />
          <span>Timesheet</span>
        </NavLink>

        {/* Apply Leave: Employee & Manager Only */}
        {['EMPLOYEE', 'MANAGER'].includes(user.role) && (
          <NavLink to="/leave/apply" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
            <Calendar size={18} />
            <span>Apply Leave</span>
          </NavLink>
        )}

        {/* Leave Approvals: Manager Only */}
        {user.role === 'MANAGER' && (
          <NavLink to="/manager/approvals" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
            <CheckSquare size={18} />
            <span>Leave Approvals</span>
          </NavLink>
        )}

        {/* User Management: HR Only */}
        {user.role === 'HR' && (
          <NavLink to="/hr/users" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
            <Users size={18} />
            <span>Manage Users</span>
          </NavLink>
        )}

        {/* Leave Configuration: HR Only */}
        {user.role === 'HR' && (
          <NavLink to="/hr/leave-types" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
            <Settings size={18} />
            <span>Configure Leaves</span>
          </NavLink>
        )}
      </div>

      <div className="navbar-user">
        <div className="user-info">
          <span className="user-name">{user.full_name}</span>
          <span className={`role-badge badge-${user.role.toLowerCase()}`}>{user.role}</span>
        </div>
        <button onClick={logout} className="logout-btn" title="Sign Out">
          <LogOut size={18} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;