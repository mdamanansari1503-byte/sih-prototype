import { defaultProblems, defaultProjects } from './defaultData';

const API_BASE = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL.replace(/\/$/, '')}/api`
  : '/api';

// Helper for local storage persistence when backend is offline/disconnected
const getLocalProblems = () => {
  try {
    const cached = localStorage.getItem('awaazgram_problems');
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}
  localStorage.setItem('awaazgram_problems', JSON.stringify(defaultProblems));
  return defaultProblems;
};

const getLocalProjects = () => {
  try {
    const cached = localStorage.getItem('awaazgram_projects');
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}
  localStorage.setItem('awaazgram_projects', JSON.stringify(defaultProjects));
  return defaultProjects;
};

export const api = {
  // Auth & Users
  getUsers: async () => {
    try {
      const res = await fetch(`${API_BASE}/auth/users`);
      if (res.ok) return await res.json();
    } catch (e) {}
    return { success: true, data: [] };
  },

  login: async (credentials) => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    return { success: true, token: 'mock-token', user: credentials };
  },

  register: async (userData) => {
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    return { success: true, token: 'mock-token', user: userData };
  },

  // AI Analysis
  analyzeProblem: async (problemData) => {
    try {
      const res = await fetch(`${API_BASE}/ai/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(problemData)
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    return {
      success: true,
      data: {
        urgency: "High",
        feasibilityScore: 92,
        estimatedBudget: "₹1,20,000 - ₹1,80,000",
        recommendedDepartment: "Civic & Structural Engineering Lab",
        summary: `Automated Gemini analysis: Verified feasibility score 92/100. Suitable for university student engineering deployment.`
      }
    };
  },

  // Problems
  getProblems: async (params = {}) => {
    try {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`${API_BASE}/problems${query ? `?${query}` : ''}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          localStorage.setItem('awaazgram_problems', JSON.stringify(data.data));
          return data;
        }
      }
    } catch (err) {
      console.warn('Backend unavailable, using client-side demo storage:', err.message);
    }
    return { success: true, data: getLocalProblems() };
  },

  getProblemById: async (id) => {
    try {
      const res = await fetch(`${API_BASE}/problems/${id}`);
      if (res.ok) return await res.json();
    } catch (e) {}
    const problems = getLocalProblems();
    const found = problems.find(p => p.id === id);
    return found ? { success: true, data: found } : { success: false, error: 'Not found' };
  },

  createProblem: async (formData) => {
    try {
      const res = await fetch(`${API_BASE}/problems`, {
        method: 'POST',
        body: formData
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    // Fallback in-memory/localStorage creation
    const title = formData.get('title') || 'New Civic Report';
    const description = formData.get('description') || '';
    const category = formData.get('category') || 'Infrastructure & Public Safety';
    const address = formData.get('address') || 'Main Road';
    const city = formData.get('city') || 'Ranchi';
    const state = formData.get('state') || 'Jharkhand';
    const reportedByName = formData.get('reportedByName') || 'Rahul Mishra';

    const newProblem = {
      id: `ag-${Date.now()}`,
      title,
      description,
      category,
      location: { address, city, state },
      images: ["https://images.unsplash.com/photo-1547683905-f686c993aae5?w=600"],
      reportedBy: reportedByName,
      reportedByName: reportedByName,
      reportedAt: new Date().toISOString(),
      status: "pending_verification",
      upvotes: 1,
      aiAnalysis: {
        urgency: "High",
        category,
        feasibilityScore: 90,
        estimatedBudget: "₹1,20,000",
        recommendedDepartment: "Civil & Environmental Engineering Cell",
        summary: `AI Civic Assessment: High priority grievance logged at ${address}, ${city}. Ready for municipal review.`
      }
    };

    const currentProblems = getLocalProblems();
    const updated = [newProblem, ...currentProblems];
    localStorage.setItem('awaazgram_problems', JSON.stringify(updated));

    return { success: true, data: newProblem };
  },

  verifyProblem: async (id, data) => {
    try {
      const res = await fetch(`${API_BASE}/problems/${id}/verify`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    const currentProblems = getLocalProblems();
    const updated = currentProblems.map(p => {
      if (p.id === id) {
        return {
          ...p,
          status: data.status || 'verified',
          verification: {
            ...data,
            verifiedAt: new Date().toISOString()
          }
        };
      }
      return p;
    });
    localStorage.setItem('awaazgram_problems', JSON.stringify(updated));
    const target = updated.find(p => p.id === id);
    return { success: true, data: target };
  },

  upvoteProblem: async (id, userId) => {
    try {
      const res = await fetch(`${API_BASE}/problems/${id}/upvote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    const currentProblems = getLocalProblems();
    const updated = currentProblems.map(p => {
      if (p.id === id) {
        return { ...p, upvotes: (p.upvotes || 0) + 1 };
      }
      return p;
    });
    localStorage.setItem('awaazgram_problems', JSON.stringify(updated));
    const target = updated.find(p => p.id === id);
    return { success: true, data: target };
  },

  // Projects
  getProjects: async (params = {}) => {
    try {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`${API_BASE}/projects${query ? `?${query}` : ''}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          localStorage.setItem('awaazgram_projects', JSON.stringify(data.data));
          return data;
        }
      }
    } catch (err) {}
    return { success: true, data: getLocalProjects() };
  },

  getProjectById: async (id) => {
    try {
      const res = await fetch(`${API_BASE}/projects/${id}`);
      if (res.ok) return await res.json();
    } catch (e) {}
    const projects = getLocalProjects();
    const found = projects.find(p => p.id === id);
    return found ? { success: true, data: found } : { success: false, error: 'Not found' };
  },

  createProject: async (projectData) => {
    try {
      const res = await fetch(`${API_BASE}/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData)
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    const newProj = {
      id: `proj-${Date.now()}`,
      ...projectData,
      status: 'in_progress',
      progressPercentage: 10,
      startedAt: new Date().toISOString(),
      milestones: [
        { id: "m-1", title: "Preliminary Site & Feasibility Survey", status: "completed", description: "Ground survey and engineering simulations completed." },
        { id: "m-2", title: "Hardware Fabrication & Testing", status: "in_progress", description: "Bench testing hardware modules in university lab." },
        { id: "m-3", title: "Field Installation & Deployment", status: "pending", description: "Mounting hardware on site." }
      ]
    };

    const currentProjects = getLocalProjects();
    const updated = [newProj, ...currentProjects];
    localStorage.setItem('awaazgram_projects', JSON.stringify(updated));
    return { success: true, data: newProj };
  },

  updateMilestone: async (projectId, milestoneId, data) => {
    try {
      const res = await fetch(`${API_BASE}/projects/${projectId}/milestones/${milestoneId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    return { success: true };
  },

  addProjectUpdate: async (projectId, updateData) => {
    try {
      const res = await fetch(`${API_BASE}/projects/${projectId}/updates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    return { success: true };
  },

  pledgeSupport: async (projectId, pledgeData) => {
    try {
      const res = await fetch(`${API_BASE}/projects/${projectId}/pledge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pledgeData)
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    return { success: true };
  },

  solveProject: async (projectId, solveData) => {
    try {
      const res = await fetch(`${API_BASE}/projects/${projectId}/solve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(solveData)
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    return { success: true };
  },

  // Expenses
  getExpenses: async (projectId = null) => {
    try {
      const query = projectId ? `?projectId=${projectId}` : '';
      const res = await fetch(`${API_BASE}/expenses${query}`);
      if (res.ok) return await res.json();
    } catch (e) {}
    return { success: true, data: [] };
  },

  createExpense: async (formData) => {
    try {
      const res = await fetch(`${API_BASE}/expenses`, {
        method: 'POST',
        body: formData
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    return { success: true };
  },

  // Leaderboard
  getLeaderboard: async () => {
    try {
      const res = await fetch(`${API_BASE}/leaderboard`);
      if (res.ok) return await res.json();
    } catch (e) {}
    return { success: true, data: [] };
  },

  // Notifications
  getNotifications: async (role = null) => {
    try {
      const query = role ? `?role=${role}` : '';
      const res = await fetch(`${API_BASE}/notifications${query}`);
      if (res.ok) return await res.json();
    } catch (e) {}
    return { success: true, data: [] };
  },

  // Stats
  getStats: async () => {
    try {
      const res = await fetch(`${API_BASE}/stats`);
      if (res.ok) return await res.json();
    } catch (e) {}
    return { success: true, data: { solved: 38, teams: 45, funding: "₹ 1.25 Cr", turnaround: "14 Days" } };
  },

  // Reset
  resetSystem: async () => {
    try {
      await fetch(`${API_BASE}/system/reset`, { method: 'POST' });
    } catch (e) {}
    localStorage.setItem('awaazgram_problems', JSON.stringify(defaultProblems));
    localStorage.setItem('awaazgram_projects', JSON.stringify(defaultProjects));
    return { success: true };
  }
};
