import type {
  MentalQuestion,
  MentalTrainingPlan,
  MentalTypeMeta,
  MentalWeekDay,
} from "./-types";
import mentalType51 from "@/assets/images/coaching/mental/51.png";
import mentalType52 from "@/assets/images/coaching/mental/52.png";
import mentalType53 from "@/assets/images/coaching/mental/53.png";
import mentalType54 from "@/assets/images/coaching/mental/54.png";
import mentalType55 from "@/assets/images/coaching/mental/55.png";

export const mentalQuestions: MentalQuestion[] = [
  { id: 1, text: "나는 내 삶에 희망이 없다고 느낀다." },
  { id: 2, text: "나는 지금 내 상황에 대처할 수가 없다." },
  { id: 3, text: "나는 좀 겁이 난다." },
  { id: 4, text: "나는 암과 관련된 걱정이 많아 괴롭다." },
  { id: 5, text: "나는 의도적으로 암에 대한 생각을 떨쳐 버리려고 노력한다." },
  { id: 6, text: "나는 내 병에 대해 생각하지 않으려고 애쓴다." },
  { id: 7, text: "나는 이 병이 나에게 주어진 도전이라고 생각한다." },
  { id: 8, text: "나는 매우 낙관적이다." },
  {
    id: 9,
    text: "나는 지금까지 잘 살아 왔다. 남은 삶은 선물이라고 생각하고 살겠다.",
  },
  { id: 10, text: "나는 내가 가진 것에 감사한다." },
];

export const likertOptions = [
  { label: "전혀 아니다", value: 0 },
  { label: "그렇지 않다", value: 1 },
  { label: "그렇다", value: 2 },
  { label: "매우 그렇다", value: 3 },
] as const;

export const mentalWeekdays: MentalWeekDay[] = [
  "월요일",
  "화요일",
  "수요일",
  "목요일",
  "금요일",
  "토요일",
  "일요일",
];

export const mentalHourOptions = Array.from({ length: 24 }, (_, index) =>
  String(index + 1),
);

export const defaultMentalTrainingPlan: MentalTrainingPlan = {
  wday: "월요일",
  time: "1",
};

export const mentalScheduleAnswerTemplate = [
  { progressTypeCd: "E01", answerChoice: "" },
  { progressTypeCd: "E02", answerChoice: "" },
  { progressTypeCd: "E03", answerChoice: "" },
  { progressTypeCd: "E04", answerChoice: "" },
  { progressTypeCd: "E05", answerChoice: "" },
  { progressTypeCd: "E06", answerChoice: "" },
  { progressTypeCd: "F01", answerChoice: "" },
  { progressTypeCd: "F02", answerChoice: "" },
  { progressTypeCd: "F03", answerChoice: "" },
  { progressTypeCd: "F04", answerChoice: "" },
  { progressTypeCd: "F05", answerChoice: "" },
  { progressTypeCd: "F06", answerChoice: "" },
  { progressTypeCd: "G01", answerChoice: "" },
  { progressTypeCd: "G02", answerChoice: "" },
  { progressTypeCd: "G03", answerChoice: "" },
  { progressTypeCd: "G04", answerChoice: "" },
  { progressTypeCd: "G05", answerChoice: "" },
  { progressTypeCd: "G06", answerChoice: "" },
  { progressTypeCd: "H01", answerChoice: "" },
  { progressTypeCd: "H02", answerChoice: "" },
  { progressTypeCd: "H03", answerChoice: "" },
  { progressTypeCd: "H04", answerChoice: "" },
  { progressTypeCd: "H05", answerChoice: "" },
  { progressTypeCd: "H06", answerChoice: "" },
  { progressTypeCd: "J01", answerChoice: "" },
  { progressTypeCd: "J02", answerChoice: "" },
  { progressTypeCd: "J03", answerChoice: "" },
  { progressTypeCd: "J04", answerChoice: "" },
  { progressTypeCd: "J05", answerChoice: "" },
  { progressTypeCd: "J06", answerChoice: "" },
] as const;

export const mentalTypeScheduleCodeMap = {
  전투형: "E06",
  순응형: "F06",
  억압형: "G06",
  자포자기형: "H06",
  걱정형: "J06",
} as const;

export const mentalTypeMetaMap: Record<string, MentalTypeMeta> = {
  걱정형: {
    title: "불안과 걱정이 앞서는 편",
    keyword: "불안몰두",
    description:
      "암과 관련한 걱정이 커질수록 생각이 한곳에 머물고, 몸도 쉽게 긴장할 수 있어요.",
    guide:
      "먼저 마음을 진정시키고, 걱정을 흘려보내는 연습부터 시작하면 좋아요.",
    techniques: ["복식호흡", "명상", "생각바꾸기", "나 말하기"],
    resultBody:
      "온통 암에 대한 생각으로 머릿속이 꽉찬 당신, 계속된 걱정으로 '혹시 더 나빠지면 어떡하지', '재발은 아닐까' 하는 염려 때문에 더 많은 정보를 찾아 헤매고 있지는 않나요?",
    resultImage: mentalType55,
    interpretParagraphs: [
      "암이라는 위기 앞에서 불안해지고 걱정하게 되는 건 자연스럽고 당연한 일이에요. 정보를 찾는 것도 병과 맞서 싸우기 위해 도움이 되는 일이지요.",
      "하지만 일상이 걱정으로 꽉 차 있다면 힘드실 거예요. 즐거운 일이나 해야하는 일들을 놓칠 수도 있어요.",
    ],
    adviceLead: "걱정형",
    adviceParagraphs: [
      "걱정스러운 마음에 끊임없이 인터넷에서 정보를 검색하고 있나요? 그럼에도 불안이 계속된다면 주치의에게 직접 궁금한 것들을 물어보세요.",
      "그리고 주의를 다른 곳으로 돌려보세요. 나를 즐겁고 편안하게 만들어주는 일에 집중하는 것이 도움돼요.",
    ],
    programIntro:
      "카마코치가 걱정과 불안으로 힘든 당신에게 마음을 편안하게 하는 방법을 알려드릴게요.",
  },
  자포자기형: {
    title: "무력감과 절망감이 커진 상태",
    keyword: "무망감/무력감",
    description:
      "상황을 바꾸기 어렵다고 느끼면 스스로를 돌보는 힘도 함께 약해질 수 있어요.",
    guide:
      "작은 성공 경험을 쌓고, 내 마음을 표현하는 연습이 다시 힘을 만드는 시작점이 돼요.",
    techniques: ["생각바꾸기", "나 말하기", "명상", "복식호흡"],
    resultTitle: "이제 끝이야.. \n 내가 뭘 할 수 있겠어..",
    resultBody:
      "포기하고 싶은 마음이 굴뚝같은 당신, 암 진단을 받고 비관적으로 느끼고 계시는 것 같아요. 부정적인 생각이 가득하고 쉽게 압도당할 수 있는 유형이시네요.",
    resultImage: mentalType54,
    interpretParagraphs: [
      "암 진단을 받고 모든 것을 놓아버리고 싶을 수 있어요. 그로 인한 절망감과 무력감이 클 테니까요.",
      "하지만 자포자기하는 대처 방식은 우울과 불안을 쉽게 느끼게 하고, 그러한 감정에 오래 머물게 해요. 자신감도 떨어지게 되죠.",
    ],
    adviceLead: "자포자기형",
    adviceParagraphs: [
      "'하늘이 무너져도 솟아날 구멍이 있다'고 하지요.",
      "당장은 막막하더라도 내가 할 수 있는 것이 있어요, 카마코치와 함께 하나씩 찾아보세요.",
    ],
    programIntro:
      "카마코치가 절망과 무력감을 느끼는 당신에게 희망의 에너지를 드릴게요. 긍정적인 마음을 가질 수 있도록 도와드리겠습니다.",
  },
  억압형: {
    title: "감정과 생각을 눌러두는 편",
    keyword: "인지적회피",
    description:
      "불편한 감정을 피하려고 하면 잠깐 편할 수 있지만, 마음의 긴장은 오래 남을 수 있어요.",
    guide: "마음을 알아차리고, 차분히 표현하는 단계로 천천히 넘어가면 좋아요.",
    techniques: ["명상", "복식호흡", "생각바꾸기", "나 말하기"],
    resultTitle: "생각하고 싶지 않아.. 그냥 어떻게든 되겠지..",
    resultBody:
      "암과 관련된 것들은 생각하지 않는 게 마음 편한 당신, 스트레스를 받으면 불쾌하고 불편한 생각을 피하는 경향이 있으시군요. 암 뿐만 아니라 여러가지 스트레스에 대처하는 방식일 수 있어요.",
    resultImage: mentalType53,
    interpretParagraphs: [
      "이런 대처 방식은 불안하거나 두려운 마음을 일시적으로 줄여줄 수 있어요.",
      "하지만 이런 방식이 지속되면 어느 날 갑자기 밀려오는 감정으로 힘들어질 수 있어요. 혹은, 불편한 마음이 신체 증상으로 나타날 수도 있어요.",
    ],
    adviceLead: "억압형",
    adviceParagraphs: [
      "불안하더라도 현재 상황을 있는 그대로 받아들이는 게 좋아요. 그리고 나면 도움이 되는 것들을 하나씩 해 나갈 수 있어요.",
    ],
    adviceBullets: [
      "치료에 필요한 정보 찾기",
      "조언 얻기",
      "문제 해결하기",
      "기분 다스리기 등",
    ],
    programIntro:
      "카마코치가 암과 관련된 것들을 피하고 싶은 당신에게 마음을 편안하게 하는 방법을 알려드릴게요.",
  },
  전투형: {
    title: "상황을 이겨내려는 힘이 강한 편",
    keyword: "투쟁정신",
    description:
      "적극적으로 해결하려는 태도는 큰 힘이지만, 지치지 않도록 쉬는 방법도 꼭 필요해요.",
    guide:
      "긴장을 풀고, 생각을 정리하고, 필요한 마음을 건강하게 표현하는 흐름이 잘 맞아요.",
    techniques: ["복식호흡", "생각바꾸기", "명상", "나 말하기"],
    resultTitle: "나는 싸운다! 나는 승리한다!",
    resultBody:
      "암과의 싸움에서 두려움을 무릅쓰고 당당히 맞서기 위해 용기를 낸 당신, 암이라는 새로운 도전에 맞서는 용맹한 전사이시네요.",
    resultImage: mentalType51,
    interpretIntro: "정면돌파하는 유형이에요.",
    interpretParagraphs: [
      "이런 긍정적이고 적극적인 태도는 투병 과정과 예후에 좋은 영향을 줘요.",
      "하지만 암 치료는 낯설고 어렵기 때문에 힘들 때도 있고 좌절하거나 지칠수도 있어요.",
    ],
    adviceLead: "전투형",
    adviceParagraphs: [
      "늘 애쓰고 노력하는 모습이 아니어도 괜찮아요. 아무리 뛰어난 전사라도 휴식과 위로가 필요하거든요.",
      "2보 전진을 위한 1보 후퇴처럼, 전략적으로 나를 돌보세요.",
      "몸과 마음이 지칠 땐 잠시 쉬어가도 괜찮아요.",
    ],
    programIntro:
      "카마코치가 암과 맞서 싸우는 당신에게 지친 마음을 쉬게 하고, 긍정적인 마음을 유지할 수 있도록 도와드릴게요.",
  },
  순응형: {
    title: "상황을 받아들이려는 태도가 강한 편",
    keyword: "운명론",
    description:
      "현실을 수용하는 힘이 있지만, 내 감정과 필요를 뒤로 미루는 순간도 생길 수 있어요.",
    guide:
      "나를 돌보는 표현부터 시작해 감정을 달래고, 다시 몸과 생각을 정리하는 흐름이 좋아요.",
    techniques: ["나 말하기", "명상", "복식호흡", "생각바꾸기"],
    resultTitle: "운명이야.. 피할 수 없어..",
    resultBody:
      "순응적인 당신, 암을 진단받고 ‘어쩔 수 없는 일이야, 운명인가봐’ 하며 받아들이고 계시네요.",
    resultImage: mentalType52,
    interpretParagraphs: [
      "이렇게 상황을 인정하고 받아들이는 태도는 암 진단이나 천재지변처럼 바꿀 수 없는 일에 맞닥뜨렸을 때 도움이 돼요.",
      "하지만 운명이나 절대자에게 의지하다 보면, 내가 바꿀 수 있는 일조차 하지 않게 될 수 있어요.",
    ],
    adviceLead: "순응형",
    adviceParagraphs: [
      "암 진단은 어쩔 수 없지만, 내가 해낼 수 있는 것들이 있어요. 노력하면 좋아질 수 있는 부분을 찾아 변화시켜 보아요.",
    ],
    adviceBullets: ["운동", "음식 조절", "치료로 인한 부작용 관리 등"],
    programIntro:
      "카마코치가 암을 운명으로 받아들이고 있는 당신에게 힘이 나도록 도와줄 마음 관리법을 알려드릴게요.",
  },
};

export const mentalProgramGuideParagraphs = [
  "마음근육 프로그램은 총 7회로 진행됩니다.",
  "앞으로 3주 동안, 두 번씩 만나게 됩니다.",
  "6회 동안은 카마코치와 함께 마음 근육을 단단히 하는 방법을 배워볼 거예요. 마지막 7회차에는 암종별로 생길 수 있는 어려움에 대처하는 방법을 연습해 볼게요.",
];
