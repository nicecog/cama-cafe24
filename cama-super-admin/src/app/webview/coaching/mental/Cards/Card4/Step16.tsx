import Footer from "../../component/Footer";
import { useSetAtom } from "jotai";
import { nextStepAtom, prevStepAtom } from "../CardAtom";
import TextBox from "../../../component/Layout/TextBox";
import TextArea from "../../../component/Layout/TextArea";
import { FcAbout, FcRight } from "react-icons/fc";
import useMentalType from "@/hooks/useMentalType";
import ImporText from "../../component/ImportText";
// 생각 바꾸기
export default function Step16() {
  const onNext = useSetAtom(nextStepAtom);
  const onPrev = useSetAtom(prevStepAtom);

  const type: string = useMentalType();

  return (
    <>
      <TextBox className="mt-5 text-justify">
        {
          {
            ["전투형"]: (
              <>
                혼자 감당해야한다는 생각에 기분이 울적해졌어요. 하지만 다른
                생각을 한다면 어떨까요?
                <p className="mt-5">카마코치와 함께 생각을 바꿔볼게요.</p>
              </>
            ),
            ["순응형"]: (
              <>
                <ImporText>'재발'</ImporText>이라는 단어를 보고 어떤 생각이
                떠오르셨나요?
                <p className="mt-2">
                  <ImporText>'나도 재발하면 어떡하지…'</ImporText>
                </p>
                <p>
                  <ImporText>'재발하면 죽는걸텐데…'</ImporText>
                </p>
                <p className="mt-2">카마코치와 함께 생각을 바꿔봅시다.</p>
              </>
            ),
            ["억압형"]: (
              <>
                <ImporText>'재발'</ImporText>이라는 단어를 보고 어떤 생각이
                떠오르셨나요?
                <p className="mt-2">
                  <ImporText>'나도 재발하면 어떡하지…'</ImporText>
                </p>
                <p>
                  <ImporText>'재발하면 죽는걸텐데…'</ImporText>
                </p>
                <p className="mt-2">카마코치와 함께 생각을 바꿔봅시다.</p>
              </>
            ),
            ["자포자기형"]: (
              <>
                혼자 감당해야한다는 생각에 기분이 울적해졌어요. 하지만 다른
                생각을 한다면 어떨까요?
                <p className="mt-5">카마코치와 함께 생각을 바꿔볼게요.</p>
              </>
            ),
            ["걱정형"]: (
              <>
                <ImporText>'재발'</ImporText>이라는 단어를 보고 어떤 생각이
                떠오르셨나요?
                <p className="mt-2">
                  <ImporText>'나도 재발하면 어떡하지…'</ImporText>
                </p>
                <p>
                  <ImporText>'재발하면 죽는걸텐데…'</ImporText>
                </p>
                <p className="mt-2">카마코치와 함께 생각을 바꿔봅시다.</p>
              </>
            ),
          }[type]
        }
      </TextBox>

      <TextArea className="mt-5">
        {
          {
            ["전투형"]: (
              <>
                <div className="">
                  <p className="flex items-center justify-start gap-1.5 text-camaColor font-oneMobile border-b pb-2">
                    <FcAbout className="text-f6" />
                    <span className="mt-0.5">"혼자서 싸워나가야 해."</span>
                  </p>
                </div>
                <div className="text-justify font-oneMobile flex items-center justify-start gap-2">
                  <FcRight className="text-f6" />
                  <p className="text-camaColor1 mt-1.5">
                    필요할 땐 언제든 의료진의 도움을 받을 수 있어.
                  </p>
                </div>
                <div className="text-justify font-oneMobile flex items-center justify-start gap-2 border-t">
                  <FcRight className="text-f6" />
                  <p className="text-camaColor1 mt-1.5">
                    혼자서 다 해결해야하는 건 아니야. <br />
                    가족에게 도움을 요청할 수 있어.
                  </p>
                </div>
                <div className="text-justify font-oneMobile flex items-center justify-start gap-2 border-t">
                  <FcRight className="text-f6" />
                  <p className="text-camaColor1 mt-1.5">
                    지금까지 잘 해왔으니 앞으로도 잘 할 수 있을거야.
                  </p>
                </div>
              </>
            ),
            ["순응형"]: (
              <>
                <p className="flex items-center justify-start gap-1.5 text-camaColor font-oneMobile border-b pb-2">
                  <FcAbout className="text-f6" />
                  <span className="mt-0.5">"나도 재발하면 어떡하지…"</span>
                </p>

                <div className="text-justify font-oneMobile flex items-center justify-start gap-2">
                  <FcRight className="text-f6" />
                  <p className="text-camaColor1 mt-1.5">
                    재발될 수도 있지. 하지만 그렇지 않을 확률이 더 높아.
                  </p>
                </div>

                <p className="flex items-center justify-start gap-1.5 text-camaColor font-oneMobile border-b pb-2 mt-5">
                  <FcAbout className="text-f6" />
                  <span className="mt-0.5">"재발하면 죽는걸텐데…"</span>
                </p>

                <div className="text-justify font-oneMobile flex items-center justify-start gap-2">
                  <FcRight className="text-f6" />
                  <p className="text-camaColor1 mt-1.5">
                    설사 재발되더라도 다시 치료할 수 있어.
                  </p>
                </div>
              </>
            ),
            ["억압형"]: (
              <>
                <p className="flex items-center justify-start gap-1.5 text-camaColor font-oneMobile border-b pb-2">
                  <FcAbout className="text-f6" />
                  <span className="mt-0.5">"나도 재발하면 어떡하지…"</span>
                </p>

                <div className="text-justify font-oneMobile flex items-center justify-start gap-2">
                  <FcRight className="text-f6" />
                  <p className="text-camaColor1 mt-1.5">
                    재발될 수도 있지. 하지만 그렇지 않을 확률이 더 높아.
                  </p>
                </div>

                <p className="flex items-center justify-start gap-1.5 text-camaColor font-oneMobile border-b pb-2 mt-5">
                  <FcAbout className="text-f6" />
                  <span className="mt-0.5">"재발하면 죽는걸텐데…"</span>
                </p>

                <div className="text-justify font-oneMobile flex items-center justify-start gap-2">
                  <FcRight className="text-f6" />
                  <p className="text-camaColor1 mt-1.5">
                    설사 재발되더라도 다시 치료할 수 있어.
                  </p>
                </div>
              </>
            ),
            ["자포자기형"]: (
              <>
                <div className="">
                  <p className="flex items-center justify-start gap-1.5 text-camaColor font-oneMobile border-b pb-2">
                    <FcAbout className="text-f6" />
                    <span className="mt-0.5">"혼자서 싸워나가야 해."</span>
                  </p>
                </div>
                <div className="text-justify font-oneMobile flex items-center justify-start gap-2">
                  <FcRight className="text-f6" />
                  <p className="text-camaColor1 mt-1.5">
                    필요할 땐 언제든 의료진의 도움을 받을 수 있어.
                  </p>
                </div>
                <div className="text-justify font-oneMobile flex items-center justify-start gap-2 border-t">
                  <FcRight className="text-f6" />
                  <p className="text-camaColor1 mt-1.5">
                    혼자서 다 해결해야하는 건 아니야. <br />
                    가족에게 도움을 요청할 수 있어.
                  </p>
                </div>
                <div className="text-justify font-oneMobile flex items-center justify-start gap-2 border-t">
                  <FcRight className="text-f6" />
                  <p className="text-camaColor1 mt-1.5">
                    지금까지 잘 해왔으니 앞으로도 잘 할 수 있을거야.
                  </p>
                </div>
              </>
            ),
            ["걱정형"]: (
              <>
                <p className="flex items-center justify-start gap-1.5 text-camaColor font-oneMobile border-b pb-2">
                  <FcAbout className="text-f6" />
                  <span className="mt-0.5">"나도 재발하면 어떡하지…"</span>
                </p>

                <div className="text-justify font-oneMobile flex items-center justify-start gap-2">
                  <FcRight className="text-f6" />
                  <p className="text-camaColor1 mt-1.5">
                    재발될 수도 있지. 하지만 그렇지 않을 확률이 더 높아.
                  </p>
                </div>

                <p className="flex items-center justify-start gap-1.5 text-camaColor font-oneMobile border-b pb-2 mt-5">
                  <FcAbout className="text-f6" />
                  <span className="mt-0.5">"재발하면 죽는걸텐데…"</span>
                </p>

                <div className="text-justify font-oneMobile flex items-center justify-start gap-2">
                  <FcRight className="text-f6" />
                  <p className="text-camaColor1 mt-1.5">
                    설사 재발되더라도 다시 치료할 수 있어.
                  </p>
                </div>
              </>
            ),
          }[type]
        }
      </TextArea>

      <Footer onNext={onNext} onPrev={onPrev} />
    </>
  );
}
