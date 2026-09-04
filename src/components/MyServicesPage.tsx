import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft, 
  Plus, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Bell, 
  Settings, 
  LayoutDashboard,
  Calendar,
  ShoppingBag,
  Receipt,
  LogOut
} from 'lucide-react';
import { ServiceCredit } from '../types';
import { MyBookingsModal } from './MyBookingsModal';
import { TransactionsModal } from './TransactionsModal';

interface MyServicesPageProps {
  onBackToDashboard: () => void;
  onOpenBuyModal: () => void;
  onBookWithCredit: (credit: ServiceCredit) => void;
  userName?: string;
  userAvatar?: string;
  onLogout?: () => void;
  availableCredits?: ServiceCredit[];
  usedCredits?: ServiceCredit[];
}

export const MyServicesPage: React.FC<MyServicesPageProps> = ({
  onBackToDashboard,
  onOpenBuyModal,
  onBookWithCredit,
  userName = 'Member',
  userAvatar,
  onLogout,
  availableCredits = [],
  usedCredits = [],
}) => {
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [bookingsModal, setBookingsModal] = useState(false);
  const [transactionsModal, setTransactionsModal] = useState(false);
  const settingsMenuRef = useRef<HTMLDivElement>(null);
  const userPhone = localStorage.getItem('ck_user_phone') || '9719333339';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (settingsMenuRef.current && !settingsMenuRef.current.contains(event.target as Node)) {
        setShowSettingsMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF8F8] text-[#1d1d1f] font-sans pb-20">
      
      {/* 1. TOP NAV BAR */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-2xl border-b border-pink-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          
          <div className="flex items-center gap-4 sm:gap-6">
            <button
              onClick={onBackToDashboard}
              className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#1d1d1f] hover:text-[#FF2D55] transition apple-focus cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            {/* Official Click Karo Date Karo Company Logo */}
            <div 
              onClick={onBackToDashboard}
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

          <nav className="hidden md:flex items-center gap-8 text-xs sm:text-sm font-bold text-[#1d1d1f]/75">
            <button onClick={onBackToDashboard} className="hover:text-[#FF2D55] transition">Services</button>
            <button onClick={onBackToDashboard} className="hover:text-[#FF2D55] transition">Why Choose Us</button>
            <button onClick={onBackToDashboard} className="hover:text-[#FF2D55] transition">Pricing</button>
          </nav>

          <div className="flex items-center gap-3 sm:gap-4">
            <div className="relative">
              <button className="w-10 h-10 rounded-full hover:bg-pink-50 flex items-center justify-center text-[#1d1d1f]">
                <Bell className="w-5 h-5 text-[#4B5563]" />
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#FF2D55] text-white text-[10px] font-bold flex items-center justify-center">
                  5
                </span>
              </button>
            </div>

            {/* Settings Menu Dropdown */}
            <div className="relative" ref={settingsMenuRef}>
              <button
                onClick={() => setShowSettingsMenu(!showSettingsMenu)}
                className="flex items-center gap-2 p-1.5 pl-2 pr-3 rounded-full bg-white border border-pink-200/80 hover:border-[#FF2D55]/50 shadow-xs transition-all cursor-pointer group"
              >
                <img
                  src={userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                  alt={userName}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-pink-100 group-hover:ring-[#FF2D55]/30 transition"
                />
                <Settings className="w-4 h-4 text-[#4B5563] group-hover:rotate-45 transition-transform duration-300" />
              </button>

              {/* Settings Dropdown Popover */}
              {showSettingsMenu && (
                <div className="absolute right-0 mt-3 w-64 bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.12)] border border-stone-200/80 p-2 z-50 animate-fade-in divide-y divide-stone-100">
                  <div className="px-4 py-3.5">
                    <div className="font-display font-bold text-sm text-[#111827] truncate">
                      {userName}
                    </div>
                    <div className="text-xs text-[#6B7280] font-mono mt-0.5">
                      {userPhone}
                    </div>
                  </div>

                  <div className="py-2 space-y-0.5">
                    <button
                      onClick={() => {
                        setShowSettingsMenu(false);
                        onBackToDashboard();
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-semibold text-[#374151] hover:bg-pink-50/80 hover:text-[#FF2D55] transition text-left cursor-pointer"
                    >
                      <LayoutDashboard className="w-4 h-4 text-[#6B7280]" />
                      <span>Dashboard</span>
                    </button>

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

                    <button
                      onClick={() => {
                        setShowSettingsMenu(false);
                        onOpenBuyModal();
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-semibold text-[#374151] hover:bg-pink-50/80 hover:text-[#FF2D55] transition text-left cursor-pointer"
                    >
                      <ShoppingBag className="w-4 h-4 text-[#6B7280]" />
                      <span>Buy Services</span>
                    </button>

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

                    <button
                      onClick={() => {
                        setShowSettingsMenu(false);
                        onBackToDashboard();
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-semibold text-[#374151] hover:bg-pink-50/80 hover:text-[#FF2D55] transition text-left cursor-pointer"
                    >
                      <Settings className="w-4 h-4 text-[#6B7280]" />
                      <span>Account Settings</span>
                    </button>
                  </div>

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

      {/* 2. BODY CONTENT */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 space-y-8">
        
        {/* Title and Buy Services Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-black text-[#111827]">
              My Services
            </h1>
            <p className="text-xs sm:text-sm text-[#6B7280] mt-1 font-medium">
              Purchased service credits available for booking verified Companions
            </p>
          </div>

          <button
            onClick={onOpenBuyModal}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#FF2D55] to-[#E11D48] hover:opacity-95 text-white font-bold text-xs sm:text-sm transition shadow-md shadow-pink-500/25 flex items-center gap-2 cursor-pointer active:scale-95 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Buy Services</span>
          </button>
        </div>

        {/* SECTION 1: AVAILABLE CREDITS */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-amber-700 font-bold text-xs sm:text-sm">
            <Clock className="w-4 h-4" />
            <span>Available Credits ({availableCredits.length})</span>
          </div>

          {availableCredits.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 border border-dashed border-stone-300 text-center space-y-3">
              <p className="text-xs sm:text-sm text-stone-500">
                You currently have no available service credits.
              </p>
              <button
                onClick={onOpenBuyModal}
                className="px-5 py-2.5 rounded-2xl bg-[#FF2D55] text-white text-xs font-bold transition shadow-xs hover:bg-[#E11D48] cursor-pointer"
              >
                + Buy Services Now
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {availableCredits.map((credit) => (
                <div
                  key={credit.id}
                  className="bg-white rounded-3xl p-5 sm:p-6 border border-emerald-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-[#111827] capitalize">
                      {credit.displayTitle || credit.serviceName}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#6B7280] mt-0.5">
                      {credit.price} &bull; {credit.purchasedDate}
                    </p>
                  </div>

                  <button
                    onClick={() => onBookWithCredit(credit)}
                    className="px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm transition shadow-sm flex items-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <span>Book Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SECTION 2: USED CREDITS */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs sm:text-sm">
            <CheckCircle2 className="w-4 h-4" />
            <span>Used Credits ({usedCredits.length})</span>
          </div>

          <div className="space-y-3">
            {usedCredits.map((credit) => (
              <div
                key={credit.id}
                onClick={() => setBookingsModal(true)}
                className="bg-[#f9fafb] hover:bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 hover:border-pink-300 shadow-xs flex items-center justify-between gap-4 cursor-pointer transition"
                title="Click to view full booking details"
              >
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-[#374151]">
                    {credit.displayTitle || credit.serviceName}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#9CA3AF] mt-0.5">
                    {credit.price} &bull; Used {credit.bookedCompanion ? `with ${credit.bookedCompanion}` : ''} &bull; {credit.bookingCode || 'Booking: Confirmed'}
                  </p>
                </div>

                <span className="px-4 py-1.5 rounded-xl bg-stone-200 text-[#4B5563] text-xs font-bold">
                  View Booking
                </span>
              </div>
            ))}
          </div>
        </div>

      </main>

      {/* 1. MY BOOKINGS MODAL */}
      <MyBookingsModal
        isOpen={bookingsModal}
        onClose={() => setBookingsModal(false)}
        usedCredits={usedCredits}
        userName={userName}
      />

      {/* 2. TRANSACTIONS MODAL */}
      <TransactionsModal
        isOpen={transactionsModal}
        onClose={() => setTransactionsModal(false)}
        onBuyServices={onOpenBuyModal}
        availableCredits={availableCredits}
        userName={userName}
      />

    </div>
  );
};
export default MyServicesPage;
