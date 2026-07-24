import { cn } from "@/lib/utils";

interface WordRevealProps {
  text: string;
  className?: string;
  delay?: number;
}

/** Reveals a line of text word by word with a soft rise + blur.
 *  Pure CSS so it runs at first paint, before hydration — critical for LCP. */
export function WordReveal({ text, className, delay = 0 }: WordRevealProps) {
  const words = text.split(" ");

  return (
    <span className={cn("inline-block", className)}>
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom"
        >
          <span
            className="anim-word"
            style={{ animationDelay: `${delay + i * 0.08}s` }}
          >
            {word}
            {i < words.length - 1 ? " " : ""}
          </span>
        </span>
      ))}
    </span>
  );
}
