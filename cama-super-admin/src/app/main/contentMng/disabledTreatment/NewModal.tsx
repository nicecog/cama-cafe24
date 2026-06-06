import Modal from "@/components/modal/Modal";
import { useState } from "react";
import axios from "@/utils/axios";
import ContentFormV2 from "../_component/ContentFormV2";
import useAlert from "@/hooks/useAlert";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/button";
import { useTranslation } from "react-i18next";


type NewModalProps = {
  visible: boolean;
  onClose: () => void;
};

export default function NewModal(props: NewModalProps) {
  const { visible, onClose } = props;
  const { alert, confirm } = useAlert();
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();

  const [infos, setInfos] = useState({
    contents: "",
    contentsUpdatedAt: "",
    createdAt: "",
    departmentName: "",
    disease: "",
    diseaseName: "",
    diseaseSeq: "",
    doctorName: "",
    doctorSeq: "",
    enabled: "",
    image: "",
    interest: "",
    progress: "",
    removed: "",
    seq: "",
    priority: 1,
    title: "",
    trackServiceSeq: "",
    updatedAt: "",
    viewCount: "",
    viewed: "false",
  });

  const onChange = (name: keyof typeof infos, value: any) => {
    setInfos((s) => ({ ...s, [name]: value }));
  };

  const onCreate = () => {
    if (infos.diseaseSeq === "") {
      alert(t("disabledTreatmentModal.selectDisease"));
      return;
    }

    const _disase = {
      ...JSON.parse(infos.disease),
    };

    const _params = {
      careTimeType: "",
      contents: infos.contents,
      disease: _disase,
      diseaseSeq: _disase.diseaseSeq,
      diseaseName: _disase.name,
      image: infos.image,
      interest: infos.interest.length === 0 ? [] : JSON.parse(infos.interest),
      title: infos.title,
      viewed: infos.viewed,
      priority: Number(infos.priority),
      lang : i18n.language
    };

    confirm(
      {
        text: t("disabledTreatmentModal.confirmRegister"),
        icon: "question",
      },
      () => {
        axios.post(`/api/doctor/contents`, _params).then((_) => {
          alert(t("disabledTreatmentModal.registered"), () => {
            // React Query 캐시 무효화
            queryClient.invalidateQueries({ queryKey: ["disabledTreatment"] });
            // 폼 초기화
            setInfos({
              contents: "",
              contentsUpdatedAt: "",
              createdAt: "",
              departmentName: "",
              disease: "",
              diseaseName: "",
              diseaseSeq: "",
              doctorName: "",
              doctorSeq: "",
              enabled: "",
              image: "",
              interest: "",
              progress: "",
              removed: "",
              seq: "",
              priority: 1,
              title: "",
              trackServiceSeq: "",
              updatedAt: "",
              viewCount: "",
              viewed: "false",
            });
            onClose();
          });
        });
      }
    );
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Modal
      visible={visible}
      onClose={handleClose}
      size="lg"
      autoClose={false}
      buttons={
        <div className="flex w-full justify-end">
          <div className="flex items-center gap-2">
            <Button 
              onClick={onCreate} 
              className="!bg-green-600 !text-white !rounded-full !px-6 hover:!bg-green-700"
            >
              {t("disabledTreatmentModal.registerButton")}
            </Button>
            <Button 
              onClick={onClose} 
              className="!bg-gray-500 !text-white !rounded-full !px-6 hover:!bg-gray-600"
            >
              {t("disabledTreatmentModal.closeButton")}
            </Button>
          </div>
        </div>
      }
    >
      <div className="flex flex-col h-full">
        {/* Content */}
        <div className="flex-1 pt-4">
          <ContentFormV2 data={infos} onChange={onChange} />
        </div>
      </div>
    </Modal>
  );
}
