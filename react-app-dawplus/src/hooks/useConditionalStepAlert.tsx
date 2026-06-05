import { useEffect, useMemo, useRef } from "react";
import HeadType5 from "@/assets/images/character/head/type5.png";
import { useDialog } from "@/hooks/useDialog";

interface ConditionalStepAlertOption {
  when: boolean;
  title: string;
  body: string;
}

export function useConditionalStepAlert(options: ConditionalStepAlertOption[]) {
  const { alert } = useDialog();
  const didShowAlertRef = useRef(false);

  const matchedOption = useMemo(
    () => options.find((option) => option.when),
    [options],
  );

  useEffect(() => {
    if (didShowAlertRef.current || !matchedOption) return;
    didShowAlertRef.current = true;

    void alert({
      title: matchedOption.title,
      body: matchedOption.body,
      icon: (
        <img
          src={HeadType5}
          alt=""
          aria-hidden="true"
          className="h-16 w-16 rounded-full object-contain drop-shadow-[0_10px_18px_rgba(15,23,42,0.18)]"
        />
      ),
      iconFrame: false,
    });
  }, [alert, matchedOption]);
}
