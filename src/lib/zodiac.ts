export interface ConstellationStar {
  x: number;
  y: number;
  size: number;
}

export interface ConstellationLine {
  from: number;
  to: number;
}

export interface ConstellationData {
  stars: ConstellationStar[];
  lines: ConstellationLine[];
}

export interface ZodiacSign {
  name: string;
  symbol: string;
  dates: string;
  element: string;
  planet: string;
  strengths: string[];
  significance: string;
  color: string;
  svgPath: string;
  constellation: ConstellationData;
}

export const zodiacSigns: ZodiacSign[] = [
  {
    name: 'Aries',
    symbol: '♈',
    dates: 'Mar 21 - Apr 19',
    element: 'Fire',
    planet: 'Mars',
    strengths: ['Courageous', 'Determined', 'Confident', 'Enthusiastic', 'Bold'],
    significance:
      'Aries is the spark of the zodiac, the first sign, the initiator, the warrior who charges forward without hesitation. Ruled by Mars, Aries embodies raw life force, the primal urge to exist and to act. It teaches us that beginnings matter, that the first step is sacred, and that courage is not the absence of fear but the decision to move forward in spite of it.',
    color: '#e94560',
    svgPath: 'M 30 60 Q 30 30 50 30 Q 70 30 70 55 L 70 70 M 50 30 L 50 75',
    constellation: {
      stars: [
        { x: 45, y: 25, size: 4 },
        { x: 62, y: 42, size: 3 },
        { x: 68, y: 48, size: 2.5 },
        { x: 95, y: 30, size: 2.5 },
      ],
      lines: [
        { from: 0, to: 1 },
        { from: 1, to: 2 },
        { from: 0, to: 3 },
      ],
    },
  },
  {
    name: 'Taurus',
    symbol: '♉',
    dates: 'Apr 20 - May 20',
    element: 'Earth',
    planet: 'Venus',
    strengths: ['Reliable', 'Patient', 'Devoted', 'Responsible', 'Steadfast'],
    significance:
      'Taurus is the anchor, rooted, sensual, and unshakable. Ruled by Venus, Taurus finds the divine in the tangible: the warmth of sun on skin, the taste of ripe fruit, the weight of gold. It teaches us that beauty is not fleeting but cultivated, that patience is a form of love, and that true security comes from knowing your own worth.',
    color: '#43aa8b',
    svgPath: 'M 50 50 C 50 35 65 35 65 50 C 65 65 50 65 50 50 M 30 25 Q 50 15 50 50 Q 50 85 30 75 M 80 25 Q 65 15 65 50 Q 65 85 80 75',
    constellation: {
      stars: [
        { x: 80, y: 62, size: 4.5 },
        { x: 68, y: 52, size: 2.5 },
        { x: 60, y: 45, size: 2.5 },
        { x: 55, y: 52, size: 2 },
        { x: 72, y: 50, size: 2 },
        { x: 100, y: 25, size: 3 },
        { x: 115, y: 58, size: 2.5 },
        { x: 30, y: 30, size: 2 },
        { x: 25, y: 35, size: 1.5 },
        { x: 35, y: 25, size: 1.5 },
      ],
      lines: [
        { from: 0, to: 1 },
        { from: 1, to: 2 },
        { from: 2, to: 3 },
        { from: 3, to: 4 },
        { from: 4, to: 0 },
        { from: 0, to: 5 },
        { from: 0, to: 6 },
      ],
    },
  },
  {
    name: 'Gemini',
    symbol: '♊',
    dates: 'May 21 - Jun 20',
    element: 'Air',
    planet: 'Mercury',
    strengths: ['Curious', 'Adaptable', 'Witty', 'Communicative', 'Versatile'],
    significance:
      'Gemini is the messenger, the bridge between worlds, the mind that holds contradictions without breaking. Ruled by Mercury, Gemini dances between ideas, collecting perspectives like a magpie collects shine. It teaches us that curiosity is a spiritual practice, that words shape reality, and that the self is not singular but a constellation of many voices.',
    color: '#f4a261',
    svgPath: 'M 35 25 L 35 75 M 35 25 L 50 25 M 35 75 L 50 75 M 65 25 L 65 75 M 50 25 L 80 25 M 50 75 L 80 75',
    constellation: {
      stars: [
        { x: 55, y: 20, size: 4 },
        { x: 50, y: 38, size: 2.5 },
        { x: 48, y: 55, size: 2.5 },
        { x: 52, y: 72, size: 3 },
        { x: 52, y: 88, size: 2 },
        { x: 100, y: 25, size: 4 },
        { x: 100, y: 42, size: 2.5 },
        { x: 102, y: 58, size: 2.5 },
        { x: 100, y: 75, size: 3 },
        { x: 98, y: 90, size: 2 },
      ],
      lines: [
        { from: 0, to: 1 },
        { from: 1, to: 2 },
        { from: 2, to: 3 },
        { from: 3, to: 4 },
        { from: 5, to: 6 },
        { from: 6, to: 7 },
        { from: 7, to: 8 },
        { from: 8, to: 9 },
      ],
    },
  },
  {
    name: 'Cancer',
    symbol: '♋',
    dates: 'Jun 21 - Jul 22',
    element: 'Water',
    planet: 'Moon',
    strengths: ['Loyal', 'Intuitive', 'Nurturing', 'Protective', 'Empathic'],
    significance:
      'Cancer is the womb of the zodiac, the keeper of memory, the guardian of the hearth. Ruled by the Moon, Cancer moves in tides of emotion, carrying the weight of lineage and belonging. It teaches us that vulnerability is strength, that home is not a place but a feeling, and that the deepest courage is found in caring for others.',
    color: '#778da9',
    svgPath: 'M 35 35 Q 50 25 65 35 Q 80 45 65 55 Q 50 65 65 75 Q 80 85 65 95 L 35 95',
    constellation: {
      stars: [
        { x: 85, y: 48, size: 2.5 },
        { x: 80, y: 55, size: 2.5 },
        { x: 115, y: 28, size: 3.5 },
        { x: 105, y: 72, size: 2.5 },
        { x: 48, y: 30, size: 2 },
        { x: 82, y: 52, size: 1.5 },
        { x: 86, y: 50, size: 1.5 },
        { x: 78, y: 54, size: 1.5 },
      ],
      lines: [
        { from: 0, to: 1 },
        { from: 0, to: 2 },
        { from: 1, to: 3 },
        { from: 0, to: 4 },
        { from: 2, to: 3 },
      ],
    },
  },
  {
    name: 'Leo',
    symbol: '♌',
    dates: 'Jul 23 - Aug 22',
    element: 'Fire',
    planet: 'Sun',
    strengths: ['Charismatic', 'Generous', 'Creative', 'Passionate', 'Magnetic'],
    significance:
      'Leo is the sovereign, the radiant heart that gives warmth without condition. Ruled by the Sun, Leo does not seek the spotlight; Leo IS the spotlight. It teaches us that true leadership is an act of love, that creativity is our birthright, and that shining brightly is not arrogance but an offering to the world.',
    color: '#e9c46a',
    svgPath: 'M 30 70 Q 30 50 45 50 Q 55 50 55 60 Q 55 70 65 70 Q 80 70 80 55 Q 80 35 65 35 Q 50 35 50 50 Q 50 75 70 80 L 70 90',
    constellation: {
      stars: [
        { x: 45, y: 35, size: 2.5 },
        { x: 38, y: 42, size: 2 },
        { x: 35, y: 55, size: 2.5 },
        { x: 42, y: 62, size: 3 },
        { x: 48, y: 80, size: 4 },
        { x: 75, y: 62, size: 2.5 },
        { x: 85, y: 72, size: 2.5 },
        { x: 115, y: 72, size: 3.5 },
        { x: 80, y: 82, size: 2 },
      ],
      lines: [
        { from: 0, to: 1 },
        { from: 1, to: 2 },
        { from: 2, to: 3 },
        { from: 3, to: 4 },
        { from: 3, to: 5 },
        { from: 5, to: 6 },
        { from: 6, to: 7 },
        { from: 6, to: 8 },
      ],
    },
  },
  {
    name: 'Virgo',
    symbol: '♍',
    dates: 'Aug 23 - Sep 22',
    element: 'Earth',
    planet: 'Mercury',
    strengths: ['Analytical', 'Diligent', 'Practical', 'Healing', 'Precise'],
    significance:
      'Virgo is the healer-priest, the one who brings order to chaos, who tends the garden of the soul. Ruled by Mercury, Virgo discerns what serves and what must be pruned. It teaches us that devotion lives in the details, that service is sacred, and that wholeness is found not in perfection but in the humble act of making things better, one small gesture at a time.',
    color: '#8ab17d',
    svgPath: 'M 30 25 L 30 75 M 30 25 Q 50 25 50 50 Q 50 75 30 75 M 50 50 Q 65 50 65 65 Q 65 80 55 80 Q 45 80 50 70',
    constellation: {
      stars: [
        { x: 45, y: 25, size: 2.5 },
        { x: 30, y: 38, size: 2 },
        { x: 55, y: 50, size: 3 },
        { x: 75, y: 45, size: 2.5 },
        { x: 110, y: 30, size: 3 },
        { x: 90, y: 72, size: 4 },
        { x: 80, y: 85, size: 2 },
        { x: 120, y: 80, size: 2 },
      ],
      lines: [
        { from: 0, to: 1 },
        { from: 0, to: 2 },
        { from: 2, to: 3 },
        { from: 3, to: 4 },
        { from: 2, to: 5 },
        { from: 5, to: 6 },
        { from: 5, to: 7 },
      ],
    },
  },
  {
    name: 'Libra',
    symbol: '♎',
    dates: 'Sep 23 - Oct 22',
    element: 'Air',
    planet: 'Venus',
    strengths: ['Diplomatic', 'Fair-minded', 'Charming', 'Harmonious', 'Aesthetic'],
    significance:
      'Libra is the scales, the eternal seeker of balance, the weaver of harmony. Ruled by Venus, Libra finds beauty in symmetry and justice in relationship. It teaches us that true fairness requires seeing all sides, that partnership is an art, and that peace is not the absence of conflict but the graceful resolution of it.',
    color: '#bc6c8b',
    svgPath: 'M 25 70 L 75 70 M 50 70 L 50 30 M 30 30 Q 50 20 70 30 M 35 70 Q 35 85 50 85 Q 65 85 65 70',
    constellation: {
      stars: [
        { x: 80, y: 28, size: 4 },
        { x: 45, y: 62, size: 3.5 },
        { x: 110, y: 58, size: 2.5 },
        { x: 88, y: 82, size: 2.5 },
        { x: 55, y: 50, size: 2 },
        { x: 105, y: 75, size: 2 },
      ],
      lines: [
        { from: 0, to: 1 },
        { from: 0, to: 2 },
        { from: 1, to: 3 },
        { from: 2, to: 3 },
        { from: 1, to: 4 },
        { from: 2, to: 5 },
      ],
    },
  },
  {
    name: 'Scorpio',
    symbol: '♏',
    dates: 'Oct 23 - Nov 21',
    element: 'Water',
    planet: 'Pluto',
    strengths: ['Transformative', 'Intense', 'Loyal', 'Perceptive', 'Resilient'],
    significance:
      'Scorpio is the alchemist, the one who descends into darkness and returns with gold. Ruled by Pluto, Scorpio does not fear the depths; it knows that transformation requires death and rebirth. It teaches us that our shadows are not enemies but teachers, that intimacy demands surrender, and that true power is the willingness to be reborn.',
    color: '#9d4edd',
    svgPath: 'M 30 30 L 30 60 Q 30 75 45 75 Q 60 75 60 60 Q 60 45 75 45 Q 90 45 90 60 L 85 55 L 90 60 L 95 55',
    constellation: {
      stars: [
        { x: 55, y: 18, size: 2.5 },
        { x: 68, y: 22, size: 2.5 },
        { x: 48, y: 20, size: 2 },
        { x: 72, y: 42, size: 4.5 },
        { x: 78, y: 55, size: 2.5 },
        { x: 82, y: 68, size: 2.5 },
        { x: 88, y: 80, size: 2.5 },
        { x: 105, y: 88, size: 2 },
        { x: 125, y: 82, size: 2.5 },
        { x: 140, y: 70, size: 3.5 },
        { x: 135, y: 55, size: 2.5 },
      ],
      lines: [
        { from: 0, to: 1 },
        { from: 0, to: 2 },
        { from: 1, to: 3 },
        { from: 3, to: 4 },
        { from: 4, to: 5 },
        { from: 5, to: 6 },
        { from: 6, to: 7 },
        { from: 7, to: 8 },
        { from: 8, to: 9 },
        { from: 9, to: 10 },
      ],
    },
  },
  {
    name: 'Sagittarius',
    symbol: '♐',
    dates: 'Nov 22 - Dec 21',
    element: 'Fire',
    planet: 'Jupiter',
    strengths: ['Adventurous', 'Philosophical', 'Optimistic', 'Free-spirited', 'Visionary'],
    significance:
      'Sagittarius is the explorer, the archer whose arrow flies toward the horizon, toward meaning itself. Ruled by Jupiter, Sagittarius expands everything it touches, seeking truth across continents and philosophies. It teaches us that freedom is a state of mind, that wisdom comes from experience, and that the journey is the destination.',
    color: '#e76f51',
    svgPath: 'M 25 75 L 75 25 M 65 25 L 75 25 L 75 35 M 55 35 L 75 25 M 65 45 L 75 35',
    constellation: {
      stars: [
        { x: 30, y: 62, size: 2.5 },
        { x: 48, y: 55, size: 2 },
        { x: 62, y: 48, size: 2.5 },
        { x: 78, y: 40, size: 3 },
        { x: 92, y: 30, size: 3.5 },
        { x: 68, y: 72, size: 3 },
        { x: 88, y: 62, size: 2.5 },
        { x: 105, y: 50, size: 2 },
        { x: 80, y: 55, size: 2 },
        { x: 100, y: 72, size: 2 },
      ],
      lines: [
        { from: 0, to: 1 },
        { from: 1, to: 2 },
        { from: 2, to: 3 },
        { from: 3, to: 4 },
        { from: 1, to: 5 },
        { from: 5, to: 6 },
        { from: 6, to: 7 },
        { from: 2, to: 8 },
        { from: 8, to: 6 },
        { from: 5, to: 9 },
      ],
    },
  },
  {
    name: 'Capricorn',
    symbol: '♑',
    dates: 'Dec 22 - Jan 19',
    element: 'Earth',
    planet: 'Saturn',
    strengths: ['Disciplined', 'Ambitious', 'Responsible', 'Patient', 'Strategic'],
    significance:
      'Capricorn is the mountain goat, the one who climbs steadily, patiently, toward the summit. Ruled by Saturn, Capricorn understands that mastery takes time and that structure is the skeleton of dreams. It teaches us that integrity is built one choice at a time, that authority is earned, and that the highest peaks are reached through persistence, not shortcuts.',
    color: '#6c757d',
    svgPath: 'M 30 35 Q 45 25 55 40 Q 60 55 70 55 Q 80 55 75 70 Q 65 80 55 75 L 55 90',
    constellation: {
      stars: [
        { x: 38, y: 32, size: 2.5 },
        { x: 32, y: 42, size: 2 },
        { x: 62, y: 52, size: 2.5 },
        { x: 80, y: 48, size: 2.5 },
        { x: 128, y: 42, size: 4 },
        { x: 112, y: 55, size: 2.5 },
        { x: 92, y: 75, size: 2 },
        { x: 68, y: 68, size: 2 },
      ],
      lines: [
        { from: 0, to: 1 },
        { from: 0, to: 2 },
        { from: 2, to: 3 },
        { from: 3, to: 4 },
        { from: 4, to: 5 },
        { from: 5, to: 6 },
        { from: 6, to: 7 },
        { from: 7, to: 2 },
      ],
    },
  },
  {
    name: 'Aquarius',
    symbol: '♒',
    dates: 'Jan 20 - Feb 18',
    element: 'Air',
    planet: 'Uranus',
    strengths: ['Innovative', 'Humanitarian', 'Independent', 'Visionary', 'Eccentric'],
    significance:
      'Aquarius is the visionary, the water-bearer who pours new consciousness onto a thirsty world. Ruled by Uranus, Aquarius sees the future before others know the present has ended. It teaches us that progress requires rebellion, that community is built on individuality, and that the most radical act is to imagine a world that has never existed.',
    color: '#48cae4',
    svgPath: 'M 25 40 Q 35 30 45 40 Q 55 50 65 40 Q 75 30 85 40 M 25 60 Q 35 50 45 60 Q 55 70 65 60 Q 75 50 85 60',
    constellation: {
      stars: [
        { x: 35, y: 28, size: 3.5 },
        { x: 65, y: 38, size: 4 },
        { x: 78, y: 45, size: 2.5 },
        { x: 88, y: 58, size: 2.5 },
        { x: 98, y: 72, size: 2.5 },
        { x: 125, y: 78, size: 3 },
        { x: 145, y: 62, size: 2 },
        { x: 55, y: 55, size: 2 },
        { x: 110, y: 88, size: 2 },
        { x: 42, y: 18, size: 2 },
      ],
      lines: [
        { from: 0, to: 1 },
        { from: 1, to: 2 },
        { from: 2, to: 3 },
        { from: 3, to: 4 },
        { from: 4, to: 5 },
        { from: 5, to: 6 },
        { from: 1, to: 7 },
        { from: 4, to: 8 },
        { from: 0, to: 9 },
      ],
    },
  },
  {
    name: 'Pisces',
    symbol: '♓',
    dates: 'Feb 19 - Mar 20',
    element: 'Water',
    planet: 'Neptune',
    strengths: ['Compassionate', 'Intuitive', 'Artistic', 'Mystical', 'Gentle'],
    significance:
      'Pisces is the ocean of the zodiac, boundless, permeable, and infinitely deep. Ruled by Neptune, Pisces dissolves the boundaries between self and other, between dream and reality. It teaches us that imagination is a gateway to the divine, that empathy is a superpower, and that surrender is not defeat but the highest form of trust.',
    color: '#90b4ce',
    svgPath: 'M 25 30 Q 40 20 50 35 Q 55 50 40 55 L 30 60 M 75 90 Q 60 100 50 85 Q 45 70 60 65 L 70 60',
    constellation: {
      stars: [
        { x: 30, y: 25, size: 2.5 },
        { x: 42, y: 35, size: 2 },
        { x: 35, y: 48, size: 2 },
        { x: 50, y: 42, size: 2 },
        { x: 88, y: 58, size: 3.5 },
        { x: 72, y: 48, size: 2 },
        { x: 60, y: 52, size: 2 },
        { x: 105, y: 62, size: 2 },
        { x: 120, y: 68, size: 2.5 },
        { x: 135, y: 78, size: 2.5 },
        { x: 128, y: 88, size: 2 },
        { x: 115, y: 82, size: 2 },
      ],
      lines: [
        { from: 0, to: 1 },
        { from: 1, to: 2 },
        { from: 1, to: 3 },
        { from: 3, to: 4 },
        { from: 4, to: 5 },
        { from: 5, to: 6 },
        { from: 6, to: 4 },
        { from: 4, to: 7 },
        { from: 7, to: 8 },
        { from: 8, to: 9 },
        { from: 9, to: 10 },
        { from: 10, to: 11 },
        { from: 11, to: 8 },
      ],
    },
  },
];
