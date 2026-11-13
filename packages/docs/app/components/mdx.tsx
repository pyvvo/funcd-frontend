import { File, Files, Folder } from 'fumadocs-ui/components/files';
import { Step, Steps } from 'fumadocs-ui/components/steps';
import { Tab, Tabs } from 'fumadocs-ui/components/tabs';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import type { ComponentProps } from 'react';
import {
  Button,
  FuncdUI,
  Group,
  ReactiveBarChart,
  SimpleGrid,
  StatCard
} from './funcd-ui';
import { LangTab, LangTabs } from './lang-tabs';
import { PlatformDiagram } from './platform-diagram/platform-diagram';
import { pageHref } from '../lib/page-href';

// The components a page may use without importing them: Fumadocs' first, the
// site's diagrams, then the funcd UI ones, which render inside a <FuncdUI>
// block.
export const getMDXComponents = (components?: MDXComponents): MDXComponents =>
  ({
    ...defaultMdxComponents,
    File,
    Files,
    Folder,
    Step,
    Steps,
    Tab,
    Tabs,
    LangTab,
    LangTabs,
    PlatformDiagram,
    Button,
    FuncdUI,
    Group,
    ReactiveBarChart,
    SimpleGrid,
    StatCard,
    ...components
  }) satisfies MDXComponents;

export const useMDXComponents = getMDXComponents;

// The page's links, resolved against its file path, the same on the server
// and in the browser.
export const pageLink = (pagePath: string) => {
  const Link = defaultMdxComponents.a;
  return ({ href, ...props }: ComponentProps<'a'>) => (
    <Link href={href && pageHref(href, pagePath)} {...props} />
  );
};
