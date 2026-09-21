import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  ShieldCheck,
  CheckCircle,
  XCircle,
  AlertTriangle,
  MapPin,
  Sparkles,
  Calendar,
  Check,
  X,
  FileCheck2,
  Building,
  Eye,
  DollarSign,
  TrendingUp,
  Activity,
  Award,
  Users,
  Clock,
  Wallet,
  PieChart,
  Image as ImageIcon,
  AlertCircle
} from 'lucide-react';

export default function GovernmentDashboard({
  problems = [],
  projects = [],
  initialView = 'verification',
  onProblemUpdated,
  onProjectCreated,
  onProjectUpdated,
  onSelectProblem,
  onSelectProject,
  setActiveTab
}) {
  const { currentUser } = useAuth();

  // Sub-tabs inside Government Portal: 'verification', 'requests', 'funding', 'progress'
  const [activeView, setActiveView] = useState(initialView || 'verification');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [verifyingProblem, setVerifyingProblem] = useState(null);
  const [actionType, setActionType] = useState('verified');
  const [budget, setBudget] = useState(120000);
  const [remarks, setRemarks] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  React.useEffect(() => {
    if (initialView) {
      setActiveView(initialView);
    }
  }, [initialView]);

  // Citizen problems awaiting government verification
  const pendingProblems = problems.filter(p => p.status === 'pending_verification' || p.status === 'pending');

  // Fallback demo pending problems if none in state
  const displayPendingProblems = pendingProblems.length > 0 ? pendingProblems : [
    {
      id: 'PROB-JH-901',
      title: 'Broken High-Tension Wire & Damaged Transformer in Tupudana',
      description: 'Severe electrical sparking near Tupudana middle school ground. Wire has snapped and poses immediate hazard during student commuting hours.',
      category: 'Street Lighting & Electrical',
      location: {
        address: 'Tupudana Industrial Road, Near Govt Middle School',
        city: 'Ranchi',
        state: 'Jharkhand'
      },
      images: ['https://images.unsplash.com/photo-1547683905-f686c993aae5?w=600'],
      reportedAt: '2026-03-20',
      status: 'pending_verification',
      aiAnalysis: {
        urgency: 'Critical',
        category: 'Street Lighting & Electrical',
        feasibilityScore: 94,
        estimatedBudget: '₹65,000 - ₹90,000',
        recommendedDepartment: 'Electrical & Power Distribution Lab',
        summary: 'Critical high-voltage fault requiring immediate line isolation, fuse rebuild, and municipal power line replacement.'
      }
    },
    {
      id: 'PROB-JH-902',
      title: 'Monsoon Culvert Washout on Angara-Hundru Link Road',
      description: 'Foundation soil beneath the culvert has completely eroded. Heavy vehicles risk bridge cave-in before monsoon begins.',
      category: 'Roads & Infrastructure',
      location: {
        address: 'Hundru Falls Link Road, Angara Block',
        city: 'Ranchi',
        state: 'Jharkhand'
      },
      images: ['https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600'],
      reportedAt: '2026-03-19',
      status: 'pending_verification',
      aiAnalysis: {
        urgency: 'High',
        category: 'Roads & Infrastructure',
        feasibilityScore: 89,
        estimatedBudget: '₹1,50,000 - ₹2,10,000',
        recommendedDepartment: 'Civil & Structural Engineering Dept',
        summary: 'Geo-technical soil stabilization with gabion wall reinforcement and reinforced concrete culvert apron.'
      }
    },
    {
      id: 'PROB-JH-903',
      title: 'Groundwater Fluoride & Iron Contamination in Sector 4 Handpumps',
      description: 'Over 850 residents report discoloration and heavy metallic taste in community tube-wells. High fluoride reported in spot testing.',
      category: 'Drainage & Clean Water Supply',
      location: {
        address: 'Sector 4, Bokaro Steel City',
        city: 'Bokaro',
        state: 'Jharkhand'
      },
      images: ['https://images.unsplash.com/photo-1509391365360-2e959784a276?w=600'],
      reportedAt: '2026-03-18',
      status: 'pending_verification',
      aiAnalysis: {
        urgency: 'High',
        category: 'Drainage & Clean Water Supply',
        feasibilityScore: 92,
        estimatedBudget: '₹1,10,000 - ₹1,45,000',
        recommendedDepartment: 'Chemical & Environmental Engineering Lab',
        summary: 'Deployment of multi-stage activated alumina fluoride filtration column and solar UV disinfection unit.'
      }
    }
  ];

  // College Requests / Adoption Proposals
  const [requestsList, setRequestsList] = useState([]);

  React.useEffect(() => {
    loadRequests();
  }, [problems, projects]);

  const loadRequests = async () => {
    try {
      const res = await api.getAdoptionRequests();
      if (res.success && Array.isArray(res.data)) {
        setRequestsList(res.data);
      }
    } catch (e) {}
  };

  // CSR Funding Ledger
  const fundingLedger = [
    {
      id: 'CSR-TATA-2026',
      donor: 'Tata Steel CSR Trust',
      sector: 'Water Sanitation & Rural Infrastructure',
      totalGrant: 1850000,
      allocated: 1420000,
      spent: 980000,
      remaining: 430000,
      projectsCount: 3
    },
    {
      id: 'CSR-SAIL-2026',
      donor: 'Bokaro Steel Plant (SAIL CSR)',
      sector: 'Tribal Solar & Digital Education',
      totalGrant: 1400000,
      allocated: 1150000,
      spent: 820000,
      remaining: 250000,
      projectsCount: 2
    },
    {
      id: 'CSR-CCL-2026',
      donor: 'Central Coalfields Limited (CCL CSR)',
      sector: 'Mine Drainage & Rural Roads',
      totalGrant: 2200000,
      allocated: 1600000,
      spent: 1100000,
      remaining: 600000,
      projectsCount: 2
    },
    {
      id: 'CSR-TECHM-2026',
      donor: 'Tech Mahindra Foundation',
      sector: 'Smart Village IoT & Early Alerts',
      totalGrant: 950000,
      allocated: 700000,
      spent: 510000,
      remaining: 250000,
      projectsCount: 1
    }
  ];

  const totalFundingReceived = fundingLedger.reduce((sum, item) => sum + item.totalGrant, 0);
  const totalFundingSpent = fundingLedger.reduce((sum, item) => sum + item.spent, 0);
  const totalRemainingFunds = totalFundingReceived - totalFundingSpent;

  // Active Project Progress List (University/Team/Project Status)
  const projectProgressList = [
    {
      id: 'PRJ-01',
      title: 'Tupudana Fluoride Water Filtration System',
      university: 'BIT Mesra',
      team: 'Jal-Shakti Cell',
      status: 'In Progress',
      progressPercent: 65,
      budget: '₹1,20,000',
      spent: '₹75,000'
    },
    {
      id: 'PRJ-02',
      title: 'Angara Tribal Solar Microgrid Restoration',
      university: 'IIT ISM Dhanbad',
      team: 'Urja Vikas Taskforce',
      status: 'In Progress',
      progressPercent: 45,
      budget: '₹85,000',
      spent: '₹40,000'
    },
    {
      id: 'PRJ-03',
      title: 'Bundu Rural Culvert Foundation Reinforcement',
      university: 'NIT Jamshedpur',
      team: 'Setu Nirman Squad',
      status: 'In Progress',
      progressPercent: 70,
      budget: '₹1,80,000',
      spent: '₹1,20,000'
    },
    {
      id: 'PRJ-04',
      title: 'Ormanjhi Smart Anganwadi Digital Kits',
      university: 'Ranchi University',
      team: 'Edutech Innovators',
      status: 'Completed',
      progressPercent: 100,
      budget: '₹1,90,000',
      spent: '₹1,90,000'
    },
    {
      id: 'PRJ-05',
      title: 'Subarnarekha River IoT Level Alert Mesh',
      university: 'IIT ISM Dhanbad',
      team: 'HydroSense Team',
      status: 'Completed',
      progressPercent: 100,
      budget: '₹2,10,000',
      spent: '₹2,05,000'
    }
  ];

  const handleOpenVerifyModal = (prob, action) => {
    setVerifyingProblem(prob);
    setActionType(action);
    setBudget(prob.aiAnalysis?.estimatedBudget ? parseInt(prob.aiAnalysis.estimatedBudget.replace(/\D/g, '')) || 120000 : 120000);
    setRemarks(
      action === 'verified'
        ? `Verified on ground by Municipal Smart City Cell. Authorized for university engineering adoption.`
        : `Rejected: Does not meet municipal criteria or already addressed.`
    );
  };

  const handleConfirmVerification = async () => {
    if (!verifyingProblem) return;
    setIsProcessing(true);
    try {
      const res = await api.verifyProblem(verifyingProblem.id, {
        status: actionType,
        remarks,
        verifiedBy: currentUser?.name || 'Anita Sharma (Gov Officer)',
        allocatedBudget: Number(budget),
        priority: verifyingProblem.aiAnalysis?.urgency || 'High'
      });

      if (res.success) {
        if (onProblemUpdated) onProblemUpdated(res.data);
        alert(`Problem "${verifyingProblem.title}" ${actionType === 'verified' ? 'Verified & Authorized!' : 'Rejected.'}`);
        setVerifyingProblem(null);
      } else {
        // Fallback for demo items
        if (onProblemUpdated) {
          onProblemUpdated({
            ...verifyingProblem,
            status: actionType,
            verification: {
              status: actionType,
              remarks,
              allocatedBudget: Number(budget),
              verifiedBy: currentUser?.name || 'Anita Sharma (Gov Officer)'
            }
          });
        }
        alert(`Problem "${verifyingProblem.title}" ${actionType === 'verified' ? 'Verified & Authorized!' : 'Rejected.'}`);
        setVerifyingProblem(null);
      }
    } catch (err) {
      console.error(err);
      alert(`Problem verified on ground!`);
      setVerifyingProblem(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApprove = async (req) => {
    setIsProcessing(true);
    try {
      const res = await api.approveAdoptionRequest(req.id);
      if (res.success) {
        if (onProjectCreated && res.data?.project) {
          onProjectCreated(res.data.project);
        }
        if (onProblemUpdated && res.data?.problem) {
          onProblemUpdated(res.data.problem);
        }
        setRequestsList(prev => prev.map(r => r.id === req.id ? { ...r, status: 'approved' } : r));
        alert(`🎉 Request Approved! Sanctioned grant of ₹${(req.aiRecommendedBudget || 150000).toLocaleString('en-IN')} to ${req.university} (${req.teamName}). Project is now officially IN PROGRESS!`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
      if (selectedRequest?.id === req.id) setSelectedRequest(null);
    }
  };

  const handleReject = async (req) => {
    setIsProcessing(true);
    try {
      await api.rejectAdoptionRequest(req.id);
      setRequestsList(prev => prev.map(r => r.id === req.id ? { ...r, status: 'rejected' } : r));
      alert(`Request ${req.id} Rejected.`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
      if (selectedRequest?.id === req.id) setSelectedRequest(null);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Top Header with in-page sub-tabs */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold uppercase tracking-wider">
              Government Portal
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Officer: <strong>{currentUser?.name || 'Anita Sharma (IAS)'}</strong>
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-heading mt-1">
            Civic Problem Verification & College Approvals
          </h1>
        </div>

        {/* 4 In-Page Views: Problem Verification | College Requests | Funding | Progress */}
        <div className="flex bg-slate-100 p-1 rounded-2xl text-xs font-bold shrink-0 self-start sm:self-center overflow-x-auto">
          <button
            onClick={() => setActiveView('verification')}
            className={`px-3.5 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeView === 'verification'
                ? 'bg-emerald-700 text-white shadow-xs font-extrabold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Problem Verification</span>
            <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] ${
              activeView === 'verification' ? 'bg-emerald-800 text-emerald-100' : 'bg-slate-200 text-slate-700'
            }`}>
              {displayPendingProblems.length}
            </span>
          </button>

          <button
            onClick={() => setActiveView('requests')}
            className={`px-3.5 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeView === 'requests'
                ? 'bg-emerald-700 text-white shadow-xs font-extrabold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>College Requests</span>
          </button>

          <button
            onClick={() => setActiveView('funding')}
            className={`px-3.5 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeView === 'funding'
                ? 'bg-emerald-700 text-white shadow-xs font-extrabold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Funding</span>
          </button>

          <button
            onClick={() => setActiveView('progress')}
            className={`px-3.5 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeView === 'progress'
                ? 'bg-emerald-700 text-white shadow-xs font-extrabold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Progress</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. PROBLEM VERIFICATION SECTION (Citizen Problems Awaiting Verification)  */}
      {/* ========================================================================= */}
      {activeView === 'verification' && (
        <div className="space-y-4">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
            <div>
              <h2 className="text-base font-bold text-slate-900 font-heading">
                Citizen-Submitted Problems Awaiting Verification ({displayPendingProblems.length})
              </h2>
              <p className="text-xs text-slate-500">
                Review on-ground reports, evaluate AI diagnostic summaries, and authorize issues for university engineering adoption.
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold shrink-0 self-start sm:self-center">
              ● Pending Municipal Action
            </span>
          </div>

          <div className="space-y-4">
            {displayPendingProblems.map((prob) => {
              const urgency = prob.aiAnalysis?.urgency || 'High';
              const isCritical = urgency === 'Critical' || urgency === 'High';
              const photoUrl = prob.images?.[0] || "https://images.unsplash.com/photo-1547683905-f686c993aae5?w=600";

              return (
                <div
                  key={prob.id}
                  className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 hover:border-slate-300 transition-all shadow-xs space-y-4"
                >
                  {/* Top Row: Title, Location, Urgency */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                          #{prob.id}
                        </span>
                        <h3 className="text-sm sm:text-base font-bold text-slate-900 font-heading">
                          {prob.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{prob.location?.address || 'Sector 4, Main Road'}, {prob.location?.city || 'Jharkhand'}</span>
                        <span>•</span>
                        <span className="font-semibold text-slate-600">{prob.category}</span>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold border flex items-center gap-1.5 ${
                        isCritical
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                        <span>AI Urgency: {urgency}</span>
                      </span>
                    </div>
                  </div>

                  {/* Middle Row: Photo + Description */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                    {/* Photo */}
                    <div className="md:col-span-3">
                      <div className="relative h-32 w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 group">
                        <img
                          src={photoUrl}
                          alt={prob.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute bottom-1.5 left-1.5 right-1.5 px-2 py-0.5 bg-black/60 backdrop-blur-xs rounded-lg text-[10px] text-white font-medium flex items-center gap-1">
                          <ImageIcon className="w-3 h-3 text-emerald-400" />
                          <span>On-Site Photo Evidence</span>
                        </div>
                      </div>
                    </div>

                    {/* Citizen Description */}
                    <div className="md:col-span-9 bg-slate-50/70 p-3.5 rounded-2xl border border-slate-200 text-xs space-y-1">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Citizen Description</span>
                      <p className="text-slate-800 leading-relaxed font-medium">
                        "{prob.description}"
                      </p>
                    </div>
                  </div>

                  {/* AI Diagnostic Breakdown Card */}
                  <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4 text-xs space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-emerald-700 shrink-0" />
                        <span className="font-extrabold text-emerald-950">
                          Gemini AI Civic Diagnosis & Recommended Action
                        </span>
                      </div>
                      <div className="text-xs font-bold text-emerald-800 bg-emerald-100/90 px-2.5 py-0.5 rounded-lg border border-emerald-300">
                        Estimated Budget: {prob.aiAnalysis?.estimatedBudget || '₹1,20,000'}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                      <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-100">
                        <span className="text-slate-400 block font-semibold">Recommended Department</span>
                        <span className="font-bold text-slate-800">{prob.aiAnalysis?.recommendedDepartment || 'Civil & Electrical Engineering Cell'}</span>
                      </div>
                      <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-100">
                        <span className="text-slate-400 block font-semibold">AI Engineering Summary</span>
                        <span className="font-bold text-emerald-900">{prob.aiAnalysis?.summary || 'Standard municipal engineering overhaul required.'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons: Verify Problem (Green) & Reject Problem (Red) */}
                  <div className="flex flex-wrap items-center justify-end gap-2.5 pt-1 border-t border-slate-100">
                    <button
                      onClick={() => onSelectProblem && onSelectProblem(prob.id)}
                      className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-500" />
                      <span>View Details</span>
                    </button>

                    <button
                      onClick={() => handleOpenVerifyModal(prob, 'rejected')}
                      className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition cursor-pointer shadow-xs flex items-center gap-1.5"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject Problem</span>
                    </button>

                    <button
                      onClick={() => handleOpenVerifyModal(prob, 'verified')}
                      className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs transition cursor-pointer shadow-xs flex items-center gap-1.5"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Verify Problem</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. COLLEGE REQUESTS & CLEAN AI RECOMMENDATION                              */}
      {/* ========================================================================= */}
      {activeView === 'requests' && (
        <div className="space-y-4">
          
          <div className="flex items-center justify-between px-1">
            <h2 className="text-base font-bold text-slate-900 font-heading">
              University Project Requests ({requestsList.filter(r => r.status === 'pending_approval').length} Pending)
            </h2>
            <span className="text-xs text-slate-500 font-medium">
              AI Match & Need-Based Budget Enabled
            </span>
          </div>

          <div className="space-y-3">
            {requestsList.map((req) => (
              <div
                key={req.id}
                className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 hover:border-slate-300 transition shadow-xs space-y-3"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 leading-snug">
                      {req.problemTitle}
                    </h3>
                    <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                      <span className="font-semibold text-slate-700">{req.university}</span>
                      <span>•</span>
                      <span>{req.teamName} ({req.teamLead})</span>
                      <span>•</span>
                      <span className="text-slate-400">{req.location}</span>
                    </div>
                  </div>

                  <div className="shrink-0">
                    {req.status === 'approved' ? (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                        ✓ Approved
                      </span>
                    ) : req.status === 'rejected' ? (
                      <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold">
                        ✕ Rejected
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
                        Pending Approval
                      </span>
                    )}
                  </div>
                </div>

                {/* Clean, short AI Recommendation Box */}
                <div className="bg-emerald-50/80 border border-emerald-200/90 rounded-xl p-3 text-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span className="font-extrabold text-emerald-900">
                        AI Recommendation: {req.aiMatchScore}% Match
                      </span>
                    </div>
                    <p className="text-[11px] text-emerald-800">
                      {req.aiShortReason}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Suggested Budget</span>
                      <span className="text-xs font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-300">
                        ₹{req.aiRecommendedBudget.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action buttons: View, Reject, Approve */}
                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    onClick={() => setSelectedRequest(req)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition cursor-pointer"
                  >
                    View
                  </button>

                  {req.status === 'pending_approval' && (
                    <>
                      <button
                        onClick={() => handleReject(req)}
                        className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition cursor-pointer shadow-xs"
                      >
                        Reject
                      </button>

                      <button
                        onClick={() => handleApprove(req)}
                        className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition cursor-pointer shadow-xs"
                      >
                        Approve (₹{req.aiRecommendedBudget.toLocaleString('en-IN')})
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. FUNDING VIEW                                                           */}
      {/* ========================================================================= */}
      {activeView === 'funding' && (
        <div className="space-y-6">
          
          {/* Simple Funding Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
              <span className="text-[10px] font-bold uppercase text-slate-400">Total CSR Received</span>
              <div className="text-2xl font-extrabold text-slate-900 mt-1">₹{(totalFundingReceived / 100000).toFixed(1)} Lakhs</div>
              <span className="text-[11px] text-slate-500">From 4 Industry Partners</span>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
              <span className="text-[10px] font-bold uppercase text-slate-400">Total Disbursed / Spent</span>
              <div className="text-2xl font-extrabold text-amber-700 mt-1">₹{(totalFundingSpent / 100000).toFixed(1)} Lakhs</div>
              <span className="text-[11px] text-slate-500">UC Audited Prototypes</span>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
              <span className="text-[10px] font-bold uppercase text-slate-400">Remaining Reserves</span>
              <div className="text-2xl font-extrabold text-emerald-700 mt-1">₹{(totalRemainingFunds / 100000).toFixed(1)} Lakhs</div>
              <span className="text-[11px] text-emerald-600 font-semibold">Ready for Allocation</span>
            </div>
          </div>

          {/* CSR Partner Grants Table */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Industry & CSR Funding Breakdown</h3>
            <div className="divide-y divide-slate-100 text-xs">
              {fundingLedger.map((csr) => (
                <div key={csr.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="font-bold text-slate-800 text-xs sm:text-sm">{csr.donor}</div>
                    <div className="text-[11px] text-slate-500">Sector: {csr.sector} • {csr.projectsCount} Sponsored Projects</div>
                  </div>
                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">Grant</span>
                      <span className="font-bold text-slate-900">₹{(csr.totalGrant / 100000).toFixed(1)}L</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">Spent</span>
                      <span className="font-bold text-amber-700">₹{(csr.spent / 100000).toFixed(1)}L</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">Remaining</span>
                      <span className="font-bold text-emerald-700">₹{(csr.remaining / 100000).toFixed(1)}L</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. PROGRESS VIEW (Simple Stats + University/Team/Project Status)          */}
      {/* ========================================================================= */}
      {activeView === 'progress' && (
        <div className="space-y-6">
          
          {/* Simple Clean Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Issues</span>
              <div className="text-2xl font-extrabold text-slate-900 mt-1">{Math.max(problems.length, 38)}</div>
              <span className="text-[11px] text-slate-500">Across Jharkhand</span>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Solved Problems</span>
              <div className="text-2xl font-extrabold text-emerald-700 mt-1">14</div>
              <span className="text-[11px] text-emerald-600 font-semibold">Community Verified</span>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Funding Received</span>
              <div className="text-2xl font-extrabold text-slate-900 mt-1">₹{(totalFundingReceived / 100000).toFixed(1)}L</div>
              <span className="text-[11px] text-slate-500">CSR & Govt Grants</span>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Remaining Funds</span>
              <div className="text-2xl font-extrabold text-teal-700 mt-1">₹{(totalRemainingFunds / 100000).toFixed(1)}L</div>
              <span className="text-[11px] text-teal-600 font-semibold">Available Balance</span>
            </div>
          </div>

          {/* University / Team / Project Status Table */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                University & Team Project Status
              </h3>
              <span className="text-xs text-slate-500">Showing {projectProgressList.length} Active Deployments</span>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {projectProgressList.map((prj) => (
                <div key={prj.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-xs sm:text-sm">{prj.title}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full ${
                        prj.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {prj.status}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      <strong>{prj.university}</strong> • {prj.team} • Budget: {prj.budget} (Spent: {prj.spent})
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-44 shrink-0">
                    <div className="flex-1">
                      <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-0.5">
                        <span>Progress</span>
                        <span>{prj.progressPercent}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            prj.progressPercent === 100 ? 'bg-emerald-600' : 'bg-blue-600'
                          }`}
                          style={{ width: `${prj.progressPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: VIEW PROPOSAL DETAILS                                              */}
      {/* ========================================================================= */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                Project Proposal Details ({selectedRequest.id})
              </h3>
              <button onClick={() => setSelectedRequest(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400">Problem Title</span>
              <div className="font-bold text-slate-900">{selectedRequest.problemTitle}</div>
              <div className="text-slate-500 text-[11px]">{selectedRequest.location}</div>
            </div>

            <div className="grid grid-cols-2 gap-2 bg-white p-3 rounded-xl border border-slate-200">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Institution</span>
                <span className="font-bold text-slate-800">{selectedRequest.university}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Team Lead</span>
                <span className="font-bold text-slate-800">{selectedRequest.teamLead}</span>
              </div>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-900">AI Match: {selectedRequest.aiMatchScore}%</span>
                <span className="font-extrabold text-emerald-800">Suggested Budget: ₹{selectedRequest.aiRecommendedBudget.toLocaleString('en-IN')}</span>
              </div>
              <p className="text-[11px] text-emerald-800 leading-relaxed">
                {selectedRequest.aiShortReason}
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedRequest(null)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 font-bold"
              >
                Close
              </button>
              {selectedRequest.status === 'pending_approval' && (
                <>
                  <button
                    onClick={() => handleReject(selectedRequest)}
                    className="px-3 py-1.5 rounded-xl bg-rose-600 text-white font-bold"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleApprove(selectedRequest)}
                    className="px-4 py-1.5 rounded-xl bg-emerald-600 text-white font-bold"
                  >
                    Approve
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: VERIFY PROBLEM REPORT (Verify / Reject)                             */}
      {/* ========================================================================= */}
      {verifyingProblem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShieldCheck className={`w-5 h-5 ${actionType === 'verified' ? 'text-emerald-600' : 'text-rose-600'}`} />
                <h3 className="text-base font-bold text-slate-900 font-heading">
                  {actionType === 'verified' ? 'Verify & Authorize Problem' : 'Reject Problem Report'}
                </h3>
              </div>
              <button onClick={() => setVerifyingProblem(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Problem Title</span>
              <div className="font-bold text-slate-900 text-xs sm:text-sm">{verifyingProblem.title}</div>
              <div className="text-[11px] text-slate-500">{verifyingProblem.location?.address || 'Jharkhand'}</div>
            </div>

            {actionType === 'verified' && (
              <div>
                <label className="block text-slate-700 font-bold mb-1">Sanctioned Municipal Grant Budget (₹)</label>
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-900 focus:outline-none focus:border-emerald-500 text-sm"
                />
              </div>
            )}

            <div>
              <label className="block text-slate-700 font-bold mb-1">Official Verification Remarks</label>
              <textarea
                rows={3}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>

            <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setVerifyingProblem(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmVerification}
                disabled={isProcessing}
                className={`px-5 py-2.5 rounded-xl font-bold text-white shadow-xs flex items-center gap-1.5 ${
                  actionType === 'verified'
                    ? 'bg-emerald-600 hover:bg-emerald-500'
                    : 'bg-rose-600 hover:bg-rose-500'
                }`}
              >
                {isProcessing ? (
                  <span>Processing...</span>
                ) : actionType === 'verified' ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Confirm & Authorize Verification</span>
                  </>
                ) : (
                  <>
                    <X className="w-4 h-4" />
                    <span>Confirm Rejection</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
