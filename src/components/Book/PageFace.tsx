// ─────────────────────────────────────────────────────────────────────────────
// PageFace.tsx  –  페이지 한 면의 콘텐츠 렌더러 (테마 적용)
// ─────────────────────────────────────────────────────────────────────────────
import type { CSSProperties } from "react";

import type { ContentData, CoverData, PageData } from "@/components/Book/book.types";
import { useBookConfig } from "@/components/Book/bookHooks";

const fill: CSSProperties = {
  fontFamily: "'Georgia', serif",
  width: "100%",
  height: "100%",
};

function Cover({ d, zoomScale = 1 }: { d: CoverData; zoomScale?: number }) {
  const s = zoomScale;
  return (
    <div
      style={{
        ...fill,
        background: d.bg,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 40 * s,
        boxSizing: "border-box",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: 260 * s,
          height: 260 * s,
          borderRadius: "50%",
          border: `1px solid ${d.accent}28`,
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 180 * s,
          height: 180 * s,
          borderRadius: "50%",
          border: `1px solid ${d.accent}44`,
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: `linear-gradient(90deg,transparent,${d.accent},transparent)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 3,
          background: `linear-gradient(90deg,transparent,${d.accent},transparent)`,
        }}
      />
      <div
        style={{
          fontSize: 10 * s,
          letterSpacing: 6 * s,
          color: d.accent,
          marginBottom: 22 * s,
          textTransform: "uppercase",
        }}
      >
        ✦ Fortune ✦
      </div>
      <div
        style={{
          fontSize: 36 * s,
          fontWeight: 300,
          color: "#fff",
          textAlign: "center",
          lineHeight: 1.25,
          letterSpacing: 2 * s,
          whiteSpace: "pre-line",
          marginBottom: 18 * s,
        }}
      >
        {d.title}
      </div>
      <div
        style={{
          width: 36 * s,
          height: 1 * s,
          background: d.accent,
          margin: `0 auto ${18 * s}px`,
        }}
      />
      <div
        style={{
          fontSize: 11 * s,
          color: "#ffffff77",
          letterSpacing: 4 * s,
          textTransform: "uppercase",
        }}
      >
        {d.subtitle}
      </div>
    </div>
  );
}

function ContentPage({
  d,
  side,
  zoomScale = 1,
}: {
  d: ContentData;
  side?: "left" | "right";
  zoomScale?: number;
}) {
  const { theme } = useBookConfig();
  const accent = theme.contentPageAccent;
  const textColor = theme.contentPageText;
  const lineColor = theme.contentPageLineColor ?? "rgba(0,0,0,0.04)";

  const s = zoomScale;
  const outer = 36 * s;
  const spine = 16 * s;
  const padding =
    side === "left"
      ? `${32 * s}px ${spine}px ${32 * s}px ${outer}px`
      : side === "right"
        ? `${32 * s}px ${outer}px ${32 * s}px ${spine}px`
        : `${32 * s}px ${28 * s}px`;

  return (
    <div
      style={{
        ...fill,
        background: d.bg,
        display: "flex",
        flexDirection: "column",
        padding,
        boxSizing: "border-box",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {Array.from({ length: 16 }).map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: side === "right" ? spine : outer,
            right: side === "left" ? spine : outer,
            top: 88 * s + i * 22 * s,
            height: 1 * s,
            background: lineColor,
          }}
        />
      ))}
      <div
        style={{
          fontSize: 9 * s,
          letterSpacing: 4 * s,
          color: accent,
          textTransform: "uppercase",
          marginBottom: 4 * s,
          position: "relative",
        }}
      >
        {d.chapter}
      </div>
      <div
        style={{
          fontSize: 28 * s,
          marginBottom: 10 * s,
          position: "relative",
        }}
      >
        {d.img}
      </div>
      <div
        style={{
          fontSize: 19 * s,
          fontWeight: "bold",
          color: textColor,
          marginBottom: 14 * s,
          lineHeight: 1.2,
          position: "relative",
        }}
      >
        {d.title}
      </div>
      <div
        style={{
          width: 28 * s,
          height: 2 * s,
          background: accent,
          marginBottom: 14 * s,
          position: "relative",
        }}
      />
      <div
        style={{
          fontSize: 12.5 * s,
          color: textColor,
          lineHeight: 1.9,
          position: "relative",
          flex: 1,
        }}
      >
        {d.text}
      </div>
      <div
        style={{
          fontSize: 10 * s,
          color: accent,
          textAlign: "center",
          letterSpacing: 2 * s,
          position: "relative",
          marginTop: 8 * s,
        }}
      >
        — {d.pageNum} —
      </div>
    </div>
  );
}

function EmptyBack({ zoomScale = 1 }: { zoomScale?: number }) {
  const { emptyBackTitle, theme } = useBookConfig();
  const s = zoomScale;
  return (
    <div
      style={{
        ...fill,
        background: theme.emptyBackGradient,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          writingMode: "vertical-rl",
          color: theme.emptyBackTextColor,
          fontSize: 10 * s,
          letterSpacing: 5 * s,
          textTransform: "uppercase",
          fontFamily: "'Georgia', serif",
        }}
      >
        {emptyBackTitle}
      </div>
    </div>
  );
}

export function PageFace({
  data,
  side,
  zoomScale = 1,
}: {
  data: PageData | null | undefined;
  side?: "left" | "right";
  /** 1보다 크면 네이티브 확대 렌더링 (흐림 방지) */
  zoomScale?: number;
}) {
  if (!data) {
    return <EmptyBack zoomScale={zoomScale} />;
  }
  if (data.type === "cover") {
    return <Cover d={data} zoomScale={zoomScale} />;
  }
  if (data.type === "content") {
    return <ContentPage d={data} side={side} zoomScale={zoomScale} />;
  }
  return null;
}
