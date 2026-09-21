const API_BASE = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL.replace(/\/$/, '')}/api`
  : '/api';

export const api = {
  // Auth & Users
  getUsers: async () => {
    const res = await fetch(`${API_BASE}/auth/users`);
    return res.json();
  },
  login: async (credentials) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    return res.json();
  },
  register: async (userData) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return res.json();
  },

  // AI Analysis
  analyzeProblem: async (problemData) => {
    const res = await fetch(`${API_BASE}/ai/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(problemData)
    });
    return res.json();
  },

  // Problems
  getProblems: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/problems${query ? `?${query}` : ''}`);
    return res.json();
  },
  getProblemById: async (id) => {
    const res = await fetch(`${API_BASE}/problems/${id}`);
    return res.json();
  },
  createProblem: async (formData) => {
    const res = await fetch(`${API_BASE}/problems`, {
      method: 'POST',
      body: formData // FormData handles multipart/form-data
    });
    return res.json();
  },
  verifyProblem: async (id, data) => {
    const res = await fetch(`${API_BASE}/problems/${id}/verify`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  upvoteProblem: async (id, userId) => {
    const res = await fetch(`${API_BASE}/problems/${id}/upvote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
    return res.json();
  },

  // Projects
  getProjects: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/projects${query ? `?${query}` : ''}`);
    return res.json();
  },
  getProjectById: async (id) => {
    const res = await fetch(`${API_BASE}/projects/${id}`);
    return res.json();
  },
  createProject: async (projectData) => {
    const res = await fetch(`${API_BASE}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(projectData)
    });
    return res.json();
  },
  updateMilestone: async (projectId, milestoneId, data) => {
    const res = await fetch(`${API_BASE}/projects/${projectId}/milestones/${milestoneId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  addProjectUpdate: async (projectId, updateData) => {
    const res = await fetch(`${API_BASE}/projects/${projectId}/updates`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData)
    });
    return res.json();
  },
  pledgeSupport: async (projectId, pledgeData) => {
    const res = await fetch(`${API_BASE}/projects/${projectId}/pledge`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pledgeData)
    });
    return res.json();
  },
  solveProject: async (projectId, solveData) => {
    const res = await fetch(`${API_BASE}/projects/${projectId}/solve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(solveData)
    });
    return res.json();
  },

  // Expenses
  getExpenses: async (projectId = null) => {
    const query = projectId ? `?projectId=${projectId}` : '';
    const res = await fetch(`${API_BASE}/expenses${query}`);
    return res.json();
  },
  createExpense: async (formData) => {
    const res = await fetch(`${API_BASE}/expenses`, {
      method: 'POST',
      body: formData
    });
    return res.json();
  },

  // Leaderboard
  getLeaderboard: async () => {
    const res = await fetch(`${API_BASE}/leaderboard`);
    return res.json();
  },

  // Notifications
  getNotifications: async (role = null) => {
    const query = role ? `?role=${role}` : '';
    const res = await fetch(`${API_BASE}/notifications${query}`);
    return res.json();
  },

  // Stats
  getStats: async () => {
    const res = await fetch(`${API_BASE}/stats`);
    return res.json();
  },

  // Reset
  resetSystem: async () => {
    const res = await fetch(`${API_BASE}/system/reset`, { method: 'POST' });
    return res.json();
  }
};
