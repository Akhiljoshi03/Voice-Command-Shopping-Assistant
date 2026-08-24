import { SuggestionsList } from '../components/Suggestions/SuggestionsList';

export function SuggestionsPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl text-ink">Smart Suggestions</h1>
        <p className="mt-1 text-sm text-muted">Based on your shopping habits, the season, and what&rsquo;s already on your list.</p>
      </div>
      <SuggestionsList />
    </div>
  );
}
