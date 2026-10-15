type TickerProps = {
  text: string;
  className?: string;
  separator?: React.ReactNode;
  repeat?: number;
};

/**
 * Infinite CSS marquee. Content is duplicated once and translated 50% so the
 * loop is seamless — leftward in LTR, rightward in RTL (see globals.css).
 * Pauses under prefers-reduced-motion (handled in globals).
 */
export default function Ticker({
  text,
  className = "",
  separator,
  repeat = 6,
}: TickerProps) {
  const items = Array.from({ length: repeat });
  const row = (key: string) => (
    <div key={key} className="flex shrink-0 items-center" aria-hidden="true">
      {items.map((_, i) => (
        <span key={i} className="flex items-center">
          <span className={className}>{text}</span>
          <span className="mx-6 opacity-40 md:mx-10">{separator ?? "—"}</span>
        </span>
      ))}
    </div>
  );

  return (
    <div className="flex w-full overflow-hidden">
      {/* The moving copies are decorative; screen readers get the message once. */}
      <span className="sr-only">{text}</span>
      <div className="flex animate-marquee whitespace-nowrap">
        {row("a")}
        {row("b")}
      </div>
    </div>
  );
}
