import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

// Import core styles
import './styles/app.css';
import './styles/fonts.css';
import './styles/print.css';

import { ToastProvider } from './components/ui/ToastContext.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ToastProvider>
      <App />
    </ToastProvider>
  </React.StrictMode>,
);
