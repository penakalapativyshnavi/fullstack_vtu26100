import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getAllJobs, searchJobs } from '../services/api';
import JobCard from '../components/JobCard';
import Spinner from '../components/Spinner';

function Jobs() {
  const [jobs, setJobs]           = useState([]);
  const [filtered, setFiltered]   = useState([]);
  const [keyword, setKeyword]     = useState('');
  const [typeFilter, setType]     = useState('');  // empty = show all
  const [loading, setLoading]     = useState(true);
  const [searchParams]            = useSearchParams();

  useEffect(() => {
    const q = searchParams.get('search');
    setLoading(true);
    const req = q ? searchJobs(q) : getAllJobs();
    req.then((res) => {
      setJobs(res.data);
      setFiltered(res.data);
      if (q) setKeyword(q);
    }).catch((err) => {
      console.error('Failed to load jobs:', err);
    }).finally(() => setLoading(false));
  }, [searchParams]);

  useEffect(() => {
    let result = jobs;
    if (keyword.trim()) {
      const kw = keyword.toLowerCase();
      result = result.filter((j) =>
        j.title.toLowerCase().includes(kw) ||
        j.company.toLowerCase().includes(kw) ||
        j.location.toLowerCase().includes(kw)
      );
    }
    if (typeFilter) result = result.filter((j) => j.type === typeFilter);
    setFiltered(result);
  }, [keyword, typeFilter, jobs]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!keyword.trim()) {
      getAllJobs().then((r) => { setJobs(r.data); setFiltered(r.data); });
    } else {
      searchJobs(keyword).then((r) => { setJobs(r.data); setFiltered(r.data); });
    }
  };

  return (
    <>
      <div className="page-header">
        <h2 className="section-title">Browse Jobs</h2>
        <span style={{ color: '#666', fontSize: '0.9rem' }}>{filtered.length} jobs found</span>
      </div>

      <form onSubmit={handleSearch} className="filters-bar">
        <input
          placeholder="Search by title, company, location..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <select value={typeFilter} onChange={(e) => setType(e.target.value)}>
          <option value="">All Types</option>
          <option value="FULL_TIME">Full Time</option>
          <option value="PART_TIME">Part Time</option>
          <option value="CONTRACT">Contract</option>
          <option value="REMOTE">Remote</option>
        </select>
        <button type="submit" className="btn btn-primary" style={{ width: 'auto' }}>Search</button>
        {(keyword || typeFilter) && (
          <button type="button" className="btn btn-outline" style={{ width: 'auto' }}
            onClick={() => { setKeyword(''); setType(''); }}>
            Clear
          </button>
        )}
      </form>

      {loading ? <Spinner /> : (
        jobs.length === 0
          ? (
            <div className="empty-state">
              <p>No jobs available.</p>
              <p style={{ fontSize: '0.85rem', marginTop: 8, color: '#aaa' }}>
                Make sure the backend is running on port 8080 and data is seeded.
              </p>
            </div>
          )
          : filtered.length === 0
            ? <div className="empty-state"><p>No jobs match your filter. <button className="btn-ghost" onClick={() => { setKeyword(''); setType(''); }}>Clear filters</button></p></div>
            : <div className="job-grid">{filtered.map((job) => <JobCard key={job.id} job={job} />)}</div>
      )}
    </>
  );
}

export default Jobs;
