// NOTE:
// - 라우트 수가 적을 경우 이 파일 하나로 유지
// - 라우트가 늘어나거나 그룹화 필요 시 `src/routes/` 폴더로 분리 권장
import { createBrowserRouter } from "react-router";

import { BookPage } from "@/pages/BookPage";
import { NotFoundPage } from "@/pages/NotFoundPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <BookPage />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
