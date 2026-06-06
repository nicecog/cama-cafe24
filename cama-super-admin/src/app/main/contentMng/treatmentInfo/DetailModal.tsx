import Modal from "@/components/modal/Modal";
import { useEffect, useState } from "react";
import axios from "@/utils/axios";
import ContentFormV2 from "../_component/ContentFormV2";
import useAlert from "@/hooks/useAlert";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/button";
import { useTranslation } from "react-i18next";

type DetailModalProps = {
  visible: boolean;
  onClose: () => void;
  seq?: string;
};

export default function DetailModal(props: DetailModalProps) {
  // props
  const { visible, onClose, seq } = props;
  const { alert, confirm } = useAlert();
  const { t } = useTranslation();
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
    title: "",
    trackServiceSeq: "",
    updatedAt: "",
    viewCount: "",
    viewed: "",
    priority: 1,
  });

  useEffect(() => {
    if (!seq || !visible) return;

    axios.get(`/api/doctor/contents/${seq}/view`).then(({ data }) => {
      setInfos(data?.response);
    });
  }, [seq, visible]);

  const onChange = (name: keyof typeof infos, value: any) => {
    setInfos((s) => ({ ...s, [name]: value }));
  };

  const onDelete = () => {
    confirm(
      {
        text: t("disabledTreatmentModal.confirmDelete"),
        icon: "warning",
      },
      () => {
        axios.delete(`/api/doctor/contents/${seq}/view`).then((_) => {
          alert(t("disabledTreatmentModal.deleted"), () => {
            // React Query 캐시 무효화
            queryClient.invalidateQueries({ queryKey: ["treatmentInfo"] });
            onClose();
          });
        });
      }
    );
  };

  const onUpdate = () => {
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
    };

    confirm(
      {
        text: t("disabledTreatmentModal.confirmUpdate"),
        icon: "question",
      },
      () => {
        axios
          .put(`api/doctor/contents/${infos.seq}/view`, _params)
          .then((_) => {
            alert(t("disabledTreatmentModal.updated"), () => {
              // React Query 캐시 무효화
              queryClient.invalidateQueries({ queryKey: ["treatmentInfo"] });
              onClose();
            });
          });
      }
    );
  };

  const handleClose = () => {
    onClose();
  };

  // render
  return (
    <Modal visible={visible} onClose={handleClose} size="lg" autoClose={false}      buttons={
        <div className="flex w-full justify-between">
          <Button
            className="!bg-red-500 !text-white !rounded-full !px-6 hover:!bg-red-600"
            onClick={onDelete}
          >
            {t("disabledTreatmentModal.deleteButton")}
          </Button>
          <div className="flex items-center gap-2">
            <Button
              onClick={onUpdate}
              className="!bg-green-600 !text-white !rounded-full !px-6 hover:!bg-green-700"
            >
              {t("disabledTreatmentModal.updateButton")}
            </Button>
            <Button
              onClick={onClose}
              className="!bg-gray-500 !text-white !rounded-full !px-6 hover:!bg-gray-600"
            >
              {t("disabledTreatmentModal.closeButton")}
            </Button>
          </div>
        </div>
      }>
      <div className="flex flex-col h-full">
        {/* Content */}
        <div className="flex-1 pt-4">
          <ContentFormV2 data={infos} onChange={onChange} />
        </div>
      </div>
    </Modal>
  );
}
