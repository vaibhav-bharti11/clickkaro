import React, { useState } from 'react';
import { INITIAL_BOOKING_REQUESTS } from '../data/mockProfiles';
import { BookingRequest } from '../types';
import { TrendingUp, CheckCircle2, XCircle, Clock, ShieldCheck, ArrowLeft, Sparkles, MapPin, DollarSign, Calendar, AlertTriangle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CompanionDashboardProps {
  userName: string;
  onBackToHome: () => void;
  onSwitchToSeeker: () => void;
}

export const CompanionDashboard: React.FC<CompanionDashboardProps> = ({
  userName,
  onBackToHome,
  onSwitchToSeeker,
}) => {
  const [isOnline, setIsOnline] = useState(true);
  const [requests, setRequests] = useState<BookingRequest[]>(INITIAL_BOOKING_REQUESTS);
  const [sosActive, setSosActive] = useState(false);

  const pendingRequests = requests.filter((r) => r.status === 'pending');
  const acceptedBookings = requests.filter((r) => r.status === 'accepted');

  const totalEarnings = 48200;
  const weeklyPayout = 12800;
  const completedHours = 24.5;
  const partnerRating = 4.98;

  const handleAcceptRequest = (id: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'accepted' as const } : r))
    );
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  const handleDeclineRequest = (id: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'declined' as const } : r))
    );
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 relative">
      <div className="max-w-6xl mx-auto">
        
        {/* Top Header */}
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
                  Partner Dashboard &bull; {userName}
                </h1>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  80% Payout Active
                </span>
              </div>
              <p className="text-xs text-[#86868b]">Manage client bookings, incoming requests &amp; bank settlements</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Online / Offline Toggle */}
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-pink-200 shadow-sm">
              <span className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-emerald-500 animate-ping' : 'bg-stone-400'}`}></span>
              <span className="text-xs font-bold text-[#1d1d1f]">{isOnline ? 'Available Online' : 'Offline'}</span>
              <button
                onClick={() => setIsOnline(!isOnline)}
                className={`ml-2 w-10 h-5 rounded-full transition-colors relative apple-focus ${
                  isOnline ? 'bg-emerald-500' : 'bg-stone-300'
                }`}
              >
                <span className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform ${
                  isOnline ? 'right-0.5' : 'left-0.5'
                }`} />
              </button>
            </div>

            <button
              onClick={onSwitchToSeeker}
              className="bg-[#1d1d1f] hover:bg-[#0071e3] text-white text-xs font-bold px-4 py-2.5 rounded-full transition shadow-sm apple-focus"
            >
              Switch to Seeker Portal &rarr;
            </button>
          </div>
        </div>

        {/* 1. FINANCIAL & EARNINGS METRICS GRID */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          
          {/* Total Net Earnings */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-pink-200/80 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <span className="text-xs font-bold text-[#86868b] uppercase tracking-wider">Total Net (80%)</span>
              <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl sm:text-4xl font-bold text-[#1d1d1f] mb-1 tabular-numbers">
              ₹{totalEarnings.toLocaleString('en-IN')}
            </div>
            <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Direct Net Take-Home
            </p>
          </div>

          {/* Weekly Payout Scheduled */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-pink-200/80 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <span className="text-xs font-bold text-[#86868b] uppercase tracking-wider">Weekly Settlement</span>
              <div className="w-8 h-8 rounded-full bg-blue-50 text-[#0071e3] flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl sm:text-4xl font-bold text-[#0071e3] mb-1 tabular-numbers">
              ₹{weeklyPayout.toLocaleString('en-IN')}
            </div>
            <p className="text-[11px] text-[#86868b]">
              Bank Transfer on Friday
            </p>
          </div>

          {/* Completed Hours */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-pink-200/80 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <span className="text-xs font-bold text-[#86868b] uppercase tracking-wider">Session Hours</span>
              <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl sm:text-4xl font-bold text-[#1d1d1f] mb-1 tabular-numbers">
              {completedHours} hrs
            </div>
            <p className="text-[11px] text-[#86868b]">
              12 Completed Meetups
            </p>
          </div>

          {/* Partner Rating & Membership */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-pink-200/80 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <span className="text-xs font-bold text-[#86868b] uppercase tracking-wider">Rating &amp; Pass</span>
              <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl sm:text-4xl font-bold text-amber-500 mb-1 tabular-numbers">
              {partnerRating} ★
            </div>
            <p className="text-[11px] text-pink-700 font-semibold">
              1 Year Launch Pass Active
            </p>
          </div>

        </div>

        {/* 2. INCOMING SEEKER REQUESTS (MAIN WORKFLOW) */}
        <div className="bg-white/85 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 border border-pink-200 shadow-apple-lg mb-8">
          
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-pink-100">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-[#1d1d1f]">
                  Incoming Seeker Requests
                </h2>
                <span className="text-xs font-bold text-pink-700 bg-pink-100 px-2.5 py-0.5 rounded-full tabular-numbers">
                  {pendingRequests.length} Pending
                </span>
              </div>
              <p className="text-xs text-[#86868b] mt-0.5">Review booking details and accept to coordinate with the client</p>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#0071e3] font-bold bg-blue-50 px-3 py-1 rounded-full">
              <ShieldCheck className="w-4 h-4" /> 100% Aadhaar Verified Seekers
            </div>
          </div>

          {pendingRequests.length > 0 ? (
            <div className="space-y-4">
              {pendingRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-[#fdf8f8] rounded-2xl p-5 border border-pink-200/80 shadow-sm hover:border-pink-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-bold text-[#1d1d1f]">{req.seekerName}</span>
                      <span className="text-xs text-[#86868b]">&bull; {req.seekerPhone}</span>
                      <span className="text-[10px] font-bold text-[#0071e3] bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                        {req.createdAt}
                      </span>
                    </div>

                    <div className="text-xs font-bold text-pink-700 flex items-center gap-1">
                      {req.serviceTitle}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-[#86868b]">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#0071e3]" /> {req.date} &bull; {req.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-pink-500" /> {req.location} ({req.pinCode})
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-3 md:pt-0 border-t md:border-t-0 border-pink-200">
                    <div className="text-right sm:text-right">
                      <div className="text-xs text-[#86868b]">Your Net 80% Payout</div>
                      <div className="text-xl font-bold text-emerald-600 tabular-numbers">
                        ₹{req.netPayout.toLocaleString('en-IN')}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => handleAcceptRequest(req.id)}
                        className="flex-1 sm:flex-initial bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-bold px-5 py-2.5 rounded-full transition shadow-sm flex items-center justify-center gap-1.5 apple-focus active:scale-95"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Accept</span>
                      </button>

                      <button
                        onClick={() => handleDeclineRequest(req.id)}
                        className="bg-white hover:bg-stone-100 text-stone-700 text-xs font-bold px-4 py-2.5 rounded-full border border-pink-200 transition apple-focus"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-[#fdf8f8] rounded-2xl border border-pink-100">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              <p className="text-sm font-bold text-[#1d1d1f]">All caught up!</p>
              <p className="text-xs text-[#86868b]">New seeker bookings will appear here instantly with live sound notifications.</p>
            </div>
          )}

        </div>

        {/* 3. ACCEPTED & SCHEDULED BOOKINGS */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-pink-200/80 shadow-sm mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-[#1d1d1f]">
              Confirmed Active Meetups ({acceptedBookings.length})
            </h3>
            
            {/* SOS Safety Button */}
            <button
              onClick={() => setSosActive(!sosActive)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1.5 apple-focus ${
                sosActive ? 'bg-red-600 text-white animate-pulse' : 'bg-red-50 text-red-700 border border-red-200'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{sosActive ? '24/7 SOS Alert Triggered!' : 'Emergency In-App SOS'}</span>
            </button>
          </div>

          <div className="space-y-3">
            {acceptedBookings.map((b) => (
              <div key={b.id} className="bg-white p-4 rounded-2xl border border-pink-100 flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-bold text-[#1d1d1f] flex items-center gap-2">
                    <span>{b.seekerName}</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.2 rounded-full font-bold">Confirmed</span>
                  </div>
                  <div className="text-xs text-pink-700 font-semibold mt-0.5">{b.serviceTitle}</div>
                  <div className="text-[11px] text-[#86868b]">{b.date} &bull; {b.location}</div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-bold text-emerald-600 tabular-numbers">₹{b.netPayout}</div>
                  <div className="text-[10px] text-[#86868b]">Settlement Ready</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
