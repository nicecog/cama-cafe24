import { Select } from "@/components/forms";
import { ChangeEvent, useEffect, useMemo, useState } from "react";

import axios from "@/utils/axios";
import RadialBarChart from "@/components/charts/RadialBarChart";
import AgGrid from "@/components/grid/AgGrid";
import { useSearchParams, useNavigate } from "react-router-dom";
import DetailModal from "./Modal";
import Button from "@/components/button/DefaultButton";
import useExcelDownload, { ColumnDefsType } from "@/hooks/useExcelDownload";
import dayjs from "dayjs";
import { useQuery } from "@tanstack/react-query";
import StepChart from "./StepChart";
import useAlert from "@/hooks/useAlert";
import { useTranslation } from "react-i18next";

// 코칭 모니터링 목록 (환자별 radial 차트)
const coachingListUrl = "/api/monitoring/coaching/getCoachingMonitoringList";
// 코칭모니터링 상세
const coachingDetailUrl = "/api/monitoring/coaching/getCoachingDetailList";
// 코칭 모니터링 삭제
const deleteUrl = "/api/monitoring/coaching/deleteAnswer";

export default function CoachingMonitoring() {
  const { t, i18n } = useTranslation();

  // 카테고리 옵션
  const options = useMemo(
    () => [
      { label: t("patientMng_coachingMonitoring.coaching.categories.sleep"), value: "A" },
      { label: t("patientMng_coachingMonitoring.coaching.categories.diet"), value: "B" },
      { label: t("patientMng_coachingMonitoring.coaching.categories.physicalActivity"), value: "C" },
      { label: t("patientMng_coachingMonitoring.coaching.categories.mental"), value: "D" },
    ],
    [t, i18n.language],
  );
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { alert, confirm } = useAlert();

  const name = searchParams.get("name") || "";
  const seq = searchParams.get("seq") || "0";

  const [rowData, setRowData] = useState<any[]>([]);
  const [gridData, setGridData] = useState<any[]>([]);
  const [categoryCd, setCategoryCd] = useState("A");
  const [chartsLoading, setChartsLoading] = useState(false);

  const { data: stepData, isFetching: stepFetching } = useQuery({
    queryKey: ["coaching", "stepCount", seq],
    queryFn: async () => {
      const response = await axios.post("/api/monitoring/coaching/getStepInfoList", {
        accountSeq: seq,
      });
      return response.data.response ?? [];
    },
    enabled: seq !== "0",
  });

  const loadPatientCoaching = async (searchSeq: string, searchCategoryCd: string) => {
    if (!searchSeq || searchSeq === "0") {
      setRowData([]);
      setGridData([]);
      return;
    }

    setChartsLoading(true);
    try {
      const [listRes, detailRes] = await Promise.all([
        axios.post(coachingListUrl, {
          acSeq: searchSeq,
          searchType: "name",
          searchText: name,
          page: "1",
        }),
        axios.post(coachingDetailUrl, {
          acSeq: searchSeq,
          categoryCd: searchCategoryCd,
        }),
      ]);

      const targetSeq = Number(searchSeq);
      const rows = (listRes.data.response ?? []).filter(
        (r: any) => Number(r.seq) === targetSeq,
      );
      setRowData(rows);
      setGridData(detailRes.data.response ?? []);
    } catch {
      alert(t("patientMng_coachingMonitoring.coaching.noData"));
      setRowData([]);
      setGridData([]);
    } finally {
      setChartsLoading(false);
    }
  };

  useEffect(() => {
    loadPatientCoaching(seq, categoryCd);
  }, [seq, name, categoryCd]);

  const recommendedColors = [
    "#1a8cff", // 진한 청록색 - 메인 색상과 잘 어울리는 강렬한 청록색
    "#ff1493", // 분홍색 - 포인트 색상으로, 강조할 때 사용할 수 있는 분홍색
    "#2ca02c", // 초록색 - 자연을 연상시키는 초록색, 메인 색상과 조화로움
    "#ff7f0e", // 주황색 - 메인 색상과 대조를 이루는 따뜻한 주황색
    "#ffbb78", // 연한 주황색 - 부드러운 연한 주황색, 톤 다운되어 조화를 이룰 수 있음
  ];

  const onDetailClick = (e: ChangeEvent<HTMLSelectElement>) => {
    setCategoryCd(e.target.value);
  };

  const colDefs = useMemo(
    () => [
      { headerName: t("patientMng_coachingMonitoring.coaching.columns.coaching"), field: "categoryNm", width: 80 },
      { headerName: t("patientMng_coachingMonitoring.coaching.columns.day"), field: "stepDayNm", width: 80 },
      { headerName: t("patientMng_coachingMonitoring.coaching.columns.cardType"), field: "progressTypeNm", width: 130 },
      {
        headerName: t("patientMng_coachingMonitoring.coaching.columns.question"),
        field: "question",
        align: "left",
      },
      { headerName: t("patientMng_coachingMonitoring.coaching.columns.answerSeq"), field: "answerChoiceSeq", width: 100 },
      { headerName: t("patientMng_coachingMonitoring.coaching.columns.answer"), field: "answerChoice", width: 200 },
    ],
    [t, i18n.language]
  );

  const columnDefs: ColumnDefsType[] = useMemo(
    () => [
      { headerName: t("patientMng_coachingMonitoring.coaching.columns.coaching"), field: "categoryNm" },
      { headerName: t("patientMng_coachingMonitoring.coaching.columns.day"), field: "stepDayNm" },
      { headerName: t("patientMng_coachingMonitoring.coaching.columns.cardType"), field: "progressTypeNm" },
      { headerName: t("patientMng_coachingMonitoring.coaching.columns.question"), field: "question", width: 100, align: "left" },
      { headerName: t("patientMng_coachingMonitoring.coaching.columns.answerSeq"), field: "answerChoiceSeq" },
      { headerName: t("patientMng_coachingMonitoring.coaching.columns.answer"), field: "answerChoice", width: 40, align: "left" },
    ],
    [t, i18n.language]
  );
  // 오늘 날짜
  const today = dayjs();
  // 엑셀 날짜
  const { onDownload } = useExcelDownload({
    columnDefs,
    fileName: `${name}님의 ${
      options.find((r) => r.value === categoryCd)?.label
    } 건강코칭정보_${today.format("YYYY-MM-DD")}.xlsx`,
    rowData: gridData,
  });

  const [modalInfo, setModalInfo] = useState({
    visible: false,
    text: "",
    answer: "",
  });
  const onCellDoubleClicked = (e: any) => {
    setModalInfo((s) => ({
      ...s,
      visible: true,
      text: e.data.question,
      answer: e.data.answerChoice,
    }));
  };

  // 화면분할 사용여부
  const [fullSize, setFullSize] = useState(false);

  // 사용자 답변 삭제
  const onDeleteAnswer = () => {
    const titles = options.find((r) => r.value === categoryCd)?.label;

    confirm(
      {
        title: t("patientMng_coachingMonitoring.coaching.delete"),
        icon: "question",
        text: `[${titles}] ${t("patientMng_coachingMonitoring.coaching.confirmDelete")}`,
      },
      () => {
        axios
          .put(deleteUrl, {
            acSeq: seq,
            categoryCd,
          })
          .then(({ data }) => {
            if (data.success) {
              alert(t("patientMng_coachingMonitoring.coaching.deleted"));

              loadPatientCoaching(seq, categoryCd);
            }
          });
      }
    );
  };

  return (
    <>
      <div className=" h-full p-2 flex flex-col  w-full">
        <div className="p-4 w-full flex-none">
          <div className="flex justify-between items-center">
            <div className="flex">
              <h1 className="p-2   text-xs">
                <span className="font-bold underline text-sm">{name}</span>{t("patientMng_coachingMonitoring.coaching.title")}
              </h1>
              <div className="flex content-center pl-4 ">
                <Select
                  options={options}
                  onChange={onDetailClick}
                  name="categoryCd"
                  value={categoryCd}
                  className="w-60 flex-1"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  setFullSize(!fullSize);
                }}
              >
                {fullSize ? t("patientMng_coachingMonitoring.coaching.splitView") : t("patientMng_coachingMonitoring.coaching.fullScreen")}
              </Button>
              <Button className="!bg-white !text-main" onClick={onDownload}>
                {t("patientMng_coachingMonitoring.coaching.excelDownload")}
              </Button>

              <Button
                onClick={() => {
                  navigate(
                    `/main/patientMng/patientAccount?seq=${seq}&name=${encodeURIComponent(name)}`,
                  );
                }}
              >
                {t("patientMng_coachingMonitoring.coaching.manageAccount")}
              </Button>
              <Button
                onClick={onDeleteAnswer}
                className="!bg-[#ff7f0e] !border-camaColor1"
              >
                {t("patientMng_coachingMonitoring.coaching.resetCoaching")}
              </Button>
            </div>
          </div>
          {!fullSize ? (
            <div className="mt-5 flex w-full flex-col">
              {(chartsLoading || stepFetching) && (
                <div className="flex justify-center py-6">
                  <div className="w-10 h-10 border-4 border-green-600 border-solid rounded-full animate-spin border-t-transparent" />
                </div>
              )}
              <div className="flex justify-around flex-auto ">
                {!chartsLoading &&
                  rowData.map((i: any, index: number) => (
                    <RadialBarChart
                      key={`${i.categoryCd ?? index}-${i.seq}`}
                      title={i.categoryNm}
                      per={Number(i.progress) || 0}
                      color={recommendedColors[index % recommendedColors.length]}
                    />
                  ))}
              </div>

              <div className="w-full">
                <StepChart data={stepData ?? []} />
              </div>
            </div>
          ) : null}
          {/* Detail  */}
        </div>
        <div className="h-full mt-10 grow  ">
          <AgGrid
            colDefs={colDefs}
            rowData={gridData}
            pagination={false}
            onCellDoubleClicked={onCellDoubleClicked}
          />
        </div>
      </div>

      <DetailModal
        visible={modalInfo.visible}
        text={modalInfo.text}
        answer={modalInfo.answer}
        onClose={() => {
          setModalInfo({ visible: false, text: "", answer: "" });
        }}
      />
    </>
  );
}
