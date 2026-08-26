import { lazy, Suspense, useEffect, useState, useCallback } from 'react';
import type { CosmicData } from '@/lib/types';
import { fetchCosmicData } from '@/lib/data';
import { useAuth } from '@/lib/auth';
import Starfield from '@/components/Starfield';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ZodiacSelector, { type ZodiacSign } from '@/components/ZodiacSelector';
import LazySection from '@/components/LazySection';
import AuthModal from '@/components/AuthModal';
import MembershipModal from '@/components/MembershipModal';
import AccountModal from '@/components/AccountModal';

const SignReadingSection = lazy(() => import('@/components/SignReadingSection'));
const CelestialMap = lazy(() => import('@/components/CelestialMap'));
// const EclipseSection = lazy(() => import('@/components/EclipseSection'));
const TransitTracker = lazy(() => import('@/components/TransitTracker'));
const LunarBlueprint = lazy(() => import('@/components/LunarBlueprint'));
const TarotSpread = lazy(() => import('@/components/TarotSpread'));
const ElementalBreakdown = lazy(() => import('@/components/ElementalBreakdown'));
const ShadowWork = lazy(() => import('@/components/ShadowWork'));
const CrystalBotanicalPairings = lazy(() => import('@/components/CrystalBotanicalPairings'));
const VoidMoonTimers = lazy(() => import('@/components/VoidMoonTimers'));
const MantraCodes = lazy(() => import('@/components/MantraCodes'));
const BirthChartCalculator = lazy(() => import('@/components/BirthChartCalculator'));
const CompatibilityMatrix = lazy(() => import('@/components/CompatibilityMatrix'));
const FixedStarLibrary = lazy(() => import('@/components/FixedStarLibrary'));
const SabianSymbolsOracle = lazy(() => import('@/components/SabianSymbolsOracle'));
const PlanetaryHourCalculator = lazy(() => import('@/components/PlanetaryHourCalculator'));
const ElementalModalityBreakdown = lazy(() => import('@/components/ElementalModalityBreakdown'));
const MythologicalArchives = lazy(() => import('@/components/MythologicalArchives'));
const CosmicEvents = lazy(() => import('@/components/CosmicEvents'));
const ReportDownload = lazy(() => import('@/components/ReportDownload'));
const Footer = lazy(() => import('@/components/Footer'));

const emptyData: CosmicData = {
  transits: [],
  lunarPhase: null,
  tarotCards: [],
  elementalEnergy: [],
  shadowPrompts: [],
  crystalBotanical: [],
  voidMoonWindows: [],
  mantras: [],
  signReadings: {},
  cosmicEvents: [],
};

function SectionFallback() {
  return (
    <div className="flex items-center justify-center py-24">
      <span className="font-ornament text-gold-400/40 text-2xl animate-pulse">✦</span>
    </div>
  );
}

export default function App() {
  const { isPaidMember } = useAuth();
  const [data, setData] = useState<CosmicData>(emptyData);
  const [error, setError] = useState<string | null>(null);
  const [selectedSign, setSelectedSign] = useState<ZodiacSign | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [membershipOpen, setMembershipOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  const isSubscribed = isPaidMember;

  const handleProgress = useCallback((partial: CosmicData) => {
    setData({ ...partial });
  }, []);

  useEffect(() => {
    fetchCosmicData(handleProgress)
      .catch(() => setError('Unable to load the cosmic forecast right now.'));
  }, [handleProgress]);

  useEffect(() => {
    const openAuth = () => setAuthOpen(true);
    const openMembership = () => setMembershipOpen(true);
    const openAccount = () => setAccountOpen(true);
    window.addEventListener('open-auth', openAuth);
    window.addEventListener('open-membership', openMembership);
    window.addEventListener('open-account', openAccount);
    return () => {
      window.removeEventListener('open-auth', openAuth);
      window.removeEventListener('open-membership', openMembership);
      window.removeEventListener('open-account', openAccount);
    };
  }, []);

  if (error) {
    return (
      <div className="relative min-h-screen">
        <Starfield />
        <div className="relative flex min-h-screen items-center justify-center px-6 text-center">
          <div>
            <p className="font-display text-3xl text-cream-50">{error}</p>
            <p className="mt-4 font-serif italic text-gold-300/70">Please check your connection and try again.</p>
          </div>
        </div>
      </div>
    );
  }

  const signReading = selectedSign ? (data.signReadings[selectedSign] ?? null) : null;

  const sections: { theme: string; Component: React.ComponentType<any>; props: Record<string, any> }[] = [
    { theme: 'section-navy', Component: CelestialMap, props: {} },
    { theme: 'section-navy' as const, Component: EclipseSection, props: { selectedSign, theme: 'section-navy' } },
    { theme: 'section-parchment' as const, Component: TransitTracker, props: { transits: data.transits } },
    { theme: 'section-navy' as const, Component: LunarBlueprint, props: { phase: data.lunarPhase, isBlurred: !isSubscribed } },
    { theme: 'section-parchment' as const, Component: TarotSpread, props: { cards: data.tarotCards, isBlurred: !isSubscribed } },
    { theme: 'section-navy' as const, Component: ElementalBreakdown, props: { elements: data.elementalEnergy, isBlurred: !isSubscribed } },
    { theme: 'section-parchment' as const, Component: ShadowWork, props: { prompts: data.shadowPrompts, isBlurred: !isSubscribed } },
    { theme: 'section-navy' as const, Component: CrystalBotanicalPairings, props: { items: data.crystalBotanical, isBlurred: !isSubscribed } },
    { theme: 'section-parchment' as const, Component: VoidMoonTimers, props: { windows: data.voidMoonWindows, isBlurred: !isSubscribed } },
    { theme: 'section-navy' as const, Component: MantraCodes, props: { mantras: data.mantras, isBlurred: !isSubscribed } },
    { theme: 'section-parchment' as const, Component: BirthChartCalculator, props: { isBlurred: !isSubscribed } },
    { theme: 'section-navy' as const, Component: CompatibilityMatrix, props: { isBlurred: !isSubscribed } },
    { theme: 'section-parchment' as const, Component: FixedStarLibrary, props: { isBlurred: !isSubscribed } },
    { theme: 'section-navy' as const, Component: SabianSymbolsOracle, props: { isBlurred: !isSubscribed } },
    { theme: 'section-parchment' as const, Component: PlanetaryHourCalculator, props: { isBlurred: !isSubscribed } },
    { theme: 'section-navy' as const, Component: ElementalModalityBreakdown, props: { isBlurred: !isSubscribed } },
    { theme: 'section-parchment' as const, Component: MythologicalArchives, props: { isBlurred: !isSubscribed } },
    { theme: 'section-navy' as const, Component: CosmicEvents, props: { events: data.cosmicEvents, isBlurred: !isSubscribed } },
    { theme: 'section-parchment' as const, Component: ReportDownload, props: { data, selectedSign, isBlurred: !isSubscribed } },
  ];

  return (
    <div className="relative min-h-screen">
      <Starfield />
      <div className="relative">
        <Header />
        <main>
          <div className="section-navy">
            <Hero />
            <ZodiacSelector selected={selectedSign} onSelect={setSelectedSign} />
          </div>

          {selectedSign && signReading && (
            <Suspense fallback={<SectionFallback />}>
              <SignReadingSection sign={selectedSign} reading={signReading} />
            </Suspense>
          )}

          {sections.map(({ theme, Component, props }, index) => {
            return (
              <LazySection key={index} className={theme}>
                <Suspense fallback={<SectionFallback />}>
                  <Component {...props} />
                </Suspense>
              </LazySection>
            );
          })}
        </main>
        <Suspense fallback={<SectionFallback />}><Footer /></Suspense>
      </div>

      {authOpen && (
        <AuthModal onClose={() => setAuthOpen(false)} />
      )}
      {membershipOpen && (
        <MembershipModal onClose={() => setMembershipOpen(false)} />
      )}
      {accountOpen && (
        <AccountModal onClose={() => setAccountOpen(false)} />
      )}
    </div>
  );
}