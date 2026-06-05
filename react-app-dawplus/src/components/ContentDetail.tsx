import DOMPurify from "dompurify";
import { Calendar, ChevronUp, Star } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import "@/assets/fonts/jalnan-gothic.css";
import { useSaveFavorite } from "@/hooks/mutations/webview/useContentsMutations";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { FontSizeController } from "./FontSizeController";
import TTSButton from "./TTSButton";

interface ContentDetailProps {
  title: string;
  contents: string;
  interest: string;
  disease: string;
  createdAt?: string;
  favoriteYn?: string;
  contentsSeq?: number;
}

export default function ContentDetail({
  title,
  contents,
  interest,
  disease,
  createdAt,
  favoriteYn,
  contentsSeq,
}: ContentDetailProps) {
  // favoriteYn을 state로 관리
  const [isFavorite, setIsFavorite] = useState(favoriteYn === "Y");

  // favoriteYn prop이 변경되면 state 업데이트
  useEffect(() => {
    setIsFavorite(favoriteYn === "Y");
  }, [favoriteYn]);

  const [showScrollTop, setShowScrollTop] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const { toast } = useToast();

  // 스크롤 이벤트 핸들러 - 버튼 표시 여부 결정
  const handleScroll = () => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    // 300px 이상 스크롤하면 버튼 표시
    setShowScrollTop(scrollContainer.scrollTop > 300);
  };

  // 맨 위로 부드럽게 스크롤
  const scrollToTop = () => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const startPosition = scrollContainer.scrollTop;
    const duration = 800;
    const startTime = performance.now();

    const easeInOutCubic = (t: number): number => {
      return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
    };

    const animateScroll = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = easeInOutCubic(progress);
      const newPosition = startPosition * (1 - easeProgress);

      scrollContainer.scrollTop = newPosition;

      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      }
    };

    requestAnimationFrame(animateScroll);
  };

  // HTML을 안전하게 sanitize
  const sanitizeHtml = (html: string) => {
    return DOMPurify.sanitize(html, {
      ADD_ATTR: ["target", "rel"], // 링크의 target, rel 속성 허용
      ADD_TAGS: ["iframe"], // iframe 태그 허용 (필요시)
    });
  };

  // 데이터 파싱
  const careTimes = JSON.parse(disease || "{}");
  const interestList = JSON.parse(interest || "[]") as string[];
  const careTimeList =
    careTimes.diseaseTreatment === undefined
      ? []
      : careTimes.diseaseTreatment.map((d: any) => d.name);

  // HTML 태그 제거하여 순수 텍스트만 추출
  const stripHtmlTags = (html: string): string => {
    const temp = document.createElement("div");
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || "";
  };

  const { mutate: saveFavorite } = useSaveFavorite();

  //  즐겨찾기 클릭
  const onFavoriteClick = () => {
    const newFavoriteStatus = !isFavorite;

    saveFavorite(
      {
        type: isFavorite ? "D" : "C",
        contentsSeq: contentsSeq || 0,
      },
      {
        onSuccess: () => {
          // 즐겨찾기 상태 업데이트
          setIsFavorite(newFavoriteStatus);
          toast({
            description: `즐겨찾기 ${isFavorite ? "삭제" : "추가"} 되었습니다.`,
          });
        },
      },
    );
  };

  return (
    <>
      <main
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="bg-white overflow-y-auto h-dvh relative pb-20"
      >
        <article>
          {/* Title Section */}
          <div className="py-5 border-b border-gray-100 bg-gradient-to-r from-blue-50/30 to-purple-50/30 px-4">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 leading-tight font-jalnanGothic">
              {title}
            </h1>

            <div className="flex items-center gap-2  justify-between ">
              {createdAt && (
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Calendar className="h-3.5 w-3.5 text-gray-400" />
                  <time dateTime={createdAt}>
                    {new Date(createdAt).toLocaleDateString("ko-KR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                </div>
              )}
              <div className="flex items-center gap-2.5">
                {/* 즐겨찾기 버튼 */}
                {favoriteYn !== undefined && (
                  <button
                    type="button"
                    onClick={onFavoriteClick}
                    className={cn(
                      "p-1.5 rounded-full transition-all duration-200 active:scale-90",
                      isFavorite
                        ? "bg-secondary/15 text-secondary"
                        : "bg-gray-100 text-gray-400 hover:text-gray-500",
                    )}
                  >
                    <Star
                      className={cn(
                        "h-4.5 w-4.5",
                        isFavorite ? "fill-secondary" : "fill-transparent",
                      )}
                    />
                  </button>
                )}

                {/* TTS 버튼 */}
                <TTSButton
                  text={stripHtmlTags(contents || "")}
                  showLabel={false}
                  rate={0.9}
                />
                <div className="h-4 w-px bg-gray-300" />
                <span className="text-xs-fixed text-gray-500 hidden sm:inline">
                  글자 크기
                </span>
                <FontSizeController />
              </div>
            </div>
          </div>
          <div className="px-4">
            {/* Content Body */}
            <div className="px-4 py-2">
              <div
                className="content-body"
                dangerouslySetInnerHTML={{
                  __html: sanitizeHtml(contents || ""),
                }}
              />
            </div>

            {/* 안내 멘트 */}
            <div className="mt-8 mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-start gap-2">
                <span className="text-amber-600 text-sm-fixed font-bold flex-shrink-0">
                  ℹ️
                </span>
                <div className="flex-1 text-xs-fixed text-amber-900 leading-relaxed space-y-1">
                  <p>
                    본 정보는 질환의 진단과 치료과정에 대한 일반적인 가이드만을
                    제공합니다.
                  </p>
                  <p className="text-amber-800">
                    정보의 적용, 진단과 치료에 대한 모든 결정은 담당 의료진과
                    직접 상의하시기 바랍니다.
                  </p>
                </div>
              </div>
            </div>

            {/* 시기/영역 정보 */}
            <div className="mb-8 p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200 shadow-sm">
              {/* 시기 */}
              <div className="pb-4 border-b border-gray-300">
                <div className="text-xs-fixed font-semibold text-gray-700 mb-2.5 flex items-center gap-1">
                  <span>📅</span>
                  <span>치료 시기</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {careTimeList.length > 0 ? (
                    careTimeList.map((time: string, index: number) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 text-xs-fixed font-medium rounded-full border border-blue-200 shadow-sm"
                      >
                        {time}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs-fixed text-gray-400">
                      정보 없음
                    </span>
                  )}
                </div>
              </div>

              {/* 영역 */}
              <div className="pt-4">
                <div className="text-xs-fixed font-semibold text-gray-700 mb-2.5 flex items-center gap-1">
                  <span>🏥</span>
                  <span>관심 영역</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {interestList.length > 0 ? (
                    interestList.map((interest: string, index: number) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1.5 bg-purple-50 text-purple-700 text-xs-fixed font-medium rounded-full border border-purple-200 shadow-sm"
                      >
                        {interest}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs-fixed text-gray-400">
                      정보 없음
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </article>
      </main>

      {/* Scroll to Top Button */}
      <button
        type="button"
        onClick={scrollToTop}
        className={`fixed bottom-5 right-5 z-50 p-2.5 bg-primary/60 text-white rounded-full shadow-md 
					hover:bg-primary/90 hover:shadow-lg active:bg-primary active:shadow-xl
					transition-all duration-300 transform hover:scale-105 active:scale-95
					${showScrollTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}
        aria-label="맨 위로 이동"
      >
        <ChevronUp className="h-5 w-5" />
      </button>
    </>
  );
}
