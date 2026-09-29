import HMChart, { ECOption } from '@/molecules/hm-chart';
import {
  getPaletteColor,
  getSurfaceColor
} from '@/molecules/hm-chart/hm-chart.util';
import { useComputedColorScheme, useMantineTheme } from '@mantine/core';
import { LineChart, LineSeriesOption } from 'echarts/charts';
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
import { LineChartCustomProps } from './types';

echarts.use([LineChart]);

const ReactiveLineChart: FC<IReactiveChart<LineChartCustomProps>> = (props) => {
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

  const { hidden, xKey, series, smooth, area } = customProps;
  const theme = useMantineTheme();
  const colorScheme = useComputedColorScheme('light');
  const { rows, flatRows } = useChartRows({ data, dataKey });

  const option = useMemo(() => {
    const chartOption: ECOption = {
      dataset: {
        source: flatRows,
        dimensions: [xKey, ...series.map(({ key }) => key)]
      },
      tooltip: { trigger: 'axis', axisPointer: { type: 'line' } },
      legend: { show: series.length > 1, top: 0, right: 0 },
      // ECharts keeps the axis labels inside the chart, so small margins are
      // enough; the top one leaves room for the legend.
      grid: {
        top: series.length > 1 ? 36 : 16,
        right: 16,
        bottom: 16,
        left: 16
      },
      xAxis: { type: getChartAxisType(flatRows, xKey) },
      yAxis: { type: 'value' },
      series: series.map(
        ({ key, name, color }): LineSeriesOption => ({
          type: 'line',
          name,
          smooth,
          // Points show on hover only, as 8px dots with a ring in the card's
          // color.
          showSymbol: false,
          symbol: 'circle',
          symbolSize: 8,
          lineStyle: { width: 2, cap: 'round', join: 'round' },
          // A light wash under the line, not a solid block.
          areaStyle: area ? { opacity: 0.1 } : undefined,
          encode: { x: xKey, y: key },
          itemStyle: {
            ...(color && { color: getPaletteColor(theme, color, colorScheme) }),
            borderColor: getSurfaceColor(theme, colorScheme),
            borderWidth: 2
          }
        })
      )
    };

    return mergeChartOptions(chartOption, options);
  }, [flatRows, xKey, series, smooth, area, options, theme, colorScheme]);

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

export default ReactiveLineChart;
