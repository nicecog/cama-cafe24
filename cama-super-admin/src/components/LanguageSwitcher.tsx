import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * 언어 전환 컴포넌트 (토글 스위치)
 * Jotai atom을 사용하여 전역 상태로 언어를 관리합니다.
 */
const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  // const [language, setLanguage] = useAtom(languageAtom);

  // Jotai atom과 i18next 동기화
  // useEffect(() => {
  //   if (i18n.language !== language) {
  //     i18n.changeLanguage(language);
  //   }
  // }, [language, i18n]);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'KO' ? 'US' : 'KO';
     i18n.changeLanguage(newLang);
    // setLanguage(newLang);
  };

  const isKorean = i18n.language === 'KO';

  return (
    <div className="flex items-center">
      {/* 토글 스위치 */}
      <button
        onClick={toggleLanguage}
        className="relative inline-flex items-center h-10 w-52 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 shadow-sm hover:shadow-md transition-all duration-300"
        aria-label="언어 전환"
      >
        {/* 슬라이딩 배경 */}
        <span
          className={`absolute top-1 h-[31px] w-[5.5rem] rounded-md bg-white shadow-sm transition-all duration-300 ease-in-out ${
            isKorean ? 'left-0.5' : 'left-[6.5rem]'
          }`}
        />
        
        {/* 언어 레이블 */}
        <span className="relative z-10 flex w-full items-center justify-around text-sm font-medium">
          <span className={`transition-colors duration-200 ${
            isKorean ? 'text-[#39906a]' : 'text-white'
          }`}>
            한국어
          </span>
          <span className={`transition-colors duration-200 flex flex-col items-center leading-tight ${
            !isKorean ? 'text-[#39906a]' : 'text-white'
          }`}>
            <span className="text-xs">English</span>
            <span className="text-[10px]">[개발진행중]</span>
          </span>
        </span>
      </button>
    </div>
  );
};

export default LanguageSwitcher;

