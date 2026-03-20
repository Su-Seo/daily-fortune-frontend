// ─────────────────────────────────────────────────────────────────────────────
// SpreadPage.tsx  –  CSS 3D 회전으로 페이지를 뒤집는 단일 spread
// ─────────────────────────────────────────────────────────────────────────────
import { memo } from "react";

import { PageFace } from "@/components/Book/PageFace";
import type { SpreadData } from "@/components/Book/book.types";

interface Props {
  spread: SpreadData;
  spreadIndex: number;
  flipped: number;
  rotateY: number;
  zIndex: number;
}

export const SpreadPage = memo(({ spread, spreadIndex, flipped, rotateY, zIndex }: Props) => {
  const shadow = Math.sin((-rotateY / 180) * Math.PI);
  // 책 닫혀 있을 때(flipped=0) 표지만 radius 없음 (흰 코너 아티팩트 방지), 펼쳤을 때는 radius 적용
  const noRadius = flipped === 0 && spreadIndex === 0;
  const rightRadius = noRadius ? 0 : "0 4px 4px 0";
  const leftRadius = noRadius ? 0 : "4px 0 0 4px";

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: 0,
        width: "50%",
        height: "100%",
        transformOrigin: "left center",
        transformStyle: "preserve-3d",
        transform: `rotateY(${rotateY}deg)`,
        transition: "none",
        zIndex,
        willChange: "transform",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden" as const,
          overflow: "hidden",
          borderRadius: rightRadius,
          background: spread.front.bg,
          transform: "translateZ(0.5px)",
        }}
      >
        <PageFace data={spread.front} side="right" />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to right,rgba(0,0,0,0.22),transparent 45%)",
            pointerEvents: "none",
            opacity: shadow,
            willChange: "opacity",
          }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden" as const,
          transform: "rotateY(180deg) translateZ(0.5px)",
          overflow: "hidden",
          borderRadius: leftRadius,
          background: spread.back?.bg ?? "transparent",
        }}
      >
        <PageFace data={spread.back ?? null} side="left" />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to left,rgba(0,0,0,0.18),transparent 45%)",
            pointerEvents: "none",
            opacity: shadow,
            willChange: "opacity",
          }}
        />
      </div>
    </div>
  );
});
