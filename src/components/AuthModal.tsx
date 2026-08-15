import { useState } from 'react';
import { X, Mail, Lock, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/auth';

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="18" height="18">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}

export default function AuthModal({ onClose }: { onClose: () => void }) {
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const fn = mode === 'signin' ? signIn : signUp;
    const { error: err } = await fn(email, password);
    setLoading(false);
    if (err) {
      setError(err === 'Invalid login credentials'
        ? 'Incorrect email or password.'
        : err.includes('already registered')
          ? 'An account with this email already exists. Try signing in.'
          : err);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-navy-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md mx-4 rounded-2xl border border-gold-400/25 bg-navy-900 p-8 shadow-2xl shadow-gold-400/10">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-cream-200/40 transition-colors hover:text-gold-300"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="text-center">
          <span className="font-ornament text-2xl text-gold-400">✦</span>
          <h2 className="mt-2 font-display text-2xl font-semibold uppercase tracking-wide text-cream-50">
            {mode === 'signin' ? 'Welcome Back' : 'Join Astrologlimpse'}
          </h2>
          <p className="mt-2 font-serif text-sm italic text-cream-200/50">
            {mode === 'signin' ? 'Sign in to access your full readings' : 'Create an account to unlock the cosmos'}
          </p>
        </div>

        <button
          onClick={async () => {
            setLoading(true);
            const { error: err } = await signInWithGoogle();
            if (err) { setError(err); setLoading(false); }
          }}
          disabled={loading}
          className="flex w-full items-center justify-center gap-3 rounded-lg border border-cream-200/20 bg-cream-50 px-6 py-3 font-display text-[11px] font-semibold uppercase tracking-[0.15em] text-navy-950 transition-all hover:bg-cream-100 disabled:opacity-60"
        >
          <GoogleIcon />
          Continue with Google
        </button>

        <div className="mt-6 flex items-center gap-3">
          <span className="h-px flex-1 bg-gold-400/15" />
          <span className="font-display text-[10px] uppercase tracking-[0.2em] text-cream-200/40">or</span>
          <span className="h-px flex-1 bg-gold-400/15" />
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label className="font-display text-[10px] font-medium uppercase tracking-[0.2em] text-gold-400">
              Email
            </label>
            <div className="mt-2 flex items-center gap-2 rounded-lg border border-gold-400/20 bg-navy-800/50 px-3 py-2.5">
              <Mail className="h-4 w-4 text-gold-400/50" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-transparent font-serif text-base text-cream-100 placeholder:text-cream-200/30 focus:outline-none"
                placeholder="your@email.com"
              />
            </div>
          </div>

          <div>
            <label className="font-display text-[10px] font-medium uppercase tracking-[0.2em] text-gold-400">
              Password
            </label>
            <div className="mt-2 flex items-center gap-2 rounded-lg border border-gold-400/20 bg-navy-800/50 px-3 py-2.5">
              <Lock className="h-4 w-4 text-gold-400/50" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex-1 bg-transparent font-serif text-base text-cream-100 placeholder:text-cream-200/30 focus:outline-none"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <p className="rounded-lg border border-red-400/20 bg-red-400/10 px-4 py-2.5 font-serif text-sm text-red-300">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-gold-400 px-6 py-3 font-display text-[11px] font-semibold uppercase tracking-[0.2em] text-navy-950 transition-all hover:bg-gold-300 hover:shadow-lg hover:shadow-gold-400/20 disabled:opacity-60"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {mode === 'signin' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <p className="mt-6 text-center font-serif text-sm text-cream-200/50">
          {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(null); }}
            className="font-display text-[11px] font-semibold uppercase tracking-wider text-gold-300 transition-colors hover:text-gold-200"
          >
            {mode === 'signin' ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  );
}
