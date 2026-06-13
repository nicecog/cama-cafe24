import { useNavigate } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
import { useMentalSection6CompleteMutation } from "../-component/-useMentalSection6CompleteMutation";
import MentalCareCard1 from "../-component/CareCards/Card1";
import MentalCareCard2 from "../-component/CareCards/Card2";
import MentalCareCard3 from "../-component/CareCards/Card3";
import MentalCareCard4 from "../-component/CareCards/Card4";
import MentalCareCard5 from "../-component/CareCards/Card5";
import MentalCareCard6 from "../-component/CareCards/Card6";
import MentalCareCard7 from "../-component/CareCards/Card7";
import MentalCareCard8 from "../-component/CareCards/Card8";
import TextBox from "../../component/Layout/TextBox";
import { careTypeAtom } from "./-session6Atoms";

export default function Step3() {
  const careType = useAtomValue(careTypeAtom);
  const navigate = useNavigate();
  const completeMutation = useMentalSection6CompleteMutation();
  const exerciseCompleteMutation = useMentalSection6CompleteMutation({
    onCompleted: async () => {
      await navigate({ to: "/coaching/exercise" });
    },
  });

  const onSave = async () => {
    await completeMutation.mutateAsync();
  };

  const onSaveToExercise = async () => {
    await exerciseCompleteMutation.mutateAsync();
  };

  if (careType === "수술 후 호흡 불편함") {
    return <MentalCareCard5 onSave={onSave} />;
  }

  if (careType === "피로감") {
    return <MentalCareCard1 onSave={onSave} />;
  }

  if (careType === "장루") {
    return <MentalCareCard2 onSave={onSave} />;
  }

  if (careType === "신체이미지") {
    return <MentalCareCard3 onSave={onSave} />;
  }

  if (careType === "신체기능 저하") {
    return <MentalCareCard6 onSave={onSaveToExercise} />;
  }

  if (careType === "성생활의 불편함") {
    return <MentalCareCard4 onSave={onSave} />;
  }

  if (careType === "우울감") {
    return <MentalCareCard8 onSave={onSave} />;
  }

  if (careType === "암 재발 불안") {
    return <MentalCareCard7 onSave={onSave} />;
  }

  return <TextBox className="text-center">Section6 Step3</TextBox>;
}
