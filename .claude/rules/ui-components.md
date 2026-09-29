---
paths:
  - 'packages/ui/src/**/*'
---

# Components and styling (`packages/ui`)

## Components

- Where things go: `src/atoms` (Mantine components styled through the theme, and logos), `src/molecules`, `src/layouts`, `src/template` (larger compositions), and feature modules (`src/hm-flow`, `src/reactive-form`).
- One kebab-case folder per component, with `<name>.tsx`, `<name>.module.css`, `<name>.stories.tsx`, `index.ts`, and `types.ts` (or `<name>.types.ts`) when types are shared. Sub-components sit next to the main file (`sidebar/navbar-button.tsx`).
- The folder's `index.ts` re-exports the default export by name: `export { default as Toolbar } from './toolbar';`, plus `export * from './types';` or `export type { IX } from './x';` when needed. Then add the folder to its level barrel (`src/molecules/index.ts`, `src/layouts/index.ts`, ...). `src/index.tsx` re-exports the levels.
- Shape of a component (from `molecules/flow-card/card.tsx`):

  ```tsx
  import { Card, CardProps } from '@mantine/core';
  import { FC, ReactNode } from 'react';
  import styles from './card.module.css';

  interface IFlowCard extends CardProps {
    flowName: string;
    leftIcon?: ReactNode;
    withRightSection?: boolean;
    onDelete?: (param: any) => void;
  }

  const FlowCard: FC<IFlowCard> = (props) => {
    const {
      flowName,
      leftIcon,
      withRightSection = true,
      onDelete,
      ...rest
    } = props;

    return (
      <Card padding={0} className={styles.root} {...rest}>
        ...
      </Card>
    );
  };

  export default FlowCard;
  ```

- Declare components as `const X: FC<IX> = (props) => { ... }` and default-export them at the end of the file. Generic components drop `FC`: `const HmTable = <TRow extends Record<string, any>>(props: IHmTable<TRow>) => {`.
- Declare the props interface in the component file, just above the component. When the component wraps a Mantine component, extend its props (`extends CardProps`).
- Destructure props on the first line of the body. Set defaults in the destructuring, never with `defaultProps`. Collect `...rest` and spread it last on the root element so callers can override.
- Inside a component, write props first, then hooks, then derived values and handlers, then `return (...)`.
- Memoize the way the surrounding code does. Simple components rarely memoize; hm-flow wraps handlers in `useCallback` and derived values in `useMemo`. Dependency arrays are complete.

## Mantine and styling

- Build with Mantine components (`Box`, `Group`, `Stack`, `Paper`, `Card`, inputs) and use Mantine style props for spacing (`p={4}`, `mt="md"`, `gap="xs"`). Use `component="header"` and similar for semantic tags.
- Style with a CSS module imported as `styles` and applied with `className={styles.x}`. Class names are camelCase, and the outer element uses `.root`. Style inner Mantine parts with `classNames={{ part: styles.x }}`.
- CSS modules use postcss-preset-mantine: `&` nesting, `@mixin dark`, `@mixin light`, `@mixin larger-than $mantine-breakpoint-sm`, `alpha()`, `lighten()` and `light-dark()`. Take colors from theme variables such as `var(--mantine-color-primary-9)` and `var(--mantine-primary-color-1)`.
- The theme (`src/mantine.theme.ts`) defines the palettes `primary`, `secondary`, `info`, `warning`, `alert` and `stone-cold`, with `primaryShade: 9`. Layout sizes live in `theme.other` and are exposed as CSS variables (`--mantine-header-offset`, `--mantine-sidebar-width`).
- Button, ActionIcon and Tabs are restyled for the whole library with `X.extend({ classNames, defaultProps })` in `mantine.theme.ts`. Pick their color with `mod={{ color: 'alert' }}`; the CSS matches it as `&[data-variant='filled'] ... &[data-color='alert']`. Restyle any other Mantine component the same way.
- Expose state as data attributes with `mod={{ active: isActive }}`, and style it with `&[data-active]`.
- Do not use Tailwind classes in component code. Tailwind is loaded only in Storybook (`src/theme.css`), and only some stories use it.
- Icons: named imports from `@tabler/icons-react` (`IconPencil`), usually with `size={18}`. Dates: `dayjs`.

## Unused or legacy parts

Check with the user before building on these:

- `src/theme` (`HMThemeProvider`) provides an empty context that nothing reads.
- `src/auth` is not exported from `src/index.tsx`.
- The `response()` and `errorResponse()` helpers in `src/utils` have no callers.
