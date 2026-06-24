import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { blogApi, faqApi } from '../../services/api';

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const { data: faqs = [] } = useQuery({ queryKey: ['faq-public'], queryFn: faqApi.getPublic });
  const { data: posts = [] } = useQuery({ queryKey: ['blog-public'], queryFn: blogApi.getPublic });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* NAV */}
      <nav className={`fixed top-0 left-0 right-0 z-50 px-8 py-4 flex items-center justify-between transition-all duration-300 ${
        scrolled ? 'bg-tide-deep shadow-lg py-3' : 'bg-transparent'
      }`}>
        <div className="font-serif text-xl text-white">Tide<span className="text-tide-light">Home</span></div>
        <div className="hidden md:flex items-center gap-6 text-sm">
          {['About','Services','Facilities','Packages','FAQ','Contact'].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} className="text-white/80 hover:text-white transition-colors">{l}</a>
          ))}
          <a href="#portal" className="text-white/30 flex items-center gap-1 cursor-not-allowed" title="Login required">🔒 Portal</a>
        </div>
        <Link to="/login" className="btn btn-sm bg-tide-light text-white hover:bg-tide-mid border-0 text-sm">Member login</Link>
      </nav>

      {/* HERO - add pt for fixed nav */}
      <section className="min-h-screen bg-gradient-to-br from-tide-deep via-tide-mid to-[#1A8A7A] flex items-center px-8 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute w-[550px] h-[550px] rounded-full bg-white/3 -top-32 -right-24"/>
          <div className="absolute w-72 h-72 rounded-full bg-white/4 bottom-16 left-[8%]"/>
        </div>
        <div className="max-w-2xl z-10 pt-20">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-4 py-1.5 mb-7">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"/>
            <span className="text-[11px] font-medium text-white/85 uppercase tracking-widest">Trusted care management</span>
          </div>
          <h1 className="font-serif text-5xl text-white leading-tight mb-5">Where every resident <em className="text-tide-light">feels</em> close to home</h1>
          <p className="text-white/70 text-base leading-relaxed mb-8 max-w-lg">Tide Home brings care home operations, resident records, and family connections into one secure, beautifully simple platform.</p>
          <div className="flex gap-3 flex-wrap">
            <a href="#packages" className="btn btn-lg bg-white text-tide-deep hover:bg-tide-foam font-semibold border-0">View packages</a>
            <a href="#about" className="btn btn-lg bg-transparent text-white border border-white/30 hover:bg-white/10">Learn more</a>
          </div>
        </div>
      </section>

      {/* STATS */}
      <div className="bg-tide-sand px-8 py-10 grid grid-cols-2 md:grid-cols-4 gap-6 border-b border-tide-deep/10">
        {[['98%','Family satisfaction'],['24/7','Real-time updates'],['500+','Residents managed'],['15+','Years of care']].map(([n,l]) => (
          <div key={l} className="text-center"><div className="font-serif text-3xl text-tide-deep mb-1">{n}</div><div className="text-[11px] text-tide-muted uppercase tracking-wider">{l}</div></div>
        ))}
      </div>

      {/* ABOUT */}
      <section id="about" className="px-8 py-20">
        <div className="text-[11px] font-semibold text-tide-light uppercase tracking-widest mb-3">About Tide Home</div>
        <h2 className="font-serif text-4xl text-tide-deep mb-3">Compassionate care,<br/>driven by purpose</h2>
        <p className="text-tide-muted mb-10 max-w-lg">Founded on the belief that every individual deserves dignity, warmth, and expert care — serving families for over 15 years.</p>
        <div className="grid md:grid-cols-3 gap-5 mb-12">
          {[['🎯','Our Mission','To provide exceptional, person-centred care that preserves dignity and promotes independence for every resident.'],['🔭','Our Vision','To be the most trusted care home network, setting the standard for compassionate, technology-supported care.'],['📍','Our Location','12 Riverside Close, London SE1 7PB. Accessible by public transport with ample visitor parking on-site.']].map(([i,t,d]) => (
            <div key={t} className="card"><div className="text-2xl mb-3">{i}</div><h3 className="font-serif text-lg text-tide-deep mb-2">{t}</h3><p className="text-sm text-tide-muted leading-relaxed">{d}</p></div>
          ))}
        </div>
        <div className="text-[11px] font-semibold text-tide-light uppercase tracking-widest mb-4">Meet the team</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[['AO','Dr. Ada Okafor','Medical Director'],['JE','James Eze','Head of Care'],['FN','Florence Nwosu','Lead Nurse'],['BI','Beatrice Ibeh','Resident Liaison']].map(([i,n,r]) => (
            <div key={n} className="card text-center"><div className="w-14 h-14 rounded-full bg-tide-foam flex items-center justify-center font-serif text-xl text-tide-deep mx-auto mb-3">{i}</div><div className="font-medium text-sm text-tide-deep">{n}</div><div className="text-xs text-tide-muted">{r}</div></div>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="px-8 py-20 bg-tide-sand">
        <div className="text-[11px] font-semibold text-tide-light uppercase tracking-widest mb-3">What we offer</div>
        <h2 className="font-serif text-4xl text-tide-deep mb-3">Specialist care for every need</h2>
        <p className="text-tide-muted mb-10 max-w-lg">Our team delivers a full spectrum of care services, each tailored to the unique needs of the individual.</p>
        <div className="grid md:grid-cols-3 gap-5">
          {[['🏥','Rehabilitation services','Structured recovery with physiotherapy, occupational therapy, and daily progress tracking.'],['🏠','Live-in care','Around-the-clock dedicated support ensuring continuous care and companionship.'],['🧠','Dementia care','Specialist memory care with trained staff, sensory activities, and family integration.'],['🌟','Learning disabilities & autism','Complex care with tailored routines, communication aids, and specialist support.'],['💚','End of life care','Compassionate palliative care focused on comfort, dignity, and emotional support.'],['⚕️','Complex care','Advanced medical support for high-dependency residents by specialist nurses.']].map(([i,t,d]) => (
            <div key={t} className="card hover:-translate-y-0.5 hover:shadow-sm transition-all"><div className="text-2xl mb-3">{i}</div><h3 className="font-serif text-base text-tide-deep mb-1.5">{t}</h3><p className="text-sm text-tide-muted leading-relaxed">{d}</p></div>
          ))}
        </div>
      </section>

      {/* FACILITIES */}
      <section id="facilities" className="px-8 py-20">
        <div className="text-[11px] font-semibold text-tide-light uppercase tracking-widest mb-3">Our facilities</div>
        <h2 className="font-serif text-4xl text-tide-deep mb-10">A place that truly feels like home</h2>
        <div className="grid md:grid-cols-3 gap-5">
          {[['🛏️','Resident rooms','Spacious en-suite rooms with natural light and personalised décor.'],['🌿','Garden spaces','Accessible landscaped gardens with seating areas and walking paths.'],['🍽️','Dining & nutrition','Chef-prepared meals with full dietary accommodations available.'],['🏋️','Physiotherapy suite','Fully equipped rehabilitation gym with qualified physiotherapists.'],['📚','Activity lounge','A vibrant space for group activities, arts, crafts, and family visits.'],['🔒','24/7 Security','CCTV monitoring, keypad access, and dedicated night staff.']].map(([i,t,d]) => (
            <div key={t} className="rounded-xl border border-tide-deep/10 overflow-hidden">
              <div className="h-36 bg-gradient-to-br from-tide-foam to-tide-sand flex items-center justify-center text-4xl">{i}</div>
              <div className="p-4"><h4 className="font-medium text-tide-deep mb-1">{t}</h4><p className="text-xs text-tide-muted leading-relaxed">{d}</p></div>
            </div>
          ))}
        </div>
      </section>

      {/* PACKAGES */}
      <section id="packages" className="px-8 py-20 bg-tide-sand">
        <div className="text-[11px] font-semibold text-tide-light uppercase tracking-widest mb-3">Care packages</div>
        <h2 className="font-serif text-4xl text-tide-deep mb-10">Transparent pricing, genuine value</h2>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { name:'Standard Care', price:'£1,200', sub:'For independent residents', features:['Daily personal care','3 meals + 2 snacks','Weekly GP review','Social activities','Family portal access'], popular:false },
            { name:'Enhanced Care', price:'£1,750', sub:'For complex care needs', features:['All Standard features','Specialist nursing','Medication management','Physio 3x/week','Hospital transport'], popular:true },
            { name:'Premium Care', price:'£2,400', sub:'For high-dependency needs', features:['All Enhanced features','1-to-1 carer','Dementia/autism support','Daily family updates','Private garden room'], popular:false },
          ].map(pkg => (
            <div key={pkg.name} className={`card text-center ${pkg.popular ? 'border-2 border-tide-mid' : ''}`}>
              {pkg.popular && <div className="inline-block bg-tide-foam text-tide-mid text-[10px] font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-wider">Most popular</div>}
              <div className="font-serif text-xl text-tide-deep mb-1">{pkg.name}</div>
              <div className="text-xs text-tide-muted mb-3">{pkg.sub}</div>
              <div className="font-semibold text-3xl text-tide-deep mb-0.5">{pkg.price}<span className="text-sm font-normal text-tide-muted">/week</span></div>
              <ul className="text-left my-5 space-y-2">
                {pkg.features.map(f => <li key={f} className="text-sm text-tide-muted flex items-center gap-2"><span className="text-tide-success font-bold text-xs">✓</span>{f}</li>)}
              </ul>
              <Link to="/login" className={`btn w-full justify-center ${pkg.popular ? 'btn-primary' : 'btn-secondary'}`}>Book a consultation</Link>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="px-8 py-20">
        <div className="text-[11px] font-semibold text-tide-light uppercase tracking-widest mb-3">FAQ</div>
        <h2 className="font-serif text-4xl text-tide-deep mb-10">Got questions? We have answers</h2>
        <div className="max-w-2xl space-y-2">
          {(faqs.length ? faqs : [
            { id:'1', question:'How do I register a family member?', answer:'Contact our admissions team via the Contact Us page or call our helpline. Our admin team will complete registration and email login credentials to you.' },
            { id:'2', question:'How are medications managed?', answer:'Our care staff log every medication round on the Tide Home platform. Guardians can view medication status in real time through the member portal.' },
            { id:'3', question:'Can I change my care package after admission?', answer:'Yes. Packages can be upgraded at any time following a care review meeting. Changes take effect from the next billing cycle.' },
          ]).map((f: any) => (
            <div key={f.id} className={`border rounded-lg overflow-hidden ${openFaq===f.id ? 'border-tide-mid' : 'border-tide-deep/10'}`}>
              <button className="w-full px-5 py-4 text-left flex items-center justify-between text-sm font-medium text-tide-deep hover:bg-tide-sand/50 transition-colors"
                onClick={() => setOpenFaq(openFaq===f.id ? null : f.id)}>
                {f.question}
                <span className={`text-tide-muted transition-transform duration-200 inline-block ${openFaq===f.id ? 'rotate-180' : ''}`}>▼</span>
              </button>
              {openFaq===f.id && <div className="px-5 pb-4 text-sm text-tide-muted leading-relaxed">{f.answer}</div>}
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="px-8 py-20 bg-tide-sand">
        <div className="text-[11px] font-semibold text-tide-light uppercase tracking-widest mb-3">Get in touch</div>
        <h2 className="font-serif text-4xl text-tide-deep mb-10">We'd love to hear from you</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            {[['📍','Address','12 Riverside Close, London SE1 7PB'],['📞','Phone','+44 20 7946 0823'],['✉️','Email','hello@tidehome.co.uk'],['🕘','Office hours','Mon–Fri 8am–6pm · Sat 9am–1pm']].map(([i,l,v]) => (
              <div key={l} className="flex gap-3 p-3 bg-white rounded-lg border border-tide-deep/10 mb-2">
                <span className="text-xl">{i}</span>
                <div><div className="text-[10px] font-semibold text-tide-muted uppercase tracking-wider">{l}</div><div className="text-sm text-tide-deep">{v}</div></div>
              </div>
            ))}
            <div className="mt-4 p-4 bg-tide-foam rounded-lg">
              <div className="text-[10px] font-semibold text-tide-mid uppercase tracking-wider mb-1">24/7 Support line</div>
              <div className="font-semibold text-xl text-tide-deep">+44 800 123 4567</div>
            </div>
          </div>
          <div className="card">
            <h3 className="font-serif text-lg text-tide-deep mb-4">Send us a message</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="form-label">First name</label><input className="form-input" placeholder="Ada"/></div>
                <div><label className="form-label">Last name</label><input className="form-input" placeholder="Okafor"/></div>
              </div>
              <div><label className="form-label">Email</label><input type="email" className="form-input" placeholder="you@example.com"/></div>
              <div><label className="form-label">Phone</label><input type="tel" className="form-input" placeholder="+44 ..."/></div>
              <div><label className="form-label">Message</label><textarea className="form-input" rows={3} placeholder="Tell us about your enquiry…"/></div>
              <button className="btn btn-primary w-full justify-center">Send message</button>
            </div>
          </div>
        </div>
      </section>

      {/* BLOG */}
      {posts.length > 0 && (
        <section className="px-8 py-20">
          <div className="text-[11px] font-semibold text-tide-light uppercase tracking-widest mb-3">Latest news</div>
          <h2 className="font-serif text-4xl text-tide-deep mb-8">From the Tide Home blog</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {posts.slice(0,3).map((p: any) => (
              <div key={p.id} className="card hover:-translate-y-0.5 hover:shadow-sm transition-all">
                <div className="text-xs text-tide-muted mb-2">{new Date(p.createdAt).toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric' })}</div>
                <h3 className="font-serif text-lg text-tide-deep mb-2">{p.title}</h3>
                <p className="text-sm text-tide-muted line-clamp-3">{p.excerpt || p.content.slice(0,120) + '…'}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* FOOTER */}
      <footer className="bg-tide-deep px-8 py-8 flex flex-wrap items-center justify-between gap-4">
        <div className="font-serif text-xl text-white">Tide<span className="text-tide-light">Home</span></div>
        <div className="text-xs text-white/30">© 2025 Tide Home Care Services Ltd. All rights reserved.</div>
      </footer>
    </div>
  );
}
