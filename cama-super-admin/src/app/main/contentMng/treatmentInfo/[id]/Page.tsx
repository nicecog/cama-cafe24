import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "@/utils/axios";
import ContentForm from "../../_component/ContentForm";
import Button from "@/components/button/DefaultButton";
import useAlert from "@/hooks/useAlert";
import { FaSave } from "react-icons/fa";
import { FaList } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
export default function Detail() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
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
    priority: "",
  });

  const { alert, confirm } = useAlert();

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
            navigate("/main/contentMng/treatmentInfo");
          });
        });
      }
    );
  };

  const onUpdate = () => {
    const _params = {
      careTimeType: "", // 뭔지 모름 ??
      contents: infos.contents,
      disease: JSON.parse(infos.disease),
      diseaseSeq: infos.diseaseSeq,
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
          .then((_: any) => {
            alert("수정되었습니다.", () => {
              navigate("/main/contentMng/treatmentInfo");
            });
          })
          .catch((error) => {
            alert(error?.response?.data?.error?.message);
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
                  navigate("/main/contentMng/treatmentInfo");
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
    </>
  );
}
