import type { Category } from '../../types';
import { findProductByName } from '../../data/products';

const KEYWORD_MAP: { category: Category; keywords: string[] }[] = [
  { category: 'dairy', keywords: ['milk', 'curd', 'yogurt', 'yoghurt', 'paneer', 'butter', 'cheese', 'cream', 'ghee', 'lassi'] },
  { category: 'produce', keywords: ['apple', 'banana', 'mango', 'tomato', 'onion', 'potato', 'vegetable', 'veggie', 'spinach', 'fruit', 'grape', 'carrot', 'orange', 'lemon', 'garlic', 'ginger', 'cucumber', 'capsicum', 'cauliflower', 'peas'] },
  { category: 'meat', keywords: ['chicken', 'egg', 'fish', 'mutton', 'prawn', 'meat', 'beef', 'pork', 'seafood'] },
  { category: 'bakery', keywords: ['bread', 'bun', 'pav', 'cake', 'pastry', 'croissant', 'bagel', 'rusk'] },
  { category: 'pantry', keywords: ['rice', 'pasta', 'atta', 'flour', 'sugar', 'salt', 'oil', 'dal', 'lentil', 'spice', 'masala', 'sauce', 'ketchup', 'jam', 'honey', 'cereal', 'oats', 'besan'] },
  { category: 'snacks', keywords: ['chips', 'biscuit', 'namkeen', 'bhujia', 'chocolate', 'candy', 'cookie', 'wafer', 'popcorn', 'nachos'] },
  { category: 'beverages', keywords: ['water', 'cola', 'pepsi', 'juice', 'tea', 'coffee', 'soda', 'drink', 'beer', 'wine', 'soft drink'] },
  { category: 'personal', keywords: ['toothpaste', 'shampoo', 'soap', 'facewash', 'lotion', 'deodorant', 'razor', 'sanitizer', 'toothbrush', 'conditioner'] },
  { category: 'household', keywords: ['detergent', 'dishwash', 'tissue', 'trash bag', 'garbage bag', 'cleaner', 'mop', 'sponge', 'napkin', 'phenyl'] },
];

/** Guesses a product category from its name using catalog lookup first, then keyword heuristics. */
export function categorizeProduct(name: string): Category {
  const catalogMatch = findProductByName(name);
  if (catalogMatch) return catalogMatch.category;

  const lower = name.toLowerCase();
  for (const { category, keywords } of KEYWORD_MAP) {
    if (keywords.some((kw) => lower.includes(kw))) return category;
  }
  return 'other';
}
