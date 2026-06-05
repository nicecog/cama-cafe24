import { useState } from 'react';

import { useRecoilState } from 'recoil';

import { ApiResponsePagination } from 'apis/ApiClient';
import { paginationAtom } from 'atoms';
import { Route } from 'interfaces/menu';

function usePagination(route: Route) {
  const [pagination, setPagination] = useRecoilState(paginationAtom);
  const [currentPage, setCurrentPage] = useState(pagination[route]?.currentPage ?? 1);

  const totalCount = pagination[route]?.totalCount;

  const handlePaginationChange = (newPagination: ApiResponsePagination) => {
    setPagination({
      [route]: newPagination,
    });
  };

  return { currentPage, setCurrentPage, totalCount, handlePaginationChange };
}

export default usePagination;
