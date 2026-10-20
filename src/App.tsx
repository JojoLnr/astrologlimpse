import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Home } from '@/components/Home';
import { Dashboard } from '@/components/Dashboard';
import { Privacy } from '@/components/Privacy';
import { Discount } from '@/components/Discount';
import { DiscountPurchased } from '@/components/DiscountPurchased';
import { Loader2 } from 'lucide-react';
import { StarryBackground } from '@/components/StarryBackground';
import { Analytics } from '@vercel/analytics/react';

type View = 'home' | 'dashboard' | 'privacy' | 'discount' | 'discountPurchased';

function getRouteFromPath(): View {
  if (typeof window === 'undefined') return 'home';
  const path = window.location.pathname;
  if (path === '/privacy') return 'privacy';
  if (path === '/discount') return 'discount';
  if (path === '/discountpurchased') return 'discountPurchased';
  return path === '/dashboard' ? 'dashboard' : 'home';
}

const trackSPAPageView = (path: string) => {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('config', 'AW-718364257', {
      page_path: path,
    });
  }
};


function App() {
  const { user, loading } = useAuth();
  
  // Set the structural deep-link intent permanently on mount
  const [view, setView] = useState<View>(getRouteFromPath);

  // 1. Guard Loop: Validates path changes ONLY when Supabase state is fully verified
  useEffect(() => {
    if (loading) return; // Wait until loading completes before shifting any states

    const currentPath = window.location.pathname;
    
    if (user && currentPath === '/') {
      window.history.pushState(null, '', '/dashboard');
      setView('dashboard');
      trackSPAPageView('/dashboard');
    }else {
      // Safely preserve valid guest pathways like /discount or verified deep-links
      setView(getRouteFromPath());
    }
  }, [user, loading]);

  // 2. Continuous PopState History Watcher
  useEffect(() => {
    const onPopState = () => {
      setView(getRouteFromPath());
      if (!loading) {
        trackSPAPageView(window.location.pathname);
      }
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [loading]);

  const navigate = (v: View) => {
    const path = v === 'home' ? '/' : v === 'discountPurchased' ? '/discountpurchased' : `/${v}`;
    if (typeof window !== 'undefined' && window.history) {
      window.history.pushState(null, '', path);
    }
    setView(v);
    trackSPAPageView(path);
  };

  return (
    <>
      {/* 🛡️ Full-Screen Loading Mask Overlay (Preserves the main component trees behind it) */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-midnight-950">
          <StarryBackground />
          <Loader2 className="w-8 h-8 animate-spin text-amber-300" />
        </div>
      )}

      {/* Main Structural Components */}
      {view === 'dashboard' && (
        <Dashboard onNavigateHome={() => navigate('home')} />
      )}
      {view === 'privacy' && (
        <Privacy onNavigateHome={() => navigate('home')} />
      )}
      {view === 'discount' && (
        <Discount onNavigateHome={() => navigate('home')} />
      )}
      {view === 'discountPurchased' && (
        <DiscountPurchased onNavigateDashboard={() => navigate('dashboard')} />
      )}
      {view === 'home' && (
        <Home onNavigateDashboard={() => navigate('dashboard')} />
      )}
      <Analytics />
    </>
  );
}

export default App;
