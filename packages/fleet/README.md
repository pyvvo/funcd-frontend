# @funcd-dev/fleet

A demo console for an IoT fleet: sites, devices, readings, alerts and automations. It shows what `@funcd-dev/ui` builds.

## The API

The app calls `/api` on its own origin. The API is defined once in `src/api/contract.ts` (zod schemas and routes); `src/api/client.ts` calls it, and `yarn fleet gen:openapi` writes `api/openapi.json` from it.

## With the mocks (the default)

```bash
yarn dev:fleet
```

MSW answers every `/api` request in the browser (`src/mocks`), from an in-memory database that resets on reload.

## With a real API

Set `API_URL` when starting the dev server; it forwards `/api` there and leaves the mocks off:

```bash
API_URL=http://localhost:8080 yarn dev:fleet
```

The API must serve the routes of the contract under `/api`.

In production, build without the mocks and let the server in front of the app forward `/api` to the API, so the same build runs in every environment:

```bash
VITE_MOCK_API=false yarn fleet build
```

| Variable        | Read              | Effect                                                                                  |
| --------------- | ----------------- | --------------------------------------------------------------------------------------- |
| `API_URL`       | by the dev server | forwards `/api` to this URL and turns the mocks off                                     |
| `VITE_MOCK_API` | at build time     | `false` leaves the mocks out of the app; by default they are on unless `API_URL` is set |
