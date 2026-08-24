import type { Unit } from '../../types';

/** English + Hinglish number words mapped to numeric values. */
export const NUMBER_WORDS: Record<string, number> = {
  zero: 0, half: 0.5, quarter: 0.25,
  one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
  eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, twenty: 20,
  a: 1, an: 1, single: 1, couple: 2, few: 3, dozen: 12,
  // Hinglish transliterations
  ek: 1, do: 2, teen: 3, tin: 3, char: 4, chaar: 4, paanch: 5, panch: 5,
  chhe: 6, che: 6, saat: 7, aath: 8, nau: 9, das: 10, dus: 10,
  // Devanagari number words
  'एक': 1, 'दो': 2, 'तीन': 3, 'चार': 4, 'पांच': 5, 'पाँच': 5,
  'छह': 6, 'सात': 7, 'आठ': 8, 'नौ': 9, 'दस': 10, 'आधा': 0.5, 'आधी': 0.5, 'दर्जन': 12,
};

/** Devanagari digit characters mapped to Arabic numerals. */
const DEVANAGARI_DIGITS: Record<string, string> = {
  '०': '0', '१': '1', '२': '2', '३': '3', '४': '4', '५': '5', '६': '6', '७': '7', '८': '8', '९': '9',
};

export function normalizeDevanagariDigits(text: string): string {
  return text.replace(/[०-९]/g, (d) => DEVANAGARI_DIGITS[d] ?? d);
}

/** Maps recognized unit words (English, Hinglish, Devanagari) to a canonical Unit. */
export const UNIT_WORDS: Record<string, Unit> = {
  bottle: 'bottles', bottles: 'bottles', botal: 'bottles', 'बोतल': 'bottles', 'बोतलें': 'bottles',
  packet: 'packets', packets: 'packets', pack: 'packets', 'पैकेट': 'packets',
  kg: 'kg', kilo: 'kg', kilos: 'kg', kilogram: 'kg', kilograms: 'kg', 'किलो': 'kg',
  g: 'g', gram: 'g', grams: 'g', gm: 'g', 'ग्राम': 'g',
  litre: 'litre', liter: 'litre', litres: 'litre', liters: 'litre', l: 'litre', 'लीटर': 'litre',
  ml: 'ml', millilitre: 'ml', 'मिली': 'ml',
  dozen: 'dozen', 'दर्जन': 'dozen',
  loaf: 'loaf', loaves: 'loaf',
  can: 'can', cans: 'can', tin: 'can',
  box: 'box', boxes: 'box', boxs: 'box',
  piece: 'pieces', pieces: 'pieces', pcs: 'pieces', pc: 'pieces', 'टुकड़े': 'pieces', 'पीस': 'pieces',
};

/** Hindi / Hinglish product-name synonyms mapped to their canonical English product name. */
export const PRODUCT_SYNONYMS: Record<string, string> = {
  'दूध': 'milk', doodh: 'milk', dudh: 'milk',
  'ब्रेड': 'bread', 'डबल रोटी': 'bread', 'रोटी': 'bread',
  'सेब': 'apple', seb: 'apple',
  'केला': 'banana', 'केले': 'banana', kela: 'banana', kele: 'banana',
  'अंडे': 'eggs', 'अंडा': 'eggs', ande: 'eggs', anda: 'eggs',
  'चावल': 'rice', chawal: 'rice',
  'पानी': 'water', pani: 'water',
  'चीनी': 'sugar', cheeni: 'sugar', chini: 'sugar',
  'नमक': 'salt', namak: 'salt',
  'तेल': 'oil', tel: 'oil',
  'आटा': 'wheat flour', aata: 'wheat flour', atta: 'wheat flour',
  'दही': 'curd', dahi: 'curd',
  'पनीर': 'paneer', paneer: 'paneer',
  'चाय': 'tea', chai: 'tea',
  'कॉफी': 'coffee', coffee: 'coffee',
  'साबुन': 'soap', sabun: 'soap',
  'शैम्पू': 'shampoo', shampoo: 'shampoo',
  'टूथपेस्ट': 'toothpaste', toothpaste: 'toothpaste',
  'टमाटर': 'tomato', tamatar: 'tomato',
  'प्याज': 'onion', pyaz: 'onion', pyaaz: 'onion',
  'आलू': 'potato', aloo: 'potato', alu: 'potato',
  'चिप्स': 'chips', chips: 'chips',
  'बिस्कुट': 'biscuits', biscuit: 'biscuits',
  'पास्ता': 'pasta', pasta: 'pasta',
  'चॉकलेट': 'chocolate', chocolate: 'chocolate',
  'मैंगो': 'mango', 'आम': 'mango', aam: 'mango',
};
