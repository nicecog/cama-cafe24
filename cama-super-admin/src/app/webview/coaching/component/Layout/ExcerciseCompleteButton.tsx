import { useState } from "react";
import ExcerciseMission from "./ExcerciseMission";
import MissionChallengeButton from "./Buttons/MissionChallengeButton";
import useAlert from "@/hooks/useAlert";

export default function ExcerciseCompleteButton(props: any) {
  const { onSave, condition = true, type = "type1" } = props;

  const { alert } = useAlert();

  const [visible, setVisible] = useState(false);
  // const [isOk, setIsOk] = useState(false);

  const onClickHanlder = () => {
    if (!condition) {
      alert(type === "type1" ? "내용을 입력해 주세요" : "선택해 주세요");
      return;
    }

    setVisible(true);
  };

  return (
    <>
      <MissionChallengeButton onClick={onClickHanlder} />
      <ExcerciseMission
        visible={visible}
        okText="OK"
        type="excercise"
        onSave={onSave}
        onClose={() => setVisible(false)}
      />
    </>
  );
}
