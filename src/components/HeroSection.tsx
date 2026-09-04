import React, { useState, useEffect } from 'react';
import { ArrowRight, ShieldCheck, Phone, MessageSquare, UserCheck, Heart, Sparkles, CheckCircle2 } from 'lucide-react';
import { HERO_SCENES } from '../data/heroScenes';

interface HeroSectionProps {
  onOpenBooking: (context?: any) => void;
  onOpenPartnerJoin: () => void;
  onQuickSearch?: (query: string) => void;
  activeSceneIndex?: number;
  onSceneChange?: (index: number) => void;
  isLoggedIn?: boolean;
  onOpenAuth?: (mode?: 'signin' | 'signup') => void;
  onNavigateSeeker?: () => void;
  onNavigateCompanion?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ 
  onOpenBooking, 
  onOpenPartnerJoin, 
  onQuickSearch: _onQuickSearch,
  activeSceneIndex = 0,
  onSceneChange,
  isLoggedIn = false,
  onOpenAuth,
  onNavigateSeeker,
  onNavigateCompanion,
}) => {
  const [activeCompanionIdx, setActiveCompanionIdx] = useState(0);
  const [callingState, setCallingState] = useState(false);
  const [internalSceneIdx, setInternalSceneIdx] = useState(0);

  const currentSceneIndex = activeSceneIndex !== undefined ? activeSceneIndex : internalSceneIdx;

  const handleSelectScene = (idx: number) => {
    if (onSceneChange) {
      onSceneChange(idx);
    } else {
      setInternalSceneIdx(idx);
    }
  };

  // Continuous auto-advance slideshow timer with smooth transitions
  useEffect(() => {
    const timer = setInterval(() => {
      const nextIdx = (currentSceneIndex + 1) % HERO_SCENES.length;
      handleSelectScene(nextIdx);
    }, 5000);

    return () => clearInterval(timer);
  }, [currentSceneIndex, onSceneChange]);

  const companions = [
    {
      name: 'Priya Sharma',
      role: 'Movie & Cafe Companion',
      location: 'Connaught Place, Delhi',
      pin: '110001',
      rate: '₹7,999/day',
      rating: '4.95',
      reviewCount: 142,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80',
      sampleQuote: '“Available for art exhibitions, movie screenings & cafe conversations.”',
      verifiedTag: 'Face Verified',
    },
    {
      name: 'Anjali Mehta',
      role: 'Social & Dining Companion',
      location: 'Bandra West, Mumbai',
      pin: '400050',
      rate: '₹8,500/day',
      rating: '5.0',
      reviewCount: 98,
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=160&auto=format&fit=crop&q=80',
      sampleQuote: '“Your verified companion for cultural shows, fine dining & city exploration.”',
      verifiedTag: 'Top Rated',
    },
    {
      name: 'Dr. Sunita Rao',
      role: 'Senior Care & Walking Buddy',
      location: 'Indiranagar, Bengaluru',
      pin: '560038',
      rate: '₹7,000/day',
      rating: '4.98',
      reviewCount: 216,
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160&auto=format&fit=crop&q=80',
      sampleQuote: '“Empathetic lifestyle assistance for morning walks, clinic visits & heartfelt talks.”',
      verifiedTag: 'Lifestyle Companion',
    },
  ];

  const current = companions[activeCompanionIdx];
  const activeScene = HERO_SCENES[currentSceneIndex] || HERO_SCENES[0];

  const handleSeekerAction = () => {
    if (!isLoggedIn) {
      if (onOpenAuth) onOpenAuth('signin');
      else onOpenBooking();
    } else {
      if (onNavigateSeeker) onNavigateSeeker();
      else onOpenBooking();
    }
  };

  const handleCompanionAction = () => {
    if (!isLoggedIn) {
      if (onOpenAuth) onOpenAuth('signup');
      else onOpenPartnerJoin();
    } else {
      if (onNavigateCompanion) onNavigateCompanion();
      else onOpenPartnerJoin();
    }
  };

  const handleTriggerCall = () => {
    setCallingState(true);
    setTimeout(() => {
      setCallingState(false);
      handleSeekerAction();
    }, 600);
  };

  return (
    <section 
      id="main-content"
      className="relative flex flex-col items-center text-center pt-24 md:pt-32 pb-20 px-4 sm:px-6 overflow-hidden border-b border-pink-200/50"
    >
      {/* 1. Dynamic Light Tone 8K Scene Background Slideshow with Adjusted Opacity for Maximum Readability */}
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
                  ? 'opacity-35 scale-100 filter brightness-105 saturate-110' 
                  : 'opacity-0 scale-105 filter brightness-100 pointer-events-none'
              }`}
              style={{
                backgroundImage: `url('${scene.image}')`,
              }}
            />
          );
        })}

        {/* Ambient Center Daylight Diffusion (Seamless natural contrast without any card box) */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 50% 45%, rgba(255,255,255,0.85) 0%, rgba(255,245,248,0.55) 50%, rgba(255,235,240,0.2) 100%)',
          }}
        />

        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#fff0f5] to-transparent pointer-events-none" />
      </div>

      {/* 2. Foreground Hero Content (Floating directly with high-contrast, razor-sharp typography) */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-5xl mx-auto">
        
        <div className="w-full flex flex-col items-center mb-8">
          
          {/* Top Pill / Tagline with Live Pulsing Dot */}
          <div className="inline-flex items-center gap-2.5 px-5 sm:px-7 py-2 rounded-full bg-white/95 backdrop-blur-xl border border-pink-300 shadow-apple-sm mb-5 max-w-full">
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF2D55] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FF2D55]" />
            </span>
            <span className="text-[11px] sm:text-xs md:text-sm font-extrabold text-pink-800 tracking-wide text-center">
              India-wide coverage &bull; Verified profiles &bull; Privacy-focused &bull; Professional support
            </span>
          </div>

          {/* Website Branding Pill */}
          <div className="mb-3">
            <span className="inline-block bg-gradient-to-r from-[#FF0055] via-[#E11D48] to-[#7928CA] text-white font-mono text-[11px] sm:text-xs font-black tracking-widest uppercase px-4 py-1.5 rounded-full shadow-md">
              Click karo date karo.com
            </span>
          </div>

          {/* Bold Core Headline with High Contrast & Colour Popping Effect */}
          <h1 className="font-display font-black text-[#09090b] text-4xl sm:text-6xl md:text-7xl lg:text-8xl leading-[1.04] tracking-[-0.035em] mb-4 drop-shadow-[0_2px_8px_rgba(255,255,255,0.9)]">
            Click. <span className="bg-gradient-to-r from-[#FF0055] via-[#E11D48] to-[#8B5CF6] bg-clip-text text-transparent filter drop-shadow-[0_4px_16px_rgba(255,0,85,0.4)]">Connect.</span> Date.
          </h1>

          {/* Client Description Paragraph (Semibold high-contrast ink for 100% effortless readability) */}
          <p className="text-[#111827] text-base sm:text-lg md:text-xl max-w-3xl mx-auto mb-8 font-sans leading-relaxed font-semibold drop-shadow-[0_1px_3px_rgba(255,255,255,0.95)]">
            Discover genuine people, explore new connections and find someone who matches your interests. Click Karo Date Karo makes it simple to connect, chat and plan meaningful dates in a safe and respectful environment.
          </p>

          {/* Action Buttons with High-Voltage Colour Pop & Spring Micro-Motion */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 mb-8">
            <button 
              onClick={handleSeekerAction}
              type="button" 
              className="w-full sm:w-auto rounded-full bg-gradient-to-r from-[#FF2D55] via-[#E11D48] to-[#9333EA] hover:from-[#E11D48] hover:to-[#7928CA] text-white px-8 sm:px-10 py-4 font-bold text-xs sm:text-sm transition-all duration-300 shadow-[0_12px_32px_rgba(255,45,85,0.45)] hover:shadow-[0_16px_40px_rgba(255,45,85,0.6)] hover:scale-[1.03] active:scale-[0.97] flex items-center justify-center gap-2 cursor-pointer apple-focus"
            >
              <span>Find a Companion</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button 
              onClick={handleCompanionAction}
              type="button" 
              className="w-full sm:w-auto rounded-full bg-white/95 hover:bg-white text-[#1d1d1f] border-2 border-pink-200 hover:border-[#FF2D55]/60 px-7 sm:px-9 py-4 font-bold text-xs sm:text-sm transition-all duration-300 shadow-apple-md hover:shadow-apple-lg hover:scale-[1.03] active:scale-[0.97] flex items-center justify-center gap-2.5 cursor-pointer apple-focus"
            >
              <UserCheck className="w-4 h-4 text-[#FF2D55]" />
              <span>Become a Companion</span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black tracking-wide border border-emerald-300/60 shadow-xs">
                Earn ₹7-10k/day
              </span>
            </button>
          </div>

          {/* Floating Scene Switcher Dock with Reactive Colour Popping */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans bg-white/80 backdrop-blur-xl px-5 py-2.5 rounded-full border border-pink-200/80 shadow-apple-sm">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar max-w-full">
              {HERO_SCENES.map((scene, idx) => {
                const isActive = currentSceneIndex === idx;
                return (
                  <button
                    key={scene.id}
                    onClick={() => handleSelectScene(idx)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-300 whitespace-nowrap cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-[#FF2D55] to-[#E11D48] text-white shadow-sm scale-[1.02]'
                        : 'text-[#1d1d1f]/65 hover:text-[#1d1d1f] hover:bg-pink-100/50'
                    }`}
                  >
                    {scene.shortLabel}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2.5">
              <span className="text-[#FF2D55] font-extrabold tracking-tight">
                {activeScene.title}
              </span>
              <span className="text-stone-300">&bull;</span>
              <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 font-mono font-bold px-3 py-1 rounded-full text-xs shadow-xs">
                {activeScene.rate}
              </span>
            </div>
          </div>

        </div>

        {/* Live Active Companion Preview Card (Floating Apple Liquid Glass) */}
        <div className="relative w-full max-w-2xl mx-auto px-1">
          <div className="bg-white/85 backdrop-blur-2xl text-[#1d1d1f] rounded-2xl sm:rounded-3xl p-3 sm:p-4 pl-3.5 sm:pl-5 border border-pink-200 shadow-apple-md hover:shadow-apple-lg transition-all duration-300 flex items-center justify-between gap-3 max-w-xl mx-auto">
            
            {/* Avatar with Live Emerald Ring */}
            <div className="relative shrink-0 flex items-center">
              <img 
                src={current.avatar} 
                alt={current.name} 
                className="w-11 h-11 sm:w-14 sm:h-14 rounded-full object-cover ring-2 ring-pink-400/80 shadow-xs"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#10B981] rounded-full border-2 border-white animate-pulse" title="Active Online" />
            </div>

            {/* Name & Role */}
            <div className="flex flex-col text-left flex-1 min-w-0 font-sans">
              <div className="flex items-center gap-1.5">
                <span className="text-xs sm:text-base font-bold text-[#1d1d1f] tracking-tight truncate">
                  {current.name}
                </span>
                <ShieldCheck className="w-3.5 h-3.5 text-[#0071e3] shrink-0" aria-label="Face Verified" />
                <span className="text-[9px] sm:text-[10px] font-bold bg-pink-100 text-pink-800 px-2 py-0.5 rounded-full hidden sm:inline-block">
                  {current.verifiedTag}
                </span>
              </div>
              <div className="text-[11px] sm:text-xs text-[#86868b] truncate mt-0.5">
                {current.role} &bull; <span className="text-emerald-600 font-bold">{current.rate}</span>
              </div>
            </div>

            {/* Action Triggers */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleTriggerCall}
                disabled={callingState}
                className="bg-gradient-to-r from-[#FF2D55] via-[#E11D48] to-[#FF5E3A] hover:opacity-95 text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider px-4 sm:px-6 py-2.5 sm:py-3 rounded-full transition shadow-xs active:scale-95 flex items-center gap-1 shrink-0 apple-focus cursor-pointer"
              >
                <Phone className={`w-3 h-3 ${callingState ? 'animate-bounce' : ''}`} />
                <span>{callingState ? 'Connecting...' : 'Connect'}</span>
              </button>

              <button
                onClick={handleSeekerAction}
                aria-label="Message companion"
                className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-pink-50 hover:bg-pink-100 text-[#1d1d1f] flex items-center justify-center border border-pink-200 transition shrink-0 apple-focus active:scale-95 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-[#0071e3]" />
              </button>
            </div>
          </div>

          {/* Companion Switcher Dots */}
          <div className="flex items-center justify-center gap-2 mt-3">
            {companions.map((comp, idx) => (
              <button
                key={comp.name}
                onClick={() => setActiveCompanionIdx(idx)}
                aria-label={`Select ${comp.name}`}
                className={`h-2 rounded-full transition-all duration-300 apple-focus cursor-pointer ${
                  activeCompanionIdx === idx 
                    ? 'w-7 bg-[#FF2D55] shadow-xs' 
                    : 'w-2 bg-pink-300/60 hover:bg-pink-400'
                }`}
              />
            ))}
          </div>

          {/* Clean Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-6 text-xs font-semibold text-[#1d1d1f]/80">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#0071e3]" /> 100% Face Verified
            </span>
            <span className="flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-[#FF2D55]" /> Consent-First Protocol
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" /> Professional Support
            </span>
          </div>

        </div>

      </div>

    </section>
  );
};

export default HeroSection;
