const BAR_DELAYS = [0, 0.12, 0.24, 0.36, 0.48, 0.36, 0.24, 0.12, 0];

export function Waveform({ active, color = 'currentColor' }: { active: boolean; color?: string }) {
  return (
    <div className="flex h-6 items-center gap-[3px]" aria-hidden="true">
      {BAR_DELAYS.map((delay, idx) => (
        <span
          key={idx}
          className={active ? 'animate-wave-bar' : ''}
          style={{
            display: 'inline-block',
            width: 3,
            height: active ? 22 : 6,
            borderRadius: 2,
            background: color,
            animationDelay: `${delay}s`,
            transform: active ? undefined : 'scaleY(0.3)',
            transition: 'height 0.25s ease',
          }}
        />
      ))}
    </div>
  );
}
