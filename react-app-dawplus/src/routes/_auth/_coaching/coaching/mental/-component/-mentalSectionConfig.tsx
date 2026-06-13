import type { ReactNode } from "react";
import type { MentalCardUserType } from "./Cards";

export type MentalSession = 2 | 3 | 4 | 5 | 6;
type MentalCardKey = "Card1" | "Card2" | "Card3" | "Card4";

interface MentalAnswerItem {
  answerChoice: string | null;
  progressTypeCd: string | null;
  stepDayCd: string | null;
}

export function getMentalType(
  answerList: MentalAnswerItem[],
): MentalCardUserType | null {
  const type = answerList.find(
    (item) => item.stepDayCd === "Q1" && item.progressTypeCd === "D2",
  )?.answerChoice;

  if (
    type === "전투형" ||
    type === "순응형" ||
    type === "억압형" ||
    type === "자포자기형" ||
    type === "걱정형"
  ) {
    return type;
  }

  return null;
}

export function getMentalSession(answerList: MentalAnswerItem[]): MentalSession {
  const savedSessions = answerList
    .map((item) => item.stepDayCd ?? "")
    .map((value) => /^Q(\d+)$/.exec(value)?.[1] ?? null)
    .filter((value): value is string => value !== null)
    .map((value) => Number.parseInt(value, 10))
    .filter((value) => !Number.isNaN(value));

  const maxSavedSession = savedSessions.length > 0 ? Math.max(...savedSessions) : 0;
  const nextSession = maxSavedSession + 1;

  if (nextSession <= 2) {
    return 2;
  }

  if (nextSession === 3) {
    return 3;
  }

  if (nextSession === 4) {
    return 4;
  }

  if (nextSession === 5) {
    return 5;
  }

  return 6;
}

export function getMentalSectionConfig(
  session: Exclude<MentalSession, 6>,
  type: MentalCardUserType,
): { card: MentalCardKey; title: ReactNode } {
  const config = {
    2: {
      전투형: {
        card: "Card1",
        title: (
          <>
            마음의 휴식을 위한 <br />
            복식호흡
          </>
        ),
      },
      순응형: {
        card: "Card2",
        title: (
          <>
            나를 돌보는 마음 <br />
            표현하기
          </>
        ),
      },
      억압형: {
        card: "Card3",
        title: (
          <>
            마음을 알아차리는 <br />
            명상
          </>
        ),
      },
      자포자기형: {
        card: "Card4",
        title: (
          <>
            긍정적인 마음을 위한
            <br /> 생각바꾸기
          </>
        ),
      },
      걱정형: {
        card: "Card1",
        title: (
          <>
            마음이 편안해지는 <br />
            복식호흡
          </>
        ),
      },
    },
    3: {
      전투형: {
        card: "Card4",
        title: (
          <>
            긍정적인 마음을 위한 <br />
            생각바꾸기
          </>
        ),
      },
      순응형: {
        card: "Card3",
        title: (
          <>
            마음을 달래는 <br />
            명상
          </>
        ),
      },
      억압형: {
        card: "Card1",
        title: (
          <>
            기분을 다스리는 <br />
            복식호흡
          </>
        ),
      },
      자포자기형: {
        card: "Card2",
        title: (
          <>
            나를 돌보는
            <br /> 마음 표현하기
          </>
        ),
      },
      걱정형: {
        card: "Card3",
        title: (
          <>
            생각을 덜어내기 위한 <br />
            명상
          </>
        ),
      },
    },
    4: {
      전투형: {
        card: "Card3",
        title: (
          <>
            마음의 휴식을 위한 <br />
            명상
          </>
        ),
      },
      순응형: {
        card: "Card1",
        title: (
          <>
            기분을 다스리는 <br />
            복식호흡
          </>
        ),
      },
      억압형: {
        card: "Card4",
        title: (
          <>
            기분을 달래는
            <br />
            생각 바꾸기
          </>
        ),
      },
      자포자기형: {
        card: "Card3",
        title: (
          <>
            마음의 회복을 돕는
            <br /> 명상
          </>
        ),
      },
      걱정형: {
        card: "Card4",
        title: (
          <>
            걱정을 줄이기 위한
            <br />
            생각바꾸기
          </>
        ),
      },
    },
    5: {
      전투형: {
        card: "Card2",
        title: (
          <>
            나를 돌보는 <br />
            마음 표현하기
          </>
        ),
      },
      순응형: {
        card: "Card4",
        title: (
          <>
            긍정적인 마음을 위한 <br />
            생각바꾸기
          </>
        ),
      },
      억압형: {
        card: "Card2",
        title: (
          <>
            적극적 대처를 위한 <br />
            마음표현하기
          </>
        ),
      },
      자포자기형: {
        card: "Card1",
        title: (
          <>
            마음이 편안해지는
            <br /> 복식호흡
          </>
        ),
      },
      걱정형: {
        card: "Card2",
        title: (
          <>
            나를 돌보는 <br />
            마음 표현하기
          </>
        ),
      },
    },
  } as const;

  return config[session][type];
}
