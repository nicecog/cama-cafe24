import DOMPurify from "dompurify";
import { useAtom, useAtomValue } from "jotai";
import { Building2, ChevronUp, Globe, Phone } from "lucide-react";
import { useRef, useState } from "react";
import "@/assets/fonts/jalnan-gothic.css";
import {
  wellbeingDetailItemAtom,
  wellbeingDetailOpenAtom,
} from "@/atoms/wellbeingAtoms";
import { FontSizeController } from "@/components/FontSizeController";
import TTSButton from "@/components/TTSButton";
import Popup from "@/components/ui/Popup";

export default function WellbeingDetail() {
  const [open, setOpen] = useAtom(wellbeingDetailOpenAtom);
  const item = useAtomValue(wellbeingDetailItemAtom);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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
      ADD_ATTR: ["target", "rel"],
      ADD_TAGS: ["iframe"],
    });
  };

  // HTML 태그 제거하여 순수 텍스트만 추출
  const stripHtmlTags = (html: string): string => {
    const temp = document.createElement("div");
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || "";
  };

  if (!item) return null;

  return (
    <Popup open={open} setOpen={setOpen} title={"웰빙자원"}>
      <main
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="bg-white overflow-y-auto h-dvh relative pb-20"
      >
        <article>
          {/* Title Section */}
          <div className="py-5 px-4 border-b border-gray-100 bg-gradient-to-r from-blue-50/30 to-purple-50/30">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 leading-tight font-jalnanGothic">
              {item.title}
            </h1>

            <div className="flex items-center gap-2 justify-between">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="inline-flex items-center px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                  #{item.wellbeingCategoryNm}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {/* TTS 버튼 */}
                <TTSButton
                  text={stripHtmlTags(item.contents || "")}
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

          {/* Content Body */}
          <div className="px-4 py-6">
            <div
              className="px-4 py-2"
              dangerouslySetInnerHTML={{
                __html: sanitizeHtml(item.contents || ""),
              }}
            />
          </div>

          {/* 회사 정보 섹션 */}
          <div className="px-4 pb-6">
            <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200 shadow-sm">
              {/* 회사명 */}
              <div className="pb-4 border-b border-gray-300">
                <div className="flex items-center gap-2 mb-3">
                  <Building2 className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold text-gray-700">
                    제공기관
                  </span>
                </div>
                <h2 className="text-base-fixed font-bold text-gray-900">
                  {item.companyName}
                </h2>
                {item.companyDescription && (
                  <p className="text-sm-fixed text-gray-600 mt-2">
                    {item.companyDescription}
                  </p>
                )}
              </div>

              {/* 주소 */}
              {item.address && (
                <div className="pt-4 pb-4 border-b border-gray-300">
                  <div className="text-xs-fixed font-semibold text-gray-700 mb-2">
                    📍 주소
                  </div>
                  <p className="text-sm-fixed text-gray-600">{item.address}</p>
                </div>
              )}

              {/* 연락처 버튼 */}
              <div className="pt-4">
                <div className="flex flex-wrap gap-2">
                  {/* 홈페이지 */}
                  {item.homepage && (
                    <a
                      href={item.homepage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-50 text-blue-700 text-xs-fixed font-medium rounded-full border border-blue-200 shadow-sm hover:bg-blue-100 transition-colors"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      홈페이지
                    </a>
                  )}

                  {/* 전화번호 */}
                  {item.phoneNumber && (
                    <a
                      href={`tel:${item.phoneNumber}`}
                      className="inline-flex items-center gap-1.5 px-3 py-2 bg-green-50 text-green-700 text-xs-fixed font-medium rounded-full border border-green-200 shadow-sm hover:bg-green-100 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      {item.phoneNumber.replace(
                        /(\d{3})(\d{4})(\d{4})/,
                        "$1-$2-$3",
                      )}
                    </a>
                  )}

                  {/* SNS */}
                  {item.sns && (
                    <a
                      href={item.sns}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-2 bg-purple-50 text-purple-700 text-xs-fixed font-medium rounded-full border border-purple-200 shadow-sm hover:bg-purple-100 transition-colors"
                    >
                      <svg
                        className="w-3.5 h-3.5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z" />
                      </svg>
                      SNS
                    </a>
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
    </Popup>
  );
}
