import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, AlertTriangle, Scale, Lock, RefreshCw, HelpCircle } from 'lucide-react';

interface LegalPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'privacy' | 'refund' | 'conduct' | 'grievance' | 'terms';
  initialTab?: 'privacy' | 'refund' | 'conduct' | 'grievance' | 'terms';
}

export const LegalPolicyModal: React.FC<LegalPolicyModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'conduct',
  initialTab,
}) => {
  const chosenTab = initialTab || defaultTab;
  const normalizedTab = chosenTab === 'terms' ? 'conduct' : (chosenTab as 'privacy' | 'refund' | 'conduct' | 'grievance');
  const [activeTab, setActiveTab] = useState<'privacy' | 'refund' | 'conduct' | 'grievance'>(normalizedTab);

  React.useEffect(() => {
    if (chosenTab) {
      setActiveTab(chosenTab === 'terms' ? 'conduct' : (chosenTab as any));
    }
  }, [chosenTab, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-pink-100 overflow-hidden font-sans">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between bg-gradient-to-r from-pink-50/50 via-white to-white">
          <div className="flex items-center gap-3">
            <img 
              src="/assets/brand_logo.png" 
              alt="Click Karo Date Karo" 
              className="h-8 w-auto object-contain"
            />
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#FF2D55]" />
                <h2 className="font-display font-black text-lg text-[#111827]">
                  Click Karo Date Karo Legal &amp; Policy Portal
                </h2>
              </div>
              <p className="text-[11px] text-stone-500 font-medium">
                Operated by Amber Ventures (OPC) Pvt Ltd • Statutory Compliance under IT Act, 2000 &amp; DPDP Act, 2023
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-stone-100 flex items-center justify-center text-stone-400 hover:text-stone-700 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-stone-100 px-6 bg-stone-50/50 overflow-x-auto gap-2 py-2">
          <button
            onClick={() => setActiveTab('conduct')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'conduct'
                ? 'bg-[#111827] text-white shadow-xs'
                : 'text-stone-600 hover:bg-white'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Code of Conduct</span>
          </button>

          <button
            onClick={() => setActiveTab('privacy')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'privacy'
                ? 'bg-[#111827] text-white shadow-xs'
                : 'text-stone-600 hover:bg-white'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Privacy Policy (DPDP 2023)</span>
          </button>

          <button
            onClick={() => setActiveTab('refund')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'refund'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-stone-600 hover:bg-white'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>100% Refund &amp; Cancellation</span>
          </button>

          <button
            onClick={() => setActiveTab('grievance')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'grievance'
                ? 'bg-[#0071E3] text-white shadow-xs'
                : 'text-stone-600 hover:bg-white'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Safety &amp; Grievance Redressal</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-stone-700 text-xs sm:text-sm leading-relaxed">
          
          {/* TAB 1: CODE OF CONDUCT */}
          {activeTab === 'conduct' && (
            <div className="space-y-5 animate-fade-in">
              <div className="p-4 rounded-2xl bg-pink-50/60 border border-pink-100 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-[#FF2D55] shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-sm text-[#111827]">
                    Official Code of Conduct &amp; Platform Rules
                  </h3>
                  <p className="text-xs text-stone-600 mt-1">
                    Click Karo Date Karo (a unit of Amber Ventures (OPC) Pvt Ltd) strictly provides dignified, verified social companionship and lifestyle accompaniment for public venues. We maintain zero tolerance for any misconduct.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <section>
                  <h4 className="font-bold text-sm text-[#111827] mb-1.5">1. Strict Public-Venue Mandate</h4>
                  <p className="text-xs text-stone-600">
                    All companion meetups, coffee sessions, dining, events, and hangouts must occur exclusively in verified public venues (cafes, malls, multiplexes, reputable restaurants, exhibitions, or tourist attractions). Companions and seekers are strictly barred from meeting in private residences, hotel rooms, or secluded private properties.
                  </p>
                </section>

                <section>
                  <h4 className="font-bold text-sm text-[#111827] mb-1.5">2. Absolute Prohibition of Adult or Escort Services</h4>
                  <p className="text-xs text-stone-600">
                    Click Karo Date Karo does NOT provide, encourage, or facilitate adult entertainment, escorting, sexual services, or commercial dating. Any user attempting to solicit unpermitted activities will be permanently banned immediately, have their security deposit forfeited, and will be reported to law enforcement authorities under the Information Technology Act and Bharatiya Nyaya Sanhita.
                  </p>
                </section>

                <section>
                  <h4 className="font-bold text-sm text-[#111827] mb-1.5">3. Mutual Respect, Dignity &amp; Personal Boundaries</h4>
                  <p className="text-xs text-stone-600">
                    Companions and clients are autonomous individuals entitled to complete physical and emotional boundaries. Unwanted physical contact, verbal harassment, coercion, offensive language, or intoxication during sessions is strictly prohibited.
                  </p>
                </section>

                <section>
                  <h4 className="font-bold text-sm text-[#111827] mb-1.5">4. Booking Protocol &amp; OTP Completion</h4>
                  <p className="text-xs text-stone-600">
                    Every session is booked via the official Click Karo Date Karo portal. At the conclusion of a successful session, the companion provides a 4-digit session completion OTP to ensure accurate hours and safety accounting. Offline, unmonitored cash deals outside the platform void all safety guarantees.
                  </p>
                </section>

                <section>
                  <h4 className="font-bold text-sm text-[#111827] mb-1.5">5. Minimum Age Requirement</h4>
                  <p className="text-xs text-stone-600">
                    Users and companions must be at least 18 years of age. All users must verify their age via Aadhaar KYC and biometric face matching.
                  </p>
                </section>
              </div>
            </div>
          )}

          {/* TAB 2: PRIVACY POLICY */}
          {activeTab === 'privacy' && (
            <div className="space-y-5 animate-fade-in">
              <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 flex items-start gap-3">
                <Lock className="w-5 h-5 text-[#0071E3] shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-sm text-[#111827]">
                    Privacy Policy &amp; Data Protection (DPDP Act, 2023)
                  </h3>
                  <p className="text-xs text-stone-600 mt-1">
                    Operated by Click Karo Date Karo (A unit of AMBER VENTURES (OPC) PVT LTD). We honor your right to privacy with cryptographic safeguards and zero data monetization.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <section>
                  <h4 className="font-bold text-sm text-[#111827] mb-1.5">1. Information We Collect</h4>
                  <ul className="list-disc pl-5 space-y-1 text-xs text-stone-600">
                    <li><strong>Account Identifiers:</strong> Name, verified phone number, email address, and city/pin code.</li>
                    <li><strong>Identity Verification:</strong> Masked Aadhaar number and live facial biometric selfie for identity verification. Aadhaar images are immediately redacted and securely vaulted.</li>
                    <li><strong>Booking Records:</strong> Service chosen, scheduled date/time, venue details, and payment transaction IDs.</li>
                  </ul>
                </section>

                <section>
                  <h4 className="font-bold text-sm text-[#111827] mb-1.5">2. Zero Third-Party Selling</h4>
                  <p className="text-xs text-stone-600">
                    Click Karo Date Karo will never sell, lease, or rent your personal identifiable information or phone number to any third-party marketing agency or ad network.
                  </p>
                </section>

                <section>
                  <h4 className="font-bold text-sm text-[#111827] mb-1.5">3. Data Security &amp; Encryption</h4>
                  <p className="text-xs text-stone-600">
                    All communication between your browser and our servers is secured via 256-bit TLS encryption. Sensitive KYC data is encrypted at rest using industry standard AES-256 protocols.
                  </p>
                </section>

                <section>
                  <h4 className="font-bold text-sm text-[#111827] mb-1.5">4. Right to Erasure &amp; Portability</h4>
                  <p className="text-xs text-stone-600">
                    In compliance with the Digital Personal Data Protection Act, you may request full deletion of your account and associated records by emailing <strong>privacy@clickkarodatekaro.com</strong>.
                  </p>
                </section>
              </div>
            </div>
          )}

          {/* TAB 3: 100% REFUND & CANCELLATION */}
          {activeTab === 'refund' && (
            <div className="space-y-5 animate-fade-in">
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex items-start gap-3">
                <RefreshCw className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-sm text-[#111827]">
                    100% Money-Back &amp; Hassle-Free Cancellation Policy
                  </h3>
                  <p className="text-xs text-stone-600 mt-1">
                    At Click Karo Date Karo, your peace of mind and trust are paramount. We back every session with a clear, automated refund promise.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <section className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
                  <h4 className="font-bold text-sm text-emerald-700 mb-2">When You Receive a 100% Full Refund:</h4>
                  <ul className="space-y-2 text-xs text-stone-600">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Companion Non-Arrival / Cancellation:</strong> If a confirmed companion cancels or fails to arrive at the agreed venue, a 100% refund is initiated immediately.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Early Client Cancellation:</strong> Cancellations made at least 2 hours before the scheduled session start time are eligible for a 100% refund without deduction.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Unfulfilled Booking Request:</strong> If a booking remains unconfirmed or companion matching is unavailable, 100% of your credit/charge is refunded instantly.</span>
                    </li>
                  </ul>
                </section>

                <section>
                  <h4 className="font-bold text-sm text-[#111827] mb-1.5">Refund Settlement Timeline</h4>
                  <p className="text-xs text-stone-600">
                    Refunds can be credited instantly to your Click Karo Date Karo wallet for re-booking or returned to the original source payment method (UPI / Net Banking) within 24 to 48 business hours.
                  </p>
                </section>

                <section>
                  <h4 className="font-bold text-sm text-[#111827] mb-1.5">Dispute Escalation</h4>
                  <p className="text-xs text-stone-600">
                    If an outing was cut short due to companion misconduct or mismatch, contact our priority grievance desk with your Booking ID at <strong>grievance@clickkarodatekaro.com</strong>.
                  </p>
                </section>
              </div>
            </div>
          )}

          {/* TAB 4: SAFETY & GRIEVANCE */}
          {activeTab === 'grievance' && (
            <div className="space-y-5 animate-fade-in">
              <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100 flex items-start gap-3">
                <HelpCircle className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-sm text-[#111827]">
                    Safety SOS &amp; Statutory Grievance Redressal
                  </h3>
                  <p className="text-xs text-stone-600 mt-1">
                    Appointed pursuant to Rule 3(2) of the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021.
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl border border-stone-200 bg-white space-y-3">
                <h4 className="font-bold text-sm text-[#111827]">Official Grievance Officer</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-stone-600">
                  <div>
                    <p className="text-stone-400 font-medium">Designated Officer</p>
                    <p className="font-bold text-[#111827]">Nodal Grievance Redressal Officer</p>
                  </div>
                  <div>
                    <p className="text-stone-400 font-medium">Corporate Entity</p>
                    <p className="font-bold text-[#111827]">Amber Ventures (OPC) Pvt Ltd</p>
                  </div>
                  <div>
                    <p className="text-stone-400 font-medium">Grievance Email</p>
                    <p className="font-bold text-[#FF2D55]">grievance@clickkarodatekaro.com</p>
                  </div>
                  <div>
                    <p className="text-stone-400 font-medium">Data Protection Officer (DPO)</p>
                    <p className="font-bold text-[#0071E3]">dpo@clickkarodatekaro.com</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-100 text-xs text-stone-500">
                  <p><strong>Turnaround Time:</strong> Grievance tickets are formally acknowledged within 24 hours and fully investigated and resolved within 15 calendar days.</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 text-xs text-stone-600 space-y-1">
                <p><strong>Official Web Portal:</strong> www.clickkarodatekaro.com</p>
                <p><strong>Helpline / Support:</strong> support@clickkarodatekaro.com</p>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-stone-100 flex items-center justify-between bg-stone-50">
          <span className="text-[11px] text-stone-500">
            © 2026 Click Karo Date Karo. All rights reserved.
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-[#111827] hover:bg-[#FF2D55] text-white font-bold text-xs transition cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
