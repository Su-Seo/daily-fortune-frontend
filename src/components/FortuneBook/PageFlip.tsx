import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

function FlippingPage({
  content,
  pageClassName,
  flipDurationMs,
  onComplete,
}: {
  content: React.ReactNode;
  pageClassName?: string;
  flipDurationMs: number;
  onComplete: () => void;
}) {
  const [flipped, setFlipped] = useState(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setFlipped(true);
    });
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    if (!flipped) {
      return;
    }
    const t = setTimeout(() => {
      onCompleteRef.current();
    }, flipDurationMs);
    return () => clearTimeout(t);
  }, [flipped, flipDurationMs]);

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
  /** 넘어가는(사라지는) 페이지 인덱스 */
  turningPageIndex: number;
  /** 넘긴 뒤 보일 다음 페이지 인덱스 */
  underPageIndex: number;
  renderPage: (pageIndex: number) => React.ReactNode;
  pageClassName?: string;
  className?: string;
  onFlipComplete: () => void;
}

const FLIP_DURATION_MS = 320;

/**
 * 오른쪽 페이지가 등(왼쪽) 축으로 넘어가며, 아래층에 다음 페이지가 보이게 함.
 * 애니메이션 끝나면 onFlipComplete 호출.
 */
export function PageFlip({
  turningPageIndex,
  underPageIndex,
  renderPage,
  pageClassName,
  className,
  onFlipComplete,
}: PageFlipProps) {
  return (
    <div className={cn("relative h-full w-full overflow-hidden", className)}>
      <div
        className={cn("absolute inset-0 flex flex-col justify-between p-6", pageClassName)}
        style={{ zIndex: 0 }}
      >
        {renderPage(underPageIndex)}
      </div>
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
          content={renderPage(turningPageIndex)}
          onComplete={onFlipComplete}
        />
      </div>
    </div>
  );
}
