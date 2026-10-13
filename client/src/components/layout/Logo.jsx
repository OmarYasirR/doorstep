// Doorstep logo: an arched door above a two-tier step, plus the wordmark.
// The mark is inline SVG (no font needed); the wordmark uses the Fraunces display font.
export function LogoMark({ size = 36, variant = 'dark', className = '' }) {
  const light = variant === 'light';
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className} aria-hidden="true">
      <rect width="64" height="64" rx="15" fill={light ? '#F7F5F0' : '#16324F'} />
      <path d="M21 45V29a11 11 0 0 1 22 0v16z" fill={light ? '#16324F' : '#F7F5F0'} />
      <circle cx="38" cy="37" r="1.9" fill="#B08D57" />
      <rect x="15" y="47.5" width="34" height="4.5" rx="2.25" fill="#B08D57" />
      <rect x="19" y="53.5" width="26" height="3" rx="1.5" fill="#B08D57" opacity=".55" />
    </svg>
  );
}

export default function Logo({ size = 36, variant = 'dark', showWordmark = true }) {
  const light = variant === 'light';
  return (
    <span className="inline-flex items-center gap-2.5">
      <LogoMark size={size} variant={variant} />
      {showWordmark && (
        <span
          className={`font-display font-semibold leading-none tracking-tight ${light ? 'text-paper' : 'text-ink'}`}
          style={{ fontSize: size * 0.62 }}
        >
          Door<span className={light ? 'text-brass-light' : 'text-brass'}>step</span>
        </span>
      )}
    </span>
  );
}
