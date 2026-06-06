import { useState, useMemo, useEffect } from "react";
import VideoList from "./component/VideoList";
import Player from "./component/Player";
import Button from "@/components/button/DefaultButton";
import NewModal from "./component/NewModal";
import axios from "@/utils/axios";
import UpdateModal from "./component/UpdateModal";

import useAlert from "@/hooks/useAlert";
import { IoAddCircleOutline } from "react-icons/io5";
import { useTranslation } from "react-i18next";
 
import useCodeApi from "@/app/main/api/useCodeApi";
import ClientPagination from "@/components/Pagination/ClientPagination";
import { useQuery } from "@tanstack/react-query";
export type VideoInfo = {
  priority: number;
  videoTypeCd: string;
  url: string;
  detailDesc: string;
  createdAt: string;
  updatedAt: string;
  useYn: string;
  seq: number;
  loginId: string | null;
};

const defaultSelectedInfo = {
  loginId: null,
  priority: 0,
  videoTypeCd: "",
  url: "",
  detailDesc: "",
  createdAt: "",
  updatedAt: "",
  seq: 0,
  useYn: "",
};

export default function Videomng() {
  const { t , i18n} = useTranslation();
  const [selectedInfo, setSelectedInfo] =
    useState<VideoInfo>(defaultSelectedInfo);

  const [currentPage, setCurrentPage] = useState(1);
  const displayRow = 10; // 페이지당 표시할 행 수

  const { alert } = useAlert();
  
  // 영상유형코드 가져오기
  const { getCodeList } = useCodeApi("VIDEO_TYPE_CD");
  const { data: codes } = getCodeList();

  const typeCdOption = useMemo(() => {
    return codes.map((r: any) => ({ ...r, value: r.cd, label: r.val }));
  }, [codes]);

  const videoTypeNm = typeCdOption.find(
    (r: any) => r.value === selectedInfo.videoTypeCd
  )?.label || '-';
  
  // 날짜 포맷팅 함수
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    // 2024_08_14 16:54:13 -> 2024.08.14 16:54
    const formatted = dateStr
      .replace(/_/g, '.') // 언더스코어를 점으로 변경
      .replace(/:\d{2}$/, ''); // 초 제거
    return formatted;
  };
  
  // useQuery로 비디오 목록 가져오기
  const { data: videoData } = useQuery({
    queryKey: ['videoList', "list", i18n.language],
    queryFn: async () => {
      const { data } = await axios.post("/api/doctor/contents/getCmVideoInfoList", {
        videoTypeCd: "",
        useYn: "",
        lang : i18n.language 
      });
      return data.response || [];
    },
  });

  // 비디오 데이터가 변경되면 상태 업데이트
  useEffect(() => {
    if (videoData) {
      setCurrentPage(1);
      
      // 첫 번째 비디오 자동 선택
      if (videoData.length > 0) {
        setSelectedInfo(videoData[0]);
      } else {
        setSelectedInfo(defaultSelectedInfo);
      }
    }
  }, [videoData]);

  // 현재 페이지에 표시할 데이터 계산
  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * displayRow;
    const endIndex = startIndex + displayRow;
    return (videoData || []).slice(startIndex, endIndex);
  };

  // 신규모달 보임여부
  const [newVisible, setNewVisible] = useState(false);
  // 신규모달 보임여부
  const [updateVisible, setUpdateVisible] = useState(false);
 

  return (
    <>
      <div className="flex h-full flex-col gap-4 min-w-[1024px]">
        {/* 헤더 및 액션 버튼 */}
        <div className="border-b border-main pb-3 flex items-center justify-between shrink-0">
          <div className="text-sm pl-2 text-gray-600">
           
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => {
                if (!selectedInfo.seq) {
                  alert(t("videoMng.selectVideoToEdit"));
                  return;
                }
                setUpdateVisible(true);
              }}
            >
              {t("videoMng.edit")}
            </Button>
            <Button
              onClick={() => {
                setNewVisible(true);
              }}
              className="flex items-center gap-1"
            >
              <IoAddCircleOutline />
              {t("videoMng.newRegistration")}
            </Button>
          </div>
        </div>

        {/* 선택된 비디오 미리보기 카드 */}
        {selectedInfo.seq ? (
          <div className="shrink-0 bg-white rounded-xl border-2 border-main shadow-sm p-5">
            <div className="flex gap-5">
              {/* 비디오 플레이어 */}
              <div className="w-[480px] rounded-lg overflow-hidden border border-gray-200 bg-black shrink-0">
                <div className="aspect-video">
                  <Player info={selectedInfo} />
                </div>
              </div>
              
              {/* 비디오 정보 */}
              <div className="flex-1 flex flex-col">
                
                {/* 2열 그리드 레이아웃 */}
                <div className="grid grid-cols-2 gap-x-6 gap-y-3 flex-1">
                  {/* 왼쪽 열 */}
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <span className="text-sm font-semibold text-gray-600 min-w-[90px]">{t("videoMng.videoType")}</span>
                      <span className="text-sm text-gray-800">{videoTypeNm}</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-sm font-semibold text-gray-600 min-w-[90px]">{t("videoMng.useStatus")}</span>
                      <span className={`text-sm font-semibold px-2 py-0.5 rounded ${selectedInfo.useYn === 'Y' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {selectedInfo.useYn === 'Y' ? t("videoMng.inUse") : t("videoMng.notInUse")}
                      </span>
                    </div>
                  </div>

                  {/* 오른쪽 열 */}
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <span className="text-sm font-semibold text-gray-600 min-w-[70px]">{t("videoMng.createdAt")}</span>
                      <span className="text-sm text-gray-800">{formatDate(selectedInfo.createdAt)}</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-sm font-semibold text-gray-600 min-w-[70px]">{t("videoMng.updatedAt")}</span>
                      <span className="text-sm text-gray-800">{formatDate(selectedInfo.updatedAt)}</span>
                    </div>
                  </div>
                </div>

                {/* URL과 상세설명은 전체 너비 사용 */}
                <div className="mt-4 pt-4 border-t border-main/30 space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="text-sm font-semibold text-gray-600 min-w-[90px]">{t("videoMng.url")}</span>
                    <span className="text-sm text-blue-600 break-all hover:underline cursor-pointer">{selectedInfo.url}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-sm font-semibold text-gray-600 min-w-[90px]">{t("videoMng.detailDesc")}</span>
                    <span className="text-sm text-gray-700 leading-relaxed">{selectedInfo.detailDesc || '-'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="shrink-0 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-dashed border-blue-200 p-8">
            <div className="text-center text-gray-500">
              <svg
                className="mx-auto h-12 w-12 text-blue-300 mb-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              <p className="text-sm font-medium">{t("videoMng.selectVideoPlaceholder")}</p>
            </div>
          </div>
        )}

        {/* 비디오 리스트 */}
        <div className="flex-1 flex flex-col overflow-hidden border-t ">
          <div className="flex-1 overflow-hidden">
            <VideoList
              rowData={getCurrentPageData()}
              selectedSeq={selectedInfo.seq}
            
              onChange={(data: any) => {
                setSelectedInfo(data);
              }}
            />
          </div>
          <div className="shrink-0 mt-2">
            <ClientPagination
              currentPage={currentPage}
              totalCount={videoData?.length || 0}
              displayRow={displayRow}
              onClick={(page: number) => {
                setCurrentPage(page);
              }}
            />
          </div>
        </div>
      </div>
     

      <NewModal
        visible={newVisible}
        onClose={() => {
          setNewVisible(false);
        }}
      />
      <UpdateModal
        selectedInfo={selectedInfo}
        visible={updateVisible}
        onClose={() => {
          setUpdateVisible(false);
        }}
      />
    </>
  );
}
