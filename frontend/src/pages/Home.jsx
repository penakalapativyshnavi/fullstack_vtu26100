import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getAllJobs } from '../services/api';
import JobCard from '../components/JobCard';
import Spinner from '../components/Spinner';

function Home() {
  const [jobs, setJobs]       = useState([]);
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getAllJobs().then((r) => setJobs(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(keyword.trim() ? `/jobs?search=${keyword}` : '/jobs');
  };

  const openJobs   = jobs.filter((j) => j.status === 'OPEN').length;
  const companies  = [...new Set(jobs.map((j) => j.company))].length;

  return (
    <>
      <div className="hero">
        <h1>Find Your Dream Job Today</h1>
        <p>Connect with top companies. Apply in seconds. Land your next role.</p>
        <form className="search-bar" onSubmit={handleSearch}>
          <input
            placeholder="Job title, company, or location..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <button type="submit">🔍 Search</button>
        </form>
        <div className="hero-stats">
          <div className="stat"><strong>{openJobs}</strong><span>Open Jobs</span></div>
          <div className="stat"><strong>{companies}</strong><span>Companies</span></div>
          <div className="stat"><strong>4</strong><span>Job Types</span></div>
        </div>
      </div>

      <div className="page-header">
        <h2 className="section-title">Latest Opportunities</h2>
        <Link to="/jobs" className="btn btn-outline btn-sm">View all jobs →</Link>
      </div>

      {loading ? <Spinner /> : (
        jobs.length === 0
          ? (
            <div className="empty-state">
              <p>No jobs yet. Make sure the backend is running on port 8080.</p>
            </div>
          )
          : <div className="job-grid">{jobs.slice(0, 6).map((j) => <JobCard key={j.id} job={j} />)}</div>
      )}
    </>
  );
}

export default Home;
