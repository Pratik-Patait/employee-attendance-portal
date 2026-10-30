import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Calendar, AlertCircle, CheckCircle } from 'lucide-react';

const ApplyLeavePage = () => {
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [leaveTypeId, setLeaveTypeId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    try {
      const [typeRes, leaveRes] = await Promise.all([
        api.get('/leave-types/active'),
        api.get('/leaves/my-leaves')
      ]);
      setLeaveTypes(typeRes.data.leaveTypes);
      if (typeRes.data.leaveTypes.length > 0) {
        setLeaveTypeId(typeRes.data.leaveTypes[0].id);
      }
      setLeaves(leaveRes.data.leaves);
    } catch (err) {
      console.error('Error loading leave data:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    setSubmitting(true);

    try {
      await api.post('/leaves/apply', {
        leave_type_id: leaveTypeId,
        start_date: startDate,
        end_date: endDate,
        reason
      });

      setMessage({ type: 'success', text: 'Leave request submitted successfully.' });
      setStartDate('');
      setEndDate('');
      setReason('');
      loadData();
    } catch (err) {
      setMessage({ type: 'danger', text: err.response?.data?.message || 'Failed to submit leave' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h2 style={{ color: '#1e3a8a', marginBottom: '1.5rem' }}>Apply for Leave</h2>

      {message.text && (
        <div className={`alert alert-${message.type}`}>
          {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span>{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '2.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>Leave Type</label>
            <select
              value={leaveTypeId}
              onChange={(e) => setLeaveTypeId(e.target.value)}
              style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #d1d5db' }}
              required
            >
              {leaveTypes.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} (Quota: {t.annual_quota} days)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #d1d5db' }}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #d1d5db' }}
              required
            />
          </div>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>Reason</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            placeholder="Provide context for your leave request"
            style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #d1d5db', fontFamily: 'inherit' }}
            required
          />
        </div>

        <button type="submit" disabled={submitting} className="btn-primary" style={{ width: 'auto', padding: '0.75rem 2rem' }}>
          {submitting ? 'Submitting...' : 'Submit Leave Request'}
        </button>
      </form>

      <h3 style={{ color: '#1e3a8a', marginBottom: '1rem' }}>My Leave Requests</h3>
      {leaves.length === 0 ? (
        <p style={{ color: '#6b7280' }}>No leave requests submitted yet.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: '#475569' }}>
              <th style={{ padding: '0.75rem' }}>Type</th>
              <th style={{ padding: '0.75rem' }}>Dates</th>
              <th style={{ padding: '0.75rem' }}>Reason</th>
              <th style={{ padding: '0.75rem' }}>Status</th>
              <th style={{ padding: '0.75rem' }}>Manager Remark</th>
            </tr>
          </thead>
          <tbody>
            {leaves.map((l) => (
              <tr key={l.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '0.75rem', fontWeight: 600 }}>{l.LeaveType?.name}</td>
                <td style={{ padding: '0.75rem' }}>{l.start_date} to {l.end_date}</td>
                <td style={{ padding: '0.75rem' }}>{l.reason}</td>
                <td style={{ padding: '0.75rem' }}>
                  <span
                    style={{
                      padding: '0.2rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      background: l.status === 'APPROVED' ? '#dcfce7' : l.status === 'REJECTED' ? '#fee2e2' : '#fef3c7',
                      color: l.status === 'APPROVED' ? '#15803d' : l.status === 'REJECTED' ? '#b91c1c' : '#b45309'
                    }}
                  >
                    {l.status}
                  </span>
                </td>
                <td style={{ padding: '0.75rem', color: l.manager_remark ? '#1f2937' : '#9ca3af' }}>
                  {l.manager_remark || '--'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ApplyLeavePage;