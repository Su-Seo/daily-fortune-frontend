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
function toContentData(page: FortunePage, theme: ReturnType<typeof getBookTheme3D>): ContentData {
  const title = page.summary ?? `${page.id}쪽`;
  return {
    type: "content",
    chapter: "오늘의 운세",
    title,
    img: "🦅",
    pageNum: String(page.id),
    bg: theme.contentPageBg,
    text: page.text,
  };
}

/** 운세 책에서 BookConfig 생성 */
export function createFortuneBookConfig(
  themeId = "default",
  options?: { flipSpeed?: BookConfig["flipSpeed"] }
): BookConfig {
  const theme = getBookTheme3D(themeId);
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
    back: fortuneBookData[0] ? toContentData(fortuneBookData[0], theme) : undefined,
  });

  for (let k = 1; k <= Math.ceil((fortuneBookData.length - 1) / 2); k++) {
    const frontIdx = 2 * k - 1;
    const backIdx = 2 * k;
    const front = fortuneBookData[frontIdx]
      ? toContentData(fortuneBookData[frontIdx], theme)
      : undefined;
    const back = fortuneBookData[backIdx]
      ? toContentData(fortuneBookData[backIdx], theme)
      : undefined;
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
    totalContentPages: fortuneBookData.length,
    flipSpeed: options?.flipSpeed,
  };
}
