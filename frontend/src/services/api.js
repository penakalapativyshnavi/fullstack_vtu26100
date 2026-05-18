import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:8080/api' });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const register = (data) => API.post('/auth/register', data);
export const login    = (data) => API.post('/auth/login', data);

// User / Profile
export const getMyProfile      = ()     => API.get('/users/me');
export const updateMyProfile   = (data) => API.put('/users/me', data);
export const getRecruiterStats = ()     => API.get('/users/recruiter/stats');

// Jobs
export const getAllJobs       = ()           => API.get('/jobs');
export const searchJobs       = (keyword)    => API.get(`/jobs/search?keyword=${keyword}`);
export const getJobById       = (id)         => API.get(`/jobs/${id}`);
export const getMyJobs        = ()           => API.get('/jobs/my');
export const createJob        = (data)       => API.post('/jobs', data);
export const updateJobStatus  = (id, status) => API.patch(`/jobs/${id}/status?status=${status}`);
export const deleteJob        = (id)         => API.delete(`/jobs/${id}`);

// Applications
export const applyToJob         = (jobId, data) => API.post(`/applications/apply/${jobId}`, data);
export const getMyApplications  = ()            => API.get('/applications/my');
export const getJobApplications = (jobId)       => API.get(`/applications/job/${jobId}`);
export const updateAppStatus    = (id, status)  => API.patch(`/applications/${id}/status?status=${status}`);

// Admin
export const adminGetStats        = ()           => API.get('/admin/stats');
export const adminGetUsers        = ()           => API.get('/admin/users');
export const adminDeleteUser      = (id)         => API.delete(`/admin/users/${id}`);
export const adminGetJobs         = ()           => API.get('/admin/jobs');
export const adminDeleteJob       = (id)         => API.delete(`/admin/jobs/${id}`);
export const adminUpdateJobStatus = (id, status) => API.patch(`/admin/jobs/${id}/status?status=${status}`);
export const adminGetApplications = ()           => API.get('/admin/applications');
export const adminUpdateAppStatus = (id, status) => API.patch(`/admin/applications/${id}/status?status=${status}`);
