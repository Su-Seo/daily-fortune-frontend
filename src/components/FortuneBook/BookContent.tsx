import { useEffect } from "react";

import { BookPageFrame, FortunePageContent } from "@/components/FortuneBook/BookSpread";
import { PageFlip } from "@/components/FortuneBook/PageFlip";
import { Button } from "@/components/ui/button";

import { getBookTheme } from "@/config/bookThemes";
import { defaultBook } from "@/config/books";
import { cn } from "@/lib/utils";
import type { FortunePage } from "@/models/fortune";
import { useFortuneBookStore } from "@/stores/fortuneBookStore";

const { themeId, pages } = defaultBook;
const theme = getBookTheme(themeId);

function getPage(pageIndex: number): FortunePage | undefined {
  return pages[pageIndex];
}

/** 펼쳐진 책: 한 화면에 왼쪽·오른쪽 두 운세, 오른쪽 넘기면 그게 왼쪽으로 감 */
export function BookContent() {
  const {
    leftPageIndex,
    rightPageIndex,
    isFlipping,
    resultPage,
    nextRightPageIndex,
    flipStep,
    startFlip,
    advanceAfterFlip,
    reset,
    setTotalPages,
  } = useFortuneBookStore();
  const totalPages = pages.length;

  useEffect(() => {
    setTotalPages(totalPages);
  }, [totalPages, setTotalPages]);

  const isResultVisible = resultPage !== null && !isFlipping;
  const resultPageData = resultPage !== null ? getPage(resultPage) : null;

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
          <FortunePageContent
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

  const leftPage = getPage(leftPageIndex);
  const rightPage = getPage(rightPageIndex);

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex items-stretch justify-center shadow-2xl">
        {/* 왼쪽 페이지: 오른쪽과 같은 운세 레이아웃, 한 화면에 2개 운세 */}
        <BookPageFrame side="left" className="w-[220px]">
          {leftPage ? (
            <FortunePageContent fortuneText={leftPage.text} pageNumber={leftPage.id} />
          ) : null}
        </BookPageFrame>

        {/* 책 등 */}
        <div
          className="w-3 flex-shrink-0 rounded-none bg-gradient-to-b from-stone-300 to-stone-400"
          aria-hidden
        />

        {/* 오른쪽 페이지: 넘기면 이 내용이 왼쪽으로 감 */}
        <div className="relative h-[320px] w-[220px] flex-shrink-0 overflow-hidden rounded-r-sm border border-dashed border-stone-400/70 bg-[#faf8f3]">
          {isFlipping && nextRightPageIndex !== null ? (
            <PageFlip
              key={flipStep}
              turningPageIndex={rightPageIndex}
              underPageIndex={nextRightPageIndex}
              pageClassName="bg-[#faf8f3]"
              className="h-full w-full"
              renderPage={idx => {
                const p = getPage(idx);
                return p ? <FortunePageContent fortuneText={p.text} pageNumber={p.id} /> : null;
              }}
              onFlipComplete={advanceAfterFlip}
            />
          ) : (
            rightPage && (
              <div className="flex h-full flex-col justify-between bg-[#faf8f3] p-6">
                <FortunePageContent fortuneText={rightPage.text} pageNumber={rightPage.id} />
              </div>
            )
          )}
        </div>
      </div>

      <div className="flex flex-col items-center gap-4">
        <Button
          variant="outline"
          size="lg"
          onClick={() => startFlip()}
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
