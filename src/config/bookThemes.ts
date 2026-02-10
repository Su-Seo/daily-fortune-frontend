import type { BookTheme } from "@/models/fortune";

/** 기본 책 테마 (호박색 고전 스타일) */
export const defaultBookTheme: BookTheme = {
  id: "default",
  cover: {
    root: "border-2 border-amber-800/40 bg-gradient-to-br from-amber-900 via-amber-800 to-amber-900 shadow-xl",
    overlay: "border border-amber-700/30 bg-gradient-to-b from-amber-700/20 to-transparent",
    title: "font-serif text-2xl font-bold tracking-widest text-amber-100 drop-shadow-md",
    subtitle: "font-serif text-sm tracking-wide text-amber-200/90",
    hint: "text-xs text-amber-200/70",
  },
  spine: {
    root: "rounded-l-lg border border-amber-800/30 bg-gradient-to-r from-amber-900/90 to-amber-800/70 text-amber-200/80",
    title: "font-serif text-sm",
  },
  page: {
    root: "overflow-hidden rounded-r-lg border border-amber-800/30 bg-amber-50 shadow-inner",
    text: "font-serif text-base leading-relaxed text-amber-900/90",
    pageNumber: "font-serif text-sm text-amber-700/70",
  },
  actions: {
    flipButton: "border-amber-700/50 bg-amber-50 font-serif text-amber-900 hover:bg-amber-100",
    resetButton: "text-amber-700 hover:text-amber-900",
  },
  resultZoom: {
    overlay: "bg-black/40 backdrop-blur-[2px]",
    pageWrapper: "bg-amber-50 border border-amber-800/30 shadow-2xl rounded-lg",
  },
};

const themeMap: Record<string, BookTheme> = {
  [defaultBookTheme.id]: defaultBookTheme,
};

export function getBookTheme(themeId: string): BookTheme {
  return themeMap[themeId] ?? defaultBookTheme;
}
