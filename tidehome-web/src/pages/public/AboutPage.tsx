import React from 'react';
import { Link } from 'react-router-dom';

export default function AboutPage() {
  return (
    <div className="pt-20">
      {/* HERO */}
      <div className="bg-tide-deep px-8 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-[11px] font-semibold text-tide-light uppercase tracking-widest mb-3">About Tide Home</div>
          <h1 className="font-serif text-5xl text-white leading-tight mb-4">Compassionate care,<br/>driven by purpose</h1>
          <p className="text-white/60 text-base max-w-xl leading-relaxed">
            Founded on the belief that every individual deserves dignity, warmth, and expert care — serving families across the region for over 15 years.
          </p>
        </div>
      </div>

      {/* MISSION / VISION / LOCATION */}
      <section className="px-8 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {[
              ['🎯','Our Mission','To provide exceptional, person-centred care that preserves dignity and promotes independence for every resident in our community.'],
              ['🔭','Our Vision','To be the most trusted care home network in the country, setting the standard for compassionate, technology-supported care delivery.'],
              ['📍','Our Location','12 Riverside Close, London SE1 7PB. Easily accessible by public transport, with ample visitor parking available on-site.'],
            ].map(([icon, title, desc]) => (
              <div key={title as string} className="card">
                <div className="text-2xl mb-3">{icon}</div>
                <h3 className="font-serif text-xl text-tide-deep mb-2">{title}</h3>
                <p className="text-sm text-tide-muted leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          {/* VALUES */}
          <div className="mb-16">
            <div className="text-[11px] font-semibold text-tide-light uppercase tracking-widest mb-3">Our values</div>
            <h2 className="font-serif text-3xl text-tide-deep mb-8">What guides everything we do</h2>
            <div className="grid md:grid-cols-4 gap-5">
              {[
                ['💙','Dignity','Every resident is treated with the utmost respect and individuality.'],
                ['🤝','Compassion','We care deeply — for residents, their families, and each other.'],
                ['🌟','Excellence','We hold ourselves to the highest standards in everything we do.'],
                ['🔒','Safety','The wellbeing and security of residents is always our first priority.'],
              ].map(([icon, title, desc]) => (
                <div key={title as string} className="text-center p-6 bg-tide-sand rounded-xl">
                  <div className="text-3xl mb-3">{icon}</div>
                  <h4 className="font-serif text-lg text-tide-deep mb-2">{title}</h4>
                  <p className="text-xs text-tide-muted leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* TEAM */}
          <div className="mb-16">
            <div className="text-[11px] font-semibold text-tide-light uppercase tracking-widest mb-3">Meet the team</div>
            <h2 className="font-serif text-3xl text-tide-deep mb-8">The people behind Tide Home</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {[
                ['AO','Dr. Amada Smith','Medical Director','Over 20 years of clinical experience in geriatric medicine.'],
                ['JE','James Henry','Head of Care','Specialist in complex care and multidisciplinary team leadership.'],
                ['FN','Florence Philip','Lead Nurse','Registered nurse with expertise in dementia and palliative care.'],
                ['BI','Beatrice James','Resident Liaison','Dedicated to keeping families informed and connected.'],
                ['TO','Dr. Samuel Hendrick','Physiotherapist','Leads our rehabilitation programme with a focus on mobility.'],
                ['KA','Kemi Adesanya','Social Worker','Supports residents and families through care transitions.'],
                ['EO','Manuel Richard','Activities Coordinator','Creates engaging programmes that enrich daily life.'],
                ['NA','Noah Khan','Nutritionist','Ensures every resident receives personalised dietary support.'],
              ].map(([initials, name, role, bio]) => (
                <div key={name as string} className="card text-center">
                  <div className="w-16 h-16 rounded-full bg-tide-foam flex items-center justify-center font-serif text-xl text-tide-deep mx-auto mb-3">
                    {initials}
                  </div>
                  <div className="font-semibold text-sm text-tide-deep">{name}</div>
                  <div className="text-xs text-tide-light font-medium mt-0.5 mb-2">{role}</div>
                  <div className="text-xs text-tide-muted leading-relaxed">{bio}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* OUR SERVICES SECTION */}
      <section className="px-8 py-20 bg-tide-sand">
        <div className="max-w-7xl mx-auto">
          <div className="text-[11px] font-semibold text-tide-light uppercase tracking-widest mb-3">What we offer</div>
          <div className="flex items-end justify-between mb-8 gap-4">
            <h2 className="font-serif text-3xl text-tide-deep">Specialist care for every need</h2>
            <Link to="/services" className="btn btn-secondary flex-shrink-0">View all services →</Link>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              ['🏥','Rehabilitation Services','Structured recovery with physiotherapy, occupational therapy, and daily progress tracking.'],
              ['🏠','Live-in Care','Around-the-clock dedicated support ensuring continuous care and companionship.'],
              ['🧠','Dementia Care','Specialist memory care with trained staff, sensory activities, and family integration.'],
              ['🌟','Learning Disabilities & Autism','Complex care with tailored routines, communication aids, and specialist support.'],
              ['💚','End of Life Care','Compassionate palliative care focused on comfort, dignity, and emotional support.'],
              ['⚕️','Complex Care','Advanced medical support for high-dependency residents by specialist nurses.'],
            ].map(([icon, title, desc]) => (
              <Link key={title as string} to="/services" className="card hover:-translate-y-0.5 hover:shadow-sm transition-all group">
                <div className="text-2xl mb-3">{icon}</div>
                <h3 className="font-serif text-base text-tide-deep mb-1.5 group-hover:text-tide-mid transition-colors">{title}</h3>
                <p className="text-sm text-tide-muted leading-relaxed">{desc}</p>
                <div className="text-tide-light text-xs mt-3 font-medium">Learn more →</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* MAP SECTION */}
      <section className="px-8 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-[11px] font-semibold text-tide-light uppercase tracking-widest mb-3">Find us</div>
          <h2 className="font-serif text-3xl text-tide-deep mb-8">Visit Tide Home</h2>
          <div className="grid md:grid-cols-3 gap-8 items-start">
            {/* Address & transport info */}
            <div className="space-y-4">
              <div className="card">
                <h3 className="font-serif text-lg text-tide-deep mb-4">Getting here</h3>
                <div className="space-y-3">
                  {[
                    ['📍','Address','12 Riverside Close\nLondon SE1 7PB'],
                    ['🚇','By tube','London Bridge station\n5 minute walk'],
                    ['🚌','By bus','Routes 17, 21, 35, 40\nStop: Riverside Close'],
                    ['🚗','By car','Free visitor parking\navailable on-site'],
                    ['🕘','Visiting hours','Mon–Sun: 9am–8pm\nOut-of-hours by arrangement'],
                  ].map(([icon, label, val]) => (
                    <div key={label as string} className="flex gap-3">
                      <span className="text-lg flex-shrink-0">{icon}</span>
                      <div>
                        <div className="text-[10px] font-semibold text-tide-muted uppercase tracking-wider">{label}</div>
                        <div className="text-sm text-tide-deep whitespace-pre-line">{val}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <Link to="/contact" className="btn btn-primary w-full justify-center">
                Book a visit →
              </Link>
            </div>

            {/* Google Maps embed */}
            <div className="md:col-span-2 rounded-2xl overflow-hidden border border-tide-deep/10 shadow-sm" style={{ height: '420px' }}>
              <iframe
                title="Tide Home Location"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2483.6!2d-0.0877!3d51.5045!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2s12+Riverside+Close%2C+London+SE1+7PB!5e0!3m2!1sen!2suk!4v1234567890"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-8 py-16 bg-tide-deep text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-serif text-3xl text-white mb-3">Ready to find out more?</h2>
          <p className="text-white/60 mb-6">Speak to our team about care options, packages, and availability.</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link to="/contact" className="btn btn-lg bg-white text-tide-deep hover:bg-tide-foam border-0 font-semibold">
              Contact us
            </Link>
            <Link to="/packages" className="btn btn-lg bg-transparent text-white border border-white/30 hover:bg-white/10">
              View packages
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}