'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Eye, EyeOff, LogIn, Mail, Lock, ArrowRight, 
  ShieldCheck, CheckCircle2, AlertCircle, Loader2
} from 'lucide-react';
import { authLogin, getRoleFromToken } from '@/lib/api';

const roles = [
  { value: 'APEX_SUPER_ADMIN', label: 'Apex Admin' },
  { value: 'PARTNER_ORG_ADMIN', label: 'Partner Admin' },
  { value: 'MEMBER', label: 'Member' },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const data = await authLogin(email, password);
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);
        
        // Sync to cookie for Middleware
        document.cookie = `access_token=${data.access_token}; path=/; max-age=86400; SameSite=Lax`;
        
        // Store payment status
        localStorage.setItem('has_paid_registration_fee', String(data.hasPaidRegistrationFee));
        document.cookie = `has_paid_registration_fee=${data.hasPaidRegistrationFee}; path=/; max-age=86400; SameSite=Lax`;

        // Store profile status
        localStorage.setItem('is_profile_complete', String(data.isProfileComplete));
        document.cookie = `is_profile_complete=${data.isProfileComplete}; path=/; max-age=86400; SameSite=Lax`;

        try {
          const payload = JSON.parse(atob(data.access_token.split('.')[1]));
          if (payload.role) {
            localStorage.setItem('user_role', payload.role);
            document.cookie = `user_role=${payload.role}; path=/; max-age=86400; SameSite=Lax`;
          }
        } catch (e) { console.error('Token decoding failed', e); }
      }

      const role = getRoleFromToken();
      
      // Check payment status for members (Block access until paid)
      if (role === 'member' && (data.hasPaidRegistrationFee === false || data.message === 'PAYMENT_REQUIRED')) {
        router.push('/member/payment');
        return;
      }
      
      if (role === 'member' && data.isProfileComplete === false) {
        router.push('/member/profile');
        return;
      }
      const roleMap: Record<string, string> = {
        super_admin: '/dashboard',
        finance_admin: '/dashboard',
        auditor: '/dashboard',
        partner_admin: '/partner',
        sub_org_admin: '/sub-org',
        group_admin: '/group',
        member: '/member',
      };
      
      router.push(roleMap[role || ''] || '/dashboard');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#008A62,#004c35)] relative flex items-center justify-center p-6 overflow-hidden selection:bg-emerald-500/30">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#00DDA3] rounded-full blur-[150px] opacity-20 pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#008A62] rounded-full blur-[150px] opacity-40 pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white/95 backdrop-blur-3xl rounded-[2.5rem] shadow-2xl p-10 border border-white flex flex-col items-center">
          {/* Logo Section */}
          <div className="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center mb-6 relative group overflow-hidden">
            <ShieldCheck size={40} className="text-[#008A62] relative z-10" />
            <div className="absolute inset-0 bg-[#008A62]/5 group-hover:scale-110 transition-transform duration-500" />
          </div>

          <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Welcome Back</h1>
            <p className="text-slate-500 font-medium mt-1">NOGALSS Cooperative Portal</p>
          </div>

          <form onSubmit={handleLogin} className="w-full space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-[#008A62] ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#008A62] transition-colors" size={18} />
                <input 
                  type="email" 
                  className="w-full pl-12 pr-4 py-4 bg-slate-100/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-[#008A62]/10 focus:border-[#008A62] outline-none transition-all font-medium text-slate-800 placeholder:text-slate-400" 
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-xs font-bold uppercase tracking-widest text-[#008A62]">Password</label>
                <Link href="/forgot-password" title="Forgot Password?" className="text-[10px] font-bold text-slate-400 hover:text-[#008A62] transition-colors">Forgot Password?</Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#008A62] transition-colors" size={18} />
                <input 
                  type={showPw ? 'text' : 'password'} 
                  className="w-full pl-12 pr-12 py-4 bg-slate-100/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-[#008A62]/10 focus:border-[#008A62] outline-none transition-all font-medium text-slate-800 placeholder:text-slate-400" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-rose-50 border border-rose-100 rounded-xl p-3 flex items-center gap-3 text-rose-600 text-xs font-semibold"
                >
                  <AlertCircle size={16} />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black shadow-xl shadow-slate-900/20 hover:bg-black hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 disabled:bg-slate-400 disabled:shadow-none"
            >
              {loading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                  <span>Sign In to Account</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-100 w-full text-center space-y-4">
            <p className="text-slate-500 text-sm font-medium">
              Don't have an account?{' '}
              <Link href="/register/member" className="text-[#008A62] font-black hover:underline underline-offset-4">Join NOGALSS</Link>
            </p>
            <div className="flex flex-wrap justify-center gap-2 px-4">
              {roles.map((r) => (
                <span key={r.value} className="text-[9px] font-black uppercase tracking-tighter bg-slate-100 text-slate-500 px-3 py-1.5 rounded-full whitespace-nowrap">
                  {r.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-8 flex items-center justify-center gap-8 opacity-60">
          <p className="text-[10px] font-bold text-white uppercase tracking-widest">Secure 256-bit SSL</p>
          <p className="text-[10px] font-bold text-white uppercase tracking-widest">© 2026 NOGALSS Ecosystem</p>
        </div>
      </motion.div>
    </div>
  );
}

