import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

// The fleet has no backend: this Service Worker answers every /api request.
export const worker = setupWorker(...handlers);

// The browser stops an idle Service Worker, and the worker then forgets the
// pages it mocks for, so it lets /api through to the dev server (which
// answers with index.html). Telling it again that this page is active is
// harmless, so the page does it when it comes back and while it is visible.
const reactivate = () => {
  if (document.visibilityState === 'visible') {
    navigator.serviceWorker?.controller?.postMessage('MOCK_ACTIVATE');
  }
};

export const startMocking = async () => {
  await worker.start({ quiet: true });
  document.addEventListener('visibilitychange', reactivate);
  window.setInterval(reactivate, 5000);
};
