import React from 'react';
import { ArrowRight, UserCheck, ShieldCheck, Heart, Sparkles } from 'lucide-react';

interface CtaBannerProps {
  onOpenBooking: () => void;
  onOpenPartnerJoin: () => void;
}

export const CtaBanner: React.FC<CtaBannerProps> = ({ onOpenBooking, onOpenPartnerJoin }) => {
  return (
    <section className="py-28 px-4 sm:px-6 relative overflow-hidden text-center bg-[#121214] text-white">
      {/* Ambient Radial Glow */}
      <div className="absolute inset-0 bg-radial-gradient from-pink-500/20 via-pink-900/10 to-transparent blur-3xl pointer-events-none -z-10"></div>

      <div className="max-w-4xl mx-auto flex flex-col items-center relative z-10">
        
        {/* Top Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-md mb-6">
          <Sparkles className="w-3.5 h-3.5 text-pink-400" />
          <span className="text-xs font-semibold text-white tracking-wide uppercase">
            India's #1 Social &amp; Lifestyle Support Network
          </span>
        </div>

        {/* Master Heading */}
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-white mb-6 headline-balance leading-[1.08]">
          Find a companion for every occasion, <br />
          <span className="text-white/40">in any city across India.</span>
        </h2>

        <p className="text-white/70 text-base sm:text-lg mb-10 leading-relaxed max-w-2xl body-pretty">
          Stop missing out on cinema screenings, casual hangouts, dinner outings, or travel getaways alone. Connect with background-checked, verified companions across India's 12 premier launch cities.
        </p>

        {/* Conversion Buttons */}
        <div className="flex flex-col sm:flex-row gap-3.5 w-full sm:w-auto mb-10">
          <button
            onClick={onOpenBooking}
            className="bg-[#0071e3] hover:bg-[#0077ed] text-white font-semibold text-sm px-9 py-4 rounded-full transition-all duration-300 shadow-apple-md hover:shadow-apple-lg active:scale-95 flex items-center justify-center gap-2 apple-focus"
          >
            <span>Find a Companion Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenPartnerJoin}
            className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-sm px-8 py-4 rounded-full transition-all active:scale-95 flex items-center justify-center gap-2 apple-focus"
          >
            <UserCheck className="w-4 h-4 text-[#2997ff]" />
            <span>Join as Partner (Earn ₹2K/hr)</span>
          </button>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-white/50 pt-4 border-t border-white/10 w-full">
          <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-[#2997ff]" /> 100% Aadhaar Verified</span>
          <span className="flex items-center gap-1.5"><Heart className="w-3.5 h-3.5 text-pink-400" /> Strict Consent-First Protocols</span>
          <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 24/7 SOS Protection</span>
        </div>

      </div>
    </section>
  );
};
