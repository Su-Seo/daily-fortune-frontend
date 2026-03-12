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
    <>
      <style>{`
        .fnav-btn { transition: background 0.1s; }
        .fnav-btn:not(:disabled):active { background: rgba(255,255,255,0.2) !important; }
      `}</style>
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <button
          className="fnav-btn"
          onClick={btnBackward}
          disabled={flipped === 0}
          style={{
            width: 42,
            height: 42,
            flexShrink: 0,
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.25)",
            background: flipped === 0 ? "transparent" : "rgba(255,255,255,0.08)",
            color: flipped === 0 ? "rgba(255,255,255,0.2)" : hintColor,
            fontSize: 20,
            cursor: flipped === 0 ? "not-allowed" : "pointer",
            padding: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            lineHeight: 1,
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: 0,
              height: 0,
              borderTop: "5px solid transparent",
              borderBottom: "5px solid transparent",
              borderRight: "7px solid currentColor",
            }}
          />
        </button>
        <div
          style={{
            display: "flex",
            gap: 5,
            alignItems: "center",
            flexWrap: "wrap",
            justifyContent: "center",
            maxWidth: 200,
            overflow: "hidden",
          }}
        >
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
          className="fnav-btn"
          onClick={btnForward}
          disabled={flipped >= total}
          style={{
            width: 42,
            height: 42,
            flexShrink: 0,
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.25)",
            background: flipped >= total ? "transparent" : "rgba(255,255,255,0.08)",
            color: flipped >= total ? "rgba(255,255,255,0.2)" : hintColor,
            fontSize: 20,
            cursor: flipped >= total ? "not-allowed" : "pointer",
            padding: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            lineHeight: 1,
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: 0,
              height: 0,
              borderTop: "5px solid transparent",
              borderBottom: "5px solid transparent",
              borderLeft: "7px solid currentColor",
            }}
          />
        </button>
      </div>
    </>
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
          width: "100%",
        }}
      >
        {mode === "draw" || isShuffling ? (
          <button
            type="button"
            className="fnav-btn"
            onClick={isShuffling ? stopShuffle : startShuffle}
            style={{
              width: "100%",
              padding: "12px 0",
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
                  width: 64,
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

export function ModeToggle({
  mode,
  setMode,
  theme,
}: {
  mode: "draw" | "browse";
  setMode: (m: "draw" | "browse") => void;
  theme: { accent: string; hintColor: string };
}) {
  const { accent, hintColor } = theme;
  return (
    <>
      <style>{`
        .fmode-tab { transition: box-shadow 0.1s; }
        .fmode-tab:active { box-shadow: inset 0 0 0 1000px rgba(255,255,255,0.18); }
      `}</style>
      <div style={{ display: "flex", gap: 0, width: "100%" }}>
        {(["draw", "browse"] as const).map(m => (
          <button
            key={m}
            type="button"
            className="fmode-tab"
            onClick={() => setMode(m)}
            style={{
              flex: 1,
              padding: "8px 0",
              fontSize: 12,
              letterSpacing: 1,
              border: "none",
              borderRadius: m === "draw" ? "7px 0 0 0" : "0 7px 0 0",
              background: mode === m ? `${accent}33` : "transparent",
              color: mode === m ? accent : hintColor,
              cursor: "pointer",
              transition: "background 0.2s, color 0.2s",
              fontFamily: "'Georgia', serif",
            }}
          >
            {m === "draw" ? "뽑기" : "조회"}
          </button>
        ))}
      </div>
    </>
  );
}
