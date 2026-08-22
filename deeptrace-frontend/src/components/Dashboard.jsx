import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';

export default function Dashboard({ onUpload, onNavigate }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  }, []);

  const handleAnalyze = () => {
    if (!selectedFile) return;
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      if (onUpload) onUpload(selectedFile);
    }, 2500);
  };

  const handleClear = () => {
    setSelectedFile(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': [], 'image/png': [], 'image/webp': [] },
    multiple: false,
    disabled: isProcessing
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-neonBlue/10 to-neonPurple/10 border border-glassBorder mb-4">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L3 7V12C3 17.55 6.84 22.74 12 24C17.16 22.74 21 17.55 21 12V7L12 2Z" stroke="url(#shG)" strokeWidth="1.5" strokeLinejoin="round" fill="none"/>
            <path d="M9 12L11 14L15 10" stroke="#00f3ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <defs>
              <linearGradient id="shG" x1="3" y1="2" x2="21" y2="24">
                <stop stopColor="#00f3ff"/>
                <stop offset="1" stopColor="#9d00ff"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        <h2 className="text-2xl font-bold gradient-text-white mb-2">Verify Image Authenticity</h2>
        <p className="text-gray-500 text-sm max-w-md mx-auto">
          Upload an image to run deepfake detection, forensic analysis, and AI-generated content classification.
        </p>
      </div>

      {/* Upload Card */}
      <div className="glass-panel p-6">
        <AnimatePresence mode="wait">
          {isProcessing ? (
            /* Processing State */
            <motion.div
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center py-16"
            >
              <div className="relative mb-6">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  className="w-16 h-16 rounded-full border-2 border-glassBorder border-t-neonBlue"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00f3ff" strokeWidth="2" strokeLinecap="round">
                    <circle cx="12" cy="12" r="3"/>
                    <path d="M12 1V3M12 21V23M4.22 4.22L5.64 5.64M18.36 18.36L19.78 19.78M1 12H3M21 12H23M4.22 19.78L5.64 18.36M18.36 5.64L19.78 4.22"/>
                  </svg>
                </div>
              </div>
              <p className="text-white font-medium mb-1">Analyzing image...</p>
              <p className="text-gray-500 text-sm">Running CNN model, ELA, and metadata extraction</p>

              {/* Progress Steps */}
              <div className="mt-8 w-full max-w-xs space-y-3">
                {['Face Detection (MTCNN)', 'Error Level Analysis', 'Deep Learning Classification'].map((step, i) => (
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.6 }}
                    className="flex items-center gap-3"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: i * 0.6 + 0.4 }}
                      className="w-5 h-5 rounded-full bg-neonBlue/20 border border-neonBlue/40 flex items-center justify-center flex-shrink-0"
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#00f3ff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6L9 17L4 12"/>
                      </svg>
                    </motion.div>
                    <span className="text-xs text-gray-400">{step}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

          ) : selectedFile && preview ? (
            /* Preview State */
            <motion.div
              key="preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-5"
            >
              <div className="relative rounded-xl overflow-hidden bg-black/30 border border-glassBorder">
                <img src={preview} alt="Preview" className="w-full max-h-72 object-contain mx-auto" />
                <button
                  onClick={handleClear}
                  className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-black/60 backdrop-blur border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-red-500/20 hover:border-red-500/30 transition-all"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M18 6L6 18M6 6L18 18"/>
                  </svg>
                </button>
              </div>

              {/* File Info */}
              <div className="flex items-center gap-3 px-1">
                <div className="w-10 h-10 rounded-lg bg-neonBlue/10 border border-neonBlue/20 flex items-center justify-center flex-shrink-0">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00f3ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="3"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <path d="M21 15L16 10L5 21"/>
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white font-medium truncate">{selectedFile.name}</p>
                  <p className="text-xs text-gray-500">{(selectedFile.size / 1024).toFixed(1)} KB · {selectedFile.type.split('/')[1].toUpperCase()}</p>
                </div>
              </div>

              {/* Analyze Button */}
              <button
                onClick={handleAnalyze}
                className="w-full btn-primary py-3.5 rounded-xl text-sm font-semibold"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M2 12C2 6.5 6.5 2 12 2a10 10 0 018.9 5.5"/>
                  <path d="M22 12c0 5.5-4.5 10-10 10a10 10 0 01-8.9-5.5"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
                Run Forensic Analysis
              </button>
            </motion.div>

          ) : (
            /* Drop Zone */
            <motion.div
              key="dropzone"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div
                {...getRootProps()}
                className={`relative border-2 border-dashed rounded-xl py-16 px-6 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 group
                  ${isDragActive
                    ? 'border-neonBlue bg-neonBlue/[0.04]'
                    : 'border-white/[0.08] hover:border-white/20 hover:bg-white/[0.02]'
                  }`}
              >
                <input {...getInputProps()} />

                <div className={`mb-5 p-3.5 rounded-2xl transition-all duration-200 ${isDragActive ? 'bg-neonBlue/10' : 'bg-white/[0.04] group-hover:bg-white/[0.06]'}`}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className={`transition-colors ${isDragActive ? 'stroke-neonBlue' : 'stroke-gray-500 group-hover:stroke-gray-300'}`} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15V19C21 20.1 20.1 21 19 21H5C3.9 21 3 20.1 3 19V15"/>
                    <path d="M17 8L12 3L7 8"/>
                    <path d="M12 3V15"/>
                  </svg>
                </div>

                <p className="text-white font-medium mb-1">
                  {isDragActive ? 'Drop your image here' : 'Drag & drop an image'}
                </p>
                <p className="text-gray-500 text-sm mb-5">or click to browse from your device</p>

                <div className="flex gap-2">
                  {['JPEG', 'PNG', 'WEBP'].map(fmt => (
                    <span key={fmt} className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.06] text-[11px] text-gray-500 font-medium tracking-wide">
                      {fmt}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modules Info — subtle, minimal */}
      <div className="mt-5 grid grid-cols-3 gap-3">
        {[
          { name: 'Face Detection', sub: 'MTCNN', color: '#00f3ff' },
          { name: 'Error Level Analysis', sub: 'ELA', color: '#9d00ff' },
          { name: 'Metadata Scan', sub: 'EXIF', color: '#00ff88' },
        ].map(mod => (
          <div key={mod.name} className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: mod.color, boxShadow: `0 0 6px ${mod.color}40` }} />
            <div>
              <p className="text-xs text-gray-300 font-medium leading-tight">{mod.name}</p>
              <p className="text-[10px] text-gray-600">{mod.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
