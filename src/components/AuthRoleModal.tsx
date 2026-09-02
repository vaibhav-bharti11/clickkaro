import React, { useState, useRef, useEffect } from 'react';
import { UserRole } from '../types';
import { X, Search, ShieldCheck, Sparkles, ArrowRight, CheckCircle2, Phone, KeyRound, AlertCircle, Loader2, Mail, Lock } from 'lucide-react';
import confetti from 'canvas-confetti';
import { signInWithGoogle, sendPhoneOtp, verifyPhoneOtp, initPhoneRecaptcha, signInWithEmailPassword, signUpWithEmailPassword, AuthUserProfile } from '../services/firebase';
import { saveClientToSupabase, checkExistingClient } from '../services/supabase';
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
  const [authMethod, setAuthMethod] = useState<'google' | 'email' | 'phone'>('google');
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>(initialMode);
  
  // User profile state
  const [fullName, setFullName] = useState(() => localStorage.getItem('ck_user_name') || '');
  const [phone, setPhone] = useState(() => localStorage.getItem('ck_user_phone') || '');
  const [email, setEmail] = useState(() => localStorage.getItem('ck_user_email') || '');
  const [password, setPassword] = useState('');
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

  const recaptchaVerifierRef = useRef<any>(null);

  useEffect(() => {
    if (isOpen && authMethod === 'phone' && !recaptchaVerifierRef.current) {
      try {
        recaptchaVerifierRef.current = initPhoneRecaptcha('recaptcha-container');
      } catch (e) {
        // Handled internally
      }
    }
  }, [isOpen, authMethod]);

  if (!isOpen) return null;

  // Helper: check if client already registered and has complete profile. If so, bypass repetitive details!
  const handleExistingProfileCheck = async (
    profile: { email?: string | null; phone?: string | null; uid?: string | null; name?: string; avatar?: string }
  ): Promise<boolean> => {
    try {
      const existing = await checkExistingClient({
        email: profile.email,
        phone: profile.phone,
        firebase_uid: profile.uid,
      });

      if (existing) {
        // If client already filled their profile, bypass questions completely!
        if (existing.city && existing.pin_code && existing.role) {
          localStorage.setItem('ck_user_name', existing.full_name || profile.name || 'Client');
          localStorage.setItem('ck_user_city', existing.city);
          localStorage.setItem('ck_user_pincode', existing.pin_code);
          localStorage.setItem('ck_user_role', existing.role);
          if (existing.phone) localStorage.setItem('ck_user_phone', existing.phone);
          if (existing.email) localStorage.setItem('ck_user_email', existing.email);
          if (existing.avatar_url) localStorage.setItem('ck_user_avatar', existing.avatar_url);
          if (existing.kyc_verified) localStorage.setItem('ck_kyc_verified', 'true');

          confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
          onSelectRole(existing.role, existing.full_name, existing.avatar_url || profile.avatar);
          onClose();
          return true; // Successfully bypassed!
        } else {
          // Pre-populate any existing info
          if (existing.full_name) setFullName(existing.full_name);
          if (existing.phone) setPhone(existing.phone);
          if (existing.city) setCity(existing.city);
          if (existing.pin_code) setPinCode(existing.pin_code);
          if (existing.role) setSelectedRole(existing.role);
        }
      }
    } catch (e) {
      console.warn('[Auth] Existing profile check failed:', e);
    }
    return false;
  };

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

      // Check if user already completed details previously
      const bypassed = await handleExistingProfileCheck({
        email: resolvedEmail,
        phone: resolvedPhone,
        uid: userProfile.uid,
        name: resolvedName,
        avatar: resolvedAvatar,
      });

      if (!bypassed) {
        setStep('details');
      }
    } catch (err: any) {
      console.error('[Google Auth Error]', err);
      setErrorMsg(err.message || 'Google sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // 1.1 Email & Password Authentication (Sign In & Sign Up)
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address');
      return;
    }
    if (!password || password.length < 6) {
      setErrorMsg('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      if (authMode === 'signup') {
        // DUPLICATE SIGNUP PREVENTION:
        const existing = await checkExistingClient({ email });
        if (existing) {
          setErrorMsg('An account with this email already exists. Please switch to Sign In instead of registering duplicates.');
          setLoading(false);
          return;
        }

        const userProfile = await signUpWithEmailPassword(email, password, fullName || email.split('@')[0]);
        setFirebaseUid(userProfile.uid);
        localStorage.setItem('ck_firebase_uid', userProfile.uid);
        localStorage.setItem('ck_user_name', fullName || email.split('@')[0]);
        localStorage.setItem('ck_user_email', email);
        setStep('details');
      } else {
        // DIRECT EMAIL SIGN IN
        const userProfile = await signInWithEmailPassword(email, password);
        setFirebaseUid(userProfile.uid);
        localStorage.setItem('ck_firebase_uid', userProfile.uid);
        localStorage.setItem('ck_user_email', email);

        const bypassed = await handleExistingProfileCheck({
          email,
          uid: userProfile.uid,
          name: userProfile.displayName || undefined,
          avatar: userProfile.photoURL || undefined,
        });

        if (!bypassed) {
          setStep('details');
        }
      }
    } catch (err: any) {
      console.error('[Email Auth Error]', err);
      if (err.code === 'auth/email-already-in-use') {
        setErrorMsg('An account with this email already exists. Please switch to Sign In.');
      } else if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setErrorMsg('Incorrect email or password. Please verify your credentials.');
      } else if (err.code === 'auth/user-not-found') {
        setErrorMsg('No account found with this email. Please sign up first.');
      } else {
        setErrorMsg(err.message || 'Authentication error. Please try again.');
      }
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

    // In signup mode: Check for duplicate phone
    if (authMode === 'signup') {
      const existing = await checkExistingClient({ phone });
      if (existing) {
        setErrorMsg('An account with this phone number already exists. Please switch to Sign In.');
        return;
      }
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
        setErrorMsg('Using simulated instant OTP flow for this number.');
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

      // Check if user already exists with complete profile
      const bypassed = await handleExistingProfileCheck({
        phone,
        uid: userProfile.uid,
        name: resolvedName,
      });

      if (!bypassed) {
        setStep('details');
      }
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

  const handleRoleConfirm = async () => {
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 }
    });

    const finalName = fullName || 'Client';
    localStorage.setItem('ck_user_role', selectedRole);
    localStorage.setItem('ck_user_name', finalName);
    localStorage.setItem('ck_user_avatar', avatarPhoto);
    localStorage.setItem('ck_user_city', city);
    localStorage.setItem('ck_user_pincode', pinCode);
    if (phone) localStorage.setItem('ck_user_phone', phone);
    if (email) localStorage.setItem('ck_user_email', email);

    await saveClientToSupabase({
      firebase_uid: firebaseUid || localStorage.getItem('ck_firebase_uid') || undefined,
      auth_provider: authMethod,
      full_name: finalName,
      phone: phone || '+91 98765 43210',
      email: email || null,
      avatar_url: avatarPhoto,
      role: selectedRole,
      city: city,
      pin_code: pinCode,
    });

    onSelectRole(selectedRole, finalName, avatarPhoto);
    onClose();
  };

  return (
    <div 
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
    >
      <div id="recaptcha-container" className="hidden"></div>

      <div className="bg-white/95 backdrop-blur-2xl rounded-3xl max-w-md w-full p-6 sm:p-8 border border-pink-200 shadow-apple-float relative overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-pink-50 hover:bg-pink-100 flex items-center justify-center text-[#1d1d1f] transition active:scale-95 apple-focus"
        >
          <X className="w-4 h-4" />
        </button>

        {/* STEP 1: AUTHENTICATION */}
        {step === 'auth' && (
          <div>
            <div className="text-center mb-6">
              <span className="text-[11px] font-bold text-[#0071e3] uppercase tracking-wider block mb-1">
                Verified Community
              </span>
              <h2 className="text-2xl font-bold text-[#1d1d1f] tracking-tight font-display">
                {authMode === 'signup' ? 'Create Your Account' : 'Welcome Back'}
              </h2>
              <p className="text-xs text-[#86868b] mt-1 font-sans">
                {authMode === 'signup'
                  ? 'Join India’s #1 companion support & lifestyle booking platform'
                  : 'Sign in to access your booked companions or partner earnings'}
              </p>
            </div>

            {/* Mode Toggle (Sign In vs Sign Up) */}
            <div className="flex bg-[#f5f5f7] p-1 rounded-2xl mb-4">
              <button
                type="button"
                onClick={() => { setAuthMode('signup'); setErrorMsg(null); }}
                className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition ${
                  authMode === 'signup' ? 'bg-white text-[#1d1d1f] shadow-xs' : 'text-[#86868b]'
                }`}
              >
                Create Account (New)
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode('signin'); setErrorMsg(null); }}
                className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition ${
                  authMode === 'signin' ? 'bg-white text-[#1d1d1f] shadow-xs' : 'text-[#86868b]'
                }`}
              >
                Sign In (Existing)
              </button>
            </div>

            {/* 3-WAY AUTH METHOD TABS: GOOGLE / EMAIL & PASSWORD / PHONE OTP */}
            <div className="flex bg-pink-100/70 p-1 rounded-2xl mb-5" role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={authMethod === 'google'}
                onClick={() => { setAuthMethod('google'); setErrorMsg(null); }}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  authMethod === 'google' 
                    ? 'bg-white text-[#1d1d1f] shadow-sm' 
                    : 'text-[#86868b] hover:text-[#1d1d1f]'
                }`}
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Google</span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={authMethod === 'email'}
                onClick={() => { setAuthMethod('email'); setErrorMsg(null); }}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  authMethod === 'email' 
                    ? 'bg-white text-[#1d1d1f] shadow-sm' 
                    : 'text-[#86868b] hover:text-[#1d1d1f]'
                }`}
              >
                <Mail className="w-3.5 h-3.5 text-[#0071e3]" />
                <span>Email &amp; Pass</span>
              </button>

              <button
                type="button"
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
                <span>Phone OTP</span>
              </button>
            </div>

            {/* ERROR NOTIFICATION BANNER */}
            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2 text-left">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span className="leading-snug">{errorMsg}</span>
              </div>
            )}

            {/* TAB 1: GOOGLE 1-CLICK */}
            {authMethod === 'google' && (
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-full bg-white hover:bg-stone-50 text-[#1d1d1f] border border-black/10 py-3.5 px-4 rounded-2xl font-bold text-xs sm:text-sm transition-all shadow-sm hover:shadow-apple-md flex items-center justify-center gap-3 active:scale-98 apple-focus cursor-pointer"
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
                  <span>Instant 1-click verification. Existing profiles skip all questions automatically!</span>
                </div>
              </div>
            )}

            {/* TAB 2: DIRECT EMAIL & PASSWORD */}
            {authMethod === 'email' && (
              <form onSubmit={handleEmailAuth} className="space-y-3.5 text-left">
                {authMode === 'signup' && (
                  <div>
                    <label className="block text-xs font-bold text-[#1d1d1f] mb-1">
                      Full Legal Name
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Vaibhav Sharma"
                      className="w-full bg-[#fdf8f8] border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0071e3]"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-[#1d1d1f] mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#86868b] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full bg-[#fdf8f8] border border-pink-200 rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0071e3]"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-bold text-[#1d1d1f]">Password</label>
                    {authMode === 'signup' && (
                      <span className="text-[10px] text-[#86868b]">Min 6 chars</span>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#86868b] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[#fdf8f8] border border-pink-200 rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0071e3]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#0071e3] hover:bg-[#0077ed] text-white py-3 rounded-full font-bold text-xs sm:text-sm transition shadow-sm flex items-center justify-center gap-2 apple-focus cursor-pointer"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <KeyRound className="w-4 h-4" />
                  )}
                  <span>
                    {authMode === 'signup' ? 'Create Account & Set Password' : 'Sign In with Email & Password'}
                  </span>
                </button>
              </form>
            )}

            {/* TAB 3: PHONE OTP */}
            {authMethod === 'phone' && (
              <div>
                {!otpSent ? (
                  <form onSubmit={handleSendOtp} className="space-y-4 text-left">
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
                      className="w-full bg-[#0071e3] hover:bg-[#0077ed] text-white py-3 rounded-full font-bold text-xs sm:text-sm transition shadow-sm flex items-center justify-center gap-2 apple-focus cursor-pointer"
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
                      className="w-full bg-[#0071e3] hover:bg-[#0077ed] text-white py-3 rounded-full font-bold text-xs sm:text-sm transition shadow-sm flex items-center justify-center gap-2 apple-focus cursor-pointer"
                    >
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
                      <span>Verify OTP &amp; Continue</span>
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        )}

        {/* STEP 2: DETAILS (ONLY DISPLAYED FOR BRAND-NEW USERS ON FIRST REGISTRATION) */}
        {step === 'details' && (
          <div>
            <div className="text-center mb-5">
              <span className="text-[11px] font-bold text-[#0071e3] uppercase tracking-wider block mb-1">
                One-Time Setup &bull; First Registration
              </span>
              <h2 className="text-xl font-bold text-[#1d1d1f] tracking-tight font-display">
                Complete Your Profile
              </h2>
              <p className="text-xs text-[#86868b] mt-1 font-sans">
                Set your city and locality once so verified companions appear in your exact area
              </p>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2 text-left">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleDetailsSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold text-[#1d1d1f] mb-1 font-sans">
                  Your Full Name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className="w-full bg-[#fdf8f8] border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0071e3]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1d1d1f] mb-1 font-sans">
                  WhatsApp Contact Number
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#1d1d1f]">
                    +91
                  </span>
                  <input
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

              <div>
                <label className="block text-xs font-bold text-[#1d1d1f] mb-1 font-sans">
                  Your Primary Launch City
                </label>
                <select
                  value={city}
                  onChange={(e) => handleCitySelect(e.target.value)}
                  className="w-full bg-[#fdf8f8] border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0071e3]"
                >
                  {LAUNCH_CITIES.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name} ({c.state})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1d1d1f] mb-1 font-sans">
                  6-Digit Postal PIN Code
                </label>
                <div className="relative">
                  <Search className="w-4 h-4 text-[#86868b] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={pinCode}
                    onChange={(e) => handlePinChange(e.target.value)}
                    placeholder="e.g. 110001, 248007, 400050"
                    className="w-full bg-[#fdf8f8] border border-pink-200 rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0071e3]"
                  />
                </div>
                {pinSuccess && (
                  <p className="text-[11px] text-emerald-600 font-bold mt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{pinSuccess}</span>
                  </p>
                )}
                {pinError && (
                  <p className="text-[11px] text-rose-500 font-bold mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{pinError}</span>
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0071e3] hover:bg-[#0077ed] text-white py-3 rounded-full font-bold text-xs sm:text-sm transition shadow-sm flex items-center justify-center gap-2 apple-focus cursor-pointer mt-2"
              >
                <span>Continue to Role Choice</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* STEP 3: ROLE SELECTION */}
        {step === 'role' && (
          <div>
            <div className="text-center mb-6">
              <span className="text-[11px] font-bold text-[#0071e3] uppercase tracking-wider block mb-1">
                Step 2 of 2
              </span>
              <h2 className="text-2xl font-bold text-[#1d1d1f] tracking-tight font-display">
                Choose Your Portal
              </h2>
              <p className="text-xs text-[#86868b] mt-1 font-sans">
                You can switch between both modes anytime from the top bar
              </p>
            </div>

            <div className="space-y-3 mb-6">
              {/* Option 1: Seeker */}
              <div
                onClick={() => setSelectedRole('seeker')}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-3.5 ${
                  selectedRole === 'seeker'
                    ? 'border-[#0071e3] bg-blue-50/50 shadow-sm'
                    : 'border-pink-200/80 bg-white hover:border-pink-300'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  selectedRole === 'seeker' ? 'bg-[#0071e3] text-white' : 'bg-pink-100 text-pink-700'
                }`}>
                  <Search className="w-5 h-5" />
                </div>
                <div className="text-left flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-[#1d1d1f]">I Want to Book Companions</h4>
                    {selectedRole === 'seeker' && (
                      <CheckCircle2 className="w-4 h-4 text-[#0071e3]" />
                    )}
                  </div>
                  <p className="text-xs text-[#86868b] mt-0.5">
                    Browse verified profiles in {city}, swipe match, or book dinner, movie, and hangout dates
                  </p>
                </div>
              </div>

              {/* Option 2: Companion */}
              <div
                onClick={() => setSelectedRole('companion')}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-3.5 ${
                  selectedRole === 'companion'
                    ? 'border-[#1d1d1f] bg-stone-50 shadow-sm'
                    : 'border-pink-200/80 bg-white hover:border-pink-300'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  selectedRole === 'companion' ? 'bg-[#1d1d1f] text-white' : 'bg-stone-100 text-stone-700'
                }`}>
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="text-left flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-[#1d1d1f]">I Want to Be a Companion</h4>
                    {selectedRole === 'companion' && (
                      <CheckCircle2 className="w-4 h-4 text-[#1d1d1f]" />
                    )}
                  </div>
                  <p className="text-xs text-[#86868b] mt-0.5">
                    Accept verified bookings, chat with clients, and earn 80% (up to ₹2,000/hr)
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleRoleConfirm}
              disabled={loading}
              className="w-full bg-[#1d1d1f] hover:bg-[#0071e3] text-white py-3.5 rounded-full font-bold text-xs sm:text-sm transition shadow-apple-sm flex items-center justify-center gap-2 active:scale-98 apple-focus cursor-pointer"
            >
              <span>Launch {selectedRole === 'seeker' ? 'Seeker Hub' : 'Partner Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
