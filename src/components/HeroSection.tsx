import React, { useState, useEffect } from 'react';
import { ArrowRight, ShieldCheck, MapPin, Search, Phone, MessageSquare, UserCheck, Heart, Zap, Flame } from 'lucide-react';

interface HeroSectionProps {
  onOpenBooking: () => void;
  onOpenPartnerJoin: () => void;
  onQuickSearch: (query: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenBooking, onOpenPartnerJoin, onQuickSearch }) => {
  const [searchPin, setSearchPin] = useState('');
  const [activeCompanionIdx, setActiveCompanionIdx] = useState(0);
  const [callingState, setCallingState] = useState(false);
  const [rotatingWordIdx, setRotatingWordIdx] = useState(0);

  const rotatingWords = [
    'Cinema Nights 🎬',
    'Elder Care 👴',
    'Cafe Outings ☕',
    'Weekend Parties 🎉',
    'Shopping Sprees 🛍️',
    'City Roadtrips 🚗',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setRotatingWordIdx((prev) => (prev + 1) % rotatingWords.length);
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  const companions = [
    {
      name: 'Priya Sharma',
      role: 'Movie & Cafe Companion',
      location: 'Connaught Place, Delhi (110001)',
      rate: '₹1,500/hr',
      rating: '4.95 ★',
      status: 'Active Now',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      sampleQuote: '“Booked for Select Citywalk cinema today. Ready to connect!”',
      verifiedTag: 'KYC Verified 🇮🇳',
    },
    {
      name: 'Anjali Mehta',
      role: 'Events & Nightlife Wing-Partner',
      location: 'Bandra West, Mumbai (400050)',
      rate: '₹2,000/hr',
      rating: '5.0 ★',
      status: 'Active Now',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      sampleQuote: '“Your verified plus-one for art shows, parties & cocktail dinners.”',
      verifiedTag: '5.0★ Top Rated',
    },
    {
      name: 'Dr. Sunita Rao',
      role: 'Senior Care & Daily Buddy',
      location: 'Indiranagar, Bengaluru (560038)',
      rate: '₹1,000/hr',
      rating: '4.98 ★',
      status: 'Active Now',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      sampleQuote: '“Empathetic senior assistance for walks, clinic visits & heartfelt talks.”',
      verifiedTag: 'Medical Companion',
    },
  ];

  const current = companions[activeCompanionIdx];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchPin.trim()) {
      onQuickSearch(searchPin.trim());
    }
  };

  const handleTriggerCall = () => {
    setCallingState(true);
    setTimeout(() => {
      setCallingState(false);
      onOpenBooking();
    }, 800);
  };

  return (
    <section 
      id="main-content"
      className="relative flex flex-col items-center text-center pt-28 md:pt-36 pb-16 px-4 sm:px-6 overflow-hidden border-b border-pink-200/50"
    >
      {/* 1. Viral Top Floating Pill with Animated Gradient Sheen */}
      <div className="group cursor-pointer inline-flex items-center gap-2.5 px-5 py-2 rounded-full border border-pink-300/80 bg-white/80 backdrop-blur-xl mb-6 hover:border-pink-500 transition-all shadow-sm hover:shadow-md animate-float">
        <span className="flex h-2.5 w-2.5 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-pink-600"></span>
        </span>
        <span className="text-xs font-bold text-[#1d1d1f] tracking-tight">
          India's #1 Social &amp; Lifestyle Support Network
        </span>
        <span className="text-[10px] font-black text-white bg-gradient-to-r from-pink-600 via-purple-600 to-orange-500 px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
          <Flame className="w-3 h-3 fill-white" /> 60% OFF Launch
        </span>
      </div>

      {/* 2. Viral Catchy Headline with Kinetic Rotating Text & Voice Waveform */}
      <div className="max-w-4xl mx-auto mb-6">
        <h1 className="font-bold text-[#1d1d1f] leading-[1.08] tracking-tight font-sans text-4xl sm:text-6xl md:text-7xl lg:text-8xl headline-balance">
          Never do <br className="sm:hidden" />
          <span className="inline-block min-w-[280px] sm:min-w-[420px] text-left sm:text-center px-3 py-1 my-1 rounded-2xl bg-white/70 backdrop-blur-md border border-pink-300/60 shadow-sm bg-gradient-to-r from-pink-600 via-purple-600 to-orange-500 bg-clip-text text-transparent transition-all duration-500 font-serif italic">
            {rotatingWords[rotatingWordIdx]}
          </span> <br />
          alone in India again.
          
          {/* LandingHero Signature Voice-Wave Bar */}
          <span className="inline-flex items-center gap-[3px] align-middle mx-3.5" style={{ height: '0.85em' }} aria-hidden="true">
            <span className="inline-block w-[3.5px] h-4 bg-pink-600 rounded-full animate-[pulse_0.8s_ease-in-out_infinite]"></span>
            <span className="inline-block w-[3.5px] h-8 bg-purple-600 rounded-full animate-[pulse_0.8s_ease-in-out_infinite_0.15s]"></span>
            <span className="inline-block w-[3.5px] h-10 bg-pink-500 rounded-full animate-[pulse_0.8s_ease-in-out_infinite_0.3s]"></span>
            <span className="inline-block w-[3.5px] h-7 bg-orange-500 rounded-full animate-[pulse_0.8s_ease-in-out_infinite_0.45s]"></span>
            <span className="inline-block w-[3.5px] h-3 bg-pink-400 rounded-full animate-[pulse_0.8s_ease-in-out_infinite_0.6s]"></span>
          </span>
        </h1>
      </div>

      {/* 3. High-Converting Subtitle */}
      <p className="text-[#1d1d1f]/80 text-base sm:text-lg md:text-xl max-w-2xl mb-8 leading-relaxed body-pretty font-medium">
        Meet verified, background-checked companions who show up, listen, and share life's best moments across 19,000+ Indian pin codes. 100% consent-first &amp; zero judgment.
      </p>

      {/* 4. Dual Catchy LandingHero Conversion CTAs */}
      <div className="flex w-full max-w-sm flex-col items-stretch gap-3 sm:w-auto sm:max-w-none sm:flex-row sm:items-center mb-12">
        <button 
          onClick={onOpenBooking}
          type="button" 
          className="w-full sm:w-auto rounded-full bg-gradient-to-r from-[#0071e3] to-[#005bb5] hover:from-[#0077ed] hover:to-[#0066cc] text-white px-9 py-4 font-bold text-sm transition-all duration-300 shadow-apple-md hover:shadow-apple-lg active:scale-95 flex items-center justify-center gap-2 apple-focus"
        >
          <span>Find a Companion Near Me</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button 
          onClick={onOpenPartnerJoin}
          type="button" 
          className="w-full sm:w-auto rounded-full border border-pink-300 bg-white/90 hover:bg-white text-[#1d1d1f] px-8 py-4 font-bold text-sm transition-colors shadow-sm active:scale-95 flex items-center justify-center gap-2 apple-focus"
        >
          <UserCheck className="w-4 h-4 text-[#0071e3]" />
          <span>Become a Partner (Earn ₹2K/hr)</span>
        </button>
      </div>

      {/* 5. LandingHero Interactive Live Floating Pill Container */}
      <div className="relative w-full max-w-3xl mx-auto px-4">
        
        {/* Subtle Ambient Glow */}
        <div className="absolute inset-0 bg-radial-gradient from-pink-400/25 via-purple-300/10 to-transparent blur-3xl -z-10 pointer-events-none"></div>

        {/* The LandingHero Signature Live Pill */}
        <div className="bg-[#121214] text-white rounded-full p-2.5 sm:p-3 pl-3 sm:pl-4 border border-white/25 shadow-apple-float flex items-center justify-between gap-3 sm:gap-4 max-w-2xl mx-auto transition-all duration-300 hover:border-pink-500/60 hover:shadow-[0_20px_50px_rgba(236,72,153,0.25)]">
          
          {/* Avatar with Live Green Status */}
          <div className="relative shrink-0 flex items-center">
            <img 
              src={current.avatar} 
              alt={current.name} 
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-pink-400"
            />
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-[#121214]" title="Active Online"></span>
          </div>

          {/* Name & Role */}
          <div className="flex flex-col text-left flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs sm:text-base font-bold text-white tracking-tight truncate">
                {current.name}
              </span>
              <ShieldCheck className="w-4 h-4 text-[#2997ff] shrink-0" aria-label="Aadhaar Verified" />
            </div>
            <div className="text-[11px] sm:text-xs text-[#86868b] truncate">
              {current.role} &bull; <span className="text-emerald-400 font-bold">{current.rate}</span>
            </div>
          </div>

          {/* Divider */}
          <div className="hidden sm:block w-px h-8 bg-white/20"></div>

          {/* Action Triggers */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleTriggerCall}
              disabled={callingState}
              className="bg-gradient-to-r from-pink-600 via-purple-600 to-orange-500 hover:opacity-90 text-white text-xs font-bold uppercase tracking-wider px-4 sm:px-6 py-2.5 sm:py-3 rounded-full transition shadow-md active:scale-95 flex items-center gap-1.5 shrink-0 apple-focus"
            >
              <Phone className={`w-3.5 h-3.5 ${callingState ? 'animate-bounce' : ''}`} />
              <span>{callingState ? 'Connecting...' : 'Connect Now'}</span>
            </button>

            <button
              onClick={onOpenBooking}
              aria-label="Message companion"
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center border border-white/15 transition shrink-0 apple-focus"
            >
              <MessageSquare className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Companion Switcher Dots & Quote */}
        <div className="mt-4 flex flex-col items-center gap-2">
          <p className="text-xs text-[#1d1d1f]/85 italic max-w-lg mx-auto font-medium">
            {current.sampleQuote}
          </p>

          <div className="flex items-center gap-2 mt-1">
            {companions.map((comp, idx) => (
              <button
                key={comp.name}
                onClick={() => setActiveCompanionIdx(idx)}
                aria-label={`Select ${comp.name}`}
                className={`h-2.5 rounded-full transition-all apple-focus ${
                  activeCompanionIdx === idx ? 'w-8 bg-gradient-to-r from-pink-600 to-purple-600 shadow-sm' : 'w-2.5 bg-pink-300 hover:bg-pink-400'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Instant Pin Code Lookup Form */}
        <form onSubmit={handleSearch} className="max-w-md mx-auto mt-8">
          <label htmlFor="landinghero-pin-search" className="sr-only">Enter 6-digit Pin Code</label>
          <div className="bg-white/95 backdrop-blur-xl rounded-full p-2 pl-5 flex items-center gap-2.5 border border-pink-300 shadow-sm focus-within:ring-2 focus-within:ring-[#0071e3] transition">
            <MapPin className="w-4 h-4 text-[#0071e3] shrink-0" aria-hidden="true" />
            <input 
              id="landinghero-pin-search"
              type="text"
              value={searchPin}
              onChange={(e) => setSearchPin(e.target.value)}
              placeholder="Enter 6-digit pin (e.g. 110001, 400001)..."
              className="w-full bg-transparent text-xs sm:text-sm font-medium text-[#1d1d1f] placeholder-[#86868b] focus:outline-none"
            />
            <button 
              type="submit"
              aria-label="Search pin code"
              className="bg-[#1d1d1f] hover:bg-[#0071e3] text-white text-xs font-bold px-5 py-2.5 rounded-full transition flex items-center gap-1.5 shrink-0 apple-focus"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search</span>
            </button>
          </div>
        </form>

        {/* 3 Catchy Viral Trust Indicators */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-xs font-bold text-[#1d1d1f]">
          <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-[#0071e3]" /> 100% Aadhaar KYC</span>
          <span className="flex items-center gap-1.5"><Heart className="w-4 h-4 text-pink-600" /> Consent-First Protocol</span>
          <span className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-amber-500" /> 15-Minute Instant Match</span>
        </div>

      </div>

    </section>
  );
};
