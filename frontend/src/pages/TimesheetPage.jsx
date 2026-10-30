import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const TimesheetPage = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState(user.role === 'HR' ? 'org' : 'my');
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTimesheet = async () => {
    setLoading(true);
    try {
      let endpoint = '/attendance/my-timesheet';
      if (tab === 'team') endpoint = '/attendance/team';
      if (tab === 'org') endpoint = '/attendance/organization';

      const res = await api.get(endpoint);
      setRecords(res.data.records);
    } catch (err) {
      console.error('Error fetching timesheet:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimesheet();
  }, [tab]);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ color: '#1e3a8a' }}>Attendance Timesheet</h2>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {user.role !== 'HR' && (
            <button
              onClick={() => setTab('my')}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                border: '1px solid #d1d5db',
                background: tab === 'my' ? '#1e3a8a' : '#fff',
                color: tab === 'my' ? '#fff' : '#374151',
                cursor: 'pointer'
              }}
            >
              My Timesheet
            </button>
          )}

          {user.role === 'MANAGER' && (
            <button
              onClick={() => setTab('team')}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                border: '1px solid #d1d5db',
                background: tab === 'team' ? '#1e3a8a' : '#fff',
                color: tab === 'team' ? '#fff' : '#374151',
                cursor: 'pointer'
              }}
            >
              Team Attendance
            </button>
          )}

          {user.role === 'HR' && (
            <button
              onClick={() => setTab('org')}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                border: '1px solid #d1d5db',
                background: tab === 'org' ? '#1e3a8a' : '#fff',
                color: tab === 'org' ? '#fff' : '#374151',
                cursor: 'pointer'
              }}
            >
              Organization Attendance
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <p>Loading timesheet data...</p>
      ) : records.length === 0 ? (
        <p style={{ color: '#6b7280' }}>No attendance records found.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: '#475569' }}>
                {(tab === 'team' || tab === 'org') && <th style={{ padding: '0.75rem' }}>Employee</th>}
                <th style={{ padding: '0.75rem' }}>Date</th>
                <th style={{ padding: '0.75rem' }}>Check In</th>
                <th style={{ padding: '0.75rem' }}>Check Out</th>
                <th style={{ padding: '0.75rem' }}>Total Hours</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr key={r.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  {(tab === 'team' || tab === 'org') && (
                    <td style={{ padding: '0.75rem', fontWeight: 600 }}>{r.User?.full_name} ({r.User?.username})</td>
                  )}
                  <td style={{ padding: '0.75rem' }}>{r.date}</td>
                  <td style={{ padding: '0.75rem' }}>{new Date(r.check_in_time).toLocaleTimeString()}</td>
                  <td style={{ padding: '0.75rem' }}>{r.check_out_time ? new Date(r.check_out_time).toLocaleTimeString() : 'In Progress'}</td>
                  <td style={{ padding: '0.75rem' }}>{r.total_hours ? `${r.total_hours} hrs` : '--'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TimesheetPage;