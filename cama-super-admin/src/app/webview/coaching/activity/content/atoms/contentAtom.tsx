import { atom } from "jotai";

type ClassInfoType = {
  accountSeq: number;
  aerobic: string | null;
  cancerTypeCd: string | null;
  exerciseProgramCd: string | null;
  loginId: string | null;
  therapyCd: string | null;
};

type ContentListType = {
  chk?: boolean;
  difficultyCd: string;
  engName: string;
  exerciseTypeCd: string;
  indexNum: number;
  korName: string;
  loginId: string | null;
  url: string;
};

export const contentListAtom = atom<ContentListType[]>([]);

export const checkedContentListAtom = atom<string[]>([]);

export const classInfoAtom = atom<ClassInfoType>({
  accountSeq: 0,
  aerobic: null,
  cancerTypeCd: null,
  exerciseProgramCd: null,
  loginId: null,
  therapyCd: null,
});

// 운동
const workout = atom<ContentListType>({
  difficultyCd: "",
  engName: "",
  exerciseTypeCd: "",
  indexNum: 0,
  korName: "",
  loginId: "",
  url: "",
});

// 운동코칭 답변
export const activityAnswers = atom<any[]>([]);

// 완료
export const onCompleteAtom = atom(null, (get, set) => {
  const _current = get(checkedContentListAtom);
  const _currentWorkout = get(workout);

  if (!_current.includes(_currentWorkout.korName)) {
    set(checkedContentListAtom, _current.concat(_currentWorkout.korName));
  }

  set(workout, {
    difficultyCd: "",
    engName: "",
    exerciseTypeCd: "",
    indexNum: 0,
    korName: "",
    loginId: "",
    url: "",
  });
});

// export const contentAtom = atom(
//   (get) => {
//     const contentList = get(contentListAtom);
//     const info = get(classInfoAtom);

//     console.log(info);
//     let filterArr = [
//       info.cancerTypeCd,
//       ...(info.aerobic === "Y" ? ["E6"] : []),
//     ];

//     //  1 난이도로 필터링을 한다.
//     const _content = contentList.filter(
//       (r) => r.difficultyCd === info.exerciseProgramCd
//     );

//     return _content.filter((r) => filterArr.includes(r.exerciseTypeCd));
//   },
//   (
//     _,
//     set,
//     update: {
//       contentList: ContentListType[];
//       classInfo: ClassInfoType;
//       answerList: any[];
//     }
//   ) => {
//     set(
//       contentListAtom,
//       update.contentList.map((t) => ({ ...t, chk: false }))
//     );
//     set(classInfoAtom, update.classInfo);
//     set(
//       activityAnswers,
//       update.answerList.filter((item) => item.categoryCd === "E")
//     );
//   }
// );

export const workOutAtom = atom(
  (get) => get(workout),
  (_, set, update: ContentListType) => {
    set(workout, update);
  }
);
