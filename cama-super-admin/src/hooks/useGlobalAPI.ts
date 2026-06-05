import { useEffect } from 'react';

import { useIsFetching, useIsMutating, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

function useGlobalAPI() {
  const queryClient = useQueryClient();
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();

  useEffect(() => {
    queryClient.setDefaultOptions({
      ...queryClient.getDefaultOptions(),
      queries: {
        onError: (err) => {
          if (axios.isAxiosError(err)) {
            window.alert(err.message);
            window.history.back();
          }
        },
      },
    });
  }, [queryClient]);

  return {
    isLoading: isFetching > 0 || isMutating > 0,
  };
}

export default useGlobalAPI;
