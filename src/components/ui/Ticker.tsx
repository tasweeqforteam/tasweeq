type TickerProps = {
  text: string;
  className?: string;
  separator?: React.ReactNode;
  repeat?: number;
};

/**
 * Infinite CSS marquee. Content is duplicated once and translated -50% so the
 * loop is seamless. Pauses under prefers-reduced-motion (handled in globals).
 */
export default function Ticker({
  text,
  className = "",
  separator,
  repeat = 6,
}: TickerProps) {
  const items = Array.from({ length: repeat });
  const Row = () => (
    <div className="flex shrink-0 items-center" aria-hidden="true">
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
      <div className="flex animate-marquee whitespace-nowrap">
        <Row />
        <Row />
      </div>
    </div>
  );
}
