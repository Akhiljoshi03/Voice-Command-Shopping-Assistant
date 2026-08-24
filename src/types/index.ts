export type Category =
  | 'produce'
  | 'dairy'
  | 'meat'
  | 'bakery'
  | 'pantry'
  | 'snacks'
  | 'beverages'
  | 'personal'
  | 'household'
  | 'other';

export const CATEGORY_META: Record<Category, { label: string; icon: string; color: string }> = {
  produce: { label: 'Produce', icon: '🥬', color: 'var(--color-produce)' },
  dairy: { label: 'Dairy', icon: '🥛', color: 'var(--color-dairy)' },
  meat: { label: 'Meat & Fish', icon: '🥩', color: 'var(--color-meat)' },
  bakery: { label: 'Bakery', icon: '🍞', color: 'var(--color-bakery)' },
  pantry: { label: 'Pantry', icon: '🥫', color: 'var(--color-pantry)' },
  snacks: { label: 'Snacks', icon: '🍫', color: 'var(--color-snacks)' },
  beverages: { label: 'Beverages', icon: '🥤', color: 'var(--color-beverages)' },
  personal: { label: 'Personal Care', icon: '🧴', color: 'var(--color-personal)' },
  household: { label: 'Household', icon: '🧹', color: 'var(--color-household)' },
  other: { label: 'Other', icon: '📦', color: 'var(--color-other)' },
};

export type Unit =
  | 'pieces'
  | 'bottles'
  | 'packets'
  | 'kg'
  | 'g'
  | 'litre'
  | 'ml'
  | 'dozen'
  | 'loaf'
  | 'can'
  | 'box';

export const UNIT_LABEL: Record<Unit, { singular: string; plural: string }> = {
  pieces: { singular: 'piece', plural: 'pieces' },
  bottles: { singular: 'bottle', plural: 'bottles' },
  packets: { singular: 'packet', plural: 'packets' },
  kg: { singular: 'kg', plural: 'kg' },
  g: { singular: 'g', plural: 'g' },
  litre: { singular: 'litre', plural: 'litres' },
  ml: { singular: 'ml', plural: 'ml' },
  dozen: { singular: 'dozen', plural: 'dozen' },
  loaf: { singular: 'loaf', plural: 'loaves' },
  can: { singular: 'can', plural: 'cans' },
  box: { singular: 'box', plural: 'boxes' },
};

export interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  unit: Unit;
  category: Category;
  estimatedPrice: number;
  purchased: boolean;
  addedAt: number;
  addedVia: 'voice' | 'manual' | 'suggestion' | 'search';
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: Category;
  size: string;
  price: number;
  rating: number;
  inStock: boolean;
  organic?: boolean;
  tags: string[];
  substitutes?: string[];
}

export type IntentType = 'ADD' | 'REMOVE' | 'UPDATE' | 'SEARCH' | 'CLEAR' | 'VIEW' | 'UNKNOWN';

export interface ParsedEntities {
  product?: string;
  quantity?: number;
  unit?: Unit;
  brand?: string;
  category?: Category;
  maxPrice?: number;
  minPrice?: number;
  preferences?: string[];
}

export interface ParsedIntent {
  intent: IntentType;
  entities: ParsedEntities;
  rawText: string;
  confidence: number;
  language: LanguageCode;
}

export type LanguageCode = 'en-IN' | 'hi-IN' | 'hi-en';

export interface LanguageOption {
  code: LanguageCode;
  label: string;
  speechLang: string;
  nativeLabel: string;
}

export interface HistoryEntry {
  id: string;
  timestamp: number;
  type: 'command' | 'purchase';
  transcript?: string;
  intent?: IntentType;
  summary: string;
  items?: { name: string; quantity: number; unit: Unit }[];
}

export interface Suggestion {
  id: string;
  kind: 'restock' | 'frequent' | 'seasonal' | 'pairing' | 'substitute';
  title: string;
  description: string;
  productName: string;
  category: Category;
  quantity?: number;
  unit?: Unit;
  relatedTo?: string;
}

export type VoiceState = 'idle' | 'listening' | 'processing' | 'success' | 'error';

export interface AppSettings {
  language: LanguageCode;
  voiceFeedback: boolean;
  currency: string;
}
