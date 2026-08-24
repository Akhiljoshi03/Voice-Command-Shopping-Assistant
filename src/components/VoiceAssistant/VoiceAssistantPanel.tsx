import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MicButton } from './MicButton';
import { useSpeechRecognition } from '../../services/speech/useSpeechRecognition';
import { speak } from '../../services/speech/tts';
import { parseCommand } from '../../services/nlp/intentParser';
import { useShopping } from '../../context/ShoppingContext';
import { useToast } from '../../context/ToastContext';
import type { ParsedIntent, VoiceState } from '../../types';
import { formatQuantity } from '../../utils/format';
import { LANGUAGE_OPTIONS } from '../../data/languages';

const STATE_LABEL: Record<VoiceState, string> = {
  idle: 'Tap to speak',
  listening: 'Listening…',
  processing: 'Understanding your request…',
  success: 'Got it ✓',
  error: "I couldn't understand that. Try again.",
};

function describeIntent(parsed: ParsedIntent): string | null {
  const { intent, entities } = parsed;
  switch (intent) {
    case 'ADD':
      return entities.product
        ? `Adding to your list — ${entities.product} × ${formatQuantity(entities.quantity ?? 1, entities.unit ?? 'pieces')}`
        : null;
    case 'REMOVE':
      return entities.product ? `Removing ${entities.product} from your list` : null;
    case 'UPDATE':
      return entities.product && entities.quantity !== undefined
        ? `Updating ${entities.product} to ${formatQuantity(entities.quantity, entities.unit ?? 'pieces')}`
        : null;
    case 'SEARCH': {
      const bits: string[] = [];
      if (entities.preferences?.length) bits.push(entities.preferences.join(', '));
      if (entities.product) bits.push(entities.product);
      if (entities.brand) bits.push(entities.brand);
      const priceBit = entities.maxPrice ? ` under ₹${entities.maxPrice}` : '';
      return `Searching for ${bits.join(' ') || 'products'}${priceBit}`;
    }
    case 'CLEAR':
      return 'Clearing your entire shopping list';
    case 'VIEW':
      return 'Reading out your shopping list';
    default:
      return null;
  }
}

export function VoiceAssistantPanel() {
  const { settings, runVoiceCommand } = useShopping();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const recognition = useSpeechRecognition(settings.language);
  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const [lastParsed, setLastParsed] = useState<ParsedIntent | null>(null);
  const [resultMessage, setResultMessage] = useState<string | null>(null);
  const [manualText, setManualText] = useState('');
  const processedRef = useRef(false);

  const languageLabel = LANGUAGE_OPTIONS.find((l) => l.code === settings.language)?.label ?? 'English';

  const processTranscript = (text: string) => {
    if (!text.trim()) {
      setVoiceState('idle');
      return;
    }
    setVoiceState('processing');
    const parsed = parseCommand(text);
    setLastParsed(parsed);

    window.setTimeout(() => {
      if (parsed.intent === 'SEARCH') {
        const params = new URLSearchParams();
        if (parsed.entities.product) params.set('q', parsed.entities.product);
        if (parsed.entities.brand) params.set('brand', parsed.entities.brand);
        if (parsed.entities.maxPrice) params.set('max', String(parsed.entities.maxPrice));
        if (parsed.entities.minPrice) params.set('min', String(parsed.entities.minPrice));
        if (parsed.entities.preferences?.includes('organic')) params.set('organic', '1');
        setVoiceState('success');
        setResultMessage(`Searching for ${parsed.entities.product ?? 'products'}…`);
        if (settings.voiceFeedback) speak(`Searching for ${parsed.entities.product ?? 'products'}`, settings.language);
        window.setTimeout(() => navigate(`/search?${params.toString()}`), 700);
        return;
      }

      const result = runVoiceCommand(parsed);
      setVoiceState(result.success ? 'success' : 'error');
      setResultMessage(result.message);
      if (settings.voiceFeedback) speak(result.message, settings.language);
      if (!result.success) showToast(result.message, 'error');

      window.setTimeout(() => {
        setVoiceState('idle');
      }, 2600);
    }, 500);
  };

  useEffect(() => {
    if (recognition.isListening) {
      processedRef.current = false;
      setVoiceState('listening');
      setResultMessage(null);
      setLastParsed(null);
    } else if (!processedRef.current && voiceState === 'listening') {
      processedRef.current = true;
      if (recognition.transcript) {
        processTranscript(recognition.transcript);
      } else {
        setVoiceState('idle');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recognition.isListening]);

  useEffect(() => {
    if (recognition.error && voiceState !== 'idle') {
      setVoiceState('error');
      const msg =
        recognition.error === 'not-allowed'
          ? 'Microphone access was denied. Enable it in your browser settings.'
          : recognition.error === 'unsupported'
          ? "Voice input isn't supported in this browser. Try typing instead."
          : "I couldn't hear you clearly. Please try again.";
      setResultMessage(msg);
      window.setTimeout(() => setVoiceState('idle'), 3000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recognition.error]);

  const handleMicPress = () => {
    if (voiceState === 'listening') {
      recognition.stop();
      return;
    }
    recognition.reset();
    setResultMessage(null);
    setLastParsed(null);
    recognition.start();
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualText.trim()) return;
    processTranscript(manualText);
    setManualText('');
  };

  const liveText = recognition.transcript || recognition.interimTranscript;
  const detectedSummary = lastParsed ? describeIntent(lastParsed) : null;

  return (
    <div className="rounded-3xl border border-border bg-surface p-6 shadow-soft sm:p-8">
      <div className="flex flex-col items-center gap-5 text-center">
        <MicButton state={voiceState} onPress={handleMicPress} />

        <div className="min-h-[1.5rem]">
          <p className={`font-display text-lg ${voiceState === 'error' ? 'text-warm-600' : 'text-ink'}`}>
            {resultMessage && (voiceState === 'success' || voiceState === 'error') ? resultMessage : STATE_LABEL[voiceState]}
          </p>
        </div>

        {voiceState === 'listening' && (
          <p className="rounded-full bg-canvas-dim px-3 py-1 text-xs font-medium text-muted">
            Speaking in {languageLabel}
          </p>
        )}

        {(liveText || detectedSummary) && voiceState !== 'idle' && (
          <div className="w-full space-y-2 text-left animate-fade-scale">
            {liveText && (
              <div className="rounded-2xl bg-canvas-dim px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">You said</p>
                <p className="mt-0.5 text-sm text-ink-soft">&ldquo;{liveText}&rdquo;</p>
              </div>
            )}
            {detectedSummary && voiceState !== 'listening' && (
              <div className="rounded-2xl border border-primary-100 bg-primary-50 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary-600">Detected action</p>
                <p className="mt-0.5 text-sm font-medium text-primary-700">{detectedSummary}</p>
              </div>
            )}
          </div>
        )}

        {!recognition.isSupported && (
          <p className="text-xs text-muted">
            Voice recognition isn&rsquo;t available in this browser — type a command below instead.
          </p>
        )}

        <form onSubmit={handleManualSubmit} className="mt-1 flex w-full items-center gap-2">
          <label htmlFor="manual-command" className="sr-only">Type a shopping command</label>
          <input
            id="manual-command"
            type="text"
            value={manualText}
            onChange={(e) => setManualText(e.target.value)}
            placeholder='Or type a command, e.g. "add 2 bottles of milk"'
            className="w-full rounded-full border border-border bg-canvas px-4 py-2.5 text-sm text-ink placeholder:text-muted focus:border-primary-500 focus:bg-surface"
          />
          <button
            type="submit"
            className="shrink-0 rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-canvas transition hover:bg-primary-600"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
