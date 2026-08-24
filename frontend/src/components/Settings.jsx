import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Shield, Key, Bell, Cpu, Palette, 
  Save, Copy, RefreshCw, Smartphone, Monitor, Check
} from 'lucide-react';

const ToggleSwitch = ({ isOn, onToggle }) => (
  <div 
    className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${isOn ? 'bg-[#00f3ff]' : 'bg-gray-700'}`}
    onClick={onToggle}
  >
    <motion.div 
      className="bg-white w-4 h-4 rounded-full shadow-md"
      layout
      animate={{ x: isOn ? 24 : 0 }}
      transition={{ type: "spring", stiffness: 700, damping: 30 }}
    />
  </div>
);

const Settings = ({ user = { name: 'Anuj Siwach', email: 'anuj@deeptrace.ai' } }) => {
  const [activeTab, setActiveTab] = useState('Profile');
  
  const tabs = [
    { id: 'Profile', icon: <User size={18} /> },
    { id: 'Security', icon: <Shield size={18} /> },
    { id: 'API Keys', icon: <Key size={18} /> },
    { id: 'Notifications', icon: <Bell size={18} /> },
    { id: 'Model Configuration', icon: <Cpu size={18} /> },
    { id: 'Appearance', icon: <Palette size={18} /> }
  ];

  const [toggles, setToggles] = useState({
    twoFactor: true,
    faceDetection: true,
    elaAnalysis: true,
    metadataExtraction: true,
    compactMode: false
  });

  const handleToggle = (key) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Profile':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="flex items-center space-x-6 mb-8">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#00f3ff] to-[#9d00ff] flex items-center justify-center text-4xl font-bold text-white shadow-[0_0_20px_rgba(0,243,255,0.4)]">
                {user.name ? user.name.charAt(0) : 'A'}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">Profile Picture</h3>
                <p className="text-gray-400 text-sm mt-1 mb-3">PNG, JPEG under 5MB</p>
                <div className="flex space-x-3">
                  <button className="btn-primary text-sm py-1.5 px-4 rounded-md bg-opacity-20 border border-[#00f3ff] text-[#00f3ff] hover:bg-[#00f3ff] hover:text-[#0a0a0f] transition-all">Upload New</button>
                  <button className="btn-ghost text-sm py-1.5 px-4 rounded-md text-gray-400 hover:text-white transition-all">Remove</button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Full Name</label>
                <input type="text" className="glass-input w-full p-2.5 rounded-md bg-white/5 border border-white/10 text-white focus:border-[#00f3ff] focus:outline-none transition-colors" defaultValue={user.name} />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Email Address</label>
                <input type="email" className="glass-input w-full p-2.5 rounded-md bg-white/5 border border-white/10 text-white focus:border-[#00f3ff] focus:outline-none transition-colors" defaultValue={user.email} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm text-gray-400">Role</label>
                <select className="glass-input w-full p-2.5 rounded-md bg-[#0a0a0f] border border-white/10 text-white focus:border-[#00f3ff] focus:outline-none transition-colors appearance-none">
                  <option>Researcher</option>
                  <option>Analyst</option>
                  <option>Admin</option>
                </select>
              </div>
            </div>
            
            <div className="pt-4 flex justify-end">
              <button className="btn-primary flex items-center bg-[#00f3ff] text-[#0a0a0f] font-semibold py-2 px-6 rounded-md hover:shadow-[0_0_15px_rgba(0,243,255,0.6)] transition-all">
                <Save size={18} className="mr-2" />
                Save Changes
              </button>
            </div>
          </motion.div>
        );

      case 'Security':
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-2">Change Password</h3>
              <div className="space-y-4 max-w-md">
                <input type="password" placeholder="Current Password" className="glass-input w-full p-2.5 rounded-md bg-white/5 border border-white/10 text-white focus:border-[#9d00ff] focus:outline-none" />
                <input type="password" placeholder="New Password" className="glass-input w-full p-2.5 rounded-md bg-white/5 border border-white/10 text-white focus:border-[#9d00ff] focus:outline-none" />
                <input type="password" placeholder="Confirm New Password" className="glass-input w-full p-2.5 rounded-md bg-white/5 border border-white/10 text-white focus:border-[#9d00ff] focus:outline-none" />
                <button className="btn-primary w-full bg-[#9d00ff] text-white font-semibold py-2 rounded-md hover:shadow-[0_0_15px_rgba(157,0,255,0.6)] transition-all">Update Password</button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-2">Two-Factor Authentication</h3>
              <div className="flex items-center justify-between glass-panel p-4 rounded-lg bg-white/5 border border-white/10">
                <div>
                  <p className="text-white font-medium">Authenticator App</p>
                  <p className="text-sm text-gray-400">Add an extra layer of security to your account.</p>
                </div>
                <ToggleSwitch isOn={toggles.twoFactor} onToggle={() => handleToggle('twoFactor')} />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-2">Active Sessions</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between glass-panel p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center space-x-4">
                    <Monitor className="text-[#00f3ff]" size={24} />
                    <div>
                      <p className="text-white font-medium">Chrome on Mac OS</p>
                      <p className="text-xs text-gray-400">New York, USA • Active now</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold px-2 py-1 bg-green-500/20 text-green-400 rounded-md border border-green-500/30">Current</span>
                </div>
                <div className="flex items-center justify-between glass-panel p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center space-x-4">
                    <Smartphone className="text-gray-400" size={24} />
                    <div>
                      <p className="text-white font-medium">Safari on iPhone 13</p>
                      <p className="text-xs text-gray-400">New York, USA • Last active 2 hours ago</p>
                    </div>
                  </div>
                  <button className="text-sm text-red-400 hover:text-red-300 transition-colors">Revoke</button>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 'API Keys':
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
            <div className="glass-panel p-6 rounded-xl bg-white/5 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4">Production API Key</h3>
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
                <div className="flex-1 w-full bg-[#0a0a0f] border border-white/10 rounded-md p-3 flex items-center justify-between font-mono text-sm text-gray-300">
                  <span>dt_****************************7f2a</span>
                  <button onClick={handleCopy} className="text-gray-400 hover:text-[#00f3ff] transition-colors ml-4 focus:outline-none">
                    {copied ? <Check size={18} className="text-green-400" /> : <Copy size={18} />}
                  </button>
                </div>
                <button className="flex items-center px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-md border border-white/10 transition-colors whitespace-nowrap">
                  <RefreshCw size={16} className="mr-2" /> Regenerate
                </button>
              </div>
              
              <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-md flex items-start space-x-3">
                <Shield className="text-yellow-500 shrink-0 mt-0.5" size={18} />
                <p className="text-sm text-yellow-200/80">
                  Keep your API keys secure. Do not share them in publicly accessible areas such as GitHub, client-side code, etc.
                </p>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-xl bg-white/5 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4">Usage This Month</h3>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">API Calls</span>
                <span className="text-[#00f3ff] font-mono">847 <span className="text-gray-500">/ 10,000</span></span>
              </div>
              <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '8.47%' }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="h-full bg-gradient-to-r from-[#00f3ff] to-[#9d00ff]"
                />
              </div>
              <p className="text-xs text-gray-500 mt-3 text-right">Resets in 12 days</p>
            </div>
          </motion.div>
        );

      case 'Model Configuration':
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
            <div className="glass-panel p-6 rounded-xl bg-white/5 border border-white/10 space-y-6">
              
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-300">Default Model Architecture</label>
                <select className="glass-input w-full p-3 rounded-md bg-[#0a0a0f] border border-white/10 text-white focus:border-[#9d00ff] focus:outline-none transition-colors appearance-none">
                  <option>EfficientNet-B4 (Recommended)</option>
                  <option>ResNet-50</option>
                  <option>XceptionNet</option>
                </select>
                <p className="text-xs text-gray-500">Select the primary model used for new analysis jobs.</p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-gray-300">Global Detection Threshold</label>
                  <span className="text-[#00f3ff] font-mono text-sm">75%</span>
                </div>
                <input type="range" min="0" max="100" defaultValue="75" className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-[#00f3ff]" />
                <p className="text-xs text-gray-500">Confidence scores above this threshold will be flagged as likely deepfakes.</p>
              </div>

            </div>

            <div className="glass-panel p-6 rounded-xl bg-white/5 border border-white/10 space-y-4">
              <h3 className="text-lg font-semibold text-white mb-2">Analysis Pipelines</h3>
              
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
                <div>
                  <p className="text-white font-medium text-sm">Face Detection & Extraction</p>
                  <p className="text-xs text-gray-400">Isolate faces before running analysis</p>
                </div>
                <ToggleSwitch isOn={toggles.faceDetection} onToggle={() => handleToggle('faceDetection')} />
              </div>

              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
                <div>
                  <p className="text-white font-medium text-sm">Error Level Analysis (ELA)</p>
                  <p className="text-xs text-gray-400">Identify compression artifacts</p>
                </div>
                <ToggleSwitch isOn={toggles.elaAnalysis} onToggle={() => handleToggle('elaAnalysis')} />
              </div>

              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
                <div>
                  <p className="text-white font-medium text-sm">Metadata Extraction</p>
                  <p className="text-xs text-gray-400">Analyze EXIF data and file properties</p>
                </div>
                <ToggleSwitch isOn={toggles.metadataExtraction} onToggle={() => handleToggle('metadataExtraction')} />
              </div>
            </div>
          </motion.div>
        );

      case 'Appearance':
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Theme Preference</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border-2 border-[#00f3ff] bg-[#0a0a0f] cursor-pointer flex flex-col items-center space-y-3">
                  <div className="w-full h-24 bg-[#12121a] rounded-md border border-gray-800 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#00f3ff] to-[#9d00ff]"></div>
                    <div className="w-3/4 h-3 bg-gray-800 rounded-full mb-2"></div>
                  </div>
                  <span className="text-[#00f3ff] font-medium text-sm">Dark (Active)</span>
                </div>
                <div className="p-4 rounded-xl border border-gray-800 bg-[#0a0a0f] opacity-50 cursor-not-allowed flex flex-col items-center space-y-3">
                  <div className="w-full h-24 bg-gray-100 rounded-md border border-gray-300 flex items-center justify-center relative overflow-hidden">
                     <div className="absolute top-0 left-0 w-full h-1 bg-gray-300"></div>
                     <div className="w-3/4 h-3 bg-gray-300 rounded-full mb-2"></div>
                  </div>
                  <span className="text-gray-500 font-medium text-sm">Light (Coming Soon)</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-white/10">
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Language</label>
                <select className="glass-input w-full md:w-1/2 p-2.5 rounded-md bg-[#0a0a0f] border border-white/10 text-white focus:border-[#00f3ff] focus:outline-none transition-colors appearance-none">
                  <option>English (US)</option>
                  <option>Spanish</option>
                  <option>French</option>
                  <option>German</option>
                </select>
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-white/10">
               <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/5">
                <div>
                  <p className="text-white font-medium">Compact Mode</p>
                  <p className="text-sm text-gray-400">Reduce padding and spacing to fit more content on screen.</p>
                </div>
                <ToggleSwitch isOn={toggles.compactMode} onToggle={() => handleToggle('compactMode')} />
              </div>
            </div>
          </motion.div>
        );

      case 'Notifications':
        return (
           <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="text-center py-12">
                <Bell size={48} className="mx-auto text-gray-600 mb-4" />
                <h3 className="text-xl font-medium text-gray-300 mb-2">Notification Settings</h3>
                <p className="text-gray-500">Configure how and when you want to be alerted.</p>
                <p className="text-[#00f3ff] mt-4 text-sm font-medium bg-[#00f3ff]/10 inline-block px-3 py-1 rounded-full border border-[#00f3ff]/20">Module Under Construction</p>
              </div>
           </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-gray-200 p-6 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Settings</h1>
          <p className="text-gray-400 mt-1">Manage your account preferences and configurations.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar Navigation */}
          <div className="w-full md:w-64 shrink-0">
            <div className="glass-panel rounded-xl bg-white/5 border border-white/10 overflow-hidden">
              <nav className="flex flex-col p-2">
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                        isActive 
                          ? 'bg-white/10 text-white border-l-2 border-[#00f3ff]' 
                          : 'text-gray-400 hover:bg-white/5 hover:text-gray-200 border-l-2 border-transparent'
                      }`}
                    >
                      <span className={isActive ? 'text-[#00f3ff]' : 'text-gray-500'}>
                        {tab.icon}
                      </span>
                      <span>{tab.id}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            <div className="glass-panel rounded-2xl bg-white/5 border border-white/10 p-6 md:p-8 min-h-[500px]">
              <h2 className="text-2xl font-semibold text-white mb-6 pb-4 border-b border-white/10">
                {activeTab}
              </h2>
              <AnimatePresence mode="wait">
                {renderContent()}
              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Settings;
