import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, Users, Pill, Calendar, CreditCard, User,
  MessageCircle, FileText, HelpCircle, UserCog, Lock, Shield,
  Bell, Search, LogOut, Menu, X, Lock as LockIcon,
} from 'lucide-react';

interface NavItem {
  key: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  section: string;
  roles?: string[];
}

const ALL_NAV: NavItem[] = [
  { key: 'dashboard',    label: 'Dashboard',        icon: <LayoutDashboard size={16}/>, path: '/portal/dashboard',    section: 'Main' },
  { key: 'residents',    label: 'Residents',         icon: <Users size={16}/>,           path: '/portal/residents',    section: 'Care' },
  { key: 'medications',  label: 'Medications',       icon: <Pill size={16}/>,            path: '/portal/medications',  section: 'Care' },
  { key: 'appointments', label: 'Hospital Visits',   icon: <Calendar size={16}/>,        path: '/portal/appointments', section: 'Care' },
  { key: 'payments',     label: 'Payments',          icon: <CreditCard size={16}/>,      path: '/portal/payments',     section: 'Finance' },
  { key: 'profile',      label: 'My Profile',        icon: <User size={16}/>,            path: '/portal/profile',      section: 'Account' },
  { key: 'livechat',     label: 'Live Chat',         icon: <MessageCircle size={16}/>,   path: '/portal/chat',         section: 'Support' },
  { key: 'blog',         label: 'Blog Manager',      icon: <FileText size={16}/>,        path: '/portal/blog',         section: 'Content', roles: ['superadmin','admin'] },
  { key: 'faqadmin',     label: 'FAQ Manager',       icon: <HelpCircle size={16}/>,      path: '/portal/faq-admin',    section: 'Content', roles: ['superadmin','admin'] },
  { key: 'users',        label: 'User Accounts',     icon: <UserCog size={16}/>,         path: '/portal/users',        section: 'Admin',   roles: ['superadmin','admin'] },
  { key: 'permissions',  label: 'Permissions',       icon: <Shield size={16}/>,          path: '/portal/permissions',  section: 'Admin',   roles: ['superadmin'] },
  { key: 'contacts', label: 'Contact Messages', icon: <Mail size={16}/>, path: '/portal/contacts', section: 'Admin', roles: ['superadmin','admin'] },
];

export default function PortalLayout() {
  const { user, canAccess, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  if (!user) { navigate('/login'); return null; }

  const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
  const roleLabel = { superadmin: 'Super Administrator', admin: 'Administrator', staff: 'Care Staff', guardian: 'Guardian' }[user.role] || user.role;

  // Filter nav to items this role can see at all
  const visibleNav = ALL_NAV.filter(item => {
    if (item.roles && !item.roles.includes(user.role)) return false;
    return true;
  });

  const sections = [...new Set(visibleNav.map(i => i.section))];

  const roleBadgeColors: Record<string, string> = {
    superadmin: 'bg-amber-500/20 text-amber-300',
    admin: 'bg-tide-light/20 text-tide-light',
    staff: 'bg-green-500/15 text-green-300',
    guardian: 'bg-purple-500/15 text-purple-300',
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-60 bg-tide-deep flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        {/* Logo */}
        <div className="px-5 py-5 border-b border-white/8">
          <div className="font-serif text-xl text-white">Tide<span className="text-tide-light">Home</span></div>
          <div className="text-[10px] text-white/40 uppercase tracking-widest mt-1">{roleLabel}</div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3">
          {sections.map(section => (
            <div key={section}>
              <div className="px-5 pt-4 pb-1 text-[9px] font-bold text-white/30 uppercase tracking-widest">{section}</div>
              {visibleNav.filter(i => i.section === section).map(item => {
                const accessible = canAccess(item.key);
                return (
                  <NavLink
                    key={item.key}
                    to={accessible ? item.path : '#'}
                    onClick={e => !accessible && e.preventDefault()}
                    className={({ isActive }) =>
                      `nav-item ${isActive && accessible ? 'active' : ''} ${!accessible ? 'opacity-40 cursor-not-allowed' : ''}`
                    }
                  >
                    <span className="text-white/60">{item.icon}</span>
                    <span className="nav-label">{item.label}</span>
                    {!accessible && <LockIcon size={10} className="text-white/30"/>}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </nav>

        {/* User */}
        <div className="px-4 py-4 border-t border-white/8">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-full bg-tide-light flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <div className="text-white text-xs font-medium truncate">{user.firstName} {user.lastName}</div>
              <div className="text-white/40 text-[10px] truncate">{user.email}</div>
            </div>
          </div>
          <span className={`pill text-[10px] px-2 py-0.5 rounded-full mb-3 inline-block ${roleBadgeColors[user.role]}`}>{roleLabel}</span>
          <button onClick={logout} className="flex items-center gap-2 w-full text-xs text-white/50 hover:text-white/80 transition-colors mt-1">
            <LogOut size={13}/> Sign out
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)}/>}

      {/* Main */}
      <div className="flex-1 flex flex-col lg:ml-60 min-h-screen">
        {/* Topbar */}
        <header className="sticky top-0 z-30 bg-white border-b border-tide-deep/10 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="lg:hidden p-1" onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <X size={20}/> : <Menu size={20}/>}
            </button>
            <div className="relative hidden sm:block">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-tide-muted"/>
              <input className="form-input pl-8 py-1.5 w-56 text-xs" placeholder="Search residents, records…"/>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="relative p-2 rounded-lg hover:bg-tide-sand border border-tide-deep/10 transition-colors">
              <Bell size={16} className="text-tide-muted"/>
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full"/>
            </button>
            <NavLink to="/portal/profile" className="p-1.5 rounded-lg hover:bg-tide-sand border border-tide-deep/10 transition-colors">
              <div className="w-6 h-6 rounded-full bg-tide-light flex items-center justify-center text-white text-[10px] font-semibold">{initials}</div>
            </NavLink>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 bg-gray-50">
          <Outlet/>
        </main>
      </div>
    </div>
  );
}
