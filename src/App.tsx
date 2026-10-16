import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Home } from '@/components/Home';
import { Dashboard } from '@/components/Dashboard';
import { Privacy } from '@/components/Privacy';
import { Discount } from '@/components/Discount';
import { Loader2 } from 'lucide-react';
import { StarryBackground } from '@/components/StarryBackground';
import { Analytics } from '@vercel/analytics/react';

type View = 'home' | 'dashboard' | 'privacy' | 'discount';

function getRouteFromPath(): View {
  if (typeof window === 'undefined') return 'home';
  const path = window.location.pathname;
  if (path === '/privacy') return 'privacy';
  if (path === '/discount') return 'discount';
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
  const [view, setView] = useState<View>(getRouteFromPath);

  // 1. Dynamic Routing Guard: Detects login changes and forces the correct view state
  useEffect(() => {
    if (!loading) {
      const currentPath = window.location.pathname;
      
      if (user && currentPath === '/') {
        // If logged in but at root link, force view to dashboard view state
        window.history.pushState(null, '', '/dashboard');
        setView('dashboard');
        trackSPAPageView('/dashboard');
      } else if (!user && currentPath === '/dashboard') {
        // If logged out but trying to view dashboard, force back home
        window.history.pushState(null, '', '/');
        setView('home');
        trackSPAPageView('/');
      }
    }
  }, [user, loading]);

  // 2. Initial Setup and PopState listener logic
  useEffect(() => {
    trackSPAPageView(window.location.pathname);

    const onPopState = () => {
      setView(getRouteFromPath());
      trackSPAPageView(window.location.pathname);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate = (v: View) => {
    const path = v === 'home' ? '/' : `/${v}`;
    if (typeof window !== 'undefined' && window.history) {
      window.history.pushState(null, '', path);
    }
    setView(v);
    trackSPAPageView(path);
  };

  if (loading) {
    return (
      <div className="relative min-h-screen flex items-center justify-center">
        <StarryBackground />
        <Loader2 className="w-8 h-8 animate-spin text-amber-300" />
        <Analytics />
      </div>
    );
  }

  return (
    <>
      {view === 'dashboard' && (
        <Dashboard onNavigateHome={() => navigate('home')} />
      )}
      {view === 'privacy' && (
        <Privacy onNavigateHome={() => navigate('home')} />
      )}
      {view === 'discount' && (
        <Discount onNavigateHome={() => navigate('home')} />
      )}
      {view === 'home' && (
        <Home onNavigateDashboard={() => navigate('dashboard')} />
      )}
      <Analytics />
    </>
  );
}

export default App;
