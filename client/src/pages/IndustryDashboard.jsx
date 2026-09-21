import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Briefcase,
  Sparkles,
  HeartHandshake,
  DollarSign,
  Award,
  CheckCircle2,
  TrendingUp,
  MapPin,
  X,
  Building,
  ShieldCheck,
  History,
  Activity,
  Layers,
  FileCheck2,
  ArrowRight,
  Landmark,
  Check,
  Search,
  Filter,
  Info
} from 'lucide-react';

export default function IndustryDashboard({
  projects = [],
  problems = [],
  onProjectUpdated,
  onProblemUpdated,
  onSelectProject,
  onSelectProblem,
  setActiveTab
}) {
  const { currentUser } = useAuth();

  // 3 In-Page Views: 'sponsor' (Sponsor Projects), 'history' (Funding History), 'utilization' (Track Fund Utilization)
  const [activeView, setActiveView] = useState('sponsor');
  const [selectedProjectForFunding, setSelectedProjectForFunding] = useState(null);
  const [sponsorAmount, setSponsorAmount] = useState(75000);
  const [csrProgramName, setCsrProgramName] = useState('Tata Steel CSR - Rural Water & Sanitation Grant');
  const [isTransferring, setIsTransferring] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDomain, setFilterDomain] = useState('all');

  // Baseline verified projects for CSR catalogue
  const defaultSponsorableProjects = [
    {
      id: 'SPON-01',
      title: 'Drinking Water Fluoride Filtration Unit in Tupudana',
      district: 'Ranchi District',
      location: 'Tupudana Industrial Area, Ranchi',
      domain: 'Water Sanitation',
      university: 'BIT Mesra, Ranchi',
      team: 'Jal-Shakti Innovation Cell',
      govtMatchingFund: 45000,
      industryFundNeeded: 75000,
      totalBudget: 120000,
      impact: 'Restores safe drinking water for 4,200 villagers',
      status: 'verified_needing_csr',
      img: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?w=400'
    },
    {
      id: 'SPON-02',
      title: 'Solar Microgrid & Health Clinic Backup Power',
      district: 'Ranchi District',
      location: 'Angara Tribal Block, Ranchi',
      domain: 'Renewable Energy',
      university: 'IIT ISM Dhanbad',
      team: 'Urja Vikas Taskforce',
      govtMatchingFund: 35000,
      industryFundNeeded: 50000,
      totalBudget: 85000,
      impact: '24x7 continuous power for rural primary health center',
      status: 'verified_needing_csr',
      img: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=400'
    },
    {
      id: 'SPON-03',
      title: 'Bundu Rural Culvert Foundation Soil Stabilization',
      district: 'Ranchi / Bundu',
      location: 'Bundu Sub-Division, NH-33 Link',
      domain: 'Infrastructure',
      university: 'NIT Jamshedpur',
      team: 'Setu Nirman Squad',
      govtMatchingFund: 60000,
      industryFundNeeded: 120000,
      totalBudget: 180000,
      impact: 'Prevents monsoon flash flood road collapse',
      status: 'verified_needing_csr',
      img: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400'
    },
    {
      id: 'SPON-04',
      title: 'Offline STEM & AI Smart Learning Lab for Tribal Girls',
      district: 'Dumka District',
      location: 'Government High School, Dumka',
      domain: 'Smart Education',
      university: 'Ranchi University',
      team: 'Edutech Innovators',
      govtMatchingFund: 50000,
      industryFundNeeded: 90000,
      totalBudget: 140000,
      impact: 'Empowers 650 tribal girls with digital STEM kits',
      status: 'verified_needing_csr',
      img: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400'
    }
  ];

  // Dynamically merge user-reported citizen problems and active projects into sponsor list
  const dynamicProblemsList = (problems || []).map((p) => {
    const rawBudget = p.verification?.allocatedBudget || (p.aiAnalysis?.estimatedBudget ? parseInt(String(p.aiAnalysis.estimatedBudget).replace(/\D/g, '')) : 120000) || 120000;
    const govtShare = Math.round(rawBudget * 0.4);
    const indShare = Math.round(rawBudget * 0.6);
    const loc = typeof p.location === 'object' ? `${p.location?.address || p.location?.city || 'Ranchi'}, ${p.location?.state || 'Jharkhand'}` : (p.location || 'Jharkhand');
    const district = (typeof p.location === 'object' && p.location?.city) ? `${p.location.city} District` : 'Jharkhand District';
    const uni = p.adoptionRequest?.universityName || (p.status === 'adopted' || p.status === 'in_progress' ? 'MANIT Innovation Hub' : 'BIT Mesra / Jharkhand Innovation Cell');
    const tm = p.adoptionRequest?.teamName || (p.status === 'adopted' || p.status === 'in_progress' ? 'Student Engineering Squad' : 'Campus Innovation Taskforce');
    const imgUrl = (p.images && p.images.length > 0) ? p.images[0] : 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400';

    return {
      id: p.id || `PROB-${Math.random()}`,
      title: p.title || 'Civic Problem Resolution Project',
      district: district,
      location: loc,
      domain: p.category || 'Civic Infrastructure',
      university: uni,
      team: tm,
      govtMatchingFund: govtShare,
      industryFundNeeded: indShare,
      totalBudget: rawBudget,
      impact: p.aiAnalysis?.summary || 'Direct community benefit with student-engineered hardware deployment.',
      status: p.status || 'reported',
      img: imgUrl,
      rawProblem: p
    };
  });

  // Filter out any duplicates if problem id already exists
  const combinedSponsorable = [
    ...dynamicProblemsList,
    ...defaultSponsorableProjects.filter(dp => !dynamicProblemsList.some(dp2 => dp2.id === dp.id || dp2.title.toLowerCase() === dp.title.toLowerCase()))
  ];

  // Funding History Ledger (Project, Govt Funding, Industry Funding, Total, Recipient Team)
  const [fundingHistory, setFundingHistory] = useState([
    {
      id: 'HIST-JH-101',
      projectTitle: 'Tupudana Fluoride Water Filtration System',
      problemRef: '#PROB-JH-8821',
      govtFunding: 45000,
      industryFunding: 75000,
      totalAmount: 120000,
      recipientUniversity: 'BIT Mesra, Ranchi',
      recipientTeam: 'Jal-Shakti Innovation Cell',
      industryPartner: currentUser?.organization || 'Tata Steel CSR Trust',
      date: '2026-03-12',
      escrowStatus: 'Government Escrow Cleared',
      route: 'Industry ➔ Jharkhand Govt Treasury ➔ BIT Mesra Lab'
    },
    {
      id: 'HIST-JH-102',
      projectTitle: 'Angara Tribal Solar Microgrid Restoration',
      problemRef: '#PROB-JH-8824',
      govtFunding: 35000,
      industryFunding: 50000,
      totalAmount: 85000,
      recipientUniversity: 'IIT ISM Dhanbad',
      recipientTeam: 'Urja Vikas Taskforce',
      industryPartner: currentUser?.organization || 'Bokaro Steel Plant (SAIL CSR)',
      date: '2026-03-15',
      escrowStatus: 'Government Escrow Cleared',
      route: 'Industry ➔ Jharkhand Govt Treasury ➔ IIT ISM Lab'
    },
    {
      id: 'HIST-JH-103',
      projectTitle: 'Subarnarekha River Flood IoT Warning Network',
      problemRef: '#PROB-JH-8790',
      govtFunding: 60000,
      industryFunding: 150000,
      totalAmount: 210000,
      recipientUniversity: 'NIT Jamshedpur',
      recipientTeam: 'HydroSense Team',
      industryPartner: currentUser?.organization || 'Tata Steel CSR Trust',
      date: '2026-02-28',
      escrowStatus: 'Government Escrow Cleared',
      route: 'Industry ➔ Jharkhand Govt Treasury ➔ NIT Jamshedpur'
    }
  ]);

  // Fund Utilization & Expense Tracking Data
  const [utilizationData, setUtilizationData] = useState([
    {
      id: 'UTIL-01',
      projectTitle: 'Tupudana Fluoride Water Filtration System',
      recipientTeam: 'BIT Mesra (Jal-Shakti Innovation Cell)',
      totalGrant: 120000,
      industryShare: 75000,
      govtShare: 45000,
      spentAmount: 82000,
      progressPercent: 70,
      milestone: 'Phase 2: On-site Nano-Filter Fabrication & Village Piping',
      ucStatus: 'Verified (Audited by Municipal Cell)',
      expensesBreakdown: [
        { item: 'Ceramic Nano-Filtration Membranes', cost: 38000, vendor: 'Adarsh Lab Instruments' },
        { item: 'IoT Real-time Water Quality Sensors', cost: 22000, vendor: 'RoboTech Jharkhand' },
        { item: 'Stainless Steel Frame & Piping', cost: 14000, vendor: 'Tupudana Metal Works' },
        { item: 'Student Field Testing Stipend', cost: 8000, vendor: 'BIT Mesra Student Cell' }
      ]
    },
    {
      id: 'UTIL-02',
      projectTitle: 'Angara Tribal Solar Microgrid Restoration',
      recipientTeam: 'IIT ISM Dhanbad (Urja Vikas Taskforce)',
      totalGrant: 85000,
      industryShare: 50000,
      govtShare: 35000,
      spentAmount: 42000,
      progressPercent: 50,
      milestone: 'Phase 1: Hybrid MPPT Inverter & IoT Battery Telemetry Installed',
      ucStatus: 'In Audit (92% Invoices Submitted)',
      expensesBreakdown: [
        { item: 'Hybrid MPPT Solar Charge Controller', cost: 24000, vendor: 'Jharkhand Solar Systems' },
        { item: 'Battery Telemetry & SIM Gateway', cost: 12000, vendor: 'IoT Devices India' },
        { item: 'High-grade Copper Busbars & Wiring', cost: 6000, vendor: 'Ranchi Electricals' }
      ]
    },
    {
      id: 'UTIL-03',
      projectTitle: 'Subarnarekha River Flood IoT Warning Network',
      recipientTeam: 'NIT Jamshedpur (HydroSense Team)',
      totalGrant: 210000,
      industryShare: 150000,
      govtShare: 60000,
      spentAmount: 205000,
      progressPercent: 100,
      milestone: 'Phase 3: Completed & 24x7 Siren Siren Connected to District Collectorate',
      ucStatus: '100% Certified & Publicly Audited',
      expensesBreakdown: [
        { item: 'Ultrasonic River Depth Radars (3 Units)', cost: 95000, vendor: 'GeoSense India' },
        { item: 'Solar Powered Siren Alarm Nodes', cost: 65000, vendor: 'ElectroMesh Solutions' },
        { item: 'District Control Room Cloud Gateway', cost: 30000, vendor: 'CloudServer Jamshedpur' },
        { item: 'Community Training & Field Testing', cost: 15000, vendor: 'NIT Jamshedpur Field Ops' }
      ]
    }
  ]);

  const handleOpenFundingModal = (project) => {
    setSelectedProjectForFunding(project);
    setSponsorAmount(project.industryFundNeeded);
  };

  const handleConfirmTransfer = (e) => {
    e.preventDefault();
    if (!selectedProjectForFunding) return;

    setIsTransferring(true);
    setTimeout(() => {
      const partnerName = currentUser?.organization || 'Tata Steel CSR Trust';
      const pledgeAmount = Number(sponsorAmount);
      const today = new Date().toISOString().split('T')[0];

      const newHistoryItem = {
        id: `HIST-JH-${Math.floor(100 + Math.random() * 900)}`,
        projectTitle: selectedProjectForFunding.title,
        problemRef: selectedProjectForFunding.rawProblem?.id ? `#${selectedProjectForFunding.rawProblem.id}` : `#PROB-JH-${Math.floor(1000 + Math.random() * 9000)}`,
        govtFunding: selectedProjectForFunding.govtMatchingFund,
        industryFunding: pledgeAmount,
        totalAmount: selectedProjectForFunding.govtMatchingFund + pledgeAmount,
        recipientUniversity: selectedProjectForFunding.university,
        recipientTeam: selectedProjectForFunding.team,
        industryPartner: partnerName,
        date: today,
        escrowStatus: 'Government Escrow Cleared',
        route: `Industry ➔ Jharkhand Govt Treasury ➔ ${selectedProjectForFunding.university}`
      };

      const newUtilizationItem = {
        id: `UTIL-0${utilizationData.length + 1}`,
        projectTitle: selectedProjectForFunding.title,
        recipientTeam: `${selectedProjectForFunding.university} (${selectedProjectForFunding.team})`,
        totalGrant: selectedProjectForFunding.govtMatchingFund + pledgeAmount,
        industryShare: pledgeAmount,
        govtShare: selectedProjectForFunding.govtMatchingFund,
        spentAmount: 0,
        progressPercent: 20,
        milestone: 'Phase 1: Grant Disbursed through Govt Escrow • Procurement Initiated',
        ucStatus: 'Escrow Released to University Lab',
        expensesBreakdown: [
          { item: 'Initial Equipment & Raw Material Procurement', cost: Math.round(pledgeAmount * 0.5), vendor: 'Pending Invoice' },
          { item: 'Sensor & Prototyping Allocation', cost: Math.round(pledgeAmount * 0.3), vendor: 'Pending Invoice' }
        ]
      };

      // If this corresponds to a citizen problem, update problem object with industry pledge
      if (selectedProjectForFunding.rawProblem && onProblemUpdated) {
        const existingPledges = selectedProjectForFunding.rawProblem.industryPledges || [];
        const updatedProblem = {
          ...selectedProjectForFunding.rawProblem,
          industryPledges: [
            ...existingPledges,
            {
              partner: partnerName,
              amount: pledgeAmount,
              date: new Date().toISOString(),
              status: 'Escrow Cleared'
            }
          ]
        };
        onProblemUpdated(updatedProblem);
      }

      // If this corresponds to an active project, update project budget and industry sponsor
      if (selectedProjectForFunding.rawProject && onProjectUpdated) {
        const updatedProj = {
          ...selectedProjectForFunding.rawProject,
          industrySponsor: partnerName,
          industryGrant: pledgeAmount,
          allocatedBudget: (selectedProjectForFunding.rawProject.allocatedBudget || 0) + pledgeAmount
        };
        onProjectUpdated(updatedProj);
      }

      setFundingHistory(prev => [newHistoryItem, ...prev]);
      setUtilizationData(prev => [newUtilizationItem, ...prev]);
      setIsTransferring(false);
      setSelectedProjectForFunding(null);

      alert(`₹${pledgeAmount.toLocaleString('en-IN')} CSR funding successfully routed through Jharkhand Government Treasury Escrow to ${selectedProjectForFunding.university} (${selectedProjectForFunding.team})!`);
      setActiveView('history');
    }, 900);
  };

  const filteredProjects = combinedSponsorable.filter(p => {
    const matchesSearch = (p.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (p.location || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (p.university || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDomain = filterDomain === 'all' || (p.domain || '').toLowerCase().includes(filterDomain.toLowerCase());
    return matchesSearch && matchesDomain;
  });

  return (
    <div className="space-y-6 pb-16">
      
      {/* Top Banner & Sub-Tabs Header */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-emerald-700" />
                Industry & Corporate CSR Partner Portal
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                {currentUser?.organization || 'Tata Steel CSR Trust'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
              Sponsor Civic Innovations
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Co-fund verified engineering projects with Government matching grants and monitor transparent, audited fund utilization in real time.
            </p>
          </div>

          {/* 3 Sub-Tabs: Sponsor Projects | Funding History | Track Fund Utilization */}
          <div className="flex bg-slate-100 p-1.5 rounded-2xl text-xs font-bold shrink-0 self-start lg:self-center">
            <button
              onClick={() => setActiveView('sponsor')}
              className={`px-4 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-2 ${
                activeView === 'sponsor'
                  ? 'bg-emerald-700 text-white shadow-xs font-extrabold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Sponsor Projects</span>
              <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-emerald-800 text-emerald-100">
                {combinedSponsorable.length}
              </span>
            </button>

            <button
              onClick={() => setActiveView('history')}
              className={`px-4 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-2 ${
                activeView === 'history'
                  ? 'bg-emerald-700 text-white shadow-xs font-extrabold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <History className="w-4 h-4" />
              <span>Funding History</span>
            </button>

            <button
              onClick={() => setActiveView('utilization')}
              className={`px-4 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-2 ${
                activeView === 'utilization'
                  ? 'bg-emerald-700 text-white shadow-xs font-extrabold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Track Fund Utilization</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. SPONSOR PROJECTS VIEW (Verified Projects Needing Funding)              */}
      {/* ========================================================================= */}
      {activeView === 'sponsor' && (
        <div className="space-y-6">
          
          {/* Government Co-Funding & Escrow Explainer Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white rounded-3xl p-6 shadow-sm relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Government Treasury Co-Funding & Oversight Active
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold font-heading">
                  Transparent CSR Routing Through State Municipal Escrow
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Every project listed below is inspected on the ground and pre-approved by the District Smart Cell with committed Government matching grants. When you sponsor, your CSR grant is securely transferred through Government escrow directly to the university innovation lab.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center shrink-0">
                <div className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider">CSR Compliance</div>
                <div className="text-lg font-extrabold text-white mt-0.5">Schedule VII</div>
                <div className="text-[10px] text-slate-300">100% Audited & 80G Certified</div>
              </div>
            </div>
          </div>

          {/* Search & Domain Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search verified projects, universities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-emerald-500 focus:bg-white"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-bold text-slate-500">Domain:</span>
              <select
                value={filterDomain}
                onChange={(e) => setFilterDomain(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-slate-50 focus:outline-none focus:border-emerald-500"
              >
                <option value="all">All Domains</option>
                <option value="Water">Water Sanitation</option>
                <option value="Energy">Renewable Energy</option>
                <option value="Infrastructure">Infrastructure</option>
                <option value="Education">Smart Education</option>
              </select>
            </div>
          </div>

          {/* Projects Needing Funding Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredProjects.map((proj) => (
              <div
                key={proj.id}
                className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden hover:border-slate-300 transition-all shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-44 bg-slate-900 overflow-hidden">
                    <img
                      src={proj.img}
                      alt={proj.title}
                      className="w-full h-full object-cover opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-600/90 text-white text-[10px] font-extrabold uppercase tracking-wider backdrop-blur-xs">
                        {proj.domain}
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <div className="text-xs font-semibold text-emerald-300 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{proj.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 space-y-3.5">
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug font-heading">
                      {proj.title}
                    </h3>

                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold text-slate-400">Assigned University</span>
                        <span className="font-bold text-slate-800">{proj.university}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold text-slate-400">Student Innovation Squad</span>
                        <span className="font-medium text-slate-700">{proj.team}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      <strong>Target Community Impact:</strong> {proj.impact}
                    </p>

                    {/* Financial matching grid */}
                    <div className="grid grid-cols-2 gap-2 bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-200/80 text-xs">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-emerald-800 block">Govt Grant Sanctioned</span>
                        <span className="font-extrabold text-emerald-900 text-sm">₹{proj.govtMatchingFund.toLocaleString('en-IN')}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-600 block">Required CSR Sponsorship</span>
                        <span className="font-extrabold text-emerald-700 text-sm">₹{proj.industryFundNeeded.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <button
                    onClick={() => handleOpenFundingModal(proj)}
                    className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs transition shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Landmark className="w-4 h-4" />
                    <span>Send Funding through Government (₹{proj.industryFundNeeded.toLocaleString('en-IN')})</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. FUNDING HISTORY VIEW                                                   */}
      {/* ========================================================================= */}
      {activeView === 'history' && (
        <div className="space-y-6">
          
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-heading">
                  Corporate CSR Funding History
                </h3>
                <p className="text-xs text-slate-500">
                  Complete audit record of CSR grants routed through Jharkhand Government Treasury with matching allocations.
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                {fundingHistory.length} Projects Sponsored
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3.5 pl-4">Project & Reference</th>
                    <th className="p-3.5">Recipient University / Team</th>
                    <th className="p-3.5 text-right">Government Matching</th>
                    <th className="p-3.5 text-right">Industry CSR Grant</th>
                    <th className="p-3.5 text-right font-extrabold">Total Project Fund</th>
                    <th className="p-3.5 pr-4 text-center">Escrow Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {fundingHistory.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition">
                      <td className="p-3.5 pl-4">
                        <div className="font-bold text-slate-900 text-xs sm:text-sm">{item.projectTitle}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{item.id} • {item.date}</div>
                      </td>
                      <td className="p-3.5">
                        <div className="font-bold text-slate-800">{item.recipientUniversity}</div>
                        <div className="text-[11px] text-slate-500">{item.recipientTeam}</div>
                      </td>
                      <td className="p-3.5 text-right font-semibold text-blue-700">
                        ₹{item.govtFunding.toLocaleString('en-IN')}
                      </td>
                      <td className="p-3.5 text-right font-bold text-emerald-700">
                        ₹{item.industryFunding.toLocaleString('en-IN')}
                      </td>
                      <td className="p-3.5 text-right font-extrabold text-slate-900">
                        ₹{item.totalAmount.toLocaleString('en-IN')}
                      </td>
                      <td className="p-3.5 pr-4 text-center">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          {item.escrowStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. TRACK FUND UTILIZATION VIEW                                            */}
      {/* ========================================================================= */}
      {activeView === 'utilization' && (
        <div className="space-y-6">
          
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-heading">
                  Project-Wise Fund Utilization & Milestone Auditing
                </h3>
                <p className="text-xs text-slate-500">
                  Track how your CSR contributions and Government matching grants are utilized by student innovation teams.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {utilizationData.map((proj) => {
                const utilizationPercent = Math.round((proj.spentAmount / proj.totalGrant) * 100);
                return (
                  <div
                    key={proj.id}
                    className="border border-slate-200 rounded-3xl p-5 sm:p-6 bg-slate-50/40 space-y-4 hover:border-slate-300 transition"
                  >
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm sm:text-base font-bold text-slate-900">{proj.projectTitle}</h4>
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700">
                            {proj.id}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          Recipient Team: <strong>{proj.recipientTeam}</strong>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-xs font-bold">
                        <div className="text-right">
                          <span className="text-[10px] uppercase text-slate-400 block font-bold">Total Grant</span>
                          <span className="text-slate-900 text-sm">₹{proj.totalGrant.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] uppercase text-slate-400 block font-bold">Disbursed & Spent</span>
                          <span className="text-amber-700 text-sm">₹{proj.spentAmount.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar & Milestone */}
                    <div className="space-y-1.5 bg-white p-4 rounded-2xl border border-slate-200">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs font-semibold text-slate-700 gap-1">
                        <div>Current Milestone: <strong className="text-emerald-800">{proj.milestone}</strong></div>
                        <div className="text-slate-500">Utilization: {utilizationPercent}% • <strong>{proj.ucStatus}</strong></div>
                      </div>
                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden mt-1">
                        <div
                          className="h-full bg-emerald-600 rounded-full transition-all"
                          style={{ width: `${utilizationPercent}%` }}
                        />
                      </div>
                    </div>

                    {/* Itemized Expenses Breakdown Table */}
                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                      <div className="px-4 py-2.5 bg-slate-100/60 border-b border-slate-200 text-[11px] font-bold text-slate-600 flex justify-between">
                        <span>Itemized Expenditure Breakdown & Vendor Invoices</span>
                        <span>Audited Cost (₹)</span>
                      </div>
                      <div className="divide-y divide-slate-100 text-xs">
                        {proj.expensesBreakdown.map((exp, idx) => (
                          <div key={idx} className="px-4 py-2.5 flex items-center justify-between">
                            <div>
                              <span className="font-semibold text-slate-800">{exp.item}</span>
                              <span className="text-[11px] text-slate-400 block">Vendor: {exp.vendor}</span>
                            </div>
                            <span className="font-bold text-slate-900">₹{exp.cost.toLocaleString('en-IN')}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: SEND FUNDING THROUGH GOVERNMENT ESCROW                             */}
      {/* ========================================================================= */}
      {selectedProjectForFunding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Landmark className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900 font-heading">
                  Transfer Funding via Government Escrow
                </h3>
              </div>
              <button
                onClick={() => setSelectedProjectForFunding(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400">Target Project</span>
              <div className="text-xs font-bold text-slate-900">{selectedProjectForFunding.title}</div>
              <div className="text-[11px] text-slate-500">
                Beneficiary: <strong>{selectedProjectForFunding.university}</strong> ({selectedProjectForFunding.team})
              </div>
            </div>

            {/* Escrow routing visualization */}
            <div className="bg-emerald-50/90 p-3.5 rounded-2xl border border-emerald-200 text-xs space-y-2">
              <span className="text-[10px] font-bold uppercase text-emerald-800 block">Verified Escrow Route</span>
              <div className="flex items-center justify-between text-[11px] font-bold text-emerald-950">
                <span>{currentUser?.organization || 'Tata Steel CSR'}</span>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-600" />
                <span>Jharkhand Govt Escrow</span>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-600" />
                <span>{selectedProjectForFunding.university}</span>
              </div>
              <p className="text-[10px] text-emerald-700">
                Government will disburse funds in milestone tranches upon verification of expense invoices.
              </p>
            </div>

            <form onSubmit={handleConfirmTransfer} className="space-y-3.5">
              <div>
                <label className="block text-slate-700 font-bold mb-1">CSR Initiative Program Title</label>
                <input
                  type="text"
                  value={csrProgramName}
                  onChange={(e) => setCsrProgramName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-semibold text-slate-800 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-slate-700 font-bold">CSR Contribution Amount (₹)</label>
                  <span className="text-[10px] text-slate-500">Government Matching: ₹{selectedProjectForFunding.govtMatchingFund.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="number"
                  value={sponsorAmount}
                  onChange={(e) => setSponsorAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-extrabold text-slate-900 text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setSelectedProjectForFunding(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isTransferring}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold shadow-sm flex items-center gap-2 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>{isTransferring ? 'Processing Escrow...' : 'Confirm & Transfer via Government'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
