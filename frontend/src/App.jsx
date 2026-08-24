import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { LayoutDashboard, History as HistoryIcon, Settings as SettingsIcon, ShieldCheck, LogOut } from 'lucide-react';
import Landing from './components/Landing';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Results from './components/Results';
import History from './components/History';
import Settings from './components/Settings';
import ReportPreview from './components/ReportPreview';

// Helper to get auth headers
export function getAuthHeaders() {
  const token = localStorage.getItem('deeptrace_token');
  if (!token) return {};
  return { 'Authorization': `Bearer ${token}` };
}

function App() {
  const [currentScreen, setCurrentScreen] = useState('landing');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);
  const [user, setUser] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  // Check for existing JWT on mount
  useEffect(() => {
    const token = localStorage.getItem('deeptrace_token');
    if (token) {
      fetch('/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => {
          if (res.ok) return res.json();
          throw new Error('Token invalid');
        })
        .then(userData => {
          setUser(userData);
          setCurrentScreen('dashboard');
        })
        .catch(() => {
          localStorage.removeItem('deeptrace_token');
        })
        .finally(() => setAuthLoading(false));
    } else {
      setAuthLoading(false);
    }
  }, []);

  const handleUpload = async (file) => {
    setUploadedFile(file);
    setAnalyzing(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Analysis failed');
      }

      const data = await res.json();
      setAnalysisData(data);
      setCurrentScreen('results');
    } catch (err) {
      console.error('Analysis error:', err);
      alert(err.message || 'Analysis failed. Make sure the backend server is running on port 8000.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleReset = () => {
    setUploadedFile(null);
    setAnalysisData(null);
    setCurrentScreen('dashboard');
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setCurrentScreen('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('deeptrace_token');
    setUser(null);
    setCurrentScreen('landing');
  };

  const handleNavigate = (screen) => {
    setCurrentScreen(screen);
  };

  // Screens that don't show the main navbar
  const fullScreenPages = ['landing', 'login'];
  const showNavbar = !fullScreenPages.includes(currentScreen);

  // Show nothing while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#000000] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-neutral-700 border-t-white rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full relative overflow-hidden flex flex-col bg-[#000000] font-sans selection:bg-neutral-800 text-neutral-200">
      
      {/* Navbar */}
      {showNavbar && (
        <nav className="w-full bg-[#000000]/80 backdrop-blur-md border-b border-neutral-900 px-6 py-3.5 flex items-center justify-between z-30 sticky top-0">
          
          {/* Logo */}
          <div 
            className="flex items-center gap-2.5 cursor-pointer group" 
            onClick={() => setCurrentScreen('landing')}
          >
            <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-neutral-900 border border-neutral-800 group-hover:border-neutral-700 transition-colors">
              <ShieldCheck size={16} className="text-neutral-300" />
            </div>
            <h1 className="text-xs font-semibold tracking-widest uppercase text-white">
              DeepTrace
            </h1>
          </div>

          {/* Nav Links */}
          <div className="flex items-center gap-2">
            {[
              { label: 'Dashboard', screen: 'dashboard', icon: <LayoutDashboard size={14} /> },
              { label: 'History', screen: 'history', icon: <HistoryIcon size={14} /> },
              { label: 'Settings', screen: 'settings', icon: <SettingsIcon size={14} /> },
            ].map(({ label, screen, icon }) => (
              <button 
                key={screen}
                onClick={() => setCurrentScreen(screen)} 
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-medium transition-all duration-200
                  ${currentScreen === screen 
                    ? 'text-white bg-neutral-900 border border-neutral-800' 
                    : 'text-neutral-500 hover:text-white hover:bg-neutral-900/50 border border-transparent'
                  }`}
              >
                {icon}
                {label}
              </button>
            ))}
          </div>

          {/* User section */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2.5 cursor-pointer group">
                  <div className="w-7 h-7 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-xs font-semibold text-neutral-300 group-hover:border-neutral-500 transition-colors">
                    {user.name?.charAt(0) || 'U'}
                  </div>
                  <span className="text-xs text-neutral-400 font-medium group-hover:text-neutral-200 transition-colors">{user.name}</span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="text-neutral-600 hover:text-neutral-300 transition-colors flex items-center"
                  title="Sign Out"
                >
                  <LogOut size={14} />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setCurrentScreen('login')}
                className="text-xs font-medium text-black bg-white hover:bg-neutral-200 transition-colors px-4 py-1.5 rounded-md"
              >
                Sign In
              </button>
            )}
          </div>
        </nav>
      )}

      {/* Main Content */}
      <main className="flex-grow flex flex-col z-10 overflow-y-auto">
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
              <Dashboard onUpload={handleUpload} onNavigate={handleNavigate} analyzing={analyzing} />
            </motion.div>
          )}
          {currentScreen === 'results' && (
            <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
              className="flex-grow p-6"
            >
              <Results onReset={handleReset} onViewReport={() => setCurrentScreen('report')} file={uploadedFile} data={analysisData} />
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
              <ReportPreview onBack={() => setCurrentScreen('results')} data={analysisData} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;
