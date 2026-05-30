type LogoProps = {
  className?: string;
  showWordmark?: boolean;
};

/**
 * Official TASWEEQ logomark (vector). The glyph is brand-cyan in every theme;
 * the optional wordmark inherits `currentColor`.
 */
export default function Logo({ className = "", showWordmark = true }: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <svg
        viewBox="0 0 120 60"
        className="h-[20px] w-auto shrink-0"
        fill="var(--cyan)"
        role="img"
        aria-label="TASWEEQ"
      >
        <path d="m74.9 1.9v7.6h-43.8v33h-14.9v-25.9c0-3.4-2.8-7.1-6.5-7.1h-7.5v-7.6h72.7z" />
        <path d="m91.4 1.9h-9.2v7.5h1.6c10 0 20.2 7.9 20.2 20.6 0 9.5-7.2 19.9-20.2 19.9h-67.6v8.1h75.2c15.7 0 26.6-12.3 26.7-27.1 0.2-14-11.4-29-26.7-29z" />
        <path d="m51.4 22.6c-3.7 0-7.4 3-7.4 7.3 0 3.7 2.7 7.4 7.4 7.4 4.1 0.1 7.2-3.3 7.2-7.2s-3-7.4-7.2-7.5z" />
        <path d="m83.6 22.6c-3.7 0.1-7.5 3.2-7.5 7.4 0 3.6 2.7 7.3 7.4 7.3 4.1 0.1 7.6-3 7.6-7.2 0.1-4.1-3.1-7.5-7.5-7.5z" />
      </svg>
      {showWordmark && (
        <span data-font-en className="font-display text-[1.15rem] font-bold tracking-[-0.04em] leading-none">
          TASWEEQ
        </span>
      )}
    </span>
  );
}
