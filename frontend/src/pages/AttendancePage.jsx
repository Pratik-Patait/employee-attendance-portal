import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Clock, CheckCircle, AlertCircle } from 'lucide-react';

const AttendancePage = () => {
  const [todayRecord, setTodayRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [actionLoading, setActionLoading] = useState(false);

  const fetchTodayStatus = async () => {
    try {
      const res = await api.get('/attendance/today-status');
      setTodayRecord(res.data.record);
    } catch (err) {
      setMessage({ type: 'danger', text: err.response?.data?.message || 'Error fetching status' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodayStatus();
  }, []);

  const handleCheckIn = async () => {
    setActionLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const res = await api.post('/attendance/check-in');
      setTodayRecord(res.data.attendance);
      setMessage({ type: 'success', text: 'Checked in successfully for today.' });
    } catch (err) {
      setMessage({ type: 'danger', text: err.response?.data?.message || 'Check-in failed' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setActionLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const res = await api.patch('/attendance/check-out');
      setTodayRecord(res.data.attendance);
      setMessage({ type: 'success', text: 'Checked out successfully.' });
    } catch (err) {
      setMessage({ type: 'danger', text: err.response?.data?.message || 'Check-out failed' });
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <div>Loading attendance status...</div>;

  const isCheckedIn = !!todayRecord;
  const isCheckedOut = !!todayRecord?.check_out_time;

  return (
    <div>
      <h2 style={{ marginBottom: '1rem', color: '#1e3a8a' }}>Daily Check-In / Check-Out</h2>
      <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
        Log your daily working hours. Only one check-in per calendar day is permitted.
      </p>

      {message.text && (
        <div className={`alert alert-${message.type}`}>
          {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span>{message.text}</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>STATUS TODAY</span>
          <h3 style={{ marginTop: '0.5rem', color: isCheckedOut ? '#0284c7' : isCheckedIn ? '#16a34a' : '#d97706' }}>
            {isCheckedOut ? 'Completed' : isCheckedIn ? 'Checked In' : 'Not Checked In'}
          </h3>
        </div>

        <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>CHECK-IN TIME</span>
          <h3 style={{ marginTop: '0.5rem', color: '#1e293b' }}>
            {todayRecord?.check_in_time ? new Date(todayRecord.check_in_time).toLocaleTimeString() : '--:--'}
          </h3>
        </div>

        <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>CHECK-OUT TIME</span>
          <h3 style={{ marginTop: '0.5rem', color: '#1e293b' }}>
            {todayRecord?.check_out_time ? new Date(todayRecord.check_out_time).toLocaleTimeString() : '--:--'}
          </h3>
        </div>

        <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>TOTAL HOURS</span>
          <h3 style={{ marginTop: '0.5rem', color: '#1e293b' }}>
            {todayRecord?.total_hours ? `${todayRecord.total_hours} hrs` : '--'}
          </h3>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem' }}>
        <button
          onClick={handleCheckIn}
          disabled={isCheckedIn || actionLoading}
          className="btn-primary"
          style={{ width: 'auto', padding: '0.75rem 1.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Clock size={18} />
          {isCheckedIn ? 'Checked In' : 'Check In Now'}
        </button>

        <button
          onClick={handleCheckOut}
          disabled={!isCheckedIn || isCheckedOut || actionLoading}
          className="btn-primary"
          style={{ width: 'auto', padding: '0.75rem 1.75rem', background: isCheckedOut ? '#94a3b8' : '#0284c7' }}
        >
          {isCheckedOut ? 'Already Checked Out' : 'Check Out'}
        </button>
      </div>
    </div>
  );
};

export default AttendancePage;