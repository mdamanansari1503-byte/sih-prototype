import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  ThumbsUp,
  CheckCircle2,
  Clock,
  ExternalLink,
  ShieldCheck,
  GraduationCap,
  Briefcase,
  Layers,
  Receipt,
  Check,
  CircleDot,
  CameraOff,
  Image as ImageIcon
} from 'lucide-react';

export default function ProjectDetailView({
  problemId,
  projectId,
  onBack,
  onProblemUpdated,
  onProjectUpdated,
  setActiveTab,
  onOpenProfile
}) {
  const { currentUser } = useAuth();

  const [activeTab, setActiveSubTab] = useState('overview'); // 'overview', 'updates', 'team', 'expenses'
  const [problem, setProblem] = useState(null);
  const [project, setProject] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleCitizenClick = (name) => {
    if (!onOpenProfile) return;
    const citizenName = name || problem?.reportedByName || 'Rahul Mishra';
    onOpenProfile({
      type: 'citizen',
      name: citizenName,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      location: `${problem?.location?.city || 'Ranchi'}, Jharkhand`,
      email: `${citizenName.toLowerCase().replace(/\s+/g, '')}@awaazgram.org`,
      phone: '+91 98765 43210',
      submittedCount: 3,
      solvedCount: 2,
      rating: '4.9 ★',
      bio: 'Active civic community reporter leading ground documentation and tracking municipal solution delivery.'
    });
  };

  const handleUniversityClick = (uniName) => {
    if (!onOpenProfile) return;
    const institution = uniName || project?.universityName || 'MANIT Bhopal Innovation Hub';
    onOpenProfile({
      type: 'university',
      name: institution,
      avatar: 'https://images.unsplash.com/photo-1562774053-701939374585?w=150',
      institution: institution,
      location: 'Bhopal, Madhya Pradesh',
      email: 'innovations@manit.ac.in',
      phone: '+91 755 4051000',
      rank: 1,
      completedProjectsCount: 32,
      score: '9,850 pts',
      rating: '4.9 ★',
      bio: 'National premier engineering and civic innovation center deploying student-designed municipal IoT and infrastructure hardware.'
    });
  };

  const handleStudentClick = (studentName, role, department, customAvatar) => {
    if (!onOpenProfile) return;
    const name = studentName || (isSolved ? 'Aakash Deshmukh' : 'Rohan Nair');
    onOpenProfile({
      type: 'student',
      name: name,
      avatar: customAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      institution: project?.universityName || (isSolved ? 'BIT Mesra Innovation Cell' : 'MANIT Bhopal Innovation Hub'),
      department: department || 'Department of Electrical & IoT Engineering',
      year: 'Final Year (4th Year, B.Tech)',
      roleInTeam: role || 'Student Engineer',
      email: `${name.toLowerCase().replace(/\s+/g, '')}@student.ac.in`,
      phone: '+91 98123 45678',
      solvedCount: isSolved ? 3 : 2,
      teamSize: 5,
      skills: ['IoT & LoRa Telemetry', 'LiFePO4 Solar Systems', 'Hardware Assembly', 'Rapid Prototyping', 'C++ / MicroPython'],
      bio: 'Student innovator passionate about building low-cost, resilient civic hardware systems for rural and urban local bodies.'
    });
  };

  useEffect(() => {
    fetchData();
  }, [problemId, projectId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (projectId) {
        const res = await api.getProjectById(projectId);
        if (res.success && res.data) {
          setProject(res.data);
          setProblem(res.data.problem || null);
          setExpenses(res.data.expenses || []);
          if (res.data.problemId && !res.data.problem) {
            const probRes = await api.getProblemById(res.data.problemId);
            if (probRes.success && probRes.data) setProblem(probRes.data);
          }
        }
      } else if (problemId) {
        const probRes = await api.getProblemById(problemId);
        if (probRes.success && probRes.data) {
          const currentProb = probRes.data;
          setProblem(currentProb);
          
          let targetProjId = currentProb.projectId;
          if (!targetProjId) {
            if (currentProb.status === 'solved' || currentProb.id === 'ag1008') targetProjId = 'proj-202';
            else if (currentProb.status === 'in_progress' || currentProb.id === 'ag1001') targetProjId = 'proj-201';
          }

          if (targetProjId) {
            const projRes = await api.getProjectById(targetProjId);
            if (projRes.success && projRes.data) {
              setProject(projRes.data);
              setExpenses(projRes.data.expenses || []);
            }
          }
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getTimelineSteps = () => {
    const status = problem?.status || (project ? project.status : 'pending_verification');
    const isSolved = status === 'solved';
    const isInProgress = status === 'in_progress' || status === 'testing';
    const isVerified = status === 'verified';
    const isPending = status === 'pending_verification' || status === 'pending';

    const reportedDate = problem?.reportedAt ? new Date(problem.reportedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '10 May 2026';
    const reporterName = problem?.reportedByName || (typeof problem?.reportedBy === 'string' ? problem.reportedBy : problem?.reportedBy?.name) || 'Citizen';
    const aiCategory = problem?.aiAnalysis?.category || problem?.category || 'Civic Infrastructure';
    const verifiedOfficer = problem?.verification?.verifiedBy || 'Anita Sharma (Gov Officer)';
    const teamName = project?.teamName || 'University Innovation Team';

    return [
      {
        title: 'Problem Submitted by Citizen',
        date: reportedDate,
        by: `Reported by ${reporterName}`,
        status: 'completed',
        desc: 'Citizen filed grievance with verified geotagged location and image proof.'
      },
      {
        title: 'Gemini AI Civic Diagnosis',
        date: 'Instant AI Evaluation',
        by: 'Google Gemini Engine',
        status: 'completed',
        desc: `AI Categorized as "${aiCategory}" • Feasibility: ${problem?.aiAnalysis?.feasibilityScore || 92}/100 • Priority: ${problem?.aiAnalysis?.urgency || 'High'}`
      },
      {
        title: isPending ? 'Government Review & Verification' : 'Verified by Municipal Authority',
        date: isPending ? 'Awaiting Municipal Officer' : (problem?.verification?.verifiedAt ? new Date(problem.verification.verifiedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Sanctioned'),
        by: isPending ? 'Pending Govt Approval' : verifiedOfficer,
        status: isPending ? 'current' : 'completed',
        desc: isPending
          ? 'Problem is in Government queue. Municipal Officer must verify on ground and sanction grant in Government Portal.'
          : `Municipal grant authorized. Allocated Budget: ${problem?.verification?.allocatedBudget ? `₹${problem.verification.allocatedBudget.toLocaleString('en-IN')}` : (problem?.aiAnalysis?.estimatedBudget || '₹1,20,000')}.`
      },
      {
        title: (isPending || isVerified)
          ? (problem?.adoptionRequest?.status === 'pending_approval' ? `Adoption Proposal Submitted by ${problem.adoptionRequest.teamName}` : 'University Project Marketplace')
          : 'Adopted by Student Engineering Team',
        date: (isPending || isVerified)
          ? (problem?.adoptionRequest?.status === 'pending_approval' ? 'Awaiting Govt Sanction' : 'Open in Marketplace')
          : (project?.startedAt ? new Date(project.startedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Assigned'),
        by: (isPending || isVerified)
          ? (problem?.adoptionRequest?.status === 'pending_approval' ? `${problem.adoptionRequest.universityName || 'University Team'}` : 'College Innovation Cells')
          : teamName,
        status: isPending ? 'upcoming' : (isVerified ? (problem?.adoptionRequest?.status === 'pending_approval' ? 'current' : 'current') : 'completed'),
        desc: isPending
          ? 'Locked until Government approves this issue.'
          : (problem?.adoptionRequest?.status === 'pending_approval')
          ? `Team ${problem.adoptionRequest.teamName} submitted an adoption proposal. Awaiting Municipal Officer grant approval in Government Portal.`
          : isVerified
          ? 'Approved by Government! University engineering teams can now submit an adoption proposal in Opportunities.'
          : `Adopted by ${teamName}. Student team building hardware prototype.`
      },
      {
        title: 'Prototyping & Field Deployment',
        date: (isPending || isVerified) ? 'Upcoming Phase' : (isSolved ? 'Completed' : 'Current Active Phase'),
        by: (isPending || isVerified) ? 'University Students' : teamName,
        status: (isPending || isVerified) ? 'upcoming' : (isInProgress ? 'current' : (isSolved ? 'completed' : 'upcoming')),
        desc: isInProgress
          ? `Students are fabricating and deploying on-site hardware solution (${project?.progressPercentage || 65}% progress).`
          : isSolved
          ? 'Hardware successfully deployed, tested, and validated on ground.'
          : 'Pending team adoption and lab fabrication.'
      },
      {
        title: isSolved ? 'Problem Solved & Handed Over' : 'Expected Final Handover',
        date: isSolved ? 'Resolved on Ground' : 'Target Milestone',
        by: 'Citizen & Govt Validation',
        status: isSolved ? 'completed' : 'upcoming',
        desc: isSolved
          ? '100% verified solution active. Citizen feedback verified.'
          : 'Community feedback, inspection, and public sign-off.'
      }
    ];
  };

  const timelineSteps = getTimelineSteps();

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-400">
        <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <p className="text-xs">Loading public tracking data...</p>
      </div>
    );
  }

  const title = problem?.title || project?.title || 'Broken Street Light';
  const idCode = problem?.id?.toUpperCase() || 'AG1001';
  const locationText = problem?.location?.address || 'Ward 12, Bhopal';

  const isSolved = problem?.status === 'solved' || project?.status === 'solved';
  const isInProgress = problem?.status === 'in_progress' || project?.status === 'in_progress';
  const isVerified = problem?.status === 'verified';
  const isPending = problem?.status === 'pending_verification' || problem?.status === 'pending';

  const completedStepsCount = timelineSteps.filter(s => s.status === 'completed').length;
  const activeStepIdx = timelineSteps.findIndex(s => s.status === 'current');
  const activeStepNum = activeStepIdx !== -1 ? activeStepIdx + 1 : (isSolved ? 6 : completedStepsCount + 1);

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16 text-slate-800 animate-fadeIn">
      
      {/* Top Breadcrumb & Navigation */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-emerald-700 transition group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Track Issues Catalogue</span>
        </button>

        <div className="text-[11px] text-slate-400 font-medium">
          Home / Track Issues / <span className="text-emerald-700 font-bold">#{idCode}</span>
        </div>
      </div>

      {/* Main Container Card (Exact Mockup Panel 10 Reference) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        
        {/* Top Header */}
        <div className="p-6 sm:p-8 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-b from-slate-50/50 to-white">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading">
                {title}
              </h1>
              <span className={`px-3 py-1 rounded-full border text-xs font-bold flex items-center gap-1.5 ${
                isSolved
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : isInProgress
                  ? 'bg-blue-50 text-blue-800 border-blue-200'
                  : isVerified
                  ? 'bg-purple-50 text-purple-800 border-purple-200'
                  : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}>
                <span className={`w-2 h-2 rounded-full ${isSolved ? 'bg-emerald-500' : isInProgress ? 'bg-blue-500 animate-pulse' : isVerified ? 'bg-purple-500' : 'bg-amber-500'}`} />
                <span>{isSolved ? 'Solved' : isInProgress ? 'In Progress' : isVerified ? 'Verified (Open for Adoption)' : 'Under Review'}</span>
              </span>
            </div>
            <p className="text-xs text-slate-500">
              #{idCode} • {locationText} • Category: <span className="font-semibold text-slate-700">{problem?.category || 'Civic Infrastructure'}</span>
            </p>
          </div>

          {/* Sub-tabs: Overview, Updates, Team, Expenses (Products) */}
          <div className="flex bg-slate-100 p-1 rounded-2xl text-xs font-bold">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'updates', label: 'Updates' },
              { id: 'team', label: 'Team' },
              { id: 'expenses', label: 'Expenses / Products' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl capitalize transition cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-white text-emerald-800 shadow-xs font-extrabold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* TAB 1: OVERVIEW (Matching Mockup Panel 10 Exactly) */}
        {activeTab === 'overview' && (
          <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-8">
            
            {/* Left Column: Vertical Step Timeline (Panel 10) */}
            <div className="md:col-span-7 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 font-heading">
                  Lifecycle Progress Timeline
                </h3>
                <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Step {activeStepNum} of 6 Active
                </span>
              </div>

              <div className="space-y-4 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {timelineSteps.map((step, idx) => {
                  const isCompleted = step.status === 'completed';
                  const isCurrent = step.status === 'current';

                  return (
                    <div key={idx} className="relative pl-8 group">
                      
                      {/* Circle Pin */}
                      <div
                        className={`absolute left-0 top-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition ${
                          isCompleted
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : isCurrent
                            ? 'bg-blue-600 text-white ring-4 ring-blue-100 animate-pulse'
                            : 'bg-slate-200 text-slate-500'
                        }`}
                      >
                        {isCompleted ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : idx + 1}
                      </div>

                      <div className="bg-slate-50/70 border border-slate-200/80 p-3.5 rounded-2xl space-y-1 hover:bg-slate-50 transition">
                        <div className="flex items-center justify-between gap-2">
                          <div className="text-xs font-bold text-slate-900">{step.title}</div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            isCompleted
                              ? 'bg-emerald-100 text-emerald-800'
                              : isCurrent
                              ? 'bg-blue-100 text-blue-800 animate-pulse'
                              : 'bg-slate-100 text-slate-500'
                          }`}>
                            {isCompleted ? 'Done' : isCurrent ? 'Active' : 'Pending'}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500">{step.by} • {step.date}</div>
                        {step.desc && (
                          <div className="text-[11px] text-slate-600 pt-0.5 leading-relaxed font-normal">
                            {step.desc}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* AI Diagnostic Appraisal Box */}
              {problem?.aiAnalysis && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Gemini AI Engineering Summary</span>
                    </span>
                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100/70 px-2 py-0.5 rounded-full">
                      Score: {problem.aiAnalysis.impactScore || 85}/100
                    </span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    {problem.aiAnalysis.summary || 'Engineering diagnosis recommending smart IoT auto-dimming LED luminaire and battery backup.'}
                  </p>
                </div>
              )}

            </div>

            {/* Right Column: Location Photo & Map (Panel 10) */}
            <div className="md:col-span-5 space-y-4">
              
              {/* Site Photo or No Photo Placeholder */}
              {problem?.images && problem.images.length > 0 && problem.images[0] ? (
                <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm relative group">
                  <img
                    src={problem.images[0]}
                    alt="Site"
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-1 rounded-lg">
                    📍 Verified Ground Photo Evidence
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100 h-44 flex flex-col items-center justify-center text-slate-400 gap-1.5 p-4 text-center">
                  <CameraOff className="w-7 h-7 text-slate-400 stroke-[1.5]" />
                  <div className="text-xs font-bold text-slate-600">No Photo Uploaded</div>
                  <div className="text-[10px] text-slate-400">Grievance verified through GPS coordinates & ground description</div>
                </div>
              )}

              {/* Map Card */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-center space-y-2 shadow-xs">
                <div className="w-9 h-9 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-xs">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Verified Ground Location</div>
                  <div className="text-[11px] text-slate-600 font-mono mt-0.5">{locationText}</div>
                </div>
                <div className="pt-1">
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(locationText)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:underline"
                  >
                    <span>Open in Google Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Quick Status Stats */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                {(project || isSolved || isInProgress) ? (
                  <div
                    onClick={() => handleUniversityClick(project?.universityName || (isSolved ? 'BIT Mesra Innovation Cell' : 'MANIT Bhopal'))}
                    className="bg-emerald-50/60 hover:bg-emerald-100/80 border border-emerald-100 p-3 rounded-2xl cursor-pointer transition group/team"
                    title="Click to view University Contributor Profile"
                  >
                    <div className="text-[10px] text-slate-500 font-bold uppercase">Assigned Team</div>
                    <div className="font-bold text-emerald-900 mt-0.5 group-hover/team:underline decoration-emerald-400">
                      {project?.teamName || (isSolved ? 'BIT Mesra Hydro Lab' : 'MANIT Innovation Hub')} ↗
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl">
                    <div className="text-[10px] text-slate-500 font-bold uppercase">Assigned Team</div>
                    <div className="font-bold text-slate-700 mt-0.5">
                      {isVerified ? 'Open for University Adoption' : 'Awaiting Govt Approval'}
                    </div>
                  </div>
                )}

                <div className="bg-blue-50/60 border border-blue-100 p-3 rounded-2xl">
                  <div className="text-[10px] text-slate-500 font-bold uppercase">Grant / CSR Budget</div>
                  <div className="font-bold text-blue-900 mt-0.5">
                    {problem?.industryPledges && problem.industryPledges.length > 0
                      ? `₹${((problem.verification?.allocatedBudget || 120000) + problem.industryPledges.reduce((s, p) => s + (Number(p.amount) || 0), 0)).toLocaleString('en-IN')} (Govt + CSR Co-Funded)`
                      : problem?.verification?.allocatedBudget
                      ? `₹${problem.verification.allocatedBudget.toLocaleString('en-IN')} (Sanctioned)`
                      : isSolved
                      ? `₹1,90,000 (Sanctioned)`
                      : (problem?.aiAnalysis?.estimatedBudget || 'Est. ₹1,20,000')}
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: FIELD UPDATES */}
        {activeTab === 'updates' && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900 font-heading">Field Engineering & Deployment Logs</h3>
                <p className="text-xs text-slate-500">Chronological verification reports submitted by citizens, authorities, and student engineers.</p>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                ● {(project || isSolved || isInProgress) ? '3 Verified Updates' : (isVerified ? '3 Verification Milestones' : '2 Initial AI Logs')}
              </span>
            </div>

            <div className="space-y-4">
              {(() => {
                const logs = [];

                if (problem?.industryPledges && problem.industryPledges.length > 0) {
                  problem.industryPledges.forEach((pledge, idx) => {
                    logs.push({
                      id: `log-csr-${idx}`,
                      date: pledge.date ? new Date(pledge.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Today',
                      author: pledge.partner || 'Tata Steel CSR Trust',
                      role: 'Corporate CSR Partner',
                      title: `₹${(pledge.amount || 75000).toLocaleString('en-IN')} CSR Co-Funding Grant Disbursed`,
                      desc: `CSR matching grant approved and routed through Jharkhand Government Treasury Escrow to university innovation lab for hardware procurement and rapid prototyping.`,
                      photo: null
                    });
                  });
                }

                if (project || isSolved || isInProgress) {
                  logs.push({
                    id: 'log-proj',
                    date: project?.startedAt ? new Date(project.startedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : (isSolved ? '01 Jul 2026' : '15 May 2026'),
                    author: project?.facultyMentor || (isSolved ? 'Prof. Arvind Rao' : 'Prof. Kumar'),
                    role: `Faculty Mentor (${project?.universityName || (isSolved ? 'BIT Mesra Innovation Cell' : 'MANIT Bhopal')})`,
                    title: isSolved ? 'Multi-Stage Filtration & Water Quality Commissioned' : 'Component Procurement Completed & Bench Testing Passed',
                    desc: isSolved
                      ? '5000L daily pure drinking water output validated. Water quality lab test passed all IS 10500 potable water parameters.'
                      : `Team ${project?.teamName || 'Innovation Cell'} received hardware components from certified vendors and passed 48-hour thermal stress and lab diagnostics.`,
                    photo: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600'
                  });
                }

                if (isVerified || project || isSolved || isInProgress) {
                  logs.push({
                    id: 'log-govt',
                    date: problem?.verification?.verifiedAt ? new Date(problem.verification.verifiedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '12 May 2026',
                    author: problem?.verification?.verifiedBy || 'Anita Sharma',
                    role: 'Municipal Verification Officer',
                    title: 'On-Site Ground Verification & Municipal Grant Sanctioned',
                    desc: `Inspected site at ${locationText}. Authorized municipal grant allocation of ₹${(problem?.verification?.allocatedBudget || (isSolved ? 190000 : 180000)).toLocaleString('en-IN')} for university engineering deployment.`,
                    photo: null
                  });
                } else {
                  logs.push({
                    id: 'log-pending-govt',
                    date: 'Currently Pending',
                    author: 'Municipal Inspection Division',
                    role: 'Government Authority Queue',
                    title: 'Awaiting Municipal Officer Ground Verification',
                    desc: `Grievance is queued for official on-site inspection in Government Portal. Municipal clearance is required before university student teams can adopt and claim budget grant.`,
                    photo: null
                  });
                }

                logs.push({
                  id: 'log-ai',
                  date: problem?.reportedAt ? new Date(problem.reportedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Instant Automated Diagnosis',
                  author: 'Google Gemini 2.0 Civic Engine',
                  role: 'AI Diagnostic Protocol',
                  title: `AI Civic Assessment: ${problem?.aiAnalysis?.urgency || 'High'} Urgency Verified`,
                  desc: problem?.aiAnalysis?.summary || `Automated technical appraisal: Feasibility score ${problem?.aiAnalysis?.feasibilityScore || 90}/100. Recommended for rapid student engineering prototyping.`,
                  photo: null
                });

                logs.push({
                  id: 'log-citizen',
                  date: problem?.reportedAt ? new Date(problem.reportedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Submission Date',
                  author: problem?.reportedByName || (typeof problem?.reportedBy === 'string' ? problem.reportedBy : problem?.reportedBy?.name) || 'Citizen Reporter',
                  role: 'Citizen Reporter',
                  title: 'Civic Grievance Submitted with Geotagged Photo Proof',
                  desc: `Public report logged for "${title}" at ${locationText}. Tracked on transparent public ledger.`,
                  photo: problem?.images?.[0] || null
                });

                return logs.map(up => {
                  const isCitizen = up.role.toLowerCase().includes('citizen');
                  const isUni = up.role.toLowerCase().includes('faculty') || up.role.toLowerCase().includes('mentor');
                  return (
                    <div key={up.id} className="bg-slate-50/80 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-slate-200/70">
                        <div
                          onClick={() => {
                            if (isCitizen) handleCitizenClick(up.author);
                            else if (isUni) handleUniversityClick(project?.universityName || (isSolved ? 'BIT Mesra Innovation Cell' : 'MANIT Bhopal'));
                          }}
                          className={`flex items-center gap-2 ${isCitizen || isUni ? 'cursor-pointer group/auth' : ''}`}
                          title={isCitizen ? 'View Citizen Profile' : isUni ? 'View University Profile' : 'Institutional Official'}
                        >
                          <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                            {up.author[0]}
                          </div>
                          <div>
                            <span className={`font-bold text-xs text-slate-900 ${isCitizen || isUni ? 'group-hover/auth:text-emerald-700 underline decoration-emerald-300' : ''}`}>
                              {up.author} {isCitizen || isUni ? '↗' : ''}
                            </span>
                            <span className="text-[10px] text-slate-400 ml-2">({up.role})</span>
                          </div>
                        </div>
                        <span className="text-[11px] text-slate-400 font-medium">{up.date}</span>
                      </div>

                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900">{up.title}</h4>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">{up.desc}</p>
                      </div>

                      {up.photo && (
                        <div className="pt-1">
                          <img src={up.photo} alt="Proof" className="w-44 h-28 rounded-xl object-cover border border-slate-200 shadow-xs" />
                        </div>
                      )}
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        )}

        {/* TAB 3: TEAM & COLLABORATORS */}
        {activeTab === 'team' && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 font-heading">Quad-Helix Collaboration Stakeholders</h3>
              <p className="text-xs text-slate-500">The 4-pillar partnership (Citizen ➔ Government ➔ University ➔ Industry) driving ground resolution.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              
              {/* Pillar 1: Citizen Contributor */}
              <div
                onClick={() => handleCitizenClick(problem?.reportedByName || 'Rahul Mishra')}
                className="bg-slate-50 hover:bg-emerald-50/70 border border-slate-200 hover:border-emerald-300 rounded-2xl p-4 space-y-2 cursor-pointer transition group/card shadow-xs"
                title="Click to view Citizen Contributor Profile"
              >
                <div className="flex items-center gap-3">
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150" alt="Citizen" className="w-12 h-12 rounded-full object-cover ring-2 ring-emerald-500/30" />
                  <div>
                    <div className="text-xs font-bold text-slate-900 group-hover/card:text-emerald-800 flex items-center gap-1">
                      <span>{problem?.reportedByName || (typeof problem?.reportedBy === 'string' ? problem.reportedBy : problem?.reportedBy?.name) || 'Citizen Reporter'}</span>
                      <span className="text-[10px] text-emerald-600">↗</span>
                    </div>
                    <div className="text-[10px] text-emerald-700 font-semibold">Citizen Grievance Originator</div>
                    <div className="text-[10px] text-slate-400">{locationText}</div>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 pt-1">Identified problem, submitted geotagged proof, and validates solution quality.</p>
                <div className="text-[10px] font-bold text-emerald-700 pt-1">View Citizen Profile →</div>
              </div>

              {/* Pillar 2: Government Authority */}
              <div className={`rounded-2xl p-4 space-y-2 border ${isVerified || project || isSolved || isInProgress ? 'bg-slate-50 border-slate-200' : 'bg-amber-50/40 border-amber-200'}`}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm ring-2 ring-blue-500/30">
                    🏛️
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">
                      {problem?.verification?.verifiedBy || (isVerified || isSolved || isInProgress ? 'Anita Sharma' : 'Awaiting Municipal Officer')}
                    </div>
                    <div className="text-[10px] text-blue-700 font-semibold">Government Authority</div>
                    <div className="text-[10px] text-slate-400">Municipal Corporation</div>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 pt-1">
                  {isVerified || project || isSolved || isInProgress
                    ? `Sanctioned ₹${(problem?.verification?.allocatedBudget || (isSolved ? 190000 : 180000)).toLocaleString('en-IN')} municipal innovation grant.`
                    : 'Problem is in official municipal queue. Officer inspection required to sanction grant.'}
                </p>
                <div className={`text-[10px] font-bold ${isVerified || project || isSolved || isInProgress ? 'text-emerald-700' : 'text-amber-700'} pt-1`}>
                  {isVerified || project || isSolved || isInProgress ? '✓ Verified & Sanctioned' : '● Verification Pending'}
                </div>
              </div>

              {/* Pillar 3: University Engineering Team */}
              {(project || isSolved || isInProgress) ? (
                <>
                  <div
                    onClick={() => handleUniversityClick(project?.universityName || (isSolved ? 'BIT Mesra Innovation Cell' : 'MANIT Bhopal Innovation Hub'))}
                    className="bg-slate-50 hover:bg-emerald-50/70 border border-slate-200 hover:border-emerald-300 rounded-2xl p-4 space-y-2 cursor-pointer transition group/card shadow-xs"
                    title="Click to view University Contributor Profile"
                  >
                    <div className="flex items-center gap-3">
                      <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150" alt="Prof" className="w-12 h-12 rounded-full object-cover ring-2 ring-emerald-500/30" />
                      <div>
                        <div className="text-xs font-bold text-slate-900 group-hover/card:text-emerald-800 flex items-center gap-1">
                          <span>{project?.facultyMentor || (isSolved ? 'Prof. Arvind Rao' : 'Prof. Kumar')}</span>
                          <span className="text-[10px] text-emerald-600">↗</span>
                        </div>
                        <div className="text-[10px] text-emerald-700 font-semibold">Faculty Mentor</div>
                        <div className="text-[10px] text-slate-400">{project?.universityName || (isSolved ? 'BIT Mesra Innovation Cell' : 'MANIT Bhopal')}</div>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-500 pt-1">{isSolved ? 'Supervised engineering architecture, sensor calibration, and municipal handover.' : 'Oversees engineering architecture, lab testing protocols, and safety compliance.'}</p>
                    <div className="text-[10px] font-bold text-emerald-700 pt-1">View University Profile →</div>
                  </div>

                  <div
                    onClick={() => handleStudentClick(project?.studentLead || project?.teamLeader || (isSolved ? 'Aakash Deshmukh' : 'Rohan Nair'), 'Student Lead')}
                    className="bg-slate-50 hover:bg-indigo-50/70 border border-slate-200 hover:border-indigo-300 rounded-2xl p-4 space-y-2 cursor-pointer transition group/card shadow-xs"
                    title="Click to view Student Contributor Profile"
                  >
                    <div className="flex items-center gap-3">
                      <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150" alt="Student Lead" className="w-12 h-12 rounded-full object-cover ring-2 ring-indigo-500/30" />
                      <div>
                        <div className="text-xs font-bold text-slate-900 group-hover/card:text-indigo-800 flex items-center gap-1">
                          <span>{project?.studentLead || project?.teamLeader || (isSolved ? 'Aakash Deshmukh' : 'Rohan Nair')}</span>
                          <span className="text-[10px] text-indigo-600">↗</span>
                        </div>
                        <div className="text-[10px] text-indigo-700 font-semibold">Student Lead ({project?.teamName || (isSolved ? 'Team Jaltarang Hydro Lab' : 'Engineering Team')})</div>
                        <div className="text-[10px] text-slate-400">Campus Innovation Cell</div>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-500 pt-1">{isSolved ? 'Led hardware fabrication, automation integration, and 100% successful ground deployment.' : 'Leads student hardware fabrication, firmware assembly, and field testing.'}</p>
                    <div className="text-[10px] font-bold text-indigo-700 pt-1">View Student Profile →</div>
                  </div>
                </>
              ) : (
                <div className="bg-slate-50 border border-dashed border-slate-300 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm">
                      🎓
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">
                        {isVerified ? 'Open in University Opportunities' : 'Awaiting Govt Approval'}
                      </div>
                      <div className="text-[10px] text-purple-700 font-semibold">University Innovation Hubs</div>
                      <div className="text-[10px] text-slate-400">NITs / IITs / Engineering Colleges</div>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500 pt-1">
                    {isVerified
                      ? 'Approved by Municipal Authority! Student engineering teams can now adopt this project in the Opportunities marketplace.'
                      : 'Locked for students until Government officers approve on-site feasibility.'}
                  </p>
                  <div className="text-[10px] font-bold text-slate-400 pt-1">
                    {isVerified ? '🚀 Ready for Adoption' : '🔒 Adoption Locked'}
                  </div>
                </div>
              )}

              {/* Pillar 4: Industry / CSR Partner */}
              {(() => {
                const latestPledge = problem?.industryPledges && problem.industryPledges.length > 0
                  ? problem.industryPledges[problem.industryPledges.length - 1]
                  : null;
                const hasPledge = Boolean(latestPledge);

                return (
                  <div className={`border rounded-2xl p-4 space-y-2 transition ${hasPledge ? 'bg-amber-50/60 border-amber-300 shadow-xs' : 'bg-slate-50 border-slate-200 opacity-90'}`}>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm ring-2 ring-amber-400/40">
                        🏢
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">
                          {hasPledge ? latestPledge.partner : (project || isSolved || isInProgress) ? 'Amit Verma (CSR Lead)' : 'Corporate CSR Partner'}
                        </div>
                        <div className="text-[10px] text-amber-700 font-semibold">Industry & CSR Sponsorship</div>
                        <div className="text-[10px] text-slate-500">
                          {hasPledge ? `${latestPledge.partner} • ₹${(latestPledge.amount || 75000).toLocaleString('en-IN')} Co-Funded` : (project || isSolved || isInProgress) ? 'Tata Sustainability CSR' : 'Eligible for CSR Matching Grant'}
                        </div>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-600 pt-1">
                      {hasPledge
                        ? `Co-funded ₹${(latestPledge.amount || 75000).toLocaleString('en-IN')} through Government Treasury Escrow for component acceleration and prototyping.`
                        : (project || isSolved || isInProgress)
                        ? 'Provided technical review and ₹75,000 grant for hardware and component acceleration.'
                        : 'Provides corporate sponsorship and component matching grants once university project starts.'}
                    </p>
                    <div className={`text-[10px] font-bold ${hasPledge ? 'text-emerald-700' : 'text-slate-400'} pt-1`}>
                      {hasPledge ? '✓ CSR Escrow Grant Disbursed' : 'Corporate CSR Partner'}
                    </div>
                  </div>
                );
              })()}

            </div>

            {/* Student Engineering Squad & Team Members Grid */}
            {(project || isSolved || isInProgress) && (() => {
              const studentMembers = (project?.teamMembers && project.teamMembers.length > 0)
                ? project.teamMembers.map((name, i) => {
                    const roles = ['IoT Firmware & LoRa Engineer', 'Hardware Assembly & BMS Specialist', 'Structural & CAD Design Lead', 'Sensors & Quality Testing Lead', 'Field Deployment Coordinator'];
                    const depts = ['Dept of Electrical & IoT Engineering', 'Dept of Electronics & Telecomm', 'Dept of Civil & Structural Engineering', 'Dept of Computer Science', 'Dept of Mechanical Engineering'];
                    const avatars = [
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
                      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
                      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
                      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
                      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'
                    ];
                    return {
                      name,
                      role: roles[i % roles.length],
                      dept: depts[i % depts.length],
                      avatar: avatars[i % avatars.length]
                    };
                  })
                : [
                    { name: 'Tanvi Joshi', role: 'IoT Firmware & LoRa Engineer', dept: 'Dept of Electronics & Telecomm', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
                    { name: 'Rahul Patil', role: 'Hardware Assembly & BMS Specialist', dept: 'Dept of Electrical Engineering', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150' },
                    { name: 'Sneha Rao', role: 'Structural & CAD Design Lead', dept: 'Dept of Civil & Structural Engineering', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150' },
                    { name: 'Karan Singh', role: 'Sensors & Quality Testing Lead', dept: 'Dept of Computer Science & IoT', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' }
                  ];

              return (
                <div className="pt-6 border-t border-slate-200/80 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 font-heading flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-indigo-600" />
                        <span>Student Engineering Deployment Squad ({studentMembers.length} Members)</span>
                      </h4>
                      <p className="text-[11px] text-slate-500">Student team members fabricating hardware, coding firmware, and executing field trials.</p>
                    </div>
                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      ● Active College Contributors
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {studentMembers.map((member, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleStudentClick(member.name, member.role, member.dept, member.avatar)}
                        className="bg-white hover:bg-emerald-50/70 border border-slate-200 hover:border-emerald-300 p-3.5 rounded-2xl cursor-pointer transition shadow-xs group/member space-y-2"
                        title={`Click to view ${member.name}'s Contributor Profile`}
                      >
                        <div className="flex items-center gap-2.5">
                          <img src={member.avatar} alt={member.name} className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-100 group-hover/member:ring-emerald-400 transition shrink-0" />
                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-bold text-slate-900 truncate group-hover/member:text-emerald-800 flex items-center justify-between">
                              <span className="truncate">{member.name}</span>
                              <span className="text-[10px] text-emerald-600 shrink-0 ml-1">↗</span>
                            </div>
                            <div className="text-[10px] text-emerald-700 font-semibold truncate">{member.role}</div>
                          </div>
                        </div>
                        <div className="text-[10px] text-slate-400 truncate pt-0.5">{member.dept}</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

          </div>
        )}

        {/* TAB 4: EXPENSES & PRODUCTS LIST (Procured Products & Hardware) */}
        {activeTab === 'expenses' && (() => {
          const hasActiveProject = project || isSolved || isInProgress;
          const displayExpenses = (expenses && expenses.length > 0)
            ? expenses
            : hasActiveProject
            ? (isSolved ? [
                { item: "Commercial Multi-Stage RO Membrane System", category: "Filtration Units", qty: "1 unit", vendor: "AquaPure Industrial", amount: 75000, url: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600" },
                { item: "RFID Smart Card Reader & Microcontroller Kit", category: "Dispenser Automation", qty: "2 units", vendor: "Robu.in Electronics", amount: 32000, url: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600" },
                { item: "3kW Solar Inverter & Heavy-duty Structure", category: "Solar Power Hub", qty: "1 unit", vendor: "Waaree Solar Technologies", amount: 55000, url: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600" },
                { item: "Stainless Steel Storage Tank & Plumbing", category: "Plumbing & Housing", qty: "1 unit", vendor: "SteelFab Corporation", amount: 20000, url: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600" }
              ] : [
                { item: "12x High-Efficiency 60W LED Luminaires", category: "Hardware & Electronics", qty: "12 units", vendor: "Havells India Industrial", amount: 48000, url: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600" },
                { item: "4x 100Ah LiFePO4 Solar Battery Packs & BMS", category: "Batteries & Power", qty: "4 units", vendor: "Exide Energy Solutions", amount: 62000, url: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600" },
                { item: "LoRaWAN Gateway & Pole Sensor Nodes", category: "IoT & Telemetry", qty: "1 kit", vendor: "Robu.in Electronics", amount: 24500, url: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600" },
                { item: "Mounting Brackets & Weatherproof Enclosures", category: "Fabrication & Mounting", qty: "12 units", vendor: "City Metal Fabricators", amount: 21400, url: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600" }
              ])
            : [];

          const totalAllocated = project?.allocatedBudget || (isSolved ? 190000 : 180000);
          const totalUtilized = displayExpenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

          return (
            <div className="p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 font-heading">Procured Products & Hardware Bill of Materials</h3>
                  <p className="text-xs text-slate-500">100% transparent public ledger of all components, materials, and field expenses.</p>
                </div>

                {hasActiveProject && displayExpenses.length > 0 && (
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-extrabold text-slate-900 bg-slate-100 px-3 py-1.5 rounded-xl">
                      Total Budget: ₹{totalAllocated.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                      Total Utilized: ₹{totalUtilized.toLocaleString('en-IN')}
                    </span>
                  </div>
                )}
              </div>

              {hasActiveProject && displayExpenses.length > 0 ? (
                <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-3.5 pl-4">Product / Component Description</th>
                        <th className="p-3.5">Category</th>
                        <th className="p-3.5 text-center">Qty</th>
                        <th className="p-3.5">Vendor</th>
                        <th className="p-3.5 font-bold">Total (₹)</th>
                        <th className="p-3.5 pr-4 text-center">Receipt Proof</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {displayExpenses.map((prod, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 transition">
                          <td className="p-3.5 pl-4">
                            <div className="font-bold text-slate-900">{prod.item || prod.title || prod.description || 'Hardware Component'}</div>
                            <div className="text-[10px] text-slate-400">Verified audited spec</div>
                          </td>
                          <td className="p-3.5">
                            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold border border-slate-200">
                              {prod.cat || prod.category || 'Hardware'}
                            </span>
                          </td>
                          <td className="p-3.5 text-center font-bold text-slate-800">
                            {prod.qty || '1 unit'}
                          </td>
                          <td className="p-3.5 text-slate-700 font-semibold">
                            {prod.vendor || 'Authorized Supplier'}
                          </td>
                          <td className="p-3.5 font-extrabold text-emerald-800 text-xs sm:text-sm">
                            ₹{(prod.amount || 0).toLocaleString('en-IN')}
                          </td>
                          <td className="p-3.5 pr-4 text-center">
                            <a
                              href={prod.url || prod.invoiceUrl || "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600"}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-[11px] font-bold transition border border-emerald-200"
                            >
                              <span>Invoice</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 px-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
                    <Receipt className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 font-heading">
                      {isPending ? 'No Expenses Incurred (Awaiting Government Verification)' : isVerified ? 'Awaiting University Team Adoption' : 'No Expenses Logged Yet'}
                    </h4>
                    <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 leading-relaxed">
                      {isPending
                        ? 'This problem is in the Municipal review queue. Once approved and adopted by a University Engineering Team, all component invoices, vendor receipts, and hardware bills of materials (BOM) will be transparently audited here.'
                        : 'Government has approved this problem! As soon as a student innovation team adopts this challenge and begins component procurement, live invoices and hardware BOM will be published here.'}
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-50 px-3.5 py-1.5 rounded-xl border border-emerald-200 mt-2">
                    <span>Estimated Grant Allocation:</span>
                    <span className="font-extrabold">{problem?.aiAnalysis?.estimatedBudget || '₹1,20,000 - ₹1,80,000'}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })()}

      </div>

    </div>
  );
}
