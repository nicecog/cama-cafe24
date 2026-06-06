import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import axios from "@/utils/axios";
import { ColumnDefsType } from "@/hooks/useExcelDownload";
import { useMemo, useState } from "react";
import AgGrid from "@/components/grid/AgGrid";
import Modal from "@/components/modal/Modal";
import { useTranslation } from "react-i18next";


const initialModalInfo = {
  visible: false,
  accountSeq: "",
  cancelAt: "",
  createdAt: "",
  days: "",
  diseaseName: "",
  diseaseOption: "",
  diseaseTreatment: "",
  diseaseType: "",
  interest: "",
  progress: "",
  seq: "",
  status: "",
};

export default function TrackReqHst() {
  const { t , i18n} = useTranslation();
  
  // Param
  const [searchParams] = useSearchParams();
  // seq
  const seq = searchParams.get("seq") || "0";

  const [modalInfo, setModalInfo] = useState(initialModalInfo);

  // 목록
  const { data } = useQuery({
    queryKey: ["coaching", "trackReqHst"],
    queryFn: async () => {
      const response = await axios
        .post("api/monitoring/coaching/getTrackReqHstList", {
          accountSeq: seq,
        })
        .then((res) => res.data.response);
      return response;
    },
    initialData: [],
  });

  //   컬럼 header 정의
  const columnDefs: ColumnDefsType[] = useMemo(
    () => [
      { headerName: t("patientMng_coachingMonitoring.trackReqHst.columns.disease"), field: "diseaseName" },
      { headerName: t("patientMng_coachingMonitoring.trackReqHst.columns.treatmentPeriod"), field: "diseaseTreatment" },
      { headerName: t("patientMng_coachingMonitoring.trackReqHst.columns.cancerType"), field: "diseaseType" },
      { headerName: t("patientMng_coachingMonitoring.trackReqHst.columns.considerations"), field: "diseaseOption" },
      { headerName: t("patientMng_coachingMonitoring.trackReqHst.columns.progressDays"), field: "days" },
      { headerName: t("patientMng_coachingMonitoring.trackReqHst.columns.interestArea"), field: "interest" },
      { headerName: t("patientMng_coachingMonitoring.trackReqHst.columns.progress"), field: "progress" },
      { headerName: t("patientMng_coachingMonitoring.trackReqHst.columns.status"), field: "status" },
      { headerName: t("patientMng_coachingMonitoring.trackReqHst.columns.createdAt"), field: "createdAt" },
      { headerName: t("patientMng_coachingMonitoring.trackReqHst.columns.cancelAt"), field: "cancelAt" },
    ],
    [t, i18n.language]
  );
  // Cell Click Event
  const onCellClicked = (params: any) => {
    setModalInfo((s) => ({ ...s, visible: true, ...params?.data }));
  };

  const Row = (props: any) => {
    return (
      <tr className={`border-t ${props.className}`}>
        <th className="border-r p-1 bg-gray-100 font-medium text-center">
          {props.title}
        </th>
        <td className="p-1.5 pl-5">{props.children}</td>
      </tr>
    );
  };

  // render
  return (
    <>
      <div className="h-full flex flex-col">
        <div className="text-sm px-2 text-main   pt-5 pb-1 font-semibold  flex-none text-right">
          {t("patientMng_coachingMonitoring.trackReqHst.doubleClickInfo")}
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
        onClose={() => setModalInfo((s) => ({ ...s, visible: false }))}
        cancelText={t("patientMng_coachingMonitoring.trackReqHst.close")}
        size={"md"}
        title={t("patientMng_coachingMonitoring.trackReqHst.detailView")}
      >
        <div>
          <table className="w-full text-sm">
            <colgroup>
              <col width={"20%"} />
              <col width={"*"} />
            </colgroup>
            <tbody>
              <Row title={t("patientMng_coachingMonitoring.trackReqHst.columns.disease")}> {modalInfo.diseaseName}</Row>
              <Row title={t("patientMng_coachingMonitoring.trackReqHst.columns.treatmentPeriod")}> {modalInfo.diseaseTreatment}</Row>
              <Row title={t("patientMng_coachingMonitoring.trackReqHst.columns.cancerType")}> {modalInfo.diseaseType}</Row>
              <Row title={t("patientMng_coachingMonitoring.trackReqHst.columns.considerations")}> {modalInfo.diseaseOption}</Row>
              <Row title={t("patientMng_coachingMonitoring.trackReqHst.columns.progressDays")}> {modalInfo.days}</Row>

              <Row title={t("patientMng_coachingMonitoring.trackReqHst.columns.interestArea")}> {modalInfo.interest}</Row>
              <Row title={t("patientMng_coachingMonitoring.trackReqHst.columns.progress")}> {modalInfo.progress}</Row>
              <Row title={t("patientMng_coachingMonitoring.trackReqHst.columns.status")}> {modalInfo.status}</Row>
              <Row title={t("patientMng_coachingMonitoring.trackReqHst.columns.createdAt")}> {modalInfo.createdAt}</Row>
              <Row title={t("patientMng_coachingMonitoring.trackReqHst.columns.cancelAt")} className="border-b">
                {modalInfo.cancelAt}
              </Row>
            </tbody>
          </table>
        </div>
      </Modal>
    </>
  );
}
