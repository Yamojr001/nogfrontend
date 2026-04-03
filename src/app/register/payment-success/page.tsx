'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function PaymentSuccessPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
          <Link 
            href="/login" 
            className="group flex items-center justify-center gap-3 w-full py-5 bg-[#008A62] text-white rounded-2xl font-bold shadow-lg shadow-emerald-600/30 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-600/40 transition-all border border-emerald-500/20"
          >
            Access Member Portal <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <div className="flex items-center justify-center gap-2 mt-4 text-slate-400">
            <ShieldCheck size={16} className="text-emerald-600" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Secured by NOGALSS Infrastructure</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
