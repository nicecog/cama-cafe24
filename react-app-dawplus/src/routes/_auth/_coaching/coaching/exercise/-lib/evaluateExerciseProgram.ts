import type {
  CancerTypeName,
  TherapyCode,
} from "../-constants/exerciseCodeMap";

export interface ExerciseProgramResult {
  program: "A1" | "A2" | "A3";
  aerobic: "Y" | "N";
  therapy: TherapyCode | "";
}

export function evaluateExerciseProgram(
  cancerType: CancerTypeName,
  answers: string[],
): ExerciseProgramResult {
  let program: ExerciseProgramResult["program"] = "A2";
  let aerobic: ExerciseProgramResult["aerobic"] = "N";
  let therapy: ExerciseProgramResult["therapy"] = "";

  const highProgramAnswers = [
    answers[0],
    answers[2],
    answers[4],
    answers[6],
    answers[7],
    answers[9],
    answers[10],
  ];

  if (highProgramAnswers.every((answer) => answer === "Y")) {
    if (
      cancerType === "갑상선암" &&
      [answers[14], answers[15]].every((answer) => answer === "Y")
    ) {
      program = "A3";
    } else if (cancerType === "유방암" && answers[14] === "Y") {
      program = "A3";
    } else if (cancerType === "대장암" || cancerType === "폐암") {
      program = "A3";
    }
  }

  if (answers[11] === "Y") {
    program = "A1";
  }

  if (
    (cancerType === "갑상선암" || cancerType === "폐암") &&
    answers[13] === "Y"
  ) {
    program = "A1";
  }

  if (answers[12] === "Y") {
    aerobic = "Y";
  }

  if (cancerType === "대장암" && (answers[14] === "Y" || answers[15] === "Y")) {
    aerobic = "Y";
  }

  if (cancerType === "폐암" && answers[13] === "Y") {
    aerobic = "Y";
  }

  if (cancerType === "갑상선암" && answers[16] === "Y") {
    therapy = "T1";
  }

  if (cancerType === "폐암" && answers[14] === "Y") {
    therapy = "T2";
  }

  if (cancerType === "유방암" && answers[15] === "Y") {
    therapy = "T3";
  }

  return { program, aerobic, therapy };
}
