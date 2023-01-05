import App from './App';
import AppRoutes from './AppRoutes';
import './index.css';
import { ThemeOptions, ThemeProvider, createTheme } from '@mui/material';
import { createMemoryHistory } from '@remix-run/router';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';

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

let history = createMemoryHistory({ initialEntries: ['/'] });

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={createTheme(lightTheme)}>
      <Router>
        <AppRoutes />
      </Router>
    </ThemeProvider>
  </React.StrictMode>
);
