import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  Search,
  Filter,
  MapPin,
  ThumbsUp,
  ArrowRight,
  GraduationCap,
  Building,
  CheckCircle2,
  Clock,
  Sparkles,
  CameraOff,
  Image as ImageIcon
} from 'lucide-react';

export default function PublicExplorer({ problems = [], projects = [], onSelectProblem, onSelectProject, onProblemUpdated, onOpenProfile, initialSearch = '' }) {
  const { currentUser } = useAuth();

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCity, setSelectedCity] = useState('all');

  const filteredProblems = problems.filter(p => {
    const matchesSearch =
      !searchTerm ||
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.location?.city?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      selectedStatus === 'all' ||
      (selectedStatus === 'pending_verification' && (p.status === 'pending_verification' || p.status === 'pending')) ||
      (selectedStatus === 'verified' && p.status === 'verified') ||
      (selectedStatus === 'in_progress' && p.status === 'in_progress') ||
      (selectedStatus === 'solved' && p.status === 'solved');

    const matchesCity =
      selectedCity === 'all' ||
      p.location?.city?.toLowerCase() === selectedCity.toLowerCase();

    return matchesSearch && matchesStatus && matchesCity;
  });

  const handleUpvote = async (problemId, e) => {
    e.stopPropagation();
    try {
      const res = await api.upvoteProblem(problemId, currentUser?.id || 'user-cit-1');
      if (res.success && onProblemUpdated) {
        onProblemUpdated(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleReporterClick = (prob, e) => {
    e.stopPropagation();
    if (!onOpenProfile) return;
    const reporterName = prob.reportedByName || (prob.reportedBy && typeof prob.reportedBy === 'string' ? prob.reportedBy : 'Rahul Mishra');
    const userProblems = problems.filter(p => (p.reportedByName === reporterName || p.reportedBy === reporterName));
    const solvedCount = userProblems.filter(p => p.status === 'solved').length;

    onOpenProfile({
      type: 'citizen',
      name: reporterName,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
      location: `${prob.location?.city || 'Ranchi'}, Jharkhand`,
      email: `${reporterName.toLowerCase().replace(/\s+/g, '')}@awaazgram.org`,
      phone: '+91 98765 43210',
      submittedCount: Math.max(userProblems.length, 3),
      solvedCount: Math.max(solvedCount, 2),
      rating: '4.9 ★',
      bio: `Dedicated citizen contributor from ${prob.location?.city || 'Jharkhand'} actively reporting ground civic grievances and validating solution deployments.`,
      problems: userProblems.length > 0 ? userProblems.map(p => ({
        id: p.id,
        title: p.title,
        category: p.category,
        status: p.status,
        date: p.reportedAt || '2026-03-20'
      })) : undefined
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16 text-slate-800 animate-fadeIn">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-heading">
            Track Issues & Projects
          </h1>
          <p className="text-xs text-slate-500">
            Public real-time registry of civic complaints, government verifications, and university solutions.
          </p>
        </div>

        <div className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
          ● {filteredProblems.length} Active Challenges
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-3xl border border-slate-200 p-4 shadow-sm space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search problems by title, keywords or location (e.g. street light, water logging, Bhopal)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] text-slate-400 font-bold mr-1">Status:</span>
            {[
              { id: 'all', label: 'All Issues' },
              { id: 'pending_verification', label: 'Under Review' },
              { id: 'verified', label: 'Verified' },
              { id: 'in_progress', label: 'In Progress' },
              { id: 'solved', label: 'Solved' },
            ].map(s => (
              <button
                key={s.id}
                onClick={() => setSelectedStatus(s.id)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition cursor-pointer ${
                  selectedStatus === s.id
                    ? 'bg-emerald-600 text-white font-bold shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="text-xs bg-slate-100 border-none rounded-xl px-2.5 py-1 text-slate-700 font-semibold focus:ring-1 focus:ring-emerald-500"
            >
              <option value="all">All Locations</option>
              <option value="Ranchi">Ranchi</option>
              <option value="Bokaro">Bokaro</option>
              <option value="Dhanbad">Dhanbad</option>
              <option value="Jamshedpur">Jamshedpur</option>
              <option value="Bhopal">Bhopal</option>
              <option value="Pune">Pune</option>
            </select>
          </div>
        </div>
      </div>

      {/* Problem Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredProblems.map(prob => {
          const hasUpvoted = prob.upvotedBy?.includes(currentUser?.id);
          const isSolved = prob.status === 'solved';
          const isInProgress = prob.status === 'in_progress';
          const reporterName = prob.reportedByName || (prob.reportedBy && typeof prob.reportedBy === 'string' ? prob.reportedBy : 'Rahul Mishra');

          return (
            <div
              key={prob.id}
              onClick={() => onSelectProblem && onSelectProblem(prob.id)}
              className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                {/* Image or No Photo Placeholder */}
                <div className="h-40 relative bg-slate-100 overflow-hidden flex items-center justify-center">
                  {prob.images && prob.images.length > 0 && prob.images[0] ? (
                    <img
                      src={prob.images[0]}
                      alt={prob.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-100 flex flex-col items-center justify-center text-slate-400 gap-1.5 p-4 text-center">
                      <CameraOff className="w-6 h-6 text-slate-400 stroke-[1.5]" />
                      <span className="text-[11px] font-bold text-slate-500">No Photo Uploaded</span>
                      <span className="text-[9px] text-slate-400">GPS verified grievance</span>
                    </div>
                  )}

                  <div className="absolute top-3 left-3">
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase shadow-xs ${
                      isSolved
                        ? 'bg-emerald-600 text-white'
                        : isInProgress
                        ? 'bg-blue-600 text-white'
                        : 'bg-orange-500 text-white'
                    }`}>
                      {isSolved ? 'Solved' : isInProgress ? 'In Progress' : 'Under Review'}
                    </span>
                  </div>

                  <button
                    onClick={(e) => handleUpvote(prob.id, e)}
                    className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-slate-800 text-[11px] font-bold flex items-center gap-1 hover:bg-white shadow-xs"
                  >
                    <ThumbsUp className="w-3 h-3 text-emerald-600" />
                    <span>{prob.upvotes || 0}</span>
                  </button>
                </div>

                {/* Body */}
                <div className="p-4 space-y-2">
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition leading-snug line-clamp-2">
                    {prob.title}
                  </h3>

                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                    {prob.description}
                  </p>

                  <div className="text-[10px] text-slate-400 flex items-center gap-1 pt-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{prob.location?.address || 'Ward 12, Bhopal'}, {prob.location?.city || 'Bhopal'}</span>
                  </div>
                </div>
              </div>

              {/* Card Footer with Visible & Clickable Citizen Reporter */}
              <div className="p-4 pt-0 space-y-2">
                <div
                  onClick={(e) => handleReporterClick(prob, e)}
                  className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200/80 hover:border-emerald-200 transition cursor-pointer group/rep"
                  title="Click to view Citizen Contributor Profile"
                >
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"
                    alt={reporterName}
                    className="w-5 h-5 rounded-full object-cover ring-1 ring-emerald-500/40"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-bold text-slate-800 group-hover/rep:text-emerald-700 truncate">
                      Reported by: <span className="underline decoration-emerald-400 font-extrabold">{reporterName}</span>
                    </div>
                  </div>
                  <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    Citizen
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="text-[10px]">#{prob.id.toUpperCase()}</span>
                  <span className="text-emerald-700 font-bold flex items-center gap-1 text-[11px]">
                    <span>View Timeline</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
