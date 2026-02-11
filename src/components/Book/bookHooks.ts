// ─────────────────────────────────────────────────────────────────────────────
// bookHooks.ts  –  책 config/테마 훅
// ─────────────────────────────────────────────────────────────────────────────
import { useContext } from "react";

import type { BookConfig } from "@/components/Book/book.config";
import { BookConfigContext } from "@/components/Book/bookContext";

export function useBookConfig(): BookConfig {
  const config = useContext(BookConfigContext);
  if (!config) {
    throw new Error("useBookConfig must be used within BookConfigProvider");
  }
  return config;
}
