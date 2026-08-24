import { useMemo, useState } from 'react';
import { useShopping } from '../../context/ShoppingContext';
import { CATEGORY_META, type Category } from '../../types';
import { ShoppingListItem } from './ShoppingListItem';
import { EmptyState } from '../common/EmptyState';
import { formatCurrency } from '../../utils/format';

type Filter = 'all' | 'pending' | 'purchased';

export function ShoppingListView() {
  const { list, clearPurchased, clearAll } = useShopping();
  const [filter, setFilter] = useState<Filter>('all');

  const filtered = useMemo(() => {
    if (filter === 'pending') return list.filter((i) => !i.purchased);
    if (filter === 'purchased') return list.filter((i) => i.purchased);
    return list;
  }, [list, filter]);

  const grouped = useMemo(() => {
    const groups = new Map<Category, typeof filtered>();
    for (const item of filtered) {
      const arr = groups.get(item.category) ?? [];
      arr.push(item);
      groups.set(item.category, arr as typeof filtered);
    }
    return Array.from(groups.entries());
  }, [filtered]);

  const pendingCount = list.filter((i) => !i.purchased).length;
  const purchasedCount = list.length - pendingCount;
  const estimatedTotal = list.filter((i) => !i.purchased).reduce((sum, i) => sum + i.estimatedPrice, 0);

  return (
    <div className="space-y-5">
      <div className="rounded-3xl border border-border bg-surface p-5 shadow-soft">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">My Shopping List</p>
            <p className="font-display text-2xl text-ink">{pendingCount} item{pendingCount === 1 ? '' : 's'} to buy</p>
            <p className="text-sm text-muted">{formatCurrency(estimatedTotal)} estimated</p>
          </div>
          <div className="flex gap-2">
            {purchasedCount > 0 && (
              <button
                onClick={clearPurchased}
                className="rounded-full border border-border px-3.5 py-1.5 text-xs font-semibold text-ink-soft hover:bg-canvas-dim"
              >
                Clear purchased
              </button>
            )}
            {list.length > 0 && (
              <button
                onClick={() => {
                  if (confirm('Clear your entire shopping list?')) clearAll();
                }}
                className="rounded-full border border-warm-300 px-3.5 py-1.5 text-xs font-semibold text-warm-600 hover:bg-warm-50"
              >
                Clear all
              </button>
            )}
          </div>
        </div>

        <div className="mt-4 flex gap-1.5" role="tablist" aria-label="Filter shopping list">
          {(['all', 'pending', 'purchased'] as Filter[]).map((f) => (
            <button
              key={f}
              role="tab"
              aria-selected={filter === f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold capitalize transition ${
                filter === f ? 'bg-ink text-canvas' : 'bg-canvas-dim text-ink-soft hover:bg-primary-50'
              }`}
            >
              {f} {f === 'pending' ? `(${pendingCount})` : f === 'purchased' ? `(${purchasedCount})` : `(${list.length})`}
            </button>
          ))}
        </div>
      </div>

      {grouped.length === 0 ? (
        <EmptyState
          icon="🛒"
          title={filter === 'purchased' ? 'Nothing purchased yet' : 'Your list is empty'}
          description={
            filter === 'purchased'
              ? 'Items you mark as purchased will show up here.'
              : 'Try the mic and say something like "add milk" to get started.'
          }
        />
      ) : (
        <div className="space-y-6">
          {grouped.map(([category, items]) => (
            <section key={category} aria-label={CATEGORY_META[category].label}>
              <h3 className="mb-2 flex items-center gap-2 px-1 text-sm font-semibold text-ink-soft">
                <span aria-hidden="true">{CATEGORY_META[category].icon}</span>
                {CATEGORY_META[category].label}
                <span className="text-xs font-normal text-muted">({items.length})</span>
              </h3>
              <ul className="space-y-2">
                {items.map((item) => (
                  <ShoppingListItem key={item.id} item={item} />
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
