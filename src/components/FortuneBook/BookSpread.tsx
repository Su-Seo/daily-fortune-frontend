import { cn } from "@/lib/utils";

/** 점선 테두리 + 코너 장식이 있는 한 페이지 영역 (확장 가능) */
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
        "relative border border-dashed border-stone-400/70 bg-[#faf8f3] text-stone-600",
        "min-h-[320px] min-w-0 flex-1",
        side === "left" && "rounded-l-sm",
        side === "right" && "rounded-r-sm",
        className
      )}
    >
      {/* 코너 장식 (간단한 스크롤워크 느낌) */}
      <CornerOrnament position="top-left" />
      <CornerOrnament position="top-right" />
      <CornerOrnament position="bottom-left" />
      <CornerOrnament position="bottom-right" />
      <div className="relative z-10 flex h-full flex-col p-6">{children}</div>
    </div>
  );
}

function CornerOrnament({
  position,
}: {
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
}) {
  const pos = {
    "top-left": "left-2 top-2",
    "top-right": "right-2 top-2",
    "bottom-left": "left-2 bottom-2",
    "bottom-right": "right-2 bottom-2",
  };
  const rot = {
    "top-left": "0",
    "top-right": "rotate-90",
    "bottom-right": "rotate-180",
    "bottom-left": "-rotate-90",
  };
  return (
    <span
      className={cn(
        "absolute font-serif text-[10px] text-stone-400/80",
        pos[position],
        rot[position]
      )}
      aria-hidden
    >
      ⁕
    </span>
  );
}

/** 왼쪽 페이지 고정 콘텐츠: 왕관, 장식선, 제목 */
export function LeftPageContent({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-8">
      <span className="text-4xl text-stone-500" aria-hidden>
        👑
      </span>
      <span className="font-serif text-sm tracking-[0.3em] text-stone-400" aria-hidden>
        — ◆ —
      </span>
      <p className="font-serif text-lg font-medium tracking-wide text-stone-600">{title}</p>
    </div>
  );
}

/** 오른쪽 페이지: 상단 엠블럼, abracadabra, 운세 문구, 하단 심볼 그리드 */
export function RightPageContent({
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
