// ─────────────────────────────────────────────────────────────────────────────
// book.types.ts  –  공통 책 타입 (운세, 일반 등 확장 가능)
// ─────────────────────────────────────────────────────────────────────────────

/** 표지 페이지 데이터 */
export interface CoverData {
  type: "cover";
  title: string;
  subtitle: string;
  bg: string;
  accent: string;
}

/** 본문 페이지 데이터 */
export interface ContentData {
  type: "content";
  chapter: string;
  title: string;
  img: string;
  pageNum: string;
  bg: string;
  text: string;
}

export type PageData = CoverData | ContentData;

/** 한 스프레드(양면 폭) — front=오른쪽, back=왼쪽(넘긴 뒤) */
export interface SpreadData {
  id: number;
  front: PageData;
  back?: PageData;
}

/** 플립 애니메이션 상태 */
export interface FlipState {
  idx: number;
  rotateY: number;
}
