import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Home } from '@/components/Home';
import { Dashboard } from '@/components/Dashboard';
import { Loader2 } from 'lucide-react';
import { StarryBackground } from '@/components/StarryBackground';

type View = 'home' | 'dashboard';

function getRouteFromPath(): View {
  const path = window.location.pathname.replace(/\/$/, '');
  return path === '/dashboard' ? 'dashboard' : 'home';
}

function App() {
  const { user, loading } = useAuth();
  const [view, setView] = useState<View>(getRouteFromPath);

  useEffect(() => {
    const onPopState = () => setView(getRouteFromPath());
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate = (v: View) => {
    const newPath = v === 'home' ? '/' : `/${v}`;
    window.history.pushState({}, '', newPath);
    setView(v);
  };

  if (loading) {
    return (
      <div className="relative min-h-screen flex items-center justify-center">
        <StarryBackground />
        <Loader2 className="w-8 h-8 animate-spin text-amber-300" />
      </div>
    );
  }

  if (view === 'dashboard') {
    return <Dashboard onNavigateHome={() => navigate('home')} />;
  }

  return <Home onNavigateDashboard={() => navigate('dashboard')} />;
}

export default App;