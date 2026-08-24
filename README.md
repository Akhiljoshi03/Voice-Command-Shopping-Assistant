# 🛒 Sahayak — Voice Command Shopping Assistant

> **Speak naturally. Shop intelligently.**
>
> Sahayak is a multilingual, voice-first shopping assistant that lets users manage a shopping list using **English, Hindi, and Hinglish**. It understands natural commands, extracts quantities and product details, automatically categorizes items, searches products by voice, and learns from shopping history to generate personalized suggestions.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Vitest-Tested-6E9F18?logo=vitest&logoColor=white)](https://vitest.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)

---

## ✨ Why Sahayak?

Traditional shopping-list apps make you repeatedly type products, quantities, and modifications.

Sahayak replaces that friction with a simple loop:

**🎙️ Speak → 🧠 Understand → 🛒 Act → 🔊 Confirm**

For example:

> **"2 packet bread meri list mein add kar do"**

Sahayak understands the Hinglish command, identifies the product, quantity, and unit, and adds the correct item to the shopping list.

It also understands commands such as:

- `"Add milk"`
- `"Add 2 bottles of water"`
- `"Remove milk from my list"`
- `"Change apples to 5"`
- `"Find organic apples under ₹300"`
- `"मेरी लिस्ट में दूध जोड़ो"`
- `"What's on my list?"`

---

# 🚀 Features

### 🎙️ Voice-First Shopping

Interact with the entire shopping list using natural speech.

- Browser-based speech recognition (Web Speech API)
- Live + interim transcript display
- Detected-intent visualization before the action is confirmed
- Spoken confirmation via text-to-speech
- Start/stop microphone controls
- Always-available text-input fallback when voice recognition is unavailable

### 🌍 Multilingual NLP

Sahayak supports:

- 🇬🇧 English
- 🇮🇳 Hindi
- 🔀 Hinglish

The NLP engine extracts:

```text
Intent · Product · Quantity · Unit · Brand · Price range · Preferences
```

Supported intents:

```text
ADD · REMOVE · UPDATE · SEARCH · CLEAR · VIEW · UNKNOWN
```

Example:

```text
"2 packet bread meri list mein add kar do"
```

parses to:

```text
Intent: ADD
Product: Bread
Quantity: 2
Unit: packets
Language: Hinglish
```

### 🧠 Smart Shopping Suggestions

Sahayak analyzes shopping history and the current list to generate several kinds of recommendations:

| Suggestion    | Purpose                                                            |
| ------------- | ------------------------------------------------------------------- |
| 🔄 Restock    | Estimates when a frequently-bought item may need replenishing       |
| ⭐ Frequent    | Surfaces products bought repeatedly that aren't on the list         |
| 🌱 Seasonal   | Suggests in-season produce for the current month                    |
| 🥖 Pairing    | Recommends items commonly bought alongside what's already on the list |
| 🔁 Substitute | Offers alternatives for a selected product                          |

```text
Shopping for pasta?
→ You might also need pasta sauce.
```

### 🔎 Voice-Powered Product Search

```text
"Find organic apples under ₹300"
```

extracts:

```text
Product: Apples
Preference: Organic
Max price: ₹300
```

and renders results as product cards with brand, price, rating, category, and substitutes.

### 🗂️ Automatic Categorization

Products are automatically assigned to one of ten categories — Produce, Dairy, Meat & Fish, Bakery, Pantry, Snacks, Beverages, Personal Care, Household, Other — and can still be changed manually.

### 🛍️ Complete Shopping List Management

Add · remove · update quantity · increase/decrease · mark purchased · undo · clear purchased · clear all · view pending — by voice or by tap.

### 🔊 Voice Confirmation

```text
User:    "Add three packets of chips"
Sahayak: "Added 3 packets of chips to your list."
```

Toggleable from Settings.

### 📜 Shopping History

Every voice command and purchase is logged and browsable by day, and feeds the recommendation engine.

### 📱 Responsive & Accessible

**Desktop:** sidebar navigation, spacious dashboard, keyboard navigation.
**Mobile:** bottom nav, large touch targets, responsive product cards.

The app is fully usable without voice input — keyboard/screen-reader accessible throughout.

---

# 🛠️ Tech Stack

| Technology          | Purpose                             | Version   |
| -------------------- | ------------------------------------ | --------- |
| **React**            | UI framework                         | 19        |
| **TypeScript**       | Type safety                          | ~6.0      |
| **Vite**             | Dev server & production build        | 8         |
| **Tailwind CSS**     | Styling (custom design tokens)       | v4        |
| **React Router**     | Client-side routing                  | 7         |
| **Web Speech API**   | Speech recognition & text-to-speech  | native    |
| **localStorage**     | Persistent client-side data          | native    |
| **Vitest**           | Testing                              | 4         |
| **Testing Library**  | React integration testing            | —         |
| **oxlint**           | Linting                              | —         |

No external AI API or API key is required for the core experience — see [Environment Variables](#-environment-variables).

---

# 🏗️ Architecture

```text
src/
├── components/
│   ├── VoiceAssistant/   MicButton · Waveform · VoiceAssistantPanel
│   ├── ShoppingList/     ShoppingListItem · ShoppingListView
│   ├── ProductCard/      ProductCard
│   ├── Suggestions/      SuggestionCard · SuggestionsList
│   ├── Search/           SearchFiltersBar
│   └── common/           Layout · EmptyState · ToastHost
├── pages/                Home · ShoppingListPage · SearchPage ·
│                         SuggestionsPage · HistoryPage · SettingsPage
├── services/
│   ├── speech/           useSpeechRecognition (STT) · tts (TTS)
│   ├── nlp/              intentParser (intent + entity extraction) · vocabulary
│   ├── recommendations/  suggestions engine (restock/frequent/seasonal/pairing)
│   └── products/         categorize · search
├── context/              ShoppingContext (state + persistence) · ToastContext
├── hooks/                useLocalStorage
├── data/                 demo product catalog · seed data · languages
├── types/                shared TypeScript types
└── utils/                formatting · id generation
```

Concerns are layered so any piece can be swapped independently:

```text
UI  →  Context / State  →  Services (NLP · Speech · Products · Recommendations)  →  Persistence
```

---

# 🧠 How the NLP Pipeline Works

Implemented as a lightweight **rule-based** system (`services/nlp/`) so the app works fully offline with no external AI dependency.

```text
Voice / Text Input
       ↓
Language Detection        (Devanagari → Hindi · Hinglish markers → Hinglish · else English)
       ↓
Intent Classification     (CLEAR → VIEW → UPDATE → REMOVE → SEARCH → ADD, most-specific first)
       ↓
Entity Extraction         (product · quantity · unit · brand · price range · preferences)
       ↓
Product Resolution        (Hindi/Hinglish synonym dictionary → demo catalog)
       ↓
Shopping Action
       ↓
UI Update + Voice Confirmation
```

Quantity extraction understands digits and number words across languages:

```text
2 · two · दो · do · "half a kilo"
```

Because the parser is isolated behind `services/nlp/`, it can later be replaced with a hosted LLM/NLU service without touching any UI code — see [Future Roadmap](#-future-roadmap).

---

# 🎯 Recommendation Engine

`services/recommendations/suggestions.ts` combines the current list with purchase history:

- **Restock** — average gap between past purchases of the same item, checked against time since last purchase
- **Frequent** — items purchased 2+ times that aren't currently on the list
- **Seasonal** — a small in-season produce calendar keyed by month
- **Pairing** — items commonly bought alongside what's already on the list (`pasta → pasta sauce`, `bread → butter`)
- **Substitutes** — looked up per product in the demo catalog (`milk → almond / soy / oat milk`)

---

# 🎨 Design System

Sahayak uses a custom visual identity rather than Tailwind's defaults.

**Color direction:** herb green · saffron · coral, on a warm porcelain canvas.
**Typography:** [Fraunces](https://fonts.google.com/specimen/Fraunces) (display) · [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) (UI) · [JetBrains Mono](https://www.jetbrains.com/lp/mono/) (prices/data).

All tokens live in `src/index.css` (`@theme`) — no hardcoded hex values in components.

---

# 📂 Main Pages

| Page | Route | Description |
| --- | --- | --- |
| 🏠 Home | `/` | Voice dashboard — mic, live transcript, list summary, top suggestions |
| 🛒 Shopping List | `/list` | Full list management, grouped by category |
| 🔎 Search | `/search` | Voice/text product search with filters |
| 💡 Suggestions | `/suggestions` | Restock, frequent, seasonal, and pairing suggestions |
| 📜 History | `/history` | Past voice commands and purchases, grouped by day |
| ⚙️ Settings | `/settings` | Language, voice feedback toggle |

---

# 💻 Installation

**Prerequisites:** Node.js and npm.

```bash
git clone https://github.com/Akhiljoshi03/Voice-Command-Shopping-Assistant.git
cd Voice-Command-Shopping-Assistant
npm install
```

---

# ▶️ Run Locally

```bash
npm run dev
```

The app will be available at **http://localhost:5173**.

> Voice input needs a Web Speech API–capable browser (Chrome, Edge, Safari) on a secure context (`localhost` or `https://`). Elsewhere, the app automatically falls back to the text-command input — no feature is voice-only.

---

# 🧪 Testing

```bash
npm run test
```

The suite (`src/__tests__/smoke.test.tsx`, Vitest + Testing Library) mounts the full app and drives it through the typed-command path, checking:

- Adding an item and seeing it appear on the Shopping List page
- Removing an item by name
- Graceful handling of an unrecognized command
- That the app renders without crashing

---

# 🏗️ Production Build

```bash
npm run build     # tsc -b && vite build
npm run preview   # serve the production build locally
npm run lint      # oxlint
```

---

# 🔐 Environment Variables

**None are required** for core functionality — speech recognition/synthesis use the browser's native Web Speech API, and data persists to `localStorage`.

`.env.example` documents optional variables for future integrations (a real product/search API, a hosted NLP service, or a cloud database like Firebase/Supabase). Never commit real secrets.

---

# 🌐 Browser Compatibility

Voice input uses the browser's native Web Speech API, generally supported in Chrome, Edge, and Safari, and typically requires `localhost` or `https://`. If speech recognition is unavailable, Sahayak automatically shows a text-input fallback that runs through the same NLP pipeline.

---

# 🚀 Deployment

Sahayak is a static Vite build with no backend, so it deploys cleanly to Vercel or Netlify.

**Vercel**
```bash
npm install -g vercel
vercel
```
Framework: Vite · Build command: `npm run build` · Output directory: `dist`

**Netlify**
```bash
npm run build
netlify deploy --prod --dir=dist
```

Both platforms serve over HTTPS by default, so browser speech recognition works in production without extra configuration.

---

# 🎤 Example Commands

| Voice command | Result |
| --- | --- |
| `Add milk` | Adds 1 Milk (pieces) |
| `Add 2 bottles of water` | Adds 2 bottles of Water |
| `I need some apples for tomorrow` | Adds Apples |
| `Remove milk from my list` | Removes Milk |
| `Change apples to 5` | Updates Apples' quantity to 5 |
| `Find organic apples under ₹300` | Search filtered to organic apples, max ₹300 |
| `Find Dove shampoo` | Search filtered to brand "Dove" |
| `मेरी लिस्ट में दूध जोड़ो` | Adds Milk (Hindi) |
| `2 packet bread meri list mein add kar do` | Adds 2 packets of Bread (Hinglish) |
| `What's on my list` | Reads out a summary of pending items |
| `Clear my list` | Clears the entire list |

---

# 🔮 Future Roadmap

**AI & NLP**
- [ ] LLM-powered intent understanding for more open-ended phrasing
- [ ] Wake-word / continuous listening mode

**Personalization**
- [ ] Budget-aware and household-level recommendations

**Backend**
- [ ] Firebase/Supabase integration, auth, and multi-device sync

**Product ecosystem**
- [ ] Real grocery/product APIs, live pricing, store availability

**Accessibility & localization**
- [ ] Additional Indian languages, extended regional vocabulary, offline speech

---

# 🧩 Engineering Highlights

- Rule-based, offline-capable multilingual NLP with a clean intent/entity interface
- Layered architecture (UI → Context → Services → Persistence) — each concern is independently replaceable
- Recommendation engine driven by real interval math over purchase history, not static rules
- Type-safe throughout (strict TypeScript, zero `any` in the state layer)
- Integration-tested core interaction loop (Vitest + Testing Library)
- Fully accessible and usable without voice input

---

# 💡 Project Approach

Sahayak solves the friction of typing out grocery lists by letting people just talk to their list. A large mic button drives the core loop: speak → transcribe → parse → act → confirm, visually and by voice. Speech-to-text and text-to-speech use the browser's native Web Speech API — no backend or API key needed — with an always-available text input as a fallback for unsupported browsers and accessibility. A rule-based NLP layer classifies intent (add/remove/update/search/clear/view) and extracts product, quantity, unit, brand, and price entities across English, Hindi, and Hinglish, using layered keyword and vocabulary dictionaries so new languages can be added without touching the parsing logic. Product search supports natural filters like "organic apples under ₹300," rendered as faceted product cards with substitutes. A recommendation engine analyzes purchase history to suggest restocks, frequent buys, seasonal picks, and complementary pairings. Items are auto-categorized into ten grocery categories. The app is built with React, TypeScript, Vite, and Tailwind CSS, is mobile-first and fully keyboard/screen-reader accessible, and persists data to localStorage behind a swappable data layer — ready to connect to Firebase/Supabase and a real product API. It deploys as a static build to Vercel or Netlify.

*(200 words)*

---

# 👨‍💻 Author

**Akhil Joshi**
[github.com/Akhiljoshi03](https://github.com/Akhiljoshi03) · [Voice-Command-Shopping-Assistant](https://github.com/Akhiljoshi03/Voice-Command-Shopping-Assistant)

---

# 📄 License

Licensed under the [MIT License](./LICENSE).

---

**Built with React, TypeScript, Tailwind CSS, and the browser's own Web Speech API.**
