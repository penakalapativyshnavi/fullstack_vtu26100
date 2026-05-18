import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getJobById, applyToJob } from '../services/api';
import Spinner from '../components/Spinner';
import Toast from '../components/Toast';

const typeClass = { FULL_TIME: 'badge-fulltime', PART_TIME: 'badge-parttime', CONTRACT: 'badge-contract', REMOTE: 'badge-remote' };

function JobDetail() {
  const { id }  = useParams();
  const [job, setJob]           = useState(null);
  const [coverLetter, setCover] = useState('');
  const [resumeUrl, setResume]  = useState('');
  const [applied, setApplied]   = useState(false);
  const [loading, setLoading]   = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast]       = useState(null);
  const role  = localStorage.getItem('role');
  const token = localStorage.getItem('token');

  useEffect(() => {
    getJobById(id).then((r) => setJob(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  const handleApply = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await applyToJob(id, { coverLetter, resumeUrl });
      setApplied(true);
      setToast({ message: 'Application submitted!', type: 'success' });
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to apply', type: 'error' });
    } finally { setSubmitting(false); }
  };

  if (loading) return <Spinner />;
  if (!job)    return <div className="empty-state"><p>Job not found.</p></div>;

  return (
    <div style={{ maxWidth: 760, margin: '0 auto' }}>
      {toast && <div className="toast-container"><Toast {...toast} onClose={() => setToast(null)} /></div>}

      {/* Job Header Card */}
      <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-xl)', padding: '32px', border: '1px solid var(--border)', boxShadow: 'var(--shadow)', marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 20 }}>
          <div className="company-logo" style={{ width: 56, height: 56, fontSize: '1.4rem' }}>
            {job.company?.charAt(0)}
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 4 }}>{job.title}</h1>
            <div style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '1rem' }}>{job.company}</div>
          </div>
          <span className={`status-badge status-${job.status}`}>{job.status}</span>
        </div>

        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginBottom: 16 }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>📍 {job.location}</span>
          <span className={`badge ${typeClass[job.type] || ''}`}>{job.type?.replace('_', ' ')}</span>
          {job.salaryMin && (
            <span style={{ color: 'var(--success)', fontWeight: 600, fontSize: '0.9rem' }}>
              💰 ${job.salaryMin.toLocaleString()} – ${job.salaryMax?.toLocaleString()}
            </span>
          )}
        </div>

        {job.skills && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
            {job.skills.split(',').map((s) => <span key={s} className="badge">{s.trim()}</span>)}
          </div>
        )}

        <div className="divider" />
        <h3 style={{ marginBottom: 12, fontWeight: 700 }}>About this role</h3>
        <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: '0.95rem' }}>{job.description}</p>
      </div>

      {/* Apply Section */}
      {!token && (
        <div className="info-box">
          <Link to="/login" className="link">Sign in</Link> to apply for this job.
        </div>
      )}

      {token && role === 'JOBSEEKER' && (
        applied ? (
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 'var(--radius-lg)', padding: 24, textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>🎉</div>
            <h3 style={{ color: 'var(--success)', marginBottom: 4 }}>Application Submitted!</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Track your status in the <Link to="/dashboard" className="link">Dashboard</Link>.</p>
          </div>
        ) : (
          <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-xl)', padding: '32px', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}>
            <h3 style={{ marginBottom: 20, fontWeight: 700 }}>Apply for this position</h3>
            <form onSubmit={handleApply}>
              <div className="form-group">
                <label>Cover Letter *</label>
                <textarea value={coverLetter} onChange={(e) => setCover(e.target.value)}
                  placeholder="Tell the employer why you're a great fit for this role..."
                  style={{ minHeight: 140 }} required />
              </div>
              <div className="form-group">
                <label>Resume URL</label>
                <input value={resumeUrl} onChange={(e) => setResume(e.target.value)}
                  placeholder="https://drive.google.com/your-resume" />
              </div>
              <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
                {submitting ? 'Submitting...' : '🚀 Submit Application'}
              </button>
            </form>
          </div>
        )
      )}
    </div>
  );
}

export default JobDetail;
