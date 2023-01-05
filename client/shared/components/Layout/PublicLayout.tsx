import { AppBar, Typography } from '@mui/material';
import React from 'react';

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppBar
      sx={{
        height: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#388E3C',
      }}
    >
      <Typography style={{ fontWeight: 'bold' }}>ExcelSimplify</Typography>
      <div
        style={{ paddingTop: '60px', height: '100vh' }}
        className="main-content"
      >
        {children}
      </div>
    </AppBar>
  );
}

export default PublicLayout;
