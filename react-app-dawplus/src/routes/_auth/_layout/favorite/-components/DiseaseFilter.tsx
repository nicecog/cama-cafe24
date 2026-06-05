import { motion } from "framer-motion";
import {
  Cross,
  LayoutGrid,
  Ribbon,
  Stethoscope,
  Waves,
  Zap,
} from "lucide-react";
import { Each } from "@/components/common/Each";

// 질병 필터 옵션
const diseaseOptions = [
  { key: "99", value: "전체" },
  { key: "2", value: "유방암" },
  { key: "3", value: "폐암" },
  { key: "4", value: "대장암" },
  { key: "6", value: "갑상선암" },
  { key: "8", value: "암(General)" },
];

interface DiseaseFilterProps {
  selectedDisease: string;
  onDiseaseChange: (disease: string) => void;
}

/**
 * 질병 필터 버튼 (아이콘 탭 스타일)
 */
export function DiseaseFilter({
  selectedDisease,
  onDiseaseChange,
}: DiseaseFilterProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-1.5 px-1">
        <Each
          of={diseaseOptions}
          keyItem="key"
          render={(option) => {
            const isSelected = selectedDisease === option.key;

            // 각 질병별 아이콘 컴포넌트 매핑
            const IconComponent =
              {
                "99": LayoutGrid, // 전체
                "2": Ribbon, // 유방암 (리본 - 유방암 인식 리본)
                "3": Waves, // 폐암 (파동 - 호흡)
                "4": Stethoscope, // 대장암 (청진기)
                "6": Zap, // 갑상선암 (번개 - 에너지/대사)
                "8": Cross, // 암(General) (십자가 - 의료)
              }[option.key] || LayoutGrid;

            return (
              <motion.button
                type="button"
                onClick={() => onDiseaseChange(option.key)}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                className={`
									relative overflow-hidden
									rounded-xl
									backdrop-blur-sm border-2
									transition-all duration-300
									flex-shrink-0
									px-2 py-2
									${
                    isSelected
                      ? "border-white bg-white text-primary shadow-lg"
                      : "border-white/30 bg-white/20 text-white hover:border-white/50 hover:bg-white/30"
                  }
								`}
              >
                <div className="flex flex-col items-center gap-1">
                  <IconComponent className="w-6 h-6" />
                  <span className="text-[10px] font-bold whitespace-nowrap">
                    {option.value}
                  </span>
                </div>
              </motion.button>
            );
          }}
        />
      </div>

      {/* 선택된 필터 표시 */}
      <motion.div
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <span className="text-xs text-white/80">
          선택:{" "}
          <span className="font-bold text-white">
            {diseaseOptions.find((opt) => opt.key === selectedDisease)?.value ||
              "전체"}
          </span>
        </span>
      </motion.div>
    </div>
  );
}
