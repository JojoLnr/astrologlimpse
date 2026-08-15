export interface PlanetaryTransit {
  id: string;
  planet: string;
  event_type: string;
  aspect_type: string | null;
  sign: string | null;
  date: string;
  description: string;
  advice: string;
  intensity: number;
}

export interface LunarPhase {
  id: string;
  phase_type: string;
  zodiac_sign: string;
  peak_time: string;
  theme: string;
  overview: string;
  ritual_steps: string[];
}

export interface TarotCard {
  id: string;
  position_label: string;
  card_name: string;
  card_meaning: string;
  interpretation: string;
  upright: boolean;
}

export interface ElementalEnergy {
  id: string;
  element: string;
  focus: string;
  advice: string;
  balance_tip: string;
}

export interface ShadowPrompt {
  id: string;
  prompt: string;
  context: string;
}

export interface CrystalBotanical {
  id: string;
  category: string;
  name: string;
  purpose: string;
  usage: string;
  zodiac_sign: string | null;
}

export interface VoidMoonWindow {
  id: string;
  start_time: string;
  end_time: string;
  warning: string;
}

export interface MantraAffirmation {
  id: string;
  mantra: string;
  targets_transit: string;
}

export interface SignReading {
  id: string;
  sign: string;
  mental_sparks: string;
  social_balance: string;
  career_focus: string;
  love_focus: string;
  wellness_focus: string;
  mantra: string;
  crystal: string;
  key_dates: string;
  daily_horoscope: string | null;
}

export interface CosmicEvent {
  id: string;
  title: string;
  event_type: string;
  event_date: string;
  sign: string | null;
  visibility: string | null;
  description: string;
  guidance: string;
  intensity: number;
}

export interface CosmicData {
  transits: PlanetaryTransit[];
  lunarPhase: LunarPhase | null;
  tarotCards: TarotCard[];
  elementalEnergy: ElementalEnergy[];
  shadowPrompts: ShadowPrompt[];
  crystalBotanical: CrystalBotanical[];
  voidMoonWindows: VoidMoonWindow[];
  mantras: MantraAffirmation[];
  signReadings: Record<string, SignReading>;
  cosmicEvents: CosmicEvent[];
}
