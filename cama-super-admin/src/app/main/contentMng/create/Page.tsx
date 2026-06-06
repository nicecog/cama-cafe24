import ContentForm from "../_component/ContentForm";
import { useState } from "react";
import Button from "@/components/button/DefaultButton";
import axios from "@/utils/axios";
import { useNavigate } from "react-router-dom";
import useAlert from "@/hooks/useAlert";
import { FaSave, FaList } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const CreateForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { alert, confirm } = useAlert();
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
      alert(t("contentCreate.selectDisease"));
      return;
    }

    const _disase = {
      ...JSON.parse(infos.disease),
      // diseaseSeq: infos.diseaseSeq,
    };

    const _params = {
      careTimeType: "", // 뭔지 모름 ??
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
        text: t("contentCreate.confirmRegister"),
        icon: "question",
      },
      () => {
        axios.post(`/api/doctor/contents`, _params).then((_) => {
          alert(t("contentCreate.registered"));
          navigate(-1);
        });
      }
    );
  };

  return (
    <div className={` h-full flex flex-col`}>
      <div className="flex items-center justify-between mb-5  border-b-2  border-main pb-3">
        <Button
          onClick={() => {
            confirm(
              {
                text: t("contentCreate.confirmBackToList"),
                icon: "question",
              },
              () => {
                navigate("/main/contentMng/treatmentInfo");
              }
            );
          }}
          className="!bg-white !text-gray-800 !hover:bg-white flex items-center"
        >
          <FaList className="text-[15px]" />
          {t("contentCreate.list")}
        </Button>
        <div className="flex-none flex items-center gap-1">
          <Button onClick={onCreate} className=" flex items-center">
            <FaSave className="text-[15px]" />
            {t("contentCreate.save")}
          </Button>
        </div>
      </div>
      <div className="h-full grow">
        <ContentForm data={infos} onChange={onChange} />
      </div>
    </div>
  );
};

export default CreateForm;
