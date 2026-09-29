import {
  ActionIcon,
  Button,
  createTheme,
  CSSVariablesResolver,
  MantineThemeOverride,
  rem,
  Tabs
} from '@mantine/core';
import CustomActionIcon from '../../ui/src/atoms/action-icon/action-icon.module.css';
import CustomTabs from '../../ui/src/molecules/navigation/tabs/tabs.module.css';
import CustomButton from './atoms/button/Button.module.css';

export type PyColorsType =
  | 'primary'
  | 'secondary'
  | 'info'
  | 'warning'
  | 'alert'
  | 'stone-cold';

export type PyVariantType = 'elevated' | 'filled' | 'secondary' | 'subtle';

const theme: MantineThemeOverride = createTheme({
  fontFamily: 'Roboto, sans-serif',
  colors: {
    primary: [
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
    ],
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
    ]
  },
  primaryColor: 'primary',
  primaryShade: 9,
  defaultRadius: 8,
  other: {
    headerOffset: rem(40),
    sideBarBorderRadius: rem(20),
    sideBarWidth: rem(60),
    bottomBarBorderRadius: rem(20),
    cardBorderRadius: rem(20),
    gridBorderRadius: rem(12)
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
        radius: 'lg'
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
    '--mantine-sidebar-border-radius': theme.other.sideBarBorderRadius,
    '--mantine-sidebar-width': theme.other.sideBarWidth,
    '--mantine-bottombar-border-radius': theme.other.bottomBarBorderRadius,
    '--mantine-card-border-radius': theme.other.cardBorderRadius,
    '--mantine-grid-border-radius': theme.other.gridBorderRadius
  },
  light: {},
  dark: {}
});

export default theme;
