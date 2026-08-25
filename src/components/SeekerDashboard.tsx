import React, { useState, useMemo } from 'react';
import { MOCK_COMPANIONS } from '../data/mockProfiles';
import { CompanionProfile } from '../types';
import { MapPin, Search, Star, ShieldCheck, Heart, ArrowLeft, X, Sparkles, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SeekerDashboardProps {
  userName: string;
  onBackToHome: () => void;
  onSwitchToCompanion: () => void;
  onBookCompanion: (companion: CompanionProfile) => void;
}

export const SeekerDashboard: React.FC<SeekerDashboardProps> = ({
  userName,
  onBackToHome,
  onSwitchToCompanion,
  onBookCompanion,
}) => {
  const [selectedCity, setSelectedCity] = useState('Delhi NCR');
  const [selectedPinCode, setSelectedPinCode] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [likedProfiles, setLikedProfiles] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'swipe' | 'grid'>('swipe');
  const [matchedAnimation, setMatchedAnimation] = useState<string | null>(null);

  const cities = ['All India', 'Delhi NCR', 'Mumbai', 'Bengaluru', 'Pune', 'Kolkata', 'Hyderabad'];

  const categories = [
    { id: 'all', label: 'All Services' },
    { id: 'movie-partner', label: '🎬 Movies' },
    { id: 'elder-care', label: '👴 Elder Care' },
    { id: 'coffee-partner', label: '☕ Cafes' },
    { id: 'clubbing', label: '🎉 Nightlife' },
    { id: 'shopping-buddy', label: '🛍️ Shopping' },
    { id: 'travel-partner', label: '✈️ Travel' },
  ];

  const filteredCompanions = useMemo(() => {
    return MOCK_COMPANIONS.filter((comp) => {
      const matchesCity = selectedCity === 'All India' || comp.city === selectedCity;
      const matchesPin = !selectedPinCode || comp.pinCode.includes(selectedPinCode.trim());
      const matchesCat = selectedCategory === 'all' || comp.services.includes(selectedCategory);
      return matchesCity && matchesPin && matchesCat;
    });
  }, [selectedCity, selectedPinCode, selectedCategory]);

  const activeProfile = filteredCompanions[currentProfileIndex % (filteredCompanions.length || 1)];

  const handleNext = () => {
    if (filteredCompanions.length > 0) {
      setCurrentProfileIndex((prev) => (prev + 1) % filteredCompanions.length);
    }
  };

  const handlePrev = () => {
    if (filteredCompanions.length > 0) {
      setCurrentProfileIndex((prev) => (prev - 1 + filteredCompanions.length) % filteredCompanions.length);
    }
  };

  const handleLike = (companion: CompanionProfile) => {
    if (!likedProfiles.includes(companion.id)) {
      setLikedProfiles([...likedProfiles, companion.id]);
    }
    setMatchedAnimation(companion.name);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 }
    });
    setTimeout(() => {
      setMatchedAnimation(null);
      handleNext();
    }, 1200);
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 relative">
      <div className="max-w-6xl mx-auto">
        
        {/* Top Portal Navigation Header */}
        <div className="bg-white/85 backdrop-blur-2xl rounded-3xl p-5 sm:p-6 border border-pink-200 shadow-apple-md mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToHome}
              aria-label="Back to landing page"
              className="w-10 h-10 rounded-full bg-pink-50 hover:bg-pink-100 flex items-center justify-center text-[#1d1d1f] transition apple-focus"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-[#1d1d1f]">
                  Seeker Hub &bull; {userName}
                </h1>
                <span className="text-[10px] font-bold text-[#0071e3] bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                  Client Mode
                </span>
              </div>
              <p className="text-xs text-[#86868b]">Browse and swipe verified companions ready in your locality</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="flex bg-pink-100/60 p-1 rounded-full border border-pink-200">
              <button
                onClick={() => setViewMode('swipe')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition apple-focus ${
                  viewMode === 'swipe' ? 'bg-white text-[#1d1d1f] shadow-sm' : 'text-[#86868b] hover:text-[#1d1d1f]'
                }`}
              >
                Swipe Cards
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition apple-focus ${
                  viewMode === 'grid' ? 'bg-white text-[#1d1d1f] shadow-sm' : 'text-[#86868b] hover:text-[#1d1d1f]'
                }`}
              >
                All Grid ({filteredCompanions.length})
              </button>
            </div>

            <button
              onClick={onSwitchToCompanion}
              className="bg-[#1d1d1f] hover:bg-[#0071e3] text-white text-xs font-bold px-4 py-2 rounded-full transition shadow-sm apple-focus"
            >
              Switch to Partner Mode &rarr;
            </button>
          </div>
        </div>

        {/* 1. Location & Category Control Bar */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-5 border border-pink-200/80 shadow-sm mb-8 space-y-4">
          
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
            
            {/* City Selector */}
            <div className="sm:col-span-4">
              <label htmlFor="seeker-city" className="block text-[11px] font-bold text-[#1d1d1f] uppercase tracking-wider mb-1">
                Select City / Region
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-[#0071e3] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <select
                  id="seeker-city"
                  value={selectedCity}
                  onChange={(e) => { setSelectedCity(e.target.value); setCurrentProfileIndex(0); }}
                  className="w-full bg-[#fdf8f8] border border-pink-200 rounded-xl pl-9 pr-4 py-2.5 text-xs sm:text-sm font-bold text-[#1d1d1f] focus:outline-none focus:ring-2 focus:ring-[#0071e3]"
                >
                  {cities.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Pin Code Filter */}
            <div className="sm:col-span-5">
              <label htmlFor="seeker-pin" className="block text-[11px] font-bold text-[#1d1d1f] uppercase tracking-wider mb-1">
                6-Digit Postal Pin Code
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-[#86868b] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="seeker-pin"
                  type="text"
                  value={selectedPinCode}
                  onChange={(e) => { setSelectedPinCode(e.target.value); setCurrentProfileIndex(0); }}
                  placeholder="Filter exact pin (e.g. 110001, 400050)..."
                  className="w-full bg-[#fdf8f8] border border-pink-200 rounded-xl pl-9 pr-4 py-2.5 text-xs sm:text-sm font-medium text-[#1d1d1f] focus:outline-none focus:ring-2 focus:ring-[#0071e3]"
                />
              </div>
            </div>

            {/* Live Count Indicator */}
            <div className="sm:col-span-3 text-right flex sm:flex-col items-center sm:items-end justify-between">
              <span className="text-[11px] font-bold text-[#86868b]">Verified Active:</span>
              <span className="text-sm font-bold text-[#0071e3] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100 tabular-numbers">
                {filteredCompanions.length} Companions
              </span>
            </div>

          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar pt-2 border-t border-pink-100">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => { setSelectedCategory(cat.id); setCurrentProfileIndex(0); }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition apple-focus ${
                  selectedCategory === cat.id
                    ? 'bg-[#0071e3] text-white shadow-sm'
                    : 'bg-[#fdf8f8] text-[#1d1d1f] hover:bg-pink-100/60 border border-pink-200/60'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

        </div>

        {/* 2. SWIPE CARDS VIEW */}
        {viewMode === 'swipe' && (
          <div className="max-w-xl mx-auto">
            {filteredCompanions.length > 0 && activeProfile ? (
              <div className="relative">
                
                {/* Match Banner Overlay */}
                {matchedAnimation && (
                  <div className="absolute inset-0 z-30 bg-black/60 backdrop-blur-md rounded-3xl flex flex-col items-center justify-center text-white animate-fade-in">
                    <Heart className="w-16 h-16 fill-pink-500 text-pink-500 animate-bounce mb-3" />
                    <h3 className="text-2xl font-bold">Liked {matchedAnimation}!</h3>
                    <p className="text-xs text-white/80 mt-1">Saved to your favorites</p>
                  </div>
                )}

                {/* Main Swipeable Profile Card */}
                <div className="bg-white rounded-3xl overflow-hidden border border-pink-200 shadow-apple-float">
                  
                  {/* Photo Container */}
                  <div className="relative h-96 sm:h-[420px] w-full overflow-hidden bg-stone-900">
                    <img 
                      src={activeProfile.avatarUrl} 
                      alt={activeProfile.name} 
                      className="w-full h-full object-cover object-top"
                    />

                    {/* Gradient Scrim */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>

                    {/* Top Status Badges */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-semibold border border-white/20">
                        <span className={`w-2 h-2 rounded-full ${activeProfile.online ? 'bg-emerald-400 animate-pulse' : 'bg-stone-400'}`}></span>
                        <span>{activeProfile.online ? 'Online Now' : 'Offline'}</span>
                      </div>

                      <span className="bg-pink-600/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm tabular-numbers">
                        ₹{activeProfile.hourlyRate}/hr
                      </span>
                    </div>

                    {/* Bottom Details on Image */}
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="text-2xl font-bold tracking-tight">
                          {activeProfile.name}, {activeProfile.age}
                        </h2>
                        {activeProfile.verifiedKYC && (
                          <span title="Aadhaar KYC Verified">
                            <ShieldCheck className="w-5 h-5 text-[#2997ff]" />
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-xs text-white/80 mb-2">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-pink-400" /> {activeProfile.city} ({activeProfile.pinCode})
                        </span>
                        <span>&bull;</span>
                        <span className="text-emerald-400 font-semibold">{activeProfile.distanceKm} km away</span>
                        <span>&bull;</span>
                        <span className="text-amber-400 font-bold flex items-center gap-0.5">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {activeProfile.rating} ({activeProfile.reviewCount})
                        </span>
                      </div>

                      {/* Badges */}
                      <div className="flex flex-wrap gap-1.5">
                        {activeProfile.badges.map((badge, bIdx) => (
                          <span key={bIdx} className="text-[10px] font-semibold bg-white/20 backdrop-blur-md text-white px-2.5 py-0.5 rounded-full border border-white/20">
                            {badge}
                          </span>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* Bio & Details Area */}
                  <div className="p-6 bg-white space-y-4">
                    <div>
                      <h4 className="text-xs font-bold text-[#86868b] uppercase tracking-wider mb-1">About Me</h4>
                      <p className="text-xs sm:text-sm text-[#1d1d1f]/85 leading-relaxed body-pretty">
                        {activeProfile.bio}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-xs text-[#86868b] pt-3 border-t border-pink-100">
                      <span>Languages: <strong className="text-[#1d1d1f] font-semibold">{activeProfile.languages.join(', ')}</strong></span>
                      <span className="text-[#0071e3] font-semibold flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" /> 100% Verified
                      </span>
                    </div>

                    {/* Interactive Action Controls (Swipe Bar) */}
                    <div className="pt-4 flex items-center justify-center gap-3 sm:gap-4">
                      
                      {/* Previous Button */}
                      <button
                        onClick={handlePrev}
                        aria-label="Previous Profile"
                        className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-pink-50 hover:bg-pink-100 text-pink-700 flex items-center justify-center shadow-sm active:scale-90 transition apple-focus p-2.5"
                      >
                        <ArrowLeft className="w-5 h-5" />
                      </button>

                      {/* Pass Button */}
                      <button
                        onClick={handleNext}
                        aria-label="Pass Profile"
                        className="w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center shadow-md active:scale-90 transition apple-focus p-3"
                      >
                        <X className="w-6 h-6 stroke-[2.5]" />
                      </button>

                      {/* Super Like */}
                      <button
                        onClick={() => handleLike(activeProfile)}
                        aria-label="Like Profile"
                        className="w-14 h-14 sm:w-15 sm:h-15 rounded-full bg-gradient-to-tr from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white flex items-center justify-center shadow-apple-md hover:shadow-apple-lg active:scale-95 transition apple-focus p-3.5"
                      >
                        <Heart className="w-7 h-7 fill-white stroke-[2]" />
                      </button>

                      {/* Instant Book CTA */}
                      <button
                        onClick={() => onBookCompanion(activeProfile)}
                        className="bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs sm:text-sm font-bold px-5 sm:px-6 py-3.5 rounded-full shadow-md active:scale-95 transition flex items-center gap-1.5 apple-focus"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>Book</span>
                      </button>

                    </div>

                    {/* Card Counter */}
                    <div className="text-center text-[11px] text-[#86868b] pt-2">
                      Profile {((currentProfileIndex % filteredCompanions.length) + 1)} of {filteredCompanions.length}
                    </div>

                  </div>

                </div>

              </div>
            ) : (
              <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-12 text-center border border-pink-200 shadow-sm">
                <p className="text-sm font-bold text-[#1d1d1f] mb-1">No companions found matching this filter.</p>
                <p className="text-xs text-[#86868b] mb-4">Try selecting 'All India' or clear the pin code filter.</p>
                <button
                  onClick={() => { setSelectedCity('All India'); setSelectedPinCode(''); setSelectedCategory('all'); }}
                  className="bg-[#0071e3] text-white text-xs font-bold px-5 py-2 rounded-full transition apple-focus"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        )}

        {/* 3. GRID VIEW */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompanions.map((comp) => (
              <div
                key={comp.id}
                className="bg-white rounded-3xl overflow-hidden border border-pink-200 shadow-sm hover:shadow-apple-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-60 w-full overflow-hidden bg-stone-900">
                    <img 
                      src={comp.avatarUrl} 
                      alt={comp.name} 
                      className="w-full h-full object-cover object-top"
                    />
                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-0.5 rounded-full text-white text-[10px] font-semibold flex items-center gap-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${comp.online ? 'bg-emerald-400' : 'bg-stone-400'}`}></span>
                      <span>{comp.online ? 'Online' : 'Offline'}</span>
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-bold">
                      <span className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1">
                        {comp.name}, {comp.age} <CheckCircle2 className="w-3.5 h-3.5 text-[#2997ff]" />
                      </span>
                      <span className="bg-pink-600 px-2.5 py-1 rounded-full tabular-numbers">
                        ₹{comp.hourlyRate}/hr
                      </span>
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between text-xs text-[#86868b]">
                      <span>{comp.city} &bull; {comp.distanceKm} km</span>
                      <span className="text-amber-500 font-bold flex items-center gap-0.5">
                        <Star className="w-3 h-3 fill-amber-400" /> {comp.rating}
                      </span>
                    </div>
                    <p className="text-xs text-[#1d1d1f]/80 line-clamp-2 leading-relaxed">
                      {comp.bio}
                    </p>
                  </div>
                </div>

                <div className="p-4 pt-0 flex gap-2">
                  <button
                    onClick={() => onBookCompanion(comp)}
                    className="w-full bg-[#0071e3] hover:bg-[#0077ed] text-white py-2 rounded-full text-xs font-bold transition shadow-sm apple-focus"
                  >
                    Book Now (₹{comp.hourlyRate}/hr)
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
