import React from 'react';

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
          <div>
            <div className="text-[11px] font-semibold text-tide-light uppercase tracking-widest mb-3">Meet the team</div>
            <h2 className="font-serif text-3xl text-tide-deep mb-8">The people behind Tide Home</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {[
                ['AO','Dr. Ada Okafor','Medical Director','Over 20 years of clinical experience in geriatric medicine.'],
                ['JE','James Eze','Head of Care','Specialist in complex care and multidisciplinary team leadership.'],
                ['FN','Florence Nwosu','Lead Nurse','Registered nurse with expertise in dementia and palliative care.'],
                ['BI','Beatrice Ibeh','Resident Liaison','Dedicated to keeping families informed and connected.'],
                ['TO','Dr. Tunde Obi','Physiotherapist','Leads our rehabilitation programme with a focus on mobility.'],
                ['KA','Kemi Adesanya','Social Worker','Supports residents and families through care transitions.'],
                ['EO','Emmanuel Okonkwo','Activities Coordinator','Creates engaging programmes that enrich daily life.'],
                ['NA','Ngozi Adeyemi','Nutritionist','Ensures every resident receives personalised dietary support.'],
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
    </div>
  );
}