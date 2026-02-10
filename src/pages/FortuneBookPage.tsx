import { BookContent, BookCover } from "@/components/FortuneBook";

import { cn } from "@/lib/utils";
import { useFortuneBookStore } from "@/stores/fortuneBookStore";

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
        <h1 className="font-serif text-3xl font-bold tracking-wide text-amber-900">책님</h1>
        <p className="mt-1 text-sm text-amber-800/80">오늘의 운세를 펼쳐 보세요</p>
      </header>

      {isOpen ? <BookContent /> : <BookCover onOpen={useFortuneBookStore.getState().openBook} />}
    </main>
  );
}
