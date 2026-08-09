import { useState } from 'react';
import { BookOpen, ChevronDown } from 'lucide-react';
import { SectionHeading, OrnamentDivider } from './SectionHeading';
import { ContentBlurGate } from './ContentBlurGate';

interface MythEntry {
  planet: string;
  glyph: string;
  greekName: string;
  romanName: string;
  domain: string;
  myth: string;
  archetype: string;
  psychology: string;
  lesson: string;
}

const entries: MythEntry[] = [
  {
    planet: 'Sun',
    glyph: '☉\uFE0E',
    greekName: 'Apollo',
    romanName: 'Sol',
    domain: 'Identity, vitality, the conscious self',
    myth: 'Apollo, son of Zeus and Leto, was born on the floating island of Delos — denied sanctuary everywhere else by jealous Hera. He drove the chariot of the sun across the sky, bringing light and prophecy to the world. His oracle at Delphi spoke the will of the gods, inscribed with the words "Know thyself."',
    archetype: 'The King — the radiant center around which the psyche organizes itself. The part of you that must be seen, must shine, must express its essence without apology.',
    psychology: 'The Sun represents the core identity — who you are at your most essential. When well-integrated, it brings warmth, confidence, and creative vitality. When suppressed, it manifests as a crisis of purpose: "Who am I, really?"',
    lesson: 'You are not what you do. You are what you illuminate.',
  },
  {
    planet: 'Moon',
    glyph: '☽\uFE0E',
    greekName: 'Artemis',
    romanName: 'Luna',
    domain: 'Emotion, instinct, the unconscious, the body',
    myth: 'Artemis, twin sister of Apollo, roamed the wild forests with her band of nymphs, refusing marriage or domestication. She was the protector of the young, the wild, and the vulnerable. When the hunter Actaeon glimpsed her bathing, she transformed him into a stag — his own hounds tore him apart. Her domain was sacred, and her boundaries absolute.',
    archetype: 'The Queen of the Night — the instinctual, feeling self that operates beneath language. The part that knows before it thinks.',
    psychology: 'The Moon governs the emotional body — your needs, your habits, your earliest conditioning. A well-tended Moon brings emotional fluency and inner safety. A neglected Moon floods the psyche with unprocessed feeling.',
    lesson: 'Your feelings are not problems to solve. They are a wilderness to protect.',
  },
  {
    planet: 'Mercury',
    glyph: '☿\uFE0E',
    greekName: 'Hermes',
    romanName: 'Mercury',
    domain: 'Communication, mind, trade, thresholds',
    myth: "Hermes was born at dawn and by noon had stolen Apollo's cattle, inventing the lyre to appease him. He was the messenger of the gods — but also the trickster, the god of thieves, crossroads, and liminal spaces. He alone moved freely between Olympus, the earth, and the underworld, guiding souls to the afterlife as psychopomp.",
    archetype: 'The Messenger — the bridge between worlds. The mind that translates between the conscious and the unconscious, the known and the unknown.',
    psychology: 'Mercury governs how you process, sort, and share information. When integrated, it makes you a translator and connector. When stuck, it loops in anxiety, overthinking, or deception — of self or others.',
    lesson: 'The word is not the thing. But the right word can open the door.',
  },
  {
    planet: 'Venus',
    glyph: '♀\uFE0E',
    greekName: 'Aphrodite',
    romanName: 'Venus',
    domain: 'Love, beauty, values, attraction',
    myth: "Aphrodite rose from the sea foam where Uranus's severed genitals fell — born of violence into breathtaking beauty. She was irresistible, desired by all, yet her own desires were her own. Married to Hephaestus, she took lovers freely. Her magic belt could make anyone desire her — but she could not make anyone truly love.",
    archetype: 'The Lover — the part that magnetizes, attracts, and values. The capacity to receive and to give pleasure without shame.',
    psychology: 'Venus describes what you love and how you love. When integrated, it brings grace, self-worth, and the ability to receive. When wounded, it manifests as people-pleasing, vanity, or the belief that love must be earned.',
    lesson: 'You do not attract what you want. You attract what you are.',
  },
  {
    planet: 'Mars',
    glyph: '♂\uFE0E',
    greekName: 'Ares',
    romanName: 'Mars',
    domain: 'Action, desire, courage, conflict',
    myth: 'Ares was the god of war — but not the strategic, noble war of Athena. He was the raw, bloodlust of battle, the scream of the charge. The Greeks feared and disliked him; he was passionate but reckless. Yet he loved Aphrodite fiercely, and she him. His sons included Fear and Terror — but also Eros, who carried his fire into the realm of love.',
    archetype: 'The Warrior — the capacity to act, to desire, to fight for what matters. The will that says "I want" and means it.',
    psychology: 'Mars is your drive — how you assert, pursue, and protect. When integrated, it brings courage and clean anger. When suppressed, it turns inward as depression or outward as rage. Mars must move.',
    lesson: 'Anger is not the opposite of love. Apathy is.',
  },
  {
    planet: 'Jupiter',
    glyph: '♃\uFE0E',
    greekName: 'Zeus',
    romanName: 'Jupiter',
    domain: 'Expansion, wisdom, meaning, abundance',
    myth: 'Zeus, youngest son of Cronus, overthrew his father to free his swallowed siblings. He ruled Olympus as king of the gods — god of sky, thunder, law, and order. Yet he was also famous for his affairs, taking countless lovers in countless forms. He was expansion itself: the principle that grows, reaches, and multiplies.',
    archetype: 'The King — the part that seeks meaning, growth, and the big picture. The optimist, the teacher, the one who says "more is possible."',
    psychology: 'Jupiter is your faith — in life, in growth, in meaning. When integrated, it brings generosity, perspective, and trust. When unchecked, it becomes excess, self-righteousness, and the inability to say no.',
    lesson: 'Growth is not accumulation. It is the widening of what you can hold.',
  },
  {
    planet: 'Saturn',
    glyph: '♄\uFE0E',
    greekName: 'Cronus',
    romanName: 'Saturn',
    domain: 'Structure, time, discipline, limitation',
    myth: "Cronus, titan son of Uranus, castrated his father at his mother's urging — only to be told he would be overthrown by his own child. He swallowed each child at birth, until Rhea hid Zeus away. In Rome, Saturn was also the god of the Golden Age — a time of abundance and equality, celebrated at the Saturnalia, when masters served slaves and the world turned upside down.",
    archetype: 'The Senex — the wise elder who sets boundaries, builds structure, and faces reality. The part that says "no" so that the "yes" means something.',
    psychology: 'Saturn is your relationship to limitation, authority, and time. When integrated, it brings mastery, discipline, and endurance. When resisted, it manifests as fear, rigidity, or the feeling of being crushed by responsibility.',
    lesson: 'The wall is not your enemy. It is what teaches you to push.',
  },
  {
    planet: 'Uranus',
    glyph: '♅\uFE0E',
    greekName: 'Ouranos',
    romanName: 'Caelus',
    domain: 'Revolution, awakening, individuation',
    myth: 'Ouranos was the sky god — mate to Gaia, the earth. Each night he pressed down upon her, trapping their children inside her body until Cronus castrated him with a sickle. From his severed genitals came Aphrodite. From the blood that fell to earth came the Furies and the Giants. He was the primal sky — vast, distant, and ultimately overthrown by what he tried to suppress.',
    archetype: "The Rebel — the part that breaks patterns, awakens, and insists on freedom. The lightning bolt that illuminates the cage you didn't know you were in.",
    psychology: 'Uranus is the principle of awakening — sudden insight, disruption, and individuation. When integrated, it brings genius and liberation. When resisted, it manifests as chaos, alienation, or the feeling of being different.',
    lesson: 'Freedom is not the absence of structure. It is the structure you choose.',
  },
  {
    planet: 'Neptune',
    glyph: '♆\uFE0E',
    greekName: 'Poseidon',
    romanName: 'Neptune',
    domain: 'Dreams, dissolution, mysticism, illusion',
    myth: 'Poseidon, brother of Zeus, ruled the sea — unpredictable, deep, and vast. He was the Earth-Shaker, whose anger caused earthquakes. He competed with Athena for Athens and lost — his gift, a saltwater spring, was less useful than her olive tree. He was the god of what cannot be controlled: the depths, the dream, the dissolving wave.',
    archetype: 'The Mystic — the part that longs to merge, to dissolve, to touch the infinite. The dreamer, the artist, the seeker of the unseen.',
    psychology: 'Neptune is the principle of dissolution — the longing to return to source. When integrated, it brings compassion, creativity, and spiritual openness. When unchecked, it becomes escapism, addiction, or the loss of self in others.',
    lesson: 'The ocean is not dangerous because it is deep. It is dangerous because it is inside you.',
  },
  {
    planet: 'Pluto',
    glyph: '♇\uFE0E',
    greekName: 'Hades',
    romanName: 'Pluto',
    domain: 'Death, rebirth, power, the underworld',
    myth: 'Hades, brother of Zeus, drew the underworld as his domain — the realm of the dead. He rarely left his kingdom and was feared rather than loved. He abducted Persephone, who ate six pomegranate seeds and was bound to return to him for six months each year — creating the seasons. He was also Plouton, the wealthy — for all precious things come from underground.',
    archetype: 'The Underworld King — the part that rules death and rebirth. The power that destroys what must die so that something new can grow.',
    psychology: 'Pluto is the principle of transformation — the descent, the death, the return. When integrated, it brings profound power and the ability to regenerate. When resisted, it manifests as control, obsession, or the refusal to grieve.',
    lesson: 'What you bury does not die. What you face does.',
  },
];

export default function MythologicalArchives({ isBlurred = false }: { isBlurred?: boolean }) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section id="mythology" className="mx-auto max-w-7xl px-6 py-16">
      <SectionHeading
        number="15"
        onParchment
        eyebrow="Historical & Mythological Archives"
        title="The gods behind the planets"
        subtitle="Every planet carries an ancient myth and a psychological archetype. Understanding the story reveals the deeper pattern the planet plays in your chart."
      />

      <ContentBlurGate isBlurred={isBlurred}>
        <div className="mt-10 space-y-3">
          {entries.map((entry, i) => {
            const isOpen = openIdx === i;
            return (
              <div
                key={entry.planet}
                className="overflow-hidden rounded-lg border border-gold-500/20 bg-cream-50/30"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : i)}
                  className="flex w-full items-center gap-4 px-6 py-4 text-left transition-colors hover:bg-cream-200/30"
                >
                  <span
                    className="font-display text-2xl text-gold-600"
                    style={{ fontFamily: "'Cinzel', Georgia, serif" }}
                  >
                    {entry.glyph}
                  </span>
                  <div className="flex-1">
                    <h3 className="font-display text-lg font-semibold text-navy-900">
                      {entry.planet}
                      <span className="ml-2 font-serif text-sm italic font-normal prose-muted">
                        {entry.greekName} → {entry.romanName}
                      </span>
                    </h3>
                    <p className="font-display text-[10px] uppercase tracking-wider text-gold-600">
                      {entry.domain}
                    </p>
                  </div>
                  <ChevronDown
                    className={`h-5 w-5 text-gold-600 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {isOpen && (
                  <div className="border-t border-gold-500/15 px-6 py-5">
                    <div className="grid gap-5 md:grid-cols-2">
                      <div>
                        <p className="font-display text-[10px] uppercase tracking-wider text-gold-600">The Myth</p>
                        <p className="mt-2 font-serif text-base leading-relaxed prose-body">{entry.myth}</p>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <p className="font-display text-[10px] uppercase tracking-wider text-gold-600">The Archetype</p>
                          <p className="mt-2 font-serif text-base italic leading-relaxed prose-body">{entry.archetype}</p>
                        </div>
                        <div>
                          <p className="font-display text-[10px] uppercase tracking-wider text-gold-600">Psychology</p>
                          <p className="mt-2 font-serif text-base leading-relaxed prose-body">{entry.psychology}</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-5 rounded-md border border-gold-500/20 bg-white/40 px-4 py-3">
                      <p className="font-serif text-lg italic leading-snug text-navy-900">
                        <BookOpen className="mr-2 inline h-4 w-4 text-gold-600" strokeWidth={1.5} />
                        {entry.lesson}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </ContentBlurGate>

      <div className="mt-14"><OrnamentDivider onParchment /></div>
    </section>
  );
}