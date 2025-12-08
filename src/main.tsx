import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './store'
import App from './App'
import './index.css'
import { logger } from './utils/logger'

// Global error handler for uncaught exceptions
window.onerror = (message, source, lineno, colno, error) => {
  logger.error('GlobalError', String(message), {
    source,
    lineno,
    colno,
    stack: error?.stack,
  });
  // Return false to allow default browser error handling
  return false;
};

// Global handler for unhandled Promise rejections
window.onunhandledrejection = (event: PromiseRejectionEvent) => {
  const reason = event.reason;
  logger.error('UnhandledRejection', reason?.message || String(reason), {
    stack: reason?.stack,
    reason,
  });
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
)
