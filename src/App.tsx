import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Home } from '@/components/Home';
import { Dashboard } from '@/components/Dashboard';
import { Loader2 } from 'lucide-react';
import { StarryBackground } from '@/components/StarryBackground';
import { Analytics } from '@vercel/analytics/react';

type View = 'home' | 'dashboard';

// 1. Check the clean pathname instead of the hash
function getRouteFromPath(): View {
  return window.location.pathname === '/dashboard' ? 'dashboard' : 'home';
}

function App() {
  const { user, loading } = useAuth();
  const [view, setView] = useState<View>(getRouteFromPath);

  useEffect(() => {
    // 2. Listen to browser back/forward buttons (popstate) instead of hashchange
    const onPopState = () => setView(getRouteFromPath());
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate = (v: View) => {
    // 3. Push clean paths (e.g., '/dashboard') to the URL without reloading the page
    const path = v === 'home' ? '/' : `/${v}`;
    window.history.pushState(null, '', path);
    setView(v);
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
      {view === 'dashboard' ? (
        <Dashboard onNavigateHome={() => navigate('home')} />
      ) : (
        <Home onNavigateDashboard={() => navigate('dashboard')} />
      )}
      <Analytics />
    </>
  );
}

export default App;