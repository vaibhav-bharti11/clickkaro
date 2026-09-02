import React, { useState } from 'react';
import { MEMBERSHIP_PLANS, ALL_SERVICES } from '../data/servicesData';
import { Check, ShieldCheck, Sparkles, Clock, ArrowRight } from 'lucide-react';

interface PricingSectionProps {
  onOpenBooking: (serviceOrContext?: any) => void;
  onOpenPartnerJoin: () => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onOpenBooking, onOpenPartnerJoin }) => {
  const [activePlanType, setActivePlanType] = useState<'subscription' | 'hourly'>('subscription');

  return (
    <section id="pricing" className="py-24 px-4 sm:px-6 border-b border-black/5 relative z-10">
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        
        {/* Header */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-100/70 border border-pink-200 text-pink-700 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Transparent Pricing &amp; Subscriptions</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-display font-extrabold tracking-tight text-[#1d1d1f] text-center mb-3 headline-balance">
          Simple, client-first rates.
        </h2>
        <p className="text-[#1d1d1f]/75 text-center mb-8 max-w-xl body-pretty text-sm sm:text-base font-sans">
          Choose our official ₹999 / 3-month all-access subscription or book any of our 6 official services directly with fixed packages and zero hidden fees.
        </p>

        {/* Switcher Toggle */}
        <div className="inline-flex items-center p-1.5 rounded-full bg-white/90 backdrop-blur-md border border-black/10 shadow-sm mb-12" role="tablist">
          <button
            role="tab"
            aria-selected={activePlanType === 'subscription'}
            onClick={() => setActivePlanType('subscription')}
            className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all apple-focus ${
              activePlanType === 'subscription'
                ? 'bg-[#1d1d1f] text-white shadow-md'
                : 'text-[#1d1d1f]/70 hover:text-[#1d1d1f]'
            }`}
          >
            Official Subscriptions
          </button>
          <button
            role="tab"
            aria-selected={activePlanType === 'hourly'}
            onClick={() => setActivePlanType('hourly')}
            className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all apple-focus ${
              activePlanType === 'hourly'
                ? 'bg-[#1d1d1f] text-white shadow-md'
                : 'text-[#1d1d1f]/70 hover:text-[#1d1d1f]'
            }`}
          >
            6 Official Services &amp; Packages
          </button>
        </div>

        {/* Plan Cards Grid */}
        {activePlanType === 'subscription' ? (
          <div className="w-full grid grid-cols-1 lg:grid-cols-3 border border-black/10 rounded-3xl overflow-hidden bg-white/90 backdrop-blur-2xl shadow-apple-float mb-12">
            {MEMBERSHIP_PLANS.map((plan, idx) => (
              <div 
                key={plan.id}
                className={`p-8 sm:p-10 flex flex-col justify-between transition-colors group relative ${
                  plan.popular ? 'bg-gradient-to-b from-pink-50/70 via-white to-white lg:border-x border-black/10 shadow-sm' : 'hover:bg-pink-50/20'
                } ${idx < MEMBERSHIP_PLANS.length - 1 ? 'border-b lg:border-b-0 border-black/10' : ''}`}
              >
                <div>
                  <div className="flex justify-between items-center mb-4 min-h-[28px]">
                    <span className="text-xs font-bold text-[#1d1d1f] uppercase tracking-wider font-sans">{plan.duration}</span>
                    {plan.popular && (
                      <span className="text-[10px] font-black text-white bg-gradient-to-r from-[#FF2D55] to-[#FF5E3A] px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                        Official Client Pass
                      </span>
                    )}
                  </div>

                  <div className="mb-6">
                    <div className="flex items-baseline gap-2 mb-1">
                      <h3 className="text-4xl sm:text-5xl font-display font-extrabold text-[#1d1d1f] tabular-numbers">
                        ₹{plan.discountedPrice}
                      </h3>
                      <span className="text-sm text-[#86868b] line-through tabular-numbers">
                        ₹{plan.regularPrice}
                      </span>
                      <span className="text-xs text-[#86868b] font-normal">/ {plan.id.includes('3-months') ? '3 Months' : 'term'}</span>
                    </div>
                    <div className="text-xs font-bold text-[#FF2D55] tracking-tight mb-1">
                      {plan.id.includes('3-months') ? '₹999/- for 3 Months Full Access' : plan.discountPercentage}
                    </div>
                    <p className="text-xs text-[#86868b] leading-relaxed font-sans">
                      {plan.id.includes('3-months')
                        ? 'Unlimited bookings across all 12 launch cities for all 6 official services with zero platform surcharges.'
                        : 'Active registered partner profile with direct weekly automated bank settlements.'}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      if (plan.id.includes('3-months')) {
                        onOpenBooking();
                      } else {
                        onOpenPartnerJoin();
                      }
                    }}
                    className={`block w-full py-3.5 rounded-full mb-8 font-bold text-xs transition-all shadow-md text-center apple-focus active:scale-95 ${
                      plan.popular
                        ? 'bg-gradient-to-r from-[#FF2D55] to-[#E11D48] hover:opacity-95 text-white shadow-pink-500/25'
                        : 'bg-[#1d1d1f] hover:bg-[#0071E3] text-white'
                    }`}
                  >
                    {plan.id.includes('3-months') ? 'Get 3 Months Subscription (₹999)' : `Activate ${plan.duration}`}
                  </button>

                  <div className="flex items-center gap-4 mb-6 relative">
                    <div className="h-px bg-black/10 absolute left-0 right-0 top-1/2"></div>
                    <span className="px-3 text-[#86868b] text-[10px] uppercase font-bold tracking-widest z-10 mx-auto bg-white rounded-full border border-black/5">
                      Included Benefits:
                    </span>
                  </div>

                  <ul className="flex flex-col gap-3.5 mb-6 font-sans">
                    {plan.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2.5 text-xs text-[#1d1d1f]/90 leading-snug">
                        <div className="w-4 h-4 rounded-full bg-pink-100 text-[#FF2D55] flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-black/5 text-[11px] text-[#86868b] flex items-center gap-1.5 font-sans">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#0071E3]" />
                  <span>100% Aadhaar KYC Fast-Track Match</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Client Official 6 Services from Shared Sheet */
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {ALL_SERVICES.map((srv) => (
              <div 
                key={srv.id}
                className="bg-white/95 backdrop-blur-2xl p-7 rounded-3xl border border-black/10 shadow-apple-md flex flex-col justify-between hover:shadow-apple-float transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-[#FF2D55] uppercase tracking-wider font-sans">
                      {srv.title}
                    </span>
                    <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#f5f5f7] border border-black/5 text-xs font-bold text-[#1d1d1f]">
                      <Clock className="w-3 h-3 text-[#0071E3]" />
                      <span>{srv.duration}</span>
                    </div>
                  </div>

                  <div className="text-3xl sm:text-4xl font-display font-black text-[#1d1d1f] my-2 tabular-numbers">
                    {srv.priceFormatted}
                  </div>
                  <p className="text-xs text-[#86868b] mb-5 leading-relaxed font-sans">
                    {srv.description}
                  </p>
                </div>

                <button 
                  onClick={() => onOpenBooking(srv.id)}
                  className="w-full bg-[#1d1d1f] hover:bg-[#FF2D55] text-white py-3 rounded-full text-xs font-bold transition shadow-sm active:scale-95 apple-focus flex items-center justify-center gap-1.5"
                >
                  <span>Book {srv.title}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
