import React from 'react';
import { Link } from 'react-router-dom';

const packages = [
  {
    name: 'Standard Care',
    price: '£1,200',
    per: 'week',
    sub: 'For independent residents',
    popular: false,
    features: [
      'Daily personal care support',
      '3 chef-prepared meals + 2 snacks',
      'Weekly GP review',
      'Social activities programme',
      'Family portal access',
      'Emergency call system',
      '24-hour staff on duty',
    ],
    notIncluded: ['Specialist nursing','Hospital transport','Physiotherapy sessions'],
  },
  {
    name: 'Enhanced Care',
    price: '£1,750',
    per: 'week',
    sub: 'For complex care needs',
    popular: true,
    features: [
      'All Standard Care features',
      'Specialist nursing support',
      'Medication management',
      'Physiotherapy sessions (3x/week)',
      'Hospital transport included',
      'Monthly care plan reviews',
      'Priority room allocation',
    ],
    notIncluded: ['1-to-1 dedicated carer','Private garden room'],
  },
  {
    name: 'Premium Care',
    price: '£2,400',
    per: 'week',
    sub: 'For high-dependency needs',
    popular: false,
    features: [
      'All Enhanced Care features',
      '1-to-1 dedicated carer',
      'Specialist dementia/autism support',
      'Daily family video updates',
      'Private room with garden view',
      'Unlimited family visits',
      'Weekly consultant review',
    ],
    notIncluded: [],
  },
];

export default function PackagesPage() {
  return (
    <div className="pt-20">
      {/* HERO */}
      <div className="bg-tide-deep px-8 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-[11px] font-semibold text-tide-light uppercase tracking-widest mb-3">Care packages</div>
          <h1 className="font-serif text-5xl text-white leading-tight mb-4">Transparent pricing,<br/>genuine value</h1>
          <p className="text-white/60 text-base max-w-xl leading-relaxed">
            All packages include 24/7 staff support, weekly reviews, and full access to our facilities. No hidden fees.
          </p>
        </div>
      </div>

      {/* PACKAGES */}
      <section className="px-8 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {packages.map(pkg => (
              <div key={pkg.name} className={`card flex flex-col ${pkg.popular ? 'border-2 border-tide-mid ring-1 ring-tide-mid/20' : ''}`}>
                {pkg.popular && (
                  <div className="inline-block bg-tide-foam text-tide-mid text-[10px] font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-wider self-start">
                    Most popular
                  </div>
                )}
                <div className="font-serif text-2xl text-tide-deep mb-1">{pkg.name}</div>
                <div className="text-xs text-tide-muted mb-4">{pkg.sub}</div>
                <div className="mb-6">
                  <span className="font-serif text-4xl text-tide-deep">{pkg.price}</span>
                  <span className="text-sm text-tide-muted">/{pkg.per}</span>
                </div>

                <div className="flex-1">
                  <div className="text-xs font-semibold text-tide-deep uppercase tracking-wider mb-3">What's included</div>
                  <ul className="space-y-2 mb-6">
                    {pkg.features.map(f => (
                      <li key={f} className="flex items-start gap-2 text-sm text-tide-muted">
                        <span className="text-tide-success font-bold text-xs mt-0.5 flex-shrink-0">✓</span>{f}
                      </li>
                    ))}
                  </ul>
                  {pkg.notIncluded.length > 0 && (
                    <>
                      <div className="text-xs font-semibold text-tide-muted uppercase tracking-wider mb-3">Not included</div>
                      <ul className="space-y-2 mb-6">
                        {pkg.notIncluded.map(f => (
                          <li key={f} className="flex items-start gap-2 text-sm text-tide-muted/50">
                            <span className="font-bold text-xs mt-0.5 flex-shrink-0">✗</span>{f}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>

                <Link
                  to="/contact"
                  className={`btn w-full justify-center mt-4 ${pkg.popular ? 'btn-primary' : 'btn-secondary'}`}
                >
                  Book a consultation
                </Link>
              </div>
            ))}
          </div>

          {/* NOTES */}
          <div className="bg-tide-sand rounded-xl p-6 grid md:grid-cols-3 gap-6">
            {[
              ['💳','Flexible payment','We accept bank transfer, direct debit, and major cards. Payment records are available in the member portal.'],
              ['🔄','Change anytime','Packages can be upgraded or changed at any time following a care review. Changes take effect the next billing cycle.'],
              ['📋','Free assessment','All new residents receive a free care needs assessment before admission to ensure the right package is selected.'],
            ].map(([icon, title, desc]) => (
              <div key={title as string} className="flex gap-3">
                <span className="text-2xl flex-shrink-0">{icon}</span>
                <div>
                  <div className="font-medium text-tide-deep text-sm mb-1">{title}</div>
                  <p className="text-xs text-tide-muted leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}