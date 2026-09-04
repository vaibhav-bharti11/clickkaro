import React, { useState, useEffect } from 'react';
import { X, Calendar, MapPin, Clock, CheckCircle2, ShieldCheck, ArrowRight, UserCheck, RefreshCw, KeyRound } from 'lucide-react';
import { ServiceCredit } from '../types';
import { fetchUserBookingsFromSupabase } from '../services/supabase';

interface MyBookingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFindCompanion?: () => void;
  usedCredits?: ServiceCredit[];
  userName?: string;
  userPhone?: string;
  userEmail?: string;
}

export const MyBookingsModal: React.FC<MyBookingsModalProps> = ({
  isOpen,
  onClose,
  onFindCompanion,
  usedCredits = [],
  userName,
  userPhone,
  userEmail,
}) => {
  const [dbBookings, setDbBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    const loadBookings = async () => {
      setIsLoading(true);
      try {
        const resolvedName = userName || localStorage.getItem('ck_user_name');
        const resolvedPhone = userPhone || localStorage.getItem('ck_user_phone');
        const resolvedEmail = userEmail || localStorage.getItem('ck_user_email');

        const data = await fetchUserBookingsFromSupabase({
          name: resolvedName,
          phone: resolvedPhone,
          email: resolvedEmail,
        });

        if (isMounted && data) {
          setDbBookings(data);
        }
      } catch (err) {
        console.warn('[MyBookingsModal] Error loading bookings:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadBookings();

    return () => {
      isMounted = false;
    };
  }, [isOpen, userName, userPhone, userEmail]);

  if (!isOpen) return null;

  // Format Supabase bookings
  const formattedDbBookings = dbBookings.map((b) => ({
    id: b.booking_code || b.id || 'CK-BK',
    companionName: b.companion_name || 'Verified Companion',
    companionAvatar: b.companion_avatar || 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&auto=format&fit=crop&q=80',
    service: b.service_title || 'Lifestyle Companion Session',
    date: b.booking_date || 'Today',
    time: `${b.hours || 4} Hours Outing`,
    city: b.city || 'Delhi NCR',
    location: `${b.city || 'Premier Venue'} (PIN: ${b.pin_code || '110001'})`,
    pinCode: b.pin_code || '110001',
    status: b.status === 'confirmed' ? 'Confirmed & Scheduled' : 'Pending Companion Confirmation',
    isConfirmed: b.status === 'confirmed',
    amount: b.total_price ? `₹${Number(b.total_price).toLocaleString('en-IN')}.00` : '₹1,770.00',
    companionPhone: b.status === 'confirmed' ? '+91 97193 33339' : 'Unlocked upon confirmation',
    clientName: b.client_name,
    rating: '5.0 ★',
    completionOtp: b.completion_otp || '4829',
  }));

  // Convert any usedCredits into bookings format
  const dynamicBookings = usedCredits.map((c, i) => ({
    id: c.bookingCode ? c.bookingCode.replace('Booking: #', '') : `BK-${80000 + i}`,
    companionName: c.bookedCompanion || 'Verified Companion',
    companionAvatar: c.bookedCompanionAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    service: c.displayTitle || c.serviceName,
    date: c.bookedDate || c.purchasedDate || 'Scheduled Outing',
    time: 'Confirmed Timing',
    city: 'Delhi NCR',
    location: 'Selected Premium Venue',
    pinCode: '110001',
    status: 'Booking Confirmed',
    isConfirmed: true,
    amount: c.price,
    companionPhone: '+91 97193 33339',
    clientName: userName || 'Seeker',
    rating: '5.0 ★',
    completionOtp: '4829',
  }));

  // Combine database bookings with used credits, deduplicating by ID
  const combinedMap = new Map<string, any>();
  formattedDbBookings.forEach((b) => combinedMap.set(b.id, b));
  dynamicBookings.forEach((b) => {
    if (!combinedMap.has(b.id)) combinedMap.set(b.id, b);
  });

  const allBookings = Array.from(combinedMap.values());

  return (
    <div 
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md animate-fade-in"
    >
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-stone-200 shadow-[0_25px_70px_rgba(0,0,0,0.18)] relative overflow-y-auto max-h-[90vh] no-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-stone-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-pink-50 text-[#FF2D55] flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-black text-xl sm:text-2xl text-[#111827]">
                My Bookings ({allBookings.length})
              </h2>
              <p className="text-xs text-[#6B7280]">
                Live bookings from database, scheduled outings &amp; meeting details
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-center justify-center gap-2 py-8 text-xs font-bold text-stone-500">
            <RefreshCw className="w-4 h-4 animate-spin text-[#FF2D55]" />
            <span>Connecting to Supabase database...</span>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && allBookings.length === 0 && (
          <div className="text-center py-12 px-4 bg-stone-50 rounded-3xl border border-dashed border-stone-300 mb-6">
            <div className="w-12 h-12 rounded-full bg-pink-100 text-[#FF2D55] flex items-center justify-center mx-auto mb-3">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-base text-[#111827] mb-1">
              No Bookings Yet
            </h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto mb-5">
              You haven't confirmed any companion bookings yet. Choose from 100 verified model companions across premier cities!
            </p>
            {onFindCompanion && (
              <button
                onClick={() => {
                  onClose();
                  onFindCompanion();
                }}
                className="px-6 py-2.5 rounded-full bg-[#0071E3] hover:bg-[#0077ED] text-white text-xs font-bold transition shadow-sm inline-flex items-center gap-1.5"
              >
                <span>Browse Companions</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}

        {/* Bookings List */}
        {!isLoading && allBookings.length > 0 && (
          <div className="space-y-4 mb-6">
            {allBookings.map((b, idx) => (
              <div
                key={`${b.id}-${idx}`}
                className="p-5 rounded-3xl bg-[#FAF8F8] border border-pink-100 hover:border-pink-300 transition shadow-xs flex flex-col gap-4"
              >
                {/* Top companion info row */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <div className="relative">
                      <img
                        src={b.companionAvatar}
                        alt={b.companionName}
                        className="w-13 h-13 rounded-2xl object-cover ring-2 ring-pink-200 shadow-xs"
                      />
                      <div className="absolute -bottom-1 -right-1 bg-[#0071e3] text-white p-0.5 rounded-full ring-1 ring-white">
                        <CheckCircle2 className="w-3 h-3" />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-sm sm:text-base text-[#111827]">
                        <span>{b.companionName}</span>
                        <ShieldCheck className="w-4 h-4 text-[#0071e3]" />
                        <span className="text-[11px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                          {b.rating}
                        </span>
                      </div>
                      <div className="text-xs text-[#6B7280] font-medium">
                        {b.service}
                      </div>
                      {b.clientName && (
                        <div className="text-[11px] text-[#86868b]">
                          Booked for: <strong className="text-stone-700">{b.clientName}</strong>
                        </div>
                      )}
                    </div>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-[11px] font-bold shrink-0 ${
                    b.isConfirmed
                      ? 'bg-emerald-100/80 text-emerald-800'
                      : 'bg-amber-100 text-amber-900 border border-amber-200'
                  }`}>
                    {b.status}
                  </span>
                </div>

                {/* Booking metadata details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#4B5563] bg-white p-3.5 rounded-2xl border border-stone-200/60">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-[#FF2D55]" />
                    <span>{b.date} &bull; {b.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#0071e3]" />
                    <span className="truncate">{b.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-stone-500">
                    <span>Booking Ref: <strong className="font-mono text-[#111827]">{b.id}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-stone-500">Total Price:</span>
                    <span className="font-bold text-[#111827]">{b.amount}</span>
                  </div>
                </div>

                {/* Outing Completion OTP & Escrow Protection */}
                <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-start sm:items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                      <KeyRound className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-amber-900 flex items-center gap-1.5">
                        <span>Outing Completion OTP</span>
                        <span className="text-[10px] bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded-full font-semibold">
                          Escrow Protected
                        </span>
                      </div>
                      <p className="text-[11px] text-amber-700 leading-tight mt-0.5">
                        Share this 4-digit code with your companion ONLY after the meeting finishes to release their payout.
                      </p>
                    </div>
                  </div>

                  <div className="text-center sm:text-right shrink-0 bg-white sm:bg-transparent p-2 sm:p-0 rounded-xl border sm:border-0 border-amber-200">
                    <span className="text-[10px] uppercase font-bold text-amber-800 block">Your Secret OTP</span>
                    <span className="font-mono font-black text-lg text-amber-900 tracking-widest bg-amber-100/70 px-3 py-1 rounded-xl border border-amber-300 inline-block mt-0.5">
                      {b.completionOtp || '4829'}
                    </span>
                  </div>
                </div>

                {/* Direct call banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 pt-1 text-xs">
                  <span className="text-stone-500">Companion Direct Contact:</span>
                  <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200 w-fit">
                    {b.companionPhone}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          {onFindCompanion && (
            <button
              onClick={() => {
                onClose();
                onFindCompanion();
              }}
              className="w-full sm:flex-1 py-3 rounded-2xl bg-[#FF2D55] hover:bg-[#E11D48] text-white font-bold text-xs sm:text-sm transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <UserCheck className="w-4 h-4" />
              <span>Book Another Companion</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-stone-100 hover:bg-stone-200 text-[#111827] font-bold text-xs sm:text-sm transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyBookingsModal;
