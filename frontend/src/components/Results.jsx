import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, AlertTriangle, Info, Image as ImageIcon, ShieldCheck, CheckCircle2 } from 'lucide-react';

const Badge = ({ children, variant }) => {
  const styles = {
    danger: 'text-red-400 bg-red-400/10 border-red-400/20',
    success: 'text-green-400 bg-green-400/10 border-green-400/20',
    warning: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    neutral: 'text-neutral-300 bg-white/5 border-white/10'
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold border rounded-full ${styles[variant] || styles.neutral}`}>
      {children}
    </span>
  );
};

const ProgressBar = ({ label, value, level, showPercent = true }) => {
  const getLevelColor = () => {
    if (level === 'high') return 'bg-red-500';
    if (level === 'medium') return 'bg-amber-500';
    return 'bg-green-500';
  };
  
  return (
    <div>
      <div className="flex justify-between text-xs mb-2">
        <span className="text-neutral-400 font-medium">{label}</span>
        {showPercent && <span className="text-neutral-200 font-mono">{value}%</span>}
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

const ImageBox = ({ src, label, tag }) => (
  <div className="flex flex-col gap-3 p-3 border border-neutral-800 rounded-xl bg-[#050505]">
    <div className="flex justify-between items-center px-1">
      <span className="text-xs font-medium text-neutral-400 uppercase tracking-widest">{label}</span>
      {tag && <span className="text-[10px] text-neutral-500 font-mono uppercase bg-neutral-900 px-1.5 py-0.5 rounded border border-neutral-800">{tag}</span>}
    </div>
    <div className="aspect-[4/3] rounded-lg bg-black border border-neutral-800 overflow-hidden flex items-center justify-center relative">
      {src ? (
        <img src={src} alt={label} className="absolute inset-0 w-full h-full object-contain" />
      ) : (
        <span className="text-xs text-neutral-600">Not available</span>
      )}
    </div>
  </div>
);

const Results = ({ onReset, onViewReport, file, data }) => {
  const d = data || {};
  const verdict = d.verdict || 'Deepfake';
  const confidence = d.confidence || 0;
  const risk = d.risk_level || 'Unknown';
  const face = d.face_detection || {};
  const ela = d.ela || {};
  const meta = d.metadata || {};
  const images = d.images || {};
  const scores = d.scores || {};
  const findings = d.findings || [];

  const isReal = verdict === 'Authentic';
  const verdictColor = isReal ? 'text-green-500' : 'text-red-500';

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <div className="min-h-screen bg-[#000000] text-gray-200 font-sans selection:bg-neutral-800 p-6 pb-20">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Navigation */}
        <div className="flex items-center justify-between">
          <button onClick={onReset} className="text-sm font-medium text-neutral-400 hover:text-white transition-colors flex items-center gap-2">
            <ArrowLeft size={16} />
            Back to Upload
          </button>
          <button onClick={onViewReport} className="text-sm font-medium text-black bg-white hover:bg-neutral-200 transition-colors flex items-center gap-2 px-4 py-2 rounded-md shadow-lg shadow-white/10">
            <Download size={14} /> View Detailed Report
          </button>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-12 gap-8"
        >
          {/* Left Column: Overview */}
          <motion.div variants={itemVariants} className="lg:col-span-4 space-y-8">
            
            {/* Verdict Card */}
            <div className="bg-[#0a0a0a] border border-neutral-800 rounded-xl p-8 flex flex-col shadow-2xl">
              <div className="mb-6 flex justify-between items-start">
                <div className="w-8 h-8 rounded-md bg-neutral-900 border border-neutral-800 flex items-center justify-center">
                  <ShieldCheck size={16} className="text-neutral-400" />
                </div>
                <Badge variant={isReal ? 'success' : 'danger'}>
                  {isReal ? <CheckCircle2 size={12} /> : <AlertTriangle size={12} />}
                  {risk.toUpperCase()} RISK
                </Badge>
              </div>
              
              <div className="mb-8">
                <span className="text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-3 block">Confidence Score</span>
                <div className="text-7xl font-light text-white tracking-tighter flex items-baseline">
                  {confidence}<span className="text-3xl text-neutral-600 ml-1 font-normal">%</span>
                </div>
              </div>

              <div className="pt-6 border-t border-neutral-800/50">
                <span className="text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-2 block">Detection Result</span>
                <h3 className={`text-2xl font-semibold ${verdictColor}`}>
                  {verdict === 'Deepfake' ? 'DEEPFAKE DETECTED' : verdict === 'Suspicious' ? 'SUSPICIOUS IMAGE' : 'AUTHENTIC IMAGE'}
                </h3>
                <p className="text-sm text-neutral-400 mt-2">
                  {isReal ? 'No significant manipulation indicators found.' : 'Manipulation indicators found in this image.'}
                </p>
              </div>
            </div>

            {/* Risk Metrics */}
            <div className="bg-[#0a0a0a] border border-neutral-800 rounded-xl p-8 space-y-7 shadow-xl">
              <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-2 block">Risk Indicators</h3>
              <ProgressBar label="Face Manipulation" value={scores.face_manipulation || 0} level={(scores.face_manipulation || 0) > 50 ? 'high' : 'low'} />
              <ProgressBar label="Compression Anomaly" value={scores.compression_anomaly || 0} level={(scores.compression_anomaly || 0) > 50 ? 'medium' : 'low'} />
              <ProgressBar label="Metadata Integrity" value={scores.metadata_integrity || 0} level={(scores.metadata_integrity || 0) < 50 ? 'high' : 'low'} />
            </div>

            {/* Forensic Rationale */}
            {findings.length > 0 && (
              <div className="bg-[#0a0a0a] border border-neutral-800 rounded-xl p-8 space-y-4 shadow-xl">
                <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-widest block">Forensic Rationale</h3>
                <ul className="space-y-3">
                  {findings.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-xs text-neutral-300 leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>

          {/* Right Column: Evidence */}
          <motion.div variants={itemVariants} className="lg:col-span-8 space-y-8">
            
            {/* Visual Analysis */}
            <div className="bg-[#0a0a0a] border border-neutral-800 rounded-xl p-8 shadow-2xl">
              <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-6 flex items-center">
                <ImageIcon className="w-4 h-4 mr-2" />
                Visual Forensic Analysis
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <ImageBox src={images.original} label="Original Image" />
                <ImageBox src={images.heatmap} label="Saliency Heatmap" tag="Grad-CAM" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ImageBox 
                  src={images.face_detection} 
                  label="Face Detection" 
                  tag={face.detected ? `${face.count} Faces (${face.confidence}%)` : 'No Faces'} 
                />
                <ImageBox 
                  src={images.ela} 
                  label="Error Level Analysis" 
                  tag={`${ela.variance_score || 0}% Var`} 
                />
              </div>
            </div>

            {/* EXIF Metadata */}
            <div className="bg-[#0a0a0a] border border-neutral-800 rounded-xl p-8 shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-widest flex items-center">
                  <Info className="w-4 h-4 mr-2" />
                  File Metadata
                </h3>
                {meta.software && meta.software !== 'N/A' && (
                  <Badge variant="warning">
                    <AlertTriangle className="w-3 h-3" /> Editing Software Detected
                  </Badge>
                )}
              </div>

              <div className="border border-neutral-800 rounded-xl overflow-hidden">
                <table className="w-full text-sm text-left">
                  <tbody className="divide-y divide-neutral-800/50">
                    {[
                      ['File Name', meta.file_name || (file ? file.name : '—')],
                      ['File Size', meta.file_size || '—'],
                      ['Dimensions', meta.dimensions || '—'],
                      ['Format', meta.format || '—'],
                      ['Color Space', meta.color_space || '—'],
                      ['Camera Model', meta.camera_model || 'N/A'],
                      ['Software', meta.software || 'N/A', meta.software && meta.software !== 'N/A'],
                      ['GPS Data', meta.gps_data || '—'],
                      ['Created', meta.created_date || 'N/A'],
                      ['Modified', meta.modified_date || 'N/A'],
                    ].map(([k, v, isWarning], i) => (
                      <tr key={i} className="bg-neutral-900/20 hover:bg-neutral-900/50 transition-colors">
                        <td className="px-5 py-3.5 text-neutral-500 w-1/3 font-medium text-xs uppercase tracking-wide">{k}</td>
                        <td className={`px-5 py-3.5 ${isWarning ? 'text-red-400 font-medium' : 'text-neutral-300'}`}>{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Results;
