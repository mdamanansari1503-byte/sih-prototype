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
  CircleDot
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

  const handleStudentClick = (studentName, role) => {
    if (!onOpenProfile) return;
    const name = studentName || 'Rohan Nair';
    onOpenProfile({
      type: 'student',
      name: name,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      institution: project?.universityName || 'MANIT Bhopal',
      department: 'Department of Electrical & IoT Engineering',
      year: 'Final Year (4th Year, B.Tech)',
      roleInTeam: role || 'Student Lead & IoT Lead',
      email: `${name.toLowerCase().replace(/\s+/g, '')}@student.manit.ac.in`,
      phone: '+91 98123 45678',
      solvedCount: 4,
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
        if (res.success) {
          setProject(res.data);
          setProblem(res.data.problem);
          setExpenses(res.data.expenses || []);
        }
      } else if (problemId) {
        const probRes = await api.getProblemById(problemId);
        if (probRes.success) {
          setProblem(probRes.data);
          if (probRes.data.projectId) {
            const projRes = await api.getProjectById(probRes.data.projectId);
            if (projRes.success) {
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
        title: (isPending || isVerified) ? 'University Project Marketplace' : 'Adopted by Student Engineering Team',
        date: (isPending || isVerified) ? 'Open in Marketplace' : (project?.startedAt ? new Date(project.startedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Assigned'),
        by: (isPending || isVerified) ? 'College Innovation Cells' : teamName,
        status: isPending ? 'upcoming' : (isVerified ? 'current' : 'completed'),
        desc: isPending
          ? 'Locked until Government approves this issue.'
          : isVerified
          ? 'Approved by Government! University engineering teams can now adopt this project in Opportunities.'
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
              
              {/* Site Photo */}
              <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm relative group">
                <img
                  src={problem?.images?.[0] || "https://images.unsplash.com/photo-1547683905-f686c993aae5?w=600"}
                  alt="Site"
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-1 rounded-lg">
                  📍 Verified Ground Photo
                </div>
              </div>

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
                <div
                  onClick={() => handleUniversityClick(project?.universityName || 'MANIT Bhopal')}
                  className="bg-emerald-50/60 hover:bg-emerald-100/80 border border-emerald-100 p-3 rounded-2xl cursor-pointer transition group/team"
                  title="Click to view University Contributor Profile"
                >
                  <div className="text-[10px] text-slate-500 font-bold uppercase">Assigned Team</div>
                  <div className="font-bold text-emerald-900 mt-0.5 group-hover/team:underline decoration-emerald-400">
                    {project?.teamName || 'MANIT Innovation Hub'} ↗
                  </div>
                </div>
                <div className="bg-blue-50/60 border border-blue-100 p-3 rounded-2xl">
                  <div className="text-[10px] text-slate-500 font-bold uppercase">Sponsor / CSR</div>
                  <div className="font-bold text-blue-900 mt-0.5">Tata CSR Grant</div>
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
                <p className="text-xs text-slate-500">Chronological verification reports submitted by student engineers & supervisors.</p>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                ● 3 Verified Updates
              </span>
            </div>

            <div className="space-y-4">
              {[
                {
                  id: 1,
                  date: '15 May 2025 • 04:30 PM',
                  author: 'Prof. Kumar',
                  role: 'Faculty Mentor (MANIT Bhopal)',
                  title: 'Component Procurement Completed & Bench Testing Passed',
                  desc: 'All 12 Smart LED fixtures and LiFePO4 battery modules were received from certified suppliers and successfully passed 48-hour continuous thermal stress and lux output tests in the electronics lab.',
                  photo: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600'
                },
                {
                  id: 2,
                  date: '12 May 2025 • 11:00 AM',
                  author: 'Anita Sharma',
                  role: 'Municipal Verification Officer',
                  title: 'On-Site Ground Verification & Grant Sanctioned',
                  desc: 'Inspected Ward 12 street light feeder pillar. Found high public transit safety risk. Approved grant allocation of ₹1,80,000 for university deployment.',
                  photo: null
                },
                {
                  id: 3,
                  date: '10 May 2025 • 09:15 AM',
                  author: 'Rahul Mishra',
                  role: 'Citizen Reporter',
                  title: 'Civic Grievance Submitted with Geotagged Photo',
                  desc: 'Submitted report on hazardous unlit stretch near Ward 12 junction. AI automated priority assigned as High (8.5/10).',
                  photo: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?w=600'
                }
              ].map(up => {
                const isCitizen = up.role.toLowerCase().includes('citizen');
                const isUni = up.role.toLowerCase().includes('faculty') || up.role.toLowerCase().includes('mentor');
                return (
                  <div key={up.id} className="bg-slate-50/80 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-slate-200/70">
                      <div
                        onClick={() => {
                          if (isCitizen) handleCitizenClick(up.author);
                          else if (isUni) handleUniversityClick('MANIT Bhopal');
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
              })}
            </div>
          </div>
        )}

        {/* TAB 3: TEAM & COLLABORATORS */}
        {activeTab === 'team' && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 font-heading">Quad-Helix Collaboration Team</h3>
              <p className="text-xs text-slate-500">The dedicated stakeholders turning this civic challenge into a reality. Click contributor profiles to view impact.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              
              {/* Faculty Mentor -> Clickable University Profile */}
              <div
                onClick={() => handleUniversityClick(project?.universityName || 'MANIT Bhopal')}
                className="bg-slate-50 hover:bg-emerald-50/70 border border-slate-200 hover:border-emerald-300 rounded-2xl p-4 space-y-2 cursor-pointer transition group/card shadow-xs"
                title="Click to view University Contributor Profile"
              >
                <div className="flex items-center gap-3">
                  <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150" alt="Prof" className="w-12 h-12 rounded-full object-cover ring-2 ring-emerald-500/30" />
                  <div>
                    <div className="text-xs font-bold text-slate-900 group-hover/card:text-emerald-800 flex items-center gap-1">
                      <span>Prof. Kumar</span>
                      <span className="text-[10px] text-emerald-600">↗</span>
                    </div>
                    <div className="text-[10px] text-emerald-700 font-semibold">Faculty Mentor</div>
                    <div className="text-[10px] text-slate-400">MANIT Bhopal</div>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 pt-1">Oversees electrical architecture, student safety protocols, and municipal compliance.</p>
                <div className="text-[10px] font-bold text-emerald-700 pt-1">View University Profile →</div>
              </div>

              {/* Student Lead -> Clickable Student Profile */}
              <div
                onClick={() => handleStudentClick('Rohan Nair', 'Student Lead & IoT Lead')}
                className="bg-slate-50 hover:bg-indigo-50/70 border border-slate-200 hover:border-indigo-300 rounded-2xl p-4 space-y-2 cursor-pointer transition group/card shadow-xs"
                title="Click to view Student Contributor Profile"
              >
                <div className="flex items-center gap-3">
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150" alt="Student Lead" className="w-12 h-12 rounded-full object-cover ring-2 ring-indigo-500/30" />
                  <div>
                    <div className="text-xs font-bold text-slate-900 group-hover/card:text-indigo-800 flex items-center gap-1">
                      <span>Rohan Nair</span>
                      <span className="text-[10px] text-indigo-600">↗</span>
                    </div>
                    <div className="text-[10px] text-indigo-700 font-semibold">Student Lead & IoT Lead</div>
                    <div className="text-[10px] text-slate-400">MANIT Innovation Cell</div>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 pt-1">Leads firmware programming, LoRa telemetry nodes, and field battery mounting.</p>
                <div className="text-[10px] font-bold text-indigo-700 pt-1">View Student Profile →</div>
              </div>

              {/* Citizen Contributor -> Clickable Citizen Profile */}
              <div
                onClick={() => handleCitizenClick('Rahul Mishra')}
                className="bg-slate-50 hover:bg-emerald-50/70 border border-slate-200 hover:border-emerald-300 rounded-2xl p-4 space-y-2 cursor-pointer transition group/card shadow-xs"
                title="Click to view Citizen Contributor Profile"
              >
                <div className="flex items-center gap-3">
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150" alt="Citizen" className="w-12 h-12 rounded-full object-cover ring-2 ring-emerald-500/30" />
                  <div>
                    <div className="text-xs font-bold text-slate-900 group-hover/card:text-emerald-800 flex items-center gap-1">
                      <span>Rahul Mishra</span>
                      <span className="text-[10px] text-emerald-600">↗</span>
                    </div>
                    <div className="text-[10px] text-emerald-700 font-semibold">Citizen Contributor</div>
                    <div className="text-[10px] text-slate-400">Ward 12 Resident</div>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 pt-1">Identified problem, gave ground feedback, and validates night lighting quality.</p>
                <div className="text-[10px] font-bold text-emerald-700 pt-1">View Citizen Profile →</div>
              </div>

              {/* Government Official -> NOT clickable public profile */}
              <div className="bg-slate-50/70 border border-slate-200 rounded-2xl p-4 space-y-2 opacity-90">
                <div className="flex items-center gap-3">
                  <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150" alt="Gov Officer" className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-500/30" />
                  <div>
                    <div className="text-xs font-bold text-slate-900">Anita Sharma</div>
                    <div className="text-[10px] text-blue-700 font-semibold">Government Verification Lead</div>
                    <div className="text-[10px] text-slate-400">Bhopal Municipal Corp</div>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 pt-1">Authorized municipal permit, grid tap point, and fast-track clearance.</p>
                <div className="text-[10px] font-bold text-slate-400 pt-1">Institutional Governance Role</div>
              </div>

              {/* Industry Partner -> NOT clickable public profile */}
              <div className="bg-slate-50/70 border border-slate-200 rounded-2xl p-4 space-y-2 opacity-90">
                <div className="flex items-center gap-3">
                  <img src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150" alt="CSR Lead" className="w-12 h-12 rounded-full object-cover ring-2 ring-amber-500/30" />
                  <div>
                    <div className="text-xs font-bold text-slate-900">Amit Verma</div>
                    <div className="text-[10px] text-amber-700 font-semibold">Industry CSR Partner</div>
                    <div className="text-[10px] text-slate-400">Tata Sustainability CSR</div>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 pt-1">Provided technical review and ₹75,000 grant for smart solar battery modules.</p>
                <div className="text-[10px] font-bold text-slate-400 pt-1">Corporate CSR Partner</div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 4: EXPENSES & PRODUCTS LIST (Procured Products & Hardware) */}
        {activeTab === 'expenses' && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900 font-heading">Procured Products & Hardware Bill of Materials</h3>
                <p className="text-xs text-slate-500">100% transparent public ledger of all components, materials, and field expenses.</p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-extrabold text-slate-900 bg-slate-100 px-3 py-1.5 rounded-xl">
                  Total Budget: ₹1,80,000
                </span>
                <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                  Total Utilized: ₹1,55,900
                </span>
              </div>
            </div>

            {/* Products & Expenses Table */}
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
                  {[
                    { item: 'Smart Auto-Dimming LED Luminaire Fixture (60W IP66)', cat: 'Lighting & Electronics', qty: '12 pcs', vendor: 'Havells Industrial', amount: 38400, url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600' },
                    { item: '12V 100Ah LiFePO4 Battery Pack with Smart BMS', cat: 'Energy Storage', qty: '4 units', vendor: 'Waaree Energies', amount: 48000, url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600' },
                    { item: '330W Mono PERC Solar PV Panels', cat: 'Renewable Power', qty: '4 units', vendor: 'Tata Power Solar', amount: 26000, url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600' },
                    { item: 'LoRaWAN Ambient Light & Fault Telemetry Module', cat: 'IoT Microcontrollers', qty: '6 units', vendor: 'Robu.in Electronics', amount: 14500, url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600' },
                    { item: 'Galvanized Steel Pole Mounting Brackets & Fasteners', cat: 'Civil & Structural', qty: '12 sets', vendor: 'Bhopal Steel Fabricators', amount: 9800, url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600' },
                    { item: 'Underground Armored Copper Cabling (50m roll)', cat: 'Electrical Cabling', qty: '2 rolls', vendor: 'Polycab Cables Ltd', amount: 7200, url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600' },
                    { item: 'Field Labor, Trenching & Safety Cones', cat: 'Labor & Field Logistics', qty: '1 lot', vendor: 'Authorized Municipal Contractor', amount: 12000, url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600' }
                  ].map((prod, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition">
                      <td className="p-3.5 pl-4">
                        <div className="font-bold text-slate-900">{prod.item}</div>
                        <div className="text-[10px] text-slate-400">Verified product spec</div>
                      </td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold border border-slate-200">
                          {prod.cat}
                        </span>
                      </td>
                      <td className="p-3.5 text-center font-bold text-slate-800">
                        {prod.qty}
                      </td>
                      <td className="p-3.5 text-slate-700 font-semibold">
                        {prod.vendor}
                      </td>
                      <td className="p-3.5 font-extrabold text-emerald-800 text-xs sm:text-sm">
                        ₹{prod.amount.toLocaleString('en-IN')}
                      </td>
                      <td className="p-3.5 pr-4 text-center">
                        <a
                          href={prod.url}
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
          </div>
        )}

      </div>

    </div>
  );
}
