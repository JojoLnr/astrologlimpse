import { useState } from 'react';
import { X, User, Crown, Calendar, CreditCard, Loader2, LogOut, ExternalLink, Sparkles } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useSubscription } from '@/hooks/useSubscription';
import { supabase } from '@/lib/supabase';
import { STRIPE_PRODUCTS } from '@/stripe-config';

export default function AccountModal({ onClose }: { onClose: () => void }) {
  const { user, isPaidMember, signOut } = useAuth();
  const { subscription, loading: subLoading } = useSubscription();
  const [portalLoading, setPortalLoading] = useState(false);
  const [portalError, setPortalError] = useState<string | null>(null);

  const handleOpenPortal = async () => {
    setPortalError(null);
    if (!user) return;
    setPortalLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setPortalError('Session expired. Please sign in again.');
        setPortalLoading(false);
        return;
      }

      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-portal`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      if (!res.ok) {
        setPortalError('Unable to open billing portal. Please try again.');
        setPortalLoading(false);
        return;
      }

      const { url } = await res.json();
      if (url) {
        window.location.href = url;
      } else {
        setPortalError('Unable to open billing portal.');
      }
    } catch {
      setPortalError('Something went wrong. Please try again.');
    }
    setPortalLoading(false);
  };

  const handleSignOut = async () => {
    await signOut();
    onClose();
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const product = STRIPE_PRODUCTS[0];

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
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-gold-400/30 bg-gold-400/10">
            <User className="h-6 w-6 text-gold-300" strokeWidth={1.5} />
          </div>
          <h2 className="mt-4 font-display text-2xl font-semibold uppercase tracking-wide text-cream-50">
            Your Account
          </h2>
          {user && (
            <p className="mt-1 font-serif text-sm italic text-cream-200/50">{user.email}</p>
          )}
        </div>

        {/* Membership status */}
        <div className="mt-6 rounded-xl border border-gold-400/20 bg-navy-800/40 p-5">
          {isPaidMember ? (
            <>
              <div className="flex items-center gap-2.5">
                <Crown className="h-5 w-5 text-gold-300" strokeWidth={1.5} />
                <span className="font-display text-sm font-semibold uppercase tracking-wider text-gold-300">
                  Active Member
                </span>
              </div>
              <p className="mt-2 font-serif text-sm text-cream-200/70">
                {product.name} — ${product.price}/month
              </p>

              {!subLoading && subscription && (
                <div className="mt-4 space-y-2 border-t border-gold-400/10 pt-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-3.5 w-3.5 text-cream-200/40" />
                    <span className="font-serif text-cream-200/50">Renews on</span>
                    <span className="font-serif text-cream-100/80">
                      {formatDate(subscription.current_period_end)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CreditCard className="h-3.5 w-3.5 text-cream-200/40" />
                    <span className="font-serif text-cream-200/50">Status</span>
                    <span className="font-serif capitalize text-cream-100/80">
                      {subscription.status}
                    </span>
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="flex items-center gap-2.5">
                <Sparkles className="h-5 w-5 text-cream-200/40" strokeWidth={1.5} />
                <span className="font-display text-sm font-semibold uppercase tracking-wider text-cream-200/60">
                  Free Plan
                </span>
              </div>
              <p className="mt-2 font-serif text-sm text-cream-200/50">
                Upgrade to unlock all readings, rituals, and cosmic insights.
              </p>
              <button
                onClick={() => {
                  onClose();
                  window.dispatchEvent(new CustomEvent('open-membership'));
                }}
                className="mt-4 w-full rounded-lg bg-gold-400 px-4 py-2.5 font-display text-[11px] font-semibold uppercase tracking-[0.2em] text-navy-950 transition-all hover:bg-gold-300 hover:shadow-lg hover:shadow-gold-400/20"
              >
                Upgrade Now
              </button>
            </>
          )}
        </div>

        {/* Manage subscription via Stripe portal */}
        {isPaidMember && (
          <div className="mt-4">
            {portalError && (
              <p className="mb-3 rounded-lg border border-red-400/20 bg-red-400/10 px-4 py-2 font-serif text-sm text-red-300">
                {portalError}
              </p>
            )}
            <button
              onClick={handleOpenPortal}
              disabled={portalLoading}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-gold-400/30 bg-gold-400/10 px-4 py-3 font-display text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-200 transition-all hover:bg-gold-400/20 disabled:opacity-60"
            >
              {portalLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ExternalLink className="h-4 w-4" />
              )}
              Manage Subscription
            </button>
            <p className="mt-2 text-center font-serif text-xs italic text-cream-200/30">
              Update payment method or cancel via Stripe's secure portal.
            </p>
          </div>
        )}

        {/* Sign out */}
        <button
          onClick={handleSignOut}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-cream-200/15 px-4 py-3 font-display text-[11px] font-semibold uppercase tracking-[0.2em] text-cream-200/60 transition-all hover:border-cream-200/30 hover:text-cream-100"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
