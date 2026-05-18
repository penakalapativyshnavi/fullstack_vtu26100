import React, { useState, useEffect } from 'react';
import {
  adminGetStats, adminGetUsers, adminDeleteUser,
  adminGetJobs, adminDeleteJob, adminUpdateJobStatus,
  adminGetApplications, adminUpdateAppStatus
} from '../services/api';
import Spinner from '../components/Spinner';
import Toast from '../components/Toast';

const APP_STATUSES = ['PENDING', 'REVIEWED', 'SHORTLISTED', 'REJECTED'];
const JOB_STATUSES = ['OPEN', 'CLOSED'];

function StatCard({ label, value, color }) {
  return (
    <div className={`stat-card ${color || ''}`}>
      <div className="stat-num">{value ?? '—'}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

function AdminPanel() {
  const [tab, setTab]         = useState('overview');
  const [stats, setStats]     = useState(null);
  const [users, setUsers]     = useState([]);
  const [jobs, setJobs]       = useState([]);
  const [apps, setApps]       = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast]     = useState(null);
  const [appFilter, setAppFilter] = useState('');
  const [jobFilter, setJobFilter] = useState('');

  const showToast = (message, type = 'success') => setToast({ message, type });

  useEffect(() => { loadTab(tab); }, [tab]);

  const loadTab = async (t) => {
    setLoading(true);
    try {
      if (t === 'overview')     { const r = await adminGetStats();        setStats(r.data); }
      if (t === 'users')        { const r = await adminGetUsers();        setUsers(r.data); }
      if (t === 'jobs')         { const r = await adminGetJobs();         setJobs(r.data); }
      if (t === 'applications') { const r = await adminGetApplications(); setApps(r.data); }
    } catch {
      showToast('Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  };

  // ── Application status update ──
  const handleAppStatus = async (id, status) => {
    try {
      await adminUpdateAppStatus(id, status);
      setApps((prev) => prev.map((a) => a.id === id ? { ...a, status } : a));
      showToast(`Status updated to ${status}`);
    } catch (err) {
      console.error('Update failed:', err.response?.status, err.response?.data);
      showToast(err.response?.data?.message || 'Failed to update status', 'error');
    }
  };

  // ── Job status update ──
  const handleJobStatus = async (id, status) => {
    try {
      await adminUpdateJobStatus(id, status);
      setJobs((prev) => prev.map((j) => j.id === id ? { ...j, status } : j));
      showToast(`Job marked as ${status}`);
    } catch (err) {
      console.error('Update failed:', err.response?.status, err.response?.data);
      showToast(err.response?.data?.message || 'Failed to update job status', 'error');
    }
  };

  // ── Delete user ──
  const deleteUser = async (id) => {
    if (!window.confirm('Delete this user? This cannot be undone.')) return;
    try {
      await adminDeleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      showToast('User deleted');
    } catch {
      showToast('Failed to delete user', 'error');
    }
  };

  // ── Delete job ──
  const deleteJob = async (id) => {
    if (!window.confirm('Delete this job?')) return;
    try {
      await adminDeleteJob(id);
      setJobs((prev) => prev.filter((j) => j.id !== id));
      showToast('Job deleted');
    } catch {
      showToast('Failed to delete job', 'error');
    }
  };

  const roleBadge = (role) => {
    const map = { ADMIN: '#8e24aa', EMPLOYER: '#1a73e8', JOBSEEKER: '#43a047' };
    return (
      <span className="status-badge" style={{ background: (map[role] || '#999') + '22', color: map[role] || '#999' }}>
        {role}
      </span>
    );
  };

  // Filtered lists
  const filteredApps = appFilter ? apps.filter((a) => a.status === appFilter) : apps;
  const filteredJobs = jobFilter ? jobs.filter((j) => j.status === jobFilter) : jobs;

  const tabs = [
    { key: 'overview',     label: '📊  Overview' },
    { key: 'users',        label: '👥  Users' },
    { key: 'jobs',         label: '💼  Jobs' },
    { key: 'applications', label: '📋  Applications' },
  ];

  return (
    <div>
      {toast && <div className="toast-container"><Toast {...toast} onClose={() => setToast(null)} /></div>}

      <div className="admin-layout">
        {/* ── Sidebar ── */}
        <div className="admin-sidebar">
          <div className="sidebar-logo">⚡ Admin Panel</div>
          <h3>Navigation</h3>
          {tabs.map(({ key, label }) => (
            <button key={key} className={tab === key ? 'active' : ''} onClick={() => setTab(key)}>
              {label}
            </button>
          ))}
        </div>

        {/* ── Content ── */}
        <div className="admin-content">
          {loading ? <Spinner /> : (
            <>
              {/* ── Overview ── */}
              {tab === 'overview' && stats && (
                <>
                  <h2>Overview</h2>
                  <div className="stats-grid">
                    <StatCard label="Total Users"        value={stats.totalUsers}        />
                    <StatCard label="Employers"          value={stats.employers}         color="orange" />
                    <StatCard label="Job Seekers"        value={stats.jobseekers}        color="green" />
                    <StatCard label="Total Jobs"         value={stats.totalJobs}         color="purple" />
                    <StatCard label="Open Jobs"          value={stats.openJobs}          color="green" />
                    <StatCard label="Total Applications" value={stats.totalApplications} color="orange" />
                  </div>

                  <h3 style={{ margin: '24px 0 12px' }}>Quick Actions</h3>
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    <button className="btn btn-primary" onClick={() => setTab('applications')}>
                      Manage Applications
                    </button>
                    <button className="btn btn-outline" onClick={() => setTab('jobs')}>
                      Manage Jobs
                    </button>
                    <button className="btn btn-outline" onClick={() => setTab('users')}>
                      Manage Users
                    </button>
                  </div>
                </>
              )}

              {/* ── Users ── */}
              {tab === 'users' && (
                <>
                  <div className="page-header">
                    <h2>All Users</h2>
                    <span style={{ color: '#666', fontSize: '0.9rem' }}>{users.length} total</span>
                  </div>
                  <table className="app-table">
                    <thead>
                      <tr><th>Name</th><th>Email</th><th>Role</th><th>Company</th><th>Joined</th><th>Action</th></tr>
                    </thead>
                    <tbody>
                      {users.length === 0
                        ? <tr><td colSpan={6} className="empty-state">No users found.</td></tr>
                        : users.map((u) => (
                          <tr key={u.id}>
                            <td><strong>{u.name}</strong></td>
                            <td style={{ fontSize: '0.85rem' }}>{u.email}</td>
                            <td>{roleBadge(u.role)}</td>
                            <td>{u.company || '—'}</td>
                            <td>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}</td>
                            <td>
                              {u.role !== 'ADMIN' && (
                                <button className="btn btn-sm btn-danger" onClick={() => deleteUser(u.id)}>
                                  Delete
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </>
              )}

              {/* ── Jobs ── */}
              {tab === 'jobs' && (
                <>
                  <div className="page-header">
                    <h2>All Jobs</h2>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <select value={jobFilter} onChange={(e) => setJobFilter(e.target.value)}
                        style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #ddd', fontSize: '0.85rem' }}>
                        <option value="">All Status</option>
                        <option value="OPEN">Open</option>
                        <option value="CLOSED">Closed</option>
                      </select>
                      <span style={{ color: '#666', fontSize: '0.85rem' }}>{filteredJobs.length} jobs</span>
                    </div>
                  </div>
                  <table className="app-table">
                    <thead>
                      <tr><th>Title</th><th>Company</th><th>Location</th><th>Type</th><th>Status</th><th>Posted</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                      {filteredJobs.length === 0
                        ? <tr><td colSpan={7} className="empty-state">No jobs found.</td></tr>
                        : filteredJobs.map((j) => (
                          <tr key={j.id}>
                            <td><strong>{j.title}</strong></td>
                            <td>{j.company}</td>
                            <td>{j.location}</td>
                            <td><span className="badge">{j.type?.replace('_', ' ')}</span></td>
                            <td>
                              {/* Inline status toggle */}
                              <select
                                value={j.status}
                                onChange={(e) => handleJobStatus(j.id, e.target.value)}
                                style={{
                                  padding: '4px 8px', borderRadius: 6, border: '1px solid #ddd',
                                  fontSize: '0.82rem', fontWeight: 600,
                                  background: j.status === 'OPEN' ? '#e8f5e9' : '#fce4ec',
                                  color: j.status === 'OPEN' ? '#2e7d32' : '#c62828',
                                  cursor: 'pointer'
                                }}>
                                {JOB_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                              </select>
                            </td>
                            <td style={{ fontSize: '0.82rem' }}>
                              {j.createdAt ? new Date(j.createdAt).toLocaleDateString() : '—'}
                            </td>
                            <td>
                              <button className="btn btn-sm btn-danger" onClick={() => deleteJob(j.id)}>
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </>
              )}

              {/* ── Applications ── */}
              {tab === 'applications' && (
                <>
                  <div className="page-header">
                    <h2>All Applications</h2>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <select value={appFilter} onChange={(e) => setAppFilter(e.target.value)}
                        style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #ddd', fontSize: '0.85rem' }}>
                        <option value="">All Status</option>
                        {APP_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <span style={{ color: '#666', fontSize: '0.85rem' }}>{filteredApps.length} applications</span>
                    </div>
                  </div>

                  {/* Summary chips */}
                  <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
                    {APP_STATUSES.map((s) => {
                      const count = apps.filter((a) => a.status === s).length;
                      return (
                        <button key={s}
                          onClick={() => setAppFilter(appFilter === s ? '' : s)}
                          className={`status-badge status-${s}`}
                          style={{ cursor: 'pointer', border: appFilter === s ? '2px solid currentColor' : '2px solid transparent', padding: '5px 14px' }}>
                          {s}: {count}
                        </button>
                      );
                    })}
                  </div>

                  <table className="app-table">
                    <thead>
                      <tr>
                        <th>Applicant</th>
                        <th>Job</th>
                        <th>Company</th>
                        <th>Applied</th>
                        <th>Resume</th>
                        <th>Status</th>
                        <th>Update Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredApps.length === 0
                        ? <tr><td colSpan={7} className="empty-state">No applications found.</td></tr>
                        : filteredApps.map((a) => (
                          <tr key={a.id}>
                            <td>
                              <strong>{a.applicant?.name}</strong>
                              <br />
                              <small style={{ color: '#888' }}>{a.applicant?.email}</small>
                            </td>
                            <td>{a.job?.title}</td>
                            <td>{a.job?.company}</td>
                            <td style={{ fontSize: '0.82rem' }}>
                              {a.appliedAt ? new Date(a.appliedAt).toLocaleDateString() : '—'}
                            </td>
                            <td>
                              {a.resumeUrl
                                ? <a href={a.resumeUrl} target="_blank" rel="noreferrer" className="link">View</a>
                                : '—'}
                            </td>
                            <td>
                              <span className={`status-badge status-${a.status}`}>{a.status}</span>
                            </td>
                            <td>
                              <select
                                value={a.status}
                                onChange={(e) => handleAppStatus(a.id, e.target.value)}
                                style={{ padding: '5px 8px', borderRadius: 6, border: '1px solid #ddd', fontSize: '0.82rem', cursor: 'pointer' }}>
                                {APP_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                              </select>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;
