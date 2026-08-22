import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, Printer } from 'lucide-react';

const ReportPreview = ({ onBack, data }) => {
  const d = data || {};
  const verdict = d.verdict || 'Unknown';
  const confidence = d.confidence || 0;
  const risk = d.risk_level || 'Unknown';
  const face = d.face_detection || {};
  const ela = d.ela || {};
  const meta = d.metadata || {};
  const scores = d.scores || {};
  const images = d.images || {};
  const isReal = verdict === 'Authentic';

  const handleDownloadPDF = async () => {
    if (!d.id) return alert('No analysis data available');
    try {
      const res = await fetch(`/api/report/${d.id}`);
      if (!res.ok) throw new Error('Failed to generate report');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `DeepTrace_Report_${d.id}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert('Failed to download report. Make sure backend is running.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 max-w-4xl mx-auto"
    >
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-6">
        <button onClick={onBack} className="btn-ghost rounded-lg text-sm">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 19L5 12L12 5"/></svg>
          Back to Results
        </button>
        <div className="flex gap-3">
          <button onClick={() => window.print()} className="btn-ghost rounded-lg text-sm">
            <Printer size={15} />
            Print
          </button>
          <button onClick={handleDownloadPDF} className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-white/[0.06] border border-white/10 hover:bg-white/[0.1] hover:border-white/20 transition-all">
            <Download size={15} />
            Download PDF
          </button>
        </div>
      </div>

      {/* Report Document */}
      <div className="glass-panel rounded-2xl overflow-hidden">

        {/* Header */}
        <div className="px-8 pt-8 pb-6 border-b border-glassBorder">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <svg width="22" height="22" viewBox="0 0 512 512" fill="none">
                  <path d="M256 60L120 120V240C120 350 178 440 256 472C334 440 392 350 392 240V120L256 60Z" stroke="url(#rpLogoG)" strokeWidth="32" strokeLinejoin="round" fill="none"/>
                  <circle cx="256" cy="256" r="64" fill="url(#rpLogoG)"/>
                  <path d="M208 256 Q256 192 304 256 Q256 320 208 256Z" fill="#0a0a0f"/>
                  <circle cx="256" cy="256" r="24" fill="url(#rpLogoG)"/>
                  <defs><linearGradient id="rpLogoG" x1="0%" y1="0%" x2="100%" y2="100%"><stop stopColor="#00f3ff"/><stop offset="1" stopColor="#9d00ff"/></linearGradient></defs>
                </svg>
                <span className="text-sm font-bold tracking-wider text-gray-300">DEEPTRACE</span>
              </div>
              <h1 className="text-xl font-bold text-white mb-1">Forensic Analysis Report</h1>
              <p className="text-xs text-gray-500">Automated deepfake detection and image integrity assessment</p>
            </div>
            <div className="text-right text-xs space-y-1">
              <p className="text-gray-500">Report ID</p>
              <p className="text-gray-300 font-mono font-medium">DT-{(d.id || 'N/A').toUpperCase()}</p>
              <p className="text-gray-500 mt-2">Date</p>
              <p className="text-gray-300">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="px-8 py-6 border-b border-glassBorder">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">1 — Executive Summary</h3>
          <div className={`rounded-xl ${isReal ? 'bg-green-500/[0.06] border-green-500/10' : 'bg-red-500/[0.06] border-red-500/10'} border p-5`}>
            <div className="flex items-start gap-3 mb-3">
              <div className={`w-8 h-8 rounded-lg ${isReal ? 'bg-green-500/10' : 'bg-red-500/10'} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={isReal ? '#22c55e' : '#ef4444'} strokeWidth="2" strokeLinecap="round">
                  {isReal
                    ? <path d="M20 6L9 17L4 12"/>
                    : <><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>
                  }
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-200">
                  The submitted image has been classified as <span className={`font-semibold ${isReal ? 'text-green-400' : 'text-red-400'}`}>{verdict}</span> with <span className="text-white font-semibold">{confidence}%</span> confidence.
                </p>
                <div className="flex items-center gap-3 mt-3">
                  <span className="text-xs text-gray-500">Risk Level</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                    risk === 'High' ? 'text-red-400 bg-red-500/15 border-red-500/20'
                    : risk === 'Medium' ? 'text-amber-400 bg-amber-500/15 border-amber-500/20'
                    : 'text-green-400 bg-green-500/15 border-green-500/20'
                  }`}>{risk}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Visual Evidence */}
        <div className="px-8 py-6 border-b border-glassBorder">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">2 — Visual Evidence</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="aspect-[4/3] rounded-xl border border-white/10 overflow-hidden bg-black/30">
                {images.original ? (
                  <img src={images.original} alt="Original" className="w-full h-full object-cover"/>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-gray-600">Original Image</div>
                )}
              </div>
              <p className="text-[10px] text-gray-500 text-center mt-2">Submitted file</p>
            </div>
            <div>
              <div className="aspect-[4/3] rounded-xl border border-red-500/15 overflow-hidden bg-black/30">
                {images.heatmap ? (
                  <img src={images.heatmap} alt="Heatmap" className="w-full h-full object-cover"/>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-gray-600">Heatmap</div>
                )}
              </div>
              <p className="text-[10px] text-red-400/50 text-center mt-2">Saliency heatmap</p>
            </div>
          </div>
        </div>

        {/* Detailed Findings */}
        <div className="px-8 py-6 border-b border-glassBorder">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">3 — Detailed Findings</h3>
          <div className="space-y-5">
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-2">3.1 Face Detection</h4>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Faces Detected', value: String(face.count || 0) },
                  { label: 'Detection Confidence', value: `${face.confidence || 0}%` },
                  { label: 'Manipulation Probability', value: `${face.manipulation_score || 0}%`, danger: true },
                ].map(item => (
                  <div key={item.label} className="rounded-lg bg-white/[0.02] border border-glassBorder px-3 py-2.5">
                    <p className="text-[10px] text-gray-500 mb-0.5">{item.label}</p>
                    <p className={`text-sm font-semibold ${item.danger ? 'text-red-400' : 'text-gray-200'}`}>{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-2">3.2 Error Level Analysis</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-white/[0.02] border border-glassBorder px-3 py-2.5">
                  <p className="text-[10px] text-gray-500 mb-0.5">Compression Variance</p>
                  <p className="text-sm font-semibold text-amber-400">{ela.variance_score || 0}%</p>
                </div>
                <div className="rounded-lg bg-white/[0.02] border border-glassBorder px-3 py-2.5">
                  <p className="text-[10px] text-gray-500 mb-0.5">Assessment</p>
                  <p className="text-sm font-semibold text-gray-200">{ela.description || '—'}</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-2">3.3 Metadata</h4>
              <div className="rounded-xl bg-white/[0.015] border border-glassBorder overflow-hidden">
                <table className="w-full text-xs">
                  <tbody className="divide-y divide-white/[0.04]">
                    {[
                      ['File Name', meta.file_name || '—'],
                      ['File Size', meta.file_size || '—'],
                      ['Dimensions', meta.dimensions || '—'],
                      ['Format', meta.format || '—'],
                      ['Software', meta.software || 'N/A'],
                      ['GPS Data', meta.gps_data || '—'],
                    ].map(([k, v], i) => (
                      <tr key={i}>
                        <td className="px-4 py-2 text-gray-500 w-1/3">{k}</td>
                        <td className={`px-4 py-2 ${k === 'Software' && v !== 'N/A' ? 'text-red-400' : 'text-gray-300'}`}>{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Risk Assessment */}
        <div className="px-8 py-6 border-b border-glassBorder">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">4 — Risk Assessment</h3>
          <div className="space-y-2.5">
            {[
              { title: 'Face Manipulation', value: `${scores.face_manipulation || 0}%`, level: (scores.face_manipulation || 0) > 50 ? 'high' : 'medium' },
              { title: 'Compression Anomaly', value: `${scores.compression_anomaly || 0}%`, level: (scores.compression_anomaly || 0) > 50 ? 'high' : 'medium' },
              { title: 'Metadata Integrity', value: `${scores.metadata_integrity || 0}%`, level: (scores.metadata_integrity || 0) < 50 ? 'high' : 'low' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg bg-white/[0.02] border border-glassBorder px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${item.level === 'high' ? 'bg-red-400' : item.level === 'medium' ? 'bg-amber-400' : 'bg-green-400'}`}></div>
                  <span className="text-sm text-gray-200">{item.title}</span>
                </div>
                <span className="text-sm font-semibold text-gray-300">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="px-8 py-6 border-b border-glassBorder">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">5 — Recommendations</h3>
          <div className="space-y-2">
            {[
              'Do not use this media as verified evidence without independent corroboration.',
              'Flag the source for potential disinformation distribution.',
              'Retain this report and original file hash for audit records.',
            ].map((rec, i) => (
              <div key={i} className="flex items-start gap-2.5 text-sm text-gray-400">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00f3ff" strokeWidth="2" strokeLinecap="round" className="mt-0.5 flex-shrink-0"><path d="M20 6L9 17L4 12"/></svg>
                {rec}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-4 flex justify-between items-center text-[10px] text-gray-600">
          <p>Generated by DeepTrace v1.0 · For informational purposes only</p>
          <p>Page 1 of 1</p>
        </div>
      </div>
    </motion.div>
  );
};

export default ReportPreview;
