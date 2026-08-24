import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';
import { generateId } from '../utils/id';

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastMessage {
  id: string;
  text: string;
  tone: 'success' | 'error' | 'info';
  action?: ToastAction;
}

interface ToastContextValue {
  toasts: ToastMessage[];
  showToast: (text: string, tone?: ToastMessage['tone'], action?: ToastAction) => void;
  dismissToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    if (timers.current[id]) {
      clearTimeout(timers.current[id]);
      delete timers.current[id];
    }
  }, []);

  const showToast = useCallback(
    (text: string, tone: ToastMessage['tone'] = 'info', action?: ToastAction) => {
      const id = generateId('toast');
      setToasts((prev) => [...prev.slice(-2), { id, text, tone, action }]);
      timers.current[id] = setTimeout(() => dismissToast(id), 4500);
    },
    [dismissToast]
  );

  return (
    <ToastContext.Provider value={{ toasts, showToast, dismissToast }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
}
