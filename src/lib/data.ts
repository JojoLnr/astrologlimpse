import { supabase } from './supabase';
import type { CosmicData, SignReading } from './types';

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

export async function fetchCosmicData(
  onProgress?: (partial: CosmicData) => void
): Promise<CosmicData> {
  const data: CosmicData = { ...emptyData };

  // Batch 1: core forecast (transits + lunar phase)
  const [transitsRes, lunarRes] = await Promise.all([
    supabase.from('planetary_transits').select('*').order('date', { ascending: true }),
    supabase.from('lunar_phases').select('*').order('created_at', { ascending: false }).limit(1).maybeSingle(),
  ]);
  data.transits = transitsRes.data ?? [];
  data.lunarPhase = lunarRes.data ?? null;
  onProgress?.({ ...data });

  // Batch 2: divination (tarot + elemental)
  const [tarotRes, elementalRes] = await Promise.all([
    supabase.from('tarot_cards').select('*').order('created_at', { ascending: true }),
    supabase.from('elemental_energy').select('*').order('created_at', { ascending: true }),
  ]);
  data.tarotCards = tarotRes.data ?? [];
  data.elementalEnergy = elementalRes.data ?? [];
  onProgress?.({ ...data });

  // Batch 3: inner work (shadow prompts + crystals)
  const [shadowRes, crystalRes] = await Promise.all([
    supabase.from('shadow_prompts').select('*').order('created_at', { ascending: true }),
    supabase.from('crystal_botanical').select('*').order('created_at', { ascending: true }),
  ]);
  data.shadowPrompts = shadowRes.data ?? [];
  data.crystalBotanical = crystalRes.data ?? [];
  onProgress?.({ ...data });

  // Batch 4: timing (void moon + mantras)
  const [voidMoonRes, mantrasRes] = await Promise.all([
    supabase.from('void_moon_windows').select('*').order('start_time', { ascending: true }),
    supabase.from('mantra_affirmations').select('*').order('created_at', { ascending: true }),
  ]);
  data.voidMoonWindows = voidMoonRes.data ?? [];
  data.mantras = mantrasRes.data ?? [];
  onProgress?.({ ...data });

  // Batch 5: personal (sign readings + cosmic events)
  const [signReadingsRes, cosmicEventsRes] = await Promise.all([
    supabase.from('sign_readings').select('*'),
    supabase.from('cosmic_events').select('*').order('event_date', { ascending: true }),
  ]);
  const signReadings: Record<string, SignReading> = {};
  for (const r of signReadingsRes.data ?? []) {
    signReadings[r.sign] = r as SignReading;
  }
  data.signReadings = signReadings;
  data.cosmicEvents = cosmicEventsRes.data ?? [];
  onProgress?.({ ...data });

  return data;
}
