import React, { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { authApi } from '../services/api';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-tide-sand px-4">
        <div className="card text-center max-w-sm w-full">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="font-serif text-xl text-tide-deep mb-2">Invalid reset link</h2>
          <p className="text-tide-muted text-sm mb-6">This password reset link is invalid or has expired.</p>
          <Link to="/login" className="btn btn-primary w-full justify-center">Back to login</Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) { toast.error('Passwords do not match'); return; }
    if (password.length < 8) { toast.error('Password must be at least 8 characters'); return; }
    setLoading(true);
    try {
      await authApi.resetPassword(token, password);
      setDone(true);
      toast.success('Password reset successfully!');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Reset link is invalid or expired');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-tide-sand px-4">
      <div className="w-full max-w-sm">
        <div className="font-serif text-2xl text-tide-deep text-center mb-8">
          Tide<span className="text-tide-light">Home</span>
        </div>

        {done ? (
          <div className="card text-center">
            <div className="text-4xl mb-4">✅</div>
            <h2 className="font-serif text-xl text-tide-deep mb-2">Password reset!</h2>
            <p className="text-tide-muted text-sm mb-6">Your password has been updated. Redirecting you to login…</p>
            <Link to="/login" className="btn btn-primary w-full justify-center">Go to login</Link>
          </div>
        ) : (
          <div className="card">
            <Link to="/login" className="flex items-center gap-2 text-tide-muted text-sm mb-6 hover:text-tide-deep transition-colors">
              <ArrowLeft size={14}/> Back to login
            </Link>
            <h2 className="font-serif text-xl text-tide-deep mb-1">Set new password</h2>
            <p className="text-tide-muted text-sm mb-6">Choose a strong password for your Tide Home account.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="form-label">New password</label>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'}
                    className="form-input pr-10"
                    placeholder="Min. 8 characters"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    autoFocus
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-tide-muted hover:text-tide-deep transition-colors">
                    {showPw ? <EyeOff size={15}/> : <Eye size={15}/>}
                  </button>
                </div>
              </div>
              <div>
                <label className="form-label">Confirm new password</label>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'}
                    className="form-input pr-10"
                    placeholder="Re-enter password"
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                  />
                </div>
                {confirm && password !== confirm && (
                  <p className="text-[11px] text-red-500 mt-1.5">✗ Passwords do not match</p>
                )}
                {confirm && password === confirm && password.length >= 8 && (
                  <p className="text-[11px] text-tide-success mt-1.5">✓ Passwords match</p>
                )}
              </div>
              <button
                type="submit"
                disabled={loading || !password || !confirm}
                className="btn btn-primary w-full justify-center py-2.5"
              >
                {loading ? 'Resetting…' : 'Reset password'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}