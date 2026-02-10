import { cn } from "@/lib/utils";

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
