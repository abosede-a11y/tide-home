import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import PortalLayout from './components/layout/PortalLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/portal/DashboardPage';
import { ResidentsPage, PaymentsPage, AppointmentsPage } from './pages/portal/ResidentsPaymentsAppointments';
import { ProfilePage, UsersPage, PermissionsPage, BlogAdminPage, FaqAdminPage, ChatPage } from './pages/portal/PortalPages';
import LandingPage from './pages/public/LandingPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="font-serif text-2xl text-tide-deep">Tide<span className="text-tide-light">Home</span></div></div>;
  if (!user) return <Navigate to="/login" replace/>;
  return <>{children}</>;
}

function AccessRoute({ feature, children }: { feature: string; children: React.ReactNode }) {
  const { canAccess } = useAuth();
  if (!canAccess(feature)) return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="text-5xl mb-4 opacity-25">🔒</div>
      <h2 className="font-serif text-2xl text-tide-deep mb-2">Access restricted</h2>
      <p className="text-tide-muted text-sm max-w-xs">You don't have permission to view this section. Contact your administrator.</p>
    </div>
  );
  return <>{children}</>;
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public website */}
        <Route path="/" element={<LandingPage/>}/>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/forgot-password" element={<ForgotPasswordPage/>}/>

        {/* Portal (protected) */}
        <Route path="/portal" element={<ProtectedRoute><PortalLayout/></ProtectedRoute>}>
          <Route index element={<Navigate to="/portal/dashboard" replace/>}/>
          <Route path="dashboard" element={<AccessRoute feature="dashboard"><DashboardPage/></AccessRoute>}/>
          <Route path="residents" element={<AccessRoute feature="residents"><ResidentsPage/></AccessRoute>}/>
          <Route path="medications" element={<AccessRoute feature="medications"><MedicationsPage/></AccessRoute>}/>
          <Route path="appointments" element={<AccessRoute feature="appointments"><AppointmentsPage/></AccessRoute>}/>
          <Route path="payments" element={<AccessRoute feature="payments"><PaymentsPage/></AccessRoute>}/>
          <Route path="profile" element={<AccessRoute feature="profile"><ProfilePage/></AccessRoute>}/>
          <Route path="chat" element={<AccessRoute feature="livechat"><ChatPage/></AccessRoute>}/>
          <Route path="blog" element={<AccessRoute feature="blog"><BlogAdminPage/></AccessRoute>}/>
          <Route path="faq-admin" element={<AccessRoute feature="faqadmin"><FaqAdminPage/></AccessRoute>}/>
          <Route path="users" element={<AccessRoute feature="users"><UsersPage/></AccessRoute>}/>
          <Route path="permissions" element={<AccessRoute feature="permissions"><PermissionsPage/></AccessRoute>}/>
        </Route>

        <Route path="*" element={<Navigate to="/" replace/>}/>
      </Routes>
    </AuthProvider>
  );
}

// Simple forgot password page inline
function ForgotPasswordPage() {
  const [email, setEmail] = React.useState('');
  const [sent, setSent] = React.useState(false);
  const { authApi: _ } = require('./services/api');
  const api = require('./services/api');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try { await api.authApi.forgotPassword(email); setSent(true); } catch { setSent(true); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-tide-sand px-4">
      <div className="w-full max-w-sm">
        <div className="font-serif text-2xl text-tide-deep text-center mb-2">TideHome</div>
        {sent ? (
          <div className="card text-center">
            <div className="text-3xl mb-3">📧</div>
            <h2 className="font-serif text-xl text-tide-deep mb-2">Check your email</h2>
            <p className="text-tide-muted text-sm mb-4">If that email exists in our system, a reset link has been sent.</p>
            <a href="/login" className="btn btn-primary w-full justify-center">Back to login</a>
          </div>
        ) : (
          <div className="card">
            <h2 className="font-serif text-xl text-tide-deep mb-1">Reset password</h2>
            <p className="text-tide-muted text-sm mb-5">Enter your email address and we'll send you a reset link.</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className="form-label">Email address</label><input type="email" className="form-input" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@tidehome.co.uk"/></div>
              <button type="submit" className="btn btn-primary w-full justify-center">Send reset link</button>
            </form>
            <a href="/login" className="block text-center text-xs text-tide-muted mt-4 hover:text-tide-deep">← Back to login</a>
          </div>
        )}
      </div>
    </div>
  );
}

// Medications page (inline for brevity)
function MedicationsPage() {
  const { useQuery, useMutation, useQueryClient } = require('@tanstack/react-query');
  const { medicationsApi } = require('./services/api');
  const { useAuth } = require('./context/AuthContext');
  const toast = require('react-hot-toast').default;
  const { user } = useAuth();
  const qc = useQueryClient();
  const isStaffPlus = ['superadmin','admin','staff'].includes(user?.role || '');

  const { data: meds = [], isLoading } = useQuery({ queryKey:['medications'], queryFn: medicationsApi.getAll });

  const logDose = useMutation({
    mutationFn: ({ id }: any) => medicationsApi.logDose(id, { givenByName: `${user.firstName} ${user.lastName}` }),
    onSuccess: () => { qc.invalidateQueries({queryKey:['medications']}); toast.success('Dose logged successfully'); },
  });

  const statusClass: Record<string,string> = { on_track:'pill-green', missed:'pill-red', review_needed:'pill-amber' };
  const statusLabel: Record<string,string> = { on_track:'On track', missed:'Missed dose', review_needed:'Review needed' };

  if (isLoading) return <div className="text-tide-muted text-sm">Loading medications…</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl text-tide-deep">Medications</h1>
        {isStaffPlus && <button className="btn btn-primary" onClick={() => toast('Add medication modal')}><span className="mr-1">+</span>Add record</button>}
      </div>
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[{l:'On track',s:'on_track',cls:'text-tide-success'},{l:'Review needed',s:'review_needed',cls:'text-tide-warn'},{l:'Missed doses',s:'missed',cls:'text-tide-danger'}].map(x => (
          <div key={x.s} className="card-sm text-center">
            <div className="text-[11px] text-tide-muted uppercase tracking-wider mb-1">{x.l}</div>
            <div className={`font-serif text-2xl ${x.cls}`}>{meds.filter((m:any) => m.status === x.s).length}</div>
          </div>
        ))}
      </div>
      <div className="table-wrap">
        <table className="w-full">
          <thead><tr>
            <th className="th">Resident</th><th className="th">Medication</th><th className="th">Dosage</th>
            <th className="th">Frequency</th><th className="th">Last given</th><th className="th">Given by</th>
            <th className="th">Status</th>{isStaffPlus && <th className="th">Action</th>}
          </tr></thead>
          <tbody>
            {meds.map((m: any) => (
              <tr key={m.id} className="hover:bg-tide-sand/20 transition-colors">
                <td className="td font-medium">{m.residentName}</td>
                <td className="td">{m.medicationName}</td>
                <td className="td">{m.dosage}</td>
                <td className="td">{m.frequency}</td>
                <td className="td text-xs text-tide-muted">{m.lastGiven ? new Date(m.lastGiven).toLocaleString('en-GB', {day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'}) : '—'}</td>
                <td className="td text-xs">{m.givenByName || '—'}</td>
                <td className="td"><span className={`pill ${statusClass[m.status] || 'pill-gray'}`}>{statusLabel[m.status] || m.status}</span></td>
                {isStaffPlus && <td className="td"><button className="btn btn-sm btn-secondary" onClick={() => logDose.mutate({ id:m.id })}>Log dose</button></td>}
              </tr>
            ))}
            {meds.length === 0 && <tr><td colSpan={8} className="td text-center text-tide-muted py-8">No medication records yet</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
