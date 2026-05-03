'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Loader2, CheckCircle2, Copy, Ticket, ArrowRight, Mail, AlertCircle } from 'lucide-react';
import { api } from '@/lib/api';
// Removed sonner toast import
// import { toast } from 'sonner';

function BuyTokenSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [tokenData, setTokenData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(5);
  const [isCancelled, setIsCancelled] = useState(false);

  useEffect(() => {
    const status = searchParams.get('status');
    const paymentReference = searchParams.get('paymentReference') || searchParams.get('transactionReference');
    const phone = searchParams.get('phone') || undefined;

    if (status === 'FAILED' || status === 'CANCELLED') {
      setIsCancelled(true);
      setError('Payment was cancelled or failed. Please try again.');
      setLoading(false);
      return;
    }

    if (!paymentReference) {
      setError('Payment reference not found.');
      setLoading(false);
      return;
    }

    const verify = async () => {
      try {
        const res = await api.completeTokenPurchase(paymentReference, phone);
        setTokenData(res);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to verify payment. If you were charged, please contact support.');
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [searchParams]);

  // Handle automatic redirection
  useEffect(() => {
    if (tokenData?.token && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (tokenData?.token && countdown === 0) {
      sessionStorage.setItem('verified_reg_token', tokenData.token);
      router.push('/register/member');
    }
  }, [tokenData, countdown, router]);

  const copyToken = () => {
    if (tokenData?.token) {
      navigator.clipboard.writeText(tokenData.token);
      alert('Token copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-6 text-center">
        <Loader2 className="h-16 w-16 animate-spin text-[#008A62]" />
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Verifying Payment...</h2>
          <p className="text-slate-500 font-medium mt-2">Please wait while we confirm your transaction.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-10 border border-slate-100 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-rose-500">
          <AlertCircle size={32} />
        </div>
        <h2 className="text-2xl font-black text-slate-800">{isCancelled ? 'Payment Cancelled' : 'Verification Failed'}</h2>
        <p className="text-slate-500 mt-2 mb-8 font-medium">{error}</p>
        <div className="space-y-3">
          <button 
            onClick={() => router.push('/buy-token')} 
            className="w-full h-14 bg-[#008A62] text-white rounded-2xl font-black shadow-xl shadow-emerald-500/20 hover:-translate-y-1 transition-all"
          >
            Back to Buy Token
          </button>
          <button 
            onClick={() => window.location.reload()} 
            className="w-full h-14 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all"
          >
            Try Refreshing
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in duration-500">
      <div className="h-2 bg-emerald-500" />
      <div className="p-10 text-center">
        <div className="mx-auto w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center text-emerald-500 mb-6 animate-bounce">
          <CheckCircle2 size={44} />
        </div>
        <h2 className="text-3xl font-black text-slate-800 tracking-tight">Payment Successful!</h2>
        <p className="text-emerald-700 font-bold mt-1">Your registration token is ready.</p>
        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-4">
          Redirecting to registration in <span className="text-emerald-600">{countdown}s</span>...
        </p>
      </div>

      <div className="px-10 pb-4 space-y-8">
        <div className="bg-slate-50 p-8 rounded-3xl border-2 border-dashed border-emerald-200 relative group text-center">
          <p className="text-[10px] font-black uppercase tracking-widest text-[#008A62] mb-4">Your Registration Token</p>
          <p className="text-2xl font-mono font-black break-all tracking-tighter text-slate-800 mb-8">
            {tokenData?.token}
          </p>
          <button 
            type="button"
            className="w-full h-12 bg-white border border-slate-200 rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm hover:bg-slate-100 transition-colors"
            onClick={copyToken}
          >
            <Copy size={16} />
            Copy Token
          </button>
        </div>

        <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-100 rounded-2xl">
          <Mail className="h-5 w-5 text-blue-500" />
          <p className="text-blue-800 text-xs font-bold leading-tight">
            We've also sent this token to <span className="underline">{tokenData?.payerEmail}</span>.
          </p>
        </div>
      </div>

      <div className="p-10 pt-4">
        <button 
          className="w-full h-16 bg-[#008A62] text-white rounded-[1.25rem] font-black text-lg shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-3 group transition-all hover:-translate-y-1 active:scale-95"
          onClick={() => {
            sessionStorage.setItem('verified_reg_token', tokenData?.token);
            router.push('/register/member');
          }}
        >
          Proceed to Registration
          <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}

export default function BuyTokenSuccessPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Suspense fallback={<div>Loading...</div>}>
        <BuyTokenSuccessContent />
      </Suspense>
    </div>
  );
}
