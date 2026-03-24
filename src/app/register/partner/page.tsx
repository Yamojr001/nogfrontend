'use client';
import { useState } from 'react';
import Link from 'next/link';
import { CheckCircle, ChevronRight, ChevronLeft, Building2, Users, FileText, Phone, Send } from 'lucide-react';
import { registerOrganisation } from '@/lib/api';

const steps = [
  { id: 1, title: 'Org Details', icon: Building2 },
  { id: 2, title: 'Leadership', icon: Users },
  { id: 3, title: 'Legal Docs', icon: FileText },
  { id: 4, title: 'Contact', icon: Phone },
  { id: 5, title: 'Submit', icon: Send },
];

export default function PartnerRegistrationPage() {
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    orgName: '', orgType: '', sector: '', regNumber: '', yearFounded: '', memberCount: '',
    presidentName: '', presidentPhone: '', secretaryName: '', secretaryEmail: '',
    cacCertificate: '', taxClearance: '', constitutionUrl: '',
    officeAddress: '', state: '', phone: '', email: '', website: '',
    declaration: false,
  });

  const update = (field: string, value: any) => setForm(prev => ({ ...prev, [field]: value }));

  const statesList = ['Abia','Adamawa','Akwa Ibom','Anambra','Bauchi','Bayelsa','Benue','Borno','Cross River','Delta','Ebonyi','Edo','Ekiti','Enugu','FCT','Gombe','Imo','Jigawa','Kaduna','Kano','Katsina','Kebbi','Kogi','Kwara','Lagos','Nasarawa','Niger','Ogun','Ondo','Osun','Oyo','Plateau','Rivers','Sokoto','Taraba','Yobe','Zamfara'];

  const validateForm = () => {
    if (!/^[A-Za-z\s]+$/.test(form.orgName)) return 'Organisation name must contain only letters and spaces';
    if (!/^[A-Za-z\s]+$/.test(form.presidentName)) return 'President name must contain only letters';
    
    // Block temporary/fake emails
    const tempDomains = ['tempmail.com', '10minutemail.com', 'guerrillamail.com', 'yopmail.com'];
    const emailDomain = form.email.split('@')[1];
    if (emailDomain && tempDomains.includes(emailDomain)) return 'Please use a valid/permanent organisation email address';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Invalid official email address';

    // Phone validation
    if (!/^\+?[0-9]{10,15}$/.test(form.presidentPhone)) return 'President Phone number must be numeric (10-15 digits)';
    if (!/^\+?[0-9]{10,15}$/.test(form.phone)) return 'Office Phone number must be numeric (10-15 digits)';
    
    return null;
  };

  const handleSubmit = async () => {
    if (!form.declaration) { setError('You must accept the declaration to proceed.'); return; }
    
    const errorMsg = validateForm();
    if (errorMsg) {
      setError(errorMsg);
      // Auto-navigate to correct step
      if (errorMsg.includes('Organisation') || errorMsg.includes('Registration')) setStep(1);
      else if (errorMsg.includes('President')) setStep(2);
      else if (errorMsg.includes('Office') || errorMsg.includes('email')) setStep(4);
      return;
    }

    setLoading(true);
    setError('');
    try {
      await registerOrganisation({ ...form, name: form.orgName, type: 'PARTNER', status: 'PENDING' });
      setDone(true);
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      setError(Array.isArray(msg) ? msg.join(', ') : (msg || 'Submission failed. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #061c10, #0D4A2F)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
        <div style={{ background: 'white', borderRadius: '24px', padding: '56px 48px', textAlign: 'center', maxWidth: '500px', boxShadow: '0 32px 80px rgba(0,0,0,0.25)' }}>
          <div style={{ width: '80px', height: '80px', background: 'var(--secondary-soft)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <CheckCircle size={48} color="var(--secondary)" />
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--primary-dark)', marginBottom: '12px' }}>Application Submitted!</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '32px' }}>Your organisation registration has been submitted and is now <strong>Pending Approval</strong>. A NOGALSS administrator will review your application within 5 business days.</p>
          <Link href="/" className="btn btn-primary">Return to Homepage</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #061c10, #0D4A2F)', padding: '80px 20px 40px' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
            <img src="/logo.png" alt="NOGALSS Logo" width={64} height={64} style={{ objectFit: 'contain' }} />
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'white', marginBottom: '8px' }}>Partner Organisation Registration</h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>Register your cooperative organisation under the NOGALSS umbrella</p>
        </div>

        {/* Steps */}
        <div style={{ display: 'flex', justifyContent: 'space-between', background: 'rgba(255,255,255,0.1)', borderRadius: '16px', padding: '12px 20px', marginBottom: '20px', gap: '8px', overflowX: 'auto' }}>
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', opacity: step === s.id ? 1 : step > s.id ? 0.75 : 0.5, flexShrink: 0, transition: 'opacity 0.3s' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: step === s.id ? 'var(--secondary)' : step > s.id ? 'var(--primary)' : 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                  {step > s.id ? <CheckCircle size={16} /> : <Icon size={16} />}
                </div>
                <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.7)', fontWeight: '600', whiteSpace: 'nowrap' }}>{s.title}</span>
              </div>
            );
          })}
        </div>

        <div style={{ background: 'white', borderRadius: '20px', padding: '40px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
          {error && <div style={{ background: '#fff5f5', border: '1px solid #fed7d7', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px', color: '#c53030', fontSize: '0.875rem' }}>{error}</div>}

          {step === 1 && (
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--primary-dark)', marginBottom: '24px' }}>Organisation Details</h3>
              <div className="form-group"><label className="form-label">Organisation Name *</label><input className="form-control" value={form.orgName} onChange={e => update('orgName', e.target.value)} placeholder="Full registered name" required /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="form-group"><label className="form-label">Organisation Type *</label><select className="form-control" value={form.orgType} onChange={e => update('orgType', e.target.value)} required><option value="">Select type</option><option>Cooperative Society</option><option>Trade Union</option><option>Occupational Group</option><option>Professional Association</option></select></div>
                <div className="form-group"><label className="form-label">Primary Sector</label><input className="form-control" value={form.sector} onChange={e => update('sector', e.target.value)} placeholder="e.g Agriculture, Artisans" /></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
                <div className="form-group"><label className="form-label">CAC Reg. Number</label><input className="form-control" value={form.regNumber} onChange={e => update('regNumber', e.target.value)} placeholder="RC000000" /></div>
                <div className="form-group"><label className="form-label">Year Founded</label><input type="number" className="form-control" value={form.yearFounded} onChange={e => update('yearFounded', e.target.value)} placeholder="2010" /></div>
                <div className="form-group"><label className="form-label">Member Count</label><input type="number" className="form-control" value={form.memberCount} onChange={e => update('memberCount', e.target.value)} placeholder="500" /></div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--primary-dark)', marginBottom: '24px' }}>Leadership Information</h3>
              <div className="form-group"><label className="form-label">President / Chairman Name *</label><input className="form-control" value={form.presidentName} onChange={e => update('presidentName', e.target.value)} placeholder="Full name" required /></div>
              <div className="form-group"><label className="form-label">President Phone *</label><input className="form-control" value={form.presidentPhone} onChange={e => update('presidentPhone', e.target.value)} placeholder="+234 800 000 0000" required /></div>
              <div className="form-group"><label className="form-label">Secretary Name</label><input className="form-control" value={form.secretaryName} onChange={e => update('secretaryName', e.target.value)} placeholder="Full name" /></div>
              <div className="form-group"><label className="form-label">Secretary Email</label><input type="email" className="form-control" value={form.secretaryEmail} onChange={e => update('secretaryEmail', e.target.value)} placeholder="secretary@org.com" /></div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--primary-dark)', marginBottom: '24px' }}>Legal Documents</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '24px' }}>Provide document references or upload IDs. Physical documents will be verified at a NOGALSS office.</p>
              <div className="form-group"><label className="form-label">CAC Certificate Number</label><input className="form-control" value={form.cacCertificate} onChange={e => update('cacCertificate', e.target.value)} placeholder="Certificate number" /></div>
              <div className="form-group"><label className="form-label">Tax Clearance Reference</label><input className="form-control" value={form.taxClearance} onChange={e => update('taxClearance', e.target.value)} placeholder="TIN or reference number" /></div>
              <div className="form-group"><label className="form-label">Organisation Constitution (URL or Reference)</label><input className="form-control" value={form.constitutionUrl} onChange={e => update('constitutionUrl', e.target.value)} placeholder="Link to document or file ref" /></div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--primary-dark)', marginBottom: '24px' }}>Contact Information</h3>
              <div className="form-group"><label className="form-label">Office Address *</label><textarea className="form-control" value={form.officeAddress} onChange={e => update('officeAddress', e.target.value)} placeholder="Full office address" style={{ height: '90px' }} required /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="form-group"><label className="form-label">State *</label><select className="form-control" value={form.state} onChange={e => update('state', e.target.value)} required><option value="">Select State</option>{statesList.map(s => <option key={s}>{s}</option>)}</select></div>
                <div className="form-group"><label className="form-label">Office Phone *</label><input className="form-control" value={form.phone} onChange={e => update('phone', e.target.value)} placeholder="+234 800 000 0000" required /></div>
              </div>
              <div className="form-group"><label className="form-label">Official Email *</label><input type="email" className="form-control" value={form.email} onChange={e => update('email', e.target.value)} placeholder="info@yourorg.com" required /></div>
              <div className="form-group"><label className="form-label">Website (Optional)</label><input className="form-control" value={form.website} onChange={e => update('website', e.target.value)} placeholder="https://yourorg.com" /></div>
            </div>
          )}

          {step === 5 && (
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--primary-dark)', marginBottom: '24px' }}>Review & Submit</h3>
              <div style={{ background: 'var(--gray-50)', borderRadius: '12px', padding: '20px', marginBottom: '24px', border: '1px solid var(--border)' }}>
                <div style={{ display: 'grid', gap: '10px', fontSize: '0.875rem' }}>
                  {[
                    ['Organisation', form.orgName || '—'],
                    ['Type', form.orgType || '—'],
                    ['State', form.state || '—'],
                    ['President', form.presidentName || '—'],
                    ['Email', form.email || '—'],
                  ].map(([k, v]) => (
                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                      <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{k}</span>
                      <span>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
              <label style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', cursor: 'pointer', marginBottom: '16px' }}>
                <input type="checkbox" checked={form.declaration} onChange={e => update('declaration', e.target.checked)} style={{ marginTop: '3px' }} />
                <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                  I declare that the information provided is accurate and that this organisation is duly registered and authorized to apply for NOGALSS partnership. I accept the <Link href="/terms" style={{ color: 'var(--primary)' }}>Terms & Conditions</Link>.
                </span>
              </label>
            </div>
          )}

          <div style={{ display: 'flex', gap: '12px', marginTop: '32px', paddingTop: '24px', borderTop: '1px solid var(--border)' }}>
            {step > 1 && <button className="btn btn-outline-dark" onClick={() => setStep(s => s - 1)}><ChevronLeft size={16} /> Back</button>}
            <div style={{ flex: 1 }} />
            {step < 5 ? (
              <button className="btn btn-primary" onClick={() => setStep(s => s + 1)}>Next <ChevronRight size={16} /></button>
            ) : (
              <button className="btn btn-secondary" onClick={handleSubmit} disabled={loading}>
                {loading ? 'Submitting...' : 'Submit for Approval'} <Send size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
