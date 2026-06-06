import { AnswerInfo, CodeListType } from "./coachingType";
import Swal from "sweetalert2";

// 단일  마지막 수행 날짜
export const getCurrentDay = (
  userAnswerInfo: AnswerInfo[],
  type: string,
  maxDay: number | string
) => {
  // 시작일자는 최초 "00"
  let stepDayCd = "00";

  if (userAnswerInfo.length === 0) {
    return "00";
  }

  const _userMaxDate = (() => {
    const filteredDates = userAnswerInfo
      .filter((item: any) => item.categoryCd === type)
      .map((item: any) => parseInt(item["stepDayCd"], 10));

    return filteredDates.length > 0 ? Math.max(...filteredDates) : -1;
  })();

  // 입력된 답변이 코드상의 마지막날짜와 같다면 최초 일자로 돌림 같지 않아야만 다음날 찾기
  // 100 프로 완료후에도 달력을 들어가려면 삭제 필요
  if (+maxDay !== _userMaxDate) {
    // maxDate의 다음날에 해당하는 값을 찾기 위해 다음 날의 값을 계산합니다.
    const nextDay = (_userMaxDate + 1).toString().padStart(2, "0");
    stepDayCd = nextDay;
  }
  return stepDayCd;
};

// 카테고리별
export const getCurrentDayArray = (
  codeList: CodeListType[],
  userAnswerInfo: AnswerInfo[]
) => {
  // 카테고리별 목록
  const categoryList = codeList.filter(
    (r: CodeListType) => r.code === "CATEGORY_CD"
  );

  const coachingInfo = categoryList.map((i: CodeListType) => {
    // 답변목록중 각 카테고리별 다음값 계산

    // 시작일자는 최초 "00"
    let stepDayCd = "00";
    let stepDayNm = "시작";
    // 입력된 답변의 최대 날짜 구하기
    const _userMaxDate = (() => {
      const filteredDates = userAnswerInfo
        .filter((item: any) => item.categoryCd === i.cd)
        .map((item: any) => parseInt(item["stepDayCd"], 10));

      return filteredDates.length > 0 ? Math.max(...filteredDates) : -1;
    })();

    const _codeMaxDate = Math.max(
      ...codeList
        .filter((item: any) => item.code === "STEP_DAY_CD")
        .map((item: any) => parseInt(item["cd"], 10))
    );

    // 입력된 답변이 코드상의 마지막날짜와 같다면 최초 일자로 돌림 같지 않아야만 다음날 찾기
    if (_codeMaxDate !== _userMaxDate) {
      // maxDate의 다음날에 해당하는 값을 찾기 위해 다음 날의 값을 계산합니다.
      const nextDay = (_userMaxDate + 1).toString().padStart(2, "0");

      // codeList에서 다음 날에 해당하는 값을 찾습니다.
      const nextDayItem = codeList.find(
        (item: CodeListType) =>
          item.code === "STEP_DAY_CD" && item.cd === nextDay
      );

      // 다음 날에 해당하는 값이 있다면, 해당 값을 startDate로 설정합니다.
      stepDayCd = nextDayItem ? nextDayItem.cd : "00";
      stepDayNm = nextDayItem ? nextDayItem.val : "시작";
    }
    return {
      categoryCd: i.cd,
      categoryNm: i.val,
      stepDayCd,
      stepDayNm,
    };
  });

  return coachingInfo;
};

// 이전날 값 생성
export const getPrevDay = (input: string) => {
  const value = parseInt(input, 10);
  return (value <= 0 ? 0 : value - 1).toString().padStart(2, "0");
};
// 다음날
export const getNextDay = (input: string, maxValue: string) => {
  const value = parseInt(input, 10);
  return (value >= +maxValue ? maxValue : value + 1)
    .toString()
    .padStart(2, "0");
};

// 사용자 명 가져오기
export const getFirstAccountName = (data: AnswerInfo[]): string => {
  return data.length > 0 ? data[0].accountName : "";
};

export const initAnswerData = {
  accountName: "",
  addDetailInfo: null,
  categoryCd: "A",
  detailInfo: "",
  detailSeq: 0,
  loginId: null,
  progressTypeCd: "A1",

  stepDayCd: "00",
};

export const createAnswerList = (list: any[], opt?: any): AnswerInfo[] => {
  return list.map((i, num: number) => ({
    accountName: "",
    addDetailInfo: null,
    categoryCd: "A",
    detailInfo: i,
    detailSeq: num,
    loginId: null,
    progressTypeCd: "A1",
    stepDayCd: "00",
    ...opt,
  }));
};

// 일단 생성
export const createAnswer = (detailInfo: string, detailSeq: number) => {
  return {
    ...initAnswerData,
    detailSeq,
    detailInfo,
  };
};

//  답변을 선택하여 배열을 리턴한다. 배열안에 이미 있을경우는 해당내용을 제거한다.
export const selectedAnswer = (
  stepAnswerList: string[],
  selected: string,
  answerCnt: number
) => {
  let _values = [];

  // 1건만 가능일경우 -> 라디오체크 형태
  if (answerCnt === 1) {
    _values = [selected];
  } else {
    const isChecked = stepAnswerList.some((i: string) => i === selected);

    if (!isChecked && answerCnt && stepAnswerList.length >= +answerCnt) {
      Swal.fire(`답변은 ${answerCnt}건 선택 가능합니다.`);
      // alert(`답변은 ${answerCnt}건 선택 가능합니다.`);
      return stepAnswerList;
    } else {
      _values = isChecked
        ? stepAnswerList.filter((i: string) => i !== selected)
        : [...stepAnswerList, selected];
    }
  }
  return _values;
};

// 문자열에서 최대 숫자를 뽑아온다.
export const getNumberInnerText = (text: string) => {
  const numbers = text ? text.match(/\d+/g) : null;
  if (!numbers || numbers.length === 0) {
    return 0; // 숫자가 없거나 텍스트가 없는 경우 0 반환
  }
  const parsedNumbers = numbers.map(Number);
  return Math.max(...parsedNumbers);
};
