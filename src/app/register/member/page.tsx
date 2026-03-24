'use client';
import { useState } from 'react';
import Link from 'next/link';
import { CheckCircle, ChevronRight, ChevronLeft, User, Phone, Building2, ShieldCheck, Lock } from 'lucide-react';
import { registerMember } from '@/lib/api';
import styles from './page.module.css';

const steps = [
  { id: 1, title: 'Personal', icon: User },
  { id: 2, title: 'Contact', icon: Phone },
  { id: 3, title: 'Affiliation', icon: Building2 },
  { id: 4, title: 'Banking', icon: ShieldCheck },
  { id: 5, title: 'Next of Kin', icon: User },
  { id: 6, title: 'Savings', icon: CheckCircle },
  { id: 7, title: 'Security', icon: Lock },
];

export default function MemberRegistrationPage() {
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    firstName: '', lastName: '', dateOfBirth: '', gender: '', maritalStatus: '',
    nationality: 'Nigerian', stateOfOrigin: '', occupation: '', educationalQualification: '',
    email: '', phone: '', address: '', state: '', lga: '',
    membershipType: 'individual', organisationId: '', subOrgId: '',
    extOrgName: '', extPosition: '', extStateChapter: '',
    bankName: '', accountName: '', accountNumber: '', bvn: '', nin: '',
    nokName: '', nokRelationship: '', nokPhone: '', nokAddress: '',
    savingsFrequency: 'monthly', proposedSavingsAmount: '', empowermentInterest: '',
    password: '', confirmPassword: '',
  });

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

    setLoading(true);
    setError('');
    try {
      const payload = {
        ...form,
        role: 'MEMBER',
        organisationCode: form.membershipType === 'organisation' ? form.organisationId : 'APEX-0001',
        organisationId: form.membershipType === 'individual' ? 1 : undefined,
        proposedSavingsAmount: Number(form.proposedSavingsAmount) || 0,
      };
      await registerMember(payload);
      setDone(true);
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      setError(Array.isArray(msg) ? msg.join(', ') : (msg || 'Registration failed. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className={styles.page}>
        <div className={styles.successCard}>
          <div className={styles.successIcon}><CheckCircle size={48} color="var(--primary)" /></div>
          <h2 className={styles.successTitle}>Registration Submitted!</h2>
          <p className={styles.successText}>Your membership application has been received and is currently in the multi-level approval queue. You'll receive an email notification once verified.</p>
          <Link href="/login" className="btn btn-primary">Login to Explorer</Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.logoBox}><img src="/logo.png" alt="NOGALSS Logo" width={56} height={56} style={{ objectFit: 'contain' }} /><div className={styles.logoTitle}>Member Onboarding</div></div>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>Apex Digital Cooperative Portal</p>
        </div>

        <div className={styles.stepsBar}>
          {steps.map((s) => (
            <div key={s.id} className={`${styles.stepItem} ${step === s.id ? styles.stepActive : ''} ${step > s.id ? styles.stepDone : ''}`}>
              <div className={styles.stepCircle}>{step > s.id ? <CheckCircle size={14} /> : <s.icon size={14} />}</div>
              <span className={styles.stepLabel}>{s.title}</span>
            </div>
          ))}
        </div>

        <div className={styles.formCard}>
          {error && <div className={styles.errorBox}>{error}</div>}

          {step === 1 && (
            <div className="space-y-4">
              <h3 className={styles.formTitle}>Personal Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group"><label className="form-label">First Name *</label><input className="form-control" value={form.firstName} onChange={e => update('firstName', e.target.value)} required /></div>
                <div className="form-group"><label className="form-label">Last Name *</label><input className="form-control" value={form.lastName} onChange={e => update('lastName', e.target.value)} required /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group"><label className="form-label">Date of Birth</label><input type="date" className="form-control" value={form.dateOfBirth} onChange={e => update('dateOfBirth', e.target.value)} /></div>
                <div className="form-group"><label className="form-label">Gender</label><select className="form-control" value={form.gender} onChange={e => update('gender', e.target.value)}><option value="">Select</option><option>Male</option><option>Female</option></select></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group"><label className="form-label">Marital Status</label><select className="form-control" value={form.maritalStatus} onChange={e => update('maritalStatus', e.target.value)}><option value="">Select</option><option>Single</option><option>Married</option><option>Divorced</option><option>Widowed</option></select></div>
                <div className="form-group"><label className="form-label">Occupation</label><input className="form-control" value={form.occupation} onChange={e => update('occupation', e.target.value)} /></div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className={styles.formTitle}>Contact & Residency</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group"><label className="form-label">Email Address *</label><input className="form-control" value={form.email} onChange={e => update('email', e.target.value)} required /></div>
                <div className="form-group"><label className="form-label">Phone Number *</label><input className="form-control" value={form.phone} onChange={e => update('phone', e.target.value)} required /></div>
              </div>
              <div className="form-group"><label className="form-label">Residential Address</label><textarea className="form-control" value={form.address} onChange={e => update('address', e.target.value)} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group"><label className="form-label">State of Residence</label><select className="form-control" value={form.state} onChange={e => update('state', e.target.value)}>{statesList.map(s => <option key={s}>{s}</option>)}</select></div>
                <div className="form-group"><label className="form-label">LGA</label><input className="form-control" value={form.lga} onChange={e => update('lga', e.target.value)} /></div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className={styles.formTitle}>Affiliation & Organization</h3>
              <div className="form-group"><label className="form-label">Membership Route</label><select className="form-control" value={form.membershipType} onChange={e => update('membershipType', e.target.value)}><option value="individual">Direct Member (APEX)</option><option value="organisation">Via Partner Organization</option></select></div>
              {form.membershipType === 'organisation' && (
                <div className="form-group"><label className="form-label">Org Code / Ref</label><input className="form-control" value={form.organisationId} onChange={e => update('organisationId', e.target.value)} placeholder="e.g ORG-0001" /></div>
              )}
              <div className="border-t pt-4 mt-4">
                <label className="text-sm font-bold text-gray-700">External Affiliation (Optional)</label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div className="form-group"><label className="form-label">External Org Name</label><input className="form-control" value={form.extOrgName} onChange={e => update('extOrgName', e.target.value)} /></div>
                  <div className="form-group"><label className="form-label">Position held</label><input className="form-control" value={form.extPosition} onChange={e => update('extPosition', e.target.value)} /></div>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h3 className={styles.formTitle}>Banking & KYC</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group"><label className="form-label">Bank Name</label><input className="form-control" value={form.bankName} onChange={e => update('bankName', e.target.value)} /></div>
                <div className="form-group"><label className="form-label">Account Number</label><input className="form-control" value={form.accountNumber} onChange={e => update('accountNumber', e.target.value)} /></div>
              </div>
              <div className="form-group"><label className="form-label">Account Name</label><input className="form-control" value={form.accountName} onChange={e => update('accountName', e.target.value)} /></div>
              <div className="grid grid-cols-2 gap-4 border-t pt-4">
                <div className="form-group"><label className="form-label">BVN (Encrypted)</label><input className="form-control" value={form.bvn} onChange={e => update('bvn', e.target.value)} maxLength={11} /></div>
                <div className="form-group"><label className="form-label">NIN (Encrypted)</label><input className="form-control" value={form.nin} onChange={e => update('nin', e.target.value)} maxLength={11} /></div>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4">
              <h3 className={styles.formTitle}>Next of Kin</h3>
              <div className="form-group"><label className="form-label">FullName</label><input className="form-control" value={form.nokName} onChange={e => update('nokName', e.target.value)} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group"><label className="form-label">Relationship</label><input className="form-control" value={form.nokRelationship} onChange={e => update('nokRelationship', e.target.value)} /></div>
                <div className="form-group"><label className="form-label">Phone</label><input className="form-control" value={form.nokPhone} onChange={e => update('nokPhone', e.target.value)} /></div>
              </div>
              <div className="form-group"><label className="form-label">Address</label><textarea className="form-control" value={form.nokAddress} onChange={e => update('nokAddress', e.target.value)} /></div>
            </div>
          )}

          {step === 6 && (
            <div className="space-y-4">
              <h3 className={styles.formTitle}>Savings & Preferences</h3>
              <div className="form-group"><label className="form-label">Savings Frequency</label><select className="form-control" value={form.savingsFrequency} onChange={e => update('savingsFrequency', e.target.value)}><option value="daily">Daily</option><option value="weekly">Weekly</option><option value="monthly">Monthly</option></select></div>
              <div className="form-group"><label className="form-label">Proposed Savings Amount (NGN)</label><input type="number" className="form-control" value={form.proposedSavingsAmount} onChange={e => update('proposedSavingsAmount', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Empowerment Interest</label><select className="form-control" value={form.empowermentInterest} onChange={e => update('empowermentInterest', e.target.value)}><option value="">Select Interest</option><option>SME Grant</option><option>Asset Finance</option><option>Education Loan</option><option>Agricultural Input</option></select></div>
            </div>
          )}

          {step === 7 && (
            <div className="space-y-4">
              <h3 className={styles.formTitle}>Security</h3>
              <div className="form-group"><label className="form-label">Password *</label><input type="password" className="form-control" value={form.password} onChange={e => update('password', e.target.value)} required /></div>
              <div className="form-group"><label className="form-label">Confirm Password *</label><input type="password" className="form-control" value={form.confirmPassword} onChange={e => update('confirmPassword', e.target.value)} required /></div>
            </div>
          )}

          <div className={styles.navBtns}>
            {step > 1 && <button className="btn btn-outline-dark" onClick={() => setStep(s => s - 1)}><ChevronLeft size={16} /> Back</button>}
            <div className="flex-1" />
            {step < 7 ? (
              <button className="btn btn-primary" onClick={() => setStep(s => s + 1)}>Next <ChevronRight size={16} /></button>
            ) : (
              <button className="btn btn-secondary" onClick={handleSubmit} disabled={loading}>
                {loading ? 'Processing...' : 'Complete Onboarding'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
