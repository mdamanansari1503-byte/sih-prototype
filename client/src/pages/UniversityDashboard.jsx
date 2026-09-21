import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import confetti from 'canvas-confetti';
import {
  GraduationCap,
  Sparkles,
  Rocket,
  CheckCircle2,
  Clock,
  PlusCircle,
  Building,
  Users,
  Trophy,
  Filter,
  Eye,
  Check,
  X,
  ArrowRight,
  Layers,
  Search,
  MapPin,
  FileText,
  AlertCircle,
  DollarSign,
  ChevronRight,
  Send,
  Loader2,
  Code,
  Tag
} from 'lucide-react';

export default function UniversityDashboard({
  problems = [],
  projects = [],
  initialView = 'opportunities',
  onProjectCreated,
  onProjectUpdated,
  onSelectProject,
  onSelectProblem,
  setActiveTab
}) {
  const { currentUser } = useAuth();
  const { t } = useLanguage();

  const [viewMode, setViewMode] = useState(initialView); // 'opportunities' or 'projects'
  const [projectFilter, setProjectFilter] = useState('all'); // 'all', 'ongoing', 'completed'
  const [oppsCategory, setOppsCategory] = useState('all');
  const [oppsSearch, setOppsSearch] = useState('');

  // Adopt modal state
  const [adoptingProblem, setAdoptingProblem] = useState(null);
  const [teamName, setTeamName] = useState(currentUser.teamName || 'MANIT Innovation Hub');
  const [studentLead, setStudentLead] = useState(currentUser.studentLead || 'Rohan Nair');
  const [facultyMentor, setFacultyMentor] = useState(currentUser.name || 'Prof. Kumar');
  const [teamMembersInput, setTeamMembersInput] = useState('Rohan Nair, Priya Verma, Amit Patel, Sneha Rao');
  const [techStackInput, setTechStackInput] = useState('ESP32 IoT, Solar Inverters, Python Telemetry');
  const [solutionSummary, setSolutionSummary] = useState('');
  const [isAdopting, setIsAdopting] = useState(false);

  // Sync initialView prop changes
  React.useEffect(() => {
    if (initialView) {
      setViewMode(initialView);
    }
  }, [initialView]);

  // Filter available verified problems for adoption
  const availableProblems = problems.filter(p => {
    const isAvailable = p.status === 'verified' || p.status === 'pending_verification' || !p.projectId;
    const matchesCategory =
      oppsCategory === 'all' ||
      p.category?.toLowerCase().includes(oppsCategory.toLowerCase());
    const matchesSearch =
      !oppsSearch ||
      p.title?.toLowerCase().includes(oppsSearch.toLowerCase()) ||
      p.description?.toLowerCase().includes(oppsSearch.toLowerCase()) ||
      p.location?.address?.toLowerCase().includes(oppsSearch.toLowerCase());

    return isAvailable && matchesCategory && matchesSearch;
  });

  // Filter university projects (assigned to current university or all active projects)
  const uniProjects = projects.length > 0 ? projects : [
    {
      id: "proj-201",
      problemId: "ag1001",
      title: "Smart Street Light Automation & Solar Battery Node",
      universityName: currentUser?.institution || "MANIT Bhopal Innovation Hub",
      teamName: "MANIT IoT & Energy Innovation Team",
      studentLead: "Rohan Nair",
      facultyMentor: currentUser?.name || "Prof. Kumar",
      teamMembers: ["Rohan Nair", "Priya Verma", "Amit Patel", "Sneha Rao", "Karan Singh"],
      status: "in_progress",
      progressPercentage: 65,
      startedAt: "2026-08-15",
      allocatedBudget: 180000,
      totalExpenses: 155900,
      milestones: [
        { id: "m-1", title: "Corridor Illuminance & Solar Irradiance Survey", status: "completed", description: "Mapped 12 broken poles and simulated 60W LED luminaire lumen output." },
        { id: "m-2", title: "LiFePO4 Solar Battery & BMS Prototype Fabricated", status: "completed", description: "Fabricated 4 units of 12V 100Ah battery enclosure with auto-dimming circuitry." },
        { id: "m-3", title: "On-Site Installation & LoRaWAN Node Integration", status: "in_progress", description: "Deploying pole mounts and testing night telemetry to municipal dashboard." },
        { id: "m-4", title: "Final Handover & Ground Impact Sign-off", status: "pending", description: "Validation under heavy weather and sign-off with municipal engineer." }
      ],
      solutionDetails: {
        summary: "Smart auto-dimming LED luminaires powered by solar PV panels and LiFePO4 battery pack with LoRa fault telemetry.",
        techStack: ["ESP32 Microcontroller", "LoRaWAN", "LiFePO4 BMS", "SolidWorks"]
      }
    },
    {
      id: "proj-202",
      problemId: "ag1008",
      title: "Clean Water ATM & Automated RO Purification Unit",
      universityName: currentUser?.institution || "BIT Mesra Innovation Cell",
      teamName: "Team Jaltarang Hydro Lab",
      studentLead: "Aakash Deshmukh",
      facultyMentor: "Prof. Arvind Rao",
      teamMembers: ["Aakash Deshmukh", "Tanvi Joshi", "Rahul Patil", "Omkar Shinde"],
      status: "solved",
      progressPercentage: 100,
      startedAt: "2026-07-01",
      allocatedBudget: 190000,
      totalExpenses: 182000,
      milestones: [
        { id: "m-1", title: "Water Quality & TDS Testing", status: "completed", description: "Lab tested TDS levels and calibrated multi-stage filtration." },
        { id: "m-2", title: "Automated RFID Dispenser Assembly", status: "completed", description: "Integrated smart card payment and flow rate sensor." },
        { id: "m-3", title: "Community Center Installation & Commissioning", status: "completed", description: "Delivering 5,000L clean drinking water daily to 800+ residents." }
      ],
      solutionDetails: {
        summary: "Solar-powered multi-stage RO water purification unit with RFID card dispenser and live TDS monitoring.",
        techStack: ["Reverse Osmosis", "RFID Module", "Arduino Mega", "Solar Inverter"]
      }
    }
  ];

  const filteredProjects = uniProjects.filter(p => {
    if (projectFilter === 'ongoing') return p.status === 'in_progress' || p.status === 'testing';
    if (projectFilter === 'completed') return p.status === 'solved';
    return true;
  });

  const ongoingCount = uniProjects.filter(p => p.status === 'in_progress' || p.status === 'testing').length;
  const completedCount = uniProjects.filter(p => p.status === 'solved').length;
  const totalTeamMembers = uniProjects.reduce((acc, p) => acc + (p.teamMembers?.length || 4), 0);

  const [proposalSuccess, setProposalSuccess] = useState(null);

  const handleOpenAdopt = (prob) => {
    setAdoptingProblem(prob);
    setSolutionSummary(prob.aiAnalysis?.summary || `Engineering deployment addressing: ${prob.title}`);
  };

  const handleConfirmAdopt = async (e) => {
    e.preventDefault();
    if (!adoptingProblem) return;

    setIsAdopting(true);
    try {
      const membersArray = teamMembersInput.split(',').map(m => m.trim()).filter(Boolean);
      const techArray = techStackInput.split(',').map(t => t.trim()).filter(Boolean);

      const res = await api.createAdoptionRequest({
        problemId: adoptingProblem.id,
        problemTitle: adoptingProblem.title,
        location: `${adoptingProblem.location?.address || ''}, ${adoptingProblem.location?.city || 'Ranchi'}`,
        university: currentUser.institution || 'MANIT Bhopal',
        teamName,
        teamLead: studentLead,
        facultyMentor,
        teamMembers: membersArray,
        solutionDetails: {
          summary: solutionSummary,
          techStack: techArray
        },
        requestedBudget: adoptingProblem.verification?.allocatedBudget || 150000,
        aiRecommendedBudget: adoptingProblem.verification?.allocatedBudget || 150000
      });

      if (res.success) {
        setProposalSuccess({
          reqId: res.data.id,
          title: adoptingProblem.title,
          teamName: teamName,
          budget: res.data.aiRecommendedBudget
        });
        setAdoptingProblem(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAdopting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16 font-sans text-slate-800 animate-fadeIn">
      
      {/* 1. TOP HEADER & SUB-NAV TABS */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold mb-2">
              <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
              <span>University Research & Student Innovation Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
              {viewMode === 'projects' ? 'My Projects & Teams' : 'Innovation Opportunities'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              {viewMode === 'projects'
                ? 'Manage active student innovation teams, milestones, and deployed engineering solutions.'
                : 'Browse verified civic challenges and deploy student capstone projects with government backing.'}
            </p>
          </div>

          {/* Sub-Tabs: Opportunities vs My Projects & Teams */}
          <div className="flex bg-slate-100 p-1.5 rounded-2xl text-xs font-bold shrink-0">
            <button
              onClick={() => setViewMode('opportunities')}
              className={`px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-2 ${
                viewMode === 'opportunities'
                  ? 'bg-white text-emerald-800 shadow-xs font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Opportunities</span>
            </button>
            <button
              onClick={() => setViewMode('projects')}
              className={`px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-2 ${
                viewMode === 'projects'
                  ? 'bg-white text-emerald-800 shadow-xs font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-indigo-600" />
              <span>My Projects & Teams</span>
            </button>
          </div>
        </div>

        {/* 4 Summary Metrics (When on My Projects & Teams) */}
        {viewMode === 'projects' && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-xs hover:border-emerald-300 transition">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Projects</span>
                <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <Layers className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-black text-slate-900 font-heading mt-3">
                {uniProjects.length}
              </div>
              <div className="text-[11px] text-slate-400 font-medium mt-0.5">Adopted university projects</div>
            </div>

            <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-xs hover:border-blue-300 transition">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Ongoing Projects</span>
                <div className="w-9 h-9 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-black text-blue-700 font-heading mt-3">
                {ongoingCount}
              </div>
              <div className="text-[11px] text-slate-400 font-medium mt-0.5">Under active engineering</div>
            </div>

            <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-xs hover:border-emerald-300 transition">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Completed Projects</span>
                <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-black text-emerald-700 font-heading mt-3">
                {completedCount}
              </div>
              <div className="text-[11px] text-slate-400 font-medium mt-0.5">Deployed & certified solutions</div>
            </div>

            <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-xs hover:border-indigo-300 transition">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">Assigned Members</span>
                <div className="w-9 h-9 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-black text-indigo-700 font-heading mt-3">
                {totalTeamMembers}
              </div>
              <div className="text-[11px] text-slate-400 font-medium mt-0.5">Students & mentors engaged</div>
            </div>
          </div>
        )}
      </div>

      {/* 2. TAB: OPPORTUNITIES (View Verified Problems & Take Project) */}
      {viewMode === 'opportunities' && (
        <div className="space-y-6">
          
          {/* Filter & Search Bar */}
          <div className="bg-white rounded-3xl border border-slate-200 p-4 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search verified problems by title, keywords or location..."
                value={oppsSearch}
                onChange={(e) => setOppsSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={oppsCategory}
                onChange={(e) => setOppsCategory(e.target.value)}
                className="px-3 py-2 rounded-2xl border border-slate-200 text-xs font-semibold text-slate-700 bg-slate-50 focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="all">All Categories</option>
                <option value="infrastructure">Infrastructure</option>
                <option value="water">Water & Sanitation</option>
                <option value="lighting">Street Lighting</option>
                <option value="education">Smart Education</option>
                <option value="waste">Waste Management</option>
              </select>
            </div>
          </div>

          {/* Opportunities Cards Grid */}
          {availableProblems.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
              <Sparkles className="w-10 h-10 text-slate-300 mx-auto" />
              <div className="text-sm font-bold text-slate-700">No verified opportunities matching this criteria</div>
              <p className="text-xs text-slate-400">Try changing the category or search keyword.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {availableProblems.map((prob) => {
                const isHigh = prob.aiAnalysis?.urgency === 'High' || prob.aiAnalysis?.urgency === 'Critical';

                return (
                  <div
                    key={prob.id}
                    className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px]">
                          {prob.category || 'Civic Infrastructure'}
                        </span>

                        <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full border ${
                          isHigh
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          ● {isHigh ? 'High Priority' : 'Medium Priority'}
                        </span>
                      </div>

                      {/* Title & Description */}
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 leading-snug">
                          {prob.title}
                        </h3>
                        <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                          {prob.description}
                        </p>
                      </div>

                      {/* AI Specs Box */}
                      <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-xs space-y-1.5">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-400 font-medium">Estimated Sanctioned Budget:</span>
                          <span className="font-extrabold text-slate-900">{prob.aiAnalysis?.estimatedBudget || '₹ 1,50,000 - ₹ 1,80,000'}</span>
                        </div>
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-400 font-medium">Target Timeline:</span>
                          <span className="font-extrabold text-emerald-700">{prob.aiAnalysis?.estimatedTimelineWeeks || 4} Weeks</span>
                        </div>
                        {prob.aiAnalysis?.relevantSkills && (
                          <div className="pt-1 flex items-center gap-1.5 flex-wrap">
                            {prob.aiAnalysis.relevantSkills.map((skill, sIdx) => (
                              <span key={sIdx} className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600 text-[10px] font-semibold">
                                #{skill}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{prob.location?.address || prob.location?.city || 'Jharkhand'}</span>
                      </div>

                    </div>

                    {/* Footer Actions: View & Submit Adoption Proposal */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                      <button
                        onClick={() => onSelectProblem ? onSelectProblem(prob.id) : (setActiveTab && setActiveTab('explorer'))}
                        className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition cursor-pointer"
                      >
                        View Public Tracking
                      </button>

                      {prob.status === 'in_progress' || prob.projectId ? (
                        <span className="px-3.5 py-1.5 rounded-xl bg-blue-50 text-blue-700 font-bold text-xs border border-blue-200">
                          ● Assigned to Team
                        </span>
                      ) : prob.adoptionRequest?.status === 'pending_approval' ? (
                        <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-50 text-amber-800 font-bold text-xs border border-amber-200">
                          <Clock className="w-3.5 h-3.5 text-amber-600 animate-spin" />
                          <span>Proposal Under Govt Review</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleOpenAdopt(prob)}
                          className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs transition shadow-md shadow-emerald-600/20 flex items-center gap-1.5 cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Submit Adoption Proposal →</span>
                        </button>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

      {/* 3. TAB: MY PROJECTS & TEAMS */}
      {viewMode === 'projects' && (
        <div className="space-y-6">
          
          {/* Filter Bar: All / Ongoing / Completed */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-slate-200">
            <div>
              <h2 className="text-lg font-bold text-slate-900 font-heading">
                Assigned Student Teams & Projects
              </h2>
              <p className="text-xs text-slate-500">Live milestones, team members, progress tracking, and deliverables.</p>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl text-xs font-bold overflow-x-auto">
              {[
                { id: 'all', label: 'All Projects' },
                { id: 'ongoing', label: 'Ongoing Projects' },
                { id: 'completed', label: 'Completed Projects' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setProjectFilter(tab.id)}
                  className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap transition cursor-pointer ${
                    projectFilter === tab.id
                      ? 'bg-white text-emerald-800 shadow-xs font-black'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Project List */}
          <div className="space-y-6">
            {filteredProjects.map((proj) => {
              const isSolved = proj.status === 'solved';
              const isInProgress = proj.status === 'in_progress' || proj.status === 'testing';

              return (
                <div
                  key={proj.id}
                  className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6"
                >
                  {/* Top Row: Title, Status, Progress */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h3 className="text-base sm:text-lg font-bold text-slate-900 font-heading">
                          {proj.title}
                        </h3>
                        <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full border flex items-center gap-1.5 ${
                          isSolved
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-blue-50 text-blue-800 border-blue-200'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isSolved ? 'bg-emerald-500' : 'bg-blue-500 animate-pulse'}`} />
                          <span>{isSolved ? 'Completed & Handed Over' : 'In Progress & Fabrication'}</span>
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Project ID: <span className="font-bold text-slate-700">#{proj.id.toUpperCase()}</span> • Institution: <span className="font-bold text-emerald-700">{proj.universityName}</span>
                      </p>
                    </div>

                    {/* Progress Percentage */}
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <div className="text-xs text-slate-400 font-bold uppercase">Progress</div>
                        <div className="text-base font-black text-slate-900 font-heading">{proj.progressPercentage || (isSolved ? 100 : 65)}%</div>
                      </div>
                      <div className="w-24 h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                        <div
                          className={`h-full rounded-full ${isSolved ? 'bg-emerald-500' : 'bg-emerald-600'}`}
                          style={{ width: `${proj.progressPercentage || (isSolved ? 100 : 65)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* 2 Columns: Team Info & Solution Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    
                    {/* Left: Assigned Student Team Box */}
                    <div className="md:col-span-6 bg-slate-50/80 rounded-2xl border border-slate-200 p-5 space-y-3.5">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                        <Users className="w-4 h-4 text-indigo-600" />
                        <span>Assigned Student Innovation Team</span>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Team Name:</span>
                          <span className="font-bold text-slate-900">{proj.teamName}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Student Lead:</span>
                          <span className="font-bold text-indigo-700">{proj.studentLead}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Faculty Mentor:</span>
                          <span className="font-bold text-emerald-700">{proj.facultyMentor || 'Prof. Kumar'}</span>
                        </div>
                      </div>

                      {/* Team Members List */}
                      <div className="pt-2 border-t border-slate-200/80">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1.5">Team Members</span>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {(proj.teamMembers || ['Rohan Nair', 'Priya Verma', 'Amit Patel', 'Sneha Rao']).map((member, mIdx) => (
                            <span key={mIdx} className="px-2.5 py-1 rounded-xl bg-white border border-slate-200 text-slate-700 text-[11px] font-medium shadow-2xs">
                              {member}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right: Solution Architecture & Tech Stack */}
                    <div className="md:col-span-6 bg-slate-50/80 rounded-2xl border border-slate-200 p-5 space-y-3.5">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                        <Code className="w-4 h-4 text-emerald-600" />
                        <span>Engineering Solution & Tech Stack</span>
                      </div>

                      <p className="text-xs text-slate-700 leading-relaxed font-medium">
                        {proj.solutionDetails?.summary || 'Automated embedded system with telemetry sensor node and sustainable local storage.'}
                      </p>

                      <div className="pt-2 border-t border-slate-200/80">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1.5">Technologies Used</span>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {(proj.solutionDetails?.techStack || ['IoT Controller', 'Solar PV', 'LiFePO4 BMS']).map((tech, tIdx) => (
                            <span key={tIdx} className="px-2.5 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Milestones / Tasks Section */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Milestones & Deployment Tasks</span>
                      </h4>
                      <span className="text-[11px] text-slate-400 font-medium">
                        {(proj.milestones || []).filter(m => m.status === 'completed').length} of {(proj.milestones || []).length} completed
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {(proj.milestones || [
                        { id: 'm-1', title: 'Site Topographical & Technical Survey', status: 'completed', description: 'Surveyed installation site and simulated mechanical drafts.' },
                        { id: 'm-2', title: 'Hardware Prototype Fabrication in University Lab', status: 'completed', description: 'Assembled circuit boards and validated voltage thresholds.' },
                        { id: 'm-3', title: 'On-Site Installation & Telemetry Testing', status: 'in_progress', description: 'Mounted unit on site and tested cloud transmissions.' },
                        { id: 'm-4', title: 'Final Handover & Community Sign-off', status: 'pending', description: 'Final inspection sign-off with municipal engineers.' }
                      ]).map((m, idx) => (
                        <div key={m.id || idx} className={`p-3.5 rounded-2xl border text-xs space-y-1 ${
                          m.status === 'completed'
                            ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900'
                            : m.status === 'in_progress'
                            ? 'bg-blue-50/50 border-blue-200 text-blue-900'
                            : 'bg-slate-50 border-slate-200 text-slate-600'
                        }`}>
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs">{idx + 1}. {m.title}</span>
                            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase ${
                              m.status === 'completed'
                                ? 'bg-emerald-100 text-emerald-800'
                                : m.status === 'in_progress'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-slate-200 text-slate-600'
                            }`}>
                              {m.status === 'completed' ? '✓ Done' : m.status === 'in_progress' ? 'In Progress' : 'Pending'}
                            </span>
                          </div>
                          <p className="text-[11px] opacity-80 leading-snug">{m.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Card Footer: Expenses Button & Public Details Link */}
                  <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <span className="text-slate-500 font-medium">
                        Sanctioned Budget: <strong className="text-slate-900">₹{(proj.allocatedBudget || 180000).toLocaleString('en-IN')}</strong>
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-emerald-700 font-bold">
                        Expenses Utilized: ₹{(proj.totalExpenses || 155900).toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                      <button
                        onClick={() => {
                          if (setActiveTab) setActiveTab('expenses');
                        }}
                        className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition cursor-pointer"
                      >
                        Project Expenses & BOM
                      </button>

                      <button
                        onClick={() => {
                          if (onSelectProject) onSelectProject(proj.id);
                          else if (setActiveTab) setActiveTab('explorer');
                        }}
                        className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>View Public Tracking</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* 4. MODAL: SUBMIT ADOPTION PROPOSAL */}
      {adoptingProblem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-5 text-xs max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold text-[10px] mb-1">
                  <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Quad-Helix Innovation Proposal</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 font-heading">
                  Submit Project Adoption Proposal
                </h3>
              </div>
              <button
                onClick={() => setAdoptingProblem(null)}
                className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Problem Preview Box */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
              <span className="text-slate-400 uppercase text-[10px] font-bold block">Selected Community Challenge</span>
              <div className="text-sm font-bold text-slate-900">{adoptingProblem.title}</div>
              <div className="text-[11px] text-slate-500">
                {adoptingProblem.location?.address || 'Jharkhand'} • Sanctioned Budget: {adoptingProblem.verification?.allocatedBudget ? `₹${adoptingProblem.verification.allocatedBudget.toLocaleString('en-IN')}` : (adoptingProblem.aiAnalysis?.estimatedBudget || '₹1,50,000')}
              </div>
            </div>

            {/* Quad-Helix Process Notice */}
            <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <span>🏛️ Municipal Government Approval Step</span>
              </div>
              <p className="text-[11px] text-blue-800 leading-relaxed font-medium">
                This proposal will be officially transmitted to the Municipal Authority. Once the Government reviews your faculty mentor and hardware schematic, they will confirm adoption and sanction the grant.
              </p>
            </div>

            <form onSubmit={handleConfirmAdopt} className="space-y-4">
              
              <div>
                <label className="block text-slate-700 font-bold mb-1">Student Innovation Team Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. BIT Mesra Renewable Energy Hub"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-900 focus:outline-none focus:border-emerald-500 bg-slate-50/50 focus:bg-white transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Student Lead Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rohan Nair"
                    value={studentLead}
                    onChange={(e) => setStudentLead(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-emerald-500 bg-slate-50/50 focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Faculty Mentor *</label>
                  <input
                    type="text"
                    required
                    value={facultyMentor}
                    onChange={(e) => setFacultyMentor(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-emerald-500 bg-slate-50/50 focus:bg-white transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Team Members (Comma separated) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rohan Nair, Priya Verma, Amit Patel, Sneha Rao"
                  value={teamMembersInput}
                  onChange={(e) => setTeamMembersInput(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-emerald-500 bg-slate-50/50 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Proposed Tech Stack & Hardware Components</label>
                <input
                  type="text"
                  placeholder="e.g. Solar PV Inverter, ESP32, LoRaWAN, LiFePO4 Battery"
                  value={techStackInput}
                  onChange={(e) => setTechStackInput(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-emerald-500 bg-slate-50/50 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Engineering Solution Plan & Methodology</label>
                <textarea
                  rows={3}
                  required
                  value={solutionSummary}
                  onChange={(e) => setSolutionSummary(e.target.value)}
                  placeholder="Describe the technical solution approach and scheduled lab test milestones..."
                  className="w-full p-3 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-emerald-500 bg-slate-50/50 focus:bg-white transition"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setAdoptingProblem(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAdopting}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold shadow-md shadow-emerald-600/20 transition flex items-center gap-2 cursor-pointer"
                >
                  {isAdopting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Transmitting Proposal...</span>
                    </>
                  ) : (
                    <span>Submit Proposal to Government →</span>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* 5. SUCCESS MODAL: PROPOSAL TRANSMITTED */}
      {proposalSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 sm:p-8 text-center space-y-4 shadow-2xl">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto text-2xl shadow-xs">
              📋
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                Proposal Transmitted Successfully
              </span>
              <h3 className="text-lg font-extrabold text-slate-900 font-heading mt-2">
                Adoption Request Sent to Municipal Authority!
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Proposal for <strong>"{proposalSuccess.title}"</strong> has been registered under <strong>{proposalSuccess.teamName}</strong>.
              </p>
            </div>

            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-left text-xs space-y-1.5 text-amber-900">
              <div className="font-bold flex items-center gap-1.5">
                <span>🏛️ Next Step: Government Approval</span>
              </div>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                To complete adoption, switch to the <strong>Government Authority Portal</strong> under <strong>"College Requests / Approvals"</strong> and click <strong>Approve Team & Sanction Grant</strong>.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5">
              <button
                onClick={() => setProposalSuccess(null)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
              >
                Close & Stay Here
              </button>
              <button
                onClick={() => {
                  setProposalSuccess(null);
                  if (setActiveTab) setActiveTab('government');
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Switch to Government Portal →</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
