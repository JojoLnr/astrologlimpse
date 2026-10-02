import type { ZodiacSign } from './zodiac';

export interface ReadingPoint {
  title: string;
  description: string;
}

export function generateReading(sign: ZodiacSign): ReadingPoint[] {
  const elementThemes: Record<string, string[]> = {
    Fire: ['passion ignites new ventures', 'creative energy surges through your veins', 'a bold initiative calls your name'],
    Earth: ['foundations solidify beneath your feet', 'patience yields tangible rewards', 'your practical wisdom guides others'],
    Air: ['ideas flow like a rushing wind', 'conversations open unexpected doors', 'your mind connects dots others cannot see'],
    Water: ['emotional depths reveal hidden truths', 'intuition becomes your most trusted compass', 'old feelings surface to be healed'],
  };

  const planetThemes: Record<string, string[]> = {
    Mars: ['assertive energy propels you toward victory', 'your drive becomes unstoppable', 'channel your warrior spirit wisely'],
    Venus: ['love and beauty surround your path', 'relationships deepen in unexpected ways', 'your magnetism draws abundance near'],
    Mercury: ['communication becomes your superpower', 'messages from the universe arrive clearly', 'your words carry healing power'],
    Moon: ['your emotional intelligence peaks', 'lunar cycles amplify your intuition', 'nurturing energy flows through you'],
    Sun: ['your inner light radiates outward', 'recognition finds you where you stand', 'vitality and confidence are your allies'],
    Pluto: ['transformation awaits in the shadows', 'what dies makes way for what is reborn', 'your power lies in surrender and renewal'],
    Jupiter: ['expansion and fortune smile upon you', 'wisdom arrives through bold exploration', 'abundance flows where you dare to grow'],
    Saturn: ['discipline becomes your ladder to the stars', 'structure unlocks your greatest freedom', 'time rewards your steadfast devotion'],
    Uranus: ['innovation strikes like lightning', 'the unexpected becomes your greatest gift', 'your uniqueness is your revolution'],
    Neptune: ['dreams blur into waking reality', 'mystic visions guide your next chapter', 'imagination opens portals to the divine'],
  };

  const elementTheme = elementThemes[sign.element] || ['the cosmos aligns in your favor'];
  const planetTheme = planetThemes[sign.planet] || ['the universe whispers your name'];

  return [
    {
      title: 'Core Essence',
      description: `${sign.significance}`,
    },
    {
      title: 'Current Energy',
      description: `As a ${sign.name}, ${elementTheme[0]}. The cosmic currents of this period amplify your natural ${sign.strengths[0].toLowerCase()} nature, inviting you to lean fully into who you are.`,
    },
    {
      title: 'Planetary Influence',
      description: `With ${sign.planet} as your ruling planet, ${planetTheme[0]}. This celestial body casts its unique signature over your path, coloring your decisions and relationships.`,
    },
    {
      title: 'Love & Relationships',
      description: `Your ${sign.strengths[1].toLowerCase()} spirit draws kindred souls. In matters of the heart, ${elementTheme[1]}. Open yourself to the connections that resonate at your frequency.`,
    },
    {
      title: 'Career & Purpose',
      description: `Your ${sign.strengths[2].toLowerCase()} nature positions you for meaningful work. ${planetTheme[1]}. The universe supports your ambitions when they align with your authentic self.`,
    },
    {
      title: 'Emotional Landscape',
      description: `The waters within you run deep. ${elementTheme[2]}. Honor your feelings as messengers — they carry wisdom that logic alone cannot reach.`,
    },
    {
      title: 'Spiritual Growth',
      description: `Your spiritual journey is colored by the ${sign.element} element. ${planetTheme[2]}. Trust the path that unfolds before you, even when its destination is unseen.`,
    },
    {
      title: 'Challenges & Lessons',
      description: `The cosmos asks you to balance your ${sign.strengths[0].toLowerCase()} power with patience. Growth comes from embracing discomfort, not avoiding it. Your greatest lesson is hidden in what you resist.`,
    },
    {
      title: 'Manifestation Power',
      description: `Your ${sign.strengths[3].toLowerCase()} energy is a magnet for abundance. Focus your intention like a laser — what you envision with clarity and conviction, the universe conspires to deliver.`,
    },
    {
      title: 'Cosmic Blessing',
      description: `The stars bestow upon you the gift of ${sign.strengths[4].toLowerCase()}. Carry it as your torch through the coming cycle. You are a child of the cosmos, ${sign.name} — never forget that the universe dreamed you into being on purpose.`,
    },
  ];
}
