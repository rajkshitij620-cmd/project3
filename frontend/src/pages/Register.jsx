import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Scissors, User, Mail, Lock, ArrowRight, Eye, EyeOff, Store, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/common/Toast';

const Register = () => {
  const { register } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [role, setRole] = useState('customer'); // 'customer' | 'owner'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) { addToast('Please fill all fields', 'error'); return; }
    if (password.length < 6) { addToast('Password must be at least 6 characters', 'error'); return; }
    setLoading(true);
    try {
      const data = await register({ name, email, password, role });
      const roleName = role === 'owner' ? 'Salon Owner' : 'Customer';
      addToast(`Welcome to Snip as a ${roleName}, ${data.data.name.split(' ')[0]}! 🎉`, 'success');
      navigate('/');
    } catch (err) {
      addToast(err.customMessage || 'Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 flex items-center justify-center px-5 py-12 transition-colors duration-200">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-8 group">
          <div className="w-9 h-9 bg-zinc-900 dark:bg-white rounded-xl flex items-center justify-center text-white dark:text-zinc-900 group-hover:scale-105 transition-transform shadow-sm">
            <Scissors className="w-4 h-4 -rotate-45" />
          </div>
          <span className="font-black text-xl tracking-tight text-zinc-900 dark:text-white">Snip</span>
        </Link>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-7 sm:p-8 shadow-sm">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight mb-1">
              Create account
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-normal">
              Select how you want to join Snip
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* ─── 2 Options: Customer vs Salon Owner ─── */}
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                Join Snip as
              </label>
              <div className="grid grid-cols-2 gap-2 bg-zinc-100 dark:bg-zinc-800/80 p-1 rounded-2xl border border-zinc-200/60 dark:border-zinc-700/60">
                <button
                  type="button"
                  onClick={() => setRole('customer')}
                  className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-xl text-xs font-bold transition-all ${
                    role === 'customer'
                      ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-sm'
                      : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200'
                  }`}
                >
                  <User className="w-4 h-4 mb-1" />
                  <span>Customer</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('owner')}
                  className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-xl text-xs font-bold transition-all ${
                    role === 'owner'
                      ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-sm'
                      : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200'
                  }`}
                >
                  <Store className="w-4 h-4 mb-1 text-amber-500" />
                  <span>Salon Owner</span>
                </button>
              </div>
              <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-1.5 text-center">
                {role === 'customer'
                  ? 'Access Men & Women salon directories & book chairs'
                  : 'Manage, Add & Update your salon studio profile'}
              </p>
            </div>

            {/* Name */}
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                {role === 'owner' ? 'Owner / Stylist Name' : 'Full name'}
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder={role === 'owner' ? 'Marcus Vance' : 'Alex Rivera'}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600 transition"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600 transition"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {/* Password strength hint */}
              {password.length > 0 && (
                <div className="mt-1.5 flex gap-1">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-0.5 flex-1 rounded-full transition-colors ${
                        i < (password.length < 6 ? 1 : password.length < 8 ? 2 : password.length < 10 ? 3 : 4)
                          ? password.length < 6 ? 'bg-rose-400' : password.length < 8 ? 'bg-amber-400' : 'bg-emerald-400'
                          : 'bg-zinc-200 dark:bg-zinc-700'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-bold hover:bg-zinc-700 dark:hover:bg-zinc-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2 shadow-sm"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Register as {role === 'owner' ? 'Salon Owner' : 'Customer'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-zinc-500 dark:text-zinc-400 mt-5">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-zinc-900 dark:text-white hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
