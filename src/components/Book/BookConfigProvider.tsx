// ─────────────────────────────────────────────────────────────────────────────
// BookConfigProvider.tsx  –  BookConfigProvider 컴포넌트
// ─────────────────────────────────────────────────────────────────────────────
import type { BookConfig } from "@/components/Book/book.config";
import { BookConfigContext } from "@/components/Book/bookContext";

export function BookConfigProvider({
  config,
  children,
}: {
  config: BookConfig;
  children: React.ReactNode;
}) {
  return <BookConfigContext.Provider value={config}>{children}</BookConfigContext.Provider>;
}
