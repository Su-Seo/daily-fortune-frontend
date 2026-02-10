import { useRef, useState } from "react";

import { getBookTheme } from "@/config/bookThemes";
import { defaultBook } from "@/config/books";
import { cn } from "@/lib/utils";
import type { BookTheme } from "@/models/fortune";

interface BookCoverProps {
  onOpen: () => void;
  /** 테마 미지정 시 defaultBook 테마 사용 */
  theme?: BookTheme;
  className?: string;
}

const DRAG_THRESHOLD = 48;

/** 닫힌 책 표지 - 클릭 또는 오른쪽으로 드래그 시 펼침 */
export function BookCover({ onOpen, theme: themeOverride, className }: BookCoverProps) {
  const theme = themeOverride ?? getBookTheme(defaultBook.themeId);
  const [dragX, setDragX] = useState(0);
  const startX = useRef(0);

  const handlePointerDown = (e: React.PointerEvent) => {
    startX.current = e.clientX;
    setDragX(0);
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const dx = e.clientX - startX.current;
    if (dx > 0) {
      setDragX(Math.min(dx, DRAG_THRESHOLD));
    }
  };

  const handlePointerUp = () => {
    if (dragX >= DRAG_THRESHOLD) {
      onOpen();
    }
    setDragX(0);
  };

  return (
    <button
      type="button"
      onClick={onOpen}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onDragStart={e => e.preventDefault()}
      className={cn(
        "group relative flex h-[320px] w-[240px] flex-col items-center justify-center rounded-lg shadow-xl transition-transform hover:scale-[1.02] hover:shadow-2xl active:scale-[0.98]",
        "touch-none select-none",
        "focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:outline-none",
        theme.cover.root,
        className
      )}
      aria-label="책 펼치기"
      style={{ transform: dragX > 0 ? `translateX(${dragX}px)` : undefined }}
    >
      {theme.cover.overlay && (
        <div
          className={cn("absolute inset-0 rounded-lg border", theme.cover.overlay)}
          aria-hidden
        />
      )}
      <span className={cn("relative z-10", theme.cover.title)}>{defaultBook.name}</span>
      {defaultBook.subtitle && (
        <span className={cn("relative z-10 mt-2", theme.cover.subtitle)}>
          {defaultBook.subtitle}
        </span>
      )}
      <p className={cn("relative z-10 mt-6", theme.cover.hint)}>클릭하거나 살짝 당겨 보세요</p>
    </button>
  );
}
