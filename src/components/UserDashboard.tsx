import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft, 
  Bell, 
  Settings, 
  Edit3, 
  CheckCircle2, 
  Star, 
  Sparkles, 
  Search, 
  ShoppingBag, 
  Calendar, 
  CreditCard, 
  ArrowRight,
  LogOut,
  Camera,
  LayoutDashboard,
  Receipt,
  ShieldCheck,
  TrendingUp,
  Trash2,
  Plus,
  Heart
} from 'lucide-react';
import { MyBookingsModal } from './MyBookingsModal';
import { TransactionsModal } from './TransactionsModal';
import { ThreeMonthPassModal } from './ThreeMonthPassModal';
import { LegalPolicyModal } from './LegalPolicyModal';
import { UpcomingEventsModal, EventItem } from './UpcomingEventsModal';
import { saveClientToSupabase, deleteClientAccountFromSupabase } from '../services/supabase';

interface UserDashboardProps {
  userName: string;
  userAvatar?: string;
  userRole?: string;
  onBackToHome: () => void;
  onBrowseCompanions: () => void;
  onBuyServices: () => void;
  onBecomeCompanion: () => void;
  onViewBookings: () => void;
  onLogout?: () => void;
  onUpdateAvatar?: (url: string) => void;
}

const AVAILABLE_HOBBIES = [
  'Travel',
  'Cafes & Coffee',
  'Movies & Cinema',
  'Gaming',
  'Live Music',
  'Fitness & Gym',
  'Photography',
  'Fine Dining',
  'Books & Reading',
  'Art & Culture',
  'Tech & AI',
  'Nightlife',
  'Cooking',
  'Hiking & Outings'
];

const DEFAULT_GALLERY = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&auto=format&fit=crop&q=80'
];

export const UserDashboard: React.FC<UserDashboardProps> = ({
  userName,
  userAvatar,
  userRole: _userRole = 'Companion',
  onBackToHome,
  onBrowseCompanions,
  onBuyServices,
  onBecomeCompanion,
  onViewBookings: _onViewBookings,
  onLogout,
  onUpdateAvatar,
}) => {
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationCount, setNotificationCount] = useState(5);
  
  // Modals state
  const [editProfileModal, setEditProfileModal] = useState(false);
  const [transactionsModal, setTransactionsModal] = useState(false);
  const [bookingsModal, setBookingsModal] = useState(false);
  const [threeMonthPassModal, setThreeMonthPassModal] = useState(false);
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [legalTab, setLegalTab] = useState<'privacy' | 'refund' | 'terms'>('privacy');
  const [eventsModalOpen, setEventsModalOpen] = useState(false);
  const [deleteAccountModal, setDeleteAccountModal] = useState(false);

  // User Profile States (Fully customizable)
  const [displayName, setDisplayName] = useState(() => localStorage.getItem('ck_user_name') || userName || 'Ankush Amber');
  const [userPhone, setUserPhone] = useState(() => localStorage.getItem('ck_user_phone') || '9719333339');
  const [userDob, setUserDob] = useState(() => localStorage.getItem('ck_user_dob') || '2001-05-15');
  const [userUpi, setUserUpi] = useState(() => localStorage.getItem('ck_user_upi') || 'ankush@okhdfcbank');
  const [userBio, setUserBio] = useState(() => 
    localStorage.getItem('ck_user_bio') || 
    'Passionate traveler, foodie and friendly conversationalist. Looking to explore top cafes, live concerts, and fun city outings.'
  );
  const [userHobbies, setUserHobbies] = useState<string[]>(() => {
    const saved = localStorage.getItem('ck_user_hobbies');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return ['Travel', 'Cafes & Coffee', 'Movies & Cinema', 'Live Music', 'Photography'];
  });
  const [userGallery, setUserGallery] = useState<string[]>(() => {
    const saved = localStorage.getItem('ck_user_gallery');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return DEFAULT_GALLERY;
  });

  // Edit Profile draft states (inside modal)
  const [draftName, setDraftName] = useState(displayName);
  const [draftPhone, setDraftPhone] = useState(userPhone);
  const [draftDob, setDraftDob] = useState(userDob);
  const [draftUpi, setDraftUpi] = useState(userUpi);
  const [draftBio, setDraftBio] = useState(userBio);
  const [draftHobbies, setDraftHobbies] = useState<string[]>(userHobbies);
  const [draftGallery, setDraftGallery] = useState<string[]>(userGallery);
  const [activeEditTab, setActiveEditTab] = useState<'basic' | 'bio' | 'hobbies' | 'gallery'>('basic');
  const [dobError, setDobError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const settingsMenuRef = useRef<HTMLDivElement>(null);

  // Calculate 18 years ago max date for DOB validation
  const get18YearsAgoDate = () => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 18);
    return d.toISOString().split('T')[0];
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (settingsMenuRef.current && !settingsMenuRef.current.contains(event.target as Node)) {
        setShowSettingsMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const openEditModal = () => {
    setDraftName(displayName);
    setDraftPhone(userPhone);
    setDraftDob(userDob);
    setDraftUpi(userUpi);
    setDraftBio(userBio);
    setDraftHobbies([...userHobbies]);
    setDraftGallery([...userGallery]);
    setDobError(null);
    setSaveSuccess(false);
    setEditProfileModal(true);
  };

  const handleToggleHobby = (hobby: string) => {
    if (draftHobbies.includes(hobby)) {
      setDraftHobbies(draftHobbies.filter(h => h !== hobby));
    } else {
      if (draftHobbies.length >= 8) return; // Limit to 8
      setDraftHobbies([...draftHobbies, hobby]);
    }
  };

  const handleAddGalleryPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setDraftGallery(prev => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const handleRemoveGalleryPhoto = (idx: number) => {
    setDraftGallery(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate 18+ DOB
    if (draftDob) {
      const birthDate = new Date(draftDob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      if (age < 18) {
        setDobError('You must be at least 18 years of age to use Click Karo Date Karo.');
        setActiveEditTab('basic');
        return;
      }
    }

    setDisplayName(draftName);
    setUserPhone(draftPhone);
    setUserDob(draftDob);
    setUserUpi(draftUpi);
    setUserBio(draftBio);
    setUserHobbies(draftHobbies);
    setUserGallery(draftGallery);

    localStorage.setItem('ck_user_name', draftName);
    localStorage.setItem('ck_user_phone', draftPhone);
    localStorage.setItem('ck_user_dob', draftDob);
    localStorage.setItem('ck_user_upi', draftUpi);
    localStorage.setItem('ck_user_bio', draftBio);
    localStorage.setItem('ck_user_hobbies', JSON.stringify(draftHobbies));
    localStorage.setItem('ck_user_gallery', JSON.stringify(draftGallery));

    // Persist and sync directly with live Supabase Database
    saveClientToSupabase({
      full_name: draftName,
      phone: draftPhone,
      email: localStorage.getItem('ck_user_email') || null,
      avatar_url: userAvatar || localStorage.getItem('ck_user_avatar') || undefined,
      role: 'user',
      metadata: {
        dob: draftDob,
        upi_id: draftUpi,
        bio: draftBio,
        hobbies: draftHobbies,
        gallery: draftGallery,
        last_updated: new Date().toISOString(),
      }
    }).catch(err => console.warn('[Supabase CRM] Sync error:', err));

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setEditProfileModal(false);
    }, 800);
  };

  const notifications = [
    'Your Face Verification is approved & profile is 100% active',
    '1 Service Credit available for immediate booking',
    'Earn ₹7,000–₹10,000/day: 14 new booking requests near you',
    '3 Months All-Access Membership Pass is currently active',
    'Welcome to Click Karo Date Karo! Explore verified companions',
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F8] text-[#1d1d1f] font-sans pb-24">
      
      {/* 1. BESPOKE BRAND HEADER */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-2xl border-b border-pink-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          
          {/* Left: Back Button & ClickKaro Brand Logo */}
          <div className="flex items-center gap-4 sm:gap-6">
            <button
              onClick={onBackToHome}
              className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#1d1d1f] hover:text-[#FF2D55] transition apple-focus cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            {/* Official Click Karo Date Karo Company Logo */}
            <div 
              onClick={onBackToHome}
              className="flex items-center cursor-pointer select-none group/logo"
              title="Click Karo Date Karo"
            >
              <img 
                src="/assets/brand_logo.png" 
                alt="Click Karo Date Karo" 
                className="h-10 sm:h-12 w-auto object-contain transition-transform duration-300 group-hover/logo:scale-105 drop-shadow-xs"
              />
            </div>
          </div>

          {/* Center Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-8 text-xs sm:text-sm font-bold text-[#1d1d1f]/75">
            <a href="#services" onClick={onBackToHome} className="hover:text-[#FF2D55] transition">Services</a>
            <a href="#trust-blueprint" onClick={onBackToHome} className="hover:text-[#FF2D55] transition">Why Choose Us</a>
            <a href="#pricing" onClick={onBackToHome} className="hover:text-[#FF2D55] transition">Pricing</a>
            <button 
              onClick={() => setEventsModalOpen(true)} 
              className="hover:text-[#FF2D55] transition flex items-center gap-1 text-[#FF2D55]"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Upcoming Events</span>
            </button>
          </nav>

          {/* Right: Notifications & Settings Menu Dropdown */}
          <div className="flex items-center gap-3 relative">
            
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="w-10 h-10 rounded-full hover:bg-pink-50 flex items-center justify-center text-[#1d1d1f] transition cursor-pointer"
                title="Notifications"
              >
                <Bell className="w-5 h-5 text-[#4B5563]" />
                {notificationCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#FF2D55] text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                    {notificationCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-3xl shadow-apple-lg border border-pink-100 p-4 z-50 animate-fade-in">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-pink-100">
                    <span className="font-bold text-xs text-[#1d1d1f]">Notifications ({notificationCount})</span>
                    <button 
                      onClick={() => setNotificationCount(0)}
                      className="text-[10px] text-[#FF2D55] hover:underline font-bold"
                    >
                      Clear all
                    </button>
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {notifications.map((n, i) => (
                      <div key={i} className="text-xs p-2.5 rounded-xl bg-[#fdf8f8] text-[#1d1d1f]/90 border border-pink-100/70">
                        {n}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* SETTINGS BUTTON & USER AVATAR TRIGGER */}
            <div className="relative" ref={settingsMenuRef}>
              <button
                onClick={() => setShowSettingsMenu(!showSettingsMenu)}
                className="flex items-center gap-2 p-1.5 pl-2 pr-3 rounded-full bg-white border border-pink-200/80 hover:border-[#FF2D55]/50 shadow-xs transition-all cursor-pointer group"
                title="Account Settings & Menu"
              >
                <img
                  src={userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                  alt={userName}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-pink-100 group-hover:ring-[#FF2D55]/30 transition"
                />
                <Settings className="w-4 h-4 text-[#4B5563] group-hover:rotate-45 transition-transform duration-300" />
              </button>

              {/* EXACT SETTINGS DROPDOWN MENU */}
              {showSettingsMenu && (
                <div className="absolute right-0 mt-3 w-64 bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.12)] border border-stone-200/80 p-2 z-50 animate-fade-in divide-y divide-stone-100">
                  
                  {/* User Profile Header */}
                  <div className="px-4 py-3.5">
                    <div className="font-display font-bold text-sm text-[#111827] truncate">
                      {displayName || 'Ankush Amber'}
                    </div>
                    <div className="text-xs text-[#6B7280] font-mono mt-0.5">
                      {userPhone}
                    </div>
                    {userUpi && (
                      <div className="text-[10px] text-pink-600 font-mono truncate mt-0.5">
                        UPI: {userUpi}
                      </div>
                    )}
                  </div>

                  {/* Menu Options */}
                  <div className="py-2 space-y-0.5">
                    
                    {/* Dashboard */}
                    <button
                      onClick={() => {
                        setShowSettingsMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-semibold text-[#374151] hover:bg-pink-50/80 hover:text-[#FF2D55] transition text-left cursor-pointer"
                    >
                      <LayoutDashboard className="w-4 h-4 text-[#6B7280]" />
                      <span>Dashboard</span>
                    </button>

                    {/* My Bookings */}
                    <button
                      onClick={() => {
                        setShowSettingsMenu(false);
                        setBookingsModal(true);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-semibold text-[#374151] hover:bg-pink-50/80 hover:text-[#FF2D55] transition text-left cursor-pointer"
                    >
                      <Calendar className="w-4 h-4 text-[#6B7280]" />
                      <span>My Bookings</span>
                    </button>

                    {/* Buy Services */}
                    <button
                      onClick={() => {
                        setShowSettingsMenu(false);
                        onBuyServices();
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-semibold text-[#374151] hover:bg-pink-50/80 hover:text-[#FF2D55] transition text-left cursor-pointer"
                    >
                      <ShoppingBag className="w-4 h-4 text-[#6B7280]" />
                      <span>Buy Services</span>
                    </button>

                    {/* Upcoming Events */}
                    <button
                      onClick={() => {
                        setShowSettingsMenu(false);
                        setEventsModalOpen(true);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-semibold text-[#FF2D55] hover:bg-pink-50/80 transition text-left cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-[#FF2D55]" />
                      <span>Upcoming Events</span>
                    </button>

                    {/* Transactions */}
                    <button
                      onClick={() => {
                        setShowSettingsMenu(false);
                        setTransactionsModal(true);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-semibold text-[#374151] hover:bg-pink-50/80 hover:text-[#FF2D55] transition text-left cursor-pointer"
                    >
                      <Receipt className="w-4 h-4 text-[#6B7280]" />
                      <span>Transactions</span>
                    </button>

                    {/* Account Settings / Edit Profile */}
                    <button
                      onClick={() => {
                        setShowSettingsMenu(false);
                        openEditModal();
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-semibold text-[#374151] hover:bg-pink-50/80 hover:text-[#FF2D55] transition text-left cursor-pointer"
                    >
                      <Settings className="w-4 h-4 text-[#6B7280]" />
                      <span>Edit Profile</span>
                    </button>

                    {/* Privacy Policy */}
                    <button
                      onClick={() => {
                        setShowSettingsMenu(false);
                        setLegalTab('privacy');
                        setLegalModalOpen(true);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-semibold text-[#374151] hover:bg-pink-50/80 hover:text-[#0071E3] transition text-left cursor-pointer"
                    >
                      <ShieldCheck className="w-4 h-4 text-[#0071E3]" />
                      <span>Privacy Policy (IT Act)</span>
                    </button>

                    {/* Refund Policy */}
                    <button
                      onClick={() => {
                        setShowSettingsMenu(false);
                        setLegalTab('refund');
                        setLegalModalOpen(true);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-semibold text-[#374151] hover:bg-pink-50/80 hover:text-emerald-700 transition text-left cursor-pointer"
                    >
                      <Receipt className="w-4 h-4 text-emerald-600" />
                      <span>Refund Policy (100%)</span>
                    </button>

                    {/* Delete Account */}
                    <button
                      onClick={() => {
                        setShowSettingsMenu(false);
                        setDeleteAccountModal(true);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition text-left cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4 text-rose-500" />
                      <span>Delete Account</span>
                    </button>
                  </div>

                  {/* Logout */}
                  <div className="pt-2">
                    <button
                      onClick={() => {
                        setShowSettingsMenu(false);
                        if (onLogout) onLogout();
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition text-left cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-rose-600" />
                      <span>Logout</span>
                    </button>
                  </div>

                </div>
              )}
            </div>

          </div>

        </div>
      </header>

      {/* 2. DASHBOARD BODY */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 sm:pt-10 space-y-8">
        
        {/* Profile Card with Full Details */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-pink-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-start sm:items-center gap-5">
              <div className="relative shrink-0">
                <img
                  src={userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                  alt={displayName}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover ring-4 ring-pink-100 shadow-sm"
                />
                <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white" title="Active Online" />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-display font-black text-[#111827]">
                    Welcome, {displayName || 'Ankush Amber'}!
                  </h1>
                  <ShieldCheck className="w-5 h-5 text-[#0071E3]" />
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-[#6B7280] mt-1 font-medium">
                  <span>Phone: <strong className="text-[#111827] font-mono">{userPhone}</strong></span>
                  <span>&bull;</span>
                  <span>DOB: <strong className="text-[#111827]">{userDob || '2001-05-15'}</strong></span>
                  {userUpi && (
                    <>
                      <span>&bull;</span>
                      <span>UPI: <strong className="text-pink-600 font-mono">{userUpi}</strong></span>
                    </>
                  )}
                </div>

                {/* Status Badges */}
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Aadhaar &amp; Face Verified</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setThreeMonthPassModal(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 hover:bg-pink-100 border border-pink-200 text-[#FF2D55] text-[11px] font-bold cursor-pointer transition hover:scale-105"
                    title="Click to view 3-Month Membership Pass"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#FF2D55]" />
                    <span>3-Month Access Active</span>
                  </button>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-800 text-[11px] font-bold">
                    <Star className="w-3.5 h-3.5 fill-purple-600" />
                    <span>VIP Member</span>
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={openEditModal}
              className="px-5 py-2.5 rounded-2xl bg-[#F4F4F6] hover:bg-pink-50 text-[#1d1d1f] hover:text-[#FF2D55] text-xs font-bold transition flex items-center gap-2 border border-stone-200 cursor-pointer shadow-xs shrink-0"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Full Profile</span>
            </button>
          </div>

          {/* User Bio & Description */}
          {userBio && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-50/60 to-purple-50/40 border border-pink-100 text-xs sm:text-sm text-[#374151] leading-relaxed">
              <span className="font-bold text-[#111827] mr-1.5">About Me:</span>
              <span>{userBio}</span>
            </div>
          )}

          {/* User Hobbies & Interests Chips */}
          {userHobbies && userHobbies.length > 0 && (
            <div>
              <div className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-2">
                Interests &amp; Outing Preferences ({userHobbies.length})
              </div>
              <div className="flex flex-wrap gap-2">
                {userHobbies.map((hobby, idx) => (
                  <span 
                    key={idx}
                    className="px-3 py-1 rounded-xl bg-stone-100 text-[#1d1d1f] font-semibold text-xs border border-stone-200/80 flex items-center gap-1"
                  >
                    <Heart className="w-3 h-3 text-[#FF2D55] fill-pink-500/20" />
                    <span>{hobby}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* User Gallery Preview */}
          {userGallery && userGallery.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">
                  Profile Photo Gallery ({userGallery.length})
                </div>
                <button 
                  onClick={openEditModal} 
                  className="text-xs text-[#FF2D55] font-bold hover:underline"
                >
                  Manage Photos
                </button>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {userGallery.map((imgUrl, idx) => (
                  <div key={idx} className="aspect-square rounded-2xl overflow-hidden border border-pink-200 shadow-xs relative group">
                    <img 
                      src={imgUrl} 
                      alt={`Gallery ${idx + 1}`} 
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 3. DUAL ACTION HUBS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* HUB 1: FIND A COMPANION */}
          <div className="rounded-[2.2rem] p-7 sm:p-9 text-white bg-gradient-to-br from-[#1E1B2E] via-[#2A1828] to-[#1A0B1A] border border-white/10 shadow-[0_20px_50px_rgba(255,45,85,0.15)] flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-radial-gradient from-[#FF2D55]/30 to-transparent rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-4 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-pink-300 text-[11px] font-bold tracking-wide">
                <Search className="w-3.5 h-3.5" />
                <span>Verified Client Network</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-display font-black tracking-tight text-white">
                Find a Companion
              </h2>
              <p className="text-white/80 text-xs sm:text-sm font-normal leading-relaxed max-w-sm">
                Connect with verified companions for movies, coffee talks, dinners, and weekend getaways across premier cities.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-6 relative z-10">
              <button
                onClick={onBrowseCompanions}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#FF2D55] to-[#E11D48] text-white hover:opacity-95 font-bold text-xs sm:text-sm transition shadow-lg shadow-pink-500/30 flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <Search className="w-4 h-4" />
                <span>Browse Companions</span>
              </button>
              <button
                onClick={onBuyServices}
                className="px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs sm:text-sm transition flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Buy Services</span>
              </button>
            </div>
          </div>

          {/* HUB 2: BECOME A COMPANION */}
          <div className="rounded-[2.2rem] p-7 sm:p-9 text-[#1d1d1f] bg-gradient-to-br from-[#FFFFFF] via-[#FFF8F8] to-[#FFF1F3] border border-pink-200 shadow-[0_20px_50px_rgba(0,0,0,0.04)] flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-radial-gradient from-emerald-400/20 to-transparent rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-4 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-[11px] font-bold tracking-wide">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Earn ₹7,000 – ₹10,000/day</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-display font-black tracking-tight text-[#111827]">
                Become a Companion
              </h2>
              <p className="text-[#4B5563] text-xs sm:text-sm font-normal leading-relaxed max-w-sm">
                Get verified, accept booking requests from genuine clients, and earn weekly payouts with 80% net take-home rate.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-6 relative z-10">
              <button
                onClick={onBecomeCompanion}
                className="px-6 py-3 rounded-2xl bg-[#111827] hover:bg-[#FF2D55] text-white font-bold text-xs sm:text-sm transition shadow-md flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-pink-300" />
                <span>Get Started</span>
              </button>
              <button
                onClick={() => setBookingsModal(true)}
                className="px-6 py-3 rounded-2xl bg-white hover:bg-pink-50 text-[#111827] border border-pink-200 font-bold text-xs sm:text-sm transition flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <Calendar className="w-4 h-4 text-[#FF2D55]" />
                <span>My Bookings</span>
              </button>
            </div>
          </div>

        </div>

        {/* 4. THREE BESPOKE QUICK ACTIONS */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 pt-2">
          
          {/* Card 1: My Bookings */}
          <div 
            onClick={() => setBookingsModal(true)}
            className="bg-white rounded-3xl p-6 border border-pink-100 shadow-sm hover:shadow-apple-md transition cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="w-10 h-10 rounded-2xl bg-pink-50 text-[#FF2D55] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-base text-[#111827] mb-1">
                My Bookings
              </h3>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                View scheduled outings, confirmed companions &amp; meeting details
              </p>
            </div>
            <div className="pt-4 text-xs font-bold text-[#FF2D55] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>View Bookings</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 2: Upcoming Events */}
          <div 
            onClick={() => setEventsModalOpen(true)}
            className="bg-white rounded-3xl p-6 border border-pink-100 shadow-sm hover:shadow-apple-md transition cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="w-10 h-10 rounded-2xl bg-rose-50 text-[#FF2D55] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-base text-[#111827] mb-1">
                Upcoming Events
              </h3>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                Discover concerts, food fests, comedy shows &amp; book companions
              </p>
            </div>
            <div className="pt-4 text-xs font-bold text-[#FF2D55] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Explore Events</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 3: Transactions & Billing */}
          <div 
            onClick={() => setTransactionsModal(true)}
            className="bg-white rounded-3xl p-6 border border-pink-100 shadow-sm hover:shadow-apple-md transition cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <CreditCard className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-base text-[#111827] mb-1">
                Payment History
              </h3>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                Check service credits, payment receipts &amp; invoice records
              </p>
            </div>
            <div className="pt-4 text-xs font-bold text-emerald-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>View Transactions</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 4: Membership Status */}
          <div 
            onClick={() => setThreeMonthPassModal(true)}
            className="bg-white rounded-3xl p-6 border border-pink-100 shadow-sm hover:shadow-apple-md transition cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-base text-[#111827] mb-1">
                3-Month Pass
              </h3>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                Active access &bull; Book verified companions across all cities
              </p>
            </div>
            <div className="pt-4 text-xs font-bold text-purple-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Manage Services</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

        </div>

      </main>

      {/* 1. MY BOOKINGS MODAL */}
      <MyBookingsModal
        isOpen={bookingsModal}
        onClose={() => setBookingsModal(false)}
        onFindCompanion={onBrowseCompanions}
        userName={displayName}
      />

      {/* 2. TRANSACTIONS MODAL */}
      <TransactionsModal
        isOpen={transactionsModal}
        onClose={() => setTransactionsModal(false)}
        onBuyServices={onBuyServices}
        userName={displayName}
      />

      {/* 3. 3-MONTH MEMBERSHIP PASS MODAL */}
      <ThreeMonthPassModal
        isOpen={threeMonthPassModal}
        onClose={() => setThreeMonthPassModal(false)}
        onFindCompanion={onBrowseCompanions}
        userName={displayName}
      />

      {/* 4. LEGAL & PRIVACY POLICY MODAL (IT Act, 2000 & 100% Refund) */}
      <LegalPolicyModal
        isOpen={legalModalOpen}
        onClose={() => setLegalModalOpen(false)}
        initialTab={legalTab}
      />

      {/* 5. UPCOMING EVENTS MODAL */}
      <UpcomingEventsModal
        isOpen={eventsModalOpen}
        onClose={() => setEventsModalOpen(false)}
        onBookEventPartner={(_evt: EventItem) => {
          setEventsModalOpen(false);
          onBrowseCompanions();
        }}
      />

      {/* 6. COMPREHENSIVE EDIT PROFILE MODAL */}
      {editProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 border border-pink-200 shadow-apple-float max-h-[90vh] overflow-y-auto no-scrollbar">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-[#FF2D55]" />
                <h3 className="text-lg font-bold text-[#1d1d1f]">Edit Profile &amp; Preferences</h3>
              </div>
              <button 
                onClick={() => setEditProfileModal(false)}
                className="text-xs font-bold text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-2xl mb-5">
              <button
                type="button"
                onClick={() => setActiveEditTab('basic')}
                className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeEditTab === 'basic' ? 'bg-white text-[#111827] shadow-xs' : 'text-[#6B7280] hover:text-[#111827]'
                }`}
              >
                Personal Info
              </button>
              <button
                type="button"
                onClick={() => setActiveEditTab('bio')}
                className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeEditTab === 'bio' ? 'bg-white text-[#111827] shadow-xs' : 'text-[#6B7280] hover:text-[#111827]'
                }`}
              >
                Bio &amp; UPI
              </button>
              <button
                type="button"
                onClick={() => setActiveEditTab('hobbies')}
                className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeEditTab === 'hobbies' ? 'bg-white text-[#111827] shadow-xs' : 'text-[#6B7280] hover:text-[#111827]'
                }`}
              >
                Interests
              </button>
              <button
                type="button"
                onClick={() => setActiveEditTab('gallery')}
                className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeEditTab === 'gallery' ? 'bg-white text-[#111827] shadow-xs' : 'text-[#6B7280] hover:text-[#111827]'
                }`}
              >
                Gallery ({draftGallery.length})
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              
              {/* TAB 1: BASIC INFO & AVATAR */}
              {activeEditTab === 'basic' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#1d1d1f] mb-1">Profile Photo</label>
                    <div className="flex items-center gap-3">
                      <img
                        src={userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                        alt="Preview"
                        className="w-14 h-14 rounded-full object-cover ring-2 ring-pink-200"
                      />
                      <label className="px-3.5 py-2 rounded-xl bg-pink-50 hover:bg-pink-100 text-[#FF2D55] text-xs font-bold cursor-pointer transition flex items-center gap-1.5">
                        <Camera className="w-3.5 h-3.5" />
                        <span>Upload New Avatar</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                if (typeof reader.result === 'string' && onUpdateAvatar) {
                                  onUpdateAvatar(reader.result);
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1d1d1f] mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={draftName}
                      onChange={(e) => setDraftName(e.target.value)}
                      className="w-full bg-[#fdf8f8] border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FF2D55]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1d1d1f] mb-1">Phone Number (WhatsApp)</label>
                    <input
                      type="tel"
                      required
                      value={draftPhone}
                      onChange={(e) => setDraftPhone(e.target.value)}
                      className="w-full bg-[#fdf8f8] border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FF2D55]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1d1d1f] mb-1">
                      Date of Birth (Must be 18+)
                    </label>
                    <input
                      type="date"
                      required
                      max={get18YearsAgoDate()}
                      value={draftDob}
                      onChange={(e) => {
                        setDraftDob(e.target.value);
                        setDobError(null);
                      }}
                      className="w-full bg-[#fdf8f8] border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FF2D55]"
                    />
                    {dobError && (
                      <p className="text-xs text-rose-600 font-bold mt-1">{dobError}</p>
                    )}
                    <span className="text-[11px] text-stone-500 mt-1 block">
                      Required for identity verification under IT Act, 2000.
                    </span>
                  </div>
                </div>
              )}

              {/* TAB 2: BIO & UPI ID */}
              {activeEditTab === 'bio' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#1d1d1f] mb-1">
                      UPI ID (For Fast Refunds &amp; Earnings Payout)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. yourname@okhdfcbank or 9876543210@paytm"
                      value={draftUpi}
                      onChange={(e) => setDraftUpi(e.target.value)}
                      className="w-full bg-[#fdf8f8] border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-mono font-medium focus:outline-none focus:ring-2 focus:ring-[#FF2D55]"
                    />
                    <span className="text-[11px] text-stone-500 mt-1 block">
                      Used for instant 100% money-back guarantee refunds and companion weekly payouts.
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1d1d1f] mb-1">
                      About Me / Bio
                    </label>
                    <textarea
                      rows={4}
                      value={draftBio}
                      onChange={(e) => setDraftBio(e.target.value)}
                      placeholder="Tell potential companions what outings and conversations you enjoy..."
                      className="w-full bg-[#fdf8f8] border border-pink-200 rounded-xl p-3 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FF2D55]"
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: HOBBIES & INTERESTS */}
              {activeEditTab === 'hobbies' && (
                <div className="space-y-3">
                  <div className="text-xs text-stone-600">
                    Select up to 8 interests to match with companions who share your passions:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {AVAILABLE_HOBBIES.map((hobby) => {
                      const isSelected = draftHobbies.includes(hobby);
                      return (
                        <button
                          key={hobby}
                          type="button"
                          onClick={() => handleToggleHobby(hobby)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                            isSelected 
                              ? 'bg-[#FF2D55] text-white shadow-xs' 
                              : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                          }`}
                        >
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                          <span>{hobby}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 4: GALLERY PHOTOS */}
              {activeEditTab === 'gallery' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-700">Add Photos to Your Gallery</span>
                    <label className="px-3 py-1.5 rounded-xl bg-pink-50 hover:bg-pink-100 text-[#FF2D55] text-xs font-bold cursor-pointer transition flex items-center gap-1">
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAddGalleryPhoto}
                      />
                    </label>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {draftGallery.map((imgUrl, idx) => (
                      <div key={idx} className="aspect-square rounded-2xl overflow-hidden border border-pink-200 shadow-xs relative group">
                        <img src={imgUrl} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveGalleryPhoto(idx)}
                          className="absolute top-1 right-1 w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center opacity-90 hover:opacity-100 transition"
                          title="Remove Photo"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {saveSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Profile details updated successfully!</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 pt-3 border-t border-stone-100">
                <button
                  type="submit"
                  className="flex-1 bg-[#111827] hover:bg-[#FF2D55] text-white py-2.5 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
                >
                  Save All Changes
                </button>
                <button
                  type="button"
                  onClick={() => setEditProfileModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-[#1d1d1f] text-xs font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. DELETE ACCOUNT CONFIRMATION MODAL */}
      {deleteAccountModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 border border-rose-200 shadow-apple-float space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <LogOut className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-display font-bold text-lg text-rose-950">
                Permanently Delete Account?
              </h3>
              <p className="text-xs text-stone-600">
                In compliance with <strong>Section 7 of our IT Act Data Retention policy</strong> for Click Karo Date Karo (A unit of AMBER VENTURES (OPC) PVT LTD), your profile and bookings will be scheduled for permanent erasure within 90 days.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
              ⚠️ All active service credits and verified badges will be immediately revoked.
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteAccountModal(false)}
                className="w-full py-2.5 rounded-xl border border-stone-300 text-stone-700 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  const phone = localStorage.getItem('ck_user_phone');
                  const email = localStorage.getItem('ck_user_email');
                  const firebaseUid = localStorage.getItem('ck_firebase_uid');
                  try {
                    await deleteClientAccountFromSupabase({ phone, email, firebase_uid: firebaseUid });
                  } catch (e) {
                    console.warn('[DeleteAccount] Supabase wipe notice:', e);
                  }
                  localStorage.clear();
                  setDeleteAccountModal(false);
                  if (onLogout) onLogout();
                }}
                className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
export default UserDashboard;

