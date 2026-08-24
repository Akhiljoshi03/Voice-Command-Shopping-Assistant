import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { AppSettings, Category, HistoryEntry, ParsedIntent, ShoppingItem, Unit } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { SEED_HISTORY, SEED_SHOPPING_LIST } from '../data/seed';
import { categorizeProduct } from '../services/products/categorize';
import { findProductByName } from '../data/products';
import { generateId } from '../utils/id';
import { formatQuantity } from '../utils/format';

export interface CommandResult {
  success: boolean;
  message: string;
  detail?: string;
}

interface AddOptions {
  name: string;
  quantity?: number;
  unit?: Unit;
  category?: Category;
  estimatedPrice?: number;
  via?: ShoppingItem['addedVia'];
}

interface ShoppingContextValue {
  list: ShoppingItem[];
  history: HistoryEntry[];
  settings: AppSettings;
  addItem: (opts: AddOptions) => ShoppingItem;
  removeItem: (id: string) => void;
  removeItemByName: (name: string) => CommandResult;
  updateItemQuantity: (id: string, quantity: number, unit?: Unit) => void;
  updateItemByName: (name: string, quantity: number, unit?: Unit) => CommandResult;
  togglePurchased: (id: string) => void;
  clearPurchased: () => void;
  clearAll: () => void;
  undoLastRemoval: () => void;
  updateSettings: (patch: Partial<AppSettings>) => void;
  addHistoryEntry: (entry: Omit<HistoryEntry, 'id' | 'timestamp'>) => void;
  clearHistory: () => void;
  removeHistoryEntry: (id: string) => void;
  runVoiceCommand: (parsed: ParsedIntent) => CommandResult;
}

const ShoppingContext = createContext<ShoppingContextValue | null>(null);

const DEFAULT_SETTINGS: AppSettings = { language: 'en-IN', voiceFeedback: true, currency: 'INR' };

function estimatePrice(name: string, quantity: number): number {
  const product = findProductByName(name);
  const base = product?.price ?? 60;
  return Math.round(base * Math.max(quantity, 1) * 0.6 + base * 0.4);
}

export function ShoppingProvider({ children }: { children: ReactNode }) {
  const [list, setList] = useLocalStorage<ShoppingItem[]>('vsa.list', SEED_SHOPPING_LIST);
  const [history, setHistory] = useLocalStorage<HistoryEntry[]>('vsa.history', SEED_HISTORY);
  const [settings, setSettings] = useLocalStorage<AppSettings>('vsa.settings', DEFAULT_SETTINGS);
  const [lastRemoved, setLastRemoved] = useState<ShoppingItem | null>(null);

  const addHistoryEntry = useCallback(
    (entry: Omit<HistoryEntry, 'id' | 'timestamp'>) => {
      setHistory((prev) => [{ ...entry, id: generateId('hist'), timestamp: Date.now() }, ...prev].slice(0, 100));
    },
    [setHistory]
  );

  const addItem = useCallback(
    (opts: AddOptions): ShoppingItem => {
      const quantity = opts.quantity ?? 1;
      const unit: Unit = opts.unit ?? 'pieces';
      const category = opts.category ?? categorizeProduct(opts.name);
      const price = opts.estimatedPrice ?? estimatePrice(opts.name, quantity);

      // Compute the resulting item synchronously (from the current `list` closure) so callers
      // can rely on the return value immediately — React state updater callbacks are not
      // guaranteed to run before this function returns.
      const existing = list.find((i) => i.name.toLowerCase() === opts.name.toLowerCase() && !i.purchased);
      if (existing) {
        const merged: ShoppingItem = { ...existing, quantity: existing.quantity + quantity };
        setList((prev) => prev.map((i) => (i.id === existing.id ? merged : i)));
        return merged;
      }

      const item: ShoppingItem = {
        id: generateId('item'),
        name: opts.name,
        quantity,
        unit,
        category,
        estimatedPrice: price,
        purchased: false,
        addedAt: Date.now(),
        addedVia: opts.via ?? 'manual',
      };
      setList((prev) => [item, ...prev]);
      return item;
    },
    [list, setList]
  );

  const removeItem = useCallback(
    (id: string) => {
      const item = list.find((i) => i.id === id) ?? null;
      setLastRemoved(item);
      setList((prev) => prev.filter((i) => i.id !== id));
    },
    [list, setList]
  );

  const findByName = useCallback(
    (name: string) => {
      const q = name.trim().toLowerCase();
      return list.find((i) => i.name.toLowerCase() === q) ?? list.find((i) => i.name.toLowerCase().includes(q) || q.includes(i.name.toLowerCase()));
    },
    [list]
  );

  const removeItemByName = useCallback(
    (name: string): CommandResult => {
      const match = findByName(name);
      if (!match) {
        return { success: false, message: `I couldn't find "${name}" on your list.` };
      }
      removeItem(match.id);
      return { success: true, message: `Removed ${match.name} from your shopping list.` };
    },
    [findByName, removeItem]
  );

  const updateItemQuantity = useCallback(
    (id: string, quantity: number, unit?: Unit) => {
      setList((prev) => prev.map((i) => (i.id === id ? { ...i, quantity: Math.max(quantity, 0.1), unit: unit ?? i.unit } : i)));
    },
    [setList]
  );

  const updateItemByName = useCallback(
    (name: string, quantity: number, unit?: Unit): CommandResult => {
      const match = findByName(name);
      if (!match) {
        return { success: false, message: `I couldn't find "${name}" on your list to update.` };
      }
      updateItemQuantity(match.id, quantity, unit);
      return { success: true, message: `Updated ${match.name} to ${formatQuantity(quantity, unit ?? match.unit)}.` };
    },
    [findByName, updateItemQuantity]
  );

  const togglePurchased = useCallback(
    (id: string) => {
      const current = list.find((i) => i.id === id);
      if (!current) return;
      const nextPurchased = !current.purchased;
      setList((prev) => prev.map((i) => (i.id === id ? { ...i, purchased: nextPurchased } : i)));
      if (nextPurchased) {
        addHistoryEntry({
          type: 'purchase',
          summary: `Marked ${current.name} as purchased`,
          items: [{ name: current.name, quantity: current.quantity, unit: current.unit }],
        });
      }
    },
    [list, setList, addHistoryEntry]
  );

  const clearPurchased = useCallback(() => {
    setList((prev) => prev.filter((i) => !i.purchased));
  }, [setList]);

  const clearAll = useCallback(() => {
    setList([]);
  }, [setList]);

  const undoLastRemoval = useCallback(() => {
    if (!lastRemoved) return;
    setList((prev) => [lastRemoved, ...prev]);
    setLastRemoved(null);
  }, [lastRemoved, setList]);

  const updateSettings = useCallback(
    (patch: Partial<AppSettings>) => {
      setSettings((prev) => ({ ...prev, ...patch }));
    },
    [setSettings]
  );

  const clearHistory = useCallback(() => setHistory([]), [setHistory]);
  const removeHistoryEntry = useCallback((id: string) => setHistory((prev) => prev.filter((h) => h.id !== id)), [setHistory]);

  const runVoiceCommand = useCallback(
    (parsed: ParsedIntent): CommandResult => {
      const { intent, entities, rawText } = parsed;

      switch (intent) {
        case 'ADD': {
          if (!entities.product) {
            return { success: false, message: "I heard you, but I'm not sure what to add. Try naming an item." };
          }
          const quantity = entities.quantity ?? 1;
          const unit: Unit = entities.unit ?? 'pieces';
          const item = addItem({ name: entities.product, quantity, unit, category: entities.category, via: 'voice' });
          addHistoryEntry({
            type: 'command',
            transcript: rawText,
            intent,
            summary: `Added ${item.name} × ${formatQuantity(quantity, unit)}`,
            items: [{ name: item.name, quantity, unit }],
          });
          return { success: true, message: `Added ${formatQuantity(quantity, unit)} of ${item.name} to your list.` };
        }
        case 'REMOVE': {
          if (!entities.product) {
            return { success: false, message: "I heard you, but I'm not sure what to remove." };
          }
          const result = removeItemByName(entities.product);
          if (result.success) {
            addHistoryEntry({ type: 'command', transcript: rawText, intent, summary: result.message });
          }
          return result;
        }
        case 'UPDATE': {
          if (!entities.product || entities.quantity === undefined) {
            return { success: false, message: "Tell me the item and the new quantity, like 'change apples to 5'." };
          }
          const result = updateItemByName(entities.product, entities.quantity, entities.unit);
          if (result.success) {
            addHistoryEntry({ type: 'command', transcript: rawText, intent, summary: result.message });
          }
          return result;
        }
        case 'CLEAR': {
          const count = list.length;
          clearAll();
          addHistoryEntry({ type: 'command', transcript: rawText, intent, summary: 'Cleared the shopping list' });
          return { success: true, message: count ? 'Cleared your entire shopping list.' : 'Your list was already empty.' };
        }
        case 'VIEW': {
          const pending = list.filter((i) => !i.purchased);
          if (!pending.length) return { success: true, message: 'Your shopping list is empty.' };
          const names = pending.slice(0, 5).map((i) => i.name).join(', ');
          return { success: true, message: `You have ${pending.length} item${pending.length === 1 ? '' : 's'}: ${names}${pending.length > 5 ? '…' : ''}.` };
        }
        case 'SEARCH': {
          return { success: true, message: entities.product ? `Searching for ${entities.product}…` : 'Searching…', detail: 'search' };
        }
        default:
          return { success: false, message: "I couldn't understand that command. Try saying something like 'add milk'." };
      }
    },
    [addItem, removeItemByName, updateItemByName, clearAll, list, addHistoryEntry]
  );

  const value = useMemo<ShoppingContextValue>(
    () => ({
      list,
      history,
      settings,
      addItem,
      removeItem,
      removeItemByName,
      updateItemQuantity,
      updateItemByName,
      togglePurchased,
      clearPurchased,
      clearAll,
      undoLastRemoval,
      updateSettings,
      addHistoryEntry,
      clearHistory,
      removeHistoryEntry,
      runVoiceCommand,
    }),
    [
      list,
      history,
      settings,
      addItem,
      removeItem,
      removeItemByName,
      updateItemQuantity,
      updateItemByName,
      togglePurchased,
      clearPurchased,
      clearAll,
      undoLastRemoval,
      updateSettings,
      addHistoryEntry,
      clearHistory,
      removeHistoryEntry,
      runVoiceCommand,
    ]
  );

  return <ShoppingContext.Provider value={value}>{children}</ShoppingContext.Provider>;
}

export function useShopping(): ShoppingContextValue {
  const ctx = useContext(ShoppingContext);
  if (!ctx) throw new Error('useShopping must be used within a ShoppingProvider');
  return ctx;
}
