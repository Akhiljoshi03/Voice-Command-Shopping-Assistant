import type { ShoppingItem } from '../../types';
import { CATEGORY_META } from '../../types';
import { useShopping } from '../../context/ShoppingContext';
import { useToast } from '../../context/ToastContext';
import { formatCurrency } from '../../utils/format';

const STEP_BY_UNIT: Record<string, number> = { kg: 0.5, litre: 0.5, g: 50, ml: 50 };

export function ShoppingListItem({ item }: { item: ShoppingItem }) {
  const { togglePurchased, updateItemQuantity, removeItem, undoLastRemoval } = useShopping();
  const { showToast } = useToast();
  const meta = CATEGORY_META[item.category];
  const step = STEP_BY_UNIT[item.unit] ?? 1;

  const handleRemove = () => {
    removeItem(item.id);
    showToast(`Removed ${item.name}`, 'info', { label: 'Undo', onClick: undoLastRemoval });
  };

  const adjustQuantity = (delta: number) => {
    const next = Math.round((item.quantity + delta) * 100) / 100;
    if (next <= 0) {
      handleRemove();
      return;
    }
    updateItemQuantity(item.id, next);
  };

  return (
    <li
      className={`group flex items-center gap-3 rounded-2xl border border-border bg-surface p-3.5 shadow-soft transition sm:p-4 ${
        item.purchased ? 'opacity-60' : ''
      }`}
    >
      <button
        type="button"
        role="checkbox"
        aria-checked={item.purchased}
        aria-label={item.purchased ? `Mark ${item.name} as not purchased` : `Mark ${item.name} as purchased`}
        onClick={() => togglePurchased(item.id)}
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition ${
          item.purchased ? 'border-primary-500 bg-primary-500 text-white' : 'border-border text-transparent hover:border-primary-400'
        }`}
      >
        ✓
      </button>

      <span
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl"
        style={{ background: `color-mix(in srgb, ${meta.color} 18%, white)` }}
        aria-hidden="true"
      >
        {meta.icon}
      </span>

      <div className="min-w-0 flex-1">
        <p className={`truncate font-medium text-ink ${item.purchased ? 'line-through' : ''}`}>{item.name}</p>
        <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted">
          <span>{meta.label}</span>
          <span aria-hidden="true">·</span>
          <span>{formatCurrency(item.estimatedPrice)}</span>
          {item.addedVia === 'voice' && (
            <>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1">🎙️ voice</span>
            </>
          )}
        </div>
      </div>

      {!item.purchased && (
        <div className="flex shrink-0 items-center gap-1 rounded-full border border-border bg-canvas px-1.5 py-1">
          <button
            type="button"
            aria-label={`Decrease quantity of ${item.name}`}
            onClick={() => adjustQuantity(-step)}
            className="flex h-6 w-6 items-center justify-center rounded-full text-ink-soft hover:bg-canvas-dim"
          >
            −
          </button>
          <span className="min-w-[2.5rem] text-center font-mono text-sm text-ink">
            {Number.isInteger(item.quantity) ? item.quantity : item.quantity.toFixed(2)}
            <span className="ml-1 text-[10px] text-muted">{item.unit}</span>
          </span>
          <button
            type="button"
            aria-label={`Increase quantity of ${item.name}`}
            onClick={() => adjustQuantity(step)}
            className="flex h-6 w-6 items-center justify-center rounded-full text-ink-soft hover:bg-canvas-dim"
          >
            +
          </button>
        </div>
      )}

      <button
        type="button"
        aria-label={`Remove ${item.name} from list`}
        onClick={handleRemove}
        className="shrink-0 rounded-full p-2 text-muted opacity-0 transition hover:bg-warm-50 hover:text-warm-600 group-hover:opacity-100 focus-visible:opacity-100"
      >
        ✕
      </button>
    </li>
  );
}
