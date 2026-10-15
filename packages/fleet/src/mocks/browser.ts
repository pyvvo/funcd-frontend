import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

// The fleet has no backend: this Service Worker answers every /api request.
export const worker = setupWorker(...handlers);
