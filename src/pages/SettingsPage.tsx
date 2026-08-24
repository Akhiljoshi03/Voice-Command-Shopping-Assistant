import { useShopping } from '../context/ShoppingContext';
import { LANGUAGE_OPTIONS } from '../data/languages';
import { speak } from '../services/speech/tts';

export function SettingsPage() {
  const { settings, updateSettings } = useShopping();

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl text-ink">Settings</h1>

      <section className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
        <h2 className="font-display text-lg text-ink">Voice language</h2>
        <p className="mt-1 text-sm text-muted">Choose the language you&rsquo;ll speak commands in.</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          {LANGUAGE_OPTIONS.map((lang) => (
            <button
              key={lang.code}
              onClick={() => updateSettings({ language: lang.code })}
              className={`rounded-2xl border px-4 py-3 text-left transition ${
                settings.language === lang.code
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-border bg-canvas hover:border-primary-300'
              }`}
            >
              <p className="font-medium text-ink">{lang.label}</p>
              <p className="text-sm text-muted">{lang.nativeLabel}</p>
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-lg text-ink">Voice feedback</h2>
            <p className="mt-1 text-sm text-muted">Hear spoken confirmations after each command.</p>
          </div>
          <button
            role="switch"
            aria-checked={settings.voiceFeedback}
            onClick={() => {
              const next = !settings.voiceFeedback;
              updateSettings({ voiceFeedback: next });
              if (next) speak('Voice feedback is on.', settings.language);
            }}
            className={`relative h-7 w-12 shrink-0 rounded-full transition ${settings.voiceFeedback ? 'bg-primary-500' : 'bg-border'}`}
          >
            <span
              className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                settings.voiceFeedback ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
        <h2 className="font-display text-lg text-ink">About Sahayak</h2>
        <p className="mt-1 text-sm text-muted">
          Sahayak (&ldquo;helper&rdquo; in Hindi) is a voice-first shopping list assistant. Speak naturally in English,
          Hindi, or Hinglish to add, remove, update, and find products. All data is stored locally on this device.
        </p>
      </section>
    </div>
  );
}
