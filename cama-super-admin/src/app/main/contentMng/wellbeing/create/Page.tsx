import { useNavigate } from "react-router-dom";
import useAlert from "@/hooks/useAlert";
import { useInsertWellbeingResourcesMutation } from "../useWellbeing";
import WellbeingForm from "../component/wellbeingForm";
import { useEffect, useState } from "react";
import { useAtomValue } from "jotai";
import { wellbeingAtom } from "../wellbeingAtom";
import { useResetAtom } from "jotai/utils";
import Button from "@/components/button/DefaultButton";
import { FaList } from "react-icons/fa6";
import { FaSave } from "react-icons/fa";
import { useTranslation } from "react-i18next";

export default function Detail() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const { alert, confirm } = useAlert();
 
  const { mutate } = useInsertWellbeingResourcesMutation();

  const infos = useAtomValue(wellbeingAtom);
  const reset = useResetAtom(wellbeingAtom);

  // 페이지 진입 시 언어 고정
  const [contentLang] = useState(i18n.language);

  useEffect(() => {
    return () => {
      reset();
    };
  }, []);

  // 언어 변경 감지 및 경고
  useEffect(() => {
    if (i18n.language !== contentLang) {
      // 원래 언어로 복구
      i18n.changeLanguage(contentLang);
      
      // 컨텐츠 언어 이름
      const contentLangName = contentLang === 'KO' ? '한국어' : 'English';
      
      // t() 함수에 lng 옵션으로 언어 지정
      alert({
        html: `
          <div style="text-align: left;">
            <div style="font-size: 1.125rem; font-weight: bold; color: #ea580c; margin-bottom: 0.75rem;">
              ⚠️ ${t('wellbeing_create.languageWarningTitle', { lng: contentLang })}
            </div>
            <div style="font-size: 0.875rem;">
              <p style="margin-bottom: 0.5rem;">
                ${t('wellbeing_create.currentLanguage', { lang: `<strong style="color: #2563eb;">${contentLangName}</strong>`, lng: contentLang })}
              </p>
              <p style="background-color: #dbeafe; border-left: 4px solid #3b82f6; padding: 0.5rem; margin-top: 0.75rem;">
                💡 ${t('wellbeing_create.languageChangeGuide', { lng: contentLang })}
              </p>
            </div>
          </div>
        `
      });
    }
  }, [i18n.language, contentLang, alert, i18n, t]);

  const onCancel = () => {
    confirm(
      {
        text: t("wellbeing_create.confirmCancel"),
        icon: "warning",
      },
      () => {
        navigate("/main/contentMng/wellbeing");
      }
    );
  };

  const onUpdate = () => {
    confirm(
      {
        text: t("wellbeing_create.confirmRegister"),
        icon: "question",
      },
      () => {
        mutate({...infos, lang: contentLang}, { // 고정된 언어 사용
          onSuccess: () => {
            alert(t("wellbeing_create.registered"), () => {
              navigate("/main/contentMng/wellbeing");
            });
          },
        });
      }
    );
  };

  return (
    <>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-5  border-b-2  border-main pb-3">
          {/* 왼쪽: 취소 버튼 + 작성 언어 표시 */}
          <div className="flex items-center gap-3">
            <Button
              onClick={onCancel}
              className="!bg-white !text-gray-800 !hover:bg-white flex items-center"
            >
              <FaList className="text-[15px]" />
              {t("wellbeing_create.cancel")}
            </Button>
            
            {/* 작성 언어 표시 배지 */}
            <span className="text-sm text-gray-700 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-200 flex items-center gap-1.5">
              <span>🌐</span>
              <span className="font-medium">
                작성 언어: {contentLang === 'KO' ? '한국어' : 'English'}
              </span>
            </span>
          </div>

          {/* 오른쪽: 등록 버튼 */}
          <Button onClick={onUpdate} className=" flex items-center">
            <FaSave className="text-[15px]" />
            {t("wellbeing_create.register")}
          </Button>
        </div>
        <div className="grow pb-10">
          <WellbeingForm />
        </div>
      </div>
    </>
  );
}
