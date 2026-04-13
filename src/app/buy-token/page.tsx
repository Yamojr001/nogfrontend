'use client';

import React, { useState } from 'react';
import { Loader2, ArrowLeft, ShoppingCart, ShieldCheck, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import Link from 'next/link';

export default function BuyTokenPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const redirectUrl = `${window.location.origin}/buy-token/success`;
      const res = await api.buyToken({
        ...formData,
        redirectUrl,
      });

      if (res.status === 'success' && res.checkoutUrl) {
         window.location.href = res.checkoutUrl;
      } else {
        throw new Error('Failed to initialize payment. Please try again.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 selection:bg-[#008A62]/20">
      <div className="w-full max-w-lg space-y-6 animate-in fade-in zoom-in duration-500">
        <div className="flex items-center justify-between px-2">
          <Link href="/register/member" className="flex items-center text-xs font-black uppercase tracking-widest text-[#008A62] hover:opacity-70 transition-opacity">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Registration
          </Link>
          <div className="flex items-center space-x-2 text-emerald-600">
            <ShieldCheck size={18} />
            <span className="text-[10px] font-black uppercase tracking-widest">Secure Payment</span>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-emerald-900/10 overflow-hidden border border-slate-100">
          <div className="h-2 bg-[#008A62]" />
          <div className="p-10 text-center border-b border-slate-50">
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Registration Token</h1>
            <p className="text-slate-500 font-medium mt-2">
              Enter your details to purchase a one-time registration token.
            </p>
          </div>

          <div className="p-10">
            <form onSubmit={handlePurchase} className="space-y-6">
              <div className="space-y-5">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Full Name</label>
                  <input 
                    id="name" 
                    type="text"
                    placeholder="Enter your full name" 
                    required 
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full h-14 px-5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-[#008A62]/10 focus:border-[#008A62] outline-none transition-all font-medium text-slate-800"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Email Address</label>
                  <input 
                    id="email" 
                    type="email" 
                    placeholder="name@example.com" 
                    required 
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full h-14 px-5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-[#008A62]/10 focus:border-[#008A62] outline-none transition-all font-medium text-slate-800"
                  />
                  <p className="text-[10px] text-slate-400 font-medium italic ml-1">
                     Your token will be sent to this email address.
                  </p>
                </div>
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Phone Number</label>
                  <input 
                    id="phone" 
                    type="tel" 
                    placeholder="08012345678" 
                    required 
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full h-14 px-5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-[#008A62]/10 focus:border-[#008A62] outline-none transition-all font-medium text-slate-800"
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-3 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-sm font-semibold animate-in head-shake duration-300">
                  <AlertCircle size={18} />
                  <p>{error}</p>
                </div>
              )}

              <div className="pt-4 border-t border-slate-50 mt-8">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Token Price:</span>
                  <span className="text-3xl font-black text-[#008A62]">₦5,500</span>
                </div>
                
                <button 
                  type="submit" 
                  className="w-full h-16 bg-[#008A62] text-white rounded-[1.25rem] font-black text-lg shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 disabled:bg-slate-200 disabled:shadow-none disabled:text-slate-400" 
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-6 w-6 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={22} />
                      Proceed to Checkout
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="text-center space-y-4">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
            Payments are securely processed by Monnify.
          </p>
          <div className="flex justify-center grayscale opacity-40">
             <img src="https://monnify.com/assets/images/monnify-logo.svg" alt="Monnify" className="h-5" />
          </div>
        </div>
      </div>
    </div>
  );
}
