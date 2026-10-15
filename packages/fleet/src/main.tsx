import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/spotlight/styles.css';
import '@funcd-dev/ui/dist/ui.css';
import './index.css';

// The mock API must answer before the first page asks for data. The mocks
// load only when they are on, so a build for a real API leaves them out.
const ready =
  import.meta.env.VITE_MOCK_API === 'false'
    ? Promise.resolve()
    : import('./mocks/browser').then(({ startMocking }) => startMocking());

ready.then(() => {
  ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );
});
