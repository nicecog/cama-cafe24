import { createFileRoute } from "@tanstack/react-router";
import {
  Activity,
  Cpu,
  FileText,
  Info,
  Layers,
  Magnet,
  Smile,
  Star,
} from "lucide-react";
import "@/assets/fonts/jalnan-gothic.css";
import { Each } from "@/components/common/Each";
import {
  TabHeader,
  TabsContent,
  TabsProvider,
} from "@/components/effect/SmoothTabs";
import Coordination from "./-coordination";
import Emotion from "./-emotion";
import Executive from "./-executive";
import Intro from "./-intro";
import Spatial from "./-spatial";
import Summary from "./-summary";
import SummaryAll from "./-summaryAll";
import WorkingMemory from "./-workingMemory";

export const Route = createFileRoute("/_auth/_layout/reporting/")({
  component: RouteComponent,
});

function RouteComponent() {
  const data = [
    {
      title: "소개",
      id: "intro",
      icon: <Info />,
      color: "#5d5dff",
      content: <Intro />,
    }, // 파랑
    {
      title: "요약",
      id: "summary",
      icon: <FileText />,
      color: "#67bb67",
      content: <Summary />,
    }, // 초록
    {
      title: "감정지각능력",
      id: "emotion",
      icon: <Smile />,
      color: "#f5c542",
      content: <Emotion />,
    }, // 노랑
    {
      title: "작업기억력",
      id: "workingMemory",
      icon: <Cpu />,
      color: "#f56868",
      content: <WorkingMemory />,
    }, // 빨강
    {
      title: "시공간지각능력",
      id: "spatial",
      icon: <Magnet />,
      color: "#63a7c7",
      content: <Spatial />,
    }, // 하늘
    {
      title: "종합집행능력",
      id: "executive",
      icon: <Layers />,
      color: "#9b59b6",
      content: <Executive />,
    }, // 보라
    {
      title: "운동협응능력",
      id: "coordination",
      icon: <Activity />,
      color: "#f39c12",
      content: <Coordination />,
    }, // 오렌지
    {
      title: "총평",
      id: "summaryAll",
      icon: <Star />,
      color: "#e67e22",
      content: <SummaryAll />,
    }, // 주황
  ];
  return (
    <TabsProvider defaultValue={data[0].id} wobbly={true}>
      <TabHeader data={data} />
      <Each
        of={data}
        render={(r) => (
          <TabsContent value={r.id} className="mt-10">
            {r.content}
          </TabsContent>
        )}
      />
    </TabsProvider>
  );
}
