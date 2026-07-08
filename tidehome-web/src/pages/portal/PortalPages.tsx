import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import { usersApi, permissionsApi, blogApi, faqApi, contactApi } from '../../services/api';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Plus, Edit, Trash2, Send, Phone, Mail } from 'lucide-react';
import { io } from 'socket.io-client';
import ConfirmModal from '../../components/ui/ConfirmModal';

// ─── PROFILE PAGE ─────────────────────────────────────────────────────────────
export function ProfilePage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const isAdminPlus = ['superadmin','admin'].includes(user?.role || '');

  // Fetch full profile from server so we get username, photoUrl etc
  const { data: profile } = useQuery({
    queryKey: ['my-profile'],
    queryFn: usersApi.getMe,
  });

  const [adminForm, setAdminForm] = useState<any>({
    firstName: '',
    lastName: '',
    photoUrl: '',
    socialSecurityNumber: '',
    username: '',
  });
  const [contactForm, setContactForm] = useState({ email: '', phone: '', address: '' });
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [showPws, setShowPws] = useState({ cur: false, nw: false, con: false });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Populate form once profile loads
  React.useEffect(() => {
    if (profile) {
      setAdminForm({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        photoUrl: profile.photoUrl || '',
        socialSecurityNumber: profile.socialSecurityNumber || '',
        username: profile.username || '',
      });
      setContactForm({
        email: profile.email || '',
        phone: profile.phone || '',
        address: profile.address || '',
      });
      if (profile.photoUrl) setPhotoPreview(profile.photoUrl);
    }
  }, [profile]);

  const adminUpdate = useMutation({
    mutationFn: (data: any) => usersApi.adminUpdate(user!.id, data),
    onSuccess: () => {
      toast.success('Profile details saved');
      qc.invalidateQueries({ queryKey: ['my-profile'] });
      qc.invalidateQueries({ queryKey: ['me'] });
    },
    onError: (e: any) => toast.error(e?.response?.data?.message || 'Failed to save'),
  });

  const updateMe = useMutation({
    mutationFn: usersApi.updateMe,
    onSuccess: () => toast.success('Contact details saved'),
    onError: (e: any) => toast.error(e?.response?.data?.message || 'Failed to save'),
  });

  const changePw = useMutation({
    mutationFn: usersApi.changePassword,
    onSuccess: () => { toast.success('Password changed successfully'); setPwForm({ currentPassword: '', newPassword: '', confirm: '' }); },
    onError: (e: any) => toast.error(e?.response?.data?.message || 'Failed to change password'),
  });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error('Photo must be under 5MB'); return; }
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setPhotoPreview(dataUrl);
      setAdminForm(f => ({ ...f, photoUrl: dataUrl }));
    };
    reader.readAsDataURL(file);
  };

  const handleChangePw = () => {
    if (pwForm.newPassword !== pwForm.confirm) { toast.error('Passwords do not match'); return; }
    if (pwForm.newPassword.length < 8) { toast.error('Password must be at least 8 characters'); return; }
    changePw.mutate({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
  };

  const initials = user ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase() : 'U';

  return (
    <div>
      <h1 className="font-serif text-2xl text-tide-deep mb-6">My Profile</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Identity / Admin-editable card */}
        <div className="card space-y-4">
          <div className="flex items-center gap-4 pb-4 border-b border-tide-deep/10">
            {/* Avatar with upload */}
            <div className="relative flex-shrink-0">
              <div className="w-16 h-16 rounded-full bg-tide-light flex items-center justify-center font-serif text-2xl text-white overflow-hidden">
                {photoPreview
                  ? <img src={photoPreview} alt="Profile" className="w-full h-full object-cover"/>
                  : initials}
              </div>
              {isAdminPlus && (
                <>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-1 -right-1 w-6 h-6 bg-tide-deep rounded-full flex items-center justify-center text-white hover:bg-tide-mid transition-colors"
                    title="Upload photo"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                    </svg>
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange}/>
                </>
              )}
            </div>
            <div>
              <div className="font-serif text-xl text-tide-deep">{user?.firstName} {user?.lastName}</div>
              <span className="pill pill-blue text-[10px]">{user?.role}</span>
            </div>
          </div>

          <div>
            <label className="form-label">First name {!isAdminPlus && <span className="text-tide-muted font-normal">(admin only)</span>}</label>
            <input
              className={`form-input ${!isAdminPlus ? 'bg-tide-sand cursor-not-allowed' : ''}`}
              value={isAdminPlus ? adminForm.firstName : user?.firstName || ''}
              readOnly={!isAdminPlus}
              onChange={e => setAdminForm({ ...adminForm, firstName: e.target.value })}
            />
            {!isAdminPlus && <p className="text-[11px] text-tide-muted mt-1">🔒 Only an administrator can change your name</p>}
          </div>

          <div>
            <label className="form-label">Last name {!isAdminPlus && <span className="text-tide-muted font-normal">(admin only)</span>}</label>
            <input
              className={`form-input ${!isAdminPlus ? 'bg-tide-sand cursor-not-allowed' : ''}`}
              value={isAdminPlus ? adminForm.lastName : user?.lastName || ''}
              readOnly={!isAdminPlus}
              onChange={e => setAdminForm({ ...adminForm, lastName: e.target.value })}
            />
            {!isAdminPlus && <p className="text-[11px] text-tide-muted mt-1">🔒 Only an administrator can change your name</p>}
          </div>

          <div>
            <label className="form-label">
              Username <span className="text-tide-muted font-normal">(display name)</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-tide-muted text-sm">@</span>
              <input
                className={`form-input pl-7 ${!isAdminPlus ? 'bg-tide-sand cursor-not-allowed' : ''}`}
                value={(adminForm as any).username ?? ''}
                readOnly={!isAdminPlus}
                onChange={e => setAdminForm({ ...adminForm, ...(adminForm as any), username: e.target.value.replace(/\s/g, '').toLowerCase() })}
                placeholder="your username"
              />
            </div>
            {!isAdminPlus && <p className="text-[11px] text-tide-muted mt-1">🔒 Only an administrator can change your username</p>}
          </div>

          <div>
            <label className="form-label">
              Profile photo {!isAdminPlus && <span className="text-tide-muted font-normal">(admin only)</span>}
            </label>
            {isAdminPlus ? (
              <>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="form-input cursor-pointer flex items-center gap-2 text-tide-muted hover:text-tide-deep hover:border-tide-mid transition-all"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                  <span className="text-sm">{photoFile ? photoFile.name : 'Click to upload photo'}</span>
                </div>
                <div className="mt-2 bg-tide-sand rounded-lg px-3 py-2 space-y-0.5">
                  <p className="text-[11px] text-tide-muted">📁 <strong>Accepted formats:</strong> JPG, PNG, GIF, WebP</p>
                  <p className="text-[11px] text-tide-muted">📏 <strong>Maximum file size:</strong> 5MB</p>
                  <p className="text-[11px] text-tide-muted">🖼️ <strong>Recommended:</strong> Square image, at least 200×200px</p>
                  {photoFile && (
                    <p className="text-[11px] text-tide-success font-medium mt-1">
                      ✓ {photoFile.name} selected ({(photoFile.size / 1024 / 1024).toFixed(2)}MB)
                    </p>
                  )}
                </div>
              </>
            ) : (
              <input className="form-input bg-tide-sand cursor-not-allowed" value={user?.photoUrl || 'No photo uploaded'} readOnly/>
            )}
            {!isAdminPlus && <p className="text-[11px] text-tide-muted mt-1">🔒 Only an administrator can change your photo</p>}
          </div>

          <div>
            <label className="form-label">Social security / ID number {!isAdminPlus && <span className="text-tide-muted font-normal">(admin only)</span>}</label>
            <input
              className={`form-input ${!isAdminPlus ? 'bg-tide-sand cursor-not-allowed' : ''}`}
              value={isAdminPlus ? adminForm.socialSecurityNumber : '••••••••'}
              readOnly={!isAdminPlus}
              onChange={e => setAdminForm({ ...adminForm, socialSecurityNumber: e.target.value })}
              placeholder="Enter ID / SSN"
            />
            {!isAdminPlus && <p className="text-[11px] text-tide-muted mt-1">🔒 Only an administrator can view or change this</p>}
          </div>

          {isAdminPlus && (
            <button
              className="btn btn-primary"
              onClick={() => adminUpdate.mutate(adminForm)}
              disabled={adminUpdate.isPending}
            >
              {adminUpdate.isPending ? 'Saving…' : 'Save profile details'}
            </button>
          )}
        </div>

        <div className="space-y-6">
          {/* Contact details */}
          <div className="card space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-tide-deep/10">
              <h3 className="font-serif text-lg text-tide-deep">Contact details</h3>
              <span className="text-[11px] text-tide-success font-medium">✓ You can edit these</span>
            </div>
            <div>
              <label className="form-label">Email address</label>
              <input type="email" className="form-input" value={contactForm.email} onChange={e => setContactForm({ ...contactForm, email: e.target.value })}/>
            </div>
            <div>
              <label className="form-label">Phone number</label>
              <input type="tel" className="form-input" value={contactForm.phone} onChange={e => setContactForm({ ...contactForm, phone: e.target.value })} placeholder="+44 7700 ..."/>
            </div>
            <div>
              <label className="form-label">Home address</label>
              <textarea className="form-input" rows={2} value={contactForm.address} onChange={e => setContactForm({ ...contactForm, address: e.target.value })} placeholder="Your address…"/>
            </div>
            <button className="btn btn-primary" onClick={() => updateMe.mutate(contactForm)} disabled={updateMe.isPending}>
              {updateMe.isPending ? 'Saving…' : 'Save changes'}
            </button>
          </div>

          {/* Change password */}
          <div className="card space-y-4">
            <h3 className="font-serif text-lg text-tide-deep pb-2 border-b border-tide-deep/10">Change password</h3>
            {[
              { label: 'Current password', key: 'currentPassword', show: showPws.cur, toggle: () => setShowPws(s => ({ ...s, cur: !s.cur })) },
              { label: 'New password', key: 'newPassword', show: showPws.nw, toggle: () => setShowPws(s => ({ ...s, nw: !s.nw })) },
              { label: 'Confirm new password', key: 'confirm', show: showPws.con, toggle: () => setShowPws(s => ({ ...s, con: !s.con })) },
            ].map(({ label, key, show, toggle }) => (
              <div key={key}>
                <label className="form-label">{label}</label>
                <div className="relative">
                  <input
                    type={show ? 'text' : 'password'}
                    className="form-input pr-10"
                    value={(pwForm as any)[key]}
                    onChange={e => setPwForm({ ...pwForm, [key]: e.target.value })}
                    placeholder="••••••••"
                  />
                  <button type="button" onClick={toggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-tide-muted hover:text-tide-deep">
                    {show ? <EyeOff size={15}/> : <Eye size={15}/>}
                  </button>
                </div>
              </div>
            ))}
            <button className="btn btn-primary" onClick={handleChangePw} disabled={changePw.isPending}>
              {changePw.isPending ? 'Updating…' : 'Update password'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── USERS PAGE ───────────────────────────────────────────────────────────────
export function UsersPage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', role: 'guardian', linkedResidentId: '' });
  const [confirmDeactivate, setConfirmDeactivate] = useState<{ open: boolean; user: any | null }>({ open: false, user: null });
  const { data: users = [], isLoading } = useQuery({ queryKey: ['users'], queryFn: usersApi.getAll });

  const createMutation = useMutation({
    mutationFn: usersApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] });
      setShowModal(false);
      setForm({ firstName: '', lastName: '', email: '', role: 'guardian', linkedResidentId: '' });
      toast.success('Account created & credentials sent via email');
    },
    onError: (e: any) => toast.error(e?.response?.data?.message || 'Failed to create account'),
  });

  const resendMutation = useMutation({
    mutationFn: usersApi.resendCredentials,
    onSuccess: (d: any) => toast.success(d.message),
    onError: () => toast.error('Failed to resend credentials'),
  });

  const deactivateMutation = useMutation({
    mutationFn: usersApi.deactivate,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['users'] }); toast.success('Account deactivated'); },
    onError: () => toast.error('Failed to deactivate'),
  });

  const roleBadge: Record<string, string> = {
    superadmin: 'pill-amber', admin: 'pill-blue', staff: 'pill-green', guardian: 'pill-gray',
  };

  if (isLoading) return <div className="text-tide-muted text-sm">Loading users…</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl text-tide-deep">User Accounts</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}><Plus size={15} />Create account</button>
      </div>

      <div className="table-wrap">
        <table className="w-full">
          <thead>
            <tr>
              <th className="th">Name</th>
              <th className="th">Email</th>
              <th className="th">Role</th>
              <th className="th">Status</th>
              <th className="th">Created</th>
              <th className="th">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u: any) => (
              <tr key={u.id} className="hover:bg-tide-sand/20 transition-colors">
                <td className="td font-medium">{u.firstName} {u.lastName}</td>
                <td className="td text-tide-muted">{u.email}</td>
                <td className="td"><span className={`pill ${roleBadge[u.role] || 'pill-gray'}`}>{u.role}</span></td>
                <td className="td"><span className={`pill ${u.isActive ? 'pill-green' : 'pill-red'}`}>{u.isActive ? 'Active' : 'Inactive'}</span></td>
                <td className="td text-xs text-tide-muted">{new Date(u.createdAt).toLocaleDateString('en-GB')}</td>
                <td className="td">
                  <div className="flex gap-1.5 flex-wrap">
                    <button className="btn btn-sm btn-secondary" onClick={() => resendMutation.mutate(u.id)}>
                      Resend credentials
                    </button>
                    {user?.role === 'superadmin' && (
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => setConfirmDeactivate({ open: true, user: u })}
                      >
                        <Trash2 size={12}/>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="px-6 py-4 border-b border-tide-deep/10 flex items-center justify-between">
              <h3 className="font-serif text-xl text-tide-deep">Create new account</h3>
              <button onClick={() => setShowModal(false)} className="text-tide-muted text-xl">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">First name</label>
                  <input className="form-input" value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} placeholder="Ada" />
                </div>
                <div>
                  <label className="form-label">Last name</label>
                  <input className="form-input" value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} placeholder="Okafor" />
                </div>
              </div>
              <div>
                <label className="form-label">Email address (credentials sent here)</label>
                <input type="email" className="form-input" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="user@example.com" />
              </div>
              <div>
                <label className="form-label">Role</label>
                <select className="form-input" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                  <option value="guardian">Guardian</option>
                  <option value="staff">Care Staff</option>
                  <option value="admin">Administrator</option>
                  {user?.role === 'superadmin' && <option value="superadmin">Super Admin</option>}
                </select>
              </div>
              <div className="bg-tide-foam rounded-lg p-3 text-xs text-tide-mid">
                A temporary password will be generated and sent to the email address above. The user can change it after first login.
              </div>
            </div>
            <div className="px-6 py-4 border-t border-tide-deep/10 flex justify-end gap-3">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button
                className="btn btn-primary"
                onClick={() => createMutation.mutate(form)}
                disabled={createMutation.isPending || !form.firstName || !form.email}
              >
                {createMutation.isPending ? 'Creating…' : 'Create & send credentials'}
              </button>
            </div>
          </div>
        </div>
      )}
      <ConfirmModal
        open={confirmDeactivate.open}
        title="Deactivate account"
        message={`Are you sure you want to deactivate ${confirmDeactivate.user?.firstName} ${confirmDeactivate.user?.lastName}'s account? They will no longer be able to log in.`}
        confirmLabel="Yes, deactivate"
        variant="danger"
        loading={deactivateMutation.isPending}
        onConfirm={() => {
          deactivateMutation.mutate(confirmDeactivate.user?.id, {
            onSuccess: () => setConfirmDeactivate({ open: false, user: null }),
          });
        }}
        onCancel={() => setConfirmDeactivate({ open: false, user: null })}
      />
    </div>
    
  );
}

// ─── PERMISSIONS PAGE ─────────────────────────────────────────────────────────
export function PermissionsPage() {
  const { data: permissions = [], isLoading, refetch } = useQuery({ queryKey: ['permissions'], queryFn: permissionsApi.getAll });

  const updateMutation = useMutation({
    mutationFn: permissionsApi.update,
    onSuccess: () => { refetch(); toast.success('Permission updated'); },
    onError: () => toast.error('Failed to update permission'),
  });

  if (isLoading) return <div className="text-tide-muted text-sm">Loading permissions…</div>;

  return (
    <div>
      <h1 className="font-serif text-2xl text-tide-deep mb-2">Permissions & Feature Access</h1>
      <div className="card-sm bg-amber-50 border-amber-200 mb-6 flex gap-3">
        <span className="text-lg">👑</span>
        <div>
          <div className="text-sm font-medium text-amber-800">Super Admin controls</div>
          <div className="text-xs text-amber-700 mt-0.5">Toggle feature access for each role. Super Admin always has full access. Changes apply immediately.</div>
        </div>
      </div>
      <div className="table-wrap">
        <table className="w-full">
          <thead>
            <tr>
              <th className="th">Feature</th>
              <th className="th text-center">Admin</th>
              <th className="th text-center">Staff</th>
              <th className="th text-center">Guardian</th>
            </tr>
          </thead>
          <tbody>
            {permissions.map((p: any) => (
              <tr key={p.id} className="hover:bg-tide-sand/20 transition-colors">
                <td className="td font-medium">{p.featureLabel}</td>
                {(['adminAccess', 'staffAccess', 'guardianAccess'] as const).map(field => (
                  <td key={field} className="td text-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={p[field]}
                        onChange={e => updateMutation.mutate({
                          featureKey: p.featureKey,
                          adminAccess: p.adminAccess,
                          staffAccess: p.staffAccess,
                          guardianAccess: p.guardianAccess,
                          [field]: e.target.checked,
                        })}
                      />
                      <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-tide-mid" />
                    </label>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── BLOG PAGE ────────────────────────────────────────────────────────────────
export function BlogAdminPage() {
  const qc = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editPost, setEditPost] = useState<any>(null);
  const [form, setForm] = useState({ title: '', content: '', excerpt: '', isPublished: true });
  
  const { data: posts = [], isLoading } = useQuery({ queryKey: ['blog-admin'], queryFn: blogApi.getAll });

  const createMutation = useMutation({
    mutationFn: blogApi.create,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['blog-admin'] }); setShowModal(false); setForm({ title:'', content:'', excerpt:'', isPublished:true }); toast.success('Post published'); },
    onError: () => toast.error('Failed to save post'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: any) => blogApi.update(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['blog-admin'] }); setShowModal(false); setEditPost(null); toast.success('Post updated'); },
  });

  const removeMutation = useMutation({
    mutationFn: blogApi.remove,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['blog-admin'] }); toast.success('Post deleted'); },
  });

  const openEdit = (post: any) => {
    setEditPost(post);
    setForm({ title: post.title, content: post.content, excerpt: post.excerpt || '', isPublished: post.isPublished });
    setShowModal(true);
  };

  const handleSave = () => {
    if (editPost) updateMutation.mutate({ id: editPost.id, data: form });
    else createMutation.mutate(form);
  };

  if (isLoading) return <div className="text-tide-muted text-sm">Loading posts…</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl text-tide-deep">Blog Manager</h1>
        <button className="btn btn-primary" onClick={() => { setEditPost(null); setForm({ title:'', content:'', excerpt:'', isPublished:true }); setShowModal(true); }}>
          <Plus size={15} />New post
        </button>
      </div>
      <div className="space-y-3">
        {posts.map((p: any) => (
          <div key={p.id} className="card-sm flex items-start gap-4">
            <div className="flex-1">
              <div className="font-medium text-tide-deep">{p.title}</div>
              <div className="text-xs text-tide-muted mt-0.5">{p.authorName} · {new Date(p.createdAt).toLocaleDateString('en-GB')}</div>
              {p.excerpt && <div className="text-sm text-tide-muted mt-1">{p.excerpt}</div>}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className={`pill ${p.isPublished ? 'pill-green' : 'pill-amber'}`}>{p.isPublished ? 'Published' : 'Draft'}</span>
              <button className="btn btn-sm btn-secondary" onClick={() => openEdit(p)}><Edit size={12} />Edit</button>
              <button className="btn btn-sm btn-danger" onClick={() => { if (confirm('Delete this post?')) removeMutation.mutate(p.id); }}><Trash2 size={12} /></button>
            </div>
          </div>
        ))}
        {posts.length === 0 && <div className="card text-center text-tide-muted py-12">No posts yet. Create your first post!</div>}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="px-6 py-4 border-b border-tide-deep/10 flex items-center justify-between">
              <h3 className="font-serif text-xl text-tide-deep">{editPost ? 'Edit post' : 'New blog post'}</h3>
              <button onClick={() => setShowModal(false)} className="text-tide-muted text-xl">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div><label className="form-label">Title</label><input className="form-input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Post title" /></div>
              <div><label className="form-label">Excerpt</label><input className="form-input" value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} placeholder="Short summary…" /></div>
              <div><label className="form-label">Content</label><textarea className="form-input" rows={6} value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} placeholder="Write your post here…" /></div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="pub" checked={form.isPublished} onChange={e => setForm({ ...form, isPublished: e.target.checked })} className="w-4 h-4" />
                <label htmlFor="pub" className="text-sm text-tide-deep">Publish immediately</label>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-tide-deep/10 flex justify-end gap-3">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={createMutation.isPending || updateMutation.isPending}>
                {createMutation.isPending || updateMutation.isPending ? 'Saving…' : editPost ? 'Update post' : 'Publish post'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── FAQ ADMIN PAGE ────────────────────────────────────────────────────────────
export function FaqAdminPage() {
  const qc = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editFaq, setEditFaq] = useState<any>(null);
  const [form, setForm] = useState({ question: '', answer: '', isPublished: true });

  const { data: faqs = [], isLoading } = useQuery({ queryKey: ['faq-admin'], queryFn: faqApi.getAll });

  const createMutation = useMutation({
    mutationFn: faqApi.create,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['faq-admin'] }); setShowModal(false); setForm({ question:'', answer:'', isPublished:true }); toast.success('FAQ added'); },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: any) => faqApi.update(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['faq-admin'] }); setShowModal(false); setEditFaq(null); toast.success('FAQ updated'); },
  });

  const removeMutation = useMutation({
    mutationFn: faqApi.remove,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['faq-admin'] }); toast.success('FAQ removed'); },
  });

  const openEdit = (f: any) => {
    setEditFaq(f);
    setForm({ question: f.question, answer: f.answer, isPublished: f.isPublished });
    setShowModal(true);
  };

  const handleSave = () => {
    if (editFaq) updateMutation.mutate({ id: editFaq.id, data: form });
    else createMutation.mutate(form);
  };

  if (isLoading) return <div className="text-tide-muted text-sm">Loading FAQs…</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl text-tide-deep">FAQ Manager</h1>
        <button className="btn btn-primary" onClick={() => { setEditFaq(null); setForm({ question:'', answer:'', isPublished:true }); setShowModal(true); }}><Plus size={15} />Add FAQ</button>
      </div>
      <div className="space-y-2">
        {faqs.map((f: any) => (
          <div key={f.id} className="card-sm flex gap-4">
            <div className="flex-1">
              <div className="font-medium text-sm text-tide-deep">{f.question}</div>
              <div className="text-xs text-tide-muted mt-1 line-clamp-2">{f.answer}</div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className={`pill ${f.isPublished ? 'pill-green' : 'pill-amber'}`}>{f.isPublished ? 'Published' : 'Draft'}</span>
              <button className="btn btn-sm btn-secondary" onClick={() => openEdit(f)}><Edit size={12} />Edit</button>
              <button className="btn btn-sm btn-danger" onClick={() => { if (confirm('Delete FAQ?')) removeMutation.mutate(f.id); }}><Trash2 size={12} /></button>
            </div>
          </div>
        ))}
        {faqs.length === 0 && <div className="card text-center text-tide-muted py-12">No FAQs yet.</div>}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="px-6 py-4 border-b border-tide-deep/10 flex items-center justify-between">
              <h3 className="font-serif text-xl text-tide-deep">{editFaq ? 'Edit FAQ' : 'Add FAQ item'}</h3>
              <button onClick={() => setShowModal(false)} className="text-tide-muted text-xl">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div><label className="form-label">Question</label><input className="form-input" value={form.question} onChange={e => setForm({ ...form, question: e.target.value })} placeholder="Type the question…" /></div>
              <div><label className="form-label">Answer</label><textarea className="form-input" rows={4} value={form.answer} onChange={e => setForm({ ...form, answer: e.target.value })} placeholder="Type the answer…" /></div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="faqpub" checked={form.isPublished} onChange={e => setForm({ ...form, isPublished: e.target.checked })} className="w-4 h-4" />
                <label htmlFor="faqpub" className="text-sm">Publish immediately</label>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-tide-deep/10 flex justify-end gap-3">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={createMutation.isPending || updateMutation.isPending}>
                {createMutation.isPending || updateMutation.isPending ? 'Saving…' : editFaq ? 'Update FAQ' : 'Save FAQ'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── CHAT PAGE ────────────────────────────────────────────────────────────────
export function ChatPage() {
  const { user } = useAuth();
  const [allMessages, setAllMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [activeGuest, setActiveGuest] = useState<string | null>(null);
  const [readConversations, setReadConversations] = useState<Set<string>>(new Set());
  const socketRef = React.useRef<any>(null);
  const msgsEnd = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const apiUrl = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3001';
    const socket = io(`${apiUrl}/chat`, { transports: ['websocket', 'polling'] });
    socketRef.current = socket;

    socket.emit('join', {
      userId: user?.id,
      userName: `${user?.firstName} ${user?.lastName}`,
      isGuest: false,
    });

    socket.on('message-history', (history: any[]) => {
      if (history.length > 0) {
        let lastGuestId: string | null = null;
        const tagged = history.map((msg: any) => {
          if (msg.from === 'user') lastGuestId = msg.userId;
          if (msg.from === 'support' && !msg._forGuest && lastGuestId) {
            return { ...msg, _forGuest: lastGuestId };
          }
          return msg;
        });
        setAllMessages(tagged);
      }
    });

    socket.on('new-message', (msg: any) => {
      if (msg.from === 'user') {
        setAllMessages(m => [...m, msg]);
        // Mark as unread again if not currently viewing this conversation
        setReadConversations(prev => {
          const updated = new Set(prev);
          updated.delete(msg.userId);
          return updated;
        });
      }
    });

    return () => { socket.disconnect(); };
  }, []);

  React.useEffect(() => {
    msgsEnd.current?.scrollIntoView({ behavior: 'smooth' });
  }, [allMessages, activeGuest]);

  const conversations = React.useMemo(() => {
    const map = new Map<string, {
      userId: string;
      name: string;
      email?: string;
      messages: any[];
      lastTime: string;
      unread: number;
    }>();

    allMessages.forEach(msg => {
      if (msg.from === 'user' && msg.userId) {
        if (!map.has(msg.userId)) {
          const label = msg.guestLabel || msg.userName || 'Guest';
          const parts = label.split(' · ');
          map.set(msg.userId, {
            userId: msg.userId,
            name: parts[0],
            email: parts[1],
            messages: [],
            lastTime: msg.time,
            unread: 0,
          });
        }
        const conv = map.get(msg.userId)!;
        conv.messages.push(msg);
        conv.lastTime = msg.time;
        if (msg.userId !== activeGuest) {
          conv.unread++;
        } else {
          conv.unread = 0;
        }
      } else if (msg.from === 'support' && msg._forGuest) {
        if (map.has(msg._forGuest)) {
          map.get(msg._forGuest)!.messages.push(msg);
        }
      }
    });

    return Array.from(map.values());
  }, [allMessages, activeGuest]);

  const activeMessages = React.useMemo(() => {
    if (!activeGuest) return [];
    const conv = conversations.find(c => c.userId === activeGuest);
    return conv?.messages || [];
  }, [conversations, activeGuest]);

  const activeConv = conversations.find(c => c.userId === activeGuest);

  const sendMessage = () => {
    if (!input.trim() || !activeGuest) return;
    const time = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    setAllMessages(m => [...m, {
      id: Date.now().toString(),
      from: 'support',
      text: input,
      time,
      userName: `${user?.firstName} ${user?.lastName}`,
      _forGuest: activeGuest,
    }]);
    socketRef.current?.emit('support-reply', {
      targetUserId: activeGuest,
      text: input,
      supportName: `${user?.firstName} ${user?.lastName}`,
    });
    setInput('');
  };

  return (
    <div>
      <h1 className="font-serif text-2xl text-tide-deep mb-6">Live Chat & Support</h1>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6" style={{ height: '600px' }}>

        {/* Conversation list */}
        <div className="lg:col-span-1 card p-0 flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b border-tide-deep/10 flex-shrink-0">
            <div className="text-sm font-medium text-tide-deep">Conversations</div>
            <div className="text-[11px] text-tide-muted mt-0.5">{conversations.length} active</div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="p-4 text-center text-xs text-tide-muted py-8">
                No conversations yet.<br/>Messages from visitors will appear here.
              </div>
            ) : (
              conversations.map(conv => (
                <button
                  key={conv.userId}
                  onClick={() => {
                    setActiveGuest(conv.userId);
                    setReadConversations(prev => new Set(prev).add(conv.userId));
                  }}
                  className={`w-full text-left px-4 py-3 border-b border-tide-deep/5 transition-colors hover:bg-tide-sand/50 ${
                    activeGuest === conv.userId ? 'bg-tide-foam border-l-2 border-l-tide-mid' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <div className="text-sm font-medium text-tide-deep truncate">{conv.name}</div>
                    <div className="text-[10px] text-tide-muted flex-shrink-0 ml-1">{conv.lastTime}</div>
                  </div>
                  {conv.email && (
                    <div className="text-[10px] text-tide-muted truncate mb-1">{conv.email}</div>
                  )}
                  <div className="text-xs text-tide-muted truncate">
                    {conv.messages.filter(m => m.from === 'user').slice(-1)[0]?.text || ''}
                  </div>
                  {conv.unread > 0 && !readConversations.has(conv.userId) && (
                    <span className="pill pill-blue text-[10px] mt-1">{conv.unread} new</span>
                  )}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat window */}
        <div className="lg:col-span-3 card p-0 flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b border-tide-deep/10 flex items-center justify-between flex-shrink-0">
            {activeConv ? (
              <div>
                <div className="text-sm font-medium text-tide-deep">{activeConv.name}</div>
                <div className="text-[11px] text-tide-muted mt-0.5">
                  {activeConv.email && <span>{activeConv.email} · </span>}
                  <span className="text-green-600">● Online</span>
                </div>
              </div>
            ) : (
              <div>
                <div className="text-sm font-medium text-tide-deep">Live Support Chat</div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-green-500"/>
                  <span className="text-[11px] text-tide-muted">
                    {conversations.length} conversation{conversations.length !== 1 ? 's' : ''} · Select one to reply
                  </span>
                </div>
              </div>
            )}

            {/* Quick replies dropdown */}
            {activeGuest && (
              <div className="relative group">
                <button className="btn btn-sm btn-secondary text-xs">Quick replies ▾</button>
                <div className="absolute right-0 top-full mt-1 w-64 bg-white border border-tide-deep/10 rounded-xl shadow-lg z-10 hidden group-hover:block">
                  {[
                    'Thank you for contacting Tide Home!',
                    "I'll look into that for you right away.",
                    'Could you please provide more details?',
                    'Please call +44 800 123 4567 for urgent matters.',
                    "I'll connect you with the right team member.",
                  ].map(t => (
                    <button
                      key={t}
                      onClick={() => setInput(t)}
                      className="w-full text-left text-xs text-tide-deep hover:bg-tide-sand px-4 py-2.5 border-b border-tide-deep/5 last:border-0 transition-colors"
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-tide-sand/20">
            {!activeGuest ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-tide-muted">
                <div className="text-4xl mb-3 opacity-30">💬</div>
                <p className="text-sm">Select a conversation from the left to start replying</p>
              </div>
            ) : activeMessages.length === 0 ? (
              <div className="text-center text-tide-muted text-sm py-8">No messages yet</div>
            ) : (
              activeMessages.map((m: any, i: number) => (
                <div key={i} className={`flex ${m.from === 'user' ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-xs px-3.5 py-2.5 rounded-xl text-sm leading-relaxed ${
                    m.from === 'user'
                      ? 'bg-white border border-tide-deep/10 text-tide-deep rounded-bl-sm'
                      : 'bg-tide-deep text-white rounded-br-sm'
                  }`}>
                    {m.from === 'user' && (
                      <div className="text-[10px] font-semibold text-tide-light mb-1">
                        {activeConv?.name}
                      </div>
                    )}
                    {m.text}
                    <div className={`text-[10px] mt-1 ${m.from === 'user' ? 'text-tide-muted' : 'text-white/50 text-right'}`}>
                      {m.time}
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={msgsEnd}/>
          </div>

          {/* Input */}
          <div className="px-4 py-3 border-t border-tide-deep/10 flex gap-2 flex-shrink-0">
            <input
              className="form-input flex-1 py-2"
              placeholder={activeGuest ? `Reply to ${activeConv?.name}…` : 'Select a conversation to reply…'}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              disabled={!activeGuest}
            />
            <button
              className="btn btn-primary px-4"
              onClick={sendMessage}
              disabled={!activeGuest || !input.trim()}
            >
              <Send size={15}/>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── CONTACT MESSAGES PAGE ───────────────────────────────────────────────────
export function ContactMessagesPage() {
  const qc = useQueryClient();
  const [selected, setSelected] = useState<any>(null);

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['contact-messages'],
    queryFn: contactApi.getAll,
  });

  const markRead = useMutation({
    mutationFn: (id: string) => contactApi.markRead(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['contact-messages'] }),
  });

  const markReplied = useMutation({
    mutationFn: (id: string) => contactApi.markReplied(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['contact-messages'] }); toast.success('Marked as replied'); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => contactApi.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['contact-messages'] }); setSelected(null); toast.success('Message deleted'); },
  });

  const unread = messages.filter((m: any) => !m.isRead).length;

  const openMessage = (msg: any) => {
    setSelected(msg);
    if (!msg.isRead) markRead.mutate(msg.id);
  };

  if (isLoading) return <div className="text-tide-muted text-sm">Loading messages…</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-2xl text-tide-deep">Contact Messages</h1>
          {unread > 0 && (
            <p className="text-tide-muted text-sm mt-1">
              <span className="pill pill-red">{unread} unread</span>
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Message list */}
        <div className="lg:col-span-1 space-y-2">
          {messages.length === 0 && (
            <div className="card text-center text-tide-muted py-12">No messages yet</div>
          )}
          {messages.map((m: any) => (
            <div
              key={m.id}
              onClick={() => openMessage(m)}
              className={`card-sm cursor-pointer transition-all hover:border-tide-mid ${
                selected?.id === m.id ? 'border-tide-mid border-2' : ''
              } ${!m.isRead ? 'bg-tide-foam/30' : ''}`}
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="font-medium text-sm text-tide-deep truncate">
                  {!m.isRead && <span className="inline-block w-2 h-2 bg-tide-light rounded-full mr-1.5 mb-0.5"/>}
                  {m.firstName} {m.lastName}
                </div>
                <div className="text-[10px] text-tide-muted flex-shrink-0">
                  {new Date(m.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                </div>
              </div>
              <div className="text-xs text-tide-muted truncate">{m.subject || 'General enquiry'}</div>
              <div className="text-xs text-tide-muted truncate mt-0.5 opacity-70">{m.message.slice(0, 60)}…</div>
              <div className="flex gap-1.5 mt-2">
                {m.isReplied && <span className="pill pill-green text-[10px]">Replied</span>}
                {!m.isRead && <span className="pill pill-blue text-[10px]">New</span>}
              </div>
            </div>
          ))}
        </div>

        {/* Message detail */}
        <div className="lg:col-span-2">
          {!selected ? (
            <div className="card flex flex-col items-center justify-center py-20 text-center text-tide-muted">
              <div className="text-4xl mb-3 opacity-30">✉️</div>
              <p className="text-sm">Select a message to read it</p>
            </div>
          ) : (
            <div className="card">
              <div className="flex items-start justify-between pb-4 border-b border-tide-deep/10 mb-4">
                <div>
                  <h2 className="font-serif text-xl text-tide-deep">{selected.subject || 'General enquiry'}</h2>
                  <div className="text-xs text-tide-muted mt-1">
                    From <strong>{selected.firstName} {selected.lastName}</strong> · {new Date(selected.createdAt).toLocaleString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  {selected.isReplied
                    ? <span className="pill pill-green">Replied</span>
                    : <button className="btn btn-sm btn-secondary" onClick={() => markReplied.mutate(selected.id)}>Mark replied</button>
                  }
                  <button className="btn btn-sm btn-danger" onClick={() => { if (confirm('Delete this message?')) deleteMutation.mutate(selected.id); }}>
                    <Trash2 size={12}/>
                  </button>
                </div>
              </div>

              {/* Contact details */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                {[
                  ['Email', selected.email],
                  ['Phone', selected.phone || '—'],
                ].map(([label, val]) => (
                  <div key={label} className="bg-tide-sand rounded-lg px-3 py-2">
                    <div className="text-[10px] font-semibold text-tide-muted uppercase tracking-wider">{label}</div>
                    <div className="text-sm text-tide-deep font-medium mt-0.5">{val}</div>
                  </div>
                ))}
              </div>

              {/* Message body */}
              <div className="bg-tide-sand rounded-xl p-4 mb-5">
                <div className="text-[10px] font-semibold text-tide-muted uppercase tracking-wider mb-2">Message</div>
                <p className="text-sm text-tide-deep leading-relaxed whitespace-pre-wrap">{selected.message}</p>
              </div>
        
              {/* Reply button */}
              
               <a href={`mailto:${selected.email}?subject=Re: ${selected.subject || 'Your Tide Home enquiry'}`}
                className="btn btn-primary"
                onClick={() => markReplied.mutate(selected.id)}
                target="_blank"
                rel="noreferrer"
              >
                <Mail size={14}/>
                <span>Reply via email</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
