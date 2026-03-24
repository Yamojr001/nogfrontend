'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { authLogin, authGoogleLogin, getRoleFromToken } from '@/lib/api';
import { GoogleLogin } from '@react-oauth/google';
import styles from './page.module.css';

const roles = [
  { value: 'APEX_SUPER_ADMIN', label: 'Apex Admin', redirect: '/admin' },
  { value: 'PARTNER_ORG_ADMIN', label: 'Partner Organisation Admin', redirect: '/admin/partner' },
  { value: 'SUB_ORG_ADMIN', label: 'Sub Organisation Admin', redirect: '/sub-org' },
  { value: 'GROUP_ADMIN', label: 'Group Admin', redirect: '/group' },
  { value: 'MEMBER', label: 'Individual Member', redirect: '/member' },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await authLogin(email, password);
      if (typeof window !== 'undefined') {
        localStorage.setItem('access_token', data.access_token);
        if (data.refresh_token) localStorage.setItem('refresh_token', data.refresh_token);
        
        // Sync to cookie for Next.js Middleware
        document.cookie = `access_token=${data.access_token}; path=/; max-age=86400; SameSite=Lax`;
        
        // Decode role from JWT payload immediately to store
        try {
          const payload = JSON.parse(atob(data.access_token.split('.')[1]));
          if (payload.role) {
            localStorage.setItem('user_role', payload.role);
            document.cookie = `user_role=${payload.role}; path=/; max-age=86400; SameSite=Lax`;
          }
          if (payload.organisationId) {
            localStorage.setItem('organisation_id', payload.organisationId.toString());
          }
        } catch (e) { console.error('Token decoding failed', e); }
      }
      // Decode role from JWT payload
      const role = getRoleFromToken();
      const roleMap: Record<string, string> = {
        super_admin: '/dashboard',
        finance_admin: '/dashboard',
        auditor: '/dashboard',
        partner_admin: '/partner',
        partner_officer: '/partner',
        sub_org_admin: '/sub-org',
        sub_org_officer: '/sub-org',
        group_admin: '/group',
        group_treasurer: '/group',
        group_secretary: '/group',
        member: '/member',
        support_agent: '/member',
      };
      router.push(roleMap[role || ''] || '/dashboard');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setLoading(true);
    setError('');
    try {
      const data = await authGoogleLogin(credentialResponse.credential);
      if (typeof window !== 'undefined') {
        localStorage.setItem('access_token', data.access_token);
        if (data.refresh_token) localStorage.setItem('refresh_token', data.refresh_token);
        document.cookie = `access_token=${data.access_token}; path=/; max-age=86400; SameSite=Lax`;
        
        try {
          const payload = JSON.parse(atob(data.access_token.split('.')[1]));
          if (payload.role) {
            localStorage.setItem('user_role', payload.role);
            document.cookie = `user_role=${payload.role}; path=/; max-age=86400; SameSite=Lax`;
          }
          if (payload.organisationId) {
            localStorage.setItem('organisation_id', payload.organisationId.toString());
          }
        } catch (e) { console.error('Token decoding failed', e); }
      }
      const role = getRoleFromToken();
      const roleMap: Record<string, string> = {
        super_admin: '/dashboard',
        finance_admin: '/dashboard',
        auditor: '/dashboard',
        partner_admin: '/partner',
        partner_officer: '/partner',
        sub_org_admin: '/sub-org',
        sub_org_officer: '/sub-org',
        group_admin: '/group',
        group_treasurer: '/group',
        group_secretary: '/group',
        member: '/member',
        support_agent: '/member',
      };
      router.push(roleMap[role || ''] || '/dashboard');
    } catch (err: any) {
      setError('Google Sign-In failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logoBox}>
          <img src="/logo.png" alt="NOGALSS Logo" width={64} height={64} style={{ objectFit: 'contain' }} />
          <div>
            <div className={styles.logoTitle}>NOGALSS</div>
            <div className={styles.logoSub}>Member Portal</div>
          </div>
        </div>

        <h1 className={styles.title}>Welcome Back</h1>
        <p className={styles.subtitle}>Sign in to your cooperative account</p>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input type="email" className="form-control" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPw ? 'text' : 'password'}
                className="form-control"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ paddingRight: '48px' }}
              />
              <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>
                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <div style={{ background: '#fff5f5', border: '1px solid #fed7d7', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px', color: '#c53030', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}

          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginBottom: '16px' }} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'} <LogIn size={16} />
          </button>

          {process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0', color: '#94a3b8' }}>
                <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }}></div>
                <span style={{ padding: '0 12px', fontSize: '0.8rem', fontWeight: 600 }}>OR</span>
                <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }}></div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => setError('Google Sign-In failed')}
                  useOneTap
                  theme="outline"
                  shape="pill"
                  text="continue_with"
                />
              </div>
            </>
          )}
        </form>

        <div className={styles.roleInfo}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '10px', fontWeight: '600', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Portal supports:</p>
          <div className={styles.rolesList}>
            {roles.map((r) => (
              <span key={r.value} style={{ fontSize: '0.75rem', background: 'var(--primary-soft)', color: 'var(--primary)', padding: '4px 10px', borderRadius: '99px', fontWeight: '600' }}>{r.label}</span>
            ))}
          </div>
        </div>

        <div className={styles.links}>
          <p>Not a member yet? <Link href="/register/member" style={{ color: 'var(--primary)', fontWeight: '600' }}>Register here</Link></p>
          <p>Register organisation? <Link href="/register/partner" style={{ color: 'var(--secondary)', fontWeight: '600' }}>Click here</Link></p>
        </div>
      </div>
    </div>
  );
}
