import { JSONData } from '@/types';
import { Stack } from '@mantine/core';
import LayoutGrid from '../dashboard-layout/layout-grid';
import LayoutGridItem from '../dashboard-layout/layout-grid-item';
import { IChartClickParams } from '../reactive-charts/types';
import ChartGroup from './chart-group';
import DynamicChart from './dynamic-chart';
import { IReactiveChartMeta } from './types';

export interface IReactiveDashboard<TChartData extends JSONData> {
  meta: IReactiveChartMeta<TChartData>[];
  data: TChartData;
  loading?: boolean;
  /** Height of one layout row, in pixels */
  rowHeight?: number;
  onChartClick?: (params: IChartClickParams) => void;
}

const ReactiveDashboard = <TChartData extends JSONData>(
  props: IReactiveDashboard<TChartData>
) => {
  const { meta, data, loading, rowHeight, onChartClick } = props;

  return (
    <Stack gap="xl">
      {meta.map(({ groupKey, name, charts }) => (
        <ChartGroup
          key={groupKey}
          name={name}
          component={<LayoutGrid rowHeight={rowHeight} />}>
          {charts.map((chart) => (
            <LayoutGridItem key={chart.chartKey} layout={chart.layout}>
              <DynamicChart
                chart={chart}
                data={data}
                loading={loading}
                onChartClick={onChartClick}
              />
            </LayoutGridItem>
          ))}
        </ChartGroup>
      ))}
    </Stack>
  );
};

export default ReactiveDashboard;
