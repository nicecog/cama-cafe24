import type { CancerTypeName } from "./exerciseCodeMap";

const commonQuestions = [
  "개인위생 (세수, 머리빗기, 양치, 면도 등) 스스로 할 수 있다.",
  "목욕하는데 타인의 도움이 필요하다.",
  "식사를 스스로 할 수 있다.",
  "고기 자르기, 생선 바르기, 병뚜껑 따기에 타인의 도움이 필요하다.",
  "용변처리를 스스로 할 수 있다.",
  "밤에는 이동 변기를 쓰거나 타인의 도움이 필요하다.",
  "계단을 손잡이 없이 오르내릴 수 있다.",
  "스스로 옷을 입고 벗을 수 있다.",
  "단추, 지퍼, 속옷 등에 타인의 도움이 필요하다.",
  "배변 조절이 가능하다. (실변, 실금이 없다.)",
  "보조기기 없이 스스로 보행할 수 있다.",
  "암 수술 후 한 달 이내이다.",
  "최근 입맛이 없고 체중이 줄었다.",
] as const;

const cancerQuestions: Record<CancerTypeName, readonly string[]> = {
  갑상선암: [
    "목 관절을 움직일 시 통증이 있다.",
    "갑상선 수술 후 목 관절이 뻑뻑하다.",
    "갑상선 수술 후 목 관절 가동범위에 제한이 있다.",
    "갑상선 수술 후 목소리가 바뀐 것 같다.",
  ],
  대장암: [
    "많이 움직이거나 운동하면 통증이 있다.",
    "수술 후 기운이 없고 잘 움직이지 않게 된다.",
    "운동 시 통증이 있지는 않지만, 전보다 신체기능이 떨어진 것 같다.",
  ],
  폐암: [
    "일상생활을 할 때 숨이 차다.",
    "객담배출이나 기침이 어렵다.",
    "운동 시 전보다 숨이 빨리 차다.",
  ],
  유방암: [
    "어깨관절을 움직일 때 통증이 있다.",
    "어깨관절 가동범위에 이전보다 제한이 있다.",
    "수술 부위 팔이 붓는다.",
  ],
};

export const exerciseQuestionSets = {
  common: commonQuestions,
  byCancer: cancerQuestions,
} as const;

export function getQuestionSet(cancer: CancerTypeName) {
  return [...commonQuestions, ...cancerQuestions[cancer]];
}
