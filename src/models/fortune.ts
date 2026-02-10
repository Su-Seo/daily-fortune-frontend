/** 운세 책 한 페이지 (한 장의 운세 문구) */
export interface FortunePage {
  id: number;
  text: string;
}

/** 운세 책 전체 (페이지 배열) */
export type FortuneBook = FortunePage[];
