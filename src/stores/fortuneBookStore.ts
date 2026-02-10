import { create } from "zustand";

export interface FortuneBookState {
  isOpen: boolean;
  leftPageIndex: number;
  rightPageIndex: number;
  isFlipping: boolean;
  resultPage: number | null;
  totalPages: number;
  /** 플립 시 오른쪽에 올 다음 페이지 (한 스텝) */
  nextRightPageIndex: number | null;
  /** 플립 시퀀스 [현재 오른쪽, 다음 오른쪽, ..., resultPage] */
  flipSequence: number[] | null;
  /** flipSequence 내 현재 스텝 (0 = 첫 번째 넘기기 진행 중) */
  flipStep: number;
}

export interface FortuneBookActions {
  openBook: () => void;
  startFlip: () => void;
  /** 한 장 넘기기 애니메이션 종료 시 호출 */
  advanceAfterFlip: () => void;
  reset: () => void;
  setTotalPages: (total: number) => void;
}

const initialState: FortuneBookState = {
  isOpen: false,
  leftPageIndex: 0,
  rightPageIndex: 1,
  isFlipping: false,
  resultPage: null,
  totalPages: 30,
  nextRightPageIndex: null,
  flipSequence: null,
  flipStep: 0,
};

function buildRightSequence(
  currentRight: number,
  resultPage: number,
  totalPages: number
): number[] {
  const seq: number[] = [];
  let r = currentRight;
  for (;;) {
    seq.push(r);
    if (r === resultPage) {
      break;
    }
    r = (r + 1) % totalPages;
  }
  return seq;
}

export const useFortuneBookStore = create<FortuneBookState & FortuneBookActions>((set, get) => ({
  ...initialState,

  openBook: () => set({ isOpen: true }),

  startFlip: () => {
    const { totalPages, isFlipping, rightPageIndex } = get();
    if (isFlipping || totalPages < 2) {
      return;
    }

    const resultPage = Math.floor(Math.random() * totalPages);
    const flipSequence = buildRightSequence(rightPageIndex, resultPage, totalPages);
    if (flipSequence.length <= 1) {
      set({ resultPage: rightPageIndex });
      return;
    }

    set({
      isFlipping: true,
      resultPage,
      flipSequence,
      flipStep: 0,
      nextRightPageIndex: flipSequence[1],
    });
  },

  advanceAfterFlip: () => {
    const { flipSequence, flipStep } = get();
    if (!flipSequence || flipStep >= flipSequence.length - 1) {
      set({
        isFlipping: false,
        flipSequence: null,
        flipStep: 0,
        nextRightPageIndex: null,
        leftPageIndex: get().rightPageIndex,
        rightPageIndex: get().nextRightPageIndex ?? get().rightPageIndex,
      });
      return;
    }

    const newLeft = flipSequence[flipStep];
    const newRight = flipSequence[flipStep + 1];
    const nextStep = flipStep + 1;
    const hasMore = nextStep < flipSequence.length - 1;

    set({
      leftPageIndex: newLeft,
      rightPageIndex: newRight,
      flipStep: nextStep,
      nextRightPageIndex: hasMore ? flipSequence[nextStep + 1] : null,
      isFlipping: hasMore,
      flipSequence: hasMore ? flipSequence : null,
    });
  },

  setTotalPages: total => set({ totalPages: total }),

  reset: () =>
    set({
      isOpen: false,
      leftPageIndex: 0,
      rightPageIndex: 1,
      isFlipping: false,
      resultPage: null,
      nextRightPageIndex: null,
      flipSequence: null,
      flipStep: 0,
    }),
}));
