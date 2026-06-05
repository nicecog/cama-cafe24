import { useNavigate } from "@tanstack/react-router";
import {
  PatientWebViewToolbarHeader,
  type PatientWebViewToolbarHeaderProps,
} from "@/components/webview/PatientWebViewToolbarHeader";

interface CoachingLayoutHeaderProps
  extends Omit<
    PatientWebViewToolbarHeaderProps,
    "title" | "homeConfirmMessage" | "backConfirmMessage"
  > {
  onBackClick?: () => void;
  className?: string;
  hubMode?: boolean;
}

export function CoachingLayoutHeader({
  onBackClick,
  className,
  hubMode = false,
}: CoachingLayoutHeaderProps) {
  const navigate = useNavigate();

  const handleBackDefault = () => {
    navigate({ to: "/coaching" });
  };

  const resolvedBack = onBackClick ?? handleBackDefault;

  return (
    <PatientWebViewToolbarHeader
      title="건강코칭"
      hubMode={hubMode}
      className={className}
      onBackClick={resolvedBack}
      homeConfirmMessage={"건강코칭을 중단하고\n홈으로 가시겠습니까?"}
      backConfirmMessage={
        onBackClick ? undefined : "건강코칭 메인으로\n이동하시겠습니까?"
      }
    />
  );
}
