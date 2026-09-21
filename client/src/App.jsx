import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { api } from './services/api';
import { defaultProblems, defaultProjects } from './services/defaultData';

import Navbar from './components/Navbar';

import LandingPage from './pages/LandingPage';
import PublicExplorer from './pages/PublicExplorer';
import CitizenPortal from './pages/CitizenPortal';
import GovernmentDashboard from './pages/GovernmentDashboard';
import UniversityDashboard from './pages/UniversityDashboard';
import IndustryDashboard from './pages/IndustryDashboard';
import ExpenseTrackerPage from './pages/ExpenseTrackerPage';
import LeaderboardPage from './pages/LeaderboardPage';
import AdminDashboard from './pages/AdminDashboard';
import ProjectDetailView from './pages/ProjectDetailView';
import ProfileSection from './pages/ProfileSection';
import LoginPage from './pages/LoginPage';
import PublicProfileModal from './components/PublicProfileModal';

function AppContent() {
  const { currentRole, switchRole, currentUser } = useAuth();
  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState('landing');
  const [selectedProblemId, setSelectedProblemId] = useState(null);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [problems, setProblems] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      const [probRes, projRes] = await Promise.all([
        api.getProblems(),
        api.getProjects()
      ]);

      if (probRes.success) setProblems(probRes.data);
      if (projRes.success) setProjects(projRes.data);
    } catch (err) {
      console.error('Error loading data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleResetDb = async () => {
    if (window.confirm('Reset database to pristine default demo state? All newly submitted test problems and requests will be wiped.')) {
      try {
        setLoading(true);
        await api.resetSystem();
        localStorage.removeItem('awaazgram_problems');
        localStorage.removeItem('awaazgram_projects');
        localStorage.removeItem('awaazgram_requests');
        localStorage.setItem('awaazgram_problems', JSON.stringify(defaultProblems));
        localStorage.setItem('awaazgram_projects', JSON.stringify(defaultProjects));
        setProblems(defaultProblems);
        setProjects(defaultProjects);
        setSelectedProblemId(null);
        setSelectedProjectId(null);
        setActiveTab('explorer');
        alert('Database has been reset to default clean state!');
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleProblemCreated = (newProblem) => {
    setProblems(prev => [newProblem, ...prev]);
  };

  const handleProblemUpdated = (updatedProblem) => {
    setProblems(prev => prev.map(p => p.id === updatedProblem.id ? updatedProblem : p));
  };

  const handleProjectCreated = (newProject) => {
    setProjects(prev => [newProject, ...prev]);
    setProblems(prev => prev.map(p => {
      if (p.id === newProject.problemId) {
        return { ...p, status: 'in_progress', projectId: newProject.id };
      }
      return p;
    }));
  };

  const handleProjectUpdated = (updatedProject) => {
    setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
    if (updatedProject.status === 'solved') {
      setProblems(prev => prev.map(p => {
        if (p.id === updatedProject.problemId || p.projectId === updatedProject.id) {
          return { ...p, status: 'solved' };
        }
        return p;
      }));
    }
  };

  const handleSelectProblem = (probId) => {
    setSelectedProblemId(probId);
    setSelectedProjectId(null);
    setActiveTab('detail');
  };

  const handleSelectProject = (projId) => {
    setSelectedProjectId(projId);
    setSelectedProblemId(null);
    setActiveTab('detail');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      
      {/* Main Navbar matching reference picture */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setSelectedProblemId(null);
          setSelectedProjectId(null);
        }}
        onOpenLogin={() => setShowLoginModal(true)}
        onResetDb={handleResetDb}
        onSearch={(query) => setSearchQuery(query)}
      />

      {/* Main Page Body Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
        {loading ? (
          <div className="py-24 text-center">
            <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-xs text-slate-500 font-bold tracking-wider uppercase">Loading AwaazGram Engine...</p>
          </div>
        ) : (
          <>
            {activeTab === 'landing' && (
              <LandingPage
                setActiveTab={setActiveTab}
                onOpenLogin={() => setShowLoginModal(true)}
              />
            )}

            {activeTab === 'explorer' && (
              <PublicExplorer
                problems={problems}
                projects={projects}
                initialSearch={searchQuery}
                onSelectProblem={handleSelectProblem}
                onSelectProject={handleSelectProject}
                onProblemUpdated={handleProblemUpdated}
                onOpenProfile={setSelectedProfile}
              />
            )}

            {activeTab === 'citizen' && (
              <CitizenPortal
                problems={problems}
                onProblemCreated={handleProblemCreated}
                onSelectProblem={handleSelectProblem}
                setActiveTab={setActiveTab}
                onOpenProfile={setSelectedProfile}
              />
            )}

            {(activeTab === 'government' || activeTab === 'government_verification' || activeTab === 'government_requests' || activeTab === 'government_funding' || activeTab === 'government_progress') && (
              <GovernmentDashboard
                problems={problems}
                projects={projects}
                initialView={
                  activeTab === 'government_verification'
                    ? 'verification'
                    : activeTab === 'government_funding'
                    ? 'funding'
                    : activeTab === 'government_progress'
                    ? 'progress'
                    : 'requests'
                }
                onProblemUpdated={handleProblemUpdated}
                onProjectCreated={handleProjectCreated}
                onProjectUpdated={handleProjectUpdated}
                onSelectProblem={handleSelectProblem}
                onSelectProject={handleSelectProject}
                setActiveTab={setActiveTab}
              />
            )}

            {(activeTab === 'university' || activeTab === 'university_opps' || activeTab === 'university_projects') && (
              <UniversityDashboard
                problems={problems}
                projects={projects}
                initialView={activeTab === 'university_projects' ? 'projects' : 'opportunities'}
                onProjectCreated={handleProjectCreated}
                onProjectUpdated={handleProjectUpdated}
                onSelectProject={handleSelectProject}
                onSelectProblem={handleSelectProblem}
                setActiveTab={setActiveTab}
                onOpenProfile={setSelectedProfile}
              />
            )}

            {activeTab === 'industry' && (
              <IndustryDashboard
                projects={projects}
                onProjectUpdated={handleProjectUpdated}
                onSelectProject={handleSelectProject}
                setActiveTab={setActiveTab}
              />
            )}

            {activeTab === 'expenses' && (
              <ExpenseTrackerPage
                projects={projects}
                onExpenseAdded={() => loadAllData()}
              />
            )}

            {activeTab === 'leaderboard' && (
              <LeaderboardPage
                onOpenProfile={setSelectedProfile}
              />
            )}

            {activeTab === 'profile' && (
              <ProfileSection
                onBack={() => setActiveTab('landing')}
                setActiveTab={setActiveTab}
              />
            )}

            {activeTab === 'admin' && (
              <AdminDashboard
                onResetDb={handleResetDb}
              />
            )}

            {activeTab === 'detail' && (
              <ProjectDetailView
                problemId={selectedProblemId}
                projectId={selectedProjectId}
                onBack={() => setActiveTab('explorer')}
                onProblemUpdated={handleProblemUpdated}
                onProjectUpdated={handleProjectUpdated}
                setActiveTab={setActiveTab}
                onOpenProfile={setSelectedProfile}
              />
            )}

            {activeTab === 'login' && (
              <LoginPage
                onLoginSuccess={() => setActiveTab('landing')}
                onResetDb={handleResetDb}
              />
            )}
          </>
        )}
      </main>

      {/* Public Contributor Profile Modal */}
      {selectedProfile && (
        <PublicProfileModal
          profile={selectedProfile}
          onClose={() => setSelectedProfile(null)}
          onSelectProblem={handleSelectProblem}
          onSelectProject={handleSelectProject}
        />
      )}

      {/* Login Modal Popup */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <LoginPage
            onClose={() => setShowLoginModal(false)}
            onLoginSuccess={() => setShowLoginModal(false)}
            onResetDb={handleResetDb}
          />
        </div>
      )}

      {/* Clean Footer Matching Screenshot Reference */}
      <footer className="bg-white border-t border-slate-200 mt-16 py-8 px-4 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo & Rights */}
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-xs">
              A
            </div>
            <span className="font-extrabold text-slate-900 font-heading">AwaazGram</span>
            <span className="text-slate-400">|</span>
            <span>{t('footerRights')}</span>
          </div>

          {/* Center Slogan */}
          <div className="text-xs font-bold text-slate-800">
            Real Problems $\rightarrow$ Real Collaboration $\rightarrow$ Real Impact
          </div>

          {/* Links & Socials */}
          <div className="flex items-center gap-4 text-slate-500 font-medium">
            <button onClick={() => alert('About AwaazGram Platform')} className="hover:text-emerald-700">About</button>
            <span>•</span>
            <button onClick={() => alert('Privacy Policy')} className="hover:text-emerald-700">Privacy</button>
            <span>•</span>
            <button onClick={() => alert('Terms of Service')} className="hover:text-emerald-700">Terms</button>
            <span>•</span>
            <button onClick={() => alert('Contact Core Team: team@awaazgram.org')} className="hover:text-emerald-700">Contact</button>
          </div>

        </div>
      </footer>

    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </LanguageProvider>
  );
}
