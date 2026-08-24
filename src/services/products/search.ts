import type { ParsedEntities, Product } from '../../types';
import { PRODUCTS } from '../../data/products';

export interface SearchFilters {
  query?: string;
  brand?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  organicOnly?: boolean;
}

export function filtersFromEntities(entities: ParsedEntities): SearchFilters {
  return {
    query: entities.product,
    brand: entities.brand,
    category: entities.category,
    minPrice: entities.minPrice,
    maxPrice: entities.maxPrice,
    organicOnly: entities.preferences?.includes('organic'),
  };
}

export function searchProducts(filters: SearchFilters): Product[] {
  const q = filters.query?.trim().toLowerCase();

  return PRODUCTS.filter((p) => {
    if (q) {
      const haystack = `${p.name} ${p.brand} ${p.tags.join(' ')}`.toLowerCase();
      const matches = haystack.includes(q) || q.split(/\s+/).some((word) => word.length > 2 && haystack.includes(word));
      if (!matches) return false;
    }
    if (filters.brand && !p.brand.toLowerCase().includes(filters.brand.toLowerCase())) return false;
    if (filters.category && p.category !== filters.category) return false;
    if (filters.organicOnly && !p.organic) return false;
    if (filters.minPrice !== undefined && p.price < filters.minPrice) return false;
    if (filters.maxPrice !== undefined && p.price > filters.maxPrice) return false;
    return true;
  }).sort((a, b) => b.rating - a.rating);
}
