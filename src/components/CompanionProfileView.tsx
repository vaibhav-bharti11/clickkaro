import React from 'react';
import { CompanionProfile, ServiceCredit } from '../types';
import { ArrowLeft, Star, Heart, Clock, MapPin, Radio, Calendar, CheckCircle2 } from 'lucide-react';

interface CompanionProfileViewProps {
  companion: CompanionProfile;
  onBack: () => void;
  onBook?: (companion: CompanionProfile) => void;
  isSeeker?: boolean;
  activeCredit?: ServiceCredit | null;
  availableCredits?: ServiceCredit[];
}

export const CompanionProfileView: React.FC<CompanionProfileViewProps> = ({
  companion,
  onBack,
  onBook,
  isSeeker = true,
  activeCredit,
  availableCredits = [],
}) => {
  const currentCredit = activeCredit || (availableCredits && availableCredits.length > 0 ? availableCredits[0] : null);

  // Official Click Karo Date Karo platform services
  const defaultServices = [
    'Hangout',
    'Movie Partner',
    'Clubbing',
    'Lunch/Dinner',
    'Travel Partner',
    'Coffee Partner',
  ];

  const rawServices = (companion.services && companion.services.length > 0)
    ? companion.services
    : defaultServices;

  // Filter out any leftover legacy placeholder services
  const cleanServices = rawServices.filter(
    (s) => !['medical support', 'elder care', 'general consultation', 'shopping buddy', 'in person meeting'].includes(s.toLowerCase().trim())
  );

  const servicesList = cleanServices.length > 0 ? cleanServices : defaultServices;

  // Default hobbies matching reference design
  const hobbiesList = (companion.hobbies && companion.hobbies.length > 0)
    ? companion.hobbies
    : ['Book reading', 'Shopping', 'Movies', 'Pottery'];

  // Default availability matching reference design
  const availabilitySchedule: Record<string, string> = companion.availability || {
    Mon: '11:00 – 23:00',
    Tue: '11:00 – 23:00',
    Wed: '11:00 – 23:00',
    Thu: '11:00 – 23:00',
    Fri: '11:00 – 23:00',
    Sat: '11:00 – 23:00',
    Sun: '11:00 – 23:00',
  };

  // Default reviews matching reference design
  const reviews = (companion.reviewsList && companion.reviewsList.length > 0)
    ? companion.reviewsList
    : [
        { rating: 5, date: '8/8/2026', comment: 'Awesome' },
        { rating: 5, date: '8/4/2026', comment: '' },
      ];

  const bannerGradient = companion.coverGradient || 'bg-gradient-to-r from-[#9333EA] via-[#D946EF] to-[#EC4899]';

  return (
    <div className="w-full max-w-5xl mx-auto pb-16 animate-fade-in text-left">
      
      {/* Top Back Navigation Bar */}
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-stone-700 hover:text-stone-900 hover:bg-stone-100 font-semibold text-sm transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        {isSeeker && currentCredit && (
          <div className="text-xs font-semibold text-[#FF2D55] bg-pink-50 border border-pink-200 px-3 py-1.5 rounded-full flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Eligible Recharge: <strong>{currentCredit.displayTitle || currentCredit.serviceName}</strong></span>
          </div>
        )}
      </div>

      {/* 1. Profile Header Card */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-4 sm:p-6 mb-6">
        {/* Magenta/Purple Banner */}
        <div className={`h-44 sm:h-56 w-full ${bannerGradient} rounded-2xl sm:rounded-3xl relative overflow-hidden`} />

        {/* Profile Info Row below banner */}
        <div className="px-2 sm:px-4 pb-2 pt-0">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-4 relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4">
              <div className="relative z-20 shrink-0">
                <img
                  src={companion.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'}
                  alt={companion.name}
                  className="w-28 h-28 sm:w-36 sm:h-36 rounded-full border-4 border-white shadow-xl object-cover bg-stone-100 block"
                />
              </div>
              <div className="sm:pb-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
                  {companion.name}
                </h1>
                <div className="flex items-center gap-3 text-xs sm:text-sm text-stone-500 font-medium mt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-stone-400" />
                    <span>{companion.city}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    {companion.online ? (
                      <>
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-emerald-700 font-semibold">Online</span>
                      </>
                    ) : (
                      <>
                        <Radio className="w-3.5 h-3.5 text-stone-400" />
                        <span>Offline</span>
                      </>
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Rating & Member Since Row */}
          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-stone-600 font-medium pt-2 border-t border-stone-100">
            <div className="flex items-center gap-1.5 text-[#F59E0B] font-bold">
              <Star className="w-4 h-4 fill-[#F59E0B]" />
              <span>{companion.rating ? companion.rating.toFixed(2) : '5.00'}</span>
              <span className="text-stone-500 font-normal">({companion.reviewCount || 2} reviews)</span>
            </div>
            <div className="flex items-center gap-1.5 text-stone-500">
              <Calendar className="w-4 h-4 text-stone-400" />
              <span>Member since {companion.memberSince || 'Jun 2026'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (About, Hobbies & Interests, Recent Reviews) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* About Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-xs">
            <h2 className="font-bold text-base sm:text-lg text-[#111827] mb-3">
              About
            </h2>
            <p className="text-stone-700 text-sm sm:text-base leading-relaxed font-sans">
              {companion.bio || 'Easygoing, ambitious, and always up for meaningful conversations. I value honesty, kindness, and mutual respect. Looking to connect with someone who enjoys good company, laughter, and building something real together.'}
            </p>
          </div>

          {/* Hobbies & Interests Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-xs">
            <h2 className="font-bold text-base sm:text-lg text-[#111827] mb-4">
              Hobbies &amp; Interests
            </h2>
            <div className="flex flex-wrap gap-2.5">
              {hobbiesList.map((hobby, idx) => (
                <span
                  key={idx}
                  className="px-4 py-1.5 rounded-full bg-[#FAF5FF] text-[#7E22CE] border border-[#E9D5FF] text-xs sm:text-sm font-medium"
                >
                  {hobby}
                </span>
              ))}
            </div>
          </div>

          {/* Recent Reviews Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-xs">
            <h2 className="font-bold text-base sm:text-lg text-[#111827] mb-4">
              Recent Reviews
            </h2>
            <div className="space-y-4">
              {reviews.map((rev, idx) => (
                <div key={idx} className="pb-3 last:pb-0 border-b border-stone-100 last:border-0">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex items-center text-[#F59E0B]">
                      {[...Array(rev.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-[#F59E0B]" />
                      ))}
                    </div>
                    <span className="text-xs text-stone-500">{rev.date}</span>
                  </div>
                  {rev.comment && (
                    <p className="text-stone-700 text-xs sm:text-sm font-medium">
                      {rev.comment}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column (Services, Availability, Book Button) */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Services Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-xs">
            <h2 className="font-bold text-base sm:text-lg text-[#111827] mb-4">
              Services
            </h2>
            <div className="space-y-2.5">
              {servicesList.map((service, idx) => {
                const formatted = service.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
                return (
                  <div
                    key={idx}
                    className="py-1 text-xs sm:text-sm text-stone-700 font-medium hover:text-[#111827] transition-colors"
                  >
                    {formatted}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Availability Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-xs">
            <h2 className="font-bold text-base sm:text-lg text-[#111827] mb-4">
              Availability
            </h2>
            <div className="space-y-2.5 text-xs sm:text-sm">
              {Object.entries(availabilitySchedule).map(([day, hours]) => (
                <div key={day} className="flex items-center justify-between text-stone-700 font-medium">
                  <span className="text-stone-900 font-semibold">{day}</span>
                  <span className="text-stone-600 flex items-center gap-1 font-mono text-xs">
                    <Clock className="w-3.5 h-3.5 text-stone-400" />
                    <span>{hours}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Button: Book This Companion */}
          {onBook && (
            <button
              type="button"
              onClick={() => onBook(companion)}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#9333EA] via-[#D946EF] to-[#E11D48] hover:opacity-95 text-white font-bold text-sm sm:text-base transition shadow-lg shadow-pink-500/25 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <Heart className="w-4 h-4 fill-white" />
              <span>Book This Companion</span>
            </button>
          )}

        </div>

      </div>

    </div>
  );
};
