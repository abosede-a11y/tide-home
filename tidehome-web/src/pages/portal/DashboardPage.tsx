import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import { residentsApi, paymentsApi, appointmentsApi } from '../../services/api';
import { Users, CreditCard, Calendar, Activity } from 'lucide-react';

function StatCard({ label, value, sub, icon, color = 'bg-tide-foam' }: any) {
  return (
    <div className="card-sm flex items-start gap-4">
      <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center flex-shrink-0`}>
        {icon}
      </div>
      <div>
        <div className="text-[11px] text-tide-muted uppercase tracking-wider mb-0.5">{label}</div>
        <div className="font-serif text-2xl text-tide-deep">{value}</div>
        {sub && <div className="text-[11px] text-tide-light mt-0.5">{sub}</div>}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();

  const { data: residents = [] } = useQuery({ queryKey: ['residents'], queryFn: residentsApi.getAll, enabled: user?.role !== 'guardian' });
  const { data: myResidents = [] } = useQuery({ queryKey: ['my-residents'], queryFn: residentsApi.getMyResidents, enabled: user?.role === 'guardian' });
  const { data: summary } = useQuery({ queryKey: ['payment-summary'], queryFn: paymentsApi.getSummary, enabled: ['superadmin','admin'].includes(user?.role || '') });
  const { data: appointments = [] } = useQuery({ queryKey: ['appointments'], queryFn: appointmentsApi.getAll });

  const upcoming = appointments.filter((a: any) => a.status === 'upcoming');
  const displayResidents = user?.role === 'guardian' ? myResidents : residents;

  const statusPill = (s: string) => {
    const map: Record<string, string> = { stable: 'pill-green', monitoring: 'pill-blue', attention: 'pill-amber', critical: 'pill-red' };
    return <span className={`pill ${map[s] || 'pill-gray'}`}>{s}</span>;
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif text-2xl text-tide-deep">Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}, {user?.firstName}</h1>
        <p className="text-tide-muted text-sm mt-1">{new Date().toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {user?.role === 'guardian' ? (
          <>
            <StatCard label="Your resident" value={myResidents.length} sub="Linked" icon={<Users size={18} className="text-tide-deep"/>}/>
            <StatCard label="Upcoming appts" value={upcoming.length} sub="Scheduled" icon={<Calendar size={18} className="text-tide-mid"/>} color="bg-blue-50"/>
          </>
        ) : (
          <>
            <StatCard label="Total residents" value={residents.length} sub="Active" icon={<Users size={18} className="text-tide-deep"/>}/>
            <StatCard label="Revenue collected" value={summary ? `£${summary.totalPaid.toLocaleString()}` : '—'} sub="This period" icon={<CreditCard size={18} className="text-green-700"/>} color="bg-green-50"/>
            <StatCard label="Overdue payments" value={summary ? `£${summary.totalOverdue.toLocaleString()}` : '—'} sub="Needs action" icon={<CreditCard size={18} className="text-amber-700"/>} color="bg-amber-50"/>
            <StatCard label="Upcoming visits" value={upcoming.length} sub="This week" icon={<Calendar size={18} className="text-tide-mid"/>} color="bg-blue-50"/>
          </>
        )}
      </div>

      {/* Residents table */}
      <div className="mb-2 flex items-center justify-between">
        <h2 className="font-serif text-lg text-tide-deep">
          {user?.role === 'guardian' ? 'Your resident' : 'Resident overview'}
        </h2>
      </div>
      <div className="table-wrap">
        <table className="w-full">
          <thead>
            <tr>
              <th className="th">Resident</th>
              <th className="th">Room</th>
              <th className="th">Package</th>
              <th className="th">Status</th>
            </tr>
          </thead>
          <tbody>
            {displayResidents.length === 0 ? (
              <tr><td colSpan={4} className="td text-center text-tide-muted py-8">No residents found</td></tr>
            ) : displayResidents.map((r: any) => (
              <tr key={r.id} className="hover:bg-tide-sand/30 transition-colors">
                <td className="td font-medium">{r.firstName} {r.lastName}</td>
                <td className="td">Room {r.roomNumber}, Floor {r.floor}</td>
                <td className="td">{r.carePackage}</td>
                <td className="td">{statusPill(r.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Upcoming appointments */}
      {upcoming.length > 0 && (
        <div className="mt-6">
          <h2 className="font-serif text-lg text-tide-deep mb-3">Upcoming hospital visits</h2>
          <div className="space-y-2">
            {upcoming.slice(0, 5).map((a: any) => (
              <div key={a.id} className="card-sm flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <Calendar size={18} className="text-blue-600"/>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-tide-deep">{a.appointmentType} — {a.residentName}</div>
                  <div className="text-xs text-tide-muted">{a.hospital} · {new Date(a.scheduledAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                </div>
                <span className="pill pill-blue">Upcoming</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
