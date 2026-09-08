import React, { useState } from 'react';
import { X, ShieldCheck, Lock, RefreshCw, FileText, CheckCircle2, AlertTriangle, Building2, Scale } from 'lucide-react';
import { useCms } from '../context/CmsContext';

export type PolicyTab = 'privacy' | 'refund' | 'terms';

interface LegalPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: PolicyTab;
}

export const LegalPolicyModal: React.FC<LegalPolicyModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'privacy',
}) => {
  const { content } = useCms();
  const [activeTab, setActiveTab] = useState<PolicyTab>(initialTab);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[160] flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md animate-fade-in"
    >
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-stone-200 shadow-[0_25px_70px_rgba(0,0,0,0.2)] relative flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-pink-50 text-[#FF2D55] flex items-center justify-center">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-black text-lg sm:text-xl text-[#111827]">
                  Legal &amp; Policy Portal
                </span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                  IT Act, 2000 Compliant
                </span>
              </div>
              <p className="text-xs text-[#6B7280]">
                {content.footer?.brandName || 'Click Karo Date Karo'} ({content.footer?.parentCompany || 'A unit of AMBER VENTURES (OPC) PVT LTD'})
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

        {/* Tab Navigation */}
        <div className="flex gap-2 p-1.5 bg-stone-100/80 rounded-2xl my-4 shrink-0" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'privacy'}
            onClick={() => setActiveTab('privacy')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'privacy'
                ? 'bg-white text-[#111827] shadow-xs'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-[#0071E3]" />
            <span>Privacy Policy</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'refund'}
            onClick={() => setActiveTab('refund')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'refund'
                ? 'bg-white text-[#111827] shadow-xs'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5 text-emerald-600" />
            <span>Refund &amp; Cancellation</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'terms'}
            onClick={() => setActiveTab('terms')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'terms'
                ? 'bg-white text-[#111827] shadow-xs'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-purple-600" />
            <span>Terms of Service</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto no-scrollbar pr-1 space-y-6 text-xs sm:text-sm text-stone-700 font-sans leading-relaxed flex-1">
          
          {/* TAB 1: PRIVACY POLICY (Full IT Act, 2000 & IT Rules 2011 compliance) */}
          {activeTab === 'privacy' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-pink-50/70 border border-pink-100">
                <h3 className="font-display font-bold text-sm text-[#111827] mb-1">
                  Data Protection Commitment
                </h3>
                <p className="text-xs text-stone-600">
                  <strong>Click Karo Date Karo (A unit of AMBER VENTURES (OPC) PVT LTD)</strong> is committed to protecting your privacy in accordance with the <strong>Information Technology Act, 2000</strong>, <strong>Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011</strong>, and other applicable Indian laws.
                </p>
              </div>

              {/* 1. Data Controller */}
              <div className="space-y-2">
                <h4 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#0071E3]" />
                  <span>1. Data Controller</span>
                </h4>
                <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/70 space-y-1.5 text-xs">
                  <div><strong>Company:</strong> Click Karo Date Karo (A unit of AMBER VENTURES (OPC) PVT LTD)</div>
                  <div><strong>Website:</strong> <a href="https://www.kopartner.in" target="_blank" rel="noreferrer" className="text-[#0071E3] underline">www.kopartner.in</a></div>
                  <div><strong>Data Protection Officer (DPO):</strong> dpo@kopartner.in</div>
                  <div><strong>Grievance Officer:</strong> grievance@kopartner.in</div>
                  <div><strong>Privacy Support:</strong> privacy@kopartner.in</div>
                </div>
              </div>

              {/* 2. Information We Collect */}
              <div className="space-y-2">
                <h4 className="font-bold text-stone-900 text-sm">2. Information We Collect</h4>
                
                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/60">
                    <strong className="text-stone-900 block mb-1">2.1 Personal Information (Collected with Consent)</strong>
                    <ul className="list-disc pl-5 space-y-1 text-stone-600">
                      <li>Full name, email address, mobile number</li>
                      <li>Profile photograph, bio/description, and gallery photos</li>
                      <li>City, pin code, and service area</li>
                      <li>Date of birth and gender (strictly for 18+ age verification)</li>
                      <li>UPI ID (for verified payouts and refunds)</li>
                      <li>Government-issued ID (Aadhaar / KYC for verified KoPartners only)</li>
                      <li>Bank account details (KoPartners only, for payouts)</li>
                    </ul>
                  </div>

                  <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-100">
                    <strong className="text-purple-900 block mb-1">2.2 Sensitive Personal Data or Information (SPDI)</strong>
                    <p className="text-stone-600 mb-1.5">As defined under IT (Reasonable Security Practices) Rules, 2011:</p>
                    <ul className="list-disc pl-5 space-y-1 text-stone-600">
                      <li>Financial information (bank account &amp; UPI ID for payouts - KoPartners only)</li>
                      <li>Biometric data (facial recognition AI check for verification)</li>
                      <li>Government ID numbers (Aadhaar/PAN for KYC verification)</li>
                    </ul>
                    <div className="mt-2 p-2 rounded-lg bg-white border border-purple-200 text-purple-950 font-bold text-[11px]">
                      🔒 IMPORTANT: We do NOT collect or store Payment card numbers, CVV, UPI PIN, internet banking credentials, or any payment authentication data.
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/60">
                    <strong className="text-stone-900 block mb-1">2.3 Automatically Collected Information</strong>
                    <ul className="list-disc pl-5 space-y-1 text-stone-600">
                      <li>Device information (device type, operating system, browser)</li>
                      <li>IP address and approximate geolocation</li>
                      <li>Usage data, booking activity, and analytics</li>
                      <li>Cookies and essential session tracking technologies</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* 3. Purpose of Data Collection */}
              <div className="space-y-2">
                <h4 className="font-bold text-stone-900 text-sm">3. Purpose of Data Collection</h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <li className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/60">
                    <strong>Service Delivery:</strong> To facilitate connections between Clients and KoPartners
                  </li>
                  <li className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/60">
                    <strong>Identity Verification:</strong> To verify user identities and ensure platform safety
                  </li>
                  <li className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/60">
                    <strong>Payment Processing:</strong> To verify payments and process payouts to KoPartners
                  </li>
                  <li className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/60">
                    <strong>Communication:</strong> To send booking confirmations, updates, and support messages
                  </li>
                  <li className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/60">
                    <strong>Safety &amp; Security:</strong> To detect fraud, prevent abuse, and ensure user safety
                  </li>
                  <li className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/60">
                    <strong>Legal Compliance:</strong> To comply with applicable laws and statutory requests
                  </li>
                </ul>
              </div>

              {/* 4. Legal Basis for Processing */}
              <div className="space-y-2">
                <h4 className="font-bold text-stone-900 text-sm">4. Legal Basis for Processing</h4>
                <p className="text-xs text-stone-600">
                  We process your data based on: <strong>Consent</strong> (Section 43A, IT Act), <strong>Contract</strong> (Terms of Service), <strong>Legal Obligation</strong> (Indian laws), and <strong>Legitimate Interests</strong> (Safety &amp; anti-fraud). You may withdraw consent at any time by contacting <strong>privacy@kopartner.in</strong>.
                </p>
              </div>

              {/* 5. Information Sharing & Disclosure */}
              <div className="space-y-2">
                <h4 className="font-bold text-stone-900 text-sm">5. Information Sharing &amp; Disclosure</h4>
                <p className="text-xs text-stone-600">
                  Information is shared only with confirmed matched users for service delivery, authorized payment gateways, or law enforcement when legally mandated under court order. <strong>We NEVER sell, rent, or trade your personal information to third parties for marketing.</strong>
                </p>
              </div>

              {/* 6. Data Security Measures */}
              <div className="space-y-2">
                <h4 className="font-bold text-stone-900 text-sm">6. Data Security Measures (IT Rules, 2011)</h4>
                <div className="grid grid-cols-2 gap-2 text-xs text-stone-600">
                  <div className="p-2 rounded-xl bg-emerald-50/60 border border-emerald-100 flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>SSL/TLS 256-bit encryption</span>
                  </div>
                  <div className="p-2 rounded-xl bg-emerald-50/60 border border-emerald-100 flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>AES-256 at rest encryption</span>
                  </div>
                  <div className="p-2 rounded-xl bg-emerald-50/60 border border-emerald-100 flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Role-based access controls</span>
                  </div>
                  <div className="p-2 rounded-xl bg-emerald-50/60 border border-emerald-100 flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Intrusion detection systems</span>
                  </div>
                </div>
              </div>

              {/* 7. Data Retention */}
              <div className="space-y-2">
                <h4 className="font-bold text-stone-900 text-sm">7. Data Retention</h4>
                <p className="text-xs text-stone-600">
                  Active accounts retain data during usage. Backups are retained up to 180 days. Statutory financial records are preserved up to 8 years under Indian tax regulations. Upon account deletion request, your personal data is permanently deleted or anonymized within <strong>90 days</strong>.
                </p>
              </div>

              {/* 8. Your Rights */}
              <div className="space-y-2">
                <h4 className="font-bold text-stone-900 text-sm">8. Your Rights</h4>
                <p className="text-xs text-stone-600">
                  Under Indian law, you have the right to: <strong>Access</strong> your data, <strong>Correct</strong> inaccurate data, <strong>Delete</strong> your account &amp; data, <strong>Withdraw Consent</strong>, and <strong>Portability</strong>. Email <strong>privacy@kopartner.in</strong> to exercise your rights.
                </p>
              </div>

              {/* 9. Cookies */}
              <div className="space-y-2">
                <h4 className="font-bold text-stone-900 text-sm">9. Cookies &amp; Tracking Technologies</h4>
                <p className="text-xs text-stone-600">
                  We use essential security cookies for authentication and anti-abuse protection.
                </p>
              </div>

              {/* 10. Children's Privacy */}
              <div className="space-y-2">
                <h4 className="font-bold text-rose-900 text-sm flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>10. Children's Privacy (Strictly 18+)</span>
                </h4>
                <p className="text-xs text-stone-600">
                  KoPartner is strictly NOT intended for use by persons under 18 years of age. Date of Birth verification is mandatory. Any minor accounts discovered are deleted immediately.
                </p>
              </div>

              {/* 11 & 12. Changes & Grievance */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs space-y-2">
                <h4 className="font-bold text-stone-900 text-sm">11 &amp; 12. Grievance Redressal &amp; Response Timeline</h4>
                <p className="text-stone-600">
                  <strong>Click Karo Date Karo (A unit of AMBER VENTURES (OPC) PVT LTD)</strong><br />
                  Privacy Officer: privacy@kopartner.in &bull; DPO: dpo@kopartner.in &bull; Grievance Officer: grievance@kopartner.in<br />
                  Website: www.kopartner.in<br />
                  <strong>Statutory Response Time:</strong> Within 30 days of receiving your request.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: REFUND & CANCELLATION POLICY */}
          {activeTab === 'refund' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200">
                <h3 className="font-display font-bold text-sm text-emerald-950 mb-1 flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-emerald-700" />
                  <span>Transparent 100% Refund &amp; Cancellation Policy</span>
                </h3>
                <p className="text-xs text-emerald-800">
                  Click Karo Date Karo (A unit of AMBER VENTURES (OPC) PVT LTD) ensures fair, rapid, and transparent cancellation and refunds for all clients and companions.
                </p>
              </div>

              <div className="space-y-3 text-xs sm:text-sm">
                <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200">
                  <h4 className="font-bold text-stone-900 text-xs mb-1">1. Cancellation by Client</h4>
                  <ul className="list-disc pl-5 space-y-1 text-stone-600 text-xs">
                    <li><strong>More than 4 hours before scheduled time:</strong> 100% Instant Full Refund to wallet credit or original payment method / UPI ID.</li>
                    <li><strong>Between 2 to 4 hours before scheduled time:</strong> 80% Refund (20% nominal scheduling convenience charge).</li>
                    <li><strong>Under 2 hours or no-show:</strong> Non-refundable to compensate the companion's reserved travel time.</li>
                  </ul>
                </div>

                <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200">
                  <h4 className="font-bold text-stone-900 text-xs mb-1">2. Cancellation or Non-Attendance by Companion</h4>
                  <p className="text-xs text-stone-600">
                    If a companion cancels or fails to arrive at the agreed venue, the client receives an <strong>immediate 100% full refund</strong> plus an additional priority rebooking credit.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200">
                  <h4 className="font-bold text-stone-900 text-xs mb-1">3. Refund Processing Timelines</h4>
                  <ul className="list-disc pl-5 space-y-1 text-stone-600 text-xs">
                    <li><strong>Wallet Credit Refund:</strong> Instant (within 5 seconds).</li>
                    <li><strong>UPI ID / Bank Account Refund:</strong> Processed within 24 to 48 business hours.</li>
                    <li><strong>Card / NetBanking:</strong> 3 to 5 business days per standard banking cycle.</li>
                  </ul>
                </div>

                <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200">
                  <h4 className="font-bold text-stone-900 text-xs mb-1">4. How to Request a Refund</h4>
                  <p className="text-xs text-stone-600">
                    Go to <strong>Settings &rarr; Transactions</strong> or email <strong>grievance@kopartner.in</strong> with your Booking Reference ID. All refund tickets are audited and resolved within 24 hours.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TERMS OF SERVICE */}
          {activeTab === 'terms' && (
            <div className="space-y-4 text-xs sm:text-sm">
              <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-100">
                <h3 className="font-display font-bold text-sm text-purple-950 mb-1">
                  Terms of Service &bull; Safe Community Code
                </h3>
                <p className="text-xs text-purple-900">
                  Operated by Click Karo Date Karo (A unit of AMBER VENTURES (OPC) PVT LTD).
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200">
                  <h4 className="font-bold text-stone-900 text-xs mb-1">1. Professional Social &amp; Lifestyle Companionship Only</h4>
                  <p className="text-xs text-stone-600">
                    KoPartner is strictly a social companionship and lifestyle meetup platform for public venues (cafes, cinemas, exhibitions, restaurants, shopping, and tours). <strong>We strictly prohibit and do not provide adult, escort, or matrimonial services.</strong>
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200">
                  <h4 className="font-bold text-stone-900 text-xs mb-1">2. Zero Tolerance for Harassment</h4>
                  <p className="text-xs text-stone-600">
                    Mutual respect, explicit consent, and safe public venue rules are strictly enforced. Any misconduct results in permanent blacklisting, forfeiture of deposits, and immediate police reporting.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200">
                  <h4 className="font-bold text-stone-900 text-xs mb-1">3. 18+ Age &amp; Aadhaar Verification Mandate</h4>
                  <p className="text-xs text-stone-600">
                    All users must be 18+ years of age with genuine date of birth and verified identity documents.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer actions */}
        <div className="pt-4 mt-2 border-t border-stone-100 flex items-center justify-between shrink-0">
          <div className="text-[11px] text-stone-500 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#0071E3]" />
            <span>Click Karo Date Karo (A unit of AMBER VENTURES (OPC) PVT LTD)</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-2xl bg-[#111827] hover:bg-[#0071E3] text-white text-xs font-bold transition cursor-pointer"
          >
            I Acknowledge &amp; Close
          </button>
        </div>

      </div>
    </div>
  );
};

export default LegalPolicyModal;
