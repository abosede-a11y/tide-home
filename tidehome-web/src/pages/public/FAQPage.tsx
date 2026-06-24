import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { faqApi } from '../../services/api';
import { Link } from 'react-router-dom';

const defaultFaqs = [
  { id:'1', question:'How do I register a family member as a resident?', answer:'Contact our admissions team via the Contact Us page or call our helpline. An assessment visit will be arranged and our admin team will complete registration, including creating portal login credentials that are emailed to you.' },
  { id:'2', question:'How are medications managed and tracked?', answer:'Our care staff log every medication round on the Tide Home platform. Guardians can view the medication status of their loved one in real time through the member portal. All records are maintained to CQC standards.' },
  { id:'3', question:'Can I change my care package after admission?', answer:'Yes. Packages can be upgraded or changed at any time following a care review meeting with our nursing team. Changes take effect from the next billing cycle.' },
  { id:'4', question:'What payment methods do you accept?', answer:'We accept bank transfer, direct debit, and major debit/credit cards. All payment records and receipts are accessible through the member portal. Please note we do not accept cash payments.' },
  { id:'5', question:'How do guardian portal accounts work?', answer:'Once a resident is registered, the admin team creates a guardian account and emails login credentials. Guardians can view progress updates, medications, appointments, and payment history. Account details can be changed after first login.' },
  { id:'6', question:'What visiting hours are available?', answer:'Visiting hours are 9am–8pm daily. Extended or out-of-hours visits can be arranged for exceptional circumstances by contacting the home manager. All visitors must sign in at reception.' },
  { id:'7', question:'Is Tide Home CQC registered?', answer:'Yes, Tide Home is fully registered with and regulated by the Care Quality Commission (CQC). Our most recent inspection report is available on request.' },
  { id:'8', question:'What happens in a medical emergency?', answer:'We have trained nursing staff on duty 24 hours a day. In any medical emergency, our team acts immediately, contacting emergency services and the resident\'s next of kin as quickly as possible.' },
];

export default function FAQPage() {
  const [open, setOpen] = useState<string|null>(null);
  const { data: faqs = [] } = useQuery({ queryKey: ['faq-public'], queryFn: faqApi.getPublic });

  const displayFaqs = faqs.length > 0 ? faqs : defaultFaqs;

  return (
    <div className="pt-20">
      {/* HERO */}
      <div className="bg-tide-deep px-8 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-[11px] font-semibold text-tide-light uppercase tracking-widest mb-3">FAQ</div>
          <h1 className="font-serif text-5xl text-white leading-tight mb-4">Got questions?<br/>We have answers</h1>
          <p className="text-white/60 text-base max-w-xl leading-relaxed">
            Everything families and prospective clients need to know before choosing Tide Home.
          </p>
        </div>
      </div>

      {/* FAQ LIST */}
      <section className="px-8 py-20">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-2">
            {displayFaqs.map((f: any) => (
              <div key={f.id} className={`border rounded-xl overflow-hidden transition-all ${open === f.id ? 'border-tide-mid' : 'border-tide-deep/10'}`}>
                <button
                  className="w-full px-6 py-4 text-left flex items-center justify-between text-sm font-medium text-tide-deep hover:bg-tide-sand/50 transition-colors"
                  onClick={() => setOpen(open === f.id ? null : f.id)}
                >
                  {f.question}
                  <span className={`text-tide-muted transition-transform duration-200 inline-block flex-shrink-0 ml-4 ${open === f.id ? 'rotate-180' : ''}`}>▼</span>
                </button>
                {open === f.id && (
                  <div className="px-6 pb-5 text-sm text-tide-muted leading-relaxed border-t border-tide-deep/5 pt-4">
                    {f.answer}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 card text-center">
            <h3 className="font-serif text-xl text-tide-deep mb-2">Still have questions?</h3>
            <p className="text-tide-muted text-sm mb-5">Our team is happy to answer any questions you have about care at Tide Home.</p>
            <Link to="/contact" className="btn btn-primary">Contact us →</Link>
          </div>
        </div>
      </section>
    </div>
  );
}