import {
  AngryIcon,
  BadgeCheck,
  CircleCheck,
  MapPinCheckInside,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Line,
  ReferenceDot,
  ResponsiveContainer,
  YAxis,
} from "recharts";

export default function Section1() {
  const totalPoints = 50;
  const maxHeight = 100;

  const data = Array.from({ length: totalPoints }).map((_, i) => {
    const t = i / (totalPoints - 1); // 0~1
    // t를 0~1에서 0.05~0.95 정도로 살짝 압축해서 양 끝 경사 강화
    const tAdjusted = 0.05 + t * 0.9;
    const y = Math.sin(tAdjusted * Math.PI) * maxHeight;
    return { name: `P${i}`, pv: y + 25 };
  });

  const myGrade = 7; // 1~10 등급

  // 마커 위치 계산
  const markerIndex = Math.floor((myGrade / 10) * (totalPoints - 1));
  const markerValue = data[markerIndex].pv;

  return (
    <div className="h-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
        >
          <ReferenceDot
            x={2}
            y={188}
            shape={(props) => {
              const { cx, cy } = props;

              return (
                <g transform={`translate(${cx}, ${cy})`}>
                  <text
                    y={15}
                    fill="#4B5563"
                    className="font-jalnanGothic hidden sm:block"
                  >
                    종합평가
                  </text>

                  <text
                    y={55} // 상단에서 20px
                    fill="#0066CC"
                    fontSize={25}
                    fontWeight={600}
                    className="font-jalnanGothic hidden sm:block"
                  >
                    <tspan>홍길동님의 종합 등급은</tspan>
                    <tspan x={0} y={85} fill="#4B5563">
                      B등급
                    </tspan>
                    <tspan x={75}>입니다.</tspan>
                  </text>
                  <text
                    y={25} // 상단에서 20px
                    fill="#0066CC"
                    fontSize={18}
                    fontWeight={600}
                    className="font-jalnanGothic block sm:hidden"
                  >
                    <tspan>홍길동님의 종합 등급은</tspan>
                    <tspan x={0} y={50} fill="#4B5563">
                      B등급
                    </tspan>
                    <tspan x={55}>입니다.</tspan>
                  </text>
                </g>
              );
            }}
          />

          <YAxis domain={[0, 200]} hide />

          <Area
            type="monotone"
            dataKey="pv"
            stroke="#0066CC"
            fill="#0066CC"
            activeDot={false}
          />

          {/* 라인 */}
          <Line
            type="monotone"
            dataKey="pv"
            stroke="#0066CC"
            strokeWidth={3}
            dot={false}
            activeDot={false}
          />

          <ReferenceDot
            x={markerIndex}
            y={markerValue}
            shape={(props) => {
              const { cx, cy } = props;

              return (
                <g className="cursor-pointer animate-bounce-y">
                  <g transform={`translate(${cx}, ${cy})`}>
                    <MapPinCheckInside
                      size={40}
                      fill="##4B5563"
                      stroke="#0066CC"
                      strokeWidth={2}
                      className="stroke-blue-500 fill-white "
                    />
                  </g>
                  <g transform={`translate(${cx + 22}, ${cy - 15})`}>
                    <rect
                      x={-40} // 텍스트 폭 / 2
                      y={-10}
                      width={77} // 텍스트 영역 폭
                      height={20}
                      rx={4} // 둥근 모서리
                      fill="#fff" // 배경색
                      stroke="#0066CC" // 테두리 색
                      strokeWidth={1.5} // 테두리 두께
                    />
                    <text
                      x={0} // 그룹 중앙
                      y={5} // rect 안 세로 중앙 맞춤
                      textAnchor="middle"
                      fill="#0066CC"
                      fontSize={13}
                      fontWeight={600}
                    >
                      상위 10%
                    </text>
                  </g>
                </g>
              );
            }}
          />

          <ReferenceDot
            x={2}
            y={29}
            gradientTransform="true"
            shape={(props) => {
              const { cx, cy } = props;

              return (
                <>
                  <g
                    transform={`translate(${cx}, ${cy})`}
                    className="hidden sm:block"
                  >
                    <g transform={`translate(0, 0)`}>
                      {/* 텍스트 */}
                      <text
                        x={0}
                        y={0}
                        fill="#fff"
                        fontSize={15}
                        fontWeight={600}
                      >
                        정서안정
                      </text>

                      {/* 아이콘 */}
                      <g transform={`translate(65, -19)`}>
                        {/* x: 텍스트 끝 위치 기준으로, y: 텍스트 중앙 맞춤 */}
                        <AngryIcon size={25} fill="#fff" />
                        <text x={30} y={19} className="font-jalnan" fill="#fff">
                          나쁨
                        </text>
                      </g>
                    </g>

                    <g transform={`translate(${0}, ${26})`}>
                      {/* 텍스트 */}
                      <text
                        x={0}
                        y={0}
                        fill="#fff"
                        fontSize={15}
                        fontWeight={600}
                      >
                        응답신뢰
                      </text>

                      {/* 아이콘 */}
                      <g transform={`translate(65, -19)`}>
                        {/* x: 텍스트 끝 위치 기준으로, y: 텍스트 중앙 맞춤 */}
                        <CircleCheck size={25} fill="#fff" />
                        <text x={30} y={19} className="font-jalnan" fill="#fff">
                          신뢰가능
                        </text>
                      </g>
                    </g>
                  </g>
                  <g
                    transform={`translate(${cx + 5}, ${cy + 10})`}
                    className="block sm:hidden md:hidden"
                  >
                    <g transform={`translate(0, 0)`}>
                      {/* 텍스트 */}
                      <text
                        x={0}
                        y={0}
                        fill="#fff"
                        fontSize={13}
                        fontWeight={600}
                      >
                        정서안정
                      </text>

                      {/* 아이콘 */}
                      <g transform={`translate(52, -15)`}>
                        {/* x: 텍스트 끝 위치 기준으로, y: 텍스트 중앙 맞춤 */}
                        <AngryIcon size={20} fill="#fff" />
                        <text x={24} y={16} className="text-sm" fill="#fff">
                          나쁨
                        </text>
                      </g>
                    </g>
                    <g transform={`translate(120, 0)`}>
                      {/* 텍스트 */}
                      <text
                        x={0}
                        y={0}
                        fill="#fff"
                        fontSize={13}
                        fontWeight={600}
                      >
                        응답신뢰
                      </text>

                      {/* 아이콘 */}
                      <g transform={`translate(52, -15)`}>
                        {/* x: 텍스트 끝 위치 기준으로, y: 텍스트 중앙 맞춤 */}
                        <BadgeCheck size={20} fill="#fff" />
                        <text x={24} y={16} className="text-sm" fill="#fff">
                          신뢰가능
                        </text>
                      </g>
                    </g>
                  </g>
                </>
              );
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
