import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/api';

function Login() {
  const [form, setForm]   = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await login(form);
      localStorage.setItem('token',  res.data.token);
      localStorage.setItem('role',   res.data.role);
      localStorage.setItem('name',   res.data.name);
      localStorage.setItem('userId', res.data.userId);
      localStorage.setItem('email',  form.email);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally { setLoading(false); }
  };

  return (
    <div className="form-card">
      <div style={{ textAlign: 'center', marginBottom: 8 }}>
        <span style={{ fontSize: '2.5rem' }}>👋</span>
      </div>
      <h2>Welcome back</h2>
      <p className="form-subtitle">Sign in to your account</p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email address</label>
          <input type="email" placeholder="you@example.com" value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" placeholder="••••••••" value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        </div>
        {error && <p className="error">⚠ {error}</p>}
        <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <div className="divider" />
      <p className="text-center">
        Don't have an account? <Link to="/register" className="link">Create one</Link>
      </p>

      <div className="info-box" style={{ marginTop: 20 }}>
        <strong>Demo accounts:</strong><br />
        admin@jobportal.com / admin123<br />
        recruiter@google.com / password123
      </div>
    </div>
  );
}

export default Login;
