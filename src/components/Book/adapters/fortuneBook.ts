// ─────────────────────────────────────────────────────────────────────────────
// fortuneBook.ts  –  운세 책 → BookConfig 어댑터
// ─────────────────────────────────────────────────────────────────────────────
import type { BookConfig } from "@/components/Book/book.config";
import { getBookTheme3D } from "@/components/Book/book.theme";
import type { ContentData, CoverData, SpreadData } from "@/components/Book/book.types";

import { defaultBook } from "@/config/books";
import type { FortunePage } from "@/models/fortune";

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
  const { name, subtitle, pages } = defaultBook;
  const theme = getBookTheme3D(themeId);
  const spreads: SpreadData[] = [];

  spreads.push({
    id: 0,
    front: {
      type: "cover",
      title: name,
      subtitle: subtitle ?? "오늘의 운세",
      bg: theme.coverGradient,
      accent: theme.coverAccent,
    } satisfies CoverData,
    back: pages[0] ? toContentData(pages[0], theme) : undefined,
  });

  for (let k = 1; k <= Math.ceil((pages.length - 1) / 2); k++) {
    const frontIdx = 2 * k - 1;
    const backIdx = 2 * k;
    const front = pages[frontIdx] ? toContentData(pages[frontIdx], theme) : undefined;
    const back = pages[backIdx] ? toContentData(pages[backIdx], theme) : undefined;
    if (front) {
      spreads.push({
        id: spreads.length,
        front,
        back,
      });
    }
  }

  return {
    id: defaultBook.id,
    title: name,
    emptyBackTitle: name,
    spreads,
    theme,
    totalContentPages: pages.length,
    flipSpeed: options?.flipSpeed,
  };
}
