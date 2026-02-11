// ─────────────────────────────────────────────────────────────────────────────
// bookContext.ts  –  책 설정 컨텍스트
// ─────────────────────────────────────────────────────────────────────────────
import { createContext } from "react";

import type { BookConfig } from "@/components/Book/book.config";

export const BookConfigContext = createContext<BookConfig | null>(null);
