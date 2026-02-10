import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

interface PageFlipProps {
  /** 현재 페이지 인덱스 (스토어에서 오는 값) */
  currentPage: number;
  /** 한 페이지의 내용을 렌더하는 함수 */
  renderPage: (pageIndex: number) => React.ReactNode;
  className?: string;
}

/** 한 장씩 넘어가는 3D 플립 애니메이션 */
export function PageFlip({ currentPage, renderPage, className }: PageFlipProps) {
  const [displayPage, setDisplayPage] = useState(currentPage);
  const [isFlipping, setIsFlipping] = useState(false);
  const prevPageRef = useRef(currentPage);

  useEffect(() => {
    if (currentPage === prevPageRef.current) {
      return;
    }
    const nextPage = currentPage;
    setIsFlipping(true);
    const t = setTimeout(() => {
      setDisplayPage(nextPage);
      prevPageRef.current = nextPage;
      setIsFlipping(false);
    }, 320);
    return () => clearTimeout(t);
  }, [currentPage]);

  return (
    <div className={cn("perspective-[1200px]", className)}>
      <div
        className="relative h-full w-full transition-transform duration-300 ease-[cubic-bezier(0.33,0,0.2,1)]"
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipping ? "rotateY(-180deg)" : "rotateY(0deg)",
        }}
      >
        <div
          className="absolute inset-0 overflow-hidden rounded-r-lg border border-amber-800/30 bg-amber-50 shadow-inner"
          style={{ backfaceVisibility: "hidden" }}
        >
          {renderPage(displayPage)}
        </div>
        <div
          className="absolute inset-0 overflow-hidden rounded-r-lg border border-amber-800/30 bg-amber-50 shadow-inner"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          {renderPage(currentPage)}
        </div>
      </div>
    </div>
  );
}
