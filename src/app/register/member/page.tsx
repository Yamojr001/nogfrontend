'use client';
// Force re-compilation
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, User, Mail, Lock, ArrowRight, ShieldCheck, Loader2,
  ChevronDown, HeartPulse, Tractor, Briefcase, Home, Wrench, Coins,
  Phone, Calendar, MapPin, Landmark, Users, ChevronLeft, Send,
  CreditCard, Fingerprint
} from 'lucide-react';
import { registerUser, resolveOrgCode, fetchBanks, updateTokenDraft } from '@/lib/api';
import { TokenGate } from '@/components/auth/TokenGate';
import { useRouter } from 'next/navigation';
import { EMPOWERMENT_CATEGORIES } from '@/constants/empowerment';

const steps = [
  { id: 1, title: 'Account', icon: User },
  { id: 2, title: 'Personal', icon: Home },
  { id: 3, title: 'Financial', icon: Landmark },
  { id: 4, title: 'Preferences', icon: HeartPulse },
  { id: 5, title: 'Next of Kin', icon: Users },
  { id: 6, title: 'Review', icon: CheckCircle2 },
];

export default function MemberRegistrationPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [done, setDone] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);
  const [banks, setBanks] = useState<any[]>([]);
  const [verifiedToken, setVerifiedToken] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    organisationCode: '',
    gender: '',
    dateOfBirth: '',
    maritalStatus: '',
    nationality: 'Nigerian',
    stateOfOrigin: '',
    address: '',
    bankName: '',
    accountName: '',
    accountNumber: '',
    bvn: '',
    nin: '',
    savingsFrequency: 'monthly',
    proposedSavingsAmount: 5000,
    empowermentInterest: [] as string[],
    nokName: '',
    nokRelationship: '',
    nokPhone: '',
    nokAddress: '',
  });

  useEffect(() => {
    setMounted(true);
    fetchBanks().then(setBanks).catch(console.error);
    
    // Check if token was just purchased
    const storedToken = sessionStorage.getItem('verified_reg_token');
    if (storedToken) {
      setVerifiedToken(storedToken);
      sessionStorage.removeItem('verified_reg_token');
    }

    // Pre-fill empowerments from Buy Token page
    const pendingEmp = sessionStorage.getItem('pendingEmpowerments');
    if (pendingEmp) {
      try {
        const parsed = JSON.parse(pendingEmp);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setForm(prev => ({ ...prev, empowermentInterest: parsed }));
        }
      } catch (e) {
        console.error("Failed to parse pending empowerments:", e);
      }
      sessionStorage.removeItem('pendingEmpowerments');
    }
  }, []);

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

  const next = async () => {
     const err = validateStep();
     if (err) {
       setError(err);
       return;
     }
     setError('');
     const nextStep = step + 1;
     setStep(nextStep);
     
     // Save draft progress
     if (verifiedToken) {
       try {
         await updateTokenDraft(verifiedToken, form, nextStep);
       } catch (err) {
         console.error('Failed to save draft:', err);
       }
     }
  };

  const handleTokenVerified = (token: string, data?: any) => {
    setVerifiedToken(token);
    if (data && data.draftData) {
      setForm(prev => ({
        ...prev,
        ...data.draftData
      }));
      if (data.draftStep > 1) {
        setStep(data.draftStep);
      }
    }
  };

  const back = () => {
    setError('');
    const prevStep = step - 1;
    setStep(prevStep);
    
    // Save draft progress on back too
    if (verifiedToken) {
      updateTokenDraft(verifiedToken, form, prevStep).catch(console.error);
    }
  };

  const validateStep = () => {
    if (step === 1) {
      if (!form.name) return 'Full name is required';
      if (!form.email) return 'Email is required';
      if (!form.phone) return 'Phone number is required';
      if (form.password.length < 8) return 'Password must be at least 8 characters';
      if (form.password !== form.confirmPassword) return 'Passwords do not match';
    }
    if (step === 2) {
      if (!form.gender) return 'Gender is required';
      if (!form.dateOfBirth) return 'Date of birth is required';
      if (!form.address) return 'Residential address is required';
    }
    if (step === 4) {
      if (form.empowermentInterest.length === 0) return 'Please choose at least one empowerment priority';
    }
    if (step === 5) {
      if (!form.nokName) return 'Next of Kin name is required';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    if (e) e.preventDefault();
    if (step < 6) {
      next();
      return;
    }

    setIsSubmitting(true);
    setError('');
    try {
      const payload = {
        ...form,
        role: 'member',
        token: verifiedToken,
        membershipType: 'individual',
        empowermentInterest: form.empowermentInterest.join(', '),
      };
      
      const res = await registerUser(payload);

      if (res.status === 'success') {
        setDone(true);
        setTimeout(() => {
          router.push('/login?registered=true');
        }, 3000);
      } else {
        setError(res.message || 'Registration failed. Please try again.');
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
          <h2 className="text-3xl font-black text-slate-800 mb-4">Registration Successful!</h2>
          <p className="text-lg text-slate-600 mb-8 font-medium leading-relaxed">
            Your account has been created successfully. Redirecting to login...
          </p>
        </motion.div>
      </div>
    );
  }

  if (!verifiedToken) {
    return (
      <div className="min-h-screen bg-[linear-gradient(135deg,#008A62,#004c35)] flex items-center justify-center p-4">
        <TokenGate 
          onVerified={handleTokenVerified} 
          onBuyToken={() => router.push('/buy-token')} 
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#008A62,#004c35)] relative flex flex-col items-center justify-center py-12 px-4 selection:bg-emerald-500/30 overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#00DDA3] rounded-full blur-[150px] opacity-20 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#008A62] rounded-full blur-[150px] opacity-40 pointer-events-none" />

      <div className="w-full max-w-2xl relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center mb-4 relative z-10">
            <ShieldCheck size={32} className="text-[#008A62]" />
          </div>
          <h1 className="text-3xl font-black text-white text-center tracking-tight">Join NOGALSS</h1>
          <p className="text-emerald-100/80 font-medium mt-2">Complete your profile to become a member</p>
        </div>

        {/* Stepper */}
        <div className="mb-8 flex items-center justify-between px-2 overflow-x-auto pb-4 scrollbar-none">
          {steps.map((s, idx) => (
            <div key={s.id} className="flex items-center gap-2">
              <div className={`flex flex-col items-center gap-2 group cursor-pointer transition-all ${step >= s.id ? 'opacity-100' : 'opacity-40'}`} onClick={() => step > s.id && setStep(s.id)}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm transition-all ${step === s.id ? 'bg-white text-[#008A62] shadow-xl shadow-white/20' : step > s.id ? 'bg-emerald-500 text-white' : 'bg-white/10 text-white border border-white/20'}`}>
                  {step > s.id ? <CheckCircle2 size={18} /> : s.id}
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-white hidden md:block whitespace-nowrap">{s.title}</span>
              </div>
              {idx < steps.length - 1 && <div className={`w-8 h-[1px] mb-6 hidden md:block ${step > s.id ? 'bg-emerald-500' : 'bg-white/10'}`} />}
            </div>
          ))}
        </div>

        <motion.div 
          className="w-full bg-white/95 backdrop-blur-3xl rounded-[2.5rem] shadow-2xl p-8 md:p-12 border border-white"
          layout
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0 }}
                  className="bg-rose-50 border border-rose-200 text-rose-600 px-4 py-3 rounded-xl text-sm font-semibold mb-6 flex items-center gap-3"
                >
                  <div className="w-1.5 h-1.5 bg-rose-500 rounded-full" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {step === 1 && (
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Full Name</label>
                      <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#008A62] transition-colors" size={18} />
                        <input type="text" className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-[#008A62]/10 focus:border-[#008A62] outline-none transition-all font-medium text-slate-800" placeholder="e.g. John Doe" value={form.name} onChange={(e) => update('name', e.target.value)} required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Email Address</label>
                      <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#008A62] transition-colors" size={18} />
                        <input type="email" className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-[#008A62]/10 focus:border-[#008A62] outline-none transition-all font-medium text-slate-800" placeholder="name@example.com" value={form.email} onChange={(e) => update('email', e.target.value)} required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Phone Number</label>
                      <div className="relative group">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#008A62] transition-colors" size={18} />
                        <input type="tel" className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-[#008A62]/10 focus:border-[#008A62] outline-none transition-all font-medium text-slate-800" placeholder="08012345678" value={form.phone} onChange={(e) => update('phone', e.target.value)} required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Password</label>
                      <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#008A62] transition-colors" size={18} />
                        <input type="password" className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-[#008A62]/10 focus:border-[#008A62] outline-none transition-all font-medium text-slate-800" placeholder="Min 8 characters" value={form.password} onChange={(e) => update('password', e.target.value)} required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Confirm Password</label>
                      <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#008A62] transition-colors" size={18} />
                        <input type="password" className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-[#008A62]/10 focus:border-[#008A62] outline-none transition-all font-medium text-slate-800" placeholder="Confirm password" value={form.confirmPassword} onChange={(e) => update('confirmPassword', e.target.value)} required />
                      </div>
                    </div>
                    <div className="md:col-span-2 space-y-2 pt-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-emerald-600 ml-1">Organization / Group Code (Optional)</label>
                      <div className="relative group">
                        <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#008A62] transition-colors" size={18} />
                        <input type="text" className="w-full pl-12 pr-4 py-4 bg-emerald-50/30 border border-emerald-100 rounded-2xl focus:ring-4 focus:ring-[#008A62]/10 focus:border-[#008A62] outline-none transition-all font-black tracking-widest text-[#008A62]" placeholder="XX-0000" value={form.organisationCode} onChange={(e) => update('organisationCode', e.target.value.toUpperCase())} />
                        {isValidatingCode && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-[#008A62]" size={18} />}
                      </div>
                      {resolvedOrg && (
                        <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center gap-2">
                          <CheckCircle2 size={14} className="text-emerald-500" />
                          <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-tight">Affiliation: {resolvedOrg.full}</span>
                        </motion.div>
                      )}
                    </div>
                  </div>
                )}
                
                {step === 2 && (
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Gender</label>
                      <select className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-[#008A62]/10 focus:border-[#008A62] outline-none transition-all font-medium text-slate-800" value={form.gender} onChange={(e) => update('gender', e.target.value)}>
                        <option value="">Select Gender...</option>
                        <option>Male</option>
                        <option>Female</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Date of Birth</label>
                      <div className="relative group">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#008A62] transition-colors" size={18} />
                        <input type="date" className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-[#008A62]/10 focus:border-[#008A62] outline-none transition-all font-medium text-slate-800" value={form.dateOfBirth} onChange={(e) => update('dateOfBirth', e.target.value)} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Marital Status</label>
                      <select className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-[#008A62]/10 focus:border-[#008A62] outline-none transition-all font-medium text-slate-800" value={form.maritalStatus} onChange={(e) => update('maritalStatus', e.target.value)}>
                        <option value="">Select Status...</option>
                        <option>Single</option>
                        <option>Married</option>
                        <option>Divorced</option>
                        <option>Widowed</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">State of Origin</label>
                      <input type="text" className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-[#008A62]/10 focus:border-[#008A62] outline-none transition-all font-medium text-slate-800" placeholder="e.g. Lagos" value={form.stateOfOrigin} onChange={(e) => update('stateOfOrigin', e.target.value)} />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Residential Address</label>
                      <div className="relative group">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#008A62] transition-colors" size={18} />
                        <input type="text" className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-[#008A62]/10 focus:border-[#008A62] outline-none transition-all font-medium text-slate-800" placeholder="Street, City, State" value={form.address} onChange={(e) => update('address', e.target.value)} />
                      </div>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Bank Name</label>
                      <select className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-[#008A62]/10 focus:border-[#008A62] outline-none transition-all font-medium text-slate-800" value={form.bankName} onChange={(e) => update('bankName', e.target.value)}>
                        <option value="">Select Bank...</option>
                        {banks.map(b => (
                          <option key={b.id} value={b.name}>{b.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Account Number</label>
                      <div className="relative group">
                        <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#008A62] transition-colors" size={18} />
                        <input type="text" className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-[#008A62]/10 focus:border-[#008A62] outline-none transition-all font-medium text-slate-800" placeholder="10 digits" maxLength={10} value={form.accountNumber} onChange={(e) => update('accountNumber', e.target.value)} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Account Name</label>
                      <input type="text" className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-[#008A62]/10 focus:border-[#008A62] outline-none transition-all font-medium text-slate-800" placeholder="Name on account" value={form.accountName} onChange={(e) => update('accountName', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">BVN (Security Check)</label>
                      <div className="relative group">
                        <Fingerprint className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#008A62] transition-colors" size={18} />
                        <input type="text" className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-[#008A62]/10 focus:border-[#008A62] outline-none transition-all font-medium text-slate-800" placeholder="11 digits" maxLength={11} value={form.bvn} onChange={(e) => update('bvn', e.target.value)} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">NIN (Identity Check)</label>
                      <div className="relative group">
                        <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#008A62] transition-colors" size={18} />
                        <input type="text" className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-[#008A62]/10 focus:border-[#008A62] outline-none transition-all font-medium text-slate-800" placeholder="11 digits" maxLength={11} value={form.nin} onChange={(e) => update('nin', e.target.value)} />
                      </div>
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-8">
                    <div className="grid md:grid-cols-2 gap-6 pb-6 border-b border-slate-100">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Savings Frequency</label>
                        <select className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-[#008A62]/10 focus:border-[#008A62] outline-none transition-all font-medium text-slate-800" value={form.savingsFrequency} onChange={(e) => update('savingsFrequency', e.target.value)}>
                          <option value="monthly">Monthly</option>
                          <option value="quarterly">Quarterly</option>
                          <option value="annually">Annually</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Proposed Savings (₦)</label>
                        <div className="relative group">
                          <Coins className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#008A62] transition-colors" size={18} />
                          <input type="number" className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-[#008A62]/10 focus:border-[#008A62] outline-none transition-all font-medium text-slate-800" value={form.proposedSavingsAmount} onChange={(e) => update('proposedSavingsAmount', e.target.value)} />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-2">
                        <HeartPulse className="text-[#008A62]" size={20} />
                        <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Priority Empowerment Interests</h3>
                      </div>
                      <div className="space-y-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        {EMPOWERMENT_CATEGORIES.map((cat) => (
                          <div key={cat.id} className="space-y-3">
                            <span className="text-[11px] font-black text-[#008A62] uppercase tracking-tight">{cat.title}</span>
                            <div className="grid grid-cols-1 gap-2">
                              {cat.options.map((opt) => (
                                <button key={opt.id} type="button" onClick={() => toggleEmpowerment(opt.label)} className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left group ${form.empowermentInterest.includes(opt.label) ? 'bg-emerald-50 border-emerald-200 shadow-sm' : 'bg-white border-slate-100 hover:border-emerald-200'}`}>
                                  <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${form.empowermentInterest.includes(opt.label) ? 'bg-[#008A62] border-[#008A62] text-white' : 'bg-white border-slate-200'}`}>
                                    {form.empowermentInterest.includes(opt.label) && <CheckCircle2 size={12} />}
                                  </div>
                                  <span className={`text-[11px] font-bold ${form.empowermentInterest.includes(opt.label) ? 'text-emerald-900' : 'text-slate-600'}`}>{opt.label}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {step === 5 && (
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Full Name of Next of Kin</label>
                      <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#008A62] transition-colors" size={18} />
                        <input type="text" className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-[#008A62]/10 focus:border-[#008A62] outline-none transition-all font-medium text-slate-800" placeholder="e.g. Jane Doe" value={form.nokName} onChange={(e) => update('nokName', e.target.value)} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Relationship</label>
                      <input type="text" className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-[#008A62]/10 focus:border-[#008A62] outline-none transition-all font-medium text-slate-800" placeholder="e.g. Spouse, Sibling" value={form.nokRelationship} onChange={(e) => update('nokRelationship', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">N.O.K Phone Number</label>
                      <div className="relative group">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#008A62] transition-colors" size={18} />
                        <input type="tel" className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-[#008A62]/10 focus:border-[#008A62] outline-none transition-all font-medium text-slate-800" placeholder="080..." value={form.nokPhone} onChange={(e) => update('nokPhone', e.target.value)} />
                      </div>
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">N.O.K Address</label>
                      <div className="relative group">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#008A62] transition-colors" size={18} />
                        <input type="text" className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-[#008A62]/10 focus:border-[#008A62] outline-none transition-all font-medium text-slate-800" placeholder="Street name, etc." value={form.nokAddress} onChange={(e) => update('nokAddress', e.target.value)} />
                      </div>
                    </div>
                  </div>
                )}

                {step === 6 && (
                  <div className="space-y-6">
                    <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100 space-y-4">
                       <h3 className="font-black text-slate-800 uppercase tracking-widest text-sm mb-4">Registration Summary</h3>
                       {[
                         { label: 'Name', value: form.name, s: 1 },
                         { label: 'Email', value: form.email, s: 1 },
                         { label: 'Address', value: form.address, s: 2 },
                         { label: 'Bank', value: form.bankName, s: 3 },
                         { label: 'Proposed Savings', value: `₦${Number(form.proposedSavingsAmount).toLocaleString()}`, s: 4 },
                         { label: 'Next of Kin', value: form.nokName, s: 5 },
                       ].map((item, i) => (
                         <div key={i} className="flex items-center justify-between py-3 border-b border-slate-200 last:border-0">
                           <span className="text-xs font-bold text-slate-400 uppercase tracking-tight">{item.label}</span>
                           <span className="text-sm font-black text-slate-800 text-right cursor-pointer hover:text-[#008A62] transition-colors" onClick={() => setStep(item.s)}>{item.value || 'Not provided'}</span>
                         </div>
                       ))}
                    </div>
                    <div className="p-6 bg-emerald-50/50 rounded-2xl border border-dashed border-emerald-200 text-center">
                       <p className="text-xs text-slate-600 font-medium leading-relaxed">
                         By clicking <strong>Complete Registration</strong>, you agree to our terms. Your verified token has been applied to this registration.
                       </p>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-8 border-t border-slate-100">
              {step > 1 ? (
                <button type="button" onClick={back} className="flex items-center gap-2 px-6 py-4 text-slate-500 font-bold hover:text-slate-800 transition-all">
                  <ChevronLeft size={20} />
                  <span>Back</span>
                </button>
              ) : (
                <div />
              )}
              
              <button 
                type="submit" 
                disabled={isSubmitting}
                className={`flex items-center justify-center gap-3 px-10 py-4 ${step === 6 ? 'bg-slate-900 shadow-slate-900/20' : 'bg-[#008A62] shadow-emerald-500/20'} text-white rounded-2xl font-black shadow-xl hover:-translate-y-1 active:translate-y-0 transition-all disabled:bg-slate-300 disabled:shadow-none`}
              >
                {isSubmitting ? (
                  <Loader2 size={24} className="animate-spin" />
                ) : step === 6 ? (
                  <>
                    <span>Complete Registration</span>
                    <CheckCircle2 size={20} />
                  </>
                ) : (
                  <>
                    <span>Next step</span>
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
