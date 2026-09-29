/* oxlint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/require-default-props */
import { useComputedColorScheme, useMantineTheme } from '@mantine/core';
import {
  BarChart,
  // The series types are defined with the SeriesOption suffix
  BarSeriesOption,
  LineChart,
  LineSeriesOption,
  PieChart,
  PieSeriesOption
} from 'echarts/charts';
import {
  // Dataset
  DatasetComponent,
  DatasetComponentOption,
  GridComponent,
  GridComponentOption,
  LegendComponent,
  LegendComponentOption,
  TitleComponent,
  // The component types are defined with the suffix ComponentOption
  TitleComponentOption,
  TooltipComponent,
  TooltipComponentOption,
  // Built-in transform (filter, sort)
  TransformComponent
} from 'echarts/components';
import * as echarts from 'echarts/core';
import {
  ECElementEvent,
  SetOptionOpts,
  getInstanceByDom,
  init
} from 'echarts/core';
import { LabelLayout, UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import { CSSProperties, FC, useEffect, useMemo, useRef } from 'react';
import { getChartTheme } from './hm-chart.util';

// Combine an Option type with only required components and charts via ComposeOption
export type ECOption = echarts.ComposeOption<
  | BarSeriesOption
  | LineSeriesOption
  | TitleComponentOption
  | TooltipComponentOption
  | GridComponentOption
  | DatasetComponentOption
  | LegendComponentOption
  | PieSeriesOption
>;

// Register the required components
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  PieChart,
  DatasetComponent,
  TransformComponent,
  BarChart,
  LineChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer
]);

// Replace series and datasets on update, so a series removed from `option`
// disappears from the chart instead of being merged back.
const defaultSettings: SetOptionOpts = { replaceMerge: ['series', 'dataset'] };

export interface IHMChart {
  option: ECOption;
  style?: CSSProperties;
  settings?: SetOptionOpts;
  loading?: boolean;
  /** Forces a color scheme; by default the chart follows Mantine's */
  theme?: 'light' | 'dark';
  onClick?: (params: ECElementEvent) => void;
}

// @see https://dev.to/manufac/using-apache-echarts-with-react-and-typescript-353k
/**
 * Renders an ECharts `option`. The chart follows the size of its container
 * and the Mantine theme, including the color scheme.
 */
const HMChart: FC<IHMChart> = (props) => {
  const {
    option,
    style,
    settings = defaultSettings,
    loading,
    theme,
    onClick
  } = props;
  const chartRef = useRef<HTMLDivElement>(null);
  const mantineTheme = useMantineTheme();
  const computedColorScheme = useComputedColorScheme('light');
  const colorScheme = theme ?? computedColorScheme;

  const chartTheme = useMemo(
    () => getChartTheme(mantineTheme, colorScheme),
    [mantineTheme, colorScheme]
  );

  useEffect(() => {
    if (chartRef.current === null) return;
    const container = chartRef.current;
    const chart = init(container);
    const resizeObserver = new ResizeObserver(() => chart.resize());
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      chart.dispose();
    };
  }, []);

  useEffect(() => {
    if (chartRef.current === null) return;
    const chart = getInstanceByDom(chartRef.current);
    chart?.setOption(option, settings);
  }, [option, settings]);

  // Declared after the option effect on purpose: ECharts ignores `setTheme`
  // until the chart has received an option.
  useEffect(() => {
    if (chartRef.current === null) return;
    const chart = getInstanceByDom(chartRef.current);
    chart?.setTheme(chartTheme);
  }, [chartTheme]);

  useEffect(() => {
    if (chartRef.current === null) return;
    const chart = getInstanceByDom(chartRef.current);
    if (!chart) return;
    if (loading) {
      chart.showLoading();
    } else {
      chart.hideLoading();
    }
  }, [loading]);

  useEffect(() => {
    if (chartRef.current === null || !onClick) return;
    const chart = getInstanceByDom(chartRef.current);
    if (!chart) return;
    chart.on('click', onClick);

    return () => {
      // On unmount the chart is already disposed by the effect above.
      if (!chart.isDisposed()) chart.off('click', onClick);
    };
  }, [onClick]);

  return (
    <div ref={chartRef} style={{ width: '100%', height: '100px', ...style }} />
  );
};

export default HMChart;
