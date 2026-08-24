import { useMemo } from 'react';
import { useShopping } from '../context/ShoppingContext';
import { EmptyState } from '../components/common/EmptyState';
import { formatDayLabel, formatRelativeTime } from '../utils/format';

const TYPE_ICON: Record<string, string> = { command: '🎙️', purchase: '✓' };

export function HistoryPage() {
  const { history, clearHistory, removeHistoryEntry } = useShopping();

  const grouped = useMemo(() => {
    const groups = new Map<string, typeof history>();
    for (const entry of history) {
      const label = formatDayLabel(entry.timestamp);
      const arr = groups.get(label) ?? [];
      arr.push(entry);
      groups.set(label, arr as typeof history);
    }
    return Array.from(groups.entries());
  }, [history]);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-ink">History</h1>
        {history.length > 0 && (
          <button
            onClick={() => {
              if (confirm('Clear your entire history?')) clearHistory();
            }}
            className="rounded-full border border-warm-300 px-3.5 py-1.5 text-xs font-semibold text-warm-600 hover:bg-warm-50"
          >
            Clear history
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <EmptyState icon="🕘" title="No history yet" description="Your voice commands and purchases will show up here." />
      ) : (
        <div className="space-y-6">
          {grouped.map(([day, entries]) => (
            <section key={day}>
              <h2 className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-muted">{day}</h2>
              <ul className="space-y-2">
                {entries.map((entry) => (
                  <li key={entry.id} className="group flex items-start gap-3 rounded-2xl border border-border bg-surface p-4 shadow-soft">
                    <span className="text-lg" aria-hidden="true">{TYPE_ICON[entry.type]}</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-ink">{entry.summary}</p>
                      {entry.transcript && <p className="mt-0.5 text-xs text-muted">&ldquo;{entry.transcript}&rdquo;</p>}
                      <p className="mt-0.5 text-xs text-muted">{formatRelativeTime(entry.timestamp)}</p>
                    </div>
                    <button
                      onClick={() => removeHistoryEntry(entry.id)}
                      aria-label="Remove this history item"
                      className="shrink-0 rounded-full p-1.5 text-muted opacity-0 transition hover:bg-warm-50 hover:text-warm-600 group-hover:opacity-100 focus-visible:opacity-100"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
