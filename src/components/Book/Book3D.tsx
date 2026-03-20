// ─────────────────────────────────────────────────────────────────────────────
// Book3D.tsx  –  메인 컴포넌트 (config 기반, 스타일 통일)
// ─────────────────────────────────────────────────────────────────────────────
import { memo, useCallback, useEffect, useRef, useState } from "react";

import { toBlob, toPng } from "html-to-image";
import { Copy, Download, Maximize2, Share2, X } from "lucide-react";

import { BookConfigProvider } from "@/components/Book/BookConfigProvider";
import { PageFace } from "@/components/Book/PageFace";
import { SpreadPage } from "@/components/Book/SpreadPage";
import type { BookConfig } from "@/components/Book/book.config";
import type { BookFlipResult } from "@/components/Book/useBookFlip";

const HIGHLIGHT_ZOOM = 1.5;
const PAGE_W = 280;
const PAGE_H = 390;

/** 페이지 테마에 어울리는 확대 버튼 스타일 생성 */
function makeHighlightBtnStyle(accent: string, scale: number) {
  const s = scale;
  return {
    position: "absolute" as const,
    top: 8 * s,
    width: 24 * s,
    height: 24 * s,
    borderRadius: 4 * s,
    border: `1px solid ${accent}44`,
    background: `${accent}18`,
    color: accent,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
    transition: "background 0.2s, border-color 0.2s",
    fontFamily: "'Georgia', serif",
  };
}

const LeftPanel = memo(({ flipped, config }: { flipped: number; config: BookConfig }) => {
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
    transform: "translateZ(0)",
    willChange: "contents" as const,
  };
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
});

const RightPanel = memo(
  ({
    flipped,
    config,
    isFlippingLast,
  }: {
    flipped: number;
    config: BookConfig;
    isFlippingLast: boolean;
  }) => {
    const { theme } = config;
    const total = config.spreads.length;
    if (flipped === total || isFlippingLast) {
      return null;
    }
    const data = config.spreads[flipped].front;
    const showStack = flipped > 0;

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
          transform: "translateZ(0)",
          willChange: "contents" as const,
        }}
      >
        {showStack &&
          [3, 2, 1].map(n => (
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
);

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
  const { flipped, flip, isShuffling, bookRef, onMouseDown, stopShuffle } = bookFlip;

  const { theme } = config;

  const [bookScale, setBookScale] = useState(() => {
    const available = window.innerWidth - 40;
    return available < PAGE_W * 2 ? available / (PAGE_W * 2) : 1;
  });

  useEffect(() => {
    const update = () => {
      const available = window.innerWidth - 40;
      setBookScale(available < PAGE_W * 2 ? available / (PAGE_W * 2) : 1);
    };
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

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
          <div
            style={{
              position: "relative",
              width: PAGE_W * 2 * bookScale,
              height: PAGE_H * bookScale,
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                transformOrigin: "top left",
                transform: `scale(${bookScale})`,
              }}
            >
              <div
                style={{
                  perspective: "2400px",
                  perspectiveOrigin: "50% 45%",
                }}
              >
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
                      touchAction: "none",
                    }}
                    onMouseDown={onMouseDown}
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

                      // 모바일 GPU 부담 완화: 현재 페이지 근처만 렌더링
                      if (!isFlipping && i > flipped + 2) {
                        return null;
                      }

                      return (
                        <SpreadPage
                          key={spread.id}
                          spread={spread}
                          spreadIndex={i}
                          flipped={flipped}
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

            {/* 하이라이트(확대) 버튼 — 3D container 밖, book sizing wrapper 위에 오버레이 */}
            {!isShuffling && flip === null && (
              <>
                {flipped > 0 &&
                  flipped < total &&
                  config.spreads[flipped - 1].back?.type === "content" && (
                    <button
                      onClick={() => bookFlip.openHighlight("left")}
                      style={{
                        ...makeHighlightBtnStyle(config.theme.contentPageAccent, bookScale),
                        left: (280 - 42) * bookScale,
                      }}
                    >
                      <Maximize2 size={11 * bookScale} />
                    </button>
                  )}
                {flipped < total && config.spreads[flipped].front?.type === "content" && (
                  <button
                    onClick={() => bookFlip.openHighlight("right")}
                    style={{
                      ...makeHighlightBtnStyle(config.theme.contentPageAccent, bookScale),
                      right: 8 * bookScale,
                    }}
                  >
                    <Maximize2 size={11 * bookScale} />
                  </button>
                )}
              </>
            )}
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

const flutterKeyframes = `
  @keyframes paperFlutterLeft {
    0% { transform: translate(-180px, 45px) scale(0.5) rotateZ(-16deg) rotateX(6deg); opacity: 0.7; }
    33% { transform: translate(-100px, 10px) scale(0.72) rotateZ(14deg) rotateX(3deg); opacity: 0.88; }
    66% { transform: translate(-35px, -3px) scale(0.9) rotateZ(-12deg) rotateX(1deg); opacity: 0.97; }
    100% { transform: translate(0, 0) scale(1) rotateZ(0deg) rotateX(0deg); opacity: 1; }
  }
  @keyframes paperFlutterRight {
    0% { transform: translate(180px, 45px) scale(0.5) rotateZ(16deg) rotateX(6deg); opacity: 0.7; }
    33% { transform: translate(100px, 10px) scale(0.72) rotateZ(-14deg) rotateX(3deg); opacity: 0.88; }
    66% { transform: translate(35px, -3px) scale(0.9) rotateZ(12deg) rotateX(1deg); opacity: 0.97; }
    100% { transform: translate(0, 0) scale(1) rotateZ(0deg) rotateX(0deg); opacity: 1; }
  }
`;

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
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const [saving, setSaving] = useState(false);
  const [sharing, setSharing] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const calcScale = useCallback(() => {
    const btnArea = 52;
    return Math.min(
      1,
      (window.innerWidth * 0.92) / (PAGE_W * HIGHLIGHT_ZOOM),
      (window.innerHeight * 0.85 - btnArea) / (PAGE_H * HIGHLIGHT_ZOOM)
    );
  }, []);

  const [overlayScale, setOverlayScale] = useState(calcScale);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    const onResize = () => setOverlayScale(calcScale());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [calcScale]);

  const handleCopy = useCallback(async () => {
    if (!data || data.type !== "content") {
      return;
    }
    const text = `${data.title}\n\n${data.text}`;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // clipboard API 미지원 환경 fallback
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [data]);

  const getCardBlob = useCallback(async () => {
    if (!cardRef.current) {
      return null;
    }
    return toBlob(cardRef.current, { pixelRatio: 2 });
  }, []);

  const handleSave = useCallback(async () => {
    if (!cardRef.current || saving) {
      return;
    }
    setSaving(true);
    try {
      const dataUrl = await toPng(cardRef.current, { pixelRatio: 2 });
      const link = document.createElement("a");
      link.download = "fortune.png";
      link.href = dataUrl;
      link.click();
    } finally {
      setSaving(false);
    }
  }, [saving]);

  const handleShare = useCallback(async () => {
    if (sharing) {
      return;
    }
    setSharing(true);
    try {
      // 모바일 공유 시트 분기: blob을 먼저 생성
      const blob = await getCardBlob();
      if (!blob) {
        return;
      }
      const file = new File([blob], "fortune.png", { type: "image/png" });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ title: "오늘의 운세", files: [file] });
        return;
      }
    } catch (err) {
      console.error("공유 실패:", err);
    } finally {
      setSharing(false);
    }
  }, [sharing, getCardBlob]);

  // 데스크톱 이미지 복사 — clipboard.write를 클릭 즉시 호출해야 user gesture 유지
  const handleImageCopy = useCallback(() => {
    if (sharing) {
      return;
    }
    setSharing(true);

    // ClipboardItem에 Promise를 넘겨 clipboard.write는 동기적으로 호출
    const blobPromise = (async () => {
      const blob = await getCardBlob();
      if (!blob) {
        throw new Error("blob 생성 실패");
      }
      // canvas 경유로 순수 PNG blob 생성
      const img = new Image();
      const url = URL.createObjectURL(blob);
      img.src = url;
      await new Promise<void>(r => {
        img.onload = () => r();
      });
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      canvas.getContext("2d")!.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      return new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(b => (b ? resolve(b) : reject(new Error("toBlob failed"))), "image/png");
      });
    })();

    navigator.clipboard
      .write([new ClipboardItem({ "image/png": blobPromise })])
      .then(() => {
        setShared(true);
        setTimeout(() => setShared(false), 1500);
      })
      .catch(err => {
        console.error("이미지 복사 실패:", err);
      })
      .finally(() => {
        setSharing(false);
      });
  }, [sharing, getCardBlob]);

  if (!data) {
    return null;
  }

  const w = PAGE_W * HIGHLIGHT_ZOOM * overlayScale;
  const h = PAGE_H * HIGHLIGHT_ZOOM * overlayScale;
  const animationName = highlightSide === "left" ? "paperFlutterLeft" : "paperFlutterRight";
  const isContent = data.type === "content";

  const actionBtnStyle = {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "8px 14px",
    borderRadius: 8,
    border: "1px solid rgba(255,255,255,0.25)",
    background: "rgba(255,255,255,0.15)",
    color: "#fff",
    fontSize: 13,
    cursor: "pointer",
    transition: "background 0.2s",
  } as const;

  return (
    <>
      <style>{flutterKeyframes}</style>
      {/* 배경 클릭 시 닫기 */}
      <div
        role="button"
        tabIndex={0}
        onClick={onClose}
        onKeyDown={e => e.key === "Escape" && onClose()}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 2000,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          overflowY: "auto",
          padding: "24px 0",
          background: mounted ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0)",
          cursor: "default",
          transition: "background 0.4s ease-out",
        }}
      >
        {/* X 닫기 버튼 */}
        <button
          onClick={onClose}
          style={{
            position: "fixed",
            top: 18,
            right: 18,
            zIndex: 2010,
            width: 40,
            height: 40,
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.3)",
            background: "rgba(0,0,0,0.6)",
            color: "#fff",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background 0.2s",
          }}
        >
          <X size={20} />
        </button>

        {/* 카드 영역 — 클릭해도 닫히지 않음 */}
        <div
          onClick={e => e.stopPropagation()}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div
            ref={cardRef}
            style={{
              width: w,
              height: h,
              borderRadius: 8,
              overflow: "hidden",
              boxShadow: "0 16px 48px rgba(0,0,0,0.5)",
              transformStyle: "preserve-3d",
              perspective: "1200px",
              animation: mounted
                ? `${animationName} 0.85s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`
                : "none",
              opacity: mounted ? 1 : 0,
            }}
          >
            <PageFace data={data} side={highlightSide} zoomScale={HIGHLIGHT_ZOOM * overlayScale} />
          </div>

          {/* 액션 버튼들 */}
          {isContent && mounted && (
            <div
              style={{
                display: "flex",
                gap: 10,
                opacity: mounted ? 1 : 0,
                transition: "opacity 0.4s ease-out 0.6s",
              }}
            >
              <button onClick={handleCopy} style={actionBtnStyle}>
                <Copy size={16} />
                {copied ? "복사됨!" : "운세 복사"}
              </button>
              <button onClick={handleSave} disabled={saving} style={actionBtnStyle}>
                <Download size={16} />
                {saving ? "저장 중..." : "이미지 저장"}
              </button>
              {navigator.canShare?.({
                files: [new File([], "t.png", { type: "image/png" })],
              }) ? (
                <button onClick={handleShare} disabled={sharing} style={actionBtnStyle}>
                  <Share2 size={16} />
                  공유
                </button>
              ) : (
                <button onClick={handleImageCopy} disabled={sharing} style={actionBtnStyle}>
                  <Copy size={16} />
                  {shared ? "복사됨!" : "이미지 복사"}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </>
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
