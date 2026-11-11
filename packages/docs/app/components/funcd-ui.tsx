import { lazy, type ComponentType, type ReactNode } from 'react';
import ClientOnly from './client-only';

// @funcd-dev/ui ships as one bundle, and its layouts touch `document` when it
// loads. Its components therefore load in the browser, after the page, and
// bring Mantine's styles with them.
const load = () => import('./funcd-ui.client');

// One component of the bundle, typed loosely: a page passes it any props.
const part = (
  name: 'Button' | 'Group' | 'ReactiveBarChart' | 'SimpleGrid' | 'StatCard'
) =>
  lazy(() => load().then((m) => ({ default: m[name] as ComponentType<any> })));

const Provider = lazy(() =>
  load().then((m) => ({ default: m.FuncdUiProvider }))
);

export const Button = part('Button');
export const Group = part('Group');
export const ReactiveBarChart = part('ReactiveBarChart');
export const SimpleGrid = part('SimpleGrid');
export const StatCard = part('StatCard');

// A block of funcd UI components inside a page.
export const FuncdUI = ({ children }: { children: ReactNode }) => (
  <ClientOnly>
    <Provider>{children}</Provider>
  </ClientOnly>
);
