import React, { useState, useEffect } from 'react';
import { ALL_SERVICES, MEMBERSHIP_PLANS } from '../data/servicesData';
import { ServiceItem } from '../types';
import { X, CheckCircle2, ShieldCheck, Sparkles, MapPin, Calendar, Clock, Phone, User, Mail, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialService?: ServiceItem | null;
}

export const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, initialService }) => {
  const [selectedServiceId, setSelectedServiceId] = useState<string>('movie-partner');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [date, setDate] = useState('');
  const [hours, setHours] = useState<number>(2);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (initialService) {
      setSelectedServiceId(initialService.id);
    }
  }, [initialService]);

  if (!isOpen) return null;

  const currentService = ALL_SERVICES.find((s) => s.id === selectedServiceId) || ALL_SERVICES[0];
  const totalPrice = currentService.pricePerHour * hours;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
            <h3 id="booking-modal-title" className="text-2xl font-semibold text-[#1d1d1f] mb-1">
              Find Your Perfect Partner
            </h3>
            <p className="text-xs text-[#86868b] mb-6">
              Safe, respectful &amp; background-checked companion anywhere in India.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Select Service */}
              <div>
                <label htmlFor="modal-service-select" className="block text-xs font-semibold text-[#1d1d1f] mb-1">
                  Choose Service
                </label>
                <select
                  id="modal-service-select"
                  value={selectedServiceId}
                  onChange={(e) => setSelectedServiceId(e.target.value)}
                  className="w-full bg-[#f5f5f7] border border-black/[0.06] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium text-[#1d1d1f] focus:outline-none focus:ring-2 focus:ring-[#0071e3]"
                >
                  {ALL_SERVICES.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.emoji} {s.title} — ₹{s.pricePerHour}/hr
                    </option>
                  ))}
                </select>
              </div>

              {/* Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="booking-fullname" className="block text-xs font-semibold text-[#1d1d1f] mb-1">
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
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Rahul Verma"
                      className="w-full bg-[#f5f5f7] border border-black/[0.06] rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0071e3]"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="booking-phone" className="block text-xs font-semibold text-[#1d1d1f] mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#86868b] absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
                    <input
                      id="booking-phone"
                      type="tel"
                      required
                      autoComplete="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +91 98765 43210"
                      className="w-full bg-[#f5f5f7] border border-black/[0.06] rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0071e3]"
                    />
                  </div>
                </div>
              </div>

              {/* City & Pin Code */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="booking-city" className="block text-xs font-semibold text-[#1d1d1f] mb-1">
                    City
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-[#86868b] absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
                    <input
                      id="booking-city"
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. New Delhi"
                      className="w-full bg-[#f5f5f7] border border-black/[0.06] rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0071e3]"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="booking-pincode" className="block text-xs font-semibold text-[#1d1d1f] mb-1">
                    6-Digit Pin Code
                  </label>
                  <input
                    id="booking-pincode"
                    type="text"
                    required
                    maxLength={6}
                    pattern="[0-9]{6}"
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value)}
                    placeholder="e.g. 110001"
                    className="w-full bg-[#f5f5f7] border border-black/[0.06] rounded-xl px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0071e3]"
                  />
                </div>
              </div>

              {/* Date & Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="booking-date" className="block text-xs font-semibold text-[#1d1d1f] mb-1">
                    Date
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-[#86868b] absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
                    <input
                      id="booking-date"
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full bg-[#f5f5f7] border border-black/[0.06] rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0071e3]"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="booking-duration" className="block text-xs font-semibold text-[#1d1d1f] mb-1">
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
                      <option value={1}>1 Hour</option>
                      <option value={2}>2 Hours (Recommended)</option>
                      <option value={3}>3 Hours</option>
                      <option value={4}>4 Hours (Half Day)</option>
                      <option value={8}>8 Hours (Full Day)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="bg-[#f5f5f7] rounded-2xl p-4 border border-black/[0.04] flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-[#86868b]">{currentService.title} ({hours}h @ ₹{currentService.pricePerHour}/h)</div>
                  <div className="text-xs font-semibold text-[#1d1d1f] flex items-center gap-1 mt-0.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#0071e3]" />
                    100% Aadhaar Verified Match
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-[#86868b] uppercase font-semibold">Total</div>
                  <div className="text-xl font-semibold text-[#1d1d1f] tabular-numbers">₹{totalPrice.toLocaleString('en-IN')}</div>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full bg-[#0071e3] hover:bg-[#0077ed] text-white py-3 rounded-full font-medium text-sm transition shadow-sm flex items-center justify-center gap-2 apple-focus"
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
            <h3 className="text-2xl font-semibold text-[#1d1d1f] mb-1">
              Booking Received
            </h3>
            <p className="text-xs text-[#86868b] max-w-sm mx-auto mb-6 body-pretty">
              Thank you, <span className="font-semibold text-[#1d1d1f]">{fullName || 'Client'}</span>! Our concierge is matching verified {currentService.title} companions in <span className="font-semibold text-[#1d1d1f]">{city || 'your area'}</span>. Details will be sent to <span className="font-semibold text-[#1d1d1f]">{phone}</span> via WhatsApp/SMS within 10 minutes.
            </p>
            <button
              onClick={handleResetAndClose}
              className="bg-[#1d1d1f] text-white px-7 py-2.5 rounded-full text-xs font-medium transition apple-focus"
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

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
            <h3 id="partner-modal-title" className="text-2xl font-semibold text-[#1d1d1f] mb-1">
              Join Click Karo Date Karo
            </h3>
            <p className="text-xs text-[#86868b] mb-6">
              Keep 80% of your earnings. Work your own hours with verified clients.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="partner-fullname" className="block text-xs font-semibold text-[#1d1d1f] mb-1">
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
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Priya Sharma"
                      className="w-full bg-[#f5f5f7] border border-black/[0.06] rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0071e3]"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="partner-phone" className="block text-xs font-semibold text-[#1d1d1f] mb-1">
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
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +91 98765 43210"
                      className="w-full bg-[#f5f5f7] border border-black/[0.06] rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0071e3]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="partner-email" className="block text-xs font-semibold text-[#1d1d1f] mb-1">
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
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. priya@example.com"
                    className="w-full bg-[#f5f5f7] border border-black/[0.06] rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0071e3]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="partner-city" className="block text-xs font-semibold text-[#1d1d1f] mb-1">
                    City
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-[#86868b] absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
                    <input
                      id="partner-city"
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Mumbai"
                      className="w-full bg-[#f5f5f7] border border-black/[0.06] rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0071e3]"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="partner-pincode" className="block text-xs font-semibold text-[#1d1d1f] mb-1">
                    Pin Code
                  </label>
                  <input
                    id="partner-pincode"
                    type="text"
                    required
                    maxLength={6}
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value)}
                    placeholder="e.g. 400001"
                    className="w-full bg-[#f5f5f7] border border-black/[0.06] rounded-xl px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0071e3]"
                  />
                </div>
              </div>

              {/* Plan Picker */}
              <div>
                <label className="block text-xs font-semibold text-[#1d1d1f] mb-1.5">
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
                      <div className="text-sm font-semibold text-[#1d1d1f] mt-0.5 tabular-numbers">₹{plan.discountedPrice}</div>
                      <div className="text-[9px] text-[#0071e3] font-semibold">{plan.discountPercentage}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#f5f5f7] p-3 rounded-xl border border-black/[0.04] text-[11px] text-[#86868b] flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-[#0071e3] shrink-0 mt-0.5" />
                <span>I agree to follow the strict professional code of conduct and consent-first guidelines.</span>
              </div>

              <button
                type="submit"
                className="w-full bg-[#0071e3] hover:bg-[#0077ed] text-white py-3 rounded-full font-medium text-sm transition shadow-sm flex items-center justify-center gap-2 apple-focus"
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
            <h3 className="text-2xl font-semibold text-[#1d1d1f] mb-1">
              Application Submitted
            </h3>
            <p className="text-xs text-[#86868b] max-w-sm mx-auto mb-6 body-pretty">
              Welcome, <span className="font-semibold text-[#1d1d1f]">{fullName}</span>! We have initiated your Aadhaar verification. Our onboarding team will connect with you on <span className="font-semibold text-[#1d1d1f]">{phone}</span> to complete your fast-track badge activation.
            </p>
            <button
              onClick={handleResetAndClose}
              className="bg-[#1d1d1f] text-white px-7 py-2.5 rounded-full text-xs font-medium transition apple-focus"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
