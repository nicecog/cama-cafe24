import type { SaveCoachingAnswerParams } from "@/apis/types";
import {
  mentalQuestions,
  mentalScheduleAnswerTemplate,
  mentalTypeScheduleCodeMap,
} from "./-constants";
import type {
  MentalSchedulePayload,
  MentalTrainingPlan,
  MentalTypeResult,
} from "./-types";

const weekdayMap = {
  월요일: 1,
  화요일: 2,
  수요일: 3,
  목요일: 4,
  금요일: 5,
  토요일: 6,
  일요일: 0,
} as const;

function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatTime(date: Date) {
  const hour = String(date.getHours()).padStart(2, "0");
  return `${hour}:00:00`;
}

function getUpcomingDates(trainingPlans: MentalTrainingPlan[]) {
  const now = new Date();

  return trainingPlans
    .flatMap(({ wday, time }) => {
      const targetDay = weekdayMap[wday];
      const targetHour = Number.parseInt(time, 10);
      const nextDate = new Date(now);
      const currentDay = nextDate.getDay();
      let dayOffset = targetDay - currentDay;

      if (dayOffset < 0) {
        dayOffset += 7;
      }

      nextDate.setDate(nextDate.getDate() + dayOffset);
      nextDate.setHours(targetHour, 0, 0, 0);

      if (nextDate.getTime() < now.getTime()) {
        nextDate.setDate(nextDate.getDate() + 7);
      }

      return Array.from({ length: 3 }, (_, index) =>
        new Date(nextDate.getTime() + index * 7 * 24 * 60 * 60 * 1000),
      ).map((date) => ({
        startDate: formatDate(date),
        time: formatTime(date),
        timestamp: date.getTime(),
      }));
    })
    .sort((a, b) => a.timestamp - b.timestamp);
}

export function isDuplicateMentalTrainingPlan(
  firstPlan: MentalTrainingPlan,
  secondPlan: MentalTrainingPlan,
) {
  return firstPlan.wday === secondPlan.wday && firstPlan.time === secondPlan.time;
}

export function buildMentalSection1SavePayload(params: {
  answers: number[];
  result: MentalTypeResult;
  trainingPlans: [MentalTrainingPlan, MentalTrainingPlan];
  loginId: string;
  accountName: string;
}) {
  const { answers, result, trainingPlans, loginId, accountName } = params;

  const d1 = mentalQuestions.map((question, index) => ({
    answerChoice: `${question.text} : ${answers[index]}`,
    refVal1: String(answers[index]),
    progressTypeCd: "D1",
  }));

  const d2 = [
    {
      answerChoice: result.dispName,
      refVal1: result.type,
      progressTypeCd: "D2",
    },
  ];

  const selectedTypeCode = mentalTypeScheduleCodeMap[result.dispName];
  const typeScheduleAnswers = trainingPlans.flatMap((plan) =>
    mentalScheduleAnswerTemplate.map((item) => ({
      progressTypeCd: item.progressTypeCd,
      answerChoice:
        item.progressTypeCd === selectedTypeCode
          ? `${plan.wday} - ${plan.time}`
          : item.answerChoice,
    })),
  );

  const answerListPayload: SaveCoachingAnswerParams[] = [...d1, ...d2, ...typeScheduleAnswers].map(
    (item) => ({
      ...item,
      answerChoiceSeq: 0,
      loginId,
      categoryCd: "D",
      accountName,
      stepDayCd: "Q1",
    }),
  );

  const schedulePayload: MentalSchedulePayload[] = getUpcomingDates(trainingPlans).map(
    ({ startDate, time }) => ({
      loginId,
      startDate,
      time,
      categoryType: "D",
      memo: "심리",
    }),
  );

  return {
    answerListPayload,
    schedulePayload,
  };
}
