import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  ArrowDownUp, 
  ShieldAlert, 
  ShieldCheck, 
  ShieldQuestion,
  FileImage,
  Loader2,
  Download
} from 'lucide-react';
import { getAuthHeaders } from '../App';

const History = ({ onNavigate }) => {
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState({ total: 0, deepfake: 0, suspicious: 0, authentic: 0 });
  const [filter, setFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchHistory = async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (filter) params.set('verdict', filter);
      params.set('sort', sortOrder);

      const res = await fetch(`/api/history?${params}`, {
        headers: getAuthHeaders(),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to load history');
      }

      const data = await res.json();
      setHistory(data.history || []);
      setStats(data.stats || { total: 0, deepfake: 0, suspicious: 0, authentic: 0 });
    } catch (err) {
      setError(err.message);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [filter, sortOrder]);

  // Client-side search filtering
  const filteredHistory = searchQuery
    ? history.filter(h => h.fileName?.toLowerCase().includes(searchQuery.toLowerCase()))
    : history;

  const getVerdictIcon = (verdict) => {
    if (verdict === 'Deepfake') return <ShieldAlert size={14} className="text-red-400" />;
    if (verdict === 'Suspicious') return <ShieldQuestion size={14} className="text-amber-400" />;
    return <ShieldCheck size={14} className="text-green-400" />;
  };

  const getVerdictStyle = (verdict) => {
    if (verdict === 'Deepfake') return 'text-red-400 bg-red-400/10 border-red-400/20';
    if (verdict === 'Suspicious') return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
    return 'text-green-400 bg-green-400/10 border-green-400/20';
  };

  const getRiskStyle = (risk) => {
    if (risk === 'High') return 'text-red-400';
    if (risk === 'Medium') return 'text-amber-400';
    return 'text-green-400';
  };

  return (
    <div className="min-h-screen bg-[#000000] text-neutral-200 font-sans p-6 pb-20">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">Analysis History</h1>
          <p className="text-sm text-neutral-500 mt-1">View past forensic analysis results</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Analyses', value: stats.total, color: 'text-white' },
            { label: 'Deepfake', value: stats.deepfake, color: 'text-red-400' },
            { label: 'Suspicious', value: stats.suspicious, color: 'text-amber-400' },
            { label: 'Authentic', value: stats.authentic, color: 'text-green-400' },
          ].map((s, i) => (
            <div key={i} className="bg-[#0a0a0a] border border-neutral-800 rounded-xl p-5">
              <span className="text-xs text-neutral-500 uppercase tracking-widest font-medium">{s.label}</span>
              <p className={`text-3xl font-semibold mt-2 ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600" />
            <input
              type="text"
              placeholder="Search by file name…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-lg text-sm bg-neutral-900/50 border border-neutral-800 text-white placeholder:text-neutral-600 outline-none focus:border-neutral-600 transition-colors"
            />
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600 pointer-events-none" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="pl-9 pr-8 py-2.5 rounded-lg text-sm bg-neutral-900/50 border border-neutral-800 text-neutral-300 outline-none focus:border-neutral-600 appearance-none cursor-pointer"
              >
                <option value="">All Results</option>
                <option value="Deepfake">Deepfake</option>
                <option value="Suspicious">Suspicious</option>
                <option value="Authentic">Authentic</option>
              </select>
            </div>
            <div className="relative">
              <ArrowDownUp size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600 pointer-events-none" />
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="pl-9 pr-8 py-2.5 rounded-lg text-sm bg-neutral-900/50 border border-neutral-800 text-neutral-300 outline-none focus:border-neutral-600 appearance-none cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Table */}
        <div className="bg-[#0a0a0a] border border-neutral-800 rounded-xl overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 size={20} className="animate-spin text-neutral-500" />
              <span className="ml-3 text-sm text-neutral-500">Loading history…</span>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20">
              <p className="text-sm text-red-400 mb-2">{error}</p>
              <button onClick={fetchHistory} className="text-xs text-white bg-neutral-800 px-4 py-2 rounded-lg hover:bg-neutral-700 transition-colors">
                Retry
              </button>
            </div>
          ) : filteredHistory.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <FileImage size={32} className="text-neutral-700 mb-3" />
              <p className="text-sm text-neutral-500">
                {searchQuery || filter ? 'No results match your filters.' : 'No analyses yet. Upload an image to get started.'}
              </p>
            </div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="bg-neutral-900/50 text-neutral-500 border-b border-neutral-800">
                <tr>
                  <th className="px-5 py-3.5 font-medium text-xs uppercase tracking-wider">File</th>
                  <th className="px-5 py-3.5 font-medium text-xs uppercase tracking-wider">Date</th>
                  <th className="px-5 py-3.5 font-medium text-xs uppercase tracking-wider">Verdict</th>
                  <th className="px-5 py-3.5 font-medium text-xs uppercase tracking-wider">Confidence</th>
                  <th className="px-5 py-3.5 font-medium text-xs uppercase tracking-wider">Risk</th>
                  <th className="px-5 py-3.5 font-medium text-xs uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/50">
                {filteredHistory.map((item, i) => (
                  <motion.tr
                    key={item.id || i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="hover:bg-neutral-900/50 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <FileImage size={14} className="text-neutral-600 flex-shrink-0" />
                        <span className="text-neutral-200 font-medium truncate max-w-[200px]">{item.fileName}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-neutral-500">{item.date}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold border rounded-full ${getVerdictStyle(item.verdict)}`}>
                        {getVerdictIcon(item.verdict)}
                        {item.verdict}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-neutral-300 font-mono">{item.confidence}%</td>
                    <td className={`px-5 py-4 font-medium ${getRiskStyle(item.risk)}`}>{item.risk}</td>
                    <td className="px-5 py-4 text-right">
                      <button 
                        onClick={() => window.open(`http://localhost:8000/api/report/${item.id}`, '_blank')}
                        className="inline-flex items-center justify-center p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                        title="Download PDF Report"
                      >
                        <Download size={14} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default History;
