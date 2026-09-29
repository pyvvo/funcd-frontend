import { PyColorsType } from '@/mantine.theme';
import { MantineColor, MantineTheme } from '@mantine/core';

// Series colors, in a fixed order, with a shade per color scheme. This order
// and these shades pass the dataviz palette checks (lightness band, chroma,
// color-blind and normal-vision separation, 3:1 contrast) on the chart card:
// white in light mode, gray-9 in dark mode.
const seriesColors: Record<'light' | 'dark', [MantineColor, number][]> = {
  light: [
    ['primary', 9],
    ['teal', 7],
    ['orange', 7],
    ['cyan', 7],
    ['lime', 9],
    ['pink', 9]
  ],
  dark: [
    ['primary', 9],
    ['teal', 7],
    ['orange', 8],
    ['cyan', 7],
    ['lime', 8],
    ['pink', 7]
  ]
};

const compactNumber = new Intl.NumberFormat(undefined, {
  notation: 'compact',
  maximumFractionDigits: 1
});

const getShade = (theme: MantineTheme, colorScheme: 'light' | 'dark') =>
  typeof theme.primaryShade === 'number'
    ? theme.primaryShade
    : theme.primaryShade[colorScheme];

export const getPaletteColor = (
  theme: MantineTheme,
  color: PyColorsType,
  colorScheme: 'light' | 'dark'
) => theme.colors[color][getShade(theme, colorScheme)];

export const getSeriesColors = (
  theme: MantineTheme,
  colorScheme: 'light' | 'dark'
) =>
  seriesColors[colorScheme].map(([color, shade]) => theme.colors[color][shade]);

/** The chart card's background, used for the gaps and rings between marks */
export const getSurfaceColor = (
  theme: MantineTheme,
  colorScheme: 'light' | 'dark'
) => (colorScheme === 'dark' ? theme.colors.gray[9] : theme.white);

export const getChartTheme = (
  theme: MantineTheme,
  colorScheme: 'light' | 'dark'
) => {
  const isDark = colorScheme === 'dark';
  const textColor = isDark ? theme.colors.dark[0] : theme.colors.gray[7];
  const mutedColor = isDark ? theme.colors.dark[2] : theme.colors.gray[6];
  const axisColor = isDark ? theme.colors.dark[4] : theme.colors.gray[3];
  const splitColor = isDark ? theme.colors.dark[5] : theme.colors.gray[2];
  // A category axis keeps a hairline baseline and a value axis only its
  // gridlines; neither draws ticks.
  const categoryAxis = {
    axisLine: { lineStyle: { color: axisColor } },
    axisTick: { show: false },
    axisLabel: { color: mutedColor },
    splitLine: { lineStyle: { color: [splitColor] } }
  };
  const valueAxis = {
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: {
      color: mutedColor,
      formatter: (value: number) => compactNumber.format(value)
    },
    splitLine: { lineStyle: { color: [splitColor] } }
  };

  return {
    darkMode: isDark,
    color: getSeriesColors(theme, colorScheme),
    backgroundColor: 'transparent',
    textStyle: { fontFamily: theme.fontFamily, color: textColor },
    title: { textStyle: { color: textColor } },
    legend: { textStyle: { color: textColor } },
    tooltip: {
      backgroundColor: isDark ? theme.colors.dark[6] : theme.white,
      borderWidth: 0,
      padding: [8, 12],
      textStyle: { color: textColor },
      extraCssText:
        'border-radius: 12px; box-shadow: -1px 1px 10px -1px rgba(0, 0, 0, 0.103);',
      axisPointer: {
        lineStyle: { color: axisColor, type: 'solid' },
        shadowStyle: {
          color: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.03)'
        }
      }
    },
    categoryAxis,
    valueAxis,
    timeAxis: categoryAxis,
    logAxis: valueAxis
  };
};
