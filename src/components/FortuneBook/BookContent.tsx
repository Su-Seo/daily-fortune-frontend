import { useEffect } from "react";

import {
  BookPageFrame,
  LeftPageContent,
  RightPageContent,
} from "@/components/FortuneBook/BookSpread";
import { PageFlip } from "@/components/FortuneBook/PageFlip";
import { Button } from "@/components/ui/button";

import { getBookTheme } from "@/config/bookThemes";
import { defaultBook } from "@/config/books";
import { cn } from "@/lib/utils";
import type { FortunePage } from "@/models/fortune";
import { useFortuneBookStore } from "@/stores/fortuneBookStore";

const { themeId, pages } = defaultBook;
const theme = getBookTheme(themeId);

/** 펼쳐진 책 - 두 페이지 스프레드 + 실제 책장 넘기기 + 결과 시 줌인 */
export function BookContent() {
  const { currentPage, isFlipping, resultPage, startFlip, reset, setTotalPages } =
    useFortuneBookStore();
  const totalPages = pages.length;

  useEffect(() => {
    setTotalPages(totalPages);
  }, [totalPages, setTotalPages]);

  const isResultVisible = resultPage !== null && !isFlipping;
  const resultPageData = resultPage !== null ? pages[resultPage] : null;

  /* 결과 화면: 실제 책 페이지를 줌인해서 보여줌 */
  if (isResultVisible && resultPageData) {
    return (
      <div
        className={cn(
          "fixed inset-0 z-40 flex items-center justify-center p-4",
          theme.resultZoom.overlay,
          "animate-in fade-in duration-300"
        )}
        onClick={e => e.target === e.currentTarget && reset()}
        role="presentation"
      >
        <div
          className={cn(
            "max-h-[85vh] w-full max-w-lg overflow-auto border border-dashed border-stone-400/70 bg-[#faf8f3] p-8 shadow-2xl",
            theme.resultZoom.pageWrapper,
            "animate-in zoom-in-95 duration-300"
          )}
          onClick={e => e.stopPropagation()}
        >
          <RightPageContent
            fortuneText={resultPageData.text}
            pageNumber={resultPageData.id}
            className="min-h-0"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={reset}
            className={cn("mt-6", theme.actions.resetButton)}
          >
            처음부터 다시하기
          </Button>
        </div>
      </div>
    );
  }

  /* 두 페이지 스프레드: 왼쪽 고정 | 등 | 오른쪽(넘기는 페이지) */
  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex items-stretch justify-center shadow-2xl">
        {/* 왼쪽 페이지: 고정 디자인 */}
        <BookPageFrame side="left" className="w-[200px]">
          <LeftPageContent title={defaultBook.subtitle ?? defaultBook.name} />
        </BookPageFrame>
        {/* 책 등 (접힌 부분) */}
        <div
          className={cn(
            "w-3 flex-shrink-0 bg-gradient-to-b from-stone-300 to-stone-400",
            "rounded-none"
          )}
          aria-hidden
        />
        {/* 오른쪽 페이지: 넘어가는 내용 (점선 테두리 + 배경은 플립 내부 페이지와 동일) */}
        <div className="relative h-[320px] w-[260px] flex-shrink-0 overflow-hidden rounded-r-sm border border-dashed border-stone-400/70 bg-[#faf8f3]">
          <PageFlip
            currentPage={currentPage}
            pageClassName="bg-[#faf8f3]"
            className="h-full w-full"
            renderPage={pageIndex => {
              const page = pages[pageIndex] as FortunePage | undefined;
              if (!page) {
                return null;
              }
              return <RightPageContent fortuneText={page.text} pageNumber={page.id} />;
            }}
          />
          <div className="pointer-events-none absolute inset-0">
            <span
              className="absolute top-2 right-2 font-serif text-[10px] text-stone-400/80"
              aria-hidden
            >
              ⁕
            </span>
            <span
              className="absolute right-2 bottom-2 font-serif text-[10px] text-stone-400/80"
              aria-hidden
            >
              ⁕
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4">
        <Button
          variant="outline"
          size="lg"
          onClick={() =>
            startFlip(
              () => {},
              () => {}
            )
          }
          disabled={isFlipping}
          className={cn("min-w-[200px]", theme.actions.flipButton)}
        >
          {isFlipping ? "넘기는 중…" : "책 넘기기"}
        </Button>
        <Button variant="ghost" size="sm" onClick={reset} className={theme.actions.resetButton}>
          처음부터 다시하기
        </Button>
      </div>
    </div>
  );
}
