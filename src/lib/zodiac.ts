export interface ZodiacSign {
  name: string;
  symbol: string;
  dates: string;
  element: string;
  planet: string;
  strengths: string[];
  significance: string;
  color: string;
  glyph: string;
}

export const zodiacSigns: ZodiacSign[] = [
  {
    name: 'Aries',
    symbol: '♈',
    dates: 'Mar 21 – Apr 19',
    element: 'Fire',
    planet: 'Mars',
    strengths: ['Courageous', 'Determined', 'Confident', 'Enthusiastic', 'Bold'],
    significance:
      'Aries is the spark of the zodiac — the first sign, the initiator, the warrior who charges forward without hesitation. Ruled by Mars, Aries embodies raw life force, the primal urge to exist and to act. It teaches us that beginnings matter, that the first step is sacred, and that courage is not the absence of fear but the decision to move forward in spite of it.',
    color: '#e94560',
    glyph: '♈',
  },
  {
    name: 'Taurus',
    symbol: '♉',
    dates: 'Apr 20 – May 20',
    element: 'Earth',
    planet: 'Venus',
    strengths: ['Reliable', 'Patient', 'Devoted', 'Responsible', 'Steadfast'],
    significance:
      'Taurus is the anchor — rooted, sensual, and unshakable. Ruled by Venus, Taurus finds the divine in the tangible: the warmth of sun on skin, the taste of ripe fruit, the weight of gold. It teaches us that beauty is not fleeting but cultivated, that patience is a form of love, and that true security comes from knowing your own worth.',
    color: '#43aa8b',
    glyph: '♉',
  },
  {
    name: 'Gemini',
    symbol: '♊',
    dates: 'May 21 – Jun 20',
    element: 'Air',
    planet: 'Mercury',
    strengths: ['Curious', 'Adaptable', 'Witty', 'Communicative', 'Versatile'],
    significance:
      'Gemini is the messenger — the bridge between worlds, the mind that holds contradictions without breaking. Ruled by Mercury, Gemini dances between ideas, collecting perspectives like a magpie collects shine. It teaches us that curiosity is a spiritual practice, that words shape reality, and that the self is not singular but a constellation of many voices.',
    color: '#f4a261',
    glyph: '♊',
  },
  {
    name: 'Cancer',
    symbol: '♋',
    dates: 'Jun 21 – Jul 22',
    element: 'Water',
    planet: 'Moon',
    strengths: ['Loyal', 'Intuitive', 'Nurturing', 'Protective', 'Empathic'],
    significance:
      'Cancer is the womb of the zodiac — the keeper of memory, the guardian of the hearth. Ruled by the Moon, Cancer moves in tides of emotion, carrying the weight of lineage and belonging. It teaches us that vulnerability is strength, that home is not a place but a feeling, and that the deepest courage is found in caring for others.',
    color: '#778da9',
    glyph: '♋',
  },
  {
    name: 'Leo',
    symbol: '♌',
    dates: 'Jul 23 – Aug 22',
    element: 'Fire',
    planet: 'Sun',
    strengths: ['Charismatic', 'Generous', 'Creative', 'Passionate', 'Magnetic'],
    significance:
      'Leo is the sovereign — the radiant heart that gives warmth without condition. Ruled by the Sun, Leo does not seek the spotlight; Leo IS the spotlight. It teaches us that true leadership is an act of love, that creativity is our birthright, and that shining brightly is not arrogance but an offering to the world.',
    color: '#e9c46a',
    glyph: '♌',
  },
  {
    name: 'Virgo',
    symbol: '♍',
    dates: 'Aug 23 – Sep 22',
    element: 'Earth',
    planet: 'Mercury',
    strengths: ['Analytical', 'Diligent', 'Practical', 'Healing', 'Precise'],
    significance:
      'Virgo is the healer-priest — the one who brings order to chaos, who tends the garden of the soul. Ruled by Mercury, Virgo discerns what serves and what must be pruned. It teaches us that devotion lives in the details, that service is sacred, and that wholeness is found not in perfection but in the humble act of making things better, one small gesture at a time.',
    color: '#8ab17d',
    glyph: '♍',
  },
  {
    name: 'Libra',
    symbol: '♎',
    dates: 'Sep 23 – Oct 22',
    element: 'Air',
    planet: 'Venus',
    strengths: ['Diplomatic', 'Fair-minded', 'Charming', 'Harmonious', 'Aesthetic'],
    significance:
      'Libra is the scales — the eternal seeker of balance, the weaver of harmony. Ruled by Venus, Libra finds beauty in symmetry and justice in relationship. It teaches us that true fairness requires seeing all sides, that partnership is an art, and that peace is not the absence of conflict but the graceful resolution of it.',
    color: '#bc6c8b',
    glyph: '♎',
  },
  {
    name: 'Scorpio',
    symbol: '♏',
    dates: 'Oct 23 – Nov 21',
    element: 'Water',
    planet: 'Pluto',
    strengths: ['Transformative', 'Intense', 'Loyal', 'Perceptive', 'Resilient'],
    significance:
      'Scorpio is the alchemist — the one who descends into darkness and returns with gold. Ruled by Pluto, Scorpio does not fear the depths; it knows that transformation requires death and rebirth. It teaches us that our shadows are not enemies but teachers, that intimacy demands surrender, and that true power is the willingness to be reborn.',
    color: '#9d4edd',
    glyph: '♏',
  },
  {
    name: 'Sagittarius',
    symbol: '♐',
    dates: 'Nov 22 – Dec 21',
    element: 'Fire',
    planet: 'Jupiter',
    strengths: ['Adventurous', 'Philosophical', 'Optimistic', 'Free-spirited', 'Visionary'],
    significance:
      'Sagittarius is the explorer — the archer whose arrow flies toward the horizon, toward meaning itself. Ruled by Jupiter, Sagittarius expands everything it touches, seeking truth across continents and philosophies. It teaches us that freedom is a state of mind, that wisdom comes from experience, and that the journey is the destination.',
    color: '#e76f51',
    glyph: '♐',
  },
  {
    name: 'Capricorn',
    symbol: '♑',
    dates: 'Dec 22 – Jan 19',
    element: 'Earth',
    planet: 'Saturn',
    strengths: ['Disciplined', 'Ambitious', 'Responsible', 'Patient', 'Strategic'],
    significance:
      'Capricorn is the mountain goat — the one who climbs steadily, patiently, toward the summit. Ruled by Saturn, Capricorn understands that mastery takes time and that structure is the skeleton of dreams. It teaches us that integrity is built one choice at a time, that authority is earned, and that the highest peaks are reached through persistence, not shortcuts.',
    color: '#6c757d',
    glyph: '♑',
  },
  {
    name: 'Aquarius',
    symbol: '♒',
    dates: 'Jan 20 – Feb 18',
    element: 'Air',
    planet: 'Uranus',
    strengths: ['Innovative', 'Humanitarian', 'Independent', 'Visionary', 'Eccentric'],
    significance:
      'Aquarius is the visionary — the water-bearer who pours new consciousness onto a thirsty world. Ruled by Uranus, Aquarius sees the future before others know the present has ended. It teaches us that progress requires rebellion, that community is built on individuality, and that the most radical act is to imagine a world that has never existed.',
    color: '#48cae4',
    glyph: '♒',
  },
  {
    name: 'Pisces',
    symbol: '♓',
    dates: 'Feb 19 – Mar 20',
    element: 'Water',
    planet: 'Neptune',
    strengths: ['Compassionate', 'Intuitive', 'Artistic', 'Mystical', 'Gentle'],
    significance:
      'Pisces is the ocean of the zodiac — boundless, permeable, and infinitely deep. Ruled by Neptune, Pisces dissolves the boundaries between self and other, between dream and reality. It teaches us that imagination is a gateway to the divine, that empathy is a superpower, and that surrender is not defeat but the highest form of trust.',
    color: '#90b4ce',
    glyph: '♓',
  },
];
