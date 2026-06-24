import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { contactApi } from '../../services/api';

export default function ContactPage() {
  const [form, setForm] = useState({ firstName:'', lastName:'', email:'', phone:'', subject:'', message:'' });
  const [sent, setSent] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName || !form.email || !form.message) {
      toast.error('Please fill in all required fields');
      return;
    }
    setLoading(true);
    try {
      await contactApi.submit(form);
      setSent(true);
      toast.success('Message sent! We will be in touch within 24 hours.');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-20">
      {/* HERO */}
      <div className="bg-tide-deep px-8 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-[11px] font-semibold text-tide-light uppercase tracking-widest mb-3">Get in touch</div>
          <h1 className="font-serif text-5xl text-white leading-tight mb-4">We'd love to<br/>hear from you</h1>
          <p className="text-white/60 text-base max-w-xl leading-relaxed">
            Whether you have a question, want to book a tour, or are ready to start the admission process — we're here to help.
          </p>
        </div>
      </div>

      <section className="px-8 py-20">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12">
          {/* CONTACT INFO */}
          <div>
            <h2 className="font-serif text-2xl text-tide-deep mb-6">Contact details</h2>
            <div className="space-y-3 mb-8">
              {[
                ['📍','Address','12 Riverside Close, London SE1 7PB'],
                ['📞','Main phone','+44 20 7946 0823'],
                ['✉️','Email','hello@tidehome.co.uk'],
                ['🕘','Office hours','Mon–Fri: 8am–6pm · Sat: 9am–1pm'],
              ].map(([icon,label,val]) => (
                <div key={label as string} className="flex gap-4 p-4 bg-tide-sand rounded-xl">
                  <span className="text-xl flex-shrink-0">{icon}</span>
                  <div>
                    <div className="text-[10px] font-semibold text-tide-muted uppercase tracking-wider mb-0.5">{label}</div>
                    <div className="text-sm font-medium text-tide-deep">{val}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-tide-foam rounded-xl p-5 mb-8">
              <div className="text-[10px] font-semibold text-tide-mid uppercase tracking-wider mb-1">24/7 Emergency support line</div>
              <div className="font-serif text-2xl text-tide-deep">+44 800 123 4567</div>
              <div className="text-xs text-tide-muted mt-1">Free to call, available around the clock</div>
            </div>

            <div className="card">
              <h3 className="font-serif text-lg text-tide-deep mb-3">Visiting us</h3>
              <p className="text-sm text-tide-muted leading-relaxed mb-3">
                We welcome families to visit and tour the facility. Visiting hours are <strong>9am–8pm daily</strong>. Please sign in at reception on arrival.
              </p>
              <p className="text-sm text-tide-muted leading-relaxed">
                We are located near London Bridge station (5 min walk) and have on-site parking available for visitors.
              </p>
            </div>
          </div>

          {/* CONTACT FORM */}
          <div>
            <h2 className="font-serif text-2xl text-tide-deep mb-6">Send us a message</h2>
            {sent ? (
              <div className="card text-center py-12">
                <div className="text-4xl mb-4">✅</div>
                <h3 className="font-serif text-xl text-tide-deep mb-2">Message received!</h3>
                <p className="text-tide-muted text-sm">We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="card space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="form-label">First name *</label>
                    <input className="form-input" placeholder="Ada" value={form.firstName} onChange={e => setForm({...form, firstName:e.target.value})}/>
                  </div>
                  <div>
                    <label className="form-label">Last name</label>
                    <input className="form-input" placeholder="Okafor" value={form.lastName} onChange={e => setForm({...form, lastName:e.target.value})}/>
                  </div>
                </div>
                <div>
                  <label className="form-label">Email address *</label>
                  <input type="email" className="form-input" placeholder="you@example.com" value={form.email} onChange={e => setForm({...form, email:e.target.value})}/>
                </div>
                <div>
                  <label className="form-label">Phone number</label>
                  <input type="tel" className="form-input" placeholder="+44 ..." value={form.phone} onChange={e => setForm({...form, phone:e.target.value})}/>
                </div>
                <div>
                  <label className="form-label">Subject</label>
                  <select className="form-input" value={form.subject} onChange={e => setForm({...form, subject:e.target.value})}>
                    <option value="">Select a topic…</option>
                    <option>General enquiry</option>
                    <option>Admission enquiry</option>
                    <option>Book a tour</option>
                    <option>Care packages</option>
                    <option>Existing resident</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Message *</label>
                  <textarea className="form-input" rows={5} placeholder="Tell us how we can help…" value={form.message} onChange={e => setForm({...form, message:e.target.value})}/>
                </div>
                <button type="submit" disabled={loading} className="btn btn-primary w-full justify-center py-2.5">
                  {loading ? 'Sending…' : 'Send message'}
                </button>
                <p className="text-[11px] text-tide-muted text-center">We respond to all enquiries within 24 hours during office hours.</p>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}