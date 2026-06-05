import React, { PropsWithChildren } from 'react';

import { TablePagination } from '@mui/material';

import * as S from './styled';

interface Props {
  totalCount: number;
  currentPage: number;
  onPageChange?: (page: number) => void;
}

function WithPagination({ totalCount, currentPage, onPageChange, children }: PropsWithChildren<Props>) {
  const handlePageChange = (e: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, page: number) => {
    onPageChange?.(page + 1);
  };

  return (
    <S.Container>
      <S.Content>{children}</S.Content>

      <S.PaginationArea>
        <TablePagination
          component="div"
          count={totalCount}
          page={currentPage - 1}
          rowsPerPage={10}
          rowsPerPageOptions={[10]}
          onPageChange={handlePageChange}
        />
      </S.PaginationArea>
    </S.Container>
  );
}

export default WithPagination;
