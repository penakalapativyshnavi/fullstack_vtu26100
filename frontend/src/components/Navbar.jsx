import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

function Navbar() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const token     = localStorage.getItem('token');
  const name      = localStorage.getItem('name');
  const role      = localStorage.getItem('role');

  const logout = () => { localStorage.clear(); navigate('/login'); };
  const active = (path) => location.pathname === path ? { color: 'var(--primary)', background: 'var(--primary-light)' } : {};

  return (
    <div className="navbar">
      <Link to="/" className="logo">⚡ JobPortal</Link>
      <nav>
        <Link to="/jobs" style={active('/jobs')}>Browse Jobs</Link>
        {token ? (
          <>
            <Link to="/dashboard" style={active('/dashboard')}>Dashboard</Link>
            {role === 'EMPLOYER' && <Link to="/post-job" style={active('/post-job')}>Post Job</Link>}
            {role === 'ADMIN'    && <Link to="/admin"    style={active('/admin')}>Admin</Link>}
            <Link to="/profile"  style={active('/profile')}>Profile</Link>
            <span className="nav-user">Hi, {name}</span>
            <button className="btn-logout" onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login"    style={active('/login')}>Login</Link>
            <Link to="/register" className="btn btn-primary btn-sm" style={{ marginLeft: 8, textDecoration: 'none' }}>
              Get Started
            </Link>
          </>
        )}
      </nav>
    </div>
  );
}

export default Navbar;
