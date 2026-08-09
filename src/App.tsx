import { lazy, Suspense, useEffect, useState, useCallback } from 'react';
import type { CosmicData } from '@/lib/types';
import { fetchCosmicData } from '@/lib/data';
import Starfield from '@/components/Starfield';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ZodiacSelector, { type ZodiacSign } from '@/components/ZodiacSelector';
import LazySection from '@/components/LazySection';
import ContentBlurGate from '@/components/ContentBlurGate';

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
  
  // Subscription state (defaults to false to test blurring)
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

          {/* Section 1: Zodiac guide (Free) */}
          {selectedSign && signReading && (
            <Suspense fallback={<SectionFallback />}>
              <SignReadingSection sign={selectedSign} reading={signReading} />
            </Suspense>
          )}

          {/* Section 2: Celestial Positions (Free) */}
          <LazySection className="section-navy">
            <Suspense fallback={<SectionFallback />}><CelestialMap /></Suspense>
          </LazySection>

          {/* Section 3: Transit Tracker (Free) */}
          <LazySection className="section-parchment">
            <Suspense fallback={<SectionFallback />}><TransitTracker transits={data.transits} isBlurred={false} /></Suspense>
          </LazySection>

          {/* Sections 4+: Gated / Blurred for non-subscribers */}
          <LazySection className="section-navy">
            <Suspense fallback={<SectionFallback />}>
              <ContentBlurGate isBlurred={!isSubscribed}>
                <LunarBlueprint phase={data.lunarPhase} />
              </ContentBlurGate>
            </Suspense>
          </LazySection>

          <LazySection className="section-parchment">
            <Suspense fallback={<SectionFallback />}>
              <ContentBlurGate isBlurred={!isSubscribed}>
                <TarotSpread cards={data.tarotCards} />
              </ContentBlurGate>
            </Suspense>
          </LazySection>

          <LazySection className="section-navy">
            <Suspense fallback={<SectionFallback />}>
              <ContentBlurGate isBlurred={!isSubscribed}>
                <ElementalBreakdown elements={data.elementalEnergy} />
              </ContentBlurGate>
            </Suspense>
          </LazySection>

          <LazySection className="section-parchment">
            <Suspense fallback={<SectionFallback />}>
              <ContentBlurGate isBlurred={!isSubscribed}>
                <ShadowWork prompts={data.shadowPrompts} />
              </ContentBlurGate>
            </Suspense>
          </LazySection>

          <LazySection className="section-navy">
            <Suspense fallback={<SectionFallback />}>
              <ContentBlurGate isBlurred={!isSubscribed}>
                <CrystalBotanicalPairings items={data.crystalBotanical} />
              </ContentBlurGate>
            </Suspense>
          </LazySection>

          <LazySection className="section-parchment">
            <Suspense fallback={<SectionFallback />}>
              <ContentBlurGate isBlurred={!isSubscribed}>
                <VoidMoonTimers windows={data.voidMoonWindows} />
              </ContentBlurGate>
            </Suspense>
          </LazySection>

          <LazySection className="section-navy">
            <Suspense fallback={<SectionFallback />}>
              <ContentBlurGate isBlurred={!isSubscribed}>
                <MantraCodes mantras={data.mantras} />
              </ContentBlurGate>
            </Suspense>
          </LazySection>

          <LazySection className="section-parchment">
            <Suspense fallback={<SectionFallback />}>
              <ContentBlurGate isBlurred={!isSubscribed}>
                <BirthChartCalculator />
              </ContentBlurGate>
            </Suspense>
          </LazySection>

          <LazySection className="section-navy">
            <Suspense fallback={<SectionFallback />}>
              <ContentBlurGate isBlurred={!isSubscribed}>
                <CompatibilityMatrix />
              </ContentBlurGate>
            </Suspense>
          </LazySection>

          <LazySection className="section-parchment">
            <Suspense fallback={<SectionFallback />}>
              <ContentBlurGate isBlurred={!isSubscribed}>
                <FixedStarLibrary />
              </ContentBlurGate>
            </Suspense>
          </LazySection>

          <LazySection className="section-navy">
            <Suspense fallback={<SectionFallback />}>
              <ContentBlurGate isBlurred={!isSubscribed}>
                <SabianSymbolsOracle />
              </ContentBlurGate>
            </Suspense>
          </LazySection>

          <LazySection className="section-parchment">
            <Suspense fallback={<SectionFallback />}>
              <ContentBlurGate isBlurred={!isSubscribed}>
                <PlanetaryHourCalculator />
              </ContentBlurGate>
            </Suspense>
          </LazySection>

          <LazySection className="section-navy">
            <Suspense fallback={<SectionFallback />}>
              <ContentBlurGate isBlurred={!isSubscribed}>
                <ElementalModalityBreakdown />
              </ContentBlurGate>
            </Suspense>
          </LazySection>

          <LazySection className="section-parchment">
            <Suspense fallback={<SectionFallback />}>
              <ContentBlurGate isBlurred={!isSubscribed}>
                <MythologicalArchives />
              </ContentBlurGate>
            </Suspense>
          </LazySection>

          <LazySection className="section-navy">
            <Suspense fallback={<SectionFallback />}>
              <ContentBlurGate isBlurred={!isSubscribed}>
                <CosmicEvents events={data.cosmicEvents} />
              </ContentBlurGate>
            </Suspense>
          </LazySection>

          <LazySection className="section-parchment">
            <Suspense fallback={<SectionFallback />}>
              <ContentBlurGate isBlurred={!isSubscribed}>
                <ReportDownload data={data} selectedSign={selectedSign} />
              </ContentBlurGate>
            </Suspense>
          </LazySection>
        </main>
        <Suspense fallback={<SectionFallback />}><Footer /></Suspense>
      </div>
    </div>
  );
}