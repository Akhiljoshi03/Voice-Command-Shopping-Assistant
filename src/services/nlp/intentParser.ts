import type { IntentType, LanguageCode, ParsedEntities, ParsedIntent, Unit } from '../../types';
import { categorizeProduct } from '../products/categorize';
import { NUMBER_WORDS, PRODUCT_SYNONYMS, UNIT_WORDS, normalizeDevanagariDigits } from './vocabulary';

const INTENT_KEYWORDS: Record<Exclude<IntentType, 'UNKNOWN'>, string[]> = {
  CLEAR: [
    'clear my list', 'clear the list', 'clear list', 'empty my list', 'empty the list',
    'remove everything', 'remove all items', 'delete everything', 'delete the whole list',
    'list khali kar', 'list saaf kar', 'poori list hata', 'सूची खाली करो', 'लिस्ट साफ करो',
  ],
  VIEW: [
    "what's on my list", 'whats on my list', 'show my list', 'show me my list', 'view my list',
    'view list', 'read my list', 'read out my list', 'list dikhao', 'meri list dikhao',
    'मेरी सूची दिखाओ', 'लिस्ट दिखाओ', "what's in my cart",
  ],
  SEARCH: [
    'find', 'search for', 'search', 'look for', 'show me', 'show similar', 'browse',
    'dhundo', 'dhoondo', 'khojo', 'dikhao', 'दिखाओ', 'ढूंढो', 'खोजो',
  ],
  REMOVE: [
    'remove', "don't need", 'dont need', 'no longer need', 'delete', 'take off', 'get rid of',
    'cancel', 'i do not need', 'hata do', 'hatao', 'nikaal do', 'nikal do', 'हटाओ', 'निकालो', 'हटा दो',
  ],
  UPDATE: [
    'change', 'update', 'make it', 'set it to', 'set to', 'adjust', 'increase', 'decrease',
    'badal do', 'badlo', 'update kar do', 'बदलो', 'बदल दो',
  ],
  ADD: [
    'add', 'i need', 'i want', 'buy', 'get me', 'put', 'purchase', 'grab', "let's get",
    'i would like', "i'd like", 'add kar do', 'add karo', 'chahiye', 'khareed', 'jod do', 'jodo',
    'jodna hai', 'daal do', 'mujhe chahiye', 'जोड़ो', 'जोड़ दो', 'चाहिए', 'खरीदना', 'डालो',
  ],
};

// Order matters: more specific / less ambiguous intents are checked first.
const INTENT_PRIORITY: Exclude<IntentType, 'UNKNOWN'>[] = ['CLEAR', 'VIEW', 'UPDATE', 'REMOVE', 'SEARCH', 'ADD'];

const PRICE_UNDER_RE = /(?:under|below|less than|cheaper than|within|upto|up to)\s*(?:rs\.?|₹|inr)?\s*(\d+(?:\.\d+)?)|(\d+(?:\.\d+)?)\s*(?:rs\.?|rupees?|₹)?\s*(?:se\s*kam|se\s*kum)|(?:₹|rs\.?)\s*(\d+(?:\.\d+)?)\s*(?:se\s*kam)?\s*(?:tak)?/i;
const PRICE_BETWEEN_RE = /between\s*(?:rs\.?|₹)?\s*(\d+(?:\.\d+)?)\s*(?:and|to|-)\s*(?:rs\.?|₹)?\s*(\d+(?:\.\d+)?)/i;
const PRICE_OVER_RE = /(?:above|over|more than|greater than)\s*(?:rs\.?|₹)?\s*(\d+(?:\.\d+)?)/i;
const PRICE_CHEAP_RE = /\b(cheap|budget|affordable|sasta|sasti|किफायती|सस्ता|सस्ती)\b/i;

const PREFERENCE_WORDS = ['organic', 'fresh', 'sugar-free', 'sugar free', 'low fat', 'diet', 'gluten-free', 'gluten free', 'whole wheat', 'multigrain'];

const KNOWN_BRANDS = [
  'amul', 'mother dairy', 'britannia', 'harvest gold', "lay's", 'lays', 'parle-g', 'parle',
  "haldiram's", 'haldirams', 'cadbury', 'bisleri', 'coca-cola', 'coca cola', 'pepsi', 'real',
  'tata tea', 'tata', 'nescafe', 'nescafé', 'colgate', 'sensodyne', 'dove', 'head & shoulders',
  'head and shoulders', 'himalaya', 'surf excel', 'vim', 'origami', 'india gate', '24 mantra',
  'aashirvaad', 'fortune', 'madhur', 'licious', 'sofit', 'epigamia', 'so good', "ching's",
  'bambino', 'all time',
];

const STOPWORDS_TO_STRIP = [
  'please', 'kindly', 'my', 'the', 'a', 'an', 'some', 'to', 'from', 'in', 'of', 'for',
  'on', 'my list', 'the list', 'to my list', 'to the list', 'from my list', 'from the list',
  'shopping list', 'list', 'meri list mein', 'meri list se', 'meri list', 'mein', 'se',
  'kar do', 'karo', 'kardo', 'de do', 'do', 'hai', 'chahiye', 'mujhe', 'ke liye',
  'i need', 'i want', 'i would like', "i'd like", 'get me', 'buy', 'add', 'remove', 'delete',
  'find', 'search for', 'search', 'look for', 'show me', 'change', 'update', 'set',
  'anymore', 'now', 'today', 'tomorrow',
];

function detectLanguage(text: string): LanguageCode {
  const hasDevanagari = /[\u0900-\u097F]/.test(text);
  if (hasDevanagari) return 'hi-IN';
  const hinglishHits = ['kar do', 'karo', 'chahiye', 'hai', 'mein', 'jodo', 'hatao', 'dikhao', 'wala', 'meri list']
    .filter((w) => text.toLowerCase().includes(w)).length;
  return hinglishHits > 0 ? 'hi-en' : 'en-IN';
}

function detectIntent(text: string): { intent: IntentType; matched: string } {
  const lower = text.toLowerCase();
  for (const intent of INTENT_PRIORITY) {
    for (const kw of INTENT_KEYWORDS[intent]) {
      if (lower.includes(kw)) return { intent, matched: kw };
    }
  }
  return { intent: 'UNKNOWN', matched: '' };
}

function extractPrice(text: string): { minPrice?: number; maxPrice?: number } {
  const lower = text.toLowerCase();
  const between = lower.match(PRICE_BETWEEN_RE);
  if (between) {
    const a = parseFloat(between[1]);
    const b = parseFloat(between[2]);
    return { minPrice: Math.min(a, b), maxPrice: Math.max(a, b) };
  }
  const under = lower.match(PRICE_UNDER_RE);
  if (under) {
    const val = under[1] || under[2] || under[3];
    if (val) return { maxPrice: parseFloat(val) };
  }
  const over = lower.match(PRICE_OVER_RE);
  if (over) return { minPrice: parseFloat(over[1]) };
  if (PRICE_CHEAP_RE.test(lower)) return { maxPrice: 100 };
  return {};
}

function extractQuantityAndUnit(text: string): { quantity?: number; unit?: Unit; consumed: string[] } {
  const consumed: string[] = [];
  const tokens = text.split(/\s+/);
  let quantity: number | undefined;
  let unit: Unit | undefined;

  // "half a kilo" / "half kilo"
  const halfKiloMatch = text.toLowerCase().match(/half\s+(?:a\s+)?(kilo|kg|litre|liter)/);
  if (halfKiloMatch) {
    quantity = 0.5;
    unit = halfKiloMatch[1].startsWith('lit') ? 'litre' : 'kg';
    consumed.push(halfKiloMatch[0]);
  }

  for (let i = 0; i < tokens.length; i++) {
    const raw = tokens[i].toLowerCase().replace(/[^\w\u0900-\u097F.]/g, '');
    if (!raw) continue;

    if (quantity === undefined) {
      if (/^\d+(\.\d+)?$/.test(raw)) {
        quantity = parseFloat(raw);
        consumed.push(tokens[i]);
        continue;
      }
      if (raw in NUMBER_WORDS) {
        quantity = NUMBER_WORDS[raw];
        consumed.push(tokens[i]);
        continue;
      }
    }

    if (unit === undefined && raw in UNIT_WORDS) {
      unit = UNIT_WORDS[raw];
      consumed.push(tokens[i]);
    }
  }

  // "a dozen eggs" -> dozen implies quantity 1 (dozen) if no quantity found
  if (unit === 'dozen' && quantity === undefined) quantity = 1;

  return { quantity, unit, consumed };
}

function extractBrand(text: string): string | undefined {
  const lower = text.toLowerCase();
  const found = KNOWN_BRANDS.find((b) => lower.includes(b));
  return found ? found.replace(/\b\w/g, (c) => c.toUpperCase()) : undefined;
}

function extractPreferences(text: string): string[] {
  const lower = text.toLowerCase();
  return PREFERENCE_WORDS.filter((p) => lower.includes(p));
}

function stripKnownSegments(text: string, matchedIntentPhrase: string, priceMatch: RegExpMatchArray | null): string {
  let cleaned = ` ${text.toLowerCase()} `;
  if (matchedIntentPhrase) cleaned = cleaned.replace(matchedIntentPhrase, ' ');
  if (priceMatch) cleaned = cleaned.replace(priceMatch[0], ' ');
  cleaned = cleaned.replace(PRICE_UNDER_RE, ' ').replace(PRICE_BETWEEN_RE, ' ').replace(PRICE_OVER_RE, ' ').replace(PRICE_CHEAP_RE, ' ');
  for (const brand of KNOWN_BRANDS) cleaned = cleaned.replace(brand, ' ');
  for (const pref of PREFERENCE_WORDS) cleaned = cleaned.replace(pref, ' ');
  for (const stop of STOPWORDS_TO_STRIP.sort((a, b) => b.length - a.length)) {
    cleaned = cleaned.replace(new RegExp(`\\b${stop}\\b`, 'g'), ' ');
  }
  return cleaned.replace(/\s+/g, ' ').trim();
}

function resolveProductName(fragment: string): string | undefined {
  const cleaned = fragment.trim();
  if (!cleaned) return undefined;

  // Direct synonym match (Hindi/Hinglish word -> canonical English name)
  if (cleaned in PRODUCT_SYNONYMS) return PRODUCT_SYNONYMS[cleaned];

  const words = cleaned.split(/\s+/);
  for (const word of words) {
    if (word in PRODUCT_SYNONYMS) return PRODUCT_SYNONYMS[word];
  }

  // Fall back to the cleaned fragment itself, title-cased
  return cleaned
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

/**
 * Parses a raw voice/text transcript into an intent + extracted entities.
 * Rule-based (keyword + regex) NLP layer supporting English, Hindi and Hinglish.
 */
export function parseCommand(rawText: string): ParsedIntent {
  const text = normalizeDevanagariDigits(rawText.trim());
  const language = detectLanguage(text);

  if (!text) {
    return { intent: 'UNKNOWN', entities: {}, rawText, confidence: 0, language };
  }

  const { intent, matched } = detectIntent(text);
  const priceMatch =
    text.toLowerCase().match(PRICE_BETWEEN_RE) ||
    text.toLowerCase().match(PRICE_UNDER_RE) ||
    text.toLowerCase().match(PRICE_OVER_RE);
  const price = extractPrice(text);
  const { quantity, unit, consumed } = extractQuantityAndUnit(text);
  const brand = extractBrand(text);
  const preferences = extractPreferences(text);

  let remainder = stripKnownSegments(text, matched, priceMatch ?? null);
  for (const c of consumed) {
    remainder = remainder.replace(c.toLowerCase(), ' ').replace(/\s+/g, ' ').trim();
  }

  const productName = intent === 'CLEAR' ? undefined : resolveProductName(remainder);
  const category = productName ? categorizeProduct(productName) : undefined;

  const entities: ParsedEntities = {
    product: productName || undefined,
    quantity,
    unit,
    brand,
    category,
    minPrice: price.minPrice,
    maxPrice: price.maxPrice,
    preferences: preferences.length ? preferences : undefined,
  };

  const hasUsefulEntity = Boolean(productName || quantity !== undefined || price.maxPrice || price.minPrice);
  const confidence = intent === 'UNKNOWN' ? 0.15 : hasUsefulEntity ? 0.92 : 0.55;

  return { intent, entities, rawText, confidence, language };
}
