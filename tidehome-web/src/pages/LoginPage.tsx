import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../services/api';
import toast from 'react-hot-toast';
import { Eye, EyeOff, ArrowLeft, LogIn, UserPlus, CheckCircle, XCircle, Loader } from 'lucide-react';

type Tab = 'login' | 'register';
type UsernameStatus = 'idle' | 'checking' | 'available' | 'taken';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('login');

  // Login form
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [showLoginPw, setShowLoginPw] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  // Register form
  const [regForm, setRegForm] = useState({
    firstName: '', lastName: '', email: '',
    username: '', password: '', confirmPassword: '', registrationKey: '',
  });
  const [showRegPw, setShowRegPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [showRegKey, setShowRegKey] = useState(false);
  const [regLoading, setRegLoading] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState<UsernameStatus>('idle');
  const usernameTimer = useRef<ReturnType<typeof setTimeout>>();

  // Live username check with 600ms debounce
  useEffect(() => {
    const raw = regForm.username.trim();
    if (!raw) { setUsernameStatus('idle'); return; }
    if (raw.length < 3) { setUsernameStatus('idle'); return; }

    setUsernameStatus('checking');
    clearTimeout(usernameTimer.current);
    usernameTimer.current = setTimeout(async () => {
      try {
        const { available } = await authApi.checkUsername(raw);
        setUsernameStatus(available ? 'available' : 'taken');
      } catch {
        setUsernameStatus('idle');
      }
    }, 600);

    return () => clearTimeout(usernameTimer.current);
  }, [regForm.username]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!loginForm.email || !loginForm.password) { toast.error('Please enter email and password'); return; }
    setLoginLoading(true);
    try {
      await login(loginForm.email, loginForm.password);
      toast.success('Welcome back!');
      navigate('/portal/dashboard');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoginLoading(false);
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (!regForm.firstName || !regForm.lastName || !regForm.email || !regForm.username || !regForm.password) {
      toast.error('Please fill in all fields'); return;
    }
    if (regForm.username.trim().length < 3) {
      toast.error('Username must be at least 3 characters'); return;
    }
    if (usernameStatus === 'taken') {
      toast.error('That username is already taken'); return;
    }
    if (usernameStatus === 'checking') {
      toast.error('Please wait — checking username availability'); return;
    }
    if (regForm.password !== regForm.confirmPassword) {
      toast.error('Passwords do not match'); return;
    }
    if (regForm.password.length < 8) {
      toast.error('Password must be at least 8 characters'); return;
    }
    if (!regForm.registrationKey) {
      toast.error('Registration key is required'); return;
    }

    setRegLoading(true);
    try {
      const { accessToken, user } = await authApi.registerAdmin({
        firstName: regForm.firstName,
        lastName: regForm.lastName,
        email: regForm.email,
        username: regForm.username.trim().toLowerCase(),
        password: regForm.password,
        registrationKey: regForm.registrationKey,
      });
      localStorage.setItem('tidehome_token', accessToken);
      localStorage.setItem('tidehome_user', JSON.stringify(user));
      toast.success(`Welcome, ${user.firstName}! Your admin account is ready.`);
      navigate('/portal/dashboard');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Registration failed');
    } finally {
      setRegLoading(false);
    }
  }

  const UsernameIndicator = () => {
    if (regForm.username.trim().length < 3) return null;
    if (usernameStatus === 'checking') return <Loader size={15} className="animate-spin text-tide-muted"/>;
    if (usernameStatus === 'available') return <CheckCircle size={15} className="text-tide-success"/>;
    if (usernameStatus === 'taken') return <XCircle size={15} className="text-red-500"/>;
    return null;
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-center bg-tide-deep px-12 py-16 relative overflow-hidden">
        <div className="absolute w-96 h-96 rounded-full bg-white/3 -top-24 -right-16"/>
        <div className="absolute w-64 h-64 rounded-full bg-white/4 bottom-16 left-8"/>
        <Link to="/" className="flex items-center gap-2 text-white/50 text-sm mb-12 hover:text-white/80 transition-colors relative z-10">
          <ArrowLeft size={14}/> Back to website
        </Link>
        <div className="relative z-10">
          <div className="font-serif text-3xl text-white mb-2">Tide<span className="text-tide-light">Home</span></div>
          <h2 className="font-serif text-4xl text-white leading-tight mb-4">
            Care that stays close,<br/>wherever you are
          </h2>
          <p className="text-white/60 text-sm leading-relaxed mb-8">
            Securely access resident updates, medical records, and care management tools — designed for families and care professionals alike.
          </p>
          <div className="bg-white/8 border border-white/12 rounded-xl p-5">
            <p className="text-white/70 text-sm italic leading-relaxed mb-3">
              "I can check on my mother's medication and appointments before bed every night. The peace of mind is priceless."
            </p>
            <span className="text-white/40 text-xs">— Guardian, Tide Home member</span>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex flex-col items-center justify-center px-8 py-12 bg-white min-h-screen">
        <div className="w-full max-w-sm">
          <Link to="/" className="lg:hidden flex items-center gap-2 text-tide-muted text-sm mb-8 hover:text-tide-deep transition-colors">
            <ArrowLeft size={14}/> Back to website
          </Link>

          {/* Tab switcher */}
          <div className="flex rounded-xl border border-tide-deep/12 overflow-hidden mb-8 bg-tide-sand">
            <button
              onClick={() => setTab('login')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-all ${tab === 'login' ? 'bg-tide-deep text-white' : 'text-tide-muted hover:text-tide-deep'}`}
            >
              <LogIn size={14}/> Sign in
            </button>
            <button
              onClick={() => setTab('register')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-all ${tab === 'register' ? 'bg-tide-deep text-white' : 'text-tide-muted hover:text-tide-deep'}`}
            >
              <UserPlus size={14}/> Register
            </button>
          </div>

          {/* ── LOGIN ── */}
          {tab === 'login' && (
            <>
              <div className="font-serif text-2xl text-tide-deep mb-1">Welcome back</div>
              <p className="text-tide-muted text-sm mb-7">Sign in to your Tide Home account</p>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="form-label">Email address</label>
                  <input
                    type="email" className="form-input" placeholder="you@tidehome.co.uk"
                    value={loginForm.email} onChange={e => setLoginForm({ ...loginForm, email: e.target.value })}
                    autoComplete="email"
                  />
                </div>
                <div>
                  <label className="form-label">Password</label>
                  <div className="relative">
                    <input
                      type={showLoginPw ? 'text' : 'password'} className="form-input pr-10" placeholder="••••••••"
                      value={loginForm.password} onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
                      autoComplete="current-password"
                    />
                    <button type="button" onClick={() => setShowLoginPw(!showLoginPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-tide-muted hover:text-tide-deep transition-colors">
                      {showLoginPw ? <EyeOff size={15}/> : <Eye size={15}/>}
                    </button>
                  </div>
                </div>
                <button type="submit" disabled={loginLoading} className="btn btn-primary w-full py-2.5 text-sm justify-center">
                  {loginLoading ? 'Signing in…' : 'Sign in to portal'}
                </button>
              </form>

              <div className="mt-4 text-center">
                <Link to="/forgot-password" className="text-xs text-tide-mid hover:text-tide-deep transition-colors">
                  Forgot your password?
                </Link>
              </div>
              <p className="text-xs text-tide-muted text-center mt-5 leading-relaxed">
                Not an admin? Accounts are created by an administrator.<br/>Login credentials are sent to you via email.
              </p>
            </>
          )}

          {/* ── REGISTER ── */}
          {tab === 'register' && (
            <>
              <div className="font-serif text-2xl text-tide-deep mb-1">Create admin account</div>
              <p className="text-tide-muted text-sm mb-7">Register as an administrator using your registration key</p>

              <form onSubmit={handleRegister} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="form-label">First name</label>
                    <input className="form-input" placeholder="Ada"
                      value={regForm.firstName} onChange={e => setRegForm({ ...regForm, firstName: e.target.value })}/>
                  </div>
                  <div>
                    <label className="form-label">Last name</label>
                    <input className="form-input" placeholder="Okafor"
                      value={regForm.lastName} onChange={e => setRegForm({ ...regForm, lastName: e.target.value })}/>
                  </div>
                </div>

                <div>
                  <label className="form-label">Username</label>
                  <div className="relative">
                    <input
                      className={`form-input pr-10 ${usernameStatus === 'taken' ? 'border-red-400 focus:border-red-400 focus:ring-red-100' : usernameStatus === 'available' ? 'border-green-400 focus:border-green-400 focus:ring-green-100' : ''}`}
                      placeholder="e.g. adaokafor"
                      value={regForm.username}
                      onChange={e => setRegForm({ ...regForm, username: e.target.value.replace(/\s/g, '').toLowerCase() })}
                      autoComplete="username"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <UsernameIndicator/>
                    </div>
                  </div>
                  <div className="mt-1.5 min-h-[18px]">
                    {usernameStatus === 'available' && (
                      <p className="text-[11px] text-tide-success">✓ Username is available</p>
                    )}
                    {usernameStatus === 'taken' && (
                      <p className="text-[11px] text-red-500">✗ Username already taken — choose another</p>
                    )}
                    {usernameStatus === 'idle' && regForm.username.length > 0 && regForm.username.length < 3 && (
                      <p className="text-[11px] text-tide-muted">Username must be at least 3 characters</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="form-label">Email address</label>
                  <input type="email" className="form-input" placeholder="you@tidehome.co.uk"
                    value={regForm.email} onChange={e => setRegForm({ ...regForm, email: e.target.value })}
                    autoComplete="email"/>
                </div>

                <div>
                  <label className="form-label">Password</label>
                  <div className="relative">
                    <input
                      type={showRegPw ? 'text' : 'password'} className="form-input pr-10" placeholder="Min. 8 characters"
                      value={regForm.password} onChange={e => setRegForm({ ...regForm, password: e.target.value })}
                      autoComplete="new-password"
                    />
                    <button type="button" onClick={() => setShowRegPw(!showRegPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-tide-muted hover:text-tide-deep transition-colors">
                      {showRegPw ? <EyeOff size={15}/> : <Eye size={15}/>}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="form-label">Confirm password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPw ? 'text' : 'password'} className="form-input pr-10" placeholder="Re-enter password"
                      value={regForm.confirmPassword} onChange={e => setRegForm({ ...regForm, confirmPassword: e.target.value })}
                    />
                    <button type="button" onClick={() => setShowConfirmPw(!showConfirmPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-tide-muted hover:text-tide-deep transition-colors">
                      {showConfirmPw ? <EyeOff size={15}/> : <Eye size={15}/>}
                    </button>
                  </div>
                  {regForm.confirmPassword && regForm.password !== regForm.confirmPassword && (
                    <p className="text-[11px] text-red-500 mt-1.5">✗ Passwords do not match</p>
                  )}
                  {regForm.confirmPassword && regForm.password === regForm.confirmPassword && regForm.password.length >= 8 && (
                    <p className="text-[11px] text-tide-success mt-1.5">✓ Passwords match</p>
                  )}
                </div>

                <div>
                  <label className="form-label">Admin registration key</label>
                  <div className="relative">
                    <input
                      type={showRegKey ? 'text' : 'password'} className="form-input pr-10" placeholder="Enter registration secret"
                      value={regForm.registrationKey} onChange={e => setRegForm({ ...regForm, registrationKey: e.target.value })}
                    />
                    <button type="button" onClick={() => setShowRegKey(!showRegKey)} className="absolute right-3 top-1/2 -translate-y-1/2 text-tide-muted hover:text-tide-deep transition-colors">
                      {showRegKey ? <EyeOff size={15}/> : <Eye size={15}/>}
                    </button>
                  </div>
                  <p className="text-[11px] text-tide-muted mt-1.5">
                    🔑 Contact your Super Admin for this key.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={regLoading || usernameStatus === 'taken' || usernameStatus === 'checking'}
                  className="btn btn-primary w-full py-2.5 text-sm justify-center"
                >
                  {regLoading ? 'Creating account…' : 'Create admin account'}
                </button>
              </form>

              <p className="text-xs text-tide-muted text-center mt-5">
                Already have an account?{' '}
                <button onClick={() => setTab('login')} className="text-tide-mid hover:text-tide-deep transition-colors">
                  Sign in here
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
