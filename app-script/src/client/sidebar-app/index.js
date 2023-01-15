import React from 'react';
import { createRoot } from 'react-dom/client';
import ReactDOM from 'react-dom';
import App from './App';

import './index.style.css'

// ReactDOM.render(<App />, document.getElementById('index'));
const container = document.getElementById('index');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(<App/>);