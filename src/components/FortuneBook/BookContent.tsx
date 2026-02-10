import { useCallback, useEffect, useRef, useState } from "react";

import { CoverSpread3D, PageFace3D, SpreadPage3D } from "@/components/FortuneBook/Book3D";
import { FortunePageContent } from "@/components/FortuneBook/BookSpread";
import { Button } from "@/components/ui/button";

import { getBookTheme } from "@/config/bookThemes";
import { defaultBook } from "@/config/books";
import { cn } from "@/lib/utils";
import type { FortunePage } from "@/models/fortune";
import { useFortuneBookStore } from "@/stores/fortuneBookStore";

const { themeId, pages } = defaultBook;
const theme = getBookTheme(themeId);

const BOOK_WIDTH = 560;
const BOOK_HEIGHT = 390;

function getPage(pageIndex: number): FortunePage | undefined {
  return pages[pageIndex];
}

/** easeInOutCubic */
function ease(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/** RAF 플립 애니메이션 (from → to). 완료 시 onComplete 호출 */
function runFlip(
  from: number,
  to: number,
  onFrame: (rotateY: number) => void,
  onComplete: () => void
) {
  const dur = Math.max(200, (Math.abs(to - from) / 180) * 420);
  const t0 = performance.now();
  let rafId = 0;

  function tick(now: number) {
    const t = Math.min(1, (now - t0) / dur);
    const ry = from + (to - from) * ease(t);
    onFrame(ry);
    if (t < 1) {
      rafId = requestAnimationFrame(tick);
    } else {
      onFrame(to);
      requestAnimationFrame(() => onComplete());
    }
  }
  rafId = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(rafId);
}

/** 펼쳐진 책: 3D 회전 플립 + 드래그 (참고: 3d-book.jsx) */
export function BookContent() {
  const {
    leftPageIndex,
    rightPageIndex,
    isFlipping,
    isOpeningFromCover,
    setOpeningFromCover,
    resultPage,
    nextRightPageIndex,
    startFlip,
    flipOneForward,
    beginForwardDrag,
    clearForwardDragState,
    advanceAfterFlip,
    goBack,
    reset,
    setTotalPages,
  } = useFortuneBookStore();

  const totalPages = pages.length;
  const N = totalPages;

  const [flipRotateY, setFlipRotateY] = useState<number | null>(null);
  const [backFlipRotateY, setBackFlipRotateY] = useState<number | null>(null);
  const [backFlipPageIndex, setBackFlipPageIndex] = useState<number | null>(null);
  /** 표지 플립: 0 → -180 (표지가 넘어가며 1·2쪽 노출) */
  const [coverRotateY, setCoverRotateY] = useState(0);

  const bookRef = useRef<HTMLDivElement>(null);
  const animatingRef = useRef(false);
  const dragRef = useRef<{
    startX: number;
    idx: number;
    dir: "fwd" | "bwd";
    baseRight: number;
    baseLeft: number;
  } | null>(null);
  /** 드래그 중 최신 각도 (onUp에서 클로저 대신 사용) */
  const flipRotateYRef = useRef(0);
  const backFlipRotateYRef = useRef(-180);

  useEffect(() => {
    setTotalPages(totalPages);
  }, [totalPages, setTotalPages]);

  // 표지 플립: 열릴 때 표지가 넘어가며 왼쪽 1쪽·오른쪽 2쪽이 서서히 노출
  useEffect(() => {
    if (!isOpeningFromCover) {
      return;
    }
    setCoverRotateY(0);
    const dur = 520;
    const t0 = performance.now();
    let rafId = 0;
    function ease(t: number) {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }
    function tick(now: number) {
      const t = Math.min(1, (now - t0) / dur);
      const ry = 0 + (-180 - 0) * ease(t);
      setCoverRotateY(ry);
      if (t < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        setCoverRotateY(-180);
        requestAnimationFrame(() => setOpeningFromCover(false));
      }
    }
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [isOpeningFromCover, setOpeningFromCover]);

  const isResultVisible =
    resultPage !== null &&
    !isOpeningFromCover &&
    !isFlipping &&
    flipRotateY === null &&
    backFlipRotateY === null;
  const resultPageData = resultPage !== null ? getPage(resultPage) : null;

  // ── 앞으로 넘기기 RAF (isFlipping + nextRightPageIndex 시 한 장씩)
  useEffect(() => {
    if (!isFlipping || nextRightPageIndex === null || animatingRef.current) {
      return;
    }
    const page = getPage(rightPageIndex);
    if (!page) {
      return;
    }

    animatingRef.current = true;
    setFlipRotateY(0);

    const cancel = runFlip(0, -180, setFlipRotateY, () => {
      setFlipRotateY(null);
      animatingRef.current = false;
      advanceAfterFlip();
    });
    return cancel;
  }, [isFlipping, nextRightPageIndex, rightPageIndex, advanceAfterFlip]);

  const leftPage = getPage(leftPageIndex);
  const rightPage = getPage(rightPageIndex);
  const nextPage = nextRightPageIndex !== null ? getPage(nextRightPageIndex) : null;

  const canFlipForward =
    !isOpeningFromCover &&
    !isFlipping &&
    rightPageIndex < N - 1 &&
    flipRotateY === null &&
    backFlipRotateY === null;
  const canFlipBack =
    !isOpeningFromCover &&
    leftPageIndex > 0 &&
    flipRotateY === null &&
    backFlipRotateY === null &&
    !isFlipping;

  const handleBackward = useCallback(() => {
    if (!canFlipBack) {
      return;
    }
    animatingRef.current = true;
    const pageIdx = leftPageIndex;
    setBackFlipPageIndex(pageIdx);
    setBackFlipRotateY(-180);
    goBack();

    runFlip(-180, 0, setBackFlipRotateY, () => {
      setBackFlipRotateY(null);
      setBackFlipPageIndex(null);
      animatingRef.current = false;
    });
  }, [canFlipBack, leftPageIndex, goBack]);

  const onDown = useCallback(
    (clientX: number) => {
      if (animatingRef.current || !bookRef.current || isOpeningFromCover) {
        return;
      }
      const rect = bookRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const half = rect.width / 2;

      if (x > half && canFlipForward) {
        beginForwardDrag();
        dragRef.current = {
          startX: clientX,
          idx: rightPageIndex,
          dir: "fwd",
          baseRight: rightPageIndex,
          baseLeft: leftPageIndex,
        };
        flipRotateYRef.current = 0;
        setFlipRotateY(0);
      } else if (x <= half && canFlipBack) {
        dragRef.current = {
          startX: clientX,
          idx: leftPageIndex,
          dir: "bwd",
          baseRight: rightPageIndex,
          baseLeft: leftPageIndex,
        };
        backFlipRotateYRef.current = -180;
        setBackFlipPageIndex(leftPageIndex);
        setBackFlipRotateY(-180);
        goBack();
      }
    },
    [
      canFlipForward,
      canFlipBack,
      rightPageIndex,
      leftPageIndex,
      goBack,
      beginForwardDrag,
      isOpeningFromCover,
    ]
  );

  const onMove = useCallback((clientX: number) => {
    const d = dragRef.current;
    if (!d || !bookRef.current) {
      return;
    }
    const bookW = bookRef.current.offsetWidth;
    const half = bookW / 2;
    const dx = d.startX - clientX;

    if (d.dir === "fwd") {
      const ry = Math.min(0, Math.max(-180, -(dx / half) * 180));
      flipRotateYRef.current = ry;
      setFlipRotateY(ry);
    } else {
      const ry = Math.min(0, Math.max(-180, -180 + (-dx / half) * 180));
      backFlipRotateYRef.current = ry;
      setBackFlipRotateY(ry);
    }
  }, []);

  const onUp = useCallback(() => {
    const d = dragRef.current;
    if (!d) {
      return;
    }
    dragRef.current = null;

    if (d.dir === "fwd") {
      const ry = flipRotateYRef.current;
      if (ry < -55) {
        runFlip(ry, -180, setFlipRotateY, () => {
          setFlipRotateY(null);
          animatingRef.current = false;
          advanceAfterFlip();
        });
      } else {
        runFlip(ry, 0, setFlipRotateY, () => {
          setFlipRotateY(null);
          clearForwardDragState();
        });
      }
    } else {
      const ry = backFlipRotateYRef.current;
      if (ry > -125) {
        runFlip(ry, 0, setBackFlipRotateY, () => {
          setBackFlipRotateY(null);
          setBackFlipPageIndex(null);
          animatingRef.current = false;
        });
      } else {
        runFlip(ry, -180, setBackFlipRotateY, () => {
          setBackFlipRotateY(null);
          setBackFlipPageIndex(null);
          useFortuneBookStore.setState({
            leftPageIndex: d.baseLeft,
            rightPageIndex: d.baseRight,
          });
        });
      }
    }
  }, [advanceAfterFlip, clearForwardDragState]);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => onMove(e.clientX);
    const onMouseUp = () => onUp();
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [onMove, onUp]);

  const onMouseDown = useCallback((e: React.MouseEvent) => onDown(e.clientX), [onDown]);
  const onTouchStart = useCallback((e: React.TouchEvent) => onDown(e.touches[0].clientX), [onDown]);
  const onTouchMove = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();
      onMove(e.touches[0].clientX);
    },
    [onMove]
  );
  const onTouchEnd = useCallback(() => onUp(), [onUp]);

  if (isResultVisible && resultPageData) {
    return (
      <div
        className={cn(
          "fixed inset-0 z-40 flex items-center justify-center p-4",
          theme.resultZoom.overlay,
          "animate-in fade-in duration-300"
        )}
        onClick={e => e.target === e.currentTarget && reset()}
        role="presentation"
      >
        <div
          className={cn(
            "max-h-[85vh] w-full max-w-lg overflow-auto border border-dashed border-stone-400/70 bg-[#faf8f3] p-8 shadow-2xl",
            theme.resultZoom.pageWrapper,
            "animate-in zoom-in-95 duration-300"
          )}
          onClick={e => e.stopPropagation()}
        >
          <FortunePageContent
            fortuneText={resultPageData.text}
            pageNumber={resultPageData.id}
            className="min-h-0"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={reset}
            className={cn("mt-6", theme.actions.resetButton)}
          >
            처음부터 다시하기
          </Button>
        </div>
      </div>
    );
  }

  const leftData = leftPage ?? null;
  const rightData =
    flipRotateY !== null ? nextPage : backFlipRotateY !== null ? rightPage : (rightPage ?? null);

  return (
    <div className="flex flex-col items-center gap-8">
      <div
        className="flex flex-col items-center"
        style={{ perspective: "2400px", perspectiveOrigin: "50% 45%" }}
      >
        <div
          ref={bookRef}
          className="relative select-none"
          style={{
            width: BOOK_WIDTH,
            height: BOOK_HEIGHT,
            transformStyle: "preserve-3d",
            transform: "rotateX(6deg) rotateY(-4deg)",
            cursor: dragRef.current ? "grabbing" : "default",
          }}
          onMouseDown={onMouseDown}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {/* 왼쪽 고정 패널 (표지 플립 중에는 숨김 → 1쪽은 표지 뒷면으로만 서서히 노출) */}
          {leftPageIndex >= 0 && leftData && !isOpeningFromCover && (
            <div
              className="absolute top-0 left-0 z-0 overflow-hidden rounded-l border border-r-0 border-stone-400/70 bg-[#faf8f3] shadow-lg"
              style={{
                width: "50%",
                height: "100%",
                boxShadow: "-6px 4px 32px rgba(0,0,0,0.25)",
              }}
            >
              <div className="flex h-full flex-col p-6">
                <PageFace3D page={leftData} />
              </div>
            </div>
          )}

          {/* 오른쪽 고정 패널 */}
          <div
            className="absolute top-0 left-1/2 z-0 overflow-hidden rounded-r border border-l-0 border-stone-400/70 bg-[#faf8f3]"
            style={{
              width: "50%",
              height: "100%",
              boxShadow: "6px 4px 32px rgba(0,0,0,0.2)",
            }}
          >
            {rightData ? (
              <>
                {[3, 2, 1].map(n => (
                  <div
                    key={n}
                    className="absolute rounded-r border-stone-400/30"
                    style={{
                      top: n,
                      right: -n * 1.5,
                      bottom: n,
                      left: 0,
                      background: `rgba(215,205,190,${0.55 - n * 0.12})`,
                    }}
                  />
                ))}
                <div className="absolute inset-0 flex flex-col p-6">
                  <PageFace3D page={rightData} />
                </div>
              </>
            ) : (
              <div className="flex h-full items-center justify-center bg-gradient-to-l from-stone-900 to-stone-800">
                <span className="font-serif text-[10px] tracking-widest text-amber-600/60 uppercase [writing-mode:vertical-rl]">
                  The End
                </span>
              </div>
            )}
          </div>

          {/* 표지 플립 레이어: 앞=표지, 뒤=1쪽. 넘기면 왼쪽에 1쪽·오른쪽에 2쪽 노출 */}
          {isOpeningFromCover && (
            <CoverSpread3D
              rotateY={coverRotateY}
              backPage={getPage(0) ?? null}
              theme={theme}
              zIndex={500}
            />
          )}

          {/* 3D 앞으로 넘기는 레이어: 앞면=현재 오른쪽(2쪽), 뒷면=다음 쪽(3쪽) */}
          {!isOpeningFromCover && flipRotateY !== null && rightPage !== undefined && (
            <SpreadPage3D
              frontPage={rightPage}
              backPage={nextPage ?? null}
              rotateY={flipRotateY}
              zIndex={500}
            />
          )}

          {/* 3D 뒤로 넘기는 레이어: 앞면=가져오는 쪽, 뒷면=원래 오른쪽에 있던 쪽 */}
          {!isOpeningFromCover && backFlipRotateY !== null && backFlipPageIndex !== null && (
            <SpreadPage3D
              frontPage={getPage(backFlipPageIndex) ?? null}
              backPage={leftPageIndex >= 0 ? (getPage(leftPageIndex) ?? null) : null}
              rotateY={backFlipRotateY}
              zIndex={500}
            />
          )}

          {/* 책등 그림자 */}
          <div
            className="pointer-events-none"
            style={{
              position: "absolute",
              left: "calc(50% - 8px)",
              top: 0,
              width: 16,
              height: "100%",
              background:
                "linear-gradient(to right, rgba(0,0,0,0.36) 0%, rgba(0,0,0,0.04) 60%, transparent 100%)",
              zIndex: 600,
            }}
          />
        </div>

        <div
          className="mt-1 h-6 w-[500px] rounded-full"
          style={{
            background: "radial-gradient(ellipse, rgba(0,0,0,0.35) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* 하단 컨트롤 */}
      <div className="flex items-center gap-5">
        <button
          type="button"
          onClick={handleBackward}
          disabled={!canFlipBack}
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-full border text-xl transition-colors",
            canFlipBack
              ? "border-amber-700/50 bg-amber-50/80 text-amber-800 hover:bg-amber-100"
              : "cursor-not-allowed border-stone-300 bg-transparent text-stone-300"
          )}
          aria-label="이전 페이지"
        >
          ‹
        </button>

        <Button
          variant="outline"
          size="lg"
          onClick={() => startFlip()}
          disabled={
            isOpeningFromCover || isFlipping || flipRotateY !== null || backFlipRotateY !== null
          }
          className={cn("min-w-[200px]", theme.actions.flipButton)}
        >
          {isOpeningFromCover
            ? "펼치는 중…"
            : isFlipping || flipRotateY !== null
              ? "넘기는 중…"
              : "책 넘기기"}
        </Button>

        <button
          type="button"
          disabled={!canFlipForward}
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-full border text-xl transition-colors",
            canFlipForward
              ? "border-amber-700/50 bg-amber-50/80 text-amber-800 hover:bg-amber-100"
              : "cursor-not-allowed border-stone-300 bg-transparent text-stone-300"
          )}
          aria-label="다음 페이지"
          onClick={flipOneForward}
        >
          ›
        </button>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={reset} className={theme.actions.resetButton}>
          처음부터 다시하기
        </Button>
      </div>

      <p className="text-center font-serif text-xs tracking-wide text-stone-500">
        {rightPageIndex === 0 && "오른쪽 페이지를 드래그하거나 › 를 눌러 넘기세요"}
        {rightPageIndex > 0 && rightPageIndex < N && `${rightPageIndex + 1} / ${N}`}
        {rightPageIndex >= N - 1 && N > 0 && "— The End —"}
      </p>
    </div>
  );
}
