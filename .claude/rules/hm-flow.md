---
paths:
  - 'packages/ui/src/hm-flow/**/*'
---

# Flow editor (`packages/ui/src/hm-flow`)

- `HmFlow` is the composition root: it holds the config arrays and calls the service hooks. `HmFlowBase` owns the state and gathers it into one memoized `deps` object. It provides `deps` through context (`useHmFlowChildrenDeps()`) and passes it to every handler.
- Actions are config objects `{ type, icon, onClick, ... }` in module-level arrays (`defaultActions`, `bottomActions`, `headerActions`). A service hook replaces `onClick` by looking up `type` in a `Record<ActionType, HandlerType>`. Handlers take one params object (`{ node, deps }`).
- Hooks are written as `export const useX = (params: IUseX) => { const { ... } = params; ... return { ... }; }` and always return an object. Context hooks are default exports.
- Types live in `<name>.types.ts` files next to the code.
- Models: `hooks/use-nodes-service.tsx`, `hm-flow.tsx` and `components/toolbar/`.
