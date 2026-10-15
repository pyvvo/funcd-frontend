/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** 'false' turns the MSW mocks off (set by vite.config.ts from API_URL) */
  readonly VITE_MOCK_API: string;
}
