import { FortunePageContent } from "@/components/FortuneBook/BookSpread";

import { defaultBook } from "@/config/books";
import { cn } from "@/lib/utils";
import type { BookTheme } from "@/models/fortune";
import type { FortunePage } from "@/models/fortune";

/** 3D 책 한 면(앞/뒤)에 들어갈 페이지 콘텐츠. 전체 높이·너비 채움 */
export function PageFace3D({ page }: { page: FortunePage | null }) {
  if (!page) {
    return null;
  }
  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden bg-[#faf8f3] p-6">
      <FortunePageContent fortuneText={page.text} pageNumber={page.id} className="min-h-0" />
    </div>
  );
}

interface SpreadPage3DProps {
  /** 현재 넘어가는 스프레드의 앞면(오른쪽에 보이던) 페이지 */
  frontPage: FortunePage | null;
  /** 같은 스프레드의 뒷면(넘긴 뒤 왼쪽에 보일) 페이지 */
  backPage: FortunePage | null;
  /** rotateY 각도: 0(오른쪽 펼침) ~ -180(왼쪽으로 완전히 넘어감) */
  rotateY: number;
  zIndex: number;
}

/** 표지 앞면 (3D 플립용) — 책 제목·부제 등 */
export function CoverFace3D({ theme }: { theme: BookTheme }) {
  return (
    <div
      className={cn(
        "absolute inset-0 flex flex-col items-center justify-center overflow-hidden rounded-r border border-l-0 border-stone-400/70 px-8 text-center",
        theme.cover.root
      )}
    >
      {theme.cover.overlay && (
        <div className={cn("absolute inset-0 rounded-r border", theme.cover.overlay)} aria-hidden />
      )}
      <div
        className="absolute top-0 right-0 left-0 h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent"
        aria-hidden
      />
      <div
        className="absolute right-0 bottom-0 left-0 h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent"
        aria-hidden
      />
      <span
        className="relative z-10 font-serif text-[10px] tracking-[0.35em] text-amber-300/90 uppercase"
        aria-hidden
      >
        ✦
      </span>
      <h2 className={cn("relative z-10 mt-3 text-[1.75rem] leading-tight", theme.cover.title)}>
        {defaultBook.name}
      </h2>
      {defaultBook.subtitle && (
        <p
          className={cn(
            "relative z-10 mt-2 font-serif text-sm tracking-wide",
            theme.cover.subtitle
          )}
        >
          {defaultBook.subtitle}
        </p>
      )}
      <div className="relative z-10 mt-6 h-px w-10 bg-amber-400/60" aria-hidden />
      <p className={cn("relative z-10 mt-5 font-serif text-xs tracking-widest", theme.cover.hint)}>
        클릭하여 펼치기
      </p>
    </div>
  );
}

/** 표지 플립용 3D 레이어: 앞면 = 표지, 뒷면 = 1쪽. 넘기면 왼쪽에 1쪽·오른쪽에 2쪽 노출 */
export interface CoverSpread3DProps {
  rotateY: number;
  backPage: FortunePage | null;
  theme: BookTheme;
  zIndex: number;
}

export function CoverSpread3D({ rotateY, backPage, theme, zIndex }: CoverSpread3DProps) {
  const shadow = Math.sin((-rotateY / 180) * Math.PI);

  return (
    <div
      className="absolute top-0 left-1/2 h-full w-1/2 origin-left"
      style={{
        transformStyle: "preserve-3d",
        transform: `rotateY(${rotateY}deg)`,
        transition: "none",
        zIndex,
        willChange: "transform",
      }}
    >
      <div
        className={cn(
          "absolute inset-0 overflow-hidden rounded-r border border-l-0 border-stone-400/70",
          "shadow-[inset_-1px_0_8px_rgba(0,0,0,0.06)]"
        )}
        style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
      >
        <CoverFace3D theme={theme} />
        {shadow > 0.05 && (
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: `linear-gradient(to right, rgba(0,0,0,${shadow * 0.22}), transparent 45%)`,
            }}
          />
        )}
      </div>
      <div
        className={cn(
          "absolute inset-0 overflow-hidden rounded-l border border-r-0 border-stone-400/70 bg-[#faf8f3]",
          "shadow-[inset_1px_0_8px_rgba(0,0,0,0.06)]"
        )}
        style={{
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          transform: "rotateY(180deg)",
        }}
      >
        <PageFace3D page={backPage} />
        {shadow > 0.05 && (
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: `linear-gradient(to left, rgba(0,0,0,${shadow * 0.18}), transparent 45%)`,
            }}
          />
        )}
      </div>
    </div>
  );
}

/**
 * 3D 회전하는 한 장(스프레드). transformOrigin 왼쪽 = 책 중심.
 * 참고: 3d-book.jsx SpreadPage
 */
export function SpreadPage3D({ frontPage, backPage, rotateY, zIndex }: SpreadPage3DProps) {
  const shadow = Math.sin((-rotateY / 180) * Math.PI);

  return (
    <div
      className="absolute top-0 left-1/2 h-full w-1/2 origin-left"
      style={{
        transformStyle: "preserve-3d",
        transform: `rotateY(${rotateY}deg)`,
        transition: "none",
        zIndex,
        willChange: "transform",
      }}
    >
      {/* 앞면 (오른쪽에 보이던 면) */}
      <div
        className={cn(
          "absolute inset-0 overflow-hidden rounded-r border border-l-0 border-stone-400/70 bg-[#faf8f3]",
          "shadow-[inset_-1px_0_8px_rgba(0,0,0,0.06)]"
        )}
        style={{
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
        }}
      >
        <PageFace3D page={frontPage} />
        {shadow > 0.05 && (
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: `linear-gradient(to right, rgba(0,0,0,${shadow * 0.22}), transparent 45%)`,
            }}
          />
        )}
      </div>
      {/* 뒷면 */}
      <div
        className={cn(
          "absolute inset-0 overflow-hidden rounded-l border border-r-0 border-stone-400/70 bg-[#faf8f3]",
          "shadow-[inset_1px_0_8px_rgba(0,0,0,0.06)]"
        )}
        style={{
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          transform: "rotateY(180deg)",
        }}
      >
        <PageFace3D page={backPage} />
        {shadow > 0.05 && (
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: `linear-gradient(to left, rgba(0,0,0,${shadow * 0.18}), transparent 45%)`,
            }}
          />
        )}
      </div>
    </div>
  );
}
