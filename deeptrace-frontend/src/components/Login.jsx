import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Demo credentials
const DEMO_EMAIL = 'demo@deeptrace.ai';
const DEMO_PASSWORD = 'deeptrace123';

const Login = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const fillDemoCredentials = () => {
    setEmail(DEMO_EMAIL);
    setPassword(DEMO_PASSWORD);
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (isLogin) {
      if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
        onLogin({ name: 'Anuj Siwach', email });
      } else {
        setError('Invalid credentials. Use the demo credentials below.');
      }
    } else {
      if (!name.trim()) {
        setError('Please enter your full name.');
        return;
      }
      onLogin({ name: name, email: email });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#0a0a0f]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md glass-panel p-8 rounded-2xl relative overflow-hidden"
      >
        {/* Neon Glow Accents */}
        <div className="absolute top-0 left-1/4 w-1/2 h-1 bg-gradient-to-r from-transparent via-[#00f3ff] to-transparent shadow-[0_0_15px_#00f3ff]"></div>
        
        <div className="flex justify-center mb-8 relative">
          <div className="absolute inset-0 bg-[#00f3ff]/20 blur-2xl rounded-full w-20 h-20 mx-auto"></div>
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10">
            <defs>
              <linearGradient id="shieldGrad" x1="40" y1="10" x2="40" y2="70" gradientUnits="userSpaceOnUse">
                <stop stopColor="#00f3ff" />
                <stop offset="1" stopColor="#9d00ff" />
              </linearGradient>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            <path d="M40 10L16 20V38C16 54.4 26.2 69.4 40 74C53.8 69.4 64 54.4 64 38V20L40 10Z" stroke="url(#shieldGrad)" strokeWidth="3" fill="none" filter="url(#glow)"/>
            <path d="M40 26V40L48 48" stroke="#00f3ff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="40" cy="40" r="16" stroke="#9d00ff" strokeWidth="2" strokeDasharray="4 4" />
          </svg>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold gradient-text-white mb-2">DeepTrace Auth</h2>
          <p className="text-sm text-gray-400">Secure access to deepfake detection</p>
        </div>

        <div className="flex bg-black/40 rounded-lg p-1 mb-6 border border-white/5">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
              isLogin ? 'bg-white/10 text-white shadow-sm' : 'text-gray-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
              !isLogin ? 'bg-white/10 text-white shadow-sm' : 'text-gray-400 hover:text-white'
            }`}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <AnimatePresence mode="wait">
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="mb-4">
                  <label className="block text-xs font-medium text-gray-400 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full glass-input px-4 py-3 rounded-lg text-white outline-none focus:ring-1 focus:ring-[#00f3ff] transition-all bg-black/20 border border-white/10"
                    placeholder="John Doe"
                    required={!isLogin}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full glass-input px-4 py-3 rounded-lg text-white outline-none focus:ring-1 focus:ring-[#00f3ff] transition-all bg-black/20 border border-white/10"
              placeholder="name@example.com"
              required
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-medium text-gray-400">Password</label>
              {isLogin && (
                <a href="#" className="text-xs text-[#00f3ff] hover:text-white transition-colors">
                  Forgot password?
                </a>
              )}
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full glass-input px-4 py-3 rounded-lg text-white outline-none focus:ring-1 focus:ring-[#00f3ff] transition-all bg-black/20 border border-white/10"
              placeholder="••••••••"
              required
            />
          </div>

          <AnimatePresence mode="wait">
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="mt-4">
                  <label className="block text-xs font-medium text-gray-400 mb-1">Confirm Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full glass-input px-4 py-3 rounded-lg text-white outline-none focus:ring-1 focus:ring-[#00f3ff] transition-all bg-black/20 border border-white/10"
                    placeholder="••••••••"
                    required={!isLogin}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {isLogin && (
            <div className="flex items-center mt-2">
              <input
                type="checkbox"
                id="remember"
                className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-[#00f3ff] focus:ring-[#00f3ff] focus:ring-offset-gray-900"
              />
              <label htmlFor="remember" className="ml-2 text-xs text-gray-400">
                Remember me
              </label>
            </div>
          )}

          <button
            type="submit"
            className="w-full btn-primary py-3 rounded-lg font-semibold text-white mt-6 bg-gradient-to-r from-[#00f3ff] to-[#9d00ff] hover:opacity-90 transition-opacity shadow-[0_0_15px_rgba(0,243,255,0.3)] relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
            <span className="relative z-10">{isLogin ? 'Sign In' : 'Create Account'}</span>
          </button>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 px-4 py-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center"
            >
              {error}
            </motion.div>
          )}

          {/* Demo Credentials Helper */}
          {isLogin && (
            <div className="mt-4 p-3 rounded-lg bg-neonBlue/5 border border-neonBlue/15">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-400">Demo Credentials</span>
                <button
                  type="button"
                  onClick={fillDemoCredentials}
                  className="text-xs text-neonBlue hover:text-white transition-colors font-medium px-2 py-0.5 rounded bg-neonBlue/10 hover:bg-neonBlue/20"
                >
                  Auto-fill
                </button>
              </div>
              <div className="text-xs text-gray-500 space-y-0.5 font-mono">
                <p>Email: <span className="text-gray-300">demo@deeptrace.ai</span></p>
                <p>Pass: <span className="text-gray-300">deeptrace123</span></p>
              </div>
            </div>
          )}
        </form>

        <div className="mt-8">
          <div className="relative flex items-center mb-6">
            <div className="flex-grow border-t border-white/10"></div>
            <span className="flex-shrink-0 mx-4 text-xs text-gray-500">or continue with</span>
            <div className="flex-grow border-t border-white/10"></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => onLogin({ name: 'Anuj Siwach (Google)', email: 'anuj@google.com' })}
              className="flex items-center justify-center py-2.5 px-4 rounded-lg bg-black/40 border border-white/5 hover:bg-black/60 transition-colors group"
            >
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.37 10H12V14.26H17.92C17.67 15.65 16.89 16.81 15.72 17.59V20.35H19.28C21.36 18.43 22.56 15.6 22.56 12.25Z" fill="#4285F4"/>
                <path d="M12 23C14.97 23 17.46 22.02 19.28 20.35L15.72 17.59C14.73 18.25 13.48 18.65 12 18.65C9.13 18.65 6.7 16.71 5.84 14.12H2.17V16.97C3.98 20.57 7.7 23 12 23Z" fill="#34A853"/>
                <path d="M5.84 14.12C5.62 13.47 5.5 12.75 5.5 12C5.5 11.25 5.62 10.53 5.84 9.88V7.03H2.17C1.43 8.5 1 10.2 1 12C1 13.8 1.43 15.5 2.17 16.97L5.84 14.12Z" fill="#FBBC05"/>
                <path d="M12 5.35C13.62 5.35 15.07 5.91 16.21 6.99L19.36 3.84C17.46 2.07 14.97 1 12 1C7.7 1 3.98 3.43 2.17 7.03L5.84 9.88C6.7 7.29 9.13 5.35 12 5.35Z" fill="#EA4335"/>
              </svg>
              <span className="ml-2 text-sm text-gray-300 group-hover:text-white">Google</span>
            </button>
            <button
              onClick={() => onLogin({ name: 'Anuj Siwach (GitHub)', email: 'anuj@github.com' })}
              className="flex items-center justify-center py-2.5 px-4 rounded-lg bg-black/40 border border-white/5 hover:bg-black/60 transition-colors group"
            >
              <svg className="w-5 h-5 text-white group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12C2 16.42 4.868 20.166 8.847 21.466C9.347 21.558 9.53 21.25 9.53 20.985C9.53 20.748 9.521 19.92 9.516 19.006C6.734 19.61 6.146 17.848 6.146 17.848C5.691 16.693 5.035 16.386 5.035 16.386C4.128 15.766 5.103 15.778 5.103 15.778C6.105 15.848 6.632 16.808 6.632 16.808C7.523 18.334 8.966 17.893 9.55 17.636C9.641 16.969 9.911 16.529 10.209 16.279C7.99 16.027 5.658 15.17 5.658 11.472C5.658 10.419 6.034 9.555 6.647 8.878C6.548 8.626 6.216 7.644 6.741 6.309C6.741 6.309 7.549 6.05 9.503 7.371C10.27 7.158 11.091 7.051 11.905 7.047C12.718 7.051 13.539 7.158 14.307 7.371C16.26 6.05 17.068 6.309 17.068 6.309C17.593 7.644 17.261 8.626 17.163 8.878C17.777 9.555 18.151 10.419 18.151 11.472C18.151 15.183 15.815 16.023 13.59 16.27C13.963 16.591 14.296 17.225 14.296 18.2C14.296 19.596 14.283 20.722 14.283 20.985C14.283 21.252 14.463 21.564 14.97 21.464C18.945 20.163 21.81 16.42 21.81 12C21.81 6.477 17.333 2 12 2Z" />
              </svg>
              <span className="ml-2 text-sm text-gray-300 group-hover:text-white">GitHub</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
