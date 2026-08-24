import type { HistoryEntry, ShoppingItem } from '../types';

const DAY = 24 * 60 * 60 * 1000;
const now = Date.now();

export const SEED_SHOPPING_LIST: ShoppingItem[] = [
  { id: 'seed-1', name: 'Milk', quantity: 2, unit: 'bottles', category: 'dairy', estimatedPrice: 66, purchased: false, addedAt: now - DAY, addedVia: 'voice' },
  { id: 'seed-2', name: 'Apples', quantity: 5, unit: 'pieces', category: 'produce', estimatedPrice: 220, purchased: false, addedAt: now - DAY, addedVia: 'voice' },
  { id: 'seed-3', name: 'Bread', quantity: 1, unit: 'packets', category: 'bakery', estimatedPrice: 45, purchased: false, addedAt: now - DAY * 2, addedVia: 'manual' },
  { id: 'seed-4', name: 'Eggs', quantity: 1, unit: 'dozen', category: 'meat', estimatedPrice: 84, purchased: true, addedAt: now - DAY * 3, addedVia: 'voice' },
  { id: 'seed-5', name: 'Basmati Rice', quantity: 1, unit: 'kg', category: 'pantry', estimatedPrice: 124, purchased: false, addedAt: now - DAY * 2, addedVia: 'search' },
  { id: 'seed-6', name: 'Toothpaste', quantity: 1, unit: 'pieces', category: 'personal', estimatedPrice: 95, purchased: false, addedAt: now - DAY, addedVia: 'search' },
  { id: 'seed-7', name: 'Bananas', quantity: 1, unit: 'dozen', category: 'produce', estimatedPrice: 60, purchased: true, addedAt: now - DAY * 4, addedVia: 'voice' },
];

export const SEED_HISTORY: HistoryEntry[] = [
  { id: 'h-1', timestamp: now - DAY, type: 'command', transcript: 'Add 2 bottles of milk', intent: 'ADD', summary: 'Added Milk × 2 bottles', items: [{ name: 'Milk', quantity: 2, unit: 'bottles' }] },
  { id: 'h-2', timestamp: now - DAY, type: 'command', transcript: 'Add 5 apples', intent: 'ADD', summary: 'Added Apples × 5 pieces', items: [{ name: 'Apples', quantity: 5, unit: 'pieces' }] },
  { id: 'h-3', timestamp: now - DAY * 3, type: 'purchase', summary: 'Marked Eggs as purchased', items: [{ name: 'Eggs', quantity: 1, unit: 'dozen' }] },
  { id: 'h-4', timestamp: now - DAY * 4, type: 'purchase', summary: 'Marked Bananas as purchased', items: [{ name: 'Bananas', quantity: 1, unit: 'dozen' }] },
  { id: 'h-5', timestamp: now - DAY * 7, type: 'purchase', summary: 'Marked Milk as purchased', items: [{ name: 'Milk', quantity: 2, unit: 'bottles' }] },
  { id: 'h-6', timestamp: now - DAY * 8, type: 'command', transcript: 'Find organic apples under ₹300', intent: 'SEARCH', summary: 'Searched for organic apples under ₹300' },
  { id: 'h-7', timestamp: now - DAY * 14, type: 'purchase', summary: 'Marked Milk as purchased', items: [{ name: 'Milk', quantity: 2, unit: 'bottles' }] },
];
