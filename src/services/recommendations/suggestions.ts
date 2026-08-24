import type { Category, HistoryEntry, ShoppingItem, Suggestion } from '../../types';
import { categorizeProduct } from '../products/categorize';

const DAY = 24 * 60 * 60 * 1000;

const SEASONAL_ITEMS: { name: string; category: Category; months: number[]; note: string }[] = [
  { name: 'Mangoes', category: 'produce', months: [2, 3, 4, 5, 6], note: 'Mangoes are in peak season right now.' },
  { name: 'Watermelon', category: 'produce', months: [2, 3, 4, 5], note: 'Watermelons are sweet and in season.' },
  { name: 'Oranges', category: 'produce', months: [10, 11, 0, 1], note: 'Winter citrus is at its best this month.' },
  { name: 'Spinach', category: 'produce', months: [10, 11, 0, 1, 2], note: 'Leafy greens are fresh and abundant this season.' },
  { name: 'Guava', category: 'produce', months: [9, 10, 11], note: 'Guavas are freshly harvested right now.' },
];

const PAIRINGS: Record<string, { product: string; category: Category; note: string }[]> = {
  pasta: [{ product: 'Pasta Sauce', category: 'pantry', note: 'Pairs perfectly with pasta.' }],
  bread: [{ product: 'Butter', category: 'dairy', note: 'A classic pairing with fresh bread.' }],
  chips: [{ product: 'Cold Drink', category: 'beverages', note: 'Great combo for snack time.' }],
  chicken: [{ product: 'Cooking Oil', category: 'pantry', note: 'You may be low on oil for cooking.' }],
  rice: [{ product: 'Toor Dal', category: 'pantry', note: 'A staple pairing with rice.' }],
  tea: [{ product: 'Sugar', category: 'pantry', note: 'Don\u2019t run out while making chai.' }],
  coffee: [{ product: 'Milk', category: 'dairy', note: 'Keep milk stocked for your coffee.' }],
};

const SUBSTITUTE_MAP: Record<string, string[]> = {
  milk: ['Almond Milk', 'Soy Milk', 'Oat Milk'],
  'coca-cola': ['Pepsi', 'Coke Zero'],
  cola: ['Pepsi', 'Coke Zero'],
  bread: ['Brown Bread', 'Multigrain Bread'],
  rice: ['Brown Rice', 'Quinoa'],
  sugar: ['Jaggery', 'Stevia'],
};

/** Estimates purchase cadence per product from purchase-type history entries. */
function estimateRestockDays(history: HistoryEntry[], productName: string): number | null {
  const purchases = history
    .filter((h) => h.type === 'purchase' && h.items?.some((i) => i.name.toLowerCase() === productName.toLowerCase()))
    .sort((a, b) => a.timestamp - b.timestamp);
  if (purchases.length < 2) return null;
  const gaps: number[] = [];
  for (let i = 1; i < purchases.length; i++) {
    gaps.push((purchases[i].timestamp - purchases[i - 1].timestamp) / DAY);
  }
  return Math.round(gaps.reduce((a, b) => a + b, 0) / gaps.length);
}

export function generateSuggestions(list: ShoppingItem[], history: HistoryEntry[]): Suggestion[] {
  const suggestions: Suggestion[] = [];
  const listNames = new Set(list.filter((i) => !i.purchased).map((i) => i.name.toLowerCase()));

  // 1. Restock suggestions based on historical purchase cadence
  const purchasedNames = new Set(
    history.filter((h) => h.type === 'purchase').flatMap((h) => h.items?.map((i) => i.name) ?? [])
  );
  for (const name of purchasedNames) {
    if (listNames.has(name.toLowerCase())) continue;
    const cadence = estimateRestockDays(history, name);
    if (!cadence) continue;
    const lastPurchase = [...history]
      .filter((h) => h.type === 'purchase' && h.items?.some((i) => i.name === name))
      .sort((a, b) => b.timestamp - a.timestamp)[0];
    if (!lastPurchase) continue;
    const daysSince = Math.round((Date.now() - lastPurchase.timestamp) / DAY);
    if (daysSince >= cadence - 2) {
      suggestions.push({
        id: `restock-${name}`,
        kind: 'restock',
        title: `Time to restock ${name}`,
        description: `You usually buy ${name} every ${cadence} day${cadence === 1 ? '' : 's'}. Add it to your list?`,
        productName: name,
        category: categorizeProduct(name),
        quantity: 1,
        unit: 'pieces',
      });
    }
  }

  // 2. Frequently purchased items (3+ times) not currently on the list
  const frequency = new Map<string, number>();
  for (const h of history) {
    if (h.type !== 'purchase') continue;
    for (const item of h.items ?? []) {
      frequency.set(item.name, (frequency.get(item.name) ?? 0) + 1);
    }
  }
  for (const [name, count] of frequency) {
    if (count >= 2 && !listNames.has(name.toLowerCase()) && !suggestions.some((s) => s.productName === name)) {
      suggestions.push({
        id: `frequent-${name}`,
        kind: 'frequent',
        title: `You frequently buy ${name}`,
        description: `${name} has appeared in your purchases ${count} times recently.`,
        productName: name,
        category: categorizeProduct(name),
        quantity: 1,
        unit: 'pieces',
      });
    }
  }

  // 3. Seasonal recommendations
  const currentMonth = new Date().getMonth();
  for (const seasonal of SEASONAL_ITEMS) {
    if (seasonal.months.includes(currentMonth) && !listNames.has(seasonal.name.toLowerCase())) {
      suggestions.push({
        id: `seasonal-${seasonal.name}`,
        kind: 'seasonal',
        title: `${seasonal.name} are in season`,
        description: seasonal.note,
        productName: seasonal.name,
        category: seasonal.category,
        quantity: 1,
        unit: 'kg',
      });
    }
  }

  // 4. Pairing suggestions based on current (unpurchased) list contents
  for (const item of list) {
    if (item.purchased) continue;
    const key = item.name.toLowerCase();
    const pairs = PAIRINGS[key];
    if (!pairs) continue;
    for (const pair of pairs) {
      if (listNames.has(pair.product.toLowerCase())) continue;
      suggestions.push({
        id: `pairing-${key}-${pair.product}`,
        kind: 'pairing',
        title: `Add ${pair.product}?`,
        description: `You're shopping for ${item.name}. ${pair.note}`,
        productName: pair.product,
        category: pair.category,
        quantity: 1,
        unit: 'pieces',
        relatedTo: item.name,
      });
    }
  }

  return suggestions.slice(0, 8);
}

export function generateSubstitutes(productName: string): string[] {
  return SUBSTITUTE_MAP[productName.toLowerCase()] ?? [];
}
