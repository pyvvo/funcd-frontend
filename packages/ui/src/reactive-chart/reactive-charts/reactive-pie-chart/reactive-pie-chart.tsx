import HMChart, { ECOption } from '@/molecules/hm-chart';
import {
  getPaletteColor,
  getSeriesColors,
  getSurfaceColor
} from '@/molecules/hm-chart/hm-chart.util';
import { useComputedColorScheme, useMantineTheme } from '@mantine/core';
import { PieChart } from 'echarts/charts';
import * as echarts from 'echarts/core';
import { ECElementEvent } from 'echarts/core';
import { FC, useCallback, useMemo } from 'react';
import { IReactiveChart } from '../types';
import { ChartContainer, mergeChartOptions, useChartRows } from '../utils';
import { PieChartCustomProps } from './types';

echarts.use([PieChart]);

const ReactivePieChart: FC<IReactiveChart<PieChartCustomProps>> = (props) => {
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

  const { hidden, nameKey, valueKey, donut, colors } = customProps;
  const theme = useMantineTheme();
  const colorScheme = useComputedColorScheme('light');
  const { rows, flatRows } = useChartRows({ data, dataKey });

  const option = useMemo(() => {
    const seriesColors = getSeriesColors(theme, colorScheme);
    const total = flatRows.reduce(
      (sum, row) => sum + (Number(row[valueKey]) || 0),
      0
    );
    const chartOption: ECOption = {
      dataset: { source: flatRows, dimensions: [nameKey, valueKey] },
      tooltip: { trigger: 'item' },
      legend: { top: 0, right: 0, icon: 'circle', itemWidth: 8, itemHeight: 8 },
      // A donut shows its total in the middle.
      title: donut
        ? {
            text: total.toLocaleString(),
            left: '50%',
            top: '55%',
            textAlign: 'center',
            textVerticalAlign: 'middle',
            textStyle: { fontSize: 22, fontWeight: 600 }
          }
        : undefined,
      series: [
        {
          type: 'pie',
          center: ['50%', '55%'],
          radius: donut ? ['50%', '75%'] : '75%',
          // The legend and the tooltip already name each slice.
          label: { show: false },
          itemStyle: {
            // Slices are split by a 2px gap in the card's color.
            borderColor: getSurfaceColor(theme, colorScheme),
            borderWidth: 2,
            borderRadius: 4,
            // A slice named in `colors` wears that palette, for a status.
            ...(colors && {
              color: ({
                name,
                dataIndex
              }: {
                name: string;
                dataIndex: number;
              }) =>
                colors[name]
                  ? getPaletteColor(theme, colors[name], colorScheme)
                  : seriesColors[dataIndex % seriesColors.length]
            })
          },
          encode: { itemName: nameKey, value: valueKey }
        }
      ]
    };

    return mergeChartOptions(chartOption, options);
  }, [flatRows, nameKey, valueKey, donut, colors, options, theme, colorScheme]);

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

export default ReactivePieChart;
