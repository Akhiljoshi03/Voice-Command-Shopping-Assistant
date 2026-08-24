import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SearchFiltersBar } from '../components/Search/SearchFilters';
import { ProductCard } from '../components/ProductCard/ProductCard';
import { EmptyState } from '../components/common/EmptyState';
import { searchProducts, type SearchFilters } from '../services/products/search';
import { parseCommand } from '../services/nlp/intentParser';
import { useShopping } from '../context/ShoppingContext';
import { MicButton } from '../components/VoiceAssistant/MicButton';
import { useSpeechRecognition } from '../services/speech/useSpeechRecognition';
import type { VoiceState } from '../types';

export function SearchPage() {
  const [params, setParams] = useSearchParams();
  const { settings, addHistoryEntry } = useShopping();
  const [filters, setFilters] = useState<SearchFilters>({
    query: params.get('q') ?? undefined,
    brand: params.get('brand') ?? undefined,
    maxPrice: params.get('max') ? Number(params.get('max')) : undefined,
    minPrice: params.get('min') ? Number(params.get('min')) : undefined,
    organicOnly: params.get('organic') === '1',
  });
  const [queryInput, setQueryInput] = useState(filters.query ?? '');
  const [isLoading, setIsLoading] = useState(false);
  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const recognition = useSpeechRecognition(settings.language);

  useEffect(() => {
    setIsLoading(true);
    const t = window.setTimeout(() => setIsLoading(false), 350);
    return () => window.clearTimeout(t);
  }, [filters]);

  useEffect(() => {
    if (!recognition.isListening && voiceState === 'listening') {
      setVoiceState('idle');
      if (recognition.transcript) {
        const parsed = parseCommand(recognition.transcript);
        const next: SearchFilters = {
          query: parsed.entities.product ?? recognition.transcript,
          brand: parsed.entities.brand,
          maxPrice: parsed.entities.maxPrice,
          minPrice: parsed.entities.minPrice,
          organicOnly: parsed.entities.preferences?.includes('organic'),
        };
        setFilters(next);
        setQueryInput(next.query ?? '');
        addHistoryEntry({ type: 'command', transcript: recognition.transcript, intent: 'SEARCH', summary: `Searched for ${next.query ?? 'products'}` });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recognition.isListening]);

  useEffect(() => {
    const next = new URLSearchParams();
    if (filters.query) next.set('q', filters.query);
    if (filters.brand) next.set('brand', filters.brand);
    if (filters.maxPrice !== undefined) next.set('max', String(filters.maxPrice));
    if (filters.minPrice !== undefined) next.set('min', String(filters.minPrice));
    if (filters.organicOnly) next.set('organic', '1');
    setParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const results = useMemo(() => searchProducts(filters), [filters]);

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseCommand(queryInput);
    setFilters({
      query: parsed.entities.product ?? queryInput,
      brand: parsed.entities.brand,
      maxPrice: parsed.entities.maxPrice,
      minPrice: parsed.entities.minPrice,
      organicOnly: parsed.entities.preferences?.includes('organic'),
    });
  };

  const handleMic = () => {
    if (recognition.isListening) {
      recognition.stop();
      return;
    }
    recognition.reset();
    setVoiceState('listening');
    recognition.start();
  };

  return (
    <div className="space-y-5">
      <h1 className="font-display text-2xl text-ink">Search</h1>

      <div className="flex items-center gap-3 rounded-3xl border border-border bg-surface p-4 shadow-soft">
        <MicButton state={voiceState} onPress={handleMic} size="md" />
        <form onSubmit={handleTextSubmit} className="flex-1">
          <input
            value={queryInput}
            onChange={(e) => setQueryInput(e.target.value)}
            placeholder='Try "organic apples under ₹300"'
            className="w-full rounded-full border border-border bg-canvas px-4 py-2.5 text-sm placeholder:text-muted focus:border-primary-500 focus:bg-surface"
          />
        </form>
        {!recognition.isSupported && <span className="hidden text-xs text-muted sm:inline">Voice search unavailable — type instead</span>}
      </div>

      <SearchFiltersBar filters={filters} onChange={setFilters} />

      {isLoading ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" aria-label="Searching products…">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-48 animate-pulse rounded-2xl bg-canvas-dim" />
          ))}
        </div>
      ) : results.length === 0 ? (
        <EmptyState icon="🔍" title="No products found" description="Try a different search term, or widen your price range and filters." />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
