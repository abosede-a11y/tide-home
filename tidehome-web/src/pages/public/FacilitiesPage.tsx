import React from 'react';
import { Link } from 'react-router-dom';

const facilities = [
  { icon:'🛏️', title:'Resident Rooms', desc:'Spacious, en-suite rooms with natural light, adjustable furnishings, and personalised décor. Each room features an emergency call system, flat-screen TV, and Wi-Fi.', features:['En-suite bathroom','Natural daylight','Personalised décor','Emergency call system','Free Wi-Fi'] },
  { icon:'🌿', title:'Garden & Outdoor Spaces', desc:'Beautifully landscaped gardens with accessible pathways, raised flower beds, and comfortable seating areas. Our outdoor spaces are designed for all mobility levels.', features:['Wheelchair accessible','Raised flower beds','Sheltered seating','Walking paths','Bird watching area'] },
  { icon:'🍽️', title:'Dining & Nutrition', desc:'Our chef-prepared meals are served in a bright communal dining room. Every dietary requirement is accommodated, and residents enjoy three meals plus two snacks daily.', features:['Chef-prepared meals','Dietary accommodations','3 meals + 2 snacks','Communal dining room','Private dining available'] },
  { icon:'🏋️', title:'Physiotherapy Suite', desc:'A fully equipped rehabilitation gym staffed by qualified physiotherapists. We support post-surgery recovery, stroke rehabilitation, and general mobility improvement.', features:['Qualified physiotherapists','Modern equipment','Post-surgery rehab','Stroke rehabilitation','Individual programmes'] },
  { icon:'📚', title:'Activity & Social Lounge', desc:'A warm, vibrant space for group activities, events, arts and crafts, games, and family visits. Our activities coordinator runs a full weekly programme.', features:['Arts and crafts','Group activities','Family visit space','Weekly events programme','Entertainment system'] },
  { icon:'💆', title:'Therapy & Wellness Room', desc:'A dedicated space for sensory therapy, relaxation, and one-to-one therapeutic sessions. Used for dementia sensory therapy, music therapy, and mindfulness.', features:['Sensory therapy','Music therapy','Mindfulness sessions','Aromatherapy','Private and calming'] },
  { icon:'🔒', title:'24/7 Monitored Security', desc:'CCTV-monitored entry points, keypad-controlled access, and dedicated night staff ensuring round-the-clock safety for all residents and visitors.', features:['CCTV monitoring','Keypad entry','Night staff on duty','Visitor sign-in','Secure perimeter'] },
  { icon:'🚐', title:'Transport & Accessibility', desc:'Wheelchair-accessible transport available for hospital appointments and outings. Fully accessible building with lifts to all floors and wide corridors throughout.', features:['Wheelchair accessible transport','Hospital appointment transport','Building-wide lifts','Wide corridors','Accessible bathrooms'] },
  { icon:'📡', title:'Connected & Modern', desc:'Free Wi-Fi throughout the building, a digital care management system for real-time updates, and a member portal for families to stay connected at any time.', features:['Free Wi-Fi','Digital care records','Family member portal','Real-time updates','Video call facilities'] },
];

export default function FacilitiesPage() {
  return (
    <div className="pt-20">
      {/* HERO */}
      <div className="bg-tide-deep px-8 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-[11px] font-semibold text-tide-light uppercase tracking-widest mb-3">Our facilities</div>
          <h1 className="font-serif text-5xl text-white leading-tight mb-4">A place that truly<br/>feels like home</h1>
          <p className="text-white/60 text-base max-w-xl leading-relaxed">
            Purpose-built spaces designed for comfort, safety, and wellbeing — every corner of Tide Home is made with residents in mind.
          </p>
        </div>
      </div>

      {/* GALLERY GRID */}
      <section className="px-8 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {facilities.map(f => (
              <div key={f.title} className="rounded-xl border border-tide-deep/10 overflow-hidden bg-white hover:-translate-y-0.5 hover:shadow-md transition-all">
                <div className="h-40 bg-gradient-to-br from-tide-foam to-tide-sand flex items-center justify-center text-5xl">
                  {f.icon}
                </div>
                <div className="p-5">
                  <h3 className="font-serif text-lg text-tide-deep mb-2">{f.title}</h3>
                  <p className="text-sm text-tide-muted leading-relaxed mb-4">{f.desc}</p>
                  <ul className="space-y-1">
                    {f.features.map(feat => (
                      <li key={feat} className="flex items-center gap-2 text-xs text-tide-muted">
                        <span className="text-tide-success font-bold">✓</span> {feat}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-8 py-16 bg-tide-sand text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-serif text-3xl text-tide-deep mb-3">Would you like to visit?</h2>
          <p className="text-tide-muted mb-6">We welcome families to tour our facilities. Book a visit and see Tide Home for yourself.</p>
          <Link to="/contact" className="btn btn-primary btn-lg">Book a tour →</Link>
        </div>
      </section>
    </div>
  );
}