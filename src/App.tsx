import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Home } from '@/components/Home';
import { Dashboard } from '@/components/Dashboard';
import { Loader2 } from 'lucide-react';
import { StarryBackground } from '@/components/StarryBackground';

type View = 'home' | 'dashboard';

function getRouteFromHash(): View {
  return window.location.hash === '#/dashboard' ? 'dashboard' : 'home';
}

function App() {
  const { user, loading } = useAuth();
  const [view, setView] = useState<View>(getRouteFromHash);

  useEffect(() => {
    const onHashChange = () => setView(getRouteFromHash());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigate = (v: View) => {
    window.location.hash = v === 'home' ? '' : `#/${v}`;
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
