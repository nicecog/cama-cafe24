import { useNavigate } from "@tanstack/react-router";
import {
  type SaveCoachingAnswerInput,
  useSaveCoachingAnswerList,
} from "@/hooks/mutations";
import { useToast } from "@/hooks/use-toast";
import { useDialog } from "@/hooks/useDialog";

interface UseSaveCoachingAndNavigateParams {
  redirectTo: string;
  successMessage: string;
  errorMessage: string;
}

export function useSaveCoachingAndNavigate({
  redirectTo,
  successMessage,
  errorMessage,
}: UseSaveCoachingAndNavigateParams) {
  const navigate = useNavigate();
  const { alert } = useDialog();
  const { toast } = useToast();
  const { mutateAsync: saveCoachingAnswer } = useSaveCoachingAnswerList();

  const saveAndNavigate = async (payload: SaveCoachingAnswerInput[]) => {
    try {
      await saveCoachingAnswer(payload);
      await alert(successMessage);
      await navigate({
        to: redirectTo,
        replace: true,
      });
    } catch {
      toast({
        variant: "destructive",
        description: errorMessage,
      });
      return false;
    }

    return true;
  };

  return {
    saveAndNavigate,
  };
}
