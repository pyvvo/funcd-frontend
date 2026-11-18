import HMChart, { ECOption } from '@/molecules/hm-chart';
import {
  getPaletteColor,
  getSurfaceColor
} from '@/molecules/hm-chart/hm-chart.util';
import { useComputedColorScheme, useMantineTheme } from '@mantine/core';
import { BarChart, BarSeriesOption } from 'echarts/charts';
import * as echarts from 'echarts/core';
import { ECElementEvent } from 'echarts/core';
import { FC, useCallback, useMemo } from 'react';
import { IChartSeries, IReactiveChart } from '../types';
import {
  ChartContainer,
  getChartAxisType,
  getFormatError,
  getValueAxisLabel,
  getValueFormatter,
  mergeChartOptions,
  useChartRows
} from '../utils';
import { getChartPivot } from './reactive-bar-chart.util';
import { BarChartCustomProps } from './types';

echarts.use([BarChart]);

const ReactiveBarChart: FC<IReactiveChart<BarChartCustomProps>> = (props) => {
  const {
    chartKey,
    dataKey,
    title,
    options,
    data,
    loading,
    onChartClick,
    customProps
  } = props;

  const { hidden, xKey, series, stacked, horizontal, splitBy, xValues } =
    customProps;
  const theme = useMantineTheme();
  const colorScheme = useComputedColorScheme('light');
  const { rows, flatRows } = useChartRows({ data, dataKey });
  const error =
    splitBy && series.length !== 1
      ? `A chart split by "${splitBy}" takes one series, not ${series.length}`
      : getFormatError(series.map(({ format }) => format));
  // `splitBy` and `xValues` draw sums per x value instead of the rows.
  const pivot = useMemo(
    () =>
      !error && (splitBy || xValues)
        ? getChartPivot({ rows, flatRows, xKey, series, splitBy, xValues })
        : undefined,
    [error, rows, flatRows, xKey, series, splitBy, xValues]
  );

  const option = useMemo(() => {
    // The error card replaces the chart.
    if (error) return {};
    const axisType = getChartAxisType(flatRows, xKey);
    // Bars sit on categories, even when the keys are numbers, and listed x
    // values stay categories even when they are dates.
    const categoryAxis = {
      type: axisType === 'value' || xValues ? ('category' as const) : axisType
    };
    const valueFormat = series[0]?.format;
    const valueAxis = {
      type: 'value' as const,
      ...(valueFormat && { axisLabel: getValueAxisLabel(valueFormat) })
    };
    // Bars round their data end only: the top of a column or the right end
    // of a horizontal bar, and in a stack only the last segment.
    const dataEnd = horizontal ? [0, 4, 4, 0] : [4, 4, 0, 0];
    const surface = getSurfaceColor(theme, colorScheme);
    const barSeries: IChartSeries[] = pivot ?? series;
    const chartOption: ECOption = {
      // A pivot's series carry their own [x value, sum] pairs, and the axis
      // collects its categories from them. Categories set on the axis would
      // outlive an update, since HMChart merges axes, and would turn the
      // numbers of a dataset's x values into category indexes.
      ...(!pivot && {
        dataset: {
          source: flatRows,
          dimensions: [xKey, ...series.map(({ key }) => key)]
        }
      }),
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      legend: {
        show: barSeries.length > 1,
        top: 0,
        right: 0,
        icon: 'roundRect',
        itemWidth: 10,
        itemHeight: 10
      },
      // ECharts keeps the axis labels inside the chart, so small margins are
      // enough; the top one leaves room for the legend.
      grid: {
        top: barSeries.length > 1 ? 36 : 16,
        right: 16,
        bottom: 16,
        left: 16
      },
      xAxis: horizontal ? valueAxis : categoryAxis,
      yAxis: horizontal ? categoryAxis : valueAxis,
      series: barSeries.map(
        ({ key, name, color, format }, index): BarSeriesOption => ({
          type: 'bar',
          name,
          stack: stacked ? 'total' : undefined,
          barMaxWidth: 24,
          ...(pivot
            ? {
                data: pivot[index].data,
                encode: horizontal ? { x: 1, y: 0 } : { x: 0, y: 1 }
              }
            : {
                encode: horizontal ? { x: key, y: xKey } : { x: xKey, y: key }
              }),
          itemStyle: {
            ...(color && { color: getPaletteColor(theme, color, colorScheme) }),
            borderRadius:
              !stacked || index === barSeries.length - 1 ? dataEnd : 0,
            // Stacked segments are split by a 2px gap in the card's color.
            ...(stacked && { borderColor: surface, borderWidth: 1 })
          },
          ...(format && {
            tooltip: { valueFormatter: getValueFormatter(format) }
          })
        })
      )
    };

    return mergeChartOptions(chartOption, options);
  }, [
    error,
    pivot,
    flatRows,
    xKey,
    xValues,
    series,
    stacked,
    horizontal,
    options,
    theme,
    colorScheme
  ]);

  const handleClick = useCallback(
    (event: ECElementEvent) => {
      if (onChartClick) {
        // A pivot's bar adds up rows: the click hands over the first one.
        const row = pivot
          ? pivot[event.seriesIndex ?? 0].rows[event.dataIndex]
          : rows[event.dataIndex];
        onChartClick({ chartKey, row, event });
      }
    },
    [chartKey, onChartClick, pivot, rows]
  );

  return (
    <ChartContainer
      chartKey={chartKey}
      title={title}
      hidden={hidden}
      loading={loading}
      isEmpty={flatRows.length === 0}
      error={error}>
      <HMChart
        option={option}
        loading={loading}
        onClick={handleClick}
        style={{ height: '100%' }}
      />
    </ChartContainer>
  );
};

export default ReactiveBarChart;
