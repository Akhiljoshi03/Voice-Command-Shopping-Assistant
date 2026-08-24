import { useMemo, useState } from 'react';
import { useShopping } from '../../context/ShoppingContext';
import { generateSuggestions } from '../../services/recommendations/suggestions';
import { SuggestionCard } from './SuggestionCard';
import { EmptyState } from '../common/EmptyState';

export function SuggestionsList({ limit }: { limit?: number }) {
  const { list, history } = useShopping();
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const suggestions = useMemo(() => {
    const all = generateSuggestions(list, history).filter((s) => !dismissed.has(s.id));
    return limit ? all.slice(0, limit) : all;
  }, [list, history, dismissed, limit]);

  const handleDismiss = (id: string) => setDismissed((prev) => new Set(prev).add(id));

  if (suggestions.length === 0) {
    return (
      <EmptyState
        icon="✨"
        title="No suggestions right now"
        description="Add a few items and check off some purchases — smart suggestions will appear here as we learn your habits."
      />
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {suggestions.map((s) => (
        <SuggestionCard key={s.id} suggestion={s} onDismiss={handleDismiss} />
      ))}
    </div>
  );
}
