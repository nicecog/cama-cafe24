import { Languages } from "lucide-react";
import { useTranslation } from "react-i18next";

export const LanguageController = () => {
  const { i18n } = useTranslation();

  const currentLanguage = i18n.language;

  const toggleLanguage = () => {
    const newLanguage = currentLanguage === "ko" ? "en" : "ko";
    i18n.changeLanguage(newLanguage);
  };

  const languageLabels: Record<string, string> = {
    ko: "한국어",
    en: "English",
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-1.5 rounded p-1 hover:bg-white/20 transition-all"
      aria-label="언어 변경"
      title={`현재: ${languageLabels[currentLanguage]}`}
    >
      <Languages className="h-5 w-5" />
      <span className="text-sm font-medium">
        {currentLanguage.toUpperCase()}
      </span>
    </button>
  );
};
