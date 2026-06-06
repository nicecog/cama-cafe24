import { createCommonReducers } from "../../../../utils/sliceUtils";
import { RootState } from "@/store/store";
import { createSlice } from "@reduxjs/toolkit";
import { CodeListType } from "./coachingType";
import { getCurrentDay } from "./coachingUtils";

type CategoryType = {
  answerList: any[];
  stepDayCd: string;
  currentStepDayCd: string;
};

export type CoachingType = {
  fontSize: number;
  codeList: CodeListType[];
  accountName: string;
  sleep: CategoryType;
  mental: CategoryType;
  exercise: CategoryType;
  dietaryHabits: CategoryType;
  activity: CategoryType;
  progress: any[];
};

const initialState: CoachingType = {
  fontSize: 18,
  codeList: [],
  accountName: "",
  progress: [],
  sleep: {
    answerList: [],
    stepDayCd: "00",
    currentStepDayCd: "CAL",
  },
  mental: {
    answerList: [],
    stepDayCd: "00",
    currentStepDayCd: "CAL",
  },
  exercise: {
    answerList: [],
    stepDayCd: "00",
    currentStepDayCd: "CAL",
  },
  dietaryHabits: {
    answerList: [],
    stepDayCd: "00",
    currentStepDayCd: "CAL",
  },
  activity: {
    answerList: [],
    stepDayCd: "00",
    currentStepDayCd: "CAL",
  },
};

const getMaxStepDay = (data: any[]) => {
  if (data.length === 0) {
    return 0;
  }
  const maxStepDay = Math.max(
    ...new Set(data.map((item) => parseInt(item.stepDayCd.replace("Q", ""))))
  );
  return maxStepDay;
};

export const sleepSlice = createSlice({
  name: "coaching/common",
  initialState,
  reducers: {
    ...createCommonReducers(initialState),

    onPlusFont: (state) => {
      state.fontSize = Math.min(state.fontSize + 2, 24);
    },

    onMinusFont: (state) => {
      state.fontSize = Math.max(state.fontSize - 2, 14);
    },

    setSleepStepDayCd: (state, { payload }) => {
      state.sleep.currentStepDayCd = payload;
    },
    setExerciseStepDayCd: (state, { payload }) => {
      state.exercise.currentStepDayCd = payload;
    },
    setDietaryHabitsStepDayCd: (state, { payload }) => {
      state.dietaryHabits.currentStepDayCd = payload;
    },

    setMentalStepDayCd: (state, { payload }) => {
      state.mental.currentStepDayCd = payload;
    },

    setActivityStepDayCd: (state, { payload }) => {
      state.activity.currentStepDayCd = payload;
    },

    initDefaultData: (
      state,
      {
        payload: { sleep, mental, exercise, dietaryHabits, activity, progress },
      }
    ) => {
      const _sleepStepDayCd = getCurrentDay(sleep, "A", 16);

      const _exerciseStepDayCd = getCurrentDay(exercise, "C", 16);

      const _dietaryHabitsStepDayCd = getCurrentDay(dietaryHabits, "B", 16);
      const _activityStepDayCd = getCurrentDay(dietaryHabits, "E", 16);

      // 회기 기준
      const _mentalStepDayCd = getMaxStepDay(mental);

      state.sleep = {
        ...state.sleep,
        answerList: sleep,
        stepDayCd: _sleepStepDayCd,
      };
      state.mental = {
        ...state.mental,
        answerList: mental,
        stepDayCd: _mentalStepDayCd + "",
      };
      state.exercise = {
        ...state.exercise,
        answerList: exercise,
        stepDayCd: _exerciseStepDayCd + "",
      };
      state.dietaryHabits = {
        ...state.dietaryHabits,
        answerList: dietaryHabits,

        stepDayCd: _dietaryHabitsStepDayCd + "",
      };
      state.activity = {
        ...state.activity,
        answerList: activity,
        stepDayCd: _activityStepDayCd + "",
      };

      state.progress = progress;
      state.accountName = progress[0].accountName;
    },
  },
});

export const actions = sleepSlice.actions;
export const getState = (state: RootState) => state.COACHING.coaching;
export default sleepSlice.reducer;
