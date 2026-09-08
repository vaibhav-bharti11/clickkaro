import React, { useState } from 'react';
import { X, CheckCircle2, Sparkles, Check, Clock, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ServiceCredit, ServiceItem } from '../types';
import { ALL_SERVICES } from '../data/servicesData';
import { recordPaymentInSupabase } from '../services/supabase';

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
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
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
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });

      const today = new Date();
      const newCredit: ServiceCredit = {
        id: `cred-${Date.now()}`,
        serviceId: selectedService.id,
        serviceName: selectedService.title,
        displayTitle: `${selectedService.title} (${selectedService.duration})`,
        price: `₹${selectedService.pricePerHour.toLocaleString('en-IN')}.00`,
        priceNum: selectedService.pricePerHour,
        purchasedDate: `Purchased ${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`,
        status: 'available',
      };

      // Ingest payment transaction into Supabase database
      recordPaymentInSupabase({
        service_id: selectedService.id,
        service_name: `${selectedService.title} (${selectedService.duration})`,
        category: 'Wallet Recharge Credit',
        amount: selectedService.pricePerHour,
        amount_formatted: `₹${selectedService.pricePerHour.toLocaleString('en-IN')}.00`,
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
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-[0_25px_70px_rgba(0,0,0,0.18)] border border-pink-200 overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-stone-100 flex items-center justify-between bg-gradient-to-r from-pink-50/50 to-white">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#FF2D55]" />
              <h2 className="font-display font-black text-lg text-[#111827]">Buy Service Credits</h2>
            </div>
            <p className="text-xs text-[#6B7280] mt-0.5 font-medium">
              Official packages matching our verified companion services
            </p>
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
            <p className="text-xs text-[#6B7280] max-w-xs">
              Your service credit for <strong className="text-[#111827]">{selectedService?.title} ({selectedService?.duration})</strong> has been added to your wallet. You can book verified companions immediately!
            </p>
            <div className="font-mono font-bold text-sm text-[#FF2D55] bg-pink-50 px-4 py-2 rounded-xl border border-pink-200 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>+{selectedService?.title} Credit Added</span>
            </div>
          </div>
        ) : (
          /* Service Selection List (Unified with Home Page ALL_SERVICES) */
          <>
            <div className="p-4 sm:p-5 overflow-y-auto space-y-3 flex-1 no-scrollbar">
              <div className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-1 flex items-center justify-between">
                <span>Select Package to Recharge Wallet</span>
                <span className="text-emerald-700 font-semibold">100% Refundable</span>
              </div>

              {ALL_SERVICES.map((svc) => {
                const isSelected = selectedService?.id === svc.id;
                return (
                  <div
                    key={svc.id}
                    onClick={() => setSelectedService(svc)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'border-[#FF2D55] bg-pink-50/70 shadow-sm ring-2 ring-[#FF2D55]/30'
                        : 'border-stone-200/90 hover:border-pink-200 hover:bg-stone-50/80'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-11 h-11 rounded-2xl bg-white border border-pink-100 flex items-center justify-center text-xl shadow-xs shrink-0">
                        {svc.emoji}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-display font-bold text-sm text-[#111827] truncate">
                            {svc.title}
                          </h3>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-stone-100 border border-stone-200 text-[10px] font-bold text-stone-700 shrink-0">
                            <Clock className="w-2.5 h-2.5 text-[#00C7BE]" />
                            <span>{svc.duration}</span>
                          </span>
                        </div>
                        <p className="text-xs text-[#6B7280] truncate mt-0.5">
                          {svc.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <div className="font-display font-black text-sm text-[#111827] tabular-numbers">
                          ₹{svc.pricePerHour.toLocaleString('en-IN')}
                        </div>
                        <div className="text-[10px] text-pink-600 font-bold">
                          {svc.duration}
                        </div>
                      </div>

                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                        isSelected
                          ? 'border-[#FF2D55] bg-[#FF2D55] text-white'
                          : 'border-stone-300 bg-white'
                      }`}>
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Actions Bar */}
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
                    : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                }`}
              >
                {isProcessing ? (
                  <span>Processing...</span>
                ) : (
                  <span>
                    Pay ₹{selectedService ? selectedService.pricePerHour.toLocaleString('en-IN') : 0}
                  </span>
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

