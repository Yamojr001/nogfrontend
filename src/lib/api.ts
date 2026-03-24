import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://nogbackend.vercel.app/';

const api = axios.create({
  baseURL: `${API_BASE}/api`,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach token if present
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — attempt token refresh on 401, then redirect
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry && typeof window !== 'undefined') {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        originalRequest._retry = true;
        try {
          const res = await api.post('/auth/refresh', { refreshToken });
          const { access_token } = res.data;
          localStorage.setItem('access_token', access_token);
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return api(originalRequest);
        } catch {
          // Refresh failed - clear session
        }
      }
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ─── Auth ───────────────────────────────────────────────────────────────────
export async function authLogin(email: string, password: string) {
  const { data } = await api.post('/auth/login', { email, password });
  return data; // { access_token, refresh_token }
}

export async function authGoogleLogin(idToken: string) {
  const { data } = await api.post('/auth/google', { idToken });
  return data;
}

export async function authLogout() {
  const { data } = await api.post('/auth/logout');
  if (typeof window !== 'undefined') {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }
  return data;
}

export async function getCurrentUser() {
  const { data } = await api.get('/auth/me');
  return data; // { userId, email, role, organisationId }
}

export async function refreshAccessToken(refreshToken: string) {
  const { data } = await api.post('/auth/refresh', { refreshToken });
  return data;
}

/** Decode the role from the stored JWT without a network call */
export function getRoleFromToken(): string | null {
  if (typeof window === 'undefined') return null;
  const token = localStorage.getItem('access_token');
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role ?? null;
  } catch {
    return null;
  }
}

// ─── Members ────────────────────────────────────────────────────────────────
export async function registerMember(payload: Record<string, any>) {
  const { data } = await api.post('/auth/register', payload);
  return data;
}

// ─── Organisations ──────────────────────────────────────────────────────────
export async function registerOrganisation(payload: Record<string, any>) {
  const { data } = await api.post('/organisations', payload);
  return data;
}

// ─── Contact ────────────────────────────────────────────────────────────────
export async function submitContact(payload: { name: string; email: string; subject: string; message: string }) {
  const { data } = await api.post('/contact', payload);
  return data;
}

// ─── Newsletter ─────────────────────────────────────────────────────────────
export async function subscribeNewsletter(email: string) {
  const { data } = await api.post('/newsletter/subscribe', { email });
  return data;
}

// ─── News ───────────────────────────────────────────────────────────────────
export async function fetchNews(page = 1, limit = 9) {
  const { data } = await api.get('/news', { params: { page, limit } });
  return data;
}

// ─── Sub-Org Admin ──────────────────────────────────────────────────────────
export async function fetchSubOrgDashboard(branchId: number) {
  const { data } = await api.get(`/sub-org/${branchId}/dashboard`);
  return data;
}

export async function fetchSubOrgMembers(branchId: number) {
  const { data } = await api.get(`/sub-org/${branchId}/members`);
  return data;
}

export async function fetchSubOrgFinances(branchId: number) {
  const { data } = await api.get(`/sub-org/${branchId}/finances`);
  return data;
}

// ─── Partner Admin ──────────────────────────────────────────────────────────
export async function fetchPartnerDashboard(partnerId: number) {
  const { data } = await api.get(`/partner/${partnerId}/dashboard`);
  return data;
}

export async function fetchPartnerMembers(partnerId: number) {
  const { data } = await api.get(`/partner/${partnerId}/members`);
  return data;
}

export async function fetchPartnerFinances(partnerId: number) {
  const { data } = await api.get(`/partner/${partnerId}/finances`);
  return data;
}

export async function fetchPartnerApprovals(partnerId: number) {
  const { data } = await api.get(`/partner/${partnerId}/approvals`);
  return data;
}

// ─── Apex Admin / Dashboard ─────────────────────────────────────────────────
export async function fetchApexDashboardStats() {
  const { data } = await api.get(`/dashboard/stats`);
  return data;
}

export async function fetchApexDashboardCharts() {
  const { data } = await api.get(`/dashboard/charts`);
  return data;
}

export async function fetchApexDashboardAlerts() {
  const { data } = await api.get(`/dashboard/alerts`);
  return data;
}

// ─── Approvals ──────────────────────────────────────────────────────────────
export async function approveRequest(approvalId: number, comments?: string) {
  const { data } = await api.post(`/approvals/${approvalId}/approve`, { comments });
  return data;
}

export async function rejectRequest(approvalId: number, comments?: string) {
  const { data } = await api.post(`/approvals/${approvalId}/reject`, { comments });
  return data;
}

// ─── Support Admin ──────────────────────────────────────────────────────────
export async function fetchAdminTickets() {
  const { data } = await api.get('/admin/support/tickets');
  return data;
}

export async function fetchAdminSupportStats() {
  const { data } = await api.get('/admin/support/stats');
  return data;
}

export async function respondToTicket(ticketId: number, response: string) {
  const { data } = await api.post(`/admin/support/tickets/${ticketId}/respond`, { response });
  return data;
}

export async function assignTicket(ticketId: number) {
  const { data } = await api.post(`/admin/support/tickets/${ticketId}/assign`);
  return data;
}

// ─── Group Admin ────────────────────────────────────────────────────────────
export async function fetchGroupDashboard(groupId: number) {
  const { data } = await api.get(`/group/dashboard/${groupId}`);
  return data;
}

export async function fetchGroupMembers(groupId: number) {
  const { data } = await api.get(`/group/members/${groupId}`);
  return data;
}

export async function fetchGroupFinances(groupId: number) {
  const { data } = await api.get(`/group/finances/${groupId}`);
  return data;
}

export async function fetchGroupLoans(groupId: number) {
  const { data } = await api.get(`/group/loans/${groupId}`);
  return data;
}

export async function syncGroupData(groupId: number, payload: any) {
  const { data } = await api.post(`/group/sync/${groupId}`, payload);
  return data;
}

export async function markMemberAttendance(memberId: number, date: string, status: string) {
  const { data } = await api.post(`/group/members/${memberId}/attendance`, { date, status });
  return data;
}

// ─── Member / End-User Module ───────────────────────────────────────────────
export async function fetchMemberDashboard() {
  const { data } = await api.get('/member/dashboard');
  return data;
}

export async function fetchMemberProfile() {
  const { data } = await api.get('/member/profile');
  return data;
}

export async function fetchMemberSavings() {
  const { data } = await api.get('/member/savings');
  return data;
}

export async function fetchMemberLoans() {
  const { data } = await api.get('/member/loans');
  return data;
}

export async function fetchMemberTickets() {
  const { data } = await api.get('/member/support');
  return data;
}

export async function createSupportTicket(payload: any) {
  const { data } = await api.post('/member/support', payload);
  return data;
}

export async function fetchMemberWallet() {
  const { data } = await api.get('/member/wallet');
  return data;
}

export async function fetchMemberTransactions() {
  const { data } = await api.get('/member/transactions');
  return data;
}

export async function fetchMemberNotifications() {
  const { data } = await api.get('/member/notifications');
  return data;
}

export async function applyLoan(amount: number, interestRate: number, term: number) {
  const { data } = await api.post('/loans/apply', { amount, interestRate, term });
  return data;
}

export async function payLoan(loanId: number, amount: number) {
  // Assuming a generic payment endpoint or specific repayment one
  const { data } = await api.post(`/loans/${loanId}/repay`, { amount });
  return data;
}

// USER TOUR API
export const fetchUserTourStatus = async (type: string = 'onboarding') => {
  const response = await api.get(`/user-tours/status?type=${type}`);
  return response.data;
};

export const completeUserTour = async (type: string = 'onboarding') => {
  const response = await api.post('/user-tours/complete', { type });
  return response.data;
};

export const resetUserTour = async (type: string = 'onboarding') => {
  const response = await api.post('/user-tours/reset', { type });
  return response.data;
};

export const updateUserTourStep = async (step: number, type: string = 'onboarding') => {
  const response = await api.post('/user-tours/step', { step, type });
  return response.data;
};

// ─── Empowerment ──────────────────────────────────────────────────────────
export async function fetchEmpowermentPrograms() {
  const { data } = await api.get('/empowerment/programs');
  return data;
}

export async function applyToProgram(programId: number, payload: any) {
  const { data } = await api.post(`/empowerment/${programId}/apply`, payload);
  return data;
}

export async function fetchProgramApplications() {
  const { data } = await api.get('/empowerment/applications');
  return data;
}

export default api;
