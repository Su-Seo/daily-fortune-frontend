import { useRef } from "react";

import { PageFlip } from "@/components/FortuneBook/PageFlip";
import { Button } from "@/components/ui/button";

import { fortuneBook } from "@/config/fortuneBook";
import { cn } from "@/lib/utils";
import { useFortuneBookStore } from "@/stores/fortuneBookStore";

/** 펼쳐진 책 - 페이지 플립 + 오늘의 운세 하이라이트 */
export function BookContent() {
  const { currentPage, isFlipping, resultPage, startFlip, reset, setTotalPages } =
    useFortuneBookStore();
  const totalPages = fortuneBook.length;
  const initialized = useRef(false);
  if (!initialized.current) {
    setTotalPages(totalPages);
    initialized.current = true;
  }

  const isResultVisible = resultPage !== null && !isFlipping;
  const resultFortune = resultPage !== null ? fortuneBook[resultPage] : null;

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex items-stretch justify-center gap-0">
        {/* 왼쪽: 책 등 (첫 페이지일 때 빈 면) */}
        <div
          className={cn(
            "flex w-[200px] items-center justify-center rounded-l-lg border border-amber-800/30 bg-gradient-to-r from-amber-900/90 to-amber-800/70 py-8 text-amber-200/80"
          )}
          aria-hidden
        >
          <span className="font-serif text-sm">책님</span>
        </div>
        {/* 오른쪽: 넘어가는 페이지 */}
        <div className="h-[320px] w-[280px]">
          <PageFlip
            currentPage={currentPage}
            renderPage={pageIndex => (
              <div className="flex h-full flex-col justify-between p-6">
                <p className="font-serif text-base leading-relaxed text-amber-900/90">
                  {fortuneBook[pageIndex]?.text ?? ""}
                </p>
                <p className="text-right font-serif text-sm text-amber-700/70">
                  — {pageIndex + 1}쪽
                </p>
              </div>
            )}
          />
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
          className="min-w-[200px] border-amber-700/50 bg-amber-50 font-serif text-amber-900 hover:bg-amber-100"
        >
          {isFlipping ? "넘기는 중…" : "책 넘기기"}
        </Button>

        {isResultVisible && resultFortune && (
          <div
            className={cn(
              "max-w-md rounded-xl border-2 border-amber-400/60 bg-amber-50/95 px-6 py-4 shadow-lg",
              "animate-in fade-in duration-500"
            )}
          >
            <p className="mb-2 font-serif text-sm font-medium text-amber-800">오늘의 운세</p>
            <p className="font-serif text-lg leading-relaxed text-amber-900">
              {resultFortune.text}
            </p>
          </div>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={reset}
          className="text-amber-700 hover:text-amber-900"
        >
          처음부터 다시하기
        </Button>
      </div>
    </div>
  );
}
