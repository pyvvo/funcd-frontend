import {
  createTheme,
  CSSVariablesResolver,
  MantineThemeOverride,
  rem
} from '@mantine/core';

// export your theme object
const theme: MantineThemeOverride = createTheme({
  fontFamily: 'sans-serif',
  primaryColor: 'indigo',
  defaultRadius: 8,
  other: {
    headerOffset: rem(80)
  }
});

export const cssVarResolver: CSSVariablesResolver = (theme) => ({
  variables: {
    '--mantine-header-offset': theme.other.headerOffset
  },
  light: {},
  dark: {}
});

export default theme;
