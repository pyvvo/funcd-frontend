import { JSONData } from '@/types';
import { BarChartCustomProps } from '../reactive-bar-chart/types';
import { LineChartCustomProps } from '../reactive-line-chart/types';
import { PieChartCustomProps } from '../reactive-pie-chart/types';
import { CommonChartProps } from './reactive-chart-base';

export interface IChartCustomProps<TRow extends JSONData> {
  bar: CommonChartProps<BarChartCustomProps<TRow>>;
  line: CommonChartProps<LineChartCustomProps<TRow>>;
  pie: CommonChartProps<PieChartCustomProps<TRow>>;
}
