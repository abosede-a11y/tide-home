import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { blogApi } from '../../services/api';

export default function HomePage() {
  const { data: posts = [] } = useQuery({ queryKey: ['blog-public'], queryFn: blogApi.getPublic });

  return (
    <div>
      {/* HERO */}
      <section className="min-h-screen bg-gradient-to-br from-tide-deep via-tide-mid to-[#1A8A7A] flex items-center px-8 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute w-[550px] h-[550px] rounded-full bg-white/3 -top-32 -right-24"/>
          <div className="absolute w-72 h-72 rounded-full bg-white/4 bottom-16 left-[8%]"/>
        </div>
        <div className="max-w-7xl mx-auto w-full pt-20 z-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-4 py-1.5 mb-7">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"/>
              <span className="text-[11px] font-medium text-white/85 uppercase tracking-widest">Trusted care management</span>
            </div>
            <h1 className="font-serif text-5xl text-white leading-tight mb-5">
              Where every resident <em className="text-tide-light">feels</em> close to home
            </h1>
            <p className="text-white/70 text-base leading-relaxed mb-8 max-w-lg">
              Tide Home brings care home operations, resident records, and family connections into one secure, beautifully simple platform.
            </p>
            <div className="flex gap-3 flex-wrap">
              <Link to="/packages" className="btn btn-lg bg-white text-tide-deep hover:bg-tide-foam font-semibold border-0">
                View packages
              </Link>
              <Link to="/about" className="btn btn-lg bg-transparent text-white border border-white/30 hover:bg-white/10">
                Learn more
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <div className="bg-tide-sand px-8 py-10 border-b border-tide-deep/10">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {[['98%','Family satisfaction'],['24/7','Real-time updates'],['500+','Residents managed'],['15+','Years of care']].map(([n,l]) => (
            <div key={l} className="text-center">
              <div className="font-serif text-3xl text-tide-deep mb-1">{n}</div>
              <div className="text-[11px] text-tide-muted uppercase tracking-wider">{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* QUICK LINKS */}
      <section className="px-8 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-[11px] font-semibold text-tide-light uppercase tracking-widest mb-3">Explore Tide Home</div>
          <h2 className="font-serif text-4xl text-tide-deep mb-10">Everything you need to know</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { to:'/about', icon:'🏠', title:'About Us', desc:'Our mission, vision, team and the story behind Tide Home.' },
              { to:'/services', icon:'⚕️', title:'Our Services', desc:'From rehabilitation to dementia care — see everything we offer.' },
              { to:'/facilities', icon:'🌿', title:'Facilities', desc:'Tour our spaces — rooms, gardens, dining, therapy suites and more.' },
              { to:'/packages', icon:'💷', title:'Care Packages', desc:'Transparent pricing for Standard, Enhanced, and Premium care.' },
              { to:'/faq', icon:'❓', title:'FAQ', desc:'Answers to the most common questions from families and carers.' },
              { to:'/contact', icon:'📞', title:'Contact Us', desc:'Get in touch or fill out a form — we respond within 24 hours.' },
            ].map(({ to, icon, title, desc }) => (
              <Link key={to} to={to} className="card hover:-translate-y-0.5 hover:shadow-sm transition-all group">
                <div className="text-2xl mb-3">{icon}</div>
                <h3 className="font-serif text-lg text-tide-deep mb-1.5 group-hover:text-tide-mid transition-colors">{title}</h3>
                <p className="text-sm text-tide-muted leading-relaxed">{desc}</p>
                <div className="text-tide-light text-xs mt-3 font-medium">Learn more →</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* BLOG PREVIEW */}
      {posts.length > 0 && (
        <section className="px-8 py-20 bg-tide-sand">
          <div className="max-w-7xl mx-auto">
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
          </div>
        </section>
      )}
    </div>
  );
}