import React, { useState, useMemo } from 'react';
import { ALL_SERVICES } from '../data/servicesData';
import { ServiceItem } from '../types';
import { ArrowRight, Clock, ShieldCheck, Check, Sparkles, Compass } from 'lucide-react';

interface ServicesSectionProps {
  onSelectService: (service: ServiceItem) => void;
  isLoggedIn?: boolean;
  onOpenAuth?: (mode?: 'signin' | 'signup') => void;
  onNavigateSeeker?: () => void;
}

// Map each of the 6 official client services to its dedicated asset, accent color, and vibe details
const SERVICE_VISUALS: Record<string, {
  image: string;
  gradient: string;
  glow: string;
  badgeColor: string;
  highlights: string[];
}> = {
  'hangout': {
    image: '/assets/hangout_light_bg.jpg',
    gradient: 'from-[#FF5E3A] to-[#FF2A68]',
    glow: 'rgba(255, 94, 58, 0.35)',
    badgeColor: 'bg-orange-500/20 text-orange-200 border-orange-400/30',
    highlights: ['Outdoor amphitheaters & parks', 'Zero social pressure', '100% Face Verified companion'],
  },
  'movie-partner': {
    image: '/assets/cinema_light_bg.jpg',
    gradient: 'from-[#8B5CF6] to-[#EC4899]',
    glow: 'rgba(139, 92, 246, 0.35)',
    badgeColor: 'bg-purple-500/20 text-purple-200 border-purple-400/30',
    highlights: ['Blockbusters, IMAX & festivals', 'Cinema ticket sharing buddy', 'Post-show discussions'],
  },
  'clubbing': {
    image: '/assets/dining_light_bg.jpg',
    gradient: 'from-[#FF2D55] to-[#7928CA]',
    glow: 'rgba(255, 45, 85, 0.4)',
    badgeColor: 'bg-pink-500/20 text-pink-200 border-pink-400/30',
    highlights: ['Rooftop lounges & clubbing', 'Charismatic nightlife wing-partner', '24/7 in-app SOS protection'],
  },
  'lunch-dinner': {
    image: '/assets/dining_light_bg.jpg',
    gradient: 'from-[#F59E0B] to-[#EF4444]',
    glow: 'rgba(245, 158, 11, 0.35)',
    badgeColor: 'bg-amber-500/20 text-amber-200 border-amber-400/30',
    highlights: ['Gourmet dining & chef bistros', 'Aesthetic restaurant companion', 'Delightful dinner dialogue'],
  },
  'travel-partner': {
    image: '/assets/hangout_light_bg.jpg',
    gradient: 'from-[#0071E3] to-[#00C7BE]',
    glow: 'rgba(0, 113, 227, 0.4)',
    badgeColor: 'bg-blue-500/20 text-blue-200 border-blue-400/30',
    highlights: ['Full 12-hour itinerary package', 'Scenic road trips & getaways', 'Safe, Face Verified co-traveler'],
  },
  'coffee-partner': {
    image: '/assets/cafe_light_bg.jpg',
    gradient: 'from-[#EC4899] to-[#FB923C]',
    glow: 'rgba(236, 72, 153, 0.35)',
    badgeColor: 'bg-rose-500/20 text-rose-200 border-rose-400/30',
    highlights: ['Artisan espresso & matcha cafes', 'Quick 1-hour connection', 'Warm, respectful conversation'],
  },
};

export const ServicesSection: React.FC<ServicesSectionProps> = ({ 
  onSelectService,
  isLoggedIn = false,
  onOpenAuth,
  onNavigateSeeker,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'day' | 'night'>('all');

  const filteredServices = useMemo(() => {
    if (activeFilter === 'day') {
      return ALL_SERVICES.filter(s => ['hangout', 'lunch-dinner', 'coffee-partner'].includes(s.id));
    }
    if (activeFilter === 'night') {
      return ALL_SERVICES.filter(s => ['movie-partner', 'clubbing', 'travel-partner'].includes(s.id));
    }
    return ALL_SERVICES;
  }, [activeFilter]);

  return (
    <section id="services" className="py-28 sm:py-36 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gradient-to-b from-[#FAF8F9] via-white to-[#F6F4F6] border-b border-black/5">
      {/* Subtle Ambient Decorative Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-pink-300/20 via-purple-200/15 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[400px] bg-gradient-to-br from-blue-200/20 via-pink-200/10 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto">
        
        {/* Section Header with Apple HIG Elegance & Wide Breathing H2 */}
        <div className="flex flex-col items-center text-center mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-pink-200/70 text-[#FF2D55] text-xs font-bold uppercase tracking-wider mb-5 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Official Curated Services</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-extrabold tracking-[-0.035em] text-[#1d1d1f] max-w-4xl leading-[1.08] headline-balance mb-6">
            Curated verified companionship, designed around you.
          </h2>

          <p className="text-[#1d1d1f]/75 text-base sm:text-lg max-w-2xl body-pretty font-sans font-normal leading-relaxed">
            Six official launch packages with fixed durations, guaranteed transparent rates, and zero hidden platform surcharges across 12 cities.
          </p>

          {/* Interactive Filter Pills */}
          <div className="mt-6 sm:mt-8 inline-flex items-center p-1 sm:p-1.5 rounded-full bg-black/[0.04] backdrop-blur-xl border border-black/5 shadow-inner overflow-x-auto no-scrollbar max-w-full" role="tablist">
            <button
              type="button"
              onClick={() => setActiveFilter('all')}
              className={`px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs font-bold transition-all duration-300 whitespace-nowrap ${
                activeFilter === 'all'
                  ? 'bg-white text-[#1d1d1f] shadow-apple-sm scale-[1.02]'
                  : 'text-[#1d1d1f]/60 hover:text-[#1d1d1f]'
              }`}
            >
              All 6 Services
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('day')}
              className={`px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs font-bold transition-all duration-300 whitespace-nowrap ${
                activeFilter === 'day'
                  ? 'bg-white text-[#1d1d1f] shadow-apple-sm scale-[1.02]'
                  : 'text-[#1d1d1f]/60 hover:text-[#1d1d1f]'
              }`}
            >
              Day &amp; Casual
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('night')}
              className={`px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs font-bold transition-all duration-300 whitespace-nowrap ${
                activeFilter === 'night'
                  ? 'bg-white text-[#1d1d1f] shadow-apple-sm scale-[1.02]'
                  : 'text-[#1d1d1f]/60 hover:text-[#1d1d1f]'
              }`}
            >
              Night, Events &amp; Travel
            </button>
          </div>
        </div>

        {/* The Gapless Bento Card Grid (3 Columns x 2 Rows) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredServices.map((service) => {
            const visual = SERVICE_VISUALS[service.id] || SERVICE_VISUALS['hangout'];

            return (
              <div
                key={service.id}
                className="group relative rounded-3xl overflow-hidden bg-white border border-black/10 shadow-apple-md hover:shadow-apple-float transition-all duration-500 flex flex-col justify-between hover:-translate-y-2"
                style={{
                  boxShadow: `0 10px 30px -10px ${visual.glow}`,
                }}
              >
                {/* 1. Cinematic Photographic Top Half with Ambient Vignette */}
                <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-black">
                  <img
                    src={visual.image}
                    alt={service.title}
                    className="w-full h-full object-cover object-center transform group-hover:scale-108 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  {/* High-End Dark Gradient Vignette for Legibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />

                  {/* Top Floating Glass Badges */}
                  <div className="absolute top-4 inset-x-4 flex items-center justify-between z-10">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-white text-[11px] font-bold">
                      <Clock className="w-3 h-3 text-[#00C7BE]" />
                      <span>{service.duration}</span>
                    </span>

                    <span className={`inline-flex items-center px-3 py-1 rounded-full backdrop-blur-md border text-[11px] font-bold tracking-wide uppercase ${visual.badgeColor}`}>
                      Official Package
                    </span>
                  </div>

                  {/* Bottom Title & Price Overlay */}
                  <div className="absolute bottom-4 inset-x-5 z-10">
                    <div className="text-xs font-bold uppercase tracking-wider text-white/70 mb-1 font-sans">
                      {service.subtitle}
                    </div>
                    <div className="flex items-end justify-between gap-2">
                      <h3 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight leading-none drop-shadow-md">
                        {service.title}
                      </h3>
                      <div className="font-display font-black text-2xl sm:text-3xl text-white tabular-numbers leading-none tracking-tight">
                        {service.priceFormatted?.split(' ')[0]}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Apple Squircle Lower Content Body */}
                <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between bg-white">
                  <div>
                    {/* Package Rate Summary Bar */}
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#F5F5F7] border border-black/5 mb-4 text-xs font-semibold text-[#1d1d1f]">
                      <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                      <span className="font-bold text-[#FF2D55]">{service.priceFormatted}</span>
                      <span className="text-[#86868b]">&bull; Upfront Rate</span>
                    </div>

                    <p className="text-xs sm:text-sm text-[#1d1d1f]/75 leading-relaxed mb-5 font-sans">
                      {service.description}
                    </p>

                    {/* Bullet Highlights */}
                    <div className="space-y-2 mb-6 pt-3 border-t border-black/5">
                      {visual.highlights.map((point, pIdx) => (
                        <div key={pIdx} className="flex items-center gap-2.5 text-xs text-[#1d1d1f]/85 font-medium">
                          <div className="w-4 h-4 rounded-full bg-pink-100/70 text-[#FF2D55] flex items-center justify-center shrink-0">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                          <span>{point}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 3. High-Contrast Interactive CTA Button (Auth Guarded) */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (!isLoggedIn) {
                          if (onOpenAuth) onOpenAuth('signin');
                          else onSelectService(service);
                        } else {
                          if (onNavigateSeeker) onNavigateSeeker();
                          else onSelectService(service);
                        }
                      }}
                      className={`w-full py-3.5 px-6 rounded-full text-white font-bold text-xs sm:text-sm transition-all duration-300 shadow-apple-md hover:shadow-apple-lg active:scale-[0.98] apple-focus flex items-center justify-center gap-2 bg-gradient-to-r ${visual.gradient} group-hover:brightness-105 cursor-pointer`}
                    >
                      <span>Book {service.title} ({service.duration})</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>

                {/* Subtle Hover Border Highlight */}
                <div className={`absolute inset-0 rounded-3xl pointer-events-none border-2 border-transparent group-hover:border-white/30 transition-all duration-500`} />
              </div>
            );
          })}
        </div>

        {/* Bottom Trust & City Dispatch Bar */}
        <div className="mt-16 bg-white/95 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 border border-pink-200 shadow-apple-float flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#0071E3] to-[#00C7BE] text-white flex items-center justify-center shrink-0 shadow-md">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-display font-extrabold text-[#1d1d1f] tracking-tight">
                100% Face Verified &bull; Strict Consent Guidelines
              </div>
              <div className="text-xs text-[#86868b] font-sans mt-0.5">
                Every companion is face-verified with 24/7 in-app emergency SOS protection in all operational cities.
              </div>
            </div>
          </div>

          <a
            href="#cities"
            className="shrink-0 px-6 py-3 rounded-full bg-[#1d1d1f] hover:bg-[#0071E3] text-white text-xs font-bold transition shadow-sm hover:shadow-md active:scale-95 flex items-center gap-2"
          >
            <Compass className="w-4 h-4 text-[#00C7BE]" />
            <span>Explore Active Cities</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

      </div>
    </section>
  );
};
