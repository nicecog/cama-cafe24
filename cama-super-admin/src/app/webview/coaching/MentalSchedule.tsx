import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import SelectBox from "./component/Layout/SelectBox";
import Hours from "./component/Layout/Hours";
import React, { useEffect, useState } from "react";
import { getUpcomingDates, isDuplicateSelection } from "./mental/mentalUtil";
import { DaySelection } from "./mental/session_1/session1Atom";
import { useParams } from "react-router-dom";
import useAlert from "@/hooks/useAlert";
import axios from "@/utils/axios";
import { actions } from "./lib/coachingSlice";
const weekdays = [
  "월요일",
  "화요일",
  "수요일",
  "목요일",
  "금요일",
  "토요일",
  "일요일",
];

export default function MentalSchedule(props: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { isOpen, onClose } = props;

  const { loginId } = useParams();

  const dispatch = useDispatch();

  const { alert, confirm } = useAlert();

  const data = useSelector(
    (r: RootState) => r.COACHING.coaching.mental.answerList
  );

  //   useEffect
  useEffect(() => {
    if (!isOpen) return;

    const transformedData = data
      .filter((r) => r.stepDayCd === "Q1" && r.progressTypeCd === "J06")
      .map((item) => {
        const [wday, time] = item.answerChoice.split(" - ");
        return { wday, time: time, idx: item.answerChoiceSeq };
      });

    setValue(transformedData);
  }, [isOpen, data]);

  const [value, setValue] = useState<(DaySelection & { idx: number })[]>([
    { wday: "월요일", time: "1", idx: 1 },
    { wday: "월요일", time: "1", idx: 2 },
  ]);

  const onChangeHandler = (index: number) => (e: any) => {
    setValue((prev) =>
      prev.map((i) =>
        i.idx === index ? { ...i, [e.target.name]: e.target.value } : i
      )
    );
  };

  //    데이터 가져오기
  const getData = async () => {
    const [res1, res2] = await Promise.all([
      axios.post("/api/coaching/service/userAnswerInfoList", { loginId }),
      axios.post("/api/coaching/service/getCoachingProgressList", { loginId }),
    ]);

    return {
      sleep: res1.data.response.filter((r: any) => r.categoryCd === "A"),
      dietaryHabits: res1.data.response.filter(
        (r: any) => r.categoryCd === "B"
      ),
      exercise: res1.data.response.filter((r: any) => r.categoryCd === "C"),
      mental: res1.data.response.filter((r: any) => r.categoryCd === "D"),
      activity: res1.data.response.filter((r: any) => r.categoryCd === "E"),
      progress: res2.data.response,
    };
  };
  const onSubmit = async () => {
    if (isDuplicateSelection(value[0], value[1])) {
      alert("동일한 일정은 선택하실 수 없어요");
      return;
    }

    confirm(
      {
        html: `선택하신 마음근육 훈련 일정은 
          <p style="color:#FE8825;font-weight:600">[${value[0].wday} - ${value[0].time}시]</p>
          <p style="color:#FE8825;font-weight:600">[${value[1].wday} - ${value[1].time}시]</p>
            입니다.
          `,
      },
      async () => {
        try {
          // ✅ 1. `getUpcomingDates`를 기반으로 API 요청 데이터 생성
          const results = getUpcomingDates(value);
          const _list = results.map(({ startDate, time }) => ({
            loginId,
            startDate,
            time,
            categoryType: "D", // 심리
            memo: "심리",
          }));

          const updatedData = data
            .map((r) => ({ ...r, loginId }))
            .map((item) => {
              // progressTypeCd가 "J06"인 항목만 업데이트
              if (item.progressTypeCd === "J06") {
                const matchingValue = value.find(
                  (val) => val.idx === item.answerChoiceSeq
                );

                if (matchingValue) {
                  return {
                    ...item,
                    answerChoice: `${matchingValue.wday} - ${matchingValue.time}`, // "월요일 - 1" 형식
                    answerChoiceSeq: matchingValue.idx, // idx를 seq로 사용
                  };
                }
              }

              // progressTypeCd가 "J06"이 아니면 그대로 반환
              return item;
            });

          // ✅ 2. 기존 일정 삭제 (첫 번째 API 요청)
          await axios.put("/api/coaching/service/deleteSchedule", {
            loginId,
            categoryType: "D",
          });

          // ✅ 3. 새 일정 저장 (두 번째 API 요청)
          await axios.put("/api/coaching/service/saveSchedule", _list);

          // ✅ 4. 응답 리스트 저장 (세 번째 API 요청)
          const response = await axios.put(
            "/api/coaching/service/answerList",
            updatedData
          );

          // ✅ 5. 성공 시 데이터 갱신
          if (response.data.success) {
            alert("저장되었습니다.", async () => {
              const data = await getData();
              onClose();
              dispatch(actions.initDefaultData(data));
            });
          }
        } catch (error) {
          console.error("API 요청 중 오류 발생:", error);
          alert("일정 저장 중 오류가 발생했습니다. 다시 시도해주세요.");
        }
      }
    );
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-black/50 transition-opacity z-[11] 
        ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
    >
      {/* 다이얼로그 전체 */}
      <div
        className="relative bg-white w-full max-w-md mx-4 flex flex-col items-center rounded-xl overflow-hidden z-[99] "
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <h3 className="bg-camaColor1 w-full p-2 text-white font-semibold">
          마음훈련 일정변경{" "}
        </h3>
        {/* 🖼️ 말풍선 + 이미지 + 버튼 (딜레이 후 올라옴) */}
        <div className="w-full py-3 px-4 ">
          {value.map((items) => (
            <React.Fragment key={items.idx}>
              <p
                className={`border-b-2 mb-2 border-camaColor1  ${
                  items.idx === 1 ? "" : "mt-5"
                }`}
              >
                {items.idx === 1 ? "첫" : "두"}번째 일정
              </p>
              <div className="space-y-1.5">
                <div className="w-full flex items-center">
                  <div
                    className={`text-camaColor1 rounded-lg px-4 py-1  font-bold  w-[30%] `}
                  >
                    요일
                  </div>
                  <SelectBox
                    value={items.wday}
                    onChange={onChangeHandler(items.idx)}
                    name="wday"
                    className="w-full p-1  rounded-lg border-[#774F2D] border-2"
                    options={weekdays.map((t) => ({ label: t, value: t }))}
                  />
                </div>
                <div className="w-full flex items-center">
                  <div
                    className={`text-camaColor1 rounded-lg px-4 py-1  font-bold  w-[30%] `}
                  >
                    시간
                  </div>
                  <Hours
                    name="time"
                    label="시"
                    onChange={onChangeHandler(items.idx)}
                    value={items.time}
                  />
                </div>
              </div>
            </React.Fragment>
          ))}

          {/* ✅ 버튼 */}
          <div className="mt-3 px-4 py-2  flex w-full gap-3">
            <button
              className="bg-camaColor1 text-white rounded w-full py-1.5"
              onClick={onSubmit}
            >
              확인
            </button>
            <button
              className="bg-gray-500 text-white rounded w-full py-1.5"
              onClick={onClose}
            >
              취소
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
