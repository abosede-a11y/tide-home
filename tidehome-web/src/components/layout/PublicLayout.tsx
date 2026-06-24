import React, { useState, useEffect } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export default function PublicLayout() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // Only use transparent navbar on the homepage hero
  const isHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    // Reset on route change
    setScrolled(false);
    return () => window.removeEventListener('scroll', onScroll);
  }, [location.pathname]);

  // Navbar is solid if: not homepage, OR homepage and scrolled
  const isSolid = !isHome || scrolled;

  const navLinks = [
    { to: '/about', label: 'About Us' },
    { to: '/services', label: 'Our Services' },
    { to: '/facilities', label: 'Facilities' },
    { to: '/packages', label: 'Packages' },
    { to: '/faq', label: 'FAQ' },
    { to: '/contact', label: 'Contact Us' },
  ];

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* NAVBAR */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isSolid ? 'bg-tide-deep shadow-lg py-3' : 'bg-transparent py-4'
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link to="/" className="font-serif text-xl text-white">
            Tide<span className="text-tide-light">Home</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `text-sm transition-colors ${isActive ? 'text-tide-light font-medium' : 'text-white/80 hover:text-white'}`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <Link to="/login" className="btn btn-sm bg-tide-light text-white hover:bg-tide-mid border-0">
              Member login
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden text-white p-1"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={22}/> : <Menu size={22}/>}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="lg:hidden bg-tide-deep border-t border-white/10 px-6 py-4 space-y-3">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `block text-sm py-2 transition-colors ${isActive ? 'text-tide-light font-medium' : 'text-white/80'}`
                }
              >
                {label}
              </NavLink>
            ))}
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="block btn btn-sm bg-tide-light text-white border-0 text-center mt-2"
            >
              Member login
            </Link>
          </div>
        )}
      </nav>

      {/* PAGE CONTENT */}
      <Outlet/>

      {/* FOOTER */}
      <footer className="bg-tide-deep px-8 py-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="font-serif text-xl text-white mb-2">Tide<span className="text-tide-light">Home</span></div>
              <p className="text-white/50 text-xs leading-relaxed">Compassionate care, driven by purpose. Serving families across the region for over 15 years.</p>
            </div>
            <div>
              <div className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-3">Quick links</div>
              {navLinks.map(({ to, label }) => (
                <Link key={to} to={to} className="block text-white/50 text-xs hover:text-white/80 transition-colors py-1">{label}</Link>
              ))}
            </div>
            <div>
              <div className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-3">Services</div>
              {['Rehabilitation','Live-in Care','Dementia Care','End of Life Care','Complex Care','Learning Disabilities'].map(s => (
                <Link key={s} to="/services" className="block text-white/50 text-xs hover:text-white/80 transition-colors py-1">{s}</Link>
              ))}
            </div>
            <div>
              <div className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-3">Contact</div>
              <div className="text-white/50 text-xs space-y-2">
                <p>12 Riverside Close</p>
                <p>London SE1 7PB</p>
                <p className="pt-1">+44 20 7946 0823</p>
                <p>hello@tidehome.co.uk</p>
                <p className="pt-1 text-tide-light font-medium">24/7: +44 800 123 4567</p>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 pt-6 flex flex-wrap items-center justify-between gap-4">
            <div className="text-xs text-white/30">© 2025 Tide Home Care Services Ltd. All rights reserved.</div>
            <Link to="/login" className="text-xs text-white/30 hover:text-white/60 transition-colors">Member portal →</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}