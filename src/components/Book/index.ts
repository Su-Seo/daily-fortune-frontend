// ─────────────────────────────────────────────────────────────────────────────
// Book – 3D 인터랙티브 책 (운세·일반 등 확장 가능)
// ─────────────────────────────────────────────────────────────────────────────

export { default as Book3D } from "@/components/Book/Book3D";
export type { Book3DProps, BookControlProps } from "@/components/Book/Book3D";
export { createFortuneBookConfig } from "@/components/Book/adapters";
export type { BookConfig } from "@/components/Book/book.config";
export { defaultBookTheme, getBookTheme3D, warmBookTheme } from "@/components/Book/book.theme";
export type { BookTheme3D } from "@/components/Book/book.theme";
export type {
  ContentData,
  CoverData,
  FlipState,
  PageData,
  SpreadData,
} from "@/components/Book/book.types";
