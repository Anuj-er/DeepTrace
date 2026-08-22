import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, Printer } from 'lucide-react';

const ReportPreview = ({ onBack }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 max-w-4xl mx-auto"
    >
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-6">
        <button 
          onClick={onBack}
          className="btn-ghost rounded-lg text-sm"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 19L5 12L12 5"/></svg>
          Back to Results
        </button>
        <div className="flex gap-3">
          <button className="btn-ghost rounded-lg text-sm">
            <Printer size={15} />
            Print
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-white/[0.06] border border-white/10 hover:bg-white/[0.1] hover:border-white/20 transition-all">
            <Download size={15} />
            Download PDF
          </button>
        </div>
      </div>

      {/* Report Document */}
      <div className="glass-panel rounded-2xl overflow-hidden">
        
        {/* Report Header */}
        <div className="px-8 pt-8 pb-6 border-b border-glassBorder">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <svg width="22" height="22" viewBox="0 0 512 512" fill="none">
                  <path d="M256 60L120 120V240C120 350 178 440 256 472C334 440 392 350 392 240V120L256 60Z" stroke="url(#rpLogoG)" strokeWidth="32" strokeLinejoin="round" fill="none"/>
                  <circle cx="256" cy="256" r="64" fill="url(#rpLogoG)"/>
                  <path d="M208 256 Q256 192 304 256 Q256 320 208 256Z" fill="#0a0a0f"/>
                  <circle cx="256" cy="256" r="24" fill="url(#rpLogoG)"/>
                  <defs>
                    <linearGradient id="rpLogoG" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop stopColor="#00f3ff"/>
                      <stop offset="1" stopColor="#9d00ff"/>
                    </linearGradient>
                  </defs>
                </svg>
                <span className="text-sm font-bold tracking-wider text-gray-300">DEEPTRACE</span>
              </div>
              <h1 className="text-xl font-bold text-white mb-1">Forensic Analysis Report</h1>
              <p className="text-xs text-gray-500">Automated deepfake detection and image integrity assessment</p>
            </div>
            <div className="text-right text-xs space-y-1">
              <p className="text-gray-500">Report ID</p>
              <p className="text-gray-300 font-mono font-medium">DT-2026-08-21-0847</p>
              <p className="text-gray-500 mt-2">Date</p>
              <p className="text-gray-300">August 21, 2026</p>
              <span className="inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider text-red-400 bg-red-500/10 border border-red-500/15">
                CONFIDENTIAL
              </span>
            </div>
          </div>
        </div>

        {/* Section 1: Executive Summary */}
        <div className="px-8 py-6 border-b border-glassBorder">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">1 — Executive Summary</h3>
          
          <div className="rounded-xl bg-red-500/[0.06] border border-red-500/10 p-5">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              </div>
              <div>
                <p className="text-sm text-gray-200">
                  The submitted image has been classified as a <span className="text-red-400 font-semibold">Deepfake</span> with <span className="text-white font-semibold">92.4%</span> confidence.
                </p>
                <div className="flex items-center gap-3 mt-3">
                  <span className="text-xs text-gray-500">Risk Level</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold text-red-400 bg-red-500/15 border border-red-500/20 uppercase tracking-wider">High</span>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed mt-3">
              Forensic analysis identified inconsistencies in facial boundary blending, anomalous compression artifacts in the facial region, and stripped metadata — indicators consistent with AI-generated manipulation.
            </p>
          </div>
        </div>

        {/* Section 2: Visual Evidence */}
        <div className="px-8 py-6 border-b border-glassBorder">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">2 — Visual Evidence</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="aspect-[4/3] rounded-xl border border-dashed border-white/10 bg-gradient-to-br from-white/[0.02] to-transparent flex flex-col items-center justify-center gap-2">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" className="text-gray-600">
                  <rect x="3" y="3" width="18" height="18" rx="3"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <path d="M21 15L16 10L5 21"/>
                </svg>
                <span className="text-[11px] text-gray-600">Original Image</span>
              </div>
              <p className="text-[10px] text-gray-500 text-center mt-2">Submitted file preview</p>
            </div>
            <div>
              <div className="aspect-[4/3] rounded-xl border border-dashed border-red-500/15 bg-gradient-to-br from-red-500/[0.03] to-orange-500/[0.02] flex flex-col items-center justify-center gap-2 relative overflow-hidden">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" className="text-red-500/40 relative z-10">
                  <path d="M2 12C2 6.5 6.5 2 12 2a10 10 0 018.9 5.5"/>
                  <path d="M22 12c0 5.5-4.5 10-10 10a10 10 0 01-8.9-5.5"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
                <span className="text-[11px] text-red-500/40 relative z-10">Grad-CAM Heatmap</span>
              </div>
              <p className="text-[10px] text-red-400/50 text-center mt-2">Manipulation regions</p>
            </div>
          </div>
        </div>

        {/* Section 3: Detailed Findings */}
        <div className="px-8 py-6 border-b border-glassBorder">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">3 — Detailed Findings</h3>
          
          <div className="space-y-5">
            {/* Face Detection */}
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-2">3.1 Face Detection</h4>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Faces Detected', value: '1' },
                  { label: 'Detection Confidence', value: '98.7%' },
                  { label: 'Manipulation Probability', value: '87.0%', danger: true },
                ].map(item => (
                  <div key={item.label} className="rounded-lg bg-white/[0.02] border border-glassBorder px-3 py-2.5">
                    <p className="text-[10px] text-gray-500 mb-0.5">{item.label}</p>
                    <p className={`text-sm font-semibold ${item.danger ? 'text-red-400' : 'text-gray-200'}`}>{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ELA */}
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-2">3.2 Error Level Analysis</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-white/[0.02] border border-glassBorder px-3 py-2.5">
                  <p className="text-[10px] text-gray-500 mb-0.5">Boundary Variance</p>
                  <p className="text-sm font-semibold text-amber-400">High (z-score: 3.4)</p>
                </div>
                <div className="rounded-lg bg-white/[0.02] border border-glassBorder px-3 py-2.5">
                  <p className="text-[10px] text-gray-500 mb-0.5">Compression Anomaly</p>
                  <p className="text-sm font-semibold text-red-400">72.0%</p>
                </div>
              </div>
            </div>

            {/* Metadata */}
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-2">3.3 Metadata</h4>
              <div className="rounded-xl bg-white/[0.015] border border-glassBorder overflow-hidden">
                <table className="w-full text-xs">
                  <tbody className="divide-y divide-white/[0.04]">
                    {[
                      ['File Name', 'evidence_suspect_01.jpg'],
                      ['File Size', '2.4 MB'],
                      ['Format', 'JPEG (Lossy)'],
                      ['Software', 'Adobe Photoshop 24.0'],
                      ['GPS Data', 'Stripped'],
                    ].map(([k, v], i) => (
                      <tr key={i}>
                        <td className="px-4 py-2 text-gray-500 w-1/3">{k}</td>
                        <td className={`px-4 py-2 ${k === 'Software' ? 'text-red-400' : k === 'GPS Data' ? 'text-amber-400' : 'text-gray-300'}`}>{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Risk Assessment */}
        <div className="px-8 py-6 border-b border-glassBorder">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">4 — Risk Assessment</h3>
          <div className="space-y-2.5">
            {[
              { title: 'Synthetic Face Generation', desc: 'High probability of diffusion-based synthesis in facial region.', level: 'high' },
              { title: 'Metadata Tampering', desc: 'Original EXIF data has been completely wiped.', level: 'medium' },
              { title: 'Lighting Inconsistencies', desc: 'Shadow trajectories misaligned with light sources.', level: 'medium' },
            ].map((risk, i) => (
              <div key={i} className="flex items-start gap-3 rounded-lg bg-white/[0.02] border border-glassBorder px-4 py-3">
                <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${risk.level === 'high' ? 'bg-red-400' : 'bg-amber-400'}`}></div>
                <div>
                  <p className="text-sm text-gray-200 font-medium">{risk.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{risk.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 5: Recommendations */}
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
