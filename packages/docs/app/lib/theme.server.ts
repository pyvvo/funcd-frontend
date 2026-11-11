import pyTheme from '@funcd-dev/ui/theme';
import { DEFAULT_THEME, mergeMantineTheme } from '@mantine/core';

// The funcd UI palettes as CSS variables (--funcd-gray-4, --funcd-dark-7, …).
// Pages are pre-rendered, so this runs at build time and the browser loads no
// Mantine; app.css maps Fumadocs' colors onto these variables.
export const themeCss = () => {
  const { colors } = mergeMantineTheme(DEFAULT_THEME, pyTheme);
  const palettes = {
    primary: colors.primary,
    gray: colors.gray,
    dark: colors.dark
  };
  const variables = Object.entries(palettes).flatMap(([name, shades]) =>
    shades.map((value, shade) => `--funcd-${name}-${shade}:${value};`)
  );
  return `:root{${variables.join('')}}`;
};
