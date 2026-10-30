import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const LeaveApprovalPage = () => {
  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [remarks, setRemarks] = useState({});
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(true);

  const fetchPending = async () => {
    try {
      const res = await api.get('/leaves/pending');
      setPendingLeaves(res.data.pendingLeaves);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleAction = async (id, status) => {
    const remark = remarks[id];
    if (!remark || !remark.trim()) {
      setMessage({ type: 'danger', text: 'Remark is mandatory when approving or rejecting a leave request.' });
      return;
    }

    setMessage({ type: '', text: '' });
    try {
      await api.patch(`/leaves/${id}/action`, { status, remark });
      setMessage({ type: 'success', text: `Leave request ${status.toLowerCase()} successfully.` });
      fetchPending();
    } catch (err) {
      setMessage({ type: 'danger', text: err.response?.data?.message || 'Action failed' });
    }
  };

  if (loading) return <div>Loading pending leave approvals...</div>;

  return (
    <div>
      <h2 style={{ color: '#1e3a8a', marginBottom: '0.5rem' }}>Team Leave Approvals</h2>
      <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
        Review pending leave applications from your reportees. Remarks are mandatory for all actions.
      </p>

      {message.text && (
        <div className={`alert alert-${message.type}`}>
          <AlertCircle size={18} />
          <span>{message.text}</span>
        </div>
      )}

      {pendingLeaves.length === 0 ? (
        <p style={{ color: '#6b7280' }}>No pending leave requests to act upon.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {pendingLeaves.map((l) => (
            <div key={l.id} style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <div>
                  <h4 style={{ fontSize: '1.05rem', color: '#1e293b' }}>{l.Employee?.full_name}</h4>
                  <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Username: {l.Employee?.username}</span>
                </div>
                <span style={{ fontWeight: 600, color: '#1e3a8a' }}>{l.LeaveType?.name}</span>
              </div>

              <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                <strong>Dates:</strong> {l.start_date} to {l.end_date}
              </p>
              <p style={{ fontSize: '0.9rem', marginBottom: '1rem', color: '#334155' }}>
                <strong>Reason:</strong> {l.reason}
              </p>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <input
                  type="text"
                  placeholder="Enter mandatory remark..."
                  value={remarks[l.id] || ''}
                  onChange={(e) => setRemarks({ ...remarks, [l.id]: e.target.value })}
                  style={{ flex: 1, padding: '0.55rem 0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
                <button
                  onClick={() => handleAction(l.id, 'APPROVED')}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: '#16a34a', color: '#fff', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
                >
                  <CheckCircle size={16} /> Approve
                </button>
                <button
                  onClick={() => handleAction(l.id, 'REJECTED')}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: '#dc2626', color: '#fff', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
                >
                  <XCircle size={16} /> Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LeaveApprovalPage;