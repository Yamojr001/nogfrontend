'use client';

import React, { useState } from 'react';
import { api } from '@/lib/api';
import { Loader2, Ticket, ShoppingCart, CheckCircle2, AlertCircle } from 'lucide-react';

interface TokenGateProps {
  onVerified: (token: string, data?: any) => void;
  onBuyToken: () => void;
}

export const TokenGate: React.FC<TokenGateProps> = ({ onVerified, onBuyToken }) => {
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleVerify = async () => {
    if (!token || token.length < 10) {
      setError('Please enter a valid token.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await api.verifyToken(token.toUpperCase());
      if (res) {
        setSuccess(true);
        setTimeout(() => {
          onVerified(token.toUpperCase(), res);
        }, 1500);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid or used token. Please check and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-vh-80 p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="h-2 bg-[#008A62]" />
        <div className="p-8 text-center border-b border-slate-50">
          <div className="mx-auto w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mb-4 text-[#008A62]">
            <Ticket size={32} />
          </div>
          <h3 className="text-2xl font-black text-slate-800 tracking-tight">Registration Access</h3>
          <p className="text-slate-500 font-medium mt-1">
            You need a valid registration token to proceed.
          </p>
        </div>
        
        <div className="p-8 space-y-6">
          <div className="space-y-2">
            <label htmlFor="token" className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">
              Enter Registration Token
            </label>
            <input
              id="token"
              type="text"
              placeholder="E.G. ABCD-1234-EFGH-5678"
              value={token}
              onChange={(e) => setToken(e.target.value.toUpperCase())}
              className="w-full h-14 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-[#008A62]/10 focus:border-[#008A62] outline-none transition-all uppercase font-mono text-center tracking-widest text-lg font-black text-[#008A62]"
              disabled={loading || success}
            />
          </div>

          {error && (
            <div className="flex items-center gap-3 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-sm font-semibold animate-in head-shake duration-300">
              <AlertCircle size={18} />
              <p>{error}</p>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-700 text-sm font-semibold animate-in zoom-in duration-300">
              <CheckCircle2 size={18} className="text-emerald-500" />
              <p>Token verified! Redirecting...</p>
            </div>
          )}

          <button 
            type="button"
            className="w-full h-14 bg-[#008A62] text-white rounded-2xl font-black shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all hover:-translate-y-1 active:scale-95 disabled:bg-slate-200 disabled:shadow-none disabled:text-slate-400 flex items-center justify-center" 
            onClick={handleVerify} 
            disabled={loading || success || !token}
          >
            {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : 'Verify Token & Proceed'}
          </button>
        </div>

        <div className="p-8 bg-slate-50 flex flex-col space-y-4 border-t border-slate-100">
          <div className="text-center text-[10px] font-black uppercase tracking-widest text-slate-400">
            Don't have a token?
          </div>
          <button 
            type="button"
            className="w-full h-14 bg-white border-2 border-[#008A62] text-[#008A62] rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-emerald-50 transition-colors active:scale-95 disabled:opacity-50"
            onClick={onBuyToken}
            disabled={loading || success}
          >
            <ShoppingCart size={20} />
            Buy Registration Token
          </button>
        </div>
      </div>
    </div>
  );
};
