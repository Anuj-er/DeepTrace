import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Landing from './components/Landing';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Results from './components/Results';
import History from './components/History';
import Settings from './components/Settings';
import ReportPreview from './components/ReportPreview';

function App() {
  const [currentScreen, setCurrentScreen] = useState('landing');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [user, setUser] = useState(null);

  const handleUpload = (file) => {
    setUploadedFile(file);
    setTimeout(() => {
      setCurrentScreen('results');
    }, 2000);
  };

  const handleReset = () => {
    setUploadedFile(null);
    setCurrentScreen('dashboard');
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setCurrentScreen('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentScreen('landing');
  };

  const handleNavigate = (screen) => {
    setCurrentScreen(screen);
  };

  // Screens that don't show the main navbar (have their own layout)
  const fullScreenPages = ['landing', 'login'];
  const showNavbar = !fullScreenPages.includes(currentScreen);

  return (
    <div className="min-h-screen w-full relative overflow-hidden flex flex-col bg-darkBg">
      
      {/* Navbar — shown on all screens except Landing and Login */}
      {showNavbar && (
        <motion.nav 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="w-full glass-panel rounded-none border-t-0 border-x-0 border-b border-glassBorder px-6 py-3.5 flex items-center justify-between z-30 sticky top-0"
        >
          <div 
            className="flex items-center gap-3 cursor-pointer group" 
            onClick={() => setCurrentScreen('landing')}
          >
            {/* Logo SVG — Shield + Eye */}
            <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-gradient-to-br from-neonBlue/10 to-neonPurple/10 border border-neonBlue/20 group-hover:border-neonPurple/40 transition-all group-hover:shadow-[0_0_15px_rgba(0,243,255,0.2)]">
              <svg width="20" height="20" viewBox="0 0 512 512" fill="none">
                <path d="M256 60L120 120V240C120 350 178 440 256 472C334 440 392 350 392 240V120L256 60Z" stroke="url(#navLogoG)" strokeWidth="32" strokeLinejoin="round" fill="none"/>
                <circle cx="256" cy="256" r="64" fill="url(#navLogoG)"/>
                <path d="M208 256 Q256 192 304 256 Q256 320 208 256Z" fill="#0a0a0f"/>
                <circle cx="256" cy="256" r="24" fill="url(#navLogoG)"/>
                <defs>
                  <linearGradient id="navLogoG" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop stopColor="#00f3ff"/>
                    <stop offset="1" stopColor="#9d00ff"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <h1 className="text-lg font-bold tracking-wider">
              <span className="gradient-text-white">DEEP</span>
              <span className="text-neonBlue neon-text-blue">TRACE</span>
            </h1>
          </div>

          {/* Nav Links */}
          <div className="flex items-center gap-1">
            {[
              { label: 'Dashboard', screen: 'dashboard', icon: (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7" rx="1"/>
                  <rect x="14" y="3" width="7" height="7" rx="1"/>
                  <rect x="3" y="14" width="7" height="7" rx="1"/>
                  <rect x="14" y="14" width="7" height="7" rx="1"/>
                </svg>
              )},
              { label: 'History', screen: 'history', icon: (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
              )},
              { label: 'Settings', screen: 'settings', icon: (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
                </svg>
              )},
            ].map(({ label, screen, icon }) => (
              <button 
                key={screen}
                onClick={() => setCurrentScreen(screen)} 
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${currentScreen === screen 
                    ? 'text-neonBlue bg-neonBlue/10 border border-neonBlue/20' 
                    : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
                  }`}
              >
                {icon}
                {label}
              </button>
            ))}
          </div>

          {/* User section */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2.5 glass-panel px-3 py-1.5 rounded-xl cursor-pointer hover:bg-white/[0.05] transition-colors">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-neonBlue to-neonPurple flex items-center justify-center text-xs font-bold text-white">
                    {user.name?.charAt(0) || 'U'}
                  </div>
                  <span className="text-sm text-gray-300 font-medium">{user.name}</span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="text-gray-500 hover:text-red-400 transition-colors text-sm px-2 py-1"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
                    <polyline points="16 17 21 12 16 7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setCurrentScreen('login')}
                className="btn-primary text-sm px-4 py-2 rounded-lg"
              >
                Sign In
              </button>
            )}
          </div>
        </motion.nav>
      )}

      {/* Main Content */}
      <main className={`flex-grow flex flex-col z-10 overflow-y-auto ${showNavbar ? '' : ''}`}>
        <AnimatePresence mode="wait">
          {currentScreen === 'landing' && (
            <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <Landing onLaunch={() => user ? setCurrentScreen('dashboard') : setCurrentScreen('login')} />
            </motion.div>
          )}
          {currentScreen === 'login' && (
            <motion.div key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <Login onLogin={handleLogin} />
            </motion.div>
          )}
          {currentScreen === 'dashboard' && (
            <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
              className="flex-grow flex items-center justify-center p-6"
            >
              <Dashboard onUpload={handleUpload} onNavigate={handleNavigate} />
            </motion.div>
          )}
          {currentScreen === 'results' && (
            <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
              className="flex-grow flex items-center justify-center p-6"
            >
              <Results onReset={handleReset} onViewReport={() => setCurrentScreen('report')} file={uploadedFile} />
            </motion.div>
          )}
          {currentScreen === 'history' && (
            <motion.div key="history" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
              className="flex-grow p-6"
            >
              <History onNavigate={handleNavigate} />
            </motion.div>
          )}
          {currentScreen === 'settings' && (
            <motion.div key="settings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
              className="flex-grow p-6"
            >
              <Settings user={user || { name: 'Anuj Siwach', email: 'anuj@deeptrace.ai' }} />
            </motion.div>
          )}
          {currentScreen === 'report' && (
            <motion.div key="report" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
              className="flex-grow"
            >
              <ReportPreview onBack={() => setCurrentScreen('results')} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      
      {/* Decorative Background Orbs */}
      <div className="fixed top-[10%] left-[10%] w-[500px] h-[500px] bg-neonBlue rounded-full mix-blend-screen filter blur-[150px] opacity-[0.08] pointer-events-none animate-pulse"></div>
      <div className="fixed bottom-[10%] right-[10%] w-[500px] h-[500px] bg-neonPurple rounded-full mix-blend-screen filter blur-[150px] opacity-[0.08] pointer-events-none animate-pulse" style={{ animationDelay: '2s' }}></div>
    </div>
  );
}

export default App;
