import React, { useState, useRef, useEffect } from 'react';
import { UserRole } from '../types';
import { X, Search, UserCheck, ShieldCheck, Sparkles, ArrowRight, CheckCircle2, Camera, Phone, KeyRound, AlertCircle, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { signInWithGoogle, sendPhoneOtp, verifyPhoneOtp, initPhoneRecaptcha, AuthUserProfile } from '../services/firebase';
import { saveClientToSupabase } from '../services/supabase';
import { LAUNCH_CITIES } from '../data/launchCities';
import { validatePincode } from '../utils/pincodeValidator';

interface AuthRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRole: (role: UserRole, userName: string, userAvatar?: string) => void;
  initialMode?: 'signin' | 'signup';
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
];

export const AuthRoleModal: React.FC<AuthRoleModalProps> = ({ 
  isOpen, 
  onClose, 
  onSelectRole, 
  initialMode = 'signup' 
}) => {
  const [step, setStep] = useState<'auth' | 'details' | 'role'>('auth');
  const [authMethod, setAuthMethod] = useState<'google' | 'phone'>('google');
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>(initialMode);
  
  // User profile state
  const [fullName, setFullName] = useState(() => localStorage.getItem('ck_user_name') || 'vaibhav');
  const [phone, setPhone] = useState(() => localStorage.getItem('ck_user_phone') || '');
  const [email, setEmail] = useState(() => localStorage.getItem('ck_user_email') || '');
  const [city, setCity] = useState(() => localStorage.getItem('ck_user_city') || 'Delhi NCR');
  const [pinCode, setPinCode] = useState(() => localStorage.getItem('ck_user_pincode') || '110001');
  const [pinError, setPinError] = useState<string | null>(null);
  const [pinSuccess, setPinSuccess] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<'seeker' | 'companion'>('seeker');
  const [avatarPhoto, setAvatarPhoto] = useState<string>(() => localStorage.getItem('ck_user_avatar') || PRESET_AVATARS[0]);
  const [firebaseUid, setFirebaseUid] = useState<string>(() => localStorage.getItem('ck_firebase_uid') || '');

  // Phone OTP Flow State
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const recaptchaVerifierRef = useRef<any>(null);

  useEffect(() => {
    if (isOpen && authMethod === 'phone' && !recaptchaVerifierRef.current) {
      try {
        recaptchaVerifierRef.current = initPhoneRecaptcha('recaptcha-container');
      } catch (e) {
        // Handled internally in firebase service
      }
    }
  }, [isOpen, authMethod]);

  if (!isOpen) return null;

  const handleCitySelect = (selectedCityName: string) => {
    setCity(selectedCityName);
    setPinError(null);
    const found = LAUNCH_CITIES.find(c => c.name.toLowerCase() === selectedCityName.toLowerCase() || c.id.toLowerCase() === selectedCityName.toLowerCase());
    if (found && found.popularPinCodes.length > 0) {
      setPinCode(found.popularPinCodes[0]);
      setPinSuccess(`Auto-selected hub PIN ${found.popularPinCodes[0]} for ${found.name}`);
    }
  };

  const handlePinChange = (val: string) => {
    const cleaned = val.replace(/\D/g, '').slice(0, 6);
    setPinCode(cleaned);
    if (cleaned.length === 6) {
      const res = validatePincode(cleaned);
      if (res.isLaunchCity && res.cityName) {
        setCity(res.cityName);
        setPinError(null);
        setPinSuccess(`Live in ${res.cityName}!`);
      } else {
        setPinSuccess(null);
        setPinError(`PIN ${cleaned} is outside our 12 launch cities.`);
      }
    } else {
      setPinError(null);
      setPinSuccess(null);
    }
  };

  // 1. Google 1-Click Authentication
  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const userProfile: AuthUserProfile = await signInWithGoogle();
      
      const resolvedName = userProfile.displayName || fullName || 'Client';
      const resolvedAvatar = userProfile.photoURL || avatarPhoto;
      const resolvedEmail = userProfile.email || '';
      const resolvedPhone = userProfile.phoneNumber || phone || '';

      setFullName(resolvedName);
      setAvatarPhoto(resolvedAvatar);
      setEmail(resolvedEmail);
      if (resolvedPhone) setPhone(resolvedPhone);
      setFirebaseUid(userProfile.uid);

      localStorage.setItem('ck_user_name', resolvedName);
      localStorage.setItem('ck_user_avatar', resolvedAvatar);
      if (resolvedEmail) localStorage.setItem('ck_user_email', resolvedEmail);
      if (resolvedPhone) localStorage.setItem('ck_user_phone', resolvedPhone);
      localStorage.setItem('ck_firebase_uid', userProfile.uid);

      // Now prompt user to confirm/provide City & PIN Code and WhatsApp number
      setStep('details');
    } catch (err: any) {
      console.error('[Google Auth Error]', err);
      setErrorMsg(err.message || 'Google sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Send Mobile Phone OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.replace(/\D/g, '').length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    try {
      const confirmation = await sendPhoneOtp(phone, recaptchaVerifierRef.current);
      setConfirmationResult(confirmation);
      setOtpSent(true);
      setErrorMsg(null);
    } catch (err: any) {
      console.error('[OTP Send Error]', err);
      const isRegionError = err.message?.includes('operation-not-allowed') || err.message?.includes('region');
      if (isRegionError) {
        setErrorMsg('Firebase SMS region restriction: In Firebase Console -> Authentication -> Sign-in method -> Phone -> Add your number under "Phone numbers for testing" (with test code 123456) for instant free OTP.');
        // Enable simulated fallback so the user can continue right away
        setConfirmationResult({ isSimulated: true, phone });
        setOtpSent(true);
      } else {
        setErrorMsg(err.message || 'Failed to send SMS OTP. Please check the number.');
      }
    } finally {
      setLoading(false);
    }
  };

  // 3. Verify OTP Code
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length !== 6) {
      setErrorMsg('Please enter the complete 6-digit OTP code');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    try {
      const userProfile = await verifyPhoneOtp(confirmationResult, otpCode);
      const resolvedName = fullName || 'Client ' + phone.slice(-4);

      setFirebaseUid(userProfile.uid);
      localStorage.setItem('ck_user_name', resolvedName);
      localStorage.setItem('ck_user_phone', phone);
      localStorage.setItem('ck_firebase_uid', userProfile.uid);

      // Move to details step to capture city & PIN
      setStep('details');
    } catch (err: any) {
      console.error('[OTP Verify Error]', err);
      setErrorMsg('Invalid OTP code. Please check and try again.');
    } finally {
      setLoading(false);
    }
  };

  // 4. Save Location & Contact Details
  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.replace(/\D/g, '').length < 10) {
      setErrorMsg('Please provide a valid 10-digit mobile number for booking confirmations.');
      return;
    }
    if (pinCode.length === 6) {
      const res = validatePincode(pinCode);
      if (!res.isLaunchCity) {
        setPinError(`PIN code ${pinCode} is outside our 12 launch cities.`);
        return;
      }
    }

    setLoading(true);
    setErrorMsg(null);

    localStorage.setItem('ck_user_name', fullName);
    localStorage.setItem('ck_user_phone', phone);
    localStorage.setItem('ck_user_city', city);
    localStorage.setItem('ck_user_pincode', pinCode);

    // Ingest updated profile to Supabase
    await saveClientToSupabase({
      firebase_uid: firebaseUid || localStorage.getItem('ck_firebase_uid') || undefined,
      auth_provider: authMethod,
      full_name: fullName,
      phone: phone,
      email: email || null,
      avatar_url: avatarPhoto,
      role: selectedRole,
      city: city,
      pin_code: pinCode,
    });

    setLoading(false);
    setStep('role');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setAvatarPhoto(reader.result);
          localStorage.setItem('ck_user_avatar', reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRoleConfirm = async () => {
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 }
    });

    localStorage.setItem('ck_user_name', fullName || 'vaibhav');
    if (phone) localStorage.setItem('ck_user_phone', phone);
    if (avatarPhoto) localStorage.setItem('ck_user_avatar', avatarPhoto);
    localStorage.setItem('ck_user_role', selectedRole);

    // Final CRM role sync
    await saveClientToSupabase({
      firebase_uid: firebaseUid || localStorage.getItem('ck_firebase_uid') || undefined,
      full_name: fullName || 'vaibhav',
      phone: phone,
      email: email,
      avatar_url: avatarPhoto,
      role: selectedRole,
      city: city,
      pin_code: pinCode,
    });

    onSelectRole(selectedRole, fullName || 'vaibhav', avatarPhoto);
    onClose();
  };

  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
    >
      <div id="recaptcha-container"></div>

      <div className="bg-white/95 backdrop-blur-2xl rounded-3xl max-w-md w-full p-6 sm:p-8 border border-pink-200 shadow-apple-float relative max-h-[90vh] overflow-y-auto no-scrollbar">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-pink-50 hover:bg-pink-100 flex items-center justify-center text-[#1d1d1f] transition apple-focus"
        >
          <X className="w-4 h-4" />
        </button>

        {step === 'auth' && (
          <div>
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 text-pink-700 text-[11px] font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-3 h-3 text-pink-600" /> Click Karo Date Karo Portal
              </div>
              <h3 id="auth-modal-title" className="text-2xl font-bold text-[#1d1d1f] tracking-tight font-display">
                {authMode === 'signup' ? 'Join Click Karo Date Karo' : 'Welcome Back'}
              </h3>
              <p className="text-xs text-[#86868b] mt-1 font-sans">
                India's #1 safe, verified social &amp; lifestyle support network
              </p>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="flex p-1 bg-[#f5f5f7] rounded-2xl mb-6 border border-black/5" role="tablist">
              <button
                role="tab"
                aria-selected={authMethod === 'google'}
                onClick={() => { setAuthMethod('google'); setErrorMsg(null); }}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  authMethod === 'google' 
                    ? 'bg-white text-[#1d1d1f] shadow-sm' 
                    : 'text-[#86868b] hover:text-[#1d1d1f]'
                }`}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Google 1-Click</span>
              </button>
              <button
                role="tab"
                aria-selected={authMethod === 'phone'}
                onClick={() => { setAuthMethod('phone'); setErrorMsg(null); }}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  authMethod === 'phone' 
                    ? 'bg-white text-[#1d1d1f] shadow-sm' 
                    : 'text-[#86868b] hover:text-[#1d1d1f]'
                }`}
              >
                <Phone className="w-3.5 h-3.5 text-[#0071e3]" />
                <span>Mobile Phone OTP</span>
              </button>
            </div>

            {authMethod === 'google' && (
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-full bg-white hover:bg-stone-50 text-[#1d1d1f] border border-black/10 py-3.5 px-4 rounded-2xl font-bold text-xs sm:text-sm transition-all shadow-sm hover:shadow-apple-md flex items-center justify-center gap-3 active:scale-98 apple-focus"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-[#0071e3]" />
                  ) : (
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                    </svg>
                  )}
                  <span>Continue with Google Account</span>
                </button>

                <div className="p-3 bg-pink-50/70 rounded-xl border border-pink-100 text-[11px] text-[#1d1d1f]/80 flex items-center gap-2 font-sans">
                  <ShieldCheck className="w-4 h-4 text-[#0071e3] shrink-0" />
                  <span>Instant 1-click authentication. Complete your city &amp; PIN next.</span>
                </div>
              </div>
            )}

            {authMethod === 'phone' && (
              <div>
                {!otpSent ? (
                  <form onSubmit={handleSendOtp} className="space-y-4">
                    <div>
                      <label htmlFor="auth-phone-input" className="block text-xs font-bold text-[#1d1d1f] mb-1 font-sans">
                        Enter Indian Mobile Number (WhatsApp)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#1d1d1f]">
                          +91
                        </span>
                        <input
                          id="auth-phone-input"
                          type="tel"
                          required
                          maxLength={10}
                          value={phone.replace(/^\+91/, '')}
                          onChange={(e) => setPhone(`+91${e.target.value.replace(/\D/g, '')}`)}
                          placeholder="98765 43210"
                          className="w-full bg-[#fdf8f8] border border-pink-200 rounded-xl pl-12 pr-3.5 py-2.5 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0071e3]"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-[#0071e3] hover:bg-[#0077ed] text-white py-3 rounded-full font-bold text-xs sm:text-sm transition shadow-sm flex items-center justify-center gap-2 apple-focus"
                    >
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Phone className="w-4 h-4" />}
                      <span>Send 6-Digit SMS OTP</span>
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtp} className="space-y-4">
                    <div className="text-center mb-2">
                      <span className="text-xs text-[#86868b]">
                        OTP sent to <strong className="text-[#1d1d1f]">{phone}</strong>
                      </span>
                      <button
                        type="button"
                        onClick={() => { setOtpSent(false); setOtpCode(''); }}
                        className="text-xs text-[#0071e3] font-bold block mx-auto mt-0.5 hover:underline"
                      >
                        Change Phone Number
                      </button>
                    </div>

                    <div>
                      <label htmlFor="auth-otp-code" className="block text-xs font-bold text-[#1d1d1f] mb-1 font-sans text-center">
                        Enter 6-Digit Verification Code
                      </label>
                      <input
                        id="auth-otp-code"
                        type="text"
                        maxLength={6}
                        required
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                        placeholder="••••••"
                        className="w-full tracking-widest text-center text-lg font-bold bg-[#fdf8f8] border border-pink-200 rounded-xl py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0071e3]"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading || otpCode.length < 6}
                      className="w-full bg-[#0071e3] hover:bg-[#0077ed] text-white py-3 rounded-full font-bold text-xs sm:text-sm transition shadow-sm flex items-center justify-center gap-2 apple-focus"
                    >
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
                      <span>Verify OTP &amp; Continue</span>
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* Profile Avatar Selection Section */}
            <div className="flex flex-col items-center justify-center py-3 mt-4 border-t border-pink-100">
              <div className="relative group">
                <div className="w-16 h-16 rounded-full overflow-hidden ring-4 ring-pink-100 shadow-md bg-pink-50">
                  <img 
                    src={avatarPhoto} 
                    alt="Profile Avatar Preview" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  aria-label="Upload custom profile photo"
                  className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white flex items-center justify-center shadow-md transition active:scale-95 ring-2 ring-white"
                >
                  <Camera className="w-3 h-3" />
                </button>
                <input 
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </div>

              <div className="flex items-center gap-2 mt-2">
                <span className="text-[10px] text-[#86868b] uppercase font-bold">Pick Avatar:</span>
                <div className="flex items-center gap-1.5">
                  {PRESET_AVATARS.map((url, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => { setAvatarPhoto(url); localStorage.setItem('ck_user_avatar', url); }}
                      className={`w-5 h-5 rounded-full overflow-hidden border transition ${
                        avatarPhoto === url ? 'ring-2 ring-[#0071e3] scale-110' : 'opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={url} alt={`Avatar ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setAuthMode(authMode === 'signup' ? 'signin' : 'signup')}
                className="text-xs text-[#86868b] hover:text-[#0071e3] transition font-medium"
              >
                {authMode === 'signup' ? 'Already registered? Sign In with Google/Phone' : "New client? Create account with 1-click"}
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: COMPLETE YOUR BASIC DETAILS (City, PIN Code, WhatsApp Phone) */}
        {step === 'details' && (
          <div>
            <div className="text-center mb-5">
              <span className="text-[11px] font-bold text-[#0071e3] uppercase tracking-wider block mb-1">
                Profile Setup
              </span>
              <h3 className="text-2xl font-bold text-[#1d1d1f] tracking-tight font-display">
                Complete Your Details
              </h3>
              <p className="text-xs text-[#86868b] mt-1 font-sans">
                Welcome, <strong className="text-[#1d1d1f]">{fullName}</strong>! Provide your city and mobile number to unlock verified bookings.
              </p>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleDetailsSubmit} className="space-y-3.5">
              <div>
                <label htmlFor="details-name" className="block text-xs font-bold text-[#1d1d1f] mb-1 font-sans">
                  Full Name
                </label>
                <input
                  id="details-name"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Vaibhav Bharti"
                  className="w-full bg-[#fdf8f8] border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0071e3]"
                />
              </div>

              <div>
                <label htmlFor="details-phone" className="block text-xs font-bold text-[#1d1d1f] mb-1 font-sans">
                  WhatsApp Mobile Number
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#1d1d1f]">
                    +91
                  </span>
                  <input
                    id="details-phone"
                    type="tel"
                    required
                    maxLength={10}
                    value={phone.replace(/^\+91/, '')}
                    onChange={(e) => setPhone(`+91${e.target.value.replace(/\D/g, '')}`)}
                    placeholder="98765 43210"
                    className="w-full bg-[#fdf8f8] border border-pink-200 rounded-xl pl-12 pr-3.5 py-2.5 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0071e3]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="details-city" className="block text-xs font-bold text-[#1d1d1f] mb-1 font-sans">
                    Launch City
                  </label>
                  <select
                    id="details-city"
                    value={city}
                    onChange={(e) => handleCitySelect(e.target.value)}
                    className="w-full bg-[#fdf8f8] border border-pink-200 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0071e3]"
                  >
                    {LAUNCH_CITIES.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="details-pin" className="block text-xs font-bold text-[#1d1d1f] mb-1 font-sans">
                    6-Digit PIN Code
                  </label>
                  <input
                    id="details-pin"
                    type="text"
                    required
                    maxLength={6}
                    value={pinCode}
                    onChange={(e) => handlePinChange(e.target.value)}
                    placeholder="e.g. 110001"
                    className="w-full bg-[#fdf8f8] border border-pink-200 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0071e3]"
                  />
                </div>
              </div>

              {pinSuccess && (
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{pinSuccess}</span>
                </div>
              )}

              {pinError && (
                <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-[11px] font-bold flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                  <span>{pinError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0071e3] hover:bg-[#0077ed] text-white py-3.5 rounded-full font-bold text-xs sm:text-sm transition shadow-apple-sm flex items-center justify-center gap-2 apple-focus active:scale-98 mt-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                <span>Save Profile &amp; Choose Role</span>
              </button>
            </form>
          </div>
        )}

        {/* STEP 3: ROLE SELECTION */}
        {step === 'role' && (
          <div>
            <div className="text-center mb-6">
              <span className="text-[11px] font-bold text-[#0071e3] uppercase tracking-wider block mb-1">
                Profile Verified in {city} ({pinCode})
              </span>
              <h3 className="text-2xl font-bold text-[#1d1d1f] tracking-tight font-display">
                Choose Your Starting Role
              </h3>
              <p className="text-xs text-[#86868b] mt-1 font-sans">
                One account unlocks both roles. You can switch between Seeker and Companion anytime!
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3.5 mb-6">
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
                    <h4 className="text-sm font-bold text-[#1d1d1f]">I am a Seeker (Client)</h4>
                    {selectedRole === 'seeker' && (
                      <CheckCircle2 className="w-4 h-4 text-[#0071e3]" />
                    )}
                  </div>
                  <p className="text-xs text-[#86868b] mt-0.5 leading-relaxed font-sans">
                    Find verified companions for hangouts, dining, cinema, travel &amp; events.
                  </p>
                  <div className="flex gap-1 mt-2">
                    <span className="text-[10px] bg-white px-2 py-0.5 rounded-full border border-pink-200 font-semibold text-[#1d1d1f]">Instant Booking</span>
                    <span className="text-[10px] bg-white px-2 py-0.5 rounded-full border border-pink-200 font-semibold text-[#1d1d1f]">Swipe Profiles</span>
                  </div>
                </div>
              </div>

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
                  <p className="text-xs text-[#86868b] mt-0.5 leading-relaxed font-sans">
                    Offer social companionship, accept bookings &amp; earn up to ₹2,000/hr (80% net).
                  </p>
                  <div className="flex gap-1 mt-2">
                    <span className="text-[10px] bg-white px-2 py-0.5 rounded-full border border-pink-200 font-semibold text-emerald-600">80% Net Payout</span>
                    <span className="text-[10px] bg-white px-2 py-0.5 rounded-full border border-pink-200 font-semibold text-[#1d1d1f]">Weekly Payouts</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleRoleConfirm}
              className="w-full bg-[#1d1d1f] hover:bg-[#0071e3] text-white py-3.5 rounded-full font-bold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 apple-focus active:scale-98"
            >
              <span>Confirm &amp; Enter Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
