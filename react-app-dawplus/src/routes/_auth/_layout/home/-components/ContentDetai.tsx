import { useQueryClient } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { useEffect } from "react";
import type { WebviewContentItem } from "@/apis/types";
import { accountMeAtom } from "@/atoms/accountAtoms";
import ContentDetailComponent from "@/components/ContentDetail";
import Popup from "@/components/ui/Popup";
import {
  useUpdateTrackOffProgress,
  useUpdateTrackProgress,
} from "@/hooks/mutations/webview";

type ContentDetailProps = {
  open: boolean;
  handleClose: () => void;
  data: Partial<WebviewContentItem>;
  seq?: string | number;
  shouldUpdateProgress?: boolean; // 진도율 업데이트 여부 (기본값: true)
};

export default function ContentDetail(props: ContentDetailProps) {
  const { open, handleClose, data, seq, shouldUpdateProgress = true } = props;

  const queryClient = useQueryClient();

  // 2가지 진도율 업데이트 mutation (로그인 사용자 전용)
  const { mutate: updateOffProgress } = useUpdateTrackOffProgress(); // 로그인 + 서비스 미신청
  const { mutate: updateProgress } = useUpdateTrackProgress(); // 로그인 + 서비스 신청

  const { data: accountMe } = useAtomValue(accountMeAtom);

  useEffect(() => {
    // 진도율 업데이트를 하지 않아야 하는 경우 (예: 검색 결과)
    if (!shouldUpdateProgress) {
      console.log("진도율 업데이트 비활성화 - API 호출 생략");
      return;
    }

    // 팝업이 열려 있고, 상세 데이터와 로그인 정보가 있을 때만 실행
    if (!open || !data.seq || !accountMe?.seq) return;

    // 이미 진도율이 100%면 API 호출하지 않음
    if (data.progress === 100) {
      console.log("이미 진도율 100% - API 호출 생략");
      return;
    }

    // 공통 파라미터
    const baseParams = {
      contentsSeq: Number(data.seq),
      progress: 100,
    };

    // 케이스 1: 로그인 + 서비스 신청 - /progress
    if (seq) {
      updateProgress(
        {
          ...baseParams,
          acSeq: accountMe?.seq,
          trackServiceSeq: Number(seq),
        },
        {
          onSuccess: () => {
            // 여정 서비스 리스트 쿼리 무효화 (재조회)
            queryClient.invalidateQueries({
              queryKey: ["webview", "track", "serviceList"],
            });
            console.log("서비스 중 진도율 업데이트 완료 - 쿼리 재조회:", seq);
          },
        },
      );
      return;
    }

    // 케이스 2: 로그인 + 서비스 미신청 - /off/progress
    updateOffProgress({ ...baseParams, acSeq: accountMe?.seq });
    console.log("서비스 전 진도율 업데이트");
  }, [
    shouldUpdateProgress,
    open,
    data.seq,
    data.progress,
    seq,
    accountMe?.seq,
    queryClient,
    updateOffProgress,
    updateProgress,
  ]);

  const cleanInterest = (interest: string) => {
    return interest.replace(/[[\]"]/g, "").trim();
  };

  return (
    <Popup
      open={open}
      setOpen={handleClose}
      direction="right"
      title={
        <div className="flex items-center justify-between">
          <h2 className="text-base-fixed font-semibold text-gray-700 font-jalnan">
            {cleanInterest(data?.interest || "")}
          </h2>
        </div>
      }
    >
      {!data ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-lg text-gray-600">
            콘텐츠를 찾을 수 없습니다.
          </div>
        </div>
      ) : (
        <ContentDetailComponent
          favoriteYn={data.favoriteYn}
          title={data.title || ""}
          contents={data.contents || ""}
          interest={data.interest || ""}
          disease={data.disease || "{}"}
          createdAt={data.createdAt}
          contentsSeq={data.seq}
        />
      )}
    </Popup>
  );
}
