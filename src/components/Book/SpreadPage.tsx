// ─────────────────────────────────────────────────────────────────────────────
// SpreadPage.tsx  –  CSS 3D 회전으로 페이지를 뒤집는 단일 spread
// ─────────────────────────────────────────────────────────────────────────────
import { PageFace } from "@/components/Book/PageFace";
import type { SpreadData } from "@/components/Book/book.types";

interface Props {
  spread: SpreadData;
  rotateY: number;
  zIndex: number;
}

export function SpreadPage({ spread, rotateY, zIndex }: Props) {
  const shadow = Math.sin((-rotateY / 180) * Math.PI);

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
          borderRadius: "0 4px 4px 0",
          boxShadow: "inset -1px 0 8px rgba(0,0,0,0.06)",
        }}
      >
        <PageFace data={spread.front} side="right" />
        {shadow > 0.05 && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(to right,rgba(0,0,0,${shadow * 0.22}),transparent 45%)`,
              pointerEvents: "none",
            }}
          />
        )}
      </div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden" as const,
          transform: "rotateY(180deg)",
          overflow: "hidden",
          borderRadius: "4px 0 0 4px",
          boxShadow: "inset 1px 0 8px rgba(0,0,0,0.06)",
        }}
      >
        <PageFace data={spread.back ?? null} side="left" />
        {shadow > 0.05 && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(to left,rgba(0,0,0,${shadow * 0.18}),transparent 45%)`,
              pointerEvents: "none",
            }}
          />
        )}
      </div>
    </div>
  );
}
