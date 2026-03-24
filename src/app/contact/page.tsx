'use client';
import { useState } from 'react';
import { MapPin, Phone, Mail, Send, Globe } from 'lucide-react';
import { submitContact } from '@/lib/api';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await submitContact(form);
      setStatus('done');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  return (
    <>
      <section style={{ background: 'var(--primary-dark)', padding: '160px 0 100px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div className="container reveal">
          <span className="section-tag" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>Contact Us</span>
          <h1 className="display-2" style={{ color: 'white', textAlign: 'center', marginBottom: '24px' }}>Get in Touch</h1>
          <p className="body-lg" style={{ color: 'rgba(255,255,255,0.7)', margin: '0 auto', maxWidth: '800px' }}>Our team is ready to assist you. Reach out through any of the channels below.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.5fr)', gap: '80px', alignItems: 'start' }}>
            {/* Contact Info */}
            <div className="reveal-left">
              <h2 className="display-2" style={{ marginBottom: '16px', color: 'var(--primary-dark)', fontSize: '2.5rem' }}>Contact Information</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '48px', lineHeight: '1.8', fontSize: '1.1rem' }}>Visit our national headquarters in Abuja or reach out through our official channels below.</p>
              {[
                { icon: MapPin, label: 'National Headquarter', value: '4th Floor, Jibril Aminu House, National Commission for Colleges of Education, Plot 829, Ralph Shodeinde Street, Central Business District, Abuja FCT' },
                { icon: Phone, label: 'Phone', value: '0806 765 9229, 0907 807 7777' },
                { icon: Mail, label: 'Email', value: 'info@nogalssapexcoop.org \n nogalssapexcooperative@gmail.com' },
                { icon: Globe, label: 'Website', value: 'www.nogalssapexcoop.org' },
              ].map((c, i) => {
                const Icon = c.icon;
                return (
                  <div key={c.label} className="reveal" style={{ transitionDelay: `${i * 0.1}s`, display: 'flex', gap: '20px', alignItems: 'flex-start', marginBottom: '32px' }}>
                    <div style={{ width: '56px', height: '56px', background: 'var(--primary-soft)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid var(--primary-light)' }}>
                      <Icon size={24} color="var(--primary)" />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--primary)', marginBottom: '4px' }}>{c.label}</div>
                      <div style={{ fontSize: '1.05rem', color: 'var(--text-primary)', fontWeight: '600', whiteSpace: 'pre-line', lineHeight: '1.5' }}>{c.value}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Contact Form */}
            <div className="reveal-right" style={{ background: 'var(--white)', borderRadius: 'var(--radius-xl)', padding: '64px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-xl)' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--primary-dark)', marginBottom: '12px', fontWeight: '800' }}>Send Us a Message</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '40px' }}>Fill out the form and we'll respond as soon as possible.</p>
              {status === 'done' ? (
                <div style={{ textAlign: 'center', padding: '60px 24px' }}>
                  <div style={{ width: '80px', height: '80px', background: 'var(--primary-soft)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', border: '1px solid var(--primary-light)' }}>
                    <Send size={32} color="var(--primary)" />
                  </div>
                  <h4 style={{ fontSize: '1.5rem', color: 'var(--primary)', marginBottom: '12px', fontWeight: '700' }}>Message Sent!</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Thank you for reaching out. We'll respond shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    <div className="form-group">
                      <label className="form-label" style={{ fontWeight: '700', color: 'var(--primary-dark)' }}>Full Name</label>
                      <input name="name" type="text" className="form-control" placeholder="Your name" value={form.name} onChange={handleChange} required style={{ borderRadius: '12px', padding: '14px 18px', border: '1.5px solid var(--border)' }} />
                    </div>
                    <div className="form-group">
                      <label className="form-label" style={{ fontWeight: '700', color: 'var(--primary-dark)' }}>Email Address</label>
                      <input name="email" type="email" className="form-control" placeholder="your@email.com" value={form.email} onChange={handleChange} required style={{ borderRadius: '12px', padding: '14px 18px', border: '1.5px solid var(--border)' }} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: '700', color: 'var(--primary-dark)' }}>Subject</label>
                    <input name="subject" type="text" className="form-control" placeholder="How can we help?" value={form.subject} onChange={handleChange} required style={{ borderRadius: '12px', padding: '14px 18px', border: '1.5px solid var(--border)' }} />
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: '700', color: 'var(--primary-dark)' }}>Message</label>
                    <textarea name="message" className="form-control" placeholder="Write your message here..." value={form.message} onChange={handleChange} required style={{ borderRadius: '12px', padding: '16px 18px', border: '1.5px solid var(--border)', minHeight: '160px' }} />
                  </div>
                  {status === 'error' && <p style={{ color: '#e53e3e', fontSize: '0.9rem', marginBottom: '8px', fontWeight: '600' }}>Something went wrong. Please try again.</p>}
                  <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center', marginTop: '12px' }} disabled={status === 'loading'}>
                    {status === 'loading' ? 'Sending...' : 'Send Message'} <Send size={18} />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
