import React, { useState } from 'react';
import { MEMBERSHIP_PLANS } from '../data/servicesData';
import { Check, ShieldCheck } from 'lucide-react';

interface PricingSectionProps {
  onOpenBooking: () => void;
  onOpenPartnerJoin: () => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onOpenBooking, onOpenPartnerJoin }) => {
  const [activePlanType, setActivePlanType] = useState<'partners' | 'clients'>('partners');

  return (
    <section id="pricing" className="py-24 px-4 sm:px-6 border-b border-pink-200/50 relative z-10">
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        
        {/* Header */}
        <span className="text-xs font-semibold text-[#0071e3] uppercase tracking-wider mb-2 block text-center">
          Pricing &amp; Memberships
        </span>
        <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-[#1d1d1f] text-center mb-3 headline-balance">
          Simple, Transparent Pricing.
        </h2>
        <p className="text-[#1d1d1f]/75 text-center mb-8 max-w-xl body-pretty text-sm sm:text-base">
          Special discounted partner registration passes and standard hourly client rates with zero hidden platform commissions.
        </p>

        {/* Switcher Toggle */}
        <div className="inline-flex items-center p-1 rounded-full bg-white/80 backdrop-blur-md border border-pink-200 shadow-sm mb-12" role="tablist">
          <button
            role="tab"
            aria-selected={activePlanType === 'partners'}
            onClick={() => setActivePlanType('partners')}
            className={`px-5 py-2 rounded-full text-xs font-bold transition apple-focus ${
              activePlanType === 'partners'
                ? 'bg-[#1d1d1f] text-white shadow-sm'
                : 'text-[#1d1d1f]/70 hover:text-[#1d1d1f]'
            }`}
          >
            Partner Memberships (60% OFF)
          </button>
          <button
            role="tab"
            aria-selected={activePlanType === 'clients'}
            onClick={() => setActivePlanType('clients')}
            className={`px-5 py-2 rounded-full text-xs font-bold transition apple-focus ${
              activePlanType === 'clients'
                ? 'bg-[#1d1d1f] text-white shadow-sm'
                : 'text-[#1d1d1f]/70 hover:text-[#1d1d1f]'
            }`}
          >
            Client Hourly Rates
          </button>
        </div>

        {/* Partner Pricing Grid (LandingHero 3-column structure) */}
        {activePlanType === 'partners' ? (
          <div className="w-full grid grid-cols-1 lg:grid-cols-3 border border-pink-200/80 rounded-3xl overflow-hidden bg-white/85 backdrop-blur-2xl shadow-apple-lg mb-12">
            {MEMBERSHIP_PLANS.map((plan, idx) => (
              <div 
                key={plan.id}
                className={`p-8 flex flex-col justify-between transition-colors group relative ${
                  plan.popular ? 'bg-pink-50/50 lg:border-x border-pink-200' : 'hover:bg-pink-50/20'
                } ${idx < MEMBERSHIP_PLANS.length - 1 ? 'border-b lg:border-b-0 border-pink-200/60' : ''}`}
              >
                <div>
                  <div className="flex justify-between items-center mb-4 min-h-[28px]">
                    <span className="text-xs font-bold text-[#1d1d1f] uppercase tracking-wider">{plan.duration}</span>
                    {plan.popular && (
                      <span className="text-[9px] font-bold text-pink-700 bg-pink-200/80 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        Most Popular
                      </span>
                    )}
                  </div>

                  <div className="mb-6">
                    <div className="flex items-baseline gap-2 mb-1">
                      <h3 className="text-4xl font-bold text-[#1d1d1f] tabular-numbers">
                        ₹{plan.discountedPrice}
                      </h3>
                      <span className="text-xs text-[#86868b] line-through tabular-numbers">
                        ₹{plan.regularPrice}
                      </span>
                      <span className="text-xs text-[#86868b] font-normal">+ GST</span>
                    </div>
                    <div className="text-xs font-bold text-[#0071e3] tracking-tight mb-1">
                      {plan.discountPercentage} Special Launch Pass
                    </div>
                    <p className="text-xs text-[#86868b]">
                      Keep 80% net take-home earnings with weekly automated bank settlements.
                    </p>
                  </div>

                  <button
                    onClick={onOpenPartnerJoin}
                    className={`block w-full py-3 rounded-full mb-8 font-semibold text-xs transition-all shadow-sm text-center apple-focus active:scale-98 ${
                      plan.popular
                        ? 'bg-[#0071e3] hover:bg-[#0077ed] text-white'
                        : 'bg-[#1d1d1f] hover:bg-[#0071e3] text-white'
                    }`}
                  >
                    Activate {plan.duration.split(' ')[0]} {plan.duration.split(' ')[1]} Pass
                  </button>

                  <div className="flex items-center gap-4 mb-6 relative">
                    <div className="h-px bg-pink-200/60 absolute left-0 right-0 top-1/2"></div>
                    <span className="px-3 text-[#86868b] text-[10px] uppercase font-bold tracking-widest z-10 mx-auto bg-white/90 rounded-full border border-pink-100">
                      Includes:
                    </span>
                  </div>

                  <ul className="flex flex-col gap-3.5 mb-6">
                    {plan.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-center gap-2.5 text-xs text-[#1d1d1f]/85">
                        <div className="w-4 h-4 rounded-full bg-pink-100 text-pink-700 flex items-center justify-center shrink-0">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-pink-100 text-[11px] text-[#86868b] flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#0071e3]" />
                  <span>Aadhaar Fast-Track Verification</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Client Hourly Overview */
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl border border-pink-200/80 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-[#86868b] uppercase">Senior Support</span>
                <div className="text-3xl font-bold text-[#1d1d1f] my-2 tabular-numbers">₹1,000<span className="text-xs text-[#86868b] font-normal">/hr</span></div>
                <p className="text-xs text-[#86868b] mb-6">Patient elder care &amp; medical accompaniment.</p>
                <ul className="space-y-2 text-xs text-[#1d1d1f]/80 mb-6">
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#0071e3]" /> Background screened</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#0071e3]" /> Empathetic senior buddy</li>
                </ul>
              </div>
              <button onClick={onOpenBooking} className="w-full bg-[#1d1d1f] hover:bg-[#0071e3] text-white py-2.5 rounded-full text-xs font-semibold transition apple-focus">
                Book Elder Care
              </button>
            </div>

            <div className="bg-white/90 backdrop-blur-xl p-8 rounded-3xl border-2 border-[#0071e3] shadow-apple-md flex flex-col justify-between md:-translate-y-2">
              <div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-[#0071e3] uppercase">Social &amp; Hangouts</span>
                  <span className="text-[10px] font-bold text-pink-700 bg-pink-100 px-2 py-0.5 rounded-full">Top Choice</span>
                </div>
                <div className="text-3xl font-bold text-[#1d1d1f] my-2 tabular-numbers">₹1,500 – ₹2,000<span className="text-xs text-[#86868b] font-normal">/hr</span></div>
                <p className="text-xs text-[#86868b] mb-6">Movies, cafes, shopping &amp; city tours.</p>
                <ul className="space-y-2 text-xs text-[#1d1d1f]/80 mb-6">
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#0071e3]" /> Zero social pressure</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#0071e3]" /> Public verified venues</li>
                </ul>
              </div>
              <button onClick={onOpenBooking} className="w-full bg-[#0071e3] hover:bg-[#0077ed] text-white py-2.5 rounded-full text-xs font-semibold transition shadow-sm apple-focus">
                Book Companion
              </button>
            </div>

            <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl border border-pink-200/80 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-[#86868b] uppercase">Events &amp; Nightlife</span>
                <div className="text-3xl font-bold text-[#1d1d1f] my-2 tabular-numbers">₹2,000 – ₹4,500<span className="text-xs text-[#86868b] font-normal">/hr</span></div>
                <p className="text-xs text-[#86868b] mb-6">Clubbing, parties, weddings &amp; travel partner.</p>
                <ul className="space-y-2 text-xs text-[#1d1d1f]/80 mb-6">
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#0071e3]" /> Event plus-one partner</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#0071e3]" /> 24/7 SOS safety tracking</li>
                </ul>
              </div>
              <button onClick={onOpenBooking} className="w-full bg-[#1d1d1f] hover:bg-[#0071e3] text-white py-2.5 rounded-full text-xs font-semibold transition apple-focus">
                Book Event Partner
              </button>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
