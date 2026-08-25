import React, { useState } from 'react';
import { ShieldCheck, MapPin, Search, UserCheck, Star, Heart, CheckCircle2 } from 'lucide-react';

interface HeroSectionProps {
  onOpenBooking: () => void;
  onOpenPartnerJoin: () => void;
  onQuickSearch: (query: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenBooking, onOpenPartnerJoin, onQuickSearch }) => {
  const [searchPin, setSearchPin] = useState('');
  const [selectedServiceQuick, setSelectedServiceQuick] = useState('All Services');

  const liveCompanions = [
    {
      name: 'Priya S.',
      role: 'Cinema & Cafe Buddy',
      location: 'Delhi (110001)',
      rate: '₹1,500/hr',
      rating: '4.95 ★',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      tag: 'Available in 15 mins',
    },
    {
      name: 'Anjali M.',
      role: 'Events & Clubbing Partner',
      location: 'Mumbai (400050)',
      rate: '₹2,000/hr',
      rating: '5.0 ★',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      tag: 'Top Rated',
    },
    {
      name: 'Dr. Sunita R.',
      role: 'Senior Care & Support',
      location: 'Bengaluru (560038)',
      rate: '₹1,000/hr',
      rating: '4.98 ★',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      tag: 'Medical Background',
    },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchPin.trim()) {
      onQuickSearch(searchPin.trim());
    } else {
      onOpenBooking();
    }
  };

  return (
    <section 
      id="main-content"
      className="relative flex flex-col items-center text-center pt-32 sm:pt-40 pb-20 px-4 sm:px-6 overflow-hidden border-b border-pink-200/50"
    >
      {/* Background Ambient Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-pink-300/30 via-rose-200/20 to-purple-200/20 rounded-full blur-[100px] pointer-events-none -z-10"></div>

      <div className="max-w-5xl mx-auto flex flex-col items-center">
        
        {/* 1. Godly Minimalist Top Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/85 backdrop-blur-xl border border-pink-200/80 shadow-[0_2px_12px_rgba(244,114,182,0.12)] mb-8 transition-all hover:border-pink-300">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[11px] sm:text-xs font-semibold text-[#1d1d1f] tracking-tight">
            India's #1 Social &amp; Lifestyle Support Network
          </span>
          <span className="text-[10px] font-bold text-pink-700 bg-pink-100/90 px-2 py-0.5 rounded-full uppercase tracking-wider">
            19,000+ Pin Codes
          </span>
        </div>

        {/* 2. Godly Editorial Headline (Clean, Powerful, Luxury) */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[80px] font-medium tracking-tight text-[#1d1d1f] leading-[1.06] mb-6 max-w-4xl headline-balance">
          Real companionship, <br />
          <span className="font-serif italic font-normal text-pink-600/90">
            for every moment in life.
          </span>
        </h1>

        {/* 3. Subtitle */}
        <p className="text-base sm:text-lg md:text-xl text-[#1d1d1f]/75 max-w-2xl mb-10 leading-relaxed font-normal body-pretty">
          Connect with verified, background-checked companions for cinema nights, elder care support, cafe conversations, and social events across India.
        </p>

        {/* 4. Godly Unified Search & Booking Bar */}
        <div className="w-full max-w-2xl bg-white/90 backdrop-blur-2xl rounded-2xl sm:rounded-full p-2 sm:p-2.5 pl-4 sm:pl-6 border border-pink-200/90 shadow-[0_12px_36px_rgba(0,0,0,0.06)] mb-12 flex flex-col sm:flex-row items-center gap-3">
          
          {/* Service Dropdown */}
          <div className="w-full sm:w-auto flex items-center gap-2 border-b sm:border-b-0 sm:border-r border-pink-100 pb-2 sm:pb-0 sm:pr-4">
            <span className="text-xs text-[#86868b] font-medium">Service:</span>
            <select
              value={selectedServiceQuick}
              onChange={(e) => setSelectedServiceQuick(e.target.value)}
              className="bg-transparent text-xs sm:text-sm font-bold text-[#1d1d1f] focus:outline-none cursor-pointer"
            >
              <option value="All Services">All 16 Services</option>
              <option value="Movie Partner">🎬 Movie Partner</option>
              <option value="Elder Care">👵 Elder Care</option>
              <option value="Cafe Hangout">☕ Cafe Hangout</option>
              <option value="Clubbing & Nightlife">🎉 Clubbing &amp; Events</option>
              <option value="Shopping Buddy">🛍️ Shopping Buddy</option>
              <option value="Travel Guide">✈️ Travel Partner</option>
            </select>
          </div>

          {/* Postal Pin Search Input */}
          <div className="w-full sm:flex-1 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#0071e3] shrink-0" />
            <input 
              type="text"
              value={searchPin}
              onChange={(e) => setSearchPin(e.target.value)}
              placeholder="Enter your 6-digit pin code..."
              className="w-full bg-transparent text-xs sm:text-sm font-medium text-[#1d1d1f] placeholder-[#86868b] focus:outline-none"
            />
          </div>

          {/* Search CTA */}
          <button
            onClick={handleSearch}
            className="w-full sm:w-auto bg-[#0071e3] hover:bg-[#0077ed] text-white px-7 py-3 rounded-xl sm:rounded-full font-bold text-xs sm:text-sm transition-all duration-200 shadow-sm flex items-center justify-center gap-2 shrink-0 active:scale-95 apple-focus"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Find Companion</span>
          </button>
        </div>

        {/* 5. Live Verified Companions Preview Row (Godly Social Proof) */}
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 text-left">
          {liveCompanions.map((comp, idx) => (
            <div 
              key={idx}
              onClick={onOpenBooking}
              className="group cursor-pointer bg-white/80 backdrop-blur-xl rounded-2xl p-4 border border-pink-200/70 shadow-sm hover:shadow-apple-md hover:border-pink-300 transition-all duration-300 flex items-center gap-3.5"
            >
              <div className="relative shrink-0">
                <img 
                  src={comp.avatar} 
                  alt={comp.name} 
                  className="w-12 h-12 rounded-full object-cover border-2 border-pink-300 group-hover:scale-105 transition"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-bold text-[#1d1d1f] truncate flex items-center gap-1">
                    {comp.name} <CheckCircle2 className="w-3.5 h-3.5 text-[#0071e3]" />
                  </span>
                  <span className="text-[11px] font-bold text-pink-700 tabular-numbers">{comp.rate}</span>
                </div>
                <div className="text-[11px] text-[#86868b] truncate">{comp.role}</div>
                <div className="flex items-center justify-between mt-1 text-[10px]">
                  <span className="text-emerald-700 font-medium">{comp.tag}</span>
                  <span className="text-amber-500 font-bold flex items-center gap-0.5">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {comp.rating}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 6. Partner Fast-Track Link & Trust Indicators */}
        <div className="flex flex-wrap items-center justify-center gap-6 pt-2 text-xs text-[#1d1d1f]/80 font-medium">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#0071e3]" /> 100% Aadhaar &amp; KYC Verified
          </span>
          <span className="flex items-center gap-1.5">
            <Heart className="w-4 h-4 text-pink-600" /> Strict Consent-First Protocols
          </span>
          <button
            onClick={onOpenPartnerJoin}
            className="text-[#0071e3] hover:underline font-bold flex items-center gap-1"
          >
            <UserCheck className="w-4 h-4" /> Want to earn ₹2,000/hr? Join as Partner &rarr;
          </button>
        </div>

      </div>
    </section>
  );
};
