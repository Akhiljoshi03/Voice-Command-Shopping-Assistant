import type { Product } from '../types';

export const PRODUCTS: Product[] = [
  // Dairy
  { id: 'p-milk-amul', name: 'Milk', brand: 'Amul', category: 'dairy', size: '1 litre', price: 66, rating: 4.6, inStock: true, tags: ['fresh', 'toned'], substitutes: ['p-milk-almond', 'p-milk-soy', 'p-milk-oat'] },
  { id: 'p-milk-mother-dairy', name: 'Milk', brand: 'Mother Dairy', category: 'dairy', size: '500 ml', price: 34, rating: 4.4, inStock: true, tags: ['fresh'], substitutes: ['p-milk-almond'] },
  { id: 'p-milk-almond', name: 'Almond Milk', brand: 'So Good', category: 'dairy', size: '1 litre', price: 249, rating: 4.3, inStock: true, tags: ['plant-based', 'lactose-free'] },
  { id: 'p-milk-soy', name: 'Soy Milk', brand: 'Sofit', category: 'dairy', size: '1 litre', price: 179, rating: 4.1, inStock: true, tags: ['plant-based'] },
  { id: 'p-milk-oat', name: 'Oat Milk', brand: 'Epigamia', category: 'dairy', size: '1 litre', price: 229, rating: 4.2, inStock: true, tags: ['plant-based'] },
  { id: 'p-curd', name: 'Curd', brand: 'Amul', category: 'dairy', size: '400 g', price: 40, rating: 4.5, inStock: true, tags: ['fresh'] },
  { id: 'p-paneer', name: 'Paneer', brand: 'Mother Dairy', category: 'dairy', size: '200 g', price: 90, rating: 4.4, inStock: true, tags: ['fresh'] },
  { id: 'p-butter', name: 'Butter', brand: 'Amul', category: 'dairy', size: '500 g', price: 265, rating: 4.7, inStock: true, tags: [] },
  { id: 'p-cheese', name: 'Cheese Slices', brand: 'Amul', category: 'dairy', size: '200 g', price: 120, rating: 4.3, inStock: true, tags: [] },

  // Produce
  { id: 'p-apple-reg', name: 'Apples', brand: 'Local Farm', category: 'produce', size: '1 kg', price: 220, rating: 4.2, inStock: true, tags: [] },
  { id: 'p-apple-organic', name: 'Apples', brand: 'Organic India', category: 'produce', size: '1 kg', price: 289, rating: 4.6, inStock: true, organic: true, tags: ['organic', 'premium'] },
  { id: 'p-apple-organic-shimla', name: 'Shimla Apples', brand: '24 Mantra Organic', category: 'produce', size: '1 kg', price: 310, rating: 4.7, inStock: true, organic: true, tags: ['organic'] },
  { id: 'p-banana', name: 'Bananas', brand: 'Local Farm', category: 'produce', size: '1 dozen', price: 60, rating: 4.4, inStock: true, tags: [] },
  { id: 'p-tomato', name: 'Tomatoes', brand: 'Local Farm', category: 'produce', size: '1 kg', price: 40, rating: 4.0, inStock: true, tags: [] },
  { id: 'p-onion', name: 'Onions', brand: 'Local Farm', category: 'produce', size: '1 kg', price: 35, rating: 4.1, inStock: true, tags: [] },
  { id: 'p-potato', name: 'Potatoes', brand: 'Local Farm', category: 'produce', size: '1 kg', price: 30, rating: 4.1, inStock: true, tags: [] },
  { id: 'p-mango', name: 'Mangoes', brand: 'Local Farm', category: 'produce', size: '1 kg', price: 150, rating: 4.8, inStock: true, tags: ['seasonal', 'summer'] },
  { id: 'p-mixed-veg', name: 'Mixed Vegetables', brand: 'FreshCo', category: 'produce', size: '1 kg', price: 85, rating: 4.2, inStock: true, tags: [] },
  { id: 'p-spinach', name: 'Spinach', brand: 'Local Farm', category: 'produce', size: '250 g', price: 25, rating: 4.0, inStock: true, tags: [] },

  // Bakery
  { id: 'p-bread-white', name: 'Bread', brand: 'Britannia', category: 'bakery', size: '400 g', price: 45, rating: 4.3, inStock: true, tags: [] },
  { id: 'p-bread-brown', name: 'Brown Bread', brand: "Harvest Gold", category: 'bakery', size: '400 g', price: 55, rating: 4.4, inStock: true, tags: ['whole-wheat'] },
  { id: 'p-bread-multigrain', name: 'Multigrain Bread', brand: 'Britannia', category: 'bakery', size: '400 g', price: 60, rating: 4.5, inStock: true, tags: ['healthy'] },
  { id: 'p-buns', name: 'Burger Buns', brand: 'Britannia', category: 'bakery', size: 'Pack of 6', price: 50, rating: 4.1, inStock: true, tags: [] },

  // Pantry
  { id: 'p-rice-basmati', name: 'Basmati Rice', brand: 'India Gate', category: 'pantry', size: '5 kg', price: 620, rating: 4.6, inStock: true, tags: [] },
  { id: 'p-rice-organic', name: 'Basmati Rice', brand: '24 Mantra Organic', category: 'pantry', size: '5 kg', price: 780, rating: 4.5, inStock: true, organic: true, tags: ['organic'] },
  { id: 'p-pasta', name: 'Pasta', brand: 'Bambino', category: 'pantry', size: '500 g', price: 55, rating: 4.2, inStock: true, tags: [] },
  { id: 'p-pasta-sauce', name: 'Pasta Sauce', brand: "Ching's", category: 'pantry', size: '350 g', price: 99, rating: 4.1, inStock: true, tags: ['pairs-with-pasta'] },
  { id: 'p-atta', name: 'Wheat Flour (Atta)', brand: 'Aashirvaad', category: 'pantry', size: '5 kg', price: 260, rating: 4.7, inStock: true, tags: [] },
  { id: 'p-sugar', name: 'Sugar', brand: 'Madhur', category: 'pantry', size: '1 kg', price: 48, rating: 4.3, inStock: true, tags: [] },
  { id: 'p-salt', name: 'Salt', brand: 'Tata', category: 'pantry', size: '1 kg', price: 25, rating: 4.5, inStock: true, tags: [] },
  { id: 'p-oil', name: 'Sunflower Oil', brand: 'Fortune', category: 'pantry', size: '1 litre', price: 145, rating: 4.4, inStock: true, tags: [] },
  { id: 'p-dal', name: 'Toor Dal', brand: 'Tata Sampann', category: 'pantry', size: '1 kg', price: 165, rating: 4.5, inStock: true, tags: [] },

  // Meat
  { id: 'p-chicken', name: 'Chicken Breast', brand: 'Licious', category: 'meat', size: '500 g', price: 220, rating: 4.5, inStock: true, tags: ['fresh'] },
  { id: 'p-eggs', name: 'Eggs', brand: 'Farm Fresh', category: 'meat', size: '1 dozen', price: 84, rating: 4.6, inStock: true, tags: [] },
  { id: 'p-fish', name: 'Rohu Fish', brand: 'Licious', category: 'meat', size: '500 g', price: 210, rating: 4.3, inStock: true, tags: ['fresh'] },

  // Snacks
  { id: 'p-chips-lays', name: 'Potato Chips', brand: "Lay's", category: 'snacks', size: '52 g', price: 20, rating: 4.4, inStock: true, tags: [] },
  { id: 'p-biscuits', name: 'Biscuits', brand: 'Parle-G', category: 'snacks', size: '200 g', price: 20, rating: 4.6, inStock: true, tags: [] },
  { id: 'p-namkeen', name: 'Bhujia', brand: 'Haldiram\'s', category: 'snacks', size: '200 g', price: 55, rating: 4.5, inStock: true, tags: [] },
  { id: 'p-chocolate', name: 'Chocolate', brand: 'Cadbury Dairy Milk', category: 'snacks', size: '55 g', price: 45, rating: 4.7, inStock: true, tags: [] },

  // Beverages
  { id: 'p-water', name: 'Packaged Drinking Water', brand: 'Bisleri', category: 'beverages', size: '1 litre', price: 20, rating: 4.5, inStock: true, tags: [] },
  { id: 'p-cola', name: 'Coca-Cola', brand: 'Coca-Cola', category: 'beverages', size: '750 ml', price: 40, rating: 4.2, inStock: true, tags: [], substitutes: ['p-pepsi', 'p-coke-zero'] },
  { id: 'p-pepsi', name: 'Pepsi', brand: 'Pepsi', category: 'beverages', size: '750 ml', price: 40, rating: 4.1, inStock: true, tags: [] },
  { id: 'p-coke-zero', name: 'Coke Zero', brand: 'Coca-Cola', category: 'beverages', size: '750 ml', price: 42, rating: 4.0, inStock: true, tags: ['sugar-free'] },
  { id: 'p-juice', name: 'Orange Juice', brand: 'Real', category: 'beverages', size: '1 litre', price: 120, rating: 4.3, inStock: true, tags: [] },
  { id: 'p-tea', name: 'Tea', brand: 'Tata Tea Gold', category: 'beverages', size: '500 g', price: 260, rating: 4.6, inStock: true, tags: [] },
  { id: 'p-coffee', name: 'Instant Coffee', brand: 'Nescafé', category: 'beverages', size: '100 g', price: 285, rating: 4.5, inStock: true, tags: [] },

  // Personal care
  { id: 'p-toothpaste-colgate', name: 'Toothpaste', brand: 'Colgate', category: 'personal', size: '150 g', price: 95, rating: 4.5, inStock: true, tags: [] },
  { id: 'p-toothpaste-sensodyne', name: 'Toothpaste', brand: 'Sensodyne', category: 'personal', size: '100 g', price: 210, rating: 4.6, inStock: true, tags: ['sensitive'] },
  { id: 'p-shampoo-dove', name: 'Shampoo', brand: 'Dove', category: 'personal', size: '340 ml', price: 299, rating: 4.4, inStock: true, tags: [] },
  { id: 'p-shampoo-head-shoulders', name: 'Shampoo', brand: 'Head & Shoulders', category: 'personal', size: '340 ml', price: 279, rating: 4.3, inStock: true, tags: ['anti-dandruff'] },
  { id: 'p-soap', name: 'Soap', brand: 'Dove', category: 'personal', size: 'Pack of 4', price: 210, rating: 4.6, inStock: true, tags: [] },
  { id: 'p-facewash', name: 'Face Wash', brand: 'Himalaya', category: 'personal', size: '150 ml', price: 165, rating: 4.3, inStock: true, tags: [] },

  // Household
  { id: 'p-detergent', name: 'Detergent Powder', brand: 'Surf Excel', category: 'household', size: '1 kg', price: 135, rating: 4.5, inStock: true, tags: [] },
  { id: 'p-dishwash', name: 'Dishwash Liquid', brand: 'Vim', category: 'household', size: '500 ml', price: 99, rating: 4.4, inStock: true, tags: [] },
  { id: 'p-tissue', name: 'Tissue Paper', brand: 'Origami', category: 'household', size: 'Pack of 2', price: 89, rating: 4.2, inStock: true, tags: [] },
  { id: 'p-trash-bags', name: 'Trash Bags', brand: 'All Time', category: 'household', size: 'Pack of 30', price: 129, rating: 4.1, inStock: true, tags: [] },
];

export function findProductByName(name: string): Product | undefined {
  const q = name.trim().toLowerCase();
  return PRODUCTS.find((p) => p.name.toLowerCase() === q) ?? PRODUCTS.find((p) => p.name.toLowerCase().includes(q) || q.includes(p.name.toLowerCase()));
}

export function getSubstitutes(product: Product): Product[] {
  if (!product.substitutes) return [];
  return product.substitutes.map((id) => PRODUCTS.find((p) => p.id === id)).filter((p): p is Product => Boolean(p));
}
