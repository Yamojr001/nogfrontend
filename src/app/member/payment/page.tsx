'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lock, ArrowRight, ShieldCheck, CreditCard, 
  CheckCircle2, AlertCircle, Loader2, Landmark
} from 'lucide-react';
import { initiateRegistrationPayment } from '@/lib/api';

export default function MemberPaymentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handlePayment = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await initiateRegistrationPayment();
      if (res.status === 'success' && res.alreadyPaid) {
        localStorage.setItem('is_registration_fee_paid', 'true');
        document.cookie = `is_registration_fee_paid=true; path=/; max-age=${60 * 60 * 24}`;
        router.push('/member');
        return;
      }

      if (res.status === 'success' && res.data.authorization_url) {
        window.location.href = res.data.authorization_url;
      } else {
        throw new Error('Failed to initialize payment gateway.');
      }
    } catch (err: any) {
      console.error('Payment Error:', err);
      const msg = err?.response?.data?.message || err.message || 'Error initializing payment. Please try again.';
      setError(Array.isArray(msg) ? msg.join(', ') : msg);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#008A62,#004c35)] relative flex flex-col items-center justify-center p-6 overflow-hidden selection:bg-emerald-500/30">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#00DDA3] rounded-full blur-[150px] opacity-20 pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#008A62] rounded-full blur-[150px] opacity-40 pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg relative z-10"
      >
        <div className="bg-white/95 backdrop-blur-3xl rounded-[2.5rem] shadow-2xl p-10 border border-white flex flex-col items-center">
          {/* Icon Section */}
          <div className="w-20 h-20 bg-emerald-50 rounded-3xl shadow-inner flex items-center justify-center mb-8 relative group overflow-hidden">
            <Lock size={40} className="text-[#008A62] relative z-10" />
            <div className="absolute inset-0 bg-[#008A62]/10 scale-0 group-hover:scale-100 transition-transform duration-500 rounded-full" />
          </div>

          <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">One Last Step</h1>
            <p className="text-slate-500 font-medium mt-2">Activate your NOGALSS Membership</p>
          </div>

          <div className="w-full space-y-6">
            <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 flex flex-col items-center space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-[#008A62]">Registration Fee</span>
              <div className="flex items-center gap-2">
                <span className="text-4xl font-black text-slate-900">₦550.00</span>
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter text-center">
                Fast, secure automated checkout via Paystack
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 rounded-2xl border border-slate-100 bg-white/50">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 flex-shrink-0">
                  <CreditCard size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Instant Activation</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Your dashboard will be unlocked immediately after payment is confirmed.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl border border-slate-100 bg-white/50">
                <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 flex-shrink-0">
                  <Landmark size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Secure Gateway</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Payments are processed through Paystack with 256-bit SSL security.</p>
                </div>
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-rose-50 border border-rose-100 rounded-2xl p-4 flex items-center gap-3 text-rose-600 text-xs font-semibold"
                >
                  <AlertCircle size={18} className="flex-shrink-0" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <button 
              onClick={handlePayment}
              disabled={loading}
              className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black shadow-xl shadow-slate-900/20 hover:bg-black hover:-translate-y-1 active:translate-y-0 transition-all flex items-center justify-center gap-3 disabled:bg-slate-400 disabled:shadow-none disabled:-translate-y-0"
            >
              {loading ? (
                <Loader2 size={24} className="animate-spin" />
              ) : (
                <>
                  <span>Complete Secure Payment</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 w-full flex items-center justify-center gap-3">
            <CheckCircle2 size={16} className="text-emerald-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Verified Member Registration</span>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-8 flex items-center justify-center gap-8 opacity-60">
          <p className="text-[10px] font-bold text-white uppercase tracking-widest">© 2026 NOGALSS Ecosystem</p>
          <div className="flex items-center gap-2">
             <ShieldCheck size={12} className="text-white" />
             <p className="text-[10px] font-bold text-white uppercase tracking-widest">Secure Infrastructure</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
