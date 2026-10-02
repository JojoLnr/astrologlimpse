import { useState } from 'react';
import { Loader2, LogOut, Settings, Crown, Zap, Calendar } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { createPortalSession } from '@/lib/stripe';

export function AccountSettings() {
  const { profile, signOut } = useAuth();
  const [portalLoading, setPortalLoading] = useState(false);
  const [portalError, setPortalError] = useState('');

  if (!profile) return null;

  const isMonthly = profile.subscription_status === 'monthly';
  const hasWeeklyUnlock =
    profile.weekly_unlocked_until && new Date(profile.weekly_unlocked_until) > new Date();

  const handlePortal = async () => {
    setPortalLoading(true);
    setPortalError('');
    try {
      const url = await createPortalSession();
      window.location.href = url;
    } catch (err) {
      setPortalError(err instanceof Error ? err.message : 'Failed to open portal');
      setPortalLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
      <div className="flex items-center gap-2.5 mb-5">
        <Settings className="w-4 h-4 text-slate-500" />
        <h3 className="text-base font-serif text-champagne-50 tracking-wide">Account and Settings</h3>
      </div>

      {/* Subscription status */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between rounded-xl bg-white/[0.02] border border-white/[0.06] p-4">
          <div className="flex items-center gap-3">
            {isMonthly ? (
              <div className="w-10 h-10 rounded-lg bg-champagne-400/[0.08] border border-champagne-400/15 flex items-center justify-center">
                <Crown className="w-5 h-5 text-champagne-300" />
              </div>
            ) : hasWeeklyUnlock ? (
              <div className="w-10 h-10 rounded-lg bg-blue-400/[0.08] border border-blue-400/15 flex items-center justify-center">
                <Zap className="w-5 h-5 text-blue-300" />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-lg bg-white/[0.03] border border-white/[0.08] flex items-center justify-center">
                <Calendar className="w-5 h-5 text-slate-500" />
              </div>
            )}
            <div>
              <p className="text-sm text-champagne-50 font-medium">
                {isMonthly
                  ? 'Premium Subscription'
                  : hasWeeklyUnlock
                    ? 'Weekly Unlock Active'
                    : 'No Active Subscription'}
              </p>
              <p className="text-xs text-slate-500">
                {isMonthly
                  ? 'Unlimited weekly readings'
                  : hasWeeklyUnlock
                    ? `Expires ${new Date(profile.weekly_unlocked_until!).toLocaleDateString()}`
                    : 'Subscribe to unlock all readings'}
              </p>
            </div>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium border ${
              isMonthly
                ? 'bg-champagne-400/[0.08] border-champagne-400/15 text-champagne-200'
                : hasWeeklyUnlock
                  ? 'bg-blue-400/[0.08] border-blue-400/15 text-blue-200'
                  : 'bg-white/[0.03] border-white/[0.08] text-slate-500'
            }`}
          >
            {isMonthly ? 'Monthly' : hasWeeklyUnlock ? 'Weekly' : 'Free'}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handlePortal}
          disabled={portalLoading}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-champagne-50 text-sm font-medium hover:bg-white/[0.06] hover:border-champagne-400/20 transition-all duration-300 disabled:opacity-50"
        >
          {portalLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Crown className="w-4 h-4 text-champagne-400" />}
          Manage Billing
        </button>
        <button
          onClick={signOut}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-slate-400 text-sm font-medium hover:bg-red-500/[0.06] hover:border-red-400/15 hover:text-red-300 transition-all duration-300"
        >
          <LogOut className="w-4 h-4" />
          Log Out
        </button>
      </div>

      {portalError && (
        <p className="mt-3 text-red-400/80 text-xs text-center">{portalError}</p>
      )}

      <p className="mt-4 text-center text-xs text-slate-600">
        Signed in as {profile.email}
      </p>
    </div>
  );
}
