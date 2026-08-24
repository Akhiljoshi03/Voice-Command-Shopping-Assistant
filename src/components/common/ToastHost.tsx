import { useToast } from '../../context/ToastContext';

const TONE_STYLES: Record<string, string> = {
  success: 'border-primary-500/30 bg-primary-600 text-white',
  error: 'border-warm-500/30 bg-warm-600 text-white',
  info: 'border-border bg-ink text-canvas',
};

export function ToastHost() {
  const { toasts, dismissToast } = useToast();

  return (
    <div className="fixed inset-x-0 bottom-20 z-50 flex flex-col items-center gap-2 px-4 sm:bottom-6" aria-live="polite">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="status"
          className={`animate-rise-in flex w-full max-w-sm items-center justify-between gap-3 rounded-2xl border px-4 py-3 shadow-lift ${TONE_STYLES[toast.tone]}`}
        >
          <span className="text-sm font-medium leading-snug">{toast.text}</span>
          <div className="flex shrink-0 items-center gap-2">
            {toast.action && (
              <button
                onClick={() => {
                  toast.action?.onClick();
                  dismissToast(toast.id);
                }}
                className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide hover:bg-white/25"
              >
                {toast.action.label}
              </button>
            )}
            <button
              onClick={() => dismissToast(toast.id)}
              aria-label="Dismiss notification"
              className="rounded-full p-1 text-xs opacity-70 hover:opacity-100"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
