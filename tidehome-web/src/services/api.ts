import axios from 'axios';

// In production (Vercel), VITE_API_URL points to Render.
// In development, empty string uses the Vite proxy (/api -> localhost:3001)
const baseURL = ((typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_API_URL) || '') + '/api';

const api = axios.create({
  baseURL,
  withCredentials: true,
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('tidehome_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (r) => r,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('tidehome_token');
      localStorage.removeItem('tidehome_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ── AUTH ──────────────────────────────────────────────
export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }).then(r => r.data),
  registerAdmin: (data: { firstName: string; lastName: string; email: string; username: string; password: string; registrationKey: string }) =>
  api.post('/auth/register-admin', data).then(r => r.data),
  me: () => api.get('/auth/me').then(r => r.data),
  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', { email }).then(r => r.data),
  resetPassword: (token: string, newPassword: string) =>
    api.post('/auth/reset-password', { token, newPassword }).then(r => r.data),
  checkUsername: (username: string) =>
    api.get(`/auth/check-username/${username}`).then(r => r.data),
};

// ── USERS ─────────────────────────────────────────────
export const usersApi = {
  getAll: () => api.get('/users').then(r => r.data),
  getMe: () => api.get('/users/me').then(r => r.data),
  create: (data: any) => api.post('/users', data).then(r => r.data),
  updateMe: (data: any) => api.patch('/users/me', data).then(r => r.data),
  changePassword: (data: any) => api.patch('/users/me/password', data).then(r => r.data),
  adminUpdate: (id: string, data: any) => api.patch(`/users/${id}/admin-update`, data).then(r => r.data),
  resendCredentials: (id: string) => api.post(`/users/${id}/resend-credentials`).then(r => r.data),
  deactivate: (id: string) => api.delete(`/users/${id}`).then(r => r.data),
};

// ── RESIDENTS ─────────────────────────────────────────
export const residentsApi = {
  getAll: () => api.get('/residents').then(r => r.data),
  getMyResidents: () => api.get('/residents/my-residents').then(r => r.data),
  getById: (id: string) => api.get(`/residents/${id}`).then(r => r.data),
  create: (data: any) => api.post('/residents', data).then(r => r.data),
  update: (id: string, data: any) => api.patch(`/residents/${id}`, data).then(r => r.data),
  deactivate: (id: string) => api.delete(`/residents/${id}`).then(r => r.data),
};

// ── MEDICATIONS ───────────────────────────────────────
export const medicationsApi = {
  getAll: () => api.get('/medications').then(r => r.data),
  getByResident: (id: string) => api.get(`/medications/resident/${id}`).then(r => r.data),
  create: (data: any) => api.post('/medications', data).then(r => r.data),
  logDose: (id: string, data: any) => api.post(`/medications/${id}/log-dose`, data).then(r => r.data),
};

// ── APPOINTMENTS ──────────────────────────────────────
export const appointmentsApi = {
  getAll: () => api.get('/appointments').then(r => r.data),
  getByResident: (id: string) => api.get(`/appointments/resident/${id}`).then(r => r.data),
  create: (data: any) => api.post('/appointments', data).then(r => r.data),
  update: (id: string, data: any) => api.patch(`/appointments/${id}`, data).then(r => r.data),
  remove: (id: string) => api.delete(`/appointments/${id}`).then(r => r.data),
};

// ── PAYMENTS ──────────────────────────────────────────
export const paymentsApi = {
  getAll: () => api.get('/payments').then(r => r.data),
  getSummary: () => api.get('/payments/summary').then(r => r.data),
  getByResident: (id: string) => api.get(`/payments/resident/${id}`).then(r => r.data),
  getReceipt: (id: string) => api.get(`/payments/${id}/receipt`).then(r => r.data),
  create: (data: any) => api.post('/payments', data).then(r => r.data),
  update: (id: string, data: any) => api.patch(`/payments/${id}`, data).then(r => r.data),
  sendReceipt: (id: string, email: string) => api.post(`/payments/${id}/send-receipt`, { email }).then(r => r.data),
};

// ── BLOG ──────────────────────────────────────────────
export const blogApi = {
  getPublic: () => api.get('/blog/public').then(r => r.data),
  getAll: () => api.get('/blog').then(r => r.data),
  create: (data: any) => api.post('/blog', data).then(r => r.data),
  update: (id: string, data: any) => api.patch(`/blog/${id}`, data).then(r => r.data),
  remove: (id: string) => api.delete(`/blog/${id}`).then(r => r.data),
};

// ── FAQ ───────────────────────────────────────────────
export const faqApi = {
  getPublic: () => api.get('/faq/public').then(r => r.data),
  getAll: () => api.get('/faq').then(r => r.data),
  create: (data: any) => api.post('/faq', data).then(r => r.data),
  update: (id: string, data: any) => api.patch(`/faq/${id}`, data).then(r => r.data),
  remove: (id: string) => api.delete(`/faq/${id}`).then(r => r.data),
};

// ── PERMISSIONS ───────────────────────────────────────
export const permissionsApi = {
  getAll: () => api.get('/permissions').then(r => r.data),
  getMyAccess: () => api.get('/permissions/my-access').then(r => r.data),
  update: (data: any) => api.patch('/permissions', data).then(r => r.data),
};

// ── ContactForm ───────────────────────────────────────
export const contactApi = {
  submit: (data: any) => api.post('/contact', data).then(r => r.data),
  getAll: () => api.get('/contact').then(r => r.data),
  getUnreadCount: () => api.get('/contact/unread-count').then(r => r.data),
  markRead: (id: string) => api.patch(`/contact/${id}/read`).then(r => r.data),
  markReplied: (id: string) => api.patch(`/contact/${id}/replied`).then(r => r.data),
  delete: (id: string) => api.delete(`/contact/${id}`).then(r => r.data),
};




export default api;
