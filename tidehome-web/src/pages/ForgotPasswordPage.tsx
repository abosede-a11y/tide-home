import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authApi } from '../services/api';
import { ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await authApi.forgotPassword(email);
      setSent(true);
    } catch {
      setSent(true); // still show success to avoid email enumeration
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

        {sent ? (
          <div className="card text-center">
            <div className="text-4xl mb-4">📧</div>
            <h2 className="font-serif text-xl text-tide-deep mb-2">Check your email</h2>
            <p className="text-tide-muted text-sm mb-6 leading-relaxed">
              If that email address exists in our system, a password reset link has been sent. Check your inbox and spam folder.
            </p>
            <Link to="/login" className="btn btn-primary w-full justify-center">
              Back to login
            </Link>
          </div>
        ) : (
          <div className="card">
            <Link to="/login" className="flex items-center gap-2 text-tide-muted text-sm mb-6 hover:text-tide-deep transition-colors">
              <ArrowLeft size={14}/> Back to login
            </Link>
            <h2 className="font-serif text-xl text-tide-deep mb-1">Reset your password</h2>
            <p className="text-tide-muted text-sm mb-6">
              Enter your email address and we'll send you a reset link.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="form-label">Email address</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="you@tidehome.co.uk"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  autoComplete="email"
                  autoFocus
                />
              </div>
              <button
                type="submit"
                disabled={loading || !email}
                className="btn btn-primary w-full justify-center py-2.5"
              >
                {loading ? 'Sending…' : 'Send reset link'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}