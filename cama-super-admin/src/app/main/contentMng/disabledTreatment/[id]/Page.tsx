import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "@/utils/axios";
import ContentForm from "../../_component/ContentForm";
import Button from "@/components/button/DefaultButton";
import useAlert from "@/hooks/useAlert";
import { FaList } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import { FaSave } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
export default function Detail() {
  const navigate = useNavigate();

  const { alert, confirm } = useAlert();
  const { id = "" } = useParams();

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
    if (!id) return;

    axios.get(`/api/doctor/contents/${id}/view`).then(({ data }) => {
      setInfos(data?.response);
    });
  }, []);

  const onChange = (name: keyof typeof infos, value: any) => {
    setInfos((s) => ({ ...s, [name]: value }));
  };

  const onDelete = () => {
    confirm(
      {
        text: "삭제 하시겠습니까? ",
        icon: "warning",
      },
      () => {
        axios.delete(`/api/doctor/contents/${id}/view`).then((_) => {
          alert("삭제 되었습니다. ", () => {
            navigate("/main/contentMng/disabledTreatment");
          });
        });
      }
    );
  };

  const onUpdate = () => {
    if (infos.diseaseSeq === "") {
      alert("질환을 선택해 주세요.");
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
        text: "수정 하시겠습니까? ",
        icon: "question",
      },
      () => {
        axios
          .put(`api/doctor/contents/${infos.seq}/view`, _params)
          .then((_) => {
            alert("수정되었습니다.", () => {
              navigate("/main/contentMng/disabledTreatment");
            });
          });
      }
    );
  };

  return (
    <>
      <div className={` h-full flex flex-col`}>
        <div className="flex items-center justify-between mb-5  border-b-2  border-main pb-3">
          <Button
            onClick={() => {
              confirm(
                {
                  text: "목록으로 돌아 가시겠습니까?",
                  icon: "question",
                },
                () => {
                  navigate("/main/contentMng/disabledTreatment");
                }
              );
            }}
            className="!bg-white !text-gray-800 !hover:bg-white flex items-center"
          >
            <FaList className="text-[15px]" />
            취소
          </Button>
          <div className="flex-none flex items-center gap-1">
            <Button
              onClick={onDelete}
              className="!bg-white !text-red-600 border-red-600 !hover:bg-white flex items-center"
            >
              <MdDelete className="text-[15px]" />
              삭제
            </Button>
            <Button onClick={onUpdate} className=" flex items-center">
              <FaSave className="text-[15px]" />
              수정
            </Button>
          </div>
        </div>
        <div className="h-full grow">
          <ContentForm data={infos} onChange={onChange} />
        </div>
      </div>
      {/* <div
        className={`bg-white shadow-md rounded-md px-5 py-2 pt-4 overflow-hidden h-[calc(100vh_-_80px)]  `}
      >
        <div className={`b-5  overflow-y-auto px-3  h-full  flex-1 w-full`}>
          <ContentForm data={infos} onChange={onChange} />
          <div className="flex bottom-0 left-0 w-full border-t mt-2 pt-2">
            <Button onClick={onCancel} className="">
              취소
            </Button>
            <Button onClick={onDelete} className="">
              삭제
            </Button>
            <Button onClick={onUpdate} className="">
              수정
            </Button>
          </div>
        </div>
      </div> */}
    </>
  );
}
