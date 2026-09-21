import { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

// Add TypeScript definition for gtag to avoid linting errors
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

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

// Helper function to trigger Google Ads conversion
const trackSignUpConversion = () => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'conversion', {
      'send_to': 'AW-718364257/RdNnCNzboPscEOG8xdYC',
    });
    console.log('Google Ads Sign-up conversion tracked.');
  } else {
    console.warn('Google tag (gtag) not found. Ensure the global snippet is installed in index.html.');
  }
};

export function AuthCTA() {
  const { signInWithGoogle } = useAuth();
  const [status, setStatus] = useState<'idle' | 'sending' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleGoogle = async () => {
    setStatus('sending');
    setErrorMsg('');
    
    const { error } = await signInWithGoogle();
    
    if (error) {
      setStatus('error');
      setErrorMsg(error);
    } else {
      trackSignUpConversion();
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-4 sm:pb-6 pointer-events-none">
      <div className="max-w-2xl mx-auto pointer-events-auto">
        <div className="relative rounded-2xl border border-amber-300/20 bg-gradient-to-br from-[#111936]/95 to-[#0a0e27]/95 backdrop-blur-xl shadow-[0_-4px_40px_rgba(0,0,0,0.5)] overflow-hidden">
          {/* Glow accent */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-amber-300/40 to-transparent" />
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-40 bg-amber-500/10 blur-[60px] rounded-full" />

          <div className="relative p-5 sm:p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-amber-300/10 border border-amber-300/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <h3 className="text-white font-serif text-lg leading-snug">
                  Get your free reading package!
                </h3>
                <p className="text-amber-200/70 text-sm">
                  Sign in to instantly claim your reading
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleGoogle}
                disabled={status === 'sending'}
                className="w-full flex items-center justify-center gap-3 py-3 rounded-xl bg-white/10 border border-white/20 text-white text-sm font-semibold hover:bg-white/20 transition-all disabled:opacity-50"
              >
                {status === 'sending' ? (
                  <Loader2 className="w-5 h-5 animate-spin text-amber-300" />
                ) : (
                  <>
                    <GoogleIcon />
                    <span>Continue with Google</span>
                  </>
                )}
              </button>

              {status === 'error' && (
                <p className="text-red-400 text-xs text-center">{errorMsg}</p>
              )}

              <p className="text-center text-xs text-slate-500">
                Fast and secure sign-in with your Google account.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
