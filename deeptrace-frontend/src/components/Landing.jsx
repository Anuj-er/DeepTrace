import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ArrowDown } from 'lucide-react';

// Common Animations
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const Landing = ({ onLaunch }) => {
  const scrollToFeatures = () => {
    document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-gray-200 overflow-x-hidden selection:bg-[#9d00ff] selection:text-white font-sans">
      
      {/* Landing Navbar */}
      <nav className="w-full px-6 py-4 flex items-center justify-between z-30 sticky top-0 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/[0.04]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 512 512" fill="none">
              <path d="M256 60L120 120V240C120 350 178 440 256 472C334 440 392 350 392 240V120L256 60Z" stroke="url(#landLogoG)" strokeWidth="32" strokeLinejoin="round" fill="none"/>
              <circle cx="256" cy="256" r="64" fill="url(#landLogoG)"/>
              <path d="M208 256 Q256 192 304 256 Q256 320 208 256Z" fill="#0a0a0f"/>
              <circle cx="256" cy="256" r="24" fill="url(#landLogoG)"/>
              <defs>
                <linearGradient id="landLogoG" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop stopColor="#00f3ff"/>
                  <stop offset="1" stopColor="#9d00ff"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className="text-lg font-bold tracking-wide">
            <span className="text-white">DEEP</span>
            <span className="text-[#00f3ff]" style={{ textShadow: '0 0 10px rgba(0,243,255,0.4)' }}>TRACE</span>
          </span>
        </div>
        <button
          onClick={onLaunch}
          className="px-4 py-2 rounded-lg text-sm font-medium text-neonBlue border border-neonBlue/20 hover:bg-neonBlue/10 transition-all"
        >
          Get Started
        </button>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative min-h-[85vh] flex items-center justify-center pt-10 pb-16 px-6 overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00f3ff] rounded-full mix-blend-screen filter blur-[120px] opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#9d00ff] rounded-full mix-blend-screen filter blur-[120px] opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          
          <motion.div 
            initial="hidden" 
            animate="visible" 
            variants={staggerContainer}
            className="flex flex-col items-start gap-6"
          >
            <motion.div variants={fadeInUp} className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#00f3ff]/30 bg-[#00f3ff]/10 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-[#00f3ff] animate-ping"></span>
              <span className="w-2 h-2 rounded-full bg-[#00f3ff] absolute"></span>
              <span className="text-sm font-medium neon-text-blue">DeepTrace Engine v1.0 is Live</span>
            </motion.div>
            
            <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight text-white">
              Uncover the Truth in <br />
              <span className="gradient-text bg-gradient-to-r from-[#00f3ff] to-[#9d00ff] bg-clip-text text-transparent">Digital Media</span>
            </motion.h1>
            
            <motion.p variants={fadeInUp} className="text-lg md:text-xl text-gray-400 max-w-lg leading-relaxed">
              Advanced AI-powered deepfake detection. Analyze images instantly, extract forensic metadata, and generate comprehensive trust reports with military-grade precision.
            </motion.p>
            
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 mt-4 w-full sm:w-auto">
              <button onClick={onLaunch} className="px-8 py-4 rounded-lg bg-gradient-to-r from-[#00f3ff] to-[#00a6ff] text-black font-bold text-lg hover:shadow-[0_0_20px_rgba(0,243,255,0.4)] transition-all flex items-center justify-center gap-2 group">
                Launch Dashboard
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button onClick={scrollToFeatures} className="px-8 py-4 rounded-lg glass-panel text-white font-semibold text-lg hover:bg-white/5 transition-all flex items-center justify-center gap-2 border border-white/10">
                Learn More
                <ArrowDown className="w-5 h-5" />
              </button>
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="flex justify-center items-center relative"
          >
            <motion.div 
              animate={{ y: [-10, 10, -10] }} 
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            >
              {/* Custom Hero SVG */}
              <svg width="400" height="400" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_0_30px_rgba(157,0,255,0.4)]">
                {/* Shield Base */}
                <path d="M200 40 L340 90 V180 C340 270 280 340 200 380 C120 340 60 270 60 180 V90 L200 40 Z" stroke="url(#paint0_linear)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="rgba(10,10,15,0.6)" className="backdrop-blur-sm" />
                
                {/* Inner Shield Ring */}
                <path d="M200 70 L310 110 V180 C310 250 260 310 200 340 C140 310 90 250 90 180 V110 L200 70 Z" stroke="#00f3ff" strokeWidth="2" strokeDasharray="10 10" strokeLinecap="round" />
                
                {/* Digital Eye Motif */}
                <ellipse cx="200" cy="200" rx="70" ry="40" stroke="#9d00ff" strokeWidth="3" />
                <circle cx="200" cy="200" r="25" stroke="#00f3ff" strokeWidth="4" fill="rgba(0,243,255,0.1)" />
                <circle cx="200" cy="200" r="10" fill="#00f3ff" />
                
                {/* Scanning Line (Animated via CSS / inline attributes if possible, simplified here) */}
                <line x1="80" y1="120" x2="320" y2="120" stroke="#00f3ff" strokeWidth="2" opacity="0.6">
                  <animate attributeName="y1" values="80;320;80" dur="4s" repeatCount="indefinite" />
                  <animate attributeName="y2" values="80;320;80" dur="4s" repeatCount="indefinite" />
                </line>

                {/* Circuit Nodes */}
                <circle cx="150" cy="120" r="4" fill="#9d00ff" />
                <circle cx="250" cy="120" r="4" fill="#9d00ff" />
                <circle cx="130" cy="250" r="4" fill="#9d00ff" />
                <circle cx="270" cy="250" r="4" fill="#9d00ff" />
                <path d="M150 120 L130 90 M250 120 L270 90 M130 250 L100 280 M270 250 L300 280" stroke="#9d00ff" strokeWidth="2" strokeLinecap="round"/>

                <defs>
                  <linearGradient id="paint0_linear" x1="200" y1="40" x2="200" y2="380" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#9d00ff" />
                    <stop offset="1" stopColor="#00f3ff" />
                  </linearGradient>
                </defs>
              </svg>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* --- STATS SECTION --- */}
      <section className="py-12 border-y border-white/10 bg-[#0a0a0f]/80 relative z-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {[
              { stat: '10,000+', label: 'Images Analyzed', color: '#00f3ff', icon: 'M4 16L12 21L20 16M4 12L12 17L20 12M4 8L12 13L20 8' },
              { stat: '99.2%', label: 'Detection Accuracy', color: '#9d00ff', icon: 'M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z M15 9L11 15L9 13' },
              { stat: '< 3s', label: 'Analysis Speed', color: '#00f3ff', icon: 'M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z' },
              { stat: '6', label: 'Forensic Modules', color: '#9d00ff', icon: 'M12 6V18M12 6L8 10M12 6L16 10M4 12H20M4 18H20M4 6H20' }
            ].map((item, i) => (
              <motion.div key={i} variants={fadeInUp} className="flex flex-col items-center justify-center p-6 glass-panel rounded-xl text-center group">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={item.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-3 group-hover:scale-110 transition-transform">
                  <path d={item.icon} />
                </svg>
                <h3 className="text-3xl font-bold text-white tracking-tight">{item.stat}</h3>
                <p className="text-gray-400 text-sm mt-1">{item.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* --- CORE FEATURES GRID --- */}
      <section id="features-section" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Powered by <span className="neon-text-purple">Advanced Forensics</span></h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">Our multi-layered detection pipeline utilizes state-of-the-art computer vision and signal processing.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Face Detection (MTCNN)',
                desc: 'Precise facial landmark extraction handling multiple faces, extreme angles, and occlusions.',
                icon: <svg viewBox="0 0 24 24" fill="none" stroke="#00f3ff" strokeWidth="1.5"><path d="M4 8V6C4 4.89543 4.89543 4 6 4H8M16 4H18C19.1046 4 20 4.89543 20 6V8M4 16V18C4 19.1046 4.89543 20 6 20H8M16 20H18C19.1046 20 20 19.1046 20 18V16" strokeLinecap="round" strokeLinejoin="round"/><path d="M9 10C9 10 10.5 9 12 9C13.5 9 15 10 15 10" strokeLinecap="round" strokeLinejoin="round"/><path d="M8 15C8 15 10 16 12 16C14 16 16 15 16 15" strokeLinecap="round" strokeLinejoin="round"/></svg>
              },
              {
                title: 'Deep Learning (CNN)',
                desc: 'Ensemble of ResNet and EfficientNet architectures trained on diverse deepfake datasets.',
                icon: <svg viewBox="0 0 24 24" fill="none" stroke="#9d00ff" strokeWidth="1.5"><circle cx="12" cy="12" r="3" /><path d="M12 3V6M12 18V21M3 12H6M18 12H21M6.34315 6.34315L8.46447 8.46447M15.5355 15.5355L17.6569 17.6569M6.34315 17.6569L8.46447 15.5355M15.5355 8.46447L17.6569 6.34315" strokeLinecap="round"/></svg>
              },
              {
                title: 'Error Level Analysis',
                desc: 'Highlights compression artifacts and digital manipulation invisible to the naked eye.',
                icon: <svg viewBox="0 0 24 24" fill="none" stroke="#00f3ff" strokeWidth="1.5"><path d="M3 21V19C3 17.8954 3.89543 17 5 17H19C20.1046 17 21 17.8954 21 19V21" strokeLinecap="round"/><path d="M7 17V13M12 17V9M17 17V5" strokeLinecap="round" strokeLinejoin="round"/><path d="M3 3L21 21" strokeLinecap="round" opacity="0.3"/></svg>
              },
              {
                title: 'Explainable AI (Grad-CAM)',
                desc: 'Visual heatmaps showing exactly which pixel regions influenced the AI’s decision.',
                icon: <svg viewBox="0 0 24 24" fill="none" stroke="#9d00ff" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" strokeLinecap="round"/><circle cx="12" cy="12" r="5" strokeDasharray="2 2"/><path d="M12 7V3M12 21V17M7 12H3M21 12H17" strokeLinecap="round"/></svg>
              },
              {
                title: 'EXIF & Metadata',
                desc: 'Deep extraction of camera signatures, GPS data, and software modification history.',
                icon: <svg viewBox="0 0 24 24" fill="none" stroke="#00f3ff" strokeWidth="1.5"><path d="M4 7C4 5.89543 4.89543 5 6 5H18C19.1046 5 20 5.89543 20 7V17C20 18.1046 19.1046 19 18 19H6C4.89543 19 4 18.1046 4 17V7Z" strokeLinecap="round"/><circle cx="12" cy="12" r="4"/><path d="M18 9H18.01" strokeLinecap="round" strokeWidth="2"/></svg>
              },
              {
                title: 'PDF Forensic Reports',
                desc: 'Downloadable, cryptographically signed reports suitable for legal and corporate compliance.',
                icon: <svg viewBox="0 0 24 24" fill="none" stroke="#9d00ff" strokeWidth="1.5"><path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" strokeLinecap="round" strokeLinejoin="round"/><path d="M14 2V8H20" strokeLinecap="round" strokeLinejoin="round"/><path d="M16 13H8M16 17H8M10 9H8" strokeLinecap="round" strokeLinejoin="round"/></svg>
              }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass-panel p-8 rounded-2xl hover:shadow-[0_0_25px_rgba(157,0,255,0.2)] transition-shadow border border-white/5 relative group overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="w-14 h-14 bg-black/40 rounded-xl flex items-center justify-center border border-white/10 mb-6 group-hover:scale-110 transition-transform shadow-inner">
                  <div className="w-8 h-8">{feature.icon}</div>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- HOW IT WORKS --- */}
      <section className="py-20 bg-[#0a0a0f] relative overflow-hidden">
        {/* Subtle grid bg */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')]"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Pipeline <span className="neon-text-blue">Workflow</span></h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">Three simple steps to uncover authenticity.</p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4 relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-1/2 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-[#00f3ff]/20 via-[#9d00ff]/20 to-[#00f3ff]/20 -translate-y-1/2 z-0"></div>

            {[
              { 
                step: '01', title: 'Upload Media', desc: 'Securely upload image or video files for analysis.',
                icon: <path d="M21 15V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V15M17 8L12 3M12 3L7 8M12 3V15" strokeLinecap="round" strokeLinejoin="round"/>
              },
              { 
                step: '02', title: 'AI Processing', desc: 'Models extract features and scan for manipulations.',
                icon: <path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM12 6V12L16 14" strokeLinecap="round" strokeLinejoin="round"/>
              },
              { 
                step: '03', title: 'Detailed Report', desc: 'Review heatmaps, metadata, and final confidence scores.',
                icon: <path d="M9 12H15M9 16H15M19 21V5C19 3.89543 18.1046 3 17 3H7C5.89543 3 5 3.89543 5 5V21L12 18L19 21Z" strokeLinecap="round" strokeLinejoin="round"/>
              }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.2 }}
                className="glass-panel p-8 rounded-2xl w-full md:w-1/3 flex flex-col items-center text-center relative z-10 border border-white/5"
              >
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-[#00f3ff] to-[#9d00ff] rounded-full flex items-center justify-center font-bold text-white shadow-lg text-lg">
                  {item.step}
                </div>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={i === 1 ? "#9d00ff" : "#00f3ff"} strokeWidth="1.5" className="mb-6">
                  {item.icon}
                </svg>
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- TECH STACK --- */}
      <section className="py-20 border-y border-white/10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-10">Built with Industry Standards</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {['React.js', 'FastAPI', 'PyTorch', 'MongoDB', 'OpenCV', 'Tailwind CSS'].map((tech, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
                className="px-6 py-3 glass-panel rounded-lg border border-white/10 text-gray-300 font-medium hover:border-[#00f3ff]/50 hover:text-[#00f3ff] transition-colors cursor-default"
              >
                {tech}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA BOTTOM --- */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#9d00ff]/10 z-0"></div>
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <motion.h2 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight"
          >
            Ready to detect <span className="gradient-text bg-gradient-to-r from-[#00f3ff] to-[#9d00ff] bg-clip-text text-transparent">Deepfakes?</span>
          </motion.h2>
          <motion.button 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            onClick={onLaunch}
            className="px-10 py-5 rounded-xl bg-white text-black font-extrabold text-xl hover:bg-gray-200 transition-all shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:shadow-[0_0_40px_rgba(255,255,255,0.5)] transform hover:-translate-y-1"
          >
            Get Started Now
          </motion.button>
        </div>
      </section>

    </div>
  );
};

export default Landing;
