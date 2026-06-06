import useCodeApi from "@/app/main/api/useCodeApi";
import { Button } from "@/components/button";
import { Input, Select, Textarea } from "@/components/forms";
import Modal from "@/components/modal/Modal";
import useAlert from "@/hooks/useAlert";
import axios from "@/utils/axios";
import { useMemo, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const initialInfo = {
  seq: null,
  useYn: "Y",
  url: "",
  urlCheck: true,
  detailDesc: "",
  priority: "1",
  videoTypeCd: "V1",
};

export default function UpdateModal(props: any) {
  // Props
  const { visible, onClose, selectedInfo } = props;

  const [info, setInfo] = useState(initialInfo);
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();

  const { getCodeList } = useCodeApi("VIDEO_TYPE_CD");

  const { data: codes } = getCodeList();

  const { alert, confirm } = useAlert();

  const typeCdOption = useMemo(() => {
    return codes.map((r: any) => ({ ...r, value: r.cd, label: r.val }));
  }, [codes]);
  const onChange = (e: any) => {
    setInfo((s) => ({
      ...s,
      [e.target.name]: e.target.value,
      urlCheck: e.target.name === "url" ? false : s.urlCheck,
    }));
  };

  // useMutation으로 비디오 수정
  const updateMutation = useMutation({
    mutationFn: async (params: any) => {
      const { data } = await axios.put(`/api/doctor/contents/putCmVideoInfo`, params);
      return data;
    },
    onSuccess: () => {
      alert(t("videoMng.modal.updated"));
      queryClient.invalidateQueries({ queryKey: ['videoList'] });
      setInfo(initialInfo); // 폼 초기화
      onClose();
    },
  });

  //   확인
  const onOk = () => {
    if (!info.urlCheck) {
      alert(t("videoMng.modal.checkUrlFirst"));
      return;
    }

    confirm(t("videoMng.modal.confirmUpdate"), () => {
      const { urlCheck, ...params } = info;
      updateMutation.mutate({ ...params, lang: i18n.language  });
    });
  };

  useEffect(() => {
    if (visible) {
      // 열림 - selectedInfo 로드
      setInfo((s) => ({
        ...s,
        ...selectedInfo,
      }));
    }
  }, [visible, selectedInfo]);

  const checkUrl = () => {
    // YouTube 링크를 확인하는 정규표현식
    const youtubeRegex =
      /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|shorts\/)|youtu\.be\/).+$/;
    if (youtubeRegex.test(info.url)) {
      alert(t("videoMng.modal.validYoutubeUrl"));
      setInfo((s) => ({
        ...s,
        urlCheck: true,
      }));
    } else {
      alert(t("videoMng.modal.invalidYoutubeUrl"));
    }
  };

  return (
    <>
      <Modal
        visible={visible}
        size="md"
        onClose={onClose}
        onOk={onOk}
        okText={t("videoMng.modal.update")}
        cancelText={t("videoMng.modal.close")}
        title={t("videoMng.modal.updateTitle")}
        onCancel={onClose}
        autoClose={false}
      >
        <div className="flex flex-col gap-0">
          {/* URL  */}
          <div className="flex w-full border-t border-b border-gray-400">
            <div className=" w-2/12 text-center bg-gray-200 py-2 text-sm font-bold flex items-center justify-center">
              {t("videoMng.url")}
            </div>
            <div className="w-10/12 p-2  flex gap-1">
              <Input
                value={info.url}
                onChange={onChange}
                className="w-full px-2 "
                name="url"
              />
              <Button onClick={checkUrl} className="w-16">
                {t("videoMng.modal.check")}
              </Button>
            </div>
          </div>
          {/* URL  */}
          {/* 상세설명  */}
          <div className="flex w-full border-b border-gray-400">
            <div className=" w-2/12 text-center bg-gray-200 py-2 text-sm font-bold flex items-center justify-center">
              {t("videoMng.detailDesc")}
            </div>
            <div className="w-10/12 p-2">
              <Textarea
                value={info.detailDesc}
                onChange={onChange}
                name="detailDesc"
              />
            </div>
          </div>
          {/* 상세설명  */}
          {/* 우선순위  */}
          <div className="flex w-full border-b border-gray-400">
            <div className=" w-2/12 text-center bg-gray-200 py-2 text-sm font-bold flex items-center justify-center">
              {t("videoMng.modal.priority")}
            </div>
            <div className="w-10/12 p-2">
              <Select
                value={info.priority}
                options={[
                  { label: "1", value: "1" },
                  { label: "2", value: "2" },
                  { label: "3", value: "3" },
                  { label: "4", value: "4" },
                ]}
                onChange={onChange}
                name="priority"
                className="w-full"
              />
            </div>
          </div>
          {/* 우선순위  */}
          {/* 영상유형코드  */}
          <div className="flex w-full border-b border-gray-400">
            <div className=" w-2/12 text-center bg-gray-200 py-2 text-sm font-bold flex items-center justify-center">
              {t("videoMng.videoType")}
            </div>
            <div className="w-10/12 p-2">
              <Select
                value={info.videoTypeCd}
                options={typeCdOption}
                onChange={onChange}
                name="videoTypeCd"
                className="w-full"
              />
            </div>
          </div>
          {/* 영상유형코드  */}
          {/* 사용여부  */}
          <div className="flex w-full border-b border-gray-400">
            <div className=" w-2/12 text-center bg-gray-200 py-2 text-sm font-bold flex items-center justify-center">
              {t("videoMng.useStatus")}
            </div>
            <div className="w-10/12 p-2">
              <Select
                value={info.useYn}
                options={[
                  { label: "Y", value: "Y" },
                  { label: "N", value: "N" },
                ]}
                onChange={onChange}
                name="useYn"
                className="w-full"
              />
            </div>
          </div>
          {/* 영상유형코드  */}
        </div>
      </Modal>
    </>
  );
}
