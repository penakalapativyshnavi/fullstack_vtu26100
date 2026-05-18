import React from 'react';
import { Link } from 'react-router-dom';

const typeClass = {
  FULL_TIME: 'badge-fulltime',
  PART_TIME: 'badge-parttime',
  CONTRACT:  'badge-contract',
  REMOTE:    'badge-remote',
};

function JobCard({ job }) {
  const initial = job.company?.charAt(0).toUpperCase() || '?';

  return (
    <div className="job-card">
      <div className="job-card-header">
        <div>
          <div className="company">{job.company}</div>
          <h3>{job.title}</h3>
        </div>
        <div className="company-logo">{initial}</div>
      </div>

      <div className="meta">📍 {job.location}</div>

      {job.salaryMin && (
        <div className="salary">
          💰 ${job.salaryMin.toLocaleString()} – ${job.salaryMax?.toLocaleString()}
        </div>
      )}

      <div className="skills-row">
        <span className={`badge ${typeClass[job.type] || ''}`}>
          {job.type?.replace('_', ' ')}
        </span>
        {job.skills?.split(',').slice(0, 3).map((s) => (
          <span key={s} className="badge">{s.trim()}</span>
        ))}
      </div>

      <div className="card-footer">
        <span style={{ fontSize: '0.78rem', color: 'var(--text-light)' }}>
          {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'Recently posted'}
        </span>
        <Link to={`/jobs/${job.id}`} className="btn btn-primary btn-sm">
          Apply Now →
        </Link>
      </div>
    </div>
  );
}

export default JobCard;
