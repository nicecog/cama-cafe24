import { useEffect, useRef, useState, useLayoutEffect } from "react";

type UseFetchOptions = {
  url: string;
  option: {};
  onSuccess?: ((state: any) => void) | null | undefined;
};

const useCallbackRef = <T extends Function | null | undefined>(callback: T) => {
  const callbackRef = useRef<T>();
  useLayoutEffect(() => {
    callbackRef.current = callback;
  }, [callback]);
  return callbackRef;
};

export const useFetch = (options: UseFetchOptions) => {
  const [data, setData] = useState<any | null>(null);

  const savedOnSuccess = useCallbackRef(options.onSuccess);

  useEffect(() => {
    if (options.url) {
      fetch(options.url, options.option)
        .then((r) => r.json())
        .then((json) => {
          if (savedOnSuccess.current) {
            savedOnSuccess.current(json);
          }
          setData(json);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  }, [options.url, savedOnSuccess, options.option]);

  return { data };
};
