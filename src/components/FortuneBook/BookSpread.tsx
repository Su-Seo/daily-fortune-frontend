import { cn } from "@/lib/utils";

/** 점선 테두리 + 코너 장식이 있는 한 페이지 영역 */
export function BookPageFrame({
  children,
  className,
  side = "right",
}: {
  children: React.ReactNode;
  className?: string;
  side?: "left" | "right";
}) {
  return (
    <div
      className={cn(
        "relative min-h-[320px] min-w-0 flex-1 border border-dashed border-stone-400/70 bg-[#faf8f3] text-stone-600",
        side === "left" && "rounded-l-sm",
        side === "right" && "rounded-r-sm",
        className
      )}
    >
      <span className="absolute top-2 left-2 font-serif text-[10px] text-stone-400/80" aria-hidden>
        ⁕
      </span>
      <span
        className="absolute top-2 right-2 rotate-90 font-serif text-[10px] text-stone-400/80"
        aria-hidden
      >
        ⁕
      </span>
      <span
        className="absolute bottom-2 left-2 -rotate-90 font-serif text-[10px] text-stone-400/80"
        aria-hidden
      >
        ⁕
      </span>
      <span
        className="absolute right-2 bottom-2 rotate-180 font-serif text-[10px] text-stone-400/80"
        aria-hidden
      >
        ⁕
      </span>
      <div className="relative z-10 flex h-full flex-col p-6">{children}</div>
    </div>
  );
}

/** 왼쪽·오른쪽 공통: 한 페이지 운세 레이아웃 (엠블럼, abracadabra, 문구, 쪽수, 심볼) */
export function FortunePageContent({
  fortuneText,
  pageNumber,
  className,
}: {
  fortuneText: string;
  pageNumber: number;
  className?: string;
}) {
  return (
    <div className={cn("flex h-full flex-col", className)}>
      <div className="flex flex-col items-center gap-1 pt-2">
        <span className="text-2xl text-stone-500" aria-hidden>
          🦅
        </span>
        <span className="font-serif text-xs tracking-widest text-stone-500 italic">
          abracadabra
        </span>
      </div>
      <p className="flex-1 py-6 font-serif text-base leading-relaxed text-stone-700">
        {fortuneText}
      </p>
      <div className="flex items-end justify-between gap-4">
        <p className="font-serif text-xs text-stone-400">— {pageNumber}쪽</p>
        <SymbolGrid />
      </div>
    </div>
  );
}

function SymbolGrid() {
  const symbols = [
    ["♥", "♥", "♥", "♡"],
    ["♣", "♣", "♣", "♣"],
    ["$", "$", "$", "$"],
  ];
  return (
    <div className="flex flex-col gap-0.5 font-serif text-[10px] text-stone-400" aria-hidden>
      {symbols.map((row, i) => (
        <div key={i} className="flex gap-1">
          {row.map((s, j) => (
            <span key={j}>{s}</span>
          ))}
        </div>
      ))}
    </div>
  );
}
