import express from 'express';
import multer from 'multer';
import { storage } from '../db/storage.js';
import { analyzeProblemWithGemini } from '../services/geminiService.js';
import { handleFileUpload } from '../services/firebaseService.js';

const router = express.Router();
const upload = multer({ limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB

// ================= AUTH / PERSONAS =================
router.get('/auth/users', (req, res) => {
  const users = storage.getUsers();
  res.json({ success: true, data: users });
});

router.post('/auth/login', (req, res) => {
  const { email, role } = req.body;
  let user = null;
  if (email) {
    user = storage.getUserByEmail(email);
  } else if (role) {
    user = storage.getUsers().find(u => u.role === role);
  }

  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  res.json({
    success: true,
    data: {
      user,
      token: `jwt-awaazgram-${user.id}-${Date.now()}`
    }
  });
});

router.post('/auth/register', (req, res) => {
  const { name, email, role, phone, city, state, organization, institution, department } = req.body;
  if (!name || !email || !role) {
    return res.status(400).json({ success: false, message: 'Name, email, and role are required' });
  }

  const existing = storage.getUserByEmail(email);
  if (existing) {
    return res.status(400).json({ success: false, message: 'User already exists with this email' });
  }

  const newUser = {
    id: `user-${Date.now()}`,
    name,
    email,
    role,
    phone: phone || '',
    city: city || 'Pune',
    state: state || 'Maharashtra',
    organization: organization || institution || '',
    institution: institution || '',
    department: department || '',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    verified: true
  };

  storage.createUser(newUser);
  res.status(201).json({ success: true, data: { user: newUser, token: `jwt-awaazgram-${newUser.id}` } });
});

// ================= AI ANALYSIS =================
router.post('/ai/analyze', async (req, res) => {
  try {
    const { title, description, category, location } = req.body;
    if (!title || !description) {
      return res.status(400).json({ success: false, message: 'Title and description are required for AI analysis' });
    }

    const analysis = await analyzeProblemWithGemini({ title, description, category, location });
    res.json({ success: true, data: analysis });
  } catch (err) {
    console.error('AI Analysis Route Error:', err);
    res.status(500).json({ success: false, message: 'AI Analysis failed', error: err.message });
  }
});

// ================= PROBLEMS =================
router.get('/problems', (req, res) => {
  const { status, city, category, search } = req.query;
  const problems = storage.getProblems({ status, city, category, search });
  res.json({ success: true, data: problems });
});

router.get('/problems/:id', (req, res) => {
  const problem = storage.getProblemById(req.params.id);
  if (!problem) {
    return res.status(404).json({ success: false, message: 'Problem not found' });
  }
  res.json({ success: true, data: problem });
});

router.post('/problems', upload.array('media', 4), async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      address,
      city,
      state,
      pincode,
      lat,
      lng,
      reportedById,
      reportedByName,
      reportedByPhone
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({ success: false, message: 'Title and description are required' });
    }

    // Handle uploaded media files or image URLs / Base64
    const imageUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const url = await handleFileUpload(file, req);
        if (url) imageUrls.push(url);
      }
    }

    // Check body parameters
    if (imageUrls.length === 0) {
      if (req.body.imagePreview) {
        imageUrls.push(req.body.imagePreview);
      } else if (req.body.imageUrl) {
        imageUrls.push(req.body.imageUrl);
      } else if (req.body.image) {
        imageUrls.push(req.body.image);
      }
    }

    // Perform Gemini AI Analysis
    const locStr = `${address || ''}, ${city || 'Pune'}, ${state || 'Maharashtra'}`;
    const aiAnalysis = await analyzeProblemWithGemini({
      title,
      description,
      category,
      location: locStr
    });

    const newProblem = {
      id: `prob-${Date.now()}`,
      title,
      description,
      category: category || aiAnalysis.category || 'General Civic Issue',
      location: {
        address: address || 'Local Ward Area',
        city: city || 'Pune',
        state: state || 'Maharashtra',
        pincode: pincode || '411001',
        lat: parseFloat(lat) || 18.5204,
        lng: parseFloat(lng) || 73.8567
      },
      images: imageUrls,
      reportedBy: {
        id: reportedById || 'user-cit-1',
        name: reportedByName || 'Rajesh Kumar',
        phone: reportedByPhone || '+91 98765 43210'
      },
      reportedAt: new Date().toISOString(),
      status: 'pending_verification',
      upvotes: 1,
      upvotedBy: [reportedById || 'user-cit-1'],
      aiAnalysis,
      verification: null,
      projectId: null
    };

    storage.createProblem(newProblem);

    // Notify government officers
    storage.createNotification({
      recipientRole: 'government',
      title: 'New Problem Reported',
      message: `Citizen reported "${title}" in ${city || 'Pune'}. AI rated urgency as ${aiAnalysis.urgency}.`,
      link: `/problems/${newProblem.id}`,
      type: 'warning'
    });

    res.status(201).json({ success: true, data: newProblem });
  } catch (err) {
    console.error('Create Problem Error:', err);
    res.status(500).json({ success: false, message: 'Failed to create problem report', error: err.message });
  }
});

router.put('/problems/:id/verify', (req, res) => {
  const { status, remarks, verifiedBy, allocatedBudget, priority } = req.body;
  const problem = storage.getProblemById(req.params.id);

  if (!problem) {
    return res.status(404).json({ success: false, message: 'Problem not found' });
  }

  const updatedProblem = storage.updateProblem(req.params.id, {
    status: status || 'verified', // 'verified' or 'rejected'
    verification: {
      verifiedBy: verifiedBy || 'IAS Ananya Verma',
      verifiedAt: new Date().toISOString(),
      status: status || 'verified',
      remarks: remarks || 'Verified and approved for engineering development.',
      allocatedBudget: Number(allocatedBudget) || 150000,
      priority: priority || 'High'
    }
  });

  // Create notifications
  storage.createNotification({
    recipientRole: 'citizen',
    title: status === 'verified' ? 'Problem Verified by Government! ✅' : 'Problem Review Updated',
    message: `Your report "${problem.title}" was marked ${status} by ${verifiedBy || 'Government Official'}.`,
    link: `/problems/${problem.id}`,
    type: status === 'verified' ? 'success' : 'info'
  });

  if (status === 'verified') {
    storage.createNotification({
      recipientRole: 'university',
      title: 'New Verified Challenge Available',
      message: `"${problem.title}" is now open for university teams to adopt with ₹${allocatedBudget || 150000} grant.`,
      link: `/problems/${problem.id}`,
      type: 'info'
    });
  }

  res.json({ success: true, data: updatedProblem });
});

router.post('/problems/:id/upvote', (req, res) => {
  const { userId } = req.body;
  const problem = storage.upvoteProblem(req.params.id, userId || 'user-cit-1');
  if (!problem) {
    return res.status(404).json({ success: false, message: 'Problem not found' });
  }
  res.json({ success: true, data: problem });
});

// ================= PROJECTS =================
router.get('/projects', (req, res) => {
  const { status, universityId } = req.query;
  const projects = storage.getProjects({ status, universityId });
  res.json({ success: true, data: projects });
});

router.get('/projects/:id', (req, res) => {
  const project = storage.getProjectById(req.params.id);
  if (!project) {
    return res.status(404).json({ success: false, message: 'Project not found' });
  }
  const problem = storage.getProblemById(project.problemId);
  const expenses = storage.getExpenses(project.id);
  res.json({ success: true, data: { ...project, problem, expenses } });
});

// University accepts a problem
router.post('/projects', (req, res) => {
  const {
    problemId,
    universityId,
    universityName,
    teamName,
    studentLead,
    facultyMentor,
    teamMembers,
    targetCompletionDate,
    solutionSummary,
    techStack
  } = req.body;

  const problem = storage.getProblemById(problemId);
  if (!problem) {
    return res.status(404).json({ success: false, message: 'Problem not found' });
  }

  const newProject = {
    id: `proj-${Date.now()}`,
    problemId,
    title: `Solution for: ${problem.title}`,
    universityId: universityId || 'user-uni-1',
    universityName: universityName || 'College of Engineering Pune (COEP Tech)',
    teamName: teamName || 'Team Innovators',
    studentLead: studentLead || 'Aakash Deshmukh',
    facultyMentor: facultyMentor || 'Prof. Arvind Rao',
    teamMembers: teamMembers || ['Aakash Deshmukh', 'Tanvi Joshi', 'Rahul Patil'],
    status: 'in_progress',
    progressPercentage: 15,
    startedAt: new Date().toISOString(),
    targetCompletionDate: targetCompletionDate || new Date(Date.now() + 45 * 86400000).toISOString(),
    industryPledges: [],
    milestones: [
      {
        id: `m-init-1`,
        title: 'Problem Diagnostics & Feasibility Validation',
        description: 'Complete on-ground field measurements and finalize CAD/circuit architecture.',
        status: 'completed',
        completedAt: new Date().toISOString(),
        photoProof: problem.images?.[0] || null
      },
      {
        id: `m-init-2`,
        title: 'Component Procurement & Core Engineering Prototype',
        description: 'Procure micro-controllers/materials and assemble alpha prototype.',
        status: 'in_progress',
        completedAt: null,
        photoProof: null
      },
      {
        id: `m-init-3`,
        title: 'Field Deployment & IoT Telemetry Integration',
        description: 'Install solution at target civic location and connect live sensor feed.',
        status: 'pending',
        completedAt: null,
        photoProof: null
      },
      {
        id: `m-init-4`,
        title: 'Government Sign-off & Public Community Handover',
        description: 'Demonstrate operational reliability and submit final project report.',
        status: 'pending',
        completedAt: null,
        photoProof: null
      }
    ],
    updatesTimeline: [
      {
        id: `up-init`,
        date: new Date().toISOString(),
        author: studentLead || 'Student Team Lead',
        role: 'Team Lead',
        title: 'Project Formally Adopted by University',
        content: `Our engineering team from ${universityName || 'University'} has officially adopted this challenge. Field survey scheduled this week.`,
        photos: []
      }
    ],
    allocatedBudget: problem.verification?.allocatedBudget || 150000,
    totalExpenses: 0,
    solutionDetails: {
      summary: solutionSummary || problem.aiAnalysis?.summary || 'Engineering deployment addressing root cause.',
      techStack: techStack || problem.aiAnalysis?.relevantSkills || ['IoT Sensors', 'Rapid Prototyping'],
      repoUrl: '',
      finalOutcome: null
    }
  };

  storage.createProject(newProject);

  // Notify Citizen and Industry
  storage.createNotification({
    recipientRole: 'citizen',
    title: 'University Adopted Your Problem! 🚀',
    message: `${newProject.teamName} (${newProject.universityName}) has accepted to solve "${problem.title}".`,
    link: `/projects/${newProject.id}`,
    type: 'success'
  });

  storage.createNotification({
    recipientRole: 'industry',
    title: 'New Student Project Needs CSR & Mentorship',
    message: `${newProject.universityName} started working on "${problem.title}". Open for CSR funding & hardware support.`,
    link: `/projects/${newProject.id}`,
    type: 'info'
  });

  res.status(201).json({ success: true, data: newProject });
});

// Milestone updates
router.put('/projects/:id/milestones/:mId', (req, res) => {
  const { status, photoProof } = req.body;
  const project = storage.getProjectById(req.params.id);
  if (!project) {
    return res.status(404).json({ success: false, message: 'Project not found' });
  }

  const milestone = project.milestones.find(m => m.id === req.params.mId);
  if (!milestone) {
    return res.status(404).json({ success: false, message: 'Milestone not found' });
  }

  milestone.status = status;
  if (status === 'completed') {
    milestone.completedAt = new Date().toISOString();
    if (photoProof) milestone.photoProof = photoProof;
  }

  // Recalculate progress percentage
  const completedCount = project.milestones.filter(m => m.status === 'completed').length;
  project.progressPercentage = Math.round((completedCount / project.milestones.length) * 100);

  storage.updateProject(project.id, {
    milestones: project.milestones,
    progressPercentage: project.progressPercentage
  });

  res.json({ success: true, data: project });
});

// Timeline progress update
router.post('/projects/:id/updates', (req, res) => {
  const { title, content, author, role, photos } = req.body;
  const project = storage.getProjectById(req.params.id);
  if (!project) {
    return res.status(404).json({ success: false, message: 'Project not found' });
  }

  const updateEntry = {
    id: `up-${Date.now()}`,
    date: new Date().toISOString(),
    author: author || 'Team Member',
    role: role || 'Engineer',
    title: title || 'Milestone Progress Update',
    content,
    photos: photos || []
  };

  project.updatesTimeline.unshift(updateEntry);
  storage.updateProject(project.id, { updatesTimeline: project.updatesTimeline });

  res.status(201).json({ success: true, data: updateEntry });
});

// Industry pledge
router.post('/projects/:id/pledge', (req, res) => {
  const { industryId, industryName, contactPerson, pledgeType, amountPledged, hardwareSupplied } = req.body;
  const project = storage.getProjectById(req.params.id);
  if (!project) {
    return res.status(404).json({ success: false, message: 'Project not found' });
  }

  const pledge = {
    id: `pledge-${Date.now()}`,
    industryId: industryId || 'user-ind-1',
    industryName: industryName || 'Tata Sustainability & CSR Initiatives',
    contactPerson: contactPerson || 'Vikram Malhotra',
    pledgeType: pledgeType || 'Mentorship & Grant',
    amountPledged: Number(amountPledged) || 50000,
    hardwareSupplied: hardwareSupplied || '',
    pledgedAt: new Date().toISOString()
  };

  if (!project.industryPledges) project.industryPledges = [];
  project.industryPledges.push(pledge);

  // Add timeline entry
  project.updatesTimeline.unshift({
    id: `up-pledge-${Date.now()}`,
    date: new Date().toISOString(),
    author: contactPerson || 'Industry Partner',
    role: 'CSR Sponsor',
    title: `Industry Support Pledged: ${pledgeType}`,
    content: `${industryName} committed ₹${amountPledged} ${hardwareSupplied ? `and provided ${hardwareSupplied}` : ''} to accelerate this project.`,
    photos: []
  });

  storage.updateProject(project.id, {
    industryPledges: project.industryPledges,
    updatesTimeline: project.updatesTimeline
  });

  storage.createNotification({
    recipientRole: 'university',
    title: 'Industry Sponsorship Received! 💰',
    message: `${industryName} pledged ₹${amountPledged} for ${project.title}.`,
    link: `/projects/${project.id}`,
    type: 'success'
  });

  res.status(201).json({ success: true, data: pledge });
});

// Mark project solved
router.post('/projects/:id/solve', (req, res) => {
  const { finalOutcome, afterPhoto, repoUrl } = req.body;
  const project = storage.getProjectById(req.params.id);
  if (!project) {
    return res.status(404).json({ success: false, message: 'Project not found' });
  }

  const problem = storage.getProblemById(project.problemId);

  // Complete all milestones
  project.milestones.forEach(m => {
    m.status = 'completed';
    if (!m.completedAt) m.completedAt = new Date().toISOString();
  });

  project.status = 'solved';
  project.progressPercentage = 100;
  project.completedAt = new Date().toISOString();
  project.solutionDetails = {
    ...project.solutionDetails,
    finalOutcome: finalOutcome || 'Engineering project successfully deployed, validated by local civic authorities and community beneficiaries.',
    repoUrl: repoUrl || project.solutionDetails?.repoUrl || '',
    beforeAfterPhotos: {
      before: problem?.images?.[0] || 'https://images.unsplash.com/photo-1547683905-f686c993aae5?w=800&auto=format&fit=crop&q=80',
      after: afterPhoto || 'https://images.unsplash.com/photo-1508873696983-2df5293cb32b?w=800&auto=format&fit=crop&q=80'
    }
  };

  project.updatesTimeline.unshift({
    id: `up-solved-${Date.now()}`,
    date: new Date().toISOString(),
    author: project.studentLead,
    role: 'Student Lead',
    title: '🎉 Project Solved & Deployed!',
    content: finalOutcome || 'Our team completed all testing and commissioned the system on ground. Issue marked SOLVED!',
    photos: [afterPhoto || 'https://images.unsplash.com/photo-1508873696983-2df5293cb32b?w=800&auto=format&fit=crop&q=80']
  });

  storage.updateProject(project.id, project);

  // Update Problem status to solved
  if (problem) {
    storage.updateProblem(problem.id, { status: 'solved' });
  }

  // Update university leaderboard
  storage.updateLeaderboardScore(project.universityName, 350, true);

  // Broadcast celebration notification
  storage.createNotification({
    recipientRole: 'all',
    title: `Civic Problem Solved by ${project.universityName}! 🏆`,
    message: `${project.teamName} successfully deployed solution for "${problem?.title || project.title}".`,
    link: `/projects/${project.id}`,
    type: 'success'
  });

  res.json({ success: true, data: project });
});

// ================= EXPENSES =================
router.get('/expenses', (req, res) => {
  const { projectId } = req.query;
  const expenses = storage.getExpenses(projectId);
  res.json({ success: true, data: expenses });
});

router.post('/expenses', upload.single('invoice'), async (req, res) => {
  try {
    const { projectId, item, category, amount, vendor, loggedBy } = req.body;
    if (!projectId || !item || !amount) {
      return res.status(400).json({ success: false, message: 'Project ID, item, and amount are required' });
    }

    let invoiceUrl = 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80';
    if (req.file) {
      const uploaded = await handleFileUpload(req.file, req);
      if (uploaded) invoiceUrl = uploaded;
    } else if (req.body.invoiceUrl) {
      invoiceUrl = req.body.invoiceUrl;
    }

    const expense = {
      id: `exp-${Date.now()}`,
      projectId,
      item,
      category: category || 'Materials & Components',
      amount: Number(amount),
      vendor: vendor || 'Local Vendor / Standard Procurement',
      invoiceUrl,
      date: new Date().toISOString().split('T')[0],
      loggedBy: loggedBy || 'Student Team Lead',
      approvedByGov: true,
      govRemarks: 'Auto-verified under transparent project ledger.'
    };

    storage.createExpense(expense);
    res.status(201).json({ success: true, data: expense });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to record expense', error: err.message });
  }
});

// ================= LEADERBOARD =================
router.get('/leaderboard', (req, res) => {
  const leaderboard = storage.getLeaderboard();
  res.json({ success: true, data: leaderboard });
});

// ================= NOTIFICATIONS =================
router.get('/notifications', (req, res) => {
  const { role } = req.query;
  const notifs = storage.getNotifications(role);
  res.json({ success: true, data: notifs });
});

// ================= ADMIN STATS =================
router.get('/stats', (req, res) => {
  const problems = storage.getProblems();
  const projects = storage.getProjects();
  const expenses = storage.getExpenses();

  const totalProblems = problems.length;
  const pendingVerification = problems.filter(p => p.status === 'pending_verification').length;
  const verifiedProblems = problems.filter(p => p.status === 'verified').length;
  const activeProjects = projects.filter(p => p.status === 'in_progress' || p.status === 'accepted').length;
  const solvedProjects = problems.filter(p => p.status === 'solved').length;

  const totalBudgetAllocated = problems.reduce((acc, p) => acc + (p.verification?.allocatedBudget || 0), 0);
  const totalExpensesSpent = expenses.reduce((acc, e) => acc + (Number(e.amount) || 0), 0);
  const totalFundsPledged = projects.reduce((acc, p) => {
    const pledges = p.industryPledges || [];
    return acc + pledges.reduce((pAcc, pl) => pAcc + (Number(pl.amountPledged) || 0), 0);
  }, 0);

  // Category breakdown
  const categoryCounts = {};
  problems.forEach(p => {
    const cat = p.category || 'Other';
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });

  const categoryBreakdown = Object.entries(categoryCounts).map(([name, count]) => ({ name, count }));

  res.json({
    success: true,
    data: {
      totalProblems,
      pendingVerification,
      verifiedProblems,
      activeProjects,
      solvedProjects,
      totalBudgetAllocated,
      totalExpensesSpent,
      totalFundsPledged,
      categoryBreakdown
    }
  });
});

// Reset demo database
router.post('/system/reset', (req, res) => {
  storage.resetDemoData();
  res.json({ success: true, message: 'Database reset to default seed state' });
});

export default router;
