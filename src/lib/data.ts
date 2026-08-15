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

  // Phase 1: Critical core data (loads instantly so the page appears right away)
  const [transitsRes, lunarRes, signReadingsRes] = await Promise.all([
    supabase.from('planetary_transits').select('*').order('date', { ascending: true }),
    supabase.from('lunar_phases').select('*').order('created_at', { ascending: false }).limit(1).maybeSingle(),
    supabase.from('sign_readings').select('*'),
  ]);

  data.transits = transitsRes.data ?? [];
  data.lunarPhase = lunarRes.data ?? null;
  
  const signReadings: Record<string, SignReading> = {};
  for (const r of signReadingsRes.data ?? []) {
    signReadings[r.sign] = r as SignReading;
  }
  data.signReadings = signReadings;

  // Push immediate update so UI renders right away
  onProgress?.({ ...data });

  // Phase 2: Secondary data loads in the background without blocking the UI
  Promise.all([
    supabase.from('tarot_cards').select('*').order('created_at', { ascending: true }),
    supabase.from('elemental_energy').select('*').order('created_at', { ascending: true }),
    supabase.from('shadow_prompts').select('*').order('created_at', { ascending: true }),
    supabase.from('crystal_botanical').select('*').order('created_at', { ascending: true }),
    supabase.from('void_moon_windows').select('*').order('start_time', { ascending: true }),
    supabase.from('mantra_affirmations').select('*').order('created_at', { ascending: true }),
    supabase.from('cosmic_events').select('*').order('event_date', { ascending: true }),
  ]).then(([tarotRes, elementalRes, shadowRes, crystalRes, voidMoonRes, mantrasRes, cosmicEventsRes]) => {
    data.tarotCards = tarotRes.data ?? [];
    data.elementalEnergy = elementalRes.data ?? [];
    data.shadowPrompts = shadowRes.data ?? [];
    data.crystalBotanical = crystalRes.data ?? [];
    data.voidMoonWindows = voidMoonRes.data ?? [];
    data.mantras = mantrasRes.data ?? [];
    data.cosmicEvents = cosmicEventsRes.data ?? [];

    // Push final update with all secondary data filled in
    onProgress?.({ ...data });
  });

  return data;
}