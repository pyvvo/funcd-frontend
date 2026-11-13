import {
  TabsContent,
  TabsList,
  TabsTrigger
} from 'fumadocs-ui/components/tabs';
import { Tabs } from 'fumadocs-ui/components/ui/tabs';
import {
  type ComponentProps,
  type ReactNode,
  useSyncExternalStore
} from 'react';

// The language every TypeScript and Python tab group shows: one choice for the
// whole site, kept across pages and carried in the link (?lang=python), as
// wasmCloud's docs do. The link wins over the stored choice.
const key = 'lang';
const listeners = new Set<() => void>();

const read = (): string | null => {
  const linked = new URLSearchParams(window.location.search).get(key);
  if (linked) return linked.toLowerCase();
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const choose = (language: string) => {
  try {
    localStorage.setItem(key, language);
  } catch {
    // A browser that refuses storage keeps the choice in the link only.
  }
  const url = new URL(window.location.href);
  url.searchParams.set(key, language);
  window.history.replaceState(window.history.state, '', url);
  for (const listener of listeners) listener();
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

// LangTabs is one group of language tabs, with Fumadocs' look; rehype-lang-tabs
// writes it for each run of TypeScript and Python sections.
export function LangTabs({
  items,
  children
}: {
  items: string[];
  children: ReactNode;
}) {
  const chosen = useSyncExternalStore(subscribe, read, () => null);
  const values = items.map((item) => item.toLowerCase());
  const value = chosen && values.includes(chosen) ? chosen : values[0];
  return (
    <Tabs
      value={value}
      onValueChange={choose}
      className="my-4 flex flex-col overflow-hidden rounded-xl border bg-fd-secondary">
      <TabsList>
        {items.map((item, i) => (
          <TabsTrigger key={item} value={values[i]}>
            {item}
          </TabsTrigger>
        ))}
      </TabsList>
      {children}
    </Tabs>
  );
}

export function LangTab({
  value,
  ...props
}: ComponentProps<typeof TabsContent>) {
  return <TabsContent value={value.toLowerCase()} {...props} />;
}
