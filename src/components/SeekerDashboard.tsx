import React, { useState, useMemo, useEffect, useRef } from 'react';
import { MOCK_COMPANIONS } from '../data/mockProfiles';
import { CompanionProfile } from '../types';
import { MapPin, Search, Star, Heart, ArrowLeft, X, Sparkles, CheckCircle2, LogOut, Clock, Calendar, RefreshCw, Camera, Dices, ShieldCheck, ShieldAlert, MessageSquare, Plus, Trash2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { fetchCompanionsFromSupabase, fetchBookingsFromSupabase, updateUserAvatarInSupabase, recordBookingInSupabase } from '../services/supabase';
import { FaceVerificationModal } from './FaceVerificationModal';
import { RandomMatchModal } from './RandomMatchModal';
import { ChatModal } from './ChatModal';

interface SeekerDashboardProps {
  userName: string;
  userAvatar?: string;
  onUpdateAvatar?: (url: string) => void;
  onBackToHome: () => void;
  onSwitchToCompanion: () => void;
  onBookCompanion: (companion: CompanionProfile) => void;
  onLogout?: () => void;
}

export const SeekerDashboard: React.FC<SeekerDashboardProps> = ({
  userName,
  userAvatar,
  onUpdateAvatar,
  onBackToHome,
  onSwitchToCompanion,
  onBookCompanion,
  onLogout,
}) => {
  const [selectedCity, setSelectedCity] = useState(() => localStorage.getItem('ck_user_city') || 'All India');
  const [selectedPinCode, setSelectedPinCode] = useState(() => localStorage.getItem('ck_user_pincode') || '');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [likedProfiles, setLikedProfiles] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'swipe' | 'grid'>('swipe');
  const [matchedAnimation, setMatchedAnimation] = useState<string | null>(null);

  // Verification & Photos state
  const [kycVerified, setKycVerified] = useState(() => localStorage.getItem('ck_kyc_verified') === 'true');
  const [faceModalOpen, setFaceModalOpen] = useState(false);
  const [randomModalOpen, setRandomModalOpen] = useState(false);
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [chatTarget, setChatTarget] = useState<{ name: string; avatar?: string; phone?: string; bookingCode: string } | null>(null);
  const [photoRequirementModal, setPhotoRequirementModal] = useState(false);

  const [userPhotos, setUserPhotos] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('ck_user_photos');
      if (saved) return JSON.parse(saved);
    } catch {}
    const avatar = userAvatar || localStorage.getItem('ck_user_avatar');
    return avatar ? [avatar] : [];
  });

  // Supabase live data
  const [companions, setCompanions] = useState<CompanionProfile[]>(MOCK_COMPANIONS);
  const [myBookings, setMyBookings] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'explore' | 'bookings'>('explore');
  const [loadingBookings, setLoadingBookings] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const extraPhotoInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        if (typeof reader.result === 'string') {
          const newUrl = reader.result;
          if (onUpdateAvatar) onUpdateAvatar(newUrl);
          localStorage.setItem('ck_user_avatar', newUrl);
          
          // Update photos list
          const updated = userPhotos.length > 0 ? [newUrl, ...userPhotos.slice(1)] : [newUrl];
          setUserPhotos(updated);
          localStorage.setItem('ck_user_photos', JSON.stringify(updated));

          const phone = localStorage.getItem('ck_user_phone') || undefined;
          const email = localStorage.getItem('ck_user_email') || undefined;
          await updateUserAvatarInSupabase(newUrl, { phone, email, name: userName });
          confetti({ particleCount: 30, spread: 50, origin: { y: 0.3 } });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExtraPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          const updated = [...userPhotos, reader.result];
          setUserPhotos(updated);
          localStorage.setItem('ck_user_photos', JSON.stringify(updated));
          confetti({ particleCount: 40, spread: 60, origin: { y: 0.4 } });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = (idx: number) => {
    const updated = userPhotos.filter((_, i) => i !== idx);
    setUserPhotos(updated);
    localStorage.setItem('ck_user_photos', JSON.stringify(updated));
  };

  useEffect(() => {
    fetchCompanionsFromSupabase().then((data) => {
      if (data && data.length > 0) {
        setCompanions(data);
      }
    });
    refreshBookings();
  }, []);

  const refreshBookings = async () => {
    setLoadingBookings(true);
    const phone = localStorage.getItem('ck_user_phone') || '';
    const email = localStorage.getItem('ck_user_email') || '';
    const bookings = await fetchBookingsFromSupabase(phone, email);
    setMyBookings(bookings);
    setLoadingBookings(false);
  };

  const cities = [
    'All India',
    'Delhi NCR',
    'Mumbai',
    'Bangalore',
    'Gurgaon',
    'Noida',
    'Chandigarh',
    'Jaipur',
    'Dehradun',
    'Indore',
    'Lucknow',
    'Meerut',
    'Ghaziabad',
  ];

  const categories = [
    { id: 'all', label: 'All 6 Services' },
    { id: 'hangout', label: 'Hangout (4 hrs)' },
    { id: 'movie-partner', label: 'Movie Partner (4 hrs)' },
    { id: 'clubbing', label: 'Clubbing (6 hrs)' },
    { id: 'lunch-dinner', label: 'Lunch/Dinner (2 hrs)' },
    { id: 'travel-partner', label: 'Travel Partner (12 hrs)' },
    { id: 'coffee-partner', label: 'Coffee Partner (1 hr)' },
  ];

  const filteredCompanions = useMemo(() => {
    return companions.filter((comp) => {
      const matchesCity = selectedCity === 'All India' || 
        comp.city.toLowerCase().includes(selectedCity.toLowerCase()) || 
        selectedCity.toLowerCase().includes(comp.city.toLowerCase());
      const matchesPin = !selectedPinCode || 
        comp.pinCode.trim().includes(selectedPinCode.trim()) || 
        selectedPinCode.trim().includes(comp.pinCode.trim());
      const matchesCat = selectedCategory === 'all' || comp.services.includes(selectedCategory);
      return matchesCity && matchesPin && matchesCat;
    });
  }, [companions, selectedCity, selectedPinCode, selectedCategory]);

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

  const verifyPrerequisites = (): boolean => {
    if (userPhotos.length < 2) {
      setPhotoRequirementModal(true);
      return false;
    }
    if (!kycVerified) {
      setFaceModalOpen(true);
      return false;
    }
    return true;
  };

  const handleBookWithVerification = (comp: CompanionProfile) => {
    if (!verifyPrerequisites()) return;
    onBookCompanion(comp);
  };

  const handleLike = async (companion: CompanionProfile) => {
    if (!verifyPrerequisites()) return;

    if (!likedProfiles.includes(companion.id)) {
      setLikedProfiles([...likedProfiles, companion.id]);
    }
    setMatchedAnimation(companion.name);
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.7 }
    });

    // Record live companion match request in Supabase bookings
    await recordBookingInSupabase({
      client_name: userName || 'Seeker',
      client_phone: localStorage.getItem('ck_user_phone') || 'Confidential',
      client_email: localStorage.getItem('ck_user_email') || null,
      service_id: 'hangout',
      service_title: 'Instant Companion Connect',
      city: companion.city,
      pin_code: companion.pinCode,
      booking_date: new Date().toISOString().split('T')[0],
      hours: 2,
      total_price: companion.hourlyRate * 2,
      companion_name: companion.name,
      companion_avatar: companion.avatarUrl,
      concierge_notes: `Direct swipe match connection from ${userName}`
    });

    refreshBookings();

    setTimeout(() => {
      setMatchedAnimation(null);
      handleNext();
    }, 1400);
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 relative">
      <div className="max-w-6xl mx-auto">
        
        {/* Top Portal Navigation Header */}
        <div className="bg-white/85 backdrop-blur-2xl rounded-3xl p-5 sm:p-6 border border-pink-200 shadow-apple-md mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBackToHome}
              aria-label="Back to landing page"
              className="w-10 h-10 rounded-full bg-pink-50 hover:bg-pink-100 flex items-center justify-center text-[#1d1d1f] transition apple-focus"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            {/* Profile Avatar with Photo Upload */}
            <div className="relative group">
              <div className="w-13 h-13 rounded-full overflow-hidden ring-2 ring-pink-300 shadow-sm bg-pink-50">
                <img 
                  src={userAvatar || localStorage.getItem('ck_user_avatar') || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'} 
                  alt={userName} 
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white flex items-center justify-center shadow-md ring-2 ring-white transition active:scale-95 cursor-pointer"
                title="Upload Profile Photo"
              >
                <Camera className="w-3 h-3" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarUpload}
              />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-[#1d1d1f]">
                  Seeker Hub &bull; {userName}
                </h1>
                {kycVerified ? (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>Face Verified</span>
                  </span>
                ) : (
                  <button
                    onClick={() => setFaceModalOpen(true)}
                    className="text-[10px] font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200 flex items-center gap-1 transition"
                  >
                    <ShieldAlert className="w-3 h-3 text-amber-600" />
                    <span>Verify Face (Required)</span>
                  </button>
                )}
              </div>
              <p className="text-xs text-[#86868b]">Verified companions ready in {selectedCity}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* BOOK RANDOM MATCHMAKER BUTTON */}
            <button
              onClick={() => setRandomModalOpen(true)}
              className="px-4 py-2 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white text-xs font-bold transition shadow-sm flex items-center gap-1.5 active:scale-95"
            >
              <Dices className="w-3.5 h-3.5" />
              <span>Book Random 🎲</span>
            </button>

            {activeTab === 'explore' && (
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
            )}

            <button
              onClick={onSwitchToCompanion}
              className="bg-[#1d1d1f] hover:bg-[#0071e3] text-white text-xs font-bold px-4 py-2 rounded-full transition shadow-sm apple-focus"
            >
              Switch to Partner Mode &rarr;
            </button>

            {onLogout && (
              <button
                onClick={onLogout}
                className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold px-3.5 py-2 rounded-full transition shadow-xs flex items-center gap-1.5 apple-focus"
                title="Log Out of Portal"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Log Out</span>
              </button>
            )}
          </div>
        </div>

        {/* Live Seeker Status Banner & Photo Gallery Manager */}
        <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-pink-50 rounded-2xl p-4 border border-blue-200/80 mb-6 space-y-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <span className="px-2.5 py-1 rounded-full bg-[#0071E3] text-white font-bold text-[10px] uppercase tracking-wider">
                My Profile
              </span>
              <span className="font-bold text-[#1d1d1f]">
                {userName} ({localStorage.getItem('ck_user_city') || 'Delhi NCR'} &bull; PIN {localStorage.getItem('ck_user_pincode') || '110001'})
              </span>
              <span className="hidden md:inline-block text-[#86868b]">&bull;</span>
              <span className="text-xs font-semibold text-[#1d1d1f]">
                {userPhotos.length}/3 Verified Photos Uploaded
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => extraPhotoInputRef.current?.click()}
                className="text-xs font-bold bg-white text-[#0071e3] border border-blue-200 px-3 py-1.5 rounded-full hover:bg-blue-50 flex items-center gap-1 shadow-xs transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Photo ({userPhotos.length}/3)</span>
              </button>
              <input
                ref={extraPhotoInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleExtraPhotoUpload}
              />
            </div>
          </div>

          {/* User's Verified Photo Thumbnails */}
          {userPhotos.length > 0 && (
            <div className="flex items-center gap-2 pt-1 border-t border-blue-200/40">
              {userPhotos.map((url, idx) => (
                <div key={idx} className="relative group w-12 h-12 rounded-xl overflow-hidden ring-2 ring-white shadow-xs">
                  <img src={url} alt={`User Photo ${idx + 1}`} className="w-full h-full object-cover" />
                  {userPhotos.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removePhoto(idx)}
                      className="absolute inset-0 bg-black/60 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition"
                      title="Remove Photo"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-300" />
                    </button>
                  )}
                </div>
              ))}
              {userPhotos.length < 3 && (
                <div
                  onClick={() => extraPhotoInputRef.current?.click()}
                  className="w-12 h-12 rounded-xl border-2 border-dashed border-blue-300 bg-white/60 hover:bg-white flex flex-col items-center justify-center text-blue-500 cursor-pointer transition text-[9px] font-bold"
                >
                  <Plus className="w-4 h-4" />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Primary Tab Switcher: Explore Companions vs My Bookings */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('explore')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'explore'
                ? 'bg-[#1d1d1f] text-white shadow-md'
                : 'bg-white/80 text-[#1d1d1f] border border-pink-200 hover:bg-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            <span>Explore Companions ({filteredCompanions.length})</span>
          </button>
          <button
            onClick={() => { setActiveTab('bookings'); refreshBookings(); }}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'bookings'
                ? 'bg-[#1d1d1f] text-white shadow-md'
                : 'bg-white/80 text-[#1d1d1f] border border-pink-200 hover:bg-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-[#0071e3]" />
            <span>My Bookings</span>
            {myBookings.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-[#0071e3] text-white text-[10px] font-bold">
                {myBookings.length}
              </span>
            )}
          </button>
        </div>

        {/* TAB 1: EXPLORE COMPANIONS */}
        {activeTab === 'explore' && (
          <div>
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
                      placeholder="e.g. 110001, 248007, 400050"
                      className="w-full bg-[#fdf8f8] border border-pink-200 rounded-xl pl-9 pr-4 py-2.5 text-xs sm:text-sm font-bold text-[#1d1d1f] focus:outline-none focus:ring-2 focus:ring-[#0071e3]"
                    />
                  </div>
                </div>

                {/* Counter Stats */}
                <div className="sm:col-span-3 text-right">
                  <div className="text-[11px] text-[#86868b] uppercase font-bold">Companions Ready</div>
                  <div className="text-xl font-bold text-[#1d1d1f] font-display">
                    {filteredCompanions.length} Verified
                  </div>
                </div>
              </div>

              {/* Service Category Pills */}
              <div className="flex gap-2 overflow-x-auto no-scrollbar pt-2 border-t border-pink-100">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => { setSelectedCategory(cat.id); setCurrentProfileIndex(0); }}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition apple-focus ${
                      selectedCategory === cat.id
                        ? 'bg-[#0071e3] text-white shadow-xs'
                        : 'bg-pink-50/70 hover:bg-pink-100 text-[#1d1d1f]'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* View Mode: Swipe Card */}
            {viewMode === 'swipe' && activeProfile && (
              <div className="max-w-md mx-auto relative">
                {matchedAnimation && (
                  <div className="absolute inset-0 z-30 bg-[#FF2D55]/90 rounded-3xl flex flex-col items-center justify-center text-white animate-scale-up backdrop-blur-sm p-6 text-center">
                    <Sparkles className="w-12 h-12 mb-2 animate-bounce" />
                    <h3 className="text-2xl font-bold font-display">It's a Match!</h3>
                    <p className="text-xs opacity-90 mt-1">
                      You connected with {matchedAnimation}. Booking request dispatched to companion!
                    </p>
                  </div>
                )}

                <div className="bg-white rounded-3xl overflow-hidden border border-pink-200 shadow-apple-lg relative">
                  <div className="relative h-96 w-full overflow-hidden bg-stone-900">
                    <img 
                      src={activeProfile.avatarUrl} 
                      alt={activeProfile.name} 
                      className="w-full h-full object-cover object-top"
                    />
                    <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-semibold flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${activeProfile.online ? 'bg-emerald-400' : 'bg-stone-400'}`}></span>
                      <span>{activeProfile.online ? 'Available Now' : 'Offline'}</span>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold font-display flex items-center gap-2">
                          {activeProfile.name}, {activeProfile.age}
                          <CheckCircle2 className="w-5 h-5 text-[#2997ff]" />
                        </h2>
                        <span className="text-lg font-bold bg-pink-600 px-3 py-1 rounded-full tabular-numbers">
                          ₹{activeProfile.hourlyRate}/hr
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-white/80 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-pink-300" />
                        <span>{activeProfile.city} &bull; PIN {activeProfile.pinCode} ({activeProfile.distanceKm} km away)</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 space-y-4">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {activeProfile.badges.map((b, i) => (
                        <span key={i} className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-pink-50 text-pink-700 border border-pink-200">
                          {b}
                        </span>
                      ))}
                    </div>

                    <p className="text-xs text-[#1d1d1f]/80 leading-relaxed font-sans">
                      {activeProfile.bio}
                    </p>

                    <div className="pt-2 flex items-center justify-between border-t border-pink-100 text-xs">
                      <div className="flex items-center gap-1 text-amber-500 font-bold">
                        <Star className="w-4 h-4 fill-amber-400" />
                        <span>{activeProfile.rating} ({activeProfile.reviewCount} reviews)</span>
                      </div>
                      <div className="text-[#86868b]">
                        Languages: {activeProfile.languages.join(', ')}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <button
                        onClick={handlePrev}
                        aria-label="Previous profile"
                        className="w-12 h-12 rounded-full border border-pink-200 hover:bg-pink-50 flex items-center justify-center text-[#1d1d1f] transition active:scale-95 apple-focus"
                      >
                        <X className="w-5 h-5" />
                      </button>

                      <button
                        onClick={() => handleBookWithVerification(activeProfile)}
                        className="flex-1 bg-[#0071e3] hover:bg-[#0077ed] text-white py-3.5 rounded-full font-bold text-xs sm:text-sm transition shadow-apple-sm active:scale-98 apple-focus"
                      >
                        Book {activeProfile.name} (₹{activeProfile.hourlyRate}/hr)
                      </button>

                      <button
                        onClick={() => handleLike(activeProfile)}
                        aria-label="Connect with companion"
                        className="w-12 h-12 rounded-full bg-pink-50 hover:bg-pink-100 text-pink-600 border border-pink-200 flex items-center justify-center transition active:scale-95 apple-focus"
                      >
                        <Heart className="w-5 h-5 fill-pink-600" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* View Mode: Grid Layout */}
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
                        onClick={() => handleBookWithVerification(comp)}
                        className="w-full bg-[#0071e3] hover:bg-[#0077ed] text-white py-2.5 rounded-full text-xs font-bold transition shadow-sm apple-focus"
                      >
                        Book Now (₹{comp.hourlyRate}/hr)
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MY BOOKINGS */}
        {activeTab === 'bookings' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-white/80 backdrop-blur-xl p-4 rounded-2xl border border-pink-200 shadow-xs">
              <div>
                <h3 className="text-sm font-bold text-[#1d1d1f]">My Bookings &amp; Appointments</h3>
                <p className="text-xs text-[#86868b]">View your upcoming companion sessions and scheduled dates</p>
              </div>
              <button
                onClick={refreshBookings}
                className="px-4 py-2 rounded-full bg-[#f5f5f7] hover:bg-pink-100 text-[#1d1d1f] text-xs font-bold transition flex items-center gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingBookings ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>

            {myBookings.length === 0 ? (
              <div className="text-center py-16 bg-white/60 backdrop-blur-md rounded-3xl border border-pink-200 p-8">
                <Clock className="w-12 h-12 text-[#86868b] mx-auto mb-3" />
                <h3 className="text-lg font-bold text-[#1d1d1f] mb-1">No Active Bookings Yet</h3>
                <p className="text-xs text-[#86868b] max-w-sm mx-auto mb-5">
                  You haven't booked a companion yet. Browse through our verified companions above and book in 1-click!
                </p>
                <button
                  onClick={() => setActiveTab('explore')}
                  className="bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-bold px-6 py-2.5 rounded-full transition shadow-sm"
                >
                  Explore Companions Now
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myBookings.map((b) => (
                  <div key={b.id} className="bg-white rounded-2xl p-5 border border-pink-200 shadow-sm hover:shadow-apple-md transition">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-full bg-blue-50 text-[#0071e3] border border-blue-100">
                        {b.booking_code}
                      </span>
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                        b.status === 'confirmed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        b.status === 'completed' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                        'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {b.status}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-[#1d1d1f] mb-1">
                      {b.service_title}
                    </h4>

                    {b.companion_name && (
                      <p className="text-xs text-[#0071e3] font-bold mb-2">
                        Companion: {b.companion_name}
                      </p>
                    )}

                    <div className="grid grid-cols-2 gap-2 text-xs text-[#86868b] pt-2 border-t border-pink-100 mb-3">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-pink-500" />
                        <span>{b.city} ({b.pin_code})</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-blue-500" />
                        <span>{b.booking_date}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-amber-500" />
                        <span>{b.hours} {b.hours === 1 ? 'Hour' : 'Hours'}</span>
                      </div>
                      <div className="font-bold text-[#1d1d1f] text-sm tabular-numbers">
                        ₹{Number(b.total_price).toLocaleString('en-IN')}
                      </div>
                    </div>

                    {/* Chat with Companion Button */}
                    <button
                      type="button"
                      onClick={() => {
                        setChatTarget({
                          name: b.companion_name || 'Companion Concierge',
                          avatar: b.companion_avatar,
                          phone: undefined,
                          bookingCode: b.booking_code,
                        });
                        setChatModalOpen(true);
                      }}
                      className="w-full bg-pink-50 hover:bg-pink-100 text-[#0071e3] border border-pink-200 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Chat with Companion</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PHOTO REQUIREMENT MODAL */}
        {photoRequirementModal && (
          <div className="fixed inset-0 z-[175] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
            <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center border border-pink-200 shadow-apple-lg space-y-3">
              <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto ring-4 ring-amber-50">
                <Camera className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#1d1d1f]">2 Photos Required</h3>
              <p className="text-xs text-[#86868b] leading-relaxed">
                For community safety, all seekers must add at least 2 clear photos before booking or matching with companions.
              </p>
              <button
                type="button"
                onClick={() => {
                  setPhotoRequirementModal(false);
                  extraPhotoInputRef.current?.click();
                }}
                className="w-full bg-[#0071e3] text-white py-3 rounded-full font-bold text-xs shadow-sm hover:bg-[#0077ed] transition"
              >
                Upload Second Photo Now
              </button>
              <button
                type="button"
                onClick={() => setPhotoRequirementModal(false)}
                className="text-xs text-[#86868b] hover:underline"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* MODALS */}
        <FaceVerificationModal
          isOpen={faceModalOpen}
          onClose={() => setFaceModalOpen(false)}
          onVerified={() => setKycVerified(true)}
          userName={userName}
          userPhotos={userPhotos}
        />

        <RandomMatchModal
          isOpen={randomModalOpen}
          onClose={() => setRandomModalOpen(false)}
          companions={companions}
          currentCity={selectedCity}
          onSelectCompanion={(matched) => handleBookWithVerification(matched)}
        />

        {chatTarget && (
          <ChatModal
            isOpen={chatModalOpen}
            onClose={() => setChatModalOpen(false)}
            bookingCode={chatTarget.bookingCode}
            otherPartyName={chatTarget.name}
            otherPartyAvatar={chatTarget.avatar}
            otherPartyPhone={chatTarget.phone}
            currentRole="seeker"
          />
        )}

      </div>
    </div>
  );
};
