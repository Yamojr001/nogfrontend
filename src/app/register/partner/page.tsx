'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, User, ShieldCheck, HeartHandshake, Landmark, 
  ChevronRight, ChevronLeft, Send, CheckCircle2, Search, 
  ChevronDown, Lock, Mail, Phone, FileText, Camera, Loader2
} from 'lucide-react';
import api, { registerOrganisation, fetchBanks } from '@/lib/api';

const SearchableSelect = ({ label, value, options, onChange, placeholder }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = options.filter((o: any) => 
    o.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-2 relative">
      <label className="text-xs font-bold uppercase tracking-wider text-slate-500">{label}</label>
      <div 
        className={`w-full px-4 py-3 bg-slate-50 border ${isOpen ? 'border-[#008A62] ring-2 ring-[#008A62]/20' : 'border-slate-200'} rounded-xl cursor-pointer transition-all flex items-center justify-between group`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={`font-medium ${value ? 'text-slate-800' : 'text-slate-400'}`}>
          {value || placeholder}
        </span>
        <ChevronDown size={18} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute left-0 right-0 top-[calc(100%+8px)] bg-white border border-slate-200 rounded-2xl shadow-2xl p-2 z-50 max-h-[300px] flex flex-col overflow-hidden"
          >
            <div className="relative mb-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input 
                autoFocus
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-lg outline-none text-sm focus:border-[#008A62]/30 transition-all"
                placeholder="Search..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                onClick={e => e.stopPropagation()}
              />
            </div>
            <div className="overflow-y-auto flex-1 space-y-1 custom-scrollbar">
              {filtered.length > 0 ? (
                filtered.map((opt: any) => (
                  <div 
                    key={opt.id}
                    className={`px-3 py-2.5 rounded-lg text-sm font-medium cursor-pointer transition-colors ${value === opt.name ? 'bg-[#008A62] text-white' : 'text-slate-700 hover:bg-slate-50 hover:text-[#008A62]'}`}
                    onClick={() => {
                      onChange(opt.name);
                      setIsOpen(false);
                      setSearch('');
                    }}
                  >
                    {opt.name}
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-slate-400 text-xs">No matching results</div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
};

const steps = [
  { id: 1, title: 'Org Info', icon: Building2 },
  { id: 2, title: 'Representative', icon: User },
  { id: 3, title: 'Identity', icon: ShieldCheck },
  { id: 4, title: 'Engagement', icon: HeartHandshake },
  { id: 5, title: 'Org Bank', icon: Landmark },
  { id: 6, title: 'Review', icon: FileText },
];

export default function PartnerRegistrationPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [banks, setBanks] = useState<any[]>([]);

  const [form, setForm] = useState({
    // Section A
    name: '', acronym: '', establishmentDate: '', orgTypeStr: '', sector: '', 
    regNumber: '', activeMemberCount: '', hqAddress: '', operatingStates: '',
    parentOrgCode: '',
    // Section B
    repName: '', repPosition: '', repPhone: '', repEmail: '', repGender: '', 
    repNationality: 'Nigerian', repStateOfOrigin: '', repBankName: '', repAccountNumber: '', repAccountName: '',
    // Section C
    repNin: '', repBvn: '', repIdType: '', repIdUrl: '', repPassportUrl: '', orgLogoUrl: '', orgTin: '',
    // Section D
    participateInSavings: false, savingsFrequency: 'monthly', monthlyContributionAmount: 0, 
    areasOfParticipation: [] as string[], proposedBeneficiaries: 0,
    // Section E
    orgAccountName: '', orgBankName: '', orgAccountNumber: '', orgBvn: '', signatories: '',
    // Declaration
    declaration: false,
  });

  const [resolving, setResolving] = useState(false);
  const [hierarchy, setHierarchy] = useState('');

  useEffect(() => {
    fetchBanks().then(setBanks).catch(console.error);
  }, []);

  // Debounced Parent Org Code Check
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (form.parentOrgCode && form.parentOrgCode.length >= 4) {
        setResolving(true);
        try {
          const res = await api.get(`/auth/resolve-code/${form.parentOrgCode}`);
          setHierarchy(res.data.hierarchy);
        } catch (e) {
          setHierarchy('');
        } finally {
          setResolving(false);
        }
      } else {
        setHierarchy('');
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [form.parentOrgCode]);

  const update = (field: string, value: any) => setForm(prev => ({ ...prev, [field]: value }));

  const next = () => setStep(s => s + 1);
  const back = () => setStep(s => s - 1);

  const handleSubmit = async () => {
    if (!form.declaration) {
      setError('Please accept the declaration to proceed');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const payload = {
        ...form,
        type: 'partner',
        parentOrgCode: form.parentOrgCode || undefined,
        areasOfParticipation: JSON.stringify(form.areasOfParticipation),
      };
      await registerOrganisation(payload as any);
      setDone(true);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Registration failed. Please verify your connection.');
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="min-h-screen bg-[linear-gradient(135deg,#008A62,#004c35)] flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-[2.5rem] p-12 text-center max-w-md shadow-2xl">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={48} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-4">Application Submitted!</h2>
          <p className="text-slate-500 mb-8 font-medium">Your organization registration is now pending review. An administrator will contact you within 48 hours.</p>
          <Link href="/" className="w-full py-4 bg-[#008A62] text-white rounded-2xl font-black block hover:bg-[#007A57] transition-all shadow-lg shadow-emerald-200">
            Return Home
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#008A62,#004c35)] pt-24 pb-12 px-4 flex flex-col items-center">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center mb-4">
            <Building2 size={32} className="text-[#008A62]" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Organization Registration</h1>
          <p className="text-emerald-100/80 font-medium mt-2">Partner with NOGALSS National Apex Cooperative Society</p>
        </div>

        {/* Stepper */}
        <div className="w-full bg-white/10 backdrop-blur-md rounded-2xl p-4 mb-8 border border-white/10 flex items-center justify-between gap-2 overflow-x-auto scrollbar-none">
          {steps.map((s, idx) => (
            <div key={s.id} className="flex items-center gap-2 shrink-0">
               <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs transition-all ${step === s.id ? 'bg-white text-[#008A62] shadow-lg' : step > s.id ? 'bg-emerald-500 text-white' : 'bg-white/10 text-white/40'}`}>
                {step > s.id ? <CheckCircle2 size={16} /> : s.id}
               </div>
               <span className={`text-[10px] font-black uppercase tracking-widest hidden md:block ${step === s.id ? 'text-white' : 'text-white/40'}`}>{s.title}</span>
               {idx < steps.length - 1 && <div className="hidden md:block w-4 h-[1px] bg-white/10" />}
            </div>
          ))}
        </div>

        {/* Form Container */}
        <motion.div className="bg-white/95 backdrop-blur-3xl rounded-[2.5rem] shadow-2xl p-8 md:p-12 border border-white">
          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              
              {/* STEP 1: ORGANIZATION INFO */}
              {step === 1 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-black text-slate-800 border-b pb-4 mb-6">Section A: Organization Information</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2 md:col-span-2">
                       <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Name of Organization / Group</label>
                       <input className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#008A62] font-medium" value={form.name} onChange={e => update('name', e.target.value)} placeholder="Full registered name" />
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                       <label className="text-xs font-bold uppercase tracking-wider text-slate-500 text-[#008A62]">Parent Organization Code</label>
                       <div className="relative">
                          <input 
                            className="w-full px-4 py-3 bg-emerald-50/30 border border-emerald-100 rounded-xl outline-none focus:border-[#008A62] font-black tracking-widest text-[#008A62]" 
                            value={form.parentOrgCode || ''} 
                            onChange={e => update('parentOrgCode', e.target.value.toUpperCase())} 
                            placeholder="XX-0000" 
                          />
                          {resolving && (
                             <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                <Loader2 size={18} className="animate-spin text-[#008A62]" />
                             </div>
                          )}
                       </div>
                       <AnimatePresence>
                         {hierarchy && (
                           <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mt-2 p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center gap-2">
                             <CheckCircle2 size={14} className="text-emerald-500" />
                             <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-tight">Linking to: <span className="text-emerald-900 ml-1">{hierarchy}</span></span>
                           </motion.div>
                         )}
                       </AnimatePresence>
                       <p className="text-[10px] text-slate-400 font-medium italic">If this organization is under another partner or the National Apex, enter their code here.</p>
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Acronym</label>
                       <input className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#008A62] font-medium" value={form.acronym} onChange={e => update('acronym', e.target.value)} placeholder="e.g. ABC" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Date of Establishment</label>
                       <input type="date" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#008A62] font-medium" value={form.establishmentDate} onChange={e => update('establishmentDate', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Type of Organization</label>
                       <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#008A62] font-medium" value={form.orgTypeStr} onChange={e => update('orgTypeStr', e.target.value)}>
                         <option value="">Select Type...</option>
                         <option>Cooperative Society</option>
                         <option>Artisan Union</option>
                         <option>NGO</option>
                         <option>CSO</option>
                         <option>Business Association</option>
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Sector</label>
                       <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#008A62] font-medium" value={form.sector} onChange={e => update('sector', e.target.value)}>
                         <option value="">Select Sector...</option>
                         <option>Agriculture</option><option>Education</option><option>Transport</option><option>Health</option><option>Trade</option><option>ICT</option><option>Literacy/Skills Dev</option>
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Reg. Number (CAC / Coop)</label>
                       <input className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#008A62] font-medium" value={form.regNumber} onChange={e => update('regNumber', e.target.value)} placeholder="RC-123456" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Members</label>
                       <input type="number" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#008A62] font-medium" value={form.activeMemberCount} onChange={e => update('activeMemberCount', e.target.value)} placeholder="Total members" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                       <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Address of Headquarters</label>
                       <textarea className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#008A62] font-medium h-24" value={form.hqAddress} onChange={e => update('hqAddress', e.target.value)} placeholder="Full office address" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                       <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Operating States / Zones</label>
                       <input className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#008A62] font-medium" value={form.operatingStates} onChange={e => update('operatingStates', e.target.value)} placeholder="e.g. Lagos, Abuja, Rivers" />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: REPRESENTATIVE INFO */}
              {step === 2 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-black text-slate-800 border-b pb-4 mb-6">Section B: Contact Person / Representative</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2 md:col-span-2">
                       <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Full Name of Representative</label>
                       <input className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#008A62] font-medium" value={form.repName} onChange={e => update('repName', e.target.value)} placeholder="Authorized person" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Position Held</label>
                       <input className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#008A62] font-medium" value={form.repPosition} onChange={e => update('repPosition', e.target.value)} placeholder="e.g. President, Secretary" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Phone Number</label>
                       <input className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#008A62] font-medium" value={form.repPhone} onChange={e => update('repPhone', e.target.value)} placeholder="080..." />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                       <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Email Address</label>
                       <input type="email" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#008A62] font-medium" value={form.repEmail} onChange={e => update('repEmail', e.target.value)} placeholder="rep@org.com" />
                    </div>
                    <div className="md:col-span-2 grid md:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-2xl border border-dashed border-slate-200">
                       <SearchableSelect label="Rep Bank" value={form.repBankName} options={banks} onChange={(val: string) => update('repBankName', val)} placeholder="Select Bank..." />
                       <div className="space-y-2">
                         <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Rep Account No.</label>
                         <input className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-[#008A62] font-medium" value={form.repAccountNumber} onChange={e => update('repAccountNumber', e.target.value)} maxLength={10} />
                       </div>
                       <div className="space-y-2">
                         <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Rep Account Name</label>
                         <input className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-[#008A62] font-medium" value={form.repAccountName} onChange={e => update('repAccountName', e.target.value)} />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Gender</label>
                       <div className="flex gap-4">
                         {['Male', 'Female', 'Other'].map(g => (
                           <button key={g} type="button" onClick={() => update('repGender', g)} className={`flex-1 py-3 rounded-xl font-bold border transition-all ${form.repGender === g ? 'bg-[#008A62] text-white border-[#008A62]' : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'}`}>
                             {g}
                           </button>
                         ))}
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Nationality</label>
                       <input className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#008A62] font-medium" value={form.repNationality} onChange={e => update('repNationality', e.target.value)} />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: IDENTIFICATION */}
              {step === 3 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-black text-slate-800 border-b pb-4 mb-6">Section C: Identification & Verification</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-xs font-bold uppercase tracking-wider text-slate-500 text-emerald-600">Organization TIN</label>
                       <input className="w-full px-4 py-3 bg-emerald-50/50 border border-emerald-100 rounded-xl outline-none focus:border-[#008A62] font-medium" value={form.orgTin} onChange={e => update('orgTin', e.target.value)} placeholder="Tax Identification Number" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Representative's NIN</label>
                       <input className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#008A62] font-medium" value={form.repNin} onChange={e => update('repNin', e.target.value)} maxLength={11} />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Representative's BVN</label>
                       <input className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#008A62] font-medium" value={form.repBvn} onChange={e => update('repBvn', e.target.value)} maxLength={11} />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Means of ID (Rep)</label>
                       <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#008A62] font-medium" value={form.repIdType} onChange={e => update('repIdType', e.target.value)}>
                         <option value="">Select ID Type...</option>
                         <option>National ID</option><option>Driver's License</option><option>Intl Passport</option><option>Voter's Card</option>
                       </select>
                    </div>
                    
                    <div className="md:col-span-2 grid md:grid-cols-3 gap-4 mt-4">
                       <div className="p-4 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-2 group cursor-pointer hover:border-[#008A62] transition-colors shadow-sm">
                         <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-400 group-hover:text-[#008A62] shadow-sm"><Camera size={20} /></div>
                         <span className="text-[10px] font-bold text-slate-400 uppercase">Representative ID</span>
                       </div>
                       <div className="p-4 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-2 group cursor-pointer hover:border-[#008A62] transition-colors shadow-sm">
                         <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-400 group-hover:text-[#008A62] shadow-sm"><Building2 size={20} /></div>
                         <span className="text-[10px] font-bold text-slate-400 uppercase">Organization Logo</span>
                       </div>
                       <div className="p-4 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-2 group cursor-pointer hover:border-[#008A62] transition-colors shadow-sm">
                         <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-400 group-hover:text-[#008A62] shadow-sm"><User size={20} /></div>
                         <span className="text-[10px] font-bold text-slate-400 uppercase">Rep Passport</span>
                       </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: SAVINGS & ENGAGEMENT */}
              {step === 4 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-black text-slate-800 border-b pb-4 mb-6">Section D: Savings & Engagement Preference</h3>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                       <div>
                         <h4 className="font-bold text-slate-800">Participate in Cooperative Savings?</h4>
                         <p className="text-xs text-slate-500">Enabling this allows the organization to save and access loans.</p>
                       </div>
                       <button onClick={() => update('participateInSavings', !form.participateInSavings)} className={`w-14 h-8 rounded-full transition-all relative ${form.participateInSavings ? 'bg-[#008A62]' : 'bg-slate-300'}`}>
                         <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${form.participateInSavings ? 'right-1' : 'left-1'}`} />
                       </button>
                    </div>

                    <AnimatePresence>
                      {form.participateInSavings && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="grid md:grid-cols-2 gap-6 overflow-hidden">
                          <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Preferred Savings Frequency</label>
                            <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#008A62] font-medium" value={form.savingsFrequency} onChange={e => update('savingsFrequency', e.target.value)}>
                              <option>Monthly</option><option>Quarterly</option><option>Annually</option>
                            </select>
                          </div>
                          <div className="space-y-2">
                             <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Monthly Contribution (₦)</label>
                             <input type="number" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#008A62] font-medium" value={form.monthlyContributionAmount} onChange={e => update('monthlyContributionAmount', Number(e.target.value))} />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="space-y-3">
                       <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Areas of Participation</label>
                       <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                         {['Loans', 'Training', 'Market Linkage', 'Grants', 'Projects', 'Advocacy'].map(area => (
                           <button key={area} onClick={() => {
                             const set = new Set(form.areasOfParticipation);
                             if (set.has(area)) set.delete(area); else set.add(area);
                             update('areasOfParticipation', Array.from(set));
                           }} className={`py-2 rounded-xl text-xs font-bold border transition-all ${form.areasOfParticipation.includes(area) ? 'bg-[#008A62] text-white border-[#008A62]' : 'bg-white text-slate-500 border-slate-200 hover:border-[#008A62]'}`}>
                             {area}
                           </button>
                         ))}
                       </div>
                    </div>

                    <div className="space-y-2">
                       <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Proposed Beneficiary Members</label>
                       <input type="number" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#008A62] font-medium" value={form.proposedBeneficiaries} onChange={e => update('proposedBeneficiaries', Number(e.target.value))} placeholder="Count of members to benefit from projects" />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 5: ORG BANKING */}
              {step === 5 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-black text-slate-800 border-b pb-4 mb-6">Section E: Organization Bank Account Details</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2 md:col-span-2">
                       <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Organizational Account Name</label>
                       <input className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#008A62] font-medium" value={form.orgAccountName} onChange={e => update('orgAccountName', e.target.value)} placeholder="Exact name as on bank record" />
                    </div>
                    <SearchableSelect label="Bank Name" value={form.orgBankName} options={banks} onChange={(val: string) => update('orgBankName', val)} placeholder="Select Organization Bank..." />
                    <div className="space-y-2">
                       <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Account Number</label>
                       <input className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#008A62] font-medium" value={form.orgAccountNumber} onChange={e => update('orgAccountNumber', e.target.value)} maxLength={10} />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Organization BVN (Rep.)</label>
                       <input className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#008A62] font-medium" value={form.orgBvn} onChange={e => update('orgBvn', e.target.value)} maxLength={11} />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                       <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Authorized Signatories (1 & 2)</label>
                       <input className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#008A62] font-medium" value={form.signatories} onChange={e => update('signatories', e.target.value)} placeholder="Name 1, Name 2" />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 6: REVIEW */}
              {step === 6 && (
                <div className="space-y-6">
                   <h3 className="text-xl font-black text-slate-800 border-b pb-4 mb-6">Section F: Final Review & Declaration</h3>
                   <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-4">
                      <div className="flex justify-between items-center border-b pb-2 cursor-pointer hover:bg-slate-100/50 transition-colors px-2 rounded-lg" onClick={() => setStep(1)}>
                        <span className="text-sm font-bold text-slate-500">Organization</span>
                        <span className="text-sm font-black text-slate-800 underline underline-offset-4 decoration-emerald-500/30">{form.name || 'MISSING'}</span>
                      </div>
                      <div className="flex justify-between items-center border-b pb-2 cursor-pointer hover:bg-slate-100/50 transition-colors px-2 rounded-lg" onClick={() => setStep(2)}>
                        <span className="text-sm font-bold text-slate-500">Representative</span>
                        <span className="text-sm font-black text-slate-800 underline underline-offset-4 decoration-emerald-500/30">{form.repName || 'MISSING'}</span>
                      </div>
                      <div className="flex justify-between items-center border-b pb-2 cursor-pointer hover:bg-slate-100/50 transition-colors px-2 rounded-lg" onClick={() => setStep(4)}>
                        <span className="text-sm font-bold text-slate-500">Savings Commitment</span>
                        <span className="text-sm font-black text-slate-800 underline underline-offset-4 decoration-emerald-500/30">₦{Number(form.monthlyContributionAmount).toLocaleString() || 0}</span>
                      </div>
                   </div>

                   <div className="p-6 bg-[#008A62]/10 rounded-[2rem] border-2 border-dashed border-[#008A62]/30 space-y-4 shadow-inner">
                      <div className="flex gap-4">
                        <input type="checkbox" className="w-5 h-5 rounded-md border-slate-300 text-[#008A62] accent-[#008A62] mt-1" checked={form.declaration} onChange={e => update('declaration', e.target.checked)} />
                        <p className="text-xs text-slate-600 leading-relaxed font-medium">
                          We, <strong>{form.name || '[Organization Name]'}</strong>, hereby apply for membership in NOGALSS National Apex Cooperative Society Ltd. 
                          We agree to adhere to the rules, byelaws, and rules, directives, policies of the Cooperative and affirm that the information provided herein is true and accurate.
                        </p>
                      </div>
                   </div>
                </div>
              )}
              
              {/* Navigation */}
              <div className="flex items-center justify-between mt-12 pt-8 border-t border-slate-100">
                {step > 1 && (
                  <button onClick={back} className="flex items-center gap-2 px-6 py-3 text-slate-500 font-bold hover:text-slate-800 transition-colors">
                    <ChevronLeft size={20} />
                    <span>Back</span>
                  </button>
                )}
                <div className="flex-1" />
                {step < 6 ? (
                  <button onClick={next} className="flex items-center gap-2 px-10 py-4 bg-[#008A62] text-white rounded-2xl font-black shadow-lg shadow-emerald-200 hover:scale-105 active:scale-95 transition-all">
                    <span>Next Step</span>
                    <ChevronRight size={20} />
                  </button>
                ) : (
                  <button onClick={handleSubmit} disabled={loading || !form.declaration} className="flex items-center gap-2 px-12 py-4 bg-slate-900 text-white rounded-2xl font-black shadow-xl shadow-emerald-900/10 hover:bg-black transition-all disabled:bg-slate-400">
                    {loading ? 'Processing...' : 'Complete & Submit'} <Send size={20} />
                  </button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {error && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-sm font-bold flex items-center gap-3">
             <Lock size={18} />
             {error}
          </motion.div>
        )}
      </div>
    </div>
  );
}

