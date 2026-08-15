/*
# Add daily_horoscope column to sign_readings

1. Modified Tables
- `sign_readings`
  - Adds `daily_horoscope` (text, nullable) — a daily horoscope paragraph shown when a user selects their sign.

2. Notes
- No security changes needed — the table already has RLS enabled with anon+authenticated read policies.
*/

ALTER TABLE sign_readings ADD COLUMN IF NOT EXISTS daily_horoscope text;

-- Populate daily horoscopes for all 12 signs
UPDATE sign_readings SET daily_horoscope = 'A surge of initiative courses through your day. Channel it into a single bold action rather than scattering your energy. A conversation mid-afternoon opens a door you did not expect — speak first, overthink later.' WHERE sign = 'Aries';
UPDATE sign_readings SET daily_horoscope = 'Slow, deliberate effort pays off more than any shortcut today. Your instincts around money and comfort are sharp; trust the pull toward what feels solid and lasting. A small indulgence is well-earned.' WHERE sign = 'Taurus';
UPDATE sign_readings SET daily_horoscope = 'Your mind is a switchboard today — ideas crossing, connecting, sparking. Share the best one aloud before it dissolves. A sibling or neighbor figure brings unexpected lightness.' WHERE sign = 'Gemini';
UPDATE sign_readings SET daily_horoscope = 'Emotions run deep and close to the surface. You do not need to explain them to anyone — just honor what you feel. Home is where your power regenerates today; tend to it.' WHERE sign = 'Cancer';
UPDATE sign_readings SET daily_horoscope = 'The spotlight finds you whether you seek it or not. Generosity, warmth, and a touch of drama open hearts. Create something today, however small — your expression is your medicine.' WHERE sign = 'Leo';
UPDATE sign_readings SET daily_horoscope = 'Precision is your superpower. A detail others overlooked is yours to catch, and it changes the outcome. Resist the urge to perfect what is already good enough — ship it.' WHERE sign = 'Virgo';
UPDATE sign_readings SET daily_horoscope = 'Harmony is not passive today — it is a choice you make moment by moment. Weigh both sides, then trust your aesthetic instinct. An invitation this evening balances the scales.' WHERE sign = 'Libra';
UPDATE sign_readings SET daily_horoscope = 'Intensity is your native language, and today it serves you. A secret surfaces, a truth clarifies, or a transformation completes. Let go of what you have been holding underwater.' WHERE sign = 'Scorpio';
UPDATE sign_readings SET daily_horoscope = 'The horizon beckons. A book, a conversation, or a plan for travel widens your lens. Do not shrink your vision to fit today — expand today to fit your vision.' WHERE sign = 'Sagittarius';
UPDATE sign_readings SET daily_horoscope = 'The ladder is sturdier than it looks. Take the next step in your long game — the one only you can see. Authority figures respond well to quiet competence today.' WHERE sign = 'Capricorn';
UPDATE sign_readings SET daily_horoscope = 'A future-facing idea wants your attention. Do not dismiss it as impractical — the world is moving toward the thing you already envision. Connect with your network; a door opens sideways.' WHERE sign = 'Aquarius';
UPDATE sign_readings SET daily_horoscope = 'Your intuition is louder than the noise today — listen before you decide. A creative or spiritual practice grounds you. Compassion for yourself is not weakness; it is the source of your clarity.' WHERE sign = 'Pisces';
