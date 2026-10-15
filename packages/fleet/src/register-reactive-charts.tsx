import {
  ChartBuilder,
  ReactiveBarChart,
  ReactiveLineChart,
  ReactivePieChart
} from '@funcd-dev/ui';

ChartBuilder.defineWidget({ name: 'bar', component: ReactiveBarChart });
ChartBuilder.defineWidget({ name: 'line', component: ReactiveLineChart });
ChartBuilder.defineWidget({ name: 'pie', component: ReactivePieChart });
