import { useState } from 'react';
import { Loader2, LogOut, Settings, Crown, Zap, Calendar, Sparkles } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { createPortalSession } from '@/lib/stripe';

interface AccountSettingsProps {
  onOpenPaywall: () => void;
}

export function AccountSettings({ onOpenPaywall }: AccountSettingsProps) {
  const { user, profile, signOut } = useAuth();
  const [portalLoading, setPortalLoading] = useState(false);
  const [portalError, setPortalError] = useState('');

  if (!profile && !user) return null;

  const userEmail = profile?.email || user?.email;
  const isMonthly = profile?.subscription_status === 'monthly';
  const hasWeeklyUnlock =
    profile?.weekly_unlocked_until && new Date(profile.weekly_unlocked_until) > new Date();
  const isSubscribed = isMonthly || hasWeeklyUnlock;

  const handleBillingClick = async () => {
    if (!isSubscribed) {
      onOpenPaywall();
      return;
    }

    setPortalLoading(true);
    setPortalError('');
    try {
      const url = await createPortalSession();
      window.location.href = url;
    } catch (err) {
      setPortalError(err instanceof Error ? err.message : 'Failed to open billing portal');
      setPortalLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <div className="flex items-center gap-2 mb-5">
        <Settings className="w-5 h-5 text-slate-400" />
        <h3 className="text-lg font-serif text-white">Account & Settings</h3>
      </div>

      {/* Subscription Status Display Card */}
      <div className="mb-6">
        <div className="flex items-center justify-between rounded-xl bg-white/[0.04] border border-white/10 p-4">
          <div className="flex items-center gap-3">
            {isMonthly ? (
              <div className="w-10 h-10 rounded-xl bg-amber-300/10 border border-amber-300/20 flex items-center justify-center">
                <Crown className="w-5 h-5 text-amber-300" />
              </div>
            ) : hasWeeklyUnlock ? (
              <div className="w-10 h-10 rounded-xl bg-blue-400/10 border border-blue-400/20 flex items-center justify-center">
                <Zap className="w-5 h-5 text-blue-300" />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-slate-400" />
              </div>
            )}
            <div>
              <p className="text-sm text-white font-medium">
                {isMonthly
                  ? 'Premium Subscription'
                  : hasWeeklyUnlock
                    ? 'Weekly Unlock Active'
                    : 'Free Plan'}
              </p>
              <p className="text-xs text-slate-400">
                {isMonthly
                  ? 'Unlimited weekly readings'
                  : hasWeeklyUnlock
                    ? `Active until ${new Date(profile!.weekly_unlocked_until!).toLocaleDateString()}`
                    : 'Subscribe to unlock weekly readings'}
              </p>
            </div>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium border ${
              isMonthly
                ? 'bg-amber-300/10 border-amber-300/20 text-amber-200'
                : hasWeeklyUnlock
                  ? 'bg-blue-400/10 border-blue-400/20 text-blue-200'
                  : 'bg-white/5 border-white/10 text-slate-400'
            }`}
          >
            {isMonthly ? 'Monthly' : hasWeeklyUnlock ? 'Weekly' : 'Free'}
          </span>
        </div>
      </div>

      {/* Primary Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleBillingClick}
          disabled={portalLoading}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-medium transition-all disabled:opacity-50 ${
            !isSubscribed
              ? 'bg-gradient-to-r from-amber-400 to-amber-500 border-amber-300 text-[#0a0e27] font-semibold hover:from-amber-300 hover:to-amber-400'
              : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
          }`}
        >
          {portalLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : !isSubscribed ? (
            <>
              <Sparkles className="w-4 h-4 text-[#0a0e27]" />
              Subscribe to Unlock
            </>
          ) : (
            <>
              <Crown className="w-4 h-4 text-amber-300" />
              Manage Billing
            </>
          )}
        </button>
        <button
          onClick={signOut}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-sm font-medium hover:bg-red-500/10 hover:border-red-400/20 hover:text-red-300 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Log Out
        </button>
      </div>

      {portalError && (
        <p className="mt-3 text-red-400 text-xs text-center">{portalError}</p>
      )}

      {userEmail && (
        <p className="mt-4 text-center text-xs text-slate-500">
          Signed in as <span className="text-slate-400 font-medium">{userEmail}</span>
        </p>
      )}
    </div>
  );
}