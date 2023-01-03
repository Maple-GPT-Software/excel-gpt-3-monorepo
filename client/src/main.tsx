import App from './App';
import AppRoutes from './AppRoutes';
import './index.css';
import { ThemeOptions, ThemeProvider, createTheme } from '@mui/material';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

const lightTheme: ThemeOptions = {
  palette: {
    primary: {
      light: '#66BB6A',
      main: '#388E3C',
      dark: '#1B5E20',
    },
    secondary: {
      main: '#373F47',
    },
    mode: 'light',
  },
};

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={createTheme(lightTheme)}>
      <BrowserRouter basename="/app">
        <AppRoutes />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
