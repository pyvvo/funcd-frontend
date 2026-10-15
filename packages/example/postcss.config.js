import { createRequire } from 'node:module';

// The breakpoints' single source, shared with the Mantine theme. CSS cannot
// read a variable in a media or container query, so they become
// $mantine-breakpoint-* variables here.
const breakpoints = createRequire(import.meta.url)(
  '@funcd-dev/ui/breakpoints.json'
);

export default {
  plugins: {
    // tailwindcss: {},
    // autoprefixer: {},
    'postcss-preset-mantine': {},
    'postcss-simple-vars': {
      variables: Object.fromEntries(
        Object.entries(breakpoints).map(([size, value]) => [
          `mantine-breakpoint-${size}`,
          value
        ])
      )
    }
  }
};
