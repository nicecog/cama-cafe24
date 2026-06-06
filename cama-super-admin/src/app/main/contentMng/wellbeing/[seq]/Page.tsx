import { useNavigate, useParams } from "react-router-dom";
import useAlert from "@/hooks/useAlert";
import useWellbeing from "../useWellbeing";
import WellbeingForm from "../component/wellbeingForm";
import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { wellbeingAtom } from "../wellbeingAtom";
import { useResetAtom } from "jotai/utils";
import Button from "@/components/button/DefaultButton";
import { FaList } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import { FaSave } from "react-icons/fa";
import { useTranslation } from "react-i18next";

export default function Detail() {
  const { seq } = useParams();
  const navigate = useNavigate();
  const { i18n, t } = useTranslation();

  const { alert, confirm } = useAlert();

  const {
    getWellbeingResourceDetail,
    updateWellbeingResources,
    deleteWellbeingResources,
  } = useWellbeing();

  const { data } = getWellbeingResourceDetail(seq);

  const { mutate } = updateWellbeingResources(seq);
  const { mutate: removeWellbeing } = deleteWellbeingResources(seq);

  const [infos, setWellbeingInfo] = useAtom(wellbeingAtom);
  const reset = useResetAtom(wellbeingAtom);

  // 데이터 로드 시 언어 고정
  const [contentLang, setContentLang] = useState<string | null>(null);

  useEffect(() => {
    if (!data) return;
    setWellbeingInfo(data);
    // 데이터 로드 시 현재 UI 언어를 컨텐츠 언어로 고정
    setContentLang(i18n.language);
    
    return () => {
      console.log("rest");
      reset();
    };
  }, [data]);

  // 언어 변경 감지 및 경고 (수정 페이지는 더 강한 경고)
  useEffect(() => {
    if (contentLang && i18n.language !== contentLang) {
      // 원래 언어로 복구
      i18n.changeLanguage(contentLang);
      
      // 컨텐츠 언어 이름
      const contentLangName = contentLang === 'KO' ? '한국어' : 'English';
      
      // t() 함수에 lng 옵션으로 언어 지정
      alert({
        html: `
          <div style="text-align: left;">
            <div style="font-size: 1.125rem; font-weight: bold; color: #dc2626; margin-bottom: 0.75rem;">
              ⚠️ ${t('wellbeing_edit.languageWarningTitle', { lng: contentLang })}
            </div>
            <div style="font-size: 0.875rem;">
              <p style="margin-bottom: 0.5rem;">
                ${t('wellbeing_edit.currentLanguage', { lang: `<strong style="color: #2563eb;">${contentLangName}</strong>`, lng: contentLang })}
              </p>
              <p style="color: #dc2626; font-weight: 600; margin-bottom: 0.5rem;">
                ${t('wellbeing_edit.languageChangeWarning', { lng: contentLang })}
              </p>
              <p style="background-color: #fef3c7; border-left: 4px solid #fbbf24; padding: 0.5rem; margin-top: 0.75rem;">
                💡 ${t('wellbeing_edit.useNewRegistration', { lng: contentLang })}
              </p>
            </div>
          </div>
        `
      });
    }
  }, [i18n.language, contentLang, alert, i18n, t]);

  const onCancel = () => {
    confirm(
      { text: t('wellbeing_edit.confirmCancel'), icon: "warning" },
      () => {
        navigate("/main/contentMng/wellbeing");
      }
    );
  };

  const onDelete = () => {
    confirm(
      {
        text: t('wellbeing_edit.confirmDelete'),
        icon: "warning",
      },
      () => {
        removeWellbeing(infos, {
          onSuccess: () => {
            alert(t('wellbeing_edit.deleted'), () => {
              navigate("/main/contentMng/wellbeing");
            });
          },
        });
      }
    );
  };

  const onUpdate = () => {
    confirm(
      {
        text: t('wellbeing_edit.confirmUpdate'),
        icon: "question",
      },
      () => {
        mutate(infos, {
          onSuccess: () => {
            alert(t('wellbeing_edit.updated'), () => {
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
          {/* 왼쪽: 취소 버튼 + 수정 중인 언어 표시 */}
          <div className="flex items-center gap-3">
            <Button
              onClick={onCancel}
              className="!bg-white !text-gray-800 !hover:bg-white flex items-center"
            >
              <FaList className="text-[15px]" />
              {t('wellbeing_edit.cancel')}
            </Button>
            
            {/* 수정 중인 언어 표시 배지 (더 눈에 띄게) */}
            {contentLang && (
              <span className="text-sm text-gray-700 bg-amber-50 px-3 py-1.5 rounded-full border-2 border-amber-300 flex items-center gap-1.5">
                <span>🌐</span>
                <span className="font-semibold">
                  {t('wellbeing_edit.editingLanguage')}: {contentLang === 'KO' ? t('common.korean', '한국어') : t('common.english', 'English')}
                </span>
                <span className="text-xs text-amber-700">({t('wellbeing_edit.noChange')})</span>
              </span>
            )}
          </div>

          {/* 오른쪽: 삭제 + 수정 버튼 */}
          <div className="flex-none flex items-center gap-1">
            <Button
              onClick={onDelete}
              className="!bg-white !text-red-600 border-red-600 !hover:bg-white flex items-center"
            >
              <MdDelete className="text-[15px]" />
              {t('wellbeing_edit.delete')}
            </Button>
            <Button onClick={onUpdate} className=" flex items-center">
              <FaSave className="text-[15px]" />
              {t('wellbeing_edit.update')}
            </Button>
          </div>
        </div>
        <div className="grow  pb-10">
          <WellbeingForm      />
        </div>
      </div>
    </>
  );
}
