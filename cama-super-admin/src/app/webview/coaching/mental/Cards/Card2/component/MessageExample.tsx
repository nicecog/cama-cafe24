import TextBox from "@/app/webview/coaching/component/Layout/TextBox";
import { ReactNode } from "react";
import { FcAbout, FcRight } from "react-icons/fc";
import ImporText from "../../../component/ImportText";

type MessageExampleType = {
  type: 1 | 2 | 3;
  className?: string;
  children: ReactNode;
};

// 나말하기 기법 박스
export default function MessageExample(props: MessageExampleType) {
  return (
    <>
      <TextBox className={`${props.className}`}>
        <div className="mb-2 ">
          <p className="flex items-center justify-start gap-1.5 text-camaColor1 font-oneMobile">
            <FcAbout className="text-f7" />
            {
              {
                1: "첫째",
                2: "둘째",
                3: "셋째",
              }[props.type]
            }
          </p>
          <p className="border-b py-2">
            {
              {
                1: (
                  <>
                    상대방의{" "}
                    <ImporText className="underline !text-camaColor !mx-0 ">
                      행동
                    </ImporText>
                    에 대해서 말한다.
                  </>
                ),
                2: (
                  <>
                    그로 인한 나의{" "}
                    <ImporText className="underline !text-camaColor !mx-0 ">
                      감정
                    </ImporText>
                    을 이야기한다.
                  </>
                ),
                3: (
                  <>
                    <ImporText className="underline !text-camaColor !mx-0 ">
                      바라는 것
                    </ImporText>
                    을 구체적으로 이야기한다.
                  </>
                ),
              }[props.type]
            }
          </p>
        </div>

        <div className="text-justify font-oneMobile flex items-center justify-start gap-1">
          <FcRight className="w-[20px]" />
          <p className="text-camaColor1">{props.children}</p>
        </div>
      </TextBox>
    </>
  );
}
