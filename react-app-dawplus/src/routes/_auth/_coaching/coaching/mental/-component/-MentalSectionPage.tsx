import { useAtomValue } from "jotai";
import { accountMeAtom } from "@/atoms/accountAtoms";
import { useUserAnswerInfoList } from "@/hooks/queries";
import { MentalCard1, MentalCard2, MentalCard3, MentalCard4 } from "./Cards";
import type { MentalCardAnswer } from "./Cards";
import { getMentalSectionConfig, getMentalType } from "./-mentalSectionConfig";
import { useMentalSectionSaveMutation } from "./-useMentalSectionSaveMutation";

export function MentalSectionPage({
  session,
}: {
  session: 2 | 3 | 4 | 5;
}) {
  const accountMe = useAtomValue(accountMeAtom);
  const loginId = accountMe.data?.loginId ?? "";
  const saveMutation = useMentalSectionSaveMutation();
  const { data: answerList = [], isLoading } = useUserAnswerInfoList({
    categoryCd: "D",
    loginId,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  const type = getMentalType(answerList);

  if (!type) {
    return null;
  }

  const config = getMentalSectionConfig(session, type);

  const handleSave = async (answers: MentalCardAnswer[]) => {
    await saveMutation.mutateAsync({
      answers,
      session,
      type,
    });
  };

  if (config.card === "Card1") {
    return <MentalCard1 type={type} title={config.title} onSave={handleSave} />;
  }

  if (config.card === "Card2") {
    return <MentalCard2 type={type} title={config.title} onSave={handleSave} />;
  }

  if (config.card === "Card3") {
    return <MentalCard3 type={type} title={config.title} onSave={handleSave} />;
  }

  return <MentalCard4 type={type} title={config.title} onSave={handleSave} />;
}
