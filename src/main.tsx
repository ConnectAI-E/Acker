import React from 'react';
import ReactDOM from 'react-dom/client';
import { SWRConfig } from 'swr';
import { BrowserRouter as Router } from 'react-router-dom';
import logger from '@/middleware/logger';
import App from './app';
import './locale/i18n';
import './index.css';

ReactDOM.createRoot(document.getElementById('app') as HTMLElement).render(
  <React.StrictMode>
    <Router basename="/">
      <SWRConfig 
        value={{
          revalidateOnFocus: false,
          revalidateIfStale: true,
          errorRetryCount: 5,
          errorRetryInterval: 1000,
          use: [logger]
        }}
      >
        <App />
      </SWRConfig>
    </Router>
  </React.StrictMode>
);
