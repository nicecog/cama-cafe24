import useExcelDownload, { ColumnDefsType } from "@/hooks/useExcelDownload";
import axios from "@/utils/axios";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import AgGrid from "@/components/grid/AgGrid";
import dayjs from "dayjs";
import { Button } from "@/components/button";
import { Select } from "@/components/forms";
import { cn } from "@/utils/utils";
import { FaChartLine, FaListUl } from "react-icons/fa";
import { Report } from "./Report";
import { useResetState } from "@/hooks/useResetState";
import Detail from "./Detail";
import { FcViewDetails } from "react-icons/fc";
import { useTranslation } from "react-i18next";


export default function CoachingProgress() {
  const { t, i18n } = useTranslation();
  
  // userTypeCd; // % : 전체, 10 : 연구참여자 , 20 : 연구미참여자
  const [userTypeCd, setUserTypeCd] = useState<string>("%");
  const [visible, setVisible] = useState<boolean>(true);
  // detail
  const [detailVisible, setDetailVisible, reset] = useResetState({
    visible: false,
    info: {
      seq: "",
      name: "",
      birth: "",
      gender: "",
      diseaseName: "",
      diseaseTreatment: "",
      userTypeNm: "",
      categoryAa: "",
      categoryBb: "",
      categoryCc: "",
      categoryDd: "",
      categoryEe: "",
      cancerProgressRate: "",
      avgStep: "",
    },
  });

  // Query Data
  const { data } = useQuery({
    queryKey: ["contents", "getFavoriteStatList", userTypeCd],
    queryFn: async () => {
      const response = await axios
        .post("api/monitoring/coaching/getUserCoachingMonitoringList", {
          userTypeCd,
        })
        .then((res) => res.data.response);
      return response;
    },
    initialData: [],
  });

  const columnDefs: ColumnDefsType[] = useMemo(
    () => [
      {
        field: "seq",
        headerName: t("coachingProgress.columns.detail"),
        cellRenderer: (params: any) => {
          return (
            <div className="flex h-full items-center justify-center">
              <button
                className=" border-slate-300 border p-1.5 rounded-md hover:bg-gray-100"
                onClick={() => {
                  setDetailVisible((p: any) => ({
                    ...p,
                    visible: true,
                    info: params.data,
                  }));
                }}
              >
                <FcViewDetails className="text-[18px]" />
              </button>
            </div>
          );
        },
      },
      { field: "name", headerName: t("coachingProgress.columns.name"), filter: true },
      { field: "birth", headerName: t("coachingProgress.columns.birth"), hide: true },
      { field: "gender", headerName: t("coachingProgress.columns.gender"), hide: true },
      { field: "diseaseName", headerName: t("coachingProgress.columns.disease"), hide: true },
      { field: "diseaseTreatment", headerName: t("coachingProgress.columns.period"), hide: true },
      { field: "userTypeNm", headerName: t("coachingProgress.columns.userType") },
      { field: "categoryAa", headerName: t("coachingProgress.columns.sleep") },
      { field: "categoryBb", headerName: t("coachingProgress.columns.diet") },
      { field: "categoryCc", headerName: t("coachingProgress.columns.physicalActivity") },
      { field: "categoryDd", headerName: t("coachingProgress.columns.mental") },
      { field: "categoryEe", headerName: t("coachingProgress.columns.exercise") },
      {
        field: "cancerProgressRate",
        headerName: t("coachingProgress.columns.cancerProgressRate"),
        maxWidth: 120,
      },
      { field: "avgStep", headerName: t("coachingProgress.columns.avgSteps"), maxWidth: 120 },
    ],
    [t, i18n.language]
  );

  const today = dayjs();
  const { onDownload } = useExcelDownload({
    fileName: `${t("coachingProgress.excelDownload")}_${today.format("YYYYMMDD")}.xlsx`,
    rowData: data,
    columnDefs,
  });

  return (
    <>
      <div className="flex flex-col h-full ">
        <div className="shrink-0 ">
          <div className="flex  gap-1.5 w-full justify-between items-center">
            <div className="flex gap-1 items-center pl-2">
              <button
                className={cn(
                  "p-2 bg-gray-300 rounded-md hover:bg-gray-400",
                  visible && "bg-gray-600 text-white"
                )}
                onClick={() => setVisible(true)}
              >
                <FaListUl />
              </button>
              <button
                className={cn(
                  "p-2 bg-gray-300 rounded-md hover:bg-gray-400",
                  !visible && "!bg-gray-600 !text-white"
                )}
                onClick={() => setVisible(false)}
              >
                <FaChartLine />
              </button>
            </div>
            <div className="flex gap-1.5 items-center">
              <Select
                options={[
                  { label: t("coachingProgress.userTypes.all"), value: "%" },
                  { label: t("coachingProgress.userTypes.participant"), value: "10" },
                  { label: t("coachingProgress.userTypes.nonParticipant"), value: "20" },
                ]}
                name="userTypeCd"
                value={userTypeCd}
                onChange={(e) => setUserTypeCd(e.target.value)}
              />

              <Button onClick={onDownload}>{t("coachingProgress.excelDownload")}</Button>
            </div>
          </div>
        </div>
        <div className="h-full mt-2 grow  ">
          {visible ? (
            <AgGrid colDefs={columnDefs} rowData={data} />
          ) : (
            <Report data={data} />
          )}
        </div>
      </div>
      <Detail
        visible={detailVisible.visible}
        onClose={reset}
        info={detailVisible.info}
      />
    </>
  );
}
