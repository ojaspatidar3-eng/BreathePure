import React, { useState } from 'react';
import {
  Users,
  Baby,
  GraduationCap,
  Trees,
  BookOpen,
  ShieldCheck,
  AlertTriangle,
  HeartPulse,
  Sparkles,
  ChevronRight
} from 'lucide-react';

export const FamilyCommunityPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'family' | 'school' | 'community' | 'education'>('family');
  const [flippedCard, setFlippedCard] = useState<number | null>(null);

  const educationalCards = [
    {
      id: 1,
      title: 'What is PM2.5 & Why is Size Dangerous?',
      question: 'Why do tiny particles matter more than visible black smoke?',
      answer: 'PM2.5 particles are less than 2.5 micrometers in diameter—roughly 30 times thinner than a human hair. Because of their minute mass, they stay suspended in the atmosphere for weeks and bypass the upper nasal filter, penetrating directly into lung alveoli and passing into systemic blood vessels.',
    },
    {
      id: 2,
      title: 'The Thermal Inversion Lid',
      question: 'Why is air quality so much worse in cold winter mornings?',
      answer: 'Normally, air cools with altitude, allowing warm surface air to rise and disperse smoke. In winter, clear nights cause the ground to radiate heat rapidly. A layer of warm air sits atop trapped cold ground air like a lid, holding tailpipe exhaust and wood smoke at pedestrian breathing level until solar heating breaks the lid in the afternoon.',
    },
    {
      id: 3,
      title: 'Your Body’s Mucociliary Escalator',
      question: 'How do healthy airways defend against inhaled particulate matter?',
      answer: 'Your bronchial passages are lined with millions of microscopic beating cilia coated in a sticky mucus blanket. These cilia beat rhythmically upward (the mucociliary escalator), moving trapped soot upward to the throat to be swallowed or coughed out. Proper indoor hydration and avoiding tobacco/incense smoke preserve this vital defense.',
    },
    {
      id: 4,
      title: 'Exposure Reduction vs. Emission Reduction',
      question: 'What is the critical difference between the twin pillars?',
      answer: 'Exposure Reduction protects the breathing individual from existing toxic air (e.g., wearing an airtight N95 mask, running a HEPA purifier in a sealed room). Emission Reduction prevents pollutants from being created in the first place (e.g., taking the metro, composting leaves instead of burning them). Sustainable health requires both.',
    },
  ];

  return (
    <div className="py-4 space-y-8 max-w-5xl mx-auto">
      {/* Banner */}
      <div className="bg-white rounded-3xl p-6 md:p-10 border border-slate-200/90 shadow-2xs space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
          <Users className="w-3.5 h-3.5 text-emerald-700" />
          <span>Collective Airshed Protection</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Family Care & Community Clean-Air Action
        </h2>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
          Clean air is a shared public commons. Explore targeted guidance for vulnerable family members (infants, seniors),
          school-day protocols to protect children, collective community clean-air action, and interactive educational flashcards.
        </p>

        {/* Tab Buttons */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
          {[
            { id: 'family', label: '1. Family & Vulnerable Dependents' },
            { id: 'school', label: '2. School & Student Precautions' },
            { id: 'community', label: '3. Community Clean-Air Action' },
            { id: 'education', label: '4. Educational Flashcards' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab 1: Family Dependents */}
      {activeTab === 'family' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Infants & Toddlers */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center gap-2.5 text-emerald-800">
                <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
                  <Baby className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">Infants & Young Children</h3>
                  <span className="text-[11px] text-slate-500">Developing Pulmonary Architecture</span>
                </div>
              </div>

              <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
                <p>
                  Infants breathe at roughly <strong>twice the respiratory rate per kilogram</strong> of body weight
                  compared to adults. Their developing lung alveoli are exceptionally vulnerable to cellular oxidative stress.
                </p>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <strong className="text-slate-900 block">Stroller Inhalation Height Warning:</strong>
                  <span>
                    Strollers position infants at tailpipe exhaust height (0.5 to 1 meter above ground). Avoid walking
                    strollers along arterial motor roads during rush hour.
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <strong className="text-slate-900 block">Sleeping Crib Placement:</strong>
                  <span>
                    Position cribs along interior walls away from street-facing window frames to avoid draft leakage during
                    nighttime smog episodes.
                  </span>
                </div>
              </div>
            </div>

            {/* Seniors */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center gap-2.5 text-emerald-800">
                <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
                  <HeartPulse className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">Senior Citizens (60+ Years)</h3>
                  <span className="text-[11px] text-slate-500">Cardiovascular & Bronchial Shielding</span>
                </div>
              </div>

              <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
                <p>
                  Cold morning air combined with high PM2.5 triggers reflex bronchoconstriction and increases blood viscosity,
                  elevating acute cardiovascular event risks in older adults.
                </p>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <strong className="text-slate-900 block">Reschedule Morning Walk Routine:</strong>
                  <span>
                    Replace 06:00 AM park walks with indoor stretching or delay walking until 14:00 PM when solar heating
                    has dispersed surface inversion layers.
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <strong className="text-slate-900 block">Emergency Medication Access:</strong>
                  <span>
                    Keep treating doctor's prescribed rescue bronchodilators, nebulizers, and emergency contacts accessible
                    right on bedside tables.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: School Precautions */}
      {activeTab === 'school' && (
        <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 space-y-6 animate-fadeIn">
          <div className="max-w-2xl">
            <h3 className="text-lg font-bold text-slate-900">
              School Campus & Student Transit Clean-Air Protocols
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Guidelines for Parent-Teacher Associations, school administrations, and student commuters during high pollution months.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
              <span className="text-emerald-700 font-bold text-xs uppercase tracking-wider block">1. Recess & Sports</span>
              <h4 className="font-bold text-slate-900 text-sm">Mandatory Indoor Physical Activity</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                When ambient AQI exceeds 200 (Poor/Very Poor), shift outdoor sports and sports day practices inside or
                convert sessions to classroom tactical strategy, stretching, or mental wellness.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
              <span className="text-emerald-700 font-bold text-xs uppercase tracking-wider block">2. School Bus Gates</span>
              <h4 className="font-bold text-slate-900 text-sm">Anti-Idling Exclusion Zones</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                School buses, auto-rickshaws, and private cars must shut off engines while queued at pickup and drop-off
                zones. Idling diesel exhaust at entry gates exposes hundreds of students to extreme toxin spikes.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
              <span className="text-emerald-700 font-bold text-xs uppercase tracking-wider block">3. Mask Fitting</span>
              <h4 className="font-bold text-slate-900 text-sm">Child-Sized Certified Respirators</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Adult N95 masks leave large air gaps along children's small cheeks and chin contours. Provide certified
                pediatric-sized N95 masks and demonstrate the airtight pinch test over the nose bridge.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Community Clean-Air Action */}
      {activeTab === 'community' && (
        <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 space-y-6 animate-fadeIn">
          <div className="max-w-2xl">
            <h3 className="text-lg font-bold text-slate-900">
              Community Clean-Air Action & Neighborhood Vigilance
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Collective action organized by Resident Welfare Associations (RWAs) and neighborhood groups can prevent
              massive localized smoke accumulation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl bg-emerald-50/60 border border-emerald-100 space-y-2">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Trees className="w-4 h-4 text-emerald-600" />
                Community Leaf Composting vs. Burning Bans
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Organize designated dry leaf collection bags in community parks and residential wards. Converting fallen
                leaves into community compost pits completely eliminates smoldering smoke plumes that choke neighborhoods.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-emerald-50/60 border border-emerald-100 space-y-2">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-600" />
                Neighborhood Carpooling Corridors
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Set up an RWA carpool bulletin board for shared morning commutes along common corporate routes or school
                runs, taking dozens of private vehicles off the arterial road grid each day.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-emerald-50/60 border border-emerald-100 space-y-2">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-emerald-600" />
                Prompt Reporting of Open Municipal Burning
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Circulate civic complaint helpline numbers and mobile apps to report nighttime waste burning and construction
                dust violations immediately to local municipal authorities.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-emerald-50/60 border border-emerald-100 space-y-2">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Dense Native Green Buffer Strips
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Plant multi-tiered native shrubs (such as Kaner, Bougainvillea, and Ficus) along residential boundary walls.
                Dense foliage physically intercepts coarse road dust and heavy particulates before reaching balconies.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Interactive Educational Flashcards */}
      {activeTab === 'education' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="text-center max-w-xl mx-auto space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Interactive Environmental Flashcards
            </span>
            <h3 className="text-xl font-bold text-slate-900">Click Any Flashcard to Reveal the Science</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {educationalCards.map((card) => {
              const isFlipped = flippedCard === card.id;
              return (
                <div
                  key={card.id}
                  onClick={() => setFlippedCard(isFlipped ? null : card.id)}
                  className={`p-6 rounded-2xl border transition-all cursor-pointer shadow-2xs hover:shadow-md ${
                    isFlipped
                      ? 'bg-emerald-900 text-white border-emerald-800'
                      : 'bg-white text-slate-800 border-slate-200/90'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        isFlipped ? 'bg-emerald-800 text-mint-300' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      Card #{card.id} • {isFlipped ? 'Answer Revealed' : 'Click to Flip'}
                    </span>
                    <Sparkles className={`w-4 h-4 ${isFlipped ? 'text-mint-300' : 'text-slate-400'}`} />
                  </div>

                  <h4 className={`text-base font-bold mb-2 ${isFlipped ? 'text-white' : 'text-slate-900'}`}>
                    {card.title}
                  </h4>

                  {!isFlipped ? (
                    <div className="text-xs text-slate-600 leading-relaxed flex items-center justify-between mt-4">
                      <span>{card.question}</span>
                      <ChevronRight className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    </div>
                  ) : (
                    <div className="text-xs text-emerald-100/95 leading-relaxed mt-2 border-t border-emerald-800/80 pt-3">
                      {card.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
