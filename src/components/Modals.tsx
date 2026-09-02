import React, { useState, useEffect } from 'react';
import { ALL_SERVICES, MEMBERSHIP_PLANS } from '../data/servicesData';
import { LAUNCH_CITIES } from '../data/launchCities';
import { validatePincode } from '../utils/pincodeValidator';
import { ServiceItem, BookingContext } from '../types';
import { X, CheckCircle2, ShieldCheck, Sparkles, MapPin, Calendar, Clock, Phone, User, Mail, ArrowRight, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { recordBookingInSupabase, recordPartnerApplicationInSupabase } from '../services/supabase';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialService?: ServiceItem | null;
  initialContext?: BookingContext | null;
  userName?: string;
}

const SERVICE_PACKAGE_HOURS: Record<string, number> = {
  'hangout': 4,
  'movie-partner': 4,
  'clubbing': 6,
  'lunch-dinner': 2,
  'travel-partner': 12,
  'coffee-partner': 1,
};

export const BookingModal: React.FC<BookingModalProps> = ({ 
  isOpen, 
  onClose, 
  initialService, 
  initialContext, 
  userName 
}) => {
  const [selectedServiceId, setSelectedServiceId] = useState<string>('movie-partner');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [pinError, setPinError] = useState<string | null>(null);
  const [pinSuccess, setPinSuccess] = useState<string | null>(null);
  const [date, setDate] = useState('');
  const [hours, setHours] = useState<number>(4);
  const [submitted, setSubmitted] = useState(false);
  const [confirmedBookingCode, setConfirmedBookingCode] = useState<string>('');

  // Tomorrow's date as default min date
  const getTomorrowStr = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  useEffect(() => {
    if (!isOpen) return;

    // 1. Resolve Initial Service ID
    let sId = 'movie-partner';
    if (initialContext?.service) {
      sId = typeof initialContext.service === 'string' ? initialContext.service : initialContext.service.id;
    } else if (initialService) {
      sId = initialService.id;
    }
    // Verify valid ID exists in catalog
    if (ALL_SERVICES.some(s => s.id === sId)) {
      setSelectedServiceId(sId);
      setHours(SERVICE_PACKAGE_HOURS[sId] || 2);
    } else {
      setSelectedServiceId('movie-partner');
      setHours(4);
    }

    // 2. Pre-fill User Profile Info (Zero Repetition)
    const savedName = localStorage.getItem('ck_user_name') || userName || 'vaibhav';
    setFullName(savedName);

    const savedPhone = localStorage.getItem('ck_user_phone') || '';
    setPhone(savedPhone);

    // 3. Pre-fill City & PIN Code (Zero Repetition)
    const targetCity = initialContext?.city || localStorage.getItem('ck_user_city') || 'Mumbai';
    setCity(targetCity);

    let targetPin = initialContext?.pinCode || localStorage.getItem('ck_user_pincode') || '';
    if (!targetPin) {
      const matchedCity = LAUNCH_CITIES.find(c => c.name.toLowerCase() === targetCity.toLowerCase()) || LAUNCH_CITIES[0];
      targetPin = matchedCity.popularPinCodes[0] || '400050';
    }
    setPinCode(targetPin);

    // Initial validation check
    if (targetPin.length === 6) {
      const res = validatePincode(targetPin);
      if (res.isLaunchCity) {
        setPinError(null);
        setPinSuccess(`Live in ${res.cityName}! Verified companions ready.`);
      } else {
        setPinError(null);
        setPinSuccess(null);
      }
    }

    // 4. Default Date (Tomorrow)
    setDate(getTomorrowStr());
  }, [isOpen, initialContext, initialService, userName]);

  if (!isOpen) return null;

  const currentService = ALL_SERVICES.find((s) => s.id === selectedServiceId) || ALL_SERVICES[0];
  const pkgHours = SERVICE_PACKAGE_HOURS[selectedServiceId] || 2;

  // Exact transparent pricing: matches fixed package rate
  const companionHourly = initialContext?.companionRate;
  const totalPrice = companionHourly
    ? companionHourly * hours
    : hours === pkgHours
    ? currentService.pricePerHour
    : Math.round((currentService.pricePerHour / pkgHours) * hours);

  const handleServiceChange = (sId: string) => {
    setSelectedServiceId(sId);
    const newHours = SERVICE_PACKAGE_HOURS[sId] || 2;
    setHours(newHours);
  };

  const handleCityChange = (cityName: string) => {
    setCity(cityName);
    if (cityName) {
      localStorage.setItem('ck_user_city', cityName);
      const matched = LAUNCH_CITIES.find(c => c.name.toLowerCase() === cityName.toLowerCase());
      if (matched && matched.popularPinCodes.length > 0) {
        const autoPin = matched.popularPinCodes[0];
        setPinCode(autoPin);
        localStorage.setItem('ck_user_pincode', autoPin);
        setPinError(null);
        setPinSuccess(`Live in ${matched.name}! Verified companions ready.`);
      }
    }
  };

  const handlePincodeChange = (value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 6);
    setPinCode(cleaned);

    if (cleaned.length === 6) {
      const res = validatePincode(cleaned);
      if (res.isLaunchCity) {
        setPinError(null);
        setPinSuccess(`Live in ${res.cityName}! Verified companions available.`);
        if (res.cityName) {
          setCity(res.cityName);
          localStorage.setItem('ck_user_city', res.cityName);
        }
        localStorage.setItem('ck_user_pincode', cleaned);
      } else {
        setPinSuccess(null);
        setPinError(`PIN ${cleaned} is outside our 12 launch cities. We currently operate exclusively in: Dehradun, Delhi, Gurgaon, Noida, Chandigarh, Bangalore, Meerut, Jaipur, Indore, Mumbai, Ghaziabad, and Lucknow.`);
      }
    } else {
      setPinError(null);
      setPinSuccess(null);
    }
  };

  const handleFullNameChange = (val: string) => {
    setFullName(val);
    localStorage.setItem('ck_user_name', val);
  };

  const handlePhoneChange = (val: string) => {
    setPhone(val);
    localStorage.setItem('ck_user_phone', val);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pinCode.length === 6) {
      const res = validatePincode(pinCode);
      if (!res.isLaunchCity) {
        setPinError(`Booking unavailable: PIN code ${pinCode} is outside our 12 launch cities.`);
        return;
      }
    }
    // Remember details for future visits
    if (fullName) localStorage.setItem('ck_user_name', fullName);
    if (phone) localStorage.setItem('ck_user_phone', phone);
    if (city) localStorage.setItem('ck_user_city', city);
    if (pinCode) localStorage.setItem('ck_user_pincode', pinCode);

    // Ingest to Supabase CRM
    const response = await recordBookingInSupabase({
      client_name: fullName,
      client_phone: phone,
      client_email: localStorage.getItem('ck_user_email') || null,
      service_id: selectedServiceId,
      service_title: currentService.title,
      city: city,
      pin_code: pinCode,
      booking_date: date,
      hours: hours,
      total_price: totalPrice,
      companion_name: initialContext?.companionName || undefined,
      companion_avatar: initialContext?.companionAvatar || undefined,
      concierge_notes: initialContext?.companionName 
        ? `Direct booking with companion ${initialContext.companionName}` 
        : 'Direct web portal booking',
    });

    setConfirmedBookingCode(response.booking_code);
    setSubmitted(true);
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
      className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
    >
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 border border-black/[0.08] shadow-apple-float relative max-h-[90vh] overflow-y-auto no-scrollbar">
        {/* Close Button */}
        <button
          onClick={handleResetAndClose}
          aria-label="Close booking modal"
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#f5f5f7] hover:bg-black/[0.08] flex items-center justify-center text-[#1d1d1f] transition apple-focus"
        >
          <X className="w-4 h-4" />
        </button>

        {!submitted ? (
          <div>
            <div className="text-[11px] font-semibold text-[#0071e3] uppercase tracking-wider mb-1">
              Instant Companion Booking
            </div>
            <h3 id="booking-modal-title" className="text-2xl font-semibold text-[#1d1d1f] mb-1 font-display">
              Find Your Perfect Partner
            </h3>
            <p className="text-xs text-[#86868b] mb-5 font-sans">
              Safe, respectful &amp; background-checked companion anywhere across India's 12 launch hubs.
            </p>

            {/* Direct Companion Context Pill (if booking a specific person) */}
            {initialContext?.companionName && (
              <div className="mb-5 p-3 rounded-2xl bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-200/80 flex items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  {initialContext.companionAvatar ? (
                    <img 
                      src={initialContext.companionAvatar} 
                      alt={initialContext.companionName} 
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-pink-300 shrink-0" 
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-pink-500 text-white font-bold flex items-center justify-center text-sm shrink-0">
                      {initialContext.companionName.charAt(0)}
                    </div>
                  )}
                  <div className="min-w-0 text-left">
                    <span className="text-[10px] uppercase font-bold text-pink-700 tracking-wider block">
                      Direct Booking
                    </span>
                    <div className="text-xs sm:text-sm font-bold text-[#1d1d1f] truncate">
                      {initialContext.companionName}
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full border border-emerald-200 shrink-0">
                  Verified Online
                </span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Select Service */}
              <div>
                <label htmlFor="modal-service-select" className="block text-xs font-semibold text-[#1d1d1f] mb-1 font-sans">
                  Choose Service Package
                </label>
                <select
                  id="modal-service-select"
                  value={selectedServiceId}
                  onChange={(e) => handleServiceChange(e.target.value)}
                  className="w-full bg-[#f5f5f7] border border-black/[0.06] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium text-[#1d1d1f] focus:outline-none focus:ring-2 focus:ring-[#0071e3]"
                >
                  {ALL_SERVICES.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.emoji} {s.title} — {s.priceFormatted || `₹${s.pricePerHour}`} ({SERVICE_PACKAGE_HOURS[s.id] || 2}h)
                    </option>
                  ))}
                </select>
              </div>

              {/* Name & Phone (Auto-remembered, zero repetitive typing) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="booking-fullname" className="block text-xs font-semibold text-[#1d1d1f] mb-1 font-sans">
                    Your Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#86868b] absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
                    <input
                      id="booking-fullname"
                      type="text"
                      required
                      autoComplete="name"
                      value={fullName}
                      onChange={(e) => handleFullNameChange(e.target.value)}
                      placeholder="e.g. Rahul Verma"
                      className="w-full bg-[#f5f5f7] border border-black/[0.06] rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0071e3]"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="booking-phone" className="block text-xs font-semibold text-[#1d1d1f] mb-1 font-sans">
                    Phone Number (WhatsApp)
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#86868b] absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
                    <input
                      id="booking-phone"
                      type="tel"
                      required
                      autoComplete="tel"
                      value={phone}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      placeholder="e.g. +91 98765 43210"
                      className="w-full bg-[#f5f5f7] border border-black/[0.06] rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0071e3]"
                    />
                  </div>
                </div>
              </div>

              {/* City & Pin Code (Strictly 12 Launch Cities with Auto-Suggest) */}
              <div className="space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="booking-city" className="block text-xs font-semibold text-[#1d1d1f] mb-1 font-sans">
                      Launch City
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-[#86868b] absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
                      <select
                        id="booking-city"
                        required
                        value={city}
                        onChange={(e) => handleCityChange(e.target.value)}
                        className="w-full bg-[#f5f5f7] border border-black/[0.06] rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm font-medium text-[#1d1d1f] focus:outline-none focus:ring-2 focus:ring-[#0071e3]"
                      >
                        <option value="">Select an active city...</option>
                        {LAUNCH_CITIES.map((c) => (
                          <option key={c.id} value={c.name}>
                            {c.name} ({c.state})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="booking-pincode" className="block text-xs font-semibold text-[#1d1d1f] mb-1 font-sans">
                      6-Digit Pin Code
                    </label>
                    <input
                      id="booking-pincode"
                      type="text"
                      required
                      maxLength={6}
                      value={pinCode}
                      onChange={(e) => handlePincodeChange(e.target.value)}
                      placeholder="e.g. 110001"
                      className={`w-full bg-[#f5f5f7] border rounded-xl px-3 py-2 text-xs sm:text-sm font-medium text-[#1d1d1f] focus:outline-none focus:ring-2 transition ${
                        pinError ? 'border-rose-400 focus:ring-rose-500 bg-rose-50/50' : pinSuccess ? 'border-emerald-400 focus:ring-emerald-500 bg-emerald-50/50' : 'border-black/[0.06] focus:ring-[#0071e3]'
                      }`}
                    />
                  </div>
                </div>

                {/* Live PIN Feedback */}
                {pinSuccess && (
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{pinSuccess}</span>
                  </div>
                )}
                {pinError && (
                  <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-start gap-2">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                    <span>{pinError}</span>
                  </div>
                )}
              </div>

              {/* Date & Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="booking-date" className="block text-xs font-semibold text-[#1d1d1f] mb-1 font-sans">
                    Date
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-[#86868b] absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
                    <input
                      id="booking-date"
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full bg-[#f5f5f7] border border-black/[0.06] rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0071e3]"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="booking-duration" className="block text-xs font-semibold text-[#1d1d1f] mb-1 font-sans">
                    Duration
                  </label>
                  <div className="relative">
                    <Clock className="w-4 h-4 text-[#86868b] absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
                    <select
                      id="booking-duration"
                      value={hours}
                      onChange={(e) => setHours(Number(e.target.value))}
                      className="w-full bg-[#f5f5f7] border border-black/[0.06] rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0071e3]"
                    >
                      <option value={1}>1 Hour {selectedServiceId === 'coffee-partner' ? '(Standard Package)' : ''}</option>
                      <option value={2}>2 Hours {selectedServiceId === 'lunch-dinner' ? '(Standard Package)' : ''}</option>
                      <option value={4}>4 Hours {['hangout', 'movie-partner'].includes(selectedServiceId) ? '(Standard Package)' : ''}</option>
                      <option value={6}>6 Hours {selectedServiceId === 'clubbing' ? '(Standard Package)' : ''}</option>
                      <option value={12}>12 Hours {selectedServiceId === 'travel-partner' ? '(Standard Package)' : ''}</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="bg-[#f5f5f7] rounded-2xl p-4 border border-black/[0.04] flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-[#86868b] font-sans">
                    {currentService.title} ({hours} {hours === 1 ? 'Hour' : 'Hours'} Package)
                    {initialContext?.companionName && ` • with ${initialContext.companionName}`}
                  </div>
                  <div className="text-xs font-semibold text-[#1d1d1f] flex items-center gap-1 mt-0.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#0071e3]" />
                    100% Aadhaar Verified Match
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-[#86868b] uppercase font-semibold">Total</div>
                  <div className="text-xl font-semibold text-[#1d1d1f] tabular-numbers font-display">₹{totalPrice.toLocaleString('en-IN')}</div>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full bg-[#0071e3] hover:bg-[#0077ed] text-white py-3.5 rounded-full font-bold text-xs sm:text-sm transition shadow-apple-sm active:scale-98 flex items-center justify-center gap-2 apple-focus"
              >
                <span>Confirm &amp; Match Companion</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="w-14 h-14 bg-[#0071e3]/10 text-[#0071e3] rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-semibold text-[#1d1d1f] mb-1 font-display">
              Booking Received
            </h3>
            {confirmedBookingCode && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#0071e3] text-xs font-bold mb-3">
                <span>Booking ID:</span>
                <span className="font-mono tracking-wider">{confirmedBookingCode}</span>
              </div>
            )}
            <p className="text-xs text-[#86868b] max-w-sm mx-auto mb-6 body-pretty font-sans">
              Thank you, <span className="font-semibold text-[#1d1d1f]">{fullName || 'Client'}</span>! Our concierge is matching verified {currentService.title} companions in <span className="font-semibold text-[#1d1d1f]">{city || 'your area'}</span>. Confirmation details have been recorded in our concierge portal. We will contact you at <span className="font-semibold text-[#1d1d1f]">{phone || 'your phone'}</span> via WhatsApp/SMS.
            </p>
            <button
              onClick={handleResetAndClose}
              className="bg-[#1d1d1f] hover:bg-[#0071e3] text-white px-8 py-2.5 rounded-full text-xs font-bold transition apple-focus"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

interface PartnerJoinModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PartnerJoinModal: React.FC<PartnerJoinModalProps> = ({ isOpen, onClose }) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<string>('1-year');
  const [submitted, setSubmitted] = useState(false);
  const [confirmedAppCode, setConfirmedAppCode] = useState<string>('');

  useEffect(() => {
    if (!isOpen) return;
    setFullName(localStorage.getItem('ck_user_name') || '');
    setPhone(localStorage.getItem('ck_user_phone') || '');
    setEmail(localStorage.getItem('ck_user_email') || '');
    setCity(localStorage.getItem('ck_user_city') || '');
    setPinCode(localStorage.getItem('ck_user_pincode') || '');
  }, [isOpen]);

  if (!isOpen) return null;

  const handleNameChange = (val: string) => {
    setFullName(val);
    localStorage.setItem('ck_user_name', val);
  };

  const handlePhoneChange = (val: string) => {
    setPhone(val);
    localStorage.setItem('ck_user_phone', val);
  };

  const handleEmailChange = (val: string) => {
    setEmail(val);
    localStorage.setItem('ck_user_email', val);
  };

  const handleCityChange = (val: string) => {
    setCity(val);
    localStorage.setItem('ck_user_city', val);
  };

  const handlePinChange = (val: string) => {
    setPinCode(val);
    localStorage.setItem('ck_user_pincode', val);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (fullName) localStorage.setItem('ck_user_name', fullName);
    if (phone) localStorage.setItem('ck_user_phone', phone);
    if (email) localStorage.setItem('ck_user_email', email);
    if (city) localStorage.setItem('ck_user_city', city);
    if (pinCode) localStorage.setItem('ck_user_pincode', pinCode);

    // Ingest to Supabase CRM
    const response = await recordPartnerApplicationInSupabase({
      full_name: fullName,
      phone: phone,
      email: email,
      city: city,
      pin_code: pinCode,
      selected_plan: selectedPlan,
    });

    setConfirmedAppCode(response.application_code);
    setSubmitted(true);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.5 }
    });
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-labelledby="partner-modal-title"
      className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
    >
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 border border-black/[0.08] shadow-apple-float relative max-h-[90vh] overflow-y-auto no-scrollbar">
        <button
          onClick={handleResetAndClose}
          aria-label="Close partner registration modal"
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#f5f5f7] hover:bg-black/[0.08] flex items-center justify-center text-[#1d1d1f] transition apple-focus"
        >
          <X className="w-4 h-4" />
        </button>

        {!submitted ? (
          <div>
            <div className="text-[11px] font-semibold text-[#0071e3] uppercase tracking-wider mb-1">
              Partner Registration (Earn ₹2K/hr)
            </div>
            <h3 id="partner-modal-title" className="text-2xl font-semibold text-[#1d1d1f] mb-1 font-display">
              Join Click Karo Date Karo
            </h3>
            <p className="text-xs text-[#86868b] mb-6 font-sans">
              Keep 80% of your earnings. Work your own hours with verified clients.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="partner-fullname" className="block text-xs font-semibold text-[#1d1d1f] mb-1 font-sans">
                    Full Name (As on ID)
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#86868b] absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
                    <input
                      id="partner-fullname"
                      type="text"
                      required
                      autoComplete="name"
                      value={fullName}
                      onChange={(e) => handleNameChange(e.target.value)}
                      placeholder="e.g. Priya Sharma"
                      className="w-full bg-[#f5f5f7] border border-black/[0.06] rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0071e3]"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="partner-phone" className="block text-xs font-semibold text-[#1d1d1f] mb-1 font-sans">
                    Mobile Number (WhatsApp)
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#86868b] absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
                    <input
                      id="partner-phone"
                      type="tel"
                      required
                      autoComplete="tel"
                      value={phone}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      placeholder="e.g. +91 98765 43210"
                      className="w-full bg-[#f5f5f7] border border-black/[0.06] rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0071e3]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="partner-email" className="block text-xs font-semibold text-[#1d1d1f] mb-1 font-sans">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#86868b] absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
                  <input
                    id="partner-email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => handleEmailChange(e.target.value)}
                    placeholder="e.g. priya@example.com"
                    className="w-full bg-[#f5f5f7] border border-black/[0.06] rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0071e3]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="partner-city" className="block text-xs font-semibold text-[#1d1d1f] mb-1 font-sans">
                    City
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-[#86868b] absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
                    <input
                      id="partner-city"
                      type="text"
                      required
                      value={city}
                      onChange={(e) => handleCityChange(e.target.value)}
                      placeholder="e.g. Mumbai"
                      className="w-full bg-[#f5f5f7] border border-black/[0.06] rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0071e3]"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="partner-pincode" className="block text-xs font-semibold text-[#1d1d1f] mb-1 font-sans">
                    Pin Code
                  </label>
                  <input
                    id="partner-pincode"
                    type="text"
                    required
                    maxLength={6}
                    value={pinCode}
                    onChange={(e) => handlePinChange(e.target.value)}
                    placeholder="e.g. 400001"
                    className="w-full bg-[#f5f5f7] border border-black/[0.06] rounded-xl px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0071e3]"
                  />
                </div>
              </div>

              {/* Plan Picker */}
              <div>
                <label className="block text-xs font-semibold text-[#1d1d1f] mb-1.5 font-sans">
                  Select Membership Plan (Special 60% OFF)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {MEMBERSHIP_PLANS.map((plan) => (
                    <div
                      key={plan.id}
                      onClick={() => setSelectedPlan(plan.id)}
                      className={`p-2.5 rounded-xl border text-center cursor-pointer transition apple-focus ${
                        selectedPlan === plan.id
                          ? 'border-[#0071e3] bg-[#0071e3]/5 shadow-sm'
                          : 'border-black/[0.06] hover:border-black/20'
                      }`}
                    >
                      <div className="text-[10px] text-[#86868b]">{plan.duration.split(' ')[0]} {plan.duration.split(' ')[1]}</div>
                      <div className="text-sm font-semibold text-[#1d1d1f] mt-0.5 tabular-numbers font-display">₹{plan.discountedPrice}</div>
                      <div className="text-[9px] text-[#0071e3] font-semibold">{plan.discountPercentage}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#f5f5f7] p-3 rounded-xl border border-black/[0.04] text-[11px] text-[#86868b] flex items-start gap-2 font-sans">
                <ShieldCheck className="w-4 h-4 text-[#0071e3] shrink-0 mt-0.5" />
                <span>I agree to follow the strict professional code of conduct and consent-first guidelines.</span>
              </div>

              <button
                type="submit"
                className="w-full bg-[#0071e3] hover:bg-[#0077ed] text-white py-3.5 rounded-full font-bold text-xs sm:text-sm transition shadow-apple-sm flex items-center justify-center gap-2 apple-focus active:scale-98"
              >
                <span>Submit &amp; Begin AI Verification</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="w-14 h-14 bg-[#0071e3]/10 text-[#0071e3] rounded-full flex items-center justify-center mx-auto mb-3">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-semibold text-[#1d1d1f] mb-1 font-display">
              Application Submitted
            </h3>
            {confirmedAppCode && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold mb-3">
                <span>Application ID:</span>
                <span className="font-mono tracking-wider">{confirmedAppCode}</span>
              </div>
            )}
            <p className="text-xs text-[#86868b] max-w-sm mx-auto mb-6 body-pretty font-sans">
              Welcome, <span className="font-semibold text-[#1d1d1f]">{fullName || 'Partner'}</span>! We have received your details in our recruitment portal. Our onboarding team will connect with you on <span className="font-semibold text-[#1d1d1f]">{phone}</span> to complete your fast-track badge activation.
            </p>
            <button
              onClick={handleResetAndClose}
              className="bg-[#1d1d1f] hover:bg-[#0071e3] text-white px-8 py-2.5 rounded-full text-xs font-bold transition apple-focus"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
