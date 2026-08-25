import React, { useState } from 'react';
import { UserRole } from '../types';
import { X, Search, UserCheck, ShieldCheck, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface AuthRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRole: (role: UserRole, userName: string) => void;
  initialMode?: 'signin' | 'signup';
}

export const AuthRoleModal: React.FC<AuthRoleModalProps> = ({ isOpen, onClose, onSelectRole, initialMode = 'signup' }) => {
  const [step, setStep] = useState<'auth' | 'role'>('auth');
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>(initialMode);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedRole, setSelectedRole] = useState<'seeker' | 'companion'>('seeker');

  if (!isOpen) return null;

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('role');
  };

  const handleRoleConfirm = () => {
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.6 }
    });
    onSelectRole(selectedRole, fullName || 'User');
    onClose();
  };

  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
    >
      <div className="bg-white/95 backdrop-blur-2xl rounded-3xl max-w-md w-full p-6 sm:p-8 border border-pink-200 shadow-apple-float relative">
        
        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-pink-50 hover:bg-pink-100 flex items-center justify-center text-[#1d1d1f] transition apple-focus"
        >
          <X className="w-4 h-4" />
        </button>

        {step === 'auth' ? (
          <div>
            {/* Step 1: Sign In / Sign Up */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 text-pink-700 text-[11px] font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-3 h-3 text-pink-600" /> Click Karo Date Karo Portal
              </div>
              <h3 id="auth-modal-title" className="text-2xl font-bold text-[#1d1d1f] tracking-tight">
                {authMode === 'signup' ? 'Create Your Account' : 'Welcome Back'}
              </h3>
              <p className="text-xs text-[#86868b] mt-1">
                India's #1 safe, verified social and lifestyle support platform
              </p>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <div>
                <label htmlFor="auth-name" className="block text-xs font-bold text-[#1d1d1f] mb-1">
                  Full Name
                </label>
                <input
                  id="auth-name"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full bg-[#fdf8f8] border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0071e3]"
                />
              </div>

              <div>
                <label htmlFor="auth-phone" className="block text-xs font-bold text-[#1d1d1f] mb-1">
                  Mobile Number (WhatsApp)
                </label>
                <input
                  id="auth-phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full bg-[#fdf8f8] border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0071e3]"
                />
              </div>

              <div className="p-3 bg-pink-50/70 rounded-xl border border-pink-100 text-[11px] text-[#1d1d1f]/80 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#0071e3] shrink-0" />
                <span>Instant OTP &amp; Aadhaar verification for maximum safety.</span>
              </div>

              <button
                type="submit"
                className="w-full bg-[#0071e3] hover:bg-[#0077ed] text-white py-3 rounded-full font-bold text-xs sm:text-sm transition shadow-sm flex items-center justify-center gap-2 apple-focus"
              >
                <span>Continue &rarr; Choose Role</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setAuthMode(authMode === 'signup' ? 'signin' : 'signup')}
                  className="text-xs text-[#86868b] hover:text-[#0071e3] transition font-medium"
                >
                  {authMode === 'signup' ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div>
            {/* Step 2: Role Selection Panel (Seeker or Companion) */}
            <div className="text-center mb-6">
              <span className="text-[11px] font-bold text-[#0071e3] uppercase tracking-wider block mb-1">
                Choose Your Starting View
              </span>
              <h3 className="text-2xl font-bold text-[#1d1d1f] tracking-tight">
                What are you exploring today?
              </h3>
              <p className="text-xs text-[#86868b] mt-1">
                One account unlocks both roles. You can switch between Seeker and Companion anytime!
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3.5 mb-6">
              
              {/* Option A: Seeker */}
              <div
                onClick={() => setSelectedRole('seeker')}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3.5 ${
                  selectedRole === 'seeker'
                    ? 'border-[#0071e3] bg-blue-50/50 shadow-sm'
                    : 'border-pink-200 bg-white hover:border-pink-300'
                }`}
              >
                <div className="w-10 h-10 rounded-2xl bg-pink-100 text-pink-700 flex items-center justify-center text-xl shrink-0 mt-0.5">
                  <Search className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-[#1d1d1f]">I am a Seeker</h4>
                    {selectedRole === 'seeker' && (
                      <CheckCircle2 className="w-4 h-4 text-[#0071e3]" />
                    )}
                  </div>
                  <p className="text-xs text-[#86868b] mt-0.5 leading-relaxed">
                    Looking for verified companions for cinema, cafes, senior support, events &amp; travel in my area.
                  </p>
                  <div className="flex gap-1 mt-2">
                    <span className="text-[10px] bg-white px-2 py-0.5 rounded-full border border-pink-200 font-semibold text-[#1d1d1f]">Swipe Profiles</span>
                    <span className="text-[10px] bg-white px-2 py-0.5 rounded-full border border-pink-200 font-semibold text-[#1d1d1f]">Instant Booking</span>
                  </div>
                </div>
              </div>

              {/* Option B: Companion */}
              <div
                onClick={() => setSelectedRole('companion')}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3.5 ${
                  selectedRole === 'companion'
                    ? 'border-[#0071e3] bg-blue-50/50 shadow-sm'
                    : 'border-pink-200 bg-white hover:border-pink-300'
                }`}
              >
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-xl shrink-0 mt-0.5">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-[#1d1d1f]">I am a Companion (Partner)</h4>
                    {selectedRole === 'companion' && (
                      <CheckCircle2 className="w-4 h-4 text-[#0071e3]" />
                    )}
                  </div>
                  <p className="text-xs text-[#86868b] mt-0.5 leading-relaxed">
                    I want to offer professional social support, accept seeker bookings &amp; earn up to ₹2,000/hr (80% net).
                  </p>
                  <div className="flex gap-1 mt-2">
                    <span className="text-[10px] bg-white px-2 py-0.5 rounded-full border border-pink-200 font-semibold text-emerald-600">80% Net Payout</span>
                    <span className="text-[10px] bg-white px-2 py-0.5 rounded-full border border-pink-200 font-semibold text-[#1d1d1f]">Manage Requests</span>
                  </div>
                </div>
              </div>

            </div>

            <button
              onClick={handleRoleConfirm}
              className="w-full bg-[#0071e3] hover:bg-[#0077ed] text-white py-3 rounded-full font-bold text-xs sm:text-sm transition shadow-sm flex items-center justify-center gap-2 apple-focus"
            >
              <span>Enter {selectedRole === 'seeker' ? 'Seeker Portal' : 'Companion Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
