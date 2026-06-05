const firstNames = [
  "민준",
  "서준",
  "도윤",
  "예준",
  "시우",
  "하준",
  "지호",
  "주원",
];

const lastNames = ["김", "이", "박", "최", "정", "강", "조", "윤"];
const genders = ["male", "female"];

export function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomFullName() {
  return `${lastNames[randomInt(0, lastNames.length - 1)]}${firstNames[randomInt(0, firstNames.length - 1)]}`;
}

export function randomGender() {
  return genders[randomInt(0, genders.length - 1)];
}
