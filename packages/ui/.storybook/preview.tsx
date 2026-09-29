import '@mantine/core/styles.css';
import '@mantine/spotlight/styles.css';
import '@xyflow/react/dist/style.css';
// import '@xyflow/react/dist/base.css';
// import 'react-data-grid/lib/styles.css';
import { MantineProvider } from '@mantine/core';
import { StoryFn } from '@storybook/react';
import React, { FC } from 'react';
import theme, { cssVarResolver } from '../src/mantine.theme';
import { HMThemeProvider } from '../src/theme';
import '../src/theme.css';

// import Keycloak from 'keycloak-js';
const customViewports = {
  xs: {
    name: 'xs',
    styles: {
      width: '576px',
      height: '800px'
    }
  },
  sm: {
    name: 'sm',
    styles: {
      width: '768px',
      height: '801px'
    }
  },
  md: {
    name: 'md',
    styles: {
      width: '992px',
      height: '801px'
    }
  },
  lg: {
    name: 'lg',
    styles: {
      width: '1200px',
      height: '801px'
    }
  },
  xl: {
    name: 'xl',
    styles: {
      width: '1400px',
      height: '801px'
    }
  }
};

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/
    }
  },
  viewport: { options: customViewports }
};

const ThemeWrapper: FC<{ children: React.ReactNode }> = (props) => {
  return (
    <MantineProvider theme={{ ...theme }} cssVariablesResolver={cssVarResolver}>
      {props.children}
    </MantineProvider>
  );
};

const HmTheme: any = {};

const HMThemeWrapper: FC<{ children: React.ReactNode }> = (props) => {
  return <HMThemeProvider theme={HmTheme}>{props.children}</HMThemeProvider>;
};

const PyvvoDecorator = (Story: StoryFn) => (
  <HMThemeWrapper>
    <Story />
  </HMThemeWrapper>
);

const MantineDecorator = (Story: StoryFn) => (
  <ThemeWrapper>
    <Story />
  </ThemeWrapper>
);

export const decorators = [MantineDecorator, PyvvoDecorator];
