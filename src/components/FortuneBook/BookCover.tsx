import { getBookTheme } from "@/config/bookThemes";
import { defaultBook } from "@/config/books";
import { cn } from "@/lib/utils";
import type { BookTheme } from "@/models/fortune";

interface BookCoverProps {
  onOpen: () => void;
  theme?: BookTheme;
  className?: string;
  /** true면 560x390 책 컨테이너의 오른쪽 절반으로 렌더 (클릭 시 제자리에서 플립) */
  embedded?: boolean;
}

/** 닫힌 책 표지 — 클릭 시 열림 (표지 플립은 BookContent에서 재생) */
export function BookCover({
  onOpen,
  theme: themeOverride,
  className,
  embedded = false,
}: BookCoverProps) {
  const theme = themeOverride ?? getBookTheme(defaultBook.themeId);

  const coverButton = (
    <button
      type="button"
      onClick={onOpen}
      onDragStart={e => e.preventDefault()}
      className={cn(
        "group relative flex flex-shrink-0 flex-col items-center justify-center rounded-lg shadow-xl transition-[transform,box-shadow] select-none active:scale-[0.99] active:shadow-lg",
        "focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:outline-none",
        "cursor-pointer touch-none",
        theme.cover.root,
        embedded ? "absolute top-0 left-1/2 h-full w-1/2 rounded-l-none" : "h-[360px] w-[280px]"
      )}
      style={
        embedded
          ? { transformStyle: "preserve-3d", transform: "rotateX(0deg) rotateY(0deg)" }
          : {
              transformStyle: "preserve-3d",
              transform: "rotateX(4deg) rotateY(-2deg)",
            }
      }
      aria-label="책 펼치기"
    >
      <div
        className="absolute top-0 left-0 z-10 h-full w-3 rounded-l-md"
        style={{
          background:
            "linear-gradient(90deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.06) 50%, transparent 100%)",
        }}
        aria-hidden
      />
      {theme.cover.overlay && (
        <div
          className={cn("absolute inset-0 rounded-lg border", theme.cover.overlay)}
          aria-hidden
        />
      )}
      <div
        className="absolute top-0 right-0 left-0 h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent"
        aria-hidden
      />
      <div
        className="absolute right-0 bottom-0 left-0 h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent"
        aria-hidden
      />
      <div className="relative z-10 flex flex-col items-center px-8 text-center">
        <span
          className={cn("font-serif text-[10px] tracking-[0.35em] uppercase", "text-amber-300/90")}
          aria-hidden
        >
          ✦
        </span>
        <h2 className={cn("mt-3 text-[1.75rem] leading-tight", theme.cover.title)}>
          {defaultBook.name}
        </h2>
        {defaultBook.subtitle && (
          <p className={cn("mt-2 font-serif text-sm tracking-wide", theme.cover.subtitle)}>
            {defaultBook.subtitle}
          </p>
        )}
        <div className="mt-6 h-px w-10 bg-amber-400/60" aria-hidden />
        <p className={cn("mt-5 font-serif text-xs tracking-widest", theme.cover.hint)}>
          클릭하여 펼치기
        </p>
      </div>
    </button>
  );

  if (embedded) {
    return coverButton;
  }

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div
        className="flex flex-col items-center"
        style={{ perspective: "2000px", perspectiveOrigin: "50% 45%" }}
      >
        {coverButton}
        <div
          className="mt-1 h-5 w-64 rounded-full"
          style={{
            background: "radial-gradient(ellipse, rgba(0,0,0,0.2) 0%, transparent 70%)",
          }}
          aria-hidden
        />
      </div>
    </div>
  );
}
