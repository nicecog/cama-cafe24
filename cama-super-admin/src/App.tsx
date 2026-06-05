import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { Box } from '@mui/material';

import { adminAppRoutes } from 'routes/adminAppRoutes';

function App() {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL || '/admin'}>
      <Box sx={{ width: '100vw', minHeight: '100vh' }}>
        <Routes>{adminAppRoutes}</Routes>
      </Box>
    </BrowserRouter>
  );
}

export default App;
