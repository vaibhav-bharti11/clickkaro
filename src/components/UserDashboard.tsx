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
  TrendingUp
} from 'lucide-react';
import { MyBookingsModal } from './MyBookingsModal';
import { TransactionsModal } from './TransactionsModal';
import { ThreeMonthPassModal } from './ThreeMonthPassModal';

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
  const [editProfileModal, setEditProfileModal] = useState(false);
  const [transactionsModal, setTransactionsModal] = useState(false);
  const [bookingsModal, setBookingsModal] = useState(false);
  const [threeMonthPassModal, setThreeMonthPassModal] = useState(false);
  const [displayName, setDisplayName] = useState(userName);
  const [userPhone, setUserPhone] = useState(() => localStorage.getItem('ck_user_phone') || '9719333339');

  const settingsMenuRef = useRef<HTMLDivElement>(null);

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

            {/* SETTINGS BUTTON & USER AVATAR TRIGGER (Exact Menu as Screenshot) */}
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

              {/* EXACT SETTINGS DROPDOWN MENU FROM USER SCREENSHOT */}
              {showSettingsMenu && (
                <div className="absolute right-0 mt-3 w-64 bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.12)] border border-stone-200/80 p-2 z-50 animate-fade-in divide-y divide-stone-100">
                  
                  {/* User Profile Header (Exact match to screenshot) */}
                  <div className="px-4 py-3.5">
                    <div className="font-display font-bold text-sm text-[#111827] truncate">
                      {displayName || 'Ankush Amber'}
                    </div>
                    <div className="text-xs text-[#6B7280] font-mono mt-0.5">
                      {userPhone}
                    </div>
                  </div>

                  {/* Menu Options (Exact match to screenshot) */}
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

                    {/* Account Settings */}
                    <button
                      onClick={() => {
                        setShowSettingsMenu(false);
                        setEditProfileModal(true);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-semibold text-[#374151] hover:bg-pink-50/80 hover:text-[#FF2D55] transition text-left cursor-pointer"
                    >
                      <Settings className="w-4 h-4 text-[#6B7280]" />
                      <span>Account Settings</span>
                    </button>
                  </div>

                  {/* Logout (Red as in screenshot) */}
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
        
        {/* Profile Card (Refined Apple Glass Style) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-pink-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              <img
                src={userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                alt={userName}
                className="w-20 h-20 rounded-full object-cover ring-4 ring-pink-100 shadow-sm"
              />
              <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white" title="Active Online" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-display font-black text-[#111827]">
                  Welcome, {displayName || 'Ankush Amber'}!
                </h1>
                <ShieldCheck className="w-5 h-5 text-[#0071E3]" />
              </div>
              <p className="text-xs sm:text-sm text-[#6B7280] mt-1 font-medium">
                Active Member &bull; Phone: <span className="font-mono text-[#111827]">{userPhone}</span>
              </p>

              {/* Status Badges */}
              <div className="flex flex-wrap items-center gap-2 mt-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Face Verified</span>
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
            onClick={() => setEditProfileModal(true)}
            className="px-5 py-2.5 rounded-2xl bg-[#F4F4F6] hover:bg-pink-50 text-[#1d1d1f] hover:text-[#FF2D55] text-xs font-bold transition flex items-center gap-2 border border-stone-200 cursor-pointer shadow-xs"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit Profile</span>
          </button>
        </div>

        {/* 3. BESPOKE DUAL ACTION HUBS (Completely original redesign, not competitor's purple/orange) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* HUB 1: FIND A COMPANION (Obsidian Glass & Electric Crimson Palette) */}
          <div className="rounded-[2.2rem] p-7 sm:p-9 text-white bg-gradient-to-br from-[#1E1B2E] via-[#2A1828] to-[#1A0B1A] border border-white/10 shadow-[0_20px_50px_rgba(255,45,85,0.15)] flex flex-col justify-between relative overflow-hidden group">
            {/* Ambient Corner Glow */}
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

          {/* HUB 2: BECOME A COMPANION (Luminous Pearl & Emerald Gold Palette) */}
          <div className="rounded-[2.2rem] p-7 sm:p-9 text-[#1d1d1f] bg-gradient-to-br from-[#FFFFFF] via-[#FFF8F8] to-[#FFF1F3] border border-pink-200 shadow-[0_20px_50px_rgba(0,0,0,0.04)] flex flex-col justify-between relative overflow-hidden group">
            {/* Ambient Corner Glow */}
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
          
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

          {/* Card 2: Transactions & Billing */}
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

          {/* Card 3: Membership Status */}
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
        userName={userName}
      />

      {/* 2. TRANSACTIONS MODAL */}
      <TransactionsModal
        isOpen={transactionsModal}
        onClose={() => setTransactionsModal(false)}
        onBuyServices={onBuyServices}
        userName={userName}
      />

      {/* 3. 3-MONTH MEMBERSHIP PASS MODAL */}
      <ThreeMonthPassModal
        isOpen={threeMonthPassModal}
        onClose={() => setThreeMonthPassModal(false)}
        onFindCompanion={onBrowseCompanions}
        userName={displayName}
      />

      {/* ACCOUNT SETTINGS / EDIT PROFILE MODAL */}
      {editProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 border border-pink-200 shadow-apple-float">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-[#FF2D55]" />
                <h3 className="text-lg font-bold text-[#1d1d1f]">Account Settings</h3>
              </div>
              <button 
                onClick={() => setEditProfileModal(false)}
                className="text-xs font-bold text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#1d1d1f] mb-1">Display Name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full bg-[#fdf8f8] border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FF2D55]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1d1d1f] mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={userPhone}
                  onChange={(e) => setUserPhone(e.target.value)}
                  className="w-full bg-[#fdf8f8] border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FF2D55]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1d1d1f] mb-1">Profile Photo</label>
                <div className="flex items-center gap-3">
                  <img
                    src={userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                    alt="Preview"
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-pink-200"
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

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    localStorage.setItem('ck_user_name', displayName);
                    localStorage.setItem('ck_user_phone', userPhone);
                    setEditProfileModal(false);
                  }}
                  className="flex-1 bg-[#111827] hover:bg-[#FF2D55] text-white py-2.5 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setEditProfileModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-[#1d1d1f] text-xs font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
export default UserDashboard;
