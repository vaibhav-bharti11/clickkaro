import React, { useState, useEffect } from 'react';
import { X, Receipt, CheckCircle2, ArrowRight, CreditCard, RefreshCw } from 'lucide-react';
import { ServiceCredit } from '../types';
import { fetchUserPaymentsFromSupabase } from '../services/supabase';

interface TransactionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBuyServices?: () => void;
  availableCredits?: ServiceCredit[];
  userName?: string;
  userPhone?: string;
  userEmail?: string;
}

export const TransactionsModal: React.FC<TransactionsModalProps> = ({
  isOpen,
  onClose,
  onBuyServices,
  availableCredits = [],
  userName,
  userPhone,
  userEmail,
}) => {
  const [dbPayments, setDbPayments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    const loadPayments = async () => {
      setIsLoading(true);
      try {
        const resolvedName = userName || localStorage.getItem('ck_user_name');
        const resolvedPhone = userPhone || localStorage.getItem('ck_user_phone');
        const resolvedEmail = userEmail || localStorage.getItem('ck_user_email');

        const data = await fetchUserPaymentsFromSupabase({
          name: resolvedName,
          phone: resolvedPhone,
          email: resolvedEmail,
        });

        if (isMounted && data) {
          setDbPayments(data);
        }
      } catch (err) {
        console.warn('[TransactionsModal] Error loading payments from Supabase:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadPayments();

    return () => {
      isMounted = false;
    };
  }, [isOpen, userName, userPhone, userEmail]);

  if (!isOpen) return null;

  // Map dynamic purchased credits from local storage / state as fallback if not in DB yet
  const dynamicTxns = availableCredits.map((c, i) => ({
    transaction_id: `TXN-${9100 + i}`,
    service_name: c.displayTitle || c.serviceName,
    category: 'Wallet Recharge Credit',
    amount_formatted: c.price,
    amount: c.priceNum,
    created_at: c.purchasedDate || 'Recent Transaction',
    payment_method: 'Razorpay Instant UPI',
    status: 'Success',
    invoice_id: `INV-2026-${9100 + i}`,
  }));

  // Combine database payments with any unsynced dynamic credits, deduplicating by ID
  const txnMap = new Map<string, any>();
  dbPayments.forEach((p) => txnMap.set(p.transaction_id || p.id, p));
  dynamicTxns.forEach((t) => {
    if (!txnMap.has(t.transaction_id)) txnMap.set(t.transaction_id, t);
  });

  const allTransactions = Array.from(txnMap.values());

  // Calculate real total spent from database records
  const totalSpentNum = allTransactions.reduce((acc, curr) => {
    const val = Number(curr.amount) || parseFloat(String(curr.amount_formatted || '').replace(/[^\d.]/g, '')) || 0;
    return acc + val;
  }, 0);

  const formattedTotalSpent = `₹${totalSpentNum.toLocaleString('en-IN')}.00`;

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
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-black text-xl sm:text-2xl text-[#111827]">
                Payment History ({allTransactions.length})
              </h2>
              <p className="text-xs text-[#6B7280]">
                Live transactions from database, wallet recharges &amp; GST invoices
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

        {/* Summary Metrics Cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200/70 text-center">
            <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider block">
              Total Spent
            </span>
            <span className="font-display font-black text-base sm:text-lg text-emerald-900 mt-0.5 block">
              {formattedTotalSpent}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-pink-50/60 border border-pink-200/70 text-center">
            <span className="text-[10px] uppercase font-bold text-[#FF2D55] tracking-wider block">
              Wallet Credits
            </span>
            <span className="font-display font-black text-base sm:text-lg text-[#111827] mt-0.5 block">
              {availableCredits.length} Active Credit{availableCredits.length !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-purple-50/60 border border-purple-200/70 text-center">
            <span className="text-[10px] uppercase font-bold text-purple-800 tracking-wider block">
              Payment Gateway
            </span>
            <span className="font-display font-black text-xs sm:text-sm text-purple-900 mt-1.5 block font-mono">
              Razorpay UPI
            </span>
          </div>
        </div>

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-center justify-center gap-2 py-8 text-xs font-bold text-stone-500">
            <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" />
            <span>Fetching live payments from database...</span>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && allTransactions.length === 0 && (
          <div className="text-center py-12 px-4 bg-stone-50 rounded-3xl border border-dashed border-stone-300 mb-6">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
              <Receipt className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-base text-[#111827] mb-1">
              No Payment History
            </h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto mb-5">
              You have not made any payments or wallet recharges yet. Recharge your wallet to book companions instantly.
            </p>
            {onBuyServices && (
              <button
                onClick={() => {
                  onClose();
                  onBuyServices();
                }}
                className="px-6 py-2.5 rounded-full bg-[#111827] hover:bg-[#FF2D55] text-white text-xs font-bold transition shadow-sm inline-flex items-center gap-1.5 cursor-pointer"
              >
                <span>Buy Services / Recharge</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}

        {/* Transactions List */}
        {!isLoading && allTransactions.length > 0 && (
          <div className="space-y-3 mb-6">
            {allTransactions.map((t) => {
              const formattedDate = t.created_at
                ? (t.created_at.includes('T') ? new Date(t.created_at).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  }) : t.created_at)
                : 'Today';

              return (
                <div
                  key={t.transaction_id || t.id}
                  className="p-4 rounded-2xl bg-[#FAF8F8] border border-stone-200 hover:border-emerald-300 transition shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#111827]">{t.service_name}</span>
                      <span className="text-[10px] font-semibold text-stone-600 bg-white border border-stone-200 px-2 py-0.5 rounded-full">
                        {t.category || 'Booking Payment'}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#6B7280] flex items-center gap-1.5 flex-wrap">
                      <span>Txn: <strong className="font-mono text-[#111827]">{t.transaction_id || t.id}</strong></span>
                      <span>&bull;</span>
                      <span>{formattedDate}</span>
                      <span>&bull;</span>
                      <span>via {t.payment_method || 'Razorpay UPI'}</span>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1 border-t sm:border-t-0 pt-2 sm:pt-0 border-stone-200">
                    <span className="font-mono font-black text-sm text-[#111827]">
                      {t.amount_formatted || `₹${Number(t.amount).toLocaleString('en-IN')}.00`}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>{t.status || 'Success'}</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          {onBuyServices && (
            <button
              onClick={() => {
                onClose();
                onBuyServices();
              }}
              className="w-full sm:flex-1 py-3 rounded-2xl bg-[#111827] hover:bg-[#FF2D55] text-white font-bold text-xs sm:text-sm transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <CreditCard className="w-4 h-4" />
              <span>Buy More Services</span>
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

export default TransactionsModal;
