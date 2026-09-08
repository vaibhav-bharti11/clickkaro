import React, { useState } from 'react';
import { X, Lock, Mail, Eye, EyeOff, ShieldCheck, Sparkles, KeyRound } from 'lucide-react';
import confetti from 'canvas-confetti';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string, pass: string) => boolean;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLogin,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email || !password) {
      setErrorMsg('Please enter both Admin email and password.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const success = onLogin(email, password);
      setIsSubmitting(false);

      if (success) {
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
        onClose();
      } else {
        setErrorMsg('Invalid admin credentials. Please check your email/password or use default master key.');
      }
    }, 400);
  };

  const handleUseDemoCredentials = () => {
    setEmail('admin@clickkarodatekaro.com');
    setPassword('Admin@ClickKaro2025!');
    setErrorMsg(null);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-login-title"
      className="fixed inset-0 z-[250] flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-fade-in"
    >
      <div className="relative w-full max-w-md bg-white/95 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 border border-pink-200/80 shadow-[0_24px_70px_rgba(0,0,0,0.2)] text-[#1d1d1f] font-sans">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close admin login"
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Icon & Title */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#1d1d1f] via-[#2C2C2E] to-[#FF2D55] text-white flex items-center justify-center mx-auto mb-3 shadow-md ring-4 ring-pink-100">
            <Lock className="w-6 h-6" />
          </div>
          <h3 id="admin-login-title" className="text-xl sm:text-2xl font-bold font-display text-[#111827]">
            Admin CMS Portal
          </h3>
          <p className="text-xs text-stone-500 mt-1">
            Sign in to manage live homepage segments, texts, images, and FAQs.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Email Input */}
          <div>
            <label htmlFor="admin-email" className="block text-xs font-bold text-stone-700 mb-1.5">
              Admin Email / Username
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="admin-email"
                type="text"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@clickkarodatekaro.com"
                className="w-full pl-10 pr-3.5 py-3 rounded-2xl bg-stone-50/80 border border-stone-200 text-xs text-[#1d1d1f] placeholder:text-stone-400 focus:bg-white focus:border-[#FF2D55] focus:ring-2 focus:ring-[#FF2D55]/20 outline-none transition"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="admin-password" className="block text-xs font-bold text-stone-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="admin-password"
                type={showPass ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-10 py-3 rounded-2xl bg-stone-50/80 border border-stone-200 text-xs text-[#1d1d1f] placeholder:text-stone-400 focus:bg-white focus:border-[#FF2D55] focus:ring-2 focus:ring-[#FF2D55]/20 outline-none transition"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                aria-label={showPass ? 'Hide password' : 'Show password'}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 transition cursor-pointer"
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium animate-fade-in flex items-start gap-2">
              <span className="shrink-0 mt-0.5">⚠️</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-2xl bg-[#1d1d1f] hover:bg-[#FF2D55] text-white text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-md active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
          >
            {isSubmitting ? (
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Enter CMS Dashboard</span>
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Fill Helper */}
        <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
          <span>Demo master login:</span>
          <button
            type="button"
            onClick={handleUseDemoCredentials}
            className="inline-flex items-center gap-1 font-bold text-[#0071E3] hover:underline cursor-pointer"
          >
            <Sparkles className="w-3 h-3" />
            <span>Auto-fill Admin</span>
          </button>
        </div>

      </div>
    </div>
  );
};
