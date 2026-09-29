import {
  ChartBuilder,
  IChartClickParams,
  IReactiveChartMeta,
  IReactiveDashboard,
  ReactiveBarChart,
  ReactiveLineChart,
  ReactivePieChart
} from '@/reactive-chart';
import { JSONData } from '@/types';
import { Flex, JsonInput } from '@mantine/core';
import {
  Children,
  cloneElement,
  FC,
  isValidElement,
  ReactElement,
  useState
} from 'react';
import { IDecoratorParams } from './common';

ChartBuilder.defineWidget({ name: 'bar', component: ReactiveBarChart });
ChartBuilder.defineWidget({ name: 'line', component: ReactiveLineChart });
ChartBuilder.defineWidget({ name: 'pie', component: ReactivePieChart });

type ReactiveDashboardChildren = ReactElement<IReactiveDashboard<JSONData>>;

interface IReactiveDashboardWrapper {
  meta: IReactiveChartMeta<JSONData>[];
  data: JSONData;
  children?: ReactiveDashboardChildren;
}

const ReactiveDashboardWrapper: FC<IReactiveDashboardWrapper> = (props) => {
  const { children, meta, data } = props;
  const [value, setValue] = useState('');

  const handleChartClick = (params: IChartClickParams) => {
    const { chartKey, row } = params;
    setValue(JSON.stringify({ chartKey, row }));
  };

  const modifiedChildren =
    children &&
    Children.map<any, any>(children, (child) => {
      if (isValidElement(child)) {
        return cloneElement(child as any, {
          args: {
            meta,
            data,
            onChartClick: handleChartClick
          }
        });
      }
      return child;
    });

  return (
    <Flex direction="column" gap="md">
      {modifiedChildren}
      <JsonInput
        label="Clicked row"
        placeholder="Click a bar, a point or a slice"
        data-testid="chart-result"
        formatOnBlur
        autosize
        minRows={4}
        value={value}
        onChange={() => {}}
      />
    </Flex>
  );
};

export const ReactiveDashboardDecorator =
  (data: JSONData) =>
  (Story: IDecoratorParams['Story'], props: IDecoratorParams['props']) => {
    const {
      args: { meta }
    } = props;

    return (
      <ReactiveDashboardWrapper
        meta={meta as IReactiveChartMeta<JSONData>[]}
        data={data}>
        <Story />
      </ReactiveDashboardWrapper>
    );
  };
