import type { VoiceState } from '../../types';
import { Waveform } from './Waveform';

interface MicButtonProps {
  state: VoiceState;
  onPress: () => void;
  size?: 'lg' | 'md';
}

const STATE_STYLES: Record<VoiceState, { bg: string; ring: string; icon: string }> = {
  idle: { bg: 'bg-primary-500', ring: 'ring-primary-300', icon: '🎙️' },
  listening: { bg: 'bg-warm-500', ring: 'ring-warm-300', icon: '🎙️' },
  processing: { bg: 'bg-accent-500', ring: 'ring-accent-300', icon: '✨' },
  success: { bg: 'bg-primary-500', ring: 'ring-primary-300', icon: '✓' },
  error: { bg: 'bg-warm-600', ring: 'ring-warm-300', icon: '!' },
};

export function MicButton({ state, onPress, size = 'lg' }: MicButtonProps) {
  const styles = STATE_STYLES[state];
  const dimension = size === 'lg' ? 'h-28 w-28 text-4xl' : 'h-16 w-16 text-2xl';

  return (
    <div className="relative flex items-center justify-center">
      {state === 'listening' && (
        <>
          <span className={`absolute inline-flex ${dimension} animate-pulse-ring rounded-full ${styles.bg} opacity-40`} />
          <span
            className={`absolute inline-flex ${dimension} animate-pulse-ring rounded-full ${styles.bg} opacity-40`}
            style={{ animationDelay: '0.6s' }}
          />
        </>
      )}
      <button
        type="button"
        onClick={onPress}
        aria-label={state === 'listening' ? 'Stop listening' : 'Start voice command'}
        aria-pressed={state === 'listening'}
        className={`relative flex ${dimension} items-center justify-center rounded-full ${styles.bg} text-white shadow-lift ring-4 ${styles.ring} transition-transform duration-200 ease-out hover:scale-105 active:scale-95`}
      >
        {state === 'listening' ? <Waveform active color="white" /> : <span aria-hidden="true">{styles.icon}</span>}
      </button>
    </div>
  );
}
