interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  action?: { label: string; onClick: () => void };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-border bg-surface/60 px-6 py-14 text-center">
      <span className="text-4xl" aria-hidden="true">{icon}</span>
      <h3 className="font-display text-lg text-ink">{title}</h3>
      <p className="max-w-xs text-sm text-muted">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="mt-2 rounded-full bg-primary-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-primary-600"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
