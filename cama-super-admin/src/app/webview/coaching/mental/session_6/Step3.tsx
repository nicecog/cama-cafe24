import { useParams } from "react-router-dom";
import Card1 from "../CareCards/Card1";
import Card2 from "../CareCards/Card2";
import Card3 from "../CareCards/Card3";
import Card4 from "../CareCards/Card4";
import Card5 from "../CareCards/Card5";
import Card6 from "../CareCards/Card6";
import Card7 from "../CareCards/Card7";
import Card8 from "../CareCards/Card8";

import useSaveMental from "../useMental";
import { useAtomValue } from "jotai";
import { careTypeAtom } from "./session6Atom";

export default function Step3() {
  const careType = useAtomValue(careTypeAtom);

  // const onSave = () => {
  //   alert("완료");
  // };

  const { loginId } = useParams();

  const { saveComplete } = useSaveMental(loginId);

  return (
    <>
      {
        {
          ["피로감"]: <Card1 onSave={saveComplete} />,
          ["장루"]: <Card2 onSave={saveComplete} />,
          ["신체이미지"]: <Card3 onSave={saveComplete} />,
          ["성생활의 불편함"]: <Card4 onSave={saveComplete} />,
          ["수술 후 호흡 불편함"]: <Card5 onSave={saveComplete} />,
          ["신체기능 저하"]: <Card6 onSave={saveComplete} />,
          ["암 재발 불안"]: <Card7 onSave={saveComplete} />,
          ["우울감"]: <Card8 onSave={saveComplete} />,
        }[careType]
      }
    </>
  );
}
