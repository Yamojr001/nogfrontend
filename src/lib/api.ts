import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://nogbackend.vercel.app';

const api = axios.create({
  baseURL: `${API_BASE}/api`,
  timeout: 30000,
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
        } catch (refreshErr) {
          // Refresh failed - clear session
          console.error('Refresh token expired or invalid', refreshErr);
          localStorage.clear();
          window.location.href = '/login';
        }
      } else {
        // No refresh token - just clear and redirect if it's not a public page
        // But for registration, we don't want to redirect to login if they are just visiting public routes
        // For now, let's just NOT loop.
        localStorage.removeItem('access_token');
      }
    }
    return Promise.reject(error);
  }
);

// ─── Auth ───────────────────────────────────────────────────────────────────
export async function authLogin(identifier: string, password: string) {
  const { data } = await api.post('/auth/login', { identifier, password });
  return data; // { access_token, refresh_token, hasPaidRegistrationFee, message, ... }
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

export async function changePassword(currentPassword: string, newPassword: string) {
  const { data } = await api.post('/auth/change-password', { currentPassword, newPassword });
  return data;
}

export async function getCurrentUser() {
  const { data } = await api.get('/auth/me');
  return data; // { userId, email, role, organisationId }
}

export async function fetchUserProfile() {
  const { data } = await api.get('/auth/profile');
  return data; // Full User + Member record
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
export const registerMember = (data: any) => api.post('/auth/register', data).then(res => res.data);
export const resolveOrgCode = (code: string) => api.get(`/auth/resolve-code/${code}`).then(res => res.data);

// ─── Organisations & Hierarchy ────────────────────────────────────────────────
export async function registerOrganisation(payload: Record<string, any>) {
  const { data } = await api.post('/organisations', payload);
  return data;
}

export async function createSubOrganisation(payload: Record<string, any>) {
  const { data } = await api.post('/organisations/sub-org', payload);
  return data;
}

export async function fetchHierarchyOrganisations() {
  const { data } = await api.get('/auth/hierarchy/organisations');
  return data;
}

export async function fetchHierarchySubOrgs(orgId: number) {
  const { data } = await api.get(`/auth/hierarchy/organisations/${orgId}/sub-orgs`);
  return data;
}

export async function fetchHierarchyGroups(subOrgId: number) {
  const { data } = await api.get(`/auth/hierarchy/sub-orgs/${subOrgId}/groups`);
  return data;
}

export async function fetchBanks() {
  const { data } = await api.get('/banks');
  return data.data;
}

export async function initiateRegistrationPayment() {
  const { data } = await api.post('/auth/register/initialize-payment');
  return data;
}

export async function verifyRegistrationPayment(reference: string) {
  const { data } = await api.post('/auth/register/verify-payment', { reference });
  return data;
}

export async function initExternalRegistrationPayment(email: string) {
  const { data } = await api.post('/auth/register/init-payment', { email });
  return data;
}

export async function completeRegistration(data: any, reference: string) {
  const response = await api.post('/auth/register/complete', { data, reference });
  return response.data;
}

export async function buyToken(data: { name: string, email: string, phone: string, redirectUrl: string }) {
  const response = await api.post('/tokens/buy', data);
  return response.data;
}

export async function completeTokenPurchase(paymentReference: string) {
  const response = await api.get(`/tokens/complete?paymentReference=${paymentReference}`);
  return response.data;
}

export async function verifyToken(code: string) {
  const response = await api.get(`/tokens/verify/${code}`);
  return response.data;
}

export async function updateTokenDraft(code: string, draftData: any, draftStep: number) {
  const response = await api.patch(`/tokens/${code}/draft`, { draftData, draftStep });
  return response.data;
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

export async function fetchAllLoans() {
  const { data } = await api.get('/loans');
  return data;
}

export async function fetchPartnerLoans() {
  return fetchAllLoans();
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

export async function fetchMemberTransactions(params?: {
  startDate?: string;
  endDate?: string;
  search?: string;
  status?: string;
}) {
  const { data } = await api.get('/member/transactions', { params });
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

// ─── Bank Accounts ────────────────────────────────────────────────────────
export async function fetchParallexBanks() {
  const { data } = await api.get('/parallex/virtual-accounts/banks');
  return data;
}

export async function provisionVirtualAccount(payload: any) {
  const { data } = await api.post('/parallex/virtual-accounts/create', payload);
  return data;
}

export async function addBankAccount(payload: {
  accountName: string;
  bankName: string;
  accountNumber: string;
  bankCode?: string;
}) {
  const { data } = await api.post('/bank-accounts', payload);
  return data;
}

// ─── Empowerment ──────────────────────────────────────────────────────────
export async function fetchEmpowermentPrograms() {
  const { data } = await api.get('/empowerment/programs');
  return data;
}

export type PublicDirectoryItem = {
  id: string;
  name: string;
  code: string;
  kind: 'Organisation' | 'Sub-Organisation' | 'Unit';
  hierarchy: string;
  parentName?: string;
};

export async function fetchPublicDirectory() {
  const organisations = await fetchHierarchyOrganisations();
  const directory: PublicDirectoryItem[] = [];

  for (const org of organisations || []) {
    const orgName = String(org?.name || 'Unnamed Organisation');
    directory.push({
      id: `org-${org.id}`,
      name: orgName,
      code: String(org?.code || 'NO-CODE'),
      kind: 'Organisation',
      hierarchy: orgName,
    });

    let subOrgs: any[] = [];
    try {
      subOrgs = await fetchHierarchySubOrgs(org.id);
    } catch {
      subOrgs = [];
    }

    for (const subOrg of subOrgs || []) {
      const subOrgName = String(subOrg?.name || 'Unnamed Sub-Organisation');
      directory.push({
        id: `sub-org-${subOrg.id}`,
        name: subOrgName,
        code: String(subOrg?.code || 'NO-CODE'),
        kind: 'Sub-Organisation',
        hierarchy: `${orgName} → ${subOrgName}`,
        parentName: orgName,
      });

      let units: any[] = [];
      try {
        units = await fetchHierarchyGroups(subOrg.id);
      } catch {
        units = [];
      }

      for (const unit of units || []) {
        directory.push({
          id: `unit-${unit.id}`,
          name: String(unit?.name || 'Unnamed Unit'),
          code: String(unit?.code || 'NO-CODE'),
          kind: 'Unit',
          hierarchy: `${orgName} → ${subOrgName} → ${String(unit?.name || 'Unnamed Unit')}`,
          parentName: subOrgName,
        });
      }
    }
  }

  return directory.sort((a, b) => a.name.localeCompare(b.name));
}

export async function applyToProgram(programId: number, payload: any) {
  const { data } = await api.post(`/empowerment/${programId}/apply`, payload);
  return data;
}

export async function fetchProgramApplications() {
  const { data } = await api.get('/empowerment/applications');
  return data;
}

export const api_client = api;

export const api_service = {
  authLogin,
  authGoogleLogin,
  authLogout,
  getCurrentUser,
  fetchUserProfile,
  refreshAccessToken,
  getRoleFromToken,
  registerMember,
  registerUser: registerMember, // Added alias for backward compatibility
  resolveOrgCode,
  registerOrganisation,
  fetchHierarchyOrganisations,
  fetchHierarchySubOrgs,
  fetchHierarchyGroups,
  fetchBanks,
  initiateRegistrationPayment,
  verifyRegistrationPayment,
  initExternalRegistrationPayment,
  completeRegistration,
  buyToken,
  completeTokenPurchase,
  verifyToken,
  submitContact,
  subscribeNewsletter,
  fetchNews,
  fetchSubOrgDashboard,
  fetchSubOrgMembers,
  fetchSubOrgFinances,
  fetchPartnerDashboard,
  fetchPartnerMembers,
  fetchPartnerFinances,
  fetchPartnerApprovals,
  fetchApexDashboardStats,
  fetchApexDashboardCharts,
  fetchApexDashboardAlerts,
  approveRequest,
  rejectRequest,
  fetchAdminTickets,
  fetchAdminSupportStats,
  respondToTicket,
  assignTicket,
  fetchGroupDashboard,
  fetchGroupMembers,
  fetchGroupFinances,
  fetchGroupLoans,
  syncGroupData,
  markMemberAttendance,
  fetchMemberDashboard,
  fetchMemberProfile,
  fetchMemberSavings,
  fetchMemberLoans,
  fetchMemberTickets,
  createSupportTicket,
  fetchMemberWallet,
  fetchMemberTransactions,
  fetchMemberNotifications,
  applyLoan,
  payLoan,
  fetchPublicDirectory,
  fetchUserTourStatus,
  completeUserTour,
  resetUserTour,
  updateUserTourStep,
  fetchEmpowermentPrograms,
  applyToProgram,
  fetchProgramApplications,
  updateTokenDraft,
};

// For backward compatibility and the specific "export api" error
export const api_object = {
  ...api_service,
  registerUser: registerMember,
  verifyToken,
  buyToken,
  completeTokenPurchase,
  updateTokenDraft,
};

export { api_object as api, registerMember as registerUser };

export default api;
