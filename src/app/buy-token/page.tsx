'use client';

import React, { useState } from 'react';
import { Loader2, ArrowLeft, ShoppingCart, ShieldCheck, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { EMPOWERMENT_CATEGORIES } from '@/constants/empowerment';
import { api } from '@/lib/api';
import Script from 'next/script';
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

  const [empowermentInterests, setEmpowermentInterests] = useState<string[]>([]);
  const toggleEmpowerment = (label: string) => {
    setEmpowermentInterests(prev => {
      if (prev.includes(label)) return prev.filter(i => i !== label);
      return [...prev, label];
    });
  };

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const paymentReference = `TKN-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    try {
      const MonnifySDK = (window as any).MonnifySDK;
      
      if (!MonnifySDK) {
        throw new Error("Payment gateway is still loading. Please try again in a few seconds.");
      }

      MonnifySDK.initialize({
        amount: 5500,
        currency: "NGN",
        reference: paymentReference,
        customerFullName: formData.name,
        customerEmail: formData.email,
        apiKey: process.env.NEXT_PUBLIC_MONNIFY_API_KEY || "MK_TEST_ACHGGEXYS6",
        contractCode: process.env.NEXT_PUBLIC_MONNIFY_CONTRACT_CODE || "0710464893",
        paymentDescription: "NOGALSS Registration Token",
        isTestMode: true,
        onComplete: function(response: any) {
          // Response usually contains paymentReference. We know our reference.
          console.log("Monnify payment complete:", response);
          if (empowermentInterests.length > 0) {
            sessionStorage.setItem('pendingEmpowerments', JSON.stringify(empowermentInterests));
          }
          router.push(`/buy-token/success?paymentReference=${paymentReference}`);
        },
        onClose: function(data: any) {
          setLoading(false);
        }
      });

    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <>
      <Script src="https://sandbox.sdk.monnify.com/plugin/monnify.js" strategy="lazyOnload" />
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

                {/* Priority Empowerments UI */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Priority Empowerment Interests</h3>
                  </div>
                  <p className="text-xs text-slate-500 font-medium pb-2">Select the categories of empowerment you are most interested in pursuing as a member.</p>
                  
                  <div className="space-y-6 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                    {EMPOWERMENT_CATEGORIES.map((cat) => (
                      <div key={cat.id} className="space-y-3">
                        <span className="text-[11px] font-black text-[#008A62] uppercase tracking-tight">{cat.title}</span>
                        <div className="grid grid-cols-1 gap-2">
                          {cat.options.map((opt) => (
                            <button 
                              key={opt.id} 
                              type="button" 
                              onClick={() => toggleEmpowerment(opt.label)} 
                              className={`flex items-start gap-3 p-3 rounded-xl border transition-all text-left group ${empowermentInterests.includes(opt.label) ? 'bg-emerald-50 border-emerald-200 shadow-sm' : 'bg-white border-slate-100 hover:border-emerald-200'}`}
                            >
                              <div className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-all ${empowermentInterests.includes(opt.label) ? 'bg-[#008A62] border-[#008A62] text-white' : 'bg-white border-slate-200'}`}>
                                {empowermentInterests.includes(opt.label) && <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                              </div>
                              <span className={`text-[11px] font-bold leading-relaxed ${empowermentInterests.includes(opt.label) ? 'text-emerald-900' : 'text-slate-600'}`}>{opt.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
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
    </>
  );
}
