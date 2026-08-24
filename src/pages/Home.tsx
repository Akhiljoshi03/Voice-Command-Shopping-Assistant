import { Link } from 'react-router-dom';
import { VoiceAssistantPanel } from '../components/VoiceAssistant/VoiceAssistantPanel';
import { SuggestionsList } from '../components/Suggestions/SuggestionsList';
import { useShopping } from '../context/ShoppingContext';
import { formatCurrency, formatRelativeTime } from '../utils/format';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export function Home() {
  const { list, history } = useShopping();
  const pending = list.filter((i) => !i.purchased);
  const estimatedTotal = pending.reduce((sum, i) => sum + i.estimatedPrice, 0);
  const recentSearches = history.filter((h) => h.intent === 'SEARCH').slice(0, 4);

  return (
    <div className="space-y-6">
      <header className="animate-rise-in">
        <p className="font-display text-2xl text-ink sm:text-3xl">{getGreeting()} 👋</p>
        <p className="mt-1 text-sm text-muted">What&rsquo;s on your shopping list today?</p>
      </header>

      <VoiceAssistantPanel />

      <Link
        to="/list"
        className="block rounded-3xl border border-border bg-surface p-5 shadow-soft transition hover:shadow-lift"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">My Shopping List</p>
            <p className="font-display text-xl text-ink">{pending.length} item{pending.length === 1 ? '' : 's'}</p>
            <p className="text-sm text-muted">{formatCurrency(estimatedTotal)} estimated</p>
          </div>
          <span className="text-2xl text-muted" aria-hidden="true">→</span>
        </div>
      </Link>

      <section aria-labelledby="suggestions-heading">
        <div className="mb-3 flex items-center justify-between">
          <h2 id="suggestions-heading" className="font-display text-lg text-ink">You might need these</h2>
          <Link to="/suggestions" className="text-xs font-semibold text-primary-600 hover:underline">See all</Link>
        </div>
        <SuggestionsList limit={3} />
      </section>

      {recentSearches.length > 0 && (
        <section aria-labelledby="recent-heading">
          <h2 id="recent-heading" className="mb-3 font-display text-lg text-ink">Recent searches</h2>
          <ul className="space-y-2">
            {recentSearches.map((entry) => (
              <li key={entry.id} className="flex items-center justify-between rounded-2xl border border-border bg-surface px-4 py-3 shadow-soft">
                <div className="min-w-0">
                  <p className="truncate text-sm text-ink-soft">&ldquo;{entry.transcript}&rdquo;</p>
                  <p className="text-xs text-muted">{formatRelativeTime(entry.timestamp)}</p>
                </div>
                <Link to="/search" className="shrink-0 text-xs font-semibold text-primary-600 hover:underline">
                  Search again
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
