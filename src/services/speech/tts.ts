import type { LanguageCode } from '../../types';

const TTS_LANG_MAP: Record<LanguageCode, string> = {
  'en-IN': 'en-IN',
  'hi-IN': 'hi-IN',
  'hi-en': 'hi-IN',
};

export function isTtsSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

export function speak(text: string, language: LanguageCode = 'en-IN'): void {
  if (!isTtsSupported() || !text) return;
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = TTS_LANG_MAP[language] ?? 'en-IN';
    utterance.rate = 1;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  } catch {
    // Fail silently — voice feedback is a non-critical enhancement.
  }
}

export function stopSpeaking(): void {
  if (isTtsSupported()) window.speechSynthesis.cancel();
}
