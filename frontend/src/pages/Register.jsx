import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/api';

function Register() {
  const [form, setForm]   = useState({ name: '', email: '', password: '', role: 'JOBSEEKER' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await register(form);
      localStorage.setItem('token',  res.data.token);
      localStorage.setItem('role',   res.data.role);
      localStorage.setItem('name',   res.data.name);
      localStorage.setItem('userId', res.data.userId);
      localStorage.setItem('email',  form.email);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally { setLoading(false); }
  };

  return (
    <div className="form-card">
      <div style={{ textAlign: 'center', marginBottom: 8 }}>
        <span style={{ fontSize: '2.5rem' }}>🚀</span>
      </div>
      <h2>Create account</h2>
      <p className="form-subtitle">Join thousands of professionals</p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Full Name</label>
          <input placeholder="John Doe" value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        </div>
        <div className="form-group">
          <label>Email address</label>
          <input type="email" placeholder="you@example.com" value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" placeholder="Min. 6 characters" value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        </div>
        <div className="form-group">
          <label>I am a</label>
          <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            <option value="JOBSEEKER">👤 Job Seeker — looking for work</option>
            <option value="EMPLOYER">🏢 Employer — hiring talent</option>
          </select>
        </div>
        {error && <p className="error">⚠ {error}</p>}
        <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
          {loading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>

      <div className="divider" />
      <p className="text-center">
        Already have an account? <Link to="/login" className="link">Sign in</Link>
      </p>
    </div>
  );
}

export default Register;
