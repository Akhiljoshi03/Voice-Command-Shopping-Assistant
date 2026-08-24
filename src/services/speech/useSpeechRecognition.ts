import { useCallback, useEffect, useRef, useState } from 'react';

// Minimal ambient typings for browser Speech Recognition
interface SpeechRecognitionResultLike {
  isFinal: boolean;
  0: { transcript: string; confidence: number };
}
interface SpeechRecognitionEventLike extends Event {
  resultIndex: number;
  results: ArrayLike<SpeechRecognitionResultLike>;
}
interface SpeechRecognitionErrorEventLike extends Event {
  error: string;
}
interface SpeechRecognitionLike extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((ev: SpeechRecognitionEventLike) => void) | null;
  onerror: ((ev: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
}

function getSpeechRecognitionCtor(): (new () => SpeechRecognitionLike) | null {
  if (typeof window === 'undefined') return null;
  const w = window as unknown as Record<string, unknown>;
  return (w.SpeechRecognition || w.webkitSpeechRecognition || null) as (new () => SpeechRecognitionLike) | null;
}

export interface UseSpeechRecognitionResult {
  isSupported: boolean;
  isListening: boolean;
  transcript: string;
  interimTranscript: string;
  error: string | null;
  start: () => void;
  stop: () => void;
  reset: () => void;
}

// Language parameter is optional now—en-IN serves as the universal auto-engine
export function useSpeechRecognition(): UseSpeechRecognitionResult {
  const Ctor = getSpeechRecognitionCtor();
  const isSupported = Boolean(Ctor);

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  useEffect(() => {
    return () => {
      recognitionRef.current?.abort();
    };
  }, []);

  const start = useCallback(() => {
    if (!Ctor) {
      setError('unsupported');
      return;
    }
    setError(null);
    setTranscript('');
    setInterimTranscript('');

    const recognition = new Ctor();
    
    // Key Fix: 'en-IN' processes English, Hinglish, and spoken Hindi in standard script
    recognition.lang = 'en-IN'; 
    recognition.interimResults = true;
    recognition.continuous = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event) => {
      let finalText = '';
      let interimText = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) finalText += result[0].transcript;
        else interimText += result[0].transcript;
      }
      if (finalText) setTranscript((prev) => (prev ? `${prev} ${finalText}` : finalText).trim());
      setInterimTranscript(interimText);
    };

    recognition.onerror = (event) => {
      setError(event.error || 'unknown');
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      setInterimTranscript('');
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch {
      setError('start-failed');
    }
  }, [Ctor]);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
  }, []);

  const reset = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
    setError(null);
  }, []);

  return { isSupported, isListening, transcript, interimTranscript, error, start, stop, reset };
}