import React from 'react';

import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { Box } from '@mui/material';

interface Prop {
  open: boolean;
}

function Expand(props: Prop) {
  const { open } = props;

  return <Box>{open ? <ExpandLess /> : <ExpandMore />}</Box>;
}

export default Expand;
