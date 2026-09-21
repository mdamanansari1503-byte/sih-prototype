import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import {
  PlusCircle,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  MapPin,
  Upload,
  ArrowRight,
  ShieldCheck,
  Send,
  Loader2,
  Navigation,
  Eye,
  Building2,
  Check,
  Star,
  Layers,
  Filter,
  Search,
  X
} from 'lucide-react';

export default function CitizenPortal({ problems = [], onProblemCreated, onSelectProblem, setActiveTab }) {
  const { currentUser } = useAuth();
  const { t } = useLanguage();

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportFilter, setReportFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Infrastructure & Public Safety');
  const [address, setAddress] = useState('Sector 4, Main Road, Bokaro');
  const [city, setCity] = useState('Bokaro');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitSuccessNotice, setSubmitSuccessNotice] = useState(null);

  const categories = [
    'Infrastructure & Public Safety',
    'Street Lighting & Electrical',
    'Drainage & Clean Water Supply',
    'Solid Waste & Sanitation',
    'Smart Education & School Facilities',
    'Roads & Pothole Hazards',
    'Healthcare & Environment'
  ];

  const handleAutoGPS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setAddress(`GPS Pin: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}, Jharkhand`);
        },
        () => {
          setAddress('Circular Road, Lalpur, Ranchi, Jharkhand');
        }
      );
    } else {
      setAddress('Main Road, Ranchi, Jharkhand');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description) return;

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('address', address);
      formData.append('city', city);
      formData.append('state', 'Jharkhand');
      formData.append('reportedById', currentUser?.id || 'user-cit-1');
      formData.append('reportedByName', currentUser?.name || 'Rahul Mishra');
      if (imageFile) {
        formData.append('media', imageFile);
      }
      if (imagePreview) {
        formData.append('imagePreview', imagePreview);
        formData.append('imageUrl', imagePreview);
      }

      const res = await api.createProblem(formData);
      if (res.success) {
        if (onProblemCreated) onProblemCreated(res.data);
        
        // Close the modal
        setIsReportModalOpen(false);

        // Reset form
        setTitle('');
        setDescription('');
        setImageFile(null);
        setImagePreview(null);
        setReportFilter('all');

        // Show brief success notice
        setSubmitSuccessNotice(`Report "${res.data.title}" submitted successfully! Gemini AI diagnosed urgency as ${res.data.aiAnalysis?.urgency || 'High'}.`);
        setTimeout(() => setSubmitSuccessNotice(null), 6000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Metrics calculation
  const totalReportsCount = problems.length;
  const pendingCount = problems.filter(p => p.status === 'pending_verification' || p.status === 'pending').length;
  const inProgressCount = problems.filter(p => p.status === 'in_progress' || p.status === 'verified').length;
  const completedCount = problems.filter(p => p.status === 'solved').length;

  // Filtered reports
  const filteredReports = problems.filter(p => {
    const matchesFilter =
      reportFilter === 'all' ||
      (reportFilter === 'pending' && (p.status === 'pending_verification' || p.status === 'pending')) ||
      (reportFilter === 'in_progress' && (p.status === 'in_progress' || p.status === 'verified')) ||
      (reportFilter === 'completed' && p.status === 'solved');

    const matchesSearch =
      !searchQuery ||
      p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location?.address?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16 font-sans text-slate-800 animate-fadeIn">
      
      {/* 1. TOP HEADER & METRIC SUMMARY CARDS */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Citizen Civic Diagnostics & Action Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
              Report an Issue
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Submit community problems for instant Gemini AI categorization and direct municipal verification.
            </p>
          </div>

          {/* "+ Report a Problem" Button opens Centered Modal */}
          <button
            onClick={() => setIsReportModalOpen(true)}
            className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2 cursor-pointer shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Report a Problem</span>
          </button>
        </div>

        {/* Success Alert Banner after submission */}
        {submitSuccessNotice && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center justify-between animate-fadeIn shadow-xs">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{submitSuccessNotice}</span>
            </div>
            <button onClick={() => setSubmitSuccessNotice(null)} className="text-emerald-700 hover:text-emerald-900">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* 4 Summary Metric Cards (Total, Pending, In Progress, Completed reports) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          
          {/* Card 1: Total Reports */}
          <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-xs hover:border-emerald-300 transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Reports</span>
              <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900 font-heading mt-3">
              {totalReportsCount}
            </div>
            <div className="text-[11px] text-slate-400 font-medium mt-0.5">All community submissions</div>
          </div>

          {/* Card 2: Pending / Under Review */}
          <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-xs hover:border-amber-300 transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Pending Reports</span>
              <div className="w-9 h-9 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-amber-700 font-heading mt-3">
              {pendingCount}
            </div>
            <div className="text-[11px] text-slate-400 font-medium mt-0.5">Awaiting verification</div>
          </div>

          {/* Card 3: In Progress */}
          <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-xs hover:border-blue-300 transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">In Progress</span>
              <div className="w-9 h-9 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-blue-700 font-heading mt-3">
              {inProgressCount}
            </div>
            <div className="text-[11px] text-slate-400 font-medium mt-0.5">Assigned to university teams</div>
          </div>

          {/* Card 4: Completed */}
          <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-xs hover:border-emerald-400 transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Completed</span>
              <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-emerald-700 font-heading mt-3">
              {completedCount}
            </div>
            <div className="text-[11px] text-slate-400 font-medium mt-0.5">Solved & ground certified</div>
          </div>

        </div>
      </div>

      {/* 2. MY REPORTS SECTION */}
      <div className="space-y-4">
        
        {/* Header & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-slate-200">
          <div>
            <h2 className="text-lg font-bold text-slate-900 font-heading">
              My Reports Catalogue
            </h2>
            <p className="text-xs text-slate-500">Track current status and updates for your submitted civic issues.</p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl text-xs font-bold overflow-x-auto">
            {[
              { id: 'all', label: 'All Reports' },
              { id: 'pending', label: 'Under Review' },
              { id: 'in_progress', label: 'In Progress' },
              { id: 'completed', label: 'Solved' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setReportFilter(tab.id)}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition cursor-pointer ${
                  reportFilter === tab.id
                    ? 'bg-white text-emerald-800 shadow-xs font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Reports Grid / Cards */}
        {filteredReports.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
            <FileText className="w-10 h-10 text-slate-300 mx-auto" />
            <div className="text-sm font-bold text-slate-700">No reports found in this category</div>
            <p className="text-xs text-slate-400">Click "+ Report a Problem" above to report a community issue.</p>
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Report a Problem</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredReports.map((prob) => {
              const isSolved = prob.status === 'solved';
              const isInProgress = prob.status === 'in_progress' || prob.status === 'verified';
              const isUnderReview = prob.status === 'pending_verification' || prob.status === 'pending';

              return (
                <div
                  key={prob.id}
                  onClick={() => onSelectProblem && onSelectProblem(prob.id)}
                  className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-2.5">
                    
                    {/* Top Row: Category & Status */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold text-[10px]">
                        {prob.category}
                      </span>

                      <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full border flex items-center gap-1.5 ${
                        isSolved
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : isInProgress
                          ? 'bg-blue-50 text-blue-800 border-blue-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${isSolved ? 'bg-emerald-500' : isInProgress ? 'bg-blue-500 animate-pulse' : 'bg-amber-500'}`} />
                        <span>{isSolved ? 'Solved' : isInProgress ? 'In Progress' : 'Under Review'}</span>
                      </span>
                    </div>

                    {/* Title & Description */}
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition">
                        {prob.title}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                        {prob.description}
                      </p>
                    </div>

                  </div>

                  {/* Footer Info */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate max-w-[180px]">{prob.location?.address || prob.location?.city || 'Jharkhand'}</span>
                    </div>

                    <div className="flex items-center gap-1 text-emerald-700 font-bold text-xs group-hover:translate-x-0.5 transition-transform">
                      <span>View Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* 3. CENTERED REPORT PROBLEM POPUP MODAL                                    */}
      {/* ========================================================================= */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-2xl max-w-2xl w-full space-y-5 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-bold text-slate-900 font-heading">
                  Submit a Civic Issue
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Include clear details and location for automated AI diagnosis and verification.
                </p>
              </div>
              <button
                onClick={() => setIsReportModalOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                title="Close Form"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              {/* Title */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">Issue Title *</label>
                <input
                  type="text"
                  required
                  placeholder="E.g. Broken solar light poles & dark walking corridor near school"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none text-slate-900 font-medium text-xs sm:text-sm bg-slate-50/50 focus:bg-white transition"
                />
              </div>

              {/* Category & City Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none text-slate-900 font-medium text-xs bg-slate-50/50 focus:bg-white transition cursor-pointer"
                  >
                    {categories.map((c, i) => (
                      <option key={i} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">City / District *</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none text-slate-900 font-medium text-xs bg-slate-50/50 focus:bg-white transition cursor-pointer"
                  >
                    <option value="Ranchi">Ranchi</option>
                    <option value="Bokaro">Bokaro</option>
                    <option value="Dhanbad">Dhanbad</option>
                    <option value="Jamshedpur">Jamshedpur</option>
                    <option value="Hazaribagh">Hazaribagh</option>
                    <option value="Deoghar">Deoghar</option>
                  </select>
                </div>
              </div>

              {/* Location with Auto GPS */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-slate-700 font-bold">Specific Location / Address *</label>
                  <button
                    type="button"
                    onClick={handleAutoGPS}
                    className="text-[11px] text-emerald-700 font-bold flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <Navigation className="w-3.5 h-3.5" /> Use My GPS Location
                  </button>
                </div>
                <input
                  type="text"
                  required
                  placeholder="Enter ward, street landmark, or click GPS"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none text-slate-900 font-medium text-xs bg-slate-50/50 focus:bg-white transition"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">Problem Description *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe what is broken, how long it has been an issue, community impact, and safety hazards..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none text-slate-900 font-medium text-xs bg-slate-50/50 focus:bg-white transition"
                />
              </div>

              {/* Photo Upload */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">Photo Evidence (Optional)</label>
                <div className="border-2 border-dashed border-slate-200 hover:border-emerald-400 rounded-xl p-4 text-center bg-slate-50/50 hover:bg-slate-50 transition cursor-pointer relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  {imagePreview ? (
                    <div className="flex flex-col items-center">
                      <img src={imagePreview} alt="Preview" className="w-28 h-20 object-cover rounded-lg border border-slate-200 mb-1" />
                      <span className="text-xs font-bold text-emerald-700">Photo Attached (Click to change)</span>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                      <div className="text-xs font-bold text-slate-700">Upload on-site photo proof</div>
                      <div className="text-[10px] text-slate-400">PNG, JPG (Max 10MB)</div>
                    </>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsReportModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Analyzing with Gemini AI...</span>
                    </>
                  ) : (
                    <span>Submit Problem & Run AI Diagnosis →</span>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
