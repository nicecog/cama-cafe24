import i18n from "i18next";
import { initReactI18next } from "react-i18next";

/**
 * /locales/{lang}/ 아래의 모든 JSON 파일을 자동 스캔
 * 예: locales/ko/home.json -> resources.ko.home
 * 예: locales/ko/coaching/sleep/day0.json -> resources.ko["coaching/sleep/day0"]
 */
const loadLocaleResources = () => {
  const modules = import.meta.glob("@/locales/**/*.json", { eager: true });

  const resources: Record<string, any> = {};

  for (const path in modules) {
    const match = path.match(/locales\/([^/]+)\/(.+)\.json$/);

    if (!match) continue;

    const [, lang, namespace] = match;
    const json = modules[path];

    if (!resources[lang]) resources[lang] = {};
    resources[lang][namespace] = (json as any).default || json;
  }

  return resources;
};

const getBrowserLanguage = (): string => {
  const browserLang = navigator.language.split("-")[0];
  return ["ko", "en"].includes(browserLang) ? browserLang : "ko";
};

const savedLanguage =
  localStorage.getItem("app-language") || getBrowserLanguage();

i18n.use(initReactI18next).init({
  resources: loadLocaleResources(),
  lng: savedLanguage,
  fallbackLng: "ko",
  defaultNS: "common",
  interpolation: {
    escapeValue: false,
  },
});

i18n.on("languageChanged", (lng) => {
  localStorage.setItem("app-language", lng);
});

export default i18n;
