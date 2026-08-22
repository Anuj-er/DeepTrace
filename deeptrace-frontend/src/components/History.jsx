import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Calendar, 
  ArrowDownUp, 
  ChevronLeft, 
  ChevronRight, 
  FileImage, 
  ShieldAlert, 
  ShieldCheck, 
  ShieldQuestion,
  Eye
} from 'lucide-react';

const MOCK_HISTORY = [
  { id: '1', fileName: 'profile_photo_edited.jpg', date: 'Aug 21, 2026 14:32', verdict: 'Deepfake', confidence: 94.2, risk: 'High', color: 'from-red-900 to-red-500' },
  { id: '2', fileName: 'interview_clip_frame.png', date: 'Aug 21, 2026 10:15', verdict: 'Authentic', confidence: 98.7, risk: 'Low', color: 'from-green-900 to-green-500' },
  { id: '3', fileName: 'midjourney_gen_01.jpg', date: 'Aug 20, 2026 18:45', verdict: 'AI-Generated', confidence: 91.5, risk: 'Medium', color: 'from-amber-900 to-amber-500' },
  { id: '4', fileName: 'passport_scan.jpg', date: 'Aug 20, 2026 09:22', verdict: 'Authentic', confidence: 99.1, risk: 'Low', color: 'from-green-900 to-green-500' },
  { id: '5', fileName: 'news_leak_evidence.png', date: 'Aug 19, 2026 22:11', verdict: 'Deepfake', confidence: 88.4, risk: 'High', color: 'from-red-900 to-red-500' },
  { id: '6', fileName: 'social_media_avatar.jpg', date: 'Aug 19, 2026 15:30', verdict: 'AI-Generated', confidence: 76.2, risk: 'Medium', color: 'from-amber-900 to-amber-500' },
  { id: '7', fileName: 'cctv_frame_1102.jpg', date: 'Aug 18, 2026 11:05', verdict: 'Authentic', confidence: 85.3, risk: 'Low', color: 'from-green-900 to-green-500' },
  { id: '8', fileName: 'politician_speech_fake.png', date: 'Aug 18, 2026 08:45', verdict: 'Deepfake', confidence: 97.8, risk: 'High', color: 'from-red-900 to-red-500' }
];

const STATS = {
  total: 847,
  deepfake: 189,
  aiGenerated: 45,
  authentic: 613
};

const History = ({ onNavigate }) => {
  const [filter, setFilter] = useState('All Results');
  const [dateRange, setDateRange] = useState('All time');
  const [sortOrder, setSortOrder] = useState('Newest first');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const getBadgeClass = (verdict) => {
    switch(verdict) {
      case 'Deepfake': return 'badge-danger bg-red-900/30 text-red-400 border border-red-500/50 px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1';
      case 'AI-Generated': return 'badge-warning bg-amber-900/30 text-amber-400 border border-amber-500/50 px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1';
      case 'Authentic': return 'badge-success bg-green-900/30 text-green-400 border border-green-500/50 px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1';
      default: return 'badge-info bg-blue-900/30 text-blue-400 border border-blue-500/50 px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1';
    }
  };

  const getRiskColor = (risk) => {
    switch(risk) {
      case 'High': return 'text-red-400';
      case 'Medium': return 'text-amber-400';
      case 'Low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const getVerdictIcon = (verdict) => {
    switch(verdict) {
      case 'Deepfake': return <ShieldAlert className="w-3 h-3" />;
      case 'AI-Generated': return <ShieldQuestion className="w-3 h-3" />;
      case 'Authentic': return <ShieldCheck className="w-3 h-3" />;
      default: return null;
    }
  }

  // Empty state component
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-20 text-center glass-panel rounded-xl">
      <FileImage className="w-16 h-16 text-gray-500 mb-4" />
      <h3 className="text-xl font-semibold text-white mb-2">No analyses yet</h3>
      <p className="text-gray-400 max-w-md mb-6">
        You haven't performed any image forensic analyses. Upload an image to get started.
      </p>
      <button onClick={() => onNavigate && onNavigate('dashboard')} className="btn-primary px-6 py-2 rounded-lg bg-neonBlue/20 text-neonBlue border border-neonBlue hover:bg-neonBlue/30 transition-all font-medium">
        Analyze Image
      </button>
    </div>
  );

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto min-h-screen text-gray-200">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 gradient-text">Analysis History</h1>
        <p className="text-gray-400 text-lg">View and manage your past image forensic analyses</p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="glass-panel p-4 rounded-xl flex flex-col">
          <span className="text-gray-400 text-sm font-medium mb-1">Total Analyses</span>
          <span className="text-2xl font-bold text-white glow-blue">{STATS.total}</span>
        </div>
        <div className="glass-panel p-4 rounded-xl flex flex-col border-b-2 border-red-500/50">
          <span className="text-gray-400 text-sm font-medium mb-1">Deepfakes Found</span>
          <span className="text-2xl font-bold text-red-400">{STATS.deepfake}</span>
        </div>
        <div className="glass-panel p-4 rounded-xl flex flex-col border-b-2 border-amber-500/50">
          <span className="text-gray-400 text-sm font-medium mb-1">AI-Generated</span>
          <span className="text-2xl font-bold text-amber-400">{STATS.aiGenerated}</span>
        </div>
        <div className="glass-panel p-4 rounded-xl flex flex-col border-b-2 border-green-500/50">
          <span className="text-gray-400 text-sm font-medium mb-1">Authentic</span>
          <span className="text-2xl font-bold text-green-400">{STATS.authentic}</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel p-4 rounded-xl mb-6 flex flex-col lg:flex-row gap-4 justify-between items-center z-10 relative">
        <div className="relative w-full lg:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search files..." 
            className="glass-input w-full bg-darkBg/50 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-neonBlue text-white"
          />
        </div>
        
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <div className="flex items-center gap-2 bg-darkBg/50 border border-white/10 rounded-lg p-1">
            <Filter className="w-4 h-4 text-gray-400 ml-2" />
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-transparent text-sm text-gray-200 outline-none border-none py-1 pr-2 appearance-none cursor-pointer"
            >
              <option className="bg-darkBg text-white">All Results</option>
              <option className="bg-darkBg text-white">Deepfake</option>
              <option className="bg-darkBg text-white">AI-Generated</option>
              <option className="bg-darkBg text-white">Authentic</option>
            </select>
          </div>

          <div className="flex items-center bg-darkBg/50 border border-white/10 rounded-lg p-1">
            <Calendar className="w-4 h-4 text-gray-400 ml-2 mr-1" />
            <div className="flex text-xs">
              {['Last 7 days', 'Last 30 days', 'All time'].map(period => (
                <button 
                  key={period}
                  onClick={() => setDateRange(period)}
                  className={`px-3 py-1.5 rounded-md transition-colors ${dateRange === period ? 'bg-white/10 text-white font-medium' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={() => setSortOrder(sortOrder === 'Newest first' ? 'Oldest first' : 'Newest first')}
            className="flex items-center gap-2 bg-darkBg/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-200 hover:bg-white/5 transition-colors ml-auto lg:ml-0"
          >
            <ArrowDownUp className="w-4 h-4 text-neonBlue" />
            {sortOrder}
          </button>
        </div>
      </div>

      {/* Results List */}
      {MOCK_HISTORY.length > 0 ? (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-3 mb-6"
        >
          {MOCK_HISTORY.map((item) => (
            <motion.div 
              key={item.id} 
              variants={itemVariants}
              className="glass-panel rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center gap-4 hover:bg-white/5 transition-all border border-transparent hover:border-white/10"
            >
              {/* Thumbnail Placeholder */}
              <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${item.color} flex-shrink-0 flex items-center justify-center opacity-80 border border-white/10 shadow-lg`}>
                <FileImage className="text-white/50 w-6 h-6" />
              </div>

              {/* Main Info */}
              <div className="flex-grow min-w-0">
                <h3 className="text-white font-medium truncate text-lg mb-1">{item.fileName}</h3>
                <p className="text-gray-400 text-sm flex items-center gap-2">
                  <Calendar className="w-3 h-3" />
                  {item.date}
                </p>
              </div>

              {/* Badges and Stats */}
              <div className="flex flex-wrap md:flex-nowrap items-center gap-4 md:gap-6 mt-2 md:mt-0 w-full md:w-auto">
                <div className="w-28">
                  <span className={getBadgeClass(item.verdict)}>
                    {getVerdictIcon(item.verdict)}
                    {item.verdict}
                  </span>
                </div>
                
                <div className="flex flex-col items-center min-w-20">
                  <span className="text-xs text-gray-400 mb-1">Confidence</span>
                  <span className="font-semibold text-white">{item.confidence}%</span>
                </div>
                
                <div className="flex flex-col items-center min-w-16">
                  <span className="text-xs text-gray-400 mb-1">Risk</span>
                  <span className={`font-semibold ${getRiskColor(item.risk)}`}>{item.risk}</span>
                </div>

                <button className="btn-ghost ml-auto md:ml-0 flex items-center gap-2 text-neonBlue hover:bg-neonBlue/10 px-3 py-2 rounded-lg transition-colors text-sm font-medium border border-neonBlue/30 hover:border-neonBlue">
                  <Eye className="w-4 h-4" />
                  View Report
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <EmptyState />
      )}

      {/* Pagination */}
      {MOCK_HISTORY.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between glass-panel p-4 rounded-xl gap-4">
          <span className="text-sm text-gray-400">
            Showing <span className="text-white font-medium">1-8</span> of <span className="text-white font-medium">{STATS.total}</span> results
          </span>
          
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg bg-darkBg/50 border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled>
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-1">
              <button className="w-8 h-8 rounded-lg bg-neonBlue/20 text-neonBlue border border-neonBlue flex items-center justify-center text-sm font-medium">1</button>
              <button className="w-8 h-8 rounded-lg hover:bg-white/5 text-gray-300 flex items-center justify-center text-sm font-medium transition-colors">2</button>
              <button className="w-8 h-8 rounded-lg hover:bg-white/5 text-gray-300 flex items-center justify-center text-sm font-medium transition-colors">3</button>
              <span className="text-gray-500 px-1">...</span>
              <button className="w-8 h-8 rounded-lg hover:bg-white/5 text-gray-300 flex items-center justify-center text-sm font-medium transition-colors">106</button>
            </div>
            <button className="p-2 rounded-lg bg-darkBg/50 border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;
