import { CATEGORY_META, type Category } from '../../types';
import type { SearchFilters } from '../../services/products/search';

interface Props {
  filters: SearchFilters;
  onChange: (filters: SearchFilters) => void;
}

const CATEGORIES = Object.keys(CATEGORY_META) as Category[];

export function SearchFiltersBar({ filters, onChange }: Props) {
  return (
    <div className="space-y-3 rounded-2xl border border-border bg-surface p-4 shadow-soft">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onChange({ ...filters, category: undefined })}
          className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
            !filters.category ? 'bg-ink text-canvas' : 'bg-canvas-dim text-ink-soft hover:bg-primary-50'
          }`}
        >
          All
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => onChange({ ...filters, category: filters.category === cat ? undefined : cat })}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
              filters.category === cat ? 'bg-ink text-canvas' : 'bg-canvas-dim text-ink-soft hover:bg-primary-50'
            }`}
          >
            {CATEGORY_META[cat].icon} {CATEGORY_META[cat].label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm text-ink-soft">
          <span className="w-28 shrink-0 text-xs font-medium uppercase tracking-wide text-muted">
            Price: ₹{filters.minPrice ?? 0} — ₹{filters.maxPrice ?? 1000}
          </span>
          <input
            type="range"
            min={0}
            max={1000}
            step={10}
            value={filters.maxPrice ?? 1000}
            onChange={(e) => onChange({ ...filters, maxPrice: Number(e.target.value) })}
            className="w-40 accent-primary-500"
            aria-label="Maximum price"
          />
        </label>

        <label className="flex items-center gap-1.5 text-sm text-ink-soft">
          <input
            type="checkbox"
            checked={filters.organicOnly ?? false}
            onChange={(e) => onChange({ ...filters, organicOnly: e.target.checked })}
            className="h-4 w-4 accent-primary-500"
          />
          Organic only
        </label>

        {(filters.category || filters.maxPrice !== undefined || filters.organicOnly || filters.brand) && (
          <button
            onClick={() => onChange({ query: filters.query })}
            className="ml-auto text-xs font-semibold text-warm-600 hover:underline"
          >
            Reset filters
          </button>
        )}
      </div>
    </div>
  );
}
