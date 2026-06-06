import { useState, useCallback } from "react";

type UseStepsReturn = {
  progress: number;
  onNext: () => void;
  onPrev: () => void;
  resetProgress: () => void;
  setProgressValue: (value: number) => void;
};

const useSteps = (
  minProgress: number,
  maxProgress: number,
  onProgressChange?: (progress: number) => void
): UseStepsReturn => {
  const [progress, setProgress] = useState<number>(minProgress);

  const handleChange = (newProgress: number) => {
    setProgress(newProgress);
    if (onProgressChange) {
      onProgressChange(newProgress);
    }
  };

  const onNext = useCallback(() => {
    setProgress((prevProgress) => {
      const newProgress =
        prevProgress + 1 <= maxProgress ? prevProgress + 1 : prevProgress;
      handleChange(newProgress);
      return newProgress;
    });
  }, [maxProgress]);

  const onPrev = useCallback(() => {
    setProgress((prevProgress) => {
      const newProgress =
        prevProgress - 1 >= minProgress ? prevProgress - 1 : prevProgress;
      handleChange(newProgress);
      return newProgress;
    });
  }, [minProgress]);

  const resetProgress = useCallback(() => {
    handleChange(minProgress);
  }, [minProgress]);

  const setProgressValue = useCallback(
    (value: number) => {
      if (value >= minProgress && value <= maxProgress) {
        handleChange(value);
      }
    },
    [minProgress, maxProgress]
  );

  return { progress, onNext, onPrev, resetProgress, setProgressValue };
};

export default useSteps;
