import { defineConfig } from '@hey-api/openapi-ts';

// Generates the lib SDK. `yarn lib gen:sdk` runs it from this workspace, then
// formats the output with oxfmt.
export default defineConfig({
  input: '../lib/openapi.json',
  output: {
    format: false,
    path: '../lib/src/client'
  },
  plugins: [
    '@hey-api/client-axios',
    '@hey-api/schemas',
    {
      dates: true,
      name: '@hey-api/transformers'
    },
    {
      enums: 'javascript',
      name: '@hey-api/typescript'
    },
    {
      name: '@hey-api/sdk',
      transformer: true
    }
  ]
});
