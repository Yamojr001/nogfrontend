'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, ChevronRight, ChevronLeft, User, Phone, 
  Building2, ShieldCheck, Lock, Activity, Landmark, HeartHandshake, Shield, ChevronDown, Search
} from 'lucide-react';
import { 
  registerMember, fetchHierarchyOrganisations, 
  fetchHierarchySubOrgs, fetchHierarchyGroups, fetchBanks, initiateRegistrationPayment 
} from '@/lib/api';

const SearchableSelect = ({ label, value, options, onChange, placeholder }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useState<any>(null)[0]; // Simplified for local use

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
                    key={opt.code || opt.id}
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
  { id: 1, title: 'Personal', icon: User },
  { id: 2, title: 'Contact', icon: Phone },
  { id: 3, title: 'Affiliation', icon: Building2 },
  { id: 4, title: 'Banking', icon: Landmark },
  { id: 5, title: 'Next of Kin', icon: HeartHandshake },
  { id: 6, title: 'Payment', icon: Lock },
];

export default function MemberRegistrationPage() {
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [memberData, setMemberData] = useState<any>(null);
  
  const [organisations, setOrganisations] = useState<any[]>([]);
  const [subOrgs, setSubOrgs] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [bankList, setBankList] = useState<any[]>([]);
  
  const [form, setForm] = useState({
    firstName: '', lastName: '', dateOfBirth: '', gender: '', maritalStatus: '',
    nationality: 'Nigerian', stateOfOrigin: '', occupation: '', educationalQualification: '',
    email: '', phone: '', address: '', state: '', lga: '',
    membershipType: 'individual', organisationId: '', subOrgId: '', groupId: '',
    bankName: '', accountName: '', accountNumber: '', bvn: '',
    nokName: '', nokRelationship: '', nokPhone: '', nokAddress: '',
    savingsFrequency: 'monthly', proposedSavingsAmount: '', empowermentInterest: '',
    password: '', confirmPassword: '',
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (step === 3 && form.membershipType === 'organisation' && organisations.length === 0) {
      fetchHierarchyOrganisations().then(setOrganisations).catch(console.error);
    }
  }, [step, form.membershipType, organisations.length]);

  useEffect(() => {
    if (form.organisationId && form.membershipType === 'organisation') {
      fetchHierarchySubOrgs(Number(form.organisationId)).then(setSubOrgs).catch(console.error);
    } else {
      setSubOrgs([]);
    }
  }, [form.organisationId, form.membershipType]);

  useEffect(() => {
    if (form.subOrgId && form.membershipType === 'organisation') {
      fetchHierarchyGroups(Number(form.subOrgId)).then(setGroups).catch(console.error);
    } else {
      setGroups([]);
    }
  }, [form.subOrgId, form.membershipType]);

  useEffect(() => {
    if (step === 4 && bankList.length === 0) {
      fetchBanks().then(res => {
        if (res.status === 'success') setBankList(res.data);
        else setBankList(res); // Handle both formats
      }).catch(console.error);
    }
  }, [step, bankList.length]);

  const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  const statesList = ['Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT', 'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara'];

  const validateForm = () => {
    if (!form.firstName || !form.lastName) return 'Full name is required';
    if (!form.email || !form.phone) return 'Email and phone are required';
    if (form.password.length < 8) return 'Password must be at least 8 characters';
    if (form.password !== form.confirmPassword) return 'Passwords do not match';
    return null;
  };

  const handleSubmit = async () => {
    const errorMsg = validateForm();
    if (errorMsg) {
       setError(errorMsg);
       return;
    }

    setIsSubmitting(true);
    setError('');
    try {
      const payload = {
        ...form,
        role: 'MEMBER',
        organisationCode: 'APEX-0001',
        organisationId: form.membershipType === 'individual' ? 1 : Number(form.organisationId) || undefined,
        subOrgId: form.subOrgId ? Number(form.subOrgId) : undefined,
        groupId: form.groupId ? Number(form.groupId) : undefined,
        proposedSavingsAmount: Number(form.proposedSavingsAmount) || 0,
      };
      
      const res = await registerMember(payload);
      if (res.status === 'success') {
        localStorage.setItem('access_token', res.data.access_token);
        localStorage.setItem('refresh_token', res.data.refresh_token);
        setMemberData(res.data);
        setStep(6);
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      setError(Array.isArray(msg) ? msg.join(', ') : (msg || 'Registration failed. Please verify your connection.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaystack = async () => {
    setIsSubmitting(true);
    try {
      const res = await initiateRegistrationPayment();
      if (res.status === 'success' && res.data.authorization_url) {
        window.location.href = res.data.authorization_url;
      }
    } catch (err: any) {
      alert('Error initializing payment. Please try again.');
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
          <h2 className="text-3xl font-black text-slate-800 mb-4">You're In!</h2>
          <p className="text-lg text-slate-600 mb-8 font-medium leading-relaxed">
            Your membership application has been successfully submitted to the National Apex Cooperative. Please check your email for the next steps.
          </p>
          <Link href="/login" className="inline-flex items-center justify-center w-full py-4 bg-[#008A62] text-white rounded-2xl font-bold shadow-lg shadow-emerald-600/30 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-600/40 transition-all">
            Proceed to Login Dashboard
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#008A62,#004c35)] relative flex flex-col items-center pt-24 pb-12 px-4 selection:bg-emerald-500/30">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#00DDA3] rounded-full blur-[150px] opacity-20 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#008A62] rounded-full blur-[150px] opacity-40 pointer-events-none" />

      <div className="w-full max-w-3xl relative z-10 flex flex-col items-center">
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center mb-4 relative z-10">
            <ShieldCheck size={32} className="text-[#008A62]" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white text-center tracking-tight">Become a Member</h1>
          <p className="text-emerald-100/80 font-medium mt-2">NOGALSS Cooperative Ecosystem</p>
        </div>

        <div className="w-full bg-white/10 backdrop-blur-md rounded-2xl p-4 mb-8 border border-white/10 shadow-inner flex items-center justify-between gap-2 scrollbar-none">
          {steps.map((s, idx) => {
            const isActive = step === s.id;
            const isDone = step > s.id;
            return (
              <div key={s.id} className="flex flex-col items-center min-w-[70px] relative group">
                <div 
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500
                    ${isActive ? 'bg-white text-[#008A62] shadow-[0_0_20px_rgba(255,255,255,0.4)] scale-110' : ''}
                    ${isDone ? 'bg-[#00DDA3] text-[#0A4226]' : ''}
                    ${!isActive && !isDone ? 'bg-white/10 text-white/50' : ''}
                  `}
                >
                  {isDone ? <CheckCircle2 size={18} strokeWidth={3} /> : <s.icon size={18} strokeWidth={isActive ? 2.5 : 2} />}
                </div>
                <span className={`text-[10px] font-bold mt-2 uppercase tracking-wide transition-colors duration-300 ${isActive ? 'text-white' : 'text-emerald-100/50'}`}>
                  {s.title}
                </span>
              </div>
            );
          })}
        </div>

        <motion.div 
          className="w-full bg-white/95 backdrop-blur-3xl rounded-[2.5rem] shadow-2xl p-8 md:p-12 border border-white"
          layout
        >
          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0 }}
                className="bg-rose-50 border border-rose-200 text-rose-600 px-6 py-4 rounded-2xl text-sm font-semibold mb-8 flex items-center gap-3"
              >
                <div className="w-2 h-2 bg-rose-500 rounded-full" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="popLayout">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-bold text-slate-800 mb-8 border-b border-slate-100 pb-4">
                {steps.find(s => s.id === step)?.title} Information
              </h3>

              {step === 1 && (
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">First Name <span className="text-rose-500">*</span></label>
                    <input className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#008A62]/30 focus:border-[#008A62] outline-none transition-all font-medium text-slate-800" value={form.firstName} onChange={e => update('firstName', e.target.value)} placeholder="Enter first name" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Last Name <span className="text-rose-500">*</span></label>
                    <input className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#008A62]/30 focus:border-[#008A62] outline-none transition-all font-medium text-slate-800" value={form.lastName} onChange={e => update('lastName', e.target.value)} placeholder="Enter last name" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Date of Birth</label>
                    <input type="date" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#008A62]/30 focus:border-[#008A62] outline-none transition-all font-medium text-slate-800" value={form.dateOfBirth} onChange={e => update('dateOfBirth', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Gender</label>
                    <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#008A62]/30 focus:border-[#008A62] outline-none transition-all font-medium text-slate-800 appearance-none" value={form.gender} onChange={e => update('gender', e.target.value)}>
                      <option value="">Select Gender</option><option>Male</option><option>Female</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Marital Status</label>
                    <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#008A62]/30 focus:border-[#008A62] outline-none transition-all font-medium text-slate-800 appearance-none" value={form.maritalStatus} onChange={e => update('maritalStatus', e.target.value)}>
                      <option value="">Select Status</option><option>Single</option><option>Married</option><option>Divorced</option><option>Widowed</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Occupation</label>
                    <input className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#008A62]/30 focus:border-[#008A62] outline-none transition-all font-medium text-slate-800" value={form.occupation} onChange={e => update('occupation', e.target.value)} placeholder="e.g. Trader, Farmer" />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Email Address <span className="text-rose-500">*</span></label>
                    <input type="email" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#008A62]/30 focus:border-[#008A62] outline-none transition-all font-medium text-slate-800" value={form.email} onChange={e => update('email', e.target.value)} placeholder="name@example.com" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Phone Number <span className="text-rose-500">*</span></label>
                    <input className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#008A62]/30 focus:border-[#008A62] outline-none transition-all font-medium text-slate-800" value={form.phone} onChange={e => update('phone', e.target.value)} placeholder="+234 XXX XXXX" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Residential Address</label>
                    <input className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#008A62]/30 focus:border-[#008A62] outline-none transition-all font-medium text-slate-800" value={form.address} onChange={e => update('address', e.target.value)} placeholder="Enter full address" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">State of Residence</label>
                    <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#008A62]/30 focus:border-[#008A62] outline-none transition-all font-medium text-slate-800 appearance-none" value={form.state} onChange={e => update('state', e.target.value)}>
                      <option value="">Select State</option>
                      {statesList.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">LGA</label>
                    <input className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#008A62]/30 focus:border-[#008A62] outline-none transition-all font-medium text-slate-800" value={form.lga} onChange={e => update('lga', e.target.value)} placeholder="Enter LGA" />
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Membership Tier</label>
                    <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#008A62]/30 focus:border-[#008A62] outline-none transition-all font-medium text-slate-800 appearance-none" value={form.membershipType} onChange={e => update('membershipType', e.target.value)}>
                      <option value="individual">Direct NOGALSS Member</option>
                      <option value="organisation">Via Affiliated Organization</option>
                    </select>
                  </div>

                  <AnimatePresence>
                    {form.membershipType === 'organisation' && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }} 
                        animate={{ opacity: 1, height: 'auto' }} 
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-6 border-t border-slate-100 pt-6 mt-6"
                      >
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-[#008A62]">Parent Organization</label>
                            <div className="relative">
                              <select 
                                className="w-full px-4 py-3 bg-emerald-50/50 border border-emerald-100 rounded-xl focus:ring-2 focus:ring-[#008A62]/30 focus:border-[#008A62] outline-none transition-all font-medium text-slate-800 appearance-none bg-no-repeat" 
                                value={form.organisationId} 
                                onChange={e => {
                                  update('organisationId', e.target.value);
                                  update('subOrgId', '');
                                  update('groupId', '');
                                }}
                              >
                                <option value="">Select an Organization...</option>
                                {organisations.map(o => <option key={o.id} value={o.id}>{o.name} ({o.code})</option>)}
                              </select>
                              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-600/50 pointer-events-none" size={16} />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-blue-600">Sub-Organization (Optional)</label>
                            <div className="relative">
                              <select 
                                className="w-full px-4 py-3 bg-blue-50/50 border border-blue-100 rounded-xl focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 outline-none transition-all font-medium text-slate-800 appearance-none disabled:opacity-50" 
                                value={form.subOrgId} 
                                onChange={e => {
                                  update('subOrgId', e.target.value);
                                  update('groupId', '');
                                }}
                                disabled={!form.organisationId || subOrgs.length === 0}
                              >
                                <option value="">{subOrgs.length > 0 ? 'Select Sub-Organization...' : 'No Sub-Orgs available'}</option>
                                {subOrgs.map(s => <option key={s.id} value={s.id}>{s.name} ({s.code})</option>)}
                              </select>
                              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-600/50 pointer-events-none" size={16} />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-amber-600">Group / Unit (Optional)</label>
                            <div className="relative">
                              <select 
                                className="w-full px-4 py-3 bg-amber-50/50 border border-amber-100 rounded-xl focus:ring-2 focus:ring-amber-600/30 focus:border-amber-600 outline-none transition-all font-medium text-slate-800 appearance-none disabled:opacity-50" 
                                value={form.groupId} 
                                onChange={e => update('groupId', e.target.value)}
                                disabled={!form.subOrgId || groups.length === 0}
                              >
                                <option value="">{groups.length > 0 ? 'Select Group / Unit...' : 'No Groups available'}</option>
                                {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                              </select>
                              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-amber-600/50 pointer-events-none" size={16} />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <SearchableSelect 
                      label="Bank Name"
                      value={form.bankName}
                      options={bankList}
                      placeholder="Select Bank..."
                      onChange={(val: string) => update('bankName', val)}
                    />
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Account Number</label>
                      <input className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#008A62]/30 focus:border-[#008A62] outline-none transition-all font-medium text-slate-800" value={form.accountNumber} onChange={e => update('accountNumber', e.target.value)} placeholder="10-digit number" maxLength={10} />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Account Name</label>
                      <input className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#008A62]/30 focus:border-[#008A62] outline-none transition-all font-medium text-slate-800" value={form.accountName} onChange={e => update('accountName', e.target.value)} placeholder="Exact name on account" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">Bank Verification Number (BVN) <Lock size={12} className="text-emerald-500"/></label>
                      <input className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#008A62]/30 focus:border-[#008A62] outline-none transition-all font-medium text-slate-800" value={form.bvn} onChange={e => update('bvn', e.target.value)} placeholder="11-digit BVN" maxLength={11} />
                    </div>
                  </div>
                </div>
              )}

              {step === 5 && (
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Next of Kin Full Name</label>
                    <input className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#008A62]/30 focus:border-[#008A62] outline-none transition-all font-medium text-slate-800" value={form.nokName} onChange={e => update('nokName', e.target.value)} placeholder="Enter full name" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Relationship</label>
                    <input className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#008A62]/30 focus:border-[#008A62] outline-none transition-all font-medium text-slate-800" value={form.nokRelationship} onChange={e => update('nokRelationship', e.target.value)} placeholder="e.g. Spouse, Sibling" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Phone</label>
                    <input className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#008A62]/30 focus:border-[#008A62] outline-none transition-all font-medium text-slate-800" value={form.nokPhone} onChange={e => update('nokPhone', e.target.value)} placeholder="Phone number" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Full Address</label>
                    <input className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#008A62]/30 focus:border-[#008A62] outline-none transition-all font-medium text-slate-800" value={form.nokAddress} onChange={e => update('nokAddress', e.target.value)} placeholder="Enter full address" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Account Password <span className="text-rose-500">*</span></label>
                    <input type="password" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#008A62]/30 focus:border-[#008A62] outline-none transition-all font-medium text-slate-800" value={form.password} onChange={e => update('password', e.target.value)} placeholder="Min 8 characters" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Confirm Password <span className="text-rose-500">*</span></label>
                    <input type="password" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#008A62]/30 focus:border-[#008A62] outline-none transition-all font-medium text-slate-800" value={form.confirmPassword} onChange={e => update('confirmPassword', e.target.value)} placeholder="Min 8 characters" required />
                  </div>
                </div>
              )}

              {step === 6 && (
                <div className="space-y-8 py-4">
                  <div className="text-center space-y-2">
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Lock size={32} />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800">Final Step: Registration Fee</h3>
                    <p className="text-slate-500">To complete your membership, please pay the one-time registration fee.</p>
                    <div className="inline-block px-6 py-3 bg-[#008A62]/10 rounded-2xl mt-4">
                      <span className="text-3xl font-black text-[#008A62]">₦5,250.00</span>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    <button 
                      onClick={handlePaystack}
                      disabled={isSubmitting}
                      className="w-full p-6 bg-white border-2 border-slate-100 rounded-2xl flex items-center justify-between hover:border-[#008A62] hover:shadow-lg transition-all group overflow-hidden relative"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold">PS</div>
                        <div className="text-left">
                          <h4 className="font-bold text-slate-800 group-hover:text-[#008A62]">Pay with Paystack</h4>
                          <p className="text-xs text-slate-500">Fast, secure automated checkout (Cards, USSD, Transfer)</p>
                        </div>
                      </div>
                      <ChevronRight className="text-slate-300 group-hover:text-[#008A62] group-hover:translate-x-1 transition-all" size={20} />
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-between mt-10 pt-6 border-t border-slate-100">
            {step > 1 && step < 6 ? (
              <button 
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                onClick={() => setStep(s => s - 1)}
              >
                <ChevronLeft size={18} /> Back
              </button>
            ) : <div />}

            {step < 5 ? (
              <button 
                className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white bg-[#008A62] hover:bg-[#007A57] shadow-lg shadow-emerald-600/30 transition-all hover:-translate-y-0.5 active:translate-y-0"
                onClick={() => setStep(s => s + 1)}
              >
                Next <ChevronRight size={18} />
              </button>
            ) : step === 5 ? (
              <button 
                className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white shadow-lg transition-all ${isSubmitting ? 'bg-slate-400 cursor-not-allowed shadow-none' : 'bg-slate-900 hover:bg-black shadow-slate-900/30 hover:-translate-y-0.5 active:translate-y-0'}`}
                onClick={handleSubmit} 
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Processing...' : 'Complete Secure Registration'}
              </button>
            ) : (
              <div className="flex items-center gap-2 text-slate-400">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#008A62]">Secure Payment Gateway Active</span>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
