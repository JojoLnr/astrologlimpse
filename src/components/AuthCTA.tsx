import { useState } from 'react';
import { Mail, Sparkles, Loader2, Check } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

// 1. Tell TypeScript window.gtag is safe to use in this file
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

// 2. Helper function to trigger your Google Ads conversion event
const trackLeadConversion = () => {
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'conversion', {
      // REPLACE 'YOUR_CONVERSION_LABEL' with the exact string from your dashboard
      'send_to': 'AW-718364257/YOUR_CONVERSION_LABEL'
    });
  }
};

function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

export function AuthCTA() {
  const { signInWithMagicLink, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('sending');
    setErrorMsg('');
    const { error } = await signInWithMagicLink(email);
    if (error) {
      setStatus('error');
      setErrorMsg(error);
    } else {
      setStatus('sent');
      trackLeadConversion(); // 3. Fire conversion tracking when email submits successfully
    }
  };

  const handleGoogle = async () => {
    setStatus('sending');
    trackLeadConversion(); // 4. Fire conversion tracking when Google OAuth begins
    const { error } = await signInWithGoogle();
    if (error) {
      setStatus('error');
      setErrorMsg(error);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-4 sm:pb-6 pointer-events-none">
      <div className="max-w-2xl mx-auto pointer-events-auto">
        <div className="relative rounded-2xl border border-champagne-400/15 bg-gradient-to-br from-midnight-800/95 to-midnight-900/95 backdrop-blur-xl shadow-[0_-8px_60px_rgba(0,0,0,0.6)] overflow-hidden">
          {/* Glow accent */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-champagne-300/30 to-transparent" />
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-40 bg-champagne-500/[0.04] blur-[60px] rounded-full" />

          <div className="relative p-5 sm:p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-champagne-400/[0.08] border border-champagne-400/15 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-champagne-300" />
              </div>
              <div>
                <h3 className="text-champagne-50 font-serif text-lg leading-snug">
                  Get your free biweekly horoscope
                </h3>
                <p className="text-champagne-200/50 text-sm">
                  and unlock your complete 10-point cosmic reading
                </p>
              </div>
            </div>

            {status === 'sent' ? (
              <div className="flex items-center gap-3 py-4 px-4 rounded-xl bg-emerald-500/[0.06] border border-emerald-400/15">
                <Check className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <div>
                  <p className="text-emerald-300 text-sm font-medium">Check your inbox</p>
                  <p className="text-slate-400 text-xs">We sent a magic link to {email}. Click it to enter your dashboard.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <form onSubmit={handleMagicLink} className="flex gap-2">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                      disabled={status === 'sending'}
                      className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-champagne-50 text-sm placeholder-slate-600 focus:outline-none focus:border-champagne-400/30 focus:bg-white/[0.05] transition-all duration-300"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-champagne-300 to-champagne-400 text-midnight-950 text-sm font-semibold hover:from-champagne-200 hover:to-champagne-300 transition-all duration-300 disabled:opacity-50 flex items-center gap-2 whitespace-nowrap"
                  >
                    {status === 'sending' ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      'Continue'
                    )}
                  </button>
                </form>

                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-white/[0.06]" />
                  <span className="text-xs text-slate-600">or</span>
                  <div className="flex-1 h-px bg-white/[0.06]" />
                </div>

                <button
                  onClick={handleGoogle}
                  disabled={status === 'sending'}
                  className="w-full flex items-center justify-center gap-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-champagne-50 text-sm font-medium hover:bg-white/[0.06] transition-all duration-300 disabled:opacity-50"
                >
                  <GoogleIcon />
                  Continue with Google
                </button>

                {status === 'error' && (
                  <p className="text-red-400/80 text-xs text-center">{errorMsg}</p>
                )}

                <p className="text-center text-xs text-slate-600">
                  No password needed. We'll send a secure link to your email.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
