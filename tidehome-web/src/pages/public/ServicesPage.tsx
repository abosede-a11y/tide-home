import React from 'react';
import { Link } from 'react-router-dom';

const services = [
  {
    icon: '🏥',
    title: 'Rehabilitation Services',
    summary: 'Structured recovery with physiotherapy, occupational therapy, and daily progress tracking.',
    details: [
      'Individual physiotherapy sessions tailored to recovery goals',
      'Occupational therapy to rebuild daily living skills',
      'Daily progress tracking with family updates',
      'Hydrotherapy and mobility aids where needed',
      'Specialist equipment and rehabilitation gym on-site',
    ],
    who: 'Ideal for residents recovering from surgery, stroke, or injury.',
  },
  {
    icon: '🏠',
    title: 'Live-in Care',
    summary: 'Around-the-clock dedicated support ensuring continuous care and companionship.',
    details: [
      '24-hour dedicated care staff on every floor',
      'Personalised care plans reviewed monthly',
      'Assistance with personal hygiene, dressing and mobility',
      'Medication management and health monitoring',
      'Companionship and emotional support',
    ],
    who: 'Suitable for residents requiring continuous support and companionship.',
  },
  {
    icon: '🧠',
    title: 'Dementia Care',
    summary: 'Specialist memory care with trained staff, sensory activities, and family integration.',
    details: [
      'Dedicated dementia-trained care team',
      'Secure, calming environment designed for memory care',
      'Sensory rooms and reminiscence therapy',
      'Family integration and carer support groups',
      'Regular cognitive assessments and care reviews',
    ],
    who: 'Designed for residents with Alzheimer\'s disease and other forms of dementia.',
  },
  {
    icon: '🌟',
    title: 'Learning Disabilities & Autism',
    summary: 'Complex care with tailored routines, communication aids, and specialist support.',
    details: [
      'Trained specialists in autism and learning disabilities',
      'Personalised structured daily routines',
      'Communication aids and alternative therapies',
      'Social skills development programmes',
      'Close liaison with families and external specialists',
    ],
    who: 'For adults with learning disabilities, autism spectrum conditions, or complex behavioural needs.',
  },
  {
    icon: '💚',
    title: 'End of Life Care',
    summary: 'Compassionate palliative care focused on comfort, dignity, and emotional support.',
    details: [
      'Specialist palliative care nursing',
      'Pain and symptom management',
      'Emotional and spiritual support for residents and families',
      'Bereavement support for loved ones',
      'Private, peaceful environment with family visiting anytime',
    ],
    who: 'For residents in the final stages of life who require comfort-focused care.',
  },
  {
    icon: '⚕️',
    title: 'Complex Care',
    summary: 'Advanced medical support for high-dependency residents by specialist nurses.',
    details: [
      'Specialist nurses for complex medical conditions',
      'Ventilator and tracheostomy care where required',
      'PEG feeding and enteral nutrition management',
      'Wound care and pressure ulcer prevention',
      'Regular multi-disciplinary team reviews',
    ],
    who: 'For residents with multiple or high-dependency medical conditions requiring clinical expertise.',
  },
];

export default function ServicesPage() {
  return (
    <div className="pt-20">
      {/* HERO */}
      <div className="bg-tide-deep px-8 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-[11px] font-semibold text-tide-light uppercase tracking-widest mb-3">What we offer</div>
          <h1 className="font-serif text-5xl text-white leading-tight mb-4">Specialist care<br/>for every need</h1>
          <p className="text-white/60 text-base max-w-xl leading-relaxed">
            Our team delivers a full spectrum of care services, each tailored to the unique needs of every individual in our care.
          </p>
        </div>
      </div>

      {/* SERVICES */}
      <section className="px-8 py-20">
        <div className="max-w-7xl mx-auto space-y-8">
          {services.map((s, i) => (
            <div key={s.title} className={`grid md:grid-cols-2 gap-8 items-center ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
              <div className={`${i % 2 === 1 ? 'md:order-2' : ''}`}>
                <div className="text-4xl mb-4">{s.icon}</div>
                <h2 className="font-serif text-3xl text-tide-deep mb-3">{s.title}</h2>
                <p className="text-tide-muted leading-relaxed mb-4">{s.summary}</p>
                <div className="bg-tide-foam rounded-lg px-4 py-3 text-sm text-tide-mid mb-4">
                  <strong>Who is this for?</strong> {s.who}
                </div>
                <Link to="/packages" className="btn btn-primary">View packages →</Link>
              </div>
              <div className={`card ${i % 2 === 1 ? 'md:order-1' : ''}`}>
                <h4 className="font-medium text-tide-deep mb-3 text-sm">What's included</h4>
                <ul className="space-y-2">
                  {s.details.map(d => (
                    <li key={d} className="flex items-start gap-2 text-sm text-tide-muted">
                      <span className="text-tide-success font-bold text-xs mt-0.5">✓</span>
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-8 py-16 bg-tide-sand text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-serif text-3xl text-tide-deep mb-3">Not sure which service is right?</h2>
          <p className="text-tide-muted mb-6">Our team is happy to discuss your loved one's needs and recommend the most suitable care package.</p>
          <Link to="/contact" className="btn btn-primary btn-lg">Get in touch →</Link>
        </div>
      </section>
    </div>
  );
}