// ResidentsPage
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { residentsApi, paymentsApi, appointmentsApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { Plus, Edit, Trash2, Download, CalendarPlus, Mail, Archive } from 'lucide-react';
import ConfirmModal from '../../components/ui/ConfirmModal';

const EMPTY_FORM = { firstName:'', lastName:'', dateOfBirth:'', roomNumber:'', floor:'1', carePackage:'Standard Care', medicalHistory:'', allergies:'', emergencyContact:'', emergencyPhone:'', gpName:'', gpPhone:'', guardianUserId:'' };

export function ResidentsPage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const isAdminPlus = ['superadmin','admin'].includes(user?.role || '');
  const [showModal, setShowModal] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [editId, setEditId] = useState<string|null>(null);
  const [form, setForm] = useState<typeof EMPTY_FORM>({ ...EMPTY_FORM });
  const [confirmArchive, setConfirmArchive] = useState<{ open: boolean; resident: any | null }>({ open: false, resident: null });

  const { data: residents = [], isLoading } = useQuery({
    queryKey: ['residents'],
    queryFn: user?.role === 'guardian' ? residentsApi.getMyResidents : residentsApi.getAll,
  });

  const { data: archivedResidents = [] } = useQuery({
    queryKey: ['residents-archived'],
    queryFn: residentsApi.getArchived,
    enabled: isAdminPlus && showArchived,
  });

  const createMutation = useMutation({
    mutationFn: residentsApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['residents'] });
      setShowModal(false);
      setEditId(null);
      setForm({ ...EMPTY_FORM });
      toast.success('Resident registered successfully');
    },
    onError: (e: any) => toast.error(e?.response?.data?.message || 'Failed to register resident'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: any) => residentsApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['residents'] });
      setShowModal(false);
      setEditId(null);
      setForm({ ...EMPTY_FORM });
      toast.success('Resident updated successfully');
    },
    onError: (e: any) => toast.error(e?.response?.data?.message || 'Failed to update resident'),
  });

  const archiveMutation = useMutation({
    mutationFn: residentsApi.archive,
    onSuccess: (data: any) => {
      qc.invalidateQueries({ queryKey: ['residents'] });
      qc.invalidateQueries({ queryKey: ['residents-archived'] });
      toast.success(data.message || 'Resident profile has been successfully archived');
    },
    onError: () => toast.error('Failed to archive resident'),
  });

  const openAdd = () => { setEditId(null); setForm({ ...EMPTY_FORM }); setShowModal(true); };
  const openEdit = (r: any) => {
    setEditId(r.id);
    setForm({
      firstName: r.firstName || '',
      lastName: r.lastName || '',
      dateOfBirth: r.dateOfBirth || '',
      roomNumber: r.roomNumber || '',
      floor: String(r.floor || 1),
      carePackage: r.carePackage || 'Standard Care',
      medicalHistory: r.medicalHistory || '',
      allergies: r.allergies || '',
      emergencyContact: r.emergencyContact || '',
      emergencyPhone: r.emergencyPhone || '',
      gpName: r.gpName || '',
      gpPhone: r.gpPhone || '',
      guardianUserId: r.guardianUserId || '',
    });
    setShowModal(true);
  };

  const handleSave = () => {
    const payload = { ...form, floor: parseInt(form.floor) };
    if (editId) updateMutation.mutate({ id: editId, data: payload });
    else createMutation.mutate(payload);
  };

  const statusClass: Record<string,string> = {
    stable: 'pill-green',
    monitoring: 'pill-blue',
    attention: 'pill-amber',
    critical: 'pill-red',
  };

  if (isLoading) return <div className="text-tide-muted text-sm">Loading residents…</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-2xl text-tide-deep">Residents</h1>
          <p className="text-tide-muted text-sm mt-1">{residents.length} active resident{residents.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex items-center gap-2">
          {isAdminPlus && (
            <button
              className="btn btn-secondary"
              onClick={() => setShowArchived(!showArchived)}
            >
              <Archive size={15}/>
              {showArchived ? 'Hide archived' : 'View archived'}
            </button>
          )}
          {isAdminPlus && (
            <button className="btn btn-primary" onClick={openAdd}>
              <Plus size={15}/>Add resident
            </button>
          )}
        </div>
      </div>

      {/* Archived residents section */}
      {showArchived && isAdminPlus && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Archive size={16} className="text-tide-muted"/>
            <h2 className="font-serif text-lg text-tide-muted">Archived residents ({archivedResidents.length})</h2>
          </div>
          {archivedResidents.length === 0 ? (
            <div className="card text-center text-tide-muted py-8 text-sm">No archived residents</div>
          ) : (
            <div className="table-wrap opacity-75">
              <table className="w-full">
                <thead><tr>
                  <th className="th">Resident</th>
                  <th className="th">Package</th>
                  <th className="th">Archived on</th>
                  <th className="th">Reason</th>
                </tr></thead>
                <tbody>
                  {archivedResidents.map((r: any) => (
                    <tr key={r.id} className="bg-gray-50">
                      <td className="td">
                        <div className="font-medium text-tide-muted">{r.firstName} {r.lastName}</div>
                        <div className="text-xs text-tide-muted">{r.dateOfBirth}</div>
                      </td>
                      <td className="td text-tide-muted">{r.carePackage}</td>
                      <td className="td text-xs text-tide-muted">
                        {r.archivedAt ? new Date(r.archivedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                      </td>
                      <td className="td text-xs text-tide-muted">{r.archiveReason || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Active residents table */}
      <div className="table-wrap">
        <table className="w-full">
          <thead><tr>
            <th className="th">Resident</th>
            <th className="th">Room</th>
            <th className="th">Package</th>
            <th className="th">Emergency contact</th>
            <th className="th">Status</th>
            <th className="th">Actions</th>
          </tr></thead>
          <tbody>
            {residents.map((r: any) => (
              <tr key={r.id} className="hover:bg-tide-sand/20 transition-colors">
                <td className="td">
                  <div className="font-medium">{r.firstName} {r.lastName}</div>
                  <div className="text-xs text-tide-muted">{r.dateOfBirth}</div>
                </td>
                <td className="td">Room {r.roomNumber}, Floor {r.floor}</td>
                <td className="td">{r.carePackage}</td>
                <td className="td">
                  <div>{r.emergencyContact}</div>
                  <div className="text-xs text-tide-muted">{r.emergencyPhone}</div>
                </td>
                <td className="td">
                  <span className={`pill ${statusClass[r.status] || 'pill-gray'}`}>{r.status}</span>
                </td>
                <td className="td">
                  <div className="flex items-center gap-1.5">
                    {isAdminPlus && (
                      <button className="btn btn-sm btn-secondary" onClick={() => openEdit(r)}>
                        <Edit size={12}/>Edit
                      </button>
                    )}
                    {isAdminPlus && (
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => setConfirmArchive({ open: true, resident: r })}
                      >
                        <Archive size={12}/>Delete
                      </button>
                    )}
                    <ConfirmModal
                      open={confirmArchive.open}
                      title="Archive resident"
                      message={`Are you sure you want to archive ${confirmArchive.resident?.firstName} ${confirmArchive.resident?.lastName}'s profile? Their record will be moved to the archive and can be retrieved if needed.`}
                      confirmLabel="Yes, archive"
                      cancelLabel="Cancel"
                      variant="archive"
                      loading={archiveMutation.isPending}
                      onConfirm={() => {
                        archiveMutation.mutate(confirmArchive.resident?.id, {
                          onSuccess: () => setConfirmArchive({ open: false, resident: null }),
                        });
                      }}
                      onCancel={() => setConfirmArchive({ open: false, resident: null })}
                    />
                  </div>
                </td>
              </tr>
            ))}
            {residents.length === 0 && (
              <tr><td colSpan={6} className="td text-center text-tide-muted py-8">No active residents found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="px-6 py-4 border-b border-tide-deep/10 flex items-center justify-between">
              <h3 className="font-serif text-xl text-tide-deep">
                {editId ? 'Edit resident' : 'Register new resident'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-tide-muted text-xl">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">First name</label>
                  <input className="form-input" value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} placeholder="Margaret"/>
                </div>
                <div>
                  <label className="form-label">Last name</label>
                  <input className="form-input" value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} placeholder="Adeyemi"/>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Date of birth</label>
                  <input type="date" className="form-input" value={form.dateOfBirth} onChange={e => setForm({...form, dateOfBirth: e.target.value})}/>
                </div>
                <div>
                  <label className="form-label">Room number</label>
                  <input className="form-input" value={form.roomNumber} onChange={e => setForm({...form, roomNumber: e.target.value})} placeholder="14"/>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Floor</label>
                  <input type="number" className="form-input" value={form.floor} onChange={e => setForm({...form, floor: e.target.value})} min="1"/>
                </div>
                <div>
                  <label className="form-label">Care package</label>
                  <select className="form-input" value={form.carePackage} onChange={e => setForm({...form, carePackage: e.target.value})}>
                    <option>Standard Care</option>
                    <option>Enhanced Care</option>
                    <option>Premium Care</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="form-label">Emergency contact name</label>
                <input className="form-input" value={form.emergencyContact} onChange={e => setForm({...form, emergencyContact: e.target.value})} placeholder="Guardian full name"/>
              </div>
              <div>
                <label className="form-label">Emergency contact phone</label>
                <input className="form-input" value={form.emergencyPhone} onChange={e => setForm({...form, emergencyPhone: e.target.value})} placeholder="+44 ..."/>
              </div>
              <div>
                <label className="form-label">GP name</label>
                <input className="form-input" value={form.gpName} onChange={e => setForm({...form, gpName: e.target.value})} placeholder="Dr. Smith"/>
              </div>
              <div>
                <label className="form-label">GP phone</label>
                <input className="form-input" value={form.gpPhone} onChange={e => setForm({...form, gpPhone: e.target.value})} placeholder="+44 ..."/>
              </div>
              <div>
                <label className="form-label">Allergies</label>
                <input className="form-input" value={form.allergies} onChange={e => setForm({...form, allergies: e.target.value})} placeholder="Known allergies…"/>
              </div>
              <div>
                <label className="form-label">Medical history / notes</label>
                <textarea className="form-input" rows={3} value={form.medicalHistory} onChange={e => setForm({...form, medicalHistory: e.target.value})} placeholder="Any relevant medical history…"/>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-tide-deep/10 flex justify-end gap-3">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button
                className="btn btn-primary"
                onClick={handleSave}
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {createMutation.isPending || updateMutation.isPending
                  ? 'Saving…'
                  : editId ? 'Update resident' : 'Register resident'
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// PaymentsPage
export function PaymentsPage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const isAdminPlus = ['superadmin','admin'].includes(user?.role || '');
  const [editPayment, setEditPayment] = useState<any>(null);
  const [receiptPayment, setReceiptPayment] = useState<any>(null);
  const [sendReceiptPayment, setSendReceiptPayment] = useState<any>(null);
  const [receiptEmail, setReceiptEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [editForm, setEditForm] = useState<any>({});

  const { data: payments = [], isLoading } = useQuery({
    queryKey: ['payments'],
    queryFn: isAdminPlus ? paymentsApi.getAll : () => paymentsApi.getByResident(user?.linkedResidentId || ''),
  });
  const { data: summary } = useQuery({
    queryKey: ['payment-summary'],
    queryFn: paymentsApi.getSummary,
    enabled: isAdminPlus,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: any) => paymentsApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['payments'] });
      qc.invalidateQueries({ queryKey: ['payment-summary'] });
      setEditPayment(null);
      toast.success('Payment record updated');
    },
    onError: (e: any) => toast.error(e?.response?.data?.message || 'Failed to update'),
  });

  const sendReceiptMutation = useMutation({
    mutationFn: ({ id, email }: any) => paymentsApi.sendReceipt(id, email),
    onSuccess: (_, vars) => {
      setSendReceiptPayment(null);
      setReceiptEmail('');
      setEmailError('');
      toast.success(`Receipt sent to ${vars.email}`);
    },
    onError: (e: any) => toast.error(e?.response?.data?.message || 'Failed to send receipt'),
  });

  const openEdit = (p: any) => {
    setEditPayment(p);
    setEditForm({ status: p.status, method: p.method, amount: p.amount, carePackage: p.carePackage, notes: p.notes || '' });
  };

  const validateEmail = (email: string) => {
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!email) { setEmailError('Email address is required'); return false; }
    if (!valid) { setEmailError('Please enter a valid email address'); return false; }
    setEmailError('');
    return true;
  };

  const handleSendReceipt = () => {
    if (!validateEmail(receiptEmail)) return;
    sendReceiptMutation.mutate({ id: sendReceiptPayment.id, email: receiptEmail });
  };

  const printReceipt = (p: any) => {
    const w = window.open('', '_blank');
    if (!w) return;
    w.document.write(`
      <html><head><title>Receipt ${p.receiptNumber}</title>
      <style>body{font-family:Inter,sans-serif;max-width:500px;margin:2rem auto;padding:2rem;border:1px solid #eee;border-radius:12px} table{width:100%;border-collapse:collapse;font-size:0.875rem} td{padding:8px 0;border-bottom:1px solid #f0f0f0} .total td{border:none;padding-top:16px;font-weight:700;font-size:1.1rem}</style>
      </head><body>
      <h2 style="text-align:center;color:#0B3D52">Tide Home</h2>
      <p style="text-align:center;color:#999;font-size:0.85rem">12 Riverside Close, London SE1 7PB</p>
      <hr/>
      <table>
        <tr><td style="color:#999">Receipt no.</td><td style="text-align:right">${p.receiptNumber}</td></tr>
        <tr><td style="color:#999">Resident</td><td style="text-align:right">${p.residentName}</td></tr>
        <tr><td style="color:#999">Package</td><td style="text-align:right">${p.carePackage}</td></tr>
        <tr><td style="color:#999">Method</td><td style="text-align:right">${p.method}</td></tr>
        <tr><td style="color:#999">Status</td><td style="text-align:right;text-transform:capitalize">${p.status}</td></tr>
        <tr><td style="color:#999">Date</td><td style="text-align:right">${new Date(p.createdAt).toLocaleDateString('en-GB')}</td></tr>
        <tr class="total"><td>Total paid</td><td style="text-align:right">£${Number(p.amount).toLocaleString()}</td></tr>
      </table>
      <p style="font-size:0.75rem;color:#999;text-align:center;margin-top:2rem">Tide Home Care Services Ltd · hello@tidehome.co.uk</p>
      </body></html>
    `);
    w.document.close();
    w.print();
  };

  const statusClass: Record<string,string> = { paid:'pill-green', overdue:'pill-red', processing:'pill-blue', pending:'pill-amber' };

  if (isLoading) return <div className="text-tide-muted text-sm">Loading payments…</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl text-tide-deep">Payments</h1>
      </div>

      {isAdminPlus && summary && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="card-sm"><div className="text-[11px] text-tide-muted uppercase tracking-wider mb-1">Collected</div><div className="font-serif text-2xl text-tide-success">£{Number(summary.totalPaid).toLocaleString()}</div></div>
          <div className="card-sm"><div className="text-[11px] text-tide-muted uppercase tracking-wider mb-1">Overdue</div><div className="font-serif text-2xl text-red-600">£{Number(summary.totalOverdue).toLocaleString()}</div></div>
          <div className="card-sm"><div className="text-[11px] text-tide-muted uppercase tracking-wider mb-1">Processing</div><div className="font-serif text-2xl text-tide-mid">£{Number(summary.totalProcessing).toLocaleString()}</div></div>
        </div>
      )}

      <div className="table-wrap">
        <table className="w-full">
          <thead><tr>
            <th className="th">Receipt</th>
            <th className="th">Resident</th>
            <th className="th">Package</th>
            <th className="th">Amount</th>
            <th className="th">Method</th>
            <th className="th">Status</th>
            <th className="th">Date</th>
            <th className="th">Actions</th>
          </tr></thead>
          <tbody>
            {payments.map((p: any) => (
              <tr key={p.id} className="hover:bg-tide-sand/20 transition-colors">
                <td className="td"><code className="text-xs bg-tide-sand px-2 py-0.5 rounded">{p.receiptNumber}</code></td>
                <td className="td font-medium">{p.residentName}</td>
                <td className="td">{p.carePackage}</td>
                <td className="td font-semibold">£{Number(p.amount).toLocaleString()}</td>
                <td className="td text-xs">{p.method}</td>
                <td className="td"><span className={`pill ${statusClass[p.status] || 'pill-gray'}`}>{p.status}</span></td>
                <td className="td text-xs text-tide-muted">{new Date(p.createdAt).toLocaleDateString('en-GB')}</td>
                <td className="td">
                  <div className="flex gap-1.5 flex-wrap">
                    <button className="btn btn-sm btn-secondary" onClick={() => printReceipt(p)}>
                      <Download size={12}/>Print
                    </button>
                    <button className="btn btn-sm btn-secondary" onClick={() => { setSendReceiptPayment(p); setReceiptEmail(''); setEmailError(''); }}>
                      <Mail size={12}/>Email
                    </button>
                    {isAdminPlus && (
                      <button className="btn btn-sm btn-secondary" onClick={() => openEdit(p)}>
                        <Edit size={12}/>Update
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {payments.length === 0 && (
              <tr><td colSpan={8} className="td text-center text-tide-muted py-8">No payment records found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── UPDATE PAYMENT MODAL ── */}
      {editPayment && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="px-6 py-4 border-b border-tide-deep/10 flex items-center justify-between">
              <div>
                <h3 className="font-serif text-xl text-tide-deep">Update payment record</h3>
                <div className="text-xs text-tide-muted mt-0.5">Receipt: {editPayment.receiptNumber}</div>
              </div>
              <button onClick={() => setEditPayment(null)} className="text-tide-muted text-xl">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="form-label">Payment status</label>
                <select className="form-input" value={editForm.status} onChange={e => setEditForm({...editForm, status: e.target.value})}>
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="overdue">Overdue</option>
                </select>
              </div>
              <div>
                <label className="form-label">Payment method</label>
                <select className="form-input" value={editForm.method} onChange={e => setEditForm({...editForm, method: e.target.value})}>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Direct Debit">Direct Debit</option>
                  <option value="Card">Card</option>
                </select>
              </div>
              <div>
                <label className="form-label">Amount (£)</label>
                <input
                  type="number"
                  className="form-input"
                  value={editForm.amount}
                  onChange={e => setEditForm({...editForm, amount: parseFloat(e.target.value)})}
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="form-label">Care package</label>
                <select className="form-input" value={editForm.carePackage} onChange={e => setEditForm({...editForm, carePackage: e.target.value})}>
                  <option>Standard Care</option>
                  <option>Enhanced Care</option>
                  <option>Premium Care</option>
                </select>
              </div>
              <div>
                <label className="form-label">Notes</label>
                <textarea
                  className="form-input"
                  rows={2}
                  value={editForm.notes}
                  onChange={e => setEditForm({...editForm, notes: e.target.value})}
                  placeholder="Add a note about this update…"
                />
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">
                ⚠️ All changes are logged automatically for audit purposes.
              </div>
            </div>
            <div className="px-6 py-4 border-t border-tide-deep/10 flex justify-end gap-3">
              <button className="btn btn-secondary" onClick={() => setEditPayment(null)}>Cancel</button>
              <button
                className="btn btn-primary"
                onClick={() => updateMutation.mutate({ id: editPayment.id, data: editForm })}
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? 'Saving…' : 'Save changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── SEND RECEIPT MODAL ── */}
      {sendReceiptPayment && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl">
            <div className="px-6 py-4 border-b border-tide-deep/10 flex items-center justify-between">
              <div>
                <h3 className="font-serif text-xl text-tide-deep">Send receipt via email</h3>
                <div className="text-xs text-tide-muted mt-0.5">{sendReceiptPayment.receiptNumber} · £{Number(sendReceiptPayment.amount).toLocaleString()}</div>
              </div>
              <button onClick={() => setSendReceiptPayment(null)} className="text-tide-muted text-xl">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="form-label">Recipient email address</label>
                <input
                  type="email"
                  className={`form-input ${emailError ? 'border-red-400 focus:border-red-400' : ''}`}
                  placeholder="guardian@example.com"
                  value={receiptEmail}
                  onChange={e => { setReceiptEmail(e.target.value); if (emailError) validateEmail(e.target.value); }}
                  onBlur={() => validateEmail(receiptEmail)}
                  autoFocus
                />
                {emailError && (
                  <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                    ✗ {emailError}
                  </p>
                )}
              </div>
              <div className="bg-tide-foam rounded-lg p-3 text-xs text-tide-mid">
                📧 A formatted receipt will be sent to this email address from Tide Home.
              </div>
            </div>
            <div className="px-6 py-4 border-t border-tide-deep/10 flex justify-end gap-3">
              <button className="btn btn-secondary" onClick={() => { setSendReceiptPayment(null); setEmailError(''); }}>Cancel</button>
              <button
                className="btn btn-primary"
                onClick={handleSendReceipt}
                disabled={sendReceiptMutation.isPending}
              >
                {sendReceiptMutation.isPending ? 'Sending…' : 'Send receipt'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// AppointmentsPage
export function AppointmentsPage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const isStaffPlus = ['superadmin','admin','staff'].includes(user?.role || '');
  const [form, setForm] = useState({ residentId:'', residentName:'', appointmentType:'', hospital:'', scheduledAt:'', notes:'' });
  const { data: appointments = [], isLoading } = useQuery({ queryKey:['appointments'], queryFn: appointmentsApi.getAll });
  const { data: residents = [] } = useQuery({ queryKey:['residents'], queryFn: residentsApi.getAll, enabled: isStaffPlus });

  const createMutation = useMutation({
    mutationFn: appointmentsApi.create,
    onSuccess: () => { qc.invalidateQueries({queryKey:['appointments']}); setShowModal(false); setForm({ residentId:'', residentName:'', appointmentType:'', hospital:'', scheduledAt:'', notes:'' }); toast.success('Appointment scheduled'); },
    onError: (e: any) => toast.error(e?.response?.data?.message || 'Failed to schedule'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: any) => appointmentsApi.update(id, data),
    onSuccess: () => { qc.invalidateQueries({queryKey:['appointments']}); toast.success('Appointment updated'); },
  });

  const dotColor: Record<string,string> = { upcoming:'bg-tide-light', completed:'bg-tide-success', missed:'bg-red-500', cancelled:'bg-gray-400' };
  const pillClass: Record<string,string> = { upcoming:'pill-blue', completed:'pill-green', missed:'pill-red', cancelled:'pill-gray' };

  if (isLoading) return <div className="text-tide-muted text-sm">Loading appointments…</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl text-tide-deep">Hospital Visits & Schedule</h1>
        {isStaffPlus && <button className="btn btn-primary" onClick={() => setShowModal(true)}><CalendarPlus size={15}/>Schedule visit</button>}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {['upcoming','completed','missed','cancelled'].map(s => (
          <div key={s} className="card-sm text-center">
            <div className="text-[11px] text-tide-muted uppercase tracking-wider mb-1">{s}</div>
            <div className="font-serif text-2xl text-tide-deep">{appointments.filter((a: any) => a.status === s).length}</div>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {appointments.map((a: any) => (
          <div key={a.id} className="card-sm flex gap-4">
            <div className={`w-3 h-3 rounded-full mt-1.5 flex-shrink-0 ${dotColor[a.status] || 'bg-gray-400'}`}/>
            <div className="flex-1">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-medium text-sm text-tide-deep">{a.appointmentType} — {a.residentName}</div>
                  <div className="text-xs text-tide-muted mt-0.5">{a.hospital} · {new Date(a.scheduledAt).toLocaleDateString('en-GB', {day:'numeric',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'})}</div>
                  {a.notes && <div className="text-xs text-tide-muted italic mt-1">Notes: {a.notes}</div>}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`pill ${pillClass[a.status]}`}>{a.status}</span>
                  {isStaffPlus && a.status === 'upcoming' && (
                    <button className="btn btn-sm btn-secondary text-xs" onClick={() => updateMutation.mutate({ id:a.id, data:{ status:'completed' } })}>Mark done</button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        {appointments.length === 0 && <div className="card text-center text-tide-muted py-12">No appointments yet</div>}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="px-6 py-4 border-b border-tide-deep/10 flex items-center justify-between">
              <h3 className="font-serif text-xl text-tide-deep">Schedule hospital visit</h3>
              <button onClick={() => setShowModal(false)} className="text-tide-muted text-xl">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="form-label">Resident</label>
                <select className="form-input" value={form.residentId} onChange={e => {
                  const r = residents.find((x:any)=>x.id===e.target.value);
                  setForm({...form, residentId:e.target.value, residentName: r ? `${r.firstName} ${r.lastName}` : ''});
                }}>
                  <option value="">Select resident…</option>
                  {residents.map((r: any) => <option key={r.id} value={r.id}>{r.firstName} {r.lastName}</option>)}
                </select>
              </div>
              <div><label className="form-label">Appointment type</label><input className="form-input" value={form.appointmentType} onChange={e => setForm({...form, appointmentType:e.target.value})} placeholder="e.g. Cardiology review"/></div>
              <div><label className="form-label">Hospital / clinic</label><input className="form-input" value={form.hospital} onChange={e => setForm({...form, hospital:e.target.value})} placeholder="e.g. St Thomas's Hospital"/></div>
              <div><label className="form-label">Date & time</label><input type="datetime-local" className="form-input" value={form.scheduledAt} onChange={e => setForm({...form, scheduledAt:e.target.value})}/></div>
              <div><label className="form-label">Notes</label><textarea className="form-input" rows={2} value={form.notes} onChange={e => setForm({...form, notes:e.target.value})} placeholder="Any preparation instructions…"/></div>
            </div>
            <div className="px-6 py-4 border-t border-tide-deep/10 flex justify-end gap-3">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={() => createMutation.mutate(form)} disabled={createMutation.isPending || !form.residentId}>
                {createMutation.isPending ? 'Scheduling…' : 'Schedule visit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
