import { useRef, useState } from "react";

import { cn } from "@/lib/utils";

interface BookCoverProps {
  onOpen: () => void;
  className?: string;
}

const DRAG_THRESHOLD = 48;

/** 닫힌 책 표지 - 클릭 또는 오른쪽으로 드래그 시 펼침 */
export function BookCover({ onOpen, className }: BookCoverProps) {
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
        "group relative flex h-[320px] w-[240px] flex-col items-center justify-center rounded-lg border-2 border-amber-800/40 bg-gradient-to-br from-amber-900 via-amber-800 to-amber-900 shadow-xl transition-transform hover:scale-[1.02] hover:shadow-2xl active:scale-[0.98]",
        "touch-none select-none",
        "focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:outline-none",
        className
      )}
      aria-label="책 펼치기"
      style={{ transform: dragX > 0 ? `translateX(${dragX}px)` : undefined }}
    >
      <div className="absolute inset-0 rounded-lg border border-amber-700/30 bg-gradient-to-b from-amber-700/20 to-transparent" />
      <span className="relative z-10 font-serif text-2xl font-bold tracking-widest text-amber-100 drop-shadow-md">
        책님
      </span>
      <span className="relative z-10 mt-2 font-serif text-sm tracking-wide text-amber-200/90">
        오늘의 운세
      </span>
      <p className="relative z-10 mt-6 text-xs text-amber-200/70">클릭하거나 살짝 당겨 보세요</p>
    </button>
  );
}
