import { ElementType, FunctionComponent } from 'react';
import { ChartType, IReactiveChart } from './reactive-charts/types';

type ChartMapType = Record<string, ElementType<IReactiveChart<any>>>;

const chartMap: ChartMapType = {};

// Unlike FormBuilder.getField, this doesn't throw: a saved meta can name a
// chart type the app no longer registers, and the dashboard then shows an
// error card in that chart's place.
function getChart(chart: string) {
  return chartMap[chart] as ElementType<IReactiveChart<any>> | undefined;
}

interface IDefineComponent {
  name: ChartType;
  component: FunctionComponent<IReactiveChart<any>>;
}

const defineWidget = (params: IDefineComponent) => {
  const { name, component: ReactiveChart } = params;

  if (chartMap[name]) return;

  chartMap[name] = ReactiveChart;
};

export default {
  chartMap,
  defineWidget,
  getChart
};
