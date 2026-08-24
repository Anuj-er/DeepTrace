import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Mail, Lock, User } from 'lucide-react';

const Login = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        // Login
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();

        if (!res.ok) {
          setError(data.error || 'Login failed');
          return;
        }

        localStorage.setItem('deeptrace_token', data.token);
        onLogin(data.user);
      } else {
        // Register
        if (!name.trim()) {
          setError('Please enter your full name.');
          return;
        }
        if (password.length < 6) {
          setError('Password must be at least 6 characters.');
          return;
        }
        if (password !== confirmPassword) {
          setError('Passwords do not match.');
          return;
        }

        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: name.trim(), email, password }),
        });
        const data = await res.json();

        if (!res.ok) {
          setError(data.error || 'Registration failed');
          return;
        }

        localStorage.setItem('deeptrace_token', data.token);
        onLogin(data.user);
      }
    } catch (err) {
      setError('Connection failed. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#000000]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-[#0a0a0a] border border-neutral-800 p-8 rounded-xl shadow-2xl"
      >
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-neutral-900 border border-neutral-800">
              <ShieldCheck size={20} className="text-neutral-300" />
            </div>
            <h1 className="text-sm font-semibold tracking-widest uppercase text-white">DeepTrace</h1>
          </div>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-xl font-semibold text-white mb-1">
            {isLogin ? 'Welcome back' : 'Create account'}
          </h2>
          <p className="text-sm text-neutral-500">
            {isLogin ? 'Sign in to your account' : 'Get started with DeepTrace'}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex bg-neutral-900/50 rounded-lg p-1 mb-6 border border-neutral-800">
          <button
            onClick={() => { setIsLogin(true); setError(''); }}
            className={`flex-1 py-2 text-xs font-medium rounded-md transition-all uppercase tracking-wider ${
              isLogin ? 'bg-white text-black shadow-sm' : 'text-neutral-500 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setIsLogin(false); setError(''); }}
            className={`flex-1 py-2 text-xs font-medium rounded-md transition-all uppercase tracking-wider ${
              !isLogin ? 'bg-white text-black shadow-sm' : 'text-neutral-500 hover:text-white'
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
                  <label className="block text-xs font-medium text-neutral-500 mb-1.5 uppercase tracking-wider">Full Name</label>
                  <div className="relative">
                    <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-9 pr-4 py-3 rounded-lg text-white text-sm outline-none bg-neutral-900/50 border border-neutral-800 focus:border-neutral-600 transition-colors placeholder:text-neutral-600"
                      placeholder="John Doe"
                      required={!isLogin}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div>
            <label className="block text-xs font-medium text-neutral-500 mb-1.5 uppercase tracking-wider">Email</label>
            <div className="relative">
              <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-4 py-3 rounded-lg text-white text-sm outline-none bg-neutral-900/50 border border-neutral-800 focus:border-neutral-600 transition-colors placeholder:text-neutral-600"
                placeholder="name@example.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-500 mb-1.5 uppercase tracking-wider">Password</label>
            <div className="relative">
              <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-4 py-3 rounded-lg text-white text-sm outline-none bg-neutral-900/50 border border-neutral-800 focus:border-neutral-600 transition-colors placeholder:text-neutral-600"
                placeholder="••••••••"
                required
              />
            </div>
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
                  <label className="block text-xs font-medium text-neutral-500 mb-1.5 uppercase tracking-wider">Confirm Password</label>
                  <div className="relative">
                    <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600" />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-9 pr-4 py-3 rounded-lg text-white text-sm outline-none bg-neutral-900/50 border border-neutral-800 focus:border-neutral-600 transition-colors placeholder:text-neutral-600"
                      placeholder="••••••••"
                      required={!isLogin}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center"
            >
              {error}
            </motion.div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg font-medium text-sm text-black bg-white hover:bg-neutral-200 transition-colors mt-6 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-white/10"
          >
            {loading ? 'Please wait…' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <p className="text-center text-xs text-neutral-600 mt-8">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
            className="text-white hover:underline font-medium"
          >
            {isLogin ? 'Register' : 'Sign In'}
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
