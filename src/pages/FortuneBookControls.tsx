// ─────────────────────────────────────────────────────────────────────────────
// FortuneBookControls.tsx  –  운세 책 전용 컨트롤 (뽑기/조회 모드)
// ─────────────────────────────────────────────────────────────────────────────
/* eslint-disable react-refresh/only-export-components */
import type { BookControlProps } from "@/components/Book/Book3D";

function NavControls({
  flipped,
  total,
  accent,
  hintColor,
  btnForward,
  btnBackward,
}: {
  flipped: number;
  total: number;
  accent: string;
  hintColor: string;
  btnForward: () => void;
  btnBackward: () => void;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
      <button
        onClick={btnBackward}
        disabled={flipped === 0}
        style={{
          width: 42,
          height: 42,
          borderRadius: "50%",
          border: "1px solid rgba(255,255,255,0.25)",
          background: flipped === 0 ? "transparent" : "rgba(255,255,255,0.08)",
          color: flipped === 0 ? "rgba(255,255,255,0.2)" : hintColor,
          fontSize: 20,
          cursor: flipped === 0 ? "not-allowed" : "pointer",
        }}
      >
        ‹
      </button>
      <div style={{ display: "flex", gap: 7, alignItems: "center" }}>
        {Array.from({ length: total + 1 }).map((_, i) => (
          <div
            key={i}
            style={{
              width: i === flipped ? 22 : 6,
              height: 6,
              borderRadius: 3,
              background:
                i < flipped ? `${accent}55` : i === flipped ? accent : "rgba(255,255,255,0.2)",
            }}
          />
        ))}
      </div>
      <button
        onClick={btnForward}
        disabled={flipped >= total}
        style={{
          width: 42,
          height: 42,
          borderRadius: "50%",
          border: "1px solid rgba(255,255,255,0.25)",
          background: flipped >= total ? "transparent" : "rgba(255,255,255,0.08)",
          color: flipped >= total ? "rgba(255,255,255,0.2)" : hintColor,
          fontSize: 20,
          cursor: flipped >= total ? "not-allowed" : "pointer",
        }}
      >
        ›
      </button>
    </div>
  );
}

export function createFortuneControls(mode: "draw" | "browse") {
  return function renderFortuneControls(props: BookControlProps) {
    const {
      flipped,
      total,
      maxPage,
      pageInput,
      setPageInput,
      btnForward,
      btnBackward,
      startShuffle,
      stopShuffle,
      isShuffling,
      theme,
    } = props;
    const { accent, hintColor } = theme;
    const controls = (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
        }}
      >
        {mode === "draw" || isShuffling ? (
          <button
            type="button"
            onClick={isShuffling ? stopShuffle : startShuffle}
            style={{
              padding: "12px 28px",
              fontSize: 13,
              letterSpacing: 2,
              border: `1px solid ${accent}`,
              borderRadius: 8,
              background: isShuffling ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.08)",
              color: accent,
              cursor: isShuffling ? "default" : "pointer",
            }}
          >
            {isShuffling ? "탭해서 멈추기" : "오늘의 운세 뽑기"}
          </button>
        ) : (
          <>
            <NavControls
              flipped={flipped}
              total={total}
              accent={accent}
              hintColor={hintColor}
              btnForward={btnForward}
              btnBackward={btnBackward}
            />
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ color: hintColor, fontSize: 11 }}>쪽</span>
              <input
                type="text"
                inputMode="numeric"
                value={pageInput}
                onChange={e => setPageInput(e.target.value.replace(/\D/g, ""))}
                aria-label="쪽 번호"
                style={{
                  width: 72,
                  padding: "6px 10px",
                  fontSize: 12,
                  border: "1px solid rgba(255,255,255,0.25)",
                  borderRadius: 6,
                  background: "rgba(255,255,255,0.08)",
                  color: "#fff",
                  outline: "none",
                }}
              />
              <span style={{ color: hintColor, fontSize: 11 }}>/ {maxPage}</span>
            </div>
          </>
        )}
      </div>
    );

    return controls;
  };
}

export function FortuneSidebar({
  mode,
  setMode,
  theme,
  direction = "column",
}: {
  mode: "draw" | "browse";
  setMode: (m: "draw" | "browse") => void;
  theme: { accent: string; hintColor: string };
  direction?: "row" | "column";
}) {
  const { accent, hintColor } = theme;
  return (
    <div style={{ display: "flex", flexDirection: direction, gap: 6 }}>
      {(["draw", "browse"] as const).map(m => (
        <button
          key={m}
          type="button"
          onClick={() => setMode(m)}
          style={{
            padding: "8px 14px",
            fontSize: 11,
            letterSpacing: 1,
            border: `1px solid ${mode === m ? accent : "rgba(255,255,255,0.2)"}`,
            borderRadius: 6,
            background: mode === m ? `${accent}22` : "transparent",
            color: mode === m ? accent : hintColor,
            cursor: "pointer",
          }}
        >
          {m === "draw" ? "뽑기" : "조회"}
        </button>
      ))}
    </div>
  );
}
