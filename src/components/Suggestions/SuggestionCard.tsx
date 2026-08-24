import { useState } from 'react';
import type { Suggestion } from '../../types';
import { CATEGORY_META } from '../../types';
import { useShopping } from '../../context/ShoppingContext';
import { useToast } from '../../context/ToastContext';

const KIND_LABEL: Record<Suggestion['kind'], string> = {
  restock: 'Time to restock',
  frequent: 'Frequently bought',
  seasonal: 'In season',
  pairing: 'Pairs well',
  substitute: 'Alternative',
};

export function SuggestionCard({ suggestion, onDismiss }: { suggestion: Suggestion; onDismiss: (id: string) => void }) {
  const { addItem } = useShopping();
  const { showToast } = useToast();
  const [added, setAdded] = useState(false);
  const meta = CATEGORY_META[suggestion.category];

  const handleAdd = () => {
    addItem({
      name: suggestion.productName,
      quantity: suggestion.quantity ?? 1,
      unit: suggestion.unit ?? 'pieces',
      category: suggestion.category,
      via: 'suggestion',
    });
    setAdded(true);
    showToast(`Added ${suggestion.productName} to your list`, 'success');
    window.setTimeout(() => onDismiss(suggestion.id), 900);
  };

  return (
    <div className="animate-rise-in flex items-start gap-3 rounded-2xl border border-border bg-surface p-4 shadow-soft">
      <span
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl"
        style={{ background: `color-mix(in srgb, ${meta.color} 18%, white)` }}
        aria-hidden="true"
      >
        {meta.icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-accent-600">{KIND_LABEL[suggestion.kind]}</p>
        <p className="mt-0.5 text-sm font-medium text-ink">{suggestion.title}</p>
        <p className="mt-0.5 text-xs text-muted">{suggestion.description}</p>
        <div className="mt-2.5 flex gap-2">
          <button
            onClick={handleAdd}
            disabled={added}
            className="rounded-full bg-primary-500 px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-primary-600 disabled:opacity-60"
          >
            {added ? 'Added ✓' : 'Add to list'}
          </button>
          <button
            onClick={() => onDismiss(suggestion.id)}
            className="rounded-full px-3.5 py-1.5 text-xs font-semibold text-muted hover:bg-canvas-dim"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
