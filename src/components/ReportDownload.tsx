import { useRef, useState } from 'react';
import { Download, FileText } from 'lucide-react';
import type { CosmicData } from '@/lib/types';
import type { ZodiacSign } from './ZodiacSelector';
import { SectionHeading, OrnamentDivider } from './SectionHeading';
import { ContentBlurGate } from './ContentBlurGate';
import headingData from '@/data/sections/report-download.json';

function formatDate(dateStr: string) {
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  });
}

function formatDateTime(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

const SIGN_GLYPHS: Record<string, string> = {
  Aries: '♈', Taurus: '♉', Gemini: '♊', Cancer: '♋',
  Leo: '♌', Virgo: '♍', Libra: '♎', Scorpio: '♏',
  Sagittarius: '♐', Capricorn: '♑', Aquarius: '♒', Pisces: '♓',
};

export default function ReportDownload({
  data,
  selectedSign,
  isBlurred = false,
}: {
  data: CosmicData;
  selectedSign: ZodiacSign | null;
  isBlurred?: boolean;
}) {
  const reportRef = useRef<HTMLDivElement>(null);
  const [generating, setGenerating] = useState(false);

  const handleDownload = () => {
    setGenerating(true);
    const reportEl = reportRef.current;
    if (!reportEl) return;

    const printContents = reportEl.innerHTML;
    const dateStr = new Date().toLocaleDateString('en-US', {
      weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
    });
    const dateSlug = new Date().toISOString().slice(0, 10);
    const signSlug = selectedSign ? `-${selectedSign}` : '';

    const win = window.open('', '_blank');
    if (!win) {
      setGenerating(false);
      return;
    }

    win.document.write(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Celestial Currents — Cosmic Report</title>
<style>
  @page { margin: 0; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: Georgia, 'Times New Roman', serif;
    color: #1a1f3a;
    background: #f5edd6;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .pdf-page {
    width: 210mm;
    min-height: 297mm;
    padding: 24mm 22mm;
    margin: 0 auto;
    background: linear-gradient(135deg, #f5edd6 0%, #ede0c4 100%);
    position: relative;
  }
  .pdf-page::before {
    content: '';
    position: absolute;
    top: 12mm; left: 12mm; right: 12mm; bottom: 12mm;
    border: 1px solid rgba(168,123,24,0.25);
    pointer-events: none;
  }
  .pdf-header {
    text-align: center;
    margin-bottom: 8mm;
  }
  .pdf-ornament {
    color: #a87b18;
    font-size: 14px;
    letter-spacing: 6px;
    margin-bottom: 4mm;
  }
  .pdf-title {
    font-family: Georgia, serif;
    font-size: 28px;
    font-weight: normal;
    letter-spacing: 4px;
    text-transform: uppercase;
    color: #1a1f3a;
  }
  .pdf-subtitle {
    font-style: italic;
    font-size: 13px;
    color: #6b5d3a;
    margin-top: 2mm;
  }
  .pdf-date {
    font-size: 11px;
    color: #8a7a4a;
    margin-top: 3mm;
    letter-spacing: 1px;
  }
  .pdf-divider {
    text-align: center;
    color: #a87b18;
    margin: 6mm 0;
    font-size: 12px;
  }
  .pdf-divider::before,
  .pdf-divider::after {
    content: '———';
    margin: 0 8px;
    color: rgba(168,123,24,0.4);
  }
  .pdf-section { margin-bottom: 7mm; }
  .pdf-section-title {
    font-family: Georgia, serif;
    font-size: 14px;
    font-weight: bold;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: #1a1f3a;
    border-bottom: 1px solid rgba(168,123,24,0.35);
    padding-bottom: 2mm;
    margin-bottom: 4mm;
  }
  .pdf-entry { margin-bottom: 4mm; }
  .pdf-entry-label {
    font-size: 11px;
    font-weight: bold;
    color: #8a6d1a;
    letter-spacing: 1px;
    text-transform: uppercase;
  }
  .pdf-entry-text {
    font-size: 12px;
    line-height: 1.6;
    color: #2a2f4a;
    margin-top: 1mm;
  }
  .pdf-entry-sub {
    font-size: 11px;
    color: #6b5d3a;
    font-style: italic;
    margin-top: 1mm;
  }
  .pdf-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4mm; }
  .pdf-grid-item {
    padding: 3mm;
    border: 1px solid rgba(168,123,24,0.20);
    border-radius: 2mm;
    background: rgba(255,250,235,0.5);
  }
  .pdf-grid-label {
    font-size: 10px;
    font-weight: bold;
    color: #8a6d1a;
    letter-spacing: 1px;
    text-transform: uppercase;
    margin-bottom: 1mm;
  }
  .pdf-grid-text {
    font-size: 11px;
    line-height: 1.5;
    color: #2a2f4a;
  }
  .pdf-mantra {
    font-style: italic;
    font-size: 13px;
    color: #4a3f1a;
    text-align: center;
    padding: 3mm;
    border-top: 1px solid rgba(168,123,24,0.25);
    border-bottom: 1px solid rgba(168,123,24,0.25);
  }
  .pdf-list { list-style: none; padding: 0; }
  .pdf-list li {
    font-size: 12px;
    line-height: 1.6;
    color: #2a2f4a;
    padding-left: 6mm;
    position: relative;
    margin-bottom: 2mm;
  }
  .pdf-list li::before {
    content: '✦';
    position: absolute;
    left: 0;
    color: #a87b18;
    font-size: 10px;
  }
  .pdf-numbered { list-style: none; padding: 0; counter-reset: item; }
  .pdf-numbered li {
    font-size: 12px;
    line-height: 1.6;
    color: #2a2f4a;
    padding-left: 8mm;
    position: relative;
    margin-bottom: 3mm;
    counter-increment: item;
  }
  .pdf-numbered li::before {
    content: counter(item) '.';
    position: absolute;
    left: 0;
    font-weight: bold;
    color: #8a6d1a;
  }
  .pdf-footer {
    text-align: center;
    margin-top: 10mm;
    padding-top: 6mm;
    border-top: 1px solid rgba(168,123,24,0.25);
  }
  .pdf-footer-text {
    font-style: italic;
    font-size: 11px;
    color: #6b5d3a;
    line-height: 1.6;
  }
  .pdf-sign-glyph {
    font-size: 40px;
    color: #a87b18;
    text-align: center;
    margin-bottom: 2mm;
  }
  @media print {
    body { background: #f5edd6; }
    .pdf-page { page-break-after: always; }
    .pdf-page:last-child { page-break-after: auto; }
  }
</style>
</head>
<body>
${printContents}
<script>
  window.onload = function() {
    setTimeout(function() {
      window.print();
    }, 300);
  };
</script>
</body>
</html>`);
    win.document.close();

    setTimeout(() => setGenerating(false), 1000);
    void dateSlug;
    void signSlug;
    void dateStr;
  };

  const signReading = selectedSign ? data.signReadings[selectedSign] : null;

  return (
    <section id="report-download" className="mx-auto max-w-7xl px-6 py-16">
      <SectionHeading
        number={headingData.heading.number}
        eyebrow={headingData.heading.eyebrow}
        title={headingData.heading.title}
        subtitle={headingData.heading.subtitle}
        onParchment
      />

      <ContentBlurGate isBlurred={isBlurred}>
        <div className="mt-10 rounded-lg border border-gold-500/25 bg-navy-800/30 p-8">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:gap-8">
            <span className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full border-2 border-gold-400/25">
              <FileText className="h-8 w-8 text-gold-300" strokeWidth={1.2} />
            </span>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="font-display text-xl font-semibold prose-title">
                Your Celestial Recap
              </h3>
              <p className="mt-2 font-serif text-base leading-relaxed prose-body">
                A complete PDF report including{selectedSign ? ` your ${selectedSign} reading,` : ''} the current lunar phase,
                all active transits, the collective tarot spread, elemental guidance, shadow work prompts,
                mantras, crystal pairings, void-of-course moon windows, and upcoming cosmic events.
              </p>
              <button
                onClick={handleDownload}
                disabled={generating}
                className="mt-6 inline-flex items-center gap-2 rounded-md bg-gold-400 px-6 py-3 font-display text-[11px] font-semibold uppercase tracking-[0.2em] text-navy-950 transition-all hover:bg-gold-300 hover:shadow-lg hover:shadow-gold-400/20 disabled:opacity-60"
              >
                <Download className="h-4 w-4" />
                {generating ? 'Preparing PDF...' : 'Download PDF Report'}
              </button>
            </div>
          </div>
        </div>
      </ContentBlurGate>

      {/* Hidden print-only report content */}
      <div ref={reportRef} style={{ position: 'absolute', left: '-9999px', top: 0, width: '210mm', overflow: 'hidden', opacity: 0, pointerEvents: 'none' }}>
        <div className="pdf-page">
          <div className="pdf-header">
            <div className="pdf-ornament">✦ ✦ ✦</div>
            <div className="pdf-title">Celestial Currents</div>
            <div className="pdf-subtitle">Your Personal Cosmic Report</div>
            <div className="pdf-date">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </div>
          </div>

          <div className="pdf-divider">✦</div>

          {signReading && selectedSign && (
            <div className="pdf-section">
              <div className="pdf-sign-glyph">{SIGN_GLYPHS[selectedSign] ?? ''}</div>
              <div className="pdf-section-title" style={{ textAlign: 'center', border: 'none' }}>
                {selectedSign} Reading
              </div>
              <div className="pdf-grid" style={{ marginTop: '4mm' }}>
                <div className="pdf-grid-item">
                  <div className="pdf-grid-label">Mental Sparks</div>
                  <div className="pdf-grid-text">{signReading.mental_sparks}</div>
                </div>
                <div className="pdf-grid-item">
                  <div className="pdf-grid-label">Social Balance</div>
                  <div className="pdf-grid-text">{signReading.social_balance}</div>
                </div>
                <div className="pdf-grid-item">
                  <div className="pdf-grid-label">Career Focus</div>
                  <div className="pdf-grid-text">{signReading.career_focus}</div>
                </div>
                <div className="pdf-grid-item">
                  <div className="pdf-grid-label">Love Focus</div>
                  <div className="pdf-grid-text">{signReading.love_focus}</div>
                </div>
                <div className="pdf-grid-item">
                  <div className="pdf-grid-label">Wellness Focus</div>
                  <div className="pdf-grid-text">{signReading.wellness_focus}</div>
                </div>
                <div className="pdf-grid-item">
                  <div className="pdf-grid-label">Key Dates</div>
                  <div className="pdf-grid-text">{signReading.key_dates}</div>
                </div>
              </div>
              <div className="pdf-mantra" style={{ marginTop: '4mm' }}>
                &ldquo;{signReading.mantra}&rdquo;
              </div>
              <div className="pdf-entry-sub" style={{ textAlign: 'center', marginTop: '2mm' }}>
                Crystal: {signReading.crystal}
              </div>
            </div>
          )}

          {data.lunarPhase && (
            <div className="pdf-section">
              <div className="pdf-section-title">Lunar Phase</div>
              <div className="pdf-entry">
                <div className="pdf-entry-label">{data.lunarPhase.phase_type} in {data.lunarPhase.zodiac_sign}</div>
                <div className="pdf-entry-text">{data.lunarPhase.overview}</div>
                <div className="pdf-entry-sub">Theme: {data.lunarPhase.theme} · Peak: {formatDateTime(data.lunarPhase.peak_time)}</div>
              </div>
              {data.lunarPhase.ritual_steps && data.lunarPhase.ritual_steps.length > 0 && (
                <ol className="pdf-numbered" style={{ marginTop: '3mm' }}>
                  {data.lunarPhase.ritual_steps.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              )}
            </div>
          )}

          {data.transits.length > 0 && (
            <div className="pdf-section">
              <div className="pdf-section-title">Planetary Transits</div>
              {data.transits.map((t, i) => (
                <div className="pdf-entry" key={i}>
                  <div className="pdf-entry-label">
                    {t.planet} {t.aspect_type ?? t.event_type}{t.sign ? ' in ' + t.sign : ''} · {formatDate(t.date)}
                  </div>
                  <div className="pdf-entry-text">{t.description}</div>
                  <div className="pdf-entry-sub">Guidance: {t.advice}</div>
                </div>
              ))}
            </div>
          )}

          {data.tarotCards.length > 0 && (
            <div className="pdf-section">
              <div className="pdf-section-title">Collective Tarot Reading</div>
              {data.tarotCards.map((card, i) => (
                <div className="pdf-entry" key={i}>
                  <div className="pdf-entry-label">{card.position_label}: {card.card_name} ({card.upright ? 'Upright' : 'Reversed'})</div>
                  <div className="pdf-entry-text">{card.interpretation}</div>
                </div>
              ))}
            </div>
          )}

          {data.elementalEnergy.length > 0 && (
            <div className="pdf-section">
              <div className="pdf-section-title">Elemental Energy</div>
              {data.elementalEnergy.map((el, i) => (
                <div className="pdf-entry" key={i}>
                  <div className="pdf-entry-label">{el.element} · {el.focus}</div>
                  <div className="pdf-entry-text">{el.advice}</div>
                  <div className="pdf-entry-sub">Balance: {el.balance_tip}</div>
                </div>
              ))}
            </div>
          )}

          {data.shadowPrompts.length > 0 && (
            <div className="pdf-section">
              <div className="pdf-section-title">Shadow Work Prompts</div>
              <ol className="pdf-numbered">
                {data.shadowPrompts.map((p, i) => (
                  <li key={i}>{p.prompt}<div className="pdf-entry-sub">Context: {p.context}</div></li>
                ))}
              </ol>
            </div>
          )}

          {data.mantras.length > 0 && (
            <div className="pdf-section">
              <div className="pdf-section-title">Mantra &amp; Affirmation Codes</div>
              {data.mantras.map((m, i) => (
                <div className="pdf-entry" key={i}>
                  <div className="pdf-mantra">&ldquo;{m.mantra}&rdquo;</div>
                  <div className="pdf-entry-sub" style={{ textAlign: 'center' }}>For: {m.targets_transit}</div>
                </div>
              ))}
            </div>
          )}

          {data.crystalBotanical.length > 0 && (
            <div className="pdf-section">
              <div className="pdf-section-title">Crystal &amp; Botanical Pairings</div>
              {data.crystalBotanical.map((item, i) => (
                <div className="pdf-entry" key={i}>
                  <div className="pdf-entry-label">{item.category}: {item.name}{item.zodiac_sign ? ' (' + item.zodiac_sign + ')' : ''}</div>
                  <div className="pdf-entry-text">Purpose: {item.purpose}</div>
                  <div className="pdf-entry-sub">Usage: {item.usage}</div>
                </div>
              ))}
            </div>
          )}

          {data.voidMoonWindows.length > 0 && (
            <div className="pdf-section">
              <div className="pdf-section-title">Void-of-Course Moon Windows</div>
              {data.voidMoonWindows.map((w, i) => (
                <div className="pdf-entry" key={i}>
                  <div className="pdf-entry-label">{formatDateTime(w.start_time)} — {formatDateTime(w.end_time)}</div>
                  <div className="pdf-entry-text">{w.warning}</div>
                </div>
              ))}
            </div>
          )}

          {data.cosmicEvents.length > 0 && (
            <div className="pdf-section">
              <div className="pdf-section-title">Upcoming Cosmic Events</div>
              {data.cosmicEvents.map((event, i) => (
                <div className="pdf-entry" key={i}>
                  <div className="pdf-entry-label">{event.title} · {formatDate(event.event_date)}</div>
                  <div className="pdf-entry-text">{event.description}</div>
                  <div className="pdf-entry-sub">Guidance: {event.guidance}</div>
                </div>
              ))}
            </div>
          )}

          <div className="pdf-footer">
            <div className="pdf-divider">✦</div>
            <div className="pdf-footer-text">
              For reflection and inspiration. Not a substitute for professional guidance.<br />
              The planets move, and so can you.
            </div>
          </div>
        </div>
      </div>

      <div className="mt-14"><OrnamentDivider /></div>
    </section>
  );
}