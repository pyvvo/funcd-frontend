---
paths:
  - 'packages/control-plane-ui/src/**/*'
  - 'packages/fleet/src/**/*'
---

# Apps (`control-plane-ui`, `fleet`)

- Both apps share one skeleton:
  - `main.tsx` imports the CSS: Mantine, notifications, spotlight, `@funcd-dev/ui/dist/ui.css`, then `./index.css`.
  - `App.tsx` renders `MantineProvider theme={{ ...pyTheme }} cssVariablesResolver={cssVarResolver}`, `Notifications`, `NiceModal.Provider` and the routes.
  - `app.routing.tsx` calls `useRoutes([...])` inside `BrowserRouter` and puts `AppLayout` on the root route.
- Each feature has its own folder, containing `<feature>.module.tsx`, `<feature>.routing.tsx` (`useRoutes` with `'/'` and `'/:id'`), a list page with a plural name (`workflows.tsx`), a detail page with a singular name, and `<feature>.store.ts`.
- MobX stores follow one shape:
  - A plain `_store` object whose arrow methods refer to `_store`, never `this`.
  - A factory that returns `makeAutoObservable(_store)`.
  - A default-exported singleton, and an exported `XStoreType = ReturnType<typeof factory>`.
  - Pages are wrapped with `observer()` and receive the store as a prop.
- In `control-plane-ui`, API calls use `sdk.*` from `@funcd-dev/lib`: `const { data, error } = await sdk.listWorkflows();`. On error, show `notifications.show({ title: error.type, message: error.message, color: 'yellow' })`. Notification colors: yellow for load errors, green for create, blue for update, red for delete and failures.
- The apps use relative imports, Mantine props and a global `index.css`. They have no CSS modules.
- Model: `packages/control-plane-ui/src/workflow/`.
- `fleet` has no backend. Its API is defined once in `src/api/contract.ts` (zod schemas and routes); pages and stores call it through `src/api/client.ts` (`api.listDevices({ query })`, which returns `{ data, error }`), and `src/mocks/handlers.ts` answers it with MSW from the in-memory `src/mocks/db.ts`. After changing the contract, run `yarn fleet gen:openapi` to regenerate `api/openapi.json`.
