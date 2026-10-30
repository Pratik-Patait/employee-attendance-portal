import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, User, AlertCircle } from 'lucide-react';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Check if redirected due to 15-minute inactivity timeout
  const searchParams = new URLSearchParams(location.search);
  const sessionExpired = searchParams.get('expired') === 'true';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const loggedUser = await login(username, password);

      // Requirement: Identify role post-auth and redirect to appropriate landing page
      if (loggedUser.role === 'HR') {
        navigate('/hr/users', { replace: true });
      } else {
        navigate('/attendance', { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid username or password.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>Employee Attendance Portal</h2>
          <p>Sign in to your account</p>
        </div>

        {sessionExpired && (
          <div className="alert alert-warning">
            <AlertCircle size={18} />
            <span>Your session expired due to 15 minutes of inactivity. Please log in again.</span>
          </div>
        )}

        {error && (
          <div className="alert alert-danger">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <div className="input-with-icon">
              <User size={18} className="input-icon" />
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. emp_one, hr_admin"
                required
                autoFocus
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
          </div>

          <button type="submit" disabled={submitting} className="btn-primary login-btn">
            {submitting ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="login-hints">
          <p><strong>Demo Seed Accounts:</strong></p>
          <ul>
            <li><strong>HR Admin:</strong> <code>hr_admin</code> / <code>Password@123</code></li>
            <li><strong>Manager:</strong> <code>manager_two</code> / <code>Password@123</code></li>
            <li><strong>Employee:</strong> <code>emp_one</code> / <code>Password@123</code></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;