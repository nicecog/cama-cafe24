import AgGrid from "@/components/grid/AgGrid";
import Modal from "@/components/modal/Modal";
import useAlert from "@/hooks/useAlert";
import { ColumnDefsType } from "@/hooks/useExcelDownload";
import axios from "@/utils/axios";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
 

export default function SurveyHistory() {
  const { alert } = useAlert();
  const { t , i18n} = useTranslation();
 
  // Param
  const [searchParams] = useSearchParams();
  // seq
  const accountSeq = searchParams.get("seq") || "0";

  const { data } = useQuery({
    queryKey: ["history", "survey"],
    queryFn: async () => {
      const response = await axios
        .post("api/monitoring/coaching/getExerciseSurveyResultList", {
          accountSeq,
        })
        .then((res) => res.data.response);
      return response;
    },

    initialData: [],
  });

  const [modalInfo, setModalInfo] = useState({
    visible: false,
    list: [],
  });

  const columnDefs: ColumnDefsType[] = useMemo(
    () => [
      {
        headerName: t("patientMng_coachingMonitoring.surveyHistory.columns.cancerType"),
        field: "cancerTypeNm",
        cellStyle: { textAlign: "center" },
      },
      {
        headerName: t("patientMng_coachingMonitoring.surveyHistory.columns.difficulty"),
        field: "difficultyNm",
        cellStyle: { textAlign: "center" },
      },
      {
        headerName: t("patientMng_coachingMonitoring.surveyHistory.columns.aerobic"),
        field: "aerobic",
        cellStyle: { textAlign: "center" },
        cellRenderer: (params: any) => {
          return params?.data?.aerobic === "Y" ? t("patientMng_coachingMonitoring.surveyHistory.aerobicRequired") : "N/A";
        },
      },
      {
        headerName: t("patientMng_coachingMonitoring.surveyHistory.columns.specialTherapy"),
        field: "therapyNm",
        cellStyle: { textAlign: "center" },
        cellRenderer: (params: any) => {
          return params?.data?.therapyNm ? params?.data?.therapyNm : "N/A";
        },
      },
      {
        headerName: t("patientMng_coachingMonitoring.surveyHistory.columns.assessmentDate"),
        field: "createdAt",
        cellStyle: { textAlign: "center" },
      },
      {
        headerName: t("patientMng_coachingMonitoring.surveyHistory.columns.progress"),
        field: "progress",
        cellStyle: { textAlign: "center" },
        cellRenderer: (params) => {
          return (
            <div className="w-full h-full flex items-center">
              <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: `linear-gradient(to right, #fe8825, #e67300)`,
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${params.data.progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <span className="ml-2 text-sm font-bold">{`${params.data.progress}%`}</span>
            </div>
          );
        },
      },
    ],
    [t, i18n.language]
  );

  //   컬럼 header 정의
  const modalCof: ColumnDefsType[] = useMemo(
    () => [
      {
        headerName: t("patientMng_coachingMonitoring.surveyHistory.columns.question"),
        field: "question",
      },
      {
        headerName: t("patientMng_coachingMonitoring.surveyHistory.columns.answer"),
        field: "answer",

        width: 100,
        cellRenderer: (params: any) => {
          return params.data?.answer === "Y" ? t("patientMng_coachingMonitoring.surveyHistory.yes") : t("patientMng_coachingMonitoring.surveyHistory.no");
        },
      },
    ],
    [t, i18n.language]
  );

  // Cell Click Event
  const onCellClicked = (params: any) => {
    try {
      const result = JSON.parse(params?.data?.surveyResultStr);
      if (!result) {
        alert(t("patientMng_coachingMonitoring.surveyHistory.noDetailData"));
      } else {
        setModalInfo((s) => ({ ...s, visible: true, list: result }));
      }
    } catch (e) {
      alert(t("patientMng_coachingMonitoring.surveyHistory.noDetailData"));
    }
  };

  return (
    <>
      <div className="h-full flex flex-col">
        <div className="text-sm px-2 text-main   pt-5 pb-1 font-semibold  flex-none text-right">
          {t("patientMng_coachingMonitoring.surveyHistory.doubleClickInfo")}
        </div>
        <div className="h-full grow">
          <AgGrid
            colDefs={columnDefs}
            rowData={data}
            pagination={false}
            onCellDoubleClicked={onCellClicked}
          />
        </div>
      </div>
      <Modal
        visible={modalInfo.visible}
        onClose={() =>
          setModalInfo((s) => ({ ...s, visible: false, list: [] }))
        }
        cancelText={t("patientMng_coachingMonitoring.surveyHistory.close")}
        size={"lg"}
        title={t("patientMng_coachingMonitoring.surveyHistory.detailList")}
      >
        <div className="h-[500px]">
          <AgGrid
            colDefs={modalCof}
            rowData={modalInfo.list}
            pagination={false}
          />
        </div>
      </Modal>
    </>
  );
}
