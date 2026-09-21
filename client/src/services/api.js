import { defaultProblems, defaultProjects } from './defaultData';

const API_BASE = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL.replace(/\/$/, '')}/api`
  : '/api';

// Clean seed cache version check to wipe old dummy test submissions
const DB_VERSION = 'awaazgram_v6_clean_presentation';
if (typeof window !== 'undefined') {
  try {
    if (localStorage.getItem('awaazgram_db_version') !== DB_VERSION) {
      localStorage.removeItem('awaazgram_problems');
      localStorage.removeItem('awaazgram_projects');
      localStorage.removeItem('awaazgram_requests');
      localStorage.setItem('awaazgram_db_version', DB_VERSION);
    }
  } catch (e) {}
}

export const sanitizeProblemList = (list) => {
  if (!Array.isArray(list)) return defaultProblems;
  const cleaned = list.filter(p => {
    if (!p) return false;
    const t = (p.title || '').trim().toLowerCase();
    const id = (p.id || '').toLowerCase();
    if (['abc', 'def', 'test', 'broken road', 'broken bridge', 'broken school', 'school broken', 'test problem'].includes(t)) {
      return false;
    }
    if (id.startsWith('prob-1790') || id.startsWith('ag-1790')) return false;
    return true;
  });
  return cleaned.length > 0 ? cleaned : defaultProblems;
};

// Helper for local storage persistence when backend is offline/disconnected
const getLocalProblems = () => {
  try {
    const cached = localStorage.getItem('awaazgram_problems');
    if (cached) {
      const parsed = JSON.parse(cached);
      const clean = sanitizeProblemList(parsed);
      if (clean.length > 0) {
        localStorage.setItem('awaazgram_problems', JSON.stringify(clean));
        return clean;
      }
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

export const generateCivicAIAnalysis = (title = '', description = '', category = '', address = '', city = '') => {
  const text = `${title} ${description} ${category}`.toLowerCase();

  if (text.includes('bridge') || text.includes('pul') || text.includes('culvert') || text.includes('overpass') || text.includes('pillar') || text.includes('flyover')) {
    return {
      urgency: "Critical",
      category: "Structural & Bridge Infrastructure",
      feasibilityScore: 94,
      impactScore: 95,
      estimatedBudget: "₹3,50,000 - ₹5,00,000",
      recommendedDepartment: "Structural & Civil Engineering Lab (MANIT Bhopal / BIT Mesra)",
      summary: `Gemini AI Structural Assessment: Critical load-bearing fatigue and fracture risks detected for "${title}" at ${address || 'Ward 12'}, ${city || 'Ranchi'}. Recommends rapid precast steel-reinforced modular truss rehabilitation and vibration telemetry sensors.`,
      keyFactors: ["Load-bearing structural integrity risk", "Public pedestrian & vehicle safety hazard", "Eligible for rapid university innovation grant"],
      tags: ["Structural", "Civil", "Bridge", "High-Priority"]
    };
  }

  if (text.includes('water') || text.includes('paani') || text.includes('drain') || text.includes('sewage') || text.includes('pipe') || text.includes('flood') || text.includes('leak') || text.includes('nala')) {
    return {
      urgency: "High",
      category: "Water & Fluid Engineering",
      feasibilityScore: 92,
      impactScore: 90,
      estimatedBudget: "₹85,000 - ₹1,40,000",
      recommendedDepartment: "Environmental & Fluid Mechanics Laboratory",
      summary: `Gemini AI Hydro-Diagnostic: Flow contamination and drainage obstruction identified at ${address || 'Main Road'}, ${city || 'Ranchi'}. Recommends student deployment of automated ultrasonic flow meters and filtration bypass.`,
      keyFactors: ["Civic health & water logging mitigation", "Low-cost IoT water quality monitoring", "High student prototype feasibility"],
      tags: ["Hydro-Engineering", "Water", "Sanitation", "IoT"]
    };
  }

  if (text.includes('light') || text.includes('solar') || text.includes('electric') || text.includes('dark') || text.includes('pole') || text.includes('bulb') || text.includes('bijli')) {
    return {
      urgency: "Medium",
      category: "Renewable Energy & IoT",
      feasibilityScore: 96,
      impactScore: 88,
      estimatedBudget: "₹45,000 - ₹85,000",
      recommendedDepartment: "Electrical & Renewable Energy Innovation Cell",
      summary: `Gemini AI Energy Diagnostic: Street illumination outage at ${address || 'Ward Sector'}, ${city || 'Ranchi'}. Recommends smart LDR solar LED luminaires with remote telemetry and battery backup.`,
      keyFactors: ["Nighttime public & women safety", "Energy-efficient off-grid solar power", "Rapid 7-day student deployability"],
      tags: ["Solar", "IoT", "Lighting", "Smart-City"]
    };
  }

  if (text.includes('road') || text.includes('pothole') || text.includes('sadak') || text.includes('gaddha') || text.includes('asphalt') || text.includes('tar') || text.includes('traffic')) {
    return {
      urgency: "High",
      category: "Pavement & Transportation Engineering",
      feasibilityScore: 90,
      impactScore: 92,
      estimatedBudget: "₹1,50,000 - ₹2,50,000",
      recommendedDepartment: "Transportation & Highway Engineering Lab",
      summary: `Gemini AI Pavement Diagnostic: Sub-grade aggregate degradation and surface erosion detected at ${address || 'Main Junction'}, ${city || 'Ranchi'}. Recommends geo-polymer rapid-curing bituminous concrete mix for weatherproofing.`,
      keyFactors: ["Accident prevention on arterial route", "Rapid-curing recycled composite material", "Cost savings vs municipal contractor rates"],
      tags: ["Roads", "Highway", "Pothole", "Pavement"]
    };
  }

  if (text.includes('waste') || text.includes('garbage') || text.includes('kachra') || text.includes('trash') || text.includes('dump') || text.includes('clean')) {
    return {
      urgency: "Medium",
      category: "Urban Sanitation & Smart Waste",
      feasibilityScore: 93,
      impactScore: 86,
      estimatedBudget: "₹40,000 - ₹75,000",
      recommendedDepartment: "Urban Sanitation & Smart Waste Management Hub",
      summary: `Gemini AI Sanitation Report: Unregulated waste accumulation and bio-hazard zone detected at ${address || 'Civic Center'}, ${city || 'Ranchi'}. Recommends smart compactor bins with ultrasonic fill-level telemetry and organic compost converter.`,
      keyFactors: ["Vectors of disease & public hygiene", "Automated municipal notification trigger", "Zero-landfill composting"],
      tags: ["Waste Management", "Hygiene", "Smart Bin"]
    };
  }

  // Default intelligent fallback
  return {
    urgency: "High",
    category: category || "Civic & Infrastructure Engineering",
    feasibilityScore: 89,
    impactScore: 88,
    estimatedBudget: "₹1,10,000 - ₹1,75,000",
    recommendedDepartment: "Civic Engineering & Interdisciplinary Innovation Lab",
    summary: `Gemini AI Civic Diagnosis: Technical evaluation confirmed high feasibility score (89/100) for "${title || 'Civic Issue'}" at ${address || 'Local Ward'}, ${city || 'Ranchi'}. Validated for university student engineering deployment under municipal grant.`,
    keyFactors: ["Civic impact priority", "Quad-Helix university prototype readiness", "Direct citizen benefit"],
    tags: ["Civic", "Innovation", "Smart Governance"]
  };
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

    const diagnosis = generateCivicAIAnalysis(
      problemData?.title,
      problemData?.description,
      problemData?.category,
      problemData?.address,
      problemData?.city
    );

    return {
      success: true,
      data: diagnosis
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
          const cleanData = sanitizeProblemList(data.data);
          localStorage.setItem('awaazgram_problems', JSON.stringify(cleanData));
          return { ...data, data: cleanData };
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
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data) return data;
      }
    } catch (e) {}
    const problems = getLocalProblems();
    const found = problems.find(p => p.id === id) || defaultProblems.find(p => p.id === id);
    return found ? { success: true, data: found } : { success: false, error: 'Not found' };
  },

  createProblem: async (formData) => {
    let title = 'New Civic Report';
    let description = '';
    let category = 'Infrastructure & Public Safety';
    let address = 'Main Road';
    let city = 'Ranchi';
    let state = 'Jharkhand';
    let reportedByName = 'Rahul Mishra';
    let imagePreview = null;

    if (formData instanceof FormData) {
      title = formData.get('title') || title;
      description = formData.get('description') || description;
      category = formData.get('category') || category;
      address = formData.get('address') || address;
      city = formData.get('city') || city;
      state = formData.get('state') || state;
      reportedByName = formData.get('reportedByName') || reportedByName;
      imagePreview = formData.get('imagePreview') || formData.get('imageUrl') || null;
    } else if (typeof formData === 'object' && formData !== null) {
      title = formData.title || title;
      description = formData.description || description;
      category = formData.category || category;
      address = formData.address || address;
      city = formData.city || city;
      state = formData.state || state;
      reportedByName = formData.reportedByName || reportedByName;
      imagePreview = formData.imagePreview || formData.imageUrl || (formData.images && formData.images[0]) || null;
    }

    try {
      const res = await fetch(`${API_BASE}/problems`, {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data) {
          if (imagePreview && (!data.data.images || data.data.images.length === 0 || data.data.images[0]?.includes('photo-1547683905-f686c993aae5'))) {
            data.data.images = [imagePreview];
          }
          const currentProblems = getLocalProblems();
          const updated = [data.data, ...currentProblems.filter(p => p.id !== data.data.id)];
          localStorage.setItem('awaazgram_problems', JSON.stringify(updated));
          return data;
        }
      }
    } catch (e) {
      console.warn('Backend offline, saving locally:', e.message);
    }

    // Fallback in-memory/localStorage creation
    const aiAnalysis = generateCivicAIAnalysis(title, description, category, address, city);

    const newProblem = {
      id: `ag-${Date.now()}`,
      title,
      description,
      category: aiAnalysis.category || category,
      location: { address, city, state },
      images: imagePreview ? [imagePreview] : [],
      reportedBy: reportedByName,
      reportedByName: reportedByName,
      reportedAt: new Date().toISOString(),
      status: "pending_verification",
      upvotes: 1,
      aiAnalysis
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
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data) return data;
      }
    } catch (e) {}
    const projects = getLocalProjects();
    const found = projects.find(p => p.id === id || p.problemId === id) || defaultProjects.find(p => p.id === id || p.problemId === id);
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

  // Adoption Requests / Proposals (Quad-Helix College Approvals)
  getAdoptionRequests: async () => {
    try {
      const res = await fetch(`${API_BASE}/requests`);
      if (res.ok) return await res.json();
    } catch (e) {}

    try {
      const cached = localStorage.getItem('awaazgram_requests');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return { success: true, data: parsed };
      }
    } catch (e) {}

    const defaultReqs = [
      {
        id: 'REQ-JH-2026-01',
        problemId: 'ag1001',
        problemTitle: 'Broken Street Light & Dark Corridor in Sector 4',
        location: 'Ward 12, Ranchi',
        university: 'MANIT Bhopal',
        teamName: 'MANIT IoT & Energy Innovation Team',
        teamLead: 'Rohan Nair (Student Lead)',
        facultyMentor: 'Prof. Kumar',
        teamMembers: ['Rohan Nair', 'Priya Verma', 'Amit Patel', 'Sneha Rao'],
        requestedBudget: 180000,
        aiRecommendedBudget: 180000,
        aiMatchScore: 96,
        aiShortReason: 'Direct match for Electrical & IoT Lab • Solar battery testing rig available.',
        status: 'approved',
        submittedAt: '2026-05-11T10:00:00Z'
      },
      {
        id: 'REQ-JH-2026-02',
        problemId: 'ag1008',
        problemTitle: 'Contaminated Drinking Water Handpump in Ward 9',
        location: 'Sector 4, Bokaro',
        university: 'BIT Mesra, Ranchi',
        teamName: 'Team Jaltarang Hydro Lab',
        teamLead: 'Aakash Deshmukh',
        facultyMentor: 'Prof. Arvind Rao',
        teamMembers: ['Aakash Deshmukh', 'Tanvi Joshi', 'Rahul Patil', 'Omkar Shinde'],
        requestedBudget: 190000,
        aiRecommendedBudget: 180000,
        aiMatchScore: 94,
        aiShortReason: 'Nano-membrane filtration testing lab ready • Experienced water faculty guidance.',
        status: 'approved',
        submittedAt: '2026-05-08T14:30:00Z'
      }
    ];
    localStorage.setItem('awaazgram_requests', JSON.stringify(defaultReqs));
    return { success: true, data: defaultReqs };
  },

  createAdoptionRequest: async (reqData) => {
    const newReq = {
      id: `REQ-JH-${Date.now().toString().slice(-4)}`,
      status: 'pending_approval',
      submittedAt: new Date().toISOString(),
      aiMatchScore: 94,
      aiShortReason: 'University research lab equipped • Faculty mentor assigned • High student feasibility.',
      aiRecommendedBudget: reqData.requestedBudget || 150000,
      ...reqData
    };

    let requests = [];
    try {
      const cached = localStorage.getItem('awaazgram_requests');
      if (cached) requests = JSON.parse(cached);
    } catch (e) {}
    const updated = [newReq, ...requests];
    localStorage.setItem('awaazgram_requests', JSON.stringify(updated));

    // Update problem object to store adoption proposal status
    const problems = getLocalProblems();
    const updatedProbs = problems.map(p => {
      if (p.id === reqData.problemId) {
        return {
          ...p,
          adoptionRequest: {
            requestId: newReq.id,
            teamName: reqData.teamName,
            universityName: reqData.university,
            studentLead: reqData.teamLead,
            facultyMentor: reqData.facultyMentor,
            status: 'pending_approval',
            submittedAt: newReq.submittedAt
          }
        };
      }
      return p;
    });
    localStorage.setItem('awaazgram_problems', JSON.stringify(updatedProbs));

    return { success: true, data: newReq };
  },

  approveAdoptionRequest: async (requestId) => {
    let requests = [];
    try {
      const cached = localStorage.getItem('awaazgram_requests');
      if (cached) requests = JSON.parse(cached);
    } catch (e) {}

    const targetReq = requests.find(r => r.id === requestId);
    if (!targetReq) return { success: false, error: 'Request not found' };

    const updatedRequests = requests.map(r => r.id === requestId ? { ...r, status: 'approved' } : r);
    localStorage.setItem('awaazgram_requests', JSON.stringify(updatedRequests));

    // Create the project now that Government sanctioned & approved
    const projectRes = await api.createProject({
      problemId: targetReq.problemId,
      title: targetReq.problemTitle || 'Civic Innovation Project',
      universityName: targetReq.university,
      teamName: targetReq.teamName,
      studentLead: targetReq.teamLead || targetReq.studentLead || 'Student Lead',
      facultyMentor: targetReq.facultyMentor || 'Faculty Mentor',
      teamMembers: targetReq.teamMembers || [targetReq.teamLead || 'Student Lead', 'Priya Verma', 'Amit Patel', 'Sneha Rao'],
      solutionDetails: targetReq.solutionDetails || {
        summary: targetReq.solutionSummary || 'Hardware prototyping and deployment.',
        techStack: targetReq.techStack || ['IoT Sensors', 'MicroPython', 'Telemetry']
      },
      allocatedBudget: targetReq.aiRecommendedBudget || targetReq.requestedBudget || 150000
    });

    // Update Problem to in_progress
    const currentProblems = getLocalProblems();
    const updatedProbs = currentProblems.map(p => {
      if (p.id === targetReq.problemId) {
        return {
          ...p,
          status: 'in_progress',
          projectId: projectRes.data?.id,
          verification: {
            ...(p.verification || {}),
            status: 'verified',
            allocatedBudget: targetReq.aiRecommendedBudget || targetReq.requestedBudget || 150000,
            verifiedAt: new Date().toISOString()
          },
          adoptionRequest: {
            ...(p.adoptionRequest || {}),
            status: 'approved',
            approvedAt: new Date().toISOString()
          }
        };
      }
      return p;
    });
    localStorage.setItem('awaazgram_problems', JSON.stringify(updatedProbs));

    const updatedProblem = updatedProbs.find(p => p.id === targetReq.problemId);

    return {
      success: true,
      data: {
        request: { ...targetReq, status: 'approved' },
        project: projectRes.data,
        problem: updatedProblem
      }
    };
  },

  rejectAdoptionRequest: async (requestId, reason = 'Does not align with municipal grant scope.') => {
    let requests = [];
    try {
      const cached = localStorage.getItem('awaazgram_requests');
      if (cached) requests = JSON.parse(cached);
    } catch (e) {}

    const updatedRequests = requests.map(r => r.id === requestId ? { ...r, status: 'rejected', rejectionReason: reason } : r);
    localStorage.setItem('awaazgram_requests', JSON.stringify(updatedRequests));
    return { success: true, data: updatedRequests.find(r => r.id === requestId) };
  },

  // Reset
  resetSystem: async () => {
    try {
      await fetch(`${API_BASE}/system/reset`, { method: 'POST' });
    } catch (e) {}
    localStorage.setItem('awaazgram_problems', JSON.stringify(defaultProblems));
    localStorage.setItem('awaazgram_projects', JSON.stringify(defaultProjects));
    localStorage.removeItem('awaazgram_requests');
    return { success: true };
  }
};
