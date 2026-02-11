// ─────────────────────────────────────────────────────────────────────────────
// Book3D.tsx  –  메인 컴포넌트 (config 기반, 스타일 통일)
// ─────────────────────────────────────────────────────────────────────────────
import { useEffect, useState } from "react";

import { BookConfigProvider } from "@/components/Book/BookConfigProvider";
import { PageFace } from "@/components/Book/PageFace";
import { SpreadPage } from "@/components/Book/SpreadPage";
import type { BookConfig } from "@/components/Book/book.config";
import type { BookFlipResult } from "@/components/Book/useBookFlip";

function LeftPanel({ flipped, config }: { flipped: number; config: BookConfig }) {
  const total = config.spreads.length;
  const baseStyle = {
    position: "absolute" as const,
    left: 0,
    top: 0,
    width: "50%",
    height: "100%",
    borderRadius: "4px 0 0 4px",
    overflow: "hidden" as const,
    boxShadow: config.theme.panelShadow.left,
    zIndex: 0,
  };
  // flipped=0: 닫힌 책(앞표지) → 왼쪽 숨김, 오른쪽에 표지
  if (flipped === 0) {
    return null;
  }
  if (flipped === total) {
    return (
      <div style={baseStyle}>
        <PageFace data={null} side="left" />
      </div>
    );
  }

  return (
    <div style={baseStyle}>
      <PageFace data={config.spreads[flipped - 1].back ?? null} side="left" />
    </div>
  );
}

function RightPanel({
  flipped,
  config,
  isFlippingLast,
}: {
  flipped: number;
  config: BookConfig;
  isFlippingLast: boolean;
}) {
  const { theme } = config;
  const total = config.spreads.length;
  // flipped=total: 닫힌 책(뒤표지) → 오른쪽 숨김 (첫 표지와 반대)
  // 마지막 페이지 플립 중: 뒤에 페이지 없음 → 오른쪽 숨김 (순간적 페이지 보임 방지)
  if (flipped === total || isFlippingLast) {
    return null;
  }
  const data = config.spreads[flipped].front;

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: 0,
        width: "50%",
        height: "100%",
        borderRadius: "2px 4px 4px 2px",
        overflow: "hidden",
        boxShadow: theme.panelShadow.right,
        zIndex: 0,
      }}
    >
      {[3, 2, 1].map(n => (
        <div
          key={n}
          style={{
            position: "absolute",
            top: n,
            right: -n * 1.5,
            bottom: n,
            left: 2,
            background: `rgba(${theme.stackBgRgb},${0.55 - n * 0.12})`,
            borderRadius: "0 4px 4px 0",
          }}
        />
      ))}
      <PageFace data={data} side="right" />
    </div>
  );
}

function SpineShadow() {
  return (
    <div
      style={{
        position: "absolute",
        left: "calc(50% - 8px)",
        top: 0,
        width: 16,
        height: "100%",
        background:
          "linear-gradient(to right,rgba(0,0,0,0.36) 0%,rgba(0,0,0,0.04) 60%,transparent 100%)",
        zIndex: 600,
        pointerEvents: "none",
      }}
    />
  );
}

function Book3DInner({ config, bookFlip }: { config: BookConfig; bookFlip: BookFlipResult }) {
  const total = config.spreads.length;
  const {
    flipped,
    flip,
    isShuffling,
    bookRef,
    onMouseDown,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    stopShuffle,
  } = bookFlip;

  const { theme } = config;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Georgia', serif",
        userSelect: "none",
        padding: "20px",
        position: "relative",
      }}
    >
      <div
        style={{
          color: theme.hintColor,
          fontSize: 10,
          letterSpacing: 7,
          textTransform: "uppercase",
          marginBottom: 32,
        }}
      >
        ✦ {config.title} ✦
      </div>

      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div style={{ perspective: "2400px", perspectiveOrigin: "50% 45%" }}>
            <div style={{ position: "relative" }}>
              {isShuffling && (
                <div
                  role="button"
                  tabIndex={0}
                  onClick={stopShuffle}
                  onKeyDown={e => e.key === "Enter" && stopShuffle()}
                  style={{
                    position: "absolute",
                    inset: -40,
                    zIndex: 1000,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(0,0,0,0.3)",
                    borderRadius: 12,
                    cursor: "pointer",
                    color: theme.hintColor,
                    fontSize: 12,
                    letterSpacing: 2,
                  }}
                >
                  탭해서 멈추기
                </div>
              )}
              <div
                ref={bookRef}
                style={{
                  width: 560,
                  height: 390,
                  position: "relative",
                  transformStyle: "preserve-3d",
                  transform: "rotateX(6deg) rotateY(0deg)",
                }}
                onMouseDown={onMouseDown}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
              >
                <LeftPanel flipped={flipped} config={config} />
                <RightPanel
                  flipped={flipped}
                  config={config}
                  isFlippingLast={flip !== null && flip.idx === total - 1}
                />

                {config.spreads.map((spread, i) => {
                  const isTurned = i < flipped;
                  const isFlipping = flip?.idx === i;

                  if (isTurned && !isFlipping) {
                    return null;
                  }

                  return (
                    <SpreadPage
                      key={spread.id}
                      spread={spread}
                      rotateY={isFlipping && flip ? flip.rotateY : 0}
                      zIndex={isFlipping ? 500 : 200 + (total - i)}
                    />
                  );
                })}

                <SpineShadow />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export interface BookControlProps {
  flipped: number;
  total: number;
  maxPage: number;
  pageInput: string;
  setPageInput: (v: string) => void;
  btnForward: () => void;
  btnBackward: () => void;
  goToPageAnimated: (spread: number) => void;
  startShuffle: () => void;
  stopShuffle: () => void;
  isShuffling: boolean;
  theme: BookConfig["theme"];
}

export interface Book3DProps {
  config: BookConfig;
  /** useBookFlip 훅 결과 — 페이지가 훅을 호출하고 전달 */
  bookFlip: BookFlipResult;
}

const HIGHLIGHT_ZOOM = 1.5;
const PAGE_W = 280;
const PAGE_H = 390;

function HighlightOverlay({
  config,
  flipped,
  highlightSide,
  onClose,
}: {
  config: BookConfig;
  flipped: number;
  highlightSide: "left" | "right";
  onClose: () => void;
}) {
  const total = config.spreads.length;
  const data =
    highlightSide === "left"
      ? flipped > 0
        ? (config.spreads[flipped - 1].back ?? null)
        : null
      : flipped < total
        ? config.spreads[flipped].front
        : null;

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  if (!data) {
    return null;
  }

  const w = PAGE_W * HIGHLIGHT_ZOOM;
  const h = PAGE_H * HIGHLIGHT_ZOOM;
  const flyFrom = highlightSide === "left" ? -180 : 180;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClose}
      onKeyDown={e => e.key === "Enter" && onClose()}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: mounted ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0)",
        cursor: "pointer",
        transition: "background 0.4s ease-out",
      }}
    >
      <div
        style={{
          width: w,
          height: h,
          borderRadius: 8,
          overflow: "hidden",
          boxShadow: "0 16px 48px rgba(0,0,0,0.5)",
          transform: mounted
            ? "translate(0, 0) scale(1)"
            : `translate(${flyFrom}px, 40px) scale(0.5)`,
          opacity: mounted ? 1 : 0.6,
          transition: "transform 0.55s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.4s ease-out",
        }}
      >
        <PageFace data={data} side={highlightSide} zoomScale={HIGHLIGHT_ZOOM} />
      </div>
    </div>
  );
}

export default function Book3D({ config, bookFlip }: Book3DProps) {
  return (
    <BookConfigProvider config={config}>
      <Book3DInner config={config} bookFlip={bookFlip} />
      {bookFlip.highlightSide && (
        <HighlightOverlay
          config={config}
          flipped={bookFlip.flipped}
          highlightSide={bookFlip.highlightSide}
          onClose={bookFlip.clearHighlight}
        />
      )}
    </BookConfigProvider>
  );
}
