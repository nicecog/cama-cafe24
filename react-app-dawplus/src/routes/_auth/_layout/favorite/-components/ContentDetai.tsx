import type { WebviewContentItem } from "@/apis/types";
import ContentDetailComponent from "@/components/ContentDetail";
import Popup from "@/components/ui/Popup";

type ContentDetailProps = {
  open: boolean;
  handleClose: () => void;
  data: Partial<WebviewContentItem>;
};

export default function ContentDetail(props: ContentDetailProps) {
  const { open, handleClose, data } = props;

  // const { data, isLoading } = useGetContentDetail(id);
  // interest 값에서 대괄호와 따옴표 제거
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
