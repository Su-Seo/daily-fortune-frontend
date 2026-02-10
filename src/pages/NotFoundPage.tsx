import { Link } from "react-router";

import { cn } from "@/lib/utils";

export function NotFoundPage() {
  return (
    <main className={cn("flex min-h-screen flex-col items-center justify-center gap-4 px-4")}>
      <h1 className="text-2xl font-semibold">페이지를 찾을 수 없습니다</h1>
      <Link to="/" className="text-primary underline-offset-4 hover:underline">
        책님으로 돌아가기
      </Link>
    </main>
  );
}
