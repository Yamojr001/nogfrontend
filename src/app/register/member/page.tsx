'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, User, Mail, Lock, ArrowRight, ShieldCheck, Loader2,
  ChevronDown, HeartPulse, Tractor, Briefcase, Home, Wrench, Coins
} from 'lucide-react';
import { registerMember, resolveOrgCode } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { EMPOWERMENT_CATEGORIES } from '@/constants/empowerment';

export default function MemberRegistrationPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [done, setDone] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    organisationCode: '',
    empowermentInterest: [] as string[],
  });

  const toggleEmpowerment = (label: string) => {
    setForm(prev => {
      const current = prev.empowermentInterest;
      if (current.includes(label)) {
        return { ...prev, empowermentInterest: current.filter(i => i !== label) };
      } else {
        return { ...prev, empowermentInterest: [...current, label] };
      }
    });
  };

  const [resolvedOrg, setResolvedOrg] = useState<{name: string, hierarchy: string, full: string} | null>(null);
  const [isValidatingCode, setIsValidatingCode] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Debounced organization code resolution
  useEffect(() => {
    if (!form.organisationCode) {
      setResolvedOrg(null);
      return;
    }

    const timer = setTimeout(async () => {
      if (form.organisationCode.length >= 7) {
        setIsValidatingCode(true);
        try {
          const res = await resolveOrgCode(form.organisationCode);
          setResolvedOrg(res);
        } catch (err) {
          setResolvedOrg(null);
        } finally {
          setIsValidatingCode(false);
        }
      } else {
        setResolvedOrg(null);
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [form.organisationCode]);

  const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  const validateForm = () => {
    if (!form.name) return 'Full name is required';
    if (!form.email) return 'Email is required';
    // Organization code is now optional (defaults to Apex)
    if (form.password.length < 8) return 'Password must be at least 8 characters';
    if (form.password !== form.confirmPassword) return 'Passwords do not match';
    if (form.empowermentInterest.length === 0) return 'Please choose at least one empowerment priority';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errorMsg = validateForm();
    if (errorMsg) {
       setError(errorMsg);
       return;
    }

    setIsSubmitting(true);
    setError('');
    try {
      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
        role: 'member',
        organisationCode: form.organisationCode,
        membershipType: 'individual',
        empowermentInterest: form.empowermentInterest.join(', '),
      };
      
      const res = await registerMember(payload);

      if (res.status === 'success') {
        setDone(true);
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } else {
        setError(res.message || 'An unexpected error occurred. Please try again.');
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      setError(Array.isArray(msg) ? msg.join(', ') : (msg || 'Registration failed. Please check your connection.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted) return null;

  if (done) {
    return (
      <div className="min-h-screen bg-[linear-gradient(135deg,#008A62,#005c41)] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/95 backdrop-blur-xl border border-white/20 p-10 lg:p-14 rounded-[3rem] shadow-2xl max-w-lg w-full text-center"
        >
          <div className="w-20 h-20 bg-emerald-100 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} className="text-emerald-500" />
          </div>
          <h2 className="text-3xl font-black text-slate-800 mb-4">Account Created!</h2>
          <p className="text-lg text-slate-600 mb-8 font-medium leading-relaxed">
            Your membership account has been successfully created. Redirecting you to login...
          </p>
          <Link href="/login" className="inline-flex items-center justify-center w-full py-4 bg-[#008A62] text-white rounded-2xl font-bold shadow-lg shadow-emerald-600/30 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-600/40 transition-all">
            Proceed to Login Now
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#008A62,#004c35)] relative flex flex-col items-center justify-center py-12 px-4 selection:bg-emerald-500/30 overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#00DDA3] rounded-full blur-[150px] opacity-20 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#008A62] rounded-full blur-[150px] opacity-40 pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center mb-4 relative z-10">
            <ShieldCheck size={32} className="text-[#008A62]" />
          </div>
          <h1 className="text-3xl font-black text-white text-center tracking-tight">Join NOGALSS</h1>
          <p className="text-emerald-100/80 font-medium mt-2">Create your member account in seconds</p>
        </div>

        <motion.div 
          className="w-full bg-white/95 backdrop-blur-3xl rounded-[2.5rem] shadow-2xl p-8 md:p-10 border border-white"
          layout
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0 }}
                  className="bg-rose-50 border border-rose-200 text-rose-600 px-4 py-3 rounded-xl text-sm font-semibold mb-4 flex items-center gap-3"
                >
                  <div className="w-1.5 h-1.5 bg-rose-500 rounded-full" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Full Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#008A62] transition-colors" size={18} />
                <input 
                  type="text" 
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-[#008A62]/10 focus:border-[#008A62] outline-none transition-all font-medium text-slate-800"
                  placeholder="e.g. John Doe"
                  value={form.name}
                  onChange={(e) => update('name', e.target.value)}
                  required 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#008A62] transition-colors" size={18} />
                <input 
                  type="email" 
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-[#008A62]/10 focus:border-[#008A62] outline-none transition-all font-medium text-slate-800"
                  placeholder="name@example.com"
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  required 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#008A62] transition-colors" size={18} />
                <input 
                  type="password" 
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-[#008A62]/10 focus:border-[#008A62] outline-none transition-all font-medium text-slate-800"
                  placeholder="Min 8 characters"
                  value={form.password}
                  onChange={(e) => update('password', e.target.value)}
                  required 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Confirm Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#008A62] transition-colors" size={18} />
                <input 
                  type="password" 
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-[#008A62]/10 focus:border-[#008A62] outline-none transition-all font-medium text-slate-800"
                  placeholder="Confirm your password"
                  value={form.confirmPassword}
                  onChange={(e) => update('confirmPassword', e.target.value)}
                  required 
                />
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2 mb-2">
                <HeartPulse className="text-[#008A62]" size={20} />
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Priority Empowerment Interests</h3>
              </div>
              <p className="text-[10px] text-slate-400 font-medium leading-relaxed mb-4">
                Choose one or more of your priority empowerment areas below to help us tailor our support to your needs.
              </p>

              <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {EMPOWERMENT_CATEGORIES.map((cat) => (
                  <div key={cat.id} className="space-y-3">
                    <div className="flex items-center gap-2 pb-1 border-b border-slate-50">
                      <span className="text-[11px] font-black text-[#008A62] uppercase tracking-tight">{cat.title}</span>
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      {cat.options.map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => toggleEmpowerment(opt.label)}
                          className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left group ${
                            form.empowermentInterest.includes(opt.label)
                              ? 'bg-emerald-50 border-emerald-200 shadow-sm shadow-emerald-100'
                              : 'bg-white border-slate-100 hover:border-emerald-200'
                          }`}
                        >
                          <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                            form.empowermentInterest.includes(opt.label)
                              ? 'bg-[#008A62] border-[#008A62] text-white'
                              : 'bg-white border-slate-200'
                          }`}>
                            {form.empowermentInterest.includes(opt.label) && <CheckCircle2 size={12} />}
                          </div>
                          <span className={`text-[11px] font-bold transition-colors ${
                            form.empowermentInterest.includes(opt.label) ? 'text-emerald-900' : 'text-slate-600'
                          }`}>
                            {opt.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black shadow-xl shadow-slate-900/20 hover:bg-black hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 disabled:bg-slate-400 disabled:shadow-none mt-4"
            >
              {isSubmitting ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-slate-500 text-sm font-medium">
              Already have an account?{' '}
              <Link href="/login" className="text-[#008A62] font-black hover:underline underline-offset-4">Sign In</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
