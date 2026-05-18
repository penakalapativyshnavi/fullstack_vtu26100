import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  getMyApplications, getMyJobs, getJobApplications,
  updateAppStatus, updateJobStatus, deleteJob, getRecruiterStats
} from '../services/api';
import Spinner from '../components/Spinner';
import Toast from '../components/Toast';

const STATUSES = ['PENDING', 'REVIEWED', 'SHORTLISTED', 'REJECTED'];

/* ── Kanban Board ── */
function KanbanBoard({ applications }) {
  return (
    <div className="kanban-board">
      {STATUSES.map((status) => {
        const items = applications.filter((a) => a.status === status);
        return (
          <div key={status} className={`kanban-col col-${status.toLowerCase()}`}>
            <div className="kanban-col-header">
              {status} <span className="kanban-count">{items.length}</span>
            </div>
            {items.length === 0 && (
              <p style={{ fontSize: '0.78rem', color: 'var(--text-light)', textAlign: 'center', marginTop: 20 }}>
                No applications
              </p>
            )}
            {items.map((app) => (
              <div key={app.id} className="kanban-card">
                <h4><Link to={`/jobs/${app.job.id}`} className="link">{app.job.title}</Link></h4>
                <div className="kc-company">{app.job.company}</div>
                <div style={{ display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
                  <span className="badge" style={{ fontSize: '0.7rem' }}>{app.job.type?.replace('_', ' ')}</span>
                  <span className="badge" style={{ fontSize: '0.7rem' }}>📍 {app.job.location}</span>
                </div>
                <div className="kc-date">Applied: {new Date(app.appliedAt).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

/* ── Recruiter Stats Bar ── */
function RecruiterStats({ stats }) {
  if (!stats) return null;
  const cards = [
    { label: 'Total Jobs',    value: stats.totalJobs,   color: '' },
    { label: 'Open Jobs',     value: stats.openJobs,    color: 'green' },
    { label: 'Closed Jobs',   value: stats.closedJobs,  color: 'red' },
    { label: 'Applications',  value: stats.totalApps,   color: 'orange' },
    { label: 'Shortlisted',   value: stats.shortlisted, color: 'green' },
    { label: 'Pending',       value: stats.pending,     color: 'orange' },
  ];
  return (
    <div className="stats-grid" style={{ marginBottom: 28 }}>
      {cards.map(({ label, value, color }) => (
        <div key={label} className={`stat-card ${color}`}>
          <div className="stat-num">{value ?? 0}</div>
          <div className="stat-label">{label}</div>
        </div>
      ))}
    </div>
  );
}

/* ── Main Dashboard ── */
function Dashboard() {
  const role = localStorage.getItem('role');
  const name = localStorage.getItem('name');

  const [tab, setTab]                   = useState(role === 'EMPLOYER' ? 'analytics' : 'board');
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs]                 = useState([]);
  const [selectedJobApps, setSelectedJobApps] = useState([]);
  const [selectedJobTitle, setSelectedJobTitle] = useState('');
  const [recruiterStats, setRecruiterStats]     = useState(null);
  const [loading, setLoading]           = useState(true);
  const [toast, setToast]               = useState(null);

  const showToast = (msg, type = 'success') => setToast({ message: msg, type });

  useEffect(() => {
    setLoading(true);
    if (role === 'JOBSEEKER') {
      getMyApplications()
        .then((r) => setApplications(r.data))
        .catch(() => showToast('Failed to load applications', 'error'))
        .finally(() => setLoading(false));
    } else {
      Promise.all([getMyJobs(), getRecruiterStats()])
        .then(([jobsRes, statsRes]) => {
          setJobs(jobsRes.data);
          setRecruiterStats(statsRes.data);
        })
        .catch(() => showToast('Failed to load data', 'error'))
        .finally(() => setLoading(false));
    }
  }, [role]);

  const viewApplicants = async (job) => {
    try {
      const res = await getJobApplications(job.id);
      setSelectedJobApps(res.data);
      setSelectedJobTitle(job.title);
      setTab('applicants');
    } catch { showToast('Failed to load applicants', 'error'); }
  };

  const handleAppStatus = async (id, status) => {
    try {
      await updateAppStatus(id, status);
      setSelectedJobApps((prev) => prev.map((a) => a.id === id ? { ...a, status } : a));
      showToast('Status updated');
    } catch { showToast('Failed to update status', 'error'); }
  };

  const handleJobStatus = async (id, status) => {
    try {
      await updateJobStatus(id, status);
      setJobs((prev) => prev.map((j) => j.id === id ? { ...j, status } : j));
      showToast(`Job ${status === 'OPEN' ? 'reopened' : 'closed'}`);
    } catch { showToast('Failed to update job', 'error'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this job?')) return;
    try {
      await deleteJob(id);
      setJobs((prev) => prev.filter((j) => j.id !== id));
      showToast('Job deleted');
    } catch { showToast('Failed to delete job', 'error'); }
  };

  if (loading) return <Spinner />;

  return (
    <>
      {toast && <div className="toast-container"><Toast {...toast} onClose={() => setToast(null)} /></div>}

      {/* Header */}
      <div className="page-header">
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Welcome back, {name} 👋</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: 2 }}>
            {role === 'JOBSEEKER'
              ? `You have ${applications.length} application${applications.length !== 1 ? 's' : ''}`
              : `You have ${jobs.length} job${jobs.length !== 1 ? 's' : ''} posted`}
          </p>
        </div>
        {role === 'EMPLOYER' && (
          <Link to="/post-job" className="btn btn-primary" style={{ textDecoration: 'none' }}>
            + Post New Job
          </Link>
        )}
      </div>

      {/* Tabs */}
      <div className="dashboard-tabs">
        {role === 'JOBSEEKER' && (
          <>
            <button className={`tab-btn ${tab === 'board' ? 'active' : ''}`} onClick={() => setTab('board')}>
              📋 Tracking Board
            </button>
            <button className={`tab-btn ${tab === 'list' ? 'active' : ''}`} onClick={() => setTab('list')}>
              📄 List View
            </button>
          </>
        )}
        {role === 'EMPLOYER' && (
          <>
            <button className={`tab-btn ${tab === 'analytics' ? 'active' : ''}`} onClick={() => setTab('analytics')}>
              📊 Analytics
            </button>
            <button className={`tab-btn ${tab === 'jobs' ? 'active' : ''}`} onClick={() => setTab('jobs')}>
              💼 My Jobs ({jobs.length})
            </button>
            {tab === 'applicants' && (
              <button className="tab-btn active">👥 Applicants</button>
            )}
          </>
        )}
      </div>

      {/* ── JOBSEEKER: Kanban Board ── */}
      {tab === 'board' && (
        applications.length === 0 ? (
          <div className="empty-state">
            <div style={{ fontSize: '3rem', marginBottom: 12 }}>🔍</div>
            <p style={{ fontWeight: 600, marginBottom: 8 }}>No applications yet</p>
            <p style={{ fontSize: '0.85rem', marginBottom: 20 }}>Start applying to jobs to track them here</p>
            <Link to="/jobs" className="btn btn-primary" style={{ textDecoration: 'none' }}>Browse Jobs</Link>
          </div>
        ) : <KanbanBoard applications={applications} />
      )}

      {/* ── JOBSEEKER: List View ── */}
      {tab === 'list' && (
        <>
          {/* Summary chips */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
            {STATUSES.map((s) => {
              const count = applications.filter((a) => a.status === s).length;
              return (
                <span key={s} className={`status-badge status-${s}`} style={{ padding: '5px 14px' }}>
                  {s}: {count}
                </span>
              );
            })}
          </div>
          <table className="app-table">
            <thead>
              <tr><th>Job Title</th><th>Company</th><th>Type</th><th>Location</th><th>Applied</th><th>Status</th></tr>
            </thead>
            <tbody>
              {applications.length === 0 ? (
                <tr><td colSpan={6} className="empty-state">No applications yet.</td></tr>
              ) : applications.map((app) => (
                <tr key={app.id}>
                  <td><Link to={`/jobs/${app.job.id}`} className="link" style={{ fontWeight: 600 }}>{app.job.title}</Link></td>
                  <td>{app.job.company}</td>
                  <td><span className="badge">{app.job.type?.replace('_', ' ')}</span></td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>📍 {app.job.location}</td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{new Date(app.appliedAt).toLocaleDateString()}</td>
                  <td><span className={`status-badge status-${app.status}`}>{app.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* ── EMPLOYER: Analytics ── */}
      {tab === 'analytics' && (
        <>
          <RecruiterStats stats={recruiterStats} />

          {/* Application breakdown */}
          {recruiterStats && recruiterStats.totalApps > 0 && (
            <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-xl)', padding: '24px', border: '1px solid var(--border)', boxShadow: 'var(--shadow)', marginBottom: 24 }}>
              <h3 style={{ fontWeight: 700, marginBottom: 16, fontSize: '1rem' }}>Application Breakdown</h3>
              {[
                { label: 'Pending',     value: recruiterStats.pending,     color: '#f59e0b', bg: '#fff7ed' },
                { label: 'Reviewed',    value: recruiterStats.reviewed,    color: '#3b82f6', bg: '#eff6ff' },
                { label: 'Shortlisted', value: recruiterStats.shortlisted, color: '#10b981', bg: '#f0fdf4' },
                { label: 'Rejected',    value: recruiterStats.rejected,    color: '#ef4444', bg: '#fff1f2' },
              ].map(({ label, value, color, bg }) => {
                const pct = recruiterStats.totalApps > 0
                  ? Math.round((value / recruiterStats.totalApps) * 100) : 0;
                return (
                  <div key={label} style={{ marginBottom: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, fontSize: '0.85rem' }}>
                      <span style={{ fontWeight: 600 }}>{label}</span>
                      <span style={{ color: 'var(--text-muted)' }}>{value} ({pct}%)</span>
                    </div>
                    <div style={{ height: 8, background: 'var(--surface2)', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 4, transition: 'width 0.6s ease' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div style={{ textAlign: 'center' }}>
            <button className="btn btn-outline" onClick={() => setTab('jobs')}>View My Jobs →</button>
          </div>
        </>
      )}

      {/* ── EMPLOYER: My Jobs ── */}
      {tab === 'jobs' && (
        <table className="app-table">
          <thead>
            <tr><th>Title</th><th>Location</th><th>Type</th><th>Status</th><th>Posted</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {jobs.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  <div className="empty-state">
                    <p>No jobs posted yet.</p>
                    <Link to="/post-job" className="btn btn-primary btn-sm" style={{ textDecoration: 'none', marginTop: 12, display: 'inline-block' }}>Post Your First Job</Link>
                  </div>
                </td>
              </tr>
            ) : jobs.map((job) => (
              <tr key={job.id}>
                <td><strong>{job.title}</strong></td>
                <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>📍 {job.location}</td>
                <td><span className="badge">{job.type?.replace('_', ' ')}</span></td>
                <td><span className={`status-badge status-${job.status}`}>{job.status}</span></td>
                <td style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                  {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : '—'}
                </td>
                <td>
                  <div className="table-actions">
                    <button className="btn btn-sm btn-success" onClick={() => viewApplicants(job)}>
                      👥 Applicants
                    </button>
                    <button className="btn btn-sm btn-outline"
                      onClick={() => handleJobStatus(job.id, job.status === 'OPEN' ? 'CLOSED' : 'OPEN')}>
                      {job.status === 'OPEN' ? 'Close' : 'Reopen'}
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(job.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* ── EMPLOYER: Applicants ── */}
      {tab === 'applicants' && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <button className="btn btn-outline btn-sm" onClick={() => setTab('jobs')}>← Back</button>
            <h3 style={{ fontWeight: 700 }}>Applicants for: {selectedJobTitle}</h3>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>({selectedJobApps.length} total)</span>
          </div>

          {/* Status summary */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
            {STATUSES.map((s) => (
              <span key={s} className={`status-badge status-${s}`} style={{ padding: '5px 14px' }}>
                {s}: {selectedJobApps.filter((a) => a.status === s).length}
              </span>
            ))}
          </div>

          <table className="app-table">
            <thead>
              <tr><th>Applicant</th><th>Email</th><th>Cover Letter</th><th>Resume</th><th>Applied</th><th>Status</th><th>Update</th></tr>
            </thead>
            <tbody>
              {selectedJobApps.length === 0 ? (
                <tr><td colSpan={7} className="empty-state">No applicants yet.</td></tr>
              ) : selectedJobApps.map((app) => (
                <tr key={app.id}>
                  <td>
                    <strong>{app.applicant.name}</strong>
                    {app.applicant.skills && (
                      <div style={{ marginTop: 4, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        {app.applicant.skills.split(',').slice(0, 2).map((s) => (
                          <span key={s} className="badge" style={{ fontSize: '0.68rem' }}>{s.trim()}</span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{app.applicant.email}</td>
                  <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.82rem' }}>
                    {app.coverLetter || '—'}
                  </td>
                  <td>
                    {app.resumeUrl
                      ? <a href={app.resumeUrl} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline">📄 View</a>
                      : <span style={{ color: 'var(--text-light)', fontSize: '0.82rem' }}>—</span>}
                  </td>
                  <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    {new Date(app.appliedAt).toLocaleDateString()}
                  </td>
                  <td><span className={`status-badge status-${app.status}`}>{app.status}</span></td>
                  <td>
                    <select value={app.status} onChange={(e) => handleAppStatus(app.id, e.target.value)}
                      style={{ padding: '5px 8px', borderRadius: 6, border: '1px solid var(--border)', fontSize: '0.82rem', cursor: 'pointer', fontFamily: 'inherit' }}>
                      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </>
  );
}

export default Dashboard;
