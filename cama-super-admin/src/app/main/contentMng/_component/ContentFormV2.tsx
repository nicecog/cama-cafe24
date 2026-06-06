import { useMemo, useState } from "react";
import { Input, Radio, Select } from "@/components/forms";
import { ChangeEvent } from "react";
import axios from "@/utils/axios";
import QuillEditer from "@/components/edit/QuillEditer";
import ImageUploader from "@/components/imageUploader/ImageUploader";
import { getOptDatas } from "./ContentFormUtil";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { MdFullscreen, MdFullscreenExit } from "react-icons/md";

export interface OptionItem<T = string> {
  label: string;
  value: T;
}

const priorityOptions = [
  { label: "1", value: 1 },
  { label: "2", value: 2 },
  { label: "3", value: 3 },
  { label: "4", value: 4 },
  { label: "5", value: 5 },
];

export default function ContentFormV2(props: any) {
  const { t } = useTranslation();
  const { i18n } = useTranslation();


  const [expended, setExpended] = useState(false);
  // props
  const { data, onChange } = props;

  const INTEREST_OPTIONS: OptionItem[] = useMemo(
    () => [
      {
        label: t("contentForm.interests.healthyLifestyle"),
        value: "건강한 식생활과 운동",
      },
      {
        label: t("contentForm.interests.otherInfo"),
        value: "그외 도움되는 정보",
      },
      { label: t("contentForm.interests.mentalCare"), value: "마음 돌보기" },
      {
        label: t("contentForm.interests.caregiverTips"),
        value: "보호자를 위한 팁",
      },
      {
        label: t("contentForm.interests.sideEffects"),
        value: "부작용과 대처",
      },
      {
        label: t("contentForm.interests.riskManagement"),
        value: "위험요소와 관리법",
      },
      { label: t("contentForm.interests.symptoms"), value: "증상 알아보기" },
      {
        label: t("contentForm.interests.treatmentProcess"),
        value: "치료과정",
      },
    ],
    [t, i18n.language]
  );

  const {
    contents,
    disease,
    diseaseSeq,
    image,
    interest,
    title,
    viewed,
    priority,
  } = data;

  // useQuery로 질환 목록 조회
  const { data: diseaseData } = useQuery({
    queryKey: ["diseaseList", i18n.language],
    queryFn: async () => {
      // 언어에 따라 hospitalId 결정 (한국어: 1, 영어: 7)
      const hospitalId = i18n.language === "ko" ? 1 : 7;
      const response = await axios.get(`/api/common/hospital/${hospitalId}/disease/list/A`);
      return response.data.response;
    },
  });

  // 질환 옵션 가공
  const diseaseOptions = useMemo(() => {
    if (!diseaseData) return [{ label: t("contentForm.select"), value: "" }];
    
    const _types = diseaseData.map((i: any) => ({
      ...i,
      label: i.diseaseName,
      value: i.diseaseSeq,
    }));
    
    return [{ label: t("contentForm.select"), value: "" }, ..._types];
  }, [diseaseData, t]);

  // 선택한 질환의 항목들
  const optionInfo = useMemo(() => {
    const defaultOptionInfo = {
      diseaseName: "",
      diseaseOption: [],
      diseaseSeq: 1,
      diseaseTreatment: [],
      groupedData: [],
      label: "",
      seq: 1,
      value: 1,
    };

    const _datas = diseaseOptions.find(
      (i: any) => i.diseaseSeq === Number(diseaseSeq)
    );

    return _datas ? getOptDatas(_datas) : defaultOptionInfo;
  }, [diseaseSeq, diseaseOptions]);

  const _disease = useMemo(() => {
    let returnVal = {
      diseaseOption: [],
      diseaseSeq: "",
      diseaseTreatment: [],
      name: "",
      seq: "",
    };

    if (!disease) {
      return returnVal;
    }
    try {
      returnVal = JSON.parse(disease);
    } catch (e) {}

    return returnVal;
  }, [disease]);

  const onChangeHandler = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    onChange(e.target.name, e.target.value);
  };

  const _interest = useMemo(() => {
    try {
      return interest ? JSON.parse(interest) : [];
    } catch (error) {
      return [];
    }
  }, [interest]);

  const onSelectChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const _info = diseaseOptions.find(
      (i: any) => i.value + "" === e.target.value
    );
    const _params = {
      ..._disease,
      diseaseOption: [],
      diseaseTreatment: [],
      diseaseSeq: e.target.value,
      seq: _info.seq,
      name: _info.label,
    };

    if (_info) {
      onChange("disease", JSON.stringify(_params));
      onChange(e.target.name, e.target.value);
    }
  };

  const onCheckChange = (value: string, checked: boolean) => {
    const info = optionInfo.diseaseOption.find(
      (item: any) => item.seq + "" === value + ""
    );

    const _params = {
      ..._disease,
      diseaseOption: checked
        ? [..._disease.diseaseOption, info]
        : _disease.diseaseOption?.filter((item: any) => item.seq !== info?.seq),
    };
    onChange("disease", JSON.stringify(_params));
  };

  const onTreateChange = (value: string, checked: boolean) => {
    const info = optionInfo.diseaseTreatment?.find(
      (item: any) => item.seq + "" === value + ""
    );
    const _params = {
      ..._disease,
      diseaseTreatment: checked
        ? [..._disease.diseaseTreatment, { seq: info?.seq, name: info?.name }]
        : _disease.diseaseTreatment?.filter(
            (item: any) => item.seq !== info?.seq
          ),
    };
    onChange("disease", JSON.stringify(_params));
  };

  const onInterestChange = (value: string, checked: boolean) => {
    if (!interest) {
      onChange("interest", JSON.stringify([value]));
    } else {
      const _interest = JSON.parse(interest);

      if (checked) {
        onChange("interest", JSON.stringify([..._interest, value]));
      } else {
        const updatedInterest = _interest.filter(
          (item: string) => item !== value
        );
        onChange("interest", JSON.stringify(updatedInterest));
      }
    }
  };

  const onEditChange = (value: any) => {
    onChange("contents", value);
  };

  const onImageChange = (url: string) => {
    onChange("image", url);
  };

  return (
    <div className={`h-full flex flex-col pb-10 ${expended ? '' : 'space-y-4'}`}>
      {!expended && (
        <>
          {/* 제목 & 썸네일 */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t("contentForm.title")}
              </label>
              <Input
                onChange={onChangeHandler}
                name="title"
                value={title}
                className="w-full p-2 "
              />
            </div>
            <div className="w-48">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t("contentForm.thumbnail")}
              </label>
              <ImageUploader images={image} onChange={onImageChange} />
            </div>
          </div>

          {/* 질환, 우선순위, 공개여부 */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t("contentForm.disease")}
              </label>
              <Select
                options={diseaseOptions}
                onChange={onSelectChange}
                name="diseaseSeq"
                value={_disease.diseaseSeq}
                className="w-full p-1"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t("contentForm.priority")}
              </label>
              <Select
                options={priorityOptions}
                onChange={(e) => {
                  onChange("priority", e.target.value);
                }}
                name="priority"
                value={priority}
                className="w-full p-1"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t("contentForm.publicStatus")}
              </label>
              <Radio
                options={[
                  { label: "공개", value: "true" },
                  { label: "비공개", value: "false" },
                ]}
                name="viewed"
                value={viewed}
                onChange={onChangeHandler}
              />
            </div>
          </div>

          {/* 시기 - 태그 스타일 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t("contentForm.period")}
            </label>
            <div className="flex flex-wrap gap-2">
              {optionInfo.diseaseTreatment.length !== 0 ? (
                <>
                  {optionInfo.diseaseTreatment.map((i: any, idx: number) => {
                    const isSelected = _disease?.diseaseTreatment
                      .map((i: any) => i.seq)
                      .includes(i.seq);
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => onTreateChange(i.seq, !isSelected)}
                        className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                          isSelected
                            ? "bg-main text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {isSelected && <span className="mr-1">✓</span>}
                        {i.name}
                      </button>
                    );
                  })}
                </>
              ) : (
                <p className="text-xs text-blue-500">
                  {t("contentForm.selectDisease")}
                </p>
              )}
            </div>
          </div>

          {/* 질환 옵션 - 태그 스타일 */}
          {optionInfo.groupedData.map((item: any, index: number) => (
            <div key={index}>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {item.groupName}
              </label>
              <div className="flex flex-wrap gap-2">
                {item?.options.map((i: any, idx: number) => {
                  const isSelected = _disease?.diseaseOption
                    .map((i: any) => i.seq)
                    .includes(i.seq);
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => onCheckChange(i.value, !isSelected)}
                      className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                        isSelected
                          ? "bg-main text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {isSelected && <span className="mr-1">✓</span>}
                      {i.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* 관심영역 - 태그 스타일 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t("contentForm.interestArea")}
            </label>
            <div className="flex flex-wrap gap-2">
              {INTEREST_OPTIONS.map((i, idx) => {
                const isSelected = _interest.includes(i.value);
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onInterestChange(i.value, !isSelected)}
                    className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                      isSelected
                        ? "bg-main text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {isSelected && <span className="mr-1">✓</span>}
                    {i.label}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* 내용 작성 영역 - 에디터 */}
      <div className={expended ? '' : 'border-t pt-4'}>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-semibold text-gray-700">
            내용 작성
          </label>
          <button 
            type="button" 
            onClick={() => setExpended(prev => !prev)}
            className="px-3 py-1.5 text-xs font-medium bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center gap-1"
          >
            {expended ? (
              <>
                <MdFullscreenExit className="text-sm" />
                에디터 축소
              </>
            ) : (
              <>
                <MdFullscreen className="text-sm" />
                에디터 확대
              </>
            )}
          </button>
        </div>
        <QuillEditer
          value={contents}
          onChange={onEditChange}
          className={expended ? "h-[750px]" : "h-[300px]"}
        />
      </div>
    </div>
  );
}
