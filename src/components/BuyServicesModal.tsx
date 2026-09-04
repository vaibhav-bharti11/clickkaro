import React, { useState } from 'react';
import { X, CheckCircle2, Sparkles, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ServiceCredit } from '../types';
import { recordPaymentInSupabase } from '../services/supabase';

interface BuyServiceOption {
  id: string;
  name: string;
  priceNum: number;
  priceFormatted: string;
}

const BUY_SERVICE_OPTIONS: BuyServiceOption[] = [
  { id: 'event-partner', name: 'Event Partner', priceNum: 2000, priceFormatted: '₹2000/session' },
  { id: 'city-tour-partner', name: 'City Tour Partner', priceNum: 2000, priceFormatted: '₹2000/session' },
  { id: 'gaming-partner', name: '- Gaming Partner ( Physical)', priceNum: 1800, priceFormatted: '₹1800/session' },
  { id: 'concert-partner', name: 'Concert Partner', priceNum: 2000, priceFormatted: '₹2000/session' },
  { id: 'coffee-partner', name: 'Coffee Partner', priceNum: 1500, priceFormatted: '₹1500/session' },
  { id: 'cafe-food-partner', name: 'Cafe & Food Partner', priceNum: 2000, priceFormatted: '₹2000/session' },
  { id: 'professional-networking', name: 'Professional Networking Partner', priceNum: 1500, priceFormatted: '₹1500/session' },
  { id: 'hangout-partner', name: 'Hangout Outing Partner', priceNum: 1770, priceFormatted: '₹1770/session' },
  { id: 'movie-partner', name: 'Movie Partner', priceNum: 2000, priceFormatted: '₹2000/session' },
];

interface BuyServicesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPurchaseSuccess: (credit: ServiceCredit) => void;
}

export const BuyServicesModal: React.FC<BuyServicesModalProps> = ({
  isOpen,
  onClose,
  onPurchaseSuccess,
}) => {
  const [selectedService, setSelectedService] = useState<BuyServiceOption | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  if (!isOpen) return null;

  const handlePay = () => {
    if (!selectedService) return;
    setIsProcessing(true);

    // Simulate instant secure payment confirmation
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });

      const today = new Date();
      const newCredit: ServiceCredit = {
        id: `cred-${Date.now()}`,
        serviceId: selectedService.id,
        serviceName: selectedService.name.replace(/^[-\s]+/, ''),
        displayTitle: selectedService.name.replace(/^[-\s]+/, ''),
        price: `₹${selectedService.priceNum.toLocaleString('en-IN')}.00`,
        priceNum: selectedService.priceNum,
        purchasedDate: `Purchased ${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`,
        status: 'available',
      };

      // Ingest payment transaction into Supabase database
      recordPaymentInSupabase({
        service_id: selectedService.id,
        service_name: selectedService.name.replace(/^[-\s]+/, ''),
        category: 'Wallet Recharge Credit',
        amount: selectedService.priceNum,
        amount_formatted: `₹${selectedService.priceNum.toLocaleString('en-IN')}.00`,
        payment_method: 'Razorpay UPI (Instant)',
        status: 'Success',
      });

      setTimeout(() => {
        setPaymentSuccess(false);
        setSelectedService(null);
        onPurchaseSuccess(newCredit);
        onClose();
      }, 1400);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] flex flex-col shadow-[0_25px_70px_rgba(0,0,0,0.18)] border border-stone-200 overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#FF2D55]" />
            <h2 className="font-display font-bold text-lg text-[#111827]">Buy Services</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-stone-100 flex items-center justify-center text-stone-400 hover:text-stone-700 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {paymentSuccess ? (
          /* Payment Success Confirmation */
          <div className="p-8 flex flex-col items-center text-center space-y-4 animate-scale-up">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-md">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-[#111827]">Payment Confirmed!</h3>
            <p className="text-xs text-[#6B7280]">
              Your service credit has been added to your wallet. You can now book verified companions immediately!
            </p>
            <div className="font-mono font-bold text-sm text-[#FF2D55] bg-pink-50 px-4 py-2 rounded-xl border border-pink-200">
              +{selectedService?.name} (Credit Added)
            </div>
          </div>
        ) : (
          /* Service Selection List (Exact Image 2 Replica) */
          <>
            <div className="p-4 sm:p-5 overflow-y-auto space-y-3 flex-1 divide-y-0">
              {BUY_SERVICE_OPTIONS.map((svc) => {
                const isSelected = selectedService?.id === svc.id;
                return (
                  <div
                    key={svc.id}
                    onClick={() => setSelectedService(svc)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'border-[#9333EA] bg-purple-50/60 shadow-xs ring-2 ring-[#9333EA]/30'
                        : 'border-stone-200 hover:border-pink-200 hover:bg-stone-50/70'
                    }`}
                  >
                    <div>
                      <h3 className="font-display font-bold text-sm text-[#111827]">
                        {svc.name}
                      </h3>
                      <p className="text-xs font-extrabold text-[#7E22CE] mt-0.5 font-sans">
                        {svc.priceFormatted}
                      </p>
                    </div>

                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                      isSelected
                        ? 'border-[#9333EA] bg-[#9333EA] text-white'
                        : 'border-stone-300 bg-white'
                    }`}>
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Actions Bar (Matching Image 2: Cancel & Pay buttons) */}
            <div className="p-4 sm:p-5 border-t border-stone-100 bg-white flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isProcessing}
                className="flex-1 py-3 px-4 rounded-2xl bg-white hover:bg-stone-100 text-[#374151] border border-stone-300 font-bold text-xs sm:text-sm transition cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handlePay}
                disabled={!selectedService || isProcessing}
                className={`flex-1 py-3 px-4 rounded-2xl font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                  selectedService && !isProcessing
                    ? 'bg-gradient-to-r from-[#FF2D55] via-[#E11D48] to-[#9333EA] text-white shadow-pink-500/25 hover:opacity-95 active:scale-98'
                    : 'bg-[#C084FC]/40 text-white/70 cursor-not-allowed'
                }`}
              >
                {isProcessing ? (
                  <span>Processing...</span>
                ) : (
                  <span>Pay ₹{selectedService ? selectedService.priceNum : 0}</span>
                )}
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
};
export default BuyServicesModal;
