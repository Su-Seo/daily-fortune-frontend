import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

/** 0°에서 -180°로 회전하는 책장 (등 쪽 축) */
function FlippingPage({
  content,
  pageClassName,
  flipDurationMs,
}: {
  content: React.ReactNode;
  pageClassName?: string;
  flipDurationMs: number;
}) {
  const [flipped, setFlipped] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setFlipped(true);
    });
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div
      className={cn("flex h-full w-full origin-left flex-col justify-between p-6", pageClassName)}
      style={{
        backfaceVisibility: "hidden",
        transform: flipped ? "rotateY(-180deg)" : "rotateY(0deg)",
        transition: `transform ${flipDurationMs}ms cubic-bezier(0.25, 0.1, 0.25, 1)`,
      }}
    >
      {content}
    </div>
  );
}

interface PageFlipProps {
  currentPage: number;
  renderPage: (pageIndex: number) => React.ReactNode;
  pageClassName?: string;
  className?: string;
}

const FLIP_DURATION_MS = 320;

/**
 * 실제 책처럼 오른쪽 페이지가 등(왼쪽 가장자리)을 축으로 넘어가는 효과.
 * 넘기는 페이지는 transform-origin: left로 왼쪽에 붙어 돌아가고,
 * 그 아래에 다음 페이지가 보이도록 함.
 */
export function PageFlip({ currentPage, renderPage, pageClassName, className }: PageFlipProps) {
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
    }, FLIP_DURATION_MS);
    return () => clearTimeout(t);
  }, [currentPage]);

  /* 플립 중이 아닐 때: 한 페이지만 표시 */
  if (!isFlipping) {
    return (
      <div className={cn("relative h-full w-full", className)}>
        <div
          className={cn(
            "flex h-full min-h-0 flex-col justify-between overflow-hidden p-6",
            pageClassName
          )}
        >
          {renderPage(displayPage)}
        </div>
      </div>
    );
  }

  /* 실제 책장 넘기기: 등(왼쪽) 축 기준으로 페이지가 왼쪽으로 접히며 넘어감 */
  return (
    <div className={cn("relative h-full w-full overflow-hidden", className)}>
      {/* 아래층: 넘긴 뒤 보일 새 페이지 */}
      <div
        className={cn("absolute inset-0 flex flex-col justify-between p-6", pageClassName)}
        style={{ zIndex: 0 }}
      >
        {renderPage(currentPage)}
      </div>
      {/* 위층: 넘어가는 중인 이전 페이지 (왼쪽 가장자리 기준 회전, 0° → -180°) */}
      <div
        className="absolute inset-0"
        style={{
          zIndex: 1,
          perspective: "1400px",
          transformStyle: "preserve-3d",
        }}
      >
        <FlippingPage
          pageClassName={pageClassName}
          flipDurationMs={FLIP_DURATION_MS}
          content={renderPage(displayPage)}
        />
      </div>
    </div>
  );
}
