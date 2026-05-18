import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyProfile, updateMyProfile } from '../services/api';
import Spinner from '../components/Spinner';
import Toast from '../components/Toast';

function Profile() {
  const role = localStorage.getItem('role') || '';

  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm]       = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [toast, setToast]     = useState(null);

  const showToast = (message, type = 'success') => setToast({ message, type });

  useEffect(() => {
    getMyProfile()
      .then((r) => { setProfile(r.data); setForm(r.data); })
      .catch(() => showToast('Failed to load profile', 'error'))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await updateMyProfile({
        name:      form.name,
        bio:       form.bio,
        skills:    form.skills,
        location:  form.location,
        company:   form.company,
        resumeUrl: form.resumeUrl,
      });
      setProfile(res.data);
      localStorage.setItem('name', res.data.name);
      setEditing(false);
      showToast('Profile updated successfully!');
    } catch {
      showToast('Failed to save profile', 'error');
    } finally { setSaving(false); }
  };

  const f = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const roleColors = { ADMIN: 'var(--purple)', EMPLOYER: 'var(--primary)', JOBSEEKER: 'var(--success)' };
  const roleIcons  = { ADMIN: '🛡️', EMPLOYER: '🏢', JOBSEEKER: '👤' };

  if (loading) return <Spinner />;

  return (
    <div style={{ maxWidth: 680, margin: '0 auto' }}>
      {toast && <div className="toast-container"><Toast {...toast} onClose={() => setToast(null)} /></div>}

      <div className="page-header">
        <h2 className="section-title">My Profile</h2>
        {!editing
          ? <button className="btn btn-outline btn-sm" onClick={() => setEditing(true)}>✏️ Edit Profile</button>
          : <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : '💾 Save'}
              </button>
              <button className="btn btn-ghost btn-sm" onClick={() => { setEditing(false); setForm(profile); }}>
                Cancel
              </button>
            </div>
        }
      </div>

      {/* Header Card */}
      <div style={{ background: 'linear-gradient(135deg, var(--primary), var(--purple))', borderRadius: 'var(--radius-xl)', padding: '32px', marginBottom: 20, color: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', fontWeight: 800, flexShrink: 0 }}>
            {profile?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 4 }}>{profile?.name}</h2>
            <span style={{ background: 'rgba(255,255,255,0.2)', padding: '3px 12px', borderRadius: 20, fontSize: '0.82rem', fontWeight: 600 }}>
              {roleIcons[role]} {role}
            </span>
            {profile?.location && <div style={{ marginTop: 6, fontSize: '0.88rem', opacity: 0.85 }}>📍 {profile.location}</div>}
          </div>
        </div>
      </div>

      {/* Profile Details */}
      <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-xl)', padding: '28px', border: '1px solid var(--border)', boxShadow: 'var(--shadow)', marginBottom: 20 }}>
        <h3 style={{ fontWeight: 700, marginBottom: 20, fontSize: '1rem' }}>Personal Information</h3>

        {editing ? (
          <div>
            <div className="form-row">
              <div className="form-group">
                <label>Full Name</label>
                <input value={form.name || ''} onChange={f('name')} />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input value={form.location || ''} onChange={f('location')} placeholder="City, Country" />
              </div>
            </div>
            {role === 'EMPLOYER' && (
              <div className="form-group">
                <label>Company</label>
                <input value={form.company || ''} onChange={f('company')} placeholder="Your company name" />
              </div>
            )}
            <div className="form-group">
              <label>Bio</label>
              <textarea value={form.bio || ''} onChange={f('bio')} placeholder="Tell employers about yourself..." style={{ minHeight: 90 }} />
            </div>
            <div className="form-group">
              <label>Skills <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(comma-separated)</span></label>
              <input value={form.skills || ''} onChange={f('skills')} placeholder="React, Java, SQL, AWS..." />
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              ['Email',    profile?.email],
              ['Location', profile?.location],
              role === 'EMPLOYER' ? ['Company', profile?.company] : null,
            ].filter(Boolean).map(([label, val]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '11px 16px', background: 'var(--surface2)', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>{label}</span>
                <span style={{ fontSize: '0.88rem' }}>{val || '—'}</span>
              </div>
            ))}
            {profile?.bio && (
              <div style={{ padding: '14px 16px', background: 'var(--surface2)', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: 6 }}>Bio</div>
                <p style={{ fontSize: '0.9rem', lineHeight: 1.7 }}>{profile.bio}</p>
              </div>
            )}
            {profile?.skills && (
              <div style={{ padding: '14px 16px', background: 'var(--surface2)', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: 8 }}>Skills</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {profile.skills.split(',').map((s) => <span key={s} className="badge">{s.trim()}</span>)}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Resume Section — Jobseekers only */}
      {role === 'JOBSEEKER' && (
        <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-xl)', padding: '28px', border: '1px solid var(--border)', boxShadow: 'var(--shadow)', marginBottom: 20 }}>
          <h3 style={{ fontWeight: 700, marginBottom: 16, fontSize: '1rem' }}>📄 Resume</h3>
          {editing ? (
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Resume URL <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(Google Drive, Dropbox, etc.)</span></label>
              <input value={form.resumeUrl || ''} onChange={f('resumeUrl')} placeholder="https://drive.google.com/file/..." />
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 6 }}>
                Upload your resume to Google Drive, set sharing to "Anyone with link", then paste the link here.
              </p>
            </div>
          ) : (
            profile?.resumeUrl ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px', background: 'var(--surface2)', borderRadius: 'var(--radius)' }}>
                <span style={{ fontSize: '2rem' }}>📋</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Resume uploaded</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Click to view your resume</div>
                </div>
                <a href={profile.resumeUrl} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm">
                  View Resume
                </a>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '24px', background: 'var(--surface2)', borderRadius: 'var(--radius)', border: '2px dashed var(--border)' }}>
                <div style={{ fontSize: '2rem', marginBottom: 8 }}>📤</div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 12 }}>No resume uploaded yet</p>
                <button className="btn btn-outline btn-sm" onClick={() => setEditing(true)}>Add Resume URL</button>
              </div>
            )
          )}
        </div>
      )}

      {/* Quick Links */}
      <div style={{ display: 'flex', gap: 12 }}>
        <Link to="/dashboard" className="btn btn-primary" style={{ flex: 1, textDecoration: 'none' }}>
          📊 Dashboard
        </Link>
        {role === 'EMPLOYER' && (
          <Link to="/post-job" className="btn btn-outline" style={{ flex: 1, textDecoration: 'none' }}>
            + Post a Job
          </Link>
        )}
        {role === 'JOBSEEKER' && (
          <Link to="/jobs" className="btn btn-outline" style={{ flex: 1, textDecoration: 'none' }}>
            🔍 Browse Jobs
          </Link>
        )}
      </div>
    </div>
  );
}

export default Profile;
