import { useAtom, useAtomValue } from "jotai";
import Lottie from "lottie-react";
import { Activity, Calendar, Check, FileText, Stethoscope } from "lucide-react";
import { useState } from "react";
import type {
  CancerInfoSelection,
  CareTrackNewDto,
  Disease,
} from "@/apis/types";
import guideAnimation from "@/assets/lottie/cancerGuide.json";
import { accountHospitalAtom, accountMeAtom } from "@/atoms/accountAtoms";
import { cancerInfoGuideOpenAtom } from "@/atoms/cancerInfoGuideAtom";
import Popup from "@/components/ui/Popup";
import { useApplyCareTrackService } from "@/hooks/mutations";
import { useHospitalDiseaseList } from "@/hooks/queries/useHospitalQueries";
import { useDialog } from "@/hooks/useDialog";
import { cn } from "@/lib/utils";

export default function CancerInfoGuide() {
  // 전역 상태로 open 관리
  const [open, setOpen] = useAtom(cancerInfoGuideOpenAtom);

  const { data: hospital } = useAtomValue(accountHospitalAtom);

  // 팝업이 열릴 때만 질환 목록 조회 (언어에 따라 자동으로 hospitalId 선택)
  // 임시: enabled 제거하고 테스트
  const { data: diseaseList, isLoading } = useHospitalDiseaseList(
    hospital?.hospitalSeq,
    true,
  );

  // 현재 단계 (1~6)
  const [currentStep, setCurrentStep] = useState(1);

  // 사용자 선택 상태
  const [selection, setSelection] = useState<CancerInfoSelection>({
    disease: undefined,
    treatment: undefined,
    diseaseType: undefined,
    otherOption: undefined,
    interestAreas: [],
    contentPeriod: undefined,
  });
  //  암캐어 트랙 설정 Mutation
  const { mutate } = useApplyCareTrackService();

  const { confirm, alert } = useDialog();

  // Step 3: 선택된 질환의 "암 종류" 옵션들
  const diseaseTypeOptions =
    selection.disease?.diseaseOption.filter(
      (opt) => opt.groupName === "암 종류" || opt.groupName === "암 병기",
    ) || [];

  // Step 4: 선택된 질환의 "그 외 고려사항" 옵션들
  const otherConsiderationOptions =
    selection.disease?.diseaseOption.filter(
      (opt) => opt.groupName === "그 외 고려사항",
    ) || [];

  const handleSelect = (
    key: keyof CancerInfoSelection,
    value: CancerInfoSelection[keyof CancerInfoSelection],
  ) => {
    setSelection((prev) => ({ ...prev, [key]: value }));
  };

  // Step 1: 질환 선택
  const handleDiseaseSelect = (disease: Disease) => {
    setSelection({
      disease,
      treatment: undefined,
      diseaseType: undefined,
      otherOption: undefined,
      interestAreas: [],
      contentPeriod: undefined,
    });
  };

  // Step 5: 관심있는 영역 옵션 목록 (하드코딩 - ASIS와 동일)
  const interestAreaOptions = [
    "증상 알아보기",
    "치료 과정",
    "부작용과 대처",
    "위험요소와 관리법",
    "건강한 식생활과 운동",
    "마음 돌보기",
    "보호자를 위한 팁",
    "그외 도움되는 정보",
  ];

  // Step 5: 관심있는 영역 토글 (다중 선택)
  const handleInterestAreaToggle = (area: string) => {
    setSelection((prev) => {
      const current = prev.interestAreas || [];
      const isSelected = current.includes(area);
      return {
        ...prev,
        interestAreas: isSelected
          ? current.filter((item) => item !== area)
          : [...current, area],
      };
    });
  };

  // CancerInfoSelection을 CareTrackNewDto로 변환
  const createCareTrackDto = (): CareTrackNewDto | null => {
    if (
      !selection.disease ||
      !selection.treatment ||
      !selection.interestAreas ||
      selection.interestAreas.length === 0 ||
      !selection.contentPeriod
    ) {
      return null;
    }

    const dto: CareTrackNewDto = {
      days: selection.contentPeriod,
      diseaseSeq: selection.disease.diseaseSeq,
      diseases: {
        // 전체 목록이 아닌 선택된 옵션들만 배열로 전달
        diseaseOption: [
          ...(selection.diseaseType ? [selection.diseaseType] : []),
          ...(selection.otherOption ? [selection.otherOption] : []),
        ],
        diseaseSeq: selection.disease.diseaseSeq,
        // 전체 목록이 아닌 선택된 치료시기 1건만 배열로 전달
        diseaseTreatment: selection.treatment ? [selection.treatment] : [],
        name: selection.disease.diseaseName,
        seq: selection.disease.seq,
      },
      // 관심있는 영역을 그대로 전달
      interest: selection.interestAreas,
    };

    return dto;
  };

  // 현재 스텝의 필수 선택사항이 완료되었는지 확인
  const isCurrentStepValid = (): boolean => {
    const validationMap: Record<number, boolean> = {
      1: !!selection.disease,
      2: !!selection.treatment,
      3: !!selection.diseaseType,
      4: !!selection.otherOption,
      5: !!selection.interestAreas && selection.interestAreas.length > 0,
      6: !!selection.contentPeriod,
    };
    return validationMap[currentStep] ?? false;
  };

  const { data: account } = useAtomValue(accountMeAtom);

  // 다음 단계로
  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    } else {
      // 마지막 스텝에서 제출
      const dto = createCareTrackDto();

      if (dto) {
        const params: CareTrackNewDto = {
          ...dto,
          acSeq: account?.seq,
        };

        // 암정보 가이드 설정 확인 컨펌창
        confirm(
          {
            title: "암정보 가이드를 설정하시겠습니까?",
            body: (
              <div className="flex flex-col gap-4 text-left">
                <div className="p-3 bg-primary/5 rounded-xl border border-primary/10">
                  <p className="font-bold text-primary mb-2">
                    CAMA+의 맞춤형 컨텐츠는 뭐가 다른가요?
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex gap-2">
                      <span className="text-primary">•</span>
                      <span>
                        암유형 및 시기별로 개인 맞춤형으로 암정보를 제공합니다.
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary">•</span>
                      <span>
                        교수, 전문가가 직접 제공하는 전문지식을 바탕으로
                        컨텐츠가 만들어졌습니다.
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            ),
            actionButton: "암정보가이드 시작하기",
            cancelButton: "취소",
          },
          () => {
            mutate(params, {
              onSuccess: () => {
                alert("암정보가이드 설정이 완료되었습니다.", () => {
                  setOpen(false);
                  setCurrentStep(1);
                  setSelection({});
                });
              },
            });
          },
        );

        console.log("생성된 CareTrackNewDto:", params);
        // await submitCareTrack(dto);
      } else {
        console.error("필수 선택 항목이 누락되었습니다.");
      }
      // setOpen(false);
      // setCurrentStep(1);
      // setSelection({});
    }
  };

  // 이전 단계로
  const handleBack = () => {
    if (currentStep > 1) {
      // 현재 단계에 해당하는 선택사항 초기화
      const stepKeyMap: Record<number, keyof CancerInfoSelection> = {
        2: "treatment",
        3: "diseaseType",
        4: "otherOption",
        5: "interestAreas",
        6: "contentPeriod",
      };

      const keyToClear = stepKeyMap[currentStep];
      if (keyToClear) {
        if (keyToClear === "interestAreas") {
          setSelection((prev) => ({ ...prev, interestAreas: [] }));
        } else {
          handleSelect(keyToClear, undefined);
        }
      }

      setCurrentStep(currentStep - 1);
    }
  };

  // 팝업 닫을 때 초기화
  const handleClose = () => {
    setOpen(false);
    setCurrentStep(1);
    setSelection({});
  };

  if (isLoading) {
    return (
      <Popup open={open} setOpen={handleClose} direction="right">
        <div className="flex items-center justify-center h-full">
          <p>로딩 중...</p>
        </div>
      </Popup>
    );
  }

  // 스텝 정보
  const steps = [
    { number: 1, label: "질환" },
    { number: 2, label: "치료시기" },
    { number: 3, label: "암 종류" },
    { number: 4, label: "고려사항" },
    { number: 5, label: "관심영역" },
    { number: 6, label: "기간" },
  ];

  return (
    <Popup
      open={open}
      setOpen={handleClose}
      direction="right"
      title="암정보 가이드 설정"
    >
      <div className="flex flex-col h-full">
        {/* 헤더 - 스텝 인디케이터 */}
        <div className="relative bg-gradient-to-br from-primary via-primary to-primary/90 border-b overflow-hidden h-48">
          <div className="relative z-10 px-5 pt-2 pb-4">
            {/* 로티 애니메이션 */}
            <div className="flex justify-center mb-3">
              <Lottie
                animationData={guideAnimation}
                className="w-20 h-20"
                loop={true}
              />
            </div>

            {/* 스텝 인디케이터 - 컴팩트 버전 */}
            <div className="space-y-3">
              {/* 전체 진행률 표시 - 아이콘 */}
              <div className="flex items-center justify-center gap-5">
                {steps.map((step) => {
                  const isCompleted = currentStep > step.number;
                  const isCurrent = currentStep === step.number;

                  // 각 스텝에 맞는 아이콘
                  const getIcon = () => {
                    switch (step.number) {
                      case 1:
                        return Stethoscope; // 질환
                      case 2:
                        return Calendar; // 치료시기
                      case 3:
                        return FileText; // 암 종류
                      case 4:
                        return Activity; // 고려사항
                      case 5:
                        return Calendar; // 기간
                      default:
                        return FileText;
                    }
                  };

                  const Icon = getIcon();

                  return (
                    <div
                      key={step.number}
                      className="flex flex-col items-center gap-1.5"
                    >
                      <div
                        className={`
													transition-all duration-300 rounded-full flex items-center justify-center
													${
                            isCompleted
                              ? "w-9 h-9 bg-secondary"
                              : isCurrent
                                ? "w-11 h-11 bg-white ring-2 ring-white/50"
                                : "w-9 h-9 bg-white/30"
                          }
												`}
                      >
                        {isCompleted ? (
                          <Check
                            className="w-5 h-5 text-white"
                            strokeWidth={3}
                          />
                        ) : (
                          <Icon
                            className={`
															${
                                isCurrent
                                  ? "w-6 h-6 text-primary"
                                  : "w-4 h-4 text-white/50"
                              }
														`}
                            strokeWidth={2}
                          />
                        )}
                      </div>
                      <span
                        className={`
													text-[11px] transition-all duration-300
													${
                            isCurrent ? "text-white font-bold" : "text-white/60"
                          }
												`}
                      >
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* 컨텐츠 */}
        <div className="flex-1 overflow-y-auto p-5">
          {/* Step 1: 어떤 질환인가요? */}
          {currentStep === 1 && (
            <div>
              <div className="flex items-center justify-center gap-2 mb-4 p-3 border border-primary/20 rounded-lg shadow-sm bg-primary/5">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                  <Stethoscope
                    className="w-4 h-4 text-primary"
                    strokeWidth={2.5}
                  />
                </div>
                <h3 className="text-base font-semibold text-gray-800">
                  어떤 질환인가요?
                </h3>
              </div>
              <div className="space-y-2">
                {diseaseList?.response?.map((disease) => (
                  <button
                    key={disease.seq}
                    onClick={() => handleDiseaseSelect(disease)}
                    className={cn(
                      "w-full px-4 py-2.5 text-left border-2 rounded-lg transition-all",
                      selection.disease?.seq === disease.seq
                        ? "border-primary bg-primary/10 font-semibold"
                        : "border-gray-200 hover:border-primary hover:bg-primary/5",
                    )}
                  >
                    {disease.diseaseName}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: 치료시기를 선택하세요 */}
          {currentStep === 2 && selection.disease && (
            <div>
              <div className="flex items-center justify-center gap-2 mb-4 p-3 border border-primary/20 rounded-lg shadow-sm bg-primary/5">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                  <Calendar
                    className="w-4 h-4 text-primary"
                    strokeWidth={2.5}
                  />
                </div>
                <h3 className="text-base font-semibold text-gray-800">
                  치료시기를 선택하세요.
                </h3>
              </div>
              <div className="space-y-2">
                {selection.disease.diseaseTreatment.map((treatment) => (
                  <button
                    key={treatment.seq}
                    onClick={() => handleSelect("treatment", treatment)}
                    className={cn(
                      "w-full px-4 py-2.5 text-left border-2 rounded-lg transition-all",
                      selection.treatment?.seq === treatment.seq
                        ? "border-primary bg-primary/10 font-semibold"
                        : "border-gray-200 hover:border-primary hover:bg-primary/5",
                    )}
                  >
                    {treatment.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: 암 종류를 선택해 주세요 */}
          {currentStep === 3 && diseaseTypeOptions.length > 0 && (
            <div>
              <div className="flex items-center justify-center gap-2 mb-4 p-3 border border-primary/20 rounded-lg shadow-sm bg-primary/5">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                  <FileText
                    className="w-4 h-4 text-primary"
                    strokeWidth={2.5}
                  />
                </div>
                <h3 className="text-base font-semibold text-gray-800">
                  {diseaseTypeOptions[0].groupName}를 선택해 주세요.
                </h3>
              </div>
              <div className="space-y-2">
                {diseaseTypeOptions.map((option) => (
                  <button
                    key={option.seq}
                    onClick={() => handleSelect("diseaseType", option)}
                    className={cn(
                      "w-full px-4 py-2.5 text-left border-2 rounded-lg transition-all",
                      selection.diseaseType?.seq === option.seq
                        ? "border-primary bg-primary/10 font-semibold"
                        : "border-gray-200 hover:border-primary hover:bg-primary/5",
                    )}
                  >
                    {option.optionName}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: 그 외 고려사항을 선택해주세요 (단일 선택) */}
          {currentStep === 4 && otherConsiderationOptions.length > 0 && (
            <div>
              <div className="flex items-center justify-center gap-2 mb-4 p-3 border border-primary/20 rounded-lg shadow-sm bg-primary/5">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                  <Activity
                    className="w-4 h-4 text-primary"
                    strokeWidth={2.5}
                  />
                </div>
                <h3 className="text-base font-semibold text-gray-800">
                  그 외 고려사항을 선택해주세요.
                </h3>
              </div>
              <div className="space-y-2">
                {otherConsiderationOptions.map((option) => (
                  <button
                    key={option.seq}
                    onClick={() => handleSelect("otherOption", option)}
                    className={cn(
                      "w-full px-4 py-2.5 text-left border-2 rounded-lg transition-all",
                      selection.otherOption?.seq === option.seq
                        ? "border-primary bg-primary/10 font-semibold"
                        : "border-gray-200 hover:border-primary hover:bg-primary/5",
                    )}
                  >
                    {option.optionName}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: 관심있는 영역 선택 (다중 선택) */}
          {currentStep === 5 && (
            <div>
              <div className="flex items-center justify-center gap-2 mb-4 p-3 border border-primary/20 rounded-lg shadow-sm bg-primary/5">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                  <FileText
                    className="w-4 h-4 text-primary"
                    strokeWidth={2.5}
                  />
                </div>
                <h3 className="text-base font-semibold text-gray-800">
                  관심있는 영역을 선택해주세요.
                </h3>
              </div>
              <p className="text-sm text-gray-600 mb-4 text-center">
                여러 개를 선택할 수 있습니다.
              </p>

              {/* 모두 선택하기 - 구분된 스타일 */}
              <div className="mb-4 pb-4 border-b-2 border-gray-200">
                <button
                  onClick={() => {
                    const currentAreas = selection.interestAreas || [];
                    const allSelected =
                      currentAreas.length === interestAreaOptions.length;

                    if (allSelected) {
                      // 모두 선택 해제
                      setSelection((prev) => ({ ...prev, interestAreas: [] }));
                    } else {
                      // 모두 선택
                      setSelection((prev) => ({
                        ...prev,
                        interestAreas: interestAreaOptions,
                      }));
                    }
                  }}
                  className={cn(
                    "w-full px-4 py-3 text-left border-2 rounded-lg transition-all flex items-center gap-3",
                    selection.interestAreas?.length ===
                      interestAreaOptions.length
                      ? "border-secondary bg-secondary/15 font-bold shadow-sm"
                      : "border-gray-400 bg-gray-50 hover:bg-gray-100 hover:border-gray-500",
                  )}
                >
                  <div
                    className={cn(
                      "w-6 h-6 rounded border-2 flex items-center justify-center transition-all",
                      selection.interestAreas?.length ===
                        interestAreaOptions.length
                        ? "bg-secondary border-secondary"
                        : "border-gray-500 bg-white",
                    )}
                  >
                    {selection.interestAreas?.length ===
                      interestAreaOptions.length && (
                      <Check className="w-4 h-4 text-white" strokeWidth={3} />
                    )}
                  </div>
                  <span className="text-base font-bold text-gray-800">
                    모두 선택하기
                  </span>
                </button>
              </div>

              <div className="space-y-2">
                {interestAreaOptions.map((area) => {
                  const isSelected = selection.interestAreas?.includes(area);
                  return (
                    <button
                      key={area}
                      onClick={() => handleInterestAreaToggle(area)}
                      className={cn(
                        "w-full px-4 py-2.5 text-left border-2 rounded-lg transition-all flex items-center gap-3",
                        isSelected
                          ? "border-primary bg-primary/10 font-semibold"
                          : "border-gray-200 hover:border-primary hover:bg-primary/5",
                      )}
                    >
                      <div
                        className={cn(
                          "w-5 h-5 rounded border-2 flex items-center justify-center transition-all",
                          isSelected
                            ? "bg-primary border-primary"
                            : "border-gray-300",
                        )}
                      >
                        {isSelected && (
                          <Check
                            className="w-3 h-3 text-white"
                            strokeWidth={3}
                          />
                        )}
                      </div>
                      <span>{area}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 6: 컨텐츠 기간 선택 */}
          {currentStep === 6 && selection.treatment && (
            <div>
              <StepHeader
                icon={Calendar}
                title="추천 컨텐츠를 며칠에 걸쳐 보시겠어요?"
              />
              <div className="space-y-2">
                {selection.treatment.treatmentPeriod
                  .split(",")
                  .map((period) => (
                    <OptionButton
                      key={period}
                      label={period}
                      isSelected={selection.contentPeriod === Number(period)}
                      onClick={() =>
                        handleSelect("contentPeriod", Number(period))
                      }
                    />
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* 푸터 - 이전/다음 버튼 */}
        <div className="px-5 py-3.5 border-t bg-white">
          <div className="flex gap-3">
            {/* 이전 버튼 */}
            {currentStep > 1 && (
              <button
                onClick={handleBack}
                className="flex-1 p-2 border-2 rounded-lg hover:bg-gray-50 transition-all font-medium"
              >
                이전
              </button>
            )}

            {/* 다음 버튼 */}
            <button
              onClick={handleNext}
              disabled={!isCurrentStepValid()}
              className={cn(
                "flex-1 p-2 rounded-lg transition-all font-medium",
                isCurrentStepValid()
                  ? "bg-primary text-white hover:bg-primary/90"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed",
              )}
            >
              {currentStep === 6 ? "완료" : "다음"}
            </button>
          </div>
        </div>
      </div>
    </Popup>
  );
}

// ===== 재사용 가능한 컴포넌트들 =====

type StepHeaderProps = {
  icon: React.ElementType;
  title: string;
};

function StepHeader({ icon: Icon, title }: StepHeaderProps) {
  return (
    <div className="flex items-center justify-center gap-2 mb-4 p-3 border border-primary/20 rounded-lg shadow-sm bg-primary/5">
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
        <Icon className="w-4 h-4 text-primary" strokeWidth={2.5} />
      </div>
      <h3 className="text-base font-semibold text-gray-800">{title}</h3>
    </div>
  );
}

type OptionButtonProps = {
  label: string;
  isSelected: boolean;
  onClick: () => void;
};

function OptionButton({ label, isSelected, onClick }: OptionButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full px-4 py-2.5 text-left border-2 rounded-lg transition-all",
        isSelected
          ? "border-primary bg-primary/10 font-semibold"
          : "border-gray-200 hover:border-primary hover:bg-primary/5",
      )}
    >
      {label}
    </button>
  );
}
