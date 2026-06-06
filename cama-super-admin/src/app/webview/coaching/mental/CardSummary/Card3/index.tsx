import { useAtomValue, useSetAtom } from "jotai";

import { useEffect } from "react";
import Step1 from "./Step1";
import Step2 from "./Step2";

import { initAtom, stepAtom } from "./Card3Atom";
import { CardSummaryType } from "../Types/CardSummaryType";
import useAlert from "@/hooks/useAlert";

//  복식호흡
export default function Card3Summary(props: CardSummaryType) {
  const step = useAtomValue(stepAtom);

  const init = useSetAtom(initAtom);
  const { confirm } = useAlert();

  // 완료 버튼
  const onCompleteHandler = () => {
    confirm({ html: `명상을 이해하는 데 <br/>도움이 되셨나요?` }, () => {
      props.onComplete();
    });
  };

  useEffect(() => {
    return () => {
      init();
    };
  }, []);

  return (
    <>
      <div>
        {
          {
            1: <Step1 onComplete={onCompleteHandler} />,
            2: <Step2 onComplete={onCompleteHandler} />,
          }[step]
        }
      </div>
    </>
  );
}
