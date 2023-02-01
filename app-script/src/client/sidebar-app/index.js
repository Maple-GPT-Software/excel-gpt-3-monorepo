import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

import './index.style.css'
 
const container = document.getElementById('index');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(<App/>);