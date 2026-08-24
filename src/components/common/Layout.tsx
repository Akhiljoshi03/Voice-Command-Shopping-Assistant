import type { ReactNode } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useShopping } from '../../context/ShoppingContext';

const NAV_ITEMS = [
  { to: '/', label: 'Home', icon: '🏠' },
  { to: '/list', label: 'List', icon: '🛒' },
  { to: '/search', label: 'Search', icon: '🔍' },
  { to: '/suggestions', label: 'For You', icon: '✨' },
  { to: '/history', label: 'History', icon: '🕘' },
  { to: '/settings', label: 'Settings', icon: '⚙️' },
];

function navLinkClasses(isActive: boolean, variant: 'sidebar' | 'bottom') {
  if (variant === 'sidebar') {
    return `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${
      isActive ? 'bg-primary-50 text-primary-700' : 'text-ink-soft hover:bg-canvas-dim'
    }`;
  }
  return `flex flex-1 flex-col items-center gap-0.5 rounded-xl py-1.5 text-[10px] font-medium transition ${
    isActive ? 'text-primary-600' : 'text-muted'
  }`;
}

export function Layout({ children }: { children: ReactNode }) {
  const { list } = useShopping();
  const navigate = useNavigate();
  const pendingCount = list.filter((i) => !i.purchased).length;

  return (
    <div className="min-h-dvh bg-canvas">
      <div className="mx-auto flex max-w-6xl">
        {/* Desktop sidebar */}
        <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col border-r border-border bg-surface px-4 py-6 md:flex">
          <div className="mb-8 flex items-center gap-2 px-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-500 text-lg text-white">🛍️</span>
            <span className="font-display text-lg text-ink">Sahayak</span>
          </div>
          <nav className="flex flex-1 flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.to === '/'} className={({ isActive }) => navLinkClasses(isActive, 'sidebar')}>
                <span aria-hidden="true">{item.icon}</span>
                {item.label}
                {item.to === '/list' && pendingCount > 0 && (
                  <span className="ml-auto rounded-full bg-primary-500 px-2 py-0.5 text-[10px] font-semibold text-white">
                    {pendingCount}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
          <button
            onClick={() => navigate('/')}
            className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-canvas transition hover:bg-primary-600"
          >
            🎙️ Speak a command
          </button>
        </aside>

        {/* Main content */}
        <main className="min-w-0 flex-1 px-4 pb-28 pt-5 sm:px-6 sm:pb-10 md:pt-8">
          <div className="mx-auto max-w-3xl">{children}</div>
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav
        className="fixed inset-x-0 bottom-0 z-40 flex items-stretch border-t border-border bg-surface/95 px-1 pb-[max(0.4rem,env(safe-area-inset-bottom))] pt-1.5 backdrop-blur md:hidden"
        aria-label="Primary"
      >
        {NAV_ITEMS.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.to === '/'} className={({ isActive }) => navLinkClasses(isActive, 'bottom')}>
            <span className="relative text-lg" aria-hidden="true">
              {item.icon}
              {item.to === '/list' && pendingCount > 0 && (
                <span className="absolute -right-2 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-warm-500 text-[8px] font-bold text-white">
                  {pendingCount > 9 ? '9+' : pendingCount}
                </span>
              )}
            </span>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
