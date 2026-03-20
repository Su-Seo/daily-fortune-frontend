// ─────────────────────────────────────────────────────────────────────────────
// useBookFlip.ts  –  페이지 뒤집기 상태 · 드래그 · RAF 애니메이션 훅
// ─────────────────────────────────────────────────────────────────────────────
import { type MouseEvent, type RefObject, useCallback, useEffect, useRef, useState } from "react";

import type { FlipSpeedConfig } from "@/components/Book/book.config";
import type { FlipState } from "@/components/Book/book.types";

const THRESHOLD_FWD = 0.31;
const THRESHOLD_BWD = 0.69;

interface DragState {
  startX: number;
  idx: number;
  dir: "fwd" | "bwd";
  baseFlipped: number;
}

const SHUFFLE_INTERVAL_MS = 9;

export type HighlightSide = "left" | "right" | null;

export interface BookFlipResult {
  flipped: number;
  flip: FlipState | null;
  /** 셔플 모드 여부 (탭하면 멈춤) */
  isShuffling: boolean;
  /** 탭 멈춤 시 하이라이트할 쪽 (left|right) */
  highlightSide: HighlightSide;
  /** 하이라이트 오버레이 닫기 */
  clearHighlight: () => void;
  /** 수동으로 하이라이트 열기 */
  openHighlight: (side: "left" | "right") => void;
  bookRef: RefObject<HTMLDivElement | null>;
  btnForward: () => void;
  btnBackward: () => void;
  /** 지정한 스프레드(0~total)로 즉시 이동 */
  goToPage: (page: number) => void;
  /** 지정한 스프레드로 diff만큼 찰라락 애니메이션으로 이동 */
  goToPageAnimated: (targetSpread: number) => void;
  /** 셔플 시작 (빠르게 페이지 넘기기, 탭하면 멈춤) */
  startShuffle: () => void;
  /** 셔플 즉시 정지 */
  stopShuffle: () => void;
  onMouseDown: (e: MouseEvent<HTMLDivElement>) => void;
}

const DEFAULT_SINGLE_MS = 660;
const DEFAULT_MULTI_MS = 200;

export function useBookFlip(total: number, flipSpeed?: FlipSpeedConfig | null): BookFlipResult {
  const singleMs = flipSpeed?.single ?? DEFAULT_SINGLE_MS;
  const multiMs = flipSpeed?.multi ?? DEFAULT_MULTI_MS;

  const [flipped, setFlipped] = useState<number>(0);
  const [flip, setFlip] = useState<FlipState | null>(null);
  const [isShuffling, setIsShuffling] = useState(false);
  const [highlightSide, setHighlightSide] = useState<"left" | "right" | null>(null);

  const bookRef = useRef<HTMLDivElement>(null);
  const flippedRef = useRef(flipped);
  flippedRef.current = flipped;
  const shuffleActiveRef = useRef(false);
  const shuffleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef = useRef<number | null>(null);
  const animating = useRef<boolean>(false);
  const sequenceInProgress = useRef<boolean>(false);
  const drag = useRef<DragState | null>(null);

  const runAnim = useCallback(
    (idx: number, from: number, to: number, onComplete: () => void, durationMs?: number) => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
      animating.current = true;

      const dur = durationMs ?? Math.max(80, (Math.abs(to - from) / 180) * singleMs);
      const t0 = performance.now();

      function tick(now: number) {
        const t = Math.min(1, (now - t0) / dur);
        const e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

        if (t < 1) {
          setFlip({ idx, rotateY: from + (to - from) * e });
          rafRef.current = requestAnimationFrame(tick);
        } else {
          setFlip({ idx, rotateY: to });
          animating.current = false;
          requestAnimationFrame(onComplete);
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    },
    [singleMs]
  );

  const btnForward = useCallback(() => {
    setHighlightSide(null);
    if (animating.current || sequenceInProgress.current || flipped >= total) {
      return;
    }
    const idx = flipped;
    setFlip({ idx, rotateY: 0 });
    runAnim(idx, 0, -180, () => {
      setFlipped(f => f + 1);
      setFlip(null);
    });
  }, [flipped, total, runAnim]);

  const btnBackward = useCallback(() => {
    setHighlightSide(null);
    if (animating.current || sequenceInProgress.current || flipped <= 0) {
      return;
    }
    const idx = flipped - 1;
    setFlipped(f => f - 1);
    setFlip({ idx, rotateY: -180 });
    runAnim(idx, -180, 0, () => setFlip(null));
  }, [flipped, runAnim]);

  const startDrag = useCallback(
    (clientX: number) => {
      if (animating.current || sequenceInProgress.current || !bookRef.current) {
        return;
      }
      const { left, width } = bookRef.current.getBoundingClientRect();
      const x = clientX - left;
      const half = width / 2;

      if (x > half && flipped < total) {
        drag.current = {
          startX: clientX,
          idx: flipped,
          dir: "fwd",
          baseFlipped: flipped,
        };
        setFlip({ idx: flipped, rotateY: 0 });
      } else if (x <= half && flipped > 0) {
        const idx = flipped - 1;
        drag.current = {
          startX: clientX,
          idx,
          dir: "bwd",
          baseFlipped: flipped,
        };
        setFlipped(f => f - 1);
        setFlip({ idx, rotateY: -180 });
      }
    },
    [flipped, total]
  );

  const moveDrag = useCallback((clientX: number) => {
    if (!drag.current || animating.current || !bookRef.current) {
      return;
    }
    const half = bookRef.current.getBoundingClientRect().width / 2;
    const dx = drag.current.startX - clientX;

    const ry =
      drag.current.dir === "fwd"
        ? Math.min(0, Math.max(-180, -(dx / half) * 180))
        : Math.min(0, Math.max(-180, -180 + (-dx / half) * 180));

    setFlip({ idx: drag.current.idx, rotateY: ry });
  }, []);

  const endDrag = useCallback(() => {
    if (!drag.current) {
      return;
    }
    const { idx, dir, baseFlipped } = drag.current;
    drag.current = null;

    setFlip(prev => {
      if (!prev) {
        return null;
      }
      const progress = -prev.rotateY / 180;

      if (dir === "fwd") {
        if (progress > THRESHOLD_FWD) {
          runAnim(idx, prev.rotateY, -180, () => {
            setFlipped(f => f + 1);
            setFlip(null);
          });
        } else {
          runAnim(idx, prev.rotateY, 0, () => setFlip(null));
        }
      } else {
        if (progress < THRESHOLD_BWD) {
          runAnim(idx, prev.rotateY, 0, () => setFlip(null));
        } else {
          runAnim(idx, prev.rotateY, -180, () => {
            setFlipped(baseFlipped);
            setFlip(null);
          });
        }
      }
      return prev;
    });
  }, [runAnim]);

  const goToPage = useCallback(
    (page: number) => {
      setHighlightSide(null);
      if (animating.current) {
        return;
      }
      drag.current = null;
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
      rafRef.current = null;
      setFlip(null);
      setFlipped(Math.max(0, Math.min(total, Math.floor(page))));
    },
    [total]
  );

  const clearHighlight = useCallback(() => setHighlightSide(null), []);
  const openHighlight = useCallback((side: "left" | "right") => setHighlightSide(side), []);

  const stopShuffle = useCallback(() => {
    shuffleActiveRef.current = false;
    if (shuffleTimeoutRef.current !== null) {
      clearTimeout(shuffleTimeoutRef.current);
      shuffleTimeoutRef.current = null;
    }
    const { current } = flippedRef;
    if (current <= 0) {
      setHighlightSide("right");
    } else if (current >= total) {
      setHighlightSide("left");
    } else {
      setHighlightSide(Math.random() < 0.5 ? "left" : "right");
    }
    setIsShuffling(false);
  }, [total]);

  const startShuffle = useCallback(() => {
    setHighlightSide(null);
    if (shuffleActiveRef.current || animating.current || sequenceInProgress.current) {
      return;
    }
    shuffleActiveRef.current = true;
    setIsShuffling(true);
    drag.current = null;

    const shuffleStep = (current: number) => {
      if (!shuffleActiveRef.current) {
        return;
      }
      if (current >= total) {
        goToPage(0);
        shuffleTimeoutRef.current = setTimeout(() => shuffleStep(0), SHUFFLE_INTERVAL_MS);
        return;
      }
      const idx = current;
      setFlip({ idx, rotateY: 0 });
      runAnim(
        idx,
        0,
        -180,
        () => {
          setFlipped(current + 1);
          setFlip(null);
          if (shuffleActiveRef.current) {
            shuffleTimeoutRef.current = setTimeout(
              () => shuffleStep(current + 1),
              SHUFFLE_INTERVAL_MS
            );
          } else {
            setIsShuffling(false);
          }
        },
        multiMs
      );
    };

    shuffleStep(flipped);
  }, [flipped, total, goToPage, runAnim, multiMs]);

  const goToPageAnimated = useCallback(
    (targetSpread: number) => {
      setHighlightSide(null);
      if (animating.current || sequenceInProgress.current) {
        return;
      }
      const target = Math.max(0, Math.min(total, Math.floor(targetSpread)));
      const start = flipped;
      const diff = target - start;
      if (diff === 0) {
        return;
      }

      sequenceInProgress.current = true;
      const totalSteps = Math.abs(diff);
      const dur = totalSteps > 1 ? multiMs : undefined;

      let stepIndex = 0;

      const runNext = () => {
        if (stepIndex >= totalSteps) {
          sequenceInProgress.current = false;
          return;
        }

        if (diff > 0) {
          const idx = start + stepIndex;
          setFlip({ idx, rotateY: 0 });
          runAnim(
            idx,
            0,
            -180,
            () => {
              setFlipped(f => f + 1);
              setFlip(null);
              stepIndex++;
              if (stepIndex < totalSteps) {
                requestAnimationFrame(runNext);
              } else {
                sequenceInProgress.current = false;
              }
            },
            dur
          );
        } else {
          const idx = start - stepIndex - 1;
          setFlipped(f => f - 1);
          setFlip({ idx, rotateY: -180 });
          runAnim(
            idx,
            -180,
            0,
            () => {
              setFlip(null);
              stepIndex++;
              if (stepIndex < totalSteps) {
                requestAnimationFrame(runNext);
              } else {
                sequenceInProgress.current = false;
              }
            },
            dur
          );
        }
      };
      runNext();
    },
    [flipped, total, runAnim, multiMs]
  );

  const onMouseDown = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (shuffleActiveRef.current) {
        stopShuffle();
      } else {
        startDrag(e.clientX);
      }
    },
    [startDrag, stopShuffle]
  );
  const onMouseMove = useCallback((e: globalThis.MouseEvent) => moveDrag(e.clientX), [moveDrag]);
  const onMouseUp = useCallback(() => endDrag(), [endDrag]);

  const onTouchStartNative = useCallback(
    (e: globalThis.TouchEvent) => {
      if (shuffleActiveRef.current) {
        stopShuffle();
      } else {
        startDrag(e.touches[0].clientX);
      }
    },
    [startDrag, stopShuffle]
  );
  const onTouchMoveNative = useCallback(
    (e: globalThis.TouchEvent) => {
      e.preventDefault();
      moveDrag(e.touches[0].clientX);
    },
    [moveDrag]
  );
  const onTouchEndNative = useCallback(() => endDrag(), [endDrag]);

  // 터치 이벤트를 { passive: false }로 직접 등록 — React의 passive 기본값 문제 해결
  useEffect(() => {
    const el = bookRef.current;
    if (!el) {
      return;
    }
    el.addEventListener("touchstart", onTouchStartNative, { passive: false });
    el.addEventListener("touchmove", onTouchMoveNative, { passive: false });
    el.addEventListener("touchend", onTouchEndNative);
    return () => {
      el.removeEventListener("touchstart", onTouchStartNative);
      el.removeEventListener("touchmove", onTouchMoveNative);
      el.removeEventListener("touchend", onTouchEndNative);
    };
  }, [onTouchStartNative, onTouchMoveNative, onTouchEndNative]);

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
      if (shuffleTimeoutRef.current !== null) {
        clearTimeout(shuffleTimeoutRef.current);
      }
    };
  }, [onMouseMove, onMouseUp]);

  return {
    flipped,
    flip,
    isShuffling,
    highlightSide,
    clearHighlight,
    openHighlight,
    bookRef,
    btnForward,
    btnBackward,
    goToPage,
    goToPageAnimated,
    startShuffle,
    stopShuffle,
    onMouseDown,
  };
}
