// ─────────────────────────────────────────────────────────────────────────────
// fortuneBook.ts  –  운세 책 → BookConfig 어댑터
// ─────────────────────────────────────────────────────────────────────────────
import type { BookConfig } from "@/components/Book/book.config";
import { getBookTheme3D } from "@/components/Book/book.theme";
import type { ContentData, CoverData, SpreadData } from "@/components/Book/book.types";

import { fortuneBookData } from "@/config/books/fortuneBook";
import type { FortunePage } from "@/models/fortune";

const BOOK_ID = "chaeknim";
const BOOK_NAME = "책님";
const BOOK_SUBTITLE = "오늘의 운세";

/** FortunePage → ContentData 변환 */
function toContentData(
  page: FortunePage,
  theme: ReturnType<typeof getBookTheme3D>,
  pageNum: number
): ContentData {
  const title = page.summary ?? `${pageNum}쪽`;
  return {
    type: "content",
    chapter: "오늘의 운세",
    title,
    img: "🦅",
    pageNum: String(pageNum),
    bg: theme.contentPageBg,
    text: page.text,
  };
}

/** Fisher-Yates 셔플 (원본 변경 없음) */
function shuffleArray<T>(arr: readonly T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** 운세 책에서 BookConfig 생성 */
export function createFortuneBookConfig(
  themeId = "default",
  options?: { flipSpeed?: BookConfig["flipSpeed"]; shuffle?: boolean }
): BookConfig {
  const theme = getBookTheme3D(themeId);
  const pages = options?.shuffle ? shuffleArray(fortuneBookData) : fortuneBookData;
  const spreads: SpreadData[] = [];

  spreads.push({
    id: 0,
    front: {
      type: "cover",
      title: BOOK_NAME,
      subtitle: BOOK_SUBTITLE,
      bg: theme.coverGradient,
      accent: theme.coverAccent,
    } satisfies CoverData,
    back: pages[0] ? toContentData(pages[0], theme, 1) : undefined,
  });

  for (let k = 1; k <= Math.ceil((pages.length - 1) / 2); k++) {
    const frontIdx = 2 * k - 1;
    const backIdx = 2 * k;
    const front = pages[frontIdx] ? toContentData(pages[frontIdx], theme, frontIdx + 1) : undefined;
    const back = pages[backIdx] ? toContentData(pages[backIdx], theme, backIdx + 1) : undefined;
    if (front) {
      spreads.push({
        id: spreads.length,
        front,
        back,
      });
    }
  }

  return {
    id: BOOK_ID,
    title: BOOK_NAME,
    emptyBackTitle: BOOK_NAME,
    spreads,
    theme,
    totalContentPages: pages.length,
    flipSpeed: options?.flipSpeed,
  };
}
