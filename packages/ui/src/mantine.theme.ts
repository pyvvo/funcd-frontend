import {
  ActionIcon,
  Button,
  createTheme,
  CSSVariablesResolver,
  MantineColorsTuple,
  MantineThemeOverride,
  rem,
  Tabs
} from '@mantine/core';
import CustomActionIcon from '../../ui/src/atoms/action-icon/action-icon.module.css';
import CustomTabs from '../../ui/src/molecules/navigation/tabs/tabs.module.css';
import CustomButton from './atoms/button/Button.module.css';
import breakpoints from './breakpoints.json';

export type PyColorsType =
  | 'primary'
  | 'secondary'
  | 'info'
  | 'warning'
  | 'alert'
  | 'stone-cold';

export type PyVariantType = 'elevated' | 'filled' | 'secondary' | 'subtle';

// The primary color's shades; the dark palette below is derived from them.
const primaryPalette: MantineColorsTuple = [
  '#eeeffe',
  '#dee0fd',
  '#ced0fc',
  '#bec0fa',
  '#afb0f8',
  '#a1a0f5',
  '#9290f2',
  '#8580ef',
  '#786eeb',
  '#6c5ce7',
  '#5d4fc9',
  '#4e42ab',
  '#40368f',
  '#322a73',
  '#251f59',
  '#191440',
  '#0d0a28',
  '#040313',
  '#000003'
];

// Mixes `weight` (0 to 1) of `tint` into `base`; both are #rrggbb colors.
const mixColors = (base: string, tint: string, weight: number) => {
  const channels = (hex: string) =>
    [1, 3, 5].map((index) => parseInt(hex.slice(index, index + 2), 16));
  const [b, t] = [channels(base), channels(tint)];
  return `#${b
    .map((value, index) =>
      Math.round(value + (t[index] - value) * weight)
        .toString(16)
        .padStart(2, '0')
    )
    .join('')}`;
};

// Mantine draws its whole dark mode from `dark` (text on 0 to 2, borders on
// 4, inputs and hovers on 5 and 6, surfaces on 7, the page on 8). Each shade
// is a neutral base tinted with the primary color, so the dark mode follows
// the theme's color; the text shades take almost none, to stay readable.
const darkPalette = (
  [
    ['#c9c9c9', 0.03],
    ['#b8b8b8', 0.03],
    ['#8c8c8c', 0.04],
    ['#5c5c5c', 0.08],
    ['#363636', 0.12],
    ['#2b2b2b', 0.12],
    ['#222222', 0.1],
    ['#181818', 0.08],
    ['#101010', 0.08],
    ['#0a0a0a', 0.07]
  ] as const
).map(([base, weight]) =>
  mixColors(base, primaryPalette[9], weight)
) as unknown as MantineColorsTuple;

// Light mode's neutrals (borders, hovers, light backgrounds, dimmed text) come
// from `gray`; they get the same primary tint as `dark`, a little stronger on
// the dark shades so the dimmed text stays a tinted grey.
const grayPalette = (
  [
    ['#f8f8f8', 0.03],
    ['#f1f1f1', 0.04],
    ['#e9e9e9', 0.05],
    ['#dedede', 0.06],
    ['#cecece', 0.07],
    ['#adadad', 0.08],
    ['#868686', 0.1],
    ['#494949', 0.12],
    ['#343434', 0.12],
    ['#212121', 0.12]
  ] as const
).map(([base, weight]) =>
  mixColors(base, primaryPalette[9], weight)
) as unknown as MantineColorsTuple;

const theme: MantineThemeOverride = createTheme({
  fontFamily: 'Roboto, sans-serif',
  colors: {
    primary: primaryPalette,
    secondary: [
      '#ffedeb',
      '#ffdad7',
      '#ffc7c3',
      '#ffb4af',
      '#ffa19b',
      '#ff8c87',
      '#ff7674',
      '#ff5e60',
      '#ff404b',
      '#ff0034',
      '#de002c',
      '#be0024',
      '#9e001c',
      '#800015',
      '#63000e',
      '#480007',
      '#2e0003',
      '#160001',
      '#160001'
    ],
    info: [
      '#e9f2ff',
      '#d2e5ff',
      '#bcd7fe',
      '#a6cafd',
      '#90bcfc',
      '#7aaefa',
      '#63a0f8',
      '#4c92f5',
      '#3183f2',
      '#0873ef',
      '#0663d0',
      '#0454b1',
      '#0454b1',
      '#034594',
      '#023678',
      '#01285c',
      '#011b42',
      '#000f2a',
      '#000103'
    ],
    warning: [
      '#fffaee',
      '#fff6dc',
      '#fff1ca',
      '#ffecb7',
      '#ffe7a4',
      '#ffe290',
      '#ffdd7a',
      '#ffd762',
      '#ffd243',
      '#ffcc00',
      '#be9700',
      '#9e7e00',
      '#9e7e00',
      '#634e00',
      '#483700',
      '#2e2200',
      '#160f00',
      '#030200'
    ],
    alert: [
      '#ffede9',
      '#ffdad3',
      '#ffc8bd',
      '#ffb5a7',
      '#ffa191',
      '#ff8d7b',
      '#ff7765',
      '#ff5e4d',
      '#ff4031',
      '#ff0000',
      '#de0000',
      '#be0000',
      '#9e0000',
      '#800000',
      '#630000',
      '#480000',
      '#2e0000',
      '#160000',
      '#030000'
    ],
    'stone-cold': [
      '#ececec',
      '#dadada',
      '#c8c8c8',
      '#b7b7b7',
      '#a5a5a5',
      '#949494',
      '#848484',
      '#737373',
      '#636363',
      '#545454',
      '#484848',
      '#3c3c3c',
      '#313131',
      '#262626',
      '#1b1b1b',
      '#111111',
      '#080808',
      '#020202',
      '#000000'
    ],
    dark: darkPalette,
    gray: grayPalette
  },
  breakpoints,
  primaryColor: 'primary',
  primaryShade: 9,
  // The one radius scale: controls use it by name, and each surface role
  // below picks a step, so changing a step rounds everything that uses it.
  radius: {
    xs: rem(2),
    sm: rem(4),
    md: rem(8),
    lg: rem(12),
    xl: rem(20)
  },
  defaultRadius: 'md',
  other: {
    headerOffset: rem(40),
    sideBarWidth: rem(60),
    // Corner radius by role, as a step of the radius scale.
    // Bars: the header, the sidebar and the bottom bar.
    barBorderRadius: 'xl',
    // Cards: stat, chart and flow cards, drawers and the flow canvas panels.
    cardBorderRadius: 'xl',
    // Grids: data grids, tables and their rows.
    gridBorderRadius: 'lg'
  },
  components: {
    Button: Button.extend({
      classNames: CustomButton,
      defaultProps: {
        variant: 'filled',
        mod: { color: 'primary' },
        radius: 'lg'
      }
    }),
    ActionIcon: ActionIcon.extend({
      classNames: CustomActionIcon,
      defaultProps: {
        variant: 'filled',
        mod: { color: 'primary' },
        radius: 'xl'
      }
    }),
    Tabs: Tabs.extend({
      classNames: CustomTabs,
      defaultProps: {
        variant: 'pills'
      }
    })
  }
});

export const cssVarResolver: CSSVariablesResolver = (theme) => ({
  variables: {
    '--mantine-header-offset': theme.other.headerOffset,
    '--mantine-bar-border-radius': `var(--mantine-radius-${theme.other.barBorderRadius})`,
    '--mantine-sidebar-width': theme.other.sideBarWidth,
    '--mantine-card-border-radius': `var(--mantine-radius-${theme.other.cardBorderRadius})`,
    '--mantine-grid-border-radius': `var(--mantine-radius-${theme.other.gridBorderRadius})`
  },
  light: {},
  dark: {}
});

export default theme;
