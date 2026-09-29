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
import { IReactiveChart } from '../types';
import {
  ChartContainer,
  getChartAxisType,
  mergeChartOptions,
  useChartRows
} from '../utils';
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

  const { hidden, xKey, series, stacked, horizontal } = customProps;
  const theme = useMantineTheme();
  const colorScheme = useComputedColorScheme('light');
  const { rows, flatRows } = useChartRows({ data, dataKey });

  const option = useMemo(() => {
    const axisType = getChartAxisType(flatRows, xKey);
    // Bars sit on categories, even when the keys are numbers.
    const categoryAxis = {
      type: axisType === 'value' ? ('category' as const) : axisType
    };
    const valueAxis = { type: 'value' as const };
    // Bars round their data end only: the top of a column or the right end
    // of a horizontal bar, and in a stack only the last segment.
    const dataEnd = horizontal ? [0, 4, 4, 0] : [4, 4, 0, 0];
    const surface = getSurfaceColor(theme, colorScheme);
    const chartOption: ECOption = {
      dataset: {
        source: flatRows,
        dimensions: [xKey, ...series.map(({ key }) => key)]
      },
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      legend: {
        show: series.length > 1,
        top: 0,
        right: 0,
        icon: 'roundRect',
        itemWidth: 10,
        itemHeight: 10
      },
      // ECharts keeps the axis labels inside the chart, so small margins are
      // enough; the top one leaves room for the legend.
      grid: {
        top: series.length > 1 ? 36 : 16,
        right: 16,
        bottom: 16,
        left: 16
      },
      xAxis: horizontal ? valueAxis : categoryAxis,
      yAxis: horizontal ? categoryAxis : valueAxis,
      series: series.map(
        ({ key, name, color }, index): BarSeriesOption => ({
          type: 'bar',
          name,
          stack: stacked ? 'total' : undefined,
          barMaxWidth: 24,
          encode: horizontal ? { x: key, y: xKey } : { x: xKey, y: key },
          itemStyle: {
            ...(color && { color: getPaletteColor(theme, color, colorScheme) }),
            borderRadius: !stacked || index === series.length - 1 ? dataEnd : 0,
            // Stacked segments are split by a 2px gap in the card's color.
            ...(stacked && { borderColor: surface, borderWidth: 1 })
          }
        })
      )
    };

    return mergeChartOptions(chartOption, options);
  }, [
    flatRows,
    xKey,
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
        onChartClick({ chartKey, row: rows[event.dataIndex], event });
      }
    },
    [chartKey, onChartClick, rows]
  );

  return (
    <ChartContainer
      chartKey={chartKey}
      title={title}
      hidden={hidden}
      loading={loading}
      isEmpty={flatRows.length === 0}>
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
