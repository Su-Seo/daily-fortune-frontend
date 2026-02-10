/** 운세 책 한 페이지 (한 장의 운세 문구) */
export interface FortunePage {
  id: number;
  text: string;
}

/** 운세 책 전체 (페이지 배열) */
export type FortunePageList = FortunePage[];

/** 책 디자인 테마 - 디자인 변경·확장용 */
export interface BookTheme {
  id: string;
  /** 표지 배경 그라데이션 등 (Tailwind 클래스 또는 인라인 스타일용) */
  cover: {
    root: string;
    overlay?: string;
    title: string;
    subtitle: string;
    hint: string;
  };
  /** 책 등(스파인) 스타일 */
  spine: {
    root: string;
    title: string;
  };
  /** 펼친 뒤 페이지(내지) 스타일 */
  page: {
    root: string;
    text: string;
    pageNumber: string;
  };
  /** 버튼·링크 등 액션 스타일 */
  actions: {
    flipButton: string;
    resetButton: string;
  };
  /** 줌인된 결과 페이지 래퍼 */
  resultZoom: {
    overlay: string;
    pageWrapper: string;
  };
}

/** 단일 책 정의 - 종류별 확장용 */
export interface Book {
  id: string;
  name: string;
  /** 표지/부제 등 노출용 */
  subtitle?: string;
  themeId: string;
  pages: FortunePageList;
}
