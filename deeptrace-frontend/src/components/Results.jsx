import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, AlertTriangle, CheckCircle, Info, ShieldAlert, Target, Image as ImageIcon, Zap, FileText } from 'lucide-react';

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

const Results = ({ onReset, onViewReport, file }) => {
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      // Fallback placeholder if no file
      setImagePreview('https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800');
    }
  }, [file]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0, opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-gray-200 p-6 font-sans selection:bg-neonBlue/30">
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
              <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-red-500/40 to-transparent mb-6"></div>
              
              <div className="mb-5">
                <ConfidenceGauge score={92.4} />
              </div>
              
              <p className="text-lg font-semibold text-red-400 mb-1">Deepfake Detected</p>
              <p className="text-xs text-gray-500 mb-5">Manipulation indicators found in this image</p>
              
              <div className="flex items-center gap-2 mb-5">
                <span className="badge-danger text-[11px]">
                  <AlertTriangle className="w-3 h-3" />
                  High Risk
                </span>
                <span className="px-2.5 py-1 rounded-lg text-[11px] font-semibold text-neonPurple bg-neonPurple/10 border border-neonPurple/20">
                  AI-Generated
                </span>
              </div>
            </div>

            {/* Analysis Summary Cards Row (Vertical in this layout) */}
            <div className="space-y-4">
              <div className="glass-panel p-5 rounded-xl border border-white/5">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-sm font-medium text-gray-300 flex items-center"><Target className="w-4 h-4 mr-2 text-neonBlue"/>Face Manipulation</span>
                  <span className="text-neonBlue font-bold">87%</span>
                </div>
                <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: '87%' }} transition={{ duration: 1, delay: 0.5 }} className="h-full bg-gradient-to-r from-neonBlue to-neonPurple" />
                </div>
              </div>

              <div className="glass-panel p-5 rounded-xl border border-white/5">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-sm font-medium text-gray-300 flex items-center"><Zap className="w-4 h-4 mr-2 text-neonPurple"/>Compression Anomaly</span>
                  <span className="text-neonPurple font-bold">72%</span>
                </div>
                <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: '72%' }} transition={{ duration: 1, delay: 0.6 }} className="h-full bg-neonPurple" />
                </div>
              </div>

              <div className="glass-panel p-5 rounded-xl border border-white/5">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-sm font-medium text-gray-300 flex items-center"><FileText className="w-4 h-4 mr-2 text-red-400"/>Metadata Integrity</span>
                  <span className="text-red-400 font-bold">23%</span>
                </div>
                <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: '23%' }} transition={{ duration: 1, delay: 0.7 }} className="h-full bg-red-500" />
                </div>
              </div>
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
                    {imagePreview && (
                      <img src={imagePreview} alt="Original" className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="text-center text-sm text-gray-400 font-medium">Original Image</div>
                </div>
                
                {/* Grad-CAM */}
                <div className="space-y-2">
                  <div className="bg-black/50 rounded-xl overflow-hidden border border-red-500/30 aspect-[4/3] relative shadow-[0_0_20px_rgba(255,0,0,0.15)]">
                    {imagePreview && (
                      <>
                        <img src={imagePreview} alt="Grad-CAM" className="w-full h-full object-cover filter grayscale" />
                        {/* Simulated Grad-CAM Overlay */}
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,0,0,0.8)_0%,_rgba(255,165,0,0.4)_40%,_rgba(0,0,0,0)_70%)] mix-blend-overlay opacity-80" style={{ backgroundPosition: '50% 30%', backgroundSize: '150% 150%' }}></div>
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,0,0,0.6)_0%,_rgba(255,255,0,0.2)_50%,_rgba(0,0,0,0)_80%)] mix-blend-color opacity-70" style={{ backgroundPosition: '45% 25%', backgroundSize: '120% 120%' }}></div>
                      </>
                    )}
                  </div>
                  <div className="text-center text-sm text-red-400 font-medium flex items-center justify-center">
                    <ShieldAlert className="w-4 h-4 mr-1" />
                    Suspicious Regions (Grad-CAM)
                  </div>
                </div>
              </div>
            </div>

            {/* Smaller Panels Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Face Detection Panel */}
              <div className="glass-panel p-5 rounded-2xl border border-white/5 flex flex-col">
                <h4 className="text-sm font-semibold text-gray-300 mb-3 flex justify-between items-center">
                  <span>Face Detection (MTCNN)</span>
                  <span className="badge-success bg-green-500/10 text-green-400 border border-green-500/30 px-2 py-0.5 rounded text-xs">98.7% Conf</span>
                </h4>
                <div className="flex-1 bg-black/50 rounded-lg overflow-hidden border border-white/10 relative flex items-center justify-center min-h-[160px]">
                  {imagePreview && (
                    <>
                      <img src={imagePreview} alt="Face Detection" className="absolute inset-0 w-full h-full object-cover opacity-50" />
                      {/* Mock Bounding Box */}
                      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <rect x="35" y="20" width="30" height="40" fill="none" stroke="#00ff00" strokeWidth="1" strokeDasharray="4 2" />
                        <rect x="34" y="19" width="3" height="3" fill="#00ff00" />
                        <rect x="63" y="19" width="3" height="3" fill="#00ff00" />
                        <rect x="34" y="58" width="3" height="3" fill="#00ff00" />
                        <rect x="63" y="58" width="3" height="3" fill="#00ff00" />
                      </svg>
                    </>
                  )}
                </div>
              </div>

              {/* Error Level Analysis */}
              <div className="glass-panel p-5 rounded-2xl border border-white/5 flex flex-col">
                <h4 className="text-sm font-semibold text-gray-300 mb-3 flex items-center">
                  <Zap className="w-4 h-4 mr-2 text-neonPurple" />
                  Error Level Analysis
                </h4>
                <div className="flex-1 bg-black/50 rounded-lg overflow-hidden border border-white/10 relative min-h-[160px]">
                  {imagePreview && (
                    <img 
                      src={imagePreview} 
                      alt="ELA" 
                      className="absolute inset-0 w-full h-full object-cover" 
                      style={{ filter: 'contrast(300%) grayscale(100%) invert(100%) brightness(150%) hue-rotate(180deg)' }} 
                    />
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-3 text-center">
                  High variance detected in facial boundary regions
                </p>
              </div>

            </div>

            {/* EXIF Metadata Table */}
            <div className="glass-panel p-6 rounded-2xl border border-white/5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <Info className="w-5 h-5 mr-2 text-neonBlue" />
                  EXIF Metadata Analysis
                </h3>
                <span className="badge-warning bg-amber-500/10 text-amber-400 border border-amber-500/30 px-3 py-1 rounded-md text-xs font-semibold flex items-center">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Metadata Stripped
                </span>
              </div>
              
              <div className="bg-black/40 rounded-xl overflow-hidden border border-white/10 text-sm">
                <table className="w-full text-left border-collapse">
                  <tbody className="divide-y divide-white/5">
                    {[
                      { k: 'File Name', v: file ? file.name : 'image_0094.jpg' },
                      { k: 'File Size', v: file ? `${(file.size / 1024).toFixed(1)} KB` : '4.2 MB' },
                      { k: 'Dimensions', v: '1024 x 1024' },
                      { k: 'Format', v: 'JPEG' },
                      { k: 'Color Space', v: 'sRGB' },
                      { k: 'Camera Model', v: 'N/A (Missing)' },
                      { k: 'Software', v: 'Adobe Photoshop 24.0 (Macintosh)' },
                      { k: 'GPS Data', v: 'Stripped' },
                      { k: 'Created Date', v: '2023-10-15T14:32:00Z' },
                      { k: 'Modified Date', v: '2023-10-16T09:15:22Z' },
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
