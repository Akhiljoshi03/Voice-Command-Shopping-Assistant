import { useState } from 'react';
import { ShoppingListView } from '../components/ShoppingList/ShoppingListView';
import { useShopping } from '../context/ShoppingContext';
import { CATEGORY_META, type Category, type Unit } from '../types';

const CATEGORIES = Object.keys(CATEGORY_META) as Category[];

export function ShoppingListPage() {
  const { addItem } = useShopping();
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState<Unit>('pieces');
  const [category, setCategory] = useState<Category>('other');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    addItem({ name: name.trim(), quantity, unit, category, via: 'manual' });
    setName('');
    setQuantity(1);
    setShowAdd(false);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-ink">Shopping List</h1>
        <button
          onClick={() => setShowAdd((v) => !v)}
          className="rounded-full bg-primary-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-600"
        >
          {showAdd ? 'Cancel' : '+ Add item'}
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleAdd} className="animate-fade-scale grid gap-3 rounded-2xl border border-border bg-surface p-4 shadow-soft sm:grid-cols-2">
          <label className="sm:col-span-2">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">Item name</span>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Tomatoes"
              className="w-full rounded-xl border border-border bg-canvas px-3.5 py-2.5 text-sm focus:border-primary-500 focus:bg-surface"
            />
          </label>
          <label>
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">Quantity</span>
            <input
              type="number"
              min={0.5}
              step={0.5}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full rounded-xl border border-border bg-canvas px-3.5 py-2.5 text-sm focus:border-primary-500 focus:bg-surface"
            />
          </label>
          <label>
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">Unit</span>
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value as Unit)}
              className="w-full rounded-xl border border-border bg-canvas px-3.5 py-2.5 text-sm focus:border-primary-500 focus:bg-surface"
            >
              {(['pieces', 'bottles', 'packets', 'kg', 'g', 'litre', 'ml', 'dozen', 'loaf', 'can', 'box'] as Unit[]).map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </label>
          <label className="sm:col-span-2">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">Category</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="w-full rounded-xl border border-border bg-canvas px-3.5 py-2.5 text-sm focus:border-primary-500 focus:bg-surface"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{CATEGORY_META[c].icon} {CATEGORY_META[c].label}</option>
              ))}
            </select>
          </label>
          <button
            type="submit"
            className="sm:col-span-2 rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-canvas transition hover:bg-primary-600"
          >
            Add to list
          </button>
        </form>
      )}

      <ShoppingListView />
    </div>
  );
}
