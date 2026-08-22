import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, AlertTriangle, Target, Zap, FileText, Info, Image as ImageIcon } from 'lucide-react';

const ConfidenceGauge = ({ score }) => {
  return (
    <div className="w-full flex flex-col items-center">
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-5xl font-bold text-white tracking-tight mb-1"
      >
        {score}<span className="text-2xl text-gray-500 font-normal">%</span>
      </motion.p>
      <p className="text-[11px] text-gray-500 uppercase tracking-widest mb-4">Confidence Score</p>
      <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
          className="h-full rounded-full bg-gradient-to-r from-red-500 via-red-400 to-amber-400"
        />
      </div>
    </div>
  );
};

const Results = ({ onReset, onViewReport, file, data }) => {
  // Use real data from API, or show a fallback
  const d = data || {};
  const verdict = d.verdict || 'Deepfake';
  const confidence = d.confidence || 0;
  const risk = d.risk_level || 'Unknown';
  const face = d.face_detection || {};
  const ela = d.ela || {};
  const meta = d.metadata || {};
  const images = d.images || {};
  const scores = d.scores || {};

  const isReal = verdict === 'Authentic';
  const verdictColor = isReal ? 'text-green-400' : 'text-red-400';

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-gray-200 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Top Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <button
            onClick={onReset}
            className="btn-ghost flex items-center px-4 py-2 rounded-lg text-gray-400 hover:text-white transition-all hover:bg-white/5 border border-transparent hover:border-white/10"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Upload
          </button>

          <button
            onClick={onViewReport}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-white/[0.06] border border-white/10 hover:bg-white/[0.1] hover:border-white/20 transition-all"
          >
            <Download className="w-4 h-4" />
            View Report
          </button>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-12 gap-6"
        >
          {/* Left Column: Verdict */}
          <motion.div variants={itemVariants} className="lg:col-span-4 space-y-6">
            <div className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col items-center text-center">
              <div className={`w-full h-0.5 bg-gradient-to-r from-transparent ${isReal ? 'via-green-500/40' : 'via-red-500/40'} to-transparent mb-6`}></div>

              <div className="mb-5">
                <ConfidenceGauge score={confidence} />
              </div>

              <p className={`text-lg font-semibold ${verdictColor} mb-1`}>
                {verdict === 'Deepfake' ? 'Deepfake Detected' : verdict === 'Suspicious' ? 'Suspicious Image' : 'Authentic Image'}
              </p>
              <p className="text-xs text-gray-500 mb-5">
                {isReal ? 'No manipulation indicators found' : 'Manipulation indicators found in this image'}
              </p>

              <div className="flex items-center gap-2 mb-5">
                <span className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 ${
                  risk === 'High' ? 'text-red-400 bg-red-500/10 border border-red-500/20'
                  : risk === 'Medium' ? 'text-amber-400 bg-amber-500/10 border border-amber-500/20'
                  : 'text-green-400 bg-green-500/10 border border-green-500/20'
                }`}>
                  <AlertTriangle className="w-3 h-3" />
                  {risk} Risk
                </span>
                {!isReal && (
                  <span className="px-2.5 py-1 rounded-lg text-[11px] font-semibold text-neonPurple bg-neonPurple/10 border border-neonPurple/20">
                    AI-Generated
                  </span>
                )}
              </div>
            </div>

            {/* Score Bars */}
            <div className="space-y-4">
              {[
                { label: 'Face Manipulation', icon: <Target className="w-4 h-4 mr-2 text-neonBlue"/>, value: scores.face_manipulation || 0, color: 'from-neonBlue to-neonPurple' },
                { label: 'Compression Anomaly', icon: <Zap className="w-4 h-4 mr-2 text-neonPurple"/>, value: scores.compression_anomaly || 0, color: 'bg-neonPurple' },
                { label: 'Metadata Integrity', icon: <FileText className="w-4 h-4 mr-2 text-green-400"/>, value: scores.metadata_integrity || 0, color: 'bg-green-500' },
              ].map(s => (
                <div key={s.label} className="glass-panel p-5 rounded-xl border border-white/5">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-sm font-medium text-gray-300 flex items-center">{s.icon}{s.label}</span>
                    <span className="text-white font-bold">{s.value}%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${s.value}%` }} transition={{ duration: 1, delay: 0.5 }} className={`h-full bg-gradient-to-r ${s.color}`} />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Column: Visual Analysis */}
          <motion.div variants={itemVariants} className="lg:col-span-8 space-y-6">

            {/* Image Comparison */}
            <div className="glass-panel p-6 rounded-2xl border border-white/5">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <ImageIcon className="w-5 h-5 mr-2 text-neonBlue" />
                Visual Forensic Analysis
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Original */}
                <div className="space-y-2">
                  <div className="bg-black/50 rounded-xl overflow-hidden border border-white/10 aspect-[4/3] relative">
                    {images.original ? (
                      <img src={images.original} alt="Original" className="w-full h-full object-cover" />
                    ) : file ? (
                      <img src={URL.createObjectURL(file)} alt="Original" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-600 text-sm">No image</div>
                    )}
                  </div>
                  <div className="text-center text-sm text-gray-400 font-medium">Original Image</div>
                </div>

                {/* Heatmap */}
                <div className="space-y-2">
                  <div className="bg-black/50 rounded-xl overflow-hidden border border-red-500/20 aspect-[4/3] relative">
                    {images.heatmap ? (
                      <img src={images.heatmap} alt="Heatmap" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-600 text-sm">Processing…</div>
                    )}
                  </div>
                  <div className="text-center text-sm text-red-400 font-medium">Saliency Heatmap</div>
                </div>
              </div>
            </div>

            {/* Smaller Panels */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Face Detection */}
              <div className="glass-panel p-5 rounded-2xl border border-white/5 flex flex-col">
                <h4 className="text-sm font-semibold text-gray-300 mb-3 flex justify-between items-center">
                  <span>Face Detection (MTCNN)</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold ${face.detected ? 'text-green-400 bg-green-500/10 border border-green-500/20' : 'text-gray-500 bg-gray-500/10 border border-gray-500/20'}`}>
                    {face.detected ? `${face.confidence}% Conf` : 'No Face'}
                  </span>
                </h4>
                <div className="flex-1 bg-black/50 rounded-lg overflow-hidden border border-white/10 relative min-h-[160px]">
                  {images.face_detection ? (
                    <img src={images.face_detection} alt="Face Detection" className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600 text-sm">No detection data</div>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  {face.count || 0} face(s) detected
                </p>
              </div>

              {/* ELA */}
              <div className="glass-panel p-5 rounded-2xl border border-white/5 flex flex-col">
                <h4 className="text-sm font-semibold text-gray-300 mb-3 flex items-center">
                  <Zap className="w-4 h-4 mr-2 text-neonPurple" />
                  Error Level Analysis
                </h4>
                <div className="flex-1 bg-black/50 rounded-lg overflow-hidden border border-white/10 relative min-h-[160px]">
                  {images.ela ? (
                    <img src={images.ela} alt="ELA" className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600 text-sm">No ELA data</div>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-2 text-center">
                  {ela.description || 'Compression variance analysis'}
                </p>
              </div>
            </div>

            {/* EXIF Table */}
            <div className="glass-panel p-6 rounded-2xl border border-white/5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <Info className="w-5 h-5 mr-2 text-neonBlue" />
                  EXIF Metadata
                </h3>
                {meta.software && meta.software !== 'N/A' && (
                  <span className="px-2.5 py-1 rounded-lg text-xs font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    Editing Software Detected
                  </span>
                )}
              </div>

              <div className="bg-black/40 rounded-xl overflow-hidden border border-white/10 text-sm">
                <table className="w-full text-left border-collapse">
                  <tbody className="divide-y divide-white/5">
                    {[
                      { k: 'File Name', v: meta.file_name || (file ? file.name : '—') },
                      { k: 'File Size', v: meta.file_size || '—' },
                      { k: 'Dimensions', v: meta.dimensions || '—' },
                      { k: 'Format', v: meta.format || '—' },
                      { k: 'Color Space', v: meta.color_space || '—' },
                      { k: 'Camera Model', v: meta.camera_model || 'N/A' },
                      { k: 'Software', v: meta.software || 'N/A' },
                      { k: 'GPS Data', v: meta.gps_data || '—' },
                      { k: 'Created', v: meta.created_date || 'N/A' },
                      { k: 'Modified', v: meta.modified_date || 'N/A' },
                    ].map((row, i) => (
                      <tr key={i} className="hover:bg-white/5 transition-colors">
                        <td className="py-2.5 px-4 text-gray-400 font-medium w-1/3">{row.k}</td>
                        <td className="py-2.5 px-4 text-gray-200">{row.v}</td>
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
