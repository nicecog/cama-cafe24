import type { DifficultyCode } from "./exerciseCodeMap";

interface ExerciseExecutionMetaItem {
  difficulty: DifficultyCode;
  exe: string;
  korName: string;
  type: string;
}

const exerciseExecutionMeta: ExerciseExecutionMetaItem[] = [
  { korName: "브레이싱 호흡", exe: "10회 3세트", type: "E1", difficulty: "A1" },
  {
    korName: "팔 벌리며 숨쉬기",
    exe: "10회 3세트",
    type: "E1",
    difficulty: "A1",
  },
  {
    korName: "누워서 무릎 세우기",
    exe: "양쪽 각 10회 3세트",
    type: "E1",
    difficulty: "A1",
  },
  {
    korName: "누워서 무릎 세우고 다리 벌렸다 오므리기",
    exe: "10회 3세트",
    type: "E1",
    difficulty: "A1",
  },
  {
    korName: "누워서 엉덩이 들고 버티기",
    exe: "10초 3세트",
    type: "E1",
    difficulty: "A2",
  },
  {
    korName: "옆으로 누워 무릎 들고 버티기",
    exe: "양쪽 각 10초 3세트",
    type: "E1",
    difficulty: "A2",
  },
  {
    korName: "벽에서 양 손바닥 대고 버티기",
    exe: "10초 3세트",
    type: "E1",
    difficulty: "A2",
  },
  {
    korName: "벽 기대고 앉기",
    exe: "10초 3세트",
    type: "E1",
    difficulty: "A2",
  },
  { korName: "브릿지 운동", exe: "10회 3세트", type: "E1", difficulty: "A3" },
  {
    korName: "옆으로 누워 다리 들기",
    exe: "양쪽 각 10회 3세트",
    type: "E1",
    difficulty: "A3",
  },
  {
    korName: "벽에 손바닥 대고 힙힌지 하기",
    exe: "10회 3세트",
    type: "E1",
    difficulty: "A3",
  },
  {
    korName: "의자보조 스쿼트",
    exe: "10회 3세트",
    type: "E1",
    difficulty: "A3",
  },
  { korName: "복식호흡 하기", exe: "10회 3세트", type: "E2", difficulty: "A1" },
  {
    korName: "허리 숙여 호흡",
    exe: "10회 3세트",
    type: "E2",
    difficulty: "A1",
  },
  {
    korName: "정면으로 팔 들기",
    exe: "10회 3세트",
    type: "E2",
    difficulty: "A1",
  },
  {
    korName: "양옆으로 팔 벌려 들기",
    exe: "양쪽 각 10회 3세트 또는 10회 3세트",
    type: "E2",
    difficulty: "A1",
  },
  { korName: "스핑크스 자세", exe: "10초 3세트", type: "E2", difficulty: "A2" },
  { korName: "어깨 으쓱하기", exe: "10초 3세트", type: "E2", difficulty: "A2" },
  {
    korName: "앉아서 손 짚고 가슴 펴기",
    exe: "10초 3세트",
    type: "E2",
    difficulty: "A2",
  },
  {
    korName: "앉아서 흉추 회전하기",
    exe: "양쪽 각 10회 3세트",
    type: "E2",
    difficulty: "A2",
  },
  {
    korName: "어깨 외회전하기",
    exe: "10회 3세트",
    type: "E2",
    difficulty: "A3",
  },
  {
    korName: "어깨 앞뒤로 돌리기",
    exe: "앞뒤 각 10회 3세트",
    type: "E2",
    difficulty: "A3",
  },
  {
    korName: "I/Y/T 방향으로 팔 들기",
    exe: "각 10회 3세트",
    type: "E2",
    difficulty: "A3",
  },
  { korName: "몸통 돌리기", exe: "10회 3세트", type: "E2", difficulty: "A3" },
  {
    korName: "목 좌우 회전",
    exe: "양쪽 각 10회 3세트",
    type: "E3",
    difficulty: "A1",
  },
  {
    korName: "목 옆으로 구부리기",
    exe: "양쪽 각 10회 3세트",
    type: "E3",
    difficulty: "A1",
  },
  {
    korName: "손가락으로 벽 걸어 팔 올리기",
    exe: "양쪽 각 10회 3세트",
    type: "E3",
    difficulty: "A1",
  },
  {
    korName: "몸통 옆으로 구부리기",
    exe: "양쪽 각 10회 3세트",
    type: "E3",
    difficulty: "A1",
  },
  {
    korName: "깍지끼고 손 앞으로 들기",
    exe: "10초 3세트",
    type: "E3",
    difficulty: "A2",
  },
  {
    korName: "손 뒤로 깍지끼기",
    exe: "10초 3세트",
    type: "E3",
    difficulty: "A2",
  },
  {
    korName: "머리 뒤로 깍지 끼고 가슴 열기",
    exe: "10초 3세트",
    type: "E3",
    difficulty: "A2",
  },
  {
    korName: "벽 밀며 버티기",
    exe: "10초 3세트",
    type: "E3",
    difficulty: "A2",
  },
  {
    korName: "팔 앞으로 들기",
    exe: "10회 3세트",
    type: "E3",
    difficulty: "A3",
  },
  {
    korName: "팔 옆으로 들기",
    exe: "10회 3세트",
    type: "E3",
    difficulty: "A3",
  },
  {
    korName: "팔 옆으로 들어 돌리기",
    exe: "앞뒤 각 10회 3세트",
    type: "E3",
    difficulty: "A3",
  },
  {
    korName: "벽 손짚고 팔굽혀 펴기",
    exe: "10회 3세트",
    type: "E3",
    difficulty: "A3",
  },
  {
    korName: "어깨 늘어뜨려 회전하기",
    exe: "양쪽 각 10회 3세트",
    type: "E4",
    difficulty: "A1",
  },
  {
    korName: "어깨 올렸다 내렸다 하기",
    exe: "10회 3세트",
    type: "E4",
    difficulty: "A1",
  },
  {
    korName: "벽에 손짚고 견갑골 전인/후인 하기",
    exe: "10회 3세트",
    type: "E4",
    difficulty: "A1",
  },
  { korName: "가슴 열어주기", exe: "10회 3세트", type: "E4", difficulty: "A1" },
  {
    korName: "손바닥으로 머리 막고 목 숙이기",
    exe: "10초 3세트",
    type: "E4",
    difficulty: "A2",
  },
  {
    korName: "손바닥으로 머리 막고 목 들기",
    exe: "10초 3세트",
    type: "E4",
    difficulty: "A2",
  },
  {
    korName: "손바닥으로 머리 막고 목 옆으로 구부리기",
    exe: "양쪽 각 10회 3세트",
    type: "E4",
    difficulty: "A2",
  },
  {
    korName: "손바닥으로 머리 막고 목 회전하기",
    exe: "양쪽 각 10회 3세트",
    type: "E4",
    difficulty: "A2",
  },
  {
    korName: "목빗근 스트레칭",
    exe: "양쪽 각 10회 3세트",
    type: "E4",
    difficulty: "A3",
  },
  {
    korName: "고개 들어 좌우 회전",
    exe: "양쪽 각 10회 3세트",
    type: "E4",
    difficulty: "A3",
  },
  {
    korName: "고개 숙여 좌우 회전",
    exe: "양쪽 각 10회 3세트",
    type: "E4",
    difficulty: "A3",
  },
  {
    korName: "목 돌리기",
    exe: "양쪽 각 10회 3세트",
    type: "E4",
    difficulty: "A3",
  },
  {
    korName: "누워서 한 팔씩 들기",
    exe: "양쪽 각 10회 3세트",
    type: "E5",
    difficulty: "A1",
  },
  {
    korName: "누워서 한 다리씩 구부린 채 들기",
    exe: "양쪽 각 10회 3세트",
    type: "E5",
    difficulty: "A1",
  },
  {
    korName: "누워서 팔다리 들고 버티기",
    exe: "10초 3세트",
    type: "E5",
    difficulty: "A2",
  },
  {
    korName: "누워서 손바닥으로 무릎 밀기",
    exe: "10초 3세트",
    type: "E5",
    difficulty: "A2",
  },
  {
    korName: "무릎 들어 반대 팔꿈치 터치하기",
    exe: "양쪽 각 10회 3세트",
    type: "E5",
    difficulty: "A3",
  },
  {
    korName: "옆으로 무릎 들어 팔꿈치 터치하기",
    exe: "양쪽 각 10회 3세트",
    type: "E5",
    difficulty: "A3",
  },
  { korName: "제자리 걷기", exe: "60초 3세트", type: "E6", difficulty: "A1" },
  { korName: "옆으로 걷기", exe: "60초 3세트", type: "E6", difficulty: "A1" },
  {
    korName: "제자리 빨리 걷기",
    exe: "60초 3세트",
    type: "E6",
    difficulty: "A2",
  },
  {
    korName: "골반 높이까지 무릎 들며 걷기",
    exe: "60초 3세트",
    type: "E6",
    difficulty: "A2",
  },
  { korName: "제자리 달리기", exe: "60초 3세트", type: "E6", difficulty: "A3" },
  { korName: "옆으로 뛰기", exe: "60초 3세트", type: "E6", difficulty: "A3" },
  { korName: "호흡운동", exe: "호흡운동", type: "E7", difficulty: "A1" },
  { korName: "음성치료", exe: "음성치료", type: "E8", difficulty: "A1" },
  {
    korName: "림프부종 마사지",
    exe: "림프부종 마사지",
    type: "E9",
    difficulty: "A1",
  },
];

export function getExerciseExecutionMeta(params: {
  difficultyCd: DifficultyCode;
  exerciseTypeCd: string;
  korName: string;
}) {
  return exerciseExecutionMeta.find(
    (item) =>
      item.korName === params.korName &&
      item.type === params.exerciseTypeCd &&
      item.difficulty === params.difficultyCd,
  );
}
