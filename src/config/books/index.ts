import { defaultBookTheme } from "@/config/bookThemes";
import { fortuneBookData } from "@/config/fortuneBook";
import type { Book } from "@/models/fortune";

/** 기본 책님 운세 책 */
export const defaultBook: Book = {
  id: "chaeknim",
  name: "책님",
  subtitle: "오늘의 운세",
  themeId: defaultBookTheme.id,
  pages: fortuneBookData,
};
