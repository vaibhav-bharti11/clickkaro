import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  ShieldCheck, 
  Phone, 
  MessageSquare, 
  UserCheck, 
  Heart, 
  Sparkles, 
  CheckCircle2,
  Users
} from 'lucide-react';
import { HERO_SCENES } from '../data/heroScenes';
import { MOCK_COMPANIONS } from '../data/mockProfiles';
import { fetchProfilesFromSupabase } from '../services/supabase';
import { useCms } from '../context/CmsContext';
import { CompanionProfile } from '../types';

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
  const { content } = useCms();
  const heroCms = content.hero;

  const [activeCompanionIdx, setActiveCompanionIdx] = useState(0);
  const [callingState, setCallingState] = useState(false);
  const [internalSceneIdx, setInternalSceneIdx] = useState(0);
  const [profileList, setProfileList] = useState<CompanionProfile[]>(MOCK_COMPANIONS);
  const [isFading, setIsFading] = useState(false);

  const currentSceneIndex = activeSceneIndex !== undefined ? activeSceneIndex : internalSceneIdx;

  const handleSelectScene = (idx: number) => {
    if (onSceneChange) {
      onSceneChange(idx);
    } else {
      setInternalSceneIdx(idx);
    }
  };

  // 1. Sync live database companion profiles
  useEffect(() => {
    let isMounted = true;
    fetchProfilesFromSupabase()
      .then((data: CompanionProfile[]) => {
        if (isMounted && data && data.length > 0) {
          setProfileList(data);
        }
      })
      .catch((err: any) => console.warn('[HeroSection] DB profiles fetch note:', err));
    return () => { isMounted = false; };
  }, []);

  // 2. Auto-advancing background scene slideshow timer (5s)
  useEffect(() => {
    const scenes = heroCms.backgroundScenes && heroCms.backgroundScenes.length > 0
      ? heroCms.backgroundScenes
      : HERO_SCENES;

    const timer = setInterval(() => {
      const nextIdx = (currentSceneIndex + 1) % scenes.length;
      handleSelectScene(nextIdx);
    }, 6000);

    return () => clearInterval(timer);
  }, [currentSceneIndex, heroCms.backgroundScenes, onSceneChange]);

  // 3. Curiosity-sparking Companion Profile Glimpse Slideshow Timer (3.5s)
  useEffect(() => {
    if (profileList.length === 0) return;

    const interval = setInterval(() => {
      setIsFading(true);
      setTimeout(() => {
        setActiveCompanionIdx((prev) => (prev + 1) % profileList.length);
        setIsFading(false);
      }, 250);
    }, 3800);

    return () => clearInterval(interval);
  }, [profileList.length]);

  const currentCompanion = profileList[activeCompanionIdx] || profileList[0] || MOCK_COMPANIONS[0];
  const activeSceneList = heroCms.backgroundScenes && heroCms.backgroundScenes.length > 0
    ? heroCms.backgroundScenes
    : HERO_SCENES;
  const activeScene = activeSceneList[currentSceneIndex] || activeSceneList[0];

  const handleSeekerAction = (companion?: CompanionProfile) => {
    if (!isLoggedIn) {
      if (onOpenAuth) onOpenAuth('signin');
      else onOpenBooking(companion ? { preferredCompanion: companion.name, companion } : undefined);
    } else {
      if (onNavigateSeeker) onNavigateSeeker();
      else onOpenBooking(companion ? { preferredCompanion: companion.name, companion } : undefined);
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
      handleSeekerAction(currentCompanion);
    }, 500);
  };

  return (
    <section 
      id="main-content"
      className="relative flex flex-col items-center text-center pt-24 md:pt-32 pb-20 px-4 sm:px-6 overflow-hidden border-b border-pink-200/50 font-sans"
    >
      {/* 1. Dynamic Light Tone 8K Scene Background Slideshow */}
      <div 
        aria-hidden="true" 
        className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none"
      >
        {activeSceneList.map((scene, idx) => {
          const isActive = currentSceneIndex === idx;
          const bgImg = (scene as any).imageUrl || (scene as any).image || '';
          return (
            <div
              key={scene.id || idx}
              className={`absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-out transform ${
                isActive 
                  ? 'opacity-35 scale-100 filter brightness-105 saturate-110' 
                  : 'opacity-0 scale-105 filter brightness-100 pointer-events-none'
              }`}
              style={{
                backgroundImage: `url('${bgImg}')`,
              }}
            />
          );
        })}

        {/* Ambient Center Daylight Diffusion */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 50% 45%, rgba(255,255,255,0.85) 0%, rgba(255,245,248,0.55) 50%, rgba(255,235,240,0.2) 100%)',
          }}
        />

        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#fff0f5] to-transparent pointer-events-none" />
      </div>

      {/* 2. Foreground Hero Content */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-5xl mx-auto">
        
        <div className="w-full flex flex-col items-center mb-8">
          
          {/* Top Pill / Tagline with Live Pulsing Dot */}
          <div className="inline-flex items-center gap-2.5 px-5 sm:px-7 py-2 rounded-full bg-white/95 backdrop-blur-xl border border-pink-300 shadow-apple-sm mb-5 max-w-full">
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF2D55] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FF2D55]" />
            </span>
            <span className="text-[11px] sm:text-xs md:text-sm font-extrabold text-pink-800 tracking-wide text-center">
              {heroCms.badgeText} &bull; {heroCms.badgeSubtext}
            </span>
          </div>

          {/* Website Branding Pill */}
          <div className="mb-3">
            <span className="inline-block bg-gradient-to-r from-[#FF0055] via-[#E11D48] to-[#7928CA] text-white font-mono text-[11px] sm:text-xs font-black tracking-widest uppercase px-4 py-1.5 rounded-full shadow-md">
              Click karo date karo.com
            </span>
          </div>

          {/* Bold Core Headline */}
          <h1 className="font-display font-black text-[#09090b] text-4xl sm:text-6xl md:text-7xl lg:text-8xl leading-[1.04] tracking-[-0.035em] mb-4 drop-shadow-[0_2px_8px_rgba(255,255,255,0.9)]">
            {heroCms.mainHeadline.split('•').map((part, index, arr) => (
              <React.Fragment key={index}>
                {index === 1 ? (
                  <span className="bg-gradient-to-r from-[#FF0055] via-[#E11D48] to-[#8B5CF6] bg-clip-text text-transparent filter drop-shadow-[0_4px_16px_rgba(255,0,85,0.4)]">
                    {part.trim()}
                  </span>
                ) : (
                  <span>{part.trim()}</span>
                )}
                {index < arr.length - 1 && <span className="text-pink-400/80 mx-1.5">&bull;</span>}
              </React.Fragment>
            ))}
          </h1>

          {/* Client Description Paragraph */}
          <p className="text-[#111827] text-base sm:text-lg md:text-xl max-w-3xl mx-auto mb-8 font-sans leading-relaxed font-semibold drop-shadow-[0_1px_3px_rgba(255,255,255,0.95)]">
            {heroCms.subheadline}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 mb-8">
            <button 
              onClick={() => handleSeekerAction()}
              type="button" 
              className="w-full sm:w-auto rounded-full bg-gradient-to-r from-[#FF2D55] via-[#E11D48] to-[#9333EA] hover:from-[#E11D48] hover:to-[#7928CA] text-white px-8 sm:px-10 py-4 font-bold text-xs sm:text-sm transition-all duration-300 shadow-[0_12px_32px_rgba(255,45,85,0.45)] hover:shadow-[0_16px_40px_rgba(255,45,85,0.6)] hover:scale-[1.03] active:scale-[0.97] flex items-center justify-center gap-2 cursor-pointer apple-focus"
            >
              <span>{heroCms.primaryCtaText || 'Find a Companion'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button 
              onClick={handleCompanionAction}
              type="button" 
              className="w-full sm:w-auto rounded-full bg-white/95 hover:bg-white text-[#1d1d1f] border-2 border-pink-200 hover:border-[#FF2D55]/60 px-7 sm:px-9 py-4 font-bold text-xs sm:text-sm transition-all duration-300 shadow-apple-md hover:shadow-apple-lg hover:scale-[1.03] active:scale-[0.97] flex items-center justify-center gap-2.5 cursor-pointer apple-focus"
            >
              <UserCheck className="w-4 h-4 text-[#FF2D55]" />
              <span>{heroCms.secondaryCtaText || 'Become a Companion'}</span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black tracking-wide border border-emerald-300/60 shadow-xs">
                Earn ₹7-10k/day
              </span>
            </button>
          </div>

          {/* Floating Scene Switcher Dock */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans bg-white/80 backdrop-blur-xl px-5 py-2.5 rounded-full border border-pink-200/80 shadow-apple-sm">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar max-w-full">
              {activeSceneList.map((scene, idx) => {
                const isActive = currentSceneIndex === idx;
                const label = (scene as any).shortLabel || scene.title.split(' ')[0] || `Scene ${idx + 1}`;
                return (
                  <button
                    key={scene.id || idx}
                    onClick={() => handleSelectScene(idx)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-300 whitespace-nowrap cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-[#FF2D55] to-[#E11D48] text-white shadow-sm scale-[1.02]'
                        : 'text-[#1d1d1f]/65 hover:text-[#1d1d1f] hover:bg-pink-100/50'
                    }`}
                  >
                    {label}
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
                Verified Available
              </span>
            </div>
          </div>

        </div>

        {/* 3. Live Verified Companion Profile Glimpse Slideshow Card (Synchronized with Database & Showing Age) */}
        <div className="relative w-full max-w-2xl mx-auto px-1">
          
          {/* Curiosity Ticker Header */}
          <div className="flex items-center justify-between px-3 mb-2 text-[11px] font-bold text-[#1d1d1f]/70">
            <span className="flex items-center gap-1.5 text-pink-700">
              <Sparkles className="w-3.5 h-3.5 text-[#FF2D55] animate-pulse" />
              <span>Live Verified Companion Glimpse</span>
            </span>
            <span className="flex items-center gap-1 text-[#0071E3] font-mono">
              <Users className="w-3 h-3" />
              <span>Profile {activeCompanionIdx + 1} of {profileList.length}+ Active</span>
            </span>
          </div>

          <div 
            onClick={() => handleSeekerAction(currentCompanion)}
            className="group/card bg-white/90 backdrop-blur-2xl text-[#1d1d1f] rounded-2xl sm:rounded-3xl p-3 sm:p-4 pl-3.5 sm:pl-5 border border-pink-200 shadow-apple-md hover:shadow-apple-lg hover:border-pink-300 transition-all duration-300 flex items-center justify-between gap-3 max-w-xl mx-auto cursor-pointer"
          >
            
            {/* Avatar with Live Emerald Ring & Smooth Transition */}
            <div className={`relative shrink-0 flex items-center transition-opacity duration-300 ${isFading ? 'opacity-40 scale-95' : 'opacity-100 scale-100'}`}>
              <img 
                src={currentCompanion.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80'} 
                alt={currentCompanion.name} 
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover ring-2 ring-pink-400/80 shadow-xs"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#10B981] rounded-full border-2 border-white animate-pulse" title="Active Online" />
            </div>

            {/* Name, Age, Location & Services (Amount Replaced by Age as Requested) */}
            <div className={`flex flex-col text-left flex-1 min-w-0 font-sans transition-all duration-300 ${isFading ? 'opacity-40 translate-y-1' : 'opacity-100 translate-y-0'}`}>
              <div className="flex items-center gap-1.5">
                <span className="text-xs sm:text-base font-bold text-[#1d1d1f] tracking-tight truncate">
                  {currentCompanion.name}
                </span>
                <ShieldCheck className="w-3.5 h-3.5 text-[#0071e3] shrink-0" aria-label="Face Verified" />
                <span className="text-[9px] sm:text-[10px] font-bold bg-pink-100 text-pink-800 px-2 py-0.5 rounded-full hidden sm:inline-block">
                  Face Verified
                </span>
              </div>
              
              <div className="text-[11px] sm:text-xs text-[#6B7280] truncate mt-0.5 flex items-center gap-1.5 flex-wrap">
                <span className="font-bold text-[#FF2D55] bg-pink-50 px-2 py-0.5 rounded-md border border-pink-100">
                  Age {currentCompanion.age || 23}
                </span>
                <span>&bull;</span>
                <span className="text-stone-700 font-medium">{currentCompanion.city || 'Delhi NCR'}</span>
                <span>&bull;</span>
                <span className="text-stone-500 truncate">{currentCompanion.services?.[0] || 'Social & Cafe Outing'}</span>
              </div>
            </div>

            {/* Action Triggers */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleTriggerCall();
                }}
                disabled={callingState}
                className="bg-gradient-to-r from-[#FF2D55] via-[#E11D48] to-[#FF5E3A] hover:opacity-95 text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider px-4 sm:px-6 py-2.5 sm:py-3 rounded-full transition shadow-xs active:scale-95 flex items-center gap-1 shrink-0 apple-focus cursor-pointer"
              >
                <Phone className={`w-3 h-3 ${callingState ? 'animate-bounce' : ''}`} />
                <span>{callingState ? 'Connecting...' : 'Connect'}</span>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSeekerAction(currentCompanion);
                }}
                aria-label="View companion profile"
                className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-pink-50 hover:bg-pink-100 text-[#1d1d1f] flex items-center justify-center border border-pink-200 transition shrink-0 apple-focus active:scale-95 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-[#0071e3]" />
              </button>
            </div>
          </div>

          {/* Companion Switcher Mini Ticker Dots */}
          <div className="flex items-center justify-center gap-1.5 mt-3">
            {profileList.slice(0, 12).map((comp, idx) => (
              <button
                key={comp.id || idx}
                onClick={() => {
                  setActiveCompanionIdx(idx);
                }}
                aria-label={`View ${comp.name}`}
                className={`h-1.5 rounded-full transition-all duration-300 apple-focus cursor-pointer ${
                  activeCompanionIdx === idx 
                    ? 'w-6 bg-[#FF2D55] shadow-xs' 
                    : 'w-1.5 bg-pink-300/60 hover:bg-pink-400'
                }`}
              />
            ))}
            {profileList.length > 12 && (
              <span className="text-[10px] font-bold text-pink-700 ml-1">+{profileList.length - 12} more</span>
            )}
          </div>

          {/* Clean Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-6 text-xs font-semibold text-[#1d1d1f]/80">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#0071e3]" /> {heroCms.trustPill1 || '100% Face Verified'}
            </span>
            <span className="flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-[#FF2D55]" /> {heroCms.trustPill2 || 'Consent-First Protocol'}
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" /> {heroCms.trustPill3 || 'Professional Support'}
            </span>
          </div>

        </div>

      </div>

    </section>
  );
};

export default HeroSection;
