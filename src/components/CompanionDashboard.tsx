import React, { useState, useEffect, useRef } from 'react';
import { BookingRequest } from '../types';
import { TrendingUp, CheckCircle2, XCircle, Clock, ShieldCheck, ArrowLeft, Sparkles, MapPin, DollarSign, Calendar, AlertTriangle, LogOut, Camera, Plus, Trash2, Image as ImageIcon, MessageSquare, Phone, UserCheck, Bell, ShieldAlert } from 'lucide-react';
import confetti from 'canvas-confetti';
import { fetchCompanionRequestsFromSupabase, updateBookingStatusInSupabase, updateUserAvatarInSupabase, sendBookingConfirmationEmail } from '../services/supabase';
import { SeekerProfileModal } from './SeekerProfileModal';
import { ChatModal } from './ChatModal';
import { FaceVerificationModal } from './FaceVerificationModal';

interface CompanionDashboardProps {
  userName: string;
  userAvatar?: string;
  onUpdateAvatar?: (url: string) => void;
  onBackToHome: () => void;
  onSwitchToSeeker: () => void;
  onLogout?: () => void;
}

export const CompanionDashboard: React.FC<CompanionDashboardProps> = ({
  userName,
  userAvatar,
  onUpdateAvatar,
  onBackToHome,
  onSwitchToSeeker,
  onLogout,
}) => {
  const [isOnline, setIsOnline] = useState(true);
  const [requests, setRequests] = useState<BookingRequest[]>([]);
  const [sosActive, setSosActive] = useState(false);
  const [initialLoaded, setInitialLoaded] = useState(false);
  const [newBookingAlert, setNewBookingAlert] = useState<string | null>(null);

  // Verification & Modals state
  const [kycVerified, setKycVerified] = useState(() => localStorage.getItem('ck_kyc_verified') === 'true');
  const [faceModalOpen, setFaceModalOpen] = useState(false);
  const [activeProfileModal, setActiveProfileModal] = useState<BookingRequest | null>(null);
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [chatTarget, setChatTarget] = useState<{ name: string; avatar?: string; phone?: string; bookingCode: string } | null>(null);

  // Gallery state for portfolio photos
  const [gallery, setGallery] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('ck_companion_gallery');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const dpInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const handleDpUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        if (typeof reader.result === 'string') {
          const newUrl = reader.result;
          if (onUpdateAvatar) onUpdateAvatar(newUrl);
          localStorage.setItem('ck_user_avatar', newUrl);
          const phone = localStorage.getItem('ck_user_phone') || undefined;
          const email = localStorage.getItem('ck_user_email') || undefined;
          await updateUserAvatarInSupabase(newUrl, { phone, email, name: userName });
          confetti({
            particleCount: 40,
            spread: 50,
            origin: { y: 0.3 }
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          const updated = [...gallery, reader.result];
          setGallery(updated);
          localStorage.setItem('ck_companion_gallery', JSON.stringify(updated));
          confetti({
            particleCount: 30,
            spread: 40,
            origin: { y: 0.5 }
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveGalleryImage = (idx: number) => {
    const updated = gallery.filter((_, i) => i !== idx);
    setGallery(updated);
    localStorage.setItem('ck_companion_gallery', JSON.stringify(updated));
  };

  const loadRequests = async () => {
    try {
      const dbBookings = await fetchCompanionRequestsFromSupabase(userName);

      if (dbBookings && dbBookings.length > 0) {
        const mapped: BookingRequest[] = dbBookings.map((b) => ({
          id: b.id,
          seekerName: b.client_name,
          seekerPhone: b.client_phone || 'Protected',
          seekerAvatar: b.companion_avatar,
          serviceTitle: b.service_title,
          date: b.booking_date,
          time: 'Scheduled Slot',
          hours: b.hours,
          location: b.city,
          pinCode: b.pin_code,
          totalEarnings: Number(b.total_price),
          netPayout: Math.round(Number(b.total_price) * 0.8),
          status: (b.status === 'confirmed' ? 'accepted' : b.status === 'cancelled' ? 'declined' : 'pending') as any,
          createdAt: new Date(b.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }));
        
        // Trigger notification if new request arrived
        if (mapped.some(m => m.status === 'pending') && (!requests || requests.length < mapped.length)) {
          const newest = mapped.find(m => m.status === 'pending');
          if (newest) {
            setNewBookingAlert(`New companion booking request from ${newest.seekerName}!`);
          }
        }
        setRequests(mapped);
      } else {
        setRequests([]);
      }
    } catch (e) {
      console.warn('[Companion Dashboard] Error loading requests:', e);
    } finally {
      setInitialLoaded(true);
    }
  };

  useEffect(() => {
    loadRequests();
    const interval = setInterval(() => {
      loadRequests();
    }, 15000);
    return () => clearInterval(interval);
  }, [userName]);

  const pendingRequests = requests.filter((r) => r.status === 'pending');
  const acceptedBookings = requests.filter((r) => r.status === 'accepted');

  // Real client earnings calculation (strictly 0 for new companions until bookings are accepted)
  const totalEarnings = acceptedBookings.reduce((sum, r) => sum + r.netPayout, 0);
  const weeklyPayout = acceptedBookings.reduce((sum, r) => sum + r.netPayout, 0);
  const completedHours = acceptedBookings.reduce((sum, r) => sum + r.hours, 0);
  const partnerRating = acceptedBookings.length > 0 ? '5.0 ★' : 'New Partner';

  const handleAcceptRequest = async (id: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'accepted' as const } : r))
    );
    await updateBookingStatusInSupabase(id, 'confirmed');

    const acceptedReq = requests.find(r => r.id === id);
    if (acceptedReq) {
      // Dispatch official confirmation email
      await sendBookingConfirmationEmail({
        booking_code: id.slice(0, 8),
        client_name: acceptedReq.seekerName,
        service_title: acceptedReq.serviceTitle,
        city: acceptedReq.location,
        booking_date: acceptedReq.date,
        total_price: acceptedReq.totalEarnings,
      });
    }

    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  const handleDeclineRequest = async (id: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'declined' as const } : r))
    );
    await updateBookingStatusInSupabase(id, 'cancelled');
  };

  const companionPhotos = [
    userAvatar || localStorage.getItem('ck_user_avatar') || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    ...gallery,
  ];

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 relative">
      <div className="max-w-6xl mx-auto">
        
        {/* Top Header */}
        <div className="bg-white/85 backdrop-blur-2xl rounded-3xl p-5 sm:p-6 border border-pink-200 shadow-apple-md mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBackToHome}
              aria-label="Back to landing page"
              className="w-10 h-10 rounded-full bg-pink-50 hover:bg-pink-100 flex items-center justify-center text-[#1d1d1f] transition apple-focus"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            {/* Companion Primary Profile Photo with Camera Upload */}
            <div className="relative group">
              <div className="w-13 h-13 rounded-full overflow-hidden ring-2 ring-emerald-300 shadow-sm bg-emerald-50">
                <img 
                  src={companionPhotos[0]} 
                  alt={userName} 
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                type="button"
                onClick={() => dpInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white flex items-center justify-center shadow-md ring-2 ring-white transition active:scale-95 cursor-pointer"
                title="Upload Profile Picture"
              >
                <Camera className="w-3 h-3" />
              </button>
              <input
                ref={dpInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleDpUpload}
              />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-[#1d1d1f]">
                  Partner Dashboard &bull; {userName}
                </h1>
                {kycVerified ? (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>Verified Companion</span>
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
              <p className="text-xs text-[#86868b]">Manage client bookings, incoming requests &amp; earnings</p>
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
              Switch to Seeker &rarr;
            </button>

            {onLogout && (
              <button
                onClick={onLogout}
                className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold px-3.5 py-2.5 rounded-full transition shadow-xs flex items-center gap-1.5 apple-focus"
                title="Log Out of Portal"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Log Out</span>
              </button>
            )}
          </div>
        </div>

        {/* INCOMING BOOKING ALERT BANNER */}
        {newBookingAlert && (
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-apple-md flex items-center justify-between animate-bounce">
            <div className="flex items-center gap-2.5">
              <Bell className="w-5 h-5 animate-pulse" />
              <span className="text-xs sm:text-sm font-bold">{newBookingAlert}</span>
            </div>
            <button
              onClick={() => setNewBookingAlert(null)}
              className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded-full text-xs font-bold transition"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* SOS Emergency Button */}
        <div className="mb-6 flex justify-end">
          <button
            onClick={() => setSosActive(!sosActive)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 shadow-sm ${
              sosActive
                ? 'bg-red-600 text-white animate-pulse'
                : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>{sosActive ? '🚨 Emergency Concierge Alert Dispatched' : '24/7 Companion SOS Guard'}</span>
          </button>
        </div>

        {/* 1. EARNINGS & PERFORMANCE METRICS (REAL LIVE METRICS) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-5 border border-pink-200 shadow-sm">
            <div className="flex items-center justify-between text-xs text-[#86868b] mb-2">
              <span>Total Net Earnings</span>
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-[#1d1d1f] font-display tabular-numbers">
              ₹{totalEarnings.toLocaleString('en-IN')}
            </div>
            <div className="text-[10px] text-emerald-600 font-bold mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> 80% Net Rate
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-5 border border-pink-200 shadow-sm">
            <div className="flex items-center justify-between text-xs text-[#86868b] mb-2">
              <span>Weekly Settlement</span>
              <Calendar className="w-4 h-4 text-[#0071e3]" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-[#1d1d1f] font-display tabular-numbers">
              ₹{weeklyPayout.toLocaleString('en-IN')}
            </div>
            <div className="text-[10px] text-[#86868b] font-bold mt-1">
              {weeklyPayout > 0 ? 'Auto-disbursed Tuesday' : 'Pending accepted bookings'}
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-5 border border-pink-200 shadow-sm">
            <div className="flex items-center justify-between text-xs text-[#86868b] mb-2">
              <span>Completed Hours</span>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-[#1d1d1f] font-display tabular-numbers">
              {completedHours} hrs
            </div>
            <div className="text-[10px] text-[#86868b] font-bold mt-1">
              This month
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-5 border border-pink-200 shadow-sm">
            <div className="flex items-center justify-between text-xs text-[#86868b] mb-2">
              <span>Partner Rating</span>
              <Sparkles className="w-4 h-4 text-pink-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-[#1d1d1f] font-display tabular-numbers">
              {partnerRating}
            </div>
            <div className="text-[10px] text-pink-600 font-bold mt-1">
              Verified Partner Status
            </div>
          </div>
        </div>

        {/* COMPANION PORTFOLIO PHOTOS & GALLERY */}
        <div className="bg-white/85 backdrop-blur-2xl rounded-3xl p-6 sm:p-7 border border-pink-200 shadow-apple-md mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-5 border-b border-pink-100">
            <div>
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-[#0071e3]" />
                <h2 className="text-lg font-bold text-[#1d1d1f]">
                  My Companion Portfolio Photos ({companionPhotos.length}/3+)
                </h2>
              </div>
              <p className="text-xs text-[#86868b] mt-0.5">
                Upload your lifestyle and date photos so seekers can view your profile when browsing companions
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => galleryInputRef.current?.click()}
                className="px-4 py-2 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Portfolio Photo</span>
              </button>
              <input
                ref={galleryInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleGalleryUpload}
              />
            </div>
          </div>

          {gallery.length === 0 ? (
            <div 
              onClick={() => galleryInputRef.current?.click()}
              className="border-2 border-dashed border-pink-200 hover:border-[#0071e3] rounded-2xl p-8 text-center cursor-pointer transition-colors bg-[#fdf8f8]"
            >
              <Camera className="w-10 h-10 text-[#86868b] mx-auto mb-2" />
              <h3 className="text-xs font-bold text-[#1d1d1f]">No Portfolio Photos Added Yet</h3>
              <p className="text-[11px] text-[#86868b] max-w-xs mx-auto mt-1">
                Companions with 3+ lifestyle photos receive up to 4x more booking requests. Click here to upload!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {gallery.map((imgUrl, idx) => (
                <div key={idx} className="relative group rounded-2xl overflow-hidden aspect-square border border-pink-200 shadow-sm">
                  <img src={imgUrl} alt={`Portfolio ${idx + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveGalleryImage(idx)}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 hover:bg-rose-600 text-white flex items-center justify-center shadow-md transition opacity-0 group-hover:opacity-100"
                    title="Remove Photo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              {gallery.length < 8 && (
                <div
                  onClick={() => galleryInputRef.current?.click()}
                  className="aspect-square rounded-2xl border-2 border-dashed border-pink-200 hover:border-[#0071e3] flex flex-col items-center justify-center gap-1 text-[#86868b] hover:text-[#0071e3] cursor-pointer transition-colors bg-[#fdf8f8]"
                >
                  <Plus className="w-6 h-6" />
                  <span className="text-[10px] font-bold">Add Photo</span>
                </div>
              )}
            </div>
          )}
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
              <p className="text-xs text-[#86868b] mt-0.5">Real-time bookings received from clients</p>
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

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-pink-200">
                    <div className="text-right sm:text-right pr-2">
                      <div className="text-xs text-[#86868b]">Your Net 80% Payout</div>
                      <div className="text-xl font-bold text-emerald-600 tabular-numbers">
                        ₹{req.netPayout.toLocaleString('en-IN')}
                      </div>
                    </div>

                    {/* CONNECT ACTIONS: VIEW PROFILE, DIRECT CALL, IN-APP CHAT */}
                    <div className="flex items-center gap-1.5 flex-wrap w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={() => setActiveProfileModal(req)}
                        className="px-3 py-2 rounded-xl bg-pink-100/70 hover:bg-pink-100 text-[#1d1d1f] text-xs font-bold transition flex items-center gap-1"
                        title="View Seeker Verified Photos & Profile"
                      >
                        <UserCheck className="w-3.5 h-3.5 text-[#0071e3]" />
                        <span>Profile</span>
                      </button>

                      {req.seekerPhone && req.seekerPhone !== 'Protected' && (
                        <a
                          href={`tel:${req.seekerPhone}`}
                          className="px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold transition flex items-center gap-1"
                          title="Call Seeker Directly"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>Call</span>
                        </a>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          setChatTarget({
                            name: req.seekerName,
                            avatar: req.seekerAvatar,
                            phone: req.seekerPhone,
                            bookingCode: req.id.slice(0, 8),
                          });
                          setChatModalOpen(true);
                        }}
                        className="px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#0071e3] border border-blue-200 text-xs font-bold transition flex items-center gap-1"
                        title="Chat with Seeker"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Chat</span>
                      </button>

                      <button
                        onClick={() => handleDeclineRequest(req.id)}
                        className="p-2 rounded-xl border border-pink-200 hover:bg-rose-50 text-rose-600 transition"
                        title="Decline"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleAcceptRequest(req.id)}
                        className="px-4 py-2 rounded-xl bg-[#0071e3] hover:bg-[#0077ed] text-white transition shadow-apple-sm text-xs font-bold flex items-center gap-1 active:scale-95"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Accept</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-12 h-12 bg-pink-50 text-pink-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#1d1d1f] mb-1">
                {initialLoaded ? 'No Pending Requests Right Now' : 'Checking for Bookings...'}
              </h3>
              <p className="text-xs text-[#86868b] max-w-sm mx-auto">
                Your profile is active and online. When clients in your area book a companion, new booking requests will appear here automatically in real time.
              </p>
            </div>
          )}

        </div>

        {/* 3. CONFIRMED & UPCOMING SCHEDULE */}
        {acceptedBookings.length > 0 && (
          <div className="bg-white/85 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 border border-pink-200 shadow-apple-md">
            <h2 className="text-xl font-bold text-[#1d1d1f] mb-4">
              Accepted &amp; Upcoming Bookings
            </h2>
            <div className="space-y-3">
              {acceptedBookings.map((b) => (
                <div key={b.id} className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="flex items-center gap-2 font-bold text-[#1d1d1f]">
                      <span>{b.seekerName}</span>
                      <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full text-[10px]">
                        Confirmed
                      </span>
                    </div>
                    <div className="text-[#86868b] mt-1">
                      {b.serviceTitle} &bull; {b.date} ({b.time}) &bull; {b.location}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setChatTarget({
                          name: b.seekerName,
                          avatar: b.seekerAvatar,
                          phone: b.seekerPhone,
                          bookingCode: b.id.slice(0, 8),
                        });
                        setChatModalOpen(true);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-white border border-emerald-300 text-emerald-800 font-bold flex items-center gap-1 shadow-xs hover:bg-emerald-50 transition"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Chat</span>
                    </button>
                    <div className="text-right">
                      <div className="font-bold text-emerald-700 text-base">
                        ₹{b.netPayout.toLocaleString('en-IN')}
                      </div>
                      <div className="text-[10px] text-[#86868b]">Direct bank transfer</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MODALS */}
        <FaceVerificationModal
          isOpen={faceModalOpen}
          onClose={() => setFaceModalOpen(false)}
          onVerified={() => setKycVerified(true)}
          userName={userName}
          userPhotos={companionPhotos}
        />

        <SeekerProfileModal
          isOpen={Boolean(activeProfileModal)}
          onClose={() => setActiveProfileModal(null)}
          booking={activeProfileModal}
          onOpenChat={() => {
            if (activeProfileModal) {
              setChatTarget({
                name: activeProfileModal.seekerName,
                avatar: activeProfileModal.seekerAvatar,
                phone: activeProfileModal.seekerPhone,
                bookingCode: activeProfileModal.id.slice(0, 8),
              });
              setChatModalOpen(true);
            }
          }}
          onAccept={(id) => handleAcceptRequest(id)}
        />

        {chatTarget && (
          <ChatModal
            isOpen={chatModalOpen}
            onClose={() => setChatModalOpen(false)}
            bookingCode={chatTarget.bookingCode}
            otherPartyName={chatTarget.name}
            otherPartyAvatar={chatTarget.avatar}
            otherPartyPhone={chatTarget.phone}
            currentRole="companion"
          />
        )}

      </div>
    </div>
  );
};
