import { useEffect, useMemo, useState } from "react";

import Book3D from "@/components/Book/Book3D";
import type { BookControlProps } from "@/components/Book/Book3D";
import { createFortuneBookConfig } from "@/components/Book/adapters";
import type { FlipSpeedConfig } from "@/components/Book/book.config";
import {
  type BookThemeId,
  bookThemeIds,
  bookThemeSwatchColors,
} from "@/components/Book/book.theme";
import { useBookFlip } from "@/components/Book/useBookFlip";
import { ModeToggle, createFortuneControls } from "@/pages/FortuneBookControls";

const BASE_SINGLE_MS = 550;
const BASE_MULTI_MS = 280;
const MIN_MS = 50;
const SPEED_MIN = 1;
const SPEED_MAX = 10;

function speedMultiplierToConfig(x: number): FlipSpeedConfig {
  const single = Math.max(MIN_MS, Math.round(BASE_SINGLE_MS / x));
  const multi = Math.max(MIN_MS, Math.round(BASE_MULTI_MS / x));
  return { single, multi };
}

function ThemeSpeedControls({
  themeId,
  onThemeChange,
  speedMultiplier,
  onSpeedMultiplierChange,
  theme,
}: {
  themeId: BookThemeId;
  onThemeChange: (id: BookThemeId) => void;
  speedMultiplier: number;
  onSpeedMultiplierChange: (x: number) => void;
  theme: { accent: string; hintColor: string };
}) {
  const { accent, hintColor } = theme;
  return (
    <div
      style={{
        position: "absolute",
        top: 20,
        right: 20,
        display: "flex",
        gap: 16,
        alignItems: "center",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ color: hintColor, fontSize: 10, minWidth: 28 }}>{speedMultiplier}×</span>
        <input
          type="range"
          min={SPEED_MIN}
          max={SPEED_MAX}
          value={speedMultiplier}
          onChange={e => onSpeedMultiplierChange(Number(e.target.value))}
          aria-label="플립 속도"
          style={{ width: 64, height: 4, accentColor: accent }}
        />
      </div>
      <span style={{ color: hintColor, fontSize: 10 }}>|</span>
      {bookThemeIds.map(id => (
        <button
          key={id}
          type="button"
          onClick={() => onThemeChange(id)}
          aria-pressed={themeId === id}
          aria-label={`책 색상 ${id}`}
          style={{
            width: 24,
            height: 24,
            padding: 0,
            border: `2px solid ${themeId === id ? bookThemeSwatchColors[id] : "rgba(255,255,255,0.3)"}`,
            borderRadius: "50%",
            background: bookThemeSwatchColors[id],
            cursor: "pointer",
            boxShadow: themeId === id ? "0 0 0 2px rgba(255,255,255,0.4)" : "none",
          }}
        />
      ))}
    </div>
  );
}

export function BookPage() {
  const [themeId, setThemeId] = useState<BookThemeId>("default");
  const [speedMultiplier, setSpeedMultiplier] = useState(3);
  const [mode, setMode] = useState<"draw" | "browse">("draw");
  const [pageInput, setPageInput] = useState("");

  const config = useMemo(
    () =>
      createFortuneBookConfig(themeId, {
        flipSpeed: speedMultiplierToConfig(speedMultiplier),
      }),
    [themeId, speedMultiplier]
  );

  const total = config.spreads.length;
  const bookFlip = useBookFlip(total, config.flipSpeed);
  const maxPage = config.totalContentPages ?? total + 1;
  const usePageUnit = config.totalContentPages !== null;

  useEffect(() => {
    if (pageInput === "") {
      return;
    }
    const id = setTimeout(() => {
      const num = parseInt(pageInput, 10);
      if (!Number.isNaN(num) && num >= 1 && num <= maxPage) {
        const targetSpread = usePageUnit ? Math.ceil(num / 2) : num - 1;
        bookFlip.goToPageAnimated(targetSpread);
      }
      setPageInput("");
    }, 450);
    return () => clearTimeout(id);
  }, [pageInput, bookFlip, maxPage, usePageUnit]);

  const controlProps: BookControlProps = {
    flipped: bookFlip.flipped,
    total,
    maxPage,
    pageInput,
    setPageInput,
    btnForward: bookFlip.btnForward,
    btnBackward: bookFlip.btnBackward,
    goToPageAnimated: bookFlip.goToPageAnimated,
    startShuffle: bookFlip.startShuffle,
    stopShuffle: bookFlip.stopShuffle,
    isShuffling: bookFlip.isShuffling,
    theme: config.theme,
  };

  const renderControls = useMemo(() => createFortuneControls(mode), [mode]);
  const controlsContent = renderControls(controlProps);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: config.theme.pageBackground,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        position: "relative",
      }}
    >
      <ThemeSpeedControls
        themeId={themeId}
        onThemeChange={setThemeId}
        speedMultiplier={speedMultiplier}
        onSpeedMultiplierChange={setSpeedMultiplier}
        theme={config.theme}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Book3D config={config} bookFlip={bookFlip} />
        <div
          style={{
            width: "100%",
            marginTop: 20,
            background: "rgba(255,255,255,0.04)",
            borderRadius: 10,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <ModeToggle mode={mode} setMode={setMode} theme={config.theme} />
          </div>
          <div style={{ padding: "16px 16px 20px" }}>{controlsContent}</div>
        </div>
      </div>
    </div>
  );
}
