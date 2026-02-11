// ─────────────────────────────────────────────────────────────────────────────
// book.theme.ts  –  책 + 배경 통일 스타일 (인라인 스타일용)
// ─────────────────────────────────────────────────────────────────────────────

/** 3D 책 시각 테마 — 책과 배경이 하나의 팔레트로 통일 */
export interface BookTheme3D {
  /** 페이지 전체 배경 그라데이션 */
  pageBackground: string;
  /** 표지 그라데이션 */
  coverGradient: string;
  /** 표지 강조색 (선, 원, 텍스트) */
  coverAccent: string;
  /** 본문 페이지 배경 */
  contentPageBg: string;
  /** 본문 강조색 (chapter, 구분선, 쪽수) */
  contentPageAccent: string;
  /** 본문 텍스트 색 */
  contentPageText: string;
  /** 본문 줄(가이드라인) 색 */
  contentPageLineColor: string;
  /** 빈 뒷표지 그라데이션 */
  emptyBackGradient: string;
  /** 빈 뒷표지 텍스트 색 */
  emptyBackTextColor: string;
  /** 컨트롤/인디케이터 강조색 */
  accent: string;
  /** 헤더/힌트 텍스트 색 */
  hintColor: string;
  /** 바닥 그림자 */
  floorShadow: string;
  /** 책 패널 그림자 */
  panelShadow: {
    left: string;
    right: string;
  };
  /** 스택 효과 배경 (오른쪽 페이지 두께) - rgba에 넣을 RGB 문자열 예: "215,205,190" */
  stackBgRgb: string;
}

/** 기본 테마 — 어두운 바다/보라 계열 (표지·배경·본문 통일) */
export const defaultBookTheme: BookTheme3D = {
  pageBackground: "linear-gradient(160deg,#0d0d1a 0%,#16213e 50%,#0d0d1a 100%)",
  coverGradient: "linear-gradient(150deg,#1a0a2e,#16213e,#0f3460)",
  coverAccent: "#e94560",
  // 본문: 표지 퍼플 계열과 조화되는 연한 톤
  contentPageBg: "#ebe8f2",
  contentPageAccent: "#8b7aa8",
  contentPageText: "#2d2640",
  contentPageLineColor: "rgba(139,122,168,0.12)",
  emptyBackGradient: "linear-gradient(150deg,#0f3460,#16213e,#1a0a2e)",
  emptyBackTextColor: "#e9456030",
  accent: "#e94560",
  hintColor: "rgba(255,255,255,0.65)",
  floorShadow: "radial-gradient(ellipse,rgba(0,0,0,0.5) 0%,transparent 70%)",
  panelShadow: {
    left: "-6px 4px 32px rgba(0,0,0,0.55)",
    right: "6px 4px 32px rgba(0,0,0,0.3)",
  },
  stackBgRgb: "200,195,215",
};

/** 호박색 따뜻한 테마 */
export const warmBookTheme: BookTheme3D = {
  pageBackground: "linear-gradient(160deg,#1a1209 0%,#2d1810 50%,#1a1209 100%)",
  coverGradient: "linear-gradient(150deg,#2d1810,#3d2817,#4a3420)",
  coverAccent: "#e8a94e",
  contentPageBg: "#faf5ef",
  contentPageAccent: "#c0a882",
  contentPageText: "#3d2c1a",
  contentPageLineColor: "rgba(192,168,130,0.15)",
  emptyBackGradient: "linear-gradient(150deg,#2d1810,#1a1209)",
  emptyBackTextColor: "#e8a94e30",
  accent: "#e8a94e",
  hintColor: "rgba(255,255,255,0.7)",
  floorShadow: "radial-gradient(ellipse,rgba(0,0,0,0.45) 0%,transparent 70%)",
  panelShadow: {
    left: "-6px 4px 32px rgba(0,0,0,0.4)",
    right: "6px 4px 32px rgba(0,0,0,0.25)",
  },
  stackBgRgb: "215,205,190",
};

const themeMap: Record<string, BookTheme3D> = {
  default: defaultBookTheme,
  warm: warmBookTheme,
};

export type BookThemeId = keyof typeof themeMap;

export const bookThemeIds: BookThemeId[] = ["default", "warm"];

/** 책 테마별 스와치 색상 (동그란 버튼용) — 각 테마의 주된 색 */
export const bookThemeSwatchColors: Record<BookThemeId, string> = {
  default: "#3d5a80",
  warm: "#e8b84e",
};

export function getBookTheme3D(themeId: BookThemeId = "default"): BookTheme3D {
  return themeMap[themeId] ?? defaultBookTheme;
}
