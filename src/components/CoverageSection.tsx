import React, { useState } from 'react';
import { MapPin, CheckCircle2, ArrowRight, ShieldCheck, Film, Heart, Sparkles, Coffee, ShoppingBag, Plane } from 'lucide-react';

interface CoverageSectionProps {
  onOpenBooking: () => void;
}

export const CoverageSection: React.FC<CoverageSectionProps> = ({ onOpenBooking }) => {
  const [activeNiche, setActiveNiche] = useState('movies');
  const [pinInput, setPinInput] = useState('');
  const [searchFeedback, setSearchFeedback] = useState<string | null>(null);

  const niches: Record<string, {
    label: string;
    icon: React.ElementType;
    badge: string;
    heading: string;
    description: string;
    rate: string;
    metric1: string;
    metric1Sub: string;
    metric2: string;
    metric2Sub: string;
    avatar: string;
    avatarName: string;
    avatarRole: string;
    samplePrompt: string;
    sampleResponse: string;
  }> = {
    movies: {
      label: 'Movies & Cinema',
      icon: Film,
      badge: 'POPULAR RECREATION',
      heading: 'Never watch a great movie alone again.',
      description: 'Find verified companions for IMAX screenings, theater festivals, or casual film discussions over popcorn.',
      rate: '₹4,500/hr',
      metric1: '98% Positive',
      metric1Sub: 'Cinema Rating',
      metric2: '< 15 mins',
      metric2Sub: 'Match Time',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      avatarName: 'Priya Sharma',
      avatarRole: 'Film Critic & Companion',
      samplePrompt: '“Are you free for the 7 PM IMAX screening at Select Citywalk today?”',
      sampleResponse: '“Yes! I’m available and looking forward to watching it with you. Booking confirmed!”',
    },
    elderCare: {
      label: 'Elder Care',
      icon: Heart,
      badge: 'EMPATHETIC SUPPORT',
      heading: 'Patient, attentive assistance for your elderly loved ones.',
      description: 'Dedicated buddies for hospital visits, doctor appointments, garden walks, tech support, and respectful listening.',
      rate: '₹1,000/hr',
      metric1: '100% KYC',
      metric1Sub: 'Screened ID',
      metric2: '24/7',
      metric2Sub: 'SOS Safety',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      avatarName: 'Dr. Sunita Rao',
      avatarRole: 'Senior Companion',
      samplePrompt: '“Can you assist my mother with her hospital checkup and afternoon walk tomorrow?”',
      sampleResponse: '“Of course. I will arrive 10 minutes early and assist her with complete patience.”',
    },
    nightlife: {
      label: 'Clubbing & Events',
      icon: Sparkles,
      badge: 'NIGHTLIFE & PLUS-ONE',
      heading: 'Confident wing-partners for parties and social events.',
      description: 'Safe, charismatic plus-ones for weekend lounges, cocktail dinners, wedding receptions, and social galas.',
      rate: '₹4,500/hr',
      metric1: '5.0 ★ Rated',
      metric1Sub: 'Event Plus-One',
      metric2: '100% Safe',
      metric2Sub: 'In-App SOS',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      avatarName: 'Anjali Mehta',
      avatarRole: 'Social Plus-One',
      samplePrompt: '“Need a stylish, engaging plus-one for an art gallery launch in Bandra.”',
      sampleResponse: '“Sounds fantastic! I have confirmed my schedule. See you at 8 PM.”',
    },
    cafes: {
      label: 'Cafes & Dining',
      icon: Coffee,
      badge: 'LIFESTYLE DIALOGUE',
      heading: 'Deep, engaging conversations over coffee and gourmet meals.',
      description: 'Zero pressure, comfortable hangouts in curated city bistros, coffee houses, and dining spaces.',
      rate: '₹1,500/hr',
      metric1: 'Zero Pressure',
      metric1Sub: 'Respectful Code',
      metric2: 'All Metros',
      metric2Sub: 'Near You',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
      avatarName: 'Kabir Varma',
      avatarRole: 'Coffee Companion',
      samplePrompt: '“Looking for a good conversation partner over artisanal coffee in Indiranagar.”',
      sampleResponse: '“I know a wonderful rooftop cafe nearby. Let’s connect there!”',
    },
    shopping: {
      label: 'Shopping Buddy',
      icon: ShoppingBag,
      badge: 'PERSONAL STYLING',
      heading: 'Honest style feedback and shopping assistance.',
      description: 'Companions for wardrobe hunting, mall shopping, festive purchases, or grocery errands.',
      rate: '₹2,000/hr',
      metric1: 'Honest Tips',
      metric1Sub: 'Style Guidance',
      metric2: 'Flexible',
      metric2Sub: '1 to 8 Hours',
      avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
      avatarName: 'Meera Sen',
      avatarRole: 'Fashion Stylist Buddy',
      samplePrompt: '“Need help picking festive outfits at the mall this Saturday.”',
      sampleResponse: '“I’d love to help you find the best fits and colors. Confirmed!”',
    },
    travel: {
      label: 'Travel & City Tours',
      icon: Plane,
      badge: 'EXPLORATION',
      heading: 'Explore new cities, heritage spots, and road trips.',
      description: 'Verified local guides and enthusiastic travel buddies for exploring sights, monuments, and weekend getaways.',
      rate: '₹2,000/hr',
      metric1: 'Local Guide',
      metric1Sub: 'Deep Knowledge',
      metric2: 'All India',
      metric2Sub: '19,000+ Pins',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      avatarName: 'Aarav Nair',
      avatarRole: 'Travel Companion',
      samplePrompt: '“Heading to Jaipur for the weekend. Need a friendly companion for heritage walks.”',
      sampleResponse: '“I know all the authentic spots and photo locations in Jaipur. Let’s do it!”',
    },
  };

  const current = niches[activeNiche];

  const handlePinCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinInput.trim()) return;
    setSearchFeedback(`Available! 20+ verified companions in ${pinInput.trim()} ready within 15 mins.`);
  };

  return (
    <section id="coverage" className="py-24 px-4 sm:px-6 border-b border-pink-200/50 relative z-10">
      <div className="max-w-6xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-14">
          <span className="text-xs font-semibold text-[#0071e3] uppercase tracking-wider mb-2 block">
            Interactive Experience
          </span>
          <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-[#1d1d1f] max-w-3xl leading-tight mb-4 headline-balance">
            Pick your service. See it in action.
          </h2>
          <p className="text-[#1d1d1f]/75 text-base sm:text-lg max-w-xl body-pretty">
            Experience real-time interactive previews of our most requested companionship services.
          </p>
        </div>

        {/* LandingHero Niche Tabs Container */}
        <div className="bg-white/80 backdrop-blur-2xl rounded-3xl border border-pink-200/80 shadow-apple-lg overflow-hidden mb-16">
          
          {/* Top Horizontal Tab Scroll */}
          <div className="flex items-center overflow-x-auto no-scrollbar border-b border-pink-200/80 bg-white/50" role="tablist">
            {Object.keys(niches).map((key) => {
              const item = niches[key];
              const Icon = item.icon;
              const isActive = activeNiche === key;
              return (
                <button
                  key={key}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveNiche(key)}
                  className={`relative group flex shrink-0 items-center justify-center gap-2.5 border-r border-pink-100 px-5 py-4 sm:px-6 sm:py-5 transition-all text-xs font-bold uppercase tracking-wider min-w-max sm:flex-1 apple-focus ${
                    isActive ? 'bg-pink-50/80 text-[#0071e3]' : 'text-[#1d1d1f]/60 hover:text-[#1d1d1f] hover:bg-white/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {isActive && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#0071e3]"></div>}
                </button>
              );
            })}
          </div>

          {/* Dual Panel Body from LandingHero */}
          <div className="grid grid-cols-1 lg:grid-cols-2">
            
            {/* Left Panel: Description & Metrics */}
            <div className="p-8 sm:p-12 flex flex-col justify-center gap-6 border-b lg:border-b-0 lg:border-r border-pink-200/60">
              <div className="space-y-3">
                <span className="text-[11px] font-bold text-[#0071e3] uppercase tracking-widest bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                  {current.badge}
                </span>
                <h3 className="text-2xl sm:text-4xl font-bold text-[#1d1d1f] leading-tight tracking-tight">
                  {current.heading}
                </h3>
                <p className="text-sm sm:text-base text-[#1d1d1f]/75 leading-relaxed body-pretty">
                  {current.description}
                </p>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-pink-100">
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-[#1d1d1f] tabular-numbers">{current.rate}</div>
                  <div className="text-[10px] text-[#86868b] uppercase tracking-wider font-semibold mt-0.5">Rate</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-[#0071e3] tabular-numbers">{current.metric1}</div>
                  <div className="text-[10px] text-[#86868b] uppercase tracking-wider font-semibold mt-0.5">{current.metric1Sub}</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-emerald-600 tabular-numbers">{current.metric2}</div>
                  <div className="text-[10px] text-[#86868b] uppercase tracking-wider font-semibold mt-0.5">{current.metric2Sub}</div>
                </div>
              </div>

              <div>
                <button
                  onClick={onOpenBooking}
                  className="bg-[#0071e3] hover:bg-[#0077ed] text-white px-7 py-3 rounded-full font-semibold text-xs transition shadow-sm flex items-center gap-2 apple-focus"
                >
                  <span>Book {current.label}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Right Panel: Simulated Chat Dialogue Frame */}
            <div className="p-8 sm:p-12 bg-pink-50/40 flex flex-col items-center justify-center relative">
              <div className="w-full max-w-sm space-y-4">
                
                {/* Companion Profile Pill */}
                <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-pink-200 shadow-sm">
                  <img 
                    src={current.avatar} 
                    alt={current.avatarName} 
                    className="w-11 h-11 rounded-full object-cover border-2 border-pink-300"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-[#1d1d1f] flex items-center gap-1">
                      {current.avatarName} <CheckCircle2 className="w-3.5 h-3.5 text-[#0071e3]" />
                    </div>
                    <div className="text-[10px] text-[#86868b] truncate">{current.avatarRole}</div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                    Available
                  </span>
                </div>

                {/* User Bubble */}
                <div className="bg-[#1d1d1f] text-white text-xs p-3.5 rounded-2xl rounded-tr-none shadow-sm ml-auto max-w-[85%] leading-relaxed">
                  {current.samplePrompt}
                </div>

                {/* Companion Response Bubble */}
                <div className="bg-white border border-pink-200 text-[#1d1d1f] text-xs p-3.5 rounded-2xl rounded-tl-none shadow-sm mr-auto max-w-[85%] leading-relaxed">
                  {current.sampleResponse}
                </div>

                {/* Status Pill */}
                <div className="text-center pt-2">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-100/90 px-3 py-1 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Instant Matching Available
                  </span>
                </div>

              </div>
            </div>

          </div>

        </div>

        {/* Hyperlocal Pin Code Lookup Box */}
        <div className="bg-white/85 backdrop-blur-2xl rounded-3xl p-8 border border-pink-200/80 shadow-apple-md max-w-3xl mx-auto text-center">
          <h3 className="text-xl font-bold text-[#1d1d1f] mb-2">
            Instant 19,000+ Pin Code Availability Checker
          </h3>
          <p className="text-xs text-[#86868b] mb-6">
            Enter any Indian postal code to check live companion coverage and response times.
          </p>

          <form onSubmit={handlePinCheck} className="flex flex-col sm:flex-row gap-2.5 max-w-md mx-auto mb-4">
            <label htmlFor="coverage-pin-box" className="sr-only">Enter Pin Code</label>
            <div className="relative flex-1">
              <MapPin className="w-4 h-4 text-[#0071e3] absolute left-4 top-1/2 -translate-y-1/2" aria-hidden="true" />
              <input 
                id="coverage-pin-box"
                type="text"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Enter 6-digit pin (e.g. 110001, 560001)..."
                className="w-full bg-[#fdf8f8] border border-pink-200 text-xs font-medium text-[#1d1d1f] rounded-full pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0071e3]"
              />
            </div>
            <button 
              type="submit"
              className="bg-[#1d1d1f] hover:bg-[#0071e3] text-white text-xs font-semibold px-6 py-2.5 rounded-full transition shrink-0 apple-focus"
            >
              Verify Area
            </button>
          </form>

          {searchFeedback && (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200 animate-fadeIn">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>{searchFeedback}</span>
            </div>
          )}
        </div>

      </div>
    </section>
  );
};
