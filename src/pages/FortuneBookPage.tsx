import { BookContent, BookCover } from "@/components/FortuneBook";

import { defaultBook } from "@/config/books";
import { cn } from "@/lib/utils";
import { useFortuneBookStore } from "@/stores/fortuneBookStore";

const BOOK_WIDTH = 560;
const BOOK_HEIGHT = 390;

export function FortuneBookPage() {
  const isOpen = useFortuneBookStore(s => s.isOpen);

  return (
    <main
      className={cn(
        "min-h-screen bg-gradient-to-b from-amber-100/80 via-stone-100 to-amber-50/80",
        "flex flex-col items-center justify-center px-4 py-12"
      )}
    >
      <header className="mb-10 text-center">
        <h1 className="font-serif text-3xl font-bold tracking-wide text-amber-900">
          {defaultBook.name}
        </h1>
        <p className="mt-1 text-sm text-amber-800/80">
          {defaultBook.subtitle
            ? `${defaultBook.subtitle}를 펼쳐 보세요`
            : "오늘의 운세를 펼쳐 보세요"}
        </p>
      </header>

      {isOpen ? (
        <BookContent />
      ) : (
        <div className="flex flex-col items-center gap-8">
          {/* 표지일 때도 열린 책과 동일한 560x390 레이아웃 → 클릭 시 표지가 제자리에서 서서히 넘어감 */}
          <div
            className="flex flex-col items-center"
            style={{ perspective: "2400px", perspectiveOrigin: "50% 45%" }}
          >
            <div
              className="relative select-none"
              style={{
                width: BOOK_WIDTH,
                height: BOOK_HEIGHT,
                transformStyle: "preserve-3d",
                transform: "rotateX(6deg) rotateY(-4deg)",
              }}
            >
              {/* 왼쪽 절반: 빈칸(책등) */}
              <div
                className="absolute top-0 left-0 z-0 overflow-hidden rounded-l border border-r-0 border-stone-400/70"
                style={{
                  width: "50%",
                  height: "100%",
                  background:
                    "linear-gradient(90deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.08) 40%, transparent 100%)",
                  boxShadow: "-6px 4px 32px rgba(0,0,0,0.25)",
                }}
                aria-hidden
              />
              <BookCover onOpen={useFortuneBookStore.getState().openBook} embedded />
            </div>
            <div
              className="mt-1 h-6 w-[500px] rounded-full"
              style={{
                background: "radial-gradient(ellipse, rgba(0,0,0,0.35) 0%, transparent 70%)",
              }}
              aria-hidden
            />
          </div>
        </div>
      )}
    </main>
  );
}
