import { ReactNode, useState } from "react";
import NextButton from "./NextButton";
import MessageModal from "./MessageModal";
import useAlert from "@/hooks/useAlert";

type MessageButtonType = {
  onNext: () => void;
  onPrev?: () => void;
  title?: string;
  alertMessage?: string;
  condition?: boolean;
  children: ReactNode;
};

export default function MessageButton(props: MessageButtonType) {
  const {
    onNext,
    onPrev,
    title,
    condition = false,
    alertMessage = "답변을 선택해 주세요.",
  } = props;

  const [visible, setVisible] = useState(false);

  const { alert } = useAlert();

  const onNextHandler = () => {
    if (condition) {
      alert(alertMessage);
      return;
    }

    setVisible(true);
  };

  return (
    <>
      <NextButton onNext={onNextHandler} onPrev={onPrev} />

      <MessageModal
        visible={visible}
        onClose={() => {
          setVisible(false);
        }}
        type="excercise"
        onOk={onNext}
        title={title}
      >
        <div className="text-center">{props.children}</div>
      </MessageModal>
    </>
  );
}
