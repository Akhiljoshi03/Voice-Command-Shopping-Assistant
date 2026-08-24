import { useState } from 'react';
import type { Product } from '../../types';
import { CATEGORY_META } from '../../types';
import { useShopping } from '../../context/ShoppingContext';
import { useToast } from '../../context/ToastContext';
import { formatCurrency } from '../../utils/format';
import { getSubstitutes } from '../../data/products';

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useShopping();
  const { showToast } = useToast();
  const [added, setAdded] = useState(false);
  const meta = CATEGORY_META[product.category];
  const substitutes = getSubstitutes(product);

  const handleAdd = () => {
    addItem({ name: product.name, quantity: 1, unit: 'pieces', category: product.category, estimatedPrice: product.price, via: 'search' });
    setAdded(true);
    showToast(`Added ${product.name} to your list`, 'success');
    window.setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="flex flex-col rounded-2xl border border-border bg-surface p-4 shadow-soft transition hover:shadow-lift">
      <div className="flex items-start justify-between gap-2">
        <span
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-2xl"
          style={{ background: `color-mix(in srgb, ${meta.color} 18%, white)` }}
          aria-hidden="true"
        >
          {meta.icon}
        </span>
        {product.organic && (
          <span className="rounded-full bg-primary-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-primary-600">
            Organic
          </span>
        )}
      </div>

      <div className="mt-3 flex-1">
        <p className="font-medium leading-snug text-ink">{product.name}</p>
        <p className="text-xs text-muted">{product.brand} · {product.size}</p>
        <div className="mt-1.5 flex items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-0.5 text-accent-600">
            {'★'.repeat(Math.round(product.rating))}
            <span className="text-muted">{product.rating.toFixed(1)}</span>
          </span>
          <span className={product.inStock ? 'text-primary-600' : 'text-warm-600'}>
            {product.inStock ? 'In stock' : 'Out of stock'}
          </span>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-2">
        <p className="font-mono text-lg font-semibold text-ink">{formatCurrency(product.price)}</p>
        <button
          type="button"
          onClick={handleAdd}
          disabled={!product.inStock}
          className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
            added ? 'bg-primary-600 text-white' : 'bg-ink text-canvas hover:bg-primary-600'
          } disabled:cursor-not-allowed disabled:opacity-40`}
        >
          {added ? 'Added ✓' : 'Add to list'}
        </button>
      </div>

      {substitutes.length > 0 && (
        <div className="mt-3 border-t border-border pt-2.5">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">Similar options</p>
          <p className="mt-1 text-xs text-ink-soft">{substitutes.map((s) => s.name).join(', ')}</p>
        </div>
      )}
    </div>
  );
}
