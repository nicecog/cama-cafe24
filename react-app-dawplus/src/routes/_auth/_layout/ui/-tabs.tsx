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
import React from "react";
import { Each } from "@/components/common/Each";
import IconTabs, { type TabInfosType } from "@/components/effect/IconTabs";
import {
  TabsBtn,
  TabsContent,
  TabsProvider,
} from "@/components/effect/SmoothTabs";

export default function Tabs() {
  const data = [
    { id: "1", title: "소개", icon: <Info /> },
    { id: "2", title: "요약", icon: <FileText /> },
    { id: "3", title: "감정지각능력", icon: <Smile /> },
    { id: "4", title: "작업기억력", icon: <Cpu /> },
    { id: "5", title: "시공간지각능력", icon: <Magnet /> },
    { id: "6", title: "종합집행능력", icon: <Layers /> },
    { id: "7", title: "운동협응능력", icon: <Activity /> },
    { id: "8", title: "총평", icon: <Star /> },
  ];
  const data2: TabInfosType[] = [
    {
      title: "소개",
      id: "intro",
      icon: <Info />,
      color: "#5d5dff",
      content: null,
    }, // 파랑
    {
      title: "요약",
      id: "summary",
      icon: <FileText />,
      color: "#67bb67",
      content: null,
    }, // 초록
    {
      title: "감정지각능력",
      id: "emotion",
      icon: <Smile />,
      color: "#f5c542",
      content: null,
    }, // 노랑
    {
      title: "작업기억력",
      id: "workingMemory",
      icon: <Cpu />,
      color: "#f56868",
      content: null,
    }, // 빨강
    {
      title: "시공간지각능력",
      id: "spatial",
      icon: <Magnet />,
      color: "#63a7c7",
      content: null,
    }, // 하늘
    {
      title: "종합집행능력",
      id: "executive",
      icon: <Layers />,
      color: "#9b59b6",
      content: null,
    }, // 보라
    {
      title: "운동협응능력",
      id: "coordination",
      icon: <Activity />,
      color: "#f39c12",
      content: null,
    }, // 오렌지
    {
      title: "총평",
      id: "summaryAll",
      icon: <Star />,
      color: "#e67e22",
      content: null,
    }, // 주황
  ];
  return (
    <>
      <IconTabs tabs={data2} defaultIndex={0} />
      <TabsProvider defaultValue={"1"} wobbly={true}>
        <div className="flex justify-center mt-2">
          <div className="flex w-full mt-2 bg-gray-200 p-1 text-black rounded-md border overflow-auto">
            <Each
              of={data}
              render={(item) => (
                <TabsBtn
                  value={item.id}
                  className="flex-auto whitespace-nowrap px-3 py-1"
                >
                  <span className="relative z-[2] uppercase flex items-center gap-1">
                    {item.icon &&
                      React.cloneElement(item.icon, {
                        className: "w-4 h-4 text-blue-500",
                      })}
                    {item.title}
                  </span>
                </TabsBtn>
              )}
            />
            {/* {data.map((item) => (
							<TabsBtn value={item.title} key={item.title}>
								<span className="relative z-[2] uppercase">{item.title}</span>
							</TabsBtn>
						))} */}
          </div>
        </div>

        <TabsContent value="coordination">
          <div className="p-2 border">adsfasdfasdf</div>
        </TabsContent>
      </TabsProvider>
    </>
  );
}
