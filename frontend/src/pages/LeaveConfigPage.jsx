import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { AlertCircle, PlusCircle } from 'lucide-react';

const LeaveConfigPage = () => {
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [name, setName] = useState('');
  const [quota, setQuota] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });

  const fetchLeaveTypes = async () => {
    try {
      const res = await api.get('/leave-types');
      setLeaveTypes(res.data.leaveTypes);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLeaveTypes();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    try {
      await api.post('/leave-types', { name, annual_quota: quota });
      setMessage({ type: 'success', text: 'Leave type added successfully.' });
      setName('');
      setQuota('');
      fetchLeaveTypes();
    } catch (err) {
      setMessage({ type: 'danger', text: err.response?.data?.message || 'Failed to create leave type' });
    }
  };

  return (
    <div>
      <h2 style={{ color: '#1e3a8a', marginBottom: '1.5rem' }}>Configure Leave Types</h2>

      {message.text && (
        <div className={`alert alert-${message.type}`}>
          <AlertCircle size={18} />
          <span>{message.text}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleCreate} style={{ display: 'flex', gap: '1rem', background: '#f8fafc', padding: '1.25rem', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '2rem', alignItems: 'flex-end' }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>Leave Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Parental Leave"
            style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
            required
          />
        </div>

        <div style={{ width: '180px' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>Annual Quota (Days)</label>
          <input
            type="number"
            min="0"
            value={quota}
            onChange={(e) => setQuota(e.target.value)}
            placeholder="e.g. 15"
            style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
            required
          />
        </div>

        <button type="submit" className="btn-primary" style={{ width: 'auto', padding: '0.65rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <PlusCircle size={16} /> Add Type
        </button>
      </form>

      {/* Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
        <thead>
          <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: '#475569' }}>
            <th style={{ padding: '0.75rem' }}>Leave Type Name</th>
            <th style={{ padding: '0.75rem' }}>Annual Quota</th>
            <th style={{ padding: '0.75rem' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {leaveTypes.map((lt) => (
            <tr key={lt.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
              <td style={{ padding: '0.75rem', fontWeight: 600 }}>{lt.name}</td>
              <td style={{ padding: '0.75rem' }}>{lt.annual_quota} days</td>
              <td style={{ padding: '0.75rem' }}>
                <span style={{ color: lt.is_active ? '#16a34a' : '#dc2626', fontWeight: 600 }}>
                  {lt.is_active ? 'Active' : 'Inactive'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeaveConfigPage;