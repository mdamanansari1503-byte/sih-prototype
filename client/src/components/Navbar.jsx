import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Bell,
  ChevronDown,
  User,
  FileText,
  Settings,
  LogOut,
  Globe,
  Check,
  LogIn,
  RotateCcw
} from 'lucide-react';
import NotificationsModal from './NotificationsModal';

export default function Navbar({ activeTab, setActiveTab, onOpenLogin, onResetDb }) {
  const { currentUser, switchPersona, personas, unreadCount } = useAuth();
  const { lang, changeLanguage, t } = useLanguage();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);

  const languages = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'hi', label: 'हिन्दी (Hindi)', flag: '🇮🇳' },
    { code: 'sat', label: 'ᱥᱟᱱᱛᱟᱲᱤ (Santhali)', flag: '🇮🇳' },
    { code: 'nag', label: 'नागपुरी (Nagpuri)', flag: '🇮🇳' }
  ];

  const isCitizen = currentUser?.role === 'citizen';

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-3 sm:gap-6">
          
          {/* Logo & Tagline */}
          <button
            onClick={() => setActiveTab('landing')}
            className="flex items-center gap-3 group text-left shrink-0 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition">
              <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L3 19h5l2-4h4l2 4h5L12 2z" />
                <path d="M10 12h4" />
              </svg>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 font-heading tracking-tight flex items-center">
                <span>Awaaz</span>
                <span className="text-emerald-600">Gram</span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium tracking-wide">
                People's Voice. Real Solutions.
              </p>
            </div>
          </button>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            <button
              onClick={() => setActiveTab('landing')}
              className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'landing'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {t('home')}
            </button>

            {/* Government Specific Navbar */}
            {currentUser?.role === 'government' ? (
              <>
                <button
                  onClick={() => setActiveTab('explorer')}
                  className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    activeTab === 'explorer'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {t('trackIssues')}
                </button>

                <button
                  onClick={() => setActiveTab('government_verification')}
                  className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    activeTab === 'government_verification'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {t('problemVerification') || 'Problem Verification'}
                </button>

                <button
                  onClick={() => setActiveTab('government_requests')}
                  className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    activeTab === 'government_requests' || activeTab === 'government'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {t('collegeRequests')}
                </button>

                <button
                  onClick={() => setActiveTab('leaderboard')}
                  className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    activeTab === 'leaderboard'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {t('leaderboard')}
                </button>
              </>
            ) : currentUser?.role === 'university' ? (
              /* University Specific Navbar */
              <>
                <button
                  onClick={() => setActiveTab('explorer')}
                  className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    activeTab === 'explorer'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {t('trackIssues')}
                </button>

                <button
                  onClick={() => setActiveTab('university_opps')}
                  className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    activeTab === 'university_opps' || activeTab === 'university'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {t('opportunities')}
                </button>

                <button
                  onClick={() => setActiveTab('university_projects')}
                  className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    activeTab === 'university_projects'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  My Projects & Teams
                </button>

                <button
                  onClick={() => setActiveTab('leaderboard')}
                  className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    activeTab === 'leaderboard'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {t('leaderboard')}
                </button>
              </>
            ) : currentUser?.role === 'citizen' ? (
              /* Citizen Specific Navbar */
              <>
                <button
                  onClick={() => setActiveTab('citizen')}
                  className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    activeTab === 'citizen'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {t('reportIssue')}
                </button>

                <button
                  onClick={() => setActiveTab('explorer')}
                  className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    activeTab === 'explorer'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {t('trackIssues')}
                </button>

                <button
                  onClick={() => setActiveTab('leaderboard')}
                  className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    activeTab === 'leaderboard'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {t('leaderboard')}
                </button>
              </>
            ) : currentUser?.role === 'industry' ? (
              /* Industry Specific Navbar */
              <>
                <button
                  onClick={() => setActiveTab('explorer')}
                  className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    activeTab === 'explorer'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {t('trackIssues')}
                </button>

                <button
                  onClick={() => setActiveTab('industry')}
                  className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    activeTab === 'industry'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {t('sponsor')}
                </button>

                <button
                  onClick={() => setActiveTab('leaderboard')}
                  className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    activeTab === 'leaderboard'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {t('leaderboard')}
                </button>
              </>
            ) : (
              /* Other Roles (Admin) */
              <>
                <button
                  onClick={() => setActiveTab('explorer')}
                  className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    activeTab === 'explorer'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {t('trackIssues')}
                </button>

                <button
                  onClick={() => setActiveTab('university')}
                  className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    activeTab === 'university'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {t('opportunities')}
                </button>

                <button
                  onClick={() => setActiveTab('leaderboard')}
                  className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    activeTab === 'leaderboard'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {t('leaderboard')}
                </button>
              </>
            )}
          </nav>

          {/* Right Area: Language Switcher, Notifications, & User Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Language Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowLangMenu(!showLangMenu);
                  setShowUserMenu(false);
                }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-slate-100/90 hover:bg-slate-200/80 border border-slate-200 text-xs font-bold text-slate-700 transition cursor-pointer"
                title="Change Platform Language"
              >
                <Globe className="w-3.5 h-3.5 text-emerald-600" />
                <span className="uppercase">{lang}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showLangMenu && (
                <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-white border border-slate-200 shadow-xl p-1.5 z-50 animate-fadeIn">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Select Language / ᱯᱟᱹᱨᱥᱤ
                  </div>
                  {languages.map(l => (
                    <button
                      key={l.code}
                      onClick={() => {
                        changeLanguage(l.code);
                        setShowLangMenu(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-left font-medium transition cursor-pointer ${
                        lang === l.code ? 'bg-emerald-50 text-emerald-700 font-bold' : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{l.flag}</span>
                        <span>{l.label}</span>
                      </span>
                      {lang === l.code && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Notification Bell */}
            <button
              onClick={() => setShowNotifs(true)}
              className="relative p-2 rounded-full bg-slate-100 hover:bg-slate-200/80 text-slate-600 transition cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white animate-pulse" />
              )}
            </button>

            {/* Quick Reset Demo Data Button */}
            <button
              onClick={onResetDb}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-200 hover:border-rose-200 font-bold text-xs transition cursor-pointer"
              title="Reset Demo Data (Purge newly added problems & restore default dataset)"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500 hover:text-rose-600" />
              <span className="hidden sm:inline">Reset Demo</span>
            </button>

            {/* Direct Login Button (Opens Login / Join Role Section) */}
            <button
              onClick={() => {
                if (onOpenLogin) onOpenLogin();
                else setActiveTab('login');
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-xs transition cursor-pointer"
              title="Login / Join Role"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Login</span>
            </button>

            {/* Profile Widget */}
            {isCitizen ? (
              /* Direct Profile Button for Citizen */
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex items-center gap-2 p-1 pr-3 rounded-full border transition cursor-pointer ${
                  activeTab === 'profile'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'hover:bg-slate-100 border-transparent hover:border-slate-200 text-slate-800'
                }`}
                title="View Citizen Profile"
              >
                <img
                  src={currentUser?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"}
                  alt={currentUser?.name}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-500/30"
                />
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-bold text-slate-900 leading-tight">
                    {currentUser?.name?.split(' ')[0] || 'Rahul'}
                  </div>
                  <div className="text-[10px] text-emerald-700 font-semibold capitalize">
                    {t('myProfile')}
                  </div>
                </div>
              </button>
            ) : (
              /* Dropdown for other roles */
              <div className="relative">
                <button
                  onClick={() => {
                    setShowUserMenu(!showUserMenu);
                    setShowLangMenu(false);
                  }}
                  className="flex items-center gap-2 p-1 pr-2 rounded-full hover:bg-slate-100 border border-transparent hover:border-slate-200 transition cursor-pointer"
                >
                  <img
                    src={currentUser?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"}
                    alt={currentUser?.name}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-500/30"
                  />
                  <div className="text-left hidden sm:block">
                    <div className="text-xs font-bold text-slate-900 leading-tight">
                      {currentUser?.name?.split(' ')[0] || 'User'}
                    </div>
                    <div className="text-[10px] text-slate-500 capitalize">
                      {currentUser?.role || 'Citizen'}
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-slate-200 shadow-2xl p-2 z-50 animate-fadeIn text-slate-800">
                    <div className="px-3 py-2 border-b border-slate-100">
                      <div className="text-xs font-bold text-slate-900">{currentUser.name}</div>
                      <div className="text-[10px] text-emerald-600 font-semibold uppercase">{currentUser.badge}</div>
                    </div>

                    <div className="py-1 space-y-0.5">
                      <button
                        onClick={() => {
                          setActiveTab('profile');
                          setShowUserMenu(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-700 hover:bg-slate-50 font-semibold cursor-pointer"
                      >
                        <User className="w-4 h-4 text-emerald-600" />
                        <span>{t('myProfile')}</span>
                      </button>

                      {/* Only show Dashboard button for Admin, NOT University, Government, or Industry */}
                      {currentUser?.role !== 'university' && currentUser?.role !== 'government' && currentUser?.role !== 'industry' && (
                        <button
                          onClick={() => {
                            setActiveTab('explorer');
                            setShowUserMenu(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-700 hover:bg-slate-50 font-medium cursor-pointer"
                        >
                          <FileText className="w-4 h-4 text-slate-400" />
                          <span>Dashboard</span>
                        </button>
                      )}

                      {/* Hide Transparency Expenses for Government & Industry */}
                      {currentUser?.role !== 'government' && currentUser?.role !== 'industry' && (
                        <button
                          onClick={() => {
                            setActiveTab('expenses');
                            setShowUserMenu(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-700 hover:bg-slate-50 font-medium cursor-pointer"
                        >
                          <Settings className="w-4 h-4 text-slate-400" />
                          <span>Transparency Expenses</span>
                        </button>
                      )}
                    </div>

                    <div className="pt-1 border-t border-slate-100">
                      <button
                        onClick={() => {
                          if (onOpenLogin) onOpenLogin();
                          setShowUserMenu(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-rose-600 hover:bg-rose-50 font-semibold cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 text-rose-500" />
                        <span>{t('logout')}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>

        </div>

        {/* Mobile Sub-Navbar */}
        <div className="lg:hidden flex items-center overflow-x-auto px-4 py-2 bg-slate-50 border-t border-slate-200/80 gap-1.5 scrollbar-none">
          {(currentUser?.role === 'government'
            ? [
                { id: 'landing', label: t('home') },
                { id: 'explorer', label: t('trackIssues') },
                { id: 'government_verification', label: t('problemVerification') || 'Problem Verification' },
                { id: 'government_requests', label: t('collegeRequests') },
                { id: 'leaderboard', label: t('leaderboard') },
                { id: 'profile', label: t('myProfile') }
              ]
            : currentUser?.role === 'university'
            ? [
                { id: 'landing', label: t('home') },
                { id: 'explorer', label: t('trackIssues') },
                { id: 'university_opps', label: t('opportunities') },
                { id: 'university_projects', label: 'My Projects & Teams' },
                { id: 'leaderboard', label: t('leaderboard') },
                { id: 'profile', label: t('myProfile') }
              ]
            : currentUser?.role === 'industry'
            ? [
                { id: 'landing', label: t('home') },
                { id: 'explorer', label: t('trackIssues') },
                { id: 'industry', label: t('sponsor') },
                { id: 'leaderboard', label: t('leaderboard') },
                { id: 'profile', label: t('myProfile') }
              ]
            : isCitizen
            ? [
                { id: 'landing', label: t('home') },
                { id: 'citizen', label: t('reportIssue') },
                { id: 'explorer', label: t('trackIssues') },
                { id: 'leaderboard', label: t('leaderboard') },
                { id: 'profile', label: t('myProfile') }
              ]
            : [
                { id: 'landing', label: t('home') },
                { id: 'explorer', label: t('trackIssues') },
                { id: 'university', label: t('opportunities') },
                { id: 'industry', label: t('sponsor') },
                { id: 'leaderboard', label: t('leaderboard') },
                { id: 'profile', label: t('myProfile') }
              ]
          ).map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                activeTab === item.id || (item.id === 'university_opps' && activeTab === 'university')
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'text-slate-600 bg-white border border-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </header>

      {/* Notifications Drawer */}
      {showNotifs && <NotificationsModal onClose={() => setShowNotifs(false)} />}
    </>
  );
}
