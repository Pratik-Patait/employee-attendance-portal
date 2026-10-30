import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { UserPlus, AlertCircle, CheckCircle } from 'lucide-react';

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [managers, setManagers] = useState([]);
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('EMPLOYEE');
  const [managerId, setManagerId] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data.users);
      setManagers(res.data.users.filter((u) => u.role === 'MANAGER' && u.is_active));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    try {
      await api.post('/users', {
        full_name: fullName,
        username,
        password,
        role,
        manager_id: managerId ? parseInt(managerId, 10) : null
      });

      setMessage({ type: 'success', text: 'User created successfully.' });
      setFullName('');
      setUsername('');
      setPassword('');
      setManagerId('');
      fetchUsers();
    } catch (err) {
      setMessage({ type: 'danger', text: err.response?.data?.message || 'Failed to create user' });
    }
  };

  const toggleStatus = async (user) => {
    try {
      await api.patch(`/users/${user.id}`, { is_active: !user.is_active });
      fetchUsers();
    } catch (err) {
      setMessage({ type: 'danger', text: err.response?.data?.message || 'Error updating status' });
    }
  };

  if (loading) return <div>Loading user directory...</div>;

  return (
    <div>
      <h2 style={{ color: '#1e3a8a', marginBottom: '1.5rem' }}>HR User Management</h2>

      {message.text && (
        <div className={`alert alert-${message.type}`}>
          <AlertCircle size={18} />
          <span>{message.text}</span>
        </div>
      )}

      {/* Create User Form */}
      <form onSubmit={handleCreateUser} style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '2.5rem' }}>
        <h4 style={{ marginBottom: '1rem', color: '#1e293b' }}>Create New Employee / Manager Account</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>Full Name</label>
            <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>Username</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
              <option value="EMPLOYEE">EMPLOYEE</option>
              <option value="MANAGER">MANAGER</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>Reporting Manager</label>
            <select value={managerId} onChange={(e) => setManagerId(e.target.value)} style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
              <option value="">None / Self-Managed</option>
              {managers.map((m) => (
                <option key={m.id} value={m.id}>{m.full_name} ({m.username})</option>
              ))}
            </select>
          </div>
        </div>

        <button type="submit" className="btn-primary" style={{ width: 'auto', padding: '0.65rem 1.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <UserPlus size={16} /> Create User
        </button>
      </form>

      {/* User Table */}
      <h3 style={{ color: '#1e3a8a', marginBottom: '1rem' }}>User Directory</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
        <thead>
          <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: '#475569' }}>
            <th style={{ padding: '0.75rem' }}>Name</th>
            <th style={{ padding: '0.75rem' }}>Username</th>
            <th style={{ padding: '0.75rem' }}>Role</th>
            <th style={{ padding: '0.75rem' }}>Reporting Manager</th>
            <th style={{ padding: '0.75rem' }}>Status</th>
            <th style={{ padding: '0.75rem' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
              <td style={{ padding: '0.75rem', fontWeight: 600 }}>{u.full_name}</td>
              <td style={{ padding: '0.75rem' }}>{u.username}</td>
              <td style={{ padding: '0.75rem' }}>
                <span className={`role-badge badge-${u.role.toLowerCase()}`}>{u.role}</span>
              </td>
              <td style={{ padding: '0.75rem' }}>{u.Manager ? u.Manager.full_name : '--'}</td>
              <td style={{ padding: '0.75rem' }}>
                <span style={{ color: u.is_active ? '#16a34a' : '#dc2626', fontWeight: 600 }}>
                  {u.is_active ? 'Active' : 'Deactivated'}
                </span>
              </td>
              <td style={{ padding: '0.75rem' }}>
                {u.role !== 'HR' && (
                  <button
                    onClick={() => toggleStatus(u)}
                    style={{
                      padding: '0.35rem 0.75rem',
                      borderRadius: '4px',
                      border: '1px solid #cbd5e1',
                      background: u.is_active ? '#fee2e2' : '#dcfce7',
                      color: u.is_active ? '#b91c1c' : '#15803d',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      fontWeight: 600
                    }}
                  >
                    {u.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagementPage;