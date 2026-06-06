import { useEffect, useMemo, useState } from "react";
import { Input, Radio, Select } from "@/components/forms";
import { ChangeEvent } from "react";
import axios from "@/utils/axios";
import Checkbox from "@/components/checkbox/Checkbox";
import QuillEditer from "@/components/edit/QuillEditer";
import ImageUploader from "@/components/imageUploader/ImageUploader";
import { getOptDatas } from "./ContentFormUtil";
import { useTranslation } from "react-i18next";
 

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
export const INTEREST_OPTIONS: OptionItem[] = [
  { label: "건강한 식생활과 운동", value: "건강한 식생활과 운동" },
  { label: "그외 도움되는 정보", value: "그외 도움되는 정보" },
  { label: "마음 돌보기", value: "마음 돌보기" },
  { label: "보호자를 위한 팁", value: "보호자를 위한 팁" },
  { label: "부작용과 대처", value: "부작용과 대처" },
  { label: "위험요소와 관리법", value: "위험요소와 관리법" },
  { label: "증상 알아보기", value: "증상 알아보기" },
  { label: "치료과정", value: "치료과정" },
];
export default function ContentForm(props: any) {
  const { t } = useTranslation();
  
  const { i18n } = useTranslation();
  
  // props
  const { data, onChange } = props;

  const INTEREST_OPTIONS: OptionItem[] = useMemo(() => [
    { label: t("contentForm.interests.healthyLifestyle"), value: "건강한 식생활과 운동" },
    { label: t("contentForm.interests.otherInfo"), value: "그외 도움되는 정보" },
    { label: t("contentForm.interests.mentalCare"), value: "마음 돌보기" },
    { label: t("contentForm.interests.caregiverTips"), value: "보호자를 위한 팁" },
    { label: t("contentForm.interests.sideEffects"), value: "부작용과 대처" },
    { label: t("contentForm.interests.riskManagement"), value: "위험요소와 관리법" },
    { label: t("contentForm.interests.symptoms"), value: "증상 알아보기" },
    { label: t("contentForm.interests.treatmentProcess"), value: "치료과정" },
  ], [t, i18n.language]);

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
  // 질환 옵션
  const [diseaseOptions, setDiseaseType] = useState<any>([]);

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

  // Component Did Mount
  useEffect(() => {
    axios.get("/api/common/hospital/1/disease/list/A").then(({ data }) => {
      const _types = data?.response.map((i: any) => ({
        ...i,
        label: i.diseaseName,
        value: i.diseaseSeq,
      }));
      // 질환옵션 목록 Set
      setDiseaseType((_: any) => [{ label: t("contentForm.select"), value: "" }, ..._types]);
    });
  }, []);

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

  // OnChange
  const onChangeHandler = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    onChange(e.target.name, e.target.value);
  };

  // 관심영역
  const _interest = useMemo(() => {
    try {
      return interest ? JSON.parse(interest) : [];
    } catch (error) {
      return [];
    }
  }, [interest]);

  // 질환 변경 이벤트- 초기화를 안함..... 하위를
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
      // seq: e.target.value,
      name: _info.label,
    };

    if (_info) {
      onChange("disease", JSON.stringify(_params));

      onChange(e.target.name, e.target.value);
    }
  };

  //Check Click Event
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

  // 시기 변경
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

  // 관심영역 체크 이벤트
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
    <>
      <div className="h-full flex gap-3 py-3 items-stretch">
        <div className="w-6/12 pb-10 h-full  shrink-0">
          {/* Row */}
          <div className="flex flex-col space-y-1 ">
            <div className="font-semibold">{t("contentForm.title")}</div>
            <div className="w-full ">
              <Input
                onChange={onChangeHandler}
                name="title"
                value={title}
                className="w-[99%]"
              />
            </div>
          </div>
          {/* Row */}
          {/* Row */}
          <div className="flex flex-col space-y-1  mt-5  pt-5">
            <div className="font-semibold">{t("contentForm.disease")}</div>
            <div className="w-full">
              <Select
                options={diseaseOptions}
                onChange={onSelectChange}
                name="diseaseSeq"
                value={_disease.diseaseSeq}
                className="w-full"
              />
            </div>
          </div>
          {/* Row */}
          {/* Row */}
          <div className="flex flex-col space-y-1    mt-5  pt-5">
            <div className="font-semibold">{t("contentForm.period")}</div>
            <div className="w-full">
              <div className="flex gap-2 pt-1">
                {optionInfo.diseaseTreatment.length !== 0 ? (
                  <>
                    {optionInfo.diseaseTreatment.map((i: any, idx: number) => (
                      <Checkbox
                        label={i.name}
                        key={idx}
                        checked={_disease?.diseaseTreatment
                          .map((i: any) => i.seq)
                          .includes(i.seq)}
                        value={i.seq}
                        onChange={onTreateChange}
                      />
                    ))}
                  </>
                ) : (
                  <p className="text-xs font-bold text-blue-500">
                    {t("contentForm.selectDisease")}
                  </p>
                )}
              </div>
            </div>
          </div>
          {/* Row */}
          {optionInfo.groupedData.map((item: any, index: number) => (
            <div className="flex flex-col space-y-1  mt-5    pt-5" key={index}>
              <div className="font-semibold"> {item.groupName}</div>
              <div className="grid grid-cols-3 gap-2">
                {item?.options.map((i: any, idx: number) => (
                  <Checkbox
                    label={i.label}
                    key={idx}
                    checked={_disease?.diseaseOption
                      .map((i: any) => i.seq)
                      .includes(i.seq)}
                    onChange={onCheckChange}
                    value={i.value}
                  />
                ))}
              </div>
            </div>
          ))}

          {/* Row */}
          <div className="flex flex-col space-y-1  mt-5  pt-5">
            <div className="font-semibold">{t("contentForm.interestArea")}</div>
            <div className="w-full">
              <div className="grid grid-cols-4 gap-2">
                {INTEREST_OPTIONS.map((i, idx) => (
                  <Checkbox
                    label={i.label}
                    key={idx}
                    value={i.value}
                    checked={_interest.includes(i.value)}
                    onChange={onInterestChange}
                  />
                ))}
              </div>
            </div>
          </div>
          {/* Row */}
          {/* Row */}
          <div className="flex flex-col space-y-1  mt-5  pt-5">
            <div className="font-semibold">{t("contentForm.thumbnail")}</div>
            <div className="w-full">
              <ImageUploader images={image} onChange={onImageChange} />
            </div>
          </div>
          {/* Row */}
          {/* Row */}
          <div className="flex flex-col space-y-1  mt-5  pt-5">
            <div className="font-semibold">{t("contentForm.priority")}</div>
            <div className="w-full">
              <Select
                options={priorityOptions}
                onChange={(e) => {
                  onChange("priority", e.target.value);
                }}
                name="priority"
                value={priority}
                className="w-full"
              />
            </div>
          </div>
          {/* Row */}
          {/* Row */}
          <div className="flex flex-col space-y-1  mt-5  pt-5">
            <div className="font-semibold">{t("contentForm.publicStatus")}</div>
            <div className="w-full">
              <Radio
                className="mr-5"
                options={[
                  { label: t("contentForm.publicYes"), value: "true" },
                  {
                    label: t("contentForm.publicNo"),
                    value: "false",
                  },
                ]}
                name="viewed"
                value={viewed}
                onChange={onChangeHandler}
              />
            </div>
          </div>
          {/* Row */}
        </div>
        <div className="w-6/12 pb-14 h-full  ">
          <QuillEditer
            value={contents}
            onChange={onEditChange}
            className="h-full"
          />
        </div>
      </div>
    </>
  );
}
