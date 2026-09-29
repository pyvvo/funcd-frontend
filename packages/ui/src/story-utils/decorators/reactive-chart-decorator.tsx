import { IChartClickParams, IReactiveChart } from '@/reactive-chart';
import { JSONData } from '@/types';
import { Box, Flex, JsonInput } from '@mantine/core';
import {
  Children,
  cloneElement,
  FC,
  isValidElement,
  ReactElement,
  useState
} from 'react';
import { IDecoratorParams } from './common';

type ReactiveChart = ReactElement<IReactiveChart<JSONData>>;

interface IReactiveChartWrapper {
  chart: JSONData;
  data: JSONData;
  children?: ReactiveChart;
}

const ReactiveChartWrapper: FC<IReactiveChartWrapper> = (props) => {
  const { children, chart, data } = props;
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
            ...chart,
            data,
            onChartClick: handleChartClick
          }
        });
      }
      return child;
    });

  return (
    <Flex direction="column" gap="md" style={{ minWidth: '400px' }}>
      <Box h={300}>{modifiedChildren}</Box>
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

export const ReactiveChartDecorator =
  (data: JSONData) =>
  (Story: IDecoratorParams['Story'], props: IDecoratorParams['props']) => {
    const { args } = props;
    return (
      <ReactiveChartWrapper chart={args} data={data}>
        <Story />
      </ReactiveChartWrapper>
    );
  };
