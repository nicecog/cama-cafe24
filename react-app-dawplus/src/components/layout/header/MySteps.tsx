import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { useAtomValue } from "jotai";
import {
  Bar,
  ComposedChart,
  ReferenceLine,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import "@/assets/fonts/jalnan-gothic.css";
import activity from "@/assets/images/character/activity.png";
import { accountMeAtom } from "@/atoms/accountAtoms";
import IncrementNumber from "@/components/effect/IncrementNumber";
import Popup from "@/components/ui/Popup";
import { useCareTrackStepList } from "@/hooks/queries";

type MyStepsProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export default function MySteps(props: MyStepsProps) {
  // Props
  const { open, setOpen } = props;

  // 내 정보에서 accountSeq 가져오기
  const { data: accountData } = useAtomValue(accountMeAtom);
  const accountSeq = accountData?.seq;

  // Step data - 팝업이 열릴 때만 fetch (lazy loading)
  const { data: stepData, isLoading } = useCareTrackStepList(
    String(accountSeq ?? ""),
    open, // 팝업이 열릴 때만 활성화
  );

  // 차트 데이터 포맷팅 - 날짜순 정렬
  const chartData = stepData
    ?.sort(
      (a, b) =>
        new Date(a.executionDate).getTime() -
        new Date(b.executionDate).getTime(),
    )
    .map((step) => {
      const date = new Date(step.executionDate);
      return {
        // "6.10" 형식으로 간단하게
        date: format(date, "M.d"),
        steps: step.stepNum,
        fullDate: format(date, "yyyy년 M월 d일", { locale: ko }),
        dayOfWeek: format(date, "EEE", { locale: ko }),
      };
    });

  // 평균 계산
  const average = chartData
    ? Math.round(
        chartData.reduce((sum, item) => sum + item.steps, 0) / chartData.length,
      )
    : 0;

  // 차트 표시용 데이터 - 최근 7개만
  const chartDisplayData = chartData?.slice(-7);

  // 차트 표시용 데이터의 최대값 계산 (차트 스케일용)
  const displayMaxSteps = chartDisplayData
    ? Math.max(...chartDisplayData.map((d) => d.steps))
    : 0;

  // 차트 데이터에 최대값 추가
  const chartDataWithMax = chartDisplayData?.map((item) => ({
    ...item,
    maxSteps: displayMaxSteps,
  }));

  // 최근 걸음수 (마지막 데이터)
  const latestSteps = chartData?.[chartData.length - 1]?.steps ?? 0;

  return (
    <Popup open={open} setOpen={setOpen} title="걸음수">
      <div className="flex flex-col  bg-white">
        {/* 헤더 - 나의 걸음수와 통계 */}
        <div className="relative bg-primary p-6 pb-8 text-white overflow-hidden">
          {/* 배경 장식 */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10 space-y-4">
            {/* 상단: 걷는 이미지와 나의 걸음수 */}
            <div className="flex items-center gap-4">
              {/* 걷는 이미지 */}
              <div className="relative ">
                <div className="absolute inset-0 bg-white/20 rounded-full blur-xl" />
                <img
                  src={activity}
                  alt="activity"
                  className="w-20 h-20 object-contain relative z-10 drop-shadow-2xl animate-walk"
                  style={{ animationDuration: "2s" }}
                />
              </div>

              {/* 나의 걸음수 메시지 */}
              <div className="flex-1 space-y-3">
                {/* 걸음수 카운터 */}
                <div className="relative">
                  {/* 글로우 효과 - 흰색 계열로 변경 */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/30 to-white/20 blur-2xl animate-pulse" />

                  {/* 숫자 */}
                  <div className="relative">
                    <p className="text-lg font-medium text-white/90 tracking-wider font-jalnan">
                      총 걸음수
                    </p>
                    <p className="text-4xl font-black font-jalnan leading-tight">
                      {chartData ? (
                        <>
                          <IncrementNumber
                            target={chartData.reduce(
                              (sum, item) => sum + item.steps,
                              0,
                            )}
                            duration={2000}
                          />
                          <span className="text-2xl ml-1 font-medium">
                            걸음
                          </span>
                        </>
                      ) : (
                        "0"
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 하단: 통계 카드 */}
            {chartData && chartData.length > 0 && (
              <div className="grid grid-cols-2 gap-3">
                {/* 평균 카드 */}
                <div className="group bg-white/95 backdrop-blur-sm rounded-2xl py-3 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-10 h-10 bg-sky-500 rounded-xl flex items-center justify-center mb-2 group-hover:rotate-12 transition-transform duration-300">
                      <span className="text-white text-lg">📈</span>
                    </div>
                    <p className="text-base-fixed text-sky-600 mb-1 font-semibold">
                      평균
                    </p>
                    <p className="text-xl font-bold text-gray-900 font-jalnan">
                      <IncrementNumber target={average} duration={2000} /> 걸음
                    </p>
                  </div>
                </div>

                {/* 최고 카드 */}
                <div className="group bg-white/95 backdrop-blur-sm rounded-2xl py-3 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center mb-2 group-hover:rotate-12 transition-transform duration-300">
                      <span className="text-white text-lg">🏆</span>
                    </div>
                    <p className="text-base-fixed text-indigo-600 mb-1 font-semibold">
                      최고
                    </p>
                    <p className="text-xl font-bold text-gray-900 font-jalnan">
                      <IncrementNumber
                        target={Math.max(...chartData.map((d) => d.steps))}
                        duration={2000}
                      />{" "}
                      걸음
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 차트 영역 */}
        <div className="flex-1  px-6 pb-6 pt-4">
          {isLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-4" />
                <p className="text-gray-600">데이터를 불러오는 중...</p>
              </div>
            </div>
          ) : !chartData || chartData.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <p className="text-gray-600 mb-2">걸음수 데이터가 없습니다</p>
                <p className="text-sm text-gray-400">
                  활동을 시작하면 데이터가 표시됩니다
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* 차트에요 */}
              {/* Bar 차트 - 세로 막대 */}
              <div className="border-2 border-primary rounded-xl  shadow-sm mb-4 relative pt-14 font-jalnanGothic">
                {/* 최근 걸음수 표시 - 차트 안쪽 상단 */}
                <div className="absolute top-4 left-5 z-10 font-jalnan">
                  <p className="text-base-fixed text-gray-600 mb-1">
                    최근 걸음수
                  </p>
                  <p className="text-3xl-fixed font-bold text-gray-900">
                    {latestSteps.toLocaleString()}
                  </p>
                </div>

                <ResponsiveContainer width="100%" height={240}>
                  <ComposedChart
                    data={chartDataWithMax}
                    margin={{
                      top: 0,
                      right: 35,
                      left: 20,
                      bottom: 0,
                    }}
                    barGap={-40}
                    barCategoryGap={0}
                  >
                    <XAxis
                      dataKey="dayOfWeek"
                      tick={(props) => {
                        const { x, y, payload } = props;
                        const data = chartDataWithMax?.find(
                          (item) => item.dayOfWeek === payload.value,
                        );
                        return (
                          <g transform={`translate(${x},${y})`}>
                            {/* 요일 */}
                            <text
                              x={0}
                              y={0}
                              dy={12}
                              textAnchor="middle"
                              fill="#020202"
                              fontSize={12}
                              fontWeight="600"
                            >
                              {payload.value}
                            </text>
                            {/* 걸음수 */}
                            <text
                              x={0}
                              y={0}
                              dy={26}
                              textAnchor="middle"
                              fill="#0066CC"
                              fontSize={10}
                              fontWeight="500"
                            >
                              {data?.steps.toLocaleString()}
                            </text>
                          </g>
                        );
                      }}
                      tickLine={false}
                      axisLine={false}
                      height={50}
                    />

                    <YAxis hide />

                    {/* 배경 막대 - 최대값 */}
                    <Bar
                      dataKey="maxSteps"
                      fill="#E5E7EB"
                      radius={[25, 25, 25, 25]}
                      maxBarSize={14}
                    />

                    {/* 실제 값 막대 - 배경 위에 겹침 */}
                    <Bar
                      dataKey="steps"
                      fill="#0066CC"
                      radius={[25, 25, 25, 25]}
                      maxBarSize={14}
                    />

                    {/* 평균선 - 맨 앞에 표시 */}
                    <ReferenceLine
                      y={average}
                      stroke="tomato"
                      strokeDasharray="2 2"
                      strokeWidth={1}
                      label={{
                        value: `평균`,
                        position: "right",
                        fill: "#374151",
                        fontSize: 12,
                      }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
                {/* 날짜 표시 (X축 아래) */}
              </div>
              {/* 차트에요 */}

              {/* 상세 리스트 */}
              <div className="flex-1 overflow-auto">
                <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="text-blue-500">📊</span> 상세 기록
                </h3>
                <div className="space-y-2">
                  {chartData.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100 hover:border-blue-300 hover:bg-blue-50/50 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-1 h-8 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full" />
                        <div>
                          <p className="text-[11px] font-semibold text-gray-900">
                            {item.date} ({item.dayOfWeek})
                          </p>
                          <p className="text-[9px] text-gray-400">
                            {item.fullDate}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                          {item.steps.toLocaleString()}
                        </p>
                        <p className="text-[9px] text-gray-400">걸음</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </Popup>
  );
}
