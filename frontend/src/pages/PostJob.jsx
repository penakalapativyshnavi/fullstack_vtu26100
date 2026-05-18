import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createJob } from '../services/api';
import Toast from '../components/Toast';

function PostJob() {
  const [form, setForm] = useState({
    title: '', description: '', company: '', location: '',
    type: 'FULL_TIME', salaryMin: '', salaryMax: '', skills: ''
  });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast]   = useState(null);
  const navigate = useNavigate();

  const f = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await createJob({
        ...form,
        salaryMin: form.salaryMin ? Number(form.salaryMin) : null,
        salaryMax: form.salaryMax ? Number(form.salaryMax) : null,
      });
      setToast({ message: 'Job posted successfully!', type: 'success' });
      setTimeout(() => navigate('/dashboard'), 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post job');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      {toast && <div className="toast-container"><Toast {...toast} onClose={() => setToast(null)} /></div>}

      <div className="page-header">
        <h2 className="section-title">📝 Post a New Job</h2>
      </div>

      <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-xl)', padding: '36px', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Job Title *</label>
              <input value={form.title} onChange={f('title')} placeholder="e.g. Senior React Developer" required />
            </div>
            <div className="form-group">
              <label>Company *</label>
              <input value={form.company} onChange={f('company')} placeholder="Company name" required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Location *</label>
              <input value={form.location} onChange={f('location')} placeholder="City or Remote" required />
            </div>
            <div className="form-group">
              <label>Job Type</label>
              <select value={form.type} onChange={f('type')}>
                <option value="FULL_TIME">Full Time</option>
                <option value="PART_TIME">Part Time</option>
                <option value="CONTRACT">Contract</option>
                <option value="REMOTE">Remote</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Job Description *</label>
            <textarea value={form.description} onChange={f('description')}
              placeholder="Describe the role, responsibilities, and requirements..." required />
          </div>

          <div className="form-group">
            <label>Required Skills</label>
            <input value={form.skills} onChange={f('skills')} placeholder="React, Java, SQL, AWS (comma-separated)" />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Min Salary ($)</label>
              <input type="number" value={form.salaryMin} onChange={f('salaryMin')} placeholder="e.g. 80000" />
            </div>
            <div className="form-group">
              <label>Max Salary ($)</label>
              <input type="number" value={form.salaryMax} onChange={f('salaryMax')} placeholder="e.g. 120000" />
            </div>
          </div>

          {error && <p className="error">⚠ {error}</p>}

          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={loading}>
              {loading ? 'Posting...' : '🚀 Post Job'}
            </button>
            <button type="button" className="btn btn-outline" onClick={() => navigate('/dashboard')}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PostJob;
