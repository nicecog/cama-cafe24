import type { ReactNode } from "react";
import SplitText from "@/components/SplitText";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  /**
   * 페이지 제목
   */
  title: string;

  /**
   * 페이지 설명
   */
  description: string;

  /**
   * 캐릭터 이미지 URL
   */
  characterImage: string;

  /**
   * 캐릭터 이미지 alt 텍스트
   */
  characterAlt?: string;

  /**
   * 필터 버튼 등 추가 컨텐츠 (선택사항)
   */
  children?: ReactNode;

  characterClass?: string;
}

/**
 * 공통 페이지 헤더 컴포넌트
 *
 * 웰빙자원, 일정관리, 건강코칭 등의 페이지에서 사용하는 공통 헤더
 *
 * @example
 * ```tsx
 * <PageHeader
 *   icon={HeartPulse}
 *   title="건강코칭"
 *   description="맞춤 코칭으로 관리해보세요!"
 *   characterImage={CoachingCharacter}
 *   characterAlt="Coaching Character"
 * >
 *   <FilterButton />
 * </PageHeader>
 * ```
 */
export function PageHeader({
  title,
  description,
  characterImage,
  characterAlt = "Character",
  children,
  characterClass,
}: PageHeaderProps) {
  return (
    <div className="bg-gradient-to-br from-primary via-primary to-primary/90 shadow-md flex-shrink-0">
      <div className="px-6 pt-16 pb-4">
        {/* 타이틀 영역 */}
        <div className="flex items-center justify-between mb-4">
          {/* 타이틀 */}
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-3xl font-jalnan text-white drop-shadow-md ">
                {title}
              </h1>

              {/* <p className="text-sm-fixed text-white/80 mt-0.5">
                {description}
              </p> */}
              <SplitText
                text={description}
                tag="p"
                className="text-sm-fixed text-white/90  -mt-0.5 py-0"
                delay={50}
                duration={0.5}
                threshold={0.5}
                rootMargin="0px"
              />
            </div>
          </div>
          <img
            src={characterImage}
            alt={characterAlt}
            className={cn(
              "w-20 h-20 object-contain relative z-10 drop-shadow-lg",
              characterClass,
            )}
          />
        </div>

        {/* 필터 섹션 또는 추가 컨텐츠 */}
        {children && <div className="">{children}</div>}
      </div>
    </div>
  );
}
