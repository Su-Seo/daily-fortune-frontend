import { create } from "zustand";

export interface FortuneBookState {
  /** 책이 펼쳐진 상태인지 (표지 → 본문) */
  isOpen: boolean;
  /** 현재 보이는 페이지 인덱스 (0-based) */
  currentPage: number;
  /** 넘기기 애니메이션 진행 중인지 */
  isFlipping: boolean;
  /** 이번 세션에서 랜덤으로 정해진 최종 페이지 인덱스 */
  resultPage: number | null;
  /** 총 페이지 수 (외부에서 주입) */
  totalPages: number;
}

export interface FortuneBookActions {
  /** 책 펼치기 */
  openBook: () => void;
  /** 랜덤 넘기기 시작 (서서히 멈추며 resultPage까지) */
  startFlip: (onFlip?: (page: number) => void, onComplete?: () => void) => void;
  /** 현재 페이지만 설정 (애니메이션용) */
  setCurrentPage: (page: number) => void;
  /** 플립 중 상태 설정 */
  setFlipping: (flipping: boolean) => void;
  /** 리셋: 책 닫기, 페이지·결과 초기화 */
  reset: () => void;
  /** 총 페이지 수 설정 */
  setTotalPages: (total: number) => void;
}

const initialState: FortuneBookState = {
  isOpen: false,
  currentPage: 0,
  isFlipping: false,
  resultPage: null,
  totalPages: 30,
};

export const useFortuneBookStore = create<FortuneBookState & FortuneBookActions>((set, get) => ({
  ...initialState,

  openBook: () => set({ isOpen: true }),

  startFlip: (onFlip, onComplete) => {
    const { totalPages, isFlipping, currentPage } = get();
    if (isFlipping || totalPages <= 0) {
      return;
    }

    const resultPage = Math.floor(Math.random() * totalPages);
    let totalFlips = (resultPage - currentPage + totalPages) % totalPages;
    if (totalFlips === 0) {
      totalFlips = totalPages;
    }

    set({ isFlipping: true, resultPage });

    // 플립 애니메이션(약 300ms)이 끝난 뒤 다음 페이지로 넘기기 위해 간격을 350ms 이상으로 설정
    const baseDelay = 380;
    const maxDelay = 620;
    const delayStep = (maxDelay - baseDelay) / Math.max(totalFlips - 1, 1);

    let flipCount = 0;

    const scheduleNext = () => {
      if (flipCount >= totalFlips) {
        set({ isFlipping: false, currentPage: resultPage });
        onFlip?.(resultPage);
        onComplete?.();
        return;
      }
      const nextPage = (currentPage + flipCount + 1) % totalPages;
      set({ currentPage: nextPage });
      onFlip?.(nextPage);
      flipCount += 1;
      const delay = Math.round(baseDelay + delayStep * (flipCount - 1));
      setTimeout(scheduleNext, delay);
    };

    scheduleNext();
  },

  setCurrentPage: page => set({ currentPage: page }),
  setFlipping: flipping => set({ isFlipping: flipping }),
  setTotalPages: total => set({ totalPages: total }),

  reset: () =>
    set({
      isOpen: false,
      currentPage: 0,
      isFlipping: false,
      resultPage: null,
    }),
}));
