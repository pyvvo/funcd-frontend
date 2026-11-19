import DynamicField from '@/reactive-form/form/dynamic-field';
import { IReactiveFieldMeta } from '@/reactive-form/form/types';
import { FormProps, JSONData } from '@/types';
import { Box, Stack } from '@mantine/core';
import LayoutGrid from '../dashboard-layout/layout-grid';
import LayoutGridItem from '../dashboard-layout/layout-grid-item';
import { IChartClickParams } from '../reactive-charts/types';
import ChartGroup from './chart-group';
import DynamicChart from './dynamic-chart';
import styles from './reactive-dashboard.module.css';
import { IReactiveChartMeta } from './types';

export interface IDashboardFilters<TFilterValues extends JSONData> {
  /** The bar's fields, as ReactiveForm takes them */
  meta: IReactiveFieldMeta<TFilterValues>[];
  /**
   * The form that holds the filters' values: the caller watches it and passes
   * the rows that the values keep as `data`
   */
  form: FormProps<TFilterValues>;
}

export interface IReactiveDashboard<
  TChartData extends JSONData,
  TFilterValues extends JSONData = JSONData
> {
  meta: IReactiveChartMeta<TChartData>[];
  data: TChartData;
  loading?: boolean;
  /** Height of one layout row, in pixels */
  rowHeight?: number;
  /** A bar of filters above the charts, which every chart follows */
  filters?: IDashboardFilters<TFilterValues>;
  onChartClick?: (params: IChartClickParams) => void;
}

const ReactiveDashboard = <
  TChartData extends JSONData,
  TFilterValues extends JSONData = JSONData
>(
  props: IReactiveDashboard<TChartData, TFilterValues>
) => {
  const { meta, data, loading, rowHeight, filters, onChartClick } = props;

  return (
    <Stack gap="xl">
      {filters && (
        <Box className={styles.filters} data-testid="dashboard-filters">
          {filters.meta
            .flatMap(({ fields }) => fields)
            .map((field) => (
              <Box key={field.fieldKey} className={styles.filter}>
                <DynamicField
                  field={field}
                  form={filters.form}
                  errors={filters.form.formState.errors}
                />
              </Box>
            ))}
        </Box>
      )}
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
