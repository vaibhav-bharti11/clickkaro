import React, { useState, useEffect } from 'react';
import { ArrowRight, ShieldCheck, MapPin, Search, Phone, MessageSquare, UserCheck, Heart, Zap, Flame, Play, Pause } from 'lucide-react';
import { HERO_SCENES } from '../data/heroScenes';

interface HeroSectionProps {
  onOpenBooking: () => void;
  onOpenPartnerJoin: () => void;
  onQuickSearch: (query: string) => void;
  activeSceneIndex?: number;
  onSceneChange?: (index: number) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ 
  onOpenBooking, 
  onOpenPartnerJoin, 
  onQuickSearch,
  activeSceneIndex = 0,
  onSceneChange
}) => {
  const [searchPin, setSearchPin] = useState('');
  const [activeCompanionIdx, setActiveCompanionIdx] = useState(0);
  const [callingState, setCallingState] = useState(false);
  const [internalSceneIdx, setInternalSceneIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  const currentSceneIndex = activeSceneIndex !== undefined ? activeSceneIndex : internalSceneIdx;

  const handleSelectScene = (idx: number) => {
    setProgress(0);
    if (onSceneChange) {
      onSceneChange(idx);
    } else {
      setInternalSceneIdx(idx);
    }
  };

  // Slideshow progress & auto-advance timer
  useEffect(() => {
    if (isPaused) return;

    const intervalTime = 4200; // 4.2 seconds per slide
    const tickTime = 50; // update progress every 50ms
    const step = (tickTime / intervalTime) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          const nextIdx = (currentSceneIndex + 1) % HERO_SCENES.length;
          handleSelectScene(nextIdx);
          return 0;
        }
        return prev + step;
      });
    }, tickTime);

    return () => clearInterval(timer);
  }, [currentSceneIndex, isPaused, onSceneChange]);

  const companions = [
    {
      name: 'Priya Sharma',
      role: 'Movie & Cafe Companion',
      location: 'Connaught Place, Delhi',
      pin: '110001',
      rate: '₹1,500/hr',
      rating: '4.95',
      reviewCount: 142,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80',
      sampleQuote: '“Booked for Select Citywalk cinema today. Ready to connect!”',
      verifiedTag: 'KYC Verified',
    },
    {
      name: 'Anjali Mehta',
      role: 'Events & Nightlife Wing-Partner',
      location: 'Bandra West, Mumbai',
      pin: '400050',
      rate: '₹2,000/hr',
      rating: '5.0',
      reviewCount: 98,
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=160&auto=format&fit=crop&q=80',
      sampleQuote: '“Your verified plus-one for art shows, parties & cocktail dinners.”',
      verifiedTag: 'Top Rated',
    },
    {
      name: 'Dr. Sunita Rao',
      role: 'Senior Care & Daily Buddy',
      location: 'Indiranagar, Bengaluru',
      pin: '560038',
      rate: '₹1,000/hr',
      rating: '4.98',
      reviewCount: 216,
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160&auto=format&fit=crop&q=80',
      sampleQuote: '“Empathetic senior assistance for walks, clinic visits & heartfelt talks.”',
      verifiedTag: 'Medical Companion',
    },
  ];

  const current = companions[activeCompanionIdx];
  const activeScene = HERO_SCENES[currentSceneIndex] || HERO_SCENES[0];

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
      className="relative flex flex-col items-center text-center pt-28 md:pt-36 pb-20 px-4 sm:px-6 overflow-hidden border-b border-black/10 transition-colors duration-1000"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* 1. Dynamic 8K Scene Background Slideshow */}
      <div 
        aria-hidden="true" 
        className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none"
      >
        {HERO_SCENES.map((scene, idx) => {
          const isActive = currentSceneIndex === idx;
          return (
            <div
              key={scene.id}
              className={`absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-out transform ${
                isActive 
                  ? 'opacity-100 scale-100 filter brightness-[0.85] contrast-[1.08]' 
                  : 'opacity-0 scale-105 filter brightness-70 pointer-events-none'
              }`}
              style={{
                backgroundImage: `url('${scene.image}')`,
              }}
            />
          );
        })}

        {/* Dynamic Eye-Popping Ambient Glow matching active scene */}
        <div 
          className="absolute inset-0 transition-opacity duration-1000"
          style={{
            background: `radial-gradient(circle at 50% 30%, ${activeScene.glowColor} 0%, rgba(0,0,0,0.55) 55%, rgba(0,0,0,0.85) 100%)`,
          }}
        />

        {/* Apple HIG Cinematic Vignette & Bottom Edge Blend */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/85" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#f5f5f7] to-transparent" />
      </div>

      {/* 2. Foreground Hero Content */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-6xl mx-auto">
        
        {/* Top Status Pill - Apple Translucent Glass with Neon Accents */}
        <div className="inline-flex items-center gap-2 px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full apple-liquid-pill mb-5 sm:mb-8 transition-all shadow-xl hover:border-white/40 max-w-[95%] sm:max-w-none">
          <span className="flex h-2 w-2 sm:h-2.5 sm:w-2.5 relative shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF2D55] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 sm:h-2.5 sm:w-2.5 bg-[#FF2D55]"></span>
          </span>
          <span className="text-[11px] sm:text-xs font-semibold text-white/95 tracking-wide truncate">
            India's #1 Lifestyle Support Network
          </span>
          <span className="w-1 h-1 rounded-full bg-white/40 shrink-0" />
          <span className="text-[10px] sm:text-[11px] font-bold text-white bg-gradient-to-r from-[#FF2D55] to-[#FF5E3A] px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-0.5 shrink-0">
            <Flame className="w-2.5 h-2.5 fill-white" /> 60% OFF
          </span>
        </div>

        {/* Bold Apple Pro Display Headline */}
        <div className="w-full max-w-5xl mx-auto mb-4 sm:mb-6">
          <h1 className="font-display font-black text-white leading-[1.12] sm:leading-[1.06] tracking-[-0.03em] text-[2.25rem] sm:text-5xl md:text-7xl lg:text-8xl drop-shadow-2xl">
            Never do{' '}
            <span
              onClick={() => handleSelectScene((currentSceneIndex + 1) % HERO_SCENES.length)}
              title="Click to switch experience"
              className="inline-block px-4 py-1 sm:px-6 sm:py-2 my-1 mx-1 sm:mx-2 rounded-2xl sm:rounded-3xl apple-liquid-glass border border-white/30 shadow-lg cursor-pointer select-none transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] group"
            >
              <span className={`bg-gradient-to-r ${activeScene.accentGradient} vibrant-gradient-text font-display font-black tracking-tight drop-shadow-sm`}>
                {activeScene.title}
              </span>
            </span>{' '}
            <br />
            alone in India again.
          </h1>
        </div>

        {/* High-Converting Subtitle */}
        <p className="text-white/85 text-xs sm:text-base md:text-lg max-w-xl mb-5 sm:mb-8 leading-relaxed font-sans px-3 drop-shadow-md">
          Meet verified, background-checked companions across India's 12 premier launch cities. 100% consent-first &amp; zero judgment.
        </p>

        {/* Apple Segmented Slideshow Navigation Dock */}
        <div className="w-full max-w-3xl mx-auto mb-6 sm:mb-8 px-1">
          {/* Horizontal Swipeable Segmented Bar on Mobile, Flex on Desktop */}
          <div className="apple-liquid-glass p-1 rounded-full flex items-center gap-1 shadow-2xl border border-white/20 overflow-x-auto no-scrollbar justify-start sm:justify-center">
            {HERO_SCENES.map((scene, idx) => {
              const isSelected = currentSceneIndex === idx;
              return (
                <button
                  key={scene.id}
                  type="button"
                  onClick={() => handleSelectScene(idx)}
                  className={`relative px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-bold tracking-tight transition-all duration-300 shrink-0 text-center ${
                    isSelected
                      ? 'text-white shadow-md'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {isSelected && (
                    <span 
                      className={`absolute inset-0 rounded-full bg-gradient-to-r ${scene.accentGradient} -z-10 shadow-md`}
                    />
                  )}
                  <span className="relative z-10 whitespace-nowrap">{scene.shortLabel}</span>
                </button>
              );
            })}
          </div>

          {/* Active Pricing & Slide Progress Sub-Bar */}
          <div className="flex items-center justify-between mt-2.5 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/15 text-[11px] sm:text-xs text-white/90 font-sans shadow-sm">
            <div className="flex items-center gap-2 truncate">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 animate-pulse" />
              <span className="font-bold text-white whitespace-nowrap">{activeScene.rate}</span>
              <span className="text-white/40 hidden sm:inline">&bull;</span>
              <span className="text-white/80 truncate text-[10px] sm:text-xs">{activeScene.tagline.includes('—') ? activeScene.tagline.split('—')[1].trim() : activeScene.tagline}</span>
            </div>

            <div className="flex items-center gap-2 shrink-0 ml-2">
              <span className="text-[10px] font-mono text-white/60">
                0{currentSceneIndex + 1} / 0{HERO_SCENES.length}
              </span>
              <div className="w-12 sm:w-16 h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${activeScene.accentGradient} transition-all duration-75`}
                  style={{ width: `${progress}%` }}
                />
              </div>
              <button 
                type="button" 
                onClick={() => setIsPaused(!isPaused)} 
                title={isPaused ? "Play slideshow" : "Pause slideshow"}
                className="p-1 rounded-full text-white/70 hover:text-white transition"
              >
                {isPaused ? <Play className="w-2.5 h-2.5 fill-current" /> : <Pause className="w-2.5 h-2.5 fill-current" />}
              </button>
            </div>
          </div>
        </div>

        {/* Primary High-Contrast Conversion CTAs */}
        <div className="flex w-full max-w-xs sm:max-w-none flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3.5 mb-8 sm:mb-14">
          <button 
            onClick={onOpenBooking}
            type="button" 
            className="w-full sm:w-auto rounded-full bg-[#0071E3] hover:bg-[#0077ED] text-white px-7 sm:px-10 py-3.5 sm:py-4 font-bold text-xs sm:text-sm transition-all duration-300 shadow-[0_10px_30px_rgba(0,113,227,0.5)] active:scale-95 flex items-center justify-center gap-2 apple-focus"
          >
            <span>Find a Companion Near Me</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button 
            onClick={onOpenPartnerJoin}
            type="button" 
            className="w-full sm:w-auto rounded-full apple-liquid-pill text-white px-6 sm:px-8 py-3.5 sm:py-4 font-bold text-xs sm:text-sm transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2 apple-focus"
          >
            <UserCheck className="w-4 h-4 text-[#2997ff]" />
            <span>Become a Partner (Earn ₹2K/hr)</span>
          </button>
        </div>

        {/* Live Active Companion Card Container */}
        <div className="relative w-full max-w-3xl mx-auto px-1 sm:px-2">
          
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute inset-0 bg-radial-gradient from-[#FF2D55]/30 via-[#7928CA]/20 to-transparent blur-3xl -z-10 pointer-events-none"></div>

          {/* Liquid Glass Pill */}
          <div className="apple-liquid-glass text-white rounded-2xl sm:rounded-3xl p-3 sm:p-4 pl-3.5 sm:pl-5 border border-white/25 shadow-2xl flex items-center justify-between gap-2.5 sm:gap-4 max-w-2xl mx-auto transition-all duration-300 hover:border-white/40 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            
            {/* Avatar with Live Emerald Ring */}
            <div className="relative shrink-0 flex items-center">
              <img 
                src={current.avatar} 
                alt={current.name} 
                className="w-10 h-10 sm:w-14 sm:h-14 rounded-full object-cover ring-2 ring-white/40"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 bg-[#10B981] rounded-full border-2 border-black" title="Active Online"></span>
            </div>

            {/* Name & Role */}
            <div className="flex flex-col text-left flex-1 min-w-0 font-sans">
              <div className="flex items-center gap-1">
                <span className="text-xs sm:text-base font-bold text-white tracking-tight truncate">
                  {current.name}
                </span>
                <ShieldCheck className="w-3.5 h-3.5 text-[#2997ff] shrink-0" aria-label="KYC Verified" />
                <span className="text-[9px] sm:text-[10px] font-semibold bg-white/15 px-1.5 py-0.5 rounded-full text-white/90 hidden sm:inline-block">
                  {current.verifiedTag}
                </span>
              </div>
              <div className="text-[11px] sm:text-xs text-white/70 truncate mt-0.5">
                {current.role} &bull; <span className="text-[#10B981] font-bold">{current.rate}</span>
              </div>
            </div>

            {/* Action Triggers */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleTriggerCall}
                disabled={callingState}
                className="bg-gradient-to-r from-[#FF2D55] via-[#E11D48] to-[#FF5E3A] hover:opacity-95 text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider px-3 sm:px-6 py-2 sm:py-3 rounded-full transition shadow-[0_8px_20px_rgba(255,45,85,0.4)] active:scale-95 flex items-center gap-1 shrink-0 apple-focus"
              >
                <Phone className={`w-3 h-3 ${callingState ? 'animate-bounce' : ''}`} />
                <span>{callingState ? 'Connecting...' : 'Connect'}</span>
              </button>

              <button
                onClick={onOpenBooking}
                aria-label="Message companion"
                className="w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center border border-white/20 transition shrink-0 apple-focus active:scale-95"
              >
                <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>

          {/* Companion Switcher Dots & Quote */}
          <div className="mt-4 flex flex-col items-center gap-2">
            <p className="text-xs text-white/85 italic max-w-lg mx-auto font-sans">
              {current.sampleQuote}
            </p>

            <div className="flex items-center gap-2 mt-1">
              {companions.map((comp, idx) => (
                <button
                  key={comp.name}
                  onClick={() => setActiveCompanionIdx(idx)}
                  aria-label={`Select ${comp.name}`}
                  className={`h-2 rounded-full transition-all duration-300 apple-focus ${
                    activeCompanionIdx === idx 
                      ? 'w-8 bg-gradient-to-r from-[#FF2D55] to-[#0A84FF] shadow-sm' 
                      : 'w-2 bg-white/30 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Instant Pin Code Lookup Form */}
          <form onSubmit={handleSearch} className="max-w-md mx-auto mt-8">
            <label htmlFor="landinghero-pin-search" className="sr-only">Enter 6-digit Pin Code</label>
            <div className="apple-liquid-glass rounded-full p-2 pl-5 flex items-center gap-2.5 border border-white/30 shadow-2xl focus-within:ring-2 focus-within:ring-[#0071E3] transition">
              <MapPin className="w-4 h-4 text-[#0071E3] shrink-0" aria-hidden="true" />
              <input 
                id="landinghero-pin-search"
                type="text"
                value={searchPin}
                onChange={(e) => setSearchPin(e.target.value)}
                placeholder="Enter 6-digit pin code (e.g. 110001, 400050)..."
                className="w-full bg-transparent text-xs sm:text-sm font-medium text-white placeholder-white/50 focus:outline-none"
              />
              <button 
                type="submit"
                aria-label="Search pin code"
                className="bg-white hover:bg-white/90 text-black text-xs font-bold px-5 py-2.5 rounded-full transition flex items-center gap-1.5 shrink-0 apple-focus active:scale-95 shadow-md"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Search</span>
              </button>
            </div>
          </form>

          {/* Catchy Viral Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-xs font-semibold text-white/95 drop-shadow-md">
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-[#2997ff]" /> 100% Aadhaar KYC</span>
            <span className="flex items-center gap-1.5"><Heart className="w-4 h-4 text-[#FF2D55]" /> Consent-First Protocol</span>
            <span className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-[#F59E0B]" /> 15-Minute Instant Match</span>
          </div>

        </div>
      </div>

    </section>
  );
};
