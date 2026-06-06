import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ko from './locales/ko/translation.json';
import en from './locales/en/translation.json';

// 브라우저의 언어 설정 가져오기
const getBrowserLanguage = (): string => {
  const browserLang = navigator.language.split('-')[0];
  // 브라우저 언어를 백엔드 형식으로 변환
  if (browserLang === 'ko') return 'KO';
  if (browserLang === 'en') return 'US';
  return 'KO'; // 기본값
};

// 언어 코드를 정규화 (소문자 -> 대문자)
const normalizeLanguage = (lang: string): string => {
  const upperLang = lang.toUpperCase();
  // ko, en 등 소문자를 KO, US로 변환
  if (upperLang === 'KO') return 'KO';
  if (upperLang === 'EN' || upperLang === 'US') return 'US';
  return 'KO'; // 기본값
};

// Jotai atom에서 저장된 언어 가져오기 (localStorage 'app-language' 키 사용)
const savedLanguage = localStorage.getItem('app-language');
const normalizedLanguage = savedLanguage ? normalizeLanguage(savedLanguage) : getBrowserLanguage();

i18n
  .use(initReactI18next) // react-i18next 초기화
  .init({
    resources: {
      KO: {
        translation: ko,
      },
      US: {
        translation: en,
      },
    },
    lng: normalizedLanguage, // 기본 언어 (정규화된 대문자)
    fallbackLng: 'KO', // 번역이 없을 때 사용할 언어
    interpolation: {
      escapeValue: false, // React는 XSS 공격을 자동으로 방지
    },
    debug: false, // 개발 중 디버깅 정보 출력
  });

// 언어 변경 시 localStorage에 저장
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('app-language', lng);
});

export default i18n;

