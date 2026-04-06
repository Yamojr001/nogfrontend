'use client';

import { useState, useEffect } from "react";
import { 
  User, Mail, Phone, MapPin, Briefcase, GraduationCap, 
  Wallet, Sparkles, Save, ChevronRight, CheckCircle2, 
  Percent, Heart, Building, ShieldCheck, CreditCard,
  Camera, Loader2, AlertCircle, Tractor, Home, Wrench, Coins, HeartPulse, ChevronDown
} from "lucide-react";
import { EMPOWERMENT_CATEGORIES } from '@/constants/empowerment';
import { motion, AnimatePresence } from "framer-motion";
import api from '@/lib/api';

const SECTIONS = [
  { id: 'personal', label: 'Personal Details', icon: User },
  { id: 'contact', label: 'Contact & Next of Kin', icon: Phone },
  { id: 'professional', label: 'Occupation & Education', icon: Briefcase },
  { id: 'savings', label: 'Savings & Empowerment', icon: Wallet },
];

export default function MemberProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', phoneNumber: '', address: '',
    gender: '', dateOfBirth: '', maritalStatus: '', stateOfOrigin: '', nationality: '',
    occupation: '', educationalQualification: '',
    organisationCode: '',
    extOrgName: '', extPosition: '', extStateChapter: '',
    savingsFrequency: '', proposedSavingsAmount: '', empowermentInterest: '',
    nokName: '', nokRelationship: '', nokPhone: '', nokAddress: '', nokEmail: ''
  });

  const [resolving, setResolving] = useState(false);
  const [hierarchy, setHierarchy] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  // Debounced Organization Code Check
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (formData.organisationCode && formData.organisationCode.length >= 4) {
        setResolving(true);
        try {
          const res = await api.get(`/auth/resolve-code/${formData.organisationCode}`);
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
  }, [formData.organisationCode]);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/auth/profile');
      const data = res.data;
      setProfile(data);
      
      const names = (data.name || '').split(' ');
      const member = data.memberProfile || {};
      const nok = member.nextOfKin || {};
      
      // Determine the most specific code to show
      const currentCode = data.group?.code || data.branch?.code || data.organisation?.code || '';

      setFormData({
        firstName: data.firstName || names[0] || '',
        lastName: data.lastName || names.slice(1).join(' ') || '',
        phoneNumber: data.phone || data.phoneNumber || '',
        address: member.address || '',
        gender: member.gender || '',
        dateOfBirth: member.dateOfBirth ? new Date(member.dateOfBirth).toISOString().split('T')[0] : '',
        maritalStatus: member.maritalStatus || '',
        stateOfOrigin: member.stateOfOrigin || '',
        nationality: member.nationality || '',
        occupation: member.occupation || '',
        educationalQualification: member.educationalQualification || '',
        organisationCode: currentCode,
        extOrgName: member.extOrgName || '',
        extPosition: member.extPosition || '',
        extStateChapter: member.extStateChapter || '',
        savingsFrequency: member.savingsFrequency || '',
        proposedSavingsAmount: member.proposedSavingsAmount || '',
        empowermentInterest: member.empowermentInterest || '',
        nokName: nok.name || '',
        nokRelationship: nok.relationship || '',
        nokPhone: nok.phone || '',
        nokAddress: nok.address || '',
        nokEmail: nok.email || ''
      });
      
      // Set initial hierarchy preview
      if (currentCode) {
        api.get(`/auth/resolve-code/${currentCode}`).then(res => setHierarchy(res.data.hierarchy)).catch(() => {});
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    setMessage(null);
    try {
      await api.patch('/auth/profile', {
        ...formData,
        name: `${formData.firstName} ${formData.lastName}`.trim()
      });
      setMessage({ type: 'success', text: 'Profile saved successfully!' });
      fetchProfile();
      setTimeout(() => setMessage(null), 5000);
    } catch (e) {
      setMessage({ type: 'error', text: 'Failed to save profile. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  // Calculate completeness
  const calculateProgress = () => {
    const fields = Object.values(formData);
    const filled = fields.filter(f => !!f).length;
    return Math.round((filled / fields.length) * 100);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <Loader2 size={48} className="text-[#008A62] animate-spin mb-4" />
        <p className="text-slate-500 font-bold animate-pulse uppercase tracking-widest text-xs">Loading Profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-20">
      {/* --- HEADER SECTION --- */}
      <div className="relative mb-12">
        <div className="h-48 w-full bg-[linear-gradient(135deg,#008A62,#005c41)] rounded-[3rem] shadow-2xl relative overflow-hidden">
          <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-emerald-400 rounded-full blur-[80px] opacity-30" />
          <div className="absolute bottom-[-10%] left-[-5%] w-48 h-48 bg-teal-300 rounded-full blur-[60px] opacity-20" />
        </div>
        
        <div className="absolute left-10 md:left-16 bottom-[-2.5rem] flex items-end gap-6">
          <div className="relative group">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] bg-white p-2 shadow-2xl overflow-hidden items-center justify-center flex border-4 border-white">
              {profile?.avatarUrl ? (
                <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover rounded-[2rem]" />
              ) : (
                <div className="w-full h-full bg-slate-100 rounded-[2rem] flex items-center justify-center text-[#008A62]">
                  <span className="text-4xl md:text-5xl font-black">{formData.firstName[0]}{formData.lastName[0]}</span>
                </div>
              )}
            </div>
            <button className="absolute bottom-3 right-3 p-2.5 bg-white rounded-xl shadow-lg text-[#008A62] hover:scale-110 active:scale-95 transition-all border border-slate-100">
              <Camera size={18} />
            </button>
          </div>

          <div className="mb-6 hidden md:block">
            <h1 className="text-3xl font-black text-white drop-shadow-md">{formData.firstName} {formData.lastName}</h1>
            <div className="flex items-center gap-3 mt-1.5">
              <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-[10px] font-bold uppercase tracking-widest border border-white/30">Member ID: {profile?.memberProfile?.membershipId || 'PENDING'}</span>
              <span className="flex items-center gap-1.5 text-emerald-100 text-[10px] font-black uppercase tracking-widest">
                <CheckCircle2 size={12} className="text-emerald-300" /> Verified Member
              </span>
            </div>
          </div>
        </div>

        <div className="absolute right-10 bottom-[-2rem] hidden lg:flex items-center gap-4">
           <div className="bg-white p-4 rounded-3xl shadow-xl border border-slate-50 flex items-center gap-4 min-w-[200px]">
              <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-[#008A62]">
                <Percent size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Completeness</p>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${calculateProgress()}%` }} />
                  </div>
                  <span className="text-sm font-black text-slate-800">{calculateProgress()}%</span>
                </div>
              </div>
           </div>
           
           <button 
             onClick={handleSaveProfile}
             disabled={saving}
             className="px-8 py-4 bg-slate-900 text-white rounded-[1.5rem] font-black shadow-2xl shadow-slate-900/40 hover:-translate-y-1 hover:bg-black transition-all flex items-center gap-2 disabled:bg-slate-400"
           >
             {saving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
             <span>Save Changes</span>
           </button>
        </div>
      </div>

      {/* --- CONTENT AREA --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 px-4 mt-20">
        
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3 space-y-3">
          {SECTIONS.map((s) => {
            const Icon = s.icon;
            const isActive = activeTab === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setActiveTab(s.id)}
                className={`w-full flex items-center gap-4 p-5 rounded-[1.75rem] transition-all duration-300 ${
                  isActive 
                    ? 'bg-white shadow-xl shadow-emerald-900/5 text-[#008A62] scale-[1.02] border border-emerald-50' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                  isActive ? 'bg-[#008A62] text-white' : 'bg-slate-100 text-slate-400'
                }`}>
                  <Icon size={20} />
                </div>
                <span className="font-black text-sm uppercase tracking-tight text-left leading-tight">{s.label}</span>
                {isActive && <ChevronRight size={18} className="ml-auto" />}
              </button>
            );
          })}
          
          <div className="lg:hidden">
             <button 
               onClick={handleSaveProfile}
               disabled={saving}
               className="w-full py-4 mt-6 bg-[#008A62] text-white rounded-[1.5rem] font-black shadow-xl shadow-emerald-900/20 flex items-center justify-center gap-2"
             >
               {saving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
               <span>Save Changes</span>
             </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="lg:col-span-9">
          <AnimatePresence mode="wait">
             {message && (
                <motion.div 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`p-4 rounded-2xl mb-6 flex items-center gap-3 border ${
                    message.type === 'success' 
                      ? 'bg-emerald-50 border-emerald-100 text-emerald-700' 
                      : 'bg-rose-50 border-rose-100 text-rose-700'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full ${message.type === 'success' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                  <p className="text-sm font-bold">{message.text}</p>
                </motion.div>
             )}
          </AnimatePresence>

          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl shadow-slate-900/5 border border-slate-50 relative overflow-hidden"
          >
             <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full opacity-50" />
             
             {/* --- PERSONAL INFO --- */}
             {activeTab === 'personal' && (
               <div className="space-y-8">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-[#008A62]">
                      <User size={24} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Personal Details</h2>
                      <p className="text-slate-400 font-medium text-sm">Tell us more about yourself to help us serve you better.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormInput label="First Name" name="firstName" value={formData.firstName} onChange={handleInputChange} icon={User} />
                    <FormInput label="Last Name" name="lastName" value={formData.lastName} onChange={handleInputChange} icon={User} />
                    <FormSelect label="Gender" name="gender" value={formData.gender} onChange={handleInputChange} icon={Heart} options={[
                      {value: 'male', label: 'Male'}, {value: 'female', label: 'Female'}, {value: 'other', label: 'Other'}
                    ]} />
                    <FormInput label="Date of Birth" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleInputChange} icon={Sparkles} type="date" />
                    <FormSelect label="Marital Status" name="maritalStatus" value={formData.maritalStatus} onChange={handleInputChange} icon={ShieldCheck} options={[
                      {value: 'single', label: 'Single'}, {value: 'married', label: 'Married'}, {value: 'divorced', label: 'Divorced'}, {value: 'widow', label: 'Widow/Widower'}
                    ]} />
                    <FormInput label="Nationality" name="nationality" value={formData.nationality} onChange={handleInputChange} icon={MapPin} />
                    <div className="md:col-span-2">
                       <FormInput label="State of Origin" name="stateOfOrigin" value={formData.stateOfOrigin} onChange={handleInputChange} icon={MapPin} />
                    </div>
                  </div>
               </div>
             )}

             {/* --- CONTACT & NOK --- */}
             {activeTab === 'contact' && (
               <div className="space-y-8">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-[#008A62]">
                      <Phone size={24} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Contact Information</h2>
                      <p className="text-slate-400 font-medium text-sm">Your contact details and emergency connections.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormInput label="Phone Number" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} icon={Phone} />
                    <FormInput label="Email Address" value={profile?.email} disabled icon={Mail} />
                    <div className="md:col-span-2">
                      <FormInput label="Resident Address" name="address" value={formData.address} onChange={handleInputChange} icon={MapPin} textarea />
                    </div>

                    <div className="md:col-span-2 pt-4">
                      <div className="px-4 py-3 bg-slate-50 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Next of Kin (Emergency Contact)</div>
                    </div>

                    <FormInput label="NOK Full Name" name="nokName" value={formData.nokName} onChange={handleInputChange} icon={User} />
                    <FormInput label="Relationship" name="nokRelationship" value={formData.nokRelationship} onChange={handleInputChange} icon={Heart} />
                    <FormInput label="NOK Phone" name="nokPhone" value={formData.nokPhone} onChange={handleInputChange} icon={Phone} />
                    <FormInput label="NOK Email" name="nokEmail" value={formData.nokEmail} onChange={handleInputChange} icon={Mail} />
                    <div className="md:col-span-2">
                      <FormInput label="NOK Resident Address" name="nokAddress" value={formData.nokAddress} onChange={handleInputChange} icon={MapPin} textarea />
                    </div>
                  </div>
               </div>
             )}

             {/* --- PROFESSIONAL --- */}
             {activeTab === 'professional' && (
               <div className="space-y-8">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-[#008A62]">
                      <Briefcase size={24} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Occupation & Organization</h2>
                      <p className="text-slate-400 font-medium text-sm">Professional background and organizational affiliation.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormInput label="Occupation" name="occupation" value={formData.occupation} onChange={handleInputChange} icon={Briefcase} />
                    <FormInput label="Educational Qualification" name="educationalQualification" value={formData.educationalQualification} onChange={handleInputChange} icon={GraduationCap} />
                    
                    <div className="md:col-span-2 pt-4">
                      <div className="px-4 py-3 bg-slate-50 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">NOGALSS Hierarchy Identification</div>
                    </div>

                    <div className="md:col-span-2 space-y-4">
                      <div className="relative group">
                        <label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 ml-1 group-focus-within:text-[#008A62] transition-colors">Organization / Group Code</label>
                        <div className="relative mt-2">
                           <div className="absolute left-4 top-[1.125rem] text-slate-300 group-focus-within:text-[#008A62] transition-colors">
                              <Building size={18} />
                           </div>
                           <input 
                             name="organisationCode"
                             value={formData.organisationCode || ''}
                             onChange={handleInputChange}
                             placeholder="XX-0000"
                             className="w-full pl-12 pr-4 py-4 h-14 bg-emerald-50/30 border border-emerald-100 rounded-3xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-[#008A62] transition-all text-sm font-black text-slate-800 placeholder:text-slate-300 uppercase tracking-widest"
                           />
                           {resolving && (
                              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                 <Loader2 size={18} className="animate-spin text-[#008A62]" />
                              </div>
                           )}
                        </div>
                        <AnimatePresence>
                          {hierarchy && (
                            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-3 px-4 py-3 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-3">
                              <CheckCircle2 size={16} className="text-emerald-500" />
                              <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-tight">Verified Placement: <span className="text-emerald-900 ml-1">{hierarchy}</span></span>
                            </motion.div>
                          )}
                        </AnimatePresence>
                        <p className="mt-2 text-[10px] text-slate-400 font-medium px-1 italic">Enter the unique code of your Cooperate/Branch/Group to update your hierarchy placement.</p>
                      </div>
                    </div>

                    <div className="md:col-span-2 pt-4">
                      <div className="px-4 py-3 bg-slate-50 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">External Organization (Optional)</div>
                    </div>

                    <FormInput label="Organization Name" name="extOrgName" value={formData.extOrgName} onChange={handleInputChange} icon={Building} />
                    <FormInput label="Position Held" name="extPosition" value={formData.extPosition} onChange={handleInputChange} icon={ShieldCheck} />
                    <div className="md:col-span-2">
                       <FormInput label="State Chapter" name="extStateChapter" value={formData.extStateChapter} onChange={handleInputChange} icon={MapPin} />
                    </div>
                  </div>
               </div>
             )}

             {/* --- SAVINGS --- */}
             {activeTab === 'savings' && (
               <div className="space-y-8">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-[#008A62]">
                      <Wallet size={24} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Savings & Empowerment</h2>
                      <p className="text-slate-400 font-medium text-sm">Plan your financial future and empowerment goals.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormSelect label="Savings Frequency" name="savingsFrequency" value={formData.savingsFrequency} onChange={handleInputChange} icon={Sparkles} options={[
                      {value: 'daily', label: 'Daily'}, {value: 'weekly', label: 'Weekly'}, {value: 'monthly', label: 'Monthly'}
                    ]} />
                    <FormInput label="Proposed Monthly Savings" name="proposedSavingsAmount" value={formData.proposedSavingsAmount} onChange={handleInputChange} icon={CreditCard} type="number" />
                    
                    <div className="md:col-span-2 space-y-4">
                       <div className="flex items-center gap-2 mb-2">
                         <HeartPulse className="text-[#008A62]" size={20} />
                         <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Priority Empowerment Interests</h3>
                       </div>
                       <p className="text-[10px] text-slate-400 font-medium leading-relaxed mb-4">
                         Select your priority areas for support and empowerment.
                       </p>

                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[500px] overflow-y-auto pr-4 custom-scrollbar">
                         {EMPOWERMENT_CATEGORIES.map((cat) => (
                           <div key={cat.id} className="space-y-3">
                             <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
                               <span className="text-[10px] font-black text-[#008A62] uppercase tracking-[0.1em]">{cat.title}</span>
                             </div>
                             <div className="space-y-1.5">
                               {cat.options.map((opt) => {
                                 const isSelected = (formData.empowermentInterest || '').split(', ').includes(opt.label);
                                 return (
                                   <button
                                     key={opt.id}
                                     type="button"
                                     onClick={() => {
                                       const current = (formData.empowermentInterest || '').split(', ').filter(Boolean);
                                       let next;
                                       if (isSelected) {
                                         next = current.filter(i => i !== opt.label);
                                       } else {
                                         next = [...current, opt.label];
                                       }
                                       setFormData(prev => ({ ...prev, empowermentInterest: next.join(', ') }));
                                     }}
                                     className={`flex items-center gap-2.5 p-2.5 rounded-xl border transition-all text-left w-full ${
                                       isSelected
                                         ? 'bg-emerald-50/50 border-emerald-200'
                                         : 'bg-white border-slate-100 hover:border-emerald-100'
                                     }`}
                                   >
                                     <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                                       isSelected
                                         ? 'bg-[#008A62] border-[#008A62] text-white'
                                         : 'bg-white border-slate-200'
                                     }`}>
                                       {isSelected && <CheckCircle2 size={10} />}
                                     </div>
                                     <span className={`text-[10px] font-bold transition-colors ${
                                       isSelected ? 'text-emerald-900' : 'text-slate-600'
                                     }`}>
                                       {opt.label}
                                     </span>
                                   </button>
                                 );
                               })}
                             </div>
                           </div>
                         ))}
                       </div>
                    </div>
                  </div>
               </div>
             )}

             <div className="mt-12 pt-8 border-t border-slate-100 flex items-center justify-between">
                <button 
                  onClick={() => {
                    const idx = SECTIONS.findIndex(s => s.id === activeTab);
                    if (idx > 0) setActiveTab(SECTIONS[idx-1].id);
                  }}
                  disabled={activeTab === SECTIONS[0].id}
                  className="px-6 py-3 text-slate-400 font-black uppercase tracking-widest text-xs hover:text-[#008A62] transition-colors disabled:opacity-30"
                >
                  Back
                </button>

                <div className="flex items-center gap-3">
                   {activeTab !== SECTIONS[SECTIONS.length-1].id ? (
                      <button 
                        onClick={() => {
                          const idx = SECTIONS.findIndex(s => s.id === activeTab);
                          if (idx < SECTIONS.length - 1) setActiveTab(SECTIONS[idx+1].id);
                        }}
                        className="px-8 py-4 bg-white border-2 border-emerald-100 text-[#008A62] rounded-2xl font-black shadow-xl shadow-emerald-900/5 hover:bg-emerald-50 transition-all flex items-center gap-2"
                      >
                        <span>Next Section</span>
                        <ChevronRight size={18} />
                      </button>
                   ) : (
                      <button 
                        onClick={handleSaveProfile}
                        disabled={saving}
                        className="px-10 py-4 bg-[#008A62] text-white rounded-2xl font-black shadow-2xl shadow-emerald-900/40 hover:-translate-y-1 hover:bg-[#007553] transition-all flex items-center gap-2 disabled:bg-slate-400"
                      >
                        {saving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                        <span>Finalize Profile</span>
                      </button>
                   )}
                </div>
             </div>
          </motion.div>
          
          <div className="mt-8 flex items-center justify-center gap-3 opacity-40">
             <ShieldCheck size={16} className="text-[#008A62]" />
             <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Your data is secured with AES-256 encryption</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- HELPER COMPONENTS ---

function FormInput({ label, name, value, onChange, icon: Icon, type = 'text', textarea = false, disabled = false, placeholder = '' }: any) {
  return (
    <div className="space-y-2 group">
      <label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 ml-1 group-focus-within:text-[#008A62] transition-colors">{label}</label>
      <div className="relative">
        <div className="absolute left-4 top-[1.125rem] text-slate-300 group-focus-within:text-[#008A62] transition-colors">
          <Icon size={18} />
        </div>
        {textarea ? (
          <textarea
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled}
            placeholder={placeholder}
            rows={3}
            className="w-full pl-12 pr-4 py-4 bg-slate-50/50 border border-slate-100 rounded-3xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-[#008A62] transition-all text-sm font-bold text-slate-800 placeholder:text-slate-300"
          />
        ) : (
          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled}
            placeholder={placeholder}
            className="w-full pl-12 pr-4 py-4 h-14 bg-slate-50/50 border border-slate-100 rounded-3xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-[#008A62] transition-all text-sm font-bold text-slate-800 placeholder:text-slate-300 disabled:bg-slate-50 disabled:text-slate-400"
          />
        )}
      </div>
    </div>
  );
}

function FormSelect({ label, name, value, onChange, icon: Icon, options }: any) {
  return (
    <div className="space-y-2 group">
      <label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 ml-1 group-focus-within:text-[#008A62] transition-colors">{label}</label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#008A62] transition-colors">
          <Icon size={18} />
        </div>
        <select
          name={name}
          value={value}
          onChange={onChange}
          className="w-full pl-12 pr-4 py-4 h-14 bg-slate-50/50 border border-slate-100 rounded-3xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-[#008A62] transition-all text-sm font-bold text-slate-800 appearance-none"
        >
          <option value="" disabled>Select {label}</option>
          {options.map((opt: any) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300 group-focus-within:text-[#008A62]">
          <ChevronRight size={18} className="rotate-90" />
        </div>
      </div>
    </div>
  );
}
