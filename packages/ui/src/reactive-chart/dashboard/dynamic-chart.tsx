import { JSONData } from '@/types';
import { getValuePath } from '@/utils';
import { FC, useMemo } from 'react';
import ChartBuilder from '../chart-builder';
import { IChartClickParams } from '../reactive-charts/types';
import { ChartContainer } from '../reactive-charts/utils';
import { IDynamicChartMeta } from './types';

interface IDynamicChart {
  chart: IDynamicChartMeta;
  data: JSONData;
  loading?: boolean;
  onChartClick?: (params: IChartClickParams) => void;
}

const DynamicChart: FC<IDynamicChart> = (props) => {
  const { chart, data, loading, onChartClick } = props;
  const { chartKey, dataKey, title, type, options, customProps } = chart;
  const RenderChart = useMemo(() => ChartBuilder.getChart(type), [type]);

  // A saved meta can be stale: check what a widget can't draw before
  // rendering it, and show an error card instead of crashing the dashboard.
  let error: string | undefined;
  if (!RenderChart) {
    error = `Unknown chart type "${type}"`;
  } else if (!customProps) {
    error = 'Missing custom props';
  } else if (
    !loading &&
    !Array.isArray(getValuePath(dataKey.split('.'), data))
  ) {
    error = `No rows at "${dataKey}"`;
  }

  if (!RenderChart || error) {
    return <ChartContainer chartKey={chartKey} title={title} error={error} />;
  }

  return (
    <RenderChart
      chartKey={chartKey}
      dataKey={dataKey}
      title={title}
      options={options}
      data={data}
      loading={loading}
      onChartClick={onChartClick}
      customProps={customProps}
    />
  );
};

export default DynamicChart;
