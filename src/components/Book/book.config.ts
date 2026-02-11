// ─────────────────────────────────────────────────────────────────────────────
// book.config.ts  –  책 설정 (콘텐츠 + 테마)
// ─────────────────────────────────────────────────────────────────────────────
import type { BookTheme3D } from "@/components/Book/book.theme";
import type { SpreadData } from "@/components/Book/book.types";

/** 플립 애니메이션 속도 (ms) */
export interface FlipSpeedConfig {
  /** 한 장씩 넘길 때 duration */
  single?: number;
  /** 쪽수 입력 시 연속 플립에서 장당 duration */
  multi?: number;
}

/** 책 전체 설정 — 스타일·내용을 쉽게 교체 가능 */
export interface BookConfig {
  id: string;
  title: string;
  /** 빈 뒷표지에 표시할 제목 */
  emptyBackTitle: string;
  spreads: SpreadData[];
  theme: BookTheme3D;
  /** 본문 쪽 수 (있으면 타이핑 시 쪽 단위 이동, 없으면 스프레드 단위) */
  totalContentPages?: number;
  /** 플립 속도 조절 */
  flipSpeed?: FlipSpeedConfig;
}
