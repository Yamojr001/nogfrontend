'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight, ShieldCheck, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { fetchUserProfile, verifyRegistrationPayment } from '@/lib/api';

export default function PaymentSuccessPage() {
  const [mounted, setMounted] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const [verifying, setVerifying] = useState(true);
  const reference = searchParams.get('reference');

  useEffect(() => {
    setMounted(true);

    // Refresh profile to pick up payment status
    const verifyPayment = async () => {
      try {
        // If Paystack redirected with a reference, verify immediately on backend.
        if (reference) {
          try {
            await verifyRegistrationPayment(reference);
          } catch (err: any) {
            // Older backend instances may not expose this route yet.
            if (err?.response?.status !== 404) {
              throw err;
            }
          }
        }

        const profile = await fetchUserProfile();
        if (profile.memberProfile?.isRegistrationFeePaid) {
          // Update local storage with new status
          localStorage.setItem('is_registration_fee_paid', 'true');
          localStorage.setItem('user_name', profile.firstName || profile.name || 'Member');
          
          // Set cookie for middleware
          document.cookie = `is_registration_fee_paid=true; path=/; max-age=${60 * 60 * 24}`; 
          
          setVerifying(false);
        } else {
          // Retry after 3 seconds (webhook might be slightly delayed)
          setTimeout(verifyPayment, 3000);
        }
      } catch (err) {
        console.error("Profile refresh failed:", err);
        setVerifying(false); // Stop trying but let them try the button
      }
    };

    verifyPayment();
  }, [reference]);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#008A62,#004c35)] relative flex flex-col items-center justify-center p-4 selection:bg-emerald-500/30">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#00DDA3] rounded-full blur-[150px] opacity-20 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#008A62] rounded-full blur-[150px] opacity-40 pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white/95 backdrop-blur-xl border border-white p-10 lg:p-14 rounded-[3rem] shadow-2xl max-w-xl w-full text-center relative z-10"
      >
        <div className="w-24 h-24 bg-emerald-100 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
          <CheckCircle2 size={48} className="text-emerald-500" />
        </div>

        <h1 className="text-4xl font-black text-slate-800 mb-4 tracking-tight">Payment Successful!</h1>
        <p className="text-lg text-slate-600 mb-10 font-medium leading-relaxed">
          Your registration fee has been confirmed. Welcome to the <strong>National Apex Cooperative Society (NOGALSS)</strong>. Your membership is now fully active.
        </p>

        <div className="grid gap-4">
          <button 
            disabled={verifying}
            onClick={() => router.push('/member')}
            className={`group flex items-center justify-center gap-3 w-full py-5 ${verifying ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-[#008A62] text-white shadow-lg shadow-emerald-600/30 hover:-translate-y-1 hover:shadow-xl'} rounded-2xl font-bold transition-all border border-emerald-500/20`}
          >
            {verifying ? (
              <>Verifying Payment Status... <Loader2 size={20} className="animate-spin" /></>
            ) : (
              <>Access Member Portal <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" /></>
            )}
          </button>
          
          <div className="flex items-center justify-center gap-2 mt-4 text-slate-400">
            <ShieldCheck size={16} className="text-emerald-600" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Secured by NOGALSS Infrastructure</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
