import { lazy, Suspense, useEffect, useState, useCallback } from 'react';
import type { CosmicData } from '@/lib/types';
import { fetchCosmicData } from '@/lib/data';
import Starfield from '@/components/Starfield';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ZodiacSelector, { type ZodiacSign } from '@/components/ZodiacSelector';
import LazySection from '@/components/LazySection';

const SignReadingSection = lazy(() => import('@/components/SignReadingSection'));
const CelestialMap = lazy(() => import('@/components/CelestialMap'));
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
  const [data, setData] = useState<CosmicData>(emptyData);
  const [error, setError] = useState<string | null>(null);
  const [selectedSign, setSelectedSign] = useState<ZodiacSign | null>(null);

  // Toggle this or hook it up to your subscription state logic later
  const [isSubscribed] = useState(false);

  const handleProgress = useCallback((partial: CosmicData) => {
    setData({ ...partial });
  }, []);

  useEffect(() => {
    fetchCosmicData(handleProgress)
      .catch(() => setError('Unable to load the cosmic forecast right now.'));
  }, [handleProgress]);

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

  return (
    <div className="relative min-h-screen">
      <Starfield />
      <div className="relative">
        <Header />
        <main>
          {/* Above the fold: hero + zodiac selector */}
          <div className="section-navy">
            <Hero />
            <ZodiacSelector selected={selectedSign} onSelect={setSelectedSign} />
          </div>

          {/* Section 1: Zodiac guide (Free preview) */}
          {selectedSign && signReading && (
            <Suspense fallback={<SectionFallback />}>
              <SignReadingSection sign={selectedSign} reading={signReading} />
            </Suspense>
          )}

          {/* Section 2: Celestial Positions (Free preview) */}
          <LazySection className="section-navy">
            <Suspense fallback={<SectionFallback />}><CelestialMap /></Suspense>
          </LazySection>

          {/* Section 3: Transit Tracker (Free preview) */}
          <LazySection className="section-parchment">
            <Suspense fallback={<SectionFallback />}><TransitTracker transits={data.transits} /></Suspense>
          </LazySection>

          {/* Sections 4+: Gated / Blurred content for non-subscribers */}
          <LazySection className="section-navy">
            <Suspense fallback={<SectionFallback />}>
              <LunarBlueprint phase={data.lunarPhase} isBlurred={!isSubscribed} />
            </Suspense>
          </LazySection>

          <LazySection className="section-parchment">
            <Suspense fallback={<SectionFallback />}>
              <TarotSpread cards={data.tarotCards} isBlurred={!isSubscribed} />
            </Suspense>
          </LazySection>

          <LazySection className="section-navy">
            <Suspense fallback={<SectionFallback />}>
              <ElementalBreakdown elements={data.elementalEnergy} isBlurred={!isSubscribed} />
            </Suspense>
          </LazySection>

          <LazySection className="section-parchment">
            <Suspense fallback={<SectionFallback />}>
              <ShadowWork prompts={data.shadowPrompts} isBlurred={!isSubscribed} />
            </Suspense>
          </LazySection>

          <LazySection className="section-navy">
            <Suspense fallback={<SectionFallback />}>
              <CrystalBotanicalPairings items={data.crystalBotanical} isBlurred={!isSubscribed} />
            </Suspense>
          </LazySection>

          <LazySection className="section-parchment">
            <Suspense fallback={<SectionFallback />}>
              <VoidMoonTimers windows={data.voidMoonWindows} isBlurred={!isSubscribed} />
            </Suspense>
          </LazySection>

          <LazySection className="section-navy">
            <Suspense fallback={<SectionFallback />}>
              <MantraCodes mantras={data.mantras} isBlurred={!isSubscribed} />
            </Suspense>
          </LazySection>

          <LazySection className="section-parchment">
            <Suspense fallback={<SectionFallback />}>
              <BirthChartCalculator isBlurred={!isSubscribed} />
            </Suspense>
          </LazySection>

          <LazySection className="section-navy">
            <Suspense fallback={<SectionFallback />}>
              <CompatibilityMatrix isBlurred={!isSubscribed} />
            </Suspense>
          </LazySection>

          <LazySection className="section-parchment">
            <Suspense fallback={<SectionFallback />}>
              <FixedStarLibrary isBlurred={!isSubscribed} />
            </Suspense>
          </LazySection>

          <LazySection className="section-navy">
            <Suspense fallback={<SectionFallback />}>
              <SabianSymbolsOracle isBlurred={!isSubscribed} />
            </Suspense>
          </LazySection>

          <LazySection className="section-parchment">
            <Suspense fallback={<SectionFallback />}>
              <PlanetaryHourCalculator isBlurred={!isSubscribed} />
            </Suspense>
          </LazySection>

          <LazySection className="section-navy">
            <Suspense fallback={<SectionFallback />}>
              <ElementalModalityBreakdown isBlurred={!isSubscribed} />
            </Suspense>
          </LazySection>

          <LazySection className="section-parchment">
            <Suspense fallback={<SectionFallback />}>
              <MythologicalArchives isBlurred={!isSubscribed} />
            </Suspense>
          </LazySection>

          <LazySection className="section-navy">
            <Suspense fallback={<SectionFallback />}>
              <CosmicEvents events={data.cosmicEvents} isBlurred={!isSubscribed} />
            </Suspense>
          </LazySection>

          <LazySection className="section-parchment">
            <Suspense fallback={<SectionFallback />}>
              <ReportDownload data={data} selectedSign={selectedSign} isBlurred={!isSubscribed} />
            </Suspense>
          </LazySection>
        </main>
        <Suspense fallback={<SectionFallback />}><Footer /></Suspense>
      </div>
    </div>
  );
}