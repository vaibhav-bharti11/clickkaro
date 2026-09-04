import React from 'react';
import { X, ShieldCheck, CheckCircle2, MapPin, Calendar, Clock, Sparkles } from 'lucide-react';
import { BookingRequest } from '../types';

interface SeekerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: BookingRequest | null;
  onAccept: (bookingId: string) => void;
}

export const SeekerProfileModal: React.FC<SeekerProfileModalProps> = ({
  isOpen,
  onClose,
  booking,
  onAccept,
}) => {
  if (!isOpen || !booking) return null;

  // Sample verified photos for seeker profile display
  const samplePhotos = [
    booking.seekerAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[185] flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-fade-in"
    >
      <div className="bg-white/95 backdrop-blur-2xl rounded-3xl max-w-md w-full p-6 sm:p-8 border border-pink-200 shadow-apple-float relative overflow-y-auto max-h-[90vh] no-scrollbar">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-pink-50 hover:bg-pink-100 flex items-center justify-center text-[#1d1d1f] transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Profile Photo */}
        <div className="text-center mb-5">
          <div className="relative w-24 h-24 mx-auto rounded-full overflow-hidden ring-4 ring-pink-200 shadow-md mb-3 bg-pink-50">
            <img
              src={samplePhotos[0]}
              alt={booking.seekerName}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-1 right-1 bg-[#0071e3] p-1 rounded-full text-white ring-2 ring-white">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>

          <h3 className="text-xl font-bold text-[#1d1d1f] font-display flex items-center justify-center gap-1.5">
            <span>{booking.seekerName}</span>
            <ShieldCheck className="w-4 h-4 text-[#0071e3]" />
          </h3>
          <p className="text-xs text-[#86868b] mt-0.5">
            {booking.location} &bull; PIN {booking.pinCode}
          </p>

          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold mt-2 border border-emerald-200">
            <Sparkles className="w-3 h-3" />
            <span>100% Face KYC Verified</span>
          </div>
        </div>

        {/* VERIFIED PHOTOS GALLERY */}
        <div className="mb-5">
          <div className="text-xs font-bold text-[#1d1d1f] mb-2 flex items-center justify-between">
            <span>Verified Member Photos ({samplePhotos.length})</span>
            <span className="text-[10px] text-[#0071e3] font-bold">Passed Liveness Check</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {samplePhotos.map((img, i) => (
              <div key={i} className="aspect-square rounded-2xl overflow-hidden border border-pink-200 shadow-xs">
                <img src={img} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* BOOKING DETAILS CARD */}
        <div className="bg-[#fdf8f8] p-4 rounded-2xl border border-pink-200/80 mb-6 space-y-2.5 text-xs">
          <div className="flex justify-between items-center pb-2 border-b border-pink-100">
            <span className="font-bold text-[#1d1d1f]">{booking.serviceTitle}</span>
            <span className="font-bold text-emerald-600 text-sm">
              Your 80%: ₹{booking.netPayout.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[#86868b]">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#0071e3]" />
              <span>{booking.date}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              <span>{booking.hours} Hours Session</span>
            </div>
            <div className="flex items-center gap-1.5 col-span-2">
              <MapPin className="w-3.5 h-3.5 text-pink-500" />
              <span>{booking.location} (PIN {booking.pinCode})</span>
            </div>
          </div>
        </div>

        {/* INTERACTIVE ACTIONS (Chat and call removed per instructions) */}
        <div>
          <button
            type="button"
            onClick={() => {
              onAccept(booking.id);
              onClose();
            }}
            className="w-full bg-[#0071e3] hover:bg-[#0077ed] text-white py-3.5 rounded-full font-bold text-xs sm:text-sm transition shadow-apple-sm flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Confirm &amp; Accept Booking</span>
          </button>
        </div>

      </div>
    </div>
  );
};
export default SeekerProfileModal;
