import React, { PropsWithChildren } from 'react';

import { TableBody, TableCell, TableRow } from '@mui/material';

interface Props {
  data: any[];
  noDataText?: string;
  colSpan?: number;
}

function EmptyCheckTableBody({ data, colSpan, noDataText = 'No Data', children }: PropsWithChildren<Props>) {
  return (
    <TableBody>
      {!data.length ? (
        <TableRow>
          <TableCell align="center" colSpan={colSpan}>
            {noDataText}
          </TableCell>
        </TableRow>
      ) : (
        children
      )}
    </TableBody>
  );
}

export default EmptyCheckTableBody;
