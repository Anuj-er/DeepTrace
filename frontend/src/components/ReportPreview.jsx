import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, Printer, ShieldAlert, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

const Badge = ({ children, variant }) => {
  const styles = {
    danger: 'text-red-400 bg-red-400/10 border-red-400/20',
    success: 'text-green-400 bg-green-400/10 border-green-400/20',
    warning: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    neutral: 'text-gray-300 bg-white/5 border-white/10'
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold border rounded-full ${styles[variant] || styles.neutral}`}>
      {children}
    </span>
  );
};

const ProgressBar = ({ label, value, level }) => {
  const getLevelColor = () => {
    if (level === 'high') return 'bg-red-500';
    if (level === 'medium') return 'bg-amber-500';
    return 'bg-green-500';
  };
  
  return (
    <div>
      <div className="flex justify-between text-xs mb-2">
        <span className="text-neutral-400 font-medium">{label}</span>
        <span className="text-neutral-200 font-mono">{value}%</span>
      </div>
      <div className="h-1.5 w-full bg-neutral-900 rounded-full overflow-hidden border border-neutral-800">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className={`h-full rounded-full ${getLevelColor()}`}
        />
      </div>
    </div>
  );
};

const ImageBox = ({ src, label }) => (
  <div className="flex flex-col gap-3 p-3 border border-neutral-800 rounded-xl bg-neutral-900/30">
    <div className="aspect-[4/3] rounded-lg bg-black border border-neutral-800 overflow-hidden flex items-center justify-center">
      {src ? (
        <img src={src} alt={label} className="w-full h-full object-contain" />
      ) : (
        <span className="text-xs text-neutral-600">Not available</span>
      )}
    </div>
    <span className="text-xs font-medium text-neutral-400 px-1">{label}</span>
  </div>
);

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
  const findings = d.findings || [];
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
    <div className="min-h-screen bg-[#000000] p-6 pb-20 font-sans selection:bg-neutral-800">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Navigation & Actions */}
        <div className="flex items-center justify-between">
          <button onClick={onBack} className="text-sm font-medium text-neutral-400 hover:text-white transition-colors flex items-center gap-2">
            <ArrowLeft size={16} />
            Back to Results
          </button>
          <div className="flex items-center gap-3">
            <button onClick={() => window.print()} className="text-sm font-medium text-neutral-400 hover:text-white transition-colors flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-white/5">
              <Printer size={14} /> Print
            </button>
            <button onClick={handleDownloadPDF} className="text-sm font-medium text-black bg-white hover:bg-neutral-200 transition-colors flex items-center gap-2 px-4 py-1.5 rounded-md">
              <Download size={14} /> Download PDF
            </button>
          </div>
        </div>

        {/* Report Paper */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-[#0a0a0a] border border-neutral-800 rounded-xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="p-8 border-b border-neutral-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-[#050505]">
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-7 h-7 rounded-md bg-neutral-900 border border-neutral-800 flex items-center justify-center">
                  <ShieldCheck size={14} className="text-neutral-300" />
                </div>
                <span className="text-xs font-semibold tracking-widest text-neutral-400 uppercase">DeepTrace</span>
              </div>
              <h1 className="text-2xl font-semibold text-white tracking-tight">Forensic Analysis Report</h1>
            </div>
            <div className="flex flex-col gap-2.5 items-start md:items-end text-sm">
              <div className="flex items-center gap-3">
                <span className="text-neutral-500 text-xs uppercase tracking-wider font-medium">Report ID</span>
                <span className="font-mono text-neutral-300 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800 text-xs">{d.id ? d.id.toUpperCase() : 'N/A'}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-neutral-500 text-xs uppercase tracking-wider font-medium">Generated</span>
                <span className="text-neutral-300 text-sm">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-12">
            
            {/* Section 1: Executive Summary */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-10 border-b border-neutral-900">
              <div className="md:col-span-2 space-y-5">
                <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-widest">Overall Assessment</h2>
                <div className="flex items-center gap-4">
                  <h3 className={`text-3xl font-semibold ${isReal ? 'text-green-500' : 'text-red-500'}`}>
                    {verdict.toUpperCase()}
                  </h3>
                  <Badge variant={isReal ? 'success' : 'danger'}>
                    {isReal ? <CheckCircle2 size={12} /> : <AlertTriangle size={12} />}
                    {risk.toUpperCase()} RISK
                  </Badge>
                </div>
                <p className="text-neutral-400 text-sm leading-relaxed max-w-xl">
                  DeepTrace forensic analysis indicates {isReal ? 'no significant' : 'significant'} manipulation patterns in the provided media. The model is {confidence}% confident in this classification based on spatial artifacts, error level variance, and face region analysis.
                </p>
              </div>
              <div className="flex flex-col items-start md:items-end justify-center">
                <span className="text-xs font-semibold text-neutral-500 mb-3 uppercase tracking-widest">Confidence Score</span>
                <div className="text-6xl font-light text-white tracking-tighter">
                  {confidence}<span className="text-2xl text-neutral-600 ml-1 font-normal">%</span>
                </div>
              </div>
            </section>

            {/* Key Forensic Findings */}
            {findings.length > 0 && (
              <section className="p-6 rounded-xl bg-neutral-900/30 border border-neutral-800 space-y-3">
                <h2 className="text-xs font-semibold text-neutral-400 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  Key Forensic Findings
                </h2>
                <ul className="space-y-2.5">
                  {findings.map((finding, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-neutral-300 leading-relaxed">
                      <span className="text-blue-400 font-mono mt-0.5">•</span>
                      <span>{finding}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Layout Grid for Evidence & Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              
              {/* Left Column: Visual Evidence */}
              <section>
                <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-6">Visual Evidence</h2>
                <div className="grid grid-cols-2 gap-4">
                  <ImageBox src={images.original} label="Original Image" />
                  <ImageBox src={images.heatmap} label="Grad-CAM Saliency" />
                  <ImageBox src={images.face_detection} label="Face Detection" />
                  <ImageBox src={images.ela} label="Error Level Analysis" />
                </div>
              </section>

              {/* Right Column: Metrics */}
              <section className="space-y-10">
                {/* Risk Indicators */}
                <div>
                  <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-6">Risk Indicators</h2>
                  <div className="space-y-6">
                    <ProgressBar label="Face Manipulation" value={scores.face_manipulation || 0} level={(scores.face_manipulation || 0) > 50 ? 'high' : 'low'} />
                    <ProgressBar label="Compression Anomaly" value={scores.compression_anomaly || 0} level={(scores.compression_anomaly || 0) > 50 ? 'medium' : 'low'} />
                    <ProgressBar label="Metadata Integrity" value={scores.metadata_integrity || 0} level={(scores.metadata_integrity || 0) < 50 ? 'high' : 'low'} />
                  </div>
                </div>

                {/* Detailed Findings */}
                <div>
                  <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-6">Analysis Metrics</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-5 border border-neutral-800 rounded-xl bg-neutral-900/30">
                      <span className="text-xs text-neutral-500 mb-2 block font-medium">Faces Detected</span>
                      <div className="text-2xl font-semibold text-neutral-200 mb-1">{face.count || 0}</div>
                      <span className="text-[10px] text-neutral-500 font-mono uppercase">Conf: {face.confidence || 0}%</span>
                    </div>
                    <div className="p-5 border border-neutral-800 rounded-xl bg-neutral-900/30">
                      <span className="text-xs text-neutral-500 mb-2 block font-medium">ELA Variance</span>
                      <div className="text-2xl font-semibold text-neutral-200 mb-1">{ela.variance_score || 0}%</div>
                      <span className="text-[10px] text-neutral-500 uppercase truncate block" title={ela.description}>{ela.description || 'Normal'}</span>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Section: Metadata */}
            <section>
              <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-6">File Metadata</h2>
              <div className="border border-neutral-800 rounded-xl overflow-hidden">
                <table className="w-full text-sm text-left">
                  <tbody className="divide-y divide-neutral-800/50">
                    {[
                      ['File Name', meta.file_name || '—'],
                      ['File Size', meta.file_size || '—'],
                      ['Dimensions', meta.dimensions || '—'],
                      ['Format', meta.format || '—'],
                      ['Software', meta.software || 'N/A', meta.software && meta.software !== 'N/A'],
                      ['GPS Data', meta.gps_data || '—'],
                    ].map(([k, v, isWarning], i) => (
                      <tr key={i} className="bg-neutral-900/20 hover:bg-neutral-900/50 transition-colors">
                        <td className="px-5 py-3.5 text-neutral-500 w-1/3 font-medium text-xs uppercase tracking-wide">{k}</td>
                        <td className={`px-5 py-3.5 ${isWarning ? 'text-red-400 font-medium' : 'text-neutral-300'}`}>{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Section: Recommendations */}
            <section>
              <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-6">Recommendations</h2>
              <ul className="space-y-4">
                {[
                  'Do not use this media as verified evidence without independent corroboration.',
                  'Flag the source for potential disinformation distribution.',
                  'Retain this report and original file hash for audit records.'
                ].map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-neutral-400">
                    <span className="text-neutral-700 mt-0.5"><CheckCircle2 size={16} /></span>
                    <span className="leading-relaxed">{rec}</span>
                  </li>
                ))}
              </ul>
            </section>

          </div>

          {/* Footer */}
          <div className="bg-[#050505] border-t border-neutral-800 p-6 px-8 flex justify-between items-center text-xs text-neutral-600 font-medium">
            <p>Generated by DeepTrace v1.0</p>
            <div className="px-3 py-1 rounded bg-neutral-900 border border-neutral-800 uppercase tracking-widest text-[9px] text-neutral-500">
              Confidential
            </div>
            <p>Page 1 / 1</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ReportPreview;
