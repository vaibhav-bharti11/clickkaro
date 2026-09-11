import React, { useState, useEffect, useRef } from 'react';
import { BookingRequest, CompanionProfile } from '../types';
import { TrendingUp, CheckCircle2, XCircle, Clock, ShieldCheck, ArrowLeft, Sparkles, MapPin, DollarSign, Calendar, AlertTriangle, LogOut, Camera, Plus, Trash2, Image as ImageIcon, UserCheck, Bell, ShieldAlert, Mail, KeyRound, Lock, Eye, Edit3, Play } from 'lucide-react';
import confetti from 'canvas-confetti';
import { fetchCompanionRequestsFromSupabase, updateBookingStatusInSupabase, updateUserAvatarInSupabase, sendBookingConfirmationEmail, verifyCompletionOtpAndReleasePayout, updateCompanionProfileInSupabase, verifyStartDateOtpAndSetCompanionOffline, checkAndRestoreCompanionOnlineStatus } from '../services/supabase';
import { SeekerProfileModal } from './SeekerProfileModal';
import { FaceVerificationModal } from './FaceVerificationModal';
import { CompanionProfileView } from './CompanionProfileView';

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
  const [acceptedEmailSent, setAcceptedEmailSent] = useState<{ seekerName: string; email: string; phone: string; bookingCode: string } | null>(null);

  // Verification & Modals state
  const [kycVerified, setKycVerified] = useState(() => localStorage.getItem('ck_kyc_verified') === 'true');
  const [faceModalOpen, setFaceModalOpen] = useState(false);
  const [activeProfileModal, setActiveProfileModal] = useState<BookingRequest | null>(null);

  // Profile Customization State (matching reference design)
  const [customBio, setCustomBio] = useState(() => {
    try {
      const saved = localStorage.getItem(`ck_companion_custom_profile_${userName}`) || localStorage.getItem('ck_companion_profile_custom');
      if (saved) return JSON.parse(saved).bio || '';
      return 'Easygoing, ambitious, and always up for meaningful conversations. I value honesty, kindness, and mutual respect. Looking to connect with someone who enjoys good company, laughter, and building something real together.';
    } catch {
      return 'Easygoing, ambitious, and always up for meaningful conversations. I value honesty, kindness, and mutual respect. Looking to connect with someone who enjoys good company, laughter, and building something real together.';
    }
  });

  const [customCity, setCustomCity] = useState(() => {
    try {
      const saved = localStorage.getItem(`ck_companion_custom_profile_${userName}`) || localStorage.getItem('ck_companion_profile_custom');
      if (saved && JSON.parse(saved).city) return JSON.parse(saved).city;
      return localStorage.getItem('ck_user_city') || 'Mumbai';
    } catch {
      return 'Mumbai';
    }
  });

  const [customPinCode, setCustomPinCode] = useState(() => {
    try {
      const saved = localStorage.getItem(`ck_companion_custom_profile_${userName}`) || localStorage.getItem('ck_companion_profile_custom');
      if (saved && JSON.parse(saved).pinCode) return JSON.parse(saved).pinCode;
      return localStorage.getItem('ck_user_pincode') || '400050';
    } catch {
      return '400050';
    }
  });

  const [customHourlyRate] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(`ck_companion_custom_profile_${userName}`) || localStorage.getItem('ck_companion_profile_custom');
      if (saved && JSON.parse(saved).hourlyRate) return Number(JSON.parse(saved).hourlyRate);
      return 1999;
    } catch {
      return 1999;
    }
  });

  const [customHobbies, setCustomHobbies] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(`ck_companion_custom_profile_${userName}`) || localStorage.getItem('ck_companion_profile_custom');
      if (saved && JSON.parse(saved).hobbies) return JSON.parse(saved).hobbies;
      return ['Book reading', 'Shopping', 'Movies', 'Pottery'];
    } catch {
      return ['Book reading', 'Shopping', 'Movies', 'Pottery'];
    }
  });

  const [customServices, setCustomServices] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(`ck_companion_custom_profile_${userName}`) || localStorage.getItem('ck_companion_profile_custom');
      if (saved && JSON.parse(saved).services) {
        const raw: string[] = JSON.parse(saved).services;
        const filtered = raw.filter(
          (s) => !['medical support', 'elder care', 'general consultation', 'shopping buddy', 'in person meeting', 'movie companion', 'hangingout'].includes(s.toLowerCase().trim())
        );
        if (filtered.length > 0) return filtered;
      }
      return [
        'Hangout',
        'Movie Partner',
        'Clubbing',
        'Lunch/Dinner',
        'Travel Partner',
        'Coffee Partner',
      ];
    } catch {
      return [
        'Hangout',
        'Movie Partner',
        'Clubbing',
        'Lunch/Dinner',
        'Travel Partner',
        'Coffee Partner',
      ];
    }
  });

  const [customAvailability, setCustomAvailability] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem(`ck_companion_custom_profile_${userName}`) || localStorage.getItem('ck_companion_profile_custom');
      if (saved && JSON.parse(saved).availability) return JSON.parse(saved).availability;
      return {
        Mon: '11:00 – 23:00',
        Tue: '11:00 – 23:00',
        Wed: '11:00 – 23:00',
        Thu: '11:00 – 23:00',
        Fri: '11:00 – 23:00',
        Sat: '11:00 – 23:00',
        Sun: '11:00 – 23:00',
      };
    } catch {
      return {
        Mon: '11:00 – 23:00',
        Tue: '11:00 – 23:00',
        Wed: '11:00 – 23:00',
        Thu: '11:00 – 23:00',
        Fri: '11:00 – 23:00',
        Sat: '11:00 – 23:00',
        Sun: '11:00 – 23:00',
      };
    }
  });

  const [coverGradient, setCoverGradient] = useState(() => {
    try {
      const saved = localStorage.getItem(`ck_companion_custom_profile_${userName}`) || localStorage.getItem('ck_companion_profile_custom');
      if (saved && JSON.parse(saved).coverGradient) return JSON.parse(saved).coverGradient;
      return 'bg-gradient-to-r from-[#9333EA] via-[#D946EF] to-[#EC4899]';
    } catch {
      return 'bg-gradient-to-r from-[#9333EA] via-[#D946EF] to-[#EC4899]';
    }
  });

  const [previewProfileOpen, setPreviewProfileOpen] = useState(false);
  const [newHobbyInput, setNewHobbyInput] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);

  // OTP Verification Modal state for completing outings & releasing escrow funds
  const [otpModalBooking, setOtpModalBooking] = useState<BookingRequest | null>(null);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpError, setOtpError] = useState<string | null>(null);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  // Start Date OTP Modal state (giving seeker OTP to companion at start, setting companion offline)
  const [startDateModalBooking, setStartDateModalBooking] = useState<BookingRequest | null>(null);
  const [enteredStartOtp, setEnteredStartOtp] = useState('');
  const [startOtpError, setStartOtpError] = useState<string | null>(null);
  const [isVerifyingStartOtp, setIsVerifyingStartOtp] = useState(false);
  const [dateCountdownMsg, setDateCountdownMsg] = useState<string | null>(null);

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
          status: (b.status === 'completed'
            ? 'completed'
            : b.status === 'in_progress'
            ? 'in_progress'
            : (b.status === 'confirmed' || b.status === 'ongoing')
            ? 'ongoing'
            : b.status === 'cancelled'
            ? 'declined'
            : 'pending') as any,
          startDateOtp: b.start_date_otp || b.metadata?.start_date_otp,
          completionOtp: b.completion_otp,
          payoutReleased: b.payout_released,
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

    // Live monitor for companion offline status during active date
    const statusCheckInterval = setInterval(async () => {
      if (!userName) return;
      const status = await checkAndRestoreCompanionOnlineStatus(userName);
      if (status.restored) {
        setIsOnline(true);
        setDateCountdownMsg(null);
      } else if (status.isOnline === false) {
        setIsOnline(false);
        if (status.remainingMs) {
          const totalMins = Math.ceil(status.remainingMs / 60000);
          const hrs = Math.floor(totalMins / 60);
          const mins = totalMins % 60;
          setDateCountdownMsg(`You are currently on an active date. Your profile is OFFLINE in the database (${hrs > 0 ? `${hrs}h ` : ''}${mins}m remaining).`);
        }
      } else {
        setDateCountdownMsg(null);
      }
    }, 5000);

    return () => {
      clearInterval(interval);
      clearInterval(statusCheckInterval);
    };
  }, [userName]);

  const pendingRequests = requests.filter((r) => r.status === 'pending');
  const ongoingBookings = requests.filter((r) => r.status === 'ongoing' || r.status === 'accepted' || r.status === 'in_progress');
  const completedBookings = requests.filter((r) => r.status === 'completed');

  // Real client earnings: released to companion account upon OTP verification
  const totalEarnings = completedBookings.reduce((sum, r) => sum + r.netPayout, 0);
  const heldInEscrow = ongoingBookings.reduce((sum, r) => sum + r.netPayout, 0);
  const completedHours = completedBookings.reduce((sum, r) => sum + r.hours, 0);
  const partnerRating = (completedBookings.length > 0 || ongoingBookings.length > 0) ? '5.0 ★' : 'New Partner';

  const handleAcceptRequest = async (id: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'ongoing' as const } : r))
    );
    await updateBookingStatusInSupabase(id, 'confirmed');

    const acceptedReq = requests.find((r) => r.id === id);
    if (acceptedReq) {
      const companionPhone = localStorage.getItem('ck_user_phone') || '+91 8789589633';
      const seekerEmail = (acceptedReq as any).seekerEmail || localStorage.getItem('ck_user_email') || `${acceptedReq.seekerName.toLowerCase().replace(/\s+/g, '')}@gmail.com`;

      // Dispatch official confirmation email to seeker containing companion details, direct phone & Completion OTP
      await sendBookingConfirmationEmail({
        booking_code: id.slice(0, 8),
        client_name: acceptedReq.seekerName,
        client_email: seekerEmail,
        companion_name: userName || 'Your Verified Companion',
        companion_phone: companionPhone,
        service_title: acceptedReq.serviceTitle,
        city: acceptedReq.location,
        booking_date: acceptedReq.date,
        total_price: acceptedReq.totalEarnings,
        completion_otp: acceptedReq.completionOtp || '4829',
      });

      setAcceptedEmailSent({
        seekerName: acceptedReq.seekerName,
        email: seekerEmail,
        phone: companionPhone,
        bookingCode: id.slice(0, 8),
      });
    }

    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  const handleStartMeetupWithOtp = async () => {
    if (!startDateModalBooking || !enteredStartOtp.trim()) return;
    setIsVerifyingStartOtp(true);
    setStartOtpError(null);

    try {
      const bCode = (startDateModalBooking as any).bookingCode || startDateModalBooking.id;
      const res = await verifyStartDateOtpAndSetCompanionOffline(
        bCode,
        enteredStartOtp.trim(),
        userName
      );

      if (res.success) {
        setIsOnline(false);
        setRequests((prev) =>
          prev.map((r) =>
            r.id === startDateModalBooking.id ? { ...r, status: 'in_progress' as any } : r
          )
        );
        const hours = res.hours || startDateModalBooking.hours || 4;
        setDateCountdownMsg(`You are currently on an active date with ${startDateModalBooking.seekerName}. Profile is OFFLINE in database (${hours}h remaining).`);
        setStartDateModalBooking(null);
        setEnteredStartOtp('');
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.5 },
        });
        alert(`❤️ Date Started Successfully!\n\n${res.message}\n\nYour profile is now OFFLINE in the database for the next ${hours} hours to prevent double-booking. When your date finishes, enter the customer's Completion OTP to release your escrow payout.`);
      } else {
        setStartOtpError(res.message);
      }
    } catch (err: any) {
      setStartOtpError(err.message || 'Start OTP verification failed');
    } finally {
      setIsVerifyingStartOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpModalBooking || !enteredOtp.trim()) return;
    setIsVerifyingOtp(true);
    setOtpError(null);

    try {
      const res = await verifyCompletionOtpAndReleasePayout(
        (otpModalBooking as any).bookingCode || otpModalBooking.id,
        enteredOtp.trim()
      );

      if (res.success) {
        setIsOnline(true);
        setDateCountdownMsg(null);
        localStorage.removeItem(`ck_companion_offline_until_${userName}`);
        localStorage.removeItem('ck_active_date_booking');

        setRequests((prev) =>
          prev.map((r) =>
            r.id === otpModalBooking.id ? { ...r, status: 'completed' as const, payoutReleased: true } : r
          )
        );
        const payout = res.payoutAmount || otpModalBooking.netPayout;
        setOtpModalBooking(null);
        setEnteredOtp('');
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.5 },
        });
        alert(`🎉 Outing Completed & Verified!\n\n₹${payout.toLocaleString('en-IN')} held in escrow has been successfully released to your account. Your companion profile is now back ONLINE.`);
      } else {
        setOtpError(res.message);
      }
    } catch (err: any) {
      setOtpError(err.message || 'OTP verification failed');
    } finally {
      setIsVerifyingOtp(false);
    }
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

  const handleSaveProfileCustomizations = async () => {
    setSavingProfile(true);
    const profileData = {
      bio: customBio,
      city: customCity,
      pinCode: customPinCode,
      hourlyRate: customHourlyRate,
      hobbies: customHobbies,
      services: customServices,
      availability: customAvailability,
      coverGradient: coverGradient,
      avatarUrl: companionPhotos[0],
      online: isOnline,
    };

    try {
      localStorage.setItem(`ck_companion_custom_profile_${userName}`, JSON.stringify(profileData));
      localStorage.setItem('ck_companion_profile_custom', JSON.stringify(profileData));
      await updateCompanionProfileInSupabase(userName, profileData);

      setSaveSuccessMsg(true);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.4 }
      });
      setTimeout(() => setSaveSuccessMsg(false), 4000);
    } catch (err) {
      console.error('Error saving profile customizations:', err);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleAddHobby = (hobbyToAdd?: string) => {
    const hobby = (hobbyToAdd || newHobbyInput).trim();
    if (!hobby) return;
    if (!customHobbies.includes(hobby)) {
      setCustomHobbies([...customHobbies, hobby]);
    }
    setNewHobbyInput('');
  };

  const handleRemoveHobby = (hobbyToRemove: string) => {
    setCustomHobbies(customHobbies.filter(h => h !== hobbyToRemove));
  };

  const handleToggleService = (serviceName: string) => {
    if (customServices.includes(serviceName)) {
      if (customServices.length <= 1) {
        alert('Please keep at least one service selected.');
        return;
      }
      setCustomServices(customServices.filter(s => s !== serviceName));
    } else {
      setCustomServices([...customServices, serviceName]);
    }
  };

  const handleUpdateAvailabilityHours = (day: string, hours: string) => {
    setCustomAvailability(prev => ({
      ...prev,
      [day]: hours,
    }));
  };

  const previewCompanionData: CompanionProfile = {
    id: 'comp-preview',
    name: userName || 'Akshita Bhutra',
    age: 24,
    city: customCity,
    pinCode: customPinCode,
    rating: 5.00,
    reviewCount: 2,
    hourlyRate: customHourlyRate,
    avatarUrl: companionPhotos[0],
    badges: ['Face Verified', 'Top Rated Companion', '100% KYC'],
    bio: customBio,
    verifiedKYC: kycVerified,
    online: isOnline,
    distanceKm: 2.1,
    languages: ['Hindi', 'English'],
    services: customServices,
    hobbies: customHobbies,
    availability: customAvailability,
    memberSince: 'Jun 2026',
    reviewsList: [
      { rating: 5, date: '8/8/2026', comment: 'Awesome' },
      { rating: 5, date: '8/4/2026', comment: '' },
    ],
    coverGradient: coverGradient,
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 relative">
      <div className="max-w-6xl mx-auto">
        
        {/* Top Header */}
        <div className="bg-white/85 backdrop-blur-2xl rounded-3xl p-5 sm:p-6 border border-pink-200 shadow-apple-md mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
            <button
              onClick={onBackToHome}
              aria-label="Back to landing page"
              className="w-10 h-10 rounded-full bg-pink-50 hover:bg-pink-100 flex items-center justify-center text-[#1d1d1f] transition apple-focus cursor-pointer shrink-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            {/* Official Click Karo Date Karo Company Logo */}
            <div 
              onClick={onBackToHome}
              className="flex items-center cursor-pointer select-none group/logo shrink-0"
              title="Click Karo Date Karo"
            >
              <img 
                src="/assets/brand_logo.png" 
                alt="Click Karo Date Karo" 
                className="h-10 sm:h-11 w-auto object-contain transition-transform duration-300 group-hover/logo:scale-105 drop-shadow-xs"
              />
            </div>

            <div className="hidden sm:block h-7 w-px bg-pink-200 mx-1"></div>

            {/* Companion Primary Profile Photo with Camera Upload */}
            <div className="relative group shrink-0">
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
              <span>Held in Platform Escrow</span>
              <Lock className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-amber-700 font-display tabular-numbers">
              ₹{heldInEscrow.toLocaleString('en-IN')}
            </div>
            <div className="text-[10px] text-amber-700 font-bold mt-1">
              Releases upon Seeker OTP verification
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

        {/* 2. MY PUBLIC PROFILE CUSTOMIZATION (ABOUT, HOBBIES, SERVICES, AVAILABILITY) */}
        <div className="bg-white/85 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 border border-pink-200 shadow-apple-md mb-8 text-left">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 mb-6 border-b border-pink-100">
            <div>
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-[#9333EA]" />
                <h2 className="text-xl font-bold text-[#1d1d1f]">
                  My Public Profile &amp; Customization
                </h2>
                <span className="text-[10px] font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2.5 py-0.5 rounded-full">
                  Live Seeker View
                </span>
              </div>
              <p className="text-xs text-[#86868b] mt-0.5">
                Customize your bio, hobbies, available services, and weekly schedule seen by seekers.
              </p>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              <button
                type="button"
                onClick={() => setPreviewProfileOpen(true)}
                className="px-4 py-2.5 rounded-xl border border-purple-200 hover:bg-purple-50 text-purple-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Preview My Profile</span>
              </button>

              <button
                type="button"
                onClick={handleSaveProfileCustomizations}
                disabled={savingProfile}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#9333EA] via-[#D946EF] to-[#E11D48] hover:opacity-95 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-pink-500/20 active:scale-95 cursor-pointer disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{savingProfile ? 'Saving...' : 'Save Profile Changes'}</span>
              </button>
            </div>
          </div>

          {/* Success Banner */}
          {saveSuccessMsg && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Your profile customizations have been saved successfully! Seekers now see your updated details live.</span>
            </div>
          )}

          <div className="space-y-6">

            {/* 1. About Me (Bio) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1d1d1f] flex items-center justify-between">
                <span>About Me &amp; Personality Bio</span>
                <span className="text-[11px] font-normal text-stone-500">{customBio.length} characters</span>
              </label>
              <textarea
                rows={3}
                value={customBio}
                onChange={(e) => setCustomBio(e.target.value)}
                placeholder="Easygoing, ambitious, and always up for meaningful conversations. I value honesty, kindness, and mutual respect. Looking to connect with someone who enjoys good company, laughter, and building something real together."
                className="w-full p-3.5 rounded-2xl border border-stone-200 focus:border-[#9333EA] outline-none text-xs sm:text-sm text-[#1d1d1f] transition leading-relaxed"
              />
              <p className="text-[11px] text-stone-500">
                This appears directly in the "About" card on your companion profile.
              </p>
            </div>

            {/* 2. Hobbies & Interests */}
            <div className="space-y-3 pt-2 border-t border-stone-100">
              <label className="text-xs font-bold text-[#1d1d1f] block">
                Hobbies &amp; Interests (Pill Badges)
              </label>

              {/* Current tags */}
              <div className="flex flex-wrap gap-2">
                {customHobbies.map((hobby) => (
                  <span
                    key={hobby}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FAF5FF] text-[#7E22CE] border border-[#E9D5FF] text-xs font-semibold shadow-2xs"
                  >
                    <span>{hobby}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveHobby(hobby)}
                      className="w-4 h-4 rounded-full hover:bg-purple-200/70 text-purple-700 flex items-center justify-center transition cursor-pointer text-xs"
                      title="Remove tag"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>

              {/* Add custom tag input */}
              <div className="flex items-center gap-2 max-w-md">
                <input
                  type="text"
                  value={newHobbyInput}
                  onChange={(e) => setNewHobbyInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddHobby();
                    }
                  }}
                  placeholder="Type a hobby & press Enter (e.g. Photography)"
                  className="flex-1 px-3.5 py-2 rounded-xl border border-stone-200 focus:border-[#9333EA] outline-none text-xs text-[#1d1d1f]"
                />
                <button
                  type="button"
                  onClick={() => handleAddHobby()}
                  className="px-4 py-2 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-800 text-xs font-bold transition cursor-pointer"
                >
                  + Add
                </button>
              </div>

              {/* Quick suggestions */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <span className="text-stone-400 text-[11px] mr-1">Quick Add:</span>
                {['Book reading', 'Shopping', 'Movies', 'Pottery', 'Art & Cafes', 'Fitness', 'Live Music', 'Travel', 'Fine Dining'].map((sug) => {
                  const alreadyAdded = customHobbies.includes(sug);
                  return (
                    <button
                      key={sug}
                      type="button"
                      disabled={alreadyAdded}
                      onClick={() => handleAddHobby(sug)}
                      className={`text-[11px] px-2.5 py-1 rounded-full border transition cursor-pointer ${
                        alreadyAdded
                          ? 'bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed'
                          : 'bg-white hover:bg-purple-50 text-stone-600 border-stone-200'
                      }`}
                    >
                      + {sug}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Services Offered (Checklist) */}
            <div className="space-y-3 pt-2 border-t border-stone-100">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#1d1d1f] block">
                  Official Click Karo Date Karo Services ({customServices.length}/6 enabled)
                </label>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Platform Verified
                </span>
              </div>
              <p className="text-[11px] text-stone-500">
                Select which official companion services you accept bookings for from clients.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {[
                  { name: 'Hangout', desc: '4 Hours Outing' },
                  { name: 'Movie Partner', desc: '4 Hours Blockbuster' },
                  { name: 'Clubbing', desc: '6 Hours Nightlife' },
                  { name: 'Lunch/Dinner', desc: '2 Hours Fine Dining' },
                  { name: 'Travel Partner', desc: '12 Hours Full Day' },
                  { name: 'Coffee Partner', desc: '1 Hour Cafe Dialogue' },
                ].map((srv) => {
                  const isChecked = customServices.includes(srv.name);
                  return (
                    <div
                      key={srv.name}
                      onClick={() => handleToggleService(srv.name)}
                      className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition select-none ${
                        isChecked
                          ? 'bg-purple-50/70 border-purple-300 text-purple-900 font-bold shadow-2xs'
                          : 'bg-stone-50/60 border-stone-200 text-stone-500 font-medium hover:border-stone-300'
                      }`}
                    >
                      <div>
                        <p className="text-xs font-bold">{srv.name}</p>
                        <p className="text-[10px] text-stone-400 font-normal">{srv.desc}</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="w-4 h-4 text-purple-600 rounded-md focus:ring-purple-500 pointer-events-none accent-purple-600"
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 4. Weekly Availability Schedule */}
            <div className="space-y-3 pt-2 border-t border-stone-100">
              <label className="text-xs font-bold text-[#1d1d1f] block">
                Weekly Availability Schedule
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => {
                  const currentSlot = customAvailability[day] || '11:00 – 23:00';
                  return (
                    <div key={day} className="p-2.5 rounded-xl border border-stone-200 bg-stone-50/50 space-y-1">
                      <span className="text-xs font-extrabold text-[#1d1d1f] block">{day}</span>
                      <input
                        type="text"
                        value={currentSlot}
                        onChange={(e) => handleUpdateAvailabilityHours(day, e.target.value)}
                        placeholder="11:00 – 23:00"
                        className="w-full text-[11px] p-1.5 rounded-lg border border-stone-200 bg-white text-stone-700 font-mono text-center outline-none focus:border-[#9333EA]"
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 5. City, PIN Code & Banner Theme */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-stone-100 text-xs">
              <div>
                <label className="font-bold text-[#1d1d1f] block mb-1">Serving City</label>
                <input
                  type="text"
                  value={customCity}
                  onChange={(e) => setCustomCity(e.target.value)}
                  placeholder="e.g. Mumbai"
                  className="w-full p-2.5 rounded-xl border border-stone-200 focus:border-[#9333EA] outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-[#1d1d1f] block mb-1">PIN Code</label>
                <input
                  type="text"
                  maxLength={6}
                  value={customPinCode}
                  onChange={(e) => setCustomPinCode(e.target.value)}
                  placeholder="e.g. 400050"
                  className="w-full p-2.5 rounded-xl border border-stone-200 focus:border-[#9333EA] outline-none font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-[#1d1d1f] block mb-1">Cover Banner Theme</label>
                <div className="flex items-center gap-2 pt-1">
                  {[
                    { id: 'bg-gradient-to-r from-[#9333EA] via-[#D946EF] to-[#EC4899]', label: 'Signature Magenta' },
                    { id: 'bg-gradient-to-r from-purple-800 via-indigo-700 to-blue-600', label: 'Royal Violet' },
                    { id: 'bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400', label: 'Sunset Coral' },
                    { id: 'bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600', label: 'Emerald Luxe' },
                  ].map((theme) => (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => setCoverGradient(theme.id)}
                      title={theme.label}
                      className={`w-7 h-7 rounded-full ${theme.id} transition-transform ${
                        coverGradient === theme.id ? 'ring-3 ring-[#9333EA] scale-110' : 'opacity-70 hover:opacity-100'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Save Bar */}
          <div className="mt-6 pt-4 border-t border-pink-100 flex items-center justify-between">
            <p className="text-[11px] text-stone-500">
              Changes sync directly to your companion listing and seeker browsing view.
            </p>
            <button
              type="button"
              onClick={handleSaveProfileCustomizations}
              disabled={savingProfile}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#9333EA] via-[#D946EF] to-[#E11D48] hover:opacity-95 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-pink-500/20 active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{savingProfile ? 'Saving...' : 'Save Profile Changes'}</span>
            </button>
          </div>

        </div>

        {/* 3. INCOMING SEEKER REQUESTS (MAIN WORKFLOW) */}
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
              <ShieldCheck className="w-4 h-4" /> 100% Face Verified Seekers
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

                    {/* CONNECT ACTIONS: VIEW PROFILE, DECLINE, ACCEPT (Chat and call removed) */}
                    <div className="flex items-center gap-1.5 flex-wrap w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={() => setActiveProfileModal(req)}
                        className="px-3 py-2 rounded-xl bg-pink-100/70 hover:bg-pink-100 text-[#1d1d1f] text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                        title="View Seeker Verified Photos & Profile"
                      >
                        <UserCheck className="w-3.5 h-3.5 text-[#0071e3]" />
                        <span>Profile</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeclineRequest(req.id)}
                        className="p-2 rounded-xl border border-pink-200 hover:bg-rose-50 text-rose-600 transition cursor-pointer"
                        title="Decline"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleAcceptRequest(req.id)}
                        className="px-4 py-2 rounded-xl bg-[#0071e3] hover:bg-[#0077ed] text-white transition shadow-apple-sm text-xs font-bold flex items-center gap-1.5 active:scale-95 cursor-pointer"
                        title="Accept & Send Automatic Confirmation Email"
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

        {/* ACTIVE DATE OFFLINE STATUS BANNER */}
        {dateCountdownMsg && (
          <div className="mb-6 p-4.5 rounded-3xl bg-gradient-to-r from-rose-500 via-pink-600 to-purple-600 text-white shadow-apple-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 text-white animate-spin" />
              </div>
              <div>
                <div className="font-bold text-sm sm:text-base">Date in Progress &bull; Profile is OFFLINE</div>
                <p className="text-xs text-white/90">{dateCountdownMsg}</p>
              </div>
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider bg-white text-rose-600 px-3.5 py-1.5 rounded-full shadow-xs shrink-0 self-end sm:self-auto">
              Offline Protected
            </span>
          </div>
        )}

        {/* 3. ONGOING OUTINGS & ESCROW HELD */}
        {ongoingBookings.length > 0 && (
          <div className="bg-white/85 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-apple-md mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-amber-100">
              <div>
                <h2 className="text-xl font-bold text-[#1d1d1f] flex items-center gap-2">
                  <span>Ongoing &amp; Scheduled Outings</span>
                  <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
                    {ongoingBookings.length} Active
                  </span>
                </h2>
                <p className="text-xs text-[#86868b] mt-0.5">
                  Meetups in progress or scheduled. Verify customer's Start OTP to start your date and set profile offline.
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-amber-800 block">Total In Escrow</span>
                <span className="font-mono font-black text-lg text-amber-900">
                  ₹{heldInEscrow.toLocaleString('en-IN')}.00
                </span>
              </div>
            </div>

            <div className="space-y-4">
              {ongoingBookings.map((b) => (
                <div
                  key={b.id}
                  className={`p-5 rounded-2xl border transition shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs ${
                    b.status === 'in_progress'
                      ? 'bg-rose-50/60 border-rose-200 ring-2 ring-rose-300/40'
                      : 'bg-amber-50/50 border-amber-200/90'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 font-bold text-[#1d1d1f]">
                      <span className="text-sm">{b.seekerName}</span>
                      {b.status === 'in_progress' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-800 bg-rose-100 px-2.5 py-0.5 rounded-full border border-rose-200 animate-pulse">
                          <span className="w-2 h-2 rounded-full bg-rose-600"></span>
                          <span>Date in Progress (Profile Offline)</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-200">
                          <Lock className="w-3 h-3 text-amber-700" />
                          <span>Escrow Held &bull; Ready to Start</span>
                        </span>
                      )}
                    </div>
                    <div className="text-[#86868b]">
                      {b.serviceTitle} &bull; {b.date} &bull; {b.location} &bull; <strong>{b.hours} Hours</strong>
                    </div>
                    <div className="text-[11px] text-stone-600">
                      Client Contact: <strong className="font-mono text-[#111827]">{b.seekerPhone}</strong>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-stone-200">
                    <div className="text-right sm:text-right pr-2">
                      <div className="text-[10px] text-[#86868b] uppercase font-bold">Your Net Payout</div>
                      <div className="font-bold text-emerald-700 text-base">
                        ₹{b.netPayout.toLocaleString('en-IN')}.00
                      </div>
                    </div>

                    {b.status === 'in_progress' ? (
                      <button
                        type="button"
                        onClick={() => {
                          setOtpModalBooking(b);
                          setEnteredOtp('');
                          setOtpError(null);
                        }}
                        className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition shadow-sm text-xs flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                      >
                        <KeyRound className="w-4 h-4" />
                        <span>Complete Date &amp; Enter OTP</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setStartDateModalBooking(b);
                          setEnteredStartOtp('');
                          setStartOtpError(null);
                        }}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF2D55] to-[#E11D48] hover:opacity-95 text-white font-bold transition shadow-sm text-xs flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                      >
                        <Play className="w-4 h-4 fill-white" />
                        <span>Start Date (Enter Start OTP)</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. COMPLETED OUTINGS & PAYOUTS RELEASED */}
        {completedBookings.length > 0 && (
          <div className="bg-white/85 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 border border-emerald-200 shadow-apple-md mb-8">
            <h2 className="text-xl font-bold text-[#1d1d1f] mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Completed Outings &amp; Payouts Released ({completedBookings.length})</span>
            </h2>
            <div className="space-y-3">
              {completedBookings.map((b) => (
                <div
                  key={b.id}
                  className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2 font-bold text-[#1d1d1f]">
                      <span>{b.seekerName}</span>
                      <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full text-[10px] font-bold">
                        Meetup Verified &amp; Paid
                      </span>
                    </div>
                    <div className="text-[#86868b] mt-1">
                      {b.serviceTitle} &bull; {b.date} &bull; {b.location}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-emerald-700 text-base">
                      ₹{b.netPayout.toLocaleString('en-IN')}.00
                    </div>
                    <div className="text-[10px] text-emerald-600 font-bold">Payout Released to Bank/UPI</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* OTP VERIFICATION MODAL FOR MEETUP COMPLETION & ESCROW RELEASE */}
        {otpModalBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-fade-in">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 border border-stone-200 shadow-[0_25px_70px_rgba(0,0,0,0.18)] text-center space-y-4 relative">
              <button
                type="button"
                onClick={() => {
                  setOtpModalBooking(null);
                  setEnteredOtp('');
                  setOtpError(null);
                }}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 transition cursor-pointer"
              >
                <XCircle className="w-4 h-4" />
              </button>

              <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-md">
                <KeyRound className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h3 className="font-display font-black text-2xl text-[#111827]">
                  Verify Outing Completion
                </h3>
                <p className="text-xs text-[#6B7280]">
                  Enter the 4-digit OTP provided by <strong className="text-[#111827]">{otpModalBooking.seekerName}</strong> to release your held payout.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/90 text-left space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-stone-600">Client / Seeker:</span>
                  <span className="font-bold text-[#111827]">{otpModalBooking.seekerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-600">Service:</span>
                  <span className="font-medium text-[#111827]">{otpModalBooking.serviceTitle}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-amber-200/60">
                  <span className="font-bold text-amber-900">Held Escrow Payout:</span>
                  <span className="font-mono font-black text-sm text-emerald-700">
                    ₹{otpModalBooking.netPayout.toLocaleString('en-IN')}.00
                  </span>
                </div>
              </div>

              {/* OTP Input */}
              <div className="space-y-2 text-left">
                <label className="text-xs font-bold text-[#111827] block">
                  Customer Completion OTP
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={enteredOtp}
                  onChange={(e) => {
                    setEnteredOtp(e.target.value.replace(/\D/g, ''));
                    setOtpError(null);
                  }}
                  placeholder="Enter 4-digit OTP (e.g. 4829)"
                  className="w-full text-center tracking-widest font-mono text-xl py-3 px-4 rounded-2xl border-2 border-stone-200 focus:border-[#0071e3] outline-none transition font-bold"
                  autoFocus
                />
                <p className="text-[11px] text-stone-500 text-center">
                  Ask the customer for the code sent to their registered email.
                </p>
              </div>

              {otpError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium text-left">
                  {otpError}
                </div>
              )}

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={enteredOtp.length < 4 || isVerifyingOtp}
                  className="flex-1 py-3 rounded-2xl bg-[#0071e3] hover:bg-[#0077ed] disabled:opacity-50 text-white font-bold text-xs sm:text-sm transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isVerifyingOtp ? 'Verifying...' : `Verify & Release ₹${otpModalBooking.netPayout.toLocaleString('en-IN')}`}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setOtpModalBooking(null);
                    setEnteredOtp('');
                    setOtpError(null);
                  }}
                  className="px-4 py-3 rounded-2xl bg-stone-100 hover:bg-stone-200 text-[#111827] font-bold text-xs transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* START DATE OTP VERIFICATION MODAL (SETS COMPANION PROFILE OFFLINE FOR BOOKING DURATION) */}
        {startDateModalBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-fade-in">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 border border-pink-200 shadow-[0_25px_70px_rgba(0,0,0,0.18)] text-center space-y-4 relative">
              <button
                type="button"
                onClick={() => {
                  setStartDateModalBooking(null);
                  setEnteredStartOtp('');
                  setStartOtpError(null);
                }}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 transition cursor-pointer"
              >
                <XCircle className="w-4 h-4" />
              </button>

              <div className="w-16 h-16 rounded-full bg-pink-100 text-[#FF2D55] flex items-center justify-center mx-auto shadow-md">
                <Play className="w-7 h-7 fill-[#FF2D55] ml-0.5" />
              </div>

              <div className="space-y-1">
                <h3 className="font-display font-black text-2xl text-[#111827]">
                  Start Date &bull; Enter OTP
                </h3>
                <p className="text-xs text-[#6B7280]">
                  Ask <strong className="text-[#111827]">{startDateModalBooking.seekerName}</strong> for their 4-digit <strong>Start Date OTP</strong> shown in their booking.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-pink-50/70 border border-pink-200 text-left space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-stone-600">Client / Seeker:</span>
                  <span className="font-bold text-[#111827]">{startDateModalBooking.seekerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-600">Service Outing:</span>
                  <span className="font-medium text-[#111827]">{startDateModalBooking.serviceTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-600">Booking Duration:</span>
                  <span className="font-bold text-[#FF2D55]">{startDateModalBooking.hours} Hours</span>
                </div>
                <div className="pt-2 border-t border-pink-200/80 text-[11px] text-stone-600 leading-relaxed">
                  🔒 <strong>Auto-Offline Protection:</strong> Upon verifying this OTP, your profile will automatically go <strong>OFFLINE</strong> in the database for {startDateModalBooking.hours} hours so no other seeker can book you during this date.
                </div>
              </div>

              {/* Start Date OTP Input */}
              <div className="space-y-2 text-left">
                <label className="text-xs font-bold text-[#111827] block">
                  Enter 4-Digit Start OTP
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={enteredStartOtp}
                  onChange={(e) => {
                    setEnteredStartOtp(e.target.value.replace(/\D/g, ''));
                    setStartOtpError(null);
                  }}
                  placeholder="Enter 4-digit Start OTP"
                  className="w-full text-center tracking-widest font-mono text-xl py-3 px-4 rounded-2xl border-2 border-stone-200 focus:border-[#FF2D55] outline-none transition font-bold"
                  autoFocus
                />
                <p className="text-[11px] text-stone-500 text-center">
                  The client has this code on their screen under "Start Date OTP".
                </p>
              </div>

              {startOtpError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium text-left">
                  {startOtpError}
                </div>
              )}

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleStartMeetupWithOtp}
                  disabled={enteredStartOtp.length < 4 || isVerifyingStartOtp}
                  className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-[#FF2D55] to-[#E11D48] hover:opacity-95 disabled:opacity-50 text-white font-bold text-xs sm:text-sm transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>{isVerifyingStartOtp ? 'Starting Date...' : `Start Date (${startDateModalBooking.hours}h Offline)`}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStartDateModalBooking(null);
                    setEnteredStartOtp('');
                    setStartOtpError(null);
                  }}
                  className="px-4 py-3 rounded-2xl bg-stone-100 hover:bg-stone-200 text-[#111827] font-bold text-xs transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>
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
          onAccept={(id) => handleAcceptRequest(id)}
        />

        {/* AUTOMATIC CONFIRMATION EMAIL SENT POPUP */}
        {acceptedEmailSent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 border border-stone-200 shadow-[0_25px_70px_rgba(0,0,0,0.18)] text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                <Mail className="w-9 h-9" />
              </div>

              <div className="space-y-1">
                <h3 className="font-display font-black text-2xl text-[#111827]">
                  Booking Accepted!
                </h3>
                <p className="text-xs text-[#6B7280]">
                  An automatic confirmation email has been dispatched to the seeker.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FFF5F7] border border-pink-200 text-left space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-stone-500">Sent To (Seeker Email):</span>
                  <span className="font-mono font-bold text-[#FF2D55]">{acceptedEmailSent.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Booking Reference:</span>
                  <span className="font-mono font-bold text-[#111827]">#{acceptedEmailSent.bookingCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Companion Name:</span>
                  <span className="font-bold text-[#111827]">{userName || 'Verified Companion'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Number for Client to Call:</span>
                  <span className="font-mono font-bold text-emerald-700">{acceptedEmailSent.phone}</span>
                </div>
              </div>

              <p className="text-[11px] text-stone-500">
                The seeker has received your verified name and direct phone number to coordinate meeting details.
              </p>

              <button
                type="button"
                onClick={() => setAcceptedEmailSent(null)}
                className="w-full py-3 rounded-2xl bg-[#111827] hover:bg-[#FF2D55] text-white font-bold text-xs sm:text-sm transition shadow-md cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        )}

        {/* 5. PREVIEW PUBLIC PROFILE MODAL (EXACT MATCH TO SEEKER VIEW) */}
        {previewProfileOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs animate-fade-in overflow-y-auto">
            <div className="bg-[#fbfbfb] rounded-3xl max-w-5xl w-full p-4 sm:p-8 max-h-[95vh] overflow-y-auto shadow-2xl relative border border-purple-200">
              <div className="mb-4 flex items-center justify-between pb-3 border-b border-stone-200">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <h3 className="font-bold text-sm sm:text-base text-stone-900">
                    Live Public Profile Preview (How Seekers See You)
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setPreviewProfileOpen(false)}
                  className="px-4 py-1.5 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-bold transition cursor-pointer"
                >
                  Close Preview
                </button>
              </div>

              <CompanionProfileView
                companion={previewCompanionData}
                onBack={() => setPreviewProfileOpen(false)}
                isSeeker={false}
              />
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
